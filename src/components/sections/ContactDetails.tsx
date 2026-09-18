import { Container, Section } from '@/components/ui/Container';
import { FolioBar, IndexList, sectionHeadClass } from '@/components/art';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

export async function ContactDetails({ section, canvas, index, topRule }: SectionProps<'section.contactDetails'>) {
  const s = await getSiteSettings();
  const id = `s-${section._key}`;
  const heading = section.heading ?? 'Contact details';
  const out = 'underline decoration-[color:var(--hairline)] underline-offset-4 hover:decoration-[color:var(--rule)]';

  return (
    <Section canvas={canvas} topRule={topRule} labelledBy={id}>
      <Container>
        <FolioBar rubric="Get in touch" numeral={index + 1} />
        <h2 id={id} className={sectionHeadClass(heading)}>
          {heading}
        </h2>
        {section.note ? <p className="mt-4 max-w-[34ch] text-deck italic text-[color:var(--text-muted)]">{section.note}</p> : null}
        <div className="mt-10 grid gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-6 lg:col-span-5">
            <a href={`mailto:${s.contact.email}`} className="rule-link max-w-full text-feature [overflow-wrap:anywhere]">
              {s.contact.email}
            </a>
            {s.contact.phone ? (
              <a href={`tel:${s.contact.phone.replace(/\s+/g, '')}`} className="rule-link max-w-full text-feature [overflow-wrap:anywhere]">
                {s.contact.phone}
              </a>
            ) : null}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <IndexList
              rows={[
                { label: 'Where we are', value: s.contact.location },
                { label: 'Postal address', value: s.contact.postalAddress },
                { label: 'Visiting', value: 'Foster-based, so there is no shelter to visit.' },
                {
                  label: 'Facebook',
                  value: s.social.facebook ? (
                    <a href={s.social.facebook} className={out} rel="noopener noreferrer" target="_blank">
                      The fastest way to reach us
                    </a>
                  ) : null,
                },
                {
                  label: 'Instagram',
                  value: s.social.instagram ? (
                    <a href={s.social.instagram} className={out} rel="noopener noreferrer" target="_blank">
                      Follow the animals
                    </a>
                  ) : null,
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
