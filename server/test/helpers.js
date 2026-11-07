import './env.js';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadConfig } from '../src/config.js';
import { prisma } from '../src/db.js';

export { prisma };

export const PASSWORD = 'correct horse battery staple';

export function testConfig(overrides = {}) {
  return loadConfig({
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: 'test-secret-that-is-at-least-32-characters-long',
    NODE_ENV: 'test',
    ...overrides,
  });
}

// A fresh app per test also means a fresh login rate limiter.
export function makeApp(config = testConfig()) {
  return createApp(config);
}

export async function resetDb() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE "AuditLog", "AdminInvite", "ServiceItem", "ServiceCategory", "Admin" RESTART IDENTITY CASCADE',
  );
}

export async function createAdmin({ email = 'admin@example.com', name = 'Test Admin', isActive = true } = {}) {
  // Cost 4 keeps the tests fast; the seed script uses 12.
  return prisma.admin.create({ data: { name, email, isActive, passwordHash: await bcrypt.hash(PASSWORD, 4) } });
}

export async function loggedInAgent(app, email = 'admin@example.com') {
  const agent = request.agent(app);
  const res = await agent.post('/api/auth/login').send({ email, password: PASSWORD });
  if (res.status !== 200) throw new Error(`Login failed in test setup: ${res.status}`);
  return agent;
}
