import { Router } from 'express';
import { prisma } from '../db.js';
import { categorySnapshot, hasChanges, writeAudit } from '../lib/audit.js';
import { HttpError, notFound } from '../lib/http-error.js';
import { categoryInput, idParams, reorderInput } from '../lib/schemas.js';
import { itemsRouter } from './admin-items.js';

const notDeleted = { deletedAt: null };

async function findCategory(tx, id) {
  const category = await tx.serviceCategory.findFirst({ where: { id, ...notDeleted } });
  if (!category) throw notFound('Category');
  return category;
}

export function categoriesRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const categories = await prisma.serviceCategory.findMany({
      where: notDeleted,
      orderBy: { sortOrder: 'asc' },
      include: { items: { where: notDeleted, orderBy: { sortOrder: 'asc' } } },
    });
    res.json({ categories });
  });

  router.post('/', async (req, res) => {
    const data = categoryInput.parse(req.body ?? {});
    const category = await prisma.$transaction(async (tx) => {
      const { _max } = await tx.serviceCategory.aggregate({ _max: { sortOrder: true } });
      const created = await tx.serviceCategory.create({ data: { ...data, sortOrder: (_max.sortOrder ?? -1) + 1 } });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'CREATE',
        entityType: 'ServiceCategory',
        entityId: created.id,
        after: categorySnapshot(created),
      });
      return created;
    });
    res.status(201).json({ category: { ...category, items: [] } });
  });

  // Registered before /:id so "reorder" is not read as an id.
  router.patch('/reorder', async (req, res) => {
    const { ids } = reorderInput.parse(req.body ?? {});
    await prisma.$transaction(async (tx) => {
      const current = await tx.serviceCategory.findMany({ where: notDeleted, orderBy: { sortOrder: 'asc' } });
      const sameSet = ids.length === current.length && new Set(ids).size === ids.length;
      if (!sameSet || !current.every((category) => ids.includes(category.id))) {
        throw new HttpError(400, 'The order must list every category exactly once. Please reload and try again.');
      }
      const byId = new Map(current.map((category) => [category.id, category]));
      for (const [index, id] of ids.entries()) {
        if (byId.get(id).sortOrder !== index) {
          await tx.serviceCategory.update({ where: { id }, data: { sortOrder: index } });
        }
      }
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'REORDER',
        entityType: 'ServiceCategory',
        entityId: null,
        before: { order: current.map(({ id, title }) => ({ id, title })) },
        after: { order: ids.map((id) => ({ id, title: byId.get(id).title })) },
      });
    });
    res.json({ ok: true });
  });

  router.put('/:id', async (req, res) => {
    const { id } = idParams.parse(req.params);
    const data = categoryInput.parse(req.body ?? {});
    const category = await prisma.$transaction(async (tx) => {
      const existing = await findCategory(tx, id);
      const before = categorySnapshot(existing);
      if (!hasChanges(before, data)) return existing;
      const updated = await tx.serviceCategory.update({ where: { id }, data });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'UPDATE',
        entityType: 'ServiceCategory',
        entityId: id,
        before,
        after: categorySnapshot(updated),
      });
      return updated;
    });
    res.json({ category });
  });

  // Soft delete: the row stays for the audit trail but leaves the site and the admin list.
  router.delete('/:id', async (req, res) => {
    const { id } = idParams.parse(req.params);
    await prisma.$transaction(async (tx) => {
      const existing = await findCategory(tx, id);
      const deleted = await tx.serviceCategory.update({
        where: { id },
        data: { isVisible: false, deletedAt: new Date() },
      });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'DELETE',
        entityType: 'ServiceCategory',
        entityId: id,
        before: categorySnapshot(existing),
        after: categorySnapshot(deleted),
      });
    });
    res.status(204).end();
  });

  router.use('/:id/items', itemsRouter(findCategory));

  return router;
}
