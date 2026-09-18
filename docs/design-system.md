# Design system

> **Superseded.** Sections 1 to 7 of this document describe the first build,
> which the organisation rejected as generic. The live design direction is
> **docs/design-direction.md** ("The register"): the canvas system, the plate
> illustrations, the folio bars, the roll call and the full type scale are
> specified there, and `src/styles/tokens.css` implements it.
>
> This file is kept for the audit trail and for section 8 onward, which still
> describe decisions that carried across unchanged (imagery rules, alt-text
> policy, the sensitive-image treatment).

---

Phase 3 checkpoint. The draft token set from the brief survives with three additions and one rule tightened. Everything here is implemented as CSS custom properties in `src/styles/tokens.css`, exposed to Tailwind through `@theme`, and consumed by the components in `src/components/ui`.

## 1. Adjustments to the draft, and why

| Change | Draft | Final | Reason |
|---|---|---|---|
| Add Charcoal 550 | none | `#6b6b6b` | Charcoal 500 `#767676` fails AA for normal text on both tints (4.01:1 on Paper 100, 4.29:1 on Paper 50). It passes only on white (4.54:1). Charcoal 550 measures 4.70:1 on Paper 100 and 5.33:1 on white and is used for small muted text on tinted surfaces. Charcoal 500 remains for large muted text and for muted text on white. |
| Add Amber 700 | none | `#8a5a06` | Amber 600 `#b57708` measures 3.75:1 on white and fails as text. Badge labels use Amber 700 (5.92:1 on white, 5.22:1 on Paper 100); Amber 600 remains for the badge dot and border. |
| Add an urgent surface | none | Red 50 surface, Red 700 text, Red 100 border | The audit found "foster carer needed" is a real, frequent state that today lives in title asterisks. It needs a designed treatment that does not consume the semantic green and amber and does not make red a canvas. Red 700 on Red 50 measures 8.60:1. |
| Green 700 for adopted text on tint | none | `#23603d` | Green 600 passes on white (5.05:1) but the adopted badge sits on Paper 100 in card footers; Green 700 gives headroom (7.47:1 on white). Optional; Green 600 remains the fill colour. |
| Tighten the red rule | "Red is an accent, not a canvas" | Same, plus: red never appears as a background larger than a button or a badge, and never as the colour of more than one element in a card | Partner collateral shows what happens otherwise. |

Everything else in the draft is adopted as written.

## 2. Colour

### Brand

| Token | Value | Use |
|---|---|---|
| `--color-red-600` | `#b50806` | Primary button fill, active nav, focus ring base, urgent badge dot, small emphasis |
| `--color-red-700` | `#8f0605` | Hover and press on primary, urgent badge text |
| `--color-red-100` | `#f9dcda` | Tint borders, urgent badge border |
| `--color-red-50` | `#fdf0ef` | Urgent surface, selected filter chip |
| `--color-charcoal-900` | `#3d3d3d` | Headings and body text |
| `--color-charcoal-700` | `#575757` | Secondary text |
| `--color-charcoal-550` | `#6b6b6b` | Small muted text on tints |
| `--color-charcoal-500` | `#767676` | Large muted text; muted text on white |
| `--color-charcoal-300` | `#b3b0ae` | Disabled text, decorative rules (never for text under 24px) |

### Neutrals (warm)

| Token | Value | Use |
|---|---|---|
| `--color-paper-0` | `#ffffff` | Cards, inputs, primary page background |
| `--color-paper-50` | `#faf8f6` | Alternate section surface |
| `--color-paper-100` | `#f4f0ec` | Second alternate section surface, card footers |
| `--color-border` | `#e5e0dd` | Card and input borders, dividers |

Sections alternate Paper 0, Paper 50, Paper 100 in that order down a page, restarting after 100. Two adjacent sections never share a surface unless one is a full-bleed photograph.

### Semantic (animal status only)

