# YelloStack VPS deployment

Prepared configuration; installation and live verification are still required. Use a single Node process with persistent local JSON storage. No Supabase or Upstash is needed. The contact form stores enquiries in the CMS. Easter egg claims can also notify the configured sales email once SMTP is configured; see [claim email setup](CLAIM-EMAIL.md).

## Before changing the server

Inspect the OS, existing services, SSH port, available disk and firewall first. Preserve existing applications. Record the domain's authoritative nameservers, A/AAAA records and email records. Do not replace nameservers or MX/SPF/DKIM/DMARC records to deploy the website.

Use an SSH key and a separate sudo administrator. Test that account in a second terminal before disabling password/root SSH access. Never commit credentials. Configure security updates and allow the actual SSH port before enabling a firewall; allow HTTP/HTTPS, but do not expose port 3000.

## Application layout

- `/srv/yellostack/releases/<release>`: Linux-built application, including production build and dependencies.
- `/srv/yellostack/current`: symlink to the active release.
- `/var/lib/yellostack`: private persistent `store.json` and `media/`.
- `/etc/yellostack/environment`: root-owned, mode 600, administrator username and password hash.
- Service account `yellostack`: non-login, owns the data directory and writable `.next` directory. Application sources should be read-only to this account.

Install a supported Node 24 release at `/usr/bin/node` and verify the path. Install Nginx and Certbot using the OS-supported method. In a new release directory, run `npm ci`, then `npm run build -- --webpack`. Build on Linux; do not copy Windows node_modules or .next. Do not copy .env.local, .cms-data, or credentials into a release.

Configure a fresh admin account privately using `node scripts/setup-admin.mjs`, then securely place only CMS_ADMIN_USERNAME and CMS_ADMIN_PASSWORD_HASH from the resulting file into `/etc/yellostack/environment`. The current setup script displays password input: use a private terminal without recording. Delete the temporary .env.local once its values are securely transferred. The service supplies CMS_BACKEND=local and CMS_DATA_DIR automatically. Never put these settings in NEXT_PUBLIC variables.

Create `/var/lib/yellostack` with owner yellostack and mode 700. If existing local CMS edits must be retained, explicitly migrate store.json and media together while both applications are stopped. Back up both source and destination first. Do not overwrite a live store during code deployments. Changing the admin hash invalidates previous sessions.

Install `deploy/yellostack.service` in `/etc/systemd/system/`, inspect paths, then run `systemctl daemon-reload` and `systemctl enable --now yellostack`. Check `systemctl status yellostack`, `journalctl -u yellostack`, and `curl http://127.0.0.1:3000/api/cms/status`.

Install `deploy/nginx.conf` as `/etc/nginx/sites-available/yellostack`, enable its symlink under sites-enabled, run `nginx -t`, and reload Nginx. Keep other virtual hosts intact. No proxy cache is configured, so CMS responses and published changes are not served from a stale proxy cache.

## Domain and HTTPS

At the authoritative DNS provider, point the `@` A record to the VPS IPv4 and `www` CNAME to yellostack.com. Change conflicting AAAA records only after checking whether IPv6 is configured on the VPS. Preserve all email records. Verify resolution before running `certbot --nginx -d yellostack.com -d www.yellostack.com --redirect`. Verify automatic renewal with `certbot renew --dry-run`.

CMS login uses Secure cookies and therefore needs HTTPS in browsers. Test the site with a hosts-file override or staging hostname before cutting over an existing production website.

## Acceptance checks

- HTTPS and redirects work on both hostnames; certificate renewal succeeds.
- Port 3000 is unreachable externally; SSH access is verified before hardening it.
- Login, create, edit, save draft, publish, deletion and logout work. Drafts stay private; published content appears on the website.
- Upload, reload and delete an unused image. Referenced images cannot be deleted accidentally.
- Submit a test enquiry, verify it in the CMS and delete it.
- Restart the service and verify published changes, images and enquiries persist.
- Check mobile and desktop menus, forms, WhatsApp, project links and the Work animation on real devices.

## Updates, backups and recovery

Build each new release separately. Back up before deployment, change the current symlink, restart the service and run smoke checks. Roll back by restoring the previous symlink and restarting; never roll back the content store automatically.

For a consistent backup, briefly stop the service, archive `/var/lib/yellostack` and the private environment file to a restricted directory, and restart the service even if backup fails. Encrypt backups before copying off-server. Set a retention policy and rehearse restoration into a separate test directory. A backup on the same VPS is insufficient protection against server loss.

After an abrupt process crash, a stale `/var/lib/yellostack/write.lock` may remain. Stop the service, verify no application process is running, back up the store, then remove only that empty lock directory and restart. Never remove an active lock.
