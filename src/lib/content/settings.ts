import { cache } from 'react';
import type { SiteSettings } from '@/lib/content/types';
import { getReadClient, groq } from '@/lib/sanity/client';
import { MOCK_SETTINGS } from '@/lib/mock/settings';
import { mockAllowed } from './mode';
import { LINK } from './groq';

const QUERY = groq`*[_type == "siteSettings"][0]{
  ...,
  navigation{ header[]{ label, href, children[] ${LINK} }, footer[]{ heading, links[] ${LINK} } }
}`;

/** Site settings with safe defaults so the layout never crashes on a missing field. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? MOCK_SETTINGS : { ...MOCK_SETTINGS, navigation: MOCK_SETTINGS.navigation };
  const doc = await client.fetch<Partial<SiteSettings> | null>(QUERY, {}, { next: { revalidate: 300, tags: ['settings'] } });
  if (!doc) return MOCK_SETTINGS;
  return {
    ...MOCK_SETTINGS,
    ...doc,
    contact: { ...MOCK_SETTINGS.contact, ...(doc.contact ?? {}) },
    social: { ...MOCK_SETTINGS.social, ...(doc.social ?? {}) },
    donate: { ...MOCK_SETTINGS.donate, ...(doc.donate ?? {}) },
    fees: { ...MOCK_SETTINGS.fees, ...(doc.fees ?? {}) },
    navigation: {
      header: doc.navigation?.header?.length ? doc.navigation.header : MOCK_SETTINGS.navigation.header,
      footer: doc.navigation?.footer?.length ? doc.navigation.footer : MOCK_SETTINGS.navigation.footer,
    },
  };
});
