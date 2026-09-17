# Blockers

Things that cannot be resolved without a person, a credential or access this session did not have. Each has a stub or a fallback in the codebase marked `TODO(tristan)`. Nothing here stopped the build.

## Environment (affects the audit and inventory)

| # | Blocker | Impact | Workaround shipped |
|---|---|---|---|
| B1 | The session's egress proxy blocks haart.org.au, www.facebook.com, petrescue.com.au, acnc.gov.au, abr.business.gov.au, savour-life.com.au, perfectpets.com.au, mygivingcircle.org and web.archive.org. Only web search worked. | No page could be rendered, no image downloaded, no CSS read, no Wayback comparison. Verbatim copy is limited to passages the search index quotes. | `scripts/crawl-inventory.ts` crawls both hosts, extracts verbatim copy, media dimensions and CSS colours, and fills `docs/content-inventory.json` and `docs/media-manifest.json`. Run it once from a normal connection. The audit tags every claim verified, reported or inferred. |
| B2 | The Facebook connector on this session is unauthorised, so the page's About, posts and events could not be read directly. | Facebook voice review relied on indexed post titles. | Authorise the connector in claude.ai settings, or run the crawl script's Facebook step manually. |
| B3 | Lighthouse, axe and contrast measurements of the live site were not possible. | Mobile, performance and accessibility findings are inferred. | Checklist in `docs/audit.md` section 7. |

## Facts only HAART can confirm (do not publish until ticked)

