import { Router } from 'express';
import { prisma } from '../db.js';

export function publicServicesRouter() {
  const router = Router();

  // Visible categories with their visible items, in display order. Browsers and proxies may cache it for 60 seconds.
  router.get('/', async (req, res) => {
    const visible = { isVisible: true, deletedAt: null };
    const categories = await prisma.serviceCategory.findMany({
      where: visible,
      orderBy: { sortOrder: 'asc' },
      select: {
        slug: true,
        title: true,
        description: true,
        icon: true,
        items: {
          where: visible,
          orderBy: { sortOrder: 'asc' },
          select: { slug: true, title: true, description: true },
        },
      },
    });
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ categories });
  });

  return router;
}
