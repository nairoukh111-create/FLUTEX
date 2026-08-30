(() => {
  const root = document.querySelector('#carbide-tools');
  if (!root) return;

  const families = [{"id":"carbide-general","name":"General Purpose Carbide End Mills","toolTypes":["Solid Carbide End Mill"],"workpieces":["Steel","Cast Iron","Mold Steel","Stainless Steel"],"geometries":["Square End","Ball Nose","Corner Radius","Roughing","Finishing","Reamer","Single Flute"],"coatings":["AlTiN"],"hardness":["Up to HRC55"],"flutes":["1","2","4","6"],"reach":["Standard","Long Shank","Inch Size"],"substrate":"0.8 µm micrograin · Co 10%","image":"assets/carbide/general-purpose.webp","summary":"Balanced carbide tooling for general machining of steels, cast iron, mold steel and stainless steel below HRC55.","note":"Available in multiple square-end, ball-nose, corner-radius, roughing, finishing and specialty geometries."},{"id":"carbide-precision","name":"High Precision Carbide End Mills","toolTypes":["Solid Carbide End Mill"],"workpieces":["Steel","Cast Iron","Stainless Steel"],"geometries":["Square End","Ball Nose","Corner Radius","Deep Groove","Micro Diameter"],"coatings":["TiAlSiN"],"hardness":["Medium / High Hardness"],"flutes":["2","4"],"reach":["Standard","Long Shank","Deep Groove","Micro Diameter"],"substrate":"0.6 µm carbide substrate","image":"assets/carbide/precision.webp","summary":"Large-helix precision tooling designed for progressive cutting, stable loading, axial chip evacuation and low-vibration machining.","note":"Includes standard, long-shank, deep-groove and micro-diameter families."},{"id":"carbide-hardened","name":"High-Hardness Carbide End Mills","toolTypes":["Solid Carbide End Mill"],"workpieces":["Hardened Steel","Tool Steel","Mold Steel"],"geometries":["Square End","Ball Nose","Corner Radius"],"coatings":["Ti-Si Based"],"hardness":["Up to HRC65"],"flutes":["2","4"],"reach":["Standard"],"substrate":"0.4 µm ultra-fine carbide · Co 9%","image":"assets/carbide/hardened-steel.webp","summary":"Wear-resistant carbide tooling for semi-finishing and precision machining of quenched tool and mold steels below HRC65.","note":"Catalog examples include S136, SKD11, SKD61, D2, H13, Cr12MoV, 42CrMoA and ASP30."},{"id":"carbide-stainless","name":"Stainless Steel Carbide End Mills","toolTypes":["Solid Carbide End Mill"],"workpieces":["Stainless Steel"],"geometries":["Square End","Ball Nose","Corner Radius"],"coatings":["AlCrN"],"hardness":["Up to HRC55"],"flutes":["2","4"],"reach":["Standard","Long Shank"],"substrate":"0.6 µm carbide · Co 12%","image":"assets/carbide/stainless.webp","summary":"Unequal-helix and unequal-tooth architecture for vibration control, chip evacuation and stable stainless-steel machining.","note":"Designed to support roughing chip flow while maintaining rigidity and surface quality in finishing."},{"id":"carbide-titanium","name":"Titanium & Heat-Resistant Alloy End Mills","toolTypes":["Solid Carbide End Mill"],"workpieces":["Titanium","Heat-Resistant Alloys","Stainless Steel","Alloy Steel"],"geometries":["Square End","Ball Nose","Corner Radius"],"coatings":["ZrN-Based"],"hardness":["HRC25–60"],"flutes":["2","4"],"reach":["Standard","Long Shank"],"substrate":"0.8 µm carbide substrate","image":"assets/carbide/titanium.webp","summary":"Low-vibration, high-surface-quality carbide tooling for titanium, heat-resistant alloys, stainless and alloy steels across HRC25–60.","note":"Available in square-end, ball-nose and corner-radius geometries with standard and long-shank options."},{"id":"carbide-aluminum","name":"Aluminum High-Efficiency Carbide End Mills","toolTypes":["Solid Carbide End Mill"],"workpieces":["Aluminum 6XXX","Aluminum 7XXX","High-Silicon Aluminum"],"geometries":["Square End","Ball Nose","Corner Radius"],"coatings":[],"hardness":["Non-Ferrous"],"flutes":["2","3"],"reach":["Metric","Inch Size"],"substrate":"0.8 µm carbide · Co 10%","image":"assets/carbide/aluminum.webp","summary":"Sharp, low-force aluminum tooling designed around reduced adhesion, efficient chip evacuation and high-speed machining.","note":"Catalog families cover 6XXX, 7XXX and high-silicon aluminum applications in metric and inch-size geometries."},{"id":"carbide-graphite","name":"Graphite & Composite Diamond-Coated End Mills","toolTypes":["Solid Carbide End Mill"],"workpieces":["Graphite","Composites","Non-Ferrous Alloys"],"geometries":["Square End","Ball Nose","Corner Radius","Roughing"],"coatings":["Diamond-Based"],"hardness":["Abrasive Materials"],"flutes":["2","4"],"reach":["Standard"],"substrate":"0.1 µm carbide · Co 6%","image":"assets/carbide/graphite.webp","summary":"Diamond-coated carbide tooling for abrasive graphite, composites and non-ferrous alloy machining with high wear resistance.","note":"The technical range positions the diamond-coated family for substantially higher wear resistance than ordinary PVD carbide tooling."},{"id":"carbide-drilling","name":"Solid Carbide Drilling Tools","toolTypes":["Solid Carbide Drill"],"workpieces":["General Metals","Aluminum"],"geometries":["2-Flute Drill","Spot Drill"],"coatings":["AlTiSiXN","Application-Specific"],"hardness":["Up to HRC55"],"flutes":["2"],"reach":["3xD","5xD","8xD","Spot Drill","External Coolant","Internal Coolant"],"substrate":"0.8 µm carbide · Co 10%","image":"assets/carbide/carbide-drills.webp","summary":"Solid-carbide drill families covering high-speed general drilling plus aluminum-specific geometries with internal and external coolant options.","note":"The catalog lists 3xD, 5xD and 8xD production families, plus spot-drilling tools; special deeper drilling is available by requirement."},{"id":"cbn-precision","name":"CBN Precision Finishing End Mills","toolTypes":["CBN End Mill"],"workpieces":["Hardened Steel"],"geometries":["Square End","Ball Nose","Corner Radius"],"coatings":["CBN"],"hardness":["HRC50–70"],"flutes":["2","4"],"reach":["Precision Finishing"],"substrate":"CBN precision cutting edge","image":"assets/carbide/cbn-precision.webp","summary":"High-precision CBN milling tools for hardened-steel finishing where tool life, edge stability and dimensional accuracy are critical.","note":"Catalog product pages specify precision finishing around ±5 µm for hardened steel in the HRC50–70 range; the series introduction states R accuracy ±0.005 mm."}];

  const results = root.querySelector('[data-carbide-results]');
  const empty = root.querySelector('[data-carbide-empty]');
  const resultCount = root.querySelector('[data-carbide-result-count]');
  const activeFilters = root.querySelector('[data-carbide-active-filters]');
  const search = root.querySelector('[data-carbide-search]');
  const selects = Array.from(root.querySelectorAll('[data-carbide-filter]'));
  const reset = root.querySelector('[data-carbide-reset]');

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const selectMap = {workpiece:'workpieces',tool:'toolTypes',geometry:'geometries',coating:'coatings',hardness:'hardness',flutes:'flutes',reach:'reach'};
  const unique = key => [...new Set(families.flatMap(item => item[key] || []).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true}));

  selects.forEach(select => {
    const values = unique(selectMap[select.dataset.carbideFilter]);
    values.forEach(value => {
      const option=document.createElement('option');
      option.value=value; option.textContent=value; select.appendChild(option);
    });
  });

  const state = () => ({
    search: search.value.trim().toLowerCase(),
    ...Object.fromEntries(selects.map(s=>[s.dataset.carbideFilter,s.value]))
  });

  const matches = (item,s) => {
    if (s.search) {
      const haystack=[item.name,item.summary,item.note,item.substrate,...item.toolTypes,...item.workpieces,...item.geometries,...item.coatings,...item.hardness,...item.flutes,...item.reach].join(' ').toLowerCase();
      if (!haystack.includes(s.search)) return false;
    }
    for (const [field,key] of Object.entries(selectMap)) {
      if (!s[field]) continue;
      if (!(item[key] || []).includes(s[field])) return false;
    }
    return true;
  };

  const card = item => `
    <article class="finder-card carbide-card">
      <div class="finder-card-media"><img src="${esc(item.image)}" alt="${esc(item.name)}"></div>
      <div class="finder-card-body">
        <div class="finder-card-top"><span class="finder-standard">${esc(item.toolTypes[0])}</span><span class="finder-range">${esc(item.hardness[0])}</span></div>
        <h5>${esc(item.name)}</h5>
        <p>${esc(item.summary)}</p>
        <div class="finder-card-chips"><span>${esc(item.workpieces.slice(0,2).join(' · '))}</span><span>${esc(item.geometries.slice(0,2).join(' / '))}</span>${item.coatings.length?`<span>${esc(item.coatings.join(' / '))}</span>`:''}</div>
        <div class="finder-card-actions"><button class="text-link finder-spec-btn" type="button" data-open-carbide="${esc(item.id)}">View specifications <span>→</span></button><a class="finder-rfq" href="contact.html?product=${encodeURIComponent(item.name)}">RFQ</a></div>
      </div>
    </article>`;

  const specRows = item => [
    ['Tool family',item.toolTypes.join(' / ')],
    ['Workpiece materials',item.workpieces.join(' / ')],
    ['Geometry options',item.geometries.join(' / ')],
    ['Flute options',item.flutes.map(x=>`${x}F`).join(' / ')],
    ['Coating / cutting material',item.coatings.length?item.coatings.join(' / '):'Application-dependent'],
    ['Hardness / application class',item.hardness.join(' / ')],
    ['Reach / length options',item.reach.join(' / ')],
    ['Carbide / substrate',item.substrate]
  ];

  const renderActive = s => {
    const chips=[];
    if (s.search) chips.push(`Search: ${search.value.trim()}`);
    selects.forEach(el=>{ if(el.value) chips.push(`${el.previousElementSibling?.textContent || el.dataset.carbideFilter}: ${el.value}`); });
    activeFilters.innerHTML=chips.map(c=>`<span>${esc(c)}</span>`).join('');
    activeFilters.hidden=chips.length===0;
  };

  const render = () => {
    const s=state();
    const filtered=families.filter(item=>matches(item,s));
    results.innerHTML=filtered.map(card).join('');
    resultCount.textContent=filtered.length;
    empty.hidden=filtered.length!==0;
    renderActive(s);
  };

  const openDialog = item => {
    let dialog=document.querySelector('#carbide-spec-dialog');
    if(!dialog){ dialog=document.createElement('dialog'); dialog.id='carbide-spec-dialog'; dialog.className='finder-dialog'; document.body.appendChild(dialog); }
    dialog.innerHTML=`
      <button class="finder-dialog-close" type="button" aria-label="Close">×</button>
      <div class="finder-dialog-grid">
        <div class="finder-dialog-media"><img src="${esc(item.image)}" alt="${esc(item.name)}"></div>
        <div class="finder-dialog-copy">
          <span class="finder-standard">FLUTEX Carbide Tool Family</span>
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.summary)}</p>
          <div class="finder-spec-table">${specRows(item).map(([a,b])=>`<div><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div>
          <p class="finder-spec-note">${esc(item.note)} Exact diameter, cutting length, overall length, shank, radius and stock availability are confirmed at quotation stage.</p>
          <a class="btn btn-dark" href="contact.html?product=${encodeURIComponent(item.name)}">Request this family →</a>
        </div>
      </div>`;
    dialog.querySelector('.finder-dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    if(typeof dialog.showModal==='function')dialog.showModal(); else dialog.setAttribute('open','');
  };

  root.addEventListener('click',e=>{
    const btn=e.target.closest('[data-open-carbide]');
    if(!btn)return;
    const item=families.find(x=>x.id===btn.dataset.openCarbide);
    if(item)openDialog(item);
  });

  [search,...selects].forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',render));
  reset.addEventListener('click',()=>{search.value='';selects.forEach(s=>s.value='');render();});
  render();
})();
