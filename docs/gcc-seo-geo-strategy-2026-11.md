# FLUTEX Search & GEO Operating Standard — GCC
**Date:** 2026-11-12 | **Purpose:** Standing implementation record and search strategy for the FLUTEX GitHub Pages / Cloudflare-backed public site.

## 1. Current exact category ledger
**ACTIVE — seven top-level families on both home/products, English and Arabic (01/07–07/07):**
1. Cutting Tools — `/cutting-tools`
2. Industrial Saw Blades — `/industrial-saw-blades` — technical catalog with 35 blade/PCD families in six groups
3. Plasma Consumables — `/plasma-consumables` — Hypertherm/Kjellberg compatible system finder; existing Saudi-specific supply page
4. Laser Consumables & Spare Parts — `/laser-consumables` — 77 listed entries organized into nine technical subcategories; listed items are not stock commitments
5. CNC Cutting & Cooling Fluid — `/cutting-fluid` — separate from retired CNC Tools family
6. Welding Consumables — `/welding-consumables`
7. Ball Transfer Units — `/ball-transfer-units`.

**PERMANENTLY RETIRED top-level families (owner directives):** `Special Tools` and `CNC Tools`. Do not restore these as cards, navigation entries, pages, XML sitemap, searchable categories or structured data without explicit new owner instruction. Old paths redirect 301 to /products and /ar/products. Independent Tool Holding and Aluminum Saw Blades pages are retained within their own scopes. Do not alter them while retiring a family.

**Card image selections (owner-approved, 2026-11-12):** Welding `flutex-welding-card-2026-11-12.webp`; Ball transfer `flutex-ball-transfer-card-2026-11-12.webp`; Laser `flutex-laser-card-2026-11-12.webp`; Cutting fluid `flutex-cnc-fluid-card-2026-11-12.webp`; Plasma `flutex-plasma-card-2026-11-12.webp` — all in `assets/catalog/` and used consistently on four pages, bilingual home/products. Cutting Tools and Saw Blades remain unchanged. These photos are **website choices, not official brand-design rules**; master identity is the FLUTEX logo and yellow #FBE12A / near-black #0B0D0F / white #FFFFFF.

## 2. GCC target
**Six countries, no others implied:** Saudi Arabia (SA), United Arab Emirates (AE), Kuwait (KW), Qatar (QA), Bahrain (BH), Oman (OM). Arabic and English are supported, with clear technical terminology and searchable original part references.

### Search-engine strategy — official Google rules
- Do **not** mutate a single page's <title>, H1, canonical or content using visitor IP or GPS. Google's locale-adaptive crawling can miss variations; a script-changing title is not a dependable means of acquiring country-specific search results.
- Stable crawlable locale URLs, explicit country terms and reciprocal hreflang on real regional counterparts are preferred. Every published indexed page must have a stable self canonical, one useful H1 and distinct on-page value.
- Start with English and Arabic **GCC industrial procurement hub** (`/gcc-industrial-consumables`, `/ar/gcc-industrial-consumables`). Supply actual catalog family links and tangible RFQ matching help across all six countries.
- Preserve the **Saudi-specific** plasma page (`/plasma-consumables`, `/ar/plasma-consumables`) and corresponding Saudi operations address. Don't erase valid local signals when adding GCC reach.
- Publish the **UAE-specific** original plasma buyer guide (`/plasma-consumables-uae`, `/ar/plasma-consumables-uae`) covering actual system compatibility and local buyer enquiry requirements. This content is NOT a claim of a UAE branch, local warehouse or available stock.
- Further country/product pages for Kuwait, Qatar, Bahrain, Oman or other families must be created only when they can provide **verified genuinely differentiated regional content**: real fulfillment terms, customer support workflow, legal/tax terms, country-specific technical documentation or substantial local service data. Do not mass-produce interchangeable country-name-swapped doorway pages.
- Never claim guaranteed Google positions, search-appearance customization, Google Business Profile branches, in-country stock, authorized manufacturer distribution or cross-border delivery lead times from metadata alone.
- No IP redirects or automatic forced region switches. Users may choose market manually and access any region.
- Do not add mock review stars, fake rankings, product prices, LocalBusiness addresses or how-to claims without evidence.

### GEO / AI search readability
- Describe the actual product families and specifications in indexable HTML, not solely JS filter state. Use clear headings, FAQ explanations and direct RFQ action links.
- Maintain descriptive, accurate titles/meta/OG/schema consistent with the visible H1. Strong citations to real technical materials can be added if verified and rights-respecting.
- Use structured data only for actual published page content and supported facts, with no fictional local office/stock. Use coherent BreadcrumbList, WebPage/CollectionPage, Organization identifiers.
- Display a country-aware RFQ field, but confirm stock and logistics separately in human quotations.
- Ensure the search index, sitemap, redirect table and language annotations are consistent with the actual pages.

