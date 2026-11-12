const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const pairs=[
['gcc-industrial-consumables.html','ar/gcc-industrial-consumables.html','/gcc-industrial-consumables','/ar/gcc-industrial-consumables'],
['plasma-consumables-uae.html','ar/plasma-consumables-uae.html','/plasma-consumables-uae','/ar/plasma-consumables-uae']
];
test('GCC technical hubs and UAE plasma buyer guides are stable bilingual, indexable URLs',()=>{
for(const [en,ar,enUrl,arUrl] of pairs){
 for(const [file,url,peer] of [[en,enUrl,arUrl],[ar,arUrl,enUrl]]){
  const html=read(file);
  assert.match(html,/<h1>/,file);
  assert.ok(html.includes('rel="canonical" href="https://flutexindustrial.com'+url+'"'),file);
  assert.ok(html.includes('href="https://flutexindustrial.com'+peer+'"'),file);
  assert.match(html,/rel="alternate"/,file);
  assert.match(html,/rel="stylesheet" href="\/assets\/css\/supply-coverage\.v1\.css"/,file);
  assert.match(html,/rel="stylesheet" href="\/assets\/css\/gcc-seo\.v1\.css"/,file);
  assert.match(html,/type="application\/ld\+json"/,file);
  assert.doesNotMatch(html, /href="\/(?:ar\/)?special-tools"|href="\/(?:ar\/)?cnc-tools"/i,file);
 }
}
});
test('GCC hub includes all six markets and seven current catalog families without fake regional branches',()=>{
 const a=read('gcc-industrial-consumables.html');
 const b=read('ar/gcc-industrial-consumables.html');
 for(const c of ['Saudi Arabia','United Arab Emirates','Kuwait','Qatar','Bahrain','Oman'])assert.ok(a.includes(c),c);
 for(const c of ['السعودية','الإمارات العربية المتحدة','الكويت','قطر','البحرين','عُمان'])assert.ok(b.includes(c),c);
 for(const c of ['cutting-tools','industrial-saw-blades','plasma-consumables','laser-consumables','cutting-fluid','welding-consumables','ball-transfer-units']){
  assert.ok(a.includes('href="/'+c+'"'),c);
  assert.ok(b.includes('href="/ar/'+c+'"'),c);
 }
});
test('GCC and UAE region pages are in sitemap, internal search and site navigation',()=>{
 const xml=read('sitemap.xml');
 const js=read('assets/js/search-index.v18.js');
 for(const slug of ['gcc-industrial-consumables','ar/gcc-industrial-consumables','plasma-consumables-uae','ar/plasma-consumables-uae']){
  assert.ok(xml.includes('<loc>https://flutexindustrial.com/'+slug+'</loc>'),slug);
  assert.ok(js.includes('"url":"/'+slug+'"'),slug);
 }
 for(const file of ['index.html','products.html','plasma-consumables.html','laser-consumables.html','ar/index.html','ar/products.html','ar/plasma-consumables.html','ar/laser-consumables.html']){
  const html=read(file);
  assert.match(html,/class="gcc-market-strip"/,file);
  assert.ok(html.includes('href="/'+(file.startsWith('ar/')?'ar/':'')+'gcc-industrial-consumables"'),file);
 }
});
