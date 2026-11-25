(() => {
  'use strict';
  function positive(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) throw new RangeError('Positive finite value required');
    return number;
  }
  function rpm(cuttingSpeed, effectiveDiameter) {
    const result = 1000 * positive(cuttingSpeed) / (Math.PI * positive(effectiveDiameter));
    return positive(result);
  }
  function feed(spindleSpeed, effectiveTeeth, feedPerTooth) {
    const teeth = positive(effectiveTeeth);
    if (!Number.isInteger(teeth)) throw new RangeError('Effective teeth must be an integer');
    return positive(positive(spindleSpeed) * teeth * positive(feedPerTooth));
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {rpm, feed};
  if (typeof document === 'undefined') return;
  const ar = document.documentElement.lang.startsWith('ar');
  const number = new Intl.NumberFormat(ar ? 'ar-SA' : 'en', {maximumFractionDigits: 2});
  document.querySelectorAll('[data-machining-calculator]').forEach(form => {
    const output = form.querySelector('output');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        const data = new FormData(form);
        const isRpm = form.dataset.machiningCalculator === 'rpm';
        const value = isRpm ? rpm(data.get('speed'), data.get('diameter')) : feed(data.get('rpm'), data.get('teeth'), data.get('chipload'));
        output.textContent = number.format(value) + (isRpm ? ' rpm' : (ar ? ' مم/دقيقة' : ' mm/min'));
      } catch (_) {
        output.textContent = ar ? 'أدخل قيمًا موجبة صالحة وعدد أسنان صحيحًا.' : 'Enter valid positive values and a whole number of teeth.';
      }
    });
  });
})();

(() => {
  'use strict';
  function norm(s){return String(s).toLowerCase().replace(/[٠-٩۰-۹]/g,c=>String("٠١٢٣٤٥٦٧٨٩".includes(c)?"٠١٢٣٤٥٦٧٨٩".indexOf(c):"۰۱۲۳۴۵۶۷۸۹".indexOf(c))).replace(/[ø⌀]/g,"").replace(/[×*]/g,"x").replace(/\bmm\b/g,"").replace(/[^\p{L}\p{N}]/gu,"");}
  function match(k, name, q){const n=norm(q);return !n||norm(k).includes(n)||norm(name).includes(n);}
  if (typeof module !== 'undefined' && module.exports) Object.assign(module.exports,{parameterNormalize:norm,parameterMatch:match});
  if (typeof document === 'undefined') return;
  const input=document.querySelector('[data-parameter-search]');
  if(!input) return;
  const records=Array.from(document.querySelectorAll('[data-parameter-record]'));
  const count=document.querySelector('[data-parameter-count]');
  const empty=document.querySelector('[data-parameter-empty]');
  const ar=document.documentElement.lang.startsWith('ar');
  function update(){let shown=0,trial=0;for(const r of records){const visible=match(r.dataset.parameterRecord,r.querySelector('th').textContent,input.value);r.hidden=!visible;if(visible){shown++;if(r.dataset.parameterStatus==='trial')trial++;}}count.textContent=ar?shown+' ريشة · '+trial+' سجلات اختبار أولي':shown+' tools · '+trial+' initial-trial records';empty.hidden=shown!==0;}
  input.addEventListener('input',update);update();
})();
