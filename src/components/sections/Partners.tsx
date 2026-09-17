import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { UiIcon } from '@/components/ui/Icon';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { getPartners } from '@/lib/content/partners';
import type { SectionProps } from './SectionRenderer';

export async function PartnerGrid({ section, surface }: SectionProps<'section.partnerGrid'>) {
  const partners = await getPartners();
  if (!partners.length) return null;
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} lead={section.intro} />
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <StaggerItem key={p.slug} as="li" className="h-full">
              <article className="flex h-full flex-col rounded-card border border-border bg-paper-0 p-5 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-control border border-border bg-paper-50">
                    {p.logo ? <SmartImage image={p.logo} aspect="aspect-square" sizes="64px" width={128} imgClassName="object-contain p-1" /> : <div className="flex size-full items-center justify-center font-display text-h2 text-charcoal-300">{p.name.charAt(0)}</div>}
                  </div>
                  <div>
                    <h3 className="text-h3">{p.name}</h3>
                    {p.category ? <p className="text-small text-charcoal-550">{p.category}</p> : null}
                  </div>
                </div>
                {p.description ? <p className="mt-4 flex-1 text-body text-charcoal-700">{p.description}</p> : null}
                {p.url ? (
                  <a href={p.url} className="mt-4 inline-flex items-center gap-1 text-small font-semibold text-red-600 hover:underline" rel="noopener noreferrer" target="_blank">
                    Visit website
                    <UiIcon name="ExternalLink" size={16} />
                  </a>
                ) : null}
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export async function PartnerLogos({ section, surface }: SectionProps<'section.partnerLogos'>) {
  const partners = await getPartners();
  if (!partners.length) return null;
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} tight labelledBy={id}>
      <Container>
        <h2 id={id} className="mb-6 text-center text-tiny uppercase tracking-caps text-charcoal-550">
          {section.heading ?? 'Supported by'}
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partners.map((p) => (
            <li key={p.slug} className="text-charcoal-700">
              {p.url ? (
                <a href={p.url} rel="noopener noreferrer" target="_blank" className="inline-flex h-12 items-center font-display text-lead font-bold hover:text-red-600">
                  {p.logo ? <SmartImage image={p.logo} aspect="h-10 w-28" sizes="112px" width={224} imgClassName="object-contain" /> : p.name}
                </a>
              ) : (
                <span className="inline-flex h-12 items-center font-display text-lead font-bold">{p.name}</span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
