(() => {
  'use strict';
  const MAX_ATTACHMENT_BYTES = 2.5 * 1024 * 1024;
  function acceptedServiceReply(response, data) {
    return response.status === 202 && data?.accepted === true &&
      /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(data.reference || '');
  }
  function enquiryText(values) {
    return ['Name: ' + (values.name || ''), 'Company: ' + (values.company || ''),
      'Email: ' + (values.email || ''), 'Phone: ' + (values.phone || ''),
      'Reference: ' + (values.partNumber || ''), 'Quantity: ' + (values.quantity || ''),
      'Category: ' + (values.category || ''),
      'Destination country: ' + (values.destinationCountry || ''),
      'Destination city: ' + (values.destinationCity || ''), '', values.message || ''].join('\n');
  }
  function emailDraft(email, values) {
    const subject = ('FLUTEX RFQ - ' + (values.partNumber || values.company || 'Industrial enquiry')).replace(/[\r\n]+/g, ' ');
    return 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(enquiryText(values));
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {enquiryText, emailDraft, acceptedServiceReply, MAX_ATTACHMENT_BYTES};
  if (typeof document === 'undefined') return;
  const form = document.querySelector('#rfq-form');
  if (!form) return;
  const ar = document.documentElement.lang.startsWith('ar');
  const cfg = window.FLUTEX_CONFIG || {};
  const status = form.querySelector('[data-rfq-status]');
  const button = form.querySelector('.rfq-submit');
  const note = form.querySelector('[data-rfq-note]');
  let ready = false;
  let widget;
  const text = ar ? {
    email: 'جهّز رسالة الطلب بالبريد ←', submit: 'إرسال الطلب ←', sending: 'جارٍ إرسال الطلب…',
    note: 'جهّز طلبك هنا ثم أرسله من تطبيق البريد. أضف المرفقات يدويًا قبل الإرسال. يمكنك أيضًا التواصل عبر واتساب.',
    secure: 'أرسل الطلب من النموذج. الحد الأقصى 4 مرفقات بإجمالي 2.5 ميجابايت؛ للملفات الأكبر استخدم البريد أو واتساب.',
    draft: 'تم تجهيز الطلب لتطبيق البريد؛ لم يُرسل تلقائيًا. أضف المرفقات ثم اضغط إرسال في تطبيقك.',
    error: 'تعذر تأكيد الإرسال الآن. بقيت بياناتك في النموذج؛ تواصل بالبريد أو واتساب قبل إعادة إرسال الطلب.',
    files: 'الحد الأقصى 4 ملفات بإجمالي 2.5 ميجابايت. استخدم PDF أو PNG أو JPG أو WebP أو DXF أو DWG.',
    verify: 'أكمل التحقق قبل إرسال الطلب.',
    copied: 'تم نسخ تفاصيل الطلب. الصقها في بريدك إلى sales@flutexindustrial.com أو في واتساب.',
    copyError: 'تعذر النسخ تلقائيًا؛ انسخ تفاصيل طلبك من الحقول وأرسلها بالبريد أو واتساب.'
  } : {
    email: 'Prepare email RFQ →', submit: 'Submit RFQ →', sending: 'Submitting…',
    note: 'Prepare your enquiry here, then send it from your email app. Add attachments manually before sending. You can also contact us on WhatsApp.',
    secure: 'Send the form with up to 4 attachments, 2.5 MB in total. Use email or WhatsApp for larger files.',
    draft: 'Your enquiry is prepared for your email app; it has not been sent automatically. Add attachments and select Send in your app.',
    error: 'Sending could not be confirmed. Your details remain in the form; contact us by email or WhatsApp before resubmitting.',
    files: 'Attach at most 4 files, up to 2.5 MB in total: PDF, PNG, JPG, WebP, DXF or DWG.',
    verify: 'Complete verification before submitting your enquiry.',
    copied: 'Enquiry copied. Paste it into an email to sales@flutexindustrial.com or into WhatsApp.',
    copyError: 'Automatic copying is unavailable. Copy your form details and send them by email or WhatsApp.'
  };
  function set(message, type = '') {
    status.textContent = message;
    status.className = 'rfq-status' + (type ? ' is-' + type : '');
  }
  function mode() {
    button.textContent = ready ? text.submit : text.email;
    if (note) note.textContent = ready ? text.secure : text.note;
  }
  function values() { return Object.fromEntries(new FormData(form).entries()); }
  mode();
  fetch(cfg.rfqEndpoint || '/api/rfq', {headers: {'Accept': 'application/json'}})
    .then(response => response.ok ? response.json() : null)
    .then(service => {
      const key = service?.turnstileSiteKey || cfg.turnstileSiteKey;
      if (!service?.available || !key) return;
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => {
        if (!window.turnstile) return;
        widget = window.turnstile.render('#turnstile-slot', {sitekey: key, theme: 'light', action: 'rfq',
          'expired-callback': () => set(text.verify), 'error-callback': () => set(text.verify, 'error')});
        ready = true;
        mode();
      };
      document.head.appendChild(script);
    }).catch(() => {});
  form.querySelector('[data-rfq-copy]')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(enquiryText(values())); set(text.copied); document.dispatchEvent(new CustomEvent('rfq_details_copied')); }
    catch (_) { set(text.copyError, 'error'); }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!ready) {
      set(text.draft); document.dispatchEvent(new CustomEvent('rfq_draft_prepared'));
      window.location.href = emailDraft(cfg.email || 'sales@flutexindustrial.com', values());
      return;
    }
    const files = [...(form.querySelector('#attachments')?.files || [])];
    if (files.length > 4 || files.reduce((sum, file) => sum + file.size, 0) > MAX_ATTACHMENT_BYTES ||
        files.some(file => !/\.(pdf|png|jpe?g|webp|dxf|dwg)$/i.test(file.name))) {
      set(text.files, 'error'); return;
    }
    const payload = new FormData(form);
    if (!payload.get('cf-turnstile-response')) { set(text.verify, 'error'); return; }
    button.disabled = true;
    button.textContent = text.sending;
    try {
      const response = await fetch(cfg.rfqEndpoint || '/api/rfq', {method: 'POST', body: payload});
      const result = await response.json();
      if (!acceptedServiceReply(response, result)) throw new Error('Submission not confirmed');
      set((ar ? 'قُبل طلبك للإرسال. رقم المتابعة: ' : 'Your enquiry was accepted for sending. Reference: ') + result.reference, 'success');
      document.dispatchEvent(new CustomEvent('rfq_service_accepted'));
      form.reset();
    } catch (_) {
      set(text.error, 'error');
    } finally {
      window.turnstile?.reset(widget);
      button.disabled = false;
      mode();
    }
  });
})();
