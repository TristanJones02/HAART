import { describe, expect, it } from 'vitest';
import { eventsStripState, isToday } from '@/lib/events/format';
import { mockEvents } from '@/lib/events/mock';
import { perthParts } from '@/lib/events/tz';

describe('mockEvents', () => {
  const NOW = new Date('2026-09-17T06:00:00Z');
  const events = mockEvents(NOW);

  it('has seven events with one today at 6 pm Perth time, four upcoming and two past', () => {
    expect(events).toHaveLength(7);
    const today = events.filter((e) => isToday(e, NOW));
    expect(today).toHaveLength(1);
    const p = perthParts(new Date(today[0].start));
    expect([p.hour, p.minute]).toEqual([18, 0]);
    expect(events.filter((e) => Date.parse(e.start) < NOW.getTime() - 86400000)).toHaveLength(2);
    expect(eventsStripState(events, NOW).mode).toBe('today');
  });

  it('uses Facebook URLs from a static table and unique slugs', () => {
    for (const e of events) {
      expect(e.facebookUrl).toMatch(/^https:\/\/www\.facebook\.com\/events\/\d+\/$/);
      expect(e.source).toBe('facebook');
      expect(e.timezone).toBe('Australia/Perth');
    }
    expect(new Set(events.map((e) => e.slug)).size).toBe(7);
    expect(new Set(events.map((e) => e.uid)).size).toBe(7);
    const withVenue = events.filter((e) => e.location);
    expect(withVenue.length).toBeGreaterThanOrEqual(5);
    for (const e of withVenue) expect(typeof e.location?.lat).toBe('number');
  });
});
