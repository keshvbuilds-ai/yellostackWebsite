# Production security review ? 2 November 2026

Scope: repository review of CMS authentication/authorization, content publishing, media, enquiries, locale, headers and dependencies. This is not an external penetration test or a certification of the deployed server.

## Changes
- CMS JSON and multipart bodies are limited while streaming, including requests without Content-Length. Login uses a smaller limit. Locale requests are also bounded.
- Images are decoded with a 25-million-pixel ceiling, stripped of metadata and re-encoded as WebP. SVG uploads remain forbidden.
- Password hashing is asynchronous to avoid blocking the Node event loop. Existing global persistent login throttling remains; throttled responses now use 429. Session lookup rejects malformed tokens, fails closed when authentication is unconfigured, and password-hash changes invalidate prior sessions.
- Added nosniff, same-origin frame restrictions, referrer/permissions policies and production HSTS. The baseline CSP blocks object embeds, foreign base URLs, foreign framing and cross-origin form actions. It is NOT a strict nonce-based script CSP; scripts/styles remain compatible with Next.js and the visual editor.
- Local enquiries have an aggregate 20/minute ceiling as well as the existing per-email cooldown and a 10,000-record capacity limit. This is a backstop, not distributed DDoS protection.
- Filesystem error details are no longer returned to CMS/enquiry clients.

## Existing protections verified by source review
CMS mutation routes require an authenticated editor (except login/logout), enforce same-origin requests, use HttpOnly/SameSite cookies and Secure in production, and save via revision checks. Local media names are restricted and deletion rejects referenced images. No raw HTML rendering/eval patterns were found in src. Git tracks only .env.example, not local credentials or the CMS data directory.

## Required before public launch on VPS
- Rotate the administrator password: a password was previously shared in this conversation. Generate a fresh hash locally; never commit the password or hash. Set environment variables outside the repository/public web root.
- Run the production build as a dedicated non-root OS user behind HTTPS. Bind Node to 127.0.0.1 and expose only the reverse proxy. Never expose the development server.
- Keep CMS_DATA_DIR outside release directories and public/static roots, readable/writable only by the application user. Back it up encrypted, off-server, and test restoration. Do not publish the repository or .cms-data through Nginx.
- Set proxy request limits (e.g. client_max_body_size 4m), body/header timeouts and IP rate limits on login, upload and enquiries. Forwarded IP headers must be overwritten by the trusted proxy; the application does not trust arbitrary client X-Forwarded-For values.
- Use SSH keys, restrict SSH access, configure the firewall and apply OS/security updates. Keep HTTPS and dependency patches current.
- Decide on enquiry retention/deletion and monitor disk space, failed logins, 5xx responses and backup failures without logging passwords, cookies or message bodies.
- A strict nonce CSP, MFA and per-IP distributed abuse controls remain future hardening tasks. Aggregate limits can be exhausted by an attacker; production proxy controls are still needed.

## Verification
Run node scripts/check-security.mjs, TypeScript and the production build. Review npm audit separately; a successful application build does not establish that dependencies are vulnerability-free.

## Recorded results
- Next.js and eslint-config-next updated to 16.4.3; Sharp pinned directly at 0.35.5. Patched transitive source-map-js and Zod. Removed unused Puppeteer and tunnel dependencies.
- `npm audit --omit=dev`: 0 vulnerabilities at review time.
- Full `npm audit`: 16 moderate findings remain in the development-only ESLint/minimatch chain (GHSA-g3hv-75wg-m249). No high or critical findings remain. Do not run lint tooling on untrusted glob inputs; revisit when compatible upstream fixes ship. No forced cross-major minimatch override was applied.
- TypeScript, existing CMS/enquiry validation suites and new streamed-body/image tests passed.
- Isolated production API tests passed: authentication and CSRF rejection, bounded login body, secure cookie flags, draft/public separation, revision conflict, publishing, valid/invalid image uploads, media MIME, logout revocation, login throttling and security response headers.
- Production webpack build passed. No live hosting changes were performed. Existing CMS sessions must sign in again after the session-digest hardening; the password itself was not changed.

References: https://nextjs.org/blog/nextjs-security-update-october-14-2026 and https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
