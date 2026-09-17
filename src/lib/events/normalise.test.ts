import { describe, expect, it } from 'vitest';
import type { ParsedEvent } from '@/lib/events/ical';
import { slugify, splitLocation, toEventDocument } from '@/lib/events/normalise';

const NOW = new Date('2026-09-17T03:00:00Z');

const parsed: ParsedEvent = {
  uid: 'e1234567890101@facebook.com',
  title: 'Adoption day at Pet Fresh Bibra Lake',
  description: 'Come and meet some of the dogs and cats.',
  start: new Date('2026-10-10T02:00:00Z'),
  end: new Date('2026-10-10T05:00:00Z'),
  allDay: false,
  location: 'Pet Fresh Bibra Lake, 1 Example Street, Bibra Lake WA 6163',
  url: 'https://www.facebook.com/events/1234567890101/',
  cancelled: false,
  recurring: false,
};

describe('toEventDocument', () => {
  it('builds a Sanity-ready document keyed on the UID', () => {
    const doc = toEventDocument(parsed, { lat: -32.09, lng: 115.81 }, NOW);
    expect(doc._id).toBe('event-e1234567890101-facebook-com');
    expect(doc._type).toBe('event');
    expect(doc.uid).toBe(parsed.uid);
    expect(doc.slug).toEqual({ _type: 'slug', current: 'adoption-day-at-pet-fresh-bibra-lake-2026-10-10' });
    expect(doc.start).toBe('2026-10-10T02:00:00.000Z');
    expect(doc.end).toBe('2026-10-10T05:00:00.000Z');
    expect(doc.timezone).toBe('Australia/Perth');
    expect(doc.source).toBe('facebook');
    expect(doc.allDay).toBe(false);
    expect(doc.cancelled).toBe(false);
    expect(doc.lastSeenAt).toBe(NOW.toISOString());
    expect(doc.location).toEqual({ name: 'Pet Fresh Bibra Lake', address: 'Pet Fresh Bibra Lake, 1 Example Street, Bibra Lake WA 6163', lat: -32.09, lng: 115.81 });
    expect(doc.facebookUrl).toBe('https://www.facebook.com/events/1234567890101/');
  });

  it('uses the Perth date in the slug for an event late in the Perth evening', () => {
    // 11:30 pm Perth on 24 Oct is 15:30Z on 24 Oct; 1 am Perth on 25 Oct is 17:00Z on 24 Oct.
    const doc = toEventDocument({ ...parsed, start: new Date('2026-10-24T17:00:00Z'), end: undefined }, null, NOW);
    expect(doc.slug.current.endsWith('-2026-10-25')).toBe(true);
    expect(doc.end).toBeUndefined();
  });

  it('only sets facebookUrl from the URL property', () => {
    const doc = toEventDocument({ ...parsed, url: undefined, description: 'https://www.facebook.com/events/1234567890101/' }, null, NOW);
    expect(doc.facebookUrl).toBeUndefined();
    expect('facebookUrl' in doc).toBe(false);
  });

  it('omits location and coordinates when there is nothing to record', () => {
    expect(toEventDocument({ ...parsed, location: undefined }, { lat: 1, lng: 2 }, NOW).location).toBeUndefined();
    expect(toEventDocument(parsed, null, NOW).location).toEqual({ name: 'Pet Fresh Bibra Lake', address: parsed.location });
  });
});

describe('splitLocation', () => {
  it('uses the text before the first comma as the venue name', () => {
    expect(splitLocation('Bunnings Melville, 276 Leach Highway, Myaree WA 6154')).toEqual({ name: 'Bunnings Melville', address: 'Bunnings Melville, 276 Leach Highway, Myaree WA 6154' });
  });
  it('uses the whole string when there is no comma', () => {
    expect(splitLocation('  Online  ')).toEqual({ name: 'Online', address: 'Online' });
    expect(splitLocation('')).toBeUndefined();
  });
});

describe('slugify', () => {
  it('produces lower-case hyphenated ASCII', () => {
    expect(slugify('Rock Music Bingo!')).toBe('rock-music-bingo');
    expect(slugify('Café & Cats: an evening')).toBe('cafe-and-cats-an-evening');
    expect(slugify('***')).toBe('event');
  });
});
