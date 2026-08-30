(() => {
  const root = document.querySelector('#hss-drills');
  if (!root) return;

  const families = [{"id":"din338","name":"HSS Straight Shank Twist Drills","standard":"DIN 338","shank":"Straight Shank","length":"Jobber / Standard","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular","Parabolic"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Metric"],"diameterMin":0.2,"diameterMax":20,"size":"0.2–20 mm","image":"assets/hss/din338.webp","summary":"General straight-shank twist drill family in a broad metric diameter range."},{"id":"asme-jobber","name":"HSS Jobber Length Straight Shank Twist Drills","standard":"ASME B94.11M","shank":"Straight Shank","length":"Jobber","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular","Parabolic"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Fractional Inch","Letter","Wire Number"],"diameterMin":1.588,"diameterMax":17.066,"size":"1/16–43/64 in · Letter A–Z · Wire No. 60–1","image":"assets/hss/asme-jobber.webp","summary":"ASME jobber-length series with fractional, letter and wire-number size systems."},{"id":"din1897","name":"HSS Stubby Drills","standard":"DIN 1897","shank":"Straight Shank","length":"Stubby","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular","Parabolic"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Metric"],"diameterMin":0.2,"diameterMax":20,"size":"0.2–20 mm","image":"assets/hss/din1897.webp","summary":"Short, rigid straight-shank drill family for compact drilling setups."},{"id":"asme-stubby","name":"HSS Screw Machine Length Stubby Drills","standard":"ASME B94.11M","shank":"Straight Shank","length":"Screw Machine / Stubby","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular","Parabolic"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Fractional Inch","Letter","Wire Number"],"diameterMin":1.588,"diameterMax":12.7,"size":"1/16–1/2 in · Letter A–Z · Wire No. 60–1","image":"assets/hss/asme-stubby.webp","summary":"Compact ASME stubby drill family with fractional, letter and number series."},{"id":"din340","name":"HSS Long Length Straight Shank Twist Drills","standard":"DIN 340","shank":"Straight Shank","length":"Long Length","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Metric"],"diameterMin":1,"diameterMax":20,"size":"1–20 mm","image":"assets/hss/din340.webp","summary":"Long-length straight-shank twist drill family for increased reach."},{"id":"asme-taper","name":"HSS Taper Length Straight Shank Twist Drills","standard":"ASME B94.11M","shank":"Straight Shank","length":"Taper Length","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Fractional Inch","Wire Number"],"diameterMin":1.588,"diameterMax":12.7,"size":"1/16–1/2 in · Wire No. 60–1","image":"assets/hss/asme-taper.webp","summary":"ASME taper-length straight-shank series for extended flute and overall length."},{"id":"din345","name":"HSS Taper Shank Twist Drills","standard":"DIN 345","shank":"Morse Taper","length":"Standard Taper Shank","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Metric"],"diameterMin":3,"diameterMax":100,"size":"3–100 mm","image":"assets/hss/din345.webp","summary":"Heavy-duty Morse-taper drill family covering medium through large diameters."},{"id":"din341","name":"HSS Long Length Taper Shank Twist Drills","standard":"DIN 341","shank":"Morse Taper","length":"Long Length Taper Shank","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Metric"],"diameterMin":5,"diameterMax":50,"size":"5–50 mm","image":"assets/hss/din341.webp","summary":"Extended-reach Morse-taper drill family for larger, deeper drilling requirements."},{"id":"double-ended","name":"HSS Double Ended Drills","standard":"Industrial Series","shank":"Double Ended","length":"Double Ended / Stub","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Metric","Fractional Inch"],"diameterMin":2,"diameterMax":6.5,"size":"2.0–6.5 mm · 5/64–1/4 in","image":"assets/hss/double-ended.webp","summary":"Compact double-ended drills with two cutting ends for high-use small-diameter drilling."},{"id":"silver-deming","name":"HSS Silver & Deming Drills","standard":"Industrial Series","shank":"Reduced Shank","length":"Silver & Deming","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Regular"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Metric","Fractional Inch"],"diameterMin":13,"diameterMax":38,"size":"13–38 mm · Fractional inch series","image":"assets/hss/silver-deming.webp","summary":"Large-diameter reduced-shank drilling family for use where chuck capacity is limited."},{"id":"aircraft-extension","name":"HSS Aircraft Extension Drills","standard":"Aircraft Extension Series","shank":"Straight Shank","length":"6 in / 12 in Extension","grades":["HSS","HSS-Co"],"points":["118°","135°"],"flutes":["Standard Construction","Parabolic Construction"],"finishes":["Bright","Amber","TiN","B&G"],"units":["Fractional Inch","Letter","Wire Number"],"diameterMin":1.588,"diameterMax":12.7,"size":"1/16–1/2 in · Letter A–Z · Wire No. 52–1 · 6 in / 12 in OAL","image":"assets/hss/aircraft-extension.webp","summary":"Extra-long 6-inch and 12-inch drill series for restricted-access and extended-reach work."}];
  const results = root.querySelector('[data-finder-results]');
  const empty = root.querySelector('[data-finder-empty]');
  const resultCount = root.querySelector('[data-result-count]');
  const activeFilters = root.querySelector('[data-active-filters]');
  const search = root.querySelector('[data-filter-search]');
  const diameter = root.querySelector('[data-filter-diameter]');
  const selects = Array.from(root.querySelectorAll('[data-filter]'));
  const reset = root.querySelector('[data-finder-reset]');

  const esc = (value) => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const unique = (key) => [...new Set(families.flatMap(item => Array.isArray(item[key]) ? item[key] : [item[key]]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b)));
  const selectMap = { standard:'standard', shank:'shank', length:'length', grade:'grades', point:'points', flute:'flutes', finish:'finishes' };

  selects.forEach(select => {
    const field = select.dataset.filter;
    const values = unique(selectMap[field]);
    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  });

  const getState = () => Object.fromEntries([
    ['search', search.value.trim().toLowerCase()],
    ['diameter', diameter.value ? Number(diameter.value) : null],
    ...selects.map(s => [s.dataset.filter, s.value])
  ]);

  const matches = (item, state) => {
    if (state.search) {
      const haystack = [item.name,item.standard,item.shank,item.length,item.size,item.summary,...item.grades,...item.points,...item.flutes,...item.finishes,...item.units].join(' ').toLowerCase();
      if (!haystack.includes(state.search)) return false;
    }
    if (state.diameter !== null && Number.isFinite(state.diameter)) {
      if (state.diameter < item.diameterMin || state.diameter > item.diameterMax) return false;
    }
    for (const [field,key] of Object.entries(selectMap)) {
      const wanted = state[field];
      if (!wanted) continue;
      const value = item[key];
      if (Array.isArray(value) ? !value.includes(wanted) : value !== wanted) return false;
    }
    return true;
  };

  const specs = item => [
    ['Standard / Series', item.standard],
    ['Shank', item.shank],
    ['Length class', item.length],
    ['Catalog size range', item.size],
    ['Material grades', item.grades.join(' / ')],
    ['Point options', item.points.join(' / ')],
    ['Flute / construction', item.flutes.join(' / ')],
    ['Finish options', item.finishes.join(' / ')],
    ['Size systems', item.units.join(' / ')]
  ];

  const card = item => `
    <article class="finder-card">
      <div class="finder-card-media"><img src="${esc(item.image)}" alt="${esc(item.name)}"></div>
      <div class="finder-card-body">
        <div class="finder-card-top"><span class="finder-standard">${esc(item.standard)}</span><span class="finder-range">${esc(item.size)}</span></div>
        <h5>${esc(item.name)}</h5>
        <p>${esc(item.summary)}</p>
        <div class="finder-card-chips"><span>${esc(item.shank)}</span><span>${esc(item.length)}</span><span>${esc(item.grades.join(' / '))}</span></div>
        <div class="finder-card-actions"><button class="text-link finder-spec-btn" type="button" data-open-spec="${esc(item.id)}">View specifications <span>→</span></button><a class="finder-rfq" href="contact.html?product=${encodeURIComponent(item.name)}">RFQ</a></div>
      </div>
    </article>`;

  const renderActive = state => {
    const chips=[];
    if (state.search) chips.push(`Search: ${search.value.trim()}`);
    if (state.diameter !== null && Number.isFinite(state.diameter)) chips.push(`Ø ${state.diameter} mm`);
    selects.forEach(s => { if (s.value) chips.push(`${s.previousElementSibling?.textContent || s.dataset.filter}: ${s.value}`); });
    activeFilters.innerHTML = chips.map(c=>`<span>${esc(c)}</span>`).join('');
    activeFilters.hidden = chips.length === 0;
  };

  const render = () => {
    const state = getState();
    const filtered = families.filter(item => matches(item,state));
    results.innerHTML = filtered.map(card).join('');
    resultCount.textContent = filtered.length;
    empty.hidden = filtered.length !== 0;
    renderActive(state);
  };

  const openDialog = item => {
    let dialog = document.querySelector('#finder-spec-dialog');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id='finder-spec-dialog';
      dialog.className='finder-dialog';
      document.body.appendChild(dialog);
    }
    dialog.innerHTML = `
      <button class="finder-dialog-close" type="button" aria-label="Close">×</button>
      <div class="finder-dialog-grid">
        <div class="finder-dialog-media"><img src="${esc(item.image)}" alt="${esc(item.name)}"></div>
        <div class="finder-dialog-copy">
          <span class="finder-standard">${esc(item.standard)}</span>
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.summary)}</p>
          <div class="finder-spec-table">${specs(item).map(([a,b])=>`<div><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div>
          <p class="finder-spec-note">Options shown are product families. Exact diameter, geometry, finish and grade availability is confirmed at quotation stage.</p>
          <a class="btn btn-dark" href="contact.html?product=${encodeURIComponent(item.name)}">Request this family →</a>
        </div>
      </div>`;
    dialog.querySelector('.finder-dialog-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',(e)=>{ if(e.target===dialog) dialog.close(); });
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
  };

  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-open-spec]');
    if (!btn) return;
    const item = families.find(x => x.id === btn.dataset.openSpec);
    if (item) openDialog(item);
  });

  [search, diameter, ...selects].forEach(el => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', render));
  reset.addEventListener('click',()=>{
    search.value=''; diameter.value=''; selects.forEach(s=>s.value=''); render();
  });
  render();
})();