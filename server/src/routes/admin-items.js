import { Router } from 'express';
import { prisma } from '../db.js';
import { hasChanges, itemSnapshot, writeAudit } from '../lib/audit.js';
import { HttpError, notFound } from '../lib/http-error.js';
import { idParams, itemInput, itemParams, reorderInput } from '../lib/schemas.js';

const notDeleted = { deletedAt: null };

async function findItem(tx, categoryId, itemId) {
  const item = await tx.serviceItem.findFirst({ where: { id: itemId, categoryId, ...notDeleted } });
  if (!item) throw notFound('Item');
  return item;
}

// Items of one category, mounted at /api/admin/categories/:id/items.
export function itemsRouter(findCategory) {
  const router = Router({ mergeParams: true });

  router.get('/', async (req, res) => {
    const { id } = idParams.parse(req.params);
    await findCategory(prisma, id);
    const items = await prisma.serviceItem.findMany({
      where: { categoryId: id, ...notDeleted },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ items });
  });

  router.post('/', async (req, res) => {
    const { id } = idParams.parse(req.params);
    const data = itemInput.parse(req.body ?? {});
    const item = await prisma.$transaction(async (tx) => {
      const category = await findCategory(tx, id);
      const { _max } = await tx.serviceItem.aggregate({ where: { categoryId: id }, _max: { sortOrder: true } });
      const created = await tx.serviceItem.create({
        data: { ...data, categoryId: id, sortOrder: (_max.sortOrder ?? -1) + 1 },
      });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'CREATE',
        entityType: 'ServiceItem',
        entityId: created.id,
        after: itemSnapshot(created, category),
      });
      return created;
    });
    res.status(201).json({ item });
  });

  router.patch('/reorder', async (req, res) => {
    const { id } = idParams.parse(req.params);
    const { ids } = reorderInput.parse(req.body ?? {});
    await prisma.$transaction(async (tx) => {
      const category = await findCategory(tx, id);
      const current = await tx.serviceItem.findMany({
        where: { categoryId: id, ...notDeleted },
        orderBy: { sortOrder: 'asc' },
      });
      const sameSet = ids.length === current.length && new Set(ids).size === ids.length;
      if (!sameSet || !current.every((item) => ids.includes(item.id))) {
        throw new HttpError(400, 'The order must list every item exactly once. Please reload and try again.');
      }
      const byId = new Map(current.map((item) => [item.id, item]));
      for (const [index, itemId] of ids.entries()) {
        if (byId.get(itemId).sortOrder !== index) {
          await tx.serviceItem.update({ where: { id: itemId }, data: { sortOrder: index } });
        }
      }
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'REORDER',
        entityType: 'ServiceItem',
        entityId: id,
        before: { category: category.title, order: current.map(({ id, title }) => ({ id, title })) },
        after: {
          category: category.title,
          order: ids.map((itemId) => ({ id: itemId, title: byId.get(itemId).title })),
        },
      });
    });
    res.json({ ok: true });
  });

  router.put('/:itemId', async (req, res) => {
    const { id, itemId } = itemParams.parse(req.params);
    const data = itemInput.parse(req.body ?? {});
    const item = await prisma.$transaction(async (tx) => {
      const category = await findCategory(tx, id);
      const existing = await findItem(tx, id, itemId);
      const before = itemSnapshot(existing, category);
      if (!hasChanges(before, data)) return existing;
      const updated = await tx.serviceItem.update({ where: { id: itemId }, data });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'UPDATE',
        entityType: 'ServiceItem',
        entityId: itemId,
        before,
        after: itemSnapshot(updated, category),
      });
      return updated;
    });
    res.json({ item });
  });

  router.delete('/:itemId', async (req, res) => {
    const { id, itemId } = itemParams.parse(req.params);
    await prisma.$transaction(async (tx) => {
      const category = await findCategory(tx, id);
      const existing = await findItem(tx, id, itemId);
      const deleted = await tx.serviceItem.update({
        where: { id: itemId },
        data: { isVisible: false, deletedAt: new Date() },
      });
      await writeAudit(tx, req, {
        admin: req.admin,
        action: 'DELETE',
        entityType: 'ServiceItem',
        entityId: itemId,
        before: itemSnapshot(existing, category),
        after: itemSnapshot(deleted, category),
      });
    });
    res.status(204).end();
  });

  return router;
}
