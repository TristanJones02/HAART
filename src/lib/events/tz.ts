/**
 * Australia/Perth date helpers shared by the parser, the normaliser, the
 * formatter and the mock data. Everything goes through Intl so the code is
 * correct even if Western Australia ever reintroduces daylight saving.
 */
export const PERTH_TZ = 'Australia/Perth';

export type DateParts = { year: number; month: number; day: number; hour: number; minute: number; second: number; weekday: number };

const partsFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone: PERTH_TZ,
  hourCycle: 'h23',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  weekday: 'short',
});

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Calendar parts of an instant as seen on a clock in Perth. */
export function perthParts(date: Date): DateParts {
  const out: Record<string, string> = {};
  for (const p of partsFormatter.formatToParts(date)) out[p.type] = p.value;
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour) % 24,
    minute: Number(out.minute),
    second: Number(out.second),
    weekday: Math.max(0, WEEKDAYS.indexOf(out.weekday ?? '')),
  };
}

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

/** `yyyy-mm-dd` for the Perth calendar day containing the instant. */
export function perthDateKey(date: Date): string {
  const p = perthParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** `yyyymmdd` for the Perth calendar day containing the instant. */
export function perthCompactDate(date: Date): string {
  return perthDateKey(date).replace(/-/g, '');
}

/** UTC offset of Perth at the given instant, in minutes east of UTC. */
export function perthOffsetMinutes(date: Date): number {
  const p = perthParts(date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}

/**
 * The instant at which a Perth wall-clock time occurs. Months are 1-based.
 * Solves for the offset with one refinement step so it holds across any
 * future daylight-saving transition.
 */
export function perthLocalToDate(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): Date {
  const naive = Date.UTC(year, month - 1, day, hour, minute, second);
  let guess = new Date(naive - perthOffsetMinutes(new Date(naive)) * 60000);
  const refined = new Date(naive - perthOffsetMinutes(guess) * 60000);
  if (refined.getTime() !== guess.getTime()) guess = refined;
  return guess;
}

/** Midnight in Perth at the start of the Perth day containing the instant. */
export function perthStartOfDay(date: Date): Date {
  const p = perthParts(date);
  return perthLocalToDate(p.year, p.month, p.day);
}

/** Days between two Perth calendar days (b - a), ignoring the time of day. */
export function perthDayDiff(a: Date, b: Date): number {
  const pa = perthParts(a);
  const pb = perthParts(b);
  return Math.round((Date.UTC(pb.year, pb.month - 1, pb.day) - Date.UTC(pa.year, pa.month - 1, pa.day)) / 86400000);
}

/** ISO 8601 string with the Perth offset, e.g. 2026-09-26T18:30:00+08:00. */
export function toPerthIso(date: Date): string {
  const p = perthParts(date);
  const off = perthOffsetMinutes(date);
  const sign = off >= 0 ? '+' : '-';
  const abs = Math.abs(off);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}
