import { Container, Section } from '@/components/ui/Container';
import { FolioBar, RuleLink, sectionHeadClass } from '@/components/art';
import { EventCard } from '@/components/events/EventCard';
import { getPastEvents, getUpcomingEvents } from '@/lib/events/queries';
import { JsonLd, eventJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/**
 * The diary: upcoming events as a ruled list, then a hairline, then what has
 * already been. No cards and no map tiles — every row is the composition in
 * §6.6, and the date block carries it.
 */
export async function EventListSection({ section, canvas, index, topRule }: SectionProps<'section.eventList'>) {
  const [upcoming, past, settings] = await Promise.all([getUpcomingEvents(24), section.showPast === false ? Promise.resolve([]) : getPastEvents(6), getSiteSettings()]);
  const id = `s-${section._key}`;
  const heading = section.heading ?? 'Upcoming';
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="What's on" numeral={index + 1} />
        <h2 id={id} className={sectionHeadClass(heading)}>
          {heading}
        </h2>
        {upcoming.length ? (
          <ul className="mt-10 border-t border-[color:var(--hairline)]">
            {upcoming.map((e) => (
              <li key={e.uid}>
                <EventCard event={e} detail />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 border-t border-[color:var(--hairline)] py-8">
            <p className="text-feature font-display">Nothing scheduled right now.</p>
            <p className="mt-3 max-w-[62ch] text-[color:var(--text-muted)]">New events are posted on our Facebook page and appear here automatically.</p>
            <p className="mt-6">
              <RuleLink href={settings.social.facebook ?? 'https://www.facebook.com/haartav'}>Our Facebook page</RuleLink>
            </p>
          </div>
        )}
        {past.length ? (
          <>
            <h3 className="mb-6 mt-14 text-rubric uppercase text-[color:var(--text-caption)]">Recent events</h3>
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
