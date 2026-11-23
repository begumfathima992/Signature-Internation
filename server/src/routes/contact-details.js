import { readFileSync } from 'node:fs';
import { Router } from 'express';
import { prisma } from '../db.js';
import { hasChanges, writeAudit } from '../lib/audit.js';
import { contactInput } from '../lib/schemas.js';

// Used until an admin saves the details for the first time (and by the seed).
const DEFAULTS = JSON.parse(readFileSync(new URL('../../prisma/contact-data.json', import.meta.url), 'utf8'));

const FIELDS = ['email', 'phone', 'whatsapp', 'address', 'hours'];
const snapshot = (details) => Object.fromEntries(FIELDS.map((field) => [field, details[field]]));

async function readDetails(tx) {
  const row = await tx.contactDetails.findUnique({ where: { id: 1 } });
  return row ? snapshot(row) : { ...DEFAULTS };
}

// Public: the details shown on the website.
export function publicContactRouter() {
  const router = Router();
  router.get('/', async (req, res) => {
    // no-cache: browsers check for new details on every page load, so admin changes show at once.
    res.set('Cache-Control', 'no-cache');
    res.json({ contact: await readDetails(prisma) });
  });
  return router;
}

// Admin: read and update the details. Every change is logged with the old and new values.
export function adminContactRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    res.json({ contact: await readDetails(prisma) });
  });

  router.put('/', async (req, res) => {
    const data = contactInput.parse(req.body ?? {});
    const contact = await prisma.$transaction(async (tx) => {
      const before = await readDetails(tx);
      if (!hasChanges(before, data)) return before;
      const saved = await tx.contactDetails.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'UPDATE',
        entityType: 'ContactDetails',
        entityId: '1',
        before,
        after: snapshot(saved),
      });
      return snapshot(saved);
    });
    res.json({ contact });
  });

  return router;
}
