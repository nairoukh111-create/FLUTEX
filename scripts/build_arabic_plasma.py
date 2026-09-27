#!/usr/bin/env python3
"""
Build Arabic counterparts for the plasma pages.

- ar/plasma/<slug>.html for all 39 system pages and 10 brand hub pages
- header/footer reused verbatim from the existing ar/plasma-consumables.html
- Arabic FAQ + FAQPage / ItemList / BreadcrumbList / WebPage JSON-LD
- reciprocal hreflang added to the English pages
- new URLs appended to sitemap.xml

Idempotent.
"""
import json, re, glob, html, urllib.parse, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
E = lambda s: html.escape(str(s), quote=True)
BASE = "https://flutexindustrial.com"

COMP = {
    "Cathode": "كاثود", "Ceramic Shield": "شيلد سيراميك", "Cooling Tube": "أنبوب تبريد",
    "Deflector": "ديفلكتور", "Diffuser": "ديفيوزر", "Electrode": "إلكترود",
    "Electrode Holder": "حامل إلكترود", "Gas Baffle": "حاجز غاز", "Gas Diffuser": "موزّع غاز",
    "Gas Distributor": "موزّع غاز", "Inner Retaining Cap": "كاب تثبيت داخلي",
    "Insulation Ring": "حلقة عزل", "Insulator": "عازل", "Nozzle": "نوزل",
    "Nozzle Base": "قاعدة نوزل", "Nozzle Cap": "كاب نوزل", "Nozzle Tip": "رأس نوزل",
    "O-Ring": "أورينغ", "Outer Retaining Cap": "كاب تثبيت خارجي", "Protection Cap": "كاب حماية",
    "Retainer Cup": "كوب تثبيت", "Retaining Cap": "كاب تثبيت", "Shield": "شيلد",
    "Shield Cap": "كاب شيلد", "Shield Cup": "كوب شيلد", "Silver Electrode": "إلكترود فضي",
    "Spacer": "سبيسر", "Spring": "سوستة", "Standoff Guide": "دليل ارتفاع",
    "Start Cartridge": "كرتريدج إقلاع", "Swirl Gas Cap": "كاب غاز دوّار",
    "Swirl Ring": "سويرل رينغ", "Tip": "تيب", "Torch Body": "جسم تورش",
    "Torch Head": "رأس تورش", "Torch Parts": "قطع تورش", "Torch Sleeve": "غلاف تورش",
    "Water Tube": "أنبوب ماء",
}
APP = {
    "3D": "قص ثلاثي الأبعاد", "Air": "هواء", "Bevel": "شطف (Bevel)", "Cutting": "قص",
    "FineCut": "قص دقيق (FineCut)", "Gouging": "تجويف (Gouging)", "Hand Torch": "تورش يدوي",
    "Machine Torch": "تورش ماكينة", "Mild Steel": "حديد طري", "Non-Ferrous": "معادن غير حديدية",
    "Ohmic": "أوميك", "Oxygen": "أكسجين", "Stainless Steel": "ستانلس ستيل",
}
ar_comp = lambda c: COMP.get(c, c)
ar_app = lambda a: APP.get(a, a)


def arjoin(xs, last="و"):
    xs = list(xs)
    if len(xs) == 1:
        return xs[0]
    return "، ".join(xs[:-1]) + f" {last}" + xs[-1]


def load_systems():
    s = open("assets/js/plasma-finder.v15.js", encoding="utf-8").read()
    i = s.index("const systems = ") + len("const systems = ")
    d = 0
    for k in range(i, len(s)):
        if s[k] == "[":
            d += 1
        elif s[k] == "]":
            d -= 1
            if d == 0:
                return json.loads(s[i:k + 1])


def chrome():
    """Reuse the real Arabic header/footer so nothing drifts."""
    h = open("ar/plasma-consumables.html", encoding="utf-8").read()
    head = h[h.index("<body"):h.index('<main id="main-content">') + len('<main id="main-content">')]
    foot = h[h.index("</main>"):]
    return head, foot


def ld(*objs):
    return "".join('<script type="application/ld+json">' + json.dumps(o, ensure_ascii=False)
                   + "</script>" for o in objs)


