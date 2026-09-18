import { FolioBar, Plate, PlateFrame, RuleLink, editorialPlate, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import type { SectionProps } from './SectionRenderer';

/**
 * A plate beside a column of text, with a hairline between them and the sides
 * alternating by position on the page rather than by editor choice. The plate
 * is chosen by slot index, never from content, and it sits in the same fixed
 * frame a photograph will one day occupy.
 */
export function ImageWithText({ section, canvas, index, topRule }: SectionProps<'section.imageWithText'>) {
  const id = `s-${section._key}`;
  const flip = index % 2 === 1;
  const plate = editorialPlate(index);
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="In detail" numeral={index + 1} />
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <div className={flip ? 'lg:order-2 lg:border-l lg:border-[color:var(--hairline)] lg:pl-14' : ''}>
            <PlateFrame ratio="4/3" catalogue={`Plate ${String(index + 1).padStart(2, '0')}`} caption="Illustration, not a photograph.">
              <Plate name={plate.name} colourway={plate.colourway} />
            </PlateFrame>
          </div>
          <div className={flip ? '' : 'lg:border-l lg:border-[color:var(--hairline)] lg:pl-14'}>
            <h2 id={id} className={sectionHeadClass(section.heading)}>
              {section.heading}
            </h2>
            <Prose value={section.body} className="mt-6" />
            {section.cta ? (
              <p className="mt-8">
                <RuleLink href={section.cta.href}>{section.cta.label}</RuleLink>
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
