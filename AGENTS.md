# FLUTEX site — standing owner decisions

## Supplier confidentiality and brand representation — permanent owner policy (2026-11-12)

This policy applies to **all seven active product categories, all six GCC markets, Arabic and English, and every future website, SEO, GEO, catalog and commercial-document task**. It extends the narrower laser and saw rules below. Treat any suspected disclosure as a publication blocker.

### Never publish upstream sourcing information

Do not expose private supplier/factory/company identities, house brands, logos, employee names or contact details, source websites, source catalogs, document titles, distinctive private model/series/grade codes, internal part numbers, purchase prices, agreements, procurement methods or other identifying supply-chain information. Do not copy these into comments, examples, tests, audit reports, source maps or filenames. **A negative test containing a real supplier name still publishes that name.** Use fictional test fixtures only.

The restriction covers visible and hidden content: HTML, CSS, JavaScript, JSON, JSON-LD/structured data, SEO metadata, Open Graph, alt text, image EXIF/XMP/text metadata, PDFs and their properties/links/attachments, sitemap, search indexes, URLs, asset filenames, public GitHub files, commit messages, pull requests, CI logs and AI/GEO content. Encoding, minifying, hashing or hiding an identity is not an acceptable way to publish it.

Keep source catalogs, identity lists, source-to-FLUTEX mappings, supplier correspondence and internal verification notes **outside this public repository and outside public web roots**. Never commit a private denylist or quote confidential matching text in logs or reports. Do not upload private sourcing records to an external SEO/AI service.

### Present FLUTEX as the customer's direct industrial supply partner

FLUTEX is the commercial supplier responsible for its offered products, quotations, technical information, branding, contact and customer relationship. Preferred wording includes **FLUTEX Industrial Consumables**, **FLUTEX Industrial Cutting Tools**, **Supplied by FLUTEX**, **Available for quotation through FLUTEX**, **FLUTEX Product Range** and **FLUTEX Technical Specifications**.

Customer copy must not describe internal purchasing, upstream factories, sourcing partners or specifications as belonging to an undisclosed supplier. Do not claim FLUTEX is the original manufacturer, owns production technology, holds OEM authorization, or has a certification/test result without evidence supporting that exact claim. Do not conceal legally required safety/manufacturer information by fabricating or relabeling regulated documents; resolve any such document privately before publication.

### Preserve verified customer-facing technical information

Use confirmed technical specifications under FLUTEX product names. Keep the evidence and commercial crosswalk private. Omit unconfirmed claims and request internal verification; do not put internal doubts or source notes in customer documents.

Global technical standards, established dimensions/material terms and original OEM references needed for identification may remain. For example, a Hypertherm reference is a **compatibility reference**, not evidence of original manufacture or authorized distribution. Do not remove useful legitimate compatibility information merely because it names an independent global product/system. Distinguish a global technical identifier from a confidential upstream house code before publishing it; if unclear, stop that item for internal review.

### SEO/GEO uses FLUTEX, product intent and verified technical facts

Use FLUTEX, the actual product categories, international technical terminology, industrial applications, verified specifications, necessary compatibility references and the six GCC markets. Never use secret source names/codes as keywords, citations, structured-data manufacturer/supplier fields or AI-search bait. Technical citations must not disclose FLUTEX's confidential commercial sources.

### Mandatory gate before every commit and deployment

1. Review **every changed and generated file**, plus renamed/deleted asset references, for visible/hidden sourcing data and unsupported manufacturing/authorization/certification claims.
2. Check filenames, URLs, comments, metadata/OG/alt, structured data, search indexes and sitemap. Regenerate derived assets using the existing generators.
3. Inspect image/document metadata and external links; visually review new/replaced graphics and PDFs for logos, watermarks, identifying drawings and private codes. Check PDF properties, annotations and attachments too.
4. Run `python3 scripts/check_public_confidentiality.py`. For known identities, run it with `--private-identifiers /absolute/path/outside/repository/identifiers.json`; the file is a private JSON array of literal identifiers and must never enter Git, PR text or logs. The generic CI check does **not** know undisclosed identities and does **not** replace this review.
5. Run `node --test tests/*.test.cjs` and the existing source/generator checks. If a leak or unverified commercial claim remains, **do not commit or deploy it**. Report the issue privately without repeating identifying material in public artifacts.
6. A passing scanner is bounded evidence, not a claim of absolute anonymity. Existing Git history, forks, old deployments and caches are separate exposure surfaces: removing current content does not erase them. Do not rewrite public Git history without a separately reviewed, explicit owner instruction.

Apply this policy permanently. Preserve the seven active categories, retired-category decisions, approved imagery, bilingual functionality and truthful product compatibility.

## Permanently retired category (2026-11-09)

