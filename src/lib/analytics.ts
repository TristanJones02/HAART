/**
 * Privacy-respecting analytics: Plausible in cookieless mode.
 * `track` is safe to call anywhere; it is a no-op on the server, when the
 * script has not loaded, or when analytics is not configured.
 */
export type ConversionEvent =
  | 'donation_started'
  | 'donation_completed'
  | 'adoption_enquiry'
  | 'foster_application'
  | 'volunteer_signup'
  | 'form_submitted'
  | 'outbound_click'
  | 'share';

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props; callback?: () => void }) => void;
  }
}

export function track(event: ConversionEvent | (string & {}), props?: Props): void {
  if (typeof window === 'undefined') return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // analytics must never break the page
  }
}

/** Builds a campaign link so volunteers never hand-type UTM parameters. */
export function campaignUrl(path: string, campaign: string, source = 'facebook', medium = 'social'): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://haart.org.au').replace(/\/$/, '');
  const url = new URL(path.startsWith('/') ? base + path : path);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign.trim().toLowerCase().replace(/\s+/g, '-'));
  return url.toString();
}
