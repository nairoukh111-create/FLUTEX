# FLUTEX site — standing owner decisions

## Permanently retired category (2026-11-09)

Never re-add **Special Tools** (Arabic **أدوات صناعية خاصة**) to the public FLUTEX website without a new explicit owner instruction. It must not appear as a category card, navigation entry, catalog section, destination page, search-index result, or sitemap URL. Do not reuse archived templates to restore it. Keep /special-tools and /ar/special-tools permanently redirected to /products and /ar/products respectively, with their HTML files absent.

There are exactly seven active public product-family portrait cards on both home and products pages, in English and Arabic. Industrial Saw Blades is 02 / 07, Laser Consumables & Spare Parts 04 / 07, Welding Consumables 06 / 07, and Ball Transfer Units 07 / 07. Neither Special Tools nor CNC Tools may be restored.

This applies to all future website changes. Run `node --test tests/*.test.cjs` before deploying; the retired-category test is a mandatory regression check.

## Fiber laser catalog (owner decision, 2026-11-09)

The fiber laser consumables and spare-parts catalog must remain in both English and Arabic, with searchable part references, compatible machine/head names, and customer RFQ links. **Never display the source supplier's company name or house-brand prefixes in public product titles, card labels, category text, SEO data or visible catalog content.** Independently documented OEM-compatible head names may be shown only as compatibility identifiers, not claimed authorization. Do not invent prices, stock quantities, delivery promises, material grades or verified equivalence.

Keep the owner's supplied copper nozzle/protective optics photograph at `assets/catalog/flutex-laser-home.avif` on the home/products laser cards and as the catalog hero. Maintain the category filter, free-text search and English/Arabic parity. Run the laser catalog regression test before future changes. The product list consists of individually checked published references; it is not a claim to cover every possible catalog variant.

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
