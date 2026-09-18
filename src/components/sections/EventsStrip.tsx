import { Container, Section } from '@/components/ui/Container';
import { FolioBar, RuleLink, sectionHeadClass } from '@/components/art';
import { EventCard } from '@/components/events/EventCard';
import { getUpcomingEvents } from '@/lib/events/queries';
import { eventsStripState } from '@/lib/events/format';
import type { SectionProps } from './SectionRenderer';

/**
 * Renders only when an event falls within the next fourteen days. The heading
 * switches between the on-today and coming-up framings. Never shows an empty state.
 */
export async function EventsStrip({ section, canvas, index, topRule }: SectionProps<'section.eventsStrip'>) {
  const upcoming = await getUpcomingEvents(12);
  const { mode, events } = eventsStripState(upcoming, new Date());
  if (!mode || !events.length) return null;
  const id = `s-${section._key}`;
  const heading = mode === 'today' ? (section.headingToday ?? 'On today') : (section.headingUpcoming ?? 'Coming up');
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="What's on" numeral={index + 1} />
        <h2 id={id} className={sectionHeadClass(heading)}>
          {heading}
        </h2>
        <ul className="mt-10 border-t border-[color:var(--hairline)]">
          {events.slice(0, 3).map((e) => (
            <li key={e.uid}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <RuleLink href="/events">All events</RuleLink>
        </p>
      </Container>
    </Section>
  );
}
