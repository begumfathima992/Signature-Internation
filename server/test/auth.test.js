import { after, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { PASSWORD, createAdmin, loggedInAgent, makeApp, prisma, resetDb, testConfig } from './helpers.js';

const cookieOf = (res) => res.headers['set-cookie']?.find((c) => c.startsWith('sis_admin=')) ?? '';

beforeEach(resetDb);
after(() => prisma.$disconnect());

describe('login', () => {
  test('sets an httpOnly, SameSite=Strict, 8-hour cookie and logs LOGIN', async () => {
    const admin = await createAdmin();
    const res = await request(makeApp())
      .post('/api/auth/login')
      .send({ email: 'Admin@Example.com ', password: PASSWORD });

    assert.equal(res.status, 200);
    assert.equal(res.body.admin.email, 'admin@example.com');
    assert.equal(res.body.admin.passwordHash, undefined);
    assert.equal(JSON.stringify(res.body).includes('eyJ'), false, 'the token must not be in the body');

    const cookie = cookieOf(res);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Strict/);
    assert.match(cookie, /Max-Age=28800/);

    const logs = await prisma.auditLog.findMany();
    assert.equal(logs.length, 1);
    assert.equal(logs[0].action, 'LOGIN');
    assert.equal(logs[0].adminId, admin.id);
    assert.ok((await prisma.admin.findUnique({ where: { id: admin.id } })).lastLoginAt);
  });

  test('marks the cookie Secure in production', async () => {
    await createAdmin();
    const app = makeApp(testConfig({ NODE_ENV: 'production' }));
    const res = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: PASSWORD });
    assert.match(cookieOf(res), /Secure/);
  });

  test('gives the same generic error for a wrong password and an unknown email, and logs both', async () => {
    const admin = await createAdmin();
    const app = makeApp();
    const wrong = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'nope' });
    const unknown = await request(app).post('/api/auth/login').send({ email: 'who@example.com', password: PASSWORD });

    for (const res of [wrong, unknown]) {
      assert.equal(res.status, 401);
      assert.deepEqual(res.body, { message: 'Invalid email or password' });
      assert.equal(cookieOf(res), '');
    }
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'asc' } });
    assert.deepEqual(
      logs.map((log) => [log.action, log.adminId, log.adminEmail]),
      [
        ['LOGIN_FAILED', admin.id, 'admin@example.com'],
        ['LOGIN_FAILED', null, 'who@example.com'],
      ],
    );
  });

  test('refuses a deactivated admin with the same generic error', async () => {
    await createAdmin({ isActive: false });
    const res = await request(makeApp())
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: PASSWORD });
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { message: 'Invalid email or password' });
  });

  test('blocks an IP after 5 failed attempts in 15 minutes, even with the right password', async () => {
    await createAdmin();
    const app = makeApp();
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'wrong' });
      assert.equal(res.status, 401);
    }
    const blocked = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: PASSWORD });
    assert.equal(blocked.status, 429);
  });

  test('rejects a malformed body', async () => {
    const res = await request(makeApp()).post('/api/auth/login').send({ email: 'a@b.com' });
    assert.equal(res.status, 400);
  });
});

describe('session', () => {
  test('/api/auth/me returns null when logged out and the admin when logged in', async () => {
    await createAdmin();
    const app = makeApp();
    assert.deepEqual((await request(app).get('/api/auth/me')).body, { admin: null });

    const agent = await loggedInAgent(app);
    const me = await agent.get('/api/auth/me');
    assert.equal(me.body.admin.email, 'admin@example.com');
    assert.equal(me.body.admin.passwordHash, undefined);
  });

  test('admin routes need a valid session', async () => {
    const app = makeApp();
    assert.equal((await request(app).get('/api/admin/categories')).status, 401);
    assert.equal((await request(app).get('/api/admin/audit-logs')).status, 401);
    const forged = await request(app).get('/api/admin/categories').set('Cookie', 'sis_admin=not-a-real-token');
    assert.equal(forged.status, 401);
  });

  test('a deactivated admin loses access straight away', async () => {
    const admin = await createAdmin();
    const agent = await loggedInAgent(makeApp());
    assert.equal((await agent.get('/api/admin/categories')).status, 200);
    await prisma.admin.update({ where: { id: admin.id }, data: { isActive: false } });
    assert.equal((await agent.get('/api/admin/categories')).status, 401);
  });

  test('logout clears the cookie and logs LOGOUT', async () => {
    const admin = await createAdmin();
    const agent = await loggedInAgent(makeApp());
    const res = await agent.post('/api/auth/logout');
    assert.equal(res.status, 204);
    assert.match(cookieOf(res), /sis_admin=;/);
    assert.equal((await agent.get('/api/admin/categories')).status, 401);

    const logout = await prisma.auditLog.findFirst({ where: { action: 'LOGOUT' } });
    assert.equal(logout.adminId, admin.id);
  });
});

test('there is no public sign-up', async () => {
  const body = { name: 'X', email: 'x@example.com', password: 'a-long-password-123' };
  assert.equal((await request(makeApp()).post('/api/auth/register').send(body)).status, 404);
  assert.equal(await prisma.admin.count(), 0);
});
