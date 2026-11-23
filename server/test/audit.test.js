import { after, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createAdmin, loggedInAgent, makeApp, prisma, resetDb } from './helpers.js';

const category = {
  title: 'Legal Services',
  slug: 'legal-services',
  description: 'Contracts and advice.',
  icon: 'shield',
};

let admin;
let agent;

beforeEach(async () => {
  await resetDb();
  admin = await createAdmin();
  agent = await loggedInAgent(makeApp());
});
after(() => prisma.$disconnect());

// Audit rows written by a change, ignoring the LOGIN row from setting up the session.
async function changeLogs() {
  return prisma.auditLog.findMany({ where: { action: { not: 'LOGIN' } }, orderBy: { createdAt: 'asc' } });
}

async function createCategory(data = category) {
  const res = await agent.post('/api/admin/categories').send(data);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.category;
}

async function createItem(categoryId, data) {
  const res = await agent.post(`/api/admin/categories/${categoryId}/items`).send(data);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.item;
}

describe('every change writes one audit log entry', () => {
  test('category create, update, delete and reorder', async () => {
    const created = await createCategory();
    const second = await createCategory({ ...category, title: 'Tax Services', slug: 'tax-services' });

    const update = await agent
      .put(`/api/admin/categories/${created.id}`)
      .send({ ...category, title: 'Legal and Compliance Services' });
    assert.equal(update.status, 200);

    const reorder = await agent.patch('/api/admin/categories/reorder').send({ ids: [second.id, created.id] });
    assert.equal(reorder.status, 200);

    assert.equal((await agent.delete(`/api/admin/categories/${created.id}`)).status, 204);

    const logs = await changeLogs();
    assert.deepEqual(
      logs.map((log) => [log.action, log.entityType]),
      [
        ['CREATE', 'ServiceCategory'],
        ['CREATE', 'ServiceCategory'],
        ['UPDATE', 'ServiceCategory'],
        ['REORDER', 'ServiceCategory'],
        ['DELETE', 'ServiceCategory'],
      ],
    );
    for (const log of logs) {
      assert.equal(log.adminId, admin.id);
      assert.equal(log.adminEmail, admin.email);
      assert.ok(log.after, `${log.action} should record the new values`);
    }
    const [createLog, , updateLog, reorderLog, deleteLog] = logs;
    assert.equal(createLog.before, null);
    assert.equal(createLog.after.title, 'Legal Services');
    assert.equal(updateLog.before.title, 'Legal Services');
    assert.equal(updateLog.after.title, 'Legal and Compliance Services');
    assert.deepEqual(
      reorderLog.after.order.map((entry) => entry.title),
      ['Tax Services', 'Legal and Compliance Services'],
    );
    assert.equal(deleteLog.before.isVisible, true);
    assert.equal(deleteLog.after.isVisible, false);
    assert.ok(deleteLog.after.deletedAt);
  });

  test('item create, update, delete and reorder', async () => {
    const parent = await createCategory();
    const first = await createItem(parent.id, { title: 'Contract Review', slug: 'contract-review' });
    const second = await createItem(parent.id, { title: 'Company Formation', slug: 'company-formation' });
    const base = `/api/admin/categories/${parent.id}/items`;

    assert.equal(
      (await agent.put(`${base}/${first.id}`).send({ title: 'Contract Drafting', slug: 'contract-review' })).status,
      200,
    );
    assert.equal((await agent.patch(`${base}/reorder`).send({ ids: [second.id, first.id] })).status, 200);
    assert.equal((await agent.delete(`${base}/${second.id}`)).status, 204);

    const logs = (await changeLogs()).filter((log) => log.entityType === 'ServiceItem');
    assert.deepEqual(
      logs.map((log) => log.action),
      ['CREATE', 'CREATE', 'UPDATE', 'REORDER', 'DELETE'],
    );
    assert.equal(logs[2].before.title, 'Contract Review');
    assert.equal(logs[2].after.title, 'Contract Drafting');
    assert.equal(logs[3].after.category, 'Legal Services');
    assert.equal(logs[4].after.isVisible, false);
    assert.ok(
      logs.every((log) => log.after.category === 'Legal Services'),
      'item entries name their category',
    );
  });

  test('saving without changes writes no entry', async () => {
    const created = await createCategory();
    const before = (await changeLogs()).length;
    assert.equal((await agent.put(`/api/admin/categories/${created.id}`).send(category)).status, 200);
    assert.equal((await changeLogs()).length, before);
  });

  test('an invalid request changes nothing and writes no entry', async () => {
    const res = await agent.post('/api/admin/categories').send({ ...category, slug: 'Not A Slug!' });
    assert.equal(res.status, 400);
    assert.equal(res.body.errors[0].field, 'slug');
    assert.equal(await prisma.serviceCategory.count(), 0);
    assert.equal((await changeLogs()).length, 0);
  });

  test('if the audit entry cannot be saved, the change is rolled back too', async () => {
    const created = await createCategory();
    // Make the database reject UPDATE audit rows, as if writing the log failed.
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "AuditLog" ADD CONSTRAINT test_block_updates CHECK (action <> 'UPDATE') NOT VALID`,
    );
    try {
      const res = await agent.put(`/api/admin/categories/${created.id}`).send({ ...category, title: 'Changed' });
      assert.equal(res.status, 500);
    } finally {
      await prisma.$executeRawUnsafe('ALTER TABLE "AuditLog" DROP CONSTRAINT test_block_updates');
    }
    const stored = await prisma.serviceCategory.findUnique({ where: { id: created.id } });
    assert.equal(stored.title, 'Legal Services');
  });
});

describe('audit log API', () => {
  test('is read-only', async () => {
    await createCategory();
    const log = await prisma.auditLog.findFirst();
    assert.equal((await agent.put(`/api/admin/audit-logs/${log.id}`).send({ action: 'LOGIN' })).status, 404);
    assert.equal((await agent.patch(`/api/admin/audit-logs/${log.id}`).send({})).status, 404);
    assert.equal((await agent.delete(`/api/admin/audit-logs/${log.id}`)).status, 404);
    assert.equal((await agent.delete('/api/admin/audit-logs')).status, 404);
  });

  test('filters by action, entity and admin, and pages the results', async () => {
    await createCategory();
    await createCategory({ ...category, title: 'Tax Services', slug: 'tax-services' });

    const created = await agent.get('/api/admin/audit-logs').query({ action: 'CREATE', entityType: 'ServiceCategory' });
    assert.equal(created.body.total, 2);
    assert.ok(created.body.logs.every((log) => log.action === 'CREATE' && log.adminName === 'Test Admin'));

    const paged = await agent.get('/api/admin/audit-logs').query({ adminId: admin.id, pageSize: 1, page: 2 });
    assert.equal(paged.body.logs.length, 1);
    assert.equal(paged.body.total, 3);
    assert.equal(paged.body.totalPages, 3);

    const today = new Date().toISOString().slice(0, 10);
    assert.equal((await agent.get('/api/admin/audit-logs').query({ from: today, to: today })).body.total, 3);
    assert.equal((await agent.get('/api/admin/audit-logs').query({ action: 'NOPE' })).status, 400);
  });
});

describe('public services API', () => {
  test('lists only visible, undeleted categories and items, in order, cached for 60 seconds', async () => {
    const shown = await createCategory();
    const hidden = await createCategory({ ...category, title: 'Hidden', slug: 'hidden', isVisible: false });
    const removed = await createCategory({ ...category, title: 'Removed', slug: 'removed' });
    await agent.delete(`/api/admin/categories/${removed.id}`);
    await createItem(shown.id, { title: 'Second', slug: 'second' });
    await createItem(shown.id, { title: 'Hidden item', slug: 'hidden-item', isVisible: false });
    const first = await createItem(shown.id, { title: 'First', slug: 'first' });
    const items = (await agent.get(`/api/admin/categories/${shown.id}/items`)).body.items;
    await agent
      .patch(`/api/admin/categories/${shown.id}/items/reorder`)
      .send({ ids: [first.id, ...items.filter((item) => item.id !== first.id).map((item) => item.id)] });

    const res = await request(makeApp()).get('/api/services');
    assert.equal(res.status, 200);
    assert.equal(res.headers['cache-control'], 'public, max-age=60');
    assert.deepEqual(
      res.body.categories.map((c) => c.slug),
      ['legal-services'],
    );
    assert.deepEqual(
      res.body.categories[0].items.map((i) => i.title),
      ['First', 'Second'],
    );
    assert.equal(hidden.isVisible, false);
  });

  test('an item’s description is saved, logged, shown on the website and kept when the item is hidden', async () => {
    const parent = await createCategory();
    const item = await createItem(parent.id, { title: 'Payroll', slug: 'payroll' });
    assert.equal(item.description, '', 'empty until an admin writes one');

    const base = `/api/admin/categories/${parent.id}/items/${item.id}`;
    const saved = await agent
      .put(base)
      .send({ title: 'Payroll', slug: 'payroll', description: '  Monthly payroll.  ' });
    assert.equal(saved.body.item.description, 'Monthly payroll.');
    const log = (await changeLogs()).at(-1);
    assert.equal(log.action, 'UPDATE');
    assert.equal(log.before.description, '');
    assert.equal(log.after.description, 'Monthly payroll.');

    // Hide and Show send no description; the saved one stays.
    await agent.put(base).send({ title: 'Payroll', slug: 'payroll', isVisible: false });
    await agent.put(base).send({ title: 'Payroll', slug: 'payroll', isVisible: true });
    const res = await request(makeApp()).get('/api/services');
    assert.deepEqual(res.body.categories[0].items, [
      { slug: 'payroll', title: 'Payroll', description: 'Monthly payroll.' },
    ]);

    const tooLong = await agent.put(base).send({ title: 'Payroll', slug: 'payroll', description: 'x'.repeat(301) });
    assert.equal(tooLong.status, 400);
  });
});
