import Link from 'next/link';
import type { SiteSettings } from '@/lib/content/types';
import { FacebookMark, InstagramMark } from '@/components/ui/Icon';
import { DashRule } from '@/components/art/DashRule';
import { Skyline } from '@/components/art/Skyline';
import { RuleLink } from '@/components/art/RuleLink';
import { Wordmark } from './Wordmark';

/**
 * The ink canvas, opening with the printer's ornament and the Perth skyline
 * with a dog and a cat sitting at the far right looking back at the city.
 * Registration details render only where a committee member has ticked
 * "verified" in the Studio.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  const { contact, social, navigation, abn, acncRegisterId, legalName, tagline, acknowledgementOfCountry, foundedYear } = settings;
  const year = new Date().getFullYear();
  const socialBox = 'inline-flex size-11 items-center justify-center border border-stone-400 text-sand-100 hover:border-sand-100';

  return (
    <footer className="canvas-ink grain relative">
      <DashRule bleed />
      <Skyline className="h-20 md:h-30" />
      <div className="container-site pb-12 pt-16 md:pt-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Wordmark size="xl" className="text-sand-100" />
          </div>
          {tagline ? <p className="text-deck italic text-sand-100 lg:col-span-6 lg:self-end">{tagline}</p> : null}
        </div>

        <div className="mt-14 grid gap-8 border-t border-[color:var(--hairline)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-rubric uppercase text-red-200">Contact</h2>
            <ul className="mt-4 space-y-3 text-small text-sand-100">
              <li>
                <RuleLink href={`mailto:${contact.email}`} external={false} className="!text-[0.9375rem] !font-semibold">
                  {contact.email}
                </RuleLink>
              </li>
              {contact.phone ? (
                <li>
                  <RuleLink href={`tel:${contact.phone.replace(/\s+/g, '')}`} external={false} className="!text-[0.9375rem] !font-semibold">
                    {contact.phone}
                  </RuleLink>
                </li>
              ) : null}
              <li className="text-sand-300">{contact.location}</li>
            </ul>
            <ul className="mt-5 flex gap-3">
              {social.facebook ? (
                <li>
                  <a href={social.facebook} className={socialBox} rel="noopener noreferrer" target="_blank">
                    <FacebookMark size={20} />
                    <span className="sr-only">HAART on Facebook</span>
                  </a>
                </li>
              ) : null}
              {social.instagram ? (
                <li>
                  <a href={social.instagram} className={socialBox} rel="noopener noreferrer" target="_blank">
                    <InstagramMark size={20} />
                    <span className="sr-only">HAART on Instagram</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          {navigation.footer.map((group) => (
            <nav key={group.heading} aria-label={group.heading} className="border-[color:var(--hairline)] sm:border-l sm:pl-8">
              <h2 className="text-rubric uppercase text-red-200">{group.heading}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block py-1 text-small text-sand-100 hover:text-red-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {acknowledgementOfCountry ? (
          <p className="mt-12 max-w-[70ch] border border-stone-400 p-6 text-small italic text-sand-100">{acknowledgementOfCountry}</p>
        ) : null}

        <div className="mt-10 space-y-2 border-t border-stone-400 pt-6 text-[0.75rem] text-stone-400">
          <p>
            {legalName}
            {abn.verified && abn.value ? ` · ABN ${abn.value}` : ''}
            {acncRegisterId.verified ? ' · Registered charity with the ACNC' : ''}
            {foundedYear.verified && foundedYear.value ? ` · Rescuing since ${foundedYear.value}` : ''}
          </p>
          <p>
            © {year} HAART. <Link href="/privacy" className="hover:text-sand-100">Privacy</Link> · <Link href="/forms" className="hover:text-sand-100">Forms</Link> ·{' '}
            <Link href="/contact" className="hover:text-sand-100">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
