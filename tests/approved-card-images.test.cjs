const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const map={
  'welding-consumables':['flutex-welding-card-2026-11-12.webp',332470],
  'ball-transfer-units':['flutex-ball-transfer-card-2026-11-12.webp',431950],
  'laser-consumables':['flutex-laser-card-2026-11-12.webp',310762],
  'cutting-fluid':['flutex-cnc-fluid-card-2026-11-12.webp',463250],
  'plasma-consumables':['flutex-plasma-card-2026-11-12.webp',335046]
};
test('Twenty category-card placements point to the five owner-approved full-resolution images',()=>{
  for(const file of ['index.html','products.html','ar/index.html','ar/products.html']){
    const text=fs.readFileSync(path.join(root,file),'utf8');
    assert.equal((text.match(/class="catalog-home-card"/g)||[]).length,7,file);
    for(const [category,[filename]] of Object.entries(map)){
      const route=(file.startsWith('ar/')?'/ar/':'/')+category;
      const open='<a class="catalog-home-card" href="'+route+'">';
      const start=text.indexOf(open);
      assert.ok(start>=0,file+' '+category);
      const close=text.indexOf('</a>',start);
      const card=text.slice(start,close+4);
      assert.ok(card.includes('src="/assets/catalog/'+filename+'"'),file+' '+category);
      assert.ok(card.includes('width="1122" height="1402"'),file+' '+category);
      assert.equal(text.split('src="/assets/catalog/'+filename+'"').length-1,1,file+' '+category);
    }
    assert.ok(text.includes('src="/assets/catalog/cutting-tools-card-zoom-2026-11.avif"'));
    assert.ok(text.includes('src="/assets/catalog/industrial-saw-blades-card.v1.webp"'));
  }
});
test('All uploaded images retain their expected high-quality binary content',()=>{
  for(const [category,[filename,byteSize]] of Object.entries(map)){
    const bytes=fs.readFileSync(path.join(root,'assets/catalog',filename));
    assert.equal(bytes.byteLength,byteSize,category);
    assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF',category);
    assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP',category);
  }
});