| Token | Value | Use |
|---|---|---|
| `--color-green-600` | `#2e7d4f` | Adopted badge fill (white text, 5.05:1) |
| `--color-green-700` | `#23603d` | Adopted badge text on tinted surfaces |
| `--color-amber-600` | `#b57708` | Pending and on-hold badge dot and border only |
| `--color-amber-700` | `#8a5a06` | Pending and on-hold badge text |

Green and amber are never used decoratively, for success messages, for charts, or for links. Form success uses Charcoal on Paper 100 with a tick icon.

### Verified pairings (WCAG 2.2 AA; normal text needs 4.5:1, large text 3:1)

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| Charcoal 900 | Paper 0 / 50 / 100 | 10.86 / 10.25 / 9.58 | Pass |
| Charcoal 700 | Paper 0 / 50 / 100 | 7.23 / 6.82 / 6.37 | Pass |
| Charcoal 550 | Paper 100 / Paper 0 | 4.70 / 5.33 | Pass |
| Charcoal 500 | Paper 0 | 4.54 | Pass (normal text) |
| Charcoal 500 | Paper 50 / 100 | 4.29 / 4.01 | Large text only |
| Charcoal 300 | Paper 0 | 2.16 | Decorative only |
| White | Red 600 / Red 700 | 7.00 / 9.56 | Pass |
| Red 600 | Paper 0 / 50 / 100 | 7.00 / 6.60 / 6.17 | Pass (labels and links only, never body) |
| Red 700 | Red 50 / Red 100 | 8.60 / 7.41 | Pass |
| White | Green 600 | 5.05 | Pass |
| Green 700 | Paper 0 | 7.47 | Pass |
| Amber 700 | Paper 0 / 100 | 5.92 / 5.22 | Pass |
| Amber 600 | Paper 0 | 3.75 | Fail as text; dot and border only |
| White on hero scrim (Charcoal 900 at 55% over a mid photograph) | | about 5 to 7 depending on the photo | Hero text is additionally given a text shadow and the scrim deepens to 65% under the text block |

Non-text contrast (3:1) is met by Red 600 focus ring on every surface and by Border `#e5e0dd` only against Paper 0 (1.31:1, so borders are not relied on to convey state; inputs use a 2px Charcoal 700 border on focus).

## 3. Typography

| Token | Value |
|---|---|
| `--font-display` | Nunito, system-ui, sans-serif (weights 700, 800, 900) |
| `--font-body` | "Source Sans 3", system-ui, sans-serif (weights 400, 600, 700) |
| `--text-hero` | 48px, line-height 1.15, weight 900 (40px under 640px) |
| `--text-h1` | 36px, 1.15, 800 (32px under 640px) |
| `--text-h2` | 28px, 1.15, 800 |
| `--text-h3` | 22px, 1.3, 700 |
| `--text-lead` | 19px, 1.6, 400 |
| `--text-body` | 16px, 1.6, 400 |
| `--text-small` | 14px, 1.5, 400 |
| `--text-tiny` | 12px, 1.4, 600, letter-spacing 0.06em when used as a caps label |
| Measure | 65ch max for body copy |
| Casing | Sentence case everywhere. The wordmark is lowercase "haart". Caps are used only for the tiny label style, with tracking. |

Fonts are self-hosted through `next/font/google` (which downloads at build and serves from the same origin; no request to Google at runtime), subset to latin, `display: swap`, with size-adjusted fallbacks to hold CLS at zero.

## 4. Spacing, sizing, radii

- Scale: 4, 8, 12, 16, 24, 32, 48, 64px as `--space-1` to `--space-8`.
- Container 1140px, 16px side gutter on mobile, 24px from 640px.
- Section padding 64px vertical (48px under 640px).
- Radii: cards and photos 8px, inputs and buttons 6px, pill 999px reserved for badges and filter chips only.
- Minimum tap target 44 by 44px. Buttons are 44px tall at body size, 48px for the primary donate control.

