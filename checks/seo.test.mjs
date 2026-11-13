import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = readFileSync(resolve(root, 'pages/index.html'), 'utf8');
const generated = readFileSync(resolve(root, 'index.html'), 'utf8');
const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');

const count = (text, pattern) => [...text.matchAll(pattern)].length;
const jsonLd = (html) => {
  const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/i);
  assert.ok(match, 'JSON-LD block is required');
  return JSON.parse(match[1]);
};

for (const [label, html] of [['source', source], ['generated', generated]]) {
  test(`${label} HTML has one local-business H1`, () => {
    assert.equal(count(html, /<h1\b/gi), 1);
    assert.match(html, /<h1[^>]*>[\s\S]*Bavaria Lounge Hildesheim[\s\S]*Shisha Bar &amp; Café|<h1[^>]*>[\s\S]*Bavaria Lounge Hildesheim[\s\S]*Shisha Bar & Café/i);
  });

  test(`${label} HTML has indexable canonical metadata`, () => {
    assert.match(html, /<title>Bavaria Lounge Hildesheim \| Shisha Bar, Café &amp; Cocktails<\/title>|<title>Bavaria Lounge Hildesheim \| Shisha Bar, Café & Cocktails<\/title>/i);
    assert.match(html, /<meta name="description" content="[^"]+">/i);
    assert.match(html, /<link rel="canonical" href="https:\/\/bavaria-lounge\.de\/">/i);
    assert.match(html, /<meta name="robots" content="index,follow,max-image-preview:large">/i);
    assert.doesNotMatch(html, /noindex/i);
    assert.doesNotMatch(html, /<link rel="canonical"[^>]+(?:localhost|netlify\.app)/i);
  });

  test(`${label} JSON-LD is valid and uses confirmed business data`, () => {
    const data = jsonLd(html);
    assert.equal(data['@id'], 'https://bavaria-lounge.de/#business');
    assert.equal(data.name, 'Bavaria Lounge');
    assert.equal(data.telephone, '+491749073926');
    assert.equal(data.address.streetAddress, 'Angoulêmeplatz 3');
    assert.equal(data.address.postalCode, '31134');
    assert.equal(data.address.addressLocality, 'Hildesheim');
    assert.equal(data.openingHours, undefined);
    assert.equal(data.openingHoursSpecification, undefined);
  });

  test(`${label} HTML has no expired event or private-draft notice`, () => {
    assert.doesNotMatch(html, /Halloween Karaoke Party|2026-10-31T22:00/i);
    assert.doesNotMatch(html, /Privater Designentwurf/i);
  });

  test(`${label} HTML preserves booking, menu and language controls`, () => {
    assert.match(html, /id="booking-form"/);
    assert.match(html, /id="menu-panel"/);
    assert.match(html, /data-language="de"/);
    assert.match(html, /data-language="en"/);
    assert.match(html, /data-language="uk"/);
  });
}

test('robots.txt allows crawling and advertises the canonical sitemap', () => {
  assert.match(robots, /User-agent:\s*\*/i);
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, /Sitemap:\s*https:\/\/bavaria-lounge\.de\/sitemap\.xml/i);
  assert.doesNotMatch(robots, /Disallow:\s*\//i);
});

test('sitemap contains only the canonical production URL', () => {
  assert.match(sitemap, /<loc>https:\/\/bavaria-lounge\.de\/<\/loc>/);
  assert.match(sitemap, /<lastmod>2026-11-13<\/lastmod>/);
  assert.equal(count(sitemap, /<url>/g), 1);
  assert.doesNotMatch(sitemap, /localhost|netlify\.app|\?utm_/i);
});

test('source and generated HTML contain the same SEO facts', () => {
  for (const marker of [
    'Bavaria Lounge Hildesheim | Shisha Bar, Café & Cocktails',
    'https://bavaria-lounge.de/',
    'Angoulêmeplatz 3',
    'assets/social-preview-v2.jpg?v=2',
    'eventsCurrentTitle',
  ]) {
    assert.ok(source.includes(marker), `source missing ${marker}`);
    assert.ok(generated.includes(marker), `generated missing ${marker}`);
  }
});

test('critical local assets exist', () => {
  for (const path of [
    'assets/app.js',
    'assets/booking.js',
    'assets/menu.js',
    'assets/style.css',
    'assets/hero.webp',
    'assets/hero-mobile.webp',
    'assets/social-preview-v2.jpg',
    'assets/events/opening-hours.webp',
  ]) assert.ok(existsSync(resolve(root, path)), `${path} is missing`);
});

test('every static asset referenced by the source HTML exists', () => {
  const references = [...source.matchAll(/(?:src|href|data-poster)="\{\{assets\.base\}\}\/([^"?#]+)(?:\?[^"#]*)?"/g)]
    .map((match) => `assets/${match[1]}`);
  assert.ok(references.length > 10, 'expected static asset references');
  for (const path of new Set(references)) {
    assert.ok(existsSync(resolve(root, path)), `${path} is referenced but missing`);
  }
});