Never re-add **Special Tools** (Arabic **أدوات صناعية خاصة**) to the public FLUTEX website without a new explicit owner instruction. It must not appear as a category card, navigation entry, catalog section, destination page, search-index result, or sitemap URL. Do not reuse archived templates to restore it. Keep /special-tools and /ar/special-tools permanently redirected to /products and /ar/products respectively, with their HTML files absent.

There are exactly seven active public product-family portrait cards on both home and products pages, in English and Arabic. Industrial Saw Blades is 02 / 07, Laser Consumables & Spare Parts 04 / 07, Welding Consumables 06 / 07, and Ball Transfer Units 07 / 07. Neither Special Tools nor CNC Tools may be restored.

This applies to all future website changes. Run `node --test tests/*.test.cjs` before deploying; the retired-category test is a mandatory regression check.

## Fiber laser catalog (owner decision, 2026-11-09)

The fiber laser consumables and spare-parts catalog must remain in both English and Arabic, with searchable part references, compatible machine/head names, and customer RFQ links. **Never display the source supplier's company name or house-brand prefixes in public product titles, card labels, category text, SEO data or visible catalog content.** Independently documented OEM-compatible head names may be shown only as compatibility identifiers, not claimed authorization. Do not invent prices, stock quantities, delivery promises, material grades or verified equivalence.

Keep `assets/catalog/flutex-laser-home.avif` as the laser catalog detail-page hero only; for the home/products laser card use `assets/catalog/flutex-laser-card-2026-11-12.webp`. Do not conflate the hero image with the category card. Maintain the category filter, free-text search and English/Arabic parity. Run the laser catalog regression test before future changes. The product list consists of individually checked published references; it is not a claim to cover every possible catalog variant.

## Permanently retired CNC Tools category (owner decision, 2026-11-10)

**CNC Tools / أدوات وملحقات CNC** is permanently retired as a public top-level FLUTEX product family. Do not restore its card, category listing, separate landing pages, navigation entries, site-search entries, or sitemap URLs in future edits unless the owner explicitly reverses the decision. Remove `cnc-tools.html` and `ar/cnc-tools.html` and keep 301 redirects from `/cnc-tools` to `/products` and from `/ar/cnc-tools` to `/ar/products`.

This does **not** retire independent product and informational pages for **Aluminum Saw Blades**, **Tool Holding**, **Cutting Tools**, or **CNC Cutting & Cooling Fluid**. Those remain accessible under their own names; the former CNC Tools breadcrumbs should point to Cutting Tools instead. Never conflate CNC cutting fluid with the retired CNC Tools family. The total public portrait-card count is **seven** (including Industrial Saw Blades, a distinct new category, with CNC Tools still retired). Run `node --test tests/*.test.cjs` to catch accidental reintroduction.

## Brand identity reference (2026-11-10)

Before editing FLUTEX public website graphics, logos, visual style, product-family cards, or marketing documents, read `docs/brand-identity.v1.1.md` and `docs/brand-tokens.v1.1.json`. They distinguish current website evidence and owner's explicit directives from design proposals. Do not adopt proposed image/font/print specs as owner approvals without further instruction. Preserve all category retirement and laser confidentiality rules above. If the live website or latest approved owner asset differs from this dated snapshot, verify and record a new revision; do not silently overwrite the brand reference.

## Explicit brand-reference correction (owner decision, 2026-11-10 — v1.1)

**The existing website category cards are NOT part of FLUTEX's visual brand identity.** The owner expressly rejected their visual styling, colors, presentation and imagery as brand reference material. Do not copy, recommend, or treat current category-card layouts as brand standards in subsequent designs.

This excludes current card photo art direction, card background and information panels, yellow icon tiles, image aspect ratio, cropping, grid and column counts, shadows, border radius, spacing and photographic backgrounds from the reusable brand reference. Those remain implementation details of the live website until redesigned separately; **this decision does not change the live website's UI**. Do not use `assets/css/category-portraits.v1.css` or old product-card screenshots as brand-identity references.

For future FLUTEX identity/design work, use the original FLUTEX wordmark and the primary core palette: signature yellow `#FBE12A`, near-black `#0B0D0F`, white `#FFFFFF`. Treat other current site palette values as supporting implementation tokens, not an approved universal layout. Select image composition/background/lighting per new brief, not from the existing site card designs. Refer to the revised **v1.1** documents; v1.0 has been retired as an identity source.

## Industrial Saw Blades — mandatory confidentiality and catalog behavior (2026-11-10)

The owner added **Industrial Saw Blades & PCD Tooling** at `/industrial-saw-blades` and `/ar/industrial-saw-blades`. Preserve the 35 application-oriented product families, six groups, bilingual search, material and technology filters, and customer RFQ builder. This is a quotation catalog, not a statement of live stock or mechanical compatibility. Use the owner-provided photo at `assets/catalog/industrial-saw-blades-card.v1.webp` for the category card and page hero.

