import { describe, expect, it } from 'vitest';
import type { Event } from '@/lib/content/types';
import { eventToIcs, eventsStripState, formatEventDate, formatEventDay, isToday, truncateDescription, withinDays } from '@/lib/events/format';

// Thursday 17 September 2026, 2 pm in Perth.
const NOW = new Date('2026-09-17T06:00:00Z');

function event(start: string, extra: Partial<Event> = {}): Event {
  return { _type: 'event', uid: `u-${start}`, title: 'Test event', slug: 'test-event', start, source: 'facebook', ...extra };
}

describe('isToday and withinDays (Perth calendar)', () => {
  it('treats 11 pm Perth as today even though it is the next day in UTC terms', () => {
    // 11 pm Perth on 17 Sep is 15:00Z on 17 Sep; 1 am Perth on 18 Sep is 17:00Z on 17 Sep.
    expect(isToday(event('2026-09-17T15:00:00Z'), NOW)).toBe(true);
    expect(isToday(event('2026-09-17T17:00:00Z'), NOW)).toBe(false);
    expect(isToday(event('2026-09-16T23:00:00Z'), NOW)).toBe(true); // 7 am Perth today
    expect(isToday(event('2026-09-16T15:00:00Z'), NOW)).toBe(false); // 11 pm Perth yesterday
  });

  it('counts events from the start of today up to N days ahead', () => {
    expect(withinDays(event('2026-09-16T23:00:00Z'), 14, NOW)).toBe(true); // earlier today
    expect(withinDays(event('2026-09-16T15:00:00Z'), 14, NOW)).toBe(false); // yesterday
    expect(withinDays(event('2026-10-01T05:00:00Z'), 14, NOW)).toBe(true); // 14 days ahead, one hour before the cut-off
    expect(withinDays(event('2026-10-01T07:00:00Z'), 14, NOW)).toBe(false); // just past it
  });
});

describe('eventsStripState', () => {
  const today = event('2026-09-17T10:00:00Z', { title: 'Tonight' });
  const soon = event('2026-09-21T02:00:00Z', { title: 'Sunday' });
  const later = event('2026-10-20T02:00:00Z', { title: 'Next month' });
  const past = event('2026-09-10T02:00:00Z', { title: 'Last week' });

  it("is 'today' when any event starts today, showing only today's events", () => {
    const state = eventsStripState([later, soon, today, past], NOW);
    expect(state.mode).toBe('today');
    expect(state.events.map((e) => e.title)).toEqual(['Tonight']);
  });

  it("is 'upcoming' within 14 days otherwise, sorted soonest first", () => {
    const another = event('2026-09-19T02:00:00Z', { title: 'Saturday' });
    const state = eventsStripState([later, soon, another, past], NOW);
    expect(state.mode).toBe('upcoming');
    expect(state.events.map((e) => e.title)).toEqual(['Saturday', 'Sunday']);
  });

  it('is null with nothing in the window, and ignores cancelled events', () => {
    expect(eventsStripState([later, past], NOW)).toEqual({ mode: null, events: [] });
    expect(eventsStripState([{ ...today, cancelled: true }], NOW).mode).toBeNull();
    expect(eventsStripState([], NOW).mode).toBeNull();
  });
});

