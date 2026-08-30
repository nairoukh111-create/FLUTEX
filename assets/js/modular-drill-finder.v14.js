(() => {
  const root = document.querySelector('#modular-drilling');
  if (!root) return;

  const families = [{"id":"mod-holder-3d","name":"Internal-Coolant Holder — 3×D","type":"Holder","insertMaterial":"Compatible with Carbide / HSS","workpieces":["Universal"],"depths":["3×D"],"min":10,"max":54.99,"accuracy":"System dependent","interface":"Replaceable-tip modular interface","image":"assets/modular-drill/holder.webp","summary":"Helical-flute, one-flat-shank holder with internal coolant for short drilling applications and direct insert replacement.","note":"ISO 9766 shank architecture. Holder tables cover nominal diameter groups from 10.0 mm through 54.99 mm."},{"id":"mod-holder-5d","name":"Internal-Coolant Holder — 5×D","type":"Holder","insertMaterial":"Compatible with Carbide / HSS","workpieces":["Universal"],"depths":["5×D"],"min":10,"max":54.99,"accuracy":"System dependent","interface":"Replaceable-tip modular interface","image":"assets/modular-drill/holder.webp","summary":"Internal-coolant modular holder for medium-depth drilling with replaceable insert architecture and one-flat shank.","note":"ISO 9766 shank architecture. Holder tables cover nominal diameter groups from 10.0 mm through 54.99 mm."},{"id":"mod-holder-8d","name":"Internal-Coolant Holder — 8×D","type":"Holder","insertMaterial":"Compatible with Carbide / HSS","workpieces":["Universal"],"depths":["8×D"],"min":10,"max":39.99,"accuracy":"System dependent","interface":"Replaceable-tip modular interface","image":"assets/modular-drill/holder.webp","summary":"Long-reach 8×D modular holder with internal coolant for deeper holemaking while retaining replaceable-tip flexibility.","note":"ISO 9766 one-flat shank. The listed 8×D holder range covers nominal diameter groups from 10.0 mm through 39.99 mm."},{"id":"mod-insert-steel","name":"Carbide Insert — General Steel","type":"Replaceable Insert","insertMaterial":"Carbide","workpieces":["Structural Steel","Alloy Steel","Tool Steel","Mild Steel"],"depths":["3×D","5×D","8×D"],"min":10,"max":39.99,"accuracy":"IT9–IT10","interface":"Triple-position interface","image":"assets/modular-drill/insert-steel.webp","summary":"Carbide drill insert for general steel drilling with balanced centering, stability and high-feed capability.","note":"FLUTEX public family naming is used for clear technical identification."},{"id":"mod-insert-mild","name":"Carbide Insert — Mild Steel","type":"Replaceable Insert","insertMaterial":"Carbide","workpieces":["Mild Steel","Low-Carbon Steel"],"depths":["3×D","5×D","8×D"],"min":10,"max":39.99,"accuracy":"IT9–IT10","interface":"Triple-position interface","image":"assets/modular-drill/insert-mild-steel.webp","summary":"Carbide insert geometry optimized for low-carbon and mild-steel drilling with controlled cutting forces and stable chip formation.","note":"Application-specific insert geometry; exact holder matching is confirmed from the requested diameter and depth."},{"id":"mod-insert-stainless","name":"Carbide Insert — Stainless Steel","type":"Replaceable Insert","insertMaterial":"Carbide","workpieces":["Stainless Steel"],"depths":["3×D","5×D","8×D"],"min":10,"max":39.99,"accuracy":"IT9–IT10","interface":"Triple-position interface","image":"assets/modular-drill/insert-stainless.webp","summary":"Stainless-specific carbide insert with self-centering drill-tip geometry for stable drilling and controlled cutting forces.","note":"Source geometry specifies a 145° drill point for the stainless-steel insert family."},{"id":"mod-insert-cast","name":"Carbide Insert — Cast Iron","type":"Replaceable Insert","insertMaterial":"Carbide","workpieces":["Cast Iron","Malleable Cast Iron"],"depths":["3×D","5×D","8×D"],"min":10,"max":39.99,"accuracy":"IT9–IT10","interface":"Triple-position interface","image":"assets/modular-drill/insert-cast-iron.webp","summary":"Carbide insert family dedicated to cast-iron drilling with stable positioning and application-specific edge geometry.","note":"Source geometry specifies a 140° drill point for the cast-iron insert family."},{"id":"mod-insert-nonferrous","name":"Carbide Insert — Non-Ferrous Metals","type":"Replaceable Insert","insertMaterial":"Carbide","workpieces":["Aluminum Alloy","Cast Aluminum Alloy","Copper Alloy"],"depths":["3×D","5×D","8×D"],"min":10,"max":39.99,"accuracy":"IT9–IT10","interface":"Triple-position interface","image":"assets/modular-drill/insert-non-ferrous.webp","summary":"Carbide insert geometry for aluminum and copper alloy drilling where chip evacuation and low cutting resistance are priorities.","note":"Source geometry specifies a 140° drill point for the non-ferrous insert family."},{"id":"mod-insert-hss-steel","name":"HSS Insert — General Steel","type":"Replaceable Insert","insertMaterial":"HSS","workpieces":["Structural Steel","Alloy Steel","Tool Steel","Mild Steel"],"depths":["3×D","5×D","8×D"],"min":10,"max":39.99,"accuracy":"IT9–IT10","interface":"Triple-position interface","image":"assets/modular-drill/insert-hss-steel.webp","summary":"Replaceable HSS drill insert for lower-to-medium cutting speeds and conventional-machine drilling applications.","note":"Optimized drill-tip design is intended to reduce cutting force compared with a generic insert geometry."},{"id":"mod-insert-hss-mild","name":"HSS Insert — Mild Steel","type":"Replaceable Insert","insertMaterial":"HSS","workpieces":["Mild Steel","Low-Carbon Steel"],"depths":["3×D","5×D","8×D"],"min":10,"max":39.99,"accuracy":"IT9–IT10","interface":"Triple-position interface","image":"assets/modular-drill/insert-hss-mild.webp","summary":"HSS replaceable insert option for mild-steel drilling where moderate speed, robustness and lower tool investment are preferred.","note":"Exact insert/holder pairing is confirmed by diameter and required drilling depth."}];

  const results = root.querySelector('[data-modular-results]');
  const empty = root.querySelector('[data-modular-empty]');
  const resultCount = root.querySelector('[data-modular-result-count]');
  const activeFilters = root.querySelector('[data-modular-active-filters]');
  const search = root.querySelector('[data-modular-search]');
  const diameter = root.querySelector('[data-modular-diameter]');
  const selects = Array.from(root.querySelectorAll('[data-modular-filter]'));
  const reset = root.querySelector('[data-modular-reset]');

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const selectMap = {type:'type',workpiece:'workpieces',insertMaterial:'insertMaterial',depth:'depths'};
  const valuesFor = key => {
    const vals = families.flatMap(item => Array.isArray(item[key]) ? item[key] : [item[key]]).filter(Boolean).filter(v => !/^Compatible/.test(v));
    return [...new Set(vals)].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));
  };

  selects.forEach(select => {
    valuesFor(selectMap[select.dataset.modularFilter]).forEach(value => {
      const option = document.createElement('option'); option.value=value; option.textContent=value; select.appendChild(option);
    });
  });

  const state = () => ({
    search: search.value.trim().toLowerCase(),
    diameter: diameter.value ? Number(diameter.value) : null,
    ...Object.fromEntries(selects.map(s => [s.dataset.modularFilter, s.value]))
  });

  const matches = (item,s) => {
    if (s.search) {
      const hay=[item.name,item.summary,item.note,item.type,item.insertMaterial,item.accuracy,item.interface,...item.workpieces,...item.depths].join(' ').toLowerCase();
      if (!hay.includes(s.search)) return false;
    }
    if (s.diameter !== null && (s.diameter < item.min || s.diameter > item.max)) return false;
    if (s.type && item.type !== s.type) return false;
    if (s.workpiece && !item.workpieces.includes('Universal') && !item.workpieces.includes(s.workpiece)) return false;
    if (s.insertMaterial && item.type !== 'Holder' && item.insertMaterial !== s.insertMaterial) return false;
    if (s.insertMaterial && item.type === 'Holder') return true;
    if (s.depth && !item.depths.includes(s.depth)) return false;
    return true;
  };

  const card = item => `
    <article class="finder-card modular-card">
      <div class="finder-card-media"><img src="${esc(item.image)}" alt="${esc(item.name)}"></div>
      <div class="finder-card-body">
        <div class="finder-card-top"><span class="finder-standard">${esc(item.type)}</span><span class="finder-range">Ø ${item.min.toFixed(1)}–${item.max.toFixed(2)} mm</span></div>
        <h5>${esc(item.name)}</h5><p>${esc(item.summary)}</p>
        <div class="finder-card-chips"><span>${esc(item.insertMaterial)}</span><span>${esc(item.depths.join(' / '))}</span><span>${esc(item.accuracy)}</span></div>
        <div class="finder-card-actions"><button class="text-link finder-spec-btn" type="button" data-open-modular="${esc(item.id)}">View specifications <span>→</span></button><a class="finder-rfq" href="contact.html?product=${encodeURIComponent(item.name)}">RFQ</a></div>
      </div>
    </article>`;

  const specRows = item => [
    ['Product type', item.type],
    ['Insert / compatibility', item.insertMaterial],
    ['Workpiece', item.workpieces.join(' / ')],
    ['Drilling depth', item.depths.join(' / ')],
    ['Nominal diameter range', `${item.min.toFixed(1)}–${item.max.toFixed(2)} mm`],
    ['Hole accuracy', item.accuracy],
    ['Interface', item.interface]
  ];

  let dialog = document.querySelector('#modular-finder-dialog');
  if (!dialog) {
    dialog=document.createElement('dialog'); dialog.id='modular-finder-dialog'; dialog.className='finder-dialog';
    dialog.innerHTML='<button class="finder-dialog-close" type="button" aria-label="Close">×</button><div class="finder-dialog-content"></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('.finder-dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{ if(e.target===dialog) dialog.close(); });
  }

  const openSpec = id => {
    const item=families.find(x=>x.id===id); if(!item) return;
    dialog.querySelector('.finder-dialog-content').innerHTML=`<div class="finder-dialog-grid"><div class="finder-dialog-media"><img src="${esc(item.image)}" alt="${esc(item.name)}"></div><div class="finder-dialog-copy"><span class="catalog-tag">FLUTEX Modular Drilling</span><h3>${esc(item.name)}</h3><p>${esc(item.summary)}</p><div class="finder-spec-table">${specRows(item).map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div><p class="finder-spec-note">${esc(item.note)} Exact availability and final holder/insert pairing are confirmed with the quotation.</p><a class="btn btn-dark" href="contact.html?product=${encodeURIComponent(item.name)}">Request this family →</a></div></div>`;
    dialog.showModal();
  };

  const renderActive = s => {
    const labels=[];
    if (s.search) labels.push(`Search: ${search.value.trim()}`);
    if (s.diameter !== null) labels.push(`Ø ${s.diameter} mm`);
    selects.forEach(sel=>{ if(sel.value) labels.push(sel.value); });
    activeFilters.innerHTML=labels.map(x=>`<span>${esc(x)}</span>`).join('');
  };

  const render = () => {
    const s=state(); const filtered=families.filter(item=>matches(item,s));
    resultCount.textContent=filtered.length; results.innerHTML=filtered.map(card).join('');
    empty.hidden=filtered.length!==0; renderActive(s);
    results.querySelectorAll('[data-open-modular]').forEach(btn=>btn.addEventListener('click',()=>openSpec(btn.dataset.openModular)));
  };

  [search,diameter,...selects].forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',render));
  reset.addEventListener('click',()=>{ search.value=''; diameter.value=''; selects.forEach(s=>s.value=''); render(); });
  render();
})();
