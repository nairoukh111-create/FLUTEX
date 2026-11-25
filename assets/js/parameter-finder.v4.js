(() => {
'use strict';
const FIELDS=["diameter","fluteLength","shankDiameter","overallLength"];
const OPTIONS={"toolMaterial":["carbide","hss","other"],"flutes":["1","2","3","4","other"],"workpiece":["al6063-t6-profile","al6061","al6082","other"],"cooling":["mql-external","flood","dry","other"]};
function parseDimension(value){const s=String(value).trim().replace(/[٠-٩۰-۹]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.includes(c)?'٠١٢٣٤٥٦٧٨٩'.indexOf(c):'۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٫,]/g,'.');if(!/^[0-9]+(?:[.][0-9]+)?$/.test(s))return null;const n=Number(s);return Number.isFinite(n)&&n>0&&n<=1000?n:null;}
function payload(values){const p={};for(const k of FIELDS){const n=parseDimension(values[k]);if(n===null)return null;p[k]=n;}for(const k of Object.keys(OPTIONS)){if(!OPTIONS[k].includes(values[k]))return null;p[k]=values[k];}if(p.fluteLength>=p.overallLength)return null;return p;}
function matchesResponse(data,p){return Array.isArray(data?.dimensions)&&data.dimensions.length===4&&FIELDS.every((k,i)=>data.dimensions[i]===p[k]);}
if(typeof module!=='undefined'&&module.exports)module.exports={parseDimension,payload,matchesResponse};
if(typeof document==='undefined')return;
const form=document.querySelector('[data-parameter-finder]');if(!form)return;
const result=document.querySelector('[data-pf-result]'),status=document.querySelector('[data-pf-status]'),button=form.querySelector('[type=submit]');
const ar=document.documentElement.lang.startsWith('ar'),t=(e,a)=>ar?a:e;
let serial=0,controller;
function clear(){serial++;if(controller)controller.abort();button.disabled=false;result.replaceChildren();result.hidden=true;status.textContent='';}
function el(tag,txt,cls){const e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;if(cls)e.className=cls;return e;}
function contact(){const a=el('a',t('Contact FLUTEX','تواصل مع FLUTEX'),'btn btn-primary');a.href=ar?'/ar/contact':'/contact';return a;}
function clampingGuide(p){
 const section=el('section',undefined,'pf-clamping-guide');
 section.append(el('h4',t('ER collet — correct tool clamping','الكوليت ER — التثبيت الصحيح للريشة')));
 const img=el('img',undefined,'pf-clamping-sketch');img.src='/assets/diagrams/er-collet-insertion.v1.svg';img.alt=t('Sectional sketch: A insertion, B stick-out, C collet length','رسم مقطعي: A عمق الإدخال، B البروز، C طول الكوليت');img.width=460;img.height=190;img.loading='lazy';section.append(img);
 section.append(el('p',t('A = shank insertion depth · B = stick-out · C = collet length','A = عمق إدخال الشنك · B = البروز · C = طول الكوليت'),'pf-note'));
 section.append(el('p',t('Insert the plain shank over the full collet length whenever possible. For standard REGO-FIX ER collets, engagement must be at least two thirds of collet length (A ≥ 2/3 C). Follow the actual holder manufacturer’s requirements; never grip the flutes or force the tool against an internal stop. Use the specified tightening torque and minimize stick-out.','أدخل الجزء الأسطواني من الشنك بطول الكوليت كاملًا متى أمكن. في كوليت REGO-FIX ER القياسي، لا يقل عمق الإدخال عن ثلثي طول الكوليت (A ≥ 2/3 C). اتبع تعليمات مصنع الحامل المستخدم؛ لا تثبت الفلوت داخل الكوليت ولا تجبر الريشة على الارتطام بمصد داخلي. استخدم عزم الشد المحدد وقلل البروز قدر الإمكان.'),'pf-note'));
 const source=el('a',t('Reference: REGO-FIX standard ER collet assembly guidance','المرجع: تعليمات تركيب كوليت ER القياسي من REGO-FIX'),'pf-clamping-source');source.href="https://us.rego-fix.com/en/products/collets/standard?system=ER";source.target='_blank';source.rel='noopener noreferrer';section.append(source);
 if(p.diameter===10&&p.fluteLength===20&&p.shankDiameter===10&&p.overallLength===120){
  section.append(el('p',t('120 mm tool — proposed setup: 40 mm shank insertion and approximately 80 mm stick-out (8 × cutting diameter), measured from the collet face. Confirm the actual collet length, available bore and clearance. Long overhang remains vibration-sensitive; cutting data requires setup verification and resolution of abnormal noise before use.','ريشة 120 مم — التركيب المقترح: إدخال الشنك 40 مم وبروز نحو 80 مم (8 أضعاف قطر القطع)، قياسًا من وجه الكوليت. تحقق من طول الكوليت الفعلي وعمق التجويف والخلوص. البروز الطويل يبقى حساسًا للاهتزاز؛ يلزم التحقق من التركيب ومعالجة الصوت غير الطبيعي قبل اعتماد قيم القطع.'),'pf-warning'));
 }
 section.append(el('p',t('Illustration is schematic, not to scale. Insertion depth is not a universal 40 mm value.','الرسم توضيحي وليس بمقياس رسم. عمق 40 مم ليس قيمة عامة لكل الريش.'),'pf-note'));
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
 const dl=el('dl',undefined,'pf-values');const names=['RPM',t('Removal¹','Removal¹'),t('Feed (mm/min)','التغذية (مم/دقيقة)'),t('fz (mm/tooth)','fz (مم/سن)'),t('Vc (m/min)','Vc (م/دقيقة)'),t('ap — initial step-down (mm)','ap — عمق التمريرة الأولية (مم)'),t('ae — cutting width (mm)','ae — عرض القطع (مم)')];
 names.forEach((name,i)=>{const box=el('div');const dt=el('dt',name),dd=el('dd',String(data.values[i]));dd.dir='ltr';box.append(dt,dd);dl.append(box);});result.append(dl);
 result.append(el('p',t('¹ Removal applies only to controllers using 0.01 mm/rev. Use Feed on mm/min controllers.','¹ قيمة Removal تنطبق فقط على وحدات التحكم التي تستخدم 0.01 مم/دورة. استخدم Feed لأنظمة مم/دقيقة.'),'pf-note'),el('p',t('For trained operators. Verify tool identity and rated RPM, spindle/holder limits, actual stick-out, runout, clamping, engagement and MQL chip evacuation. Stop on abnormal noise, vibration, chip packing or edge damage. For shallow full-width slotting in 6063-T6 profiles with external MQL only. Use open-edge entry; no plunge rate is supplied. Do not use for full wall breakthrough in one pass.','للمشغلين المدربين. تحقق من هوية الأداة وحدود دورانها وحدود الإسبندل والحامل والبروز الفعلي والانحراف وتثبيت القطعة وعمق وعرض القطع ووصول MQL وإخراج الرايش. أوقف التشغيل عند صوت أو اهتزاز غير طبيعي أو تكدس الرايش أو تلف السن. للقطع بتمريرات سطحية بكامل عرض الريشة في بروفايلات 6063-T6 مع MQL خارجي فقط. دخول من حافة مفتوحة؛ لا توجد قيمة لسرعة النزول. لا تستخدم لاختراق الجدار كاملًا في تمريرة واحدة.'),'pf-note'));
 const extra=el('div',undefined,'pf-operation-grid');
 for(const [heading,description] of [[t('Straight plunge / Z feed','النزول العمودي / تغذية Z'),t('Not released. Center-cutting capability and axial feed must be verified. Do not use milling Feed as plunge feed.','غير منشورة. يجب التحقق من قابلية القطع المركزي وسرعة النزول. لا تستخدم تغذية التفريز كسرعة نزول.')],[t('Side milling','التفريز الجانبي'),t('Application-specific values not yet available.','لا توجد قيم منشورة لهذا التطبيق بعد.')],[t('Ramp / helical entry','الدخول المائل / الحلزوني'),t('Entry capability and feed not yet verified.','قابلية الدخول وسرعته غير مثبتتين بعد.')]]){const box=el('section',undefined,'pf-operation-card');box.append(el('h4',heading),el('p',description,'pf-note'));extra.append(box);}
 result.append(extra,clampingGuide(p),contact());result.hidden=false;
 }catch(err){if(requestSerial!==serial)return;result.replaceChildren();result.hidden=true;status.textContent=t('Lookup is temporarily unavailable. Please contact FLUTEX.','البحث غير متاح مؤقتًا. تواصل مع FLUTEX.');}finally{if(requestSerial===serial)button.disabled=false;}
});
})();
