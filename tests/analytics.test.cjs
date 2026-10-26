const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('../assets/js/analytics.v17.js'), 'utf8');
function setup(saved, hostname = 'flutexindustrial.com', options = {}) {
  const nodes = [], listeners = {}, storage = new Map();
  if (saved) storage.set('flutex-analytics-choice-v1', JSON.stringify({value:saved,time:Date.now()}));
  function element(tag) {
    const node = {tag,children:[],events:{},hidden:false,
      appendChild(child){ this.children.push(child); return child; },
      setAttribute(){},addEventListener(name,fn){this.events[name]=fn;},focus(){},
      querySelector(){return this.children.find(x => x.tag === 'button');}};
    nodes.push(node); return node;
  }
  const document = {documentElement:{lang:options.lang || 'en'},title:'Contact FLUTEX',
    referrer:options.referrer ?? 'https://search.example/results?email=private@example.test#secret',cookie:'',
    head:element('head'),body:element('body'),createElement:element,
    querySelector(){return this.body;},addEventListener(name,fn){listeners[name]=fn;}};
  const window = {};
  const context = {window,document,location:{hostname,origin:'https://' + hostname,pathname:options.pathname || '/contact',search:options.search || '?email=private@example.test',hash:'#secret'},
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},URL,URLSearchParams,Date};
  vm.runInNewContext(source, context);
  return {window,document,nodes,listeners,
    rerun(){vm.runInNewContext(source, context);},
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
test('approved UTM labels reach the official campaign fields while URLs remain clean', () => {
  const page=setup('accepted','flutexindustrial.com',{search:
    '?utm_source=whatsapp&utm_medium=social&utm_campaign=ksa_plasma_2026q4&utm_content=brochure&utm_term=cnc+cutting+oil&email=private@example.test&product=Confidential'});
  const config=page.calls().find(c=>c[0]==='config')[2];
  assert.equal(config.campaign_source,'whatsapp');
  assert.equal(config.campaign_medium,'social');
  assert.equal(config.campaign_name,'ksa_plasma_2026q4');
  assert.equal(config.campaign_content,'brochure');
  assert.equal(config.campaign_term,'cnc cutting oil');
  assert.equal(config.page_location,'https://flutexindustrial.com/contact');
  assert.equal(config.campaign_id,'');
  assert.ok(!JSON.stringify(page.calls()).includes('private@example.test'));
  assert.ok(!JSON.stringify(page.calls()).includes('Confidential'));
  const defaults=page.calls().find(c=>c[0]==='set')[1];
  assert.equal(defaults.page_location,config.page_location);
  assert.equal(defaults.page_referrer,'https://search.example/');
});
test('ambiguous, overlong and recognizable sensitive campaign values are rejected', () => {
  for (const search of [
    '?utm_source=private%40example.test',
    '?utm_source=google&utm_source=chatgpt.com',
    '?utm_source=%0D%0Aprivate',
    '?utm_source=https%3A%2F%2Fexample.test%2Fprivate',
    '?utm_source=966531699987',
    '?utm_source='+ 'x'.repeat(101),
    '?utm_source=eyJhbGciOiJIUzI1NiJ9.test.signature'
  ]) {
    const page=setup('accepted','flutexindustrial.com',{search});
    assert.equal(page.calls().find(c=>c[0]==='config')[2].campaign_source,'',search);
  }
  const page=setup('accepted','flutexindustrial.com',{
    search:'?utm_campaign=private%40example.test&utm_content=053+169+9987&utm_term=Confidential%2FFile&utm_id=private%40example.test'
  });
  const config=page.calls().find(c=>c[0]==='config')[2];
  for (const field of ['campaign_name','campaign_content','campaign_term','campaign_id']) assert.equal(config[field],'');
  assert.ok(!JSON.stringify(page.calls()).includes('private@example.test'));
});
test('untagged referrals keep their actual domain without invented campaign or AI source', () => {
  for (const referrer of [
    'https://www.google.com/search?q=private@example.test',
    'https://chatgpt.com/c/private-conversation?secret=hidden',
    'https://claude.ai/chat/private-conversation',
    'https://www.perplexity.ai/search/private-query',
    'https://gemini.google.com/app/private-conversation',
    'https://www.bing.com/search?q=hidden',
    'https://www.linkedin.com/private/path',
    'https://www.facebook.com/private/path'
  ]) {
    const page=setup('accepted','flutexindustrial.com',{referrer});
    const config=page.calls().find(c=>c[0]==='config')[2];
    assert.equal(config.page_referrer,new URL(referrer).origin+'/');
    assert.equal(config.campaign_source,'');
    assert.ok(!JSON.stringify(page.calls()).includes('private-conversation'));
    assert.ok(!JSON.stringify(page.calls()).includes('secret='));
  }
  const direct=setup('accepted','flutexindustrial.com',{referrer:''});
  assert.equal(direct.calls().find(c=>c[0]==='config')[2].page_referrer,'');
  assert.equal(direct.calls().find(c=>c[0]==='config')[2].campaign_source,'');
  const invalid=setup('accepted','flutexindustrial.com',{referrer:'javascript:private'});
  assert.equal(invalid.calls().find(c=>c[0]==='config')[2].page_referrer,'');
});
test('duplicate script execution installs one panel, tag, and page view', () => {
  const page=setup('accepted');page.rerun();page.click('Allow analytics');
  assert.equal(page.scripts().length,1);
  assert.equal(page.nodes.filter(n=>n.tag==='section').length,1);
  assert.equal(page.calls().filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
});
test('Arabic and English contact methods and product RFQ intent use identical event names', () => {
  for (const lang of ['en','ar']) {
    const page=setup('accepted','flutexindustrial.com',{lang,pathname:lang==='ar'?'/ar/plasma-consumables':'/plasma-consumables',
      search:'?utm_source=linkedin&utm_medium=social&utm_campaign=%D8%A8%D9%84%D8%A7%D8%B2%D9%85%D8%A7'});
    assert.equal(page.calls().find(c=>c[0]==='config')[2].campaign_name,'بلازما');
    for (const [href,method] of [
      ['https://wa.me/966531699987?text=private@example.test','whatsapp'],
      ['mailto:sales@flutexindustrial.com?body=private@example.test','email'],
      ['tel:+966531699987','phone']
    ]) {
      page.listeners.click({target:{closest:()=>({getAttribute:()=>href})}});
      const event=page.calls().at(-1);
      assert.equal(event[1],'contact_click');assert.equal(event[2].contact_method,method);
    }
    page.listeners.click({target:{closest:()=>({getAttribute:()=>'/ar/contact?product=private@example.test'})}});
    assert.equal(page.calls().at(-1)[1],'product_enquiry_click');
    assert.equal(page.calls().at(-1)[2].contact_method,'rfq');
    const count=page.calls().length;
    page.listeners.click({target:{closest:()=>({getAttribute:()=> 'https://other.test/contact?product=private@example.test'})}});
    page.listeners.click({target:{closest:()=>({getAttribute:()=> '/contact#whatsapp-contact'})}});
    assert.equal(page.calls().length,count);
    assert.ok(!JSON.stringify(page.calls()).includes('private@example.test'));
    assert.ok(!page.calls().some(c=>c[1]==='generate_lead'));
  }
});
