import bcrypt from 'bcrypt';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { prisma } from '../db.js';
import { writeAudit } from '../lib/audit.js';
import { HttpError } from '../lib/http-error.js';
import { findUsableLink } from '../lib/invites.js';
import { acceptInput, loginInput, tokenQuery } from '../lib/schemas.js';
import {
  COOKIE_NAME,
  SESSION_HOURS,
  cookieOptions,
  publicAdmin,
  readSession,
  signSession,
} from '../middleware/auth.js';

const INVALID_LOGIN = 'Invalid email or password';
const BCRYPT_COST = 12;

// Compared against when the email is unknown, so every failed login takes about the same time
// and response timing does not reveal which emails belong to an admin.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

export function authRouter(config) {
  const router = Router();

  // 5 failed attempts per 15 minutes per IP. Successful logins are not counted.
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many login attempts. Please wait 15 minutes and try again.' },
  });

  // 5 attempts per 15 minutes per IP, successful or not, for opening invitation and reset links.
  const linkLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please wait 15 minutes and try again.' },
  });

  // What an invitation or reset link is for, so the page can greet the person by name.
  router.get('/link', async (req, res) => {
    const { token } = tokenQuery.parse(req.query);
    const link = await findUsableLink(prisma, token);
    res.set('Cache-Control', 'no-store');
    res.json({ type: link.type, name: link.name, email: link.email, expiresAt: link.expiresAt });
  });

  // Accepting an invitation creates the account; a reset link sets a new password. Either way the
  // person is logged in, and the link cannot be used again.
  router.post('/accept-link', linkLimiter, async (req, res) => {
    const { token, name, password } = acceptInput.parse(req.body ?? {});
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

    const admin = await prisma.$transaction(async (tx) => {
      const link = await findUsableLink(tx, token);
      // Marking the link used first means two requests with the same link cannot both succeed.
      const claimed = await tx.adminInvite.updateMany({
        where: { id: link.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      if (claimed.count !== 1) throw new HttpError(410, 'This link has already been used.');

      let account;
      if (link.type === 'INVITE') {
        if (await tx.admin.findUnique({ where: { email: link.email } })) {
          throw new HttpError(409, 'This email already has an admin account. Please log in instead.');
        }
        // The invitation already holds a place, so this cannot go over the limit.
        account = await tx.admin.create({
          data: { name: name ?? link.name, email: link.email, passwordHash, lastLoginAt: new Date() },
        });
        await writeAudit(tx, req, {
          admin: account,
          action: 'ACCEPT_INVITE',
          entityType: 'Admin',
          entityId: account.id,
          after: { name: account.name, email: account.email },
        });
      } else {
        account = await tx.admin.findUnique({ where: { id: link.adminId } });
        if (!account?.isActive) throw new HttpError(410, 'This account is no longer active.');
        account = await tx.admin.update({
          where: { id: account.id },
          data: { passwordHash, lastLoginAt: new Date() },
        });
        await writeAudit(tx, req, {
          admin: account,
          action: 'PASSWORD_RESET',
          entityType: 'Admin',
          entityId: account.id,
        });
      }
      await writeAudit(tx, req, { admin: account, action: 'LOGIN', entityType: 'Admin', entityId: account.id });
      return account;
    });

    res.cookie(COOKIE_NAME, signSession(admin, config), {
      ...cookieOptions(config),
      maxAge: SESSION_HOURS * 60 * 60 * 1000,
    });
    res.status(201).json({ admin: publicAdmin(admin) });
  });

  router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = loginInput.parse(req.body ?? {});
    const admin = await prisma.admin.findUnique({ where: { email } });
    const passwordOk = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

    if (!admin || !passwordOk || !admin.isActive) {
      await writeAudit(prisma, req, {
        admin: admin ?? null,
        adminEmail: email.slice(0, 254),
        action: 'LOGIN_FAILED',
        entityType: 'Admin',
        entityId: admin?.id ?? null,
      });
      throw new HttpError(401, INVALID_LOGIN);
    }

    const updated = await prisma.$transaction(async (tx) => {
      const saved = await tx.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
      await writeAudit(tx, req, { admin, action: 'LOGIN', entityType: 'Admin', entityId: admin.id });
      return saved;
    });

    res.cookie(COOKIE_NAME, signSession(admin, config), {
      ...cookieOptions(config),
      maxAge: SESSION_HOURS * 60 * 60 * 1000,
    });
    res.json({ admin: publicAdmin(updated) });
  });

  router.post('/logout', async (req, res) => {
    const admin = await readSession(req, config);
    if (admin) await writeAudit(prisma, req, { admin, action: 'LOGOUT', entityType: 'Admin', entityId: admin.id });
    res.clearCookie(COOKIE_NAME, cookieOptions(config));
    res.status(204).end();
  });

  // Answers 200 with admin: null when nobody is logged in, so public pages can check without a console error.
  router.get('/me', async (req, res) => {
    const admin = await readSession(req, config);
    res.set('Cache-Control', 'no-store');
    res.json({ admin: admin ? publicAdmin(admin) : null });
  });

  return router;
}
