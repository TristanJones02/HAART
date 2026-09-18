# Running the website: a guide for HAART volunteers

> **Superseded in part.** This project is now an unofficial concept rebuild:
> HAART has not been contacted and has not endorsed it. Forms, donations,
> payments and analytics have been removed, and every route is `noindex`.
> Sections below describing those features no longer match the code. See
> `docs/constraints.md`.

You do not need to be technical to run this website. Everything you change day to day happens in one place, the Studio, and the site updates itself. This guide is organised by task. Screenshots to be added once the Studio is live (they are placeholders below, marked "Screenshot").

## The one address to remember

**haart.sanity.studio** (the exact address is set when the Studio is deployed; it will be written here). Log in with your Google account or email. Ask the committee to invite you if you cannot log in.

The Studio is where content lives. The website reads from it. You never need to touch the website's hosting, code or server.

## Updating an animal

1. Open the Studio, click **Animals**, then the list you want (Available, Needs a foster, Pending or on hold, Adopted).
2. Click the animal. Change the **Status** (Available, Application pending, On hold, Adopted). Tick **Foster carer needed** if the animal needs a carer before it can leave the pound. That is all the website needs to show the right badge.
3. Click **Publish** (bottom right). The website updates within a minute.

Do not put the status in the animal's name. The website ignores asterisks and capitals and shows the status from the field.

*Screenshot: the animal document with the Status radio buttons and the Publish button.*

## Adding a new animal

1. **Animals** → **+** (top). Fill in Name and HAART ID (HD26-051 for dogs, HC26-005 for cats). The web address fills itself.
2. Choose Species and Status. Add a one-line summary (this shows on the card).
3. **Details** tab: breed, age, sex, size, good with children/cats/dogs, fee.
4. **Write-up and photos** tab: paste the write-up, add photos (phone photos are fine), and write alt text for each photo: a short description of what is in the picture, for example "Brindle staffy sitting on grass, tongue out". The Studio will not let you publish without it. Drag the first photo to be the main one.
5. Publish.

If HAART is connected to PetRescue, animals listed there appear on the site automatically. Add them in the Studio only if you need to mark them as needing a foster or attach a story.

## Uploading a lot of photos at once

For one animal, do it in the Studio. For a backlog — a folder or a phone roll
with hundreds of photos in it — there is a command that does the whole lot.
Somebody technical runs it; your part is the alt text.

1. Put the photos in one folder, with a **subfolder per animal named after its
   HAART ID**: `HD26-044/`, `HC25-028/`. A file named `HD26-044 Rosemary 3.jpg`
   works just as well as a folder, and so does the older `hd26 - 44` spelling.
   Photos with no ID anywhere in the name are listed as unsorted rather than
   attached to the wrong animal.
2. They run `pnpm import:photos <folder> --csv`. Nothing is uploaded. It writes
   a spreadsheet, `docs/photo-manifest.csv`, with one line per photo.
3. **Open the spreadsheet and fill in the `alt` column**: a short description of
   what is in the picture, like "Brindle staffy sitting on grass, tongue out".
   This is the one thing the computer cannot do for you, and it is what a blind
   supporter hears instead of the photo. Put `TRUE` in the `sensitive` column
   for any injury or neglect photo; the site keeps those blurred until a reader
   chooses to see them.
4. They run it again with `--execute`. Photos with a description go up; photos
   without one are counted and wait for the next round. Nothing is ever
   uploaded twice, so you can do a hundred at a time and stop whenever.

Two things the command does that are worth knowing. Phone photos are five or
six megabytes each and often sideways; it turns them the right way up and gets
them down to a few hundred kilobytes, so the website stays fast. And it
**deletes the hidden location data** — phone photos record where they were
taken, which for us is usually a foster carer's home address. It also tells you
how many of your photos had it, which is worth knowing before anyone emails a
folder of originals to a stranger.

## When an animal is adopted

Set Status to **Adopted** and Publish. Do not delete the animal. Its page stays up with an "Adopted" badge so links people shared on Facebook keep working, and it is hidden from the listing unless someone ticks "Show adopted".

## Editing a page

**Pages** → choose the page. Each page is a list of sections. You can:

