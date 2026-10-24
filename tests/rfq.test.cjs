const {test} = require('node:test');
const assert = require('node:assert/strict');
const {emailDraft, enquiryText} = require('../assets/js/rfq.v17.js');
test('email preparation preserves Arabic text, quantities and references', () => {
  const values = {name:'محمد',company:'Factory',email:'buyer@example.test',partNumber:'420249',quantity:'50',message:'طلب & مقاسات + صورة'};
  const url = emailDraft('sales@flutexindustrial.com', values);
  const params = new URL(url).searchParams;
  assert.match(params.get('subject'), /420249/);
  assert.equal(params.get('body'), enquiryText(values));
  assert.match(params.get('body'), /طلب & مقاسات \+ صورة/);
  assert.match(params.get('body'), /Quantity: 50/);
});
test('a form value cannot inject extra mail headers through the subject', () => {
  const url = new URL(emailDraft('sales@flutexindustrial.com', {company:'Example\r\nBcc: other@example.test', message:'Keep this'}));
  assert.equal(url.searchParams.get('bcc'), null);
  assert.ok(!/[\r\n]/.test(url.searchParams.get('subject')));
});
test('public service status exposes only readiness and the public site key', async () => {
  const fs = require('node:fs');
  const code = fs.readFileSync(require.resolve('../functions/api/rfq.js'), 'utf8');
  const api = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  const response = api.onRequest({request:new Request('https://example.test/api/rfq'),env:{PRIVATE_SECRET:'never expose'}});
  assert.deepEqual(await response.json(), {available:false,turnstileSiteKey:''});
  const post = await api.onRequestPost({request:new Request('https://example.test/api/rfq',{method:'POST'}),env:{}});
  assert.equal(post.status, 503);
});
