import { FolioBar, sectionHeadClass } from '@/components/art';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * The numbers, finally allowed to be the statement. Cream figures at cover
 * scale on ink, divided by hairlines, with the funding sentence on its own
 * ruled row underneath. Colours come from the canvas, so if the adjacency
 * guard moves this band onto cream the figures and labels step down with it
 * instead of going invisible.
 */
export function StatBand({ section, canvas, topRule }: SectionProps<'section.statBand'>) {
  const id = `s-${section._key}`;
  const stats = section.stats ?? [];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="By the numbers" />
        {section.heading ? (
          <h2 id={id} className={`mb-10 ${sectionHeadClass(section.heading)}`}>
            {section.heading}
          </h2>
        ) : null}
        <Stagger as="ul" className="grid grid-cols-2 border-[color:var(--hairline)] md:grid-cols-4">
          {stats.map((st, i) => {
            // A volunteer may type a word where a figure belongs ("Hundreds").
            // Anything longer than a short numeral steps down rather than wrapping.
            const figure = st.value.trim().length <= 5;
            return (
              <StaggerItem
                key={st._key ?? i}
                as="li"
                className={`border-[color:var(--hairline)] py-6 ${i % 2 > 0 ? 'border-l pl-6' : 'pr-6'} ${i >= 2 ? 'border-t' : ''} ${
                  i % 4 > 0 ? 'md:border-l md:pl-8' : 'md:border-l-0 md:pl-0'
                } ${i % 4 < 3 ? 'md:pr-8' : 'md:pr-0'} ${i >= 4 ? 'md:border-t' : 'md:border-t-0'}`}
              >
                <p className={`font-display tabular-nums text-[color:var(--text-strong)] ${figure ? 'text-figure' : 'text-feature'}`}>{st.value}</p>
                <p className="mt-4 text-rubric uppercase text-[color:var(--rule)]">{st.label}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
        {section.note ? (
          <p className="mt-10 max-w-[62ch] border-t border-[color:var(--hairline)] pt-6 text-deck italic text-[color:var(--text-strong)]">{section.note}</p>
        ) : null}
      </Container>
    </Section>
  );
}
