import { Container, Section } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { Prose } from '@/components/ui/Prose';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

/** Photo beside text. Sides alternate by position on the page, not by editor choice. */
export function ImageWithText({ section, surface, index }: SectionProps<'section.imageWithText'>) {
  const id = `s-${section._key}`;
  const flip = index % 2 === 1;
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <Reveal className={`grid items-center gap-8 lg:grid-cols-2 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
          <SmartImage image={section.image} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 560px, 100vw" className="rounded-card" />
          <div>
            <h2 id={id} className="text-h2">
              {section.heading}
            </h2>
            <Prose value={section.body} className="mt-4 text-lead" />
            {section.cta ? (
              <Button href={section.cta.href} className="mt-6">
                {section.cta.label}
              </Button>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
