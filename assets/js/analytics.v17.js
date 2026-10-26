(() => {
  'use strict';
  // A duplicate script inclusion must not create a second tag, page view or listener.
  if (window.__flutexAnalyticsInstalled) return;
  window.__flutexAnalyticsInstalled = true;
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
  // Only controlled campaign labels are eligible. Never copy arbitrary URL parameters.
  // Use non-personal campaign names; pattern checks cannot detect every personal name.
  function campaignFields() {
    const query = new URLSearchParams(location.search || '');
    const fields = {campaign_id: ''}; // Do not collect the unapproved utm_id parameter.
    const mapping = {
      utm_source: 'campaign_source', utm_medium: 'campaign_medium',
      utm_campaign: 'campaign_name', utm_content: 'campaign_content', utm_term: 'campaign_term'
    };
    Object.entries(mapping).forEach(([parameter, field]) => {
      const values = query.getAll(parameter);
      const value = values.length === 1 ? values[0].trim() : '';
      const controls = values.some(raw => /[\u0000-\u001f\u007f]/.test(raw));
      const safeCharacters = parameter === 'utm_source' || parameter === 'utm_medium'
        ? /^[A-Za-z0-9][A-Za-z0-9._-]*$/
        : /^[\p{L}\p{N} ._()+-]+$/u;
      const sensitive = value.replace(/\D/g, '').length >= 9 ||
        /[0-9a-f]{24,}|eyJ[A-Za-z0-9_-]{16,}/i.test(value);
      fields[field] = value && value.length <= 100 && safeCharacters.test(value) && !sensitive && !controls ? value : '';
    });
    // Explicit empty overrides also suppress rejected raw UTM values in the tag.
    return fields;
  }
  function pageContext() {
    let referrer = '';
    try {
      const url = new URL(document.referrer);
      if (url.protocol === 'https:' || url.protocol === 'http:') referrer = url.origin + '/';
    } catch (_) {}
    return {
      page_location: location.origin + location.pathname,
      page_referrer: referrer,
      page_title: document.title
    };
  }
  function productEnquiryLink(href) {
    try {
      const url = new URL(href, location.origin);
      return url.origin === location.origin &&
        /^\/(?:ar\/)?contact(?:\.html)?\/?$/.test(url.pathname) && url.searchParams.has('product');
    } catch (_) { return false; }
  }
  function send(name, method) {
    if (!accepted || !production || !loaded) return;
    // Fixed event names and method enums only: never form values, product prefill or link URLs.
    if (!['contact_click', 'product_enquiry_click', 'rfq_draft_prepared', 'rfq_details_copied', 'rfq_service_accepted'].includes(name)) return;
    const params = pageContext();
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
    const context = pageContext();
    // Defaults cover automatic engagement events as well as our manual events.
    window.gtag('set', context);
    window.gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ...context,
      // Official GA4 campaign fields retain attribution while page_location stays clean.
      ...campaignFields()
    });
    window.gtag('event', 'page_view', context);
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
    else if (productEnquiryLink(href)) send('product_enquiry_click', 'rfq');
  });
  ['rfq_draft_prepared', 'rfq_details_copied', 'rfq_service_accepted'].forEach(name => {
    document.addEventListener(name, () => send(name, 'rfq'));
  });
})();

