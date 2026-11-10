# FLUTEX — Brand Identity & Design System
**Version:** 1.0.0 · **Recorded:** 2026-11-10 · **Audience:** Internal design, content, web, image and supplier documentation workflows.

This is the **repository copy of the operational standard**. The owner also has the full FLUTEX Brand Identity Kit v1.0 (16-page PDF, complete machine-readable JSON, editable Markdown and CSS tokens). This file is not a substitute for newer direct owner instructions or the latest verified files.

## Status and precedence
- `VERIFIED_CURRENT`: values checked against the website source or owner-supplied artwork as of 2026-11-10; re-check before consequential updates.
- `OWNER_DIRECTIVE`: decisions expressly approved/required by the owner; preserve until explicitly changed.
- `PROPOSED_STANDARD`: expert design recommendation, **not** separate owner approval.
- `NOT_VERIFIED`: cannot be asserted as an official or technical fact.
- If a newer verified primary source contradicts this file, update the relevant status and record the revision.

## Brand character
- **VERIFIED_CURRENT:** FLUTEX uppercase industrial geometric wordmark with a distinctive F. Public site name “FLUTEX Industrial”, descriptor “Industrial Tooling & Consumables” and current website headline **“Precision Tools. Reliable Supply. Built for Production.”**
- **PROPOSED_STANDARD:** precise, industrial, dependable, specification-first, competent and concise. Audience: factories, manufacturing/maintenance teams, machine shops and technical procurement.
- Do not imply a legally registered slogan or trademark status from visual artwork. The owner's wordmark image includes ®; legal registration was not checked here. Always use the official master asset without independently creating/removing the symbol.

## Source color system — VERIFIED_CURRENT
| Role | HEX | Website token |
|---|---|---|
| Signature yellow | `#FBE12A` | `--accent` |
| Strong yellow | `#E6CA00` | `--accent-strong` |
| Ink black | `#0B0D0F` | `--ink` |
| Dark secondary | `#15191D` | `--ink-2` |
| White | `#FFFFFF` | `--paper` |
| Off-white | `#F5F6F7` | `--paper-2` |
| Muted text | `#687078` | `--muted` |
| Divider | `#E5E8EB` | `--line` |

Contrast (calculated WCAG formula): `#0B0D0F` on `#FBE12A` ≈ **14.74:1**; white on signature yellow ≈ **1.32:1** (avoid white text on yellow). Black on white ≈ **19.47:1**. Use white for content/card descriptions and yellow as the brand/navigation/icon accent, not entire catalog description panels. Suggested 60% white / 30% dark / 10% yellow composition is **PROPOSED_STANDARD**, not a strict rule. No approved Pantone or press-proofed CMYK exists in this guide.

## Logo and type
- **VERIFIED_CURRENT:** primary site asset `assets/flutex-logo-web.v2.png`; supporting assets include `assets/flutex-logo-white.v2.png`, `assets/flutex-logo-transparent.v2.png`. Check correct variant/scale against actual source.
- **PROPOSED_STANDARD:** clear space ≥ half capital height; baseline minimum 140px digital/30mm print; no rotation/stretching/shadows or recreated lettering.
- **VERIFIED_CURRENT typography:** English website `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif`; Arabic website `Segoe UI, Tahoma, Arial, sans-serif` with genuine RTL. `Noto Sans Arabic` is an optional **PROPOSED_STANDARD** for a future unified Arabic font system, not deployed by this guide.
- Preserve Latin part references, units, dimensions and model names in correct LTR within Arabic content.

## Photography and image generation
- **OWNER_DIRECTIVE:** each product family needs a **distinct product image**; photographs need consistent premium industrial realism, not identical reused scenery. Category cards use **4:5** portrait artwork, white description panel, yellow tile with black icon, 3/2/1 responsive grid (desktop/tablet/mobile).
- **VERIFIED_CURRENT UI:** main container max 1180px, general radius 18px, portrait grid gap 22px; yellow header/black wordmark.
- **PROPOSED_STANDARD:** cool blue/steel metal environments, true product scale, clean realistic reflections, technically credible nozzle/optic/carbide/steel geometry; 1200×1500px card master, 1920×1080px hero photographic source. Do not fake part dimensions, threads, holes, saw teeth, optical effects, part numbers or certifications.
- A conceptual generated card image is **not** technical evidence of the actual SKU. SKU images should use validated actual photos or engineering source and appropriate image rights. Do not put unlicensed watermarks or third-party supplier branding into client-facing artwork.

## Website catalog — OWNER_DIRECTIVE as of 2026-11-10
1. Cutting Tools
2. Plasma Consumables
3. Laser Consumables & Spare Parts
4. CNC Cutting & Cooling Fluid
5. Welding Consumables
6. Ball Transfer Units

Current numbering: 01/06 through 06/06. **Special Tools and CNC Tools are permanently retired** as independent public top-level categories, unless expressly reauthorized. Independent **Tool Holding**, **Aluminum Saw Blades** and **CNC Cutting & Cooling Fluid** pages remain; don't conflate them with retired CNC Tools.

**Laser confidentiality and technical accuracy:** no original source supplier brand/house-prefix on public catalog cards, descriptions, meta tags or headings. Compatibility model names are technical selectors only, not proof of OEM authorization. No invented availability, technical verification, stock, lead time, prices, certified grades or original/genuine claims.

## Writing, collateral and print
- **PROPOSED_STANDARD:** technical, succinct, evidence-led, clear B2B CTA: “Request a Quote / طلب عرض سعر.”
- Quotations/datasheets: primary white canvas, black technical body text, yellow limited accent; use the actual official latest company, tax and payment documents where relevant; clear references, dimensions, units and revision.
- Packaging: visible master logo, yellow identification stripe, readable part label. Only use barcode/batch/serial data if actually assigned and verified.
- No internal supplier sourcing notes in client-facing datasheets unless the owner explicitly requests them; preserve supplier/source traceability in internal procurement records.
- Never claim “Original OEM”, “Authorized Distributor”, “In Stock”, “Certified”, “Guaranteed Fit”, or fixed lead time without current proof.

## Operational checklist (all work)
1. Identify requested format and language; consult latest current reference.
2. Preserve primary logo, verified colors, existing approved decisions.
3. Distinguish current facts and owner directives from unapproved proposals.
4. Keep imagery realistic and geometry truthful; match crop to target.
5. Verify references, stock/status and dimensions from current technical source.
6. Proof RTL, contrast, layouts and actual exported pages/assets.
7. Do not reintroduce the retired categories or publish source supplier identity.
8. Record revisions and approval before changing the system of record.

**Related files:** `docs/brand-tokens.v1.json`, `AGENTS.md`, `assets/css/styles.v23.css`, `assets/css/category-portraits.v1.css`, `index.html`, `ar/index.html`.
