import type { Metadata } from 'next';
import type { Seo } from '@/lib/content/types';
import { env } from '@/lib/env';
import { resolveImageUrl } from '@/lib/sanity/image';

const SITE_NAME = 'HAART';
const DEFAULT_DESCRIPTION = 'HAART is a not-for-profit, no-kill animal rescue in Perth, Western Australia. Foster-based, volunteer-run, no government funding.';

export const siteUrl = env.siteUrl.replace(/\/$/, '');

type Args = { title?: string; description?: string; path: string; seo?: Seo; imageUrl?: string | null; type?: 'website' | 'article'; publishedTime?: string; modifiedTime?: string; noIndex?: boolean };

/** Builds Next metadata with Open Graph and Twitter cards from a page's SEO block. */
export function buildMetadata({ title, description, path, seo, imageUrl, type = 'website', publishedTime, modifiedTime, noIndex }: Args): Metadata {
  const t = seo?.title ?? title;
  const d = seo?.description ?? description ?? DEFAULT_DESCRIPTION;
  const url = `${siteUrl}${path}`;
  const img = resolveImageUrl(seo?.image, 1200, 1200 / 630) ?? imageUrl ?? `${siteUrl}/opengraph-image`;
  const absoluteImg = img.startsWith('http') ? img : `${siteUrl}${img}`;
  return {
    title: t ? `${t} | ${SITE_NAME}` : SITE_NAME,
    description: d,
    alternates: { canonical: url },
    robots: noIndex || seo?.noIndex ? { index: false, follow: false } : undefined,
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
