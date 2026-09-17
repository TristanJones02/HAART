import { Container, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { getFosterNeeded } from '@/lib/animals';
import type { SectionProps } from './SectionRenderer';

/** Renders nothing when no animal is flagged. Uses the urgent surface (Red 50), never a red fill. */
export async function FosterNeededStrip({ section }: SectionProps<'section.fosterNeededStrip'>) {
  const animals = await getFosterNeeded(4);
  if (!animals.length) return null;
  const id = `s-${section._key}`;
  return (
    <section className="border-y border-red-100 bg-red-50 py-12 sm:py-16" aria-labelledby={id}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id={id} eyebrow="Foster carers needed" heading={section.heading ?? 'Needing a foster home now'} lead={section.text} />
          <Button href="/foster" className="mb-8">
            Become a foster carer
          </Button>
        </div>
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {animals.map((a) => (
            <StaggerItem key={a.slug} as="li" className="h-full">
              <AnimalCard animal={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
