# HAART website and Facebook audit

Prepared 17 September 2026 as the Phase 1 checkpoint for the haart.org.au rebuild.

## How this audit was produced, and what that means for confidence

The build environment's egress proxy blocks direct requests to haart.org.au, facebook.com, petrescue.com.au, acnc.gov.au and web.archive.org. Every finding below was assembled from search-engine indexes of those sites (page titles, URLs and quoted passages), from third-party directories that republish HAART's own descriptions, and from a partner poster found in the connected Google Drive. Nothing was rendered in a browser.

That changes the character of the audit in three ways:

1. **Content, structure and information architecture findings are well evidenced.** Search indexes expose the full URL tree, page titles and substantial verbatim passages. The page inventory in this document is close to complete.
2. **Mobile, performance and accessibility findings are inferred, not measured.** The platform is identifiable from URL and title patterns, and the failure modes of that platform are predictable, but no Lighthouse run, contrast measurement or DOM inspection happened. These findings are marked *inferred* and should be confirmed by running the crawl script described at the end of this document.
3. **Visual branding was assessed from one partner asset and from how the site is described**, not from screenshots. The colour catalogue is therefore a hypothesis to confirm rather than a measurement.

Every claim is tagged **[verified]** (quoted from the source), **[reported]** (a third party's description of HAART), or **[inferred]** (deduced from patterns). The `scripts/crawl-inventory.ts` script in this repository will produce the measured data in a couple of minutes when run from a machine with normal internet access, and `docs/blockers.md` lists every fact that still needs a human eye.

---

## 1. The organisation in one paragraph

HAART (Homeless and Abused Animal Rescue Team) is a Perth, Western Australia rescue founded in January 2012 [reported: MyGivingCircle]. It is incorporated as *Homeless And Abused Animal Rescue Team Association Inc* and registered with the ACNC [verified: ACNC register listing]. It is foster-based with no shelter premises, no-kill, receives no government funding and is run entirely by volunteers [verified: haart.org.au]. It rescues dogs and cats from council pounds and private surrenders, rehomes "hundreds" of animals a year, and offers free desexing to owners who surrender accidental litters [verified: haart.org.au and PetRescue group page]. Its community lives on Facebook: 28,518 page likes against an Instagram following in the low hundreds [reported: search index of facebook.com/haartav].

---

## 2. Findings ranked by impact on the four goals

The four goals are donations, adoptions, foster sign-ups and volunteer recruitment. Each finding names the goal it hurts most.

| Rank | Finding | Goal hit | Confidence |
|---|---|---|---|
| 1 | Donate path has no visible online payment and no visible tax-deductibility or registration statement | Donations | verified (absence in index) plus inferred |
| 2 | Dog and cat availability status is hand-typed into page titles with asterisks, and is inconsistent | Adoptions | verified |
| 3 | Animal listings are triple-entered (site, PetRescue, Facebook) with no sync, producing stale and duplicate records | Adoptions, volunteer workload | verified |
| 4 | Foster is reduced to "a warm bed, a full belly, patience and lots of love" with no answers to cost, time, support or exit | Foster sign-ups | verified |
| 5 | There is no volunteer page at all; "volunteer" resolves to the contact form | Volunteer recruitment | verified (absence in index) |
| 6 | Two generations of the site are live or indexed at once (www and apex, "Inc." and ampersand titles), splitting search equity | All (SEO) | verified |
| 7 | Rescue stories, outcomes and numbers are absent; the site never shows the work | Donations, foster | verified (absence) |
| 8 | Events exist only on Facebook and in third-party listings; the site mentions one bingo night with no date | Donations (fundraisers), volunteers | verified |
| 9 | Corporate sponsorship and fundraising products sit on legacy pages with an old template and http links | Donations | verified |
| 10 | Privacy policy, terms and a surrender policy are not discoverable | Compliance, adoptions | verified (absence) |
| 11 | Branding drifts between the site, Facebook, Instagram and partner materials (three name spellings, two Instagram accounts) | Trust | verified |
| 12 | Likely mobile, performance and accessibility failures of a page-builder WordPress site | All | inferred |

Sections 3 to 6 give the evidence for each.

---

## 3. What works and should be kept

### 3.1 Content with genuine emotional weight or credibility

These passages are HAART's own words and should carry across verbatim or with the lightest edit. They are quoted as indexed.

- **The founding story, in one line.** "A group of like-minded individuals came together from other rescues with the idea of doing things different. From this we have grown to the rescue we are today." [verified: /about-our-rescue-mission/]. Short, plain, believable. It should open the About page.
- **The mission and the ambition to be unnecessary.** "HAART is exclusively no-kill and do not put animals to sleep just because they don't have room." and the goal "to see the day when we are no longer needed", to "put ourselves out of a job", "a day when there are no more homeless animals" [verified: /about-our-rescue-mission/]. The dream line, "Our dream is to see every companion animal in a safe, loving forever home", appears on the site and on partner material [verified: Pet Fresh round-up poster].
- **The funding position.** "HAART is a Not-For-Profit Charitable organisation that saves the lives of hundreds of animals each year, supported only by the generosity of the general public for our funding." and "receives no government funding and is run entirely by a small group of volunteers" [verified: home and about pages]. This is the single strongest donation argument they have and it is currently buried in body copy.
- **The foster model explained.** "We don't have a premises with hundreds of animals awaiting adoption. Instead, we have a team of dedicated foster carers – people just like yourselves – who take scared, abused, and unwanted animals into their homes, give them the gift of life, and love them like their own, until we find them the perfect forever home." [verified: /about-our-rescue-mission/ and /foster/]. And the operational reason: "Fostering an animal before they are adopted allows us to learn their temperament and needs so that we can find them the perfect forever home." [verified: /foster/].
- **Individual animal write-ups.** The dog and cat profiles are honest and specific. Beau "is an anxious dog who needs a very understanding home", his family "will need to be committed to continuing his treatment plan and supporting his anxiety, including medication and vet guidance if needed" [verified: /adopt/dogs/beau-hd26-030/]. Artie "was a hand raised neonate pup", "is dog reactive and currently working with a trainer" [verified: /adopt/dogs/artie/]. Nia "is a 17 year old girl who has spent too long roughing it after being abandoned several times" [verified: /adopt/cats/nia-hc25-024/]. This candour is a trust signal and a filter for suitable adopters. Keep the voice; fix the container.
- **Responsible-rehoming detail on PetRescue.** "offers free desexing for the parents of 'accidental' litters upon the surrender of those litters for responsible rehoming as sterilized animals" and the aim "to advance public knowledge regarding the importance of sterilization, microchipping, vaccination, socialization and training" [verified: PetRescue group 10046]. This is nowhere on the website and belongs on it.

### 3.2 Structures and flows volunteers rely on

- **The pre-adoption questionnaire as the gate.** Dogs and cats each have a questionnaire page under /adopt/, and every animal profile ends by pointing to it [verified]. Third parties describe the same flow: submit the form, a call "within seven days", then "a home check to ensure the home and fencing are suitable" [reported: SavourLife], then "meet and greet with the foster carer, yard check, and further adoption forms" [reported: PetRescue]. The new site must keep a single, obvious questionnaire per species and keep the process description next to it.
- **Separate foster applications per species** at /foster/dogs/ and /foster/cats/, plus a /forms/ index page listing every form [verified]. Volunteers clearly send people to /forms/. Keep a forms index and keep the old URLs redirecting.
- **The animal ID convention.** Every animal carries an ID of the form HD26-051 (HAART Dog, 2026, sequence) or HC26-005 (HAART Cat) [verified across 35 listings]. The same IDs appear on PetRescue listings [verified: "Chief HD18-037", "Zeus HD15-093"]. This is their internal key and must be a first-class field, not part of a title.
- **The "foster carer needed" flag.** Several listings are tagged in the title, e.g. "Maxi HD25-003 **foster carer needed**" and "Sage HD25-031 *FOSTER CARER NEEDED*" [verified]. Volunteers use the adoption listing to recruit fosters for specific animals. This is a real and useful behaviour and should become a proper status with its own call to action.
- **A newsletter capture.** "Sign up to be the first to hear about news and events!" appears across pages [verified]. Provider unknown; see blockers.
- **Containers for Change.** "Take your containers to your local drop off point and donate the proceeds to HAART with our scheme ID" [verified: /donate/]. Passive income with zero admin. Keep, and make the scheme ID copyable.

### 3.3 Voice and tone that feels authentically theirs

- Plain, practical and warm without being sentimental: "people just like yourselves", "give them the gift of life".
- Direct about difficulty: "hand raised neonate", "strict rehab", "adult-only home with no children", "someone who is home most of the time".
- Facebook is louder and more urgent. Indexed post fragments show the register: "*** URGENT FOSTER CARE REQUIRED*** Ryuk is a beautiful male Akita", "UPDATE: Rosie is safe", "GET IN NOW for the early bird special – our legendary quiz night is back for 2025" [verified: indexed post titles]. Capitals and asterisks do the work that typography should. The new site should give this urgency a designed home (a status badge, an urgent-foster strip) so the words can calm down.
- A habit of gentle humour in animal profiles ("Pluto has decided to sleep in today! It's hard work…", "the ringleader of the group") that should survive.

### 3.4 Trust signals present today

| Signal | Where | Status |
|---|---|---|
| ACNC registration as *Homeless And Abused Animal Rescue Team Association Inc* | ACNC register, not the website | Verified on ACNC index; not shown on site |
| ABN 61 836 601 234 | SavourLife directory; ABN Lookup has a record for the number | Reported. Entity name on ABN Lookup not confirmed. Do not publish until checked |
| "Not-For-Profit Charitable organisation", "no government funding", "run entirely by volunteers" | Home, About | Verified |
| Kennel sponsorship "is a great way to be tax effective" | /sponsor-kennel/ (legacy) | Verified wording, but DGR status is not stated anywhere. The claim needs the endorsement checked before it is repeated |
| Named business partners on Friends of HAART (Pet Fresh raw diet, Pawpals Daycare & Parlour, PETstock VET Cannington, a boarding kennel, a photographer, a boutique) | /friends-of-haart/ | Verified |
| Animal profiles with vet work stated ("desexed and vaccinated") and inclusions ("microchipping and sterilisation as well as up to date vaccinations, flea treatment and worming") | Listings | Verified |
| Third-party presence: PetRescue group 10046, SavourLife group 4534, Perfect Pets, MyGivingCircle, listed by Pet Fresh as a supported rescue | External | Verified |
| Facebook scale: 28,518 likes | facebook.com/haartav | Reported |
| Annual quiz night with silent auction, adoption days at Winthrop Village, Christmas photo fundraisers at Pet Fresh stores, a dedicated HAART Online Auction Facebook page (966 likes) | Third-party listings and Facebook | Reported |

Missing trust signals: outcome numbers (animals rehomed this year or ever), foster and adopter testimonials, any photograph-led story of a rescue from intake to adoption, DGR wording, and the registration details in the footer.

---

## 4. What does not work and why

### 4.1 Information architecture

**Verified page tree** (current generation, title suffix "Homeless & Abused Animal Rescue Team"):

```
/                                   Home
/about-our-rescue-mission/          About Our Rescue
/adopt/                             Adopt
/adopt/dogs/                        Dog Adoptions (listing)
/adopt/dogs/{slug}/                 21+ dog profiles found
/adopt/cats/                        Cat Adoptions (listing)
/adopt/cats/{slug}/                 15+ cat profiles found
/adopt/pre-adoption-questionnaire-dogs/
/adopt/pre-adoption-questionnaire-cats/
/foster/                            Foster
/foster/dogs/                       Foster Carer Application - Dogs
/foster/cats/                       Foster Carer Application - Cats
/forms/                             Forms (index of every form)
/donate/                            Donate
/contact/                           Contact Us
/friends-of-haart/                  Friends of HAART (partner directory)
(shop)                              A shop with a cart icon is in the header; URL not indexed
(nav)                               "Once Off Donation" and "Regular Giving" appear as navigation items
```

**Legacy page tree** (previous generation, title suffix "Homeless and Abused Animal Rescue Team Inc.", served from www and in two cases indexed over http):

```
https://www.haart.org.au/sponsor-kennel/          Sponsor a Kennel
http://www.haart.org.au/sponsorship-application/  Sponsorship Application
https://www.haart.org.au/goodwill-wines/          Goodwill Wines
http://www.haart.org.au/adoption-gallery-cats/    Adoption Gallery - Cats
```

Problems, in impact order:

1. **The money pages are the least developed pages.** /donate/ is indexed with three ideas: supplies "such as food, litter and bedding", the Containers for Change scheme, and two navigation labels ("Once Off Donation", "Regular Giving") whose destination is not indexed. No online payment button, amount, bank details, receipt statement or deductibility line was found in the index [verified absence; a JavaScript-rendered widget would also be invisible to the index, so confirm with the crawl]. Kennel sponsorship (from $2,500 a year, ten kennels, discounts for two and three years), Goodwill Wines ($20 a case), the Entertainment Book (20% to HAART) and the HAART Online Auction are scattered across legacy pages and Facebook, not gathered under one support section.
2. **Foster is a form, not a page.** /foster/ is one paragraph plus links to two application forms. The real objections (What does it cost me? Who pays the vet? How long? What if it doesn't work out? Can I foster with kids or my own dog? Do you supply food and a crate?) are unanswered. For a foster-based rescue this is the page that determines capacity.
3. **Volunteer has no home.** Searches for volunteer resolve to Home, Contact and Donate. Anyone wanting to help without fostering has to email.
4. **Adopt is split by species with no cross-navigation signals**, and the cats side still has a legacy gallery page indexed alongside the current one.
5. **/forms/ is doing the job of a menu.** Useful as a fallback, but it exists because the primary navigation does not surface the forms where people need them.
6. **Friends of HAART is a directory of partners with no ask.** It should be the corporate and community partnership page, with the kennel sponsorship offer on it.
7. **About is titled "About Our Rescue Mission"** at a slug (/about-our-rescue-mission/) that reads as SEO padding and will need a redirect.

### 4.2 Conversion blockers on the donate, adopt and foster paths

**Donate**
- No visible instant payment path in the index, and two donation labels in the navigation that may lead to a plugin form (inferred: a WordPress donation plugin or PayPal button; must be confirmed).
- No statement of DGR status or what a receipt looks like. If HAART holds DGR endorsement, this is a free conversion lift. If it does not, the "tax effective" line on the sponsorship page is a liability. Either way the current site is silent.
- Recurring giving is a navigation label with nothing indexed behind it.
- The strongest argument ("no government funding", "run entirely by volunteers") is body copy, not a headline near the button.

**Adopt**
- **Status lives in titles.** Examples verified from the index: "Maxi HD25-003 **foster carer needed**", "Sage HD25-031 *FOSTER CARER NEEDED*", "Grace Kelly HC26-005 *On Hold**", "John Wayne HC26-002 ** On Hold **", "Nia HC25-024 ** On Hold**". Four different asterisk patterns, two capitalisation patterns, and one title with mismatched asterisks. A visitor cannot filter by status, a screen reader announces the asterisks, and search snippets show the mess.
- **No filters.** The dog listing is a page of child pages. Nothing indexed suggests filtering by size, age, good-with-kids or good-with-cats, which the profiles themselves talk about constantly.
- **Stale listings.** Charlotte HC20-011 (a 2020 intake) and Wayne HC21-027 (2021) are still indexed as adoptable cat pages. Artie HD21-041 is a 2021 dog. Some may genuinely still be in care; others are almost certainly adopted with the page left up. The site cannot tell the difference and neither can a visitor.
- **Duplicate and broken IDs.** Maxi and Tazzie both carry HD25-003. Rosemary is "HD26-44" (not zero-padded) and Indi is "HD26 - 065" (spaces). Poppy's page slug is /adopt/dogs/3380-2/, which is WordPress's fallback when a page is created without a title, and Sabrina's is /sabrina-hc25-028-2/, a duplicate-slug suffix. These are symptoms of manual entry with no validation.
- **Fees are inconsistent in placement.** Cats have a standard fee ("$200 and this includes vet check, vaccinations, flea and worming, microchipping and sterilisation") stated on the listing page. Dogs have no page-level fee; each profile carries its own (Tazzie: "Adoption Cost: $625"). PetRescue also mentions "reduced adoption fees when adopting multiple animals together", which the site does not. An adopter comparing two dogs has to open both pages.
- **Triple entry.** Every animal is written up on haart.org.au, again on PetRescue (same ID convention), and again on Facebook. Nothing links them. The most likely reason the site is stale is that PetRescue and Facebook get the update and the site does not.

**Foster**
- The application forms are the whole page. Nothing reduces anxiety before the form.
- "Foster carer needed" animals are findable only by scanning titles. There is no "these animals need a foster this week" surface, which is exactly what Facebook posts do with "*** URGENT FOSTER CARE REQUIRED***".

### 4.3 Mobile experience [inferred]

The site is a WordPress build (see 4.7). The specific failure modes cannot be confirmed without rendering, but the following are the characteristic ones for this class of site and each is a checklist item for the crawl:

- Header with a cart icon, donation items and a multi-level menu will collapse to a hamburger that hides Donate on mobile, the one link that should never be hidden.
- Animal profile pages built from page-builder columns typically stack a large hero photo above the text, pushing the name, status and fee below the fold.
- Embedded forms (pre-adoption questionnaire, foster application) from a forms plugin frequently render with fixed widths and small tap targets.
- Legacy pages on www use an older theme, so the site changes appearance mid-journey when a visitor follows a sponsorship link.

### 4.4 Performance [inferred]

- Volunteer-uploaded phone photographs at original resolution are the norm on rescue WordPress sites. Every dog page is likely to ship one or more multi-megabyte JPEGs.
- Page-builder themes load their full CSS and JavaScript on every route, including the contact page.
- Two hostnames (www and apex) indexed with both http and https means at least one redirect hop on some entry URLs and split caching.
- No CDN evidence in the index. (Cannot be confirmed either way.)

### 4.5 Accessibility [inferred, with two verified items]

- **Verified:** decorative asterisks and capitals in page titles ("** On Hold **") are announced by screen readers and are the only status cue.
- **Verified:** page titles are duplicated between the visible H1 and the `<title>` with the site name appended, so the "Rosemary HD26-44" pattern puts an internal ID before the animal's name in the document outline.
- Inferred: heading order is unlikely to be sequential on page-builder pages (widgets often start at H3 or H4); colour contrast of red text on cream (the pattern on the partner poster, where body copy is set in red) fails AA for normal text; focus states are usually suppressed by theme resets; alt text on volunteer-uploaded photos defaults to the filename.

### 4.6 Stale, duplicated or contradictory content

| Item | Evidence | Action |
|---|---|---|
| Two site generations live | "Homeless & Abused Animal Rescue Team" vs "Homeless and Abused Animal Rescue Team Inc." title suffixes; www vs apex; http vs https | Redirect every legacy URL to its replacement, one canonical host |
| Cat listings duplicated | /adopt/cats/ and legacy /adoption-gallery-cats/ both indexed | Redirect legacy to /adopt/cats/ |
| Kennel sponsorship in two places | /sponsor-kennel/ and /sponsorship-application/ on legacy; Friends of HAART on current | Merge into one partnership page with the application |
| Animal ID collisions | Maxi and Tazzie both HD25-003 | Human confirmation needed |
| 2020 and 2021 animals still listed | Charlotte HC20-011, Wayne HC21-027, Artie HD21-041 | Human confirmation needed |
| Fee placement | Cat fee on listing page; dog fees per profile | Structured fee field per animal plus a species default |
| "Rock Music Bingo" event on the site with no date, at "4, The Esplanade, Mt Pleasant" | Indexed on the home or donate page | Replace with the automated events feed |
| Founding date | Not on the site; "January 2012" only on MyGivingCircle | Confirm with the committee and add to About |
| Three name spellings | "HAART", "H.A.A.R.T" (Facebook, Instagram), "haart" (wordmark in the brief) | Pick one per context and document it |
| Two Instagram accounts | @h.a.a.r.t (175 followers) and @haart_perth (839 followers) | Confirm which is official; the site should link one |

### 4.7 Platform identification

The current site is **WordPress** [inferred with high confidence]. Evidence: the "Page | Site Name" title pattern; hierarchical page slugs (/adopt/dogs/artie/); the fallback slug /3380-2/ and the duplicate-slug suffix /-2/, both WordPress behaviours; a shop with a cart icon (WooCommerce); separate "Forms" pages; and mixed www/apex, http/https canonicalisation typical of a migrated WordPress install.

The animal listings are **native WordPress pages, not an API feed** [verified from URL structure]. The "rescue platform" the brief anticipates is **PetRescue** (group 10046), where HAART also lists animals with the same IDs [verified]. PetRescue offers a token-authenticated REST API (`GET /api/listings`, `GET /api/listings/:id`, breeds and species endpoints) that member groups request through members@petrescue.org.au [verified: petrescue.com.au/api/docs]. It is not a public feed. The implication for Phase 4 is recorded in `docs/decisions.md`: build a typed listing adapter for the PetRescue API, ship it against mock data, and give Sanity a `dog` and `cat` document type as the fallback and as the place for the extra fields PetRescue does not hold.

### 4.8 Where the site undersells the work

- "Hundreds of animals each year" is the only number on the site. There is no count of rescues, adoptions, fosters active, vet bills paid or years operating.
- No rescue story exists as a page. The stories are in Facebook posts ("UPDATE: Rosie is safe", the hand-raised "Halloween kittens") and they evaporate in the feed.
- The Friends of HAART page lists partners but never says what the partnership funded.
- The free-desexing offer for accidental litters is one of the most useful things they do for the community and it is on PetRescue only.
- The quiz night, the online auction, adoption days and the Pet Fresh Christmas photo fundraisers are recurring, well-attended and invisible on the site.

---

## 5. Branding consistency analysis

### 5.1 Catalogue

Because pages could not be rendered, this is built from the one partner asset available (Pet Fresh's in-store "Would you like to Round up for HAART?" poster, a Canva design dated July 2022 found in the connected Google Drive), from how the site and Facebook page are described, and from the draft token set. The crawl script captures every colour, font-family and button class from the live CSS so this table can be corrected.

| Element | Website (inferred) | Facebook / Instagram (reported) | Partner poster (verified, sampled) | Draft tokens |
|---|---|---|---|---|
| Primary red | Used as large section fills and heading colour (typical of the theme class) | Profile and cover imagery are photo-led; red appears in overlay graphics | `#b00800` (sampled, dominant non-neutral) | `#b50806` Red 600 |
| Charcoal | Body text | n/a | `#383838` | `#3d3d3d` Charcoal 900 |
| Background | White; legacy pages likely a different tint | White (platform) | `#f8f0f0` warm cream | `#faf8f6` Paper 50 |
| Red used as text colour | Likely on headings | n/a | Yes, body copy set in red on cream (fails AA for regular weight) | Rule: never body copy in red |
| Display type | Theme default (unknown) | Platform | Rounded geometric sans (Canva "Quicksand"-like) for the subhead, a grotesk for the headline, a bold humanist sans for the emphasis paragraph: three families on one poster | Nunito |
| Body type | Theme default (unknown) | Platform | Arial/Helvetica in the footer bar | Source Sans 3 |
| Name | "Homeless & Abused Animal Rescue Team" (current), "Homeless and Abused Animal Rescue Team Inc." (legacy), "HAART" | "H.A.A.R.T (Homeless and Abused Animal Rescue Team)" on Facebook; "@h.a.a.r.t" and "@haart_perth" on Instagram; "HAART Perth" on X | "HAART" and "HAART.ORG.AU" | "haart" lowercase wordmark |
| Logo | Not retrievable | Not retrievable | Absent from the poster | Not supplied. **Needs the original vector from the committee** |
| Buttons | Theme default; probably pill or square with red fill | n/a | Black pill footer bars with white text | 6px radius, red fill, no pill |
| Status flags | Asterisks and capitals in titles | Asterisks and capitals in posts | n/a | Semantic green and amber badges |

### 5.2 Inconsistencies, stated explicitly

1. **Name.** Five spellings across properties (HAART, H.A.A.R.T, haart, "Homeless & Abused…", "Homeless and Abused… Inc."). The dotted form on Facebook and Instagram is the one their audience sees most. Recommendation: the wordmark is lowercase "haart" as briefed; the spelled-out name is "Homeless and Abused Animal Rescue Team" with "and", never an ampersand, in running text; the legal name "Homeless And Abused Animal Rescue Team Association Inc" appears only in the footer beside the ABN. The dotted form is retired on the website but not fought on social handles, which cannot easily change.
2. **Two Instagram accounts.** One of @h.a.a.r.t and @haart_perth is stale or unofficial. The site must link exactly one. Logged as a blocker.
3. **Red as a canvas versus red as an accent.** The partner poster sets whole paragraphs in red on cream and drops red blobs into every corner. It reads as busy rather than urgent, and the two emphasis paragraphs compete with the headline because everything is loud. The website, from its class of theme, almost certainly does the same with full-width red section backgrounds and red headings. Red applied as a background fill flattens hierarchy because the eye cannot find the button when the whole band is the button's colour. The draft rule (red is an accent, never a full-bleed background, never body copy) is correct and the poster is the proof.
4. **Type.** At least three typefaces on one partner poster and an unknown theme stack on the site. The token set's two-family system (Nunito display, Source Sans 3 body) is a clear improvement, and Nunito's rounded terminals are close enough to the rounded sans partners already reach for that the change will feel like a tidy-up rather than a rebrand.
5. **Cream versus white.** The poster's `#f8f0f0` is pinker than the draft Paper 50 `#faf8f6`. Both are warm off-whites. The draft is the better choice because it stays neutral under photographs of every coat colour; a pink-leaning cream fights with brindle and red dogs.
6. **Status presentation.** Asterisks on the site, capitals on Facebook. The semantic tokens (Green 600 adopted, Amber 600 pending) plus a red "foster carer needed" treatment replace both.

### 5.3 Where the existing red is a background fill, and whether that helps

Not measurable from here; the crawl will list every element with a red background. The assessment stands regardless: in the partner material red is used as decoration in every corner and as body text, and it flattens the page. On the rebuilt site, red belongs on the primary button, the active navigation item, the urgent-foster badge, small caps labels and the focus ring. Section rhythm comes from Paper 0, 50 and 100 alternating, and photographs carry the emotion.

### 5.4 Legacy assets to replace rather than reuse

- Any raster logo pulled from the website header. Request the original vector (AI, SVG or PDF) from whoever made it. If none exists, the wordmark is rebuilt from the token type.
- The legacy-template pages' hero images (sponsor a kennel, Goodwill Wines), which will be at old-theme dimensions.
- Facebook cover photo composites with baked-in text.
- The partner poster's typographic system.
- Any "Donate" button graphic that is an image rather than a control.

### 5.5 Token adjustments recommended

The token draft survives the audit with two small changes and one addition; the reasoning is in `docs/design-system.md`.

1. **Charcoal 500 `#767676` fails AA for normal text on both tints: 4.01:1 on Paper 100 and 4.29:1 on Paper 50.** It passes only on pure white (4.54:1). Use it for large text (19px and above, or 14px bold) on tints, and add a "Charcoal 550" `#6b6b6b` (4.70:1 on Paper 100, 5.33:1 on white) for small muted text such as captions and metadata.
2. **Add an "urgent" treatment for foster-needed animals** using Red 100 surface and Red 700 text, so urgency is visible without another hue.
3. **Amber 600 `#b57708` cannot carry text.** It measures 3.75:1 on white, so it fails AA as a text colour and as a fill under white text. Keep Amber 600 for the badge dot and border, and add an "Amber 700" `#8a5a06` (5.92:1 on white, 5.22:1 on Paper 100) for the badge label. Green 600 passes as text (5.05:1 on white) and as a fill under white text, so the adopted badge needs no extra step.

---

## 6. Facebook page review

Direct access was blocked, so this is assembled from indexed post titles, third-party republication and the page's indexed summary.

- **Scale.** 28,518 likes and 982 "talking about this" at index time [reported]. Compare with the website, which the search index treats as roughly twenty pages of substance. Facebook is where the organisation lives.
- **Content mix visible in the index.** Urgent foster appeals ("*** URGENT FOSTER CARE REQUIRED***"), lost-and-found updates ("UPDATE: Rosie is safe… Avon Valley"), animal personality posts ("Pluto snoring… Pluto has decided to sleep in today!"), event promotion ("our legendary quiz night is back for 2025", the COVID-era "It's on! Covid restrictions means it will be a smaller event"), and a separate **HAART Online Auction** page (966 likes) that runs fundraising auctions with photo albums of donated items [reported].
- **Events.** The annual quiz night (Bamboozled Quizmasters, tables of eight, raffle, silent auction, BYO food) [reported: Perth Is OK listing, contact fundraising@haart.org.au], adoption days at shopping centres (Winthrop Village, 24 July 2021) [reported], Christmas photo fundraisers in Pet Fresh stores [reported], and Rock Music Bingo at 4 The Esplanade, Mt Pleasant [verified on the site, undated]. Facebook Events is the system of record and the website should mirror it automatically (Phase 4).
- **Voice.** Faster, warmer and more capitalised than the website. This is the voice; the website's job is to give it structure.
- **Feed availability for the events integration.** Facebook Pages do not publish a public iCal feed. The only iCal export Facebook provides is a per-user "upcoming events" export at a keyed URL (`/events/ical/upcoming/?uid=…&key=…`) that covers events the user has created or responded to [verified: Facebook help and third-party documentation]. The workable, terms-compliant approach is for one page admin to generate that keyed URL and store it as an environment secret; the cron route polls it. This is recorded as a decision with its trade-offs.

---

## 7. What to run when back at a normal connection

`scripts/crawl-inventory.ts` (Phase 2 deliverable) will, in one run against the live site:

1. Fetch the sitemap and every reachable page on both hosts, recording status codes and redirect chains.
2. Save every page's HTML and extract title, meta description, H1 to H6 order, main-content text, links, forms and field names.
3. Download every image, recording dimensions, bytes, format and alt text, and flag anything under 1200px on the long edge.
4. Collect every colour, font-family and button class from the loaded stylesheets, and list elements with a red background.
5. Write the results into `docs/content-inventory.json` and `docs/media-manifest.json`, filling the fields this audit could only partly populate.

Run Lighthouse on mobile for /, /adopt/dogs/, one dog profile, /foster/ and /donate/ at the same time; the inferred findings in 4.3 to 4.5 become measured ones.
