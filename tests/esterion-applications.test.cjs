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
 for(const term of ['EMMEGI','ELUMATEC','Gear','MQL','310 C','35 cSt','type="application/ld+json"'])assert.ok(html.includes(term),file+': '+term);
 assert.ok(html.includes('esterion-application-matrix'),file);
 assert.ok(html.includes('esterion-review-only'),file);
 assert.ok(html.includes('esterion-field-observation'),file);
 assert.ok(html.includes(locale==='ar'?'غير':'not an OEM'),file);
 assert.ok(html.includes('gcc-industrial-consumables'),file);
 assert.ok(html.includes('flutex-esterion-35-tds.pdf'),file);
 assert.ok(!/aggregateRating|"price"|"availability":"InStock"/.test(html),file);
}
});
test('ESTERION application page sitemaps remain bilingual',()=>{
 const map=read('sitemap.xml');
 for(const locale of ['','ar/'])assert.ok(map.includes('<loc>https://flutexindustrial.com/'+locale+'oils/flutex-esterion-35</loc><lastmod>2026-11-23</lastmod>'));
});
