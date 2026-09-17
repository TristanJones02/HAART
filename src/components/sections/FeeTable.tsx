import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import type { SectionProps } from './SectionRenderer';

export function FeeTable({ section, surface }: SectionProps<'section.feeTable'>) {
  const id = `s-${section._key}`;
  return (
    <Section surface={surface} labelledBy={section.heading ? id : undefined}>
      <Container>
        <SectionHeading id={id} heading={section.heading} />
        <Reveal className="max-w-prose">
          <table className="w-full border-collapse overflow-hidden rounded-card border border-border bg-paper-0 text-left">
            <caption className="sr-only">Adoption fees</caption>
            <thead>
              <tr className="bg-paper-100 text-tiny uppercase tracking-caps text-charcoal-550">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Animal
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Fee
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((r, i) => (
                <tr key={r._key ?? i} className="border-t border-border">
                  <th scope="row" className="px-4 py-3 font-semibold">
                    {r.label}
                  </th>
                  <td className="px-4 py-3 font-display text-h3 text-red-600">{r.amount}</td>
                  <td className="px-4 py-3 text-charcoal-700">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {section.inclusions ? <p className="mt-4 text-body text-charcoal-700">{section.inclusions}</p> : null}
        </Reveal>
      </Container>
    </Section>
  );
}
