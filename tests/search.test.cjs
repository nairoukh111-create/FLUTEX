const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {search, norm} = require('../assets/js/global-search.v16.js');
const sandbox = {window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../assets/js/search-index.v18.js'), 'utf8'), sandbox);
const entries = sandbox.window.FLUTEX_SEARCH_INDEX;
test('known XPR reference finds the system in either site language', () => {
  assert.match(search(entries, '420249', 'en')[0].url, /hypertherm-xpr170-xpr300/);
  assert.match(search(entries, '420249', 'ar')[0].url, /^\/ar\/plasma\/hypertherm-xpr170-xpr300/);
});
test('the actual Arabic tool page and the new calculator can be discovered', () => {
  assert.ok(search(entries, 'ريش HSS', 'ar').some(x => x.url === '/ar/hss-drill-bits'));
  assert.ok(search(entries, 'RPM', 'en').some(x => x.url === '/parameters'));
  assert.equal(norm('أَلْمِنْيُوم ٤٢٠٢٤٩'), 'المنيوم 420249');
  assert.equal(search(entries, 'zzunmatchedtestzz').length, 0);
});

test('Published laser head models and optic dimensions resolve to the bilingual laser catalog', () => {
  assert.equal(search(entries, 'BOCI BLT421', 'en')[0].url, '/laser-consumables');
  assert.equal(search(entries, '34×5', 'ar')[0].url, '/ar/laser-consumables');
});

test('the new matching guides are the first result for specific buyer queries', () => {
  for (const [query, language, url] of [
    ['ball transfer unit selection', 'en', '/guides/ball-transfer-unit-selection'],
    ['laser consumables matching', 'en', '/guides/laser-consumables-matching-checklist'],
    ['MIG consumables matching', 'en', '/guides/mig-consumables-matching-checklist'],
    ['اختيار وحدات النقل الكروية', 'ar', '/ar/guides/ball-transfer-unit-selection'],
    ['دليل مطابقة مستهلكات الليزر', 'ar', '/ar/guides/laser-consumables-matching-checklist'],
    ['دليل مطابقة مستهلكات MIG', 'ar', '/ar/guides/mig-consumables-matching-checklist'],
  ]) assert.equal(search(entries, query, language)[0].url, url, query);
});
