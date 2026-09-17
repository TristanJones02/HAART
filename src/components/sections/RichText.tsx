import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function RichText({ section, surface }: SectionProps<'section.richText'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <Reveal>
          <SectionHeading id={id} heading={section.heading} />
          <Prose value={section.body} className="text-lead [&>p]:mb-5" />
        </Reveal>
      </Container>
    </Section>
  );
}
