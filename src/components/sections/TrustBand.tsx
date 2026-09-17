import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/** Registration details, shown only where the value is marked verified in the Studio. */
export async function TrustBand({ section, surface }: SectionProps<'section.trustBand'>) {
  const s = await getSiteSettings();
  const items: { label: string; value: string }[] = [];
  if (section.showAbn !== false && s.abn.verified && s.abn.value) items.push({ label: 'ABN', value: s.abn.value });
  if (section.showAcnc !== false && s.acncRegisterId.verified) items.push({ label: 'Charity status', value: 'Registered with the ACNC' });
  if (section.showFounded !== false && s.foundedYear.verified && s.foundedYear.value) items.push({ label: 'Rescuing since', value: String(s.foundedYear.value) });
  if (s.dgrEndorsed) items.push({ label: 'Tax', value: 'Gifts of $2 or more are tax deductible' });
  items.push({ label: 'Legal name', value: s.legalName });
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="flex gap-3 rounded-card border border-border bg-paper-0 p-4">
              <span className="text-red-600">
                <Icon name="badge-check" size={24} />
              </span>
              <div>
                <dt className="text-tiny uppercase tracking-caps text-charcoal-550">{it.label}</dt>
                <dd className="mt-1 text-body font-semibold">{it.value}</dd>
              </div>
            </div>
          ))}
        </dl>
        {section.note && items.length < 3 ? <p className="mt-4 text-small text-charcoal-550">{section.note}</p> : null}
      </Container>
    </Section>
  );
}
