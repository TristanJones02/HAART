import { FolioBar, OutlineNumeral, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * The same ruled index as the step list, and for the same reason: the editor's
 * icon field is ignored and an outline numeral takes its place. The icon
 * pebbles were decoration standing in for a picture, which is exactly what made
 * the rejected page read as a template.
 */
export function IconList({ section, canvas, topRule }: SectionProps<'section.iconList'>) {
  const id = `s-${section._key}`;
  const items = section.items ?? [];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="In practice" />
        {section.heading ? (
          <h2 id={id} className={sectionHeadClass(section.heading)}>
            {section.heading}
          </h2>
        ) : null}
        {section.intro ? <p className="mt-5 max-w-[46ch] text-deck italic text-[color:var(--text-muted)]">{section.intro}</p> : null}
        <ul className="mt-10 border-t border-[color:var(--hairline)]">
          {items.map((item, i) => (
            <li key={item._key ?? i} className="grid gap-x-8 gap-y-3 border-b border-[color:var(--hairline)] py-8 sm:grid-cols-[96px_minmax(0,1fr)]">
              <OutlineNumeral n={i + 1} size="index" className="sm:text-folio" />
              <div>
                <h3 className="text-feature">{item.heading}</h3>
                <p className="mt-3 max-w-prose text-[color:var(--text-muted)]">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
