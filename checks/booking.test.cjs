'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { createSubmitHandler, normalizeBase, requestReservation } = require('../assets/booking.js');

test('request posts JSON to the configured API', async () => {
  let request;
  const result = await requestReservation({ name: 'Ada' }, { apiBase: 'https://api.example/', fetchFn: async (url, options) => { request = { url, options }; return { ok: true, json: async () => ({ ok: true }) }; } });
  assert.deepEqual(result, { ok: true }); assert.equal(request.url, 'https://api.example/api/reservations');
  assert.equal(JSON.parse(request.options.body).name, 'Ada');
});

test('form controller resets only after API success', async () => {
  const states = []; let resets = 0; const data = { name: 'Ada' };
  const success = createSubmitHandler({ readData: () => data, request: async () => ({ ok: true }), setState: (state) => states.push(state), onSuccess: () => { resets++; } });
  await success(); assert.deepEqual(states, ['loading', 'success']); assert.equal(resets, 1);
  states.length = 0;
  const failure = createSubmitHandler({ readData: () => data, request: async () => { throw new Error('offline'); }, setState: (state) => states.push(state), onSuccess: () => { resets++; } });
  await assert.rejects(failure); assert.deepEqual(states, ['loading', 'error']); assert.equal(resets, 1); assert.deepEqual(data, { name: 'Ada' });
});

test('unconfigured placeholder is rejected without a network call', async () => {
  assert.equal(normalizeBase('{{reservation.apiBase}}'), '');
  let called = false;
  await assert.rejects(() => requestReservation({}, { apiBase: '', fetchFn: async () => { called = true; } }), /API_NOT_CONFIGURED/);
  assert.equal(called, false);
});
