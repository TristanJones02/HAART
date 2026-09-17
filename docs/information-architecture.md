# Information architecture and page inventory

Phase 3 checkpoint. The site is organised around the four actions the audit identified as the reason the site exists: donate, adopt, foster, and volunteer and support. Everything else is supporting content and is either folded into one of those paths or dropped.

## 1. Principles

1. **Donate is one tap from anywhere.** A persistent primary button in the header on every breakpoint, never inside the hamburger. On mobile the header shows the wordmark, Donate, and the menu button; nothing else.
2. **Status is a badge, never a title.** Every animal has a `status` and a `fosterNeeded` flag. Listings filter on them. The words "on hold", "adopted" and "foster carer needed" never appear in a heading.
3. **One entry point per application.** Four forms (adopt dogs, adopt cats, foster dogs, foster cats) with stable URLs and a plain index at /forms, because volunteers send people there.
4. **Old URLs keep working.** Every path from both site generations redirects (see `redirects.ts`). Animal slugs follow `name-haartid` so most existing profile URLs do not change at all.
5. **Nothing renders empty.** The events strip, the foster-needed strip and the stories feature render only when there is content, so a quiet week does not produce a page of "no events" boxes.
6. **The voice does not get louder than the design.** Urgency comes from the red badge and the strip position, so the copy can stay in sentence case.

## 2. Primary navigation

| Label | Route | Notes |
|---|---|---|
| Adopt | /adopt | Dropdown on desktop: Dogs, Cats, How adoption works, Apply |
| Foster | /foster | |
| Volunteer | /volunteer | |
| Support | /support | Dropdown: Shop, Events, Partners, Other ways to give |
| Stories | /stories | |
| About | /about | Dropdown: About HAART, Contact, Surrendering an animal |
| **Donate** | /donate | Primary button, always visible |

Footer: contact details, ABN and ACNC line (once verified), Forms, Privacy, social links, newsletter signup, acknowledgement of country.

## 3. Page inventory

Legend for "From": the old page(s) this replaces. "New" means nothing on the current site does this job.

### Conversion path 1: Donate

| Route | Page | From | Purpose | Sections (page builder blocks) |
|---|---|---|---|---|
| /donate | Donate | /donate/, nav items "Once Off Donation" and "Regular Giving" | The single money page. One-off and monthly with equal weight, amount presets, cover-the-fees toggle, the funding line, then every other way to give. | pageHeader, donateWidget, statBand, otherWaysToGive, faq |
| /donate/thank-you | Thank you | New | Landing page for Stripe's post-payment redirect. Fires the `donation_completed` event. Shares one story. | pageHeader, richText, storyFeature |

Dropped from this path: nothing. Bank transfer, Containers for Change and supplies move onto /donate as blocks instead of being scattered.

### Conversion path 2: Adopt

| Route | Page | From | Purpose | Sections |
|---|---|---|---|---|
| /adopt | Adopt | /adopt/ | How adoption works in four steps, fees per species with inclusions, the two species tiles, FAQ. | pageHeader, speciesTiles, stepList, feeTable, faq, cta |
| /adopt/dogs | Dogs | /adopt/dogs/ | Listing with filters: status, age band, size, good with kids, cats, dogs. Sort by newest. | pageHeader, animalListing |
| /adopt/cats | Cats | /adopt/cats/, legacy /adoption-gallery-cats/ | Same component, species filter fixed. | pageHeader, animalListing |
| /adopt/dogs/[slug], /adopt/cats/[slug] | Animal profile | /adopt/dogs/{slug}/ etc. | Photo gallery, status badge, at-a-glance facts (age, sex, size, breed, good-with), fee with inclusions, the write-up verbatim, foster-needed call to action when flagged, apply button, share. Adopted animals keep their page with an "adopted" badge and a link to the listing (no 404s, no dead ends). | (route-rendered, not page builder) |
| /adopt/apply/dogs, /adopt/apply/cats | Pre-adoption questionnaire | /adopt/pre-adoption-questionnaire-dogs/, -cats/ | The questionnaire, with the process explained above the form and a `?animal=` parameter that pre-fills the animal of interest. | pageHeader, formEmbed |

Dropped: the legacy cat gallery (merged).

### Conversion path 3: Foster

| Route | Page | From | Purpose | Sections |
|---|---|---|---|---|
| /foster | Foster | /foster/ | The proper page. Keeps every existing sentence, then answers cost, time, support, what happens if it doesn't work out, kids, own pets, renting. Shows animals needing a foster now. | pageHeader, richText, iconList, faq, fosterNeededStrip, cta |
| /foster/apply/dogs, /foster/apply/cats | Foster application | /foster/dogs/, /foster/cats/ | The form, with `?animal=` pre-fill. | pageHeader, formEmbed |

### Conversion path 4: Volunteer and support

