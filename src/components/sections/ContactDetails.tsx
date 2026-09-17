import { Container, Section, SectionHeading } from '@/components/ui/Container';
import { Icon, FacebookMark, InstagramMark } from '@/components/ui/Icon';
import { getSiteSettings } from '@/lib/content/settings';
import type { SectionProps } from './SectionRenderer';

export async function ContactDetails({ section, surface }: SectionProps<'section.contactDetails'>) {
  const s = await getSiteSettings();
  const id = `s-${section._key}`;
  const row = 'flex items-center gap-3 rounded-card border border-border bg-paper-0 p-4';
  return (
    <Section surface={surface} labelledBy={id}>
      <Container>
        <SectionHeading id={id} heading={section.heading ?? 'Contact details'} lead={section.note} />
        <ul className="grid gap-3 sm:grid-cols-2">
          <li className={row}>
            <span className="text-red-600">
              <Icon name="mail" size={24} />
            </span>
            <a href={`mailto:${s.contact.email}`} className="font-semibold hover:text-red-600">
              {s.contact.email}
            </a>
          </li>
          {s.contact.phone ? (
            <li className={row}>
              <span className="text-red-600">
                <Icon name="phone" size={24} />
              </span>
              <a href={`tel:${s.contact.phone.replace(/\s+/g, '')}`} className="font-semibold hover:text-red-600">
                {s.contact.phone}
              </a>
            </li>
          ) : null}
          {s.social.facebook ? (
            <li className={row}>
              <span className="text-red-600">
                <FacebookMark size={24} />
              </span>
              <a href={s.social.facebook} className="font-semibold hover:text-red-600" rel="noopener noreferrer" target="_blank">
                Facebook: the fastest way to reach us
              </a>
            </li>
          ) : null}
          {s.social.instagram ? (
            <li className={row}>
              <span className="text-red-600">
                <InstagramMark size={24} />
              </span>
              <a href={s.social.instagram} className="font-semibold hover:text-red-600" rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
            </li>
          ) : null}
          <li className={row}>
            <span className="text-red-600">
              <Icon name="map-pin" size={24} />
            </span>
            <span>{s.contact.postalAddress ?? `${s.contact.location}. Foster-based, so no shelter to visit.`}</span>
          </li>
        </ul>
      </Container>
    </Section>
  );
}
