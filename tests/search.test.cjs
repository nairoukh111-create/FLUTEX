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
