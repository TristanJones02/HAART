import { Container, Section } from '@/components/ui/Container';
import { FolioBar } from '@/components/art';
import { AnimalGrid } from '@/components/animals/AnimalGrid';
import { RollCall, registerCount } from '@/components/animals/RollCall';
import { listAnimals } from '@/lib/animals';
import { CONTENT_SOURCE } from '@/lib/content/mode';
import type { SectionProps } from './SectionRenderer';

/**
 * The full listing for one species: the roll call, then the chips, then the
 * grid. Adopted animals are loaded with the rest so the "Adopted animals"
 * chip can reveal them — every animal keeps its page.
 */
export async function AnimalListingSection({ section, canvas }: SectionProps<'section.animalListing'>) {
  const animals = await listAnimals({ species: section.species });
  const speciesPlural = section.species === 'dog' ? 'dogs' : 'cats';
  const { total } = registerCount(animals);
  const anchor = `all-${speciesPlural}`;
  const id = `s-${section._key}`;

  return (
    <Section canvas={canvas} labelledBy={id}>
      <Container>
        <h2 id={id} className="sr-only">
          {section.species === 'dog' ? 'All dogs' : 'All cats'}
        </h2>
        {total > 0 ? (
          <RollCall animals={animals} moreHref={`#${anchor}`} />
        ) : (
          <>
            <FolioBar rubric="On the register right now" />
            <p className="text-feature font-display">No {speciesPlural} are listed right now.</p>
            <p className="mt-4 max-w-[62ch] text-body">
              New animals are added most weeks. Follow us on Facebook to hear first, or fill in the questionnaire so we can call you when the right match comes in.
            </p>
            {CONTENT_SOURCE === 'none' ? <p className="mt-4 text-small text-[color:var(--text-muted)]">Listings are not connected yet.</p> : null}
          </>
        )}
        {section.intro ? <p className="mt-6 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{section.intro}</p> : null}
        {animals.length ? (
          <div id={anchor} className="mt-10 scroll-mt-24">
            <AnimalGrid animals={animals} species={section.species} />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
