import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button } from '@/components/ui/Button';
import { UiIcon } from '@/components/ui/Icon';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { getProducts } from '@/lib/content/partners';
import { formatCurrency } from '@/lib/format';
import type { SectionProps } from './SectionRenderer';

/** Products with Square or external links. A missing link renders as "coming soon", never a dead button. */
export async function ProductGrid({ section, surface }: SectionProps<'section.productGrid'>) {
  const products = await getProducts(section.kind ?? 'all', section.limit ?? 12);
  if (!products.length) return null;
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const href = p.squareLink ?? p.externalUrl;
            const external = !!p.externalUrl && !p.squareLink;
            return (
              <StaggerItem key={p.slug} as="li" className="h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-paper-0 shadow-card">
                  <SmartImage image={p.image} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw" width={800} fallbackLabel={p.kind === 'merch' ? 'Product photo to come' : p.name} />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-h3">{p.name}</h3>
                    <p className="mt-1 text-body">
                      {typeof p.price === 'number' ? <span className="font-display text-lead font-bold text-red-600">{formatCurrency(p.price)}</span> : null}
                      {p.priceNote ? <span className="ml-2 text-small text-charcoal-550">{p.priceNote}</span> : null}
                    </p>
                    {p.description ? <p className="mt-2 flex-1 text-body text-charcoal-700">{p.description}</p> : null}
                    <div className="mt-4">
                      {href ? (
                        <Button href={href} variant={p.kind === 'merch' ? 'primary' : 'secondary'} className="w-full" icon={external ? <UiIcon name="ExternalLink" size={18} /> : undefined}>
                          {p.kind === 'merch' ? 'Buy' : p.kind === 'sponsorship' ? 'Enquire' : 'Visit'}
                        </Button>
                      ) : (
                        <Button variant="secondary" className="w-full" disabled aria-disabled="true" title="This link is being set up">
                          {p.kind === 'sponsorship' ? 'Enquire on the partners page' : 'Coming soon'}
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}
