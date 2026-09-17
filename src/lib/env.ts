/**
 * Environment access in one place. Every value is optional so the site runs
 * with nothing set (mock data, no analytics, no payments) and each feature
 * degrades on its own. Nothing here throws at import time.
 */
const read = (key: string): string | undefined => {
  const v = process.env[key];
  return v && v.trim() !== '' ? v.trim() : undefined;
};

export const env = {
  siteUrl: read('NEXT_PUBLIC_SITE_URL') ?? 'http://localhost:3000',
  sanity: {
    projectId: read('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: read('NEXT_PUBLIC_SANITY_DATASET') ?? 'production',
    apiVersion: read('NEXT_PUBLIC_SANITY_API_VERSION') ?? '2026-09-01',
    readToken: read('SANITY_API_READ_TOKEN'),
    writeToken: read('SANITY_API_WRITE_TOKEN'),
    revalidateSecret: read('SANITY_REVALIDATE_SECRET'),
  },
  petrescue: {
    token: read('PETRESCUE_API_TOKEN'),
    groupId: read('PETRESCUE_GROUP_ID') ?? '10046',
    baseUrl: read('PETRESCUE_API_BASE') ?? 'https://www.petrescue.com.au/api',
  },
  events: {
    icalUrl: read('FACEBOOK_EVENTS_ICAL_URL'),
    cronSecret: read('CRON_SECRET'),
  },
  maps: {
    provider: read('MAP_STATIC_PROVIDER') ?? 'geoapify',
    apiKey: read('MAP_STATIC_API_KEY'),
  },
  analytics: {
    plausibleDomain: read('NEXT_PUBLIC_PLAUSIBLE_DOMAIN'),
    plausibleScriptHost: read('NEXT_PUBLIC_PLAUSIBLE_HOST') ?? 'https://plausible.io',
  },
  forms: {
    resendApiKey: read('RESEND_API_KEY'),
    toEmail: read('FORMS_TO_EMAIL') ?? 'info@haart.org.au',
    fromEmail: read('FORMS_FROM_EMAIL') ?? 'website@haart.org.au',
  },
  /** True when Sanity is configured; false means mock content everywhere. */
  get hasSanity() {
    return Boolean(this.sanity.projectId);
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
} as const;
