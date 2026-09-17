import type { MetadataRoute } from 'next';
import { getAllPageSlugs } from '@/lib/content/pages';
import { getArticles, getCategories, getAllSeries } from '@/lib/content/articles';
import { listAnimals } from '@/lib/animals';
import { siteUrl } from '@/lib/seo/metadata';
import { DEDICATED_SLUGS } from '@/lib/content/pageRoute';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, articles, categories, series, animals] = await Promise.all([getAllPageSlugs(), getArticles({ limit: 500 }), getCategories(), getAllSeries(), listAnimals({})]);
  const now = new Date();
  const fixed = ['/adopt/dogs', '/adopt/cats', '/adopt/apply/dogs', '/adopt/apply/cats', '/foster/apply/dogs', '/foster/apply/cats', '/partners/apply'];
  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    ...slugs.filter((s) => !DEDICATED_SLUGS.has(s) && s !== 'privacy').map((s) => ({ url: `${siteUrl}/${s}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...fixed.map((p) => ({ url: `${siteUrl}${p}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...animals.filter((a) => a.status !== 'adopted').map((a) => ({ url: `${siteUrl}/adopt/${a.species === 'dog' ? 'dogs' : 'cats'}/${a.slug}`, lastModified: a.listedAt ? new Date(a.listedAt) : now, changeFrequency: 'daily' as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: `${siteUrl}/stories/${a.slug}`, lastModified: new Date(a.publishedAt), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...categories.map((c) => ({ url: `${siteUrl}/stories/category/${c.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.4 })),
    ...series.map((s) => ({ url: `${siteUrl}/stories/series/${s.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.4 })),
  ];
}
