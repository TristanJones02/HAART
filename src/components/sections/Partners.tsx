import { Container, Section } from '@/components/ui/Container';
import { SmartImage } from '@/components/ui/SmartImage';
import { FolioBar, sectionHeadClass } from '@/components/art';
import { getPartners } from '@/lib/content/partners';
import type { Partner } from '@/lib/content/types';
import type { SectionProps } from './SectionRenderer';

/**
 * The "with thanks" index: names in Nunito 700 separated by 1px vertical
 * hairlines, wrapping. It looks deliberate today with no logos at all, and
 * when a logo arrives it slots into a 120x48 box between the same hairlines
 * with nothing else changing.
 */
function PartnerIndex({ partners }: { partners: Partner[] }) {
  return (
    <ul className="flex flex-wrap items-center border-y border-[color:var(--hairline)] py-3">
      {partners.map((p, i) => (
        <li key={p.slug} className="flex items-center">
          {i > 0 ? <span aria-hidden="true" className="mx-5 h-7 w-px flex-none bg-[color:var(--hairline)]" /> : null}
          {p.url ? (
            <a
              href={p.url}
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex min-h-11 items-center font-display text-[1.125rem] font-bold text-[color:var(--text-strong)] underline decoration-[color:var(--hairline)] decoration-1 underline-offset-[6px] hover:decoration-[color:var(--rule)] hover:decoration-2"
            >
              {p.logo ? <SmartImage image={p.logo} aspect="h-12 w-[120px]" sizes="120px" width={240} imgClassName="object-contain" /> : p.name}
            </a>
          ) : (
            <span className="inline-flex min-h-11 items-center font-display text-[1.125rem] font-bold">
              {p.logo ? <SmartImage image={p.logo} aspect="h-12 w-[120px]" sizes="120px" width={240} imgClassName="object-contain" /> : p.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export async function PartnerGrid({ section, canvas, index, topRule }: SectionProps<'section.partnerGrid'>) {
  const partners = await getPartners();
  if (!partners.length) return null;
  const id = `s-${section._key}`;
  const heading = section.heading ?? 'Friends of HAART';
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="With thanks" numeral={index + 1} />
        <h2 id={id} className={sectionHeadClass(heading)}>
          {heading}
        </h2>
        {section.intro ? <p className="mt-4 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{section.intro}</p> : null}
        <div className="mt-10">
          <PartnerIndex partners={partners} />
        </div>
      </Container>
    </Section>
  );
}

export async function PartnerLogos({ section, canvas, topRule }: SectionProps<'section.partnerLogos'>) {
  const partners = await getPartners();
  if (!partners.length) return null;
  const id = `s-${section._key}`;
  return (
    <Section canvas={canvas} topRule={topRule} tight labelledBy={id}>
      <Container>
        <h2 id={id} className="sr-only">
          {section.heading ?? 'Supported by'}
        </h2>
        <FolioBar rubric={section.heading ?? 'Supported by'} />
        <PartnerIndex partners={partners} />
      </Container>
    </Section>
  );
}
