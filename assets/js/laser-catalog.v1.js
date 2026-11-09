(() => {
'use strict';
const root=document.querySelector('#laser-catalog');if(!root)return;
const search=root.querySelector('#laser-search'),brand=root.querySelector('#laser-brand'),
application=root.querySelector('#laser-application'),count=root.querySelector('#laser-count'),
empty=root.querySelector('#laser-empty'),items=[...root.querySelectorAll('[data-laser-item]')],
families=[...root.querySelectorAll('[data-laser-family]')],chips=[...root.querySelectorAll('[data-laser-pick]')];
const ar=document.documentElement.lang==='ar';let family='all';
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/[٠-٩]/g,n=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(n))).replace(/×/g,'x').replace(/\s+/g,' ').trim();
function update(){
 const terms=norm(search.value).split(' ').filter(Boolean),b=norm(brand.value),a=norm(application.value);
 let visible=0;
 for(const item of items){
 const hay=norm(item.dataset.terms);
 const show=(family==='all'||item.dataset.family===family)&&terms.every(t=>hay.includes(t))&&(!b||norm(item.dataset.brand).includes(b))&&(!a||norm(item.dataset.application).includes(a));
 item.hidden=!show;if(show)visible++;
 }
 for(const section of families)section.hidden=![...section.querySelectorAll('[data-laser-item]')].some(item=>!item.hidden);
 for(const chip of chips){const chosen=chip.dataset.laserPick===family;chip.classList.toggle('is-active',chosen);chip.setAttribute('aria-pressed',String(chosen));}
 count.textContent=visible+(ar?' صنفًا مطابقًا':' matching items');empty.hidden=visible!==0;
}
search.addEventListener('input',update);brand.addEventListener('change',update);application.addEventListener('change',update);
for(const chip of chips)chip.addEventListener('click',()=>{family=chip.dataset.laserPick;update();});
root.querySelector('#laser-clear').addEventListener('click',()=>{search.value='';brand.value='';application.value='';family='all';update();search.focus();});
const p=new URLSearchParams(location.search),c=p.get('category');
if(c&&chips.some(x=>x.dataset.laserPick===c)){family=c;update();}
})();
