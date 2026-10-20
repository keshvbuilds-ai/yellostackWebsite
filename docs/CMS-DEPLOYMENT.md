## Vercel without Supabase: persistent JSON CMS

The Node.js CMS now supports `CMS_BACKEND=json`. It stores its JSON state and uploaded image bytes in Upstash Redis over server-side REST. This retains the existing username/password login and visual editor. It requires a persistent Upstash database; no Supabase or SQL migration is needed. Do not use a temporary expiring test database for production.

1. Create/connect an Upstash Redis database to your Vercel project. Use a non-evicting configuration so CMS records cannot be evicted under memory pressure. Check the provider storage and request limits for your image volume; images are base64 encoded, using about one third more storage than the original file.
2. In Vercel Production environment variables set:
   - `CMS_BACKEND=json`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN` (read/write token, server-only)
   - `CMS_ADMIN_USERNAME`
   - `CMS_ADMIN_PASSWORD_HASH` (copy the salted hash value from your ignored local `.env.local`; never commit it or use the plain password)
   - Optional `CMS_STORAGE_PREFIX=yellostack:cms:production`
3. Redeploy. Open `/api/cms/status`: it should report `configured: true` and `backend: json`. This confirms settings exist; sign in to verify connectivity.
4. Open `/admin` and use the existing administrator username/password. An empty store starts with bundled content. Save a draft, publish, reload and verify the public page. Upload a test image and verify it survives a redeploy.
5. To move other local content, export a backup from the local CMS and import it in the deployed editor. Local `/api/media/` files are not in that backup: re-upload them and replace their references before publishing. The bundled Work snapshot already includes its exported image.

Use a separate database or prefix for Preview deployments to keep test edits away from production. Content revisions and atomic compare-and-set protect competing saves. Login sessions and throttling are shared across serverless instances. Storage outages return errors instead of silently writing to temporary disk. Keep content backups and arrange provider backups for images and state.

The code is ready for this mode, but configuring credentials and connecting the external database are required before the live CMS can operate.

## Current setup: Node.js CMS

The default backend is the existing Node.js filesystem CMS. Supabase is optional and is only selected when `CMS_BACKEND=supabase` is explicitly set.

Use `npm run dev` locally and open `/admin` with your configured administrator account. If no account exists, run `node scripts/setup-admin.mjs` and restart. Existing content, media, drafts, and credentials are preserved.

For now, Vercel serves the public website with bundled content. Its ephemeral filesystem cannot run this CMS reliably for login sessions and saved changes. Continue editing on the local Node.js server until persistent hosting or a hosted backend is configured. Do not set `CMS_DATA_DIR=/tmp` as a persistence workaround.

## Work journey on Vercel

The Work journey needs at least one published Work project. Git does not include `.cms-data`, so a GitHub import does not transfer local CMS records or `/api/media` uploads.

Run `node scripts/export-published-work.mjs` while the local site is running to export **only published Work projects** and their local uploaded images. Commit `src/content/published-work.json`, `public/work-published/`, and the code changes, then redeploy. The bundled snapshot is used when no CMS data exists; a configured CMS collection (including an intentionally empty collection) takes precedence. Re-run the export after publishing local project changes if deploying without a hosted CMS.

For live CMS editing on Vercel, configure `CMS_BACKEND=supabase`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`, and follow the Supabase setup below. The local filesystem CMS cannot persist edits on Vercel. Never commit `.cms-data` or `.env.local`.

## Collections and animation editing

The editor now fits the viewport without an outer scrollbar. **Full screen** maximizes the website canvas. While in Click to edit, pointer gestures no longer reach the 3D scenes; industry image panels are expanded for reliable selection. **Edit section text & images** exposes the ordered fields for hidden animation stages, including the homepage stack, AI and medical sections. Browse restores normal interactions.

Direct manager buttons provide CRUD for Team members, Open roles, Blog articles, Client logos, Products, Industries and Work projects. Each item has its own image uploader. Existing team and industry overrides are retained when older local content is migrated.