| Route | Page | From | Purpose | Sections |
|---|---|---|---|---|
| /volunteer | Volunteer | New | Roles that are not fostering: transport, events, admin, photography, fundraising, home checks. Expression-of-interest form. | pageHeader, richText, iconList, faq, formEmbed, cta |
| /support | Other ways to support | Home fundraising block, /goodwill-wines/, Entertainment Book | Hub: fundraiser products (Goodwill Wines, Entertainment Book, online auction), Containers for Change, wishlists, workplace giving, bequests, links to shop, events, partners. | pageHeader, productGrid, richText, linkList |
| /shop | Shop | Header shop (WooCommerce, products not indexed) | Merchandise with Square payment links. Missing link renders as "coming soon" not a dead button. | pageHeader, productGrid |
| /events | Events | Home "Rock Music Bingo" block, Facebook Events | Automated from the Facebook iCal feed. Upcoming first, then a short past list. Cards link to Facebook. | pageHeader, eventList |
| /partners | Partners and sponsors | /friends-of-haart/, /sponsor-kennel/, /sponsorship-application/ | The partner directory plus the corporate offer and a partnership enquiry form. | pageHeader, partnerGrid, richText, priceCards, formEmbed |
| /partners/apply | Partnership enquiry | /sponsorship-application/ | Form. | pageHeader, formEmbed |

### Supporting content

| Route | Page | From | Purpose | Sections |
|---|---|---|---|---|
| / | Home | / | Hero with one sentence and two buttons (Adopt, Donate); the four actions; foster-needed strip (conditional); latest animals; events strip (conditional, 14 days); one story; stat band with the funding line; partner logos; newsletter. | hero, actionGrid, fosterNeededStrip, animalGrid, eventsStrip, storyFeature, statBand, partnerLogos, newsletter |
| /about | About HAART | /about-our-rescue-mission/ | The founding line, the mission, how the foster model works, the free-desexing offer, registration details, numbers when supplied. | pageHeader, richText, stepList, statBand, trustBand, cta |
| /stories | Rescue stories | New (Facebook posts today) | Article index with category and series filters. | pageHeader, articleList |
| /stories/[slug] | Article | New | Featured image, author, category, series navigation, body, related, share, JSON-LD. Optional content warning gate for distressing imagery. | (route-rendered) |
| /stories/category/[slug], /stories/series/[slug] | Category and series | New | Filtered indexes. Series pages carry the series description and part order. | (route-rendered) |
| /stories/feed.xml | RSS | /feed/ | For anyone who still uses it and for Facebook link preview debugging. | (route) |
| /contact | Contact | /contact/ | Details, a "which form do you need" router, general form. | pageHeader, contactDetails, formEmbed |
| /forms | Forms | /forms/ | Plain index. | pageHeader, linkList |
| /surrender | Surrendering an animal | New (PetRescue text only) | The responsible-rehoming process, free desexing for accidental litters, what to expect. Stub for confirmation. | pageHeader, richText, faq, cta |
| /privacy | Privacy policy | New | Draft written for the Australian Privacy Principles covering forms, donations, analytics and photographs of adopted animals. Must be adopted by the committee. | pageHeader, richText |

### Dropped, with reasons

| Old page | Decision | Reason |
|---|---|---|
| /sponsor-kennel/ and /sponsorship-application/ | Merged into /partners | Three pages described one relationship across two site generations. |
| /goodwill-wines/ | Merged into /support as a product card | One page per affiliate product is more navigation than content. |
| /adoption-gallery-cats/ | Merged into /adopt/cats | Duplicate. |
| "Rock Music Bingo" block on the home page | Dropped | Undated, hand-maintained; replaced by the automated feed. |
| WooCommerce cart, checkout, account | Dropped | Square hosted checkout replaces them; no accounts on the site. |

### Not created, with reasons

- **Team page.** Nothing on the current site names committee members or fosters, and the audit found no evidence that the organisation wants that exposure. A `person` type exists only for article bylines. Easy to add later.
- **Lost and found.** Facebook does this well ("UPDATE: Rosie is safe") and it needs real-time posting the site should not try to replace.
- **Event detail pages.** Cards link to the Facebook event as briefed; JSON-LD on the events page uses the Facebook URL.

## 4. Routes and their data sources

| Route family | Source | Fallback |
|---|---|---|
| Animal listings and profiles | PetRescue API adapter (when token set) | Sanity `animal` documents, then mock in development |
| Events | Sanity `event` documents written by the iCal sync route | Sample fixture in development; nothing rendered in production if empty |
| Pages | Sanity `page` documents with a `sections[]` array | Seed content from the inventory import |
| Articles, categories, series, people | Sanity | Seeded with one welcome article and the default author |
| Products, partners | Sanity | Seeded from the inventory |
| Site settings | Sanity singleton | Seeded from the inventory with verified flags |

## 5. URL conventions

- Lowercase, hyphenated, no trailing slash, no dates in article URLs.
- Animal slug `name-haartid` (e.g. `arabella-hd26-051`); the HAART ID is validated as `H[DC]\d{2}-\d{3}` in the schema.
- Application forms under the path they belong to (`/adopt/apply/dogs`, `/foster/apply/dogs`), so analytics funnels read naturally.
- Query parameters that are honoured: `?animal=<slug>` on application forms; `?frequency=monthly` on /donate; UTM parameters everywhere (never rewritten).
