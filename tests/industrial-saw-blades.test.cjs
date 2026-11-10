const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
test('Industrial saw blades catalog includes 35 families and interactive controls',()=>{
 for(const file of ['industrial-saw-blades.html','ar/industrial-saw-blades.html']){
 const h=read(file);
 assert.equal((h.match(/class="saw-item"/g)||[]).length,35,file);
 assert.equal((h.match(/class="saw-family"/g)||[]).length,6,file);
 for(const id of ['saw-search','saw-material','saw-tech','saw-form','saw-diameter','saw-bore','saw-kerf','saw-teeth'])assert.ok(h.includes('id="'+id+'"'),file+':'+id);
 assert.match(h,/industrial-saw-blades-card\.v1\.webp/);
 assert.doesNotMatch(h,/source-company-name|supplier-logo|supplier-model-series/i);
 }
 assert.ok(fs.statSync(path.join(root,'assets/catalog/industrial-saw-blades-card.v1.webp')).size>5000);
});
test('Saw category adds seventh card while retired groups remain removed',()=>{
 for(const file of ['index.html','products.html','ar/index.html','ar/products.html']){
 const h=read(file);
 assert.equal((h.match(/class="catalog-home-card"/g)||[]).length,7,file);
 assert.deepEqual([...h.matchAll(/class="category-no">(\d{2}) \/ 07/g)].map(x=>x[1]),['01','02','03','04','05','06','07'],file);
 assert.match(h,/href="\/(?:ar\/)?industrial-saw-blades"/);
 assert.doesNotMatch(h,/href="\/(?:ar\/)?cnc-tools"|href="\/(?:ar\/)?special-tools"/);
 }
 for(const url of ['/industrial-saw-blades','/ar/industrial-saw-blades'])assert.ok(read('sitemap.xml').includes('<loc>https://flutexindustrial.com'+url+'</loc>'));
});
