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
