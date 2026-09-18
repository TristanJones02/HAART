import { Container, Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { FolioBar, Quad, RuleLink, sectionHeadClass } from '@/components/art';
import type { SectionProps } from './SectionRenderer';

/**
 * A price is free text an editor types: "$2,500" or "Discounted". It steps
 * down by length the way a masthead does, so a word never blows out a column.
 */
function priceClass(price: string): string {
  const n = price.trim().length;
  if (n <= 7) return 'text-figure';
  if (n <= 12) return 'text-[2.5rem] font-black leading-[0.9] tracking-[-0.03em]';
  return 'text-feature';
}

export function PriceCards({ section, canvas, index, topRule }: SectionProps<'section.priceCards'>) {
  const id = `s-${section._key}`;
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Price list" numeral={index + 1} />
        {section.heading ? (
          <h2 id={id} className={sectionHeadClass(section.heading)}>
            {section.heading}
          </h2>
        ) : null}
        {section.intro ? <p className="mt-4 max-w-[62ch] text-[color:var(--text-muted)]">{section.intro}</p> : null}
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {section.cards.map((c, i) => (
            <li key={c._key ?? i} className="h-full">
              <article className="flex h-full flex-col border border-[color:var(--hairline)] p-6">
                <h3 className="text-rubric uppercase text-[color:var(--text-caption)]">{c.title}</h3>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                  <span className={`font-display tabular-nums text-[color:var(--rule)] ${priceClass(c.price)}`}>{c.price}</span>
                  {c.period ? <span className="text-small text-[color:var(--text-muted)]">per {c.period}</span> : null}
                </p>
                {c.features?.length ? (
                  <ul className="mt-6 flex-1 border-t border-[color:var(--hairline)]">
                    {c.features.map((f) => (
                      <li key={f} className="flex gap-3 border-b border-[color:var(--hairline)] py-3 text-body last:border-b-0">
                        <Quad className="mt-2" />
                        <span className="min-w-0">{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {c.note ? <p className="mt-4 text-note italic text-[color:var(--text-caption)]">{c.note}</p> : null}
                {c.cta ? (
                  <p className="mt-6">
                    {i === 0 ? (
                      <Button href={c.cta.href} variant="primary" className="w-full">
                        {c.cta.label}
                      </Button>
                    ) : (
                      <RuleLink href={c.cta.href}>
                        {c.cta.label}
                        <span className="sr-only">: {c.title}</span>
                      </RuleLink>
                    )}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
