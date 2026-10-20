const MAX_BODY_BYTES = 16 * 1024;
const TELEGRAM_TIMEOUT_MS = 8_000;
const OCCASIONS = new Set(['evening', 'birthday', 'bachelor', 'private', 'music', 'other']);
const OCCASION_LABELS = {
  evening: 'Ein schöner Abend', birthday: 'Geburtstag', bachelor: 'Junggesellenabschied',
  private: 'Private Feier', music: 'Musikwünsche', other: 'Sonstiges',
};

function response(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, maxLength + 1);
}

function escapeTelegramHtml(value) {
  return String(value).replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
}

export function validateReservation(input) {
  const data = {
    name: cleanText(input?.name, 100),
    contact: cleanText(input?.contact, 150),
    date: cleanText(input?.date, 10),
    time: cleanText(input?.time, 5),
    guests: Number(input?.guests),
    occasion: cleanText(input?.occasion, 30),
    message: cleanText(input?.message, 1000),
    website: cleanText(input?.website, 200),
    language: ['de', 'en', 'uk'].includes(input?.language) ? input.language : 'de',
  };
  if (data.website) return { ok: false, bot: true, fields: [] };
  const fields = [];
  if (data.name.length < 2 || data.name.length > 100) fields.push('name');
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact);
  const isPhone = /^\+?[0-9 ()\-/.]{6,30}$/.test(data.contact);
  if (data.contact.length > 150 || (!isEmail && !isPhone)) fields.push('contact');
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.date);
  const date = dateMatch && new Date(Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3])));
  if (!date || date.getUTCFullYear() !== Number(dateMatch[1]) || date.getUTCMonth() !== Number(dateMatch[2]) - 1 || date.getUTCDate() !== Number(dateMatch[3])) fields.push('date');
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(data.time)) fields.push('time');
  if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 30) fields.push('guests');
  if (!OCCASIONS.has(data.occasion)) fields.push('occasion');
  if (data.message.length > 1000) fields.push('message');
  return fields.length ? { ok: false, fields } : { ok: true, data };
}

export function buildTelegramMessage(data, receivedAt = new Date()) {
  const received = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', dateStyle: 'full', timeStyle: 'long',
  }).format(receivedAt);
  const safe = escapeTelegramHtml;
  return [
    '<b>🔔 Neue Tischanfrage (noch nicht bestätigt)</b>', '',
    `<b>Name:</b> ${safe(data.name)}`, `<b>Kontakt:</b> ${safe(data.contact)}`,
    `<b>Datum:</b> ${safe(data.date)}`, `<b>Uhrzeit:</b> ${safe(data.time)}`,
    `<b>Gäste:</b> ${safe(data.guests)}`, `<b>Anlass:</b> ${safe(OCCASION_LABELS[data.occasion] || data.occasion)}`,
    `<b>Wünsche:</b> ${safe(data.message || '—')}`, `<b>Sprache:</b> ${safe(data.language.toUpperCase())}`,
    `<b>Eingegangen:</b> ${safe(received)} (Europe/Berlin)`,
  ].join('\n');
}

async function sendTelegram({ token, chatId, message, fetchFn, timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const telegramResponse = await fetchFn(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: controller.signal,
    });
    let result;
    try { result = await telegramResponse.json(); } catch { result = null; }
    if (!telegramResponse.ok || result?.ok !== true) throw new Error('TELEGRAM_REJECTED');
  } finally {
    clearTimeout(timeout);
  }
}

export function createHandler({ env = process.env, fetchFn = fetch, now = () => new Date(), timeoutMs = TELEGRAM_TIMEOUT_MS } = {}) {
  return async function handler(request) {
    if (request.method !== 'POST') return response(405, { ok: false, error: 'METHOD_NOT_ALLOWED', message: 'Only POST requests are accepted.' }, { allow: 'POST' });
    if (!String(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) return response(415, { ok: false, error: 'JSON_REQUIRED', message: 'Send the request as JSON.' });
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) return response(413, { ok: false, error: 'PAYLOAD_TOO_LARGE', message: 'The reservation request is too large.' });
    let rawBody;
    try { rawBody = await request.text(); } catch { return response(400, { ok: false, error: 'INVALID_BODY', message: 'The request body could not be read.' }); }
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) return response(413, { ok: false, error: 'PAYLOAD_TOO_LARGE', message: 'The reservation request is too large.' });
    let input;
    try { input = JSON.parse(rawBody || '{}'); } catch { return response(400, { ok: false, error: 'INVALID_JSON', message: 'The request contains invalid JSON.' }); }
    const validated = validateReservation(input);
    if (!validated.ok) return response(400, { ok: false, error: 'VALIDATION_ERROR', message: 'Please check the reservation details.', fields: validated.bot ? [] : validated.fields });
    const token = env.TELEGRAM_BOT_TOKEN, chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return response(503, { ok: false, error: 'SERVICE_NOT_CONFIGURED', message: 'Reservation delivery is temporarily unavailable.' });
    try {
      await sendTelegram({ token, chatId, message: buildTelegramMessage(validated.data, now()), fetchFn, timeoutMs });
      return response(201, { ok: true, message: 'Reservation request sent for manual confirmation.' });
    } catch (error) {
      const timedOut = error?.name === 'AbortError';
      return response(timedOut ? 504 : 502, { ok: false, error: timedOut ? 'TELEGRAM_TIMEOUT' : 'TELEGRAM_FAILED', message: timedOut ? 'Reservation delivery timed out. Please try again.' : 'Reservation delivery failed. Please try again.' });
    }
  };
}

export default createHandler();
