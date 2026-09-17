import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { EventCard } from '@/components/events/EventCard';
import { getUpcomingEvents } from '@/lib/events/queries';
import { eventsStripState } from '@/lib/events/format';
import type { SectionProps } from './SectionRenderer';

/**
 * Renders only when an event falls within the next fourteen days. The heading
 * switches between the on-today and coming-up framings. Never shows an empty state.
 */
export async function EventsStrip({ section, surface }: SectionProps<'section.eventsStrip'>) {
  const upcoming = await getUpcomingEvents(12);
  const { mode, events } = eventsStripState(upcoming, new Date());
  if (!mode || !events.length) return null;
  const id = `s-${section._key}`;
  const heading = mode === 'today' ? (section.headingToday ?? 'On today') : (section.headingUpcoming ?? 'Coming up');
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id={id} eyebrow="Events" heading={heading} />
          <Button href="/events" variant="ghost" className="mb-8">
            All events
          </Button>
        </div>
        <Stagger as="ul" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((e) => (
            <StaggerItem key={e.uid} as="li" className="h-full">
              <EventCard event={e} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
