#!/usr/bin/env python3
"""
FLUTEX SEO enrichment.

1. Adds a visible, page-specific FAQ section + matching FAQPage JSON-LD
   to the 39 plasma system pages and the 10 plasma brand hub pages.
2. Adds ItemList JSON-LD covering the original reference numbers.
3. Pre-renders the Plasma System Finder results into static HTML so the
   crawler no longer receives "0 matching system families".

Idempotent: re-running will not duplicate anything.
"""
import json, re, glob, html, urllib.parse, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

MARK = "<!--flutex-seo-faq-->"
MARK_LD = '"@id":"#flutex-faq"'
MARK_FINDER = "<!--flutex-static-finder-->"

E = lambda s: html.escape(str(s), quote=True)


def load_systems():
    s = open("assets/js/plasma-finder.v15.js", encoding="utf-8").read()
    i = s.index("const systems = ") + len("const systems = ")
    depth = 0
    for k in range(i, len(s)):
        if s[k] == "[":
            depth += 1
        elif s[k] == "]":
            depth -= 1
            if depth == 0:
                return json.loads(s[i:k + 1])
    raise SystemExit("could not parse systems array")


def joinlist(xs, last="and"):
    xs = list(xs)
    if len(xs) == 1:
        return xs[0]
    return ", ".join(xs[:-1]) + f" {last} " + xs[-1]


def faq_for_system(it):
    sysname = " / ".join(it["systems"])
    brand = it["brand"]
    comps = it["components"]
    apps = it["applications"]
    refs = it["references"]
    n = len(refs)
    sample = ", ".join(refs[:4])

    qa = []
    qa.append((
        f"Which consumables does FLUTEX supply for the {brand} {sysname}?",
        f"FLUTEX supplies compatible {joinlist([c.lower() for c in comps])} for the "
        f"{brand} {it['family']} family, covering {joinlist([a.lower() for a in apps])} "
        f"configurations. {it['summary']}"
    ))
    qa.append((
        f"Are the original {brand} part numbers for the {sysname} cross-referenced?",
        f"Yes. This range covers {n} original {brand} reference numbers for the {sysname}, "
        f"including {sample} and others listed on this page. Send the original reference and "
        f"FLUTEX confirms the compatible replacement in writing before quotation. Brand and "
        f"part-number references are used only to identify compatibility and are not offered "
        f"as genuine OEM parts unless stated in the quotation."
    ))
    qa.append((
        f"What information is needed to quote {sysname} consumables?",
        f"Send the original reference number, the system model ({sysname}), the operating "
        f"amperage, the process ({joinlist([a.lower() for a in apps], 'or')}) and the required "
        f"quantity. That is enough for FLUTEX to match the part and return price and lead time."
    ))
    qa.append((
        f"Can FLUTEX supply {sysname} plasma consumables in Saudi Arabia?",
        f"Yes. FLUTEX Middle East operations are supported from Riyadh and serve industrial "
        f"buyers across Saudi Arabia, including Riyadh, Jeddah, Dammam and Jubail, as well as "
        f"the wider Gulf and Türkiye. Quantity, price, availability and lead time for "
        f"{brand} {sysname} consumables are confirmed per RFQ."
    ))
    return qa


def faq_for_brand(brand, items):
    sysnames = [" / ".join(i["systems"]) for i in items]
    total = sum(len(i["references"]) for i in items)
    comps = sorted({c for i in items for c in i["components"]})
    return [
        (f"Which {brand} plasma systems does FLUTEX cover?",
         f"FLUTEX covers {len(items)} {brand} system families: {joinlist(sysnames)}. "
         f"Each system has its own page listing the original reference numbers covered."),
        (f"How many original {brand} reference numbers are covered?",
         f"Approximately {total} original {brand} reference numbers are covered across these "
         f"systems, spanning {joinlist([c.lower() for c in comps])}. Brand and part-number "
         f"references identify compatibility only and are not sold as genuine OEM parts "
         f"unless stated in the quotation."),
        (f"Does FLUTEX supply {brand} compatible consumables in Saudi Arabia?",
         f"Yes. FLUTEX Middle East operations are supported from Riyadh and serve industrial "
         f"buyers across Saudi Arabia, the wider Gulf and Türkiye. Send the {brand} reference "
         f"number, system model and quantity for a quotation."),
    ]


def faq_html(qa, heading):
    items = "".join(
        f'<div class="seo-faq-item"><h3>{E(q)}</h3><p>{E(a)}</p></div>' for q, a in qa
    )
    return (f'{MARK}<section class="seo-section seo-section-alt seo-faq">'
            f'<div class="container"><h2>{E(heading)}</h2>'
            f'<div class="seo-faq-list">{items}</div></div></section>')


