import type { Event } from '@/lib/content/types';
import { RuleLink } from '@/components/art';
import { DateBlock } from './DateBlock';
import { formatEventDate, truncateDescription } from '@/lib/events/format';

/**
 * Not a card: a row in a ruled list. A Facebook event has no picture, so
 * there is no image slot at all — the date block is the visual, a vertical
 * hairline divides it from the words, and the only chrome is the rule under
 * the row.
 *
 * `detail` adds the event's own description; the events page uses it, the
 * home strip does not.
 */
export function EventCard({ event, past = false, detail = false }: { event: Event; past?: boolean; detail?: boolean }) {
  const venue = event.location?.name ?? event.location?.address;
  const when = formatEventDate(event);
  const description = detail ? truncateDescription(event.description, 180) : '';

  return (
    <article className="border-b border-[color:var(--hairline)] py-6 sm:flex sm:items-start sm:gap-6 sm:py-7">
      {/* Decorative: the accessible date is the <time> element below. */}
      <DateBlock event={event} className={past ? 'opacity-70' : ''} />

      <span aria-hidden="true" className="hidden w-px self-stretch bg-[color:var(--hairline)] sm:block" />

      <div className="mt-3 min-w-0 flex-1 sm:mt-0">
        {past || event.cancelled ? (
          <p className="mb-2 flex flex-wrap items-center gap-3">
            {event.cancelled ? <span className="bg-charcoal-900 px-2 py-1 text-index-label uppercase text-paper-0">Cancelled</span> : null}
            {past ? <span className="text-index-label uppercase text-[color:var(--text-caption)]">Past</span> : null}
          </p>
        ) : null}

        <h3 className="text-cardname font-display text-balance">{event.title}</h3>

        <p className="mt-2 text-[0.875rem] text-[color:var(--text-muted)]">
          <time dateTime={event.start}>{when}</time>
          {venue ? (
            <>
              <span aria-hidden="true"> · </span>
              {venue}
            </>
          ) : null}
        </p>

        {description ? <p className="mt-2 max-w-prose text-small text-[color:var(--text-muted)]">{description}</p> : null}

        {event.facebookUrl || event.ticketLink ? (
          <p className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
            {event.facebookUrl ? (
              <RuleLink href={event.facebookUrl}>
                View on Facebook<span className="sr-only">: {event.title}</span>
              </RuleLink>
            ) : null}
            {event.ticketLink ? (
              <RuleLink href={event.ticketLink}>
                Buy tickets<span className="sr-only"> for {event.title}</span>
              </RuleLink>
            ) : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}
