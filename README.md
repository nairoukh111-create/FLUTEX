# FLUTEX Industrial website

Production-ready static website for `flutexindustrial.com`, prepared for Cloudflare Pages.

## Cloudflare Pages deployment

- Production branch: `main`
- Root directory: repository root (leave blank in Cloudflare)
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `.`

Cloudflare automatically deploys every push to `main`. The static site is served from the repository root.

## RFQ function

`functions/api/rfq.js` exposes `/api/rfq` and forwards multipart RFQ submissions to a Cloudflare Worker through a Service Binding named `RFQ_SERVICE`.

In the Pages project, add a Service Binding with:

- Variable name: `RFQ_SERVICE`
- Service: the Worker responsible for Turnstile verification and email delivery

The website remains fully usable without the binding, but RFQ form submission returns a clear temporary-unavailable message until it is configured. Email and WhatsApp links continue to work.

## Shared supply coverage map

The localized section before each footer uses `components/supply-coverage.en.html` and `.ar.html`, `assets/css/supply-coverage.v1.css`, and a shared, lazy-loaded WebP basemap. Three SVG paths connect the UK marker to distinct Türkiye, Saudi Arabia and UAE markers. UAE is labelled as a supply market.

After editing either component or generating pages, run `python scripts/supply_coverage.py`. Run `python scripts/supply_coverage.py --check` to verify all pages match. The component is statically rendered and works without JavaScript; mobile shows readable country labels below the map.
