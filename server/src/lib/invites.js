import { createHash, randomBytes } from 'node:crypto';
import { HttpError } from './http-error.js';

export const LINK_HOURS = 48;

// A random token for the link, and the hash that is stored instead of it.
export function newToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashToken(token) };
}

export const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export const linkExpiry = () => new Date(Date.now() + LINK_HOURS * 60 * 60 * 1000);

// Active admins plus invitations that can still be accepted both take up a place.
export async function placesUsed(tx) {
  const [admins, invites] = await Promise.all([
    tx.admin.count({ where: { isActive: true } }),
    tx.adminInvite.count({
      where: { type: 'INVITE', usedAt: null, revokedAt: null, expiresAt: { gt: new Date() } },
    }),
  ]);
  return admins + invites;
}

export async function ensurePlaceFree(tx, maxAdmins) {
  if ((await placesUsed(tx)) >= maxAdmins) {
    throw new HttpError(
      409,
      `The site allows ${maxAdmins} admins and all places are taken. Deactivate an admin or cancel an invitation first.`,
    );
  }
}

// The link a token belongs to, if it can still be used.
export async function findUsableLink(tx, token) {
  const link = await tx.adminInvite.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!link || link.usedAt || link.revokedAt || link.expiresAt <= new Date()) {
    throw new HttpError(410, 'This link has expired or has already been used. Please ask an admin for a new one.');
  }
  return link;
}
