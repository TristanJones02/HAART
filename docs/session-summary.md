# Session summary

> **Superseded. Read `docs/HANDOVER.md` instead.** This was written on 17
> September 2026, before the project became an unofficial concept build. It
> describes working donations, seven live forms and an indexable site, none of
> which exist any more, and a design that has since been rejected. Kept as a
> record of what was tried.

Written for someone returning cold. Date: 17 September 2026. Branch: `cc/hopeful-gauss-7jkrl6`.

## Where things stand in one paragraph

The research deliverables (audit, inventory, redirect map, IA, design system) are written under constraint: the build environment could not reach haart.org.au, Facebook, PetRescue, the ACNC or the Wayback Machine, so everything came from search indexes and is tagged by confidence, with a crawl script to fill the gaps from a normal connection. The site itself is built and runs end to end on mock content: Next 16 App Router, a 31-block content-only page builder, Sanity schemas and a Studio, animal listings behind a PetRescue/Sanity/mock adapter, an automated Facebook events pipeline, data-driven forms, a donate widget, stories with series, SEO, JSON-LD, RSS, sitemap. Lighthouse mobile on the production build: performance 94 to 98, accessibility 100, best practices 100, SEO 100, CLS 0. 180 unit tests pass. Nothing is connected to a real credential yet; every integration degrades visibly when its variable is unset.

## What is finished

| Deliverable | Where | State |
|---|---|---|
| 1. Audit with branding analysis | `docs/audit.md` | Done. Findings ranked by impact. Section 7 lists what to measure once the site is reachable. |
| 2. Content inventory, media manifest, redirect map | `docs/content-inventory.json` (75 items, 8 types), `docs/media-manifest.json` (skeleton), `redirects.ts` | Done as far as the index allows. `pnpm crawl` fills verbatim copy, form fields, media dimensions and CSS colours in one run. |
| 3. IA and page inventory | `docs/information-architecture.md` | Done. 25 routes, four conversion paths, cuts justified. |
| 4. Design system | `docs/design-system.md`, `src/styles/tokens.css` | Done. Two token additions after measuring contrast (Charcoal 550, Amber 700). A test guards the pairings. |
| 5. Component and section library | `src/components/ui`, `motion`, `sections` | Done. 31 blocks, no visual controls for editors. |
| 6. Sanity schemas | `studio/schemas`, `studio/sanity.config.ts`, `studio/structure.ts` | Done and typechecked. Singleton settings, verified flags on legal fields, required alt text, sensitive-image flag. |
| 7. Migration script | `scripts/import-content.ts`, `docs/import-preview.ndjson` | Written and dry-run (82 documents prepared). `--execute` imports once credentials exist. Placeholder images are deliberately not uploaded. |
| 8. The build | `src/` | Runs locally with `pnpm dev`; production preview with `ALLOW_MOCK_CONTENT=true pnpm build && pnpm start`. All 36 routes return 200, legacy URLs redirect. |
| 9. Documentation | `docs/volunteer-guide.md`, `docs/technical-handover.md`, `README.md` | Done. Volunteer guide has screenshot placeholders to fill once the Studio is live. |

Also: `docs/decisions.md` (22 decisions with alternatives), `docs/blockers.md` (28 items), `.github/workflows/ci.yml`, `vercel.json` cron, `.env.example`.

## What I decided and why (the ones that matter most)

- **The animal platform is PetRescue, and the site should read from it** (D3). The current site hand-types animals as WordPress pages, triple-entered with PetRescue and Facebook, which is why it is stale. The adapter is built against a best-effort field mapping; Sanity animal documents remain as fallback and enrichment.
- **Facebook Pages have no public iCal feed** (D5). The workable feed is a page admin's personal "upcoming events" export URL, stored as a secret. It is the one operational dependency on a person and is documented for volunteers.
- **Builder pages are static** (D18). The first build served the home page with `no-store`; query parameters are now read client-side so every page is CDN cached.
- **Nothing legal renders unverified** (D17). ABN, ACNC ID and founding year carry a verified flag that a committee member ticks in the Studio; the footer and trust band stay silent until then. DGR wording renders only when the flag is set.
- **Donations: Stripe Payment Links, merch and tickets: Square** (D7), as briefed, with a cover-fees option implemented honestly as a second link pair.

## What is blocked (see `docs/blockers.md` for all 28)

Credentials: Sanity project (C1), PetRescue API token (C2), the Facebook iCal export URL (C3), Stripe and Square links (C5, C6), a Geoapify key (C7), Plausible (C8), Resend (C10).

