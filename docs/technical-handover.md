# Technical handover

> **Superseded in part.** This project is now an unofficial concept rebuild:
> HAART has not been contacted and has not endorsed it. Forms, donations,
> payments and analytics have been removed, and every route is `noindex`.
> Sections below describing those features no longer match the code. See
> `docs/constraints.md`.

For whoever inherits the codebase. Read `docs/session-summary.md` first for state and history, then this for how it works.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, TypeScript, Turbopack) | Static rendering with ISR, image pipeline, route handlers for cron and forms |
| Styling | Tailwind 4 with the design tokens in `src/styles/tokens.css` as `@theme` | Tokens are the only colours available; the default palette is cleared |
| Motion | `motion` (Framer Motion successor), `domAnimation` globally, `domMax` only on the animal grid | Spring physics, reduced-motion aware, small bundle |
| CMS | Sanity 6, Studio deployed separately to `*.sanity.studio` | Free non-profit plan, structured content, page builder without visual controls |
| Listings | PetRescue REST API adapter with Sanity and mock fallbacks | Single point of entry for volunteers; site never depends on one source |
| Events | Facebook iCal export polled by a cron route, upserted into Sanity by UID | Zero manual admin, no scraping |
| Payments | Stripe Payment Links (donations), Square links (merch and tickets) as Sanity fields | Volunteers add links without a deploy |
| Forms | Data-driven definitions, zod validation, Resend email plus a Sanity copy | Nothing lost if email fails |
| Analytics | Plausible, cookieless | No consent banner needed, no personal data |
| Hosting | Vercel (Hobby is fine for a charity) or Cloudflare Pages, with Cloudflare DNS in front | Static pages are CDN cached; the only compute is the cron, forms and revalidation |

## How a request is served

1. Every page-builder route (`/`, `/[slug]`, `/adopt/dogs`, the apply pages) is prerendered and revalidated every 300 seconds. They never read search params on the server; `?animal=`, `?frequency=` and `?sent=` are read in client components after hydration, so pages stay static and CDN cached (`Cache-Control: s-maxage=300, stale-while-revalidate`).
2. `SectionRenderer` walks the page's `sections[]`, renders each block, and alternates the surface (Paper 0, 50, 100) by position. Blocks that render nothing (an empty events strip) do not consume a slot.
3. Content comes through `src/lib/content/*` (pages, settings, articles, partners, products), `src/lib/animals` and `src/lib/events/queries`. Each returns mock data when Sanity is not configured and mock content is allowed (development, or `ALLOW_MOCK_CONTENT=true`), otherwise an empty result. In production without Sanity, pages render honest empty states.
4. Publishing in the Studio calls `/api/revalidate` (a webhook with `SANITY_REVALIDATE_SECRET`) which revalidates by tag so the change appears in seconds.

## Environment variables

See `.env.example`. What each unlocks:

| Variable | Unlocks | Without it |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Real content | Mock content in dev, empty states in prod |
| `SANITY_API_WRITE_TOKEN` | Events sync, form submission copies, the import script | Those write paths report themselves as not configured |
| `SANITY_REVALIDATE_SECRET` | Instant publish via webhook | Changes appear within 5 minutes |
| `PETRESCUE_API_TOKEN` | Live listings from PetRescue | Sanity animal documents, else mock |
| `FACEBOOK_EVENTS_ICAL_URL`, `CRON_SECRET` | Automatic events | Events page shows the Facebook link; `syncStatus` records the reason |
| `MAP_STATIC_API_KEY` | Geocoding and map tiles on event cards | Cards show a neutral header |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Analytics | No script is loaded |
| `RESEND_API_KEY`, `FORMS_TO_EMAIL` | Form delivery by email | Dev logs to console; prod returns a clear 503 |

## Sanity

- Schemas: `studio/schemas`. Documents: `siteSettings` (singleton), `page`, `animal`, `article`, `category`, `series`, `person`, `event`, `product`, `partner`, `submission`, `syncStatus`. Objects: `imageWithAlt` (alt required), `link`, `seo`, `portableText`, `simpleText`, and the `section.*` blocks.
- The Next app never imports the `sanity` package; it uses `@sanity/client` and hand-written types in `src/lib/content/types.ts`. When you add a schema field, add it to the type and to the GROQ projection in `src/lib/content/groq.ts`.
- Deploy the Studio with `pnpm studio:deploy` (needs `studio/.env`). `autoUpdates: true` in `studio/sanity.cli.ts` means Sanity keeps the Studio's dependencies current without a redeploy.
- Webhook: in sanity.io/manage create a webhook to `https://haart.org.au/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>` for create, update and delete, projection `{_type, "slug": slug}`.
- Non-profit plan: apply at sanity.io/docs/non-profit-plan once the project exists.

## Animal listings

`src/lib/animals/index.ts` resolves the first healthy adapter: PetRescue (token set) → Sanity → mock (dev) → empty. A failed adapter is put on a 5-minute cool-down. When PetRescue is primary and Sanity is configured, Sanity animal documents overlay by HAART ID (foster-needed flag, story, medical note) and Sanity-only animals are appended. The PetRescue field mapping in `petrescue.ts` is a best-effort reconstruction (docs unreachable from the build environment); the first run with a real token should check `mapListing` against a real response. The auth header is marked `TODO(tristan)`.

## Events