| # | Item | What was found | Source and date | Needs |
|---|---|---|---|---|
| F1 | ABN | `61 836 601 234` | SavourLife rescue directory (republishes HAART's own listing); ABN Lookup has a record for the number but the entity name on it was not readable from here | Confirm on abr.business.gov.au that it resolves to *Homeless And Abused Animal Rescue Team Association Inc*. Stored in `siteSettings.abn` as unverified. |
| F2 | ACNC registration | Registered as *Homeless And Abused Animal Rescue Team Association Inc*, register ID `e71ee1f8-38af-e811-a962-000d3ad24a0d`, Annual Information Statements filed at least for 2019 and 2022 | ACNC register index | Confirm current status, registration date and charity size. |
| F3 | DGR endorsement | Not stated anywhere. Legacy sponsorship page says kennel sponsorship "is a great way to be tax effective" | haart.org.au/sponsor-kennel/ | Confirm whether HAART is a Deductible Gift Recipient. The donate page copy has two variants; the wrong one is a compliance problem. `siteSettings.dgrEndorsed` defaults to false and the "tax deductible" line does not render until it is true. |
| F4 | Bank details for direct deposit | Not indexed (BSB, account number, reference format) | haart.org.au/donate/ | Provide, or confirm they should not be published. Field exists in `siteSettings.bankDetails`, empty. |
| F5 | Containers for Change scheme ID | Mentioned ("donate the proceeds to HAART with our scheme ID") but the ID value was not in the index | haart.org.au/donate/ | Provide the C-number. Field `siteSettings.containersForChangeId`. |
| F6 | Dog adoption fee policy | Cats: "$200 and this includes vet check, vaccinations, flea and worming, microchipping and sterilisation". Dogs: per-animal (Tazzie "$625"), plus PetRescue says "reduced adoption fees when adopting multiple animals together" | haart.org.au listing pages; PetRescue group 10046 | Confirm the current dog fee bands (puppy, adult, senior) and the multi-animal discount so the adopt page can state a range. Mock data uses $625 adult, $200 cat. |
| F7 | Animal ID collision | Maxi and Tazzie are both listed as HD25-003 | haart.org.au/adopt/dogs/maxi-hd25-003/ and /tazzie-hd25-003/ | Which is correct. |
| F8 | Stale listings | Charlotte HC20-011, Wayne HC21-027 and Artie HD21-041 are still live as adoptable | haart.org.au | Confirm whether they are still in care. The import marks them `status: unknown`. |
| F9 | Contact details | info@haart.org.au and 08 6336 9410 on the site; fundraising@haart.org.au on a third-party event listing | haart.org.au/contact/; perthisok.com | Confirm which addresses are monitored and whether the phone is still current. No postal address was found; confirm whether one should be published. |
| F10 | Founding date | "founded in January 2012" | MyGivingCircle profile, which republishes HAART's own text | Confirm. |
| F11 | Official Instagram | Two accounts: @h.a.a.r.t (175 followers) and @haart_perth (839 followers) | Instagram index | Which is official. `siteSettings.social.instagram` holds @haart_perth as unverified because it is the more active. |
| F12 | Logo | No vector logo was retrievable. The Drive file `haart.png` is a Pet Fresh in-store poster, not a logo | Google Drive "Images for Customer Display" | Supply the original vector. The site renders a typographic wordmark until then. |
| F13 | Privacy policy and terms | Not found on the site | haart.org.au | The build ships a draft privacy policy written for the Australian Privacy Principles, marked draft. A committee member must read and adopt it before launch. |
| F14 | Surrender policy | Not found on the site; PetRescue mentions responsible rehoming of private surrenders and free desexing for accidental litters | PetRescue | Confirm the surrender process and whether a surrender form should exist. Page stubbed. |
| F15 | Foster support specifics | Nothing on the site about who pays vet bills, food, equipment or the typical duration | haart.org.au/foster/ | Confirm. The foster page ships with the industry-standard answers marked "confirm" in Sanity. |
| F16 | Kennel sponsorship | "10 kennels", "starts at $2500 a year with discounts for 2 and 3 year options" | haart.org.au/sponsor-kennel/ (legacy) | Confirm still offered and current pricing. Odd for a foster-based rescue to have ten kennels; may refer to a boarding partner arrangement. |
| F17 | Fundraising products | Goodwill Wines ($20 a case), Entertainment Book (20%), HAART Online Auction Facebook page | legacy pages, Facebook | Confirm which are current and supply links. |
| F18 | Newsletter provider | "Sign up to be the first to hear about news and events!" | haart.org.au | Which provider (Mailchimp, etc.) and the form action or API key. Stubbed as a Sanity-editable embed URL. |
| F19 | Event venue | Rock Music Bingo at "4, The Esplanade, Mt Pleasant" with no date | haart.org.au | Superseded by the events feed; nothing to do unless the feed is unavailable. |

## Credentials and access

| # | Item | Status | Where it plugs in |
|---|---|---|---|
| C1 | Sanity project | Not created. Apply for the non-profit plan (free Growth-tier equivalent, verified within about 14 business days per Sanity docs). | `.env.example`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN` |
| C2 | PetRescue API token | Request via members@petrescue.org.au as PetRescue group 10046. Token-authenticated, not public. | `PETRESCUE_API_TOKEN`, `PETRESCUE_GROUP_ID=10046`. Without it the site serves Sanity animal documents, and in development the mock adapter. |
| C3 | Facebook events iCal URL | Facebook Pages have no public iCal feed. A page admin must open Facebook Events, choose the "Add to calendar" export, and copy the personal `/events/ical/upcoming/?uid=…&key=…` URL. It lists events that admin has created or responded to, so the admin must respond "Going" to every HAART event. | `FACEBOOK_EVENTS_ICAL_URL`. The cron route reads a sample file when unset. |
| C4 | Cron secret | Generate any random string. | `CRON_SECRET` |
| C5 | Square payment links | Not created. One per product or ticket type, created in the Square dashboard. | `product.squareLink`, `event.ticketLink` fields in Sanity |
| C6 | Stripe Payment Links (or PayPal Giving Fund) | Not created. One-off and monthly links, each with the "cover fees" option handled by a second link or Stripe's built-in option. | `siteSettings.donate.oneOffLink`, `siteSettings.donate.monthlyLink` |
| C7 | Static map tiles | Needs a provider key. Default is Geoapify static maps (free tier 3,000 requests a day, cached at build so real usage is tiny). MapTiler or Mapbox work with a one-line change. | `MAP_STATIC_API_KEY`, `MAP_STATIC_PROVIDER` |
| C8 | Analytics | Plausible chosen. Site not yet added. | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |
| C9 | Domain and hosting | Not connected. Vercel Hobby is not licensed for commercial use but is fine for a charity; Cloudflare Pages is the alternative. | `NEXT_PUBLIC_SITE_URL` |
| C10 | Mail for form submissions | Forms post to a Next route that forwards by email. Needs a transactional sender (Resend free tier suggested). | `RESEND_API_KEY`, `FORMS_TO_EMAIL` |

## Added during the build

| # | Item | Detail |
|---|---|---|
| F20 | Form field lists | Reconstructed from the audit, not copied from the live forms. Replace with the crawl's `crawl.forms` output. Specific guesses to confirm with HAART: the seven-day call-back promise in the adoption success message; landlord permission as a required question with a "not applicable" option; cat containment options (indoor only, enclosure, free to roam) with no policy statement; fence height as free text with no minimum; the hours-alone and foster-duration bands; the volunteer role list; contact topics including "Surrendering an animal" and "Media"; partnership type "Kennel or program sponsorship" (depends on F16). |
| F21 | Foster page specifics | The "What fostering actually involves" list (vet costs covered, supplies available, two to eight weeks, some driving, a coordinator on the phone) is the industry norm written as HAART's practice. Confirm each line or edit it in the Studio before launch. |
| F22 | Home page numbers | The stat band shows "100% volunteer run, $0 government funding, 0 animals put to sleep for space, rescuing since 2012". The first three are HAART's own statements; 2012 depends on F10. Add real counts (animals rehomed this year) when HAART supplies them. |
| F23 | Sample stories | Four sample articles exist so the story system can be seen working. They are clearly labelled "Sample" and must be deleted or replaced before launch. |
| F24 | Partner names | Three Friends of HAART entries were indexed by description only ("name to confirm" in the seed). The crawl will capture the names and logos. |
| F25 | PetRescue API shape | The adapter's field names, response envelope and `Authorization: Bearer` header are assumptions marked `TODO(tristan)` in `src/lib/animals/petrescue.ts`; verify with the first real response. |
| F26 | Facebook export format | The iCal parser assumes UIDs like `e123@facebook.com`, UTC times, the event page in a `URL:` line and again at the end of `DESCRIPTION`, and `LOCATION` as "Venue, Street, Suburb STATE Postcode". Check the first real feed against `fixtures/sample-events.ics`. |
| F27 | Studio build in this environment | `sanity build` could not complete here because Sanity's auto-update manifest host is blocked by the egress proxy; the Studio typechecks and the config is standard. Build it once from a normal connection. |
| F28 | Newsletter box wording | The home page newsletter block only renders once a signup page URL is set in Site settings (F18). |
