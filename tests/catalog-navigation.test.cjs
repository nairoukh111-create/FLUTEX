const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');

function finder(file,id,language='en') {
  const nodes=new Map();
  const node=selector=>{
    if(!nodes.has(selector))nodes.set(selector,{value:'',tagName:'INPUT',innerHTML:'',listeners:{},
      addEventListener(event,fn){this.listeners[event]=fn;},querySelectorAll(){return [];}});
    return nodes.get(selector);
  };
  const container={querySelector:node,querySelectorAll:()=>[],addEventListener(){}};
  const document={documentElement:{lang:language},querySelector:selector=>selector===id?container:node(selector)};
  vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js',file),'utf8'),{document});
  return nodes;
}

test('tool finder rendering and filtering retain links to every served detail page',()=>{
  for(const [file,id,results,count] of [
    ['carbide-finder.v15.js','#carbide-tools','[data-carbide-results]',9],
    ['hss-finder.v15.js','#hss-drills','[data-finder-results]',11],
    ['modular-drill-finder.v15.js','#modular-drilling','[data-modular-results]',10],
  ]) {
    const nodes=finder(file,id),result=nodes.get(results);
    assert.ok(result,file+' initializes');
    const links=[...result.innerHTML.matchAll(/<h5><a href="(\/tools\/[^"#?]+)">([^<]+)<\/a><\/h5>/g)];
    assert.equal(links.length,count,file);
    for(const [,url] of links)assert.ok(fs.existsSync(path.join(root,url+'.html')),url);
    assert.match(result.innerHTML,/data-open-/, 'Existing specification dialogs remain available');
    const search=[...nodes.entries()].find(([key])=>key.includes('search'))[1];
    search.value='unmatched-test-fixture';search.listeners.input();
    assert.equal(result.innerHTML,'');
    search.value='';search.listeners.input();
    assert.equal([...result.innerHTML.matchAll(/<h5><a href=/g)].length,count);
  }
});

test('plasma finder keeps real language-specific reference links after a part-number search',()=>{
  for(const language of ['en','ar']) {
    const nodes=finder('plasma-finder.v16.js','#plasma-finder',language);
    const results=nodes.get('[data-plasma-results]'),search=nodes.get('[data-plasma-search]');
    assert.equal([...results.innerHTML.matchAll(/<h5><a href=/g)].length,40);
    search.value='420249';search.listeners.input();
    const prefix=language==='ar'?'/ar':'';
    assert.ok(results.innerHTML.includes('href="'+prefix+'/plasma/hypertherm-xpr170-xpr300-consumables"'));
    assert.equal([...results.innerHTML.matchAll(/<h5><a href=/g)].length,1);
    assert.match(results.innerHTML,/data-open-plasma=/);
  }
});
