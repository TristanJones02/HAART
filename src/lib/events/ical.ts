import ical from 'node-ical';
import type { CalendarComponent, DateWithTimeZone, ParameterValue, VEvent } from 'node-ical';
import { perthCompactDate, perthLocalToDate } from '@/lib/events/tz';

/**
 * One event (or one occurrence of a recurring event) read from an iCalendar
 * feed. Dates are real instants; all-day events are pinned to midnight in
 * Perth so `start` sorts and compares like any other event.
 */
export type ParsedEvent = {
  /** The VEVENT UID, suffixed with `_yyyymmdd` for each occurrence of a recurring event. */
  uid: string;
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  allDay: boolean;
  /** The raw LOCATION string, e.g. "Venue, 1 Street, Suburb WA 6000". */
  location?: string;
  /** The URL property, untouched. Facebook puts the event page here. */
  url?: string;
  cancelled: boolean;
  recurring: boolean;
};

export type ParseOptions = {
  /** "Now" for the recurrence window; defaults to the wall clock. */
  now?: Date;
};

export type ParseResult = {
  events: ParsedEvent[];
  warnings: string[];
  /** Set when the whole input could not be read; `events` is then empty and nothing should be written. */
  fatal?: string;
};

const DAY_MS = 86400000;
/** Occurrences of recurring events are expanded from a day ago to a year ahead. */
const RECURRENCE_LOOKBACK_MS = DAY_MS;
const RECURRENCE_HORIZON_MS = 365 * DAY_MS;

/**
 * Facebook appends the event page URL to the end of DESCRIPTION, separated by
 * a blank line. That URL is exposed through `url` (from the URL property), so
 * the description tail is stripped. Any trailing facebook.com/events link is
 * removed, whether or not it matches the URL property.
 */
const DESCRIPTION_TAIL = /(?:\s*https?:\/\/(?:www\.|m\.)?facebook\.com\/events\/\S*)+\s*$/i;

export function stripDescriptionTail(text: string): string {
  return text.replace(DESCRIPTION_TAIL, '').replace(/\s+$/, '');
}

/** Parses `text` and returns the events, or an empty list if the text is not an iCalendar document. */
export function parseIcal(text: string, options: ParseOptions = {}): ParsedEvent[] {
  return parseIcalDetailed(text, options).events;
}

/**
 * Same as `parseIcal` but also returns the warnings collected for VEVENTs
 * that were skipped. Never throws: unparseable input yields no events and one
 * warning describing why.
 */
export function parseIcalDetailed(text: string, options: ParseOptions = {}): ParseResult {
  const warnings: string[] = [];
  const events: ParsedEvent[] = [];
  const now = options.now ?? new Date();

  if (typeof text !== 'string' || !/BEGIN:VCALENDAR/i.test(text)) {
    const fatal = 'Input is not an iCalendar document (no BEGIN:VCALENDAR)';
    return { events, warnings: [fatal], fatal };
  }

  let parsed: Record<string, CalendarComponent | undefined>;
  try {
    parsed = ical.sync.parseICS(text) as Record<string, CalendarComponent | undefined>;
  } catch (err) {
    const fatal = `Could not parse calendar: ${errorMessage(err)}`;
    return { events, warnings: [fatal], fatal };
  }

  for (const [key, component] of Object.entries(parsed)) {
    if (!component || typeof component !== 'object' || (component as { type?: string }).type !== 'VEVENT') continue;
    const vevent = component as VEvent;
    try {
      const uid = typeof vevent.uid === 'string' && vevent.uid.trim() ? vevent.uid.trim() : key;
      if (!(vevent.start instanceof Date) || Number.isNaN(vevent.start.getTime())) {
        warnings.push(`Skipped "${uid}": missing or invalid DTSTART`);
        continue;
      }
      const title = paramValue(vevent.summary)?.trim();
      if (!title) {
        warnings.push(`Skipped "${uid}": missing SUMMARY`);
        continue;
      }

      const base = readBase(vevent, uid, title);

      if (vevent.rrule) {
        events.push(...expand(vevent, base, now, warnings));
      } else {
        events.push(base);
      }
    } catch (err) {
      warnings.push(`Skipped "${key}": ${errorMessage(err)}`);
    }
  }

  return { events, warnings };
}

