import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { prisma, resetDb } from './helpers.js';

const seedEnv = {
  ...process.env,
  ADMIN1_NAME: 'Admin One',
  ADMIN1_EMAIL: 'One@Example.com',
  ADMIN1_PASSWORD: 'first-strong-password',
  ADMIN2_NAME: 'Admin Two',
  ADMIN2_EMAIL: 'two@example.com',
  ADMIN2_PASSWORD: 'second-strong-password',
};
const runSeed = () =>
  execFileSync('node', ['prisma/seed.js'], { env: seedEnv, cwd: new URL('..', import.meta.url), encoding: 'utf8' });

after(() => prisma.$disconnect());

test('seed loads the current services and exactly 2 admins, and is safe to run twice', async () => {
  await resetDb();
  runSeed();

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });
  assert.deepEqual(
    categories.map((c) => [c.slug, c.icon, c.items.length]),
    [
      ['management-consultancy', 'briefcase', 7],
      ['web-development', 'globe', 3],
      ['digital-marketing', 'chart', 2],
      ['business-advertisement', 'megaphone', 4],
      ['general-services', 'layers', 2],
    ],
  );
  assert.equal(categories[0].items[5].title, 'Business Process Re-engineering');

  const admins = await prisma.admin.findMany({ orderBy: { email: 'asc' } });
  assert.deepEqual(
    admins.map((a) => a.email),
    ['one@example.com', 'two@example.com'],
  );
  assert.ok(
    admins.every((a) => a.passwordHash.startsWith('$2b$12$')),
    'passwords use bcrypt cost 12',
  );

  // A change made in the admin area survives a second seed run.
  await prisma.serviceCategory.update({ where: { id: categories[0].id }, data: { title: 'Renamed' } });
  runSeed();
  assert.equal(await prisma.serviceCategory.count(), 5);
  assert.equal(await prisma.serviceItem.count(), 18);
  assert.equal(await prisma.admin.count(), 2);
  assert.equal((await prisma.serviceCategory.findUnique({ where: { id: categories[0].id } })).title, 'Renamed');
});