- Products: image, title, description, feature list and optional destination link. Published items appear in the Products showcase.
- Work projects: image, title, description, service category and optional link. Published cards are grouped under service titles in Work. No link means no redirect button.
- Industries: add/remove industries, edit their image, category, introduction, use cases and linked service.
- Team members: add/remove/reorder profiles with name, role, bio and portrait. The public slider follows that order.
- Blogs: each article has a dedicated `/blog/{slug}` page with its image and paragraphs.
- Careers: open/close or delete jobs. Clients: manage logo, sector, link and recent-client information.

Save draft keeps changes private; Publish updates the public collections. Back up the full data directory before production migrations.

---

## Visual editing (default)

Open `/admin`, sign in, and choose a page. The actual website fills the editor.

- Scroll to the content and click highlighted text or an image. A small side panel opens for that item only.
- Typing or replacing an image updates this private website preview immediately. It does not publish automatically.
- **Done editing** closes the side panel. **Save draft** preserves your work privately. **Publish** updates the public site.
- Switch to **Browse** to use the website navigation and interactive sections. Switch back to **Click to edit** to make changes. External links and form submissions are disabled inside the preview.
- Use **Mobile view** to check the narrow layout.
- **Content lists & settings** contains blog/career creation, deletion, backups, media library and inbox tools.

The preview runs the actual page and its animations. Editable text and images are highlighted on hover; WebGL geometry and other custom layout code are not editable by clicking. The visual preview uses English; Arabic translations remain in the content fields.

---

## Editing by website page

The default admin view is now **Edit website by page**:

1. Choose Home, About us, Our team, a service page, Work, Industries, Blog or Careers.
2. Choose a numbered section in the left sidebar. Sections follow the public page from top to bottom.
3. Edit the visible text or use **Upload / replace image** beside its preview. The upload is assigned directly to that field. Capability, industry and team images can be replaced independently.
4. Save draft to keep changes private, or Publish to make them public.
5. Use **Show live website** for a desktop/mobile published-page preview. It refreshes after publishing; it does not display unsaved drafts. Other open website tabs in the same browser refresh their content on publication.

The GM message follows Three perspectives on About us. Shared footer/contact fields are available at the end of every page. Blog and career entries support adding/removing items. Advanced tools retain the full field editor, backups, media library and enquiry inbox.

---

# Node.js admin backend (default)

Open `/admin` and use your configured username and password. The requested account is configured locally in ignored `.env.local`, using a salted scrypt password hash.

## Deployment

- On a new machine run `node scripts/setup-admin.mjs` to create the admin account, then restart the server. Environment variables CMS_SETUP_USERNAME and CMS_SETUP_PASSWORD can supply setup credentials through a secret manager.
- Run `npm run build` and `npm start` on a persistent Node.js server behind HTTPS.
- Set `CMS_DATA_DIR` to a durable writable directory outside the web root (default `.cms-data`). Preserve it across deployments. Local mode is not suitable for Vercel or other ephemeral/serverless filesystems.
- Back up the entire data directory securely, including media, plus your environment configuration. The admin JSON export only backs up content, not images.
- Writes use atomic replacement and an exclusive filesystem lock. If a process is forcibly terminated during a write, stop all app processes and remove the stale `write.lock` directory inside CMS_DATA_DIR before restarting. Multiple workers must share a filesystem supporting exclusive directory creation and atomic rename.

## Admin workflow

Manage homepage data, existing English/Arabic headings, images, inner pages, blog articles, careers and client logos in the editor. Arrays support add, edit, remove and reorder. Close a role to stop advertising it. Upload images and copy their URLs from the image library into the corresponding image fields. Unused uploaded images can be deleted; images referenced by saved or published content are protected. Read and delete contact enquiries from the inbox.

Save draft keeps changes private. Publish updates the public website. Revision checks protect against overwriting a newer draft. Export a backup before importing replacement content. Sessions expire after one hour and logout revokes them. Login is limited to ten attempts per minute.

Animation geometry and custom layouts remain code-controlled. Registered copy/media fields and structured content are editable; newly created generic pages do not automatically add navigation items.

## Optional Supabase backend

Set `CMS_BACKEND=supabase` to use the previous hosted backend and its email login. Local media deletion/library and enquiry deletion controls require the Node backend. The previous deployment guide follows for this optional mode.

---

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

