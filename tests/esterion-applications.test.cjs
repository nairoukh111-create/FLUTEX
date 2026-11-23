const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('ESTERION product pages contain truthful bilingual application evidence, canonical and machine names',()=>{
for(const [file,locale] of [['oils/flutex-esterion-35.html','en'],['ar/oils/flutex-esterion-35.html','ar']]){
 const html=read(file);
 const url='https://flutexindustrial.com/'+file.replace(/\.html$/,'');
 assert.ok(html.includes('rel="canonical" href="'+url+'"'),file);
 assert.ok(html.includes('href="/assets/css/esterion-applications.v1.css"'),file);
 for(const term of ['5-Axis CNC','Gear','MQL','310 C','35 cSt','type="application/ld+json"'])assert.ok(html.includes(term),file+': '+term);
 assert.ok(html.includes('esterion-application-matrix'),file);
 assert.ok(html.includes('countryOfOrigin'),file);
 assert.ok(html.includes('Switzerland'),file);
 assert.ok(html.includes(locale==='ar'?'سويسري المنشأ':'Swiss-origin'),file);
 const matrix=html.match(/<table[^>]+id="esterion-application-matrix"[\s\S]*?<\/table>/)?.[0];
 assert.ok(matrix,file);
 assert.equal((matrix.match(/<th /g)||[]).length,2,file);
 assert.equal((matrix.match(/<tr>/g)||[]).length,16,file);
 assert.ok(html.includes('esterion-review-only'),file);
 assert.ok(html.includes('esterion-field-observation'),file);
 assert.doesNotMatch(html,/EMMEGI|ELUMATEC|Field-tested|TDS-listed process|Evidence \/ scope|حالة التحقق/,file);
 assert.ok(html.includes('gcc-industrial-consumables'),file);
 assert.ok(html.includes('flutex-esterion-35-tds.pdf'),file);
 assert.ok(!/aggregateRating|"price"|"availability":"InStock"/.test(html),file);
}
});
test('ESTERION application page sitemaps remain bilingual',()=>{
 const map=read('sitemap.xml');
 for(const locale of ['','ar/'])assert.ok(map.includes('<loc>https://flutexindustrial.com/'+locale+'oils/flutex-esterion-35</loc><lastmod>2026-11-23</lastmod>'));
});

test('ESTERION all published machining terms appear in EN/AR pages without changing the matrix',()=>{
 const terms=['5-Axis CNC','Gear hobbing','Gear shaping','Power skiving','Broaching','Cold sawing','CNC milling','CNC turning','Reaming','Thread cutting','Gear milling','Face milling','Profile milling','Slot milling','Pocket milling','Swiss-type','Thread milling','Turn-mill','Gear shaving','Slotting','Punching','CNC drilling','Deep-hole drilling','Counterboring'];
 for(const locale of ['','ar/']){
  const html=read(locale+'oils/flutex-esterion-35.html');
  const content=html.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').toLowerCase();
  for(const term of terms)assert.ok(content.includes(term.toLowerCase()),locale+': '+term);
  for(const group of ['esterion-machining-processes','esterion-5-axis','esterion-gears','esterion-milling','esterion-turning','esterion-finishing'])assert.ok(html.includes('id="'+group+'"'),locale+': '+group);
  const start=html.indexOf('<table class="flutex-oil-table esterion-table" id="esterion-application-matrix">');
  assert.ok(start>=0,locale);
  const matrix=html.slice(start,html.indexOf('</table>',start)+8);
  assert.equal((matrix.match(/<th /g)||[]).length,2,locale);
  assert.equal((matrix.match(/<tr>/g)||[]).length,16,locale);
  assert.ok(html.includes('id="esterion-review-only"'),locale);
  assert.ok(!html.includes('حالة التحقق')&&!html.includes('Evidence / scope'),locale);
 }
});