`GET /api/cron/sync-events` with `Authorization: Bearer $CRON_SECRET` (Vercel sends this automatically for `vercel.json` crons, every six hours). It fetches the iCal URL, parses (`ical.ts`), geocodes new locations once (`geocode.ts`), upserts by `_id = stableId('event', uid)` preserving editor-owned `ticketLink` and `image`, marks future Facebook events missing from two consecutive runs as cancelled, and writes `syncStatus-facebook-events` every time, including on failure. The Studio's Events → Sync status list shows the last outcome. Run locally with `pnpm sync:events --fixture --dry-run`.

The iCal URL is a page admin's personal export from Facebook Events (it lists events they created or responded to). If that person leaves, generate a new URL from another admin's account and update the environment variable. This is the one operational dependency on a person; it is documented in the volunteer guide.

## Forms

Definitions in `src/lib/forms/definitions.ts` are data; the renderer and the API validate from the same definition. `POST /api/forms` accepts JSON (from the client component) or form-encoded (no JavaScript, redirects back with `?sent=1`). Delivery: Resend email and a `submission` document. Rate limit is in-memory per instance (best effort on serverless). Field lists were reconstructed from the audit; replace them with the live forms once `pnpm crawl` has captured them.

## Images

Sanity images go through the Sanity CDN with a custom `next/image` loader (`sanityLoader`) so they are processed once. Remote images (PetRescue, map tiles) go through the Next optimiser via `remotePatterns`. Local SVG placeholders render as plain `img`. Every `ImageWithAlt` requires alt text at the schema level. Distressing images (`sensitive: true`) render blurred behind a reveal control. An animal with no photograph renders a drawn `Plate` rather than a grey box, so a missing photo is never a hole in the page.

**Ingest.** `src/lib/media/photo.ts` is the pipeline for photographs that arrive from volunteers rather than through the Studio: `processPhoto` applies the EXIF orientation, drops *all* metadata, caps the longest edge (2400px by default, never upscaling) and re-encodes as progressive mozjpeg, returning a 24px LQIP alongside. A 12MP phone photo goes from about 5 MB to about 400 KB before Sanity's CDN has done anything. HEIC/HEIF is read natively by libvips, so iPhone files need no conversion step.

`hasGps` reports whether the original carried a GPS IFD. That is not a curiosity: for a foster-based rescue a geotag on a photo of a dog in a lounge room is a carer's home address, and the import counts them so someone knows before a folder of originals is emailed anywhere. The stripping is not conditional — sharp writes no metadata unless asked — but the count is reported either way. `src/lib/media/photo.test.ts` round-trips a real GPS block through the pipeline to prove it comes out the other side with none.

## Performance and accessibility budget

Measured with Lighthouse 13 on the mock-content production build, mobile, simulated throttling: performance 92 to 98, accessibility 100, best practices 100, SEO 100, CLS 0 on every page. JavaScript transfer is about 350 KB per page (React, Next runtime, Motion `domAnimation`, the page's components). Keep it there: add client components only when they need state or the DOM.

## Checks

`pnpm check` runs lint, typecheck, the 224 unit tests and a build. `.github/workflows/ci.yml` runs the same on every push. `src/styles/tokens.test.ts` fails if a token change breaks a documented contrast pairing.

## Scripts

- `pnpm crawl` crawls both old hosts, fills `docs/content-inventory.json` with verbatim copy, form fields and media dimensions, writes `docs/media-manifest.json` and `docs/crawl-css-summary.json`. Run once from a normal connection.
- `pnpm import:content` writes `docs/import-preview.ndjson` (dry run). `--execute` imports into the dataset; `--only=animal,partner` limits types. Idempotent.
- `pnpm sync:events [--fixture] [--dry-run]` runs the events sync from the CLI.
- `pnpm import:photos <folder> [--csv] [--execute] [--max 2400] [--quality 82]` bulk-ingests volunteer photographs. The scan processes everything into `.photo-cache/` (content-keyed, gitignored) and writes `docs/photo-manifest.json` with an empty `alt` on every row; `--csv` writes the same rows as a spreadsheet for a volunteer to fill in. `--execute` uploads only the rows that have alt text and a matched animal, and skips the rest with a count, so a half-filled manifest imports its ready half. The animal comes from a HAART id anywhere in the path (`HD26-044/`, `HD26-044 Rosemary 3.jpg`, `hd26 - 44`); unmatched photos are reported, never guessed at. Re-running is safe twice over: Sanity keys assets on content so the same bytes return the same asset id, and the scan carries forward alt text already written, by path first and then by content hash.

## Deploying

1. Vercel: import the repo, framework Next.js, root `.`. Add the environment variables. Cron picks up `vercel.json`.
2. Cloudflare Pages alternative: use `@opennextjs/cloudflare`; the cron route then needs a Cloudflare Cron Trigger calling the same URL with the bearer secret.
3. DNS: apex `haart.org.au` to the host; `www` redirects to apex (also enforced by `hostRedirects` in `redirects.ts`).
4. After DNS: run `pnpm crawl` against the old site before it is switched off, compare the printed "pages not in the inventory" list with `redirects.ts`, and add anything missing.

## Costs

Vercel Hobby or Cloudflare Pages free; Sanity non-profit plan free; Plausible from about USD 9 a month (the only recurring cost, or self-host); Geoapify free tier; Resend free tier (3,000 emails a month); Stripe and Square take per-transaction fees only. Nothing here can generate a surprise bill except image bandwidth on a viral post, which the CDN cache and the image size caps keep bounded.