def page(title, desc, ar_url, en_url, body, lds):
    head, foot = CHROME
    # the shared header marks "المنتجات" as the active page; drop that here
    h = head.replace(' class="active" aria-current="page"', "")
    return (
        '<!DOCTYPE html>\n<html lang="ar" dir="rtl"><head><meta charset="utf-8"/>'
        '<meta content="width=device-width,initial-scale=1,viewport-fit=cover" name="viewport"/>'
        f"<title>{E(title)}</title>"
        f'<meta name="description" content="{E(desc)}"/>'
        f'<link rel="canonical" href="{ar_url}"/>'
        f'<link rel="alternate" hreflang="ar-SA" href="{ar_url}"/>'
        f'<link rel="alternate" hreflang="en" href="{en_url}"/>'
        f'<link rel="alternate" hreflang="x-default" href="{en_url}"/>'
        '<meta name="robots" content="index,follow,max-image-preview:large"/>'
        '<meta name="theme-color" content="#fbe12a"/>'
        '<meta property="og:type" content="website"/>'
        f'<meta property="og:title" content="{E(title)}"/>'
        f'<meta property="og:description" content="{E(desc)}"/>'
        f'<meta property="og:url" content="{ar_url}"/>'
        '<meta property="og:image" content="https://flutexindustrial.com/assets/social/og-plasma-consumables.webp"/>'
        '<meta property="og:site_name" content="FLUTEX Industrial"/>'
        '<meta name="twitter:card" content="summary_large_image"/>'
        '<link rel="icon" type="image/png" href="/assets/favicon.png"/>'
        '<link rel="apple-touch-icon" href="/assets/favicon.png"/>'
        '<link rel="manifest" href="/site.webmanifest"/>'
        '<link rel="stylesheet" href="/assets/css/styles.v18.css"/>'
        + ld(*lds) + "</head>" + h + body + foot
    )


def faq_block(qa):
    items = "".join(f'<div class="seo-faq-item"><h3>{E(q)}</h3><p>{E(a)}</p></div>' for q, a in qa)
    return ('<section class="seo-section seo-section-alt seo-faq"><div class="container">'
            f'<h2>الأسئلة الشائعة</h2><div class="seo-faq-list">{items}</div></div></section>')


