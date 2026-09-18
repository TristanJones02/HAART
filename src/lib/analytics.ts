/**
 * Disabled. This build collects nothing about anybody.
 *
 * It was Plausible in cookieless mode, which does not fingerprint and would
 * arguably have been allowed — but a concept rebuild carrying someone else's
 * name has no business measuring their visitors, and the cheapest way to hold
 * that line is to have nothing to configure. The script is gone from the
 * layout and `track` no longer calls anything.
 *
 * The call sites stay, and so does the event union: they are the record of
 * which four moments matter, and restoring measurement is one function body.
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the signature is the contract; the body is deliberately empty.
export function track(event: ConversionEvent | (string & {}), props?: Props): void {
  // Intentionally empty. See the note above.
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
