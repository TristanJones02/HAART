# Handover — read this first

Written 18 September 2026, for an agent picking this up on a local machine.
Branch: `cc/hopeful-gauss-7jkrl6`. Working tree clean, everything pushed.

**Read this before `docs/session-summary.md`, the README, or anything in
`docs/` dated earlier. Several of those describe a project this no longer is.**

---

## 1. What this project actually is

An **unofficial concept rebuild** of haart.org.au, for a personal/university
project. **HAART has not been contacted and has not endorsed it.**

It started life as a pro bono rebuild *for* the rescue, and most of `docs/` was
written under that assumption — working donations, seven live forms, an
indexable site. That brief was replaced. The current one is in the conversation
that produced this file, and its non-negotiable half is written up in
**`docs/constraints.md`**. Read that second.

The seven hard constraints are enforced by `src/lib/compliance/constraints.test.ts`.
**If that suite goes red, put back what it says is missing. Do not edit the
test.** It caught a real leftover on its first run.

---

## 2. What you can do that I could not

This is the main reason the work is moving to you. My container had **no
outbound network at all** — every host except the npm/PyPI registries was
refused by an egress proxy at CONNECT. That blocked, in rough order of value:

| Blocked for me | What it unlocks |
|---|---|
| `savour-life.com.au` | **Phase 1 endpoint discovery.** The whole adoption feature. Procedure is written out step by step in `docs/savourlife-api.md` §3. |
| Any image host | **Photographs.** See §4 — this is the root cause of the design problem, not a side issue. |
| `sanity.io` | Creating the project, deploying the Studio (`docs/blockers.md` C1, F27). |
| Vercel project creation | A live preview URL that updates on every push. My token 403s; the project has to be created once in the dashboard, then it self-deploys. |

Start with SavourLife. It is the only task that unblocks two others.

---

## 3. Do this first

1. **`curl` SavourLife's `robots.txt`.** If it disallows the embed or
   `/umbraco/api/`, the adoption feature stops there and that is the answer.
   Everything below assumes it does not.
2. **Run the discovery in `docs/savourlife-api.md` §3.** Find HAART's group id,
   save the embed page, grep the Angular bundles for the JSON endpoint.
   Capture all three fixtures — especially `list-empty.json`, because the sync
   aborts on an empty result set and that guard cannot be tested without it.
3. **Then, and only then, write the adapter.** I deliberately did not: a Zod
   schema guessed from the eight field names in the brief would pass its own
   tests, fail against reality, and fail loudly in the one place loud failure
   is useless.
4. **Pull the photographs through.** Once animals have images, the design
   problem in §4 becomes solvable for the first time.

---

## 4. The design has been rejected twice. Read this before touching CSS.

Tristan's words: *"the most boring design I've ever seen"*, then *"there are
shit svg everywhere, broken icons, hero looks plain and AI-ish"*.

He is right, and the diagnosis matters more than the symptoms:

**I designed around the absence of photographs instead of for photographs.**
A rescue site is a photography site. With no images, I invented a woodcut
"plate" illustration system to fill the photo-shaped holes — and that made the
holes the design. Everything else followed from it: a cream-and-red palette
forced to carry pages alone, folio numerals, a red square before every rubric,
dotted-leader spec rows that make each dog read like a parts catalogue entry.
Warm cream, hairline rules, dense columns, one red accent — that is the house
style of generated design, and I walked into it.

Concretely, still in the tree and still wrong:

- `src/components/art/plates/*` — eight drawn animals, four head shapes
  recoloured. A Mastiff × Ridgeback and a Border Collie get the same blob face.
  **Delete the system, do not soften it.** Blocker F32.
- `src/lib/content/types.ts` and `src/components/animals/helpers.ts:144` —
  `"Illustration — a photograph of {name} is coming."` Printed once per animal,
  twenty-one times down a listing page.
