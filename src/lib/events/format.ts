import type { Event } from '@/lib/content/types';
import { perthDayDiff, perthParts, perthStartOfDay, type DateParts } from '@/lib/events/tz';

/**
 * Display helpers for event cards and the homepage strip. All dates are
 * shown as Perth local time whatever the server's clock is set to.
 */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 86400000;
/** The homepage strip shows events starting within this many days. */
export const STRIP_WINDOW_DAYS = 14;

export type StripMode = 'today' | 'upcoming' | null;
export type StripState = { mode: StripMode; events: Event[] };

const startOf = (event: Event): Date => new Date(event.start);
const endOf = (event: Event): Date | undefined => (event.end ? new Date(event.end) : undefined);
const valid = (d: Date | undefined): d is Date => !!d && !Number.isNaN(d.getTime());

/** True when the event starts on the Perth calendar day containing `now`. */
export function isToday(event: Event, now: Date = new Date()): boolean {
  const start = startOf(event);
  return valid(start) && perthDayDiff(now, start) === 0;
}

/**
 * True when the event starts between the beginning of today (Perth) and
 * `days` days from now. Something that started earlier today still counts.
 */
export function withinDays(event: Event, days: number, now: Date = new Date()): boolean {
  const start = startOf(event);
  if (!valid(start)) return false;
  const from = perthStartOfDay(now).getTime();
  const to = now.getTime() + days * DAY_MS;
  return start.getTime() >= from && start.getTime() <= to;
}

/**
 * What the homepage strip should do: show today's events, show the next two
 * weeks, or render nothing at all. Cancelled events never appear.
 */
export function eventsStripState(events: Event[], now: Date = new Date()): StripState {
  const window = events
    .filter((e) => e.cancelled !== true && withinDays(e, STRIP_WINDOW_DAYS, now))
    .sort((a, b) => startOf(a).getTime() - startOf(b).getTime());
  if (window.length === 0) return { mode: null, events: [] };
  const today = window.filter((e) => isToday(e, now));
  if (today.length > 0) return { mode: 'today', events: today };
  return { mode: 'upcoming', events: window };
}

/** "6:30 pm", "10 am", "12 pm". */
export function formatTime(date: Date): string {
  const p = perthParts(date);
  const suffix = p.hour < 12 ? 'am' : 'pm';
  const hour = p.hour % 12 || 12;
  return p.minute === 0 ? `${hour} ${suffix}` : `${hour}:${String(p.minute).padStart(2, '0')} ${suffix}`;
}

const dayLabel = (p: DateParts) => `${WEEKDAYS[p.weekday]} ${p.day} ${MONTHS[p.month - 1]}`;

/**
 * "Sat 26 Sep, 6:30 pm", with the end time when it falls on the same day
 * ("Sat 26 Sep, 6:30 pm – 9:30 pm"). All-day events read "Sat 26 Sep, all
 * day" or "Sat 26 Sep – Sun 27 Sep".
 */
export function formatEventDate(event: Event): string {
  const start = startOf(event);
  if (!valid(start)) return '';
  const sp = perthParts(start);
  const end = endOf(event);

  if (event.allDay) {
    // iCal all-day ends are exclusive: an event on the 26th ends "on" the 27th.
    const last = valid(end) ? new Date(end.getTime() - 60000) : undefined;
    if (last && perthDayDiff(start, last) > 0) return `${dayLabel(sp)} – ${dayLabel(perthParts(last))}`;
    return `${dayLabel(sp)}, all day`;
  }

  const base = `${dayLabel(sp)}, ${formatTime(start)}`;
  if (!valid(end) || end.getTime() <= start.getTime()) return base;
  if (perthDayDiff(start, end) === 0) return `${base} – ${formatTime(end)}`;
  return `${base} – ${dayLabel(perthParts(end))}, ${formatTime(end)}`;
}

/** Pieces for a date badge: { weekday: 'Sat', day: '26', month: 'Sep' }. */
export function formatEventDay(event: Event): { weekday: string; day: string; month: string } {
  const start = startOf(event);
  if (!valid(start)) return { weekday: '', day: '', month: '' };
  const p = perthParts(start);
  return { weekday: WEEKDAYS[p.weekday], day: String(p.day), month: MONTHS[p.month - 1] };
}

/** Cuts at a word boundary and adds an ellipsis. Whitespace is collapsed first. */
export function truncateDescription(text: string | undefined, max = 160): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const boundary = cut.lastIndexOf(' ');
  const head = (boundary > 0 ? cut.slice(0, boundary) : clean.slice(0, max)).replace(/[\s,;:.!?–-]+$/, '');
  return `${head}…`;
}

// ---------------------------------------------------------------------------
// "Add to calendar"
// ---------------------------------------------------------------------------

const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const icsUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const icsDate = (d: Date) => {
  const p = perthParts(d);
  return `${p.year}${String(p.month).padStart(2, '0')}${String(p.day).padStart(2, '0')}`;
};

/** RFC 5545 line folding: 75 octets, continuation lines start with a space. */
function fold(line: string): string {
  const out: string[] = [];
  let current = '';
  let bytes = 0;
  for (const ch of line) {
    const size = Buffer.byteLength(ch, 'utf8');
    if (bytes + size > 75) {
      out.push(current);
      current = ' ';
      bytes = 1;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join('\r\n');
}

/** A one-event VCALENDAR for an "Add to calendar" link. */
export function eventToIcs(event: Event, now: Date = new Date()): string {
  const start = startOf(event);
  const end = endOf(event);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HAART//haart.org.au//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT'];
  lines.push(`UID:${icsText(event.uid || event.slug)}`);
  lines.push(`DTSTAMP:${icsUtc(now)}`);
  if (valid(start)) {
    if (event.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${icsDate(start)}`);
      if (valid(end)) lines.push(`DTEND;VALUE=DATE:${icsDate(end)}`);
    } else {
      lines.push(`DTSTART:${icsUtc(start)}`);
      if (valid(end)) lines.push(`DTEND:${icsUtc(end)}`);
    }
  }
  lines.push(`SUMMARY:${icsText(event.title)}`);
  if (event.description) lines.push(`DESCRIPTION:${icsText(event.description)}`);
  if (event.location?.address) lines.push(`LOCATION:${icsText(event.location.address)}`);
  if (event.facebookUrl) lines.push(`URL:${event.facebookUrl}`);
  if (event.cancelled) lines.push('STATUS:CANCELLED');
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

/** `href` for an "Add to calendar" link that downloads the event as a .ics file. */
export function eventToIcsHref(event: Event, now: Date = new Date()): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(eventToIcs(event, now))}`;
}
