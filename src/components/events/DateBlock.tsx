import type { Event } from '@/lib/content/types';
import { formatEventDay } from '@/lib/events/format';
import { perthParts } from '@/lib/events/tz';

/**
 * The event row's whole visual. A Facebook event has no picture, so the date
 * does the work a photograph would otherwise do: month as a rubric, the day
 * as a figure, the year underneath.
 *
 * Decorative by design — the accessible date is the `<time>` element in the
 * row's meta line, so this is hidden from assistive technology rather than
 * read out twice.
 *
 * Desktop: an 88px stacked block beside a vertical hairline.
 * Phone: one line ("Fri 18 Sep") above the title, the day numeral still large.
 */
export function DateBlock({ event, className = '' }: { event: Event; className?: string }) {
  const { weekday, day, month } = formatEventDay(event);
  const start = new Date(event.start);
  const year = Number.isNaN(start.getTime()) ? '' : String(perthParts(start).year);
  const figure = 'font-display font-black tabular-nums leading-[0.85] tracking-[-0.03em] text-[color:var(--rule)]';

  return (
    <div aria-hidden="true" className={`sm:w-[88px] sm:flex-none ${className}`}>
      {/* Phone: one line above the title. */}
      <p className="flex items-baseline gap-2 sm:hidden">
        <span className="text-rubric uppercase text-[color:var(--rule)]">{weekday}</span>
        <span className={`${figure} text-[2.5rem]`}>{day}</span>
        <span className="text-rubric uppercase text-[color:var(--rule)]">{month}</span>
        <span className="text-[0.75rem] text-[color:var(--text-muted)]">{year}</span>
      </p>

      {/* Desktop: the 88px block. */}
      <p className="hidden sm:block">
        <span className="block text-rubric uppercase text-[color:var(--rule)]">{month}</span>
        <span className={`mt-1 block text-[3.25rem] ${figure}`}>{day}</span>
        <span className="mt-1 block text-[0.75rem] text-[color:var(--text-muted)]">{year}</span>
      </p>
    </div>
  );
}
