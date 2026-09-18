import { Container, Section } from '@/components/ui/Container';
import { FolioBar, sectionHeadClass } from '@/components/art';
import { DynamicForm } from '@/components/forms';
import { getFormDefinition } from '@/lib/forms/definitions';
import type { SectionProps } from './SectionRenderer';

/**
 * The form sits at 62ch on paper-0 inside a square hairline frame. Its inputs
 * keep the 6px radius so a form still reads as a form.
 */
export function FormEmbed({ section, canvas, index, topRule }: SectionProps<'section.formEmbed'>) {
  const def = getFormDefinition(section.form);
  const id = `s-${section._key}`;
  const heading = section.heading ?? def.title;
  const intro = section.intro ?? def.intro;
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="Over to you" numeral={index + 1} />
        <h2 id={id} className={sectionHeadClass(heading)}>
          {heading}
        </h2>
        {intro ? <p className="mt-4 max-w-[62ch] text-[color:var(--text-muted)]">{intro}</p> : null}
        {/* ?animal= prefill and ?sent=1 status are read client-side so this page stays static. */}
        <div className="mt-10 max-w-[62ch] border border-[color:var(--hairline)] bg-paper-0 p-5 text-charcoal-900 sm:p-8">
          <DynamicForm definition={def} prefillFromUrl />
        </div>
      </Container>
    </Section>
  );
}
