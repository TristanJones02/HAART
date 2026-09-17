import Link from 'next/link';
import type { SiteSettings } from '@/lib/content/types';
import { FacebookMark, InstagramMark } from '@/components/ui/Icon';
import { Wordmark } from './Wordmark';

/** Footer. Registration details render only when marked verified in the Studio. */
export function Footer({ settings }: { settings: SiteSettings }) {
  const { contact, social, navigation, abn, acncRegisterId, legalName, tagline, acknowledgementOfCountry, foundedYear } = settings;
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-paper-100 text-charcoal-700">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Wordmark />
          {tagline ? <p className="mt-3 text-body">{tagline}</p> : null}
          <ul className="mt-4 space-y-1 text-body">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-red-600">
                {contact.email}
              </a>
            </li>
            {contact.phone ? (
              <li>
                <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="hover:text-red-600">
                  {contact.phone}
                </a>
              </li>
            ) : null}
            <li>{contact.location}</li>
          </ul>
          <ul className="mt-4 flex gap-3">
            {social.facebook ? (
              <li>
                <a href={social.facebook} className="inline-flex size-11 items-center justify-center rounded-control bg-paper-0 text-charcoal-900 hover:text-red-600" rel="noopener noreferrer" target="_blank">
                  <FacebookMark size={22} />
                  <span className="sr-only">HAART on Facebook</span>
                </a>
              </li>
            ) : null}
            {social.instagram ? (
              <li>
                <a href={social.instagram} className="inline-flex size-11 items-center justify-center rounded-control bg-paper-0 text-charcoal-900 hover:text-red-600" rel="noopener noreferrer" target="_blank">
                  <InstagramMark size={22} />
                  <span className="sr-only">HAART on Instagram</span>
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        {navigation.footer.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="font-display text-small font-bold uppercase tracking-caps text-charcoal-900">{group.heading}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-body hover:text-red-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-site space-y-2 py-6 text-small text-charcoal-550">
          {acknowledgementOfCountry ? <p>{acknowledgementOfCountry}</p> : null}
          <p>
            {legalName}
            {abn.verified && abn.value ? ` · ABN ${abn.value}` : ''}
            {acncRegisterId.verified ? ' · Registered charity with the ACNC' : ''}
            {foundedYear.verified && foundedYear.value ? ` · Rescuing since ${foundedYear.value}` : ''}
          </p>
          <p>
            © {year} HAART. <Link href="/privacy" className="hover:text-red-600">Privacy</Link> · <Link href="/forms" className="hover:text-red-600">Forms</Link> · <Link href="/contact" className="hover:text-red-600">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
