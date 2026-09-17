import Script from 'next/script';
import { env } from '@/lib/env';

/**
 * Plausible in cookieless mode: no identifiers, no consent banner needed.
 * Renders nothing until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. Outbound link
 * tracking is on so clicks to Stripe, Square and Facebook are counted.
 */
export function Analytics() {
  const domain = env.analytics.plausibleDomain;
  if (!domain) return null;
  return (
    <>
      <Script defer data-domain={domain} src={`${env.analytics.plausibleScriptHost}/js/script.outbound-links.tagged-events.js`} strategy="afterInteractive" />
      <Script id="plausible-init" strategy="afterInteractive">{`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}</Script>
    </>
  );
}
