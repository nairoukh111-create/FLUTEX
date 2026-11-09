# FLUTEX site — standing owner decisions

## Permanently retired category (2026-11-09)

Never re-add **Special Tools** (Arabic **أدوات صناعية خاصة**) to the public FLUTEX website without a new explicit owner instruction. It must not appear as a category card, navigation entry, catalog section, destination page, search-index result, or sitemap URL. Do not reuse archived templates to restore it. Keep /special-tools and /ar/special-tools permanently redirected to /products and /ar/products respectively, with their HTML files absent.

There are exactly seven active public product-family portrait cards on both home and products pages, in English and Arabic. The added Laser Consumables & Spare Parts card is 03 / 07, and Ball Transfer Units is 07 / 07. This does not restore Special Tools.

This applies to all future website changes. Run `node --test tests/*.test.cjs` before deploying; the retired-category test is a mandatory regression check.

## Fiber laser catalog (owner decision, 2026-11-09)

The fiber laser consumables and spare-parts catalog must remain in both English and Arabic, with searchable part references, compatible machine/head names, and customer RFQ links. **Never display the source supplier's company name or house-brand prefixes in public product titles, card labels, category text, SEO data or visible catalog content.** Independently documented OEM-compatible head names may be shown only as compatibility identifiers, not claimed authorization. Do not invent prices, stock quantities, delivery promises, material grades or verified equivalence.

Keep the owner's supplied copper nozzle/protective optics photograph at `assets/catalog/flutex-laser-home.avif` on the home/products laser cards and as the catalog hero. Maintain the category filter, free-text search and English/Arabic parity. Run the laser catalog regression test before future changes. The product list consists of individually checked published references; it is not a claim to cover every possible catalog variant.
