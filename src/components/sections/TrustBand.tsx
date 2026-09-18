import { FolioBar, IndexList, type IndexRow } from '@/components/art';
import { Container, Section } from '@/components/ui/Container';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

/**
 * Registration details as a ruled index. Values appear only where a committee
 * member has marked them verified in the Studio; an unverified line renders as
 * "Ask us" rather than as a confident guess, which is what the index is for.
 */
export async function TrustBand({ section, canvas, index, topRule }: SectionProps<'section.trustBand'>) {
  const s = await getSiteSettings();
  const rows: IndexRow[] = [{ label: 'Registered name', value: s.legalName }];
  if (section.showAbn !== false) rows.push({ label: 'ABN', value: s.abn.verified ? s.abn.value : null });
  if (section.showAcnc !== false) rows.push({ label: 'Charity status', value: s.acncRegisterId.verified ? 'Registered with the ACNC' : null });
  if (section.showFounded !== false) rows.push({ label: 'Rescuing since', value: s.foundedYear.verified && s.foundedYear.value ? String(s.foundedYear.value) : null });
  if (s.dgrEndorsed) rows.push({ label: 'Tax', value: 'Gifts of $2 or more are tax deductible' });

  const id = `s-${section._key}`;
  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={section.heading ? id : undefined}>
      <Container>
        <FolioBar rubric="Registration details" numeral={index + 1} />
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          {section.heading ? (
            <div className="lg:col-span-4">
              <h2 id={id} className="text-feature">
                {section.heading}
              </h2>
              {section.note ? <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-[1.5] text-[color:var(--text-muted)]">{section.note}</p> : null}
            </div>
          ) : null}
          <div className="lg:col-span-8 lg:col-start-5">
            <IndexList rows={rows} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
