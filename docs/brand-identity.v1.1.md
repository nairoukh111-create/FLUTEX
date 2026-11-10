# FLUTEX — Brand Identity & Visual Direction
**Version:** 1.1.0 · **Revision date:** 2026-11-10 · **Status:** owner-directed brand reference

> **OWNER CORRECTION / PERMANENT NOTE:** The visual design of the website's existing product-category cards is **not** a FLUTEX brand identity standard. Card photos, background styling, white information panels, yellow icons, crop proportions, layout grid and visual motifs must not be reused as brand guidance. The public site itself was not redesigned under this document revision.

## 1. Evidence, authority and status
- `VERIFIED_CURRENT` = confirmed by original artwork or website source for a narrow factual purpose (e.g., color value), **not** automatically an approved brand application.
- `OWNER_DIRECTIVE` = specifically approved by the owner; supersedes earlier design recommendations.
- `PROPOSED_STANDARD` = useful design proposal only, not approval.
- `NOT_VERIFIED` = may not be represented as fact.
- Authority: current original logo/owner documentation → explicit current owner decisions → current official files → approved brand reference.

## 2. Core brand identity
- Name: **FLUTEX**; site uses “FLUTEX Industrial”.
- Master visual: distinctive uppercase, angular industrial FLUTEX wordmark with stylized F. Use the actual artwork; do not typeset or redraw the wordmark with a generic font.
- Current digital master: `assets/flutex-logo-web.v2.png`. Other variants available in the repository should be inspected before use.
- The wordmark visibly contains ® in supplied artwork; trademark registration status was **not verified** for this brand guide. Do not alter the master.
- Brand tone: **precise, technical, commercially dependable, concise** (expert positioning recommendation).
- Current website line: “Precision Tools. Reliable Supply. Built for Production.” It is website wording, not a legally registered slogan.

## 3. Color system
**Core identity colors from master logo and current CSS:**
- Signature yellow: `#FBE12A`
- Brand near-black: `#0B0D0F`
- White: `#FFFFFF`

Supporting, **current-website values only**, not mandatory brand colors: `#E6CA00`, `#15191D`, `#F5F6F7`, `#687078`, `#E5E8EB`.

WCAG relative-luminance checks: dark on yellow ≈ **14.74:1**; white on yellow ≈ **1.32:1** (avoid small white text on yellow); dark on white ≈ **19.47:1**. No fixed 60/30/10 color split is required. Brand colors do **not** prescribe particular card/background/icon treatments. Press-ready Pantone/CMYK are unapproved pending print proof.

## 4. Logo usage
- Prefer original unmodified master/verified variant for each medium.
- Avoid stretched, rotated, recreated, shaded or illegible wordmarks.
- Suggested clear space ≈ half capital height and minimum widths (140px digital / 30mm print) are **PROPOSED_STANDARD**, not independently approved production specs.

## 5. Typography
- English site current stack: `Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif`.
- Arabic site current stack: `Segoe UI, Tahoma, Arial, sans-serif` with RTL.
- These are observations about deployed CSS, **not yet a complete official corporate typography system**. Use license-appropriate fonts and correct LTR for model numbers in Arabic materials.

## 6. Photography and product visualization
- **Technical integrity:** use authorized reference photography for exact SKUs; do not invent holes, threads, features, colors, coatings, laser effects, certifications or part numbers.
- Conceptual brand imagery may be created where clearly illustrative, but is not evidence of actual SKU specification.
- Image style, palette, backdrop, lighting, crop and aspect ratio are chosen for each **new task independently**.
- **No fixed category-card image ratio; no mandatory blue/steel backdrop; no reused source photos from the current site as identity examples.**

## 7. Website design versus brand identity
- The current website's category cards, background colors, icons, borders, shadows, corner radius, grids, spacing and image ratios are **EXCLUDED FROM THE BRAND SYSTEM**.
- A future website/cards redesign should follow its own UX brief, technical content requirements, accessibility evaluation and explicit owner approval; do not infer it from the current screenshots or `category-portraits.v1.css`.
- Navigation, accessible contrast, RFQ flows, technical search and correct bilingual content are *functional product requirements*, not specific visual templates.

## 8. Current business/catalog decisions (not visual-card standards)
Six active public families (website-specific operational data): Cutting Tools, Plasma Consumables, Laser Consumables & Spare Parts, CNC Cutting & Cooling Fluid, Welding Consumables, Ball Transfer Units.
`Special Tools` and `CNC Tools` are retired as independent top-level families; don't restore them without explicit instruction. Standalone Tool Holding and Aluminum Saw Blades pages remain.
Never reveal private laser source supplier identity in public text/metadata; model names only identify compatibility; don't assert OEM authorization, stock, prices, lead time or certifications without current proof.

## 9. Printed documents and product content
- Use logo and core palette; prefer clear technical tables and verifiable dimensions, revision information, and truthful product identification.
- Illustrative white/dark/yellow patterns for printed materials are **proposals**, not mandatory templates.
- Do not add unsolicited internal sourcing notes to customer-facing datasheets.
- Company details, taxes, banking, certifications and legal status must always be verified from current authoritative source rather than this guide.

## 10. Quality gate for all future work
1. Verify logo master and core color values from originals.
2. Confirm the task's output format, intended use and actual geometry.
3. Choose **new** layout, image crop and photo mood appropriate to the brief; **never reference existing site category-card style**.
4. Check source technical specifications, correct RTL/LTR, accessibility and licensing.
5. Render and inspect the actual final output; record new owner approvals with date/version.

**Source references:** owner-supplied FLUTEX logo; verified core color tokens in `assets/css/styles.v23.css`; latest owner decisions in `AGENTS.md`. **Explicitly excluded:** `assets/css/category-portraits.v1.css`, current product-card photos/screenshots, and all card-related content from the superseded v1.0 kit.

**Machine-readable reference:** `docs/brand-tokens.v1.1.json`. **Version history:** v1.0 (retired: invalid card-identity assumptions) → v1.1 (owner correction).
