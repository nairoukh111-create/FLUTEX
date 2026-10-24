(() => {
  'use strict';
  const id = 'G-NHDB1BF095'; // Public GA4 measurement ID, not a credential.
  const key = 'flutex-analytics-choice-v1';
  const ar = document.documentElement.lang.startsWith('ar');
  const production = location.hostname === 'flutexindustrial.com';
  let accepted = false;
  let loaded = false;
  const expiry = 180 * 24 * 60 * 60 * 1000;
  function readChoice() {
    try {
      const choice = JSON.parse(localStorage.getItem(key));
      return choice && Date.now() - choice.time < expiry ? choice.value : null;
    } catch (_) { return null; }
  }
  function send(name, method) {
    if (!accepted || !production || !loaded) return;
    // Fixed event names and method enums only: never form values, link URLs or search terms.
    if (!['contact_click', 'rfq_draft_prepared', 'rfq_details_copied', 'rfq_service_accepted'].includes(name)) return;
    const params = {page_location: location.origin + location.pathname, page_title: document.title};
    if (['whatsapp', 'email', 'phone', 'rfq'].includes(method)) params.contact_method = method;
    window.gtag('event', name, params);
  }
  function start() {
    if (!production || loaded) return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      // Do not transmit referrer paths, fragments, queries or RFQ prefill values.
      page_referrer: (() => { try { return document.referrer ? new URL(document.referrer).origin + '/' : ''; } catch (_) { return ''; } })(),
      page_title: document.title
    });
    window.gtag('event', 'page_view');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
  }
  function clearCookies() {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', ';domain=' + location.hostname, ';domain=.' + location.hostname].forEach(domain => {
        document.cookie = name + '=;max-age=0;path=/' + domain + ';SameSite=Lax';
      });
    });
  }
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet'; sheet.href = '/assets/css/analytics-choice.v1.css'; document.head.appendChild(sheet);
  const panel = document.createElement('section');
  panel.className = 'analytics-choice';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', ar ? 'خيارات إحصاءات الموقع' : 'Website analytics choices');
  panel.hidden = true;
  const copy = document.createElement('p');
  copy.textContent = ar ? 'هل تسمح بإحصاءات Google Analytics لفهم الزيارات ونقرات التواصل؟ اختيارية، ولا نرسل محتوى نموذجك ضمن أحداث القياس.' : 'Allow optional Google Analytics to understand visits and contact clicks? We do not send your form contents as analytics events.';
  panel.appendChild(copy);
  const privacy = document.createElement('a'); privacy.href = '/privacy'; privacy.textContent = ar ? 'الخصوصية' : 'Privacy'; panel.appendChild(privacy);
  const controls = document.createElement('div'); controls.className = 'analytics-choice-actions'; panel.appendChild(controls);
  function choose(value) {
    accepted = value === 'accepted';
    try { localStorage.setItem(key, JSON.stringify({value, time: Date.now()})); } catch (_) {}
    panel.hidden = true;
    if (accepted) {
      window['ga-disable-' + id] = false;
      if (loaded) window.gtag('consent', 'update', {analytics_storage: 'granted'});
      else start();
    } else {
      window['ga-disable-' + id] = true;
      if (loaded) window.gtag('consent', 'update', {analytics_storage: 'denied'});
      clearCookies();
    }
  }
  [['declined', ar ? 'رفض' : 'Decline'], ['accepted', ar ? 'السماح بالإحصاءات' : 'Allow analytics']].forEach(([value, label]) => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
    button.addEventListener('click', () => choose(value)); controls.appendChild(button);
  });
  document.body.appendChild(panel);
  const settings = document.createElement('button');
  settings.type = 'button'; settings.className = 'analytics-settings';
  settings.textContent = ar ? 'خيارات الإحصاءات' : 'Analytics choices';
  settings.addEventListener('click', () => { panel.hidden = false; controls.querySelector('button').focus(); });
  (document.querySelector('.footer-bottom') || document.body).appendChild(settings);
  const saved = readChoice();
  accepted = saved === 'accepted';
  window['ga-disable-' + id] = !accepted;
  if (accepted) start();
  else if (saved !== 'declined') panel.hidden = false;
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const method = /^https:\/\/(?:wa\.me|api\.whatsapp\.com)\//.test(href) ? 'whatsapp' : /^mailto:/i.test(href) ? 'email' : /^tel:/i.test(href) ? 'phone' : null;
    if (method) send('contact_click', method);
  });
  ['rfq_draft_prepared', 'rfq_details_copied', 'rfq_service_accepted'].forEach(name => {
    document.addEventListener(name, () => send(name, 'rfq'));
  });
})();
