const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('../assets/js/analytics.v16.js'), 'utf8');
function setup(saved, hostname = 'flutexindustrial.com') {
  const nodes = [], listeners = {}, storage = new Map();
  if (saved) storage.set('flutex-analytics-choice-v1', JSON.stringify({value:saved,time:Date.now()}));
  function element(tag) {
    const node = {tag,children:[],events:{},hidden:false,
      appendChild(child){ this.children.push(child); return child; },
      setAttribute(){},addEventListener(name,fn){this.events[name]=fn;},focus(){},
      querySelector(){return this.children.find(x => x.tag === 'button');}};
    nodes.push(node); return node;
  }
  const document = {documentElement:{lang:'en'},title:'Contact FLUTEX',
    referrer:'https://search.example/results?email=private@example.test#secret',cookie:'',
    head:element('head'),body:element('body'),createElement:element,
    querySelector(){return this.body;},addEventListener(name,fn){listeners[name]=fn;}};
  const window = {};
  vm.runInNewContext(source, {window,document,location:{hostname,origin:'https://' + hostname,pathname:'/contact',search:'?email=private@example.test',hash:'#secret'},
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},URL,Date});
  return {window,document,nodes,listeners,
    click(label){nodes.find(n=>n.tag==='button' && n.textContent===label).events.click();},
    scripts(){return document.head.children.filter(n=>n.tag==='script');},
    calls(){return (window.dataLayer||[]).map(args=>Array.from(args));}};
}
test('Google remains unloaded before permission and after declining', () => {
  const page=setup(); assert.equal(page.scripts().length,0);
  page.click('Decline'); assert.equal(page.scripts().length,0);
  page.listeners.rfq_draft_prepared({detail:{email:'private@example.test'}});
  assert.equal(page.calls().length,0);
});
test('permission starts exactly one tag with sanitized page and referrer context', () => {
  const page=setup();page.click('Allow analytics');page.click('Allow analytics');
  assert.equal(page.scripts().length,1);
  const config=page.calls().find(c=>c[0]==='config')[2];
  assert.equal(config.page_location,'https://flutexindustrial.com/contact');
  assert.equal(config.page_referrer,'https://search.example/');
  assert.equal(config.allow_google_signals,false);
  assert.equal(config.send_page_view,false);
  assert.equal(page.calls().filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
  assert.ok(!JSON.stringify(page.calls()).includes('private@example.test'));
});
test('contact and draft events discard link queries and arbitrary RFQ details', () => {
  const page=setup('accepted');
  page.listeners.click({target:{closest:()=>({getAttribute:()=> 'https://wa.me/966531699987?text=private@example.test'})}});
  page.listeners.rfq_draft_prepared({detail:{email:'private@example.test',message:'secret'}});
  const events=page.calls().filter(c=>c[0]==='event');
  assert.equal(events.at(-2)[1],'contact_click');assert.equal(events.at(-2)[2].contact_method,'whatsapp');
  assert.equal(events.at(-1)[1],'rfq_draft_prepared');
  assert.ok(!JSON.stringify(events).includes('private@example.test'));
  assert.ok(!events.some(c=>c[1]==='generate_lead'));
});
test('withdrawal stops further interaction events', () => {
  const page=setup('accepted');page.click('Decline');const count=page.calls().length;
  page.listeners.rfq_service_accepted({});assert.equal(page.calls().length,count);
  assert.equal(page.window['ga-disable-G-NHDB1BF095'],true);
});
test('preview hosts never send production analytics even with saved consent', () => {
  const page=setup('accepted','preview.flutex.pages.dev');
  assert.equal(page.scripts().length,0);assert.equal(page.calls().length,0);
});
