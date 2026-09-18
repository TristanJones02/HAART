import { FolioBar, OutlineNumeral, RuleLink, sectionHeadClass } from '@/components/art';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * Four ways in, set as an index rather than four identical boxes. The editor's
 * icon field is ignored on purpose: the generic rounded-square icons were the
 * most template-like thing on the rejected page, and an outline numeral says
 * the same thing without pretending to be a picture. No boxes, no shadows —
 * the only structure is the hairline between columns.
 */

/** Hairlines fall between columns, never around them: 1-up, 2-up, then 4-up. */
function cell(i: number, total: number): string {
  const col2 = i % 2;
  const col4 = i % 4;
  return [
    i > 0 ? 'border-t pt-8' : '',
    i >= 2 ? 'sm:border-t sm:pt-8' : 'sm:border-t-0 sm:pt-0',
    col2 > 0 ? 'sm:border-l sm:pl-8' : 'sm:border-l-0 sm:pl-0',
    col2 < 1 ? 'sm:pr-8' : 'sm:pr-0',
    i >= 4 ? 'min-[900px]:border-t min-[900px]:pt-8' : 'min-[900px]:border-t-0 min-[900px]:pt-0',
    col4 > 0 ? 'min-[900px]:border-l min-[900px]:pl-8' : 'min-[900px]:border-l-0 min-[900px]:pl-0',
    col4 < 3 && i < total - 1 ? 'min-[900px]:pr-8' : 'min-[900px]:pr-0',
  ]
    .filter(Boolean)
    .join(' ');
}

export function ActionGrid({ section, canvas, topRule }: SectionProps<'section.actionGrid'>) {
  const id = `s-${section._key}`;
  const items = section.items ?? [];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Where to start" />
        {section.heading ? (
          <h2 id={id} className={`mb-10 max-w-[18ch] ${sectionHeadClass(section.heading)}`}>
            {section.heading}
          </h2>
        ) : null}
        <Stagger as="ul" className="grid grid-cols-1 gap-x-0 gap-y-8 sm:grid-cols-2 min-[900px]:grid-cols-4">
          {items.map((item, i) => (
            <StaggerItem key={item._key ?? i} as="li" className={`flex flex-col border-[color:var(--hairline)] ${cell(i, items.length)}`}>
              <div className="flex items-baseline gap-3 sm:block">
                <OutlineNumeral n={i + 1} size="index" className="sm:block sm:text-folio" />
                <h3 className="text-feature sm:mt-4">{item.heading}</h3>
              </div>
              <p className="mt-3 flex-1 text-[color:var(--text-muted)]">{item.text}</p>
              <p className="mt-5">
                <RuleLink href={item.link.href}>{item.link.label}</RuleLink>
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
