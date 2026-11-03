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
