import { FolioBar, Plate, PlateFrame, RuleLink, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import { countAdoptable } from '@/lib/animals';
import type { SectionProps } from './SectionRenderer';

/**
 * Two wide framed tiles with a live count set at figure scale. The icon
 * pebbles are replaced by plates — the ink colourway for dogs and sand for
 * cats, never signal: the signal plate appears exactly twice on the whole
 * site, and a third red mass on a two-page journey is how the poster failed.
 */
export async function SpeciesTiles({ section, canvas, topRule }: SectionProps<'section.speciesTiles'>) {
  const [dogs, cats] = await Promise.all([countAdoptable('dog'), countAdoptable('cat')]);
  const id = `s-${section._key}`;
  const tiles = [
    { href: '/adopt/dogs', rubric: 'Adopt a dog', title: 'Dogs', text: section.dogsText, count: dogs, plate: 'dog-pair' as const, colourway: 'ink' as const, link: 'See the dogs' },
    { href: '/adopt/cats', rubric: 'Adopt a cat', title: 'Cats', text: section.catsText, count: cats, plate: 'cat-pair' as const, colourway: 'sand' as const, link: 'See the cats' },
  ];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Dogs and cats" />
        {section.heading ? (
          <h2 id={id} className={`mb-10 ${sectionHeadClass(section.heading)}`}>
            {section.heading}
          </h2>
        ) : null}
        <ul className="grid gap-6">
          {tiles.map((t) => (
            <li key={t.href} className="grid items-center gap-6 border border-charcoal-900 p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,300px)] sm:gap-10 sm:p-8">
              <div>
                <p className="text-rubric uppercase text-[color:var(--text-caption)]">{t.rubric}</p>
                <h3 className="mt-3 text-section">{t.title}</h3>
                {t.count > 0 ? (
                  <p className="mt-5 flex items-baseline gap-3">
                    <span className="font-display text-figure tabular-nums text-[color:var(--rule)]">{t.count}</span>
                    <span className="text-rubric uppercase text-[color:var(--text-muted)]">looking for a home</span>
                  </p>
                ) : (
                  <p className="mt-5 text-deck italic text-[color:var(--text-muted)]">None listed just now. Ask us what is coming in.</p>
                )}
                {t.text ? <p className="mt-4 max-w-[42ch] text-[color:var(--text-muted)]">{t.text}</p> : null}
                <p className="mt-6">
                  <RuleLink href={t.href}>{t.link}</RuleLink>
                </p>
              </div>
              <PlateFrame ratio="4/3" className="order-first sm:order-none">
                <Plate name={t.plate} colourway={t.colourway} />
              </PlateFrame>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
