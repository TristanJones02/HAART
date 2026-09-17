import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function Cta({ section, surface }: SectionProps<'section.cta'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <Reveal className="rounded-card border border-border bg-paper-0 p-6 shadow-card sm:p-10 md:flex md:items-center md:justify-between md:gap-8">
          <div className="max-w-prose">
            <h2 id={id} className="text-h2">
              {section.heading}
            </h2>
            {section.text ? <p className="mt-2 text-lead text-charcoal-700">{section.text}</p> : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
            <Button href={section.primary.href} size="lg">
              {section.primary.label}
            </Button>
            {section.secondary ? (
              <Button href={section.secondary.href} size="lg" variant="secondary">
                {section.secondary.label}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
