import type { Event } from '@/lib/content/types';
import { PERTH_TZ, perthLocalToDate, perthParts } from '@/lib/events/tz';

/**
 * Development events. Dates are computed from "now" so the strip and the
 * events page always have something to show. Venues are real Perth places
 * with coordinates from a static table; nothing here is geocoded.
 */

type Venue = { name: string; address: string; lat: number; lng: number };

const VENUES = {
  mountPleasant: { name: 'Mount Pleasant Bowling Club', address: 'Mount Pleasant Bowling Club, 4 The Esplanade, Mount Pleasant WA 6153', lat: -32.0175, lng: 115.8482 },
  petFreshBibraLake: { name: 'Pet Fresh Bibra Lake', address: 'Pet Fresh Bibra Lake, Bibra Lake WA 6163', lat: -32.0961, lng: 115.8163 },
  petFreshBalcatta: { name: 'Pet Fresh Balcatta', address: 'Pet Fresh Balcatta, Balcatta WA 6021', lat: -31.875, lng: 115.823 },
  bunningsMelville: { name: 'Bunnings Melville', address: 'Bunnings Melville, 276 Leach Highway, Myaree WA 6154', lat: -32.0393, lng: 115.8231 },
  fremantleSailingClub: { name: 'Fremantle Sailing Club', address: 'Fremantle Sailing Club, 151 Marine Terrace, Fremantle WA 6160', lat: -32.0698, lng: 115.7495 },
} satisfies Record<string, Venue>;

type Spec = {
  n: number;
  title: string;
  /** Days from today in Perth; negative is the past. */
  daysFromNow: number;
  /** Perth wall-clock start, as [hour, minute]. */
  startAt: [number, number];
  /** Length in hours. */
  hours: number;
  allDay?: boolean;
  venue?: Venue;
  description: string;
  ticketLink?: string;
};

const SPECS: Spec[] = [
  {
    n: 1,
    title: 'Rock Music Bingo',
    daysFromNow: 0,
    startAt: [18, 0],
    hours: 3.5,
    venue: VENUES.mountPleasant,
    description:
      'Rock Music Bingo is back at Mount Pleasant. Instead of numbers you listen for songs, so bring a table of friends and your best singing voice. Doors open at 6 pm and the first game starts at 7. Tickets are $20 at the door and every dollar goes to vet bills for the animals in our care.',
  },
  {
    n: 2,
    title: 'Adoption day at Pet Fresh Bibra Lake',
    daysFromNow: 4,
    startAt: [10, 0],
    hours: 3,
    venue: VENUES.petFreshBibraLake,
    description:
      'Come and meet some of the dogs and cats looking for homes. Our fosters will be there from 10 am with the animals they are caring for, so you can say hello and ask the questions that matter. If you would like to adopt on the day, please fill in the pre-adoption form first.',
  },
  {
    n: 3,
    title: 'Bunnings sausage sizzle',
    daysFromNow: 11,
    startAt: [8, 0],
    hours: 8,
    venue: VENUES.bunningsMelville,
    description:
      'We are cooking sausages outside Bunnings Melville all day. Come and say hello, grab a snag with onions, and help us raise money for desexing and vaccinations. Volunteers are welcome for a two-hour shift; message the page if you can help.',
  },
  {
    n: 4,
    title: 'Annual quiz night',
    daysFromNow: 25,
    startAt: [18, 30],
    hours: 3.5,
    venue: VENUES.fremantleSailingClub,
    description:
      'Our biggest fundraiser of the year, hosted by Bamboozled Quizmasters. Tables of eight, a raffle, a silent auction and games between rounds. BYO food and nibbles; drinks are available at the bar. Tickets are $25 a head and tables sell out, so book early.',
    ticketLink: 'https://square.link/u/example-quiz-night',
  },
  {
    n: 5,
    title: 'Christmas photos with Santa Paws',
    daysFromNow: 50,
    startAt: [9, 0],
    hours: 4,
    venue: VENUES.petFreshBalcatta,
    description:
      'Bring your dog, cat, rabbit or bird for a photo with Santa Paws. Photos are $15 each, printed on the spot, with a digital copy sent to you. Every dollar goes to the animals in our care. Sessions run from 9 am to 1 pm; no bookings needed.',
  },
  {
    n: 6,
    title: 'Spring online auction opens',
    daysFromNow: -12,
    startAt: [19, 0],
    hours: 1,
    description:
      'Our spring online auction opens at 7 pm with more than sixty lots donated by local businesses, from restaurant vouchers to dog training packages. Bidding runs for one week and everything raised pays for vet care. Join the auction group on Facebook to bid.',
  },
  {
    n: 7,
    title: 'Adoption day at Pet Fresh Balcatta',
    daysFromNow: -40,
    startAt: [10, 0],
    hours: 3,
    venue: VENUES.petFreshBalcatta,
    description:
      'Meet the dogs and cats in foster care who are ready for a home of their own. Our volunteers can tell you about each animal and what kind of home would suit them. Adoption packs, treats and a raffle on the day.',
  },
];

function slugOf(title: string, start: Date): string {
  const p = perthParts(start);
  const date = `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${date}`;
}

/** Seven events around `now`: one today at 6 pm Perth time, four upcoming, two past. */
export function mockEvents(now: Date = new Date()): Event[] {
  const today = perthParts(now);
  return SPECS.map((spec) => {
    const day = new Date(Date.UTC(today.year, today.month - 1, today.day + spec.daysFromNow));
    const start = perthLocalToDate(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), spec.startAt[0], spec.startAt[1]);
    const end = new Date(start.getTime() + spec.hours * 3600000);
    const uid = `e1000000000000${spec.n}@facebook.com`;
    const event: Event = {
      _type: 'event',
      _id: `event-e1000000000000${spec.n}-facebook-com`,
      uid,
      title: spec.title,
      slug: slugOf(spec.title, start),
      description: spec.description,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: spec.allDay ?? false,
      timezone: PERTH_TZ,
      facebookUrl: `https://www.facebook.com/events/1000000000000${spec.n}/`,
      source: 'facebook',
      cancelled: false,
      lastSeenAt: now.toISOString(),
    };
    if (spec.venue) event.location = { name: spec.venue.name, address: spec.venue.address, lat: spec.venue.lat, lng: spec.venue.lng };
    if (spec.ticketLink) event.ticketLink = spec.ticketLink;
    return event;
  }).sort((a, b) => a.start.localeCompare(b.start));
}
