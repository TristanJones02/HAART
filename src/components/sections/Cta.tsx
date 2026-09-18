import { FolioBar, RuleLink, TearOff, sectionHeadClass } from '@/components/art';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * The ask. Two columns on ink — the sentence on the left, the button and a
 * rule-link on the right — with the tear-off notice hanging off the bottom
 * edge. The block reserves 56px of bottom margin so the tabs overhang nothing
 * that matters and nothing shifts.
 */
export function Cta({ section, canvas, topRule }: SectionProps<'section.cta'>) {
  const id = `s-${section._key}`;
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id} className="relative mb-14">
      <Container>
        <FolioBar rubric="Next step" />
        <Reveal className="grid items-end gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 id={id} className={sectionHeadClass(section.heading)}>
              {section.heading}
            </h2>
            {section.text ? <p className="mt-5 max-w-[46ch] text-deck italic text-[color:var(--text-muted)]">{section.text}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 lg:col-span-4 lg:col-start-9 lg:justify-end">
            <Button href={section.primary.href} size="lg" className="w-full sm:w-auto">
              {section.primary.label}
              <span aria-hidden="true"> →</span>
            </Button>
            {section.secondary ? <RuleLink href={section.secondary.href}>{section.secondary.label}</RuleLink> : null}
          </div>
        </Reveal>
      </Container>
      {/* The notice's torn tab erases itself against whatever is behind the strip.
          The strip hangs in the reserved margin below the band, so that is the
          page ground, not this section's canvas. */}
      <span className="[--canvas:var(--color-paper-0)]">
        <TearOff tabFill={canvas === 'ink' ? 'sand' : 'paper'} />
      </span>
    </Section>
  );
}
