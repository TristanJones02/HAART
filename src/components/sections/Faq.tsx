import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { UiIcon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { JsonLd } from '@/lib/seo/jsonld';
import { portableToText } from '@/lib/sanity/portable';
import type { SectionProps } from './SectionRenderer';

/** Native disclosure elements: keyboard accessible, no JS needed, no layout animation. */
export function Faq({ section, surface }: SectionProps<'section.faq'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        <Reveal>
          <div className="max-w-prose divide-y divide-border rounded-card border border-border bg-paper-0">
            {section.items.map((item, i) => (
              <details key={item._key ?? i} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-h3 font-bold marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <UiIcon name="ChevronDown" size={20} className="shrink-0 text-charcoal-500 transition-transform duration-150 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5">
                  <Prose value={item.answer} className="text-charcoal-700" />
                </div>
              </details>
            ))}
          </div>
        </Reveal>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: section.items.map((it) => ({ '@type': 'Question', name: it.question, acceptedAnswer: { '@type': 'Answer', text: portableToText(it.answer) } })),
          }}
        />
      </Container>
    </Section>
  );
}
