import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { HttpError } from '../lib/http-error.js';

export const COOKIE_NAME = 'sis_admin';
export const SESSION_HOURS = 8;

export function cookieOptions(config) {
  return {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'strict',
    path: '/',
  };
}

export function signSession(admin, config) {
  return jwt.sign({ sub: admin.id }, config.jwtSecret, { expiresIn: `${SESSION_HOURS}h`, algorithm: 'HS256' });
}

// Returns the logged-in admin for this request, or null. The admin is re-read from the database
// each time, so deactivating an account takes effect straight away.
export async function readSession(req, config) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    const { sub } = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
    const admin = await prisma.admin.findUnique({ where: { id: sub } });
    return admin?.isActive ? admin : null;
  } catch {
    return null;
  }
}

export function requireAdmin(config) {
  return async (req, res, next) => {
    const admin = await readSession(req, config);
    if (!admin) throw new HttpError(401, 'Please log in.');
    req.admin = admin;
    next();
  };
}

export const publicAdmin = ({ id, name, email, role, lastLoginAt }) => ({ id, name, email, role, lastLoginAt });
