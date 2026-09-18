# Design direction: **The register**

Final direction for the haart.org.au rebuild. This document supersedes sections 1–7 of `docs/design-system.md` where they conflict. It is the result of a five-way design panel; the winning direction is *Register*, with grafts from *Roll call*, *Ember*, *Cut paper* and *On the lead* named inline where they apply.

---

## 1. The concept

Every animal HAART takes in already has a number. HD26-030 is Beau. HC25-011 is a cat that came in last year. The rescue already keeps a register — in a spreadsheet, in a phone, in somebody's head — and the website should simply *be* that register, published. So the site is built as a rescue journal: a masthead at cover scale, a folio bar across the top of every section with a red rule and a running label, catalogue numbers set in the corner of every frame, facts laid out as a proper index with dotted leaders, and every dog and cat given a plate — a flat two-colour printed illustration in the style of a woodcut, cropped hard by its frame, with an honest caption underneath saying a photograph is coming. Under the masthead on the home page is the roll call: every animal currently on the register, their real names set at poster size, the ones who need a foster carer in red. Nothing here is a designer's invention imposed on the organisation — the numbers, the names, the counts and the "ask us" gaps in a half-filled record are what HAART already has, set properly for the first time. It is warm because it is warm-toned and hand-drawn, and it is serious because it is ruled, numbered and square-cornered. It does not look like a template, and the day volunteers start sending phone photos, the photo drops into the same frame, under the same caption, beside the same number, and nothing else on the page moves.

**What this fixes from the rejected build, point by point:**

| Rejected build | The register |
|---|---|
| Rounded white cards with drop shadows | Square corners, 1px hairlines, no shadows anywhere |
| Three near-identical greys alternating by position | Four named canvases assigned by block *type* — paper, cream, sand, ink |
| 48px largest type | 104px masthead, 80px roll-call names, 80px stat figures |
| Grey paw-print box where photos should be | Eight hand-drawn plates × four colourways = 32 distinct printed illustrations |
| Nothing said "rescue" | Twenty of HAART's own animals' names, at poster scale, on the home page |

---

## 2. Palette

### 2.1 Tokens

Existing tokens keep their hex values. Nine tokens are added. `paper-100` survives as an input fill and a plate ground but stops being a section canvas. `--radius-pill`, `--shadow-card` and `--shadow-card-hover` are retired.

| Token | Hex | Role | Status |
|---|---|---|---|
| `--color-red-600` | `#b50806` | The brand. Masthead rules, folio-bar rules, primary button fill, selected control fill, red display type and stat figures on light canvases, foster-needed status bar and word, the printer's quad in rubrics and buttons, the heart in the logomark, folio numeral outlines, Ember plate ink, Signal plate ground. **Decorative only on ink** (2.33:1). | existing |
| `--color-red-700` | `#8f0605` | Hover and press on red fills; red text on red-50; Signal plate tint. | existing |
| `--color-red-200` | `#f6a8a2` | **NEW.** The only red permitted to carry text or meaning on ink. Rubrics, foster-needed flags, folio numeral outlines, footer column headings and the Perth skyline on dark bands. Banned on light canvases (1.90:1 on white). | new |
| `--color-red-100` | `#f9dcda` | Ember plate tint; hairline on red grounds; urgent badge border on light. | existing |
| `--color-red-50` | `#fdf0ef` | Ember plate ground; cream ink on the Signal plate; selected filter chip. No longer a section canvas. | existing |
| `--color-ink-950` | `#241f1d` | **NEW.** The dark canvas. `charcoal-900` as a full-bleed field reads as a grey box — that is exactly what the rejected hero did. A deep warm printed black reads as ink on paper. Used for statBand, cta, storyFeature, quote, newsletter, fosterNeededStrip, the foster page header, the footer, and the Night plate ground. | new |
| `--color-charcoal-900` | `#3d3d3d` | Headings, mastheads and body copy on light canvases; 2px structural rules; card hairlines. | existing |
| `--color-charcoal-700` | `#575757` | Decks, standfirsts, secondary copy and index labels on sand and sand-200. Mandatory there — `charcoal-550` fails on sand. | existing |
| `--color-charcoal-550` | `#6b6b6b` | Index labels and metadata on paper-0, paper-50 and paper-100 **only**. | existing |
| `--color-charcoal-500` | `#767676` | Large muted text on paper-0 only. Effectively retired. | existing |
| `--color-charcoal-300` | `#b3b0ae` | 1px hairlines, dotted leaders and column dividers on paper canvases. Decorative only. | existing |
| `--color-sand-100` | `#f3e3cf` | **NEW.** The sand canvas — listings, indexes, fee tables, price cards, quotes, species tiles. Also the cream type colour on ink, the Sand plate ground, and the focus ring on ink. | new |
| `--color-sand-200` | `#e7d3b6` | **NEW.** Hairlines, dotted leaders and control borders on sand (1.15:1 — decorative only); the catalogue-number pad; the Sand plate tint. | new |
| `--color-sand-300` | `#d9c3a0` | **NEW.** Second-level muted text and column headings on ink (9.52:1); the "Adopted" band fill over a plate. | new |
| `--color-terracotta-600` | `#8f3a22` | **NEW.** The caption voice — plate captions, catalogue numbers, "Ask us" values, rubrics on light canvases. It gives the marginalia a second ink so red is not doing every decorative job, which is exactly what flattened the partner poster. **Never on ink** (2.17:1). | new |
| `--color-stone-400` | `#a49a92` | **NEW.** Captions, legal, ABN and copyright on ink (5.91:1). The terracotta substitute on dark. | new |
| `--color-paper-0` | `#ffffff` | The reading canvas: richText, stepList, faq, forms, article bodies, animal write-ups, the donate widget. | existing |
| `--color-paper-50` | `#faf8f6` | The cream canvas: events, partner index, contact details, trust band. The quiet gear. | existing |
| `--color-paper-100` | `#f4f0ec` | Ink plate ground; input fills. No longer a section canvas. | existing |
| `--color-border` | `#e5e0dd` | Input and textarea borders only. | existing |
| `--color-green-600` | `#2e7d4f` | Adopted: badge fill under white text, and the 3px rule under the "Adopted" band. **Fails as text on sand** (4.01:1). | existing |
| `--color-green-700` | `#23603d` | Adopted label text on sand and paper. | existing |
| `--color-green-300` | `#6fc48c` | **NEW.** Adopted status on ink only — outline chip text and border (7.72:1). | new |
| `--color-amber-600` | `#b57708` | Pending / on hold: the 4px card bar on **paper canvases only**. Measures 2.98:1 on sand, which fails the 3:1 non-text threshold, so on sand the bar is amber-700. Never text. | existing |
| `--color-amber-700` | `#8a5a06` | Pending / on hold label text, and the status bar on sand. | existing |
| `--color-amber-300` | `#e8b45c` | **NEW.** Pending / on hold on ink only — outline chip text and border (8.62:1). | new |

### 2.2 Verified contrast (WCAG 2.2 AA — 4.5:1 normal text, 3:1 large text and non-text)

All figures computed, not estimated. Every row below goes into `src/styles/tokens.test.ts` as an assertion.

**Passing pairs in use**

| Foreground | Background | Ratio |
|---|---|---|
| charcoal-900 | paper-0 / paper-50 / paper-100 | 10.86 / 10.25 / 9.58 |
| charcoal-900 | sand-100 / sand-200 | 8.64 / 7.44 |
| charcoal-900 | red-50 / red-100 | 9.77 / 8.42 |
| charcoal-700 | paper-0 / paper-50 | 7.23 / 6.82 |
| charcoal-700 | sand-100 / sand-200 | 5.75 / 4.95 |
| charcoal-550 | paper-0 / paper-50 / paper-100 | 5.33 / 5.03 / 4.70 |
| red-600 | paper-0 / paper-50 / paper-100 | 7.00 / 6.60 / 6.17 |
| red-600 | sand-100 / sand-200 | 5.56 / 4.79 |
| red-700 | red-50 / red-100 | 8.60 / 7.41 |
| white | red-600 / red-700 | 7.00 / 9.56 |
| **red-50 (cream)** | **red-600** | **6.29** — the Signal plate's ink. *(Corrected: the panel's 7.00 was white on red, not cream on red.)* |
| terracotta-600 | paper-0 / paper-50 / paper-100 | 7.51 / 7.09 / 6.62 |
| terracotta-600 | sand-100 / sand-200 / red-50 | 5.97 / 5.15 / 6.75 |
| white | ink-950 | 16.29 |
| sand-100 | ink-950 | 12.96 |
| sand-200 | ink-950 | 11.17 |
| sand-300 | ink-950 | 9.52 |
| red-200 | ink-950 | 8.57 |
| stone-400 | ink-950 | 5.91 |
| green-300 | ink-950 | 7.72 |
| amber-300 | ink-950 | 8.62 |
| green-700 | sand-100 / paper-0 | 5.94 / 7.47 |
| white | green-600 | 5.05 |
| amber-700 | sand-100 / paper-0 / paper-100 | 4.71 / 5.92 / 5.22 |
| sand-100 (focus ring) | ink-950 | 12.96 |

**Failing pairs — written into the test file as `expect(...).toBeLessThan(4.5)` so the build breaks if anyone uses them**

