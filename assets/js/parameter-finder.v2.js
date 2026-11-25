(() => {
'use strict';
const FIELDS=["diameter","fluteLength","shankDiameter","overallLength"];
const OPTIONS={"toolMaterial":["carbide","hss","other"],"flutes":["1","2","3","4","other"],"workpiece":["al6063-t6-profile","al6061","al6082","other"],"cooling":["mql-external","flood","dry","other"],"operation":["full-slot-shallow","side-milling","drilling","other"],"entry":["open-edge","ramp","plunge","other"]};
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
 if(data.status==='contact'){status.textContent=t('Exact match found. Cutting data not released.','تم العثور على المقاس المطابق. بيانات القطع غير منشورة.');result.append(contact());result.hidden=false;return;}
 if(!data.application||!Object.keys(OPTIONS).every(k=>data.application[k]===p[k]))throw Error('Application mismatch');
 if(!Array.isArray(data.values)||data.values.length!==7||!data.values.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>0))throw Error('Invalid values');
 status.textContent=t('Exact tool and application match found.','تم العثور على الريشة وظروف التشغيل المطابقة.');result.append(el('p',t('Initial trial only — not validated production settings.','اختبار أولي فقط — ليست إعدادات إنتاج مثبتة.'),'pf-warning'));
 const dl=el('dl',undefined,'pf-values');const names=['RPM',t('Removal¹','Removal¹'),t('Feed (mm/min)','التغذية (مم/دقيقة)'),t('fz (mm/tooth)','fz (مم/سن)'),t('Vc (m/min)','Vc (م/دقيقة)'),t('ap — initial step-down (mm)','ap — عمق التمريرة الأولية (مم)'),t('ae — cutting width (mm)','ae — عرض القطع (مم)')];
 names.forEach((name,i)=>{const box=el('div');const dt=el('dt',name),dd=el('dd',String(data.values[i]));dd.dir='ltr';box.append(dt,dd);dl.append(box);});result.append(dl);
 result.append(el('p',t('¹ Removal applies only to controllers using 0.01 mm/rev. Use Feed on mm/min controllers.','¹ قيمة Removal تنطبق فقط على وحدات التحكم التي تستخدم 0.01 مم/دورة. استخدم Feed لأنظمة مم/دقيقة.'),'pf-note'),el('p',t('For trained operators. Verify tool identity and rated RPM, spindle/holder limits, actual stick-out, runout, clamping, engagement and MQL chip evacuation. Stop on abnormal noise, vibration, chip packing or edge damage. For shallow full-width slotting in 6063-T6 profiles with external MQL only. Use open-edge entry; no plunge rate is supplied. Do not use for full wall breakthrough in one pass.','للمشغلين المدربين. تحقق من هوية الأداة وحدود دورانها وحدود الإسبندل والحامل والبروز الفعلي والانحراف وتثبيت القطعة وعمق وعرض القطع ووصول MQL وإخراج الرايش. أوقف التشغيل عند صوت أو اهتزاز غير طبيعي أو تكدس الرايش أو تلف السن. للقطع بتمريرات سطحية بكامل عرض الريشة في بروفايلات 6063-T6 مع MQL خارجي فقط. دخول من حافة مفتوحة؛ لا توجد قيمة لسرعة النزول. لا تستخدم لاختراق الجدار كاملًا في تمريرة واحدة.'),'pf-note'),contact());result.hidden=false;
 }catch(err){if(requestSerial!==serial)return;result.replaceChildren();result.hidden=true;status.textContent=t('Lookup is temporarily unavailable. Please contact FLUTEX.','البحث غير متاح مؤقتًا. تواصل مع FLUTEX.');}finally{if(requestSerial===serial)button.disabled=false;}
});
})();
