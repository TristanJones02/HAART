import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function StepList({ section, surface }: SectionProps<'section.stepList'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} lead={section.intro} />
        <Stagger as="ol" className="grid gap-6 md:grid-cols-2">
          {section.steps.map((step, i) => (
            <StaggerItem key={step._key ?? i} as="li" className="flex gap-4">
              <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-red-600 font-display text-lead font-black text-paper-0">
                {i + 1}
              </span>
              <div>
                <h3 className="text-h3">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.heading}
                </h3>
                <p className="mt-1 text-body text-charcoal-700">{step.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
