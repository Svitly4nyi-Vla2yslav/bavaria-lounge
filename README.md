# Bavaria Cocktail Lounge

Premium multilingual website for Bavaria Cocktail Lounge / Shisha Bar in Hildesheim.

**Live site:** https://bavaria.sabsus.site/de/  
**GitHub Pages source:** this repository contains the website source and project assets.

## Features

- German, English and Ukrainian language controls.
- Premium black-and-gold glass styling, responsive navigation and continuous background smoke.
- Interactive menu, moving gallery and responsive booking form.
- Separate email-backed reservation API with validation, CORS, rate limiting and bot protection.

## Menu and reservation status

Menu items, flavours and prices are examples for presentation and are not confirmed by the venue. A form submission is only a reservation request. The Bavaria team must confirm every request personally.

## Run locally

Start the static frontend:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. On Windows, `python -m http.server 8000` may be required.

Install and start the separate API in another terminal:

```sh
cd backend
npm install
cp .env.example .env
npm start
```

On Windows PowerShell, use `Copy-Item .env.example .env`. Fill `.env` before starting; it is ignored by Git. The API defaults to http://localhost:8787. `GET http://localhost:8787/health` should return `{"status":"ok"}`.

## API environment

`backend/.env` must contain:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=the-gmail-account-that-sends-mail@gmail.com
SMTP_APP_PASSWORD=your-google-app-password
RESERVATION_TO_EMAIL=svetli4nuyvla2islav@gmail.com
FRONTEND_ORIGINS=http://localhost:8000,http://127.0.0.1:8000,https://bavaria.sabsus.site
```

Use port `465` with `SMTP_SECURE=true`, or port `587` with `SMTP_SECURE=false`. `SMTP_USER` is the Gmail account used to send; it does not have to equal `RESERVATION_TO_EMAIL`. Never commit `.env` or put an app password in frontend code.

For Gmail, enable 2-Step Verification on the sending Google account, create an App Password for the API, and place the generated value only in `SMTP_APP_PASSWORD` on the API host. Do not use the normal Gmail password.

## Frontend API address

The frontend remains static. `build-preview.py` reads `BAVARIA_RESERVATION_API_URL` and writes the API base URL into the generated root `index.html` and review build:

```sh
BAVARIA_RESERVATION_API_URL=https://api.example.com python3 build-preview.py
```

PowerShell equivalent:

```powershell
$env:BAVARIA_RESERVATION_API_URL='https://api.example.com'
python build-preview.py
```

For the authored SABSUS template, provide the same value as `reservation.apiBase`, or set `window.BAVARIA_RESERVATION_API_URL` before `assets/app.js` loads. The API must be deployed to a separate Node.js-capable host; GitHub Pages and other static hosts cannot run it. Add the final frontend origins to `FRONTEND_ORIGINS`. The repository is intentionally not tied to a hosting provider.

## Project files

- `index.html` — generated local/static entry page.
- `pages/index.html` — SABSUS page template.
- `assets/` — frontend code, translations and image assets.
- `backend/` — reservation API, SMTP integration and isolated Node dependencies.
- `site.json`, `templates/` — SABSUS source contract.
- `build-preview.py` — creates the root page, review HTML and source archive.
- `checks/` — frontend behavior and motion tests.

## Verify and prepare

```sh
node --check assets/app.js
node --check assets/booking.js
node --check assets/motion.js
node checks/booking.test.cjs
node checks/motion.test.cjs
cd backend && npm test && npm audit --omit=dev && cd ..
python3 build-preview.py
```

API tests inject a fake mail transport and never contact Gmail. Do not use real SMTP credentials in tests. Generated archives and review deliverables are excluded from Git.

The software is MIT licensed; project photos and generated visual assets may have separate reuse rights.
