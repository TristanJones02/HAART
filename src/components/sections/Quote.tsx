import { FolioBar } from '@/components/art';
import { Reveal } from '@/components/motion/Reveal';
import { RuleDraw } from '@/components/motion/RuleDraw';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * A pull quote, not a card: a 96x3px red rule, the sentence at display size,
 * and the attribution set as a rubric. No quotation glyph, no portrait, no
 * border — the rule and the measure do the work. The editor's image field is
 * not rendered; a face beside a quote is the card creeping back in.
 */
export function Quote({ section, canvas, topRule }: SectionProps<'section.quote'>) {
  return (
    <Section canvas={canvas} topRule={topRule}>
      <Container>
        <FolioBar rubric="In their words" />
        <Reveal>
          <figure className="m-0 max-w-[24ch] sm:max-w-[30ch]">
            <RuleDraw className="mb-8 block h-[3px] w-24 bg-[color:var(--rule)]" />
            <blockquote className="m-0 font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.15] font-extrabold tracking-[-0.02em] text-[color:var(--text-strong)]">
              {section.quote}
            </blockquote>
            {section.attribution ? (
              <figcaption className="mt-6 text-rubric uppercase text-[color:var(--text-caption)]">{section.attribution}</figcaption>
            ) : null}
          </figure>
        </Reveal>
      </Container>
    </Section>
  );
}
