'use strict';

const OCCASIONS = new Set(['evening', 'birthday', 'bachelor', 'private', 'music', 'other']);

function text(value, max) {
  return typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max + 1) : '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function validateReservation(input) {
  const data = {
    name: text(input?.name, 100),
    contact: text(input?.contact, 150),
    date: text(input?.date, 10),
    time: text(input?.time, 5),
    guests: Number(input?.guests),
    occasion: text(input?.occasion, 30),
    message: text(input?.message, 1000),
    website: text(input?.website, 200),
    language: ['de', 'en', 'uk'].includes(input?.language) ? input.language : 'de',
  };
  if (data.website) return { ok: false, bot: true, errors: ['invalid request'] };
  const errors = [];
  if (data.name.length < 2 || data.name.length > 100) errors.push('name');
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact);
  const isPhone = /^\+?[0-9 ()\-/.]{6,30}$/.test(data.contact);
  if (data.contact.length > 150 || (!isEmail && !isPhone)) errors.push('contact');
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.date);
  const parsedDate = dateMatch && new Date(Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3])));
  if (!parsedDate || parsedDate.getUTCFullYear() !== Number(dateMatch[1]) || parsedDate.getUTCMonth() !== Number(dateMatch[2]) - 1 || parsedDate.getUTCDate() !== Number(dateMatch[3])) errors.push('date');
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(data.time)) errors.push('time');
  if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 30) errors.push('guests');
  if (!OCCASIONS.has(data.occasion)) errors.push('occasion');
  if (data.message.length > 1000) errors.push('message');
  return errors.length ? { ok: false, errors } : { ok: true, data };
}

function buildMessage(data, receivedAt = new Date()) {
  const received = new Intl.DateTimeFormat('de-DE', {
    timeZone: 'Europe/Berlin', dateStyle: 'full', timeStyle: 'long',
  }).format(receivedAt);
  const rows = [
    ['Name', data.name], ['Kontakt', data.contact], ['Datum', data.date],
    ['Uhrzeit', data.time], ['Gäste', data.guests], ['Anlass', data.occasion],
    ['Kommentar', data.message || '—'], ['Eingegangen', `${received} (Europe/Berlin)`],
  ];
  const htmlRows = rows.map(([label, value]) => `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(label)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`).join('');
  const plain = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  return {
    subject: `Neue Tischanfrage: ${data.date} ${data.time} · ${data.name}`,
    text: `Neue, noch nicht bestätigte Tischanfrage\n\n${plain}\n\nDie Anfrage muss vom Bavaria-Team persönlich bestätigt werden.`,
    html: `<h2>Neue, noch nicht bestätigte Tischanfrage</h2><table>${htmlRows}</table><p><strong>Die Anfrage muss vom Bavaria-Team persönlich bestätigt werden.</strong></p>`,
  };
}

module.exports = { buildMessage, escapeHtml, validateReservation };
