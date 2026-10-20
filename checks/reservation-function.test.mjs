import assert from 'node:assert/strict';
import test from 'node:test';
import { createHandler } from '../netlify/functions/reservation.mjs';

const endpoint = 'http://localhost/.netlify/functions/reservation';
const valid = { name: 'Ada Lovelace', contact: 'ada@example.test', date: '2027-02-14', time: '19:00', guests: 4, occasion: 'birthday', message: '<b>Please</b> & enjoy', website: '', language: 'en' };
const makeRequest = (body = valid) => new Request(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

test('successful reservation sends escaped data and returns 201', async () => {
  let telegramCall;
  const handler = createHandler({ env: { TELEGRAM_BOT_TOKEN: 'fake-token', TELEGRAM_CHAT_ID: '12345' }, now: () => new Date('2026-10-20T18:30:00Z'), fetchFn: async (url, options) => { telegramCall = { url, options }; return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), { status: 200 }); } });
  const result = await handler(makeRequest());
  assert.equal(result.status, 201);
  assert.deepEqual(await result.json(), { ok: true, message: 'Reservation request sent for manual confirmation.' });
  assert.equal(telegramCall.url, 'https://api.telegram.org/botfake-token/sendMessage');
  const payload = JSON.parse(telegramCall.options.body);
  assert.equal(payload.chat_id, '12345');
  assert.match(payload.text, /&lt;b&gt;Please&lt;\/b&gt; &amp; enjoy/);
  assert.doesNotMatch(payload.text, /<b>Please<\/b>/);
});

test('validation failure does not call Telegram', async () => {
  let called = false;
  const handler = createHandler({ env: { TELEGRAM_BOT_TOKEN: 'fake', TELEGRAM_CHAT_ID: '123' }, fetchFn: async () => { called = true; } });
  const result = await handler(makeRequest({ ...valid, contact: 'invalid', guests: 0 }));
  assert.equal(result.status, 400);
  assert.deepEqual((await result.json()).fields.sort(), ['contact', 'guests']);
  assert.equal(called, false);
});

test('missing environment variables returns 503 without calling Telegram', async () => {
  let called = false;
  const handler = createHandler({ env: {}, fetchFn: async () => { called = true; } });
  const result = await handler(makeRequest());
  assert.equal(result.status, 503);
  assert.equal((await result.json()).error, 'SERVICE_NOT_CONFIGURED');
  assert.equal(called, false);
});

test('Telegram rejection returns 502 instead of success', async () => {
  const handler = createHandler({ env: { TELEGRAM_BOT_TOKEN: 'fake', TELEGRAM_CHAT_ID: '123' }, fetchFn: async () => new Response(JSON.stringify({ ok: false }), { status: 400 }) });
  const result = await handler(makeRequest());
  assert.equal(result.status, 502);
  assert.equal((await result.json()).error, 'TELEGRAM_FAILED');
});

test('invalid JSON and oversized bodies are rejected', async () => {
  const handler = createHandler({ env: {} });
  const invalid = await handler(new Request(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }));
  assert.equal(invalid.status, 400);
  const oversized = await handler(new Request(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: 'x'.repeat(17 * 1024) }));
  assert.equal(oversized.status, 413);
});
