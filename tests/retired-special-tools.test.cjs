const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = filename => fs.readFileSync(path.join(root, filename), 'utf8');

test('Retired Special Tools does not reappear in catalog cards', () => {
  for (const filename of ['index.html', 'products.html', 'ar/index.html', 'ar/products.html']) {
    const html = read(filename);
    assert.equal((html.match(/class="catalog-home-card"/g) || []).length, 6, filename);
    assert.deepEqual([...html.matchAll(/class="category-no">(\d{2}) \/ 06/g)].map(x => x[1]), ['01', '02', '03', '04', '05', '06'], filename);
    assert.doesNotMatch(html, /special-tools|Special Tools|أدوات صناعية خاصة|impact-bits\.webp|icon-special\.png/i, filename);
  }
});

test('Retired pages are absent, redirects remain and search/sitemap exclude them', () => {
  assert.equal(fs.existsSync(path.join(root, 'special-tools.html')), false);
  assert.equal(fs.existsSync(path.join(root, 'ar/special-tools.html')), false);
  assert.match(read('_redirects'), /^\/special-tools \/products 301/m);
  assert.match(read('_redirects'), /^\/ar\/special-tools \/ar\/products 301/m);
  assert.doesNotMatch(read('sitemap.xml'), /special-tools/i);
  assert.doesNotMatch(read('assets/js/search-index.v18.js'), /special-tools/i);
});

test('No HTML page links to the retired category', () => {
  const walk = dir => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.isDirectory()) {
        if (['.git', 'node_modules'].includes(item.name)) continue;
        walk(path.join(dir, item.name));
      } else if (item.name.endsWith('.html')) {
        const data = fs.readFileSync(path.join(dir, item.name), 'utf8');
        assert.doesNotMatch(data, /href=["']\/(?:ar\/)?special-tools\/?["']/i, path.relative(root, path.join(dir, item.name)));
      }
    }
  };
  walk(root);
});
