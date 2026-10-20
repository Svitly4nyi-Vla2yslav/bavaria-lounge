'use strict';

const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const { createHandler } = require('../src/app');

const env = { SMTP_USER: 'sender@example.test', RESERVATION_TO_EMAIL: 'recipient@example.test', FRONTEND_ORIGINS: 'https://bavaria.example' };
const valid = { name: 'Ada Lovelace', contact: 'ada@example.test', date: '2027-02-14', time: '19:00', guests: 4, occasion: 'birthday', message: '<b>Please</b>', website: '', language: 'en' };

async function withServer(transporter, run, options = {}) {
  const server = http.createServer(createHandler({ transporter, env, rateLimiter: options.rateLimiter || (() => true), now: () => new Date('2026-10-20T18:30:00Z') }));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}

test('health endpoint reports ready', async () => withServer({ sendMail: async () => {} }, async (base) => {
  const response = await fetch(`${base}/health`); assert.equal(response.status, 200); assert.deepEqual(await response.json(), { status: 'ok' });
}));

test('valid request uses injected mail transport and escapes HTML', async () => {
  const sent = [];
  await withServer({ sendMail: async (mail) => sent.push(mail) }, async (base) => {
    const response = await fetch(`${base}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://bavaria.example' }, body: JSON.stringify(valid) });
    assert.equal(response.status, 201); assert.equal(sent.length, 1);
    assert.equal(sent[0].to, env.RESERVATION_TO_EMAIL); assert.equal(sent[0].from, env.SMTP_USER);
    assert.match(sent[0].html, /&lt;b&gt;Please&lt;\/b&gt;/); assert.doesNotMatch(sent[0].html, /<b>Please<\/b>/);
    assert.match(sent[0].text, /Europe\/Berlin/);
  });
});

test('validation rejects malformed input without sending mail', async () => {
  let calls = 0;
  await withServer({ sendMail: async () => { calls++; } }, async (base) => {
    const response = await fetch(`${base}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, contact: 'invalid', guests: 0 }) });
    assert.equal(response.status, 400); assert.deepEqual((await response.json()).fields.sort(), ['contact', 'guests']); assert.equal(calls, 0);
  });
});

test('honeypot and rate limiting block delivery', async () => {
  let calls = 0;
  await withServer({ sendMail: async () => { calls++; } }, async (base) => {
    const bot = await fetch(`${base}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, website: 'spam.example' }) });
    assert.equal(bot.status, 400); assert.equal(calls, 0);
  });
  await withServer({ sendMail: async () => { calls++; } }, async (base) => {
    const response = await fetch(`${base}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valid) });
    assert.equal(response.status, 429); assert.equal(calls, 0);
  }, { rateLimiter: () => false });
});

test('mail transport failure returns a generic error', async () => withServer({ sendMail: async () => { throw new Error('SMTP secret detail'); } }, async (base) => {
  const response = await fetch(`${base}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(valid) });
  assert.equal(response.status, 502); assert.deepEqual(await response.json(), { error: 'DELIVERY_FAILED' });
}));

test('CORS rejects unknown origins and accepts configured origins', async () => withServer({ sendMail: async () => {} }, async (base) => {
  const blocked = await fetch(`${base}/health`, { headers: { Origin: 'https://evil.example' } });
  assert.equal(blocked.status, 403); assert.equal(blocked.headers.get('access-control-allow-origin'), null);
  const allowed = await fetch(`${base}/health`, { headers: { Origin: 'https://bavaria.example' } });
  assert.equal(allowed.status, 200); assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://bavaria.example');
}));

test('request body size is limited', async () => withServer({ sendMail: async () => {} }, async (base) => {
  const response = await fetch(`${base}/api/reservations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, message: 'x'.repeat(17 * 1024) }) });
  assert.equal(response.status, 413); assert.deepEqual(await response.json(), { error: 'PAYLOAD_TOO_LARGE' });
}));
