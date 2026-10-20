'use strict';

const { buildMessage, validateReservation } = require('./reservation');

const MAX_BODY_BYTES = 16 * 1024;

function parseOrigins(value = '') {
  const local = ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:5500', 'http://127.0.0.1:5500'];
  return new Set([...local, ...value.split(',').map((item) => item.trim()).filter(Boolean)]);
}

function createRateLimiter({ windowMs = 15 * 60_000, max = 5, cooldownMs = 20_000 } = {}) {
  const clients = new Map();
  return (key, now = Date.now()) => {
    const recent = (clients.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
    if (recent.length && now - recent.at(-1) < cooldownMs) return false;
    if (recent.length >= max) return false;
    recent.push(now); clients.set(key, recent); return true;
  };
}

function json(response, status, body, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let size = 0; let tooLarge = false; const chunks = [];
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) tooLarge = true;
      else chunks.push(chunk);
    });
    request.on('end', () => {
      if (tooLarge) return reject(Object.assign(new Error('too large'), { code: 'BODY_TOO_LARGE' }));
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(Object.assign(new Error('invalid json'), { code: 'INVALID_JSON' })); }
    });
    request.on('error', reject);
  });
}

function createHandler({ transporter, env = process.env, rateLimiter = createRateLimiter(), now = () => new Date() }) {
  if (!transporter || typeof transporter.sendMail !== 'function') throw new Error('A mail transporter is required');
  const allowedOrigins = parseOrigins(env.FRONTEND_ORIGINS);
  return async (request, response) => {
    const origin = request.headers.origin;
    const corsHeaders = origin && allowedOrigins.has(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {};
    if (origin && !allowedOrigins.has(origin)) return json(response, 403, { error: 'ORIGIN_NOT_ALLOWED' });
    if (request.method === 'OPTIONS') {
      response.writeHead(204, { ...corsHeaders, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' });
      return response.end();
    }
    const url = new URL(request.url, 'http://api.local');
    if (request.method === 'GET' && url.pathname === '/health') return json(response, 200, { status: 'ok' }, corsHeaders);
    if (request.method !== 'POST' || url.pathname !== '/api/reservations') return json(response, 404, { error: 'NOT_FOUND' }, corsHeaders);
    if (!String(request.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return json(response, 415, { error: 'JSON_REQUIRED' }, corsHeaders);
    try {
      const input = await readJson(request);
      const validated = validateReservation(input);
      if (!validated.ok) return json(response, 400, { error: 'VALIDATION_ERROR', fields: validated.bot ? [] : validated.errors }, corsHeaders);
      const ip = String(request.headers['x-forwarded-for'] || request.socket.remoteAddress || '').split(',')[0].trim();
      if (!rateLimiter(ip)) return json(response, 429, { error: 'TOO_MANY_REQUESTS' }, { ...corsHeaders, 'Retry-After': '20' });
      const mail = buildMessage(validated.data, now());
      await transporter.sendMail({ from: env.SMTP_USER, to: env.RESERVATION_TO_EMAIL, replyTo: validated.data.contact.includes('@') ? validated.data.contact : undefined, ...mail });
      return json(response, 201, { ok: true, message: 'Reservation request sent for manual confirmation.' }, corsHeaders);
    } catch (error) {
      if (error.code === 'BODY_TOO_LARGE') return json(response, 413, { error: 'PAYLOAD_TOO_LARGE' }, corsHeaders);
      if (error.code === 'INVALID_JSON') return json(response, 400, { error: 'INVALID_JSON' }, corsHeaders);
      console.error('Reservation delivery failed');
      return json(response, 502, { error: 'DELIVERY_FAILED' }, corsHeaders);
    }
  };
}

module.exports = { createHandler, createRateLimiter, parseOrigins };
