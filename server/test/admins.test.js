import { after, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { hashToken } from '../src/lib/invites.js';
import { PASSWORD, createAdmin, loggedInAgent, makeApp, prisma, resetDb } from './helpers.js';

const NEW_PASSWORD = 'a-brand-new-password-1';
let app;
let owner;
let agent;

beforeEach(async () => {
  await resetDb();
  app = makeApp();
  owner = await createAdmin({ email: 'owner@example.com', name: 'Owner' });
  agent = await loggedInAgent(app, 'owner@example.com');
});
after(() => prisma.$disconnect());

const invite = (body = { name: 'Partner', email: 'Partner@Example.com ' }) =>
  agent.post('/api/admin/admins/invites').send(body);
const actions = async () =>
  (await prisma.auditLog.findMany({ orderBy: { createdAt: 'asc' } })).map((log) => log.action);

describe('invitations', () => {
  test('an admin invites someone, who opens the link, sets a password and is logged in', async () => {
    const created = await invite();
    assert.equal(created.status, 201);
    assert.equal(created.body.invite.email, 'partner@example.com');
    const { token } = created.body;
    assert.ok(token.length >= 40);

    // Only a hash of the token is stored.
    const stored = await prisma.adminInvite.findFirst();
    assert.notEqual(stored.tokenHash, token);
    assert.equal(stored.tokenHash, hashToken(token));

    const info = await request(app).get('/api/auth/link').query({ token });
    assert.deepEqual(
      [info.status, info.body.type, info.body.name, info.body.email],
      [200, 'INVITE', 'Partner', 'partner@example.com'],
    );

    const partner = request.agent(app);
    const accepted = await partner
      .post('/api/auth/accept-link')
      .send({ token, name: 'Partner Name', password: NEW_PASSWORD });
    assert.equal(accepted.status, 201);
    assert.equal(accepted.body.admin.name, 'Partner Name');
    assert.equal((await partner.get('/api/admin/categories')).status, 200, 'logged in straight away');

    const account = await prisma.admin.findUnique({ where: { email: 'partner@example.com' } });
    assert.ok(account.passwordHash.startsWith('$2b$12$'));
    assert.deepEqual(await actions(), ['LOGIN', 'INVITE', 'ACCEPT_INVITE', 'LOGIN']);

    // The same link cannot be used twice.
    const again = await request(app).post('/api/auth/accept-link').send({ token, password: NEW_PASSWORD });
    assert.equal(again.status, 410);
  });

  test('the limit of 2 admins counts open invitations', async () => {
    assert.equal((await invite()).status, 201);
    const third = await invite({ name: 'Third', email: 'third@example.com' });
    assert.equal(third.status, 409);
    assert.match(third.body.message, /allows 2 admins/);

    const list = await agent.get('/api/admin/admins');
    assert.equal(list.body.placesUsed, 2);
    assert.equal(list.body.maxAdmins, 2);
    assert.equal(list.body.invites.length, 1);
  });

  test('cancelling an invitation frees the place and the link stops working', async () => {
    const { body } = await invite();
    const pending = await prisma.adminInvite.findFirst();
    assert.equal((await agent.delete(`/api/admin/admins/invites/${pending.id}`)).status, 204);
    assert.equal((await request(app).get('/api/auth/link').query({ token: body.token })).status, 410);
    assert.equal((await invite({ name: 'Other', email: 'other@example.com' })).status, 201);
    assert.ok((await actions()).includes('REVOKE_INVITE'));
  });

  test('inviting the same email again replaces the old link', async () => {
    const first = await invite();
    const second = await invite();
    assert.equal(second.status, 201);
    assert.equal((await request(app).get('/api/auth/link').query({ token: first.body.token })).status, 410);
    assert.equal((await request(app).get('/api/auth/link').query({ token: second.body.token })).status, 200);
  });

  test('an expired link does not work', async () => {
    const { body } = await invite();
    await prisma.adminInvite.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } });
    const res = await request(app).post('/api/auth/accept-link').send({ token: body.token, password: NEW_PASSWORD });
    assert.equal(res.status, 410);
    assert.equal(await prisma.admin.count(), 1);
  });

  test('an existing admin email cannot be invited', async () => {
    const res = await invite({ name: 'Owner again', email: 'owner@example.com' });
    assert.equal(res.status, 409);
  });

  test('only logged-in admins can invite', async () => {
    const res = await request(app).post('/api/admin/admins/invites').send({ name: 'X', email: 'x@example.com' });
    assert.equal(res.status, 401);
  });
});

describe('password reset links', () => {
  test('an admin creates a reset link and the other admin chooses a new password', async () => {
    const partner = await createAdmin({ email: 'partner@example.com', name: 'Partner' });
    const created = await agent.post(`/api/admin/admins/${partner.id}/reset-link`);
    assert.equal(created.status, 201);

    const info = await request(app).get('/api/auth/link').query({ token: created.body.token });
    assert.equal(info.body.type, 'RESET');

    const reset = await request(app)
      .post('/api/auth/accept-link')
      .send({ token: created.body.token, password: NEW_PASSWORD });
    assert.equal(reset.status, 201);

    const login = (password) =>
      request(makeApp()).post('/api/auth/login').send({ email: 'partner@example.com', password });
    assert.equal((await login(PASSWORD)).status, 401, 'old password no longer works');
    assert.equal((await login(NEW_PASSWORD)).status, 200, 'new password works');
    assert.ok((await actions()).includes('RESET_LINK'));
    assert.ok((await actions()).includes('PASSWORD_RESET'));
  });

  test('a short password is refused and the link can still be used', async () => {
    const partner = await createAdmin({ email: 'partner@example.com', name: 'Partner' });
    const { body } = await agent.post(`/api/admin/admins/${partner.id}/reset-link`);
    const short = await request(app).post('/api/auth/accept-link').send({ token: body.token, password: 'short' });
    assert.equal(short.status, 400);
    assert.equal((await request(app).get('/api/auth/link').query({ token: body.token })).status, 200);
  });
});

describe('deactivating admins', () => {
  test('a deactivated admin is logged out at once and frees a place; reactivating needs a free place', async () => {
    const partner = await createAdmin({ email: 'partner@example.com', name: 'Partner' });
    const partnerAgent = await loggedInAgent(app, 'partner@example.com');

    const off = await agent.patch(`/api/admin/admins/${partner.id}`).send({ isActive: false });
    assert.equal(off.status, 200);
    assert.equal((await partnerAgent.get('/api/admin/categories')).status, 401);

    const { body } = await invite({ name: 'New', email: 'new@example.com' });
    assert.ok(body.token, 'the freed place can be used for an invitation');
    const back = await agent.patch(`/api/admin/admins/${partner.id}`).send({ isActive: true });
    assert.equal(back.status, 409, 'cannot reactivate while both places are taken');

    const log = await prisma.auditLog.findFirst({ where: { action: 'UPDATE', entityType: 'Admin' } });
    assert.equal(log.before.isActive, true);
    assert.equal(log.after.isActive, false);
  });

  test('an admin cannot deactivate their own account', async () => {
    const res = await agent.patch(`/api/admin/admins/${owner.id}`).send({ isActive: false });
    assert.equal(res.status, 400);
  });
});
