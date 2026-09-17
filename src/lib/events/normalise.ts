import type { Event, EventLocation } from '@/lib/content/types';
import type { ParsedEvent } from '@/lib/events/ical';
import { stableId } from '@/lib/sanity/client';
import { PERTH_TZ, perthDateKey } from '@/lib/events/tz';

export type GeoPoint = { lat: number; lng: number };

/**
 * The document the sync writes to Sanity. It is the `Event` type with the
 * two fields Sanity stores differently: `slug` is a Sanity slug object (the
 * schema's field type, and what `slug.current` queries expect) and `_id` and
 * `lastSeenAt` are always present.
 */
export type EventDocument = Omit<Event, '_id' | 'slug' | 'lastSeenAt'> & {
  _id: string;
  slug: { _type: 'slug'; current: string };
  lastSeenAt: string;
};

/** URL-safe slug: lower case, ASCII letters and digits, single hyphens, at most 80 characters. */
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '') || 'event';
}

/**
 * Splits an iCal LOCATION into a venue name (the text before the first comma)
 * and the full address. Facebook writes "Venue name, Street, Suburb State
 * Postcode", so this is right for its exports and harmless for anything else.
 */
export function splitLocation(location: string | undefined, geo?: GeoPoint | null): EventLocation | undefined {
  const address = location?.replace(/\s+/g, ' ').trim();
  if (!address) return undefined;
  const commaAt = address.indexOf(',');
  const name = (commaAt > 0 ? address.slice(0, commaAt) : address).trim();
  const out: EventLocation = { name: name || undefined, address };
  if (geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)) {
    out.lat = geo.lat;
    out.lng = geo.lng;
  }
  return out;
}

/**
 * Turns a parsed event into the Sanity document for it. `geo` is the
 * geocoded location, if any. `now` becomes `lastSeenAt` so the caller can
 * later tell which events have dropped out of the feed.
 */
export function toEventDocument(parsed: ParsedEvent, geo: GeoPoint | null | undefined, now: Date): EventDocument {
  const doc: EventDocument = {
    _id: stableId('event', parsed.uid),
    _type: 'event',
    uid: parsed.uid,
    title: parsed.title,
    slug: { _type: 'slug', current: `${slugify(parsed.title)}-${perthDateKey(parsed.start)}` },
    start: parsed.start.toISOString(),
    allDay: parsed.allDay,
    timezone: PERTH_TZ,
    source: 'facebook',
    cancelled: parsed.cancelled,
    lastSeenAt: now.toISOString(),
  };
  if (parsed.description) doc.description = parsed.description;
  if (parsed.end) doc.end = parsed.end.toISOString();
  const location = splitLocation(parsed.location, geo);
  if (location) doc.location = location;
  // Only ever the URL property. Never built from the UID or the description.
  if (parsed.url) doc.facebookUrl = parsed.url;
  return doc;
}
