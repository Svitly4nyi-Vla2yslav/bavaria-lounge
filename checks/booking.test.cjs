'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { createSubmitHandler, normalizeEndpoint, requestReservation } = require('../assets/booking.js');

test('request posts JSON to the Netlify Function endpoint', async () => {
  let request;
  const result = await requestReservation({ name: 'Ada' }, { endpoint: '/.netlify/functions/reservation', fetchFn: async (url, options) => { request = { url, options }; return { ok: true, status: 201, json: async () => ({ ok: true }) }; } });
  assert.deepEqual(result, { ok: true }); assert.equal(request.url, '/.netlify/functions/reservation'); assert.equal(JSON.parse(request.options.body).name, 'Ada');
});
test('default endpoint is the standard Netlify Function path', () => { assert.equal(normalizeEndpoint(''), '/.netlify/functions/reservation'); assert.equal(normalizeEndpoint('{{reservation.apiBase}}'), '/.netlify/functions/reservation'); });
test('form controller resets only after confirmed API success', async () => {
  const states = []; let resets = 0; const data = { name: 'Ada' };
  const success = createSubmitHandler({ readData: () => data, request: async () => ({ ok: true }), setState: (state) => states.push(state), onSuccess: () => { resets++; } });
  await success(); assert.deepEqual(states, ['loading', 'success']); assert.equal(resets, 1);
  states.length = 0;
  const failure = createSubmitHandler({ readData: () => data, request: async () => { throw new Error('offline'); }, setState: (state) => states.push(state), onSuccess: () => { resets++; } });
  await assert.rejects(failure); assert.deepEqual(states, ['loading', 'error']); assert.equal(resets, 1); assert.deepEqual(data, { name: 'Ada' });
});
test('HTTP success with unconfirmed JSON is treated as failure', async () => { await assert.rejects(() => requestReservation({}, { fetchFn: async () => ({ ok: true, status: 200, json: async () => ({ ok: false }) }) }), /REQUEST_FAILED/); });
