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
