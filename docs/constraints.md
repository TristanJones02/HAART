# Hard constraints

**This is an unofficial concept rebuild. HAART has not been contacted and has
not endorsed it.**

The pages carry a real charity's name, their animals, their words and their
registration details. Everything below is what keeps that from becoming
impersonation, an interception of their adopters, or a way to take a stranger's
money. These are properties the codebase has to keep, not a cleanup that
happened once.

`src/lib/compliance/constraints.test.ts` asserts every one of them. It runs in
`pnpm test` and in CI. If you are reading this because that suite went red,
the fix is to put back what the test says is missing — not to change the test.

---

## The seven

| # | Constraint | How it is held | Where |
|---|---|---|---|
| 1 | No impersonation | `UnofficialBanner` renders on every page with no environment check, stuck to the top of the viewport with the header so it cannot scroll away | `src/components/layout/UnofficialBanner.tsx`, `src/app/layout.tsx` |
| 2 | `noindex, nofollow` everywhere | `robots.txt` disallows `/` for all agents unconditionally; the root layout and `buildMetadata` both emit `noindex, nofollow, nocache`; the sitemap is empty | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`, `src/lib/seo/metadata.ts` |
| 3 | No money | No payment SDK, no checkout hostname, no card field. The donate UI exists and its controls work; its submit button is permanently disabled and says why | `src/components/donate/DonateWidget.tsx`, `src/components/sections/ProductGrid.tsx` |
| 4 | No enquiry capture | No form posts anywhere. An animal's call to action is an outbound link to the platform that handles its adoption, or, when there is no such link yet, no button at all | `src/app/adopt/[species]/[slug]/page.tsx` |
| 5 | No personal data | Every form, the form renderer, the definitions and `/api/forms` are deleted. No newsletter. No analytics script; `track()` is an empty function | deleted; `src/lib/analytics.ts` |
| 6 | Low request volume | One sync per day, identifiable User-Agent, fixtures in dev and test | `docs/savourlife-api.md` §3, and the sync job when it exists |
| 7 | No secrets | `.env.example` carries placeholders only; the test rejects anything token-shaped | `.env.example` |

---

## What was removed, and why it is not coming back by accident

The earlier briefs for this project asked for a working charity website: live
Stripe and Square links, seven working forms delivering by email and into
Sanity, Plausible analytics, an indexable site with a sitemap. All of that was
built, and all of it has been removed. The constraint tests exist because the
code to do those things is a `git revert` away and most of it looked perfectly
reasonable in isolation.

Specifically deleted:

- `src/app/api/forms/route.ts` — accepted submissions, emailed them via Resend, wrote them into Sanity
- `src/lib/forms/**` — seven form definitions with validation schemas
- `src/components/forms/**` — the renderer
- `src/app/adopt/apply/[species]`, `src/app/foster/apply/[species]`, `src/app/partners/apply` — the questionnaire routes
- `src/app/donate/thank-you` and `DonationCompleted` — a payment-provider return URL and its conversion event
- `src/components/layout/Analytics.tsx` — the Plausible script
- `section.formEmbed` and `section.newsletter` — page-builder blocks, in the app and in the Studio
- the `submission` Sanity document type

Kept deliberately: the `ConversionEvent` union and every `track()` call site,
because they record which moments matter and restoring measurement is one
function body; the `squareLink` and payment-link fields on content types,
because nothing reads them into an href and the test proves it.

---

## The bit a test cannot check

Constraint 1 also says: do not use a domain that implies officialdom. No test
can see the domain. Whoever deploys this owns that one.

A published preview of this project existed earlier without the banner, and was
deleted. If you publish a preview, it carries the banner or it does not go up.
