import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { createMemoryClient } from '@/lib/events/memory-client';
import { SYNC_STATUS_ID, syncEvents, type SanityDoc } from '@/lib/events/upsert';

const fixture = readFileSync(path.join(process.cwd(), 'fixtures', 'sample-events.ics'), 'utf8');
const NOW = new Date('2026-09-17T00:00:00Z');
const noGeo = async () => null;

const eventDocs = (client: ReturnType<typeof createMemoryClient>) => [...client.docs.values()].filter((d) => d._type === 'event');

describe('syncEvents', () => {
  it('creates one document per parsed event and writes an ok syncStatus', async () => {
    const client = createMemoryClient();
    const result = await syncEvents({ icsText: fixture, client, now: NOW, geocoder: noGeo });
    expect(result).toMatchObject({ ok: true, count: 8, created: 8, updated: 0, skipped: 0, cancelled: 0, warnings: [] });
    expect(eventDocs(client)).toHaveLength(8);
    expect(client.commits).toBe(1);

    const status = client.docs.get(SYNC_STATUS_ID)!;
    expect(status).toMatchObject({ _type: 'syncStatus', source: 'facebook-events', ok: true, count: 8, lastRunAt: NOW.toISOString() });
    expect(String(status.message)).toContain('8 new');

    const cancelled = client.docs.get('event-e1234567890105-facebook-com')!;
    expect(cancelled.cancelled).toBe(true);
    const bingo = client.docs.get('event-e1234567890103-facebook-com-20261111')!;
    expect(bingo).toMatchObject({ uid: 'e1234567890103@facebook.com_20261111', source: 'facebook', facebookUrl: 'https://www.facebook.com/events/1234567890103/' });
  });

  it('is idempotent: a second run with the same input changes nothing', async () => {
    const client = createMemoryClient();
    await syncEvents({ icsText: fixture, client, now: NOW, geocoder: noGeo });
    const before = structuredClone(eventDocs(client));

    const second = await syncEvents({ icsText: fixture, client, now: NOW, geocoder: noGeo });
    expect(second).toMatchObject({ ok: true, count: 8, created: 0, updated: 0, skipped: 8, cancelled: 0 });
    expect(eventDocs(client)).toEqual(before);
    expect(client.docs.get(SYNC_STATUS_ID)).toMatchObject({ ok: true, count: 8 });
  });

  it('only refreshes lastSeenAt on a later unchanged run, and rewrites when the feed changes', async () => {
    const client = createMemoryClient();
    await syncEvents({ icsText: fixture, client, now: NOW, geocoder: noGeo });
    const later = new Date(NOW.getTime() + 6 * 3600000);
    const second = await syncEvents({ icsText: fixture, client, now: later, geocoder: noGeo });
    expect(second).toMatchObject({ created: 0, updated: 0, skipped: 8 });
    expect(client.docs.get('event-e1234567890101-facebook-com')?.lastSeenAt).toBe(later.toISOString());

    const changed = fixture.replace('SUMMARY:Bunnings sausage sizzle', 'SUMMARY:Bunnings sausage sizzle (moved)');
    const third = await syncEvents({ icsText: changed, client, now: later, geocoder: noGeo });
    expect(third).toMatchObject({ created: 0, updated: 1, skipped: 7 });
    expect(client.docs.get('event-e1234567890104-facebook-com')?.title).toBe('Bunnings sausage sizzle (moved)');
  });

  it('preserves editor-owned fields and stored coordinates, geocoding only what lacks them', async () => {
    const geocoder = vi.fn(async (address: string) => (address.startsWith('Bunnings') ? { lat: -32.0393, lng: 115.8231 } : null));
    const seed: SanityDoc[] = [
      {
        _id: 'event-e1234567890102-facebook-com',
        _type: 'event',
        uid: 'e1234567890102@facebook.com',
        title: 'Old title',
        source: 'facebook',
        start: '2026-10-24T10:30:00.000Z',
        ticketLink: 'https://square.link/u/quiz',
        image: { _type: 'imageWithAlt', alt: 'Quiz night poster', asset: { _type: 'reference', _ref: 'image-abc-800x600-jpg' } },
        location: { name: 'Fremantle Sailing Club', address: 'Fremantle Sailing Club, 151 Marine Terrace, Fremantle WA 6160', lat: -32.0698, lng: 115.7495 },
        lastSeenAt: '2026-09-16T00:00:00.000Z',
      },
    ];
    const client = createMemoryClient(seed);
    const result = await syncEvents({ icsText: fixture, client, now: NOW, geocoder });
    expect(result).toMatchObject({ ok: true, created: 7, updated: 1 });

    const quiz = client.docs.get('event-e1234567890102-facebook-com')!;
    expect(quiz.title).toBe('HAART annual quiz night');
    expect(quiz.ticketLink).toBe('https://square.link/u/quiz');
    expect(quiz.image).toEqual(seed[0].image);
    expect(quiz.location).toMatchObject({ lat: -32.0698, lng: 115.7495 });

    // Seven events have an address; the quiz night already had coordinates, so six lookups. Each address once.
    const looked = geocoder.mock.calls.map((c) => c[0]);
    expect(looked).toHaveLength(6);
    expect(looked).not.toContain('Fremantle Sailing Club, 151 Marine Terrace, Fremantle WA 6160');
    expect(client.docs.get('event-e1234567890104-facebook-com')?.location).toMatchObject({ name: 'Bunnings Melville', lat: -32.0393, lng: 115.8231 });
    expect(client.docs.get('event-e1234567890101-facebook-com')?.location).toEqual({ name: 'Pet Fresh Bibra Lake', address: 'Pet Fresh Bibra Lake, Bibra Lake WA 6163' });

    // A second run does not geocode anything that now has coordinates; the ones that failed are retried.
    geocoder.mockClear();
    await syncEvents({ icsText: fixture, client, now: NOW, geocoder });
    expect(geocoder.mock.calls.map((c) => c[0])).not.toContain('Bunnings Melville, 276 Leach Highway, Myaree WA 6154');
    expect(geocoder).toHaveBeenCalledTimes(5);
  });

  it('marks future Facebook events that left the feed more than 48 hours ago as cancelled', async () => {
    const stale = (id: string, extra: Partial<SanityDoc>): SanityDoc => ({
      _id: id,
      _type: 'event',
      uid: id,
      title: id,
      source: 'facebook',
      start: '2026-12-20T10:00:00.000Z',
      lastSeenAt: '2026-09-10T00:00:00.000Z',
      ...extra,
    });
    const client = createMemoryClient([
      stale('gone-future', {}),
      stale('gone-recent', { lastSeenAt: new Date(NOW.getTime() - 47 * 3600000).toISOString() }),
      stale('gone-past', { start: '2026-09-01T10:00:00.000Z' }),
      stale('manual-future', { source: 'manual' }),
      stale('already-cancelled', { cancelled: true }),
    ]);
    const result = await syncEvents({ icsText: fixture, client, now: NOW, geocoder: noGeo });
    expect(result.cancelled).toBe(1);
    expect(result.warnings).toEqual([expect.stringContaining('gone-future')]);
    expect(client.docs.get('gone-future')?.cancelled).toBe(true);
    expect(client.docs.get('gone-recent')?.cancelled).toBeUndefined();
    expect(client.docs.get('gone-past')?.cancelled).toBeUndefined();
    expect(client.docs.get('manual-future')?.cancelled).toBeUndefined();
  });

  it('fails safely and visibly when the feed is not a calendar', async () => {
    const client = createMemoryClient();
    const result = await syncEvents({ icsText: '<html>Log in to Facebook</html>', client, now: NOW, geocoder: noGeo });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not an iCalendar/);
    expect(eventDocs(client)).toHaveLength(0);
    expect(client.docs.get(SYNC_STATUS_ID)).toMatchObject({ ok: false, count: 0, source: 'facebook-events' });
    expect(String(client.docs.get(SYNC_STATUS_ID)?.message)).toMatch(/^Sync failed: /);
  });

  it('reports a failed commit without throwing and without partial writes', async () => {
    const client = createMemoryClient();
    client.failNextCommit = new Error('Sanity is down');
    const result = await syncEvents({ icsText: fixture, client, now: NOW, geocoder: noGeo });
    expect(result).toMatchObject({ ok: false, error: 'Sanity is down' });
    expect(eventDocs(client)).toHaveLength(0);
    expect(client.docs.get(SYNC_STATUS_ID)).toMatchObject({ ok: false });
  });

  it('reports a failure to write the status document', async () => {
    const client = createMemoryClient();
    client.createOrReplace = async () => {
      throw new Error('no permission');
    };
    const result = await syncEvents({ icsText: fixture, client, now: NOW, geocoder: noGeo });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/sync status document.*no permission/);
    expect(eventDocs(client)).toHaveLength(8);
  });

  it('surfaces parser warnings in the result and the status message', async () => {
    const broken = fixture.replace('DTSTART:20261201T110000Z\r\n', '');
    const client = createMemoryClient();
    const result = await syncEvents({ icsText: broken, client, now: NOW, geocoder: noGeo });
    expect(result.ok).toBe(true);
    expect(result.count).toBe(7);
    expect(result.warnings).toEqual([expect.stringMatching(/e1234567890106@facebook.com.*DTSTART/)]);
    expect(String(client.docs.get(SYNC_STATUS_ID)?.message)).toContain('1 warning');
  });
});
