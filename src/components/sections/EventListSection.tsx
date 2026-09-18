import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { RuleLink } from '@/components/art';
import { EventCard } from '@/components/events/EventCard';
import { getPastEvents, getUpcomingEvents } from '@/lib/events/queries';
import { JsonLd, eventJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/**
 * The diary: upcoming events as a ruled list, then a hairline, then what has
 * already been. No cards, no map tiles — every row is the composition in
 * §6.6 and the date block carries it.
 */
export async function EventListSection({ section, canvas }: SectionProps<'section.eventList'>) {
  const [upcoming, past, settings] = await Promise.all([getUpcomingEvents(24), section.showPast === false ? Promise.resolve([]) : getPastEvents(6), getSiteSettings()]);
  const id = `s-${section._key}`;
  return (
    <Section canvas={canvas} labelledBy={id}>
      <Container>
        <SectionHeading id={id} eyebrow="What's on" heading={section.heading ?? 'Upcoming'} />
        {upcoming.length ? (
          <ul className="border-t border-[color:var(--hairline)]">
            {upcoming.map((e) => (
              <li key={e.uid}>
                <EventCard event={e} detail />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border-t border-[color:var(--hairline)] py-8">
            <p className="text-feature font-display">Nothing scheduled right now.</p>
            <p className="mt-3 max-w-prose text-body text-[color:var(--text-muted)]">New events are posted on our Facebook page and appear here automatically.</p>
            <p className="mt-5">
              <RuleLink href={settings.social.facebook ?? 'https://www.facebook.com/haartav'}>Our Facebook page</RuleLink>
            </p>
          </div>
        )}
        {past.length ? (
          <>
            <h3 className="mt-14 mb-6 flex items-center gap-3 text-rubric uppercase text-[color:var(--text-caption)]">Recent events</h3>
            <ul className="border-t border-[color:var(--hairline)]">
              {past.map((e) => (
                <li key={e.uid}>
                  <EventCard event={e} past detail />
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {upcoming.map((e) => (
          <JsonLd key={e.uid} data={eventJsonLd(e)} />
        ))}
      </Container>
    </Section>
  );
}
