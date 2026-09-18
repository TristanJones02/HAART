import { FolioBar, sectionHeadClass } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { portableToText } from '@/lib/sanity/portable';
import { JsonLd } from '@/lib/seo/jsonld';
import type { SectionProps } from './SectionRenderer';

/**
 * Native disclosure rows on hairlines: keyboard accessible, no JavaScript, no
 * layout animation. The boxes, chevrons and shadows are gone; a red plus that
 * becomes a minus is the whole affordance.
 *
 * One of only two block types allowed a sticky heading.
 */
export function Faq({ section, canvas, index, topRule }: SectionProps<'section.faq'>) {
  const id = `s-${section._key}`;
  const items = section.items ?? [];
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Questions and answers" numeral={index + 1} />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          {section.heading ? (
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <h2 id={id} className={sectionHeadClass(section.heading)}>
                {section.heading}
              </h2>
            </div>
          ) : null}
          <div className="border-t border-[color:var(--hairline)] lg:col-span-8 lg:col-start-5">
            {items.map((item, i) => (
              <details key={item._key ?? i} className="group border-b border-[color:var(--hairline)]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 marker:content-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-feature">{item.question}</h3>
                  <span aria-hidden="true" className="mt-1 flex-none font-display text-[1.75rem] leading-none font-extrabold text-[color:var(--rule)]">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </span>
                </summary>
                <Prose value={item.answer} className="pb-8" />
              </details>
            ))}
          </div>
        </div>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((it) => ({ '@type': 'Question', name: it.question, acceptedAnswer: { '@type': 'Answer', text: portableToText(it.answer) } })),
          }}
        />
      </Container>
    </Section>
  );
}
