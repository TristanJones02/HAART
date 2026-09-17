import type { SyncStatus } from '@/lib/content/types';
import { geocode } from '@/lib/events/geocode';
import { parseIcalDetailed, type ParsedEvent } from '@/lib/events/ical';
import { toEventDocument, type EventDocument, type GeoPoint } from '@/lib/events/normalise';
import { stableId } from '@/lib/sanity/client';

/**
 * Facebook iCal feed → Sanity `event` documents.
 *
 * Runs are idempotent: documents are keyed on the iCal UID, unchanged
 * documents are left alone (only `lastSeenAt` is refreshed), and all writes
 * go in one transaction so a failure part-way changes nothing. Every run,
 * successful or not, ends by writing the `syncStatus` document so the Studio
 * shows what happened.
 */

/** Any document the sync writes. */
export type SanityDoc = { _id: string; _type: string; [key: string]: unknown };

/** The slice of a Sanity transaction the sync uses. */
export interface EventsTransaction {
  createOrReplace(doc: SanityDoc): EventsTransaction;
  patch(id: string, operations: { set: Record<string, unknown> }): EventsTransaction;
  commit(): Promise<unknown>;
}

/**
 * The slice of `SanityClient` the sync depends on. `SanityClient` satisfies
 * it structurally; tests use an in-memory implementation.
 */
export interface EventsClient {
  fetch(query: string, params?: Record<string, unknown>): Promise<unknown>;
  transaction(): EventsTransaction;
  createOrReplace(doc: SanityDoc): Promise<unknown>;
}

export const SYNC_STATUS_ID = 'syncStatus-facebook-events';
export const SYNC_SOURCE = 'facebook-events' as const;
/** How long an event may be missing from the feed before it is treated as cancelled. */
export const STALE_AFTER_MS = 48 * 60 * 60 * 1000;

/** Existing documents for the ids in this run, so editor-owned fields and coordinates survive. */
export const EXISTING_EVENTS_QUERY = '*[_type == "event" && _id in $ids]';

/**
 * Facebook-sourced events that are still in the future, were not in this
 * run's feed, and have not been seen for 48 hours. Two runs (the cron is six
 * hourly) have to miss an event before it is marked cancelled, so one bad
 * fetch or a brief RSVP change does not cancel anything.
 */
export const STALE_FUTURE_EVENTS_QUERY =
  '*[_type == "event" && source == "facebook" && cancelled != true && !(_id in $ids) && dateTime(start) > dateTime($now) && (!defined(lastSeenAt) || dateTime(lastSeenAt) < dateTime($cutoff))]{ _id, title }';

export type Geocoder = (address: string) => Promise<GeoPoint | null>;

export type SyncInput = {
  icsText: string;
  client: EventsClient;
  now?: Date;
  /** Defaults to the Geoapify geocoder. Tests inject a stub. */
  geocoder?: Geocoder;
};

export type SyncResult = {
  ok: boolean;
  /** Events in the feed after parsing (occurrences of recurring events counted individually). */
  count: number;
  /** New documents. */
  created: number;
  /** Existing documents whose content changed. */
  updated: number;
  /** Existing documents left as they were, with only `lastSeenAt` refreshed. */
  skipped: number;
  /** Future events marked cancelled because they dropped out of the feed. */
  cancelled: number;
  warnings: string[];
  error?: string;
};

export async function syncEvents(input: SyncInput): Promise<SyncResult> {
  const now = input.now ?? new Date();
  const result: SyncResult = { ok: false, count: 0, created: 0, updated: 0, skipped: 0, cancelled: 0, warnings: [] };

  try {
    await run(input, now, result);
    result.ok = true;
  } catch (err) {
    result.ok = false;
    result.error = errorMessage(err);
  }

  const status = await writeSyncStatus(input.client, {
    ok: result.ok,
    count: result.count,
    message: result.ok ? successMessage(result) : `Sync failed: ${result.error}. No event documents were changed.`,
    now,
  });
  if (!status.ok) {
    result.ok = false;
    result.error = result.error ? `${result.error}; ${status.error}` : status.error;
  }

  return result;
}

async function run(input: SyncInput, now: Date, result: SyncResult): Promise<void> {
  const { client } = input;
  const geocoder = input.geocoder ?? defaultGeocoder;

  const parsed = parseIcalDetailed(input.icsText, { now });
  if (parsed.fatal) throw new Error(parsed.fatal);
  result.warnings.push(...parsed.warnings);

  const events = dedupe(parsed.events, result.warnings);
  result.count = events.length;

  const ids = events.map((e) => stableId('event', e.uid));
  const existingDocs = ids.length ? asDocs(await client.fetch(EXISTING_EVENTS_QUERY, { ids })) : [];
  const existing = new Map(existingDocs.map((d) => [d._id, d]));

  const tx = client.transaction();
  let mutations = 0;

  for (const event of events) {
    const id = stableId('event', event.uid);
    const previous = existing.get(id);
    const geo = await resolveGeo(event, previous, geocoder);
    const doc = withEditorFields(toEventDocument(event, geo, now), previous);

    if (!previous) {
      tx.createOrReplace(doc);
      result.created += 1;
    } else if (contentChanged(previous, doc)) {
      tx.createOrReplace(doc);
      result.updated += 1;
    } else {
      tx.patch(id, { set: { lastSeenAt: doc.lastSeenAt } });
      result.skipped += 1;
    }
    mutations += 1;
  }

  const cutoff = new Date(now.getTime() - STALE_AFTER_MS);
  const stale = asDocs(await client.fetch(STALE_FUTURE_EVENTS_QUERY, { ids, now: now.toISOString(), cutoff: cutoff.toISOString() }));
  for (const doc of stale) {
    tx.patch(doc._id, { set: { cancelled: true } });
    result.cancelled += 1;
    result.warnings.push(`Marked "${String(doc.title ?? doc._id)}" cancelled: not seen in the feed for 48 hours`);
    mutations += 1;
  }

  if (mutations > 0) await tx.commit();
}

