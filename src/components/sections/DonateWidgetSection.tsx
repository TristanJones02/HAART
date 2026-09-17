import { Container, Section } from '@/components/ui/Container';
import { DonateWidget } from '@/components/donate/DonateWidget';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

export async function DonateWidgetSection({ section }: SectionProps<'section.donateWidget'>) {
  const settings = await getSiteSettings();
  const id = `s-${section._key}`;
  return (
    <Section surface="paper-50" labelledBy={id} className="border-b border-border">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="max-w-prose">
          <p className="mb-2 text-tiny uppercase tracking-caps text-red-600">Donate</p>
          <h1 id={id} className="text-h1">
            {section.heading ?? 'Give to the animals'}
          </h1>
          {section.text ? <p className="mt-4 text-lead text-charcoal-700">{section.text}</p> : null}
          {settings.dgrEndorsed ? <p className="mt-4 text-body text-charcoal-700">HAART is a Deductible Gift Recipient. Gifts of $2 or more are tax deductible and you will receive a receipt by email.</p> : null}
          {section.impactLines?.length ? (
            <dl className="mt-6 space-y-2">
              {section.impactLines.map((l) => (
                <div key={l._key ?? l.amount} className="flex gap-3">
                  <dt className="w-16 shrink-0 font-display text-lead font-bold text-red-600">${l.amount}</dt>
                  <dd className="text-body text-charcoal-700">{l.text}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <DonateWidget amounts={section.amounts} links={settings.donate} />
      </Container>
    </Section>
  );
}
