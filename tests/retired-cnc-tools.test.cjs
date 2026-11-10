const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p), 'utf8');

test('CNC Tools top-level family stays retired', () => {
  for(const file of ['index.html','products.html','ar/index.html','ar/products.html']){
    const html=read(file);
    assert.equal((html.match(/class="catalog-home-card"/g)||[]).length,6,file);
    assert.deepEqual([...html.matchAll(/class="category-no">(\d{2}) \/ 06/g)].map(x=>x[1]),['01','02','03','04','05','06'],file);
    assert.doesNotMatch(html,/href="\/(?:ar\/)?cnc-tools"|<h3>CNC Tools<\/h3>|<h3>أدوات وملحقات CNC<\/h3>/i,file);
    assert.match(html,/href="\/(?:ar\/)?laser-consumables"/,file);
    assert.match(html,/href="\/(?:ar\/)?cutting-fluid"/,file);
  }
  assert.equal(fs.existsSync(path.join(root,'cnc-tools.html')),false);
  assert.equal(fs.existsSync(path.join(root,'ar/cnc-tools.html')),false);
});
test('Retired CNC Tools URLs redirect and cannot return in sitemap or search',()=>{
  const redirects=read('_redirects');
  assert.match(redirects,/^\/cnc-tools \/products 301/m);
  assert.match(redirects,/^\/ar\/cnc-tools \/ar\/products 301/m);
  assert.doesNotMatch(read('sitemap.xml'),/https:\/\/flutexindustrial\.com\/(?:ar\/)?cnc-tools(?:<|\b)/);
  assert.doesNotMatch(read('assets/js/search-index.v18.js'),/"url":"\/(?:ar\/)?cnc-tools"/);
});
test('Existing HTML must never link directly to retired CNC Tools family',()=>{
  const walk = dir => {
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      if(entry.isDirectory()){
        if(['.git','node_modules'].includes(entry.name))continue;
        walk(path.join(dir,entry.name));
      }else if(entry.name.endsWith('.html')){
        const content=fs.readFileSync(path.join(dir,entry.name),'utf8');
        assert.doesNotMatch(content, /href=["']\/(?:ar\/)?cnc-tools\/?["']/i, path.relative(root,path.join(dir,entry.name)));
      }
    }
  };
  walk(root);
});
