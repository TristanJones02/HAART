import { Container, Section } from '@/components/ui/Container';
import { RuleLink } from '@/components/art';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { AnimalCard } from '@/components/animals/AnimalCard';
import { RollCall } from '@/components/animals/RollCall';
import { listAnimals } from '@/lib/animals';
import { sortAnimals } from '@/lib/animals/types';
import type { SectionProps } from './SectionRenderer';

/**
 * The roll call is this block's lead: every animal on the register by name at
 * poster scale, then a short register row of cards underneath. Both come from
 * the same query, so the names and the cards can never disagree.
 */
export async function AnimalGridSection({ section, canvas }: SectionProps<'section.animalGrid'>) {
  const species = section.species && section.species !== 'all' ? section.species : undefined;
  const register = await listAnimals({ species, status: 'adoptable' });
  if (!register.length) return null;

  const pool = section.fosterNeededOnly ? register.filter((a) => a.fosterNeeded) : register;
  const cards = sortAnimals(pool, 'newest').slice(0, section.limit ?? 4);
  const listingHref = species ? `/adopt/${species === 'dog' ? 'dogs' : 'cats'}` : '/adopt';
  const id = `s-${section._key}`;

  return (
    <Section canvas={canvas} labelledBy={id}>
      <Container>
        {/* The names at 52px are this block's heading; the editor's is the accessible one. */}
        <h2 id={id} className="sr-only">
          {section.heading ?? 'Animals on the register'}
        </h2>
        <RollCall animals={register} moreHref={listingHref} />
        {cards.length ? (
          <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {cards.map((a) => (
              <StaggerItem key={`${a.slug}-${a.haartId}`} as="li" className="h-full">
                <AnimalCard animal={a} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
        <p className="mt-10">
          <RuleLink href={section.cta?.href ?? listingHref}>{section.cta?.label ?? 'See all animals'}</RuleLink>
        </p>
      </Container>
    </Section>
  );
}
