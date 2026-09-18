import type { Event } from '@/lib/content/types';
import { env } from '@/lib/env';
import { mockEvents } from '@/lib/events/mock';
import { getReadClient, groq } from '@/lib/sanity/client';

/**
 * Server-only reads for the events strip and the events page. Import from
 * server components and route handlers only: the read client may carry a
 * token, and results are tagged 'events' so the sync can revalidate them.
 */

const DAY_S = 60 * 60 * 24;

/** Fields the pages need, with `slug` flattened and `image` resolved to `ImageWithAlt`. */
const EVENT_PROJECTION = groq`{
  _id, _type, uid, title, "slug": slug.current, description, start, end, allDay, timezone,
  location, facebookUrl, ticketLink, source, cancelled, lastSeenAt,
  "image": select(defined(image.asset) => {
    "_type": "imageWithAlt",
    "alt": coalesce(image.alt, ""),
    "caption": image.caption,
    "sensitive": image.sensitive,
    "url": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height,
    "lqip": image.asset->metadata.lqip,
    "hotspot": image.hotspot,
    "image": { "_type": "image", "asset": image.asset, "hotspot": image.hotspot, "crop": image.crop }
  })
}`;

/** Events from yesterday onwards, soonest first. The 24 hour grace keeps today's events visible all day. */
const UPCOMING_QUERY = groq`*[_type == "event" && cancelled != true && dateTime(start) >= dateTime(now()) - ${DAY_S}] | order(start asc) [0...$limit] ${EVENT_PROJECTION}`;
const PAST_QUERY = groq`*[_type == "event" && cancelled != true && dateTime(start) < dateTime(now()) - ${DAY_S}] | order(start desc) [0...$limit] ${EVENT_PROJECTION}`;
const ALL_QUERY = groq`*[_type == "event"] | order(start asc) ${EVENT_PROJECTION}`;

const FETCH_OPTIONS: { next: { revalidate: number; tags: string[] } } = { next: { revalidate: 300, tags: ['events'] } };

export async function getUpcomingEvents(limit = 20): Promise<Event[]> {
  return query(UPCOMING_QUERY, { limit }, (events, now) => events.filter((e) => !e.cancelled && Date.parse(e.start) >= now - DAY_S * 1000).slice(0, limit));
}

export async function getPastEvents(limit = 6): Promise<Event[]> {
  return query(PAST_QUERY, { limit }, (events, now) =>
    events
      .filter((e) => !e.cancelled && Date.parse(e.start) < now - DAY_S * 1000)
      .sort((a, b) => b.start.localeCompare(a.start))
      .slice(0, limit),
  );
}

/** Every event document, including cancelled ones, soonest first. */
export async function getAllEvents(): Promise<Event[]> {
  return query(ALL_QUERY, {}, (events) => events);
}

// ---------------------------------------------------------------------------

type MockFilter = (events: Event[], nowMs: number) => Event[];

let loggedMockFallback = false;

function mockAllowed(): boolean {
  return !env.isLiveSite || process.env.ALLOW_MOCK_CONTENT === 'true';
}

function mock(reason: string, filter: MockFilter): Event[] {
  if (!loggedMockFallback) {
    loggedMockFallback = true;
    console.info(`[events] Using mock events: ${reason}`);
  }
  const now = new Date();
  return filter(mockEvents(now), now.getTime());
}

async function query(groqQuery: string, params: Record<string, unknown>, filter: MockFilter): Promise<Event[]> {
  const client = getReadClient();
  if (!client) return mockAllowed() ? mock('Sanity is not configured', filter) : [];

  try {
    const rows = await client.fetch<unknown>(groqQuery, params, FETCH_OPTIONS);
    const events = Array.isArray(rows) ? rows.filter(isEventRow).map(clean) : [];
    if (events.length === 0 && !env.isLiveSite) return mock('Sanity returned no events', filter);
    return events;
  } catch (err) {
    console.error('[events] Sanity query failed', err instanceof Error ? err.message : err);
    return mockAllowed() && !env.isLiveSite ? mock('Sanity query failed', filter) : [];
  }
}

function isEventRow(row: unknown): row is Event {
  return !!row && typeof row === 'object' && typeof (row as Event).title === 'string' && typeof (row as Event).start === 'string';
}

/** GROQ returns null for missing fields; the `Event` type uses undefined. */
function clean(row: Event): Event {
  const out = { ...row } as Record<string, unknown>;
  for (const key of Object.keys(out)) if (out[key] === null) delete out[key];
  if (typeof out.slug !== 'string') out.slug = String(out.slug ?? out._id ?? '');
  return out as unknown as Event;
}
