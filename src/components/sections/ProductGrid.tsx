import { Container, Section } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { Button } from '@/components/ui/Button';
import { FolioBar, Plate, PlateFrame, RuleLink, editorialPlate, sectionHeadClass } from '@/components/art';
import { getProducts } from '@/lib/content/partners';
import { resolveImageUrl } from '@/lib/sanity/image';
import { formatCurrency } from '@/lib/format';
import type { SectionProps } from './SectionRenderer';

/**
 * Square plates at 1/1 in the sand colourway stand in for photography that
 * does not exist yet, and the caption says so. A product with no checkout
 * link reads "Coming soon" as text, never as a dead button.
 */
export async function ProductGrid({ section, canvas, index, topRule }: SectionProps<'section.productGrid'>) {
  const products = await getProducts(section.kind ?? 'all', section.limit ?? 12);
  if (!products.length) return null;
  const id = `s-${section._key}`;
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="The shop" numeral={index + 1} />
        {section.heading ? (
          <h2 id={id} className={`mb-10 ${sectionHeadClass(section.heading)}`}>
            {section.heading}
          </h2>
        ) : null}
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const href = p.squareLink ?? p.externalUrl;
            const external = !!p.externalUrl && !p.squareLink;
            const photo = resolveImageUrl(p.image, 800) ? p.image : undefined;
            const label = p.kind === 'merch' ? 'Buy' : p.kind === 'sponsorship' ? 'Enquire' : 'Visit';
            return (
              <li key={p.slug} className="h-full">
                <article className="flex h-full flex-col">
                  <PlateFrame ratio="1/1" caption={photo ? undefined : `Illustration — a photograph of ${p.name} is coming.`}>
                    {photo ? (
                      <SmartImage image={photo} aspect="absolute inset-0" className="!absolute" sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw" width={800} />
                    ) : (
                      <Plate name={editorialPlate(i).name} colourway="sand" />
                    )}
                  </PlateFrame>

                  <h3 className="mt-4 text-cardname font-display">{p.name}</h3>

                  <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                    {typeof p.price === 'number' ? <span className="font-display text-[1.5rem] font-black tabular-nums leading-none text-[color:var(--rule)]">{formatCurrency(p.price)}</span> : null}
                    {p.priceNote ? <span className="text-small text-[color:var(--text-muted)]">{p.priceNote}</span> : null}
                  </p>

                  {p.description ? <p className="mt-3 flex-1 text-body text-[color:var(--text-muted)]">{p.description}</p> : null}

                  <p className="mt-5">
                    {href ? (
                      p.kind === 'merch' ? (
                        <Button href={href} variant="primary">
                          {label}
                          <span className="sr-only">: {p.name}</span>
                        </Button>
                      ) : (
                        <RuleLink href={href} external={external}>
                          {label}
                          <span className="sr-only">: {p.name}</span>
                        </RuleLink>
                      )
                    ) : (
                      <span className="text-small italic text-[color:var(--text-caption)]">{p.kind === 'sponsorship' ? 'Enquire on the partners page' : 'Coming soon'}</span>
                    )}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
