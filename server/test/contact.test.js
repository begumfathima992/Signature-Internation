import { after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createAdmin, loggedInAgent, makeApp, prisma, resetDb } from './helpers.js';

const details = {
  email: 'Info@Example.co.uk',
  phone: '+44 (0)161 496 0000',
  whatsapp: '+44 7700 900123',
  address: ['10 New Road', '', 'Manchester M1 1AA', 'United Kingdom'],
  hours: [{ days: 'Monday to Saturday', time: '9:00am to 6:00pm' }],
};

let app;
let agent;

beforeEach(async () => {
  await resetDb();
  app = makeApp();
  await createAdmin();
  agent = await loggedInAgent(app);
});
after(() => prisma.$disconnect());

test('the website gets the built-in details until an admin saves new ones, never kept stale by the browser', async () => {
  const res = await request(app).get('/api/contact-details');
  assert.equal(res.status, 200);
  assert.equal(res.headers['cache-control'], 'no-cache');
  assert.equal(res.body.contact.email, 'hello@signatureinternational.example');
  assert.equal(res.body.contact.hours.length, 2);
});

test('an admin updates the details; they are cleaned up, shown on the website and logged', async () => {
  const saved = await agent.put('/api/admin/contact-details').send(details);
  assert.equal(saved.status, 200);
  assert.equal(saved.body.contact.email, 'info@example.co.uk');
  assert.equal(saved.body.contact.whatsapp, '447700900123', 'WhatsApp keeps digits only');
  assert.deepEqual(
    saved.body.contact.address,
    ['10 New Road', 'Manchester M1 1AA', 'United Kingdom'],
    'empty lines dropped',
  );

  const live = await request(app).get('/api/contact-details');
  assert.equal(live.body.contact.phone, '+44 (0)161 496 0000');

  const log = await prisma.auditLog.findFirst({ where: { entityType: 'ContactDetails' } });
  assert.equal(log.action, 'UPDATE');
  assert.equal(log.before.email, 'hello@signatureinternational.example');
  assert.equal(log.after.email, 'info@example.co.uk');

  // Saving the same details again changes nothing and logs nothing.
  await agent.put('/api/admin/contact-details').send(details);
  assert.equal(await prisma.auditLog.count({ where: { entityType: 'ContactDetails' } }), 1);
});

test('invalid details are refused field by field', async () => {
  const res = await agent
    .put('/api/admin/contact-details')
    .send({ ...details, email: 'nope', phone: 'call me', whatsapp: '12', address: ['', ''] });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.errors.map((error) => error.field).sort(), ['address', 'email', 'phone', 'whatsapp']);
  assert.equal(await prisma.contactDetails.count(), 0);
});

test('only logged-in admins can change the details', async () => {
  const res = await request(app).put('/api/admin/contact-details').send(details);
  assert.equal(res.status, 401);
});