Facts only HAART can confirm before launch: ABN and ACNC verification (F1, F2), DGR status (F3), bank details (F4), Containers for Change ID (F5), dog fee bands (F6), the HD25-003 collision (F7), three possibly stale animals (F8), which Instagram is official (F11), the vector logo (F12), privacy policy adoption (F13), the surrender process (F14), foster support specifics (F15), whether kennel sponsorship is still offered (F16), the newsletter provider (F18), the reconstructed form fields (F20).

## What changed the plan

1. **No direct access to the old site.** The audit is evidence-based but not measured; the crawl script is the fix and takes minutes to run.
2. **The site has two live generations** (www with an older template, apex with the current one). The redirect map covers both; the crawl should be run against both before the old hosting is cancelled.
3. **Cats are as much of the site as dogs** (15 cat listings, a cat fee policy), so the content model has one `animal` type with a species field rather than a `dog` type.
4. **PetRescue's API is token-gated, not public.** Requested via members@petrescue.org.au as group 10046.
5. **Kennel sponsorship** appears on a legacy page and is odd for a foster-based rescue; it is modelled but marked for confirmation rather than promoted.

## What I would do next, in order

1. Run `pnpm crawl` from a normal connection. Review `docs/content-inventory.json` diffs, the "pages not in the inventory" list, and add any missing redirects.
2. Create the Sanity project, apply for the non-profit plan, set the variables, run `pnpm import:content --execute`, deploy the Studio, and walk the volunteer guide against it (add the screenshots).
3. Get the PetRescue token and check `mapListing` against a real response (F25).
4. Have a page admin generate the Facebook events export URL and run `pnpm sync:events` once by hand (F26).
5. Replace the four sample stories with two real ones. For the photo backlog, use `pnpm import:photos <folder> --csv` (see the volunteer guide): every animal renders a drawn plate until a photograph exists, and the plate disappears the moment one does.
6. Set the Stripe and Square links, then test the donate page's cover-fees toggle with a real link.
7. Re-run Lighthouse with real images. If the home page drops below 95, the levers are: keep the hero photo under 200 KB at 1600px (the pipeline does this), and consider inlining the critical CSS.
8. Committee sign-off on F1 to F16, then tick the Verified boxes in the Studio.

## Things worth knowing that are easy to miss

- `ALLOW_MOCK_CONTENT=true` is what makes a production build show the mock; without it and without Sanity, pages render empty states on purpose.
- The `Reveal` and `Stagger` components render server markup fully visible and only apply the hidden state after mount to elements below the fold; nothing is ever invisible without JavaScript.
- Semantic green and amber are used only by `StatusBadge`. If you find yourself reaching for them elsewhere, the design system says no.
- Form field lists in `src/lib/forms/definitions.ts` are the reconstructed ones; the comment at the top says how to replace them.
- The events sync marks a future Facebook event as cancelled only after it has been missing from two consecutive runs, and a non-calendar response (expired key) is a hard failure that changes nothing.
- `docs/import-preview.ndjson` is regenerated by every dry run; it is committed so the import can be reviewed without running anything.

## Test and check results at handover

- `pnpm lint`: clean. `pnpm typecheck`: clean. `pnpm test`: 224 passing across 16 files. `pnpm build`: succeeds (76 static pages with mock content).
- Lighthouse 13, mobile, simulated throttling, mock content: home 94–95, dogs listing 98, animal profile 98, foster 95, donate 96–98, events 97, story 98; accessibility 100 on every page; CLS 0 everywhere; TBT 30–60 ms.
- Interaction checks by Playwright: `?animal=` prefill works, `?frequency=monthly` preselects, the dog grid filters, the desktop dropdown opens from the keyboard, the mobile menu opens as a dialog, no console errors on any page at either viewport.


## Added after the redesign

**The logo is HAART's own.** Tristan supplied the artwork file; the mark, the
logotype and the heart are traced from it and used in the header, the footer,
the favicon and the sharing card. The typographic "haart" in Nunito 900 that
the design register specified was a stand-in written before the artwork
existed, and the register is amended to say so. Two things to settle: the
artwork's heart is #ea1824 and the system's brand red is #b50806 (F29), and
there is no vector source file, so the curves are traced approximations (F30).

**Photographs can now be bulk-loaded.** `pnpm import:photos <folder>` reads a
folder of phone photos — HEIC included — turns them the right way up, strips
the metadata (GPS especially: those are foster carers' home addresses), caps
them at 2400px, and writes a manifest with an empty alt field per photo. A
volunteer fills the alt column in, and `--execute` uploads only the rows that
have one. See the volunteer guide for the volunteer-facing version and the
technical handover for the mechanics. The site still ships zero photographs:
every animal renders a plate, which is the production path for any animal
nobody has photographed yet.
