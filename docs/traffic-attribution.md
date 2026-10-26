# Traffic attribution and B2B measurement

Updated 26 October 2026. Applies to the single GA4 website stream, public measurement ID G-NHDB1BF095.

## Collection

- analytics.v17.js starts Google only after optional analytics permission, and only on flutexindustrial.com. Declining or withdrawing stops configured interaction events and clears first-party GA cookies. Preview hosts do not send production events.
- One installation guard, one Google script, send_page_view:false and one explicit page_view prevent duplicate views. Enhanced measurement must remain off, including automatic history page views and form/outbound-link measurement.
- page_location contains the origin and path, without query or fragment. page_referrer retains only an HTTP(S) origin. The same safe defaults apply to automatic engagement events.
- The five recognized parameters map to Google's official campaign fields: utm_source → campaign_source; utm_medium → campaign_medium; utm_campaign → campaign_name; utm_content → campaign_content; utm_term → campaign_term.
- Labels must be at most 100 characters. Source and medium use letters, digits, dots, hyphens or underscores. Other labels also support Unicode letters, spaces, parentheses and plus signs. Ambiguous duplicate parameters, control characters, URLs, email-like strings, long digit sequences and recognizable token patterns are rejected. Explicit empty overrides suppress rejected raw campaign values; utm_id is not collected.
- No names, contact details, form text, attachments, arbitrary parameters, referrer paths or enquiry-prefill values are read into analytics events. Do not put personal names, customer identifiers, confidential text or credentials in any UTM label: pattern checks cannot identify every kind of personal data.
- Advertising storage, Google signals and ad personalization remain disabled. No consent-independent Google collection, attribution cookies or additional third-party analytics service are introduced.

## Source interpretation

Let GA4 determine source/medium and its default channels. Do not relabel Direct as AI, Google as Gemini, or all Bing traffic as Copilot. The referrer and controlled campaign labels are evidence; an absent referrer is not evidence of a particular source.

GA4's default AI Assistant channel identifies recognized AI referrals. Use Session source / medium to see individual sources and catch sources GA4 may place in Referral. Google AI Overviews and AI Mode are included in Organic Search, so a google / organic session alone cannot distinguish these surfaces.

Keep the standard channel group intact. Use source comparisons or report filters for ChatGPT, Claude, Perplexity, Gemini and Copilot where identifiable. Native apps, copied links, browsers, blockers and consent choices can remove attribution evidence.

No analytics attribution state is stored before permission. If a visitor moves to another page before allowing analytics, the original landing campaign or referrer may no longer be available. GA4 cannot reconstruct that missing history or recover old campaign information retrospectively.

## Events

| Event | Meaning | Completed enquiry? |
|---|---|---|
| page_view | One measured page view after permission | No |
| contact_click, contact_method=whatsapp/email/phone | Click on the chosen contact link; opening the WhatsApp chooser alone does not count | No |
| product_enquiry_click, contact_method=rfq | Internal EN/AR contact link carrying a product prefill; the prefill value is not transmitted | No |
| rfq_draft_prepared | Valid form prepared for the visitor's mail app | No |
| rfq_details_copied | Details copied on the visitor's device | No |
| rfq_service_accepted | Configured RFQ service returned a successful response | Service acceptance only; not proof of email delivery or qualification |

Use contact_method as an event-scoped custom dimension. Reserve the accepted-RFQ key event for rfq_service_accepted. Keep contact and draft intent separate from received/qualified leads. Do not emit generate_lead for a click, copy or draft.

The RFQ backend must be enabled and delivery tested before claiming automated enquiry delivery. Analytics is not a CRM or proof that a WhatsApp/email/phone conversation happened.

## Campaign naming

Use lower-case source/medium consistently and non-personal campaign names. Keep the same campaign name across channels when comparing the same promotion. Examples (replace campaign labels with your real campaign; do not tag internal navigation):

- WhatsApp broadcast: /plasma-consumables?utm_source=whatsapp&utm_medium=social&utm_campaign=ksa_plasma_2026q4&utm_content=broadcast
- LinkedIn company post: /plasma-consumables?utm_source=linkedin&utm_medium=social&utm_campaign=ksa_plasma_2026q4&utm_content=company_post
- Facebook paid campaign: /plasma-consumables?utm_source=facebook&utm_medium=paid_social&utm_campaign=ksa_plasma_2026q4&utm_content=creative_a
- Email brochure: /products?utm_source=flutex_newsletter&utm_medium=email&utm_campaign=ksa_tools_2026q4&utm_content=brochure

These are tagging examples, not evidence of traffic, paid campaigns or endorsements. Do not append AI source labels to ordinary links just to create apparent AI referrals.

## Validation and reporting

Run the existing site-quality checks and node --test tests/*.test.cjs. Both source audit and the deployed crawl require one current wrapper and reject static/inline Google implementations that bypass it. Deployment verification compares the changed asset bytes.

Test campaigns use source flutex_qa and campaign attribution_validation_20261026 so that deliberate test visits can be recognized and excluded from business analysis. Do not create synthetic accepted-RFQ events in production.

Use Traffic acquisition for session source/medium, engagement, event counts and accepted-RFQ key events; User acquisition for first-user attribution; Landing page for entry-page performance; Events for intent details. Report recorded users/sessions rather than assuming all visitors consented.

Cloudflare Web Analytics supplies a useful independent RUM visit/page-view check and already exists. Its visits are not GA users or GA sessions. Filter the production host and use matching date ranges; neither HTTP request counts nor bot/crawler activity are qualified leads.

## Official references

- Google campaign fields and safe page overrides: https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- Google manual page views: https://developers.google.com/analytics/devguides/collection/ga4/views
- Google campaign tagging: https://support.google.com/analytics/answer/10917952
- Google default channels and AI Assistant: https://support.google.com/analytics/answer/9756891
- Cloudflare Web Analytics: https://developers.cloudflare.com/web-analytics/about/
