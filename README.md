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