function readBase(vevent: VEvent, uid: string, title: string): ParsedEvent {
  const allDay = vevent.datetype === 'date' || vevent.start.dateOnly === true;
  const start = toInstant(vevent.start, allDay);
  const rawEnd = vevent.end instanceof Date && !Number.isNaN(vevent.end.getTime()) ? toInstant(vevent.end, allDay) : undefined;
  // An end before the start is a malformed event; keep the start and drop the end.
  const end = rawEnd && rawEnd.getTime() >= start.getTime() ? rawEnd : undefined;

  const rawDescription = paramValue(vevent.description);
  const description = rawDescription ? stripDescriptionTail(rawDescription.replace(/\r\n?/g, '\n')) : '';
  const location = paramValue(vevent.location)?.trim();
  const url = paramValue(vevent.url as ParameterValue | undefined)?.trim();

  return {
    uid,
    title,
    description: description || undefined,
    start,
    end,
    allDay,
    location: location || undefined,
    url: url && /^https?:\/\//i.test(url) ? url : undefined,
    cancelled: String(vevent.status ?? '').toUpperCase() === 'CANCELLED',
    recurring: false,
  };
}

/**
 * Expands a recurring VEVENT into its occurrences from a day ago to a year
 * ahead. Each occurrence gets its own uid so it is its own document. If the
 * rule cannot be expanded the base event is kept as a single occurrence.
 */
function expand(vevent: VEvent, base: ParsedEvent, now: Date, warnings: string[]): ParsedEvent[] {
  const from = new Date(now.getTime() - RECURRENCE_LOOKBACK_MS);
  const to = new Date(now.getTime() + RECURRENCE_HORIZON_MS);
  let instances: ReturnType<typeof ical.expandRecurringEvent>;
  try {
    instances = ical.expandRecurringEvent(vevent, { from, to });
  } catch (err) {
    warnings.push(`Could not expand RRULE for "${base.uid}", kept the first occurrence only: ${errorMessage(err)}`);
    return [{ ...base, recurring: true }];
  }

  const out: ParsedEvent[] = [];
  const seen = new Set<string>();
  for (const instance of instances) {
    if (!(instance.start instanceof Date) || Number.isNaN(instance.start.getTime())) continue;
    const allDay = instance.isFullDay || base.allDay;
    const start = toInstant(instance.start, allDay);
    const end = instance.end instanceof Date && !Number.isNaN(instance.end.getTime()) ? toInstant(instance.end, allDay) : undefined;
    const uid = `${base.uid}_${perthCompactDate(start)}`;
    if (seen.has(uid)) continue;
    seen.add(uid);
    // An override (RECURRENCE-ID) may carry its own title, description or status.
    const override = instance.isOverride ? instance.event : undefined;
    const title = override ? (paramValue(override.summary)?.trim() || base.title) : base.title;
    const overrideDescription = override ? paramValue(override.description) : undefined;
    const overrideLocation = override ? paramValue(override.location)?.trim() : undefined;
    const overrideStatus = override ? String(override.status ?? '').toUpperCase() : '';
    out.push({
      ...base,
      uid,
      title,
      description: overrideDescription ? stripDescriptionTail(overrideDescription) || undefined : base.description,
      location: overrideLocation || base.location,
      start,
      end: end && end.getTime() >= start.getTime() ? end : undefined,
      allDay,
      cancelled: override ? overrideStatus === 'CANCELLED' : base.cancelled,
      recurring: true,
    });
  }
  return out;
}

/**
 * node-ical represents DATE values as midnight UTC on that calendar day. An
 * all-day event in Perth starts at Perth midnight, so re-anchor those; timed
 * values are already correct instants.
 */
function toInstant(value: DateWithTimeZone, allDay: boolean): Date {
  if (!allDay) return new Date(value.getTime());
  return perthLocalToDate(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
}

function paramValue(value: ParameterValue | undefined): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'val' in value && typeof value.val === 'string') return value.val;
  return undefined;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
