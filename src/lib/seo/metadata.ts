import type { Metadata } from 'next';
import type { Seo } from '@/lib/content/types';
import { env } from '@/lib/env';
import { resolveImageUrl } from '@/lib/sanity/image';

const SITE_NAME = 'HAART (unofficial concept)';
const DEFAULT_DESCRIPTION = 'An unofficial concept rebuild of the website of HAART, a no-kill animal rescue in Perth, Western Australia. Not affiliated with or endorsed by HAART.';

export const siteUrl = env.siteUrl.replace(/\/$/, '');

type Args = { title?: string; description?: string; path: string; seo?: Seo; imageUrl?: string | null; type?: 'website' | 'article'; publishedTime?: string; modifiedTime?: string; noIndex?: boolean };

/** Builds Next metadata with Open Graph and Twitter cards from a page's SEO block. */
export function buildMetadata({ title, description, path, seo, imageUrl, type = 'website', publishedTime, modifiedTime }: Args): Metadata {
  const t = seo?.title ?? title;
  const d = seo?.description ?? description ?? DEFAULT_DESCRIPTION;
  const url = `${siteUrl}${path}`;
  const img = resolveImageUrl(seo?.image, 1200, 1200 / 630) ?? imageUrl ?? `${siteUrl}/opengraph-image`;
  const absoluteImg = img.startsWith('http') ? img : `${siteUrl}${img}`;
  return {
    title: t ? `${t} | ${SITE_NAME}` : SITE_NAME,
    description: d,
    alternates: { canonical: url },
    // Always. `noIndex` and `seo.noIndex` are kept in the signature so editor
    // intent survives, but neither can turn indexing back on here.
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: t ?? SITE_NAME,
      description: d,
      url,
      locale: 'en_AU',
      images: [{ url: absoluteImg, width: 1200, height: 630, alt: seo?.image?.alt ?? t ?? SITE_NAME }],
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: t ?? SITE_NAME, description: d, images: [absoluteImg] },
  };
}
