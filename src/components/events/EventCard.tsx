import type { Event } from '@/lib/content/types';
import { SmartImage } from '@/components/ui/SmartImage';
import { UiIcon } from '@/components/ui/Icon';
import { HoverLift } from '@/components/motion/HoverLift';
import { formatEventDate, formatEventDay, truncateDescription } from '@/lib/events/format';
import { staticMapUrl } from '@/lib/events/maptile';
import { Button } from '@/components/ui/Button';

/**
 * Event card as briefed: static map tile header (or the event image when an
 * editor sets one), title, two-line description, date badge, location badge,
 * click-through to the Facebook event from the iCal URL field.
 */
export function EventCard({ event }: { event: Event }) {
  const map = event.location?.lat && event.location?.lng ? staticMapUrl({ lat: event.location.lat, lng: event.location.lng, width: 600, height: 340 }) : null;
  const day = formatEventDay(event);
  const href = event.facebookUrl;
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <HoverLift>
      <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-paper-0 shadow-card transition-shadow duration-150 hover:shadow-card-hover">
        <Wrapper {...wrapperProps} className="group flex h-full flex-col">
          <div className="relative aspect-[16/9] bg-paper-100">
            {event.image ? (
              <SmartImage image={event.image} aspect="absolute inset-0" sizes="(min-width: 1024px) 360px, 100vw" className="!absolute" />
            ) : map ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={map} alt="" width={600} height={340} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-charcoal-300">
                <UiIcon name="MapPin" size={24} />
              </div>
            )}
            <div className="absolute left-3 top-3 flex flex-col items-center rounded-control bg-paper-0 px-2.5 py-1.5 text-center shadow-card" aria-hidden="true">
              <span className="text-tiny uppercase tracking-caps text-red-600">{day.month}</span>
              <span className="font-display text-h2 leading-none text-charcoal-900">{day.day}</span>
              <span className="text-tiny text-charcoal-550">{day.weekday}</span>
            </div>
            {event.cancelled ? <span className="absolute right-3 top-3 rounded-pill bg-charcoal-900 px-2.5 py-1 text-tiny font-semibold uppercase tracking-caps text-paper-0">Cancelled</span> : null}
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="text-h3 group-hover:text-red-600">{event.title}</h3>
            <dl className="mt-2 space-y-1 text-small text-charcoal-700">
              <div className="flex items-center gap-2">
                <dt className="sr-only">When</dt>
                <UiIcon name="Clock" size={16} className="shrink-0 text-charcoal-500" />
                <dd>{formatEventDate(event)}</dd>
              </div>
              {event.location?.name || event.location?.address ? (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Where</dt>
                  <UiIcon name="MapPin" size={16} className="shrink-0 text-charcoal-500" />
                  <dd className="truncate">{event.location.name ?? event.location.address}</dd>
                </div>
              ) : null}
            </dl>
            {event.description ? <p className="mt-3 line-clamp-2 flex-1 text-body text-charcoal-700">{truncateDescription(event.description, 180)}</p> : null}
            {href ? (
              <span className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-red-600 group-hover:underline">
                View on Facebook
                <UiIcon name="ExternalLink" size={16} />
              </span>
            ) : null}
          </div>
        </Wrapper>
        {event.ticketLink ? (
          <div className="border-t border-border p-4 pt-3">
            <Button href={event.ticketLink} variant="secondary" className="w-full">
              Buy tickets
            </Button>
          </div>
        ) : null}
      </article>
    </HoverLift>
  );
}