**STRICT SOURCE CONFIDENTIALITY:** Never publish the source supplier's identifying name, brand, logo, website, documents, private catalog, distinctive model/series codes, supplier image metadata, technical source URL, or manufacturer attribution in any public HTML, JSON, SEO, image alt text or comments. Do not commit confidential source documents or identifying codes. Public entries must use neutral generic technical names. Verify exact blade sizes, bore, kerf, teeth, mounting and machine compatibility privately before any quotation. No invented stock, certification, pricing or lead times. The retired CNC Tools and Special Tools categories stay retired; this is a distinct new group. The current visual category-card aesthetic remains excluded from official brand identity, per owner's v1.1 correction.

### Technical RFQ fields / customer experience (2026-11-10)

Keep the selected saw family, machine model, workpiece material, outside diameter, bore, kerf, plate/body thickness, pinhole/mounting pattern, tooth count, tooth grind, RPM and quantity available in the enquiry builder. Product group filter results identify families, **not verified stock-keeping SKUs or confirmed dimensional fit**. Email is drafted via `mailto:` and is NOT sent by the website. All supplier material is private; do not publish catalog extracts or images from supplier documents.

Keep bidirectional customer navigation between the comprehensive Industrial Saw Blades catalog and the specialized Aluminum Saw Blades technical page; they have different scopes and should not be treated as interchangeable or duplicate URLs.

## Cutting Tools category card image (owner instruction, 2026-11-11)

The currently selected image for Cutting Tools product-family cards on both Home and Products (English and Arabic) is `assets/catalog/cutting-tools-card-zoom-2026-11.avif`, supplied by the owner. Keep the image unchanged and consistently referenced in those four card locations until the owner requests another image. This is an asset selection for the current website, **not** an addition to FLUTEX's core visual brand identity or a design-system style reference. Do not change the separate Cutting Tools detail-page imagery based on this card-only instruction.

## Plasma Consumables category image (owner-approved, 2026-11-11)

Use the newer owner-provided photograph `assets/catalog/flutex-plasma-card-2026-11-12.webp` as the Plasma Consumables category-card image on the main and products pages in English and Arabic. The previous `plasma-cutting-action-card-2026-11.avif` is superseded for cards. It supersedes the former category-card illustration; preserve other plasma product content and layouts. Do not substitute the old `plasma-home-card-v3.webp` or `plasma-cover.webp` for those category cards in future design changes unless directly instructed.

## Category image master mapping — approved 2026-11-12

Owner-uploaded category-card photos (all original WebP files, 1122 × 1402 pixels) **must be used for cards on Home and Products in both English and Arabic**, with the following exact mapping:

- Welding Consumables: `assets/catalog/flutex-welding-card-2026-11-12.webp`
- Ball Transfer Units: `assets/catalog/flutex-ball-transfer-card-2026-11-12.webp`
- Laser Consumables & Spare Parts: `assets/catalog/flutex-laser-card-2026-11-12.webp`
- CNC Cutting & Cooling Fluid: `assets/catalog/flutex-cnc-fluid-card-2026-11-12.webp`
- Plasma Consumables: `assets/catalog/flutex-plasma-card-2026-11-12.webp`

Preserve original full-resolution, user-uploaded photos without replacing them with low-resolution AVIF, 160-pixel previews, supplier thumbnails or externally hosted links. Keep card image intrinsic dimensions 1122 × 1402; CSS handles responsive sizing. Cutting Tools and Industrial Saw Blades category images are **not** part of this batch and remain unchanged. This selection is specific to the live website and is **not** an identity rule, consistent with the v1.1 branding decision. Do not alter the page hero imagery for any family based on this card-only request.

Do not inadvertently revert these five card photos during unrelated website changes. Run `node --test tests/*.test.cjs` and verify all 20 placements.

## GCC SEO/GEO program — owner directive 2026-11-12

Read `docs/gcc-seo-geo-strategy-2026-11.md` before editing country metadata, regional content, structured data or adding locale routes. The owner wants FLUTEX search visibility across SA, AE, KW, QA, BH and OM in Arabic and English. **Never use IP/location to auto-change the same URL's <title>, canonical, H1 or crawlable region content**. Google's locale-adaptive crawling cannot reliably find such variants; use stable URLs and reciprocal hreflang for genuine variants. Do not mass-produce doorway pages with only swapped country names.

The Saudi-focused plasma main pages remain valid for Riyadh operations; do not rewrite verified Saudi operational addresses as UAE addresses. New original UAE plasma buyer guides and a GCC hub must be maintained as technically useful regional RFQ pages. No assertion of local UAE branches, UAE stock, guaranteed freight/lead time or OEM authorization is made. All seven current active product families, the two permanently retired categories (Special Tools/CNC Tools), validated source images and hidden supplier identity restrictions continue unchanged.