Before launch, verify a real offer and contact submission in the CMS inbox, test duplicate retries and rate limits, and check the 3D scene on mobile and keyboard-only navigation. The contact sequence uses custom articulated Three.js hand models with tapered skin surfaces, jointed fingers and sleeve geometry. One GSAP ScrollTrigger timeline controls the entrances, text, grip and handshake. These are procedural models, not scanned human assets. Check grip alignment and appearance on desktop and mobile before launch. The earlier photographic storyboard remains an unused reference asset.

## Arabic, RTL and editorial media

The navigation language button switches between English and Arabic, saves a same-origin language cookie, and reloads the current route. Arabic sets document lang and dir and uses responsive RTL styles. WebGL scenes keep their physical coordinate direction. Reduced-motion preferences disable the added section reveals.

Bundled Arabic translations are in src/content/arabic.json. In the CMS Headings & labels panel, search ar: to edit translations. Keys use ar: followed by the exact English source text. Existing drafts receive new default translation and media fields automatically. Newly authored English content needs a matching Arabic entry; otherwise it remains English. For new translation keys, add them to the copy object through the CMS JSON import/export workflow, or extend the bundled dictionary. Review Arabic copy editorially before launch.

Stock images appear on service/company pages, careers and blog cards; the homepage includes a studio media section. Media overrides are editable in the CMS. The studio.video key accepts a hosted MP4 URL; the upload endpoint accepts images only (up to 3 MB). Video playback is user initiated and pauses offscreen. Assets currently depend on the external Pexels CDN. See [media sources and license](MEDIA-LICENSES.md).

Validation completed: TypeScript and CMS/locale/enquiry regression checks. Production build and browser/mobile visual checks must still be run in a working terminal/browser environment. Check both languages at phone, tablet and desktop widths, navigation, forms, media playback, reduced motion and the existing pinned 3D sequences.

## Service hero banners

The 13 service-specific banners are local SVG images in `public/banners`, mapped to routes in `src/content/service-banners.ts`. In CMS Media, search `/banners/` and replace the corresponding image URL or upload a replacement image, then publish. Use a 640:500 aspect ratio with clear space around the artwork. These are original illustrations; no stock license is needed. The shared hero retains its mobile layout, RTL placement and reduced-motion behavior.

## Service hero banners

The 13 service-specific banners are local SVG images in `public/banners`, mapped to routes in `src/content/service-banners.ts`. In CMS Media, search `/banners/` and replace the corresponding image URL or upload a replacement image, then publish. Use a 640:500 aspect ratio with clear space around the artwork. These are original illustrations; no stock license is needed. The shared hero retains its mobile layout, RTL placement and reduced-motion behavior.

## Shared public footer

Every public page uses `src/components/Footer.tsx`: the “Every idea has a next chapter” Golden Horizon, interactive YelloStack signature, and footer links/contact details. Home and careers already used it; service, company, contact, AI, blog index and blog article routes now use the same component. Edit its existing CMS copy fields to update it everywhere. The admin panel remains separate.


### Company profile and homepage figures
The Home overview, mission, vision and animated statistics use editable `profile.*` keys in Copy. Values are seeded from the supplied 2024 Yellostack Profile: 9+ years, 200+ clients, 4.8 Google rating and 300+ projects. These are profile figures, not a live Google rating feed. Keep numeric value keys numeric; suffix and label keys are separate. About Us uses the Pages editor. Previously published About Us records remain authoritative; update its mission and vision sections in the CMS to publish the new profile wording.


### Company profile client logos
Sixteen logos from profile page 18 seed the Clients collection. The same collection is displayed immediately above the Home footer and on /clients. Use the Clients editor to update names, images, links or remove entries. Existing published CMS content remains authoritative; if its Clients collection is empty, add these logos from public/clients in the Clients editor and publish.

Profile additions include /devops-services, /startup-services and /communication-services, plus CloudOps, branding and application-modernisation details. Existing published page records are not overwritten. AI and Medical Coding scenes are preserved.

### GM message and medical services
The About page GM message uses `gm.*` copy fields and `/team/hassan-majrashi.png` in media overrides. The medical services cards and headings use `medical.services.*`. Existing published About page content remains authoritative; update its introduction and sections in the CMS to adopt the new profile copy.