- The folio numerals, `Quad` before every rubric, `IndexList` dotted leaders,
  `FolioBar`. `docs/design-direction.md` is the 700-line spec for all of it. It
  is thorough, internally consistent, and describes a look the client rejected.
  **Treat it as a record of what was tried, not as instructions.**

What did land, from Mobbin references (Mobbin is a connector, not in this repo):

- [KOBU Villas](https://mobbin.com/sites/sections/4226456d-e845-483a-ad1b-305a93fe7d36)
  is structurally the adoption grid. No card at all — no border, no fill, no
  shadow. The photo *is* the card, with one caption line under it.
- A proposal page built on that reads much better and is published at
  https://claude.ai/artifact/Nz23FQn2khGPh52ZDrpMeX — **not in the repo**,
  scratchpad only, so screenshot or rebuild it before the session expires if
  you want it. Its one real idea worth keeping: **no photo, no photo-shaped
  hole.** Animals with a photograph get the big grid; animals without become
  rows in a text list. The page improves as photographs arrive instead of
  sitting there apologising.

Tristan's verdict on that proposal: *"still quite 'blank' and basic"* — which
is correct, and which is the photographs again. Do not try to solve it with
typography.

---

## 5. Traps

- **The logomark has a minimum size and it is large.** At 34px it is a dark
  blob with a red squiggle; the animals do not separate until ~72px. Inline
  lockups are logotype-only, and `STACKED` has a 72px floor. This was the
  "broken icons" complaint. See `src/components/layout/Wordmark.tsx`.
- **Do not hand-edit `src/components/layout/logoPaths.ts`.** It is traced
  output. Holes are subpaths of their own shape so `fill-rule="evenodd"` can
  punch them out; splitting them makes the header read "naart". The tracer that
  produced it was scratchpad-only and is gone — the regeneration method is
  documented in the file's header comment.
- **`src/lib/animals/petrescue.ts` is the wrong platform now.** SavourLife is
  the source. Blocker F31. Remove or repoint it once the adapter lands.
- **Mock content gating.** `env.isLiveSite` reads `VERCEL_ENV`, so a preview
  deployment shows the whole site with seed content and no configuration. A
  *production* build with no Sanity and no `ALLOW_MOCK_CONTENT=true` renders
  honest empty states — 12 pages, not 69. That is deliberate, not a bug.
- **The `--text-caption` trap.** It is a canvas *colour* variable. Do not add a
  `@theme` token of the same name; the generated `font-size` utility resolves
  to the colour and every section dies. There is a comment about it in
  `src/styles/tokens.css`.
- **`docs/volunteer-guide.md` and `docs/technical-handover.md`** are marked
  superseded at the top where they describe forms, donations and analytics.
  `docs/session-summary.md` predates the concept-build pivot entirely.

---

## 6. Running it

```bash
pnpm install                                  # pnpm 10.33.0, Node 22
pnpm dev                                      # localhost:3000, mock content
pnpm check                                    # lint + typecheck + 207 tests + build
pnpm vitest run src/lib/compliance            # the seven hard constraints alone

VERCEL_ENV=preview pnpm build && VERCEL_ENV=preview pnpm start   # full site, 69 pages
```

`pnpm import:photos <folder> --csv` bulk-ingests photographs: strips EXIF and
GPS (those are foster carers' home addresses), caps the longest edge, reads
HEIC natively, and writes a manifest with an empty `alt` per row. Only
`--execute` uploads, and only rows a human has described. `src/lib/media/photo.ts`.

---

## 7. What I would do in the first hour

1. `pnpm install && pnpm check` — confirm 207 green before changing anything.
2. `curl` SavourLife's robots.txt. Decide whether this feature is alive.
3. If alive: discovery, fixtures, adapter, sync, in that order.
4. Get thirty photographs into the repo by any legitimate route.
5. *Then* delete the plate system and rebuild the listing photo-first.

Doing 5 before 4 is what I did. It does not work.
