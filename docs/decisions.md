# Decisions log

Each entry: what was decided, why, and what was rejected. Reversal cost is noted so the cheap ones can be flipped without ceremony.

## D1. Research from search indexes rather than stopping

**Decision.** With direct access to haart.org.au blocked, the audit and inventory were built from search-engine indexes and third-party republications, with every claim labelled by confidence, plus a crawl script for the user to run later.
**Rejected.** Waiting for access (the brief says not to stall); routing around the egress policy through a reader proxy (explicitly disallowed by the environment's rules and not something to do on a charity's behalf).
**Reversal cost.** None. Running the crawl script overwrites the partial fields.

## D2. One read-only Google Drive search

**Decision.** Searched the connected Drive for files titled "haart" and downloaded one PNG to check whether it was the logo. It was a Pet Fresh poster; it confirmed the brand colours and was used for the branding analysis. No other Drive or Gmail access was made.
**Rejected.** Reading Gmail for HAART correspondence (private, not asked for).
**Reversal cost.** None.

## D3. Animal listings: PetRescue API as the feed, Sanity documents as the fallback and enrichment layer

**Decision.** The "rescue platform" is PetRescue (group 10046). Its REST API is token-authenticated and issued to member groups on request. The site has a typed `AnimalSource` interface with three adapters: `petrescue` (real, untested against a live token), `sanity` (documents of type `animal`), and `mock` (development). Resolution order at request time: PetRescue if a token is set and the call succeeds, else Sanity, else mock in development and an honest empty state in production. Animal documents in Sanity carry the fields PetRescue does not (HAART ID as a validated field, foster-needed flag, story link).
**Why.** The audit found the current site's listings are hand-typed WordPress pages, triple-entered alongside PetRescue and Facebook, and stale. Making PetRescue the single point of entry removes one of the three entries. Keeping a Sanity type means the site still works if PetRescue access is never granted, and gives volunteers a place to list cats or short-term fosters that never go to PetRescue.
**Rejected.** Sanity-only (keeps the double entry that causes staleness); PetRescue-only (no fallback, and PetRescue's data model has no foster-needed flag).
**Reversal cost.** Delete one adapter file.

## D4. Species: dogs and cats, one document type

**Decision.** One `animal` document type with a `species` field, not separate `dog` and `cat` types. Listing pages filter by species. The brief's "dog" type is generalised because the inventory shows fifteen cat listings and a cat fee policy.
**Rejected.** Two types (duplicates every field and every query).
**Reversal cost.** Low; a GROQ filter.

## D5. Facebook events via a page admin's personal iCal export

**Decision.** Facebook Pages expose no public iCal feed. The cron route polls the keyed personal export URL (`/events/ical/upcoming/?uid=…&key=…`) that any Facebook user can generate, stored as a secret. A named page admin responds "Going" to every HAART event so it appears in their export. The parser and upsert are built and tested against a sample `.ics` file. The homepage strip and the events page degrade to nothing (not an empty-state message) when the feed is unset or fails, and the failure is written to Sanity as a `syncStatus` document so it is visible in the Studio.
**Why.** It is the only Facebook-provided calendar feed that does not require Graph API app review, and it does not scrape.
**Rejected.** Graph API `/{page-id}/events` (needs an app, review, and a token that expires); scraping (breaches terms, unmaintainable); manual entry (the brief wants zero admin).
**Risks.** If the admin leaves or the key rotates, events stop. The `syncStatus` document and a dated "last synced" line in the Studio make that visible. Documented in the volunteer guide.
**Reversal cost.** The parser takes any iCal URL, so switching source is one environment variable.

## D6. Static maps from Geoapify by default

**Decision.** Event cards use a static map tile from Geoapify's static map API (free tier, no card required), rendered through Next's image pipeline and cached. Geocoding of the iCal LOCATION string happens once at sync time and is stored on the event document, so tiles are never re-geocoded per render. Provider is a single file so MapTiler or Mapbox are drop-in.
**Rejected.** Google Static Maps (requires billing account); OpenStreetMap tile servers (usage policy forbids this pattern); Mapbox (needs a card on file).
**Reversal cost.** One file.

## D7. Donations via Stripe Payment Links, merchandise and tickets via Square

**Decision.** As briefed. Payment links are Sanity fields. The donate page renders amount presets as links to Stripe Payment Links (one-off and monthly), with a "cover the fees" toggle that swaps to a second link pair where the amount includes the fee (Stripe Payment Links do not natively add a fee-cover option, so the honest implementation is a second link at the grossed-up amount, labelled). If a link is missing, the button renders as a disabled control with the text "Online donations are being set up" and the bank-details block, when present, is shown instead.
**Rejected.** PayPal Giving Fund only (no recurring giving on the Giving Fund path; fine as an additional option and modelled as an optional field); a custom Stripe Checkout integration (needs a server, webhooks and maintenance).
**Reversal cost.** Fields already exist for PayPal; adding a provider is a field and a button.

## D8. No pre-ticked recurring giving, no decline copy, no urgency timers

**Decision.** The donate flow defaults to a neutral choice between one-off and monthly with neither pre-selected on first load; if a visitor arrives on `/donate?frequency=monthly` from a campaign link, that tab is preselected. No exit intent, no guilt copy, no countdowns.
**Why.** The brief forbids dark patterns and the ACNC's fundraising guidance says the same.

## D9. Analytics with Plausible, consent-free configuration, plus an opt-in banner only if a cookie-setting feature is ever added

**Decision.** Plausible in its default cookieless mode, which does not set identifiers, so no consent banner is required under the Privacy Act or the APPs. Conversion events are custom events. Facebook campaign attribution uses `utm_source=facebook&utm_campaign=…` on the links volunteers post, generated by a small "campaign link builder" page in the Studio dashboard so volunteers do not hand-type UTMs.
**Rejected.** Google Analytics (identifiers, consent complexity, data leaving the country); Fathom (equivalent, slightly dearer).
**Reversal cost.** One component.

## D10. Forms handled by the site, not by a forms SaaS

**Decision.** The pre-adoption questionnaires, foster applications, contact and partnership forms are React forms posting to a Next route that validates, rate-limits, and emails the submission to a configurable address via Resend, with a copy stored as a `submission` document in Sanity so nothing is lost if email fails.
**Rejected.** Embedding Google Forms or Typeform (styling, accessibility and consent problems; another account to maintain); keeping WordPress forms (the site is being replaced).
**Reversal cost.** Medium; the form definitions are data so they could be moved.

## D11. Studio deployed to Sanity's hosted studio

**Decision.** `sanity deploy` to a `*.sanity.studio` hostname, from a separate workspace directory in the repo. Nothing from the Studio ships in the Next bundle.

## D12. Redirect map in `next.config.ts` from a generated file

**Decision.** `redirects.ts` exports the map; `next.config.ts` imports it. Both hosts (www and apex) redirect to the canonical apex host at the CDN layer; the path map handles the rest.

## D13. Image pipeline

**Decision.** All CMS images go through Sanity's image CDN with `auto=format`, quality 75 default, `fit=max`, and explicit width sets, requested through `next/image` with a custom loader so nothing is double-processed. Upload size is capped by validation in the schema (warns above 8 MB, but Sanity handles originals so a phone photo is fine). PetRescue images are proxied through `next/image` remote patterns with the same sizes. Hero images are `priority`; everything else lazy.

## D14. Animation

**Decision.** Motion (`motion` package) with a `useReducedMotion` gate. One `Reveal` component and one `Stagger` wrapper handle entrances (opacity plus 12px translateY, spring, `once: true`). Cards and buttons use `whileHover` and `whileTap` on transform only. Filter changes on the animal grid use `layout` animations. No GSAP; no hero warranted it.

## D15. Sentence case, Australian English

As briefed. A lint rule is not practical for prose; the volunteer guide covers it and Sanity field descriptions repeat it.

## D16. Contrast fixes to the token set

Two additions: Charcoal 550 `#6b6b6b` for small muted text on tints; Amber 700 `#8a5a06` for pending badge labels. Amber 600 fails as text (3.75:1 on white). See `docs/design-system.md`.

## D17. Content that could not be captured verbatim is marked, never invented

Inventory items carry `verbatimStatus` of `complete`, `fragment` or `missing`. Rewrites live in `proposedRewrite` beside `verbatimBody`. Legal and financial strings are copied only when verified and otherwise left empty with a blocker reference.

## D18. Builder pages are static; query parameters are read on the client

**Decision.** No page-builder route reads `searchParams` on the server. `?animal=` prefill, `?frequency=` on donate and `?sent=1` after a no-JavaScript form post are read after hydration (`useSyncExternalStore` or a DOM-only effect). Every builder page is therefore prerendered with a 300-second revalidate and served with `s-maxage=300, stale-while-revalidate`.
**Why.** The first build had the home page as a dynamic route with `Cache-Control: no-store`: every visit was a function invocation and the back-forward cache failed. For a charity, CDN-cached static pages are the difference between near-zero hosting cost and a bill.
**Rejected.** Suspense around `useSearchParams` (emits the fallback into static HTML, so no-JS users lose the form).

## D19. Motion features split

**Decision.** `LazyMotion` loads `domAnimation` globally; the animal grid nests a second `LazyMotion` with `domMax` because layout animations need it. Total blocking time on the home page dropped from 210 ms to 30 ms.

## D20. Import script does not upload placeholder images

**Decision.** `scripts/import-content.ts` writes animals and articles without photos so the Studio's required-photo validation flags every record still needing a real image. Real media upload is wired behind `--upload-media` for after the crawl has captured the old site's images.

## D21. Unknown animal status imports as "on hold"

**Decision.** The three animals whose current status could not be determined (blocker F8) import as "on hold" so they do not show as available; they are listed in the blockers for confirmation. The Studio deliberately has no "unknown" status.

## D22. Events sync tolerates an empty calendar but not a non-calendar response

**Decision.** An empty but valid iCal is treated as "no upcoming events" (after two missed runs, future Facebook events are marked cancelled). A non-calendar response, such as a login page when the export key has expired, is a hard failure that changes nothing and is recorded in `syncStatus`. This protects the events page from a rotated key wiping it.
