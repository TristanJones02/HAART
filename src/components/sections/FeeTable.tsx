import { FolioBar, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import type { SectionProps } from './SectionRenderer';

/**
 * A ledger, not a bordered table: label left, a dotted leader, the amount right
 * at figure scale in red. An amount a volunteer has written as words rather
 * than a number ("Set per dog") steps down so it cannot blow the row apart.
 */
export function FeeTable({ section, canvas, index, topRule }: SectionProps<'section.feeTable'>) {
  const id = `s-${section._key}`;
  const rows = section.rows ?? [];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="What it costs" numeral={index + 1} />
        {section.heading ? (
          <h2 id={id} className={sectionHeadClass(section.heading)}>
            {section.heading}
          </h2>
        ) : null}
        <dl className="mt-10 m-0 max-w-[62ch] border-t border-[color:var(--hairline)]">
          {rows.map((r, i) => {
            const isFigure = /^[$\d]/.test(r.amount.trim());
            return (
              <div key={r._key ?? i} className="border-b border-[color:var(--hairline)] py-6">
                <div className="flex items-baseline gap-3">
                  <dt className="font-display text-feature">{r.label}</dt>
                  <span aria-hidden="true" className="dotted-leader" />
                  <dd className={`m-0 flex-none text-right font-display tabular-nums text-[color:var(--rule)] ${isFigure ? 'text-figure' : 'text-feature'}`}>
                    {r.amount}
                  </dd>
                </div>
                {r.note ? <p className="mt-2 text-[0.8125rem] leading-[1.4] font-semibold italic text-[color:var(--text-caption)]">{r.note}</p> : null}
              </div>
            );
          })}
        </dl>
        {section.inclusions ? <p className="mt-8 max-w-prose text-[color:var(--text-muted)]">{section.inclusions}</p> : null}
      </Container>
    </Section>
  );
}
