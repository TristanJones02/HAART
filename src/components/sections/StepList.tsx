import { FolioBar, OutlineNumeral, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * A numbered index on hairlines: an outline numeral in a fixed left column,
 * the step at feature size, the detail beneath. The numbered pills in cards
 * are gone, and so is the box around each step.
 */
export function StepList({ section, canvas, topRule }: SectionProps<'section.stepList'>) {
  const id = `s-${section._key}`;
  const steps = section.steps ?? [];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Step by step" />
        {section.heading ? (
          <h2 id={id} className={sectionHeadClass(section.heading)}>
            {section.heading}
          </h2>
        ) : null}
        {section.intro ? <p className="mt-5 max-w-[46ch] text-deck italic text-[color:var(--text-muted)]">{section.intro}</p> : null}
        <ol className="mt-10 border-t border-[color:var(--hairline)]">
          {steps.map((step, i) => (
            <li key={step._key ?? i} className="grid gap-x-8 gap-y-3 border-b border-[color:var(--hairline)] py-8 sm:grid-cols-[96px_minmax(0,1fr)]">
              <OutlineNumeral n={i + 1} size="index" className="sm:text-folio" />
              <div>
                <h3 className="text-feature">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.heading}
                </h3>
                <p className="mt-3 max-w-prose text-[color:var(--text-muted)]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
