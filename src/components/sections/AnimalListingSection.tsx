import { Container, Section } from '@/components/ui/Container';
import { AnimalGrid } from '@/components/animals/AnimalGrid';
import { listAnimals } from '@/lib/animals';
import { CONTENT_SOURCE } from '@/lib/content/mode';
import type { SectionProps } from './SectionRenderer';

/** Full listing for one species. Adopted animals are included so the client filter can reveal them. */
export async function AnimalListingSection({ section, surface }: SectionProps<'section.animalListing'>) {
  const animals = await listAnimals({ species: section.species });
  return (
    <Section surface={surface}>
      <Container>
        {section.intro ? <p className="mb-6 max-w-prose text-lead text-charcoal-700">{section.intro}</p> : null}
        {animals.length ? (
          <AnimalGrid animals={animals} species={section.species} />
        ) : (
          <div className="rounded-card border border-border bg-paper-0 p-8 text-center">
            <p className="text-lead">No {section.species === 'dog' ? 'dogs' : 'cats'} are listed right now.</p>
            <p className="mt-2 text-body text-charcoal-700">New animals are added most weeks. Follow us on Facebook to hear first, or fill in the questionnaire so we can call you when the right match comes in.</p>
            {CONTENT_SOURCE === 'none' ? <p className="mt-4 text-small text-charcoal-550">Listings are not connected yet.</p> : null}
          </div>
        )}
      </Container>
    </Section>
  );
}
