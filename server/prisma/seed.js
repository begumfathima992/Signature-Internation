// Loads the site's services and the two admin accounts. Safe to run again: it only adds what is
// missing, so it never overwrites changes made in the admin area or resets a password.
import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const BCRYPT_COST = 12;
const prisma = new PrismaClient();

// Creates the first admin account(s) when the site is set up. Leave ADMIN2_* empty to let the first admin
// invite the second from the admin area instead.
function readAdmin(prefix) {
  const name = process.env[`${prefix}_NAME`];
  const email = process.env[`${prefix}_EMAIL`]?.trim().toLowerCase();
  const password = process.env[`${prefix}_PASSWORD`];
  if (!email || !password) return { email, skip: true };
  if (!name) throw new Error(`Set ${prefix}_NAME before seeding.`);
  if (password.length < 12) throw new Error(`${prefix}_PASSWORD must be at least 12 characters.`);
  return { name, email, password };
}

async function seedServices() {
  const url = new URL('./seed-data.json', import.meta.url);
  const categories = JSON.parse(await readFile(url, 'utf8'));

  for (const [index, { items, ...category }] of categories.entries()) {
    const saved = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: { ...category, sortOrder: index },
    });
    for (const [itemIndex, item] of items.entries()) {
      await prisma.serviceItem.upsert({
        where: { categoryId_slug: { categoryId: saved.id, slug: item.slug } },
        update: {},
        create: { ...item, categoryId: saved.id, sortOrder: itemIndex },
      });
    }
  }
  return categories.length;
}

async function seedAdmins() {
  const admins = [readAdmin('ADMIN1'), readAdmin('ADMIN2')];
  if (admins[0].email && admins[0].email === admins[1].email)
    throw new Error('ADMIN1_EMAIL and ADMIN2_EMAIL must be different.');

  for (const { name, email, password, skip } of admins) {
    if (skip) continue;
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) continue;
    await prisma.admin.create({ data: { name, email, passwordHash: await bcrypt.hash(password, BCRYPT_COST) } });
  }
}

try {
  const categoryCount = await seedServices();
  await seedAdmins();
  const itemCount = await prisma.serviceItem.count();
  console.log(`Seed complete: ${categoryCount} categories, ${itemCount} items, ${await prisma.admin.count()} admins.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
