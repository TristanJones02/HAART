import { FolioBar, RuleLink, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * A ruled contents list: the destination as a rule-link on the left, a dotted
 * leader, and the description in the value column. No boxes, no chevrons, no
 * hover fill.
 */
export function LinkList({ section, canvas, index, topRule }: SectionProps<'section.linkList'>) {
  const id = `s-${section._key}`;
  const links = section.links ?? [];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Where to go next" numeral={index + 1} />
        {section.heading ? (
          <h2 id={id} className={sectionHeadClass(section.heading)}>
            {section.heading}
          </h2>
        ) : null}
        <ul className="mt-10 border-t border-[color:var(--hairline)]">
          {links.map((l, i) => (
            <li key={l._key ?? i} className="flex flex-col gap-2 border-b border-[color:var(--hairline)] py-5 sm:flex-row sm:items-baseline sm:gap-6">
              <RuleLink href={l.href}>{l.label}</RuleLink>
              {l.description ? (
                <>
                  <span aria-hidden="true" className="dotted-leader hidden sm:block" />
                  <span className="text-[0.9375rem] leading-[1.5] text-[color:var(--text-muted)] sm:max-w-[40ch] sm:flex-none sm:text-right">{l.description}</span>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
