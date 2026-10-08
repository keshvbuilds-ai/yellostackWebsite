# Deploy Yellostack with its content studio

The website and `/admin` deploy together on Vercel. Persistent data, login and images live in Supabase. A GitHub import cannot automatically create that external project or an admin account. No paid purchase or external provisioning has been performed by this implementation.

## First deployment

1. Create a Supabase project, or use a project dedicated to this website.
2. Run `supabase/migrations/001_cms.sql` **once** in its SQL editor. This creates draft and published-content tables, editor membership, database policies, an atomic save/publish function, and the `site-media` storage bucket.
3. In Supabase Authentication, create an email/password user with a strong password and confirmed email. Disable public email sign-ups because this is an editor-only CMS. Configure authentication rate limits for your project.
4. Copy that user's UUID and run:
   ```sql
   insert into public.cms_editors(user_id) values ('YOUR-AUTH-USER-UUID');
   ```
   Only users listed here can read drafts, upload or publish. Never create an editor from public form input.
5. Push the repo to GitHub. Import it into Vercel using the Next.js preset, repository root, `npm run build`, and the default output setting. Use a currently supported Node LTS version compatible with the installed Next.js version (Node 22 or newer).
6. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel environment variables. Use the **legacy anon/public JWT key** from Supabase Project Settings → API, not a secret/service-role key or a database password. Set these for the relevant Production/Preview environments. Prefer a separate Supabase project for staging if preview editors must not publish production content.
7. Redeploy, open `/admin`, sign in, make a small change, and choose **Save draft**. Confirm the public page does not change. Choose **Publish**, then refresh the public page and verify the change.

Without configuration, the public website uses its bundled content; the admin page displays setup instructions. A database outage also falls back to bundled public content rather than rendering a blank website. Monitor Supabase availability; fallback content may be older than the last publication.

## Editing

- **Homepage data:** descriptions, services, capability lists, process and contact details.
- **Headings & labels:** homepage headings, CTAs, chapter copy, footer wordmark and other text fields. Search by existing wording. Three hero journey words and the three gallery layers remain fixed in count because they drive the animation; their copy is editable.
- **Images:** upload an image, then paste its returned URL into the appropriate existing image field. This replaces logos and gallery artwork, including the Three.js card textures. Uploads accept JPEG, PNG, WebP or AVIF up to 3 MB. SVG uploads are intentionally excluded; existing local SVG artwork remains supported.
- **Inner pages:** edit titles, introductions and sections. Sections support images and alt text. New lowercase, hyphenated page slugs are available immediately after publishing. Pages with kind `service` appear in the Services menu. Non-service pages can be opened at their slug; the fixed company menu remains a curated navigation structure.
- **Blog articles:** add posts, descriptions, paragraphs, dates and cover images. New articles appear in the blog index; the three newest appear on the homepage. Existing archival overviews remain labelled as overviews.
- **Open roles:** add title, location, employment type, description and application email. Toggle `open` to show/hide a vacancy on `/careers`. Applications open the visitor's email client; there is no applicant tracking database.
- **Client logos:** upload a logo and add its URL, accessible client name and optional HTTPS website link. Published entries render on `/clients`.

**Save draft** stores your changes without altering the public site. **Publish** saves and publishes in one database transaction. Pages read published content on the server without a deployment or cache purge. Visitors already viewing a page should refresh to receive new content.

Sessions use HttpOnly, same-site cookies and expire after at most one hour. Sign in again when prompted; export unsaved changes before leaving. Drafts use optimistic revision checks: if another editor saves first, export your changes, reload and reconcile rather than overwriting their work.

**Export backup** downloads the current document. **Import backup** restores a JSON backup into the editor for review; it does not publish until you choose Publish. Keep database backups in Supabase as well. Uploaded files persist independently of deployments and drafts; removing an image reference does not delete its storage object. Unused files can be removed in Supabase Storage after checking that no published page uses them.

## Local development and validation

Copy `.env.example` to `.env.local` and fill in the two values. Never commit `.env.local`. Run `npm ci`, `npm run check:cms`, `npm run build`, then `npm run dev`.

Before launch, verify login, unauthorised write rejection, draft isolation, publish, role open/closed state, client-logo uploads, new blog routes and two-editor conflict handling against your actual Supabase project. Test desktop and mobile scroll, reverse scroll, reduced motion and WebGL fallback in a real browser.

This workspace could run TypeScript and content-validation checks. Shell startup and the browser connection were unavailable, so a full production build, visual review and live Supabase integration were not verified here. Do not treat those as passed checks.

## Architecture

- Next.js route handlers: `src/app/api/cms/[action]/route.ts`.
- CMS UI: `src/components/cms/AdminPanel.tsx`.
- Server reader and authentication: `src/lib/cms/server.ts`.
- Defaults: `src/lib/cms/defaults.ts` and `src/content/cms-copy.json`.
- Schema and policies: `supabase/migrations/001_cms.sql`.
- Golden footer scene: `src/components/animations/GoldenHorizon.tsx`.

No local filesystem writes are used for production content. Public media is deliberately public; never upload confidential files. No service-role key or admin password is exposed to the browser.


## Contact enquiries and Easter egg offers

Run supabase/migrations/002_enquiries.sql after 001_cms.sql. Add SUPABASE_SERVICE_ROLE_KEY to Vercel server environment variables (the Supabase legacy service_role key), then redeploy. Never prefix this key with NEXT_PUBLIC_ or commit it. Public visitors cannot read enquiries. CMS editors can open the Inbox panel to read project enquiries and 15% offer claims.

The hero reward appears at 100%. Tear the ticket with a pointer, or focus its stub and press Enter. Submit an email with contact consent to save an offer claim tagged YELLO15. This records a request; it does not send email or automatically apply discounts to invoices. Honour the advertised 15% offer when preparing the project quotation. No mailing-list subscription is created.

The contact page has a persistent Yellostack mode switch, a greeting ticket, and a personalized form. Mode preference is stored locally on the visitor's device. Forms report success only after the database accepts the record. If configuration is missing, visitors receive an honest unavailable message and an email alternative.

Submissions are idempotent by request UUID and limited to five per hour per hashed Vercel visitor IP in PostgreSQL. On non-Vercel local hosts the shared local bucket has the same limit. This is basic abuse protection, not CAPTCHA protection; enable Vercel Firewall controls if targeted. Raw IP addresses are not stored. Manage retention/deletion from Supabase; the CMS inbox currently provides read access only.

Before launch, verify a real offer and contact submission in the CMS inbox, test duplicate retries and rate limits, and check the 3D scene on mobile and keyboard-only navigation. The contact sequence uses the supplied human-hand photographic storyboard at public/contact/human-handshake.png. GSAP moves the separate hands, crossfades into the joined-hand photograph and animates a gentle handshake; this is a photographic sequence, not a rigged 3D hand simulation.
