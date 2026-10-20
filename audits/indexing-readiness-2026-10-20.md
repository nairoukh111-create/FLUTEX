# Indexing readiness — 20 October 2026

## Confirmed Search Console actions

Sitemap submitted and read successfully on October 20: 162 URLs. This is discovery, not indexing.
11 accepted individual requests: Kjellberg EN/AR; cutting-fluid EN/AR; Hypertherm AR; cutting-tools EN/AR; cnc-tools EN/AR; welding-consumables EN; special-tools EN. Hypertherm EN was requested October 19.
Next attempted URL /ar/welding-consumables was rejected with the daily quota message. Do not retry today or duplicate accepted requests.
Report displayed 16 indexed, 146 discovered-not-indexed, 4 expected redirects, 1 proper alternate; report date remains October 12. /laser-consumables independently inspected October 20: indexed.

## Reference corrections supported by OEM documentation

The identical XPR and HT lists were incorrectly combined. XPR now retains its 48 listed XPR references; HT4001/HT4400 retains its 24 listed legacy references. MAXPRO200 retains 35 listed references present in its OEM consumable/torch sections, removing 32 associations belonging to legacy MAX200/HT2000 lists. These are subsets of the existing FLUTEX catalogue, not a complete OEM catalogue or proof of stock.

- Hypertherm torch and consumables catalogue HYP111659: printed pp.6–7 (XPR), pp.20–23 (MAXPRO200), pp.32–43 (MAX/HT upgrade and standard configurations), pp.50–51 (HT4400), p.52 (additional CCW consumables): https://xnet.hypertherm.com/Xnet/library/download/?file=HYP111659&format=pdf
- HT4001 operator manual HYP104414, consumable tables: https://www.hypertherm.com/Download?fileId=HYP104414&zip=False
- HT4001 manual HYP104073 confirms 120263 as CCW swirl ring: https://xnet.hypertherm.com/Xnet/library/download/?file=HYP104073

104 incorrect system/reference associations removed; no distinct reference removed from the full catalogue. Hypertherm system-level listings 648 → 544; distinct references remain 366.
Shared MAX200/HT2000 references with MAXPRO were NOT blindly deleted: OEM HyPro2000 upgrade tables support overlap. Actual installed torch and process must always be checked.
Changes synchronized in EN/AR page lists, metadata/counts, visible FAQs and JSON-LD, brand hub counts, interactive finder and global search. Asset filenames versioned to avoid stale immutable browser caches. Canonical/robots/hreflang unchanged.

## Remaining evidence-dependent work

Seven other identical-list groups remain review flags, NOT proven errors or proof of interchangeability: Thermal Dynamics, ESAB, Kjellberg, Lincoln, two Cebora groups, IPT. A complete supplier cross-reference catalogue identifying the offered replacement SKU and installed torch is needed before publishing corrections. OEM sources located for Cebora CP161 and Lincoln Tomahawk 1500 do not validate the full FLUTEX mappings. Model variants and replacement torches prevent safe blanket partitioning.

Official source leads:
- https://www.cebora.it/welding/en/assistance/documentation?set_language=en
- https://www.lincolnelectric.com/en/Products/kp4141-20
- https://manuals.esab.com/
- https://www.tecmo.it/wp-content/uploads/2025/09/AUTOMATION.pdf

Current exact-product TDS/SDS for lubricant figures and supplier SKU documents for tool specifications are still needed. No numerical specifications or compatibility associations are invented to complete the audit.

## Completion boundary

Technical checks can establish crawlability and internal consistency, not force Google indexing. Further individual requests must wait for Google's quota reset; indexing/report changes require Google's processing. No noindex/canonical changes, paid indexing services, or unsuitable Indexing API submission are indicated by the evidence.
