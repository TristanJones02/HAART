import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { siteUrl } from '@/lib/seo/metadata';

export default function robots(): MetadataRoute.Robots {
  // A preview deployment must never be indexed: it carries HAART's name over
  // unconfirmed registration details, and a review link outranking the real
  // site is a worse outcome than no preview at all. Vercel also sets
  // X-Robots-Tag: noindex on previews; this is the belt to that pair of braces.
  if (!env.isLiveSite) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/donate/thank-you'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