**Official Google Search Central primary sources**
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites/
- https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

## 3. Quality gate
`node --test tests/*.test.cjs` plus `python scripts/audit_site.py --help` where available; validate deployed canonical, sitemap, hreflang pair reciprocity, 200 status, layout on desktop/mobile, and Search Console indexing/Performance after Google recrawls. A successful GitHub deployment does not prove Google indexing or UAE rankings.

## 4. Category-wide implementation update — 2026-11-12

All seven category pairs now contain a product-specific GCC enquiry checklist, with different technical fields for tools, blades, plasma, laser, fluids, welding and ball transfers. Titles/descriptions and corresponding Open Graph descriptions describe actual products and the GCC enquiry scope; the Saudi plasma title and real Riyadh support remain. These are buyer workflows, not promises of stock or delivery in another country.

Category-level regional links must lead to relevant technical support content instead of pointing every product family only to the UAE plasma page. Keep the shared six-country hub available from each checklist. No new country-name-swapped pages were created.

The generated site search reads laser model/dimension terms and saw-family terms from the cleaned public HTML. Never restore upstream source labels to improve search coverage. Run the confidentiality gate in AGENTS.md before regenerating or committing the index. New index content must be fetched from the main entry pages using the current revision query key, so existing browser caches cannot hide the update.

Search Console performance is now readable through the connected OpenSEO project; historical notes that it has no connection are superseded. Store account performance extracts and query-level analysis in private owner reports, not this public repository. Lack of impressions for a new family in a historical window is not proof of an indexing defect.

## 5. Product intent and page map — implementation 2026-11-15

Use the existing pages below for relevant purchasing language. These are content targets, not claims of measured demand or rankings. The GCC hub links all seven families with descriptive component names. Finder headings retain real detail-page links when JavaScript filters render, alongside the existing specification dialogs and RFQ actions.

| Family | English product intent | Arabic product intent | Existing destination |
| --- | --- | --- | --- |
| Cutting Tools | carbide end mills; HSS drill bits; modular drills; ER collets and tool holders | ريش تفريز كربيد؛ ريش حفر HSS؛ حفر برؤوس قابلة للاستبدال؛ كوليت وحوامل أدوات | `/cutting-tools`, `/carbide-end-mills`, `/hss-drill-bits`, `/tool-holding` and served tool-family pages |
| Industrial Saw Blades | industrial circular saw blades; aluminium saw blades; TCT, HSS and PCD tooling | صواني منشار صناعية؛ صواني ألمنيوم؛ أدوات TCT وHSS وPCD | `/industrial-saw-blades`, `/aluminum-saw-blades` and the blade inspection guide |
| Plasma Consumables | compatible plasma nozzles, electrodes, shields; XPR/HPR original references | نوزلات وإلكترودات وشيلدات بلازما متوافقة؛ مراجع XPR وHPR الأصلية | `/plasma-consumables`, existing `/plasma/` system and brand pages |
| Laser Consumables | fiber laser nozzles; protective windows; focusing/collimating optics; ceramic rings | نوزلات فايبر ليزر؛ زجاج حماية؛ عدسات تركيز وكوليميشن؛ حلقات سيراميك | `/laser-consumables` and `/guides/laser-consumables-matching-checklist` |
| Cutting Fluids | CNC cutting oil; MQL oil and machining lubricants | زيت قطع وتشغيل CNC؛ زيوت تزييت MQL | `/cutting-fluid`, the two published `/oils/` products and MQL selection guide |
| Welding Consumables | MIG welding wire; contact tips; gas nozzles; liners and diffusers | أسلاك لحام MIG؛ كونتاكت تيب؛ نوزلات غاز؛ لاينر وديفيوزر | `/welding-consumables` and `/guides/mig-consumables-matching-checklist` |
| Ball Transfer Units | ball transfer bearings; industrial ball rollers; flange, stud and press-fit mounting | وحدات نقل كروية؛ بكرات كروية صناعية؛ تثبيت فلنجة وقلاوظ وكبس | `/ball-transfer-units` and `/guides/ball-transfer-unit-selection` |

Use each page's existing `/ar/` counterpart for Arabic readers. Workpiece, machine/head model, standard, dimensions and compatibility references belong on the relevant product page only when documented. Do not add unverified sizes, performance or applications to fill a keyword gap.

For Saudi Arabia, UAE, Kuwait, Qatar, Bahrain and Oman, combine the actual product need with the destination in a useful enquiry workflow. Keep the shared GCC hub and existing substantive regional pages; do not duplicate the table into country-name-swapped pages, put hidden keyword lists in code, or claim a local branch or stock. Update sitemap `lastmod` only for substantive page changes. A submitted sitemap or accepted indexing request is not evidence that Google has indexed the page.
