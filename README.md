# Yellostack

Next.js website with GSAP scroll sequences, Three.js scenes, responsive inner pages and a Supabase-backed content studio.

## Run locally

```sh
npm ci
npm run check:cms
npm run build
npm run dev
```

Open http://localhost:3000. The website works with bundled content without CMS credentials.

## CMS and Vercel

Open /admin for the content studio. Follow [CMS deployment instructions](docs/CMS-DEPLOYMENT.md) to create the Supabase tables, storage bucket and editor account, then add the two environment variables to Vercel. See [.env.example](.env.example).

GitHub and Vercel host the website and admin interface; Supabase provides persistent content, uploaded images and authentication. Importing the GitHub repo does not automatically provision Supabase.

Save draft keeps edits private. Publish updates public content without a new deployment. Refresh public pages to see changes.

## Validation status

TypeScript and CMS data-validation checks passed in the editing workspace. Production build, browser visual testing and live Supabase publishing remain unverified because the workspace could not start shell processes or connect to a browser, and no Supabase credentials were supplied.
