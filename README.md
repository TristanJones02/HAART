# haart.org.au — unofficial concept rebuild

**Not affiliated with or endorsed by HAART. HAART has not been contacted.**

A concept rebuild of the website of HAART (Homeless and Abused Animal Rescue
Team), a foster-based, no-kill animal rescue in Perth, Western Australia. Next.js
App Router, TypeScript, Tailwind 4, Motion, Sanity.

Every page carries an unaffiliated banner, every route is `noindex, nofollow`,
nothing can take a payment and no form captures anything. Those are hard
constraints, not defaults — **`docs/constraints.md`**, enforced by
`src/lib/compliance/constraints.test.ts`.

**Picking this up cold? Read `docs/HANDOVER.md` first.** Documents in `docs/`
dated before 18 September 2026 describe a pro bono rebuild *for* the rescue,
which this no longer is.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000 with mock content (no credentials needed)
pnpm studio       # Sanity Studio on http://localhost:3333 (needs studio/.env)
pnpm check        # lint + typecheck + tests + build
```

A production build without a Sanity project renders honest empty states. To preview the production build with mock content:

```bash
ALLOW_MOCK_CONTENT=true pnpm build && pnpm start
```

## Layout

| Path | What |
|---|---|
| `docs/` | Audit, inventory, IA, design system, decisions, blockers, handover and volunteer guides |
| `src/app/` | Routes. Page-builder pages render through `src/lib/content/pageRoute.tsx` |
| `src/components/sections/` | The 31 content-only page-builder blocks and their renderer |
| `src/components/ui/`, `motion/` | Primitives and the Motion wrappers |
| `src/lib/content/` | Types, GROQ, fetch layer with mock fallback |
| `src/lib/animals/` | PetRescue, Sanity and mock listing adapters behind one interface |
| `src/lib/events/` | Facebook iCal parse, geocode, static map tiles, idempotent upsert |
| `src/lib/forms/` | Data-driven form definitions and validation |
| `src/lib/mock/` | Seed content used until Sanity is connected |
| `studio/` | Sanity Studio (separate workspace package; schemas in `studio/schemas`) |
| `scripts/` | Crawl the old site, import content, sync events from the CLI |
| `redirects.ts` | Old URL to new URL map, imported by `next.config.ts` |

## Environment

Copy `.env.example` to `.env.local`. Every variable is optional; each feature degrades on its own when unset. `docs/technical-handover.md` explains what each one unlocks.

## Conventions

Australian English, sentence case everywhere, no red backgrounds, transform-and-opacity-only animation, every image has alt text. See `docs/design-system.md`.
