import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { EventCard } from '@/components/events/EventCard';
import { getPastEvents, getUpcomingEvents } from '@/lib/events/queries';
import { JsonLd, eventJsonLd } from '@/lib/seo/jsonld';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

export async function EventListSection({ section, surface }: SectionProps<'section.eventList'>) {
  const [upcoming, past, settings] = await Promise.all([getUpcomingEvents(24), section.showPast === false ? Promise.resolve([]) : getPastEvents(6), getSiteSettings()]);
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <SectionHeading id={id} heading={section.heading ?? 'Upcoming'} />
        {upcoming.length ? (
          <Stagger as="ul" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <StaggerItem key={e.uid} as="li" className="h-full">
                <EventCard event={e} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="rounded-card border border-border bg-paper-0 p-8 text-center">
            <p className="text-lead">Nothing scheduled right now.</p>
            <p className="mt-2 text-body text-charcoal-700">
              New events are posted on{' '}
              <a href={settings.social.facebook ?? 'https://www.facebook.com/haartav'} className="text-red-600 underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                our Facebook page
              </a>{' '}
              and appear here automatically.
            </p>
          </div>
        )}
        {past.length ? (
          <>
            <h2 className="mt-14 mb-6 text-h2">Recent events</h2>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <li key={e.uid} className="h-full">
                  <EventCard event={e} />
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
