(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BavariaBooking = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalizeBase(value) {
    const base = String(value || '').trim();
    if (!base || base.includes('{{')) return '';
    return base.replace(/\/$/, '');
  }

  async function requestReservation(data, { apiBase, fetchFn = fetch, timeoutMs = 10000 } = {}) {
    const base = normalizeBase(apiBase);
    if (!base) throw Object.assign(new Error('API_NOT_CONFIGURED'), { code: 'API_NOT_CONFIGURED' });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchFn(`${base}/api/reservations`, {
        method: 'POST', credentials: 'omit', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), signal: controller.signal,
      });
      if (!response.ok) throw Object.assign(new Error('REQUEST_FAILED'), { code: response.status === 429 ? 'RATE_LIMITED' : 'REQUEST_FAILED', status: response.status });
      return response.json();
    } finally { clearTimeout(timeout); }
  }

  function createSubmitHandler({ readData, request, setState, onSuccess = () => {} }) {
    return async function submit() {
      setState('loading');
      try {
        const result = await request(readData());
        setState('success'); onSuccess(); return result;
      } catch (error) {
        setState(error.code === 'RATE_LIMITED' ? 'rateLimited' : 'error');
        throw error;
      }
    };
  }

  return { createSubmitHandler, normalizeBase, requestReservation };
});
