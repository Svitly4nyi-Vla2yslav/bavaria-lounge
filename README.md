# Bavaria Cocktail Lounge

Premium multilingual website for Bavaria Cocktail Lounge / Shisha Bar in Hildesheim.

**Live site:** https://bavaria.sabsus.site/de/  
**GitHub Pages source:** this repository contains the website source and project assets.

## Features

- German, English and Ukrainian language controls.
- Premium black-and-gold glass styling, responsive navigation, smoke intro and continuous background smoke.
- Automatically moving image gallery and smooth scroll reveals.
- Interactive menu with cocktails, spirits, alcohol-free drinks, beer, shisha flavours and a group celebration package.
- Individual centered preview images for drinks, beer and shisha flavour combinations.
- Venue address, map link, social profiles and phone contact.

## Menu and contact status

Menu items, flavours and prices are examples for presentation and are not confirmed by the venue. The €70 group package is also an illustrative example. Please confirm the actual offer with Bavaria before ordering.

The reservation form prepares text for the guest to send through Instagram; it does not submit data to a server or send email. Email and WhatsApp remain placeholders. Instagram posts are not dynamically synchronized. The gallery uses project images and photos supplied for this website.

## Run locally

Python 3 is sufficient; no package installation is needed:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000.

## Project files

- `index.html` — local entry page.
- `pages/index.html` — SABSUS page template.
- `assets/` — application code, translations and image assets.
- `site.json`, `templates/` — SABSUS source contract.
- `build-preview.py` — creates a review HTML and SABSUS upload archive.
- `checks/motion.test.cjs` — smoke and gallery motion checks.
- `integration/instagram-worker.mjs` — optional server adapter, not deployed.

## Verify and prepare

```sh
node --check assets/app.js
node --check assets/motion.js
node checks/motion.test.cjs
python3 build-preview.py
```

Generated archives and review deliverables are excluded from Git. The software is MIT licensed; project photos and generated visual assets are provided for this website and may have separate reuse rights.