/**
 * Writes the `syncStatus` document. Returns rather than throws so a failed
 * status write can be reported alongside whatever else happened.
 */
export async function writeSyncStatus(
  client: EventsClient,
  status: { ok: boolean; message: string; count: number; now?: Date },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const doc: SyncStatus = {
    _type: 'syncStatus',
    _id: SYNC_STATUS_ID,
    source: SYNC_SOURCE,
    ok: status.ok,
    message: status.message,
    count: status.count,
    lastRunAt: (status.now ?? new Date()).toISOString(),
  };
  try {
    await client.createOrReplace(doc);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: `Could not write the sync status document: ${errorMessage(err)}` };
  }
}

function successMessage(r: SyncResult): string {
  const parts = [`Synced ${r.count} ${r.count === 1 ? 'event' : 'events'} from the Facebook feed: ${r.created} new, ${r.updated} updated, ${r.skipped} unchanged, ${r.cancelled} marked cancelled.`];
  if (r.warnings.length) {
    const shown = r.warnings.slice(0, 5).join(' | ');
    parts.push(`${r.warnings.length} ${r.warnings.length === 1 ? 'warning' : 'warnings'}: ${shown}${r.warnings.length > 5 ? ' | …' : ''}`);
  }
  return parts.join(' ');
}

const defaultGeocoder: Geocoder = (address) => geocode(address);

/**
 * Coordinates come from the existing document when its address is
 * unchanged; otherwise the address is geocoded (one call, and only when
 * there is an address to look up). A failed lookup leaves the event without
 * coordinates so the next run tries again.
 */
async function resolveGeo(event: ParsedEvent, previous: SanityDoc | undefined, geocoder: Geocoder): Promise<GeoPoint | null> {
  const address = event.location?.replace(/\s+/g, ' ').trim();
  if (!address) return null;
  const loc = previous?.location as { address?: unknown; lat?: unknown; lng?: unknown } | undefined;
  if (loc && loc.address === address && typeof loc.lat === 'number' && typeof loc.lng === 'number' && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)) {
    return { lat: loc.lat, lng: loc.lng };
  }
  try {
    return await geocoder(address);
  } catch {
    return null;
  }
}

/** Fields volunteers set in the Studio that the feed knows nothing about. */
const EDITOR_FIELDS = ['ticketLink', 'image'] as const;

function withEditorFields(doc: EventDocument, previous: SanityDoc | undefined): EventDocument {
  if (!previous) return doc;
  const out: EventDocument = { ...doc };
  const ticketLink = previous[EDITOR_FIELDS[0]];
  if (typeof ticketLink === 'string' && ticketLink.trim()) out.ticketLink = ticketLink;
  const image = previous[EDITOR_FIELDS[1]];
  if (image && typeof image === 'object') out.image = image as EventDocument['image'];
  return out;
}

/** System fields and the timestamp that changes every run are ignored when deciding whether to rewrite. */
const VOLATILE_FIELDS = new Set(['_rev', '_createdAt', '_updatedAt', '_system', 'lastSeenAt']);

function contentChanged(previous: SanityDoc, next: EventDocument): boolean {
  return stableJson(previous) !== stableJson(next);
}

function stableJson(value: unknown): string {
  return JSON.stringify(value, (key, v) => {
    if (VOLATILE_FIELDS.has(key)) return undefined;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return Object.keys(v as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, k) => {
          const inner = (v as Record<string, unknown>)[k];
          if (inner !== undefined && inner !== null) acc[k] = inner;
          return acc;
        }, {});
    }
    return v;
  });
}

/** The feed should never repeat a UID, but a repeated one must not become two mutations on one id. */
function dedupe(events: ParsedEvent[], warnings: string[]): ParsedEvent[] {
  const byUid = new Map<string, ParsedEvent>();
  for (const event of events) {
    if (byUid.has(event.uid)) warnings.push(`Duplicate UID "${event.uid}" in feed; the last one wins`);
    byUid.set(event.uid, event);
  }
  return [...byUid.values()];
}

function asDocs(value: unknown): SanityDoc[] {
  if (!Array.isArray(value)) return [];
  return value.filter((d): d is SanityDoc => !!d && typeof d === 'object' && typeof (d as SanityDoc)._id === 'string');
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
