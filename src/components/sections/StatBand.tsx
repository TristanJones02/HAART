import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function StatBand({ section, surface }: SectionProps<'section.statBand'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} align="center" />
        <Stagger as="ul" className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {section.stats.map((st, i) => (
            <StaggerItem key={st._key ?? i} as="li">
              <p className="font-display text-hero font-black leading-none text-red-600">{st.value}</p>
              <p className="mt-2 text-body font-semibold text-charcoal-700">{st.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
        {section.note ? <p className="mx-auto mt-8 max-w-prose text-center text-small text-charcoal-550">{section.note}</p> : null}
      </Container>
    </Section>
  );
}