def faq_ld(qa):
    return {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": "ar-SA",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qa]}


SAUDI_A = ("نعم. عمليات FLUTEX في الشرق الأوسط مدعومة من الرياض، ونخدم المصانع وورش التصنيع "
           "في جميع أنحاء المملكة العربية السعودية — الرياض وجدة والدمام والجبيل — إضافة إلى "
           "دول الخليج وتركيا. السعر والتوفر ومدة التوريد تُحدد مع عرض السعر.")


def system_page(it, en_slug):
    sysname = " / ".join(it["systems"])
    brand, fam = it["brand"], it["family"]
    comps = [ar_comp(c) for c in it["components"]]
    apps = [ar_app(a) for a in it["applications"]]
    refs = it["references"]
    n = len(refs)
    ar_url = f"{BASE}/ar/plasma/{en_slug}"
    en_url = f"{BASE}/plasma/{en_slug}"
    title = f"مستهلكات بلازما {sysname} متوافقة – {brand} | FLUTEX"
    desc = (f"قطع غيار بلازما متوافقة لنظام {brand} {sysname}: {arjoin(comps[:5])}. "
            f"تغطية {n} رقم مرجع أصلي. أرسل رقم القطعة لعرض سعر من FLUTEX.")

    qa = [
        (f"ما هي المستهلكات المتوفرة لنظام {brand} {sysname}؟",
         f"توفّر FLUTEX قطعاً متوافقة تشمل {arjoin(comps)} لعائلة {fam} من {brand}، "
         f"وتغطي تطبيقات {arjoin(apps)}."),
        (f"هل يتم مطابقة أرقام القطع الأصلية لـ {brand} {sysname}؟",
         f"نعم. هذا النطاق يغطي {n} رقم مرجع أصلي من {brand} لنظام {sysname}، "
         f"من ضمنها {'، '.join(refs[:4])} وغيرها مما هو مدرج في هذه الصفحة. "
         f"أرسل الرقم الأصلي وسنؤكد القطعة البديلة المتوافقة كتابياً قبل عرض السعر. "
         f"أسماء العلامات وأرقام القطع تُستخدم لتحديد التوافق فقط ولا تُباع كقطع OEM أصلية "
         f"إلا إذا ذُكر ذلك صراحة في عرض السعر."),
        (f"ما المعلومات المطلوبة لتسعير مستهلكات {sysname}؟",
         f"أرسل رقم المرجع الأصلي، وموديل النظام ({sysname})، والأمبير التشغيلي، "
         f"والتطبيق ({arjoin(apps, 'أو ')})، والكمية المطلوبة."),
        (f"هل توفّرون مستهلكات {sysname} في السعودية؟", SAUDI_A),
    ]

    others = [o for o in SYSTEMS if o["brand"] == brand and o is not it and keyof(o) in SLUG]
    links = "".join(
        f'<li><a href="/ar/plasma/{SLUG[keyof(o)]}">{E(" / ".join(o["systems"]))} <span>←</span></a></li>'
        for o in others[:12])
    links += '<li><a href="/ar/plasma-consumables">كل أنظمة البلازما <span>←</span></a></li>'

    rfq = urllib.parse.quote(f"Plasma - {brand} - {sysname}")
    body = (
        f'<section class="product-category-hero seo-hero" style="background-image:url(\'/assets/catalog/plasma-cover.webp\')">'
        '<div class="product-category-hero-overlay"></div><div class="container product-category-hero-inner">'
        '<div class="product-breadcrumb"><a href="/ar/">الرئيسية</a><span>←</span>'
        '<a href="/ar/products">المنتجات</a><span>←</span>'
        '<a href="/ar/plasma-consumables">مستهلكات البلازما</a><span>←</span>'
        f'<strong>{E(sysname)}</strong></div>'
        f'<div class="eyebrow">متوافق مع {E(brand)} · {E(fam)}</div>'
        f'<h1>مستهلكات {E(sysname)} المتوافقة</h1>'
        f'<p>إلكترودات ونوزلات وشيلدات وقطع تورش مطابقة لأرقام المرجع الأصلية من {E(brand)}.</p>'
        "</div></section>"
        '<section class="seo-section"><div class="container seo-grid"><div class="seo-copy">'
        f'<span class="catalog-tag">متوافق مع {E(brand)}</span>'
        f'<h2>قطع غيار بديلة لنظام {E(sysname)}</h2>'
        f'<p>قطع مستهلكة متوافقة لنظام {E(sysname)} بتكويناته المختلفة. توفّر FLUTEX '
        f'{E(arjoin(comps))} لأنظمة {E(brand)} {E(fam)}، بما يغطي {E(arjoin(apps))}.</p>'
        '<p>المشترون الصناعيون يعتمدون هذا النطاق للاستهلاك المتكرر على طاولات القص والتورشات '
        'اليدوية. كل طلب يُطابق برقم المرجع الأصلي حتى يتمكن قسم المشتريات والإنتاج من التحقق '
        'بدقة مما سيتم استلامه.</p>'
        '<dl class="seo-spec">'
        f'<div><dt>العلامة المتوافقة</dt><dd>{E(brand)}</dd></div>'
        f'<div><dt>عائلة النظام</dt><dd>{E(fam)}</dd></div>'
        f'<div><dt>الموديلات</dt><dd>{E(sysname)}</dd></div>'
        f'<div><dt>المكوّنات</dt><dd>{E(" · ".join(comps))}</dd></div>'
        f'<div><dt>التطبيقات</dt><dd>{E(" · ".join(apps))}</dd></div>'
        f'<div><dt>أرقام المرجع المغطاة</dt><dd>{n}</dd></div></dl>'
        f'<div class="seo-actions"><a class="btn btn-primary" href="/ar/contact?product={rfq}">اطلب عرض سعر لـ {E(sysname)} ←</a>'
        f'<a class="btn btn-outline" href="https://wa.me/966531402801?text={urllib.parse.quote("طلب عرض سعر: " + brand + " " + sysname)}" rel="noopener" target="_blank">واتساب</a></div>'
        '</div><div class="seo-media">'
        f'<img alt="مستهلكات بلازما متوافقة لنظام {E(brand)} {E(sysname)}" decoding="async" height="652" loading="lazy" src="/assets/catalog/plasma-parts.webp" width="869"/>'
        "</div></div></section>"
        '<section class="seo-section seo-section-alt"><div class="container">'
        "<h2>أرقام المرجع الأصلية المغطاة</h2>"
        f'<p class="seo-lead">تتوفر بدائل متوافقة مقابل أرقام القطع الأصلية التالية من {E(brand)} '
        f'لنظام {E(sysname)}. أرسل رقم المرجع والأمبير والكمية، ويتم تأكيد المطابقة والتوفر في عرض السعر.</p>'
        '<ul class="seo-refs">' + "".join(f"<li>{E(r)}</li>" for r in refs) + "</ul>"
        '<p class="seo-notice"><strong>تنبيه التوافق.</strong> أسماء العلامات والأنظمة وأرقام القطع '
        'تخص مالكيها وتُستخدم فقط لتحديد التوافق. FLUTEX غير تابعة لتلك الشركات ولا معتمدة منها، '
        'والقطع البديلة لا تُمثَّل كقطع OEM أصلية إلا إذا ذُكر ذلك صراحة في عرض السعر.</p>'
        "</div></section>"
        '<section class="seo-section"><div class="container seo-two"><div><h2>كيف تطلب</h2>'
        '<ol class="seo-steps">'
        '<li><strong>أرسل رقم المرجع</strong><span>رقم القطعة الأصلي وموديل النظام والأمبير والتطبيق.</span></li>'
        '<li><strong>نؤكد المطابقة</strong><span>تتحقق FLUTEX من البديل المتوافق لكل رقم وتؤكده كتابياً.</span></li>'
        '<li><strong>تستلم عرض السعر</strong><span>وصف واضح للأصناف والكميات ومدة التوريد للتوريد المتكرر.</span></li>'
        "</ol></div>"
        f"<div><h2>أنظمة {E(brand)} الأخرى</h2><ul class=\"seo-links\">{links}</ul></div>"
        "</div></section>"
        + faq_block(qa) +
        '<section class="cta"><div class="container cta-inner"><div><h2>معك رقم قطعة؟</h2>'
        f'<p>أرسل رقم مرجع {E(brand)} وموديل النظام والكمية للمطابقة الدقيقة.</p></div>'
        f'<a class="btn btn-dark" href="/ar/contact?product={rfq}">اطلب عرض سعر ←</a></div></section>'
    )

    lds = [
        {"@context": "https://schema.org", "@type": "WebPage", "name": title,
         "description": desc, "url": ar_url, "inLanguage": "ar-SA"},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": f"{BASE}/ar/"},
            {"@type": "ListItem", "position": 2, "name": "المنتجات", "item": f"{BASE}/ar/products"},
            {"@type": "ListItem", "position": 3, "name": "مستهلكات البلازما",
             "item": f"{BASE}/ar/plasma-consumables"},
            {"@type": "ListItem", "position": 4, "name": sysname, "item": ar_url}]},
        faq_ld(qa),
        {"@context": "https://schema.org", "@type": "ItemList",
         "name": f"أرقام المرجع الأصلية – {brand} {sysname}", "url": ar_url,
         "numberOfItems": n, "itemListElement": [
            {"@type": "ListItem", "position": p, "name": r} for p, r in enumerate(refs, 1)]},
    ]
    return page(title, desc, ar_url, en_url, body, lds)


