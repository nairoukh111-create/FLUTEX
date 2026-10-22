(() => {
  'use strict';
  const norm = value => String(value || '').normalize('NFKC').toLowerCase()
    .replace(/[®™\u064b-\u065f\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا')
    .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\s+/g, ' ').trim();
  function search(index, query, language = 'en') {
    const q = norm(query);
    if (q.length < 2) return [];
    const parts = q.split(' ');
    const best = new Map();
    for (const entry of index) {
      const title = norm(entry.title);
      const refs = (entry.refs || []).map(norm);
      const hay = norm([entry.title, entry.type, entry.description, entry.terms, refs.join(' ')].join(' '));
      const matched = parts.filter(part => hay.includes(part)).length;
      let score = (hay.includes(q) ? 20 : 0) + (title.includes(q) ? 25 : 0) + (refs.includes(q) ? 100 : 0);
      score += matched * 4 - (parts.length - matched) * 6;
      if (score <= 0 || !entry.url.startsWith('/') || entry.url.startsWith('//')) continue;
      const item = {...entry, score, preferred: entry.lang === language};
      const key = entry.url.replace(/^\/ar\//, '/');
      const previous = best.get(key);
      if (!previous || score > previous.score || score === previous.score && item.preferred && !previous.preferred) best.set(key, item);
    }
    return [...best.values()].sort((a, b) => b.score - a.score || Number(b.preferred) - Number(a.preferred) || a.title.localeCompare(b.title)).slice(0, 12);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {search, norm};
  if (typeof document === 'undefined') return;
  const dialog = document.querySelector('#global-search');
  const input = dialog?.querySelector('[data-global-search-input]');
  const results = dialog?.querySelector('[data-global-search-results]');
  if (!dialog || !input || !results) return;
  const ar = document.documentElement.lang.startsWith('ar');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function render() {
    if (norm(input.value).length < 2) {
      results.textContent = ar ? 'اكتب حرفين على الأقل.' : 'Type at least 2 characters.';
      return;
    }
    const hits = search(window.FLUTEX_SEARCH_INDEX || [], input.value, ar ? 'ar' : 'en');
    results.innerHTML = hits.length ? hits.map(item => `<a class="global-search-result" href="${esc(item.url)}"><span class="global-search-type">${esc(item.type)}${ar && item.lang === 'en' ? ' · English' : ''}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div><span class="global-search-arrow">${ar ? '←' : '→'}</span></a>`).join('') : `<div class="global-search-empty">${ar ? 'لا توجد مطابقة. جرّب موديل النظام أو المعيار أو رقم القطعة الأصلي.' : 'No match. Try a system model, standard or original reference.'}</div>`;
  }
  function open() { dialog.showModal(); input.focus(); }
  document.querySelectorAll('[data-search-open]').forEach(button => button.addEventListener('click', open));
  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  input.addEventListener('input', render);
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) {
      event.preventDefault(); open();
    }
  });
})();