### Team lanyard showcase
Edit `team.badges.0` through `team.badges.3` name, role, code and description in CMS copy. The first profile uses the supplied GM portrait; the remaining badges represent disciplines, not invented employees. Portrait media uses `/team/hassan-majrashi.png`. The draggable lanyard is adapted from the user-supplied React Bits example and loads only on the team page. Reduced-motion and unavailable WebGL show a static badge.

The team page now uses a branded scroll portal instead of the selectable lanyards. Edit `team.portal.*` for the destination copy. Profile photography and biographies are pending user-provided assets; the initial panel uses a brand monogram.


## October 2026 website feedback

Client logos now include `sector`, `recent`, and `projectSummary`. In **Client logos**, select a sector for filtering. To show a card under **Recently joined the stack**, enable `recent` and enter an approved project summary. The website displays the first four featured clients in CMS order. This section stays hidden until at least one complete recent-client record is published; no sample client projects are published. Its heading and introduction are editable under `clients.recent.*`. The clients-page invitation uses `clients.invitation.*`.

The Products destination is `/products`, with existing Travel, Freight, Retail, Enterprise Dynamics and Facility Management product pages. The Services menu and footer use the nine curated entries in `src/content/catalogue.ts`. Menu illustrations are local SVGs in `public/banners/`.

`feedback-upgrade.ts` upgrades unchanged legacy feedback copy on public and editor reads, adds the Products directory if missing, and supplies client-field defaults. Custom copy values are retained. The legacy seven-capability homepage list is replaced by the six requested capabilities. Saved data is not rewritten until an editor saves/publishes. The migration is idempotent.

Studio Notes remains on the homepage, as permitted by the feedback document. No live Instagram integration was added.

### Industries we serve

The menu and footer link to `/industries-we-serve`. The page provides nine sector profiles, category filters, relevant use cases and links to existing services/products. Edit its headings and sector copy in CMS **Headings & labels** using the `industries.*` keys. Sector ordering, categories, images and destination routes are maintained in `src/content/industries.ts`; keep category names aligned with the filters. Arabic translations are in `src/content/arabic.json`. The page includes responsive layouts and reduced-motion support.

### Work page presentation

`/portfolio` (also reached through `/work`) uses the WorkExperience layout: a yellow opening with section links, alternating application showcases and enquiry links. Edit the existing Portfolio page title, intro and sections in the CMS. Optional section images replace the illustrated concept artwork; section items replace the default feature lists. Motion respects reduced-motion preferences, and the layout supports Arabic and mobile screens.

### Animation runtime compatibility

React Three Fiber is pinned to 9.7.0. Its internal Clock construction is migrated to a Timer-backed adapter by `scripts/patch-fiber-timer.mjs`, run automatically by `postinstall`. The adapter preserves Fiber's elapsed-time, start/stop and manual-frame contracts without suppressing console warnings. Run `node scripts/check-fiber-timer.mjs` to check timing behaviour. Review/remove this version-gated patch when upgrading Fiber to a release that uses Timer natively.

GSAP contexts retain DOM elements rather than mutable React refs, and GoldenHorizon relies on matchMedia reversion for cleanup. This avoids null-target and invalid-scope warnings during route transitions and React development cleanup. A Fast Refresh full reload after editing the shared Arabic JSON is expected development behaviour; HTTP 200 and the `/work` to `/portfolio` 308 redirect are normal.

### Home Instagram section

Home now displays Instagram immediately before the Let's work together CTA; Studio Notes is removed from Home. `InstagramSection.tsx` uses Instagram's native `embed.js` profile widget for the existing `@_yellostack` account. No API token or paid feed subscription is stored. Edit `instagram.heading` and `instagram.body` in CMS Headings & labels. Public visibility and account embedding permissions govern whether Instagram serves the profile. A branded profile link remains when the embed script cannot load. Live content could not be verified in the restricted test browser because requests to Instagram were blocked; verify on the deployed site with Instagram website embeds enabled.

Team's decorative ID card is hidden in CSS before hydration for normal motion, then revealed by its scroll timeline. Reduced-motion users retain the static card.