def brand_page(brand, items, en_slug):
    ar_url = f"{BASE}/ar/plasma/{en_slug}"
    en_url = f"{BASE}/plasma/{en_slug}"
    total = sum(len(i["references"]) for i in items)
    comps = sorted({ar_comp(c) for i in items for c in i["components"]})
    title = f"مستهلكات بلازما {brand} متوافقة في السعودية | FLUTEX"
    desc = (f"قطع غيار بلازما متوافقة لأنظمة {brand}: {arjoin(comps[:5])}. "
            f"{len(items)} عائلة نظام و{total} رقم مرجع أصلي. عروض أسعار للسعودية والخليج.")
    qa = [
        (f"ما أنظمة {brand} التي تغطيها FLUTEX؟",
         f"تغطي FLUTEX {len(items)} عائلة أنظمة من {brand}: "
         f"{arjoin([' / '.join(i['systems']) for i in items])}. لكل نظام صفحة خاصة تسرد أرقام المرجع المغطاة."),
        (f"كم عدد أرقام مرجع {brand} المغطاة؟",
         f"حوالي {total} رقم مرجع أصلي من {brand} عبر هذه الأنظمة، وتشمل {arjoin(comps)}. "
         f"أسماء العلامات وأرقام القطع تُستخدم لتحديد التوافق فقط."),
        (f"هل توفّرون قطع {brand} المتوافقة في السعودية؟", SAUDI_A),
    ]
    items = [i for i in items if keyof(i) in SLUG]
    cards = "".join(
        f'<li><a href="/ar/plasma/{SLUG[keyof(i)]}">{E(" / ".join(i["systems"]))} '
        f'<span>←</span></a></li>' for i in items)
    rfq = urllib.parse.quote(f"Plasma - {brand}")
    body = (
        f'<section class="product-category-hero seo-hero" style="background-image:url(\'/assets/catalog/plasma-cover.webp\')">'
        '<div class="product-category-hero-overlay"></div><div class="container product-category-hero-inner">'
        '<div class="product-breadcrumb"><a href="/ar/">الرئيسية</a><span>←</span>'
        '<a href="/ar/plasma-consumables">مستهلكات البلازما</a><span>←</span>'
        f'<strong>{E(brand)}</strong></div>'
        '<div class="eyebrow">تغطية التوافق</div>'
        f'<h1>مستهلكات {E(brand)} المتوافقة</h1>'
        f'<p>{len(items)} عائلة نظام و{total} رقم مرجع أصلي مغطى.</p></div></section>'
        '<section class="seo-section"><div class="container">'
        f'<h2>أنظمة {E(brand)} المدعومة</h2>'
        f'<p class="seo-lead">اختر النظام لعرض أرقام المرجع الأصلية المغطاة والمكوّنات المتوفرة.</p>'
        f'<ul class="seo-links">{cards}</ul></div></section>'
        + faq_block(qa) +
        '<section class="cta"><div class="container cta-inner"><div><h2>معك رقم قطعة؟</h2>'
        f'<p>أرسل رقم مرجع {E(brand)} وموديل النظام والكمية.</p></div>'
        f'<a class="btn btn-dark" href="/ar/contact?product={rfq}">اطلب عرض سعر ←</a></div></section>'
    )
    lds = [
        {"@context": "https://schema.org", "@type": "CollectionPage", "name": title,
         "description": desc, "url": ar_url, "inLanguage": "ar-SA"},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": f"{BASE}/ar/"},
            {"@type": "ListItem", "position": 2, "name": "مستهلكات البلازما",
             "item": f"{BASE}/ar/plasma-consumables"},
            {"@type": "ListItem", "position": 3, "name": brand, "item": ar_url}]},
        faq_ld(qa),
    ]
    return page(title, desc, ar_url, en_url, body, lds)