def faq_ld(qa):
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": "#flutex-faq",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in qa
        ],
    }


def itemlist_ld(name, refs, url):
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": name,
        "url": url,
        "numberOfItems": len(refs),
        "itemListOrder": "https://schema.org/ItemListUnordered",
        "itemListElement": [
            {"@type": "ListItem", "position": p, "name": r}
            for p, r in enumerate(refs, 1)
        ],
    }


def inject(path, section_html, lds):
    h = open(path, encoding="utf-8").read()
    if MARK in h or MARK_LD in h:
        return False
    # visible FAQ: before the closing CTA section, else before </main>
    anchor = '<section class="cta">'
    if anchor in h:
        h = h.replace(anchor, section_html + anchor, 1)
    else:
        h = h.replace("</main>", section_html + "</main>", 1)
    blob = "".join(
        '<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + "</script>"
        for d in lds
    )
    h = h.replace("</head>", blob + "</head>", 1)
    open(path, "w", encoding="utf-8").write(h)
    return True


def static_finder(systems):
    """Pre-render finder cards so the served HTML is not empty."""
    path = "plasma-consumables.html"
    h = open(path, encoding="utf-8").read()
    if MARK_FINDER in h:
        return False
    cards = []
    for it in systems:
        chips = "".join(f"<span>{E(c)}</span>" for c in it["components"][:5])
        if len(it["components"]) > 5:
            chips += f'<span>+{len(it["components"]) - 5} more</span>'
        apps = "".join(f"<span>{E(a)}</span>" for a in it["applications"])
        prod = urllib.parse.quote("Plasma - " + it["brand"] + " - " + " / ".join(it["systems"]))
        cards.append(
            '<article class="finder-card plasma-card">'
            f'<div class="plasma-card-head"><span class="finder-standard">Compatible with {E(it["brand"])}</span>'
            f'<span class="plasma-family">{E(it["family"])}</span></div>'
            '<div class="finder-card-body">'
            f'<h5>{E(" / ".join(it["systems"]))}</h5><p>{E(it["summary"])}</p>'
            f'<div class="finder-card-chips">{chips}</div>'
            f'<div class="plasma-applications">{apps}</div>'
            f'<div class="finder-card-actions">'
            f'<a class="finder-rfq" href="/contact?product={prod}">Request a quote</a></div>'
            "</div></article>"
        )
    block = MARK_FINDER + "".join(cards)
    h = h.replace('<div class="finder-results plasma-results" data-plasma-results=""></div>',
                  f'<div class="finder-results plasma-results" data-plasma-results="">{block}</div>', 1)
    h = h.replace('<span data-plasma-result-count="">0</span>',
                  f'<span data-plasma-result-count="">{len(systems)}</span>', 1)
    open(path, "w", encoding="utf-8").write(h)
    return True


def main():
    systems = load_systems()
    bykey = {"Plasma - " + i["brand"] + " - " + " / ".join(i["systems"]): i for i in systems}
    bybrand = {}
    for i in systems:
        bybrand.setdefault(i["brand"], []).append(i)

    done_sys = done_brand = 0
    for f in sorted(glob.glob("plasma/*.html")):
        h = open(f, encoding="utf-8").read()
        m = re.search(r"/contact\?product=([^\"']+)", h)
        if not m:
            continue
        pk = urllib.parse.unquote(m.group(1))
        url = "https://flutexindustrial.com/" + f[:-5]
        if pk in bykey:
            it = bykey[pk]
            name = " / ".join(it["systems"])
            qa = faq_for_system(it)
            lds = [faq_ld(qa),
                   itemlist_ld(f"{it['brand']} {name} original reference numbers covered",
                               it["references"], url)]
            if inject(f, faq_html(qa, f"{name} consumables — frequently asked questions"), lds):
                done_sys += 1
        else:
            brand = pk.replace("Plasma - ", "").strip()
            items = bybrand.get(brand)
            if not items:
                continue
            qa = faq_for_brand(brand, items)
            refs = sorted({r for i in items for r in i["references"]})
            lds = [faq_ld(qa),
                   itemlist_ld(f"{brand} original reference numbers covered", refs, url)]
            if inject(f, faq_html(qa, f"{brand} compatible consumables — frequently asked questions"), lds):
                done_brand += 1

    fin = static_finder(systems)
    print(f"system pages enriched : {done_sys}")
    print(f"brand pages enriched  : {done_brand}")
    print(f"finder pre-rendered   : {fin}")


if __name__ == "__main__":
    main()
