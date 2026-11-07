import { Router } from 'express';
import { prisma } from '../db.js';
import { auditQuery } from '../lib/schemas.js';

// Read-only on purpose: there are no routes that change or remove audit log rows.
export function auditLogsRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const { adminId, action, entityType, from, to, page, pageSize } = auditQuery.parse(req.query);
    const createdAt = {};
    if (from) createdAt.gte = new Date(`${from}T00:00:00.000Z`);
    // "to" includes the whole of that day.
    if (to) createdAt.lt = new Date(new Date(`${to}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000);
    const where = {
      ...(adminId && { adminId }),
      ...(action && { action }),
      ...(entityType && { entityType }),
      ...((from || to) && { createdAt }),
    };

    const [total, logs, admins] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { admin: { select: { name: true } } },
      }),
      prisma.admin.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: 'asc' } }),
    ]);

    res.json({
      logs: logs.map(({ admin, ...log }) => ({ ...log, adminName: admin?.name ?? null })),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      admins,
    });
  });

  return router;
}
