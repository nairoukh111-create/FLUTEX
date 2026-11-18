const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('bilingual saw catalogue preserves product families and expands published sizing',()=>{
 for(const page of ['industrial-saw-blades.html','ar/industrial-saw-blades.html']){
  const h=read(page);
  assert.equal((h.match(/class="saw-item"/g)||[]).length,35,page);
  assert.equal((h.match(/class="saw-family"/g)||[]).length,6,page);
  assert.equal((h.match(/class="saw-dimensions"/g)||[]).length,28,page);
  assert.equal((h.match(/data-pick-size/g)||[]).length,180,page);
  assert.ok(h.includes('id="saw-common-cold"'),page);
  assert.ok(h.includes('id="saw-common-aluminum"'),page);
  assert.ok(h.includes('saw-safety-title'),page);
  assert.ok(h.includes('710</td>') && h.includes('5.5</td>'),page);
  assert.ok(h.includes('saw-catalog-ui.v2.css'),page);
  assert.ok(h.includes('saw-catalog-ui.v2.js'),page);
  assert.ok(h.includes('saw-cutting-guide'),page);
  assert.ok(h.includes('4/11/63'),page);
  assert.match(h,/id="saw-dimensions-34"[\s\S]*?<th scope="col">[^<]*[Dd]iameter|id="saw-dimensions-34"/);
  assert.ok(h.includes('id="saw-dimensions-35"'),page);
 }
});
test('saw size selection uses existing attachment-capable RFQ flow',()=>{
 const ui=read('assets/js/saw-catalog-ui.v2.js');
 const original=read('assets/js/industrial-saw-blades.v1.js');
 const contact=read('assets/js/rfq.v18.js');
 for(const s of [ui,original,contact])assert.doesNotThrow(()=>new Function(s));
 assert.match(ui,/candidate\(value\)/);
 assert.match(ui,/type==='pipe-hss'/);
 assert.match(ui,/index===34/);
 assert.match(ui,/saw-common-aluminum/);
 assert.match(ui,/drawBlade\(/);
 assert.match(ui,/drawTool\(/);
 assert.match(ui,/const plates=/);
 assert.match(original,/category:'Industrial Saw Blades'/);
 assert.match(original,/\/contact/);
 assert.doesNotMatch(original,/mailto:sales@flutexindustrial\.com\?subject/);
 assert.match(contact,/inbound\.get\('category'\)/);
});
