# SavourLife adoption API — discovery

**Status: BLOCKED. No endpoint confirmed. No fixtures captured.**

Phase 1 of the brief cannot be completed from this environment. This document
records why, everything known going in, and the exact procedure to finish the
discovery from a machine with normal internet access, so that whoever picks it
up does not start from nothing.

---

## 1. Why discovery failed

`savour-life.com.au` is denied by this session's egress proxy. It is not a
SavourLife access control — nothing of theirs was reached, so nothing of theirs
refused us. The denial is on our side, at the network gateway, before any
request leaves the container.

Evidence, 2026-09-18:

| Attempt | Result |
|---|---|
| `curl https://www.savour-life.com.au/` | `000` (no response) |
| `curl https://www.savour-life.com.au/robots.txt` | `000` |
| `curl https://savour-life.com.au/` | `000` |
| `WebFetch https://www.savour-life.com.au/robots.txt` | `EGRESS_BLOCKED` |

The proxy's own status endpoint records the reason:

```
connect_rejected  www.savour-life.com.au:443   gateway answered 403 to CONNECT (policy denial)
connect_rejected  savour-life.com.au:443        gateway answered 403 to CONNECT (policy denial)
```

Every other external host tested in this session is denied the same way
(pexels, unsplash, wikimedia, petrescue.com.au, haart.org.au, facebook.com),
so this is a blanket egress policy rather than anything specific to SavourLife.

**Consequence:** `robots.txt` has not been read. Section 7 of the brief makes
respecting it a precondition, so no request should be made to any SavourLife
path until someone has read it and confirmed the embed and API paths are
allowed. That check is step 0 below, not an afterthought.

---

## 2. Known facts (from the brief, unverified by request)

- Embed URL: `https://www.savour-life.com.au/savourlife-pet-adoptions/Rescue-Group-embed/{groupId}?type=dog`
- `type` also accepts `cat`; the embed has All / Cats / Dogs tabs.
- The platform runs Umbraco (.NET), which routes custom API controllers at
  `/umbraco/api/{controller}/{action}/{id}`.
- `/umbraco/api/dog/getadoptionposter/139789` reportedly 302s to a generated
  PDF, which confirms a publicly routed `DogController` exists.
- The embed page ships unrendered Angular interpolation, so the list is
  hydrated client-side and a JSON endpoint exists behind it.
- Field names visible in the Angular template: `Id`, `DogName`, `DogName2`,
  `BondedPair`, `Breed`, `Suburb`, `State`, `AnimalType`, plus adopted and
  on-hold flags.
- Asset base path: `https://www.savour-life.com.au/Adopt-A-Dog/Assets/`
- Rescue group directory: `/savourlife-pet-adoptions/rescue-groups/`
- Individual group: `/adopt-a-dog/rescue-groups/{id}/{Slug-Name}`

**HAART's group id is unknown.** It has not been confirmed that HAART is listed
on SavourLife at all. Per the brief, if they are not, stop and report rather
than substituting another rescue.

---

## 3. Procedure to finish this

Run from a machine with normal internet access. Stop at the first step that
fails and record what happened here.

**0. robots.txt first.**

```sh
curl -sS -A 'HAART-Concept-Site/1.0 (unofficial student project)' \
  https://www.savour-life.com.au/robots.txt | tee fixtures/discovery/robots.txt
```

If it disallows `/savourlife-pet-adoptions/`, `/umbraco/api/` or `/adopt-a-dog/`,
stop. That ends the task, not just the step.

**1. Find HAART's group id.**

```sh
curl -sS -A 'HAART-Concept-Site/1.0 (unofficial student project)' \
  'https://www.savour-life.com.au/savourlife-pet-adoptions/rescue-groups/' \
  > fixtures/discovery/rescue-groups.html
grep -oiE 'rescue-groups/[0-9]+/[a-z0-9-]*haart[a-z0-9-]*' fixtures/discovery/rescue-groups.html
```

The directory may be paginated or itself Angular-hydrated. If the grep is empty,
check whether the list is client-side too before concluding HAART is absent.

**2. Save the embed page.**

```sh
curl -sS -A 'HAART-Concept-Site/1.0 (unofficial student project)' \
  "https://www.savour-life.com.au/savourlife-pet-adoptions/Rescue-Group-embed/${GROUP_ID}?type=dog" \
  > fixtures/discovery/embed-page.html
```

**3. Pull every script it loads.**

```sh
grep -oE '<script[^>]+src="[^"]+"' fixtures/discovery/embed-page.html \
  | grep -oE 'src="[^"]+"' | cut -d'"' -f2 | sort -u
```

Fetch each into `fixtures/discovery/js/`, resolving relative paths against the
origin.

**4. Find the call site.**

```sh
grep -oE '.{80}(/umbraco/api/|\$http\.(get|post)|\$resource)\(.{160}' fixtures/discovery/js/*.js
```

Angular bundles are usually minified but not obfuscated, so URL string literals
survive. What is needed: controller, action, HTTP method, every query parameter,
and whether a `Referer` or anti-forgery header is required.

**5. Probe it.** Vary `type` between `dog` and `cat`. Test paging parameters if
any appear. One request at a time.

**6. Decide list-vs-detail.** Check whether the list payload carries the full
description and the complete image set. If it does not, and a per-animal detail
action exists on the same controller, the fetch strategy becomes one-plus-N and
Section 7's 1–2 second delay between calls applies.

---

## 4. Fixtures still owed

| File | What it is | Captured |
|---|---|---|
| `fixtures/savourlife/list-populated.json` | A real response with animals in it | ✗ |
| `fixtures/savourlife/list-empty.json` | A real response from a group with none | ✗ |
| `fixtures/savourlife/detail.json` | Per-animal detail, if such an endpoint exists | ✗ |

The empty fixture is the one that matters most. Section 6 aborts the sync on an
empty result set precisely because an empty response and a blocked response look
identical, and the naive outcome is marking every animal adopted and emptying
the page. That guard cannot be tested without a real empty response.

---

## 5. What was deliberately not done

- **No adapter or Zod schema was written.** The brief requires the schema to
  mirror the upstream shape exactly and to throw on drift. A schema written
  against the eight field names in Section 2 above would be a guess wearing the
  costume of a contract: it would pass its own tests, fail against reality, and
  fail loudly in the one place loud failure is useless — production.
- **No requests were attempted beyond reachability checks.** Three `curl`s and
  one `WebFetch`, all rejected by our own gateway before leaving the container.
- **No HTML scraping of profile pages.** Section 3 requires checking in first.

---

## 6. Open questions for Tristan

1. Is HAART actually listed on SavourLife? Nothing here confirms it.
2. Should discovery run from your own machine, or should this session be given
   egress access to `savour-life.com.au`? Either unblocks Phase 1; nothing else
   does.
3. If SavourLife turns out to be a dead end, is Animal Shelter Manager
   (`service.sheltermanager.com/asmservice`, documented and stable) the fallback
   for the concept build rather than the later migration?