## 5. Effects and motion

| Token | Value |
|---|---|
| `--shadow-card` | `0 2px 8px rgba(61,61,61,.08)` |
| `--shadow-card-hover` | `0 6px 18px rgba(61,61,61,.14)` |
| `--ring-focus` | `0 0 0 3px rgba(181,8,6,.25)` plus a 2px solid Red 600 outline offset 2px, so the ring survives on red surfaces |
| `--scrim-hero` | `rgba(61,61,61,.55)`, deepening to `.65` under text |
| `--duration-fast` | 150ms (colour, opacity) |
| `--duration-base` | 250ms (interface feedback) |
| `--duration-slow` | 450ms (large entrances, capped at 500ms) |
| Spring | Motion `type: "spring", stiffness: 380, damping: 32` for hover and press; `stiffness: 220, damping: 28` for entrances |

Rules implemented in code:
- Transform and opacity only. No animated height, width, margin or padding anywhere.
- Every entrance uses `whileInView` with `once: true` and a 12px translateY.
- `prefers-reduced-motion: reduce` switches every entrance to an opacity fade of 150ms and disables hover lift, press scale and layout animation. The check runs through Motion's `useReducedMotion`, and a CSS fallback covers the non-JS case.
- Content is visible and interactive before it animates: initial state is `opacity: 0` only when JS is running and the element is below the fold; server-rendered markup has no hidden state.
- No scroll hijacking of any kind. No smooth-scroll library. Anchor links use native `scroll-behavior: smooth` which the reduced-motion query also disables.

## 6. Components

### Primitives (`src/components/ui`)
- **Button**: variants primary (Red 600), secondary (Paper 0 with Charcoal 700 border), ghost, danger-less. Sizes md 44px, lg 48px. Loading and disabled states. Renders as `<a>` when given `href`.
- **Badge**: `status` variant maps available (Charcoal on Paper 100), pending and on hold (Amber 700 text, Amber 600 dot), adopted (white on Green 600), foster needed (Red 700 on Red 50 with Red 100 border). Also `label` variant for categories.
- **Card**: surface, border, radius, shadow, hover lift (transform only) with `Motion` wrapper.
- **Input, Select, Textarea, Checkbox, RadioGroup, Fieldset**: 44px, labels always visible, error text linked by `aria-describedby`, required marked in the label not by colour.
- **Container, Section, Stack, Grid**: layout only.
- **Prose**: typographic defaults for Portable Text.
- **Icon**: Lucide icons at 20 and 24px, `aria-hidden` unless labelled.
- **Image**: wraps `next/image` with the Sanity loader and a fixed aspect ratio so grids never shift.

### Sections (`src/components/sections`, the page-builder blocks)
hero, pageHeader, actionGrid, richText, stepList, iconList, faq, statBand, trustBand, cta, speciesTiles, feeTable, animalGrid, animalListing, fosterNeededStrip, eventsStrip, eventList, storyFeature, articleList, partnerGrid, partnerLogos, priceCards, productGrid, donateWidget, otherWaysToGive, contactDetails, formEmbed, linkList, newsletter, imageWithText, quote.

Each block has a Sanity object schema with content fields only. There is no field for colour, alignment, spacing, width or CSS. Surface alternation is computed from the block's position in the array, not chosen by the editor.

## 7. Imagery

- Photographs carry the emotion; the palette stays quiet around them.
- Animal cards use a 4:3 crop with Sanity's `fit=crop` and `crop=focalpoint` (editors set the hotspot in the Studio, which is content, not styling).
- Hero images 16:9 on desktop, 4:5 on mobile via `<picture>` sources.
- Every image field requires alt text (schema validation), with a description in the Studio explaining what good alt text is for an animal photo.
- Distressing images are flagged with a `sensitive` boolean on the image object; the component renders a blurred placeholder with a "Show image" control and the article gets a content-warning notice above the fold.