SYSTEMS = load_systems()
CHROME = chrome()
SLUG = {}
keyof = lambda i: i["brand"] + "|" + " / ".join(i["systems"])


def main():
    os.makedirs("ar/plasma", exist_ok=True)
    bykey = {"Plasma - " + i["brand"] + " - " + " / ".join(i["systems"]): i for i in SYSTEMS}
    bybrand = {}
    for i in SYSTEMS:
        bybrand.setdefault(i["brand"], []).append(i)

    # pass 1: map every English system page to its data object so cross-links resolve
    pages = []
    for f in sorted(glob.glob("plasma/*.html")):
        h = open(f, encoding="utf-8").read()
        m = re.search(r"/contact\?product=([^\"']+)", h)
        if not m:
            continue
        pk = urllib.parse.unquote(m.group(1))
        slug = os.path.basename(f)[:-5]
        if pk in bykey:
            SLUG[keyof(bykey[pk])] = slug
            pages.append(("sys", slug, bykey[pk]))
        else:
            brand = pk.replace("Plasma - ", "").strip()
            if brand in bybrand:
                pages.append(("brand", slug, brand))

    made = 0
    for kind, slug, obj in pages:
        out = f"ar/plasma/{slug}.html"
        doc = system_page(obj, slug) if kind == "sys" else brand_page(obj, bybrand[obj], slug)
        open(out, "w", encoding="utf-8").write(doc)
        made += 1

    # reciprocal hreflang on the English pages
    linked = 0
    for kind, slug, obj in pages:
        f = f"plasma/{slug}.html"
        h = open(f, encoding="utf-8").read()
        if "hreflang" in h:
            continue
        tags = (f'<link rel="alternate" hreflang="en" href="{BASE}/plasma/{slug}"/>'
                f'<link rel="alternate" hreflang="ar-SA" href="{BASE}/ar/plasma/{slug}"/>'
                f'<link rel="alternate" hreflang="x-default" href="{BASE}/plasma/{slug}"/>')
        h = h.replace("</head>", tags + "</head>", 1)
        open(f, "w", encoding="utf-8").write(h)
        linked += 1

    # sitemap
    sm = open("sitemap.xml", encoding="utf-8").read()
    add = []
    for kind, slug, obj in pages:
        loc = f"{BASE}/ar/plasma/{slug}"
        if loc not in sm:
            add.append(f"<url><loc>{loc}</loc><lastmod>2026-09-27</lastmod></url>")
    if add:
        sm = sm.replace("</urlset>", "\n".join(add) + "\n</urlset>")
        open("sitemap.xml", "w", encoding="utf-8").write(sm)

    print(f"arabic pages written : {made}")
    print(f"hreflang added (EN)  : {linked}")
    print(f"sitemap URLs added   : {len(add)}")
    print(f"sitemap total        : {sm.count('<url>')}")


if __name__ == "__main__":
    main()
