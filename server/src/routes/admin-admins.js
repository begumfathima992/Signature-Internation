import { Router } from 'express';
import { prisma } from '../db.js';
import { writeAudit } from '../lib/audit.js';
import { HttpError, notFound } from '../lib/http-error.js';
import { LINK_HOURS, ensurePlaceFree, linkExpiry, newToken, placesUsed } from '../lib/invites.js';
import { adminStatusInput, idParams, inviteInput } from '../lib/schemas.js';

const pendingInvite = () => ({ type: 'INVITE', usedAt: null, revokedAt: null, expiresAt: { gt: new Date() } });

// Admins manage who else can log in: invitations, password reset links, and deactivating accounts.
export function adminsRouter(config) {
  const router = Router();

  router.get('/', async (req, res) => {
    const [admins, invites, used] = await Promise.all([
      prisma.admin.findMany({
        orderBy: { createdAt: 'asc' },
        select: { id: true, name: true, email: true, isActive: true, lastLoginAt: true, createdAt: true },
      }),
      prisma.adminInvite.findMany({
        where: pendingInvite(),
        orderBy: { createdAt: 'asc' },
        select: { id: true, name: true, email: true, expiresAt: true, createdAt: true },
      }),
      placesUsed(prisma),
    ]);
    res.json({ admins, invites, maxAdmins: config.maxAdmins, placesUsed: used, linkHours: LINK_HOURS });
  });

  // Creates an invitation and returns its one-time token, shown to the admin once to copy and send.
  // Inviting the same email again replaces the earlier link.
  router.post('/invites', async (req, res) => {
    const { name, email } = inviteInput.parse(req.body ?? {});
    const { token, invite } = await prisma.$transaction(async (tx) => {
      const existing = await tx.admin.findUnique({ where: { email } });
      if (existing) {
        throw new HttpError(
          409,
          existing.isActive
            ? 'This email already has an admin account.'
            : 'This email has a deactivated account. Reactivate it instead.',
        );
      }
      await tx.adminInvite.updateMany({ where: { ...pendingInvite(), email }, data: { revokedAt: new Date() } });
      await ensurePlaceFree(tx, config.maxAdmins);

      const { token, tokenHash } = newToken();
      const invite = await tx.adminInvite.create({
        data: { type: 'INVITE', name, email, tokenHash, createdById: req.admin.id, expiresAt: linkExpiry() },
      });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'INVITE',
        entityType: 'Admin',
        entityId: invite.id,
        after: { name, email, expiresAt: invite.expiresAt },
      });
      return { token, invite };
    });
    res.status(201).json({ token, invite: { id: invite.id, name, email, expiresAt: invite.expiresAt } });
  });

  router.delete('/invites/:id', async (req, res) => {
    const { id } = idParams.parse(req.params);
    await prisma.$transaction(async (tx) => {
      const invite = await tx.adminInvite.findFirst({ where: { id, ...pendingInvite() } });
      if (!invite) throw notFound('Invitation');
      await tx.adminInvite.update({ where: { id }, data: { revokedAt: new Date() } });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'REVOKE_INVITE',
        entityType: 'Admin',
        entityId: id,
        before: { name: invite.name, email: invite.email },
      });
    });
    res.status(204).end();
  });

  // A link that lets an admin choose a new password. Any earlier reset link for them stops working.
  router.post('/:id/reset-link', async (req, res) => {
    const { id } = idParams.parse(req.params);
    const { token, link } = await prisma.$transaction(async (tx) => {
      const admin = await tx.admin.findUnique({ where: { id } });
      if (!admin) throw notFound('Admin');
      if (!admin.isActive) throw new HttpError(409, 'Reactivate this account before resetting its password.');
      await tx.adminInvite.updateMany({
        where: { type: 'RESET', adminId: id, usedAt: null, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      const { token, tokenHash } = newToken();
      const link = await tx.adminInvite.create({
        data: {
          type: 'RESET',
          name: admin.name,
          email: admin.email,
          adminId: id,
          tokenHash,
          createdById: req.admin.id,
          expiresAt: linkExpiry(),
        },
      });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'RESET_LINK',
        entityType: 'Admin',
        entityId: id,
        after: { name: admin.name, email: admin.email, expiresAt: link.expiresAt },
      });
      return { token, link };
    });
    res.status(201).json({ token, name: link.name, email: link.email, expiresAt: link.expiresAt });
  });

  // Deactivate or reactivate an account. Deactivation takes effect on the person's next request.
  router.patch('/:id', async (req, res) => {
    const { id } = idParams.parse(req.params);
    const { isActive } = adminStatusInput.parse(req.body ?? {});
    if (id === req.admin.id && !isActive) throw new HttpError(400, 'You cannot deactivate your own account.');

    const admin = await prisma.$transaction(async (tx) => {
      const existing = await tx.admin.findUnique({ where: { id } });
      if (!existing) throw notFound('Admin');
      if (existing.isActive === isActive) return existing;
      if (isActive) await ensurePlaceFree(tx, config.maxAdmins);
      const updated = await tx.admin.update({ where: { id }, data: { isActive } });
      if (!isActive) {
        // A deactivated admin's reset links stop working too.
        await tx.adminInvite.updateMany({
          where: { type: 'RESET', adminId: id, usedAt: null, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'UPDATE',
        entityType: 'Admin',
        entityId: id,
        before: { name: existing.name, email: existing.email, isActive: existing.isActive },
        after: { name: updated.name, email: updated.email, isActive: updated.isActive },
      });
      return updated;
    });
    const { id: adminId, name, email, lastLoginAt, createdAt } = admin;
    res.json({ admin: { id: adminId, name, email, isActive: admin.isActive, lastLoginAt, createdAt } });
  });

  return router;
}
