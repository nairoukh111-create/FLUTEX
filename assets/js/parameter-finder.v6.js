(() => {
'use strict';
const FIELDS=["diameter","fluteLength","shankDiameter","overallLength"];
const OPTIONS={"toolMaterial":["carbide","hss","other"],"flutes":["1","2","3","4","other"],"workpiece":["al6063-t6-profile","al6061","al6082","other"],"cooling":["mql-external","flood","dry","other"]};
function parseDimension(value){const s=String(value).trim().replace(/[٠-٩۰-۹]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.includes(c)?'٠١٢٣٤٥٦٧٨٩'.indexOf(c):'۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٫,]/g,'.');if(!/^[0-9]+(?:[.][0-9]+)?$/.test(s))return null;const n=Number(s);return Number.isFinite(n)&&n>0&&n<=1000?n:null;}
function payload(values){const p={};for(const k of FIELDS){const n=parseDimension(values[k]);if(n===null)return null;p[k]=n;}for(const k of Object.keys(OPTIONS)){if(!OPTIONS[k].includes(values[k]))return null;p[k]=values[k];}if(p.fluteLength>=p.overallLength)return null;return p;}
function matchesResponse(data,p){return Array.isArray(data?.dimensions)&&data.dimensions.length===4&&FIELDS.every((k,i)=>data.dimensions[i]===p[k]);}

// Conservative common ER series; nominal standard collet dimensions in mm.
const ER_SERIES=[[11,1,7,18,11.5],[16,1,10,27.5,17],[20,2,13,31.5,21],[25,2,16,34,26],[32,3,20,40,33],[40,4,26,46,41]];
function colletOptions(p){
 if(!FIELDS.every(k=>Number.isFinite(p[k])&&p[k]>0)||p.fluteLength>=p.overallLength)return [];
 return ER_SERIES.filter(([size,min,max,C])=>p.shankDiameter>=min&&p.shankDiameter<=max&&C<=p.overallLength-p.fluteLength).map(([size,min,max,C,outer])=>({size,C,outer,A:C,B:Math.round((p.overallLength-C)*1000)/1000}));
}
function longTool(p){return p.diameter===10&&p.fluteLength===20&&p.shankDiameter===10&&p.overallLength===120;}
function clampingSketch(p,o){
 if(!colletOptions(p).some(x=>x.size===o.size&&x.A===o.A&&x.B===o.B&&x.C===o.C&&x.outer===o.outer))return '';
 const W=900,x0=42,maxOuter=Math.max(...colletOptions(p).map(x=>x.outer),p.diameter,p.shankDiameter),s=Math.min(640/p.overallLength,200/maxOuter),maxR=maxOuter*s/2,y=65+maxR,flY=y+maxR+22,abY=flY+35,cY=abY+30,H=cY+14;
 const x=n=>Math.round((x0+n*s)*1000)/1000;
 const q=n=>Math.round(n*1000)/1000;
 const tip=x(0),fl=x(p.fluteLength),front=x(o.B),end=x(p.overallLength),rd=p.diameter*s/2,rs=p.shankDiameter*s/2,R=o.outer*s/2;
 const groove=x(o.B+o.C*.12),shoulder=x(o.B+o.C*.25),grooveEnd=x(o.B+o.C*.20),rear=Math.max(rs+s,R*.64);
 const top=q(y-R),bottom=q(y+R);
 const upper=[ [front,y-rs],[front,y-R*.78],[groove,y-R],[groove,y-R*.86],[grooveEnd,y-R*.86],[grooveEnd,y-R],[shoulder,y-R],[end,y-rear],[end,y-rs] ];
 const points=a=>a.map(([a,b])=>q(a)+','+q(b)).join(' ');
 const lower=upper.map(([a,b])=>[a,2*y-b]);
 const dim=(a,b,yy,label)=>'<path d="M'+a+' '+(yy-6)+'V'+(yy+6)+' M'+b+' '+(yy-6)+'V'+(yy+6)+' M'+a+' '+yy+'H'+b+'" stroke="#353b40" fill="none"/><text x="'+q((a+b)/2)+'" y="'+(yy-8)+'" text-anchor="middle" font-size="13" font-weight="600">'+label+'</text>';
 let slots='';
 for(const k of [.42,.68]){const sy=y-rs-(R*.78-rs)*k,ey=y-rs-(rear-rs)*k;slots+='<path d="M'+q(front+1)+' '+q(sy)+' L'+q(end-3)+' '+q(ey)+' M'+q(front+1)+' '+q(2*y-sy)+' L'+q(end-3)+' '+q(2*y-ey)+'" stroke="#363e45" stroke-width="1.7" fill="none"/>';}
 const cut='<path d="M'+tip+' '+q(y-rd)+'H'+fl+'V'+q(y-rs)+'H'+end+'V'+q(y+rs)+'H'+fl+'V'+q(y+rd)+'H'+tip+'Z" fill="#cdd2d6" stroke="#363e45" stroke-width="1.3"/>';
 const helix='<path d="M'+tip+' '+q(y+rd*.75)+' Q'+q((tip+fl)/2)+' '+q(y-rd*1.7)+' '+fl+' '+q(y-rd*.45)+' M'+tip+' '+q(y-rd*.65)+' Q'+q((tip+fl)/2)+' '+q(y+rd*1.3)+' '+fl+' '+q(y+rd*.35)+'" fill="none" stroke="#555f66" stroke-width="1.5"/>';
 const faceX=800,faceR=42,faceBore=faceR*p.shankDiameter/o.outer;let faceSlots='';
 for(let i=0;i<8;i++){const a=i*Math.PI/4,inner=i%2===0?faceBore:faceBore+(faceR-faceBore)*.40,outer=i%2===0?faceR*.85:faceR;faceSlots+='<path d="M'+q(faceX+inner*Math.cos(a))+' '+q(y+inner*Math.sin(a))+' L'+q(faceX+outer*Math.cos(a))+' '+q(y+outer*Math.sin(a))+'" stroke="#343b40" stroke-width="2.8"/>';}
 const face='<circle cx="'+faceX+'" cy="'+y+'" r="'+faceR+'" fill="#a7afb5" stroke="#343b40" stroke-width="1.4"/><circle cx="'+faceX+'" cy="'+y+'" r="'+q(faceBore)+'" fill="#FBE12A" stroke="#343b40" stroke-width="1.4"/>'+faceSlots+'<text x="'+faceX+'" y="'+q(y-faceR-12)+'" text-anchor="middle" font-size="13" font-weight="700">ER '+o.size+'</text><text x="'+faceX+'" y="'+q(y+faceR+17)+'" text-anchor="middle" font-size="12">Ø'+p.shankDiameter+'</text>';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" role="img" aria-label="Tool and ER '+o.size+' collet, dimensions in millimetres" style="display:block;width:100%;height:auto;direction:ltr"><rect width="'+W+'" height="'+H+'" rx="8" fill="#f5f6f7"/><g fill="#20262a" font-family="Arial,sans-serif">'+dim(tip,end,32,'OAL '+p.overallLength+' mm')+'<path d="M'+(tip-8)+' '+y+'H'+(end+12)+'" stroke="#a2a8ad" stroke-dasharray="4 3"/>'+cut+helix+'<rect x="'+front+'" y="'+q(y-rs)+'" width="'+q(end-front)+'" height="'+q(2*rs)+'" fill="#FBE12A" opacity=".85"/><polygon points="'+points(upper)+'" fill="#a7afb5" stroke="#343b40" stroke-width="1.4"/><polygon points="'+points(lower)+'" fill="#89949c" stroke="#343b40" stroke-width="1.4"/>'+slots+'<path d="M'+front+' '+(top-4)+'V'+(bottom+4)+'" stroke="#414a50" stroke-dasharray="3 2"/><text x="'+q((front+end)/2)+'" y="'+q(top-13)+'" text-anchor="middle" font-size="14" font-weight="700">ER '+o.size+'</text>'+face+dim(tip,fl,flY,'FL '+p.fluteLength)+dim(tip,front,abY,'B '+o.B)+dim(front,end,abY,'A '+o.A)+dim(front,end,cY,'C '+o.C)+'</g></svg>';
}

if(typeof module!=='undefined'&&module.exports)module.exports={parseDimension,payload,matchesResponse,colletOptions,clampingSketch,longTool};
if(typeof document==='undefined')return;
const form=document.querySelector('[data-parameter-finder]');if(!form)return;
const result=document.querySelector('[data-pf-result]'),status=document.querySelector('[data-pf-status]'),button=form.querySelector('[type=submit]');
const ar=document.documentElement.lang.startsWith('ar'),t=(e,a)=>ar?a:e;
let serial=0,controller;
function clear(){serial++;if(controller)controller.abort();button.disabled=false;result.replaceChildren();result.hidden=true;status.textContent='';}
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e;}
function contact(){const a=el('a',t('Contact FLUTEX','تواصل مع FLUTEX'),'btn btn-primary');a.href=ar?'/ar/contact':'/contact';return a;}
function clampingGuide(p,onSelection){
 const section=el('section',undefined,'pf-clamping-guide');
 section.append(el('h4',t('ER collet — tool-specific setup','كوليت ER — تثبيت الريشة')));
 section.append(el('p','Ø'+p.diameter+' × FL'+p.fluteLength+' × Ø'+p.shankDiameter+' × OAL'+p.overallLength+' mm','pf-tool-dimensions'));
 const opts=colletOptions(p);
 if(!opts.length){section.append(el('p',t('No full-length ER fit in this guide. Check the actual holder.','لا يوجد خيار ER بتثبيت كامل الطول في هذا الدليل. تحقق من الحامل الفعلي.'),'pf-warning'));return section;}
 const field=el('label',t('Select your installed ER holder','اختر نوع كوليت ER المركب'),'pf-condition');
 const select=el('select');select.setAttribute?.('aria-label',t('ER collet size','مقاس كوليت ER'));
 for(const o of opts){const option=el('option','ER'+o.size+' — Ø'+p.shankDiameter+' mm');option.value=String(o.size);select.append(option);}
 const initial=longTool(p)?opts.find(o=>o.size===32)||opts[0]:opts[0];
 select.value=String(initial.size);field.append(select);
 const drawing=el('div',undefined,'pf-clamping-drawing'),values=el('dl',undefined,'pf-values pf-clamping-values'),note=el('p',undefined,'pf-note'),trial=el('p',undefined,'pf-warning');
 function render(){
  const o=opts.find(x=>String(x.size)===select.value)||initial;
  drawing.innerHTML=clampingSketch(p,o);onSelection?.(o);
  values.replaceChildren();
  for(const [label,value] of [[t('A — insertion','A — الإدخال'),o.A],[t('B — stick-out','B — البروز'),o.B],[t('C — collet length','C — طول الكوليت'),o.C]]){
   const box=el('div'),dd=el('dd',String(value)+' mm');dd.dir='ltr';box.append(el('dt',label),dd);values.append(box);
  }
  note.textContent=t('Nominal full-length insertion. Verify plain shank, bore clearance and tightening torque. Never grip flutes. Stop on abnormal noise/vibration.','إدخال اسمي بطول الكوليت. تحقق من الشنك الأملس والخلوص وعزم الشد. لا تثبت الفلوت. أوقف التشغيل عند صوت أو اهتزاز غير طبيعي.');
  trial.hidden=!longTool(p)||o.size===32;
  if(longTool(p))trial.textContent=o.size===32?t('120 mm trial: A = 40 mm; B = 80 mm max. Verify setup and center-cutting before plunge.','تجربة 120 مم: A = 40 مم؛ B = 80 مم كحد أقصى. تحقق من التركيب والقطع المركزي قبل النزول.'):t('Different setup: the listed 180 mm/min plunge trial is not verified for this ER selection.','تركيب مختلف: تجربة النزول 180 مم/دقيقة غير متحققة لهذا الخيار.');
 }
 select.onchange=render;render();
 section.append(field,drawing,values,note,trial);
 section.append(el('p',t('Side view proportional to tool dimensions; front view and cutting geometry illustrative. Options require full nominal collet length.','المنظر الجانبي بنسب أبعاد الريشة؛ المنظر الأمامي وشكل القطع توضيحيان. الخيارات تتطلب طول الكوليت الاسمي كاملًا.'),'pf-note'));
 return section;
}
form.addEventListener('input',clear);form.addEventListener('reset',clear);
form.addEventListener('submit',async event=>{
 event.preventDefault();clear();if(!form.reportValidity())return;
 const values=Object.fromEntries([...FIELDS,...Object.keys(OPTIONS)].map(k=>[k,form.elements.namedItem(k).value]));const p=payload(values);
 if(!p){status.textContent=t('Complete all application selections and enter four valid dimensions in mm.','أكمل اختيارات التشغيل وأدخل أربعة أبعاد صحيحة بالملليمتر.');return;}
 const requestSerial=serial;controller=new AbortController();button.disabled=true;status.textContent=t('Searching…','جاري البحث…');
 try{const response=await fetch('/api/cutting-parameters',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(p),cache:'no-store',signal:controller.signal});const data=await response.json();if(requestSerial!==serial)return;
 if(response.status===404&&data.status==='not-found'){status.textContent=t('No exact matching tool. Check the four dimensions or contact FLUTEX.','لا توجد ريشة مطابقة تمامًا. تحقق من الأبعاد الأربعة أو تواصل مع FLUTEX.');result.append(contact());result.hidden=false;return;}
 if(response.ok&&data.status==='unsupported'){status.textContent=t('No released cutting data for these operating conditions. Contact FLUTEX for a specific recommendation.','لا توجد بيانات قطع منشورة لظروف التشغيل المختارة. تواصل مع FLUTEX لتوصية خاصة بالتطبيق.');result.append(contact());result.hidden=false;return;}
 if(!response.ok||!matchesResponse(data,p)||typeof data.name!=='string'||!['trial','contact'].includes(data.status))throw Error('Invalid reply');
 const title=el('h3',data.name);title.dir='ltr';result.append(title);
 if(data.status==='contact'){status.textContent=t('Exact match found. Cutting data not released.','تم العثور على المقاس المطابق. بيانات القطع غير منشورة.');result.append(clampingGuide(p),contact());result.hidden=false;return;}
 if(!data.application||data.application.operation!=='full-slot-shallow'||data.application.entry!=='open-edge'||!Object.keys(OPTIONS).every(k=>data.application[k]===p[k]))throw Error('Application mismatch');
 if(!Array.isArray(data.values)||data.values.length!==7||!data.values.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>0))throw Error('Invalid values');
 status.textContent=t('Exact tool match found. See the available operation data below.','تم العثور على الريشة المطابقة. راجع بيانات العمليات المتاحة أدناه.');result.append(el('p',t('Initial trial only — not validated production settings.','اختبار أولي فقط — ليست إعدادات إنتاج مثبتة.'),'pf-warning'));
 result.append(el('h4',t('Slot milling — open-edge entry only','تفريز مجرى — دخول من حافة مفتوحة فقط'),'pf-operation-title'));
 const frame=el('section',undefined,'pf-parameter-frame');frame.append(el('h4',t('Machine input values','قيم الإدخال للماكينة'),'pf-frame-title'));
 const dl=el('dl',undefined,'pf-values');const names=['RPM',t('Removal¹','Removal¹'),t('Feed (mm/min)','التغذية (مم/دقيقة)'),t('fz (mm/tooth)','fz (مم/سن)'),t('Vc (m/min)','Vc (م/دقيقة)'),t('ap — initial step-down (mm)','ap — عمق التمريرة الأولية (مم)'),t('ae — cutting width (mm)','ae — عرض القطع (مم)')];
 let plungeDisplay;
 names.forEach((name,i)=>{const box=el('div');const dt=el('dt',name),dd=el('dd',String(data.values[i]));dd.dir='ltr';box.append(dt,dd);dl.append(box);});if(data.plungeTrial){const q=data.plungeTrial;if(p.diameter!==10||p.fluteLength!==20||p.shankDiameter!==10||p.overallLength!==120||q.status!=='conditional-trial'||q.feed!==180||q.insertion!==40||q.stickOut!==80)throw Error('Invalid plunge trial');const box=el('div',undefined,'pf-plunge-value');const dd=el('dd',String(q.feed));plungeDisplay=dd;dd.dir='ltr';box.append(el('dt',t('Plunge / Z feed (mm/min) — conditional','سرعة النزول Z (مم/دقيقة) — مشروطة')),dd);dl.append(box);}frame.append(dl);if(data.plungeTrial)frame.append(el('p',t('Plunge trial only: A = 40 mm, B ≤ 80 mm; verify center-cutting, clearance, chip evacuation and axial depth.','تجربة نزول فقط: A = 40 مم، B ≤ 80 مم؛ تحقق من القطع المركزي والخلوص وإخراج الرايش وعمق الدخول.'),'pf-note'));result.append(frame);
 result.append(el('p',t('¹ Removal: 0.01 mm/rev controllers only; otherwise use Feed.','¹ Removal: لأنظمة 0.01 مم/دورة فقط؛ وإلا استخدم Feed.'),'pf-note'),el('p',t('6063-T6 · external MQL · shallow full-width passes · open-edge entry. No one-pass wall breakthrough. Verify RPM limits, clamping, runout and chip evacuation.','6063-T6 · MQL خارجي · تمريرات سطحية بعرض الريشة · دخول من حافة مفتوحة. لا تخترق الجدار بتمريرة واحدة. تحقق من حدود الدوران والتثبيت والانحراف وإخراج الرايش.'),'pf-note'));
 if(!data.plungeTrial)result.append(el('p',t('Plunge: not released. Do not use milling Feed as plunge feed.','النزول: غير منشور. لا تستخدم تغذية التفريز للنزول.'),'pf-note'));
 result.append(clampingGuide(p,o=>{if(plungeDisplay)plungeDisplay.textContent=o.size===32?'180':'—';}),contact());result.hidden=false;
 }catch(err){if(requestSerial!==serial)return;result.replaceChildren();result.hidden=true;status.textContent=t('Lookup is temporarily unavailable. Please contact FLUTEX.','البحث غير متاح مؤقتًا. تواصل مع FLUTEX.');}finally{if(requestSerial===serial)button.disabled=false;}
});
})();
