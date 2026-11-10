# FLUTEX site — standing owner decisions

## Permanently retired category (2026-11-09)

Never re-add **Special Tools** (Arabic **أدوات صناعية خاصة**) to the public FLUTEX website without a new explicit owner instruction. It must not appear as a category card, navigation entry, catalog section, destination page, search-index result, or sitemap URL. Do not reuse archived templates to restore it. Keep /special-tools and /ar/special-tools permanently redirected to /products and /ar/products respectively, with their HTML files absent.

There are exactly six active public product-family portrait cards on both home and products pages, in English and Arabic. Laser Consumables & Spare Parts is 03 / 06, Welding Consumables 05 / 06, and Ball Transfer Units 06 / 06. Neither Special Tools nor CNC Tools may be restored.

This applies to all future website changes. Run `node --test tests/*.test.cjs` before deploying; the retired-category test is a mandatory regression check.

## Fiber laser catalog (owner decision, 2026-11-09)

The fiber laser consumables and spare-parts catalog must remain in both English and Arabic, with searchable part references, compatible machine/head names, and customer RFQ links. **Never display the source supplier's company name or house-brand prefixes in public product titles, card labels, category text, SEO data or visible catalog content.** Independently documented OEM-compatible head names may be shown only as compatibility identifiers, not claimed authorization. Do not invent prices, stock quantities, delivery promises, material grades or verified equivalence.

Keep the owner's supplied copper nozzle/protective optics photograph at `assets/catalog/flutex-laser-home.avif` on the home/products laser cards and as the catalog hero. Maintain the category filter, free-text search and English/Arabic parity. Run the laser catalog regression test before future changes. The product list consists of individually checked published references; it is not a claim to cover every possible catalog variant.

## Permanently retired CNC Tools category (owner decision, 2026-11-10)

**CNC Tools / أدوات وملحقات CNC** is permanently retired as a public top-level FLUTEX product family. Do not restore its card, category listing, separate landing pages, navigation entries, site-search entries, or sitemap URLs in future edits unless the owner explicitly reverses the decision. Remove `cnc-tools.html` and `ar/cnc-tools.html` and keep 301 redirects from `/cnc-tools` to `/products` and from `/ar/cnc-tools` to `/ar/products`.

This does **not** retire independent product and informational pages for **Aluminum Saw Blades**, **Tool Holding**, **Cutting Tools**, or **CNC Cutting & Cooling Fluid**. Those remain accessible under their own names; the former CNC Tools breadcrumbs should point to Cutting Tools instead. Never conflate CNC cutting fluid with the retired CNC Tools family. The total public portrait-card count is **six**. Run `node --test tests/*.test.cjs` to catch accidental reintroduction.

## Brand identity reference (2026-11-10)

Before editing FLUTEX public website graphics, logos, visual style, product-family cards, or marketing documents, read `docs/brand-identity.v1.1.md` and `docs/brand-tokens.v1.1.json`. They distinguish current website evidence and owner's explicit directives from design proposals. Do not adopt proposed image/font/print specs as owner approvals without further instruction. Preserve all category retirement and laser confidentiality rules above. If the live website or latest approved owner asset differs from this dated snapshot, verify and record a new revision; do not silently overwrite the brand reference.

## Explicit brand-reference correction (owner decision, 2026-11-10 — v1.1)

**The existing website category cards are NOT part of FLUTEX's visual brand identity.** The owner expressly rejected their visual styling, colors, presentation and imagery as brand reference material. Do not copy, recommend, or treat current category-card layouts as brand standards in subsequent designs.

This excludes current card photo art direction, card background and information panels, yellow icon tiles, image aspect ratio, cropping, grid and column counts, shadows, border radius, spacing and photographic backgrounds from the reusable brand reference. Those remain implementation details of the live website until redesigned separately; **this decision does not change the live website's UI**. Do not use `assets/css/category-portraits.v1.css` or old product-card screenshots as brand-identity references.

For future FLUTEX identity/design work, use the original FLUTEX wordmark and the primary core palette: signature yellow `#FBE12A`, near-black `#0B0D0F`, white `#FFFFFF`. Treat other current site palette values as supporting implementation tokens, not an approved universal layout. Select image composition/background/lighting per new brief, not from the existing site card designs. Refer to the revised **v1.1** documents; v1.0 has been retired as an identity source.
