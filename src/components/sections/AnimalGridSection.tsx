import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { listAnimals } from '@/lib/animals';
import type { SectionProps } from './SectionRenderer';

export async function AnimalGridSection({ section, surface }: SectionProps<'section.animalGrid'>) {
  const animals = await listAnimals({ species: section.species && section.species !== 'all' ? section.species : undefined, status: 'adoptable', fosterNeeded: section.fosterNeededOnly || undefined, limit: section.limit ?? 4 });
  if (!animals.length) return null;
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading id={id} heading={section.heading} />
          {section.cta ? (
            <Button href={section.cta.href} variant="ghost" className="mb-8">
              {section.cta.label}
            </Button>
          ) : null}
        </div>
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {animals.map((a) => (
            <StaggerItem key={a.slug} as="li" className="h-full">
              <AnimalCard animal={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
