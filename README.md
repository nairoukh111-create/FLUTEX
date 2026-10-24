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

The English and Arabic forms now prepare an email draft while the secure service is unavailable. Draft preparation is **not** an email delivery or a completed RFQ. Attachments must be added in the email client; the website does not upload them in draft mode. Customers can also copy the enquiry details or use the existing direct email/WhatsApp links.

To enable online submissions, provision the verified RFQ Worker, bind it as `RFQ_SERVICE`, and set the public `PUBLIC_TURNSTILE_SITE_KEY` in Pages. The Worker must validate Turnstile and handle attachment validation, spam protection and delivery. `GET /api/rfq` exposes only readiness and the public site key, never secrets. Do not mark delivery as verified until an authorised end-to-end test has succeeded.

## Shared supply coverage map

The localized section before each footer uses `components/supply-coverage.en.html` and `.ar.html`, `assets/css/supply-coverage.v1.css`, and a shared, lazy-loaded WebP basemap. Three SVG paths connect the UK marker to distinct Türkiye, Saudi Arabia and UAE markers. UAE is labelled as a supply market.

After editing either component or generating pages, run `python scripts/supply_coverage.py`. Run `python scripts/supply_coverage.py --check` to verify all pages match. The component is statically rendered and works without JavaScript; mobile shows readable country labels below the map.

## Search and technical resources

- `/parameters` and `/ar/parameters` contain sourced metric milling formulas and a calculator. No default machining settings are recommended; values must come from the tool/application documentation.
- `scripts/prerender_tool_finders.py` renders the existing 30 tool families into HTML, with links to the existing detail pages. Its `--check` mode detects drift. JavaScript filters continue to enhance this content.
- `scripts/build_search_index.py` indexes every sitemap page into `search-index.v18.js`, retaining the prior catalog terms/reference data without inventing product records. Rebuild after content or sitemap changes; use `--check` in validation.
- `global-search.v16.js` normalizes Arabic search and prefers the matching site language for equivalent pages.
- The Saudi operator is represented as a local business using the FLUTEX brand, without asserting UK parent-company ownership.

## Validation and discovery notifications

Development scripts require Python with `lxml` (and Pillow for tool images), plus Node.js for the focused tests. They are not production build dependencies.

```sh
python scripts/prerender_tool_finders.py --check
python scripts/build_search_index.py --check
python scripts/supply_coverage.py --check
python scripts/audit_site.py --output /tmp/flutex-source-audit.json
node --test tests/*.test.cjs
python scripts/crawl_live.py --output /tmp/flutex-live-audit.json
```

The root hexadecimal `.txt` file is a **public IndexNow verification key**, not a secret. After deploying changed canonical URLs, prepare a JSON array of those URLs and use `scripts/notify_indexnow.py --urls /path/to/changed-urls.json --dry-run`. Remove `--dry-run` to notify IndexNow only after verifying the deployed changes. HTTP 200/202 acknowledges receipt; it does not establish Bing or Google indexing. Do not repeatedly notify unchanged URLs.

Cloudflare Web Analytics was enabled in the existing Pages project on 22 October 2026. Pages injects its beacon on subsequent deployments. Page views/referrals and intent clicks are not qualified RFQs; conversion/CRM measurements require a separately configured destination.

## Optional Google Analytics

`analytics.v16.js` uses the public measurement ID for the existing FLUTEX website stream. The Google tag only loads after permission, only on the production hostname. The bilingual choice can be reopened from the footer; declining disables collection and removes the first-party GA cookies. Enhanced measurement is off in the stream to prevent automatic collection of form/search/link contents. Advertising storage, Google signals and ad personalization are disabled.

Events: `contact_click` with a fixed WhatsApp/email/phone method, `rfq_draft_prepared`, `rfq_details_copied`, and `rfq_service_accepted`. No form values, outbound URLs, search terms, URL queries/fragments or referrer paths are included in configured events. These events are intent or service acceptance signals, not qualified leads, verified delivery or sales. No synthetic RFQ is submitted for analytics validation. Preview hosts never send production events.

The live deployment check also compares changed JS/CSS assets with the checkout before accepting a deployment. IndexNow notifications require a new URL or changed sitemap lastmod as well as changed HTML; shared analytics asset references do not cause all existing pages to be notified again.