- Edit the text and images in any section.
- Drag sections to reorder them.
- Add a section with **+ Add item** and choose the kind (Text, Steps, Questions and answers, Photo and text, Call to action, and so on).
- Remove a section with the **⋮** menu.

You cannot change colours, fonts, spacing or alignment. That is deliberate: every section looks right wherever it goes.

*Screenshot: a page's Sections list with the drag handles and the Add item button.*

## Events

Events come from the Facebook page automatically. Create the event on Facebook as usual; within six hours it appears on the website's Events page, and on the home page if it is in the next two weeks.

Two things you can do in the Studio under **Events**:

- Paste a **Ticket link** (from Square) to add a "Buy tickets" button.
- Add an **Image** to replace the map on the event card.

**If events stop appearing:** open **Events → Sync status**. It says when the last sync ran and whether it worked. The usual cause is that the Facebook calendar link has expired or belongs to someone who has left. A page admin makes a new one: on Facebook, go to Events, choose "Add to calendar" (the export option), copy the link, and send it to whoever holds the website settings to update. It takes them two minutes.

## Donations and payment links

**Site settings → Donations**. Paste the Stripe links for one-off and monthly giving. Until a link is pasted, the website shows "Online donations are being set up" instead of a broken button. Bank details show on the donate page only when every field (account name, BSB, account number) is filled in. The Containers for Change scheme ID goes in its own field.

**Tax deductibility:** only tick "Deductible Gift Recipient" if the ATO has endorsed HAART. When ticked, the donate page says gifts over $2 are tax deductible. Leave it unticked otherwise; the page says nothing about tax.

## Shop and fundraisers

**Shop and fundraisers** → **+**. Choose the type (merchandise sold through Square, or a fundraiser sold elsewhere like Goodwill Wines). Paste the Square payment link for merchandise (Square Dashboard → Online → Payment links) or the external link for a fundraiser. No link yet? The card shows "Coming soon".

## Stories

**Stories** → **+**. Title, summary (one or two sentences, this is what Facebook shows), main photo with alt text, category, and the story. If the story is about neglect or injury, tick **Show a content warning** and mark the upsetting photos as distressing; readers then choose whether to see them.

To publish a multi-part campaign, create a **Series** first, then set the series and part number on each story.

**Sharing on Facebook:** paste the story's web address. The preview picture and text come from the main photo and summary. To track how a Facebook post performs, add `?utm_source=facebook&utm_campaign=name-of-campaign` to the end of the link before posting. Plausible (the analytics tool) then shows visits from that post.

## Partners

**Partners** → add name, logo, website, a sentence, and whether they are a corporate sponsor, community partner or supplier. They appear on the Partners page and, if they have a logo, in the row on the home page.

## Site settings

Contact details, social links, the menu, the footer, adoption fees and the registration details. The **Verified** tick boxes next to the ABN, ACNC ID and founding year exist because these were copied from public directories, not from HAART's records. Check each one against the official document, then tick Verified. Unticked values are not shown on the website.

## Form submissions

Every form on the website (adoption questionnaires, foster applications, volunteer, contact, partnership) is emailed to info@haart.org.au and a copy is kept under **Form submissions** in the Studio in case an email goes missing. Mark them Done as you go.

## Reading the analytics

Plausible is at plausible.io (login to be shared by the committee). The dashboard shows visitors, top pages, where they came from (Facebook, Google, direct), and the **Goals** panel shows the four things the site exists to do: donations started and completed, adoption enquiries, foster applications and volunteer sign-ups. Filter by "Source: facebook" and "Campaign" to see what a particular post did.

## Things that never need doing

- Restarting anything, running scripts, or logging into a server. There is no server to log into.
- Resizing photos. Upload the original; the website makes the sizes it needs.
- Updating the events page by hand.
- Deleting adopted animals.

## If something looks wrong

1. Check the Studio: is the document published (not just saved as a draft)?
2. Wait five minutes. Some pages refresh on a timer.
3. If the Events page is stale, check Sync status as above.
4. Otherwise email the technical contact listed in `docs/technical-handover.md` with the page address and what you expected to see.