| Pair | Ratio | Rule |
|---|---|---|
| charcoal-550 on sand-100 | **4.24** | Banned. `charcoal-700` is the muted colour on sand, enforced by `--text-muted` on the canvas class, not by a rule in a document. (*Graft: Cut paper.*) |
| green-600 on sand-100 | **4.01** | Banned as text. `green-700` for the adopted word on sand; green-600 stays a fill. |
| red-600 on ink-950 | **2.33** | Banned as text, as an icon and as a focus ring on ink. `red-200` does that job. |
| terracotta-600 on ink-950 | **2.17** | Banned. `stone-400` is the caption voice on ink. (*Graft: judge 1's "terracotta never on ink".*) |
| red-200 on paper-0 | **1.90** | Banned on every light canvas. |
| amber-600 on sand-100 | **2.98** | Fails the 3:1 non-text threshold. On sand the pending bar is amber-700 (4.71). |
| charcoal-500 on sand-100 | **3.61** | Large text only; in practice unused. |
| charcoal-300 on paper-0 / sand-100 | 2.16 / 1.71 | Hairlines and leaders only; never text, never the sole carrier of state. |
| sand-200 on sand-100 | 1.15 | Hairlines and leaders on sand only. |

**Two structural consequences**

1. **The focus ring must change on dark.** The current `--shadow-focus` is red-based and measures 2.33:1 on ink-950 — invisible the moment the first ink band ships. This is a live bug, not a preference. On ink canvases the ring becomes **3px `sand-100` with a 2px `ink-950` offset** (12.96:1). Set by the canvas class as `--focus-ring`, so no component branches. (*Graft: Ember, named by all three judges.*)
2. **A red button on an ink canvas** gets a 1px `sand-100` hairline, because red-600 against ink-950 is 2.33:1 and the control's boundary would otherwise be undetectable. White-on-red inside the button is unaffected (7.00:1).

---

## 3. Typography

Two families, unchanged: **Nunito** 700/800/900 display, **Source Sans 3** 400/600/700 body, both self-hosted with size-adjusted fallbacks and `display: optional`. The editorial character comes from structure — rules, rubrics, leaders, numerals — not from adding a serif. Nunito at 900 with hard negative tracking at cover scale stops being friendly and becomes a poster face; Source Sans 3's italic carries every caption, deck and attribution.

### 3.1 Scale

All `clamp()`-based with fixed line-heights so CLS stays at zero.

| Token | Spec | Used for |
|---|---|---|
| `--text-masthead` | Nunito 900, `clamp(3rem, 7.2vw, 6.5rem)`, lh 0.88, ls −0.035em | Once per page, at the top: home hero, page headers, the animal's name, "Give to the animals" |
| `--text-masthead-2` | Nunito 900, `clamp(2.5rem, 5.4vw, 4.5rem)`, lh 0.92, ls −0.03em | The step-down for long headings (see 3.3) |
| `--text-masthead-3` | Nunito 900, `clamp(2rem, 4vw, 3.25rem)`, lh 0.96, ls −0.025em | The second step-down |
| `--text-section` | Nunito 800, `clamp(2rem, 4.2vw, 3.25rem)`, lh 0.95, ls −0.02em | Section headings |
| `--text-feature` | Nunito 800, `clamp(1.5rem, 2.6vw, 2.125rem)`, lh 1.05, ls −0.02em | Story titles, FAQ questions, action-tile titles |
| `--text-rollcall` | Nunito 900, `clamp(1.75rem, 4.4vw, 3.25rem)`, lh 1.12, ls −0.03em | Roll-call names only |
| `--text-cardname` | Nunito 800, `1.5rem`, lh 1.0, ls −0.02em | Animal and event card names |
| `--text-figure` | Nunito 900, `clamp(3rem, 7vw, 5rem)`, lh 0.85, ls −0.03em, `tabular-nums` | Stat figures, fee amounts, event day numerals |
| `--text-folio` | Nunito 900, `clamp(2.75rem, 6vw, 4.5rem)`, lh 0.8, ls −0.04em | Outline folio numerals (decorative) |
| `--text-deck` | Source Sans 3 400 **italic**, `clamp(1.125rem, 2.4vw, 1.375rem)`, lh 1.4, max 34ch | Decks and standfirsts |
| `--text-body` | Source Sans 3 400, `1.0625rem`, lh 1.62, measure 62ch | Body copy, at full `charcoal-900` strength. The rejected build set body in charcoal-700, which is why it read washed out. |
| `--text-lede` | Source Sans 3 400, `1.1875rem`, lh 1.6 | The first paragraph of an animal write-up or article — the replacement for the dropped drop cap |
| `--text-small` | Source Sans 3 400, `0.9375rem`, lh 1.5 | Metadata |
| `--text-rubric` | Source Sans 3 700, `0.75rem`, uppercase, ls 0.16em | Folio-bar labels, column headings. Always preceded by a 9px red quad. |
| `--text-caption` | Source Sans 3 600 **italic**, `0.8125rem`, lh 1.4 | Plate captions, always preceded by a 12×2px red rule |
| `--text-catalogue` | Source Sans 3 600, `0.6875rem`, ls 0.12em | HAART IDs and plate numbers |
| `--text-index-label` | Source Sans 3 600, `0.6875rem`, uppercase, ls 0.14em | Index rows |
| `--text-index-value` | Source Sans 3 600, `1.0625rem` | Index rows |

Sentence case everywhere. The only uppercase styles are `--text-rubric` and `--text-index-label`, both tracked. Australian English.

### 3.2 Expressive treatments — the complete list

1. **The folio bar.** A 48×4px red rule, the rubric, a flex-1 hairline, and an outline folio numeral hanging off the right end. It opens every section and carries most of the editorial character on its own. See §4.4.
2. **Outline numerals.** `color: transparent; -webkit-text-stroke: 2px var(--rule)` inside `@supports (-webkit-text-stroke: 1px red)`, with a solid `red-100` (light) / `red-200` at 35% (ink) fallback outside it, so an unsupported browser gets faint solid numerals rather than invisible text. Always `aria-hidden`; always generated from block index or list order, never from content.
3. **Dotted leaders.** A flex row: label, a `flex-1` span with `border-bottom: 1px dotted var(--hairline)` offset 0.55em, then the value. No background images, no monospace dot runs. Missing values render **"Ask us"** in the caption colour rather than collapsing the row — a half-filled record still produces a full, deliberate-looking index.
4. **The rule-link.** The secondary call to action site-wide, replacing the bordered secondary button: Nunito 800 1.125rem in the strong text colour, with a 3px red underline drawn by a pseudo-element that runs `scaleX(0.35) → scaleX(1)` from the left on hover and focus-visible.
5. **The lede paragraph.** The first paragraph of an animal write-up or article body sets at `--text-lede` with a 4px red-600 left rule at 20px offset. *This replaces Register's drop cap, which is dropped entirely — it is the one device that tips the journal conceit into twee and the most fragile thing in the direction against volunteer prose. A 180-character guard does not save a first paragraph that is one line of admin.*
6. **The pull quote.** On animal profiles and articles: the `summary` field (one sentence by definition — never a sentence parsed out of prose), Nunito 800 at `clamp(1.5rem, 3.2vw, 2.5rem)`, with a 96×3px red rule above it and the attribution below in rubric style.
7. **The printer's quad.** A 9×9px red-600 square. It opens every rubric and prefixes the primary button's label. One mark, used everywhere, replacing the current circle. *(It originally also sat after the wordmark; the wordmark is now HAART's own artwork, which needs no ornament beside it.)*

**Explicitly not used:** no drop cap, no last-word or last-two-words colouring (positional word-colouring lands well once and badly often; a volunteer heading ending in "and more" looks broken), no rotation, no mixed sizes inside one heading, no italic headings, no all-caps headings, no script face, no text over a photograph anywhere except the story card's gradient (see §6.7).

### 3.3 Volunteer-proofing the type

Applied at render, deterministic, SSR-safe. *(Graft: Roll call's graduated guard, which is finer than Register's single 60-character check.)*

```
headingStep(text) →  ≤36 chars: step 0   |  37–72: step 1   |  >72: step 2
```

- **Masthead:** step 0/1/2 → `--text-masthead` / `-2` / `-3`.
- **Section head:** step 1 drops to `--text-feature`; step 2 adds `text-wrap: balance`.
- **Card names:** names over 12 characters drop from `--text-cardname` to 1.25rem; over 20 characters the card name also takes `overflow-wrap: anywhere`.
- Every masthead carries `overflow-wrap: anywhere; hyphens: auto`.
- Nothing truncates a heading. Long copy wraps; it never gets cut.

---

## 4. The graphic system

Everything is hand-written SVG, inline, server-rendered, `currentColor` or CSS-variable driven. Zero network requests for art, zero raster assets, zero CLS. All files live under `/home/user/HAART/src/components/art/`. The only files in `/home/user/HAART/public/art/` are the favicon and the OG mark, which must be real files.

`/home/user/HAART/public/placeholders/` (twelve paw-print SVGs) is **deleted**, along with `SmartImage`'s grey-box fallback branch and the mock animals' placeholder photo arrays.

### 4.1 The plates — `src/components/art/plates/`

Eight drawings, each a flat two-and-a-half-colour woodcut on `viewBox="0 0 400 300"`. A `<rect width=400 height=300>` in `var(--plate-ground)`, the animal mass in `var(--plate-ink)`, and ear interiors, highlights and noses in `var(--plate-tint)`. No gradients, no filters, no masks, no strokes under 2 units. **Every plate is cropped by its frame** — the animal runs off the bottom edge and usually off one side. That crop is the magazine doing the work a photograph would otherwise do, and it is why a flat silhouette cannot be "slightly wrong" the way a stroked figure can.

**The safe box (this is the fix for the portrait-crop bug).** A 3/4 portrait frame slices roughly 44% off each side of a 400-wide drawing. So: **every plate's primary mass must sit inside x ∈ [90, 310]**, the central 220 units. Anything outside — a tail, a second animal, a far ear — is drawn inside `<g data-crop="wide">`, and each plate that needs one supplies a portrait-only replacement inside `<g data-crop="tall">`. `PlateFrame` sets `data-ratio="wide|tall"` on the wrapper and two lines of CSS switch the groups. Each plate also declares a crop anchor (`xMidYMid` default, `xMinYMid` or `xMaxYMid` where the subject is off-centre) used in `preserveAspectRatio`.

**The figure rulebook** — written into the plate spec as a constraint, not left to taste. *(Graft: On the lead, named by judge 3.)*

- No smiling mouths. A mouth is a 3-unit line or it is absent.
- Eyes are punched dots or almonds in the ground colour, never expressive shapes, never highlights-on-highlights.
- No whiskers on dogs. Cats get three per side at 2.5 units, 50% opacity, or none.
- No hearts, no paw prints, no collars with tags, no bandanas, no props.
- At most one accent element per plate beyond ink and tint.
- Animals are oriented **into** the content, not out at the viewer.
- No plate is drawn cute. Puppies and kittens are drawn at true proportion, not with enlarged eyes.

**The eight drawings**

| Name | File | Geometry | Crop anchor |
|---|---|---|---|
| `dog-head-broad` | `plates/DogHeadBroad.tsx` | Three-quarter broad skull (staffy/mastiff). Head `<ellipse cx=200 cy=200 rx=120 ry=115>` bleeding past y=300; muzzle `<ellipse cx=200 cy=255 rx=64 ry=52>`; left ear `M96 118C40 96 20 158 46 216c16 34 50 22 58-20Z`, right mirrored; eyes `<circle r=11>` at (160,186) and (240,186) in ground; nose `M200 236c18 0 26 10 26 18 0 10-12 16-26 16s-26-6-26-16c0-8 8-18 26-18Z` in ground; muzzle line + mouth `M200 270v14M178 288q22 16 44 0` stroke ground 3; cheek highlight `M110 150C96 200 106 252 140 288` stroke tint 14 round. | xMidYMid |
| `dog-head-fine` | `plates/DogHeadFine.tsx` | Narrow skull, pricked ears (kelpie/collie). Skull `M200 108C158 108 138 146 138 192C138 248 166 300 200 300C234 300 262 248 262 192C262 146 242 108 200 108Z`; ears as two closed triangles `M152 104 L128 30 L196 86 Z` and mirror about x=200; muzzle `<ellipse cx=200 cy=252 rx=40 ry=34>`; eyes `<circle r=9>` at (174,186), (226,186); nose as the broad plate's path scaled 0.8; brow highlight `M154 140C144 176 148 214 168 244` stroke tint 11. | xMidYMid |
| `dog-sit` | `plates/DogSit.tsx` | Seated full body. Haunch `<ellipse cx=248 cy=252 rx=76 ry=62>` (in `data-crop="wide"`); chest `<ellipse cx=186 cy=240 rx=58 ry=70>`; two front legs as 26-unit round-cap strokes from (168,230) and (214,236) to y=300; head `<circle cx=196 cy=126 r=72>`; two drop ears `M132 96C96 88 84 142 108 172c14 18 34 6 36-22Z` and mirror; tail arc `M318 246C352 232 356 196 336 176` stroke ink 20 round (in `data-crop="wide"`); `data-crop="tall"` supplies a shortened haunch `<ellipse cx=236 cy=254 rx=58 ry=58>` and no tail. | xMidYMid |
| `dog-pair` | `plates/DogPair.tsx` | `dog-head-broad` at scale 1 translated x −40, plus `dog-sit` at scale 0.55 translated (250, 96) drawn entirely in `--plate-tint` so the pair reads as depth. The small figure is `data-crop="wide"`; `data-crop="tall"` places it at (196, 150) at scale 0.42 instead. | xMinYMid |
| `cat-loaf` | `plates/CatLoaf.tsx` | Folded sitting cat. Body `M110 300c0-92 42-132 100-132s100 40 100 132Z`; head `<circle cx=170 cy=158 r=58>`; ears `M122 126 116 70l52 38Z` and `M218 126 226 74l-50 32Z`, inner ears the same paths scaled 0.55 about their centroids in tint; eyes `<ellipse rx=9 ry=7>` at (150,154) and (192,154) in ground, each with a 3-unit ink pupil; nose `M171 172l9 8-9 8-9-8Z` in tint; whiskers `M142 184 88 176M142 191 86 196M142 198 92 214` stroke ground 2.5 opacity .5; chest highlight `M180 218c-18 30-20 58-8 82` stroke tint 12. **Tail** `M330 288c42 0 50-54 22-74` stroke ink 22 round sits in `data-crop="wide"`; `data-crop="tall"` draws the tail curling forward across the body base instead: `M250 296c-40 8-64-18-58-46` stroke ink 20. *(This is the exact bug judge 3 caught: the tail is the silhouette read, and a 3/4 crop would have removed it.)* | xMidYMid |
| `cat-head` | `plates/CatHead.tsx` | Rounded pentagon head filling the frame: `M200 96C128 96 92 152 92 204c0 62 48 96 108 96s108-34 108-96c0-52-36-108-108-108Z`; triangular ears `M104 156 96 76 160 118Z` and mirror, inner ears in tint; almond eyes `M156 196C166 184 186 184 196 196C186 208 166 208 156 196Z` and mirror about x=200 in ground with 4-unit ink pupils; nose triangle in tint; three whiskers per side. | xMidYMid |
| `cat-sit` | `plates/CatSit.tsx` | Upright seated cat, tall teardrop body `M200 300C150 300 140 232 152 188C164 146 182 128 200 128C218 128 236 146 248 188C260 232 250 300 200 300Z`; head `<circle cx=200 cy=118 r=52>`; ears as `cat-head`'s scaled 0.85; front legs as two 18-unit strokes to y=300; tail curling forward across the base `M256 292C300 288 312 250 296 228` stroke ink 18 (`data-crop="wide"`; `tall` shortens it to `M248 294C272 288 280 266 272 252`). | xMidYMid |
| `cat-pair` | `plates/CatPair.tsx` | `cat-loaf` plus a second loaf at 0.55 scale overlapping by 30 units at (268, 132) in `--plate-tint`. Small figure `data-crop="wide"`; `tall` moves it to (232, 176) at 0.45. | xMidYMid |

Each drawing is about 1.1 KB; eight inline gzip to roughly 2 KB, which is *smaller* than the twelve placeholder files being deleted.

**Colourways** — a class on the frame setting three custom properties, plus `--plate-on`, a verified ≥4.5:1 colour for the rare case where type must sit on a plate.

| Colourway | ground | ink | tint | `--plate-on` |
|---|---|---|---|---|
| `ember` | `#fdf0ef` | `#b50806` | `#f9dcda` | `#3d3d3d` |
| `ink` | `#f4f0ec` | `#3d3d3d` | `#b3b0ae` | `#3d3d3d` |
| `sand` | `#f3e3cf` | `#8f3a22` | `#e7d3b6` | `#3d3d3d` |
| `night` | `#241f1d` | `#f3e3cf` | `#8f3a22` | `#f3e3cf` |
| `signal` | `#b50806` | `#fdf0ef` | `#8f0605` | `#ffffff` |

**Assignment.** *(Graft: On the lead, named by judge 2 — a chihuahua and a mastiff must not get the same drawing because their IDs hashed the same way.)*

```
drawing  = f(species, sizeBand, ageBand)   // deterministic, from the record
colourway = ['ember','ink','sand','night'][ fnv1a(haartId) >>> 3 % 4 ]
```

| Record | Drawing |
|---|---|
| dog, size large or extra-large | `dog-head-broad` |
| dog, size small or medium | `dog-head-fine` |
| dog, ageBand puppy, or size unknown | `dog-sit` |
| cat, ageBand kitten | `cat-sit` |
| cat, size large or unknown | `cat-loaf` |
| cat, otherwise | `cat-head` |
| editorial slots (story cards, species tiles, 404) | `dog-pair` / `cat-pair`, chosen by slot index, never by content |

Adopted animals are forced to the `ink` colourway — they keep their page and their dignity, they simply stop being red. `signal` is never auto-assigned; it is passed explicitly, and **only twice on the whole site: the home hero plate and the donate cover plate.** *(Graft/drop: judge 1 — do not also give it to the dogs species tile; three red masses on a two-page journey is how the partner poster failed.)*

### 4.2 `PlateFrame` — `src/components/art/PlateFrame.tsx`

The single component that makes plates and photographs interchangeable. It is the whole photo-migration answer, so it is specified tightly.

- A fixed `aspect-ratio` box (`data-ratio="wide"` for ≥1, `"tall"` for <1) — so the layout is byte-identical the day a photo replaces a plate.
- A 1px `charcoal-900` inset border (2px on the hero and the profile band).
- The catalogue number absolutely positioned 12px from the top-right in `--text-catalogue`, in the caption colour, over a 4px `sand-200` pad.
- A caption slot rendered **below** the box, never over it.
- Children: a `<Plate>` or a `<SmartImage>`.

**The photo treatment.** A real photo receives `--vignette-photo`: `radial-gradient(ellipse 78% 74% at 50% 42%, transparent 38%, color-mix(in srgb, var(--canvas) 62%, transparent) 100%)` — an elliptical darkening toward the frame edge in the *canvas's own colour*. This is what makes forty photos shot in forty different kitchens read as one commissioned set instead of forty bright rectangles pasted onto a ruled page. *(Graft: Ember, named by all three judges as the single best idea in the panel.)*

Register's original 6% warm multiply wash is **off by default** and available as `wash` — volunteer photos are already dim and a multiply layer takes them further down. *(Drop, named by judges 2 and 3.)*

**No name ever sits over a plate or a photo** except on the story card (§6.7), where a gradient guarantees the ratio. That is why there is no scrim anywhere, no text-shadow, and no contrast guessing.

### 4.3 The placeholder-for-photo system, slot by slot

Nothing on this site renders as a grey box. Every photo slot has a designed answer today, and every answer is a frame a real photo drops straight into.

| Slot | Today | When a photo arrives |
|---|---|---|
| Animal card | Plate at 4/3, derived drawing and colourway, caption "Illustration — a photograph of Sage is coming." | Photo fills the identical box; caption becomes the alt-derived credit; number, border, ratio unchanged |
| Animal profile band | Plate at 16/7 desktop, 4/3 phone, full bleed, 2px rules top and bottom | Photo, same band, same rules |
| Profile gallery | The band plate only; no thumbnail row | Thumbnails appear as a five-up strip of 1px-ruled squares |
| Home hero | `signal` plate, `dog-head-broad`, 4/5, bleeding off the right viewport edge | Photo in the same frame; the plate becomes the fallback for that slot |
| Story / article card | Plate at 3/4 in the story's colourway with the folio numeral breaking its top-left corner | Photo at 3/4, numeral unchanged |
| Events | **No image slot at all** — a Facebook event has no picture here. The date block is the visual. | n/a |
| Partners | A "with thanks" index: names in Nunito 700 separated by 1px vertical hairlines, wrapping | Logos slot into 120×48 boxes between the same hairlines |
| Products | Plate at 1/1 in `sand`, product name as the caption | Photo at 1/1 |
| speciesTiles, actionGrid, otherWaysToGive, feeTable, stepList, faq, forms, priceCards | No image slots. These are typographic index layouts and were never waiting on photography. | n/a |

**Caption convention.** Captions state a fact, never sentiment. "Illustration — a photograph of Sage is coming." Not "Sage is waiting for her close-up." *(Graft: Cut paper's honest credit convention, named by judge 1.)*

### 4.4 The chrome assets

| Component | File | Geometry / construction | Colours | Used where |
|---|---|---|---|---|
| `FolioBar` | `art/FolioBar.tsx` | A 44px-tall flex row flush to the container edges: 48×4px rule, 12px gap, rubric, 16px gap, `flex-1` 1px hairline, 16px gap, right-aligned outline folio numeral overhanging the bar by −8px. Fifteen lines of JSX, zero drawing risk, and it carries most of the editorial character on its own. | light: red-600 rule, terracotta rubric, charcoal-300 hairline, red-600 numeral stroke. ink: red-200 rule, red-200 rubric, stone-400 hairline at 40%, red-200 numeral stroke. | The top of **every** section |
| `DashRule` | `art/DashRule.tsx` | A 240×8 tile repeated `repeat-x` from an inline data URI, marks on baseline y=4: `M0 4h34` stroke 5 round · `<circle cx=52 cy=4 r=3.2>` · `M72 4.4C96 2.6 120 5.4 146 3.8v.8C120 6.2 96 3.4 72 5.2Z` (the hand-inked organic dash) · `<circle cx=164 cy=4 r=2.4>` · `M180 4h40` stroke 5 round. The partner poster's blobs, dots and dashes, disciplined into one printer's ornament. | red-600 on light, red-200 on ink | **Exactly three places:** under the hero masthead block, at every light→ink boundary, and full-bleed across the top of the footer |
| `OutlineNumeral` | `art/OutlineNumeral.tsx` | Not SVG — `<span aria-hidden>` with `-webkit-text-stroke` inside `@supports`, solid-fill fallback outside. Props `n`, `size` (`folio` \| `index`). | stroke `var(--rule)` | Folio bars, action tiles, step lists, story cards |
| `IndexList` | `art/IndexList.tsx` | The dotted-leader list. `rows: {label, value}[]`; a null/empty value renders **"Ask us"** in `var(--text-caption)`. | hairline `var(--hairline)` | Animal cards (2 rows), profile sidebar (14 rows), fee table, donate impact ladder |
| `RuleLink` | `art/RuleLink.tsx` | `<a>` with a 3px red underline pseudo-element, `scaleX(.35)→1` from the left. | red-600 / red-200 on ink | Every secondary call to action on the site |
| `TearOff` | `art/TearOff.tsx` | Full-width inline SVG, height 56. A `userSpaceOnUse` pattern, unit 52×56: `<line x1=0 y1=.5 x2=52 y2=.5>` stroke dasharray 6 4; `<rect x=4.5 y=.5 width=44 height=55>` filled `var(--tab-fill)`, stroked hairline. One tab is drawn torn — a second rect at x=160 y=19 w=46 h=38 in the canvas colour hides the lower two-thirds of the fourth tab. Positioned at `top: 100%` of its block, overhanging onto the next canvas; the block reserves 56px `margin-bottom` so nothing shifts. | hairline stroke, tab fill sand-100 on ink / paper-0 on light | **Exactly three blocks:** `cta`, the animal-profile apply panel, `newsletter`. The most rescue-native object anyone proposed: the notice pinned up at the vet. *(Graft: Roll call, named by judges 2 and 3.)* |
| `Skyline` | `art/Skyline.tsx` | One 1440×120 single-weight line drawing, `preserveAspectRatio="xMidYMax meet"`, stroke 2, round caps, no fills. Left to right: a boab (fat rounded trapezoid trunk, five short branch strokes); the Narrows Bridge as three low arcs `M180 96 Q250 62 320 96 Q390 62 460 96 Q530 62 600 96`; the Bell Tower as a narrow 100-tall triangle `M690 96 L710 20 L730 96` with two swept sail arcs `M668 74 Q690 44 706 34` and mirror; two towers, one stepped, one notched; and at the far right, on the baseline, `dog-sit` and `cat-sit` at 0.18 scale **sitting and looking left toward the city**. | red-200, on ink only | Full width across the top of the footer, under the DashRule. The one element on the entire site that says *Perth* rather than *Australia*, and as a single line drawing it carries none of the twenty-asset risk of the direction it came from. *(Graft: On the lead, named by judge 1.)* |
| `Kennel` | `art/Kennel.tsx` | 480×360, single-weight line, stroke 2.5. A kennel drawn in outline with the door **open**: pentagon body `M60 190 L240 60 L420 190 V330 H60 Z`, roof overhang `M40 196 L240 52 L440 196`, door arch `M170 330 V240 A70 70 0 0 1 310 240 V330` drawn as an *empty* opening, and the door itself as a rounded rect rotated −68° about its left hinge at (170,330). A bowl at the step: `<ellipse cx=390 cy=326 rx=26 ry=10>`. No animal inside — the empty kennel is the message. | red-200 on ink | The foster page header, once. *(Graft: On the lead, named by judge 1 — "the best message on that page.")* |
| `Quad` | `art/Quad.tsx` | A 9×9px square. | red-600 / red-200 | Before every rubric, after the wordmark, before the primary button's label |
| `Grain` | CSS only, in `globals.css` | `background-image: radial-gradient(circle at 1px 1px, var(--grain) 1px, transparent 0); background-size: 4px 4px`. `--grain` is `rgba(61,61,61,.055)` on sand and `rgba(243,227,207,.05)` on ink; unset on paper and cream. | — | Sand and ink canvases only. Costs nothing, renders on the compositor, gives the bands the tooth of uncoated stock. |
| `Logomark` | `layout/Logomark.tsx`, data in `layout/logoPaths.ts` | **HAART's own mark**, traced from the artwork: a cat sitting in front of a dog, an open heart across them. viewBox `0 0 200 263.97`. The animals are one shape with two holes; the heart is two, split where the cat's back crosses the stroke. Every ring is a subpath of its own shape so `fill-rule="evenodd"` can punch the holes out. | silhouette `currentColor`, heart `var(--logo-heart)` = red-600 / red-200 on ink | Header, footer, favicon, OG card |
| `Logotype` | same file | The lowercase **"haart"** from the same artwork, viewBox `0 0 200 58.44`. Five shapes, one per letter, counters as holes. Not Nunito — it is a lighter, rounder face than anything in the type system, which is the point: it is the logo, not the typography. | `currentColor` | Beside or under the `Logomark` |
| `Wordmark` | `layout/Wordmark.tsx` | The lockup. `stacked` holds the artwork's own 2.44:1 mark-to-logotype height ratio; inline cuts the mark back to ~1.9× so a portrait mark does not tower over a 60px header bar. Both SVGs carry an explicit width **and** height: an auto-width SVG measures as zero in a flex row. | — | Header, footer, mobile panel |
| Favicon | `src/app/icon.svg`, `public/art/icon.svg` | The `Logomark` centred on a sand-100 square at 76% height. Legible down to 32px; at 16px it reads as a dark mass, which is what every animal-silhouette logo does at that size. | charcoal + red-600 | Favicon, web manifest |
| OG card | `src/app/opengraph-image.tsx` | Sand ground, a red rule and the tagline, the real lockup at cover scale, the strapline, then the domain and the four actions. Satori renders it, so the colours are literal and both marks carry explicit width and height. | — | `opengraph-image.tsx` |

**Ornament quota, enforced in review.** At most one 4px red rule and at most one `DashRule` per section. Hairlines are only ever 1px `charcoal-300` (paper), `sand-200` (sand) or `stone-400` at 40% (ink). Never two ornament types adjacent. The folio numeral appears once per section in the folio bar *or* once per card in a numbered index, never both in the same column. The partner poster's failure was quantity, not vocabulary.

### 4.5 The roll call — the highest-value graft on the board

Named first by **all three judges**. Component: `src/components/animals/RollCall.tsx` (package C).

A `FolioBar` with the rubric **"On the register right now"** and the computed count on the right, then a wrapped run of every adoptable animal's **real name** at `--text-rollcall` (28px phone → 52px desktop), each name a link, separated by 1px `charcoal-300` vertical hairlines with 0.4em margins — *not* red dots, because the red is spent on the names that need it.

- Names whose animal has `fosterNeeded` are set in **red-600**, preceded by the `Quad` and followed by `<span class="sr-only">needs a foster carer</span>`. Colour is never the sole carrier.
- **Foster-needed sorted first**, then newest listed.
- **Capped at 18**, then a `RuleLink` reading "+ 7 more" to `/adopt`.
- Every name has 4px vertical padding so the hit height is 44px.
- Computed count lines, never editor copy: *"Four animals are waiting on a foster home."*
- **One-animal fallback:** the band renders as a sentence, not a lonely word — *"Right now there is one dog on the register: **Beau**."* Two to four names render as a run without the folio count on the right.
- Generated from the animal list. No volunteer ever touches it, and it cannot go stale.

Twenty of HAART's own animals' names set in poster type is the fastest possible answer to "it has nothing to do with a rescue", and it is his content, not a designer's. It appears in exactly two places: opening the home page's `animalGrid` block, and opening `animalListing` on `/adopt/dogs` and `/adopt/cats`.

---

## 5. The 31 section types

### 5.1 The canvas system

Canvas is a property of the **block type**, not of its position. Positional alternation is deleted — it is the single thing that made the rejected build read as a template.

Four canvases, each a class in `globals.css` that sets CSS variables so components never branch:

| Class | Canvas | `--text-strong` | `--text-muted` | `--text-caption` | `--rubric` | `--hairline` | `--rule` | `--logo-heart` | `--focus-ring` | Grain |
|---|---|---|---|---|---|---|---|---|---|---|
| `.canvas-paper` | `paper-0` | charcoal-900 | charcoal-550 | terracotta-600 | terracotta-600 | charcoal-300 | red-600 | red-600 | red (existing) | off |
| `.canvas-cream` | `paper-50` | charcoal-900 | charcoal-550 | terracotta-600 | terracotta-600 | charcoal-300 | red-600 | red-600 | red (existing) | off |
| `.canvas-sand` | `sand-100` | charcoal-900 | **charcoal-700** | terracotta-600 | terracotta-600 | sand-200 | red-600 | red-600 | red (existing) | on |
| `.canvas-ink` | `ink-950` | sand-100 | sand-300 | **stone-400** | **red-200** | stone-400/40% | **red-200** | **red-200** | **3px sand-100, 2px offset** | on |

`--rubric` is separate from `--text-caption` because on ink the rubric is red-200 while captions are stone-400; a FolioBar reading `--text-caption` came out grey. `--logo-heart` exists for the same reason: the heart in the `Logomark` is a red signal and has to step up on ink like every other one, and a logo component must not know which canvas it is on.

Enforcing the banned muted colours through `--text-muted` rather than through a rule in a document is what makes `charcoal-550`-on-sand impossible rather than merely forbidden. *(Graft: Cut paper, named by judge 2.)*

**Assignment table**

| Canvas | Blocks |
|---|---|
| paper | hero, pageHeader (except foster/donate/stories), richText, stepList, faq, feeTable, eventList, articleList, donateWidget, formEmbed, linkList, imageWithText |
| cream | trustBand, eventsStrip, partnerGrid, partnerLogos, contactDetails |
| sand | actionGrid, iconList, speciesTiles, animalGrid, animalListing, priceCards, productGrid, otherWaysToGive, quote |
| ink | statBand, cta, fosterNeededStrip, storyFeature, newsletter, footer, and the pageHeader on `/foster`, `/donate`, `/stories` |

**Adjacency guard** (in `SectionRenderer`, replacing `surfaceForIndex`): if the computed canvas equals the previous section's, substitute its partner — paper↔cream, sand→cream, **ink→cream**. *The guard refuses to place two ink sections together rather than papering the seam with a red divider.* Register's 4px red divider between adjacent ink bands is **dropped**: it was a patch for a problem the guard should not create, and it spent the page's scarcest colour on a seam. *(Drop, named by judge 3.)* Ten lines, deterministic, no editor control. No page in the inventory carries more than three ink blocks before the footer.

**Canvas boundaries**, which the rejected build had nothing at all at:
- light → light: a full-bleed 2px `charcoal-900` rule.
- light → ink: a full-bleed `DashRule` sitting on the light side, 24px above the boundary.
- ink → light: nothing. The value change is the edge.

Every boundary runs the full viewport width, never inset to the container.

**Rhythm.** 88px top / 80px bottom on desktop, 56/52 on phone. Generous, but every section opens with a folio bar flush to the container edges, so the space reads as a framed margin rather than emptiness. Within a section the only vertical steps are 16 / 24 / 40 / 56px.

**Structure.** Reading and list sections are asymmetric, not centred stacks: a 12-column grid, 32px gutters, heading block in columns 1–4 and content in 5–12. **The sticky heading block is capped at two block types — `richText` and `faq` — plus the animal profile's fact index.** By the third occurrence a sticky sidebar reads as a trick rather than a spread, and on any section shorter than the heading block it strands its own rule mid-air. *(Drop, named by judges 1 and 2.)* It un-sticks below 1024px.

**The lit-object rule.** On any ink band, the donate widget, the application form and the newsletter input are the brightest thing on the page. State it as a rule so it holds across all 31 blocks: **an interactive surface on ink is `paper-0`, always.** *(Graft: Cut paper, named by judge 1.)*

### 5.2 Block by block

| # | Block | Canvas | Layout | Decoration | What changes from today |
|---|---|---|---|---|---|
| 1 | `hero` | paper | See §6.1 | Signal plate, DashRule, red rule, quad | Was a 70vh photo with a charcoal scrim and white text — now a typographic cover with a red-ground plate bleeding off the right edge. No scrim, no `vh`, no image required. |
| 2 | `pageHeader` | paper (ink on foster/donate/stories) | Folio bar; masthead; 40×4px red rule; deck; on ink, a computed live line in red-200 | Folio numeral; `Kennel` on `/foster` | Was an h1 and a lead on a tint. Now a cover. |
| 3 | `actionGrid` | sand | 4 columns divided by 1px vertical hairlines, 32px gutters. Each: outline numeral 01–04, title at `--text-feature`, one sentence, `RuleLink`. **No boxes, no icons.** 2-up under 900px, 1-up with horizontal hairlines and the numeral inline under 640px. | Outline numerals | The single weakest block in the rejected build — four identical white boxes with generic rounded-square icons. The icons are dropped deliberately; they were the most template-like thing on the page. |
| 4 | `richText` | paper | Sticky heading in cols 1–4, prose at 62ch in cols 5–12. First paragraph at `--text-lede` with a 4px red left rule. | — | 62ch measure, `charcoal-900` body (was charcoal-700), no drop cap. |
| 5 | `stepList` | paper | Folio bar; a hairline-ruled list, each row an outline numeral in a 96px column, heading at `--text-feature`, body. | Outline numerals | Was numbered pills in cards. |
| 6 | `iconList` | sand | Same construction as `stepList`; **the editor's icon field is ignored** — the numeral replaces it. | Outline numerals | Icons dropped. |
| 7 | `faq` | paper | Sticky heading cols 1–4; a stack of native `<details>` on hairlines in cols 5–12. Summary at `--text-feature` with a red-600 `+` that becomes `−` on `[open]`. Answer at 62ch, 24px below. | Hairlines only | Loses its boxes, chevrons and shadows entirely. |
| 8 | `statBand` | ink | Full width, centre-weighted, four stat units divided by 1px stone-400 hairlines. Figures at `--text-figure` in sand-100, labels below in red-200 rubric style. The funding sentence on its own hairline-topped row in sand-100 italic. | Folio bar (red-200) | Was red figures on a near-white tint. Now cream figures on ink — the numbers finally read as a statement. |
| 9 | `trustBand` | cream | Registration lines as a ruled index; ABN and ACNC as index rows. | Hairlines | Unchanged in substance. |
| 10 | `cta` | ink | Two columns: heading at `--text-section` in sand-100 in cols 1–7; primary button + `RuleLink` in cols 9–12. `DashRule` above the whole band. **`TearOff` hanging off the bottom edge**, 56px margin reserved. | DashRule, TearOff | Was a tinted band with two buttons. |
| 11 | `speciesTiles` | sand | Two wide hairline-framed tiles. Each: rubric, title at `--text-section`, computed count at `--text-figure` in red-600, `RuleLink`, and a plate at 4/3 on the right in the `ink` colourway (dogs) and `sand` (cats). **Not Signal** — three red masses on a two-page journey is how the partner poster failed. | Plates | Icons replaced by plates. |
| 12 | `feeTable` | sand | A ledger: `IndexList` rows, label left, amount right at `--text-figure` in red-600, tabular figures, hairline leaders. | Leaders | Was a bordered table. |
| 13 | `animalGrid` | sand | Folio bar ("On the register right now") → **`RollCall`** → 4-up card grid → `RuleLink` "See all animals". | Folio bar, roll call | The roll call is new and is the block's lead. |
| 14 | `animalListing` | sand | Folio bar → `RollCall` → filter chips (square, 40px, hairline; selected is charcoal-900 with white text) → computed count line at `--text-feature` → grid. | Folio bar, roll call | Chips lose their pill radius and red fill. |
| 15 | `fosterNeededStrip` | ink | Folio bar with the rubric "Foster carers needed"; heading in sand-100; the computed live count in red-200 at 1.375rem; a row of up to four plate cards in the `night` colourway, each with a 4px red-200 top bar and "Needs a foster" in red-200 in its catalogue row. | Folio bar | Was a pink `red-50` band — the block that most needed rescuing. Dark, quiet, unmistakably urgent, and it does not consume a hue reserved for animal status. |
| 16 | `eventsStrip` | cream | Folio bar; three event rows (§6.6); `RuleLink` "All events". | Date blocks | Card chrome removed. |
| 17 | `eventList` | paper | Upcoming as a ruled list, then a hairline, then past events at 70% opacity with a "Past" index label. | Date blocks | Same. |
| 18 | `storyFeature` | ink | Plate or photo at 3/4 in cols 1–6; text in 8–12 in cream type with a red-200 folio numeral breaking the frame's top-left corner. | Folio numeral | Was a grey image box beside a white card. |
| 19 | `articleList` | paper | Folio bar; 3-up story cards (§6.7). | Folio numerals | — |
| 20 | `partnerGrid` | cream | The "with thanks" index: names in Nunito 700 at 1.125rem separated by 1px vertical hairlines, wrapping in a flex row. Logos, when they exist, slot into 120×48 boxes between the same hairlines. | Hairlines | Was an empty logo grid; now it looks deliberate today and absorbs logos later with no other change. |
| 21 | `partnerLogos` | cream | Same index, one row, rubric "Supported by". | Hairlines | Same. |
| 22 | `priceCards` | sand | Hairline-framed columns, price at `--text-figure` in red-600, feature list as an `IndexList`. | Leaders | Square corners, no shadow. |
| 23 | `productGrid` | sand | Plate at 1/1 in the `sand` colourway with the product name as the caption; name at `--text-cardname`; price; "Coming soon" as text, never a dead button. | Plates | Placeholder images gone. |
| 24 | `donateWidget` | paper (the lit object when on ink) | See §6.10 | Hairline box | Radius 0, 2px frame, square controls. |
| 25 | `otherWaysToGive` | sand | 3-up hairline index with outline numerals 01–06 and no icon boxes. | Outline numerals | Icon pebbles dropped. |
| 26 | `contactDetails` | cream | Email and phone at `--text-feature` as `RuleLink`s; address and hours as an `IndexList`. | Leaders | — |
| 27 | `formEmbed` | paper | Folio bar; the form at 62ch on `paper-0`; inputs keep 6px radius so forms read as forms; 2px `charcoal-700` focus border. | — | Square card, hairline frame. |
| 28 | `linkList` | paper | A ruled list of `RuleLink`s with an `IndexList`-style description column. | Leaders | — |
| 29 | `newsletter` | ink | Folio bar; heading at `--text-section` in sand-100; a single `paper-0` input + square red button (**the lit object**); `TearOff` below. | TearOff | — |
| 30 | `imageWithText` | paper | `PlateFrame` at 4/3 one side, text the other, alternating by slot parity, 1px hairline between. | Plate | Plate replaces the empty image. |
| 31 | `quote` | sand | Pull quote at `clamp(1.5rem,3.2vw,2.5rem)` with a 96×3px red rule above and the attribution in rubric style below. | Red rule | Loses its card and its big quotation glyph. |

---

## 6. Exact compositions

### 6.1 Home hero

**Desktop (≥1024px).** Canvas `paper-0`, grain off, directly under the header's 2px `charcoal-900` bottom rule. Total height 760px, fixed by the plate's aspect ratio rather than by a viewport unit, so CLS is zero and the fold is predictable. Inside `container-site`: `grid-template-columns: minmax(0,7fr) minmax(0,5fr); column-gap: 56px; align-items: start; padding-block: 64px 0`. The right column carries `margin-right: calc(50% - 50vw)` so the plate runs off the right edge of the viewport.

Left column, top to bottom:
1. **Rubric row** — `Quad`, 10px gap, "Perth · foster-based · no-kill" in `--text-rubric` terracotta, then a `flex-1` hairline to the column edge. 40px below:
2. **The red rule** — 40×4px red-600. 20px below:
3. **Masthead** — the heading string at `--text-masthead` in charcoal-900, stepped by `headingStep()`. At the 1140px container the default copy sets as three lines of roughly 104px. *No coloured word span.* 28px below:
4. **Deck** — `--text-deck`, max 34ch, charcoal-700. 40px below:
5. **Calls to action** — a flex row, 32px gap, centred: primary is a **square** red-600 button, 52px tall, 28px horizontal padding, Nunito 800, white, with a cream `Quad` before the label and an arrow after; secondary is a `RuleLink` reading "Donate". No second bordered box. 48px below:
6. **`DashRule`**, full column width. 24px below:
7. **The stat line** — three items separated by 1px vertical hairlines with 24px padding: "**100%** volunteer run · **$0** government funding · rescuing since **2012**". Labels in Source Sans 600 0.8125rem charcoal-700; the numerals inline in Nunito 800 1.125rem red-600.

Right column: `PlateFrame` in the **`signal`** colourway holding `dog-head-broad`, `data-ratio="tall"`, aspect 4/5, 680px tall, bleeding off the right viewport edge, cropped so the dog's right ear leaves the frame. A 2px `charcoal-900` rule on its **left edge only** — the other three edges are off-screen or flush. Catalogue number top-right reads "Plate 01". Caption below, left-aligned to the plate: *"One of the dogs on the register this month. Illustration, not a photograph."*

**Phone (<640px).** Side gutter 16px. **No `vh` units anywhere**, so there is no address-bar jump and no CLS. *(Graft: Ember, named by judge 2.)* Order: rubric row (hairline running to the right gutter) → 32×4px red rule → masthead at `clamp(2.5rem, 11vw, 3.5rem)` → deck at 1.125rem → primary button full width 52px → "Donate" `RuleLink` at 44px tap height → `DashRule` full bleed (`margin-inline: -16px`) → the Signal plate full bleed at 4/3, 260px tall, 2px rules top and bottom only → caption inside the gutter → the stat line as three rows on horizontal hairlines, label left, numeral right.

**LCP is the masthead** — text, in a font with `display: optional`, so it paints immediately with the size-adjusted fallback. The plate is inline SVG in the document: the hero makes **zero image requests at any breakpoint**.

### 6.2 Animal card

Not a rounded white box with a drop shadow. An entry in a register.

A vertical flex column, 1px `charcoal-900` border, radius 0, no shadow, `paper-0` fill on the sand canvas.

- **Status bar** across the top edge, 4px, full card width: red-600 `fosterNeeded`, amber-600 pending/on-hold (amber-700 on sand), green-600 adopted, absent when plainly available.
- **Plate** flush to the card's left, right and top edges with no gap, `data-ratio="wide"`, aspect 4/3, derived colourway, 1px `charcoal-900` rule along its bottom. Catalogue number in the frame's top-right.
- **Catalogue row**, 16px padding, 12px under the plate: the status word left in `--text-index-label` (charcoal-700, amber-700 pending, green-700 adopted, **red-600 "Needs a foster"**), the HAART ID right in `--text-catalogue` terracotta.
- **Name** at `--text-cardname`, 8px below, with a 3px red-600 underline pseudo-element at `scaleX(0)`, origin left.
- **Two fact rows** as an `IndexList`: "Breed ····· Border collie", "Age ····· 10 years". Missing values read "Ask us" in terracotta.
- **Summary** in Source Sans 3 400 italic 0.875rem, clamped to two lines, `flex-1` so cards in a row end level.
- **Hover / focus-visible** inside `@media (hover: hover)`: `translateY(-2px)` over 180ms and the underline runs `scaleX(0)→scaleX(1)`. Transform only. No shadow change, no border change, no image scale.
- **Adopted** cards force the `ink` colourway and carry a `sand-300` band across the plate's lower third with "Adopted" in Nunito 800 1.125rem charcoal-900 and a 3px green-600 rule beneath the word.
- **Any badge that floats over media** — the profile band's status chip — carries a **2px ring in the canvas colour** so its edge stays visible on any uploaded photo. *(Graft: Cut paper's sticker ring, named by judge 2.)*

**Phone:** one column, plate at 4/3, identical construction. Two cards per row from 640px, four from 1024px.

### 6.3 Animal profile

The feature spread, and the page most in need of not looking like a product detail page. *This is the page to show the owner first.*

**Desktop.** Breadcrumb row on `paper-0` at 0.8125rem charcoal-700. Then a **full-bleed plate band**: `PlateFrame` at 16/7, the animal's derived colourway, edge to edge, 2px `charcoal-900` rules top and bottom, the status chip floating 20px from its top-left with its 2px canvas-colour ring. Below the band, inside the container: the caption left in terracotta italic and the catalogue number right, separated by a 1px hairline.

**The name never sits on the band.** No scrim, no text-shadow, no contrast guessing, and the layout is byte-identical the day a photo replaces the plate.

Then the masthead: the animal's name at `--text-masthead` (stepping down over 12 characters), with breed and age beneath as a deck.

Then a 12-column grid:
- **Columns 1–8:** the write-up verbatim at 62ch, first paragraph at `--text-lede` with the 4px red left rule, and a pull quote set between the second and third paragraphs built from the `summary` field — always exactly one sentence, always real content, no text-parsing heuristics for volunteer copy to break.
- **Columns 10–12:** the sidebar index, `position: sticky`, a hairline-ruled `IndexList` of catalogue number, status, species, breed, age, sex, size, weight, good with children / cats / dogs, desexed, vaccinated, microchipped, fee. Unknowns render "Ask us" in terracotta — so Beau's three blank cells and missing fee produce a full, deliberate-looking index instead of a broken one. Under it: the apply button, square, red-600, full column width, 52px; **`TearOff` hanging off its bottom edge**; then share as two `RuleLink`s; then the medical and behaviour note in a `paper-0` box with a 4px red-600 left rule.
- Below 1024px the index moves above the write-up and un-sticks.

Closing band on sand: "More dogs looking for a home" as a folio bar plus a four-up register row.

**Phone.** Band at 4/3 full bleed → caption + number stacked → masthead at `clamp(2.5rem,11vw,3.5rem)` → deck → the index as a full-width `IndexList` → apply button full width → TearOff → write-up → pull quote → note → related.

### 6.4 Header

72px desktop, 60px phone. `paper-0`, **no shadow ever**, closed by a full-viewport-width 2px `charcoal-900` bottom rule. `position: sticky; top: 0`. It does not shrink, fade or change on scroll — a guaranteed CLS and jank source for no gain.

- **Wordmark** left: HAART's own lockup — the `Logomark` at 36px beside the `Logotype` at 19px, 10px gap, both charcoal-900 with the heart in red-600. *(Amended once Tristan supplied the logo file. The earlier spec set "haart" in Nunito 900 with the printer's quad; that was a stand-in drawn before the artwork existed, and a rescue with a real mark should use it. The `Quad` stays everywhere else — rubrics, buttons — so the ornament system is unchanged.)*
- **Nav** centre-right: Source Sans 3 600 0.9375rem charcoal-900, 24px gaps, 44px tap height. The active item carries a 3px red-600 underline sitting **flush on the header's bottom rule**, not floating above it. Items with children show a 6px chevron.
- **Donate** right: a square red-600 button, 44px tall, 20px horizontal padding, Nunito 800, white, with a cream `Quad` before the label. Always visible at every breakpoint, never inside the menu.
- **Dropdowns** open as a full-width **contents panel** below the header rule, not a floating rounded menu: `paper-0`, a 2px `charcoal-900` bottom rule, `container-site` inside, a row of link groups each with a rubric heading and its links separated by 1px hairlines. It reads like a magazine's contents page.
- **Phone:** wordmark, Donate, then a menu control that is the **word "Menu"** in Nunito 800 with a 2px underline, not a hamburger glyph. The panel is full height, `paper-0`, links at 1.25rem in Nunito 700 on 1px hairlines, grouped by rubrics, with the acknowledgement line at the bottom.

### 6.5 Footer

The ink canvas, grain on. Opens with a full-bleed `DashRule` in red-200 sitting directly on the boundary, and immediately below it the **`Skyline`** at 120px desktop / 80px phone, full width, red-200, with the dog and cat sitting at the far right looking at the city. 80px top padding under the skyline.

- **Row 1:** the **stacked** lockup at the artwork's own proportions — the `Logomark` at 100px above the `Logotype` at 41px, sand-100 with the heart stepped up to red-200 (red-600 is 2.33:1 on ink); beside it in columns 7–12 the strapline in sand-100 italic 1.125rem.
- **Row 2**, 56px below: a four-column grid divided by 1px `stone-400` hairlines at 25% opacity. Column headings in `--text-rubric` red-200; links in sand-100 0.9375rem, 12px row gaps, 44px tap targets. Contact details take the first column, phone and email as `RuleLink`s.
- **Row 3:** the acknowledgement of country, given real prominence rather than a grey afterthought — full width, its own box with a 1px `stone-400` border, 24px padding, sand-100 italic 0.9375rem at a 70ch measure.
- **Row 4:** registered name, ABN, ACNC status, copyright, privacy and forms links in `stone-400` 0.75rem above a 1px `stone-400` rule.
- **Social:** two square 44px outline boxes, 1px `stone-400` border, radius 0, icons in sand-100.
- **Phone:** skyline at 80px, columns stack, acknowledgement box full width, everything else identical.

### 6.6 Event card

Not a card. A row in a ruled list on cream, rows separated by 1px hairlines, no border around anything, **no image slot**.

- **Left:** the date block, 88px wide — month as a rubric in red-600, the day at `--text-figure` (3.25rem) red-600, the year below at 0.75rem charcoal-550.
- A 1px vertical hairline, 24px gutters either side.
- **Right:** title at `--text-cardname`; venue and time at 0.875rem charcoal-700 separated by a middot; "View on Facebook ↗" as a `RuleLink`.
- Cancelled events carry a square `charcoal-900` chip with white text. Past events sit at 70% opacity with a "Past" index label.
- **Phone:** the date block collapses inline above the title as one line ("Fri 18 Sep") with the day numeral still at 2.5rem; the vertical hairline becomes the row's top hairline.

### 6.7 Story card

A numbered feature. `PlateFrame` at 3/4 (`data-ratio="tall"`) in the story's colourway, with the outline folio numeral ("01" at `--text-folio`, red stroke, transparent fill, `aria-hidden`) absolutely positioned overlapping the plate's top-left corner by −24px / −16px so it **breaks the frame**. Beneath: category rubric, title at `--text-feature`, excerpt in italic 0.9375rem charcoal-700 clamped to three lines, "Read the story" as a `RuleLink`.

On the ink `storyFeature` band the same card runs at double width: plate in columns 1–6, text in 8–12, sand-100 type, red-200 numeral.

This is the one place a real photo may carry overlaid type; when one exists, the headline sits at the bottom-left over `linear-gradient(to top, #241f1d 0%, rgba(36,31,29,.85) 32%, transparent 72%)`, which guarantees sand-100 at no worse than 9:1 under any photo.

**Phone:** plate at 3/4 full column width, numeral overlapping by −12px, text below.

### 6.8 Donate page

The appeal. **Desktop:** masthead cover on `paper-0` — "Give to the animals" at `--text-masthead`, the funding sentence as a deck, and the **second and last** `signal` plate (`cat-loaf`) at 5 columns bleeding right. This is the page's one piece of red mass.

- **Columns 1–7:** the gift widget inside a 2px `charcoal-900` box, radius 0, on `paper-0`. Frequency as two square hairline tabs that fill red-600 with white type when selected; four square hairline amount presets that do the same (a control, not a canvas); the custom amount field with a 2px `charcoal-700` focus border; the cover-fees checkbox; the primary button square, 52px, full width.
- **Columns 9–12:** "What your gift does" as an editorial price index — an `IndexList` where each row is the amount in Nunito 900 2rem red-600, a dotted leader, and the description at 0.9375rem. Same four facts as the rejected build, rendered as an index instead of a loose two-column list, and it is the part of the page people actually read.
- Then the ink `statBand` with figures at 5rem in sand-100 and labels in red-200. Then `otherWaysToGive` on sand as a three-up hairline index with outline numerals 01–06. Then a ruled FAQ on paper. Then the ink footer.
- The "online donations are being set up" notice stays exactly as honest as it is, in charcoal on `paper-100` inside the widget box — no red, no alarm.

**Phone:** masthead → deck → Signal plate full bleed at 4/3 → widget (full width, frequency tabs 2-up, presets 2×2) → impact index → stat band as a 2×2 grid → other ways as a single column.

### 6.9 Foster page

The campaign feature, and the page with the most ink on the site, because fostering is the serious ask.

**Desktop:** an **ink `pageHeader`** — full-bleed ink band, folio bar with red-200 rule and rubric, masthead in sand-100 at cover scale, deck in sand-100 italic, a computed live line in red-200 at 1.375rem (*"Four animals are waiting on a foster home right now"*), and the **`Kennel`** — the empty kennel with its door open — drawn in red-200 at 480px on the right, bleeding off the edge. One drawing, the best message on the page.

Straight into `fosterNeededStrip` — but the adjacency guard forbids two ink blocks touching, so the strip takes **cream** here and the ink header is the opening statement on its own. Then paper: the foster copy with the lede treatment and a sticky heading in columns 1–4. Then sand: "What fostering actually involves" as a numbered index with outline numerals 01–06, no icons. Then paper: the FAQ as ruled `<details>` rows. Then an ink `cta` with the `TearOff`.

The page reads as an argument: the urgency, the answer, the ask.

**Phone:** ink header with the kennel below the deck at 280px wide, then the same order, all single column.

---

## 7. Motion

Four moments. Everything is `transform` and `opacity`, everything uses `whileInView` with `once: true` through the existing Motion setup, everything collapses to a 150ms opacity fade under `prefers-reduced-motion` via `useReducedMotion` plus the CSS fallback already in `globals.css`. Nothing is scroll-linked. Nothing hijacks scrolling. Nothing animates height, width, margin, padding or colour. Server-rendered markup has no hidden state — the heading is visible and selectable before any JavaScript runs.

1. **Rule draw** — the gesture that carries the whole site. Every folio-bar rule, every full-bleed canvas-boundary rule and every `DashRule` animates `scaleX(0) → scaleX(1)`, `transform-origin: left`, 450ms on `--ease-standard`, as it enters view. Because rules are the design's connective tissue, this one gesture makes the entire site feel *drawn* rather than assembled, and it costs one shared component (`RuleDraw`) applied to about six elements per page.
2. **Masthead rise** — the hero and every page header stagger their parts (rubric row, red rule, masthead, deck, calls to action, dash rule, stat line) with `translateY(14px) → 0` and opacity, 60ms apart, 500ms each, spring 220/28. The parts are the existing elements, never split words or characters, so arbitrary volunteer copy cannot break it. Fires on mount, not on scroll.
3. **Plate reveal** — a print appearing. `PlateFrame` renders a cover div in the canvas colour over the plate which wipes away with `scaleY(1) → scaleY(0)`, `transform-origin: top`, 550ms. Applied to **exactly two things: the hero plate and the animal-profile band.** *Register's "first row of any plate grid" is dropped — four curtains wiping down in sequence on an animal listing reads as a loading state, not as a print appearing.* *(Drop, named by judge 3.)*
4. **Underline grow** — hover and focus-visible on an animal card, a story card or any `RuleLink` runs the 3px red underline `scaleX(0) → scaleX(1)` from the left, 180ms, alongside a `translateY(-2px)` lift on cards. Wrapped in `@media (hover: hover)` so touch devices get nothing and nothing sticks.

Plus one utility, not a moment: the navigation contents panel at opacity and `translateY(-6px)`, 150ms.

**Deliberately not done:** no parallax, no counting numerals, no marquees, no `stroke-dashoffset` line drawing (not transform or opacity), no infinite pulse on any control, no reveal-on-scroll for body text — body copy is never hidden behind an animation.

---

## 8. Implementation plan — four parallel work packages

Four engineers, no shared files. **Package A owns every file B, C and D depend on and must land first or in parallel behind a stub.** The contract below is complete enough for B, C and D to code against A before A exists.

### Package A — foundation

**Files owned**

| File | Becomes |
|---|---|
| `src/styles/tokens.css` | Nine new colour tokens; the four canvas variables; the full type scale from §3.1; `--radius-card: 0`, `--radius-control: 6px`; `--radius-pill`, `--shadow-card`, `--shadow-card-hover` deleted; `--shadow-focus` kept; `--ring-focus-ink` added; `--vignette-photo`; `--grain` |
| `src/styles/tokens.test.ts` | Every passing pair in §2.2 as an assertion, **and the eight failing pairs as `toBeLessThan(4.5)` assertions so the build breaks if anyone uses them.** Non-negotiable, not nice-to-have. *(Graft: Ember, named by judge 2.)* |
| `src/app/globals.css` | Canvas classes; `.folio-rule`; `.dotted-leader`; `.rule-link`; `.numeral-outline` with its `@supports` block; `.grain`; `.bleed-rule`; `.lede`; `.sticker-ring`; `.plate[data-ratio]` crop-group switching; section padding; focus-ring switching |
| `src/components/art/` | **All** art components (§4). New directory. |
| `src/components/ui/Container.tsx` | `Canvas` type, `canvasClass` map, `canvasForBlock()`, the adjacency guard, `Section` with canvas + boundary rules, `SectionHeading` rebuilt as the folio-bar + sticky heading block |
| `src/components/sections/SectionRenderer.tsx` | Passes `canvas` instead of `surface`; `surfaceForIndex` deleted |
| `src/components/ui/Button.tsx` | Square, `Quad` prefix, `ink` variant with the sand-100 hairline; secondary variant retired in favour of `RuleLink` |
| `src/components/ui/Badge.tsx` | Status becomes a 4px bar + a word; `StatusChip` for the one floating case, with the 2px canvas-colour ring |
| `src/components/ui/Card.tsx` | Hairline, radius 0, no shadow, transform-only hover inside `@media (hover: hover)` |
| `src/components/ui/SmartImage.tsx` | The grey-box fallback branch **deleted**; new `placeholder` prop takes a ReactNode; `vignette` prop |
| `src/components/motion/RuleDraw.tsx`, `PlateReveal.tsx` | New |
| `src/components/motion/HoverLift.tsx` | Transform-only, `@media (hover: hover)` |
| `src/components/layout/Header.tsx`, `DesktopNav.tsx`, `MobileNav.tsx`, `Footer.tsx`, `Wordmark.tsx` | §6.4, §6.5 |
| `src/app/layout.tsx` | Theme colour `#f3e3cf` |
| `public/art/icon.svg`, `public/art/og-mark.svg` | New |
| `public/placeholders/` | **Deleted**, with `src/lib/mock/animals.ts` photo arrays emptied and the mock test updated |
| `docs/design-system.md` | Superseded sections rewritten to point here |

**The contract B, C and D code against**

*Canvas classes:* `.canvas-paper` `.canvas-cream` `.canvas-sand` `.canvas-ink`
*Canvas variables:* `--canvas` `--text-strong` `--text-muted` `--text-caption` `--rubric` `--hairline` `--rule` `--logo-heart` `--focus-ring` `--grain`
*New colour tokens:* `--color-ink-950` `--color-sand-100` `--color-sand-200` `--color-sand-300` `--color-terracotta-600` `--color-stone-400` `--color-red-200` `--color-green-300` `--color-amber-300`
*New type tokens:* `--text-masthead` `--text-masthead-2` `--text-masthead-3` `--text-section` `--text-feature` `--text-rollcall` `--text-cardname` `--text-figure` `--text-folio` `--text-deck` `--text-lede` `--text-rubric` `--text-caption` `--text-catalogue` `--text-index-label` `--text-index-value`
*Utility classes:* `.folio-rule` `.dotted-leader` `.rule-link` `.numeral-outline` `.grain` `.bleed-rule` `.lede` `.sticker-ring`

*Art components and their exact props:*

```tsx
type Canvas = 'paper' | 'cream' | 'sand' | 'ink';
type Colourway = 'ember' | 'ink' | 'sand' | 'night' | 'signal';
type PlateName = 'dog-head-broad' | 'dog-head-fine' | 'dog-sit' | 'dog-pair'
               | 'cat-loaf'       | 'cat-head'      | 'cat-sit' | 'cat-pair';

<Plate name={PlateName} colourway={Colourway} ratio={'wide'|'tall'} />
plateFor(a: { species; sizeBand?; ageBand?; haartId }): { name: PlateName; colourway: Colourway }

<PlateFrame
  ratio="16/7" | "4/3" | "4/5" | "3/4" | "1/1"
  catalogue?={string}          // e.g. "HD26-030" or "Plate 01"
  caption?={string}
  border?={1 | 2}
  edges?={'all'|'left'|'y'}    // which sides carry the rule; for bleeding plates
  wash?={boolean}              // default FALSE
  vignette?={boolean}          // default TRUE when the child is a photo
  reveal?={boolean}            // default FALSE; true only on hero + profile band
>{children}</PlateFrame>

<FolioBar rubric={string} numeral?={number} right?={ReactNode} />
<DashRule bleed?={boolean} />
<OutlineNumeral n={number} size={'folio'|'index'} />
<IndexList rows={{ label: string; value?: string | null }[]} dense?={boolean} />
<RuleLink href={string} external?={boolean}>{children}</RuleLink>
<TearOff tabFill?={'paper'|'sand'} />      // renders at top:100%; parent reserves mb-14
<Skyline />                                 // ink only
<Kennel width?={number} />                  // ink only
<Quad size?={number} />
headingStep(text: string): 0 | 1 | 2
```

*Section prop shape (replaces `surface`):*

```tsx
export type SectionProps<T> = { section: Extract<Section,{_type:T}>; canvas: Canvas; index: number };
```

**Order within A:** tokens.css → globals.css → art → Container/SectionRenderer → primitives → header/footer. After the first three, B, C and D are unblocked.

### Package B — home and page-level blocks

| File | Becomes |
|---|---|
| `sections/Hero.tsx` | §6.1. Photo/scrim/`vh` all removed. Takes `signal` plate, `reveal`, DashRule, stat line. |
| `sections/PageHeader.tsx` | Cover treatment; ink variant for `/foster`, `/donate`, `/stories`; `Kennel` on foster; computed live-count line slot |
| `sections/ActionGrid.tsx` | Hairline-divided 4-up editorial index; **icons dropped**; outline numerals |
| `sections/StatBand.tsx` | Ink, `--text-figure` in sand-100, red-200 labels, stone-400 hairlines, funding sentence row |
| `sections/Cta.tsx` | Ink two-column band + `DashRule` + `TearOff` |
| `sections/Quote.tsx` | Sand pull quote, red rule above, rubric attribution, card removed |
| `sections/ImageWithText.tsx` | `PlateFrame` + alternating parity + hairline |
| `sections/RichText.tsx` | Sticky heading cols 1–4, 62ch prose, `.lede` first paragraph, no drop cap |
| `sections/StepList.tsx` | Ruled list with outline numerals |
| `sections/IconList.tsx` | Same as StepList; icon field ignored |
| `sections/Faq.tsx` | Sticky heading + native `<details>` on hairlines, red `+`/`−` |
| `sections/LinkList.tsx` | Ruled `RuleLink` list |
| `sections/Newsletter.tsx` | Ink band, `paper-0` input (lit object), `TearOff` |
| `sections/TrustBand.tsx` | Cream `IndexList` |
| `sections/SpeciesTiles.tsx` | Two hairline tiles with plates (`ink` / `sand`, **never `signal`**) and computed counts |
| `sections/FeeTable.tsx` | Ledger `IndexList`, red `--text-figure` amounts |
| `src/components/ui/Prose.tsx` | 62ch, charcoal-900 body, `.lede`, `Quad` list markers |

### Package C — animals

| File | Becomes |
|---|---|
| `animals/AnimalCard.tsx` | §6.2 |
| `animals/RollCall.tsx` | **New.** §4.5 |
| `animals/AnimalGrid.tsx` | 4/2/1 grid, gaps 24/16, no shadow, `priority` on the first row only |
| `animals/PhotoGallery.tsx` | Full-bleed `PlateFrame` band + five-up ruled thumbnails when photos exist; `reveal` on |
| `animals/helpers.ts` | `sizeBand()`, `ageBand()` and `fnv1a()` for `plateFor`; fact rows for `IndexList` |
| `app/adopt/[species]/[slug]/page.tsx` | §6.3 |
| `sections/AnimalGridSection.tsx` | Folio bar → `RollCall` → grid → `RuleLink` |
| `sections/AnimalListingSection.tsx` | Folio bar → `RollCall` → square chips → count line → grid |
| `sections/FosterNeededStrip.tsx` | Ink band, `night` plates, red-200 bars, computed count |

### Package D — events, stories, partners, products, donate

| File | Becomes |
|---|---|
| `events/EventCard.tsx` | §6.6 ruled row + date block; **no image slot**; new `events/DateBlock.tsx` |
| `sections/EventsStrip.tsx` | Cream, folio bar, three rows, `RuleLink` |
| `sections/EventListSection.tsx` | Paper, upcoming then past at 70% |
| `articles/ArticleCard.tsx` | §6.7 story card |
| `articles/ArticleFilters.tsx` | Square hairline chips, charcoal-900 selected |
| `sections/StoryFeature.tsx` | Ink double-width feature, red-200 numeral |
| `sections/ArticleListSection.tsx` | Folio bar + 3-up story cards |
| `app/stories/[slug]/page.tsx` | Masthead, `.lede`, pull quote from excerpt, 62ch, related |
| `sections/Partners.tsx` | The "with thanks" hairline index for both `partnerGrid` and `partnerLogos` |
| `sections/PriceCards.tsx` | Hairline columns, red `--text-figure` |
| `sections/ProductGrid.tsx` | 1/1 `sand` plates, "Coming soon" as text |
| `donate/DonateWidget.tsx` | Square controls, 2px frame, red-filled selected states |
| `sections/DonateWidgetSection.tsx` | §6.8 two-column layout + impact `IndexList` |
| `sections/OtherWaysToGive.tsx` | 3-up hairline index, outline numerals, no icon boxes |
| `sections/ContactDetails.tsx` | `RuleLink` email/phone + `IndexList` |
| `sections/FormEmbed.tsx` | Folio bar, 62ch, square frame, 6px inputs |

**Checks, owned jointly, after all four land (1h):** re-run the contrast table; axe on home, listing, profile, foster and donate; keyboard pass on the roll call, chips and tear-offs; reduced-motion in two browsers; Lighthouse mobile; a CLS trace on the hero and the animal grid.

---

## 9. Guard rails

### 9.1 What would make it saccharine, and what prevents it

| Risk | Rule |
|---|---|
| A drawn dog that smiles, or is drawn cute | **The figure rulebook (§4.1) is a constraint in the plate spec, not a matter of taste**: no smiling mouths, eyes as punched dots, no whiskers on dogs, no collars or props, at most one accent element, animals oriented into the content. Puppies and kittens at true proportion. |
| Hearts, paw prints, script type, rounded corners, soft shadows | None exist in the system. `--radius-card: 0`; `--shadow-card` deleted; `public/placeholders` deleted. |
| Caption copy tipping into sentiment | **Captions state a fact, never sentiment.** "Illustration — a photograph of Sage is coming." |
| The journal conceit tipping into twee | The **drop cap is dropped entirely**, and the **last-words-in-red masthead span is dropped entirely**. Positional word-colouring lands well once and badly often. |
| Emotive motion | No infinite pulse on any control, no counting numerals, no wagging, no glowing badges. Urgency is a red bar and a word. |

### 9.2 What would make it busy, and what prevents it

| Risk | Rule |
|---|---|
| Ornament everywhere — the partner poster's exact failure | **Quota, enforced in review:** one 4px red rule and at most one `DashRule` per section; hairlines only ever 1px in the canvas's own hairline colour; never two ornament types adjacent; the folio numeral once per section *or* once per card, never both in a column. |
| Red mass accumulating | **The `signal` plate appears exactly twice on the whole site** — the home hero and the donate cover. Not the dogs species tile. Three red masses on a two-page journey is how the poster failed. |
| The page becoming a dark trough | The adjacency guard **refuses to place two ink sections together**; no page in the inventory carries more than three ink blocks before the footer. |
| The sticky sidebar becoming a trick | **Capped at two block types** — `richText` and `faq` — plus the profile index. It un-sticks below 1024px. |
| The reveal curtain reading as a loading state | **Plate reveal on two elements only:** the hero plate and the profile band. Never on a grid. |
| Volunteer copy blowing up the layout | `headingStep()` at 36 and 72 characters; `overflow-wrap: anywhere`; `hyphens: auto`; roll call capped at 18; names over 12 characters step down; nothing truncates. |
| Volunteers styling anything | There is still **no editor field for colour, alignment, spacing or width**. Canvas comes from block type, plate from the record, colourway from the ID hash, numerals from list order. |

### 9.3 What would make it slow or inaccessible, and what prevents it

| Risk | Rule |
|---|---|
| CLS | Every `PlateFrame` has a fixed `aspect-ratio`; the hero uses **no `vh` at any breakpoint**; the header never resizes on scroll; fonts keep `display: optional` with size-adjusted fallbacks; figures use `tabular-nums` with fixed line-heights. |
| LCP | **LCP is text on every page.** The hero makes zero image requests. |
| Payload | Eight plates gzip to about 2 KB inline and replace twelve placeholder file requests — the art budget is *negative*. Grain is a CSS gradient, not an image. Plates are flat paths only: no filters, no masks, no more than one gradient in any plate, no animated SVG. |
| Paint cost | Motion is `transform` and `opacity` only; the vignette is a static gradient, never a CSS `filter` on an image; no `backdrop-filter`; no `clip-path` on a transforming layer. |
| Invisible focus on dark | `--focus-ring` is set by the canvas class: **3px `sand-100` with a 2px `ink-950` offset on ink** (12.96:1). A live bug in the current tokens, fixed structurally. |
| Banned colour pairs regressing | The eight failing pairs in §2.2 are **assertions in `tokens.test.ts`**; `--text-muted` makes charcoal-550-on-sand impossible rather than forbidden. |
| Status carried by colour alone | Every status has a **word** in the catalogue row beside its bar; every foster-needed roll-call name carries the `Quad` and `sr-only` text. |
| Decorative text read aloud | Outline numerals, plates, skyline, kennel, dash rules and quads are all `aria-hidden`; `-webkit-text-stroke` sits inside `@supports` with a solid fallback so unsupported browsers get faint numerals, never invisible ones. |
| Badges disappearing on an uploaded photo | Any badge over media carries a **2px ring in the canvas colour**. |
| Tap targets | Roll-call names 44px; nav 44px; footer links 44px; buttons 44px (52px primary). |

---

## 10. What the owner will ask, and the answer

He will open the home page and see a 104px masthead, a red-ground plate of a dog's head cropped off the right edge of the screen, and a run of his own animals' names underneath. "Boring" is dead on arrival.

The thing that will actually win him over is not the typography — it is **HD26-030 set in the corner of every plate and down the side of every profile as a proper index.** That is his number, from his system, and nobody handed it to him; somebody noticed it.

Two questions will come.

**"Where are the photos, and isn't a drawing a bit odd for a rescue?"** The frame never changes. Show him the animal profile with the plate and then the same frame holding a photo: same hairline, same caption, same catalogue number, same ratio, nothing else moves. Plates stay permanently as the empty state, because on a foster-based rescue some animals will always be waiting on a photo — and the vignette means that when forty phone photos do arrive, shot in forty different kitchens, they read as one set.

**"Isn't 'magazine' a bit fancy for a volunteer outfit with no funding?"** The ink bands and the folio bars cost nothing — they are hairlines and type. The entire illustration set is about two kilobytes of hand-drawn SVG, and it *replaces* twelve placeholder files. There are never more than three ink blocks on a page and they sit under the numbers and the asks, which is the serious end of the site.

Show him the animal profile first, not the home page.
