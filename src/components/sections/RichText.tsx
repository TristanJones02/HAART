import { FolioBar, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import type { SectionProps } from './SectionRenderer';

/**
 * Reading copy as a spread, not a centred stack: the heading holds columns
 * 1-4 and sticks while the prose runs past it in 5-12 at a 62ch measure, at
 * full text strength. The first paragraph takes the lede treatment — a 4px
 * red rule in the margin, which is what replaced the drop cap.
 *
 * This is one of only two block types allowed a sticky heading; by the third
 * occurrence it reads as a trick rather than a spread.
 */
export function RichText({ section, canvas, index, topRule }: SectionProps<'section.richText'>) {
  const id = `s-${section._key}`;
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="In full" numeral={index + 1} />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          {section.heading ? (
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <h2 id={id} className={sectionHeadClass(section.heading)}>
                {section.heading}
              </h2>
            </div>
          ) : null}
          <div className="lg:col-span-8 lg:col-start-5">
            <Prose value={section.body} lede />
          </div>
        </div>
      </Container>
    </Section>
  );
}
