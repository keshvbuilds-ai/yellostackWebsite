# General settings and offer notifications

Open CMS → General, update settings, then Save draft and Publish. Existing content remains compatible. The default offer is 10% with code YELLO10. Configure logo, public contacts, office address, WhatsApp, sales email/telephone, Google Maps, offer enablement, percentage, code, expiry (UTC) and terms here.

The VPS/local JSON backend stores each claim before attempting email. The notification contains the claim ID, visitor name, email, optional phone, project details, consent, timestamp and a snapshot of the published discount/code/terms. The server selects these offer values, never the visitor payload. The configured sales email is captured at submission. Reply-To is the visitor; From is your authenticated sending mailbox. Offers remain subject to sales approval; discovery is not cryptographically verified.

Set these private server environment variables, then restart the application:

```
SMTP_HOST=your-mail-provider-smtp-host
SMTP_PORT=587
SMTP_USER=your-authenticated-mailbox
SMTP_PASSWORD=your-mail-provider-app-password
SMTP_FROM=your-verified-sending-email
```

Use port 587 with STARTTLS or 465 with implicit TLS. Credentials are never stored in published content. Confirm the correct SMTP host and permitted sender with your email provider. See https://nodemailer.com/smtp for transport details.

CMS Inbox shows pending, sending, sent (accepted by SMTP), failed, or not_configured. If sending fails, the claim is still saved; use Retry notification after correcting SMTP configuration. Retries use the original recipient and offer snapshot. Simultaneous retries are serialized and a two-minute reservation allows recovery after process interruption. SMTP cannot guarantee exactly-once delivery if the server crashes after acceptance but before recording success; the stable claim ID helps sales identify duplicates. There is no scheduled retry worker yet.

Never test with real visitor data. Verify a claim to a mailbox you control after deployment, confirm delivery and Reply-To, then remove the test enquiry. Current automated tests use disabled SMTP and never send real emails. The Supabase submission path does not support these offer notifications; this implementation targets the requested VPS JSON CMS.

Contact form submissions also send a notification to the published Sales Email using these same SMTP settings. They include the visitor name, email, phone and message, without offer details. Submissions remain saved if SMTP is unavailable; delivery status and Retry notification are available in CMS Inbox. No automatic email is sent to the visitor.

## Private SMTP settings in CMS
On the VPS, General ? Private email settings lets an authenticated editor save SMTP host, port, username, app password and sender email. Blank passwords retain the existing password. Save SMTP settings applies immediately, independently of publishing; Send test email uses the published Sales Email, with one test per minute. The API never returns passwords. Existing server environment settings remain a fallback until CMS settings are saved.

Settings are AES-256-GCM encrypted in the private store, with a generated mode-600 key at CMS_DATA_DIR/smtp.key. Include this key and store.json in private backups; losing the key requires reconfiguring SMTP. Encryption does not protect against someone with full access to both server files. Settings are not included in public content or draft exports. No real test email is sent automatically during setup.

## Message presentation and connection test
Test connection & send email saves entered settings and sends a real email to the published Sales Email. SMTP acceptance is reported separately from inbox delivery; check the recipient inbox/spam folder. Subjects are Contact Form Submission, Easter Egg Found!!!, and Test Connection Email. Messages include escaped HTML tables, a plain-text alternative and the bundled YelloStack logo as an inline CID attachment. Visitor emails are used only as Reply-To.

Google: smtp.gmail.com, port 587, full mailbox email for username/sender, and an app password created after enabling 2-Step Verification (subject to account policy). Zoho: copy the mailbox-specific outgoing server from its server configuration; use port 587, full mailbox email and an app password from Zoho Accounts ? Security ? App passwords. Hosts vary by region and plan.
