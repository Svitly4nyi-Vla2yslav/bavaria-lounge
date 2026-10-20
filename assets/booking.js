(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BavariaBooking = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalizeEndpoint(value) {
    const endpoint = String(value || '').trim();
    if (!endpoint || endpoint.includes('{{')) return '/.netlify/functions/reservation';
    return endpoint.replace(/\/$/, '');
  }

  async function requestReservation(data, { endpoint, fetchFn = fetch, timeoutMs = 10000 } = {}) {
    const url = normalizeEndpoint(endpoint);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchFn(url, {
        method: 'POST', credentials: 'omit', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw Object.assign(new Error('REQUEST_FAILED'), { code: response.status === 429 ? 'RATE_LIMITED' : 'REQUEST_FAILED', status: response.status });
      return result;
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

  return { createSubmitHandler, normalizeEndpoint, requestReservation };
});
