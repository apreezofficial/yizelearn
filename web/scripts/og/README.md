# Social previews

- `public/og/home.png` is the custom homepage artwork. Its editable SVG source is `scripts/og/home.svg`.
- Other images are real 1200 × 630 browser snapshots, optimized as JPEGs. The route-to-image map is `src/lib/og-snapshots.json`.
- Captures use the production site in a signed-out browser. Dismiss the cookie notice, wait for the actual page heading/content (course pages show an initial skeleton), then capture the top viewport. Dashboard captures contain only the existing public demo data; never replace them with real account screenshots.
- When changing a page layout or adding a course/guide, recapture its preview, save it in `public/og/`, and update the map. An unlisted course or guide uses the corresponding catalogue snapshot until its own capture is added.
- Re-render the homepage source from `web/` with `node -e "require('sharp')('scripts/og/home.svg').png().toFile('public/og/home.png')"`.
- `SITE_URL` sets the canonical public origin. On Vercel it defaults to `VERCEL_PROJECT_PRODUCTION_URL`; outside Vercel it falls back to `https://yizelearn.com`.
- Run `npm run build`, serve it with `npm run start -- --port 3002`, then `npm run check:metadata`. Set `METADATA_TEST_URL` to test another server.

Private/demo routes have `noindex`. Sitemap entries include the public pages, course catalogue and guide articles; account and certificate demo pages are excluded.
