const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const text = file => fs.readFileSync(path.join(root, file), 'utf8');
const img = '/assets/catalog/flutex-laser-card-2026-11-12.webp';

test('Bilingual laser catalog preserves visible part coverage, filtering and supplier anonymity', () => {
  for (const file of ['laser-consumables.html', 'ar/laser-consumables.html']) {
    const html = text(file);
    assert.equal((html.match(/class="laser-item"/g)||[]).length, 77, file);
    assert.equal((html.match(/class="laser-family"/g)||[]).length, 9, file);
    assert.match(html, /id="laser-search"/);
    assert.match(html, /id="laser-brand"/);
    assert.match(html, /id="laser-application"/);
    assert.match(html, /data-laser-pick="all"/);
    assert.match(html, /class="laser-hero-image"><img src="\/assets\/catalog\/flutex-laser-home\.avif"/);
    assert.doesNotMatch(html, /zplaser|zplasers|zplasers\.com/i);
  }
  const js = text('assets/js/laser-catalog.v1.js');
  assert.match(js, /addEventListener\('input',update\)/);
  assert.match(js, /addEventListener\('change',update\)/);
  assert.ok(fs.statSync(path.join(root, img.slice(1))).size > 3000);
});

test('Owner-approved laser card artwork is present in every localized catalog entry', () => {
  for (const file of ['index.html','products.html','ar/index.html','ar/products.html']) {
    const html=text(file);
    const card=html.match(/<a class="catalog-home-card" href="\/(?:ar\/)?laser-consumables">[\s\S]*?<\/a>/);
    assert.ok(card,file);
    assert.ok(card[0].includes(img),file);
    assert.doesNotMatch(card[0], /zplaser|zplasers/i);
  }
});
