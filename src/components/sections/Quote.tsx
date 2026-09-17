import { Container, Section } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { Reveal } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function Quote({ section, surface }: SectionProps<'section.quote'>) {
  return (
    <Section surface={surface}>
      <Container>
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          {section.image ? <SmartImage image={section.image} aspect="aspect-square size-24 shrink-0" sizes="96px" width={192} className="rounded-pill" /> : null}
          <figure>
            <blockquote className="font-display text-h3 font-bold text-charcoal-900">“{section.quote}”</blockquote>
            {section.attribution ? <figcaption className="mt-3 text-body text-charcoal-550">{section.attribution}</figcaption> : null}
          </figure>
        </Reveal>
      </Container>
    </Section>
  );
}
