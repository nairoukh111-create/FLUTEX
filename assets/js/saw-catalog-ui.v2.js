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

  // Original, schematic product-family artwork. Never imply this drawing is an exact SKU photograph.
  const drawBlade=(i,family)=>{
    const id='fb'+i;
    const num=family==='cold'?(i===8?70:40):(family==='aluminum'?46:(family==='pcd'?34:(family==='special'?54:30)));
    const cx=112,cy=76,R=58;
    const pts=[];
    for(let j=0;j<num;j++){
      const t=(j/num)*Math.PI*2-Math.PI/2;
      const p=(j+.64)/num*Math.PI*2-Math.PI/2;
      pts.push([cx+R*Math.cos(t),cy+R*Math.sin(t)],[cx+(R+6)*Math.cos(p),cy+(R+6)*Math.sin(p)]);
    }
    const fmt=point=>point.map(n=>n.toFixed(2)).join(' ');
    const edge='M '+pts.map(fmt).join(' L ')+' Z';
    const grooveCount=family==='cold'?6:(family==='panel'?5:4);
    const notches=Array.from({length:grooveCount},(_,j)=>{
      const a=Math.PI*2*j/grooveCount+.45+i*.06;
      const x=cx+40*Math.cos(a),y=cy+40*Math.sin(a);
      return '<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="3.3" fill="#0e151a" stroke="#a9b6b9" stroke-width=".8"/>';
    }).join('');
    const rings=Array.from({length:13},(_,j)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+(18+j*3.2).toFixed(1)+'" fill="none" stroke="'+(j%3?'#fff':'#28343d')+'" stroke-opacity="'+(.045+j*.001).toFixed(3)+'" stroke-width=".65"/>').join('');
    const inserts=family==='pcd'?Array.from({length:16},(_,j)=>{
      const a=2*Math.PI*j/16;
      return '<path d="M '+fmt([cx+58*Math.cos(a),cy+58*Math.sin(a)])+' l '+fmt([3*Math.cos(a+.65),3*Math.sin(a+.65)])+'" stroke="#fbe12a" stroke-width="2.7" stroke-linecap="round"/>';
    }).join(''):'';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 150" role="presentation" aria-hidden="true">'+
    '<defs><linearGradient id="'+id+'g" x1="4%" y1="7%" x2="91%" y2="94%"><stop stop-color="#dce5e8"/><stop offset=".21" stop-color="#8c9da4"/><stop offset=".43" stop-color="#f6f8f8"/><stop offset=".62" stop-color="#73848c"/><stop offset=".85" stop-color="#dae2e5"/><stop offset="1" stop-color="#85949a"/></linearGradient><radialGradient id="'+id+'r"><stop stop-color="#fff" stop-opacity=".2"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#020406" stop-opacity=".2"/></radialGradient></defs>'+
    '<ellipse cx="112" cy="83" rx="73" ry="54" fill="#000" opacity=".52"/>'+
    '<g transform="translate(0 6) rotate(-11 112 76) scale(1 .86)">'+
    '<path d="'+edge+'" fill="url(#'+id+'g)" stroke="#e0edf0" stroke-width="1.2"/>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="57" fill="url(#'+id+'r)"/>'+
    rings+'<circle cx="'+cx+'" cy="'+cy+'" r="13" fill="none" stroke="#3d4f59" stroke-width="2"/>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="8.2" fill="#111b21" stroke="#e9f2f4" stroke-width="3"/>'+
    notches+inserts+'</g>'+
    '<path d="M 171 31h35" stroke="#fbe12a" stroke-width="2" opacity=".8"/><path d="M 180 35h26" stroke="#fbe12a" stroke-width=".8" opacity=".35"/>'+
    '</svg>';
  };
  const drawTool=(i)=>{
    const id='ft'+i,kind=i-32;
    const head=kind===0?
      '<rect x="65" y="59" width="107" height="51" rx="8" fill="url(#'+id+'m)" stroke="#e1e9ed"/>'+
      '<path d="M75 65l18 28 18-28 18 28 18-28 16 26" fill="none" stroke="#1b2930" stroke-width="13"/>':
      kind===1?
      '<ellipse cx="117" cy="85" rx="56" ry="30" fill="url(#'+id+'m)" stroke="#eef4f4" stroke-width="3"/>'+
      '<circle cx="117" cy="85" r="18" fill="#27343c" stroke="#dee8e9" stroke-width="4"/>'+
      '<path d="M 72 66l10-15m38 6l2-16m39 27l13-10" stroke="#fbe12a" stroke-width="7"/>':
      '<rect x="104" y="31" width="25" height="75" rx="5" fill="url(#'+id+'m)" stroke="#dce8eb" stroke-width="2"/>'+
      '<path d="M96 100l16-24 17 8 13-8-10 43-17 10-19-12z" fill="url(#'+id+'m)" stroke="#dce8eb" stroke-width="3"/>'+
      '<path d="M99 109l35 5M108 92l24 3" stroke="#fbe12a" stroke-width="4"/>';
    return '<svg viewBox="0 0 240 150" role="presentation" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="'+id+'m" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8eceb"/><stop offset=".32" stop-color="#7d929b"/><stop offset=".64" stop-color="#e2e8eb"/><stop offset="1" stop-color="#4b606a"/></linearGradient></defs>'+
    '<ellipse cx="120" cy="129" rx="82" ry="10" fill="#000" opacity=".42"/>'+head+
    '<path d="M168 36h39" stroke="#fbe12a" stroke-width="2"/><path d="M182 41h25" stroke="#fbe12a" stroke-width="1" opacity=".45"/></svg>';
  };
  document.querySelectorAll('article.saw-item').forEach((el,i)=>{
    const svg=el.querySelector('.saw-disc svg');
    if(!svg)return;
    const art=el.dataset.family==='tools'?drawTool(i):drawBlade(i,el.dataset.family);
    const wrap=svg.parentElement;
    wrap.innerHTML=art;
    wrap.title=ar?'رسم توضيحي للفئة، وليس صورة منتج محدد':'Family illustration; not an exact product photograph';
  });
})();