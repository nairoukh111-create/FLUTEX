(()=>{
  'use strict';
  const root=document.querySelector('#saw-finder');
  if(!root)return;
  const ar=document.documentElement.lang==='ar',form=document.querySelector('#saw-form');
  const labels=ar?{
    title:'تحديد المقاس النهائي',intro:'اختر المواصفة الدقيقة قبل تجهيز الطلب. الخيارات المعروضة لا تضمن التوافق مع الماكينة.',
    select:'اعتماد المقاس',cancel:'إلغاء',outer:'القطر الخارجي',kerf:'عرض القطع',body:'سماكة الجسم',bore:'الفتحة المركزية',teeth:'عدد الأسنان',
    tool:'أبعاد أدوات PCD',picked:'تم اختيار المقاس. أكمل رقم الماكينة وفتحات التثبيت وكمية الطلب.',
    check:'راجع فتحة المركز والـPinholes والـRPM قبل اعتماد الطلب.'
  }:{
    title:'Confirm exact configuration',intro:'Choose the exact option before preparing the enquiry. Listed sizes do not guarantee machine fit.',
    select:'Use configuration',cancel:'Cancel',outer:'Outside diameter',kerf:'Kerf',body:'Blade body',bore:'Centre bore',teeth:'Tooth count',
    tool:'PCD tooling dimensions',picked:'Configuration selected. Add your machine model, fixing holes and quantity.',
    check:'Confirm centre bore, pinholes and machine RPM before quotation.'
  };
  const field=(id,value)=>{const el=document.getElementById(id);if(el)el.value=value||''};
  const norm=s=>String(s||'').trim();
  let dialog=document.getElementById('saw-choice-dialog');
  if(!dialog){
    dialog=document.createElement('dialog');
    dialog.id='saw-choice-dialog';
    dialog.className='saw-choice-dialog';
    dialog.innerHTML='<form method="dialog"><h2></h2><p></p><div class="saw-choice-grid"></div><menu><button type="button" data-choice-cancel></button><button type="submit" value="confirm" data-choice-confirm></button></menu></form>';
    document.body.appendChild(dialog);
  }
  const out=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function candidate(value){
    const s=norm(value);
    if(!s||s==='—'||/^confirm$/i.test(s))return {options:[],value:''};
    if(/\d+\s*[–-]\s*\d+/.test(s)){
      const n=s.match(/\d+(?:\.\d+)?/g)||[];
      return {range:n.slice(0,2),value:''};
    }
    const nums=s.match(/\d+(?:\.\d+)?/g)||[];
    const alt=/[,/()]/.test(s)&&nums.length>1;
    // Preserve the unit suffix for cutter insert / tooth-count alternatives.
    const plates=[...s.matchAll(/\d+(?:\.\d+)?\s*P\b/gi)].map(m=>m[0].replace(/\s+/g,''));
    if(plates.length>1)return {options:[...new Set(plates)],value:''};
    return {options:alt?[...new Set(nums)]:[],value:s};
  }
  function selection(row,card,index){
    const cells=[...row.querySelectorAll('td')].map(td=>norm(td.textContent));
    const tds=index===34?[cells[0],'—','—',cells[1],cells[2],cells[3]]:cells.slice(0,6);
    const type=index>=33?'tool':index===9?'pipe-hss':'blade';
    const defs=index===34?[
      ['outer',labels.outer,tds[0]],['bore',labels.bore,tds[3]],['teeth',labels.teeth,tds[4]]
    ]:type==='tool'?[
      ['outer',labels.outer,tds[0]],
      ['kerf',index===35?(ar?'طول القطع':'Cutting length'):(ar?'العرض':'Width'),tds[1]],
      ['body',index===35?(ar?'قطر الساق':'Shank diameter'):(ar?'السماكة / ارتفاع الأداة':'Body / height'),tds[2]],
      ['bore',index===35?(ar?'الطول الكلي':'Overall length'):labels.bore,tds[3]],
      ['teeth',labels.teeth,tds[4]]
    ]:[
      ['outer',labels.outer,tds[0]],
      ['kerf',labels.kerf,tds[1]],
      ['body',labels.body,tds[2]],
      ['bore',labels.bore,tds[3]],
      ['teeth',labels.teeth,tds[4]]
    ];
    const configs=defs.map(([key,label,value])=>({key,label,raw:value,...candidate(value)}));
    const need=configs.some(c=>c.range||c.options.length);
    const accept=values=>{
      field('saw-selected',card.querySelector('h4')?.textContent||'');
      field('saw-machine',document.getElementById('saw-machine')?.value||'');
      if(type==='pipe-hss'){
        field('saw-diameter',values.outer);
        field('saw-kerf','');field('saw-body','');field('saw-bore','');
        field('saw-teeth',values.teeth);
        field('saw-notes',(ar?'عرض السن: ':'Tooth width: ')+values.kerf+' mm; '+(ar?'تأكيد فتحة المركز مطلوب':'Centre bore requires confirmation'));
      }else if(type==='blade'){
        field('saw-diameter',values.outer);
        field('saw-kerf',values.kerf);
        field('saw-body',values.body);
        field('saw-bore',values.bore);
        field('saw-teeth',values.teeth);
        field('saw-tooth',/^(Dry cutting|HSS pipe cutting|—)$/.test(tds[5])?'':tds[5]);
        const old=norm(document.getElementById('saw-notes').value);
        if(old.startsWith('Tool dimensions:')||old.startsWith('أبعاد الأداة:'))field('saw-notes','');
      }else{
        ['saw-diameter','saw-bore','saw-kerf','saw-body','saw-teeth','saw-tooth'].forEach(x=>field(x,''));
        const desc=Object.entries(values).map(([k,v])=>k+': '+v).join('; ');
        const title=ar?'أبعاد الأداة: ':'Tool dimensions: ';
        field('saw-notes',title+desc+'; configuration: '+tds[5]);
      }
      const stat=document.getElementById('saw-status');
      if(stat)stat.textContent=labels.picked;
      document.getElementById('saw-rfq')?.scrollIntoView({behavior:'smooth',block:'start'});
    };
    if(!need){accept(Object.fromEntries(configs.map(c=>[c.key,c.value])));return}
    dialog.querySelector('h2').textContent=labels.title;
    dialog.querySelector('p').textContent=labels.intro;
    dialog.querySelector('[data-choice-cancel]').textContent=labels.cancel;
    dialog.querySelector('[data-choice-confirm]').textContent=labels.select;
    const grid=dialog.querySelector('.saw-choice-grid');
    grid.replaceChildren();
    configs.forEach(c=>{
      const label=document.createElement('label');
      label.textContent=c.label+' (mm)';
      if(c.key==='teeth')label.textContent=c.label;
      if(c.options.length){
        const s=document.createElement('select');
        s.name=c.key;s.required=true;
        const ph=document.createElement('option');ph.value='';ph.textContent=ar?'اختر':'Choose';s.append(ph);
        c.options.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;s.append(o)});
        label.append(s);
      }else if(c.range){
        const inp=document.createElement('input');inp.type='number';inp.name=c.key;inp.required=true;inp.min=c.range[0];inp.max=c.range[1];inp.step='any';inp.placeholder=c.range.join('–');label.append(inp);
      }else{
        const inp=document.createElement('input');inp.name=c.key;inp.value=c.value;inp.readOnly=true;label.append(inp);
      }
      grid.append(label);
    });
    const close=dialog.querySelector('[data-choice-cancel]');
    close.onclick=()=>dialog.close();
    const df=dialog.querySelector('form');
    df.onsubmit=e=>{
      e.preventDefault();
      if(!df.reportValidity())return;
      const v=Object.fromEntries(new FormData(df).entries());
      accept(v);dialog.close();
    };
    if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');grid.querySelector('select,input:not([readonly])')?.focus()}
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-pick-size]');if(!b)return;
    const card=b.closest('article.saw-item'),d=b.closest('details.saw-dimensions'),row=b.closest('tr');
    if(!card||!row||!d)return;
    const idx=Number(d.id.replace('saw-dimensions-',''));
    selection(row,card,idx);
  });
  // Shared dimensional tables are references, not guarantees of a finished blade for a particular machine.
  for(const [id,family] of [
    ['saw-common-cold',ar?'دسك قص بارد — مقاس مرجعي':'Metal cold saw — general reference'],
    ['saw-common-aluminum',ar?'دسك ألمنيوم — مقاس مرجعي':'Aluminium blade — general reference']
  ]){
    document.getElementById(id)?.addEventListener('click',event=>{
      const selected=event.target.closest('[data-pick-size]');
      if(!selected)return;
      const row=selected.closest('tr');
      if(!row)return;
      const card={querySelector:()=>({textContent:family})};
      selection(row,card,0);
    });
  }
  // Distinguish the technical groups without representing generic drawings as exact stock photos.
  const icons={
    cold:'<circle cx="50" cy="50" r="32"/><circle cx="50" cy="50" r="7"/><path d="M50 7v11M50 82v11M7 50h11M82 50h11M20 20l8 8m44 44 8 8M20 80l8-8m44-44 8-8"/>',
    aluminum:'<circle cx="50" cy="50" r="33"/><circle cx="50" cy="50" r="8"/><path d="M50 12l6 10 14-6 2 11 13 1-5 11 9 8-9 8 5 11-13 1-2 11-14-6-6 10-6-10-14 6-2-11-13-1 5-11-9-8 9-8-5-11 13-1 2-11 14 6z"/>',
    panel:'<circle cx="50" cy="50" r="32"/><circle cx="50" cy="50" r="8"/><path d="M20 29h60M20 71h60M18 50h15m34 0h15"/>',
    special:'<circle cx="50" cy="50" r="32"/><circle cx="50" cy="50" r="9"/><path d="M28 28l12 9m32-9-12 9M28 72l12-9m32 9-12-9"/>',
    pcd:'<circle cx="50" cy="50" r="33"/><circle cx="50" cy="50" r="8"/><path d="M50 10l8 13M78 22l-1 16M90 50l-13 8M78 78l-16-1M50 90l-8-13M22 78l1-16M10 50l13-8M22 22l16 1"/>',
    tools:'<rect x="35" y="17" width="30" height="17" rx="2"/><path d="M30 34h40l-8 20H38zM42 54v28m16-28v28M34 82h32M26 45h48"/>'
  };
  document.querySelectorAll('article.saw-item').forEach(el=>{
    const svg=el.querySelector('.saw-disc svg'),family=el.dataset.family;
    if(svg&&icons[family]){
      svg.setAttribute('viewBox','0 0 100 100');
      svg.setAttribute('fill','none');
      svg.setAttribute('stroke','currentColor');
      svg.setAttribute('stroke-width','2.5');
      svg.setAttribute('stroke-linecap','round');
      svg.setAttribute('stroke-linejoin','round');
      svg.innerHTML=icons[family];
      svg.setAttribute('aria-hidden','true');
    }
  });
})();