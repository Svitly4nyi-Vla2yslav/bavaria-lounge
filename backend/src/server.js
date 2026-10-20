'use strict';

const http = require('node:http');
const nodemailer = require('nodemailer');
const { createHandler } = require('./app');

const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_APP_PASSWORD', 'RESERVATION_TO_EMAIL', 'FRONTEND_ORIGINS'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
const port = Number(process.env.PORT || 8787);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_APP_PASSWORD },
  disableFileAccess: true,
  disableUrlAccess: true,
});
http.createServer(createHandler({ transporter })).listen(port, () => {
  console.log(`Bavaria reservations API listening on port ${port}`);
});
