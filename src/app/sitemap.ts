import type { MetadataRoute } from 'next';

/**
 * Deliberately empty. The route stays so the URL resolves rather than 404s,
 * but a sitemap is an invitation to crawl and every route here is noindex.
 * When this becomes a site anyone is meant to find, restore the generator from
 * git history: it enumerated pages, animals, articles, categories and series.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
