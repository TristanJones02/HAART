import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { UiIcon } from '@/components/ui/Icon';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function PriceCards({ section, surface }: SectionProps<'section.priceCards'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} lead={section.intro} />
        <Stagger as="ul" className="grid gap-4 md:grid-cols-3">
          {section.cards.map((c, i) => (
            <StaggerItem key={c._key ?? i} as="li" className="h-full">
              <article className="flex h-full flex-col rounded-card border border-border bg-paper-0 p-6 shadow-card">
                <h3 className="text-h3">{c.title}</h3>
                <p className="mt-2">
                  <span className="font-display text-h1 text-red-600">{c.price}</span>
                  {c.period ? <span className="ml-1 text-small text-charcoal-550">per {c.period}</span> : null}
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {c.features?.map((f) => (
                    <li key={f} className="flex gap-2 text-body text-charcoal-700">
                      <UiIcon name="Check" size={20} className="mt-0.5 shrink-0 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                {c.note ? <p className="mt-3 text-small text-charcoal-550">{c.note}</p> : null}
                {c.cta ? (
                  <Button href={c.cta.href} variant={i === 0 ? 'primary' : 'secondary'} className="mt-6 w-full">
                    {c.cta.label}
                  </Button>
                ) : null}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
