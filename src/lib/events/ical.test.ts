import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseIcal, parseIcalDetailed, stripDescriptionTail } from '@/lib/events/ical';

const fixture = readFileSync(path.join(process.cwd(), 'fixtures', 'sample-events.ics'), 'utf8');
const NOW = new Date('2026-09-17T00:00:00Z');

describe('parseIcal with the Facebook-style fixture', () => {
  const events = parseIcal(fixture, { now: NOW });
  const byUid = new Map(events.map((e) => [e.uid, e]));

  it('yields one event per VEVENT plus one per recurrence occurrence', () => {
    expect(events).toHaveLength(8);
    expect([...byUid.keys()].sort()).toEqual([
      'e1234567890101@facebook.com',
      'e1234567890102@facebook.com',
      'e1234567890103@facebook.com_20261104',
      'e1234567890103@facebook.com_20261111',
      'e1234567890103@facebook.com_20261118',
      'e1234567890104@facebook.com',
      'e1234567890105@facebook.com',
      'e1234567890106@facebook.com',
    ]);
  });

  it('unfolds long lines, unescapes commas and newlines, and strips the Facebook URL tail', () => {
    const e = byUid.get('e1234567890101@facebook.com')!;
    expect(e.title).toBe('Adoption day at Pet Fresh Bibra Lake');
    expect(e.description).toContain('caring for, so you can say hello');
    expect(e.description).toContain('matter.\n\nIf you would like');
    expect(e.description?.endsWith('pre-adoption form first.')).toBe(true);
    expect(e.description).not.toContain('facebook.com');
    expect(e.location).toBe('Pet Fresh Bibra Lake, Bibra Lake WA 6163');
    expect(e.url).toBe('https://www.facebook.com/events/1234567890101/');
    expect(e.start.toISOString()).toBe('2026-10-10T02:00:00.000Z');
    expect(e.end?.toISOString()).toBe('2026-10-10T05:00:00.000Z');
    expect(e.allDay).toBe(false);
    expect(e.cancelled).toBe(false);
    expect(e.recurring).toBe(false);
  });

  it('reads DTSTART;TZID=Australia/Perth as Perth local time', () => {
    const e = byUid.get('e1234567890102@facebook.com')!;
    expect(e.start.toISOString()).toBe('2026-10-24T10:30:00.000Z');
    expect(e.end?.toISOString()).toBe('2026-10-24T14:00:00.000Z');
    expect(e.description).toContain('nibbles; drinks');
  });

  it('expands a weekly RRULE with COUNT=3 into three dated occurrences', () => {
    const occurrences = events.filter((e) => e.uid.startsWith('e1234567890103@facebook.com_'));
    expect(occurrences).toHaveLength(3);
    expect(occurrences.map((e) => e.start.toISOString())).toEqual(['2026-11-04T11:00:00.000Z', '2026-11-11T11:00:00.000Z', '2026-11-18T11:00:00.000Z']);
    for (const o of occurrences) {
      expect(o.recurring).toBe(true);
      expect(o.title).toBe('Rock Music Bingo');
      expect(o.url).toBe('https://www.facebook.com/events/1234567890103/');
      expect(o.end!.getTime() - o.start.getTime()).toBe(3 * 3600000);
      expect(o.description).not.toContain('facebook.com');
    }
  });

  it('detects all-day events and anchors them to Perth midnight with an exclusive end', () => {
    const e = byUid.get('e1234567890104@facebook.com')!;
    expect(e.allDay).toBe(true);
    expect(e.start.toISOString()).toBe('2026-11-13T16:00:00.000Z');
    expect(e.end?.toISOString()).toBe('2026-11-14T16:00:00.000Z');
  });

  it('flags STATUS:CANCELLED', () => {
    expect(byUid.get('e1234567890105@facebook.com')?.cancelled).toBe(true);
    expect(events.filter((e) => e.cancelled)).toHaveLength(1);
  });

  it('leaves location undefined when there is no LOCATION line', () => {
    const e = byUid.get('e1234567890106@facebook.com')!;
    expect(e.location).toBeUndefined();
    expect(e.url).toBe('https://www.facebook.com/events/1234567890106/');
  });

  it('never reports warnings for a clean feed', () => {
    expect(parseIcalDetailed(fixture, { now: NOW }).warnings).toEqual([]);
  });
});

describe('parseIcal edge cases', () => {
  const wrap = (...vevents: string[]) => ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//test//EN', ...vevents, 'END:VCALENDAR'].join('\r\n');
  const vevent = (lines: string[]) => ['BEGIN:VEVENT', 'DTSTAMP:20260901T000000Z', ...lines, 'END:VEVENT'].join('\r\n');

  it('skips a VEVENT without DTSTART and records a warning instead of throwing', () => {
    const text = wrap(vevent(['UID:broken@facebook.com', 'SUMMARY:No start']), vevent(['UID:ok@facebook.com', 'SUMMARY:Fine', 'DTSTART:20261001T100000Z']));
    const result = parseIcalDetailed(text, { now: NOW });
    expect(result.events.map((e) => e.uid)).toEqual(['ok@facebook.com']);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/broken@facebook.com.*DTSTART/);
    expect(result.fatal).toBeUndefined();
  });

  it('returns no events and a fatal message for input that is not a calendar', () => {
    const result = parseIcalDetailed('<html><body>Log in to Facebook</body></html>', { now: NOW });
    expect(result.events).toEqual([]);
    expect(result.fatal).toMatch(/not an iCalendar/);
    expect(parseIcal('')).toEqual([]);
  });

  it('only expands recurrences within the next 365 days', () => {
    const text = wrap(vevent(['UID:weekly@facebook.com', 'SUMMARY:Weekly', 'DTSTART:20261104T110000Z', 'DTEND:20261104T130000Z', 'RRULE:FREQ=WEEKLY;COUNT=104']));
    const events = parseIcal(text, { now: NOW });
    const horizon = NOW.getTime() + 365 * 86400000;
    expect(events.length).toBeGreaterThan(40);
    expect(events.length).toBeLessThan(104);
    expect(events.every((e) => e.start.getTime() <= horizon)).toBe(true);
    expect(new Set(events.map((e) => e.uid)).size).toBe(events.length);
  });

  it('ignores a URL that is not http(s) and keeps description links out of url', () => {
    const text = wrap(vevent(['UID:u@facebook.com', 'SUMMARY:Thing', 'DTSTART:20261001T100000Z', 'URL:mailto:someone@example.com', 'DESCRIPTION:See https://www.facebook.com/events/999/']));
    const [e] = parseIcal(text, { now: NOW });
    expect(e.url).toBeUndefined();
    expect(e.description).toBe('See');
  });
});

describe('stripDescriptionTail', () => {
  it('removes a trailing Facebook event link and surrounding whitespace', () => {
    expect(stripDescriptionTail('Hello there.\n\nhttps://www.facebook.com/events/123/')).toBe('Hello there.');
    expect(stripDescriptionTail('Hello there.\n\nhttps://www.facebook.com/events/123/?ref=1 \n')).toBe('Hello there.');
    expect(stripDescriptionTail('No link here.')).toBe('No link here.');
    expect(stripDescriptionTail('https://www.facebook.com/events/123/')).toBe('');
  });
  it('keeps links that are not at the end', () => {
    expect(stripDescriptionTail('See https://www.facebook.com/events/1/ for details.')).toBe('See https://www.facebook.com/events/1/ for details.');
  });
});