describe('formatEventDate and formatEventDay', () => {
  it('formats a start time in Perth', () => {
    expect(formatEventDate(event('2026-09-26T10:30:00Z'))).toBe('Sat 26 Sep, 6:30 pm');
    expect(formatEventDate(event('2026-09-26T02:00:00Z'))).toBe('Sat 26 Sep, 10 am');
    expect(formatEventDate(event('2026-09-26T04:00:00Z'))).toBe('Sat 26 Sep, 12 pm');
  });

  it('adds a range when the end is on the same day', () => {
    expect(formatEventDate(event('2026-09-26T10:30:00Z', { end: '2026-09-26T14:00:00Z' }))).toBe('Sat 26 Sep, 6:30 pm – 10 pm');
    expect(formatEventDate(event('2026-09-26T10:30:00Z', { end: '2026-09-26T17:00:00Z' }))).toBe('Sat 26 Sep, 6:30 pm – Sun 27 Sep, 1 am');
  });

  it('handles all-day events with exclusive ends', () => {
    expect(formatEventDate(event('2026-11-13T16:00:00Z', { allDay: true, end: '2026-11-14T16:00:00Z' }))).toBe('Sat 14 Nov, all day');
    expect(formatEventDate(event('2026-11-13T16:00:00Z', { allDay: true, end: '2026-11-15T16:00:00Z' }))).toBe('Sat 14 Nov – Sun 15 Nov');
    expect(formatEventDate(event('2026-11-13T16:00:00Z', { allDay: true }))).toBe('Sat 14 Nov, all day');
  });

  it('gives badge parts', () => {
    expect(formatEventDay(event('2026-09-26T10:30:00Z'))).toEqual({ weekday: 'Sat', day: '26', month: 'Sep' });
    expect(formatEventDay(event('2026-12-31T17:00:00Z'))).toEqual({ weekday: 'Fri', day: '1', month: 'Jan' });
  });
});

describe('truncateDescription', () => {
  const text = 'Our biggest fundraiser of the year, hosted by Bamboozled Quizmasters. Tables of eight, a raffle, a silent auction and games between rounds. BYO food and nibbles; drinks are available at the bar.';

  it('returns short text unchanged and collapses whitespace', () => {
    expect(truncateDescription('Short  text\n\nhere')).toBe('Short text here');
    expect(truncateDescription(undefined)).toBe('');
  });

  it('cuts at a word boundary within the limit and adds an ellipsis', () => {
    const out = truncateDescription(text, 60);
    expect(out).toBe('Our biggest fundraiser of the year, hosted by Bamboozled…');
    expect(out.length).toBeLessThanOrEqual(61);
    expect(truncateDescription(text)).toMatch(/…$/);
    expect(truncateDescription(text).length).toBeLessThanOrEqual(161);
  });

  it('does not leave trailing punctuation before the ellipsis', () => {
    expect(truncateDescription('One two, three four', 8)).toBe('One two…');
  });
});

describe('eventToIcs', () => {
  it('writes a single-event VCALENDAR with escaped text and CRLF line endings', () => {
    const ics = eventToIcs(
      event('2026-09-26T10:30:00Z', {
        uid: 'e1@facebook.com',
        title: 'Quiz night; tables of eight',
        end: '2026-09-26T14:00:00Z',
        description: 'Line one, with a comma.\nLine two.',
        location: { name: 'Club', address: 'Club, 1 Street, Suburb WA 6000' },
        facebookUrl: 'https://www.facebook.com/events/1/',
      }),
      new Date('2026-09-17T00:00:00Z'),
    );
    const lines = ics.split('\r\n');
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(lines).toContain('UID:e1@facebook.com');
    expect(lines).toContain('DTSTAMP:20260917T000000Z');
    expect(lines).toContain('DTSTART:20260926T103000Z');
    expect(lines).toContain('DTEND:20260926T140000Z');
    expect(lines).toContain('SUMMARY:Quiz night\; tables of eight');
    expect(lines).toContain('DESCRIPTION:Line one\\, with a comma.\\nLine two.');
    expect(lines).toContain('LOCATION:Club\\, 1 Street\\, Suburb WA 6000');
    expect(lines).toContain('URL:https://www.facebook.com/events/1/');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(lines.every((l) => Buffer.byteLength(l) <= 75)).toBe(true);
  });

  it('uses VALUE=DATE for all-day events', () => {
    const ics = eventToIcs(event('2026-11-13T16:00:00Z', { allDay: true, end: '2026-11-14T16:00:00Z' }));
    expect(ics).toContain('DTSTART;VALUE=DATE:20261114\r\n');
    expect(ics).toContain('DTEND;VALUE=DATE:20261115\r\n');
  });
});
