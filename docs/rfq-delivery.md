# RFQ delivery implementation

The direct-submission path is implemented but disabled until its production
permissions, credentials and delivery have been verified. Email-draft mode
continues while `RFQ_ENABLED` is absent or not exactly `true`.

## Delivery path

The Pages function forwards to `workers/rfq/service.mjs` through `RFQ_SERVICE`.
The Worker validates the production origin, request size, fields, attachments,
rate allowance and Turnstile result before requesting a Microsoft Graph token.
It sends a plain-text message from and to the fixed public FLUTEX sales address,
with the customer's address in Reply-To. There is no customer-controlled recipient.

The Worker has no public route or workers.dev endpoint. It does not read mailbox
contents, create public files or store submissions in a website database.
Microsoft Sent Items retains a copy. No form values, attachments or credentials
are logged by this implementation. Each attempt reaching the send step gets a
reference, included in its email subject.

Up to four PDF, PNG, JPEG, WebP, DXF or DWG files are accepted, totalling 2.5 MiB.
The size allowance leaves room for base64 encoding in a Graph JSON request.
Extension and file signatures are checked; this is not an antivirus scan.
Larger drawings can be sent through the existing email/WhatsApp channels.
Rate limiting is five attempts per IP per minute per Cloudflare location, not
a global exact quota. Turnstile requires the `rfq` action and matching hostname.

## Microsoft configuration — requires owner authorization

Create a dedicated single-tenant application and service principal for FLUTEX
RFQ delivery. Grant only Exchange Online `Application Mail.Send`, scoped to
the sales mailbox through Application RBAC. Do not add organization-wide Graph
Mail.Send, Mail.Read or Mail.ReadWrite grants. Unscoped Entra grants are additive
and would defeat the intended mailbox restriction.

An Exchange administrator can use the following configuration after substituting
the new application's identifiers. `$servicePrincipalObjectId` is the Enterprise
Application/service-principal object ID, not the app-registration object ID.

```powershell
$appId = '<APPLICATION-ID>'
$servicePrincipalObjectId = '<ENTERPRISE-APPLICATION-OBJECT-ID>'
$scopeName = 'FLUTEX RFQ sales mailbox'
New-ServicePrincipal -AppId $appId -ObjectId $servicePrincipalObjectId -DisplayName 'FLUTEX RFQ'
New-ManagementScope -Name $scopeName -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'sales@flutexindustrial.com'"
Get-Recipient -RecipientPreviewFilter (Get-ManagementScope $scopeName).RecipientFilter
New-ManagementRoleAssignment -Name 'FLUTEX RFQ send only' -Role 'Application Mail.Send' -App $servicePrincipalObjectId -CustomResourceScope $scopeName
Test-ServicePrincipalAuthorization -Identity $servicePrincipalObjectId -Resource 'sales@flutexindustrial.com'
```

Verify that the scope contains exactly the intended mailbox, the send role is
in scope, and a different existing mailbox is out of scope. Review the new
enterprise application's permissions for unintended unscoped grants. Permission
propagation can lag the authorization test; do not broaden access to work around it.

Store `M365_TENANT_ID`, `M365_CLIENT_ID`, `M365_CLIENT_SECRET` and
`TURNSTILE_SECRET_KEY` as Worker secrets. Keep actual tenant identifiers,
credential values, screenshots of secrets and authorization evidence outside Git.
Record the credential expiry privately and rotate it before expiry.

## Cloudflare configuration

Deploy using `workers/rfq/wrangler.jsonc`; its rate-limit binding is required.
Keep the Worker private. Create a Turnstile widget restricted to the production
hostnames `flutexindustrial.com` and `www.flutexindustrial.com`.

In the production Pages environment, bind `RFQ_SERVICE` to the Worker and set
`PUBLIC_TURNSTILE_SITE_KEY` to the corresponding public widget key. Keep
`RFQ_ENABLED` unset during provisioning. Do not copy credentials into preview
environments. Pages previews are also rejected by the request-origin checks.

After the owner authorizes the scoped grant and a test message, enable
`RFQ_ENABLED=true`, redeploy Pages, and submit one clearly identified owner test
through the live form. Confirm that the same reference and attachment arrive
in the sales inbox using the connected Outlook account. If that check fails,
unset `RFQ_ENABLED` and redeploy to restore draft mode while investigating.

Health and configuration checks do not prove delivery. Graph `202 Accepted`
means the request was accepted for processing, and the website says accepted
for sending. Inbox arrival must be observed separately. The Worker never retries
a send automatically after a timeout or ambiguous response.

## Validation

`node --test tests/*.test.cjs` exercises fixed recipients, field/request limits,
attachment handling, origin/rate/Turnstile rejection, readiness gating, Graph
errors, acceptance semantics and retained bilingual email-draft behavior.
These tests use fictional credentials and mocked network responses; they do
not submit real RFQs or prove a live Microsoft authorization grant.

Run the confidentiality and site/generator checks in AGENTS.md before committing.
Keep direct sending disabled until the real authorization and inbox test succeed.

## Primary technical references

- https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac
- https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0
- https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow
- https://learn.microsoft.com/en-us/graph/outlook-large-attachments
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
