# Bavaria Cocktail Lounge

Multilingual static website with a Netlify Function that delivers reservation requests to a private Telegram chat. A request is not confirmed until the Bavaria team confirms it personally.

## How it works

The existing form keeps its design, German/English/Ukrainian text, and fields: name, contact, date, time, guests, occasion, wishes, language, and a hidden honeypot. The browser sends JSON to:

```text
/.netlify/functions/reservation
```

The function reports success only after Telegram Bot API returns `ok: true`. Form values are cleared only on success and remain available after an error. The bot token and chat ID never enter frontend code.

## Netlify configuration

In **Netlify → Site configuration → Environment variables**, add:

```dotenv
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Use the token created by BotFather and the numeric private-chat ID. Do not commit either value. The tracked `.env.example` contains empty placeholders only; `.env`, `backend/.env`, and other `.env.*` secret files are ignored by Git.

`netlify.toml` publishes the current static root and loads functions from `netlify/functions`. Production needs no running computer, terminal, open port, or separate Node server—Netlify supplies the HTTPS endpoint.

## Local verification

Unit tests do not contact Telegram:

```powershell
node --test netlify/functions/reservation.test.mjs
node checks/booking.test.cjs
node checks/motion.test.cjs
python build-preview.py
```

To exercise the complete form locally, install the Netlify CLI or run `npx netlify-cli dev`, then open the local URL printed by Netlify. Put secrets only in an ignored local `.env` or use `netlify env:set`; never place them in `.env.example`.

After deployment, open the deployed site, submit a test reservation, confirm that the UI reports success, and verify the Telegram message. A GET request to the endpoint should return HTTP 405:

```text
https://YOUR-SITE.netlify.app/.netlify/functions/reservation
```

## Security behavior

The function limits requests to 16 KiB, caps field lengths, validates required values, rejects the honeypot, escapes Telegram HTML, applies an eight-second Telegram timeout, and handles malformed JSON, missing configuration, and Telegram failures with non-success HTTP responses. It logs neither tokens nor reservation details.

No separate backend service is required. Do not deploy the site until its owner explicitly requests it.
