import { cache } from 'react';
import type { Article, Category, Series } from '@/lib/content/types';
import { getReadClient, groq } from '@/lib/sanity/client';
import { MOCK_ARTICLES, MOCK_CATEGORIES, MOCK_SERIES } from '@/lib/mock/articles';
import { mockAllowed } from './mode';
import { ARTICLE_CARD, IMG } from './groq';

const FULL = `{
  ...${ARTICLE_CARD.slice(1, -1)},
  updatedAt, body, contentWarning,
  "author": author->{ _id, _type, name, "slug": slug.current, role, photo ${IMG} },
  "related": related[]->${ARTICLE_CARD},
  "relatedAnimals": relatedAnimals[]->{ name, "slug": slug.current, species, status, "photos": photos[0..0] ${IMG} },
  seo{ title, description, noIndex, image ${IMG} }
}`;

type ListOptions = { category?: string; series?: string; limit?: number; exclude?: string };

export const getArticles = cache(async ({ category, series, limit = 12, exclude }: ListOptions = {}): Promise<Article[]> => {
  const client = getReadClient();
  if (!client) {
    if (!mockAllowed()) return [];
    return MOCK_ARTICLES.filter((a) => (!category || a.categories.some((c) => c.slug === category)) && (!series || a.series?.slug === series) && a.slug !== exclude)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, limit);
  }
  return client.fetch<Article[]>(
    groq`*[_type == "article" && defined(slug.current) && publishedAt <= now()
      && (!defined($category) || $category in categories[]->slug.current)
      && (!defined($series) || series->slug.current == $series)
      && slug.current != $exclude] | order(publishedAt desc)[0...$limit]${ARTICLE_CARD}`,
    { category: category ?? null, series: series ?? null, exclude: exclude ?? '', limit },
    { next: { revalidate: 300, tags: ['articles'] } },
  );
});

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? (MOCK_ARTICLES.find((a) => a.slug === slug) ?? null) : null;
  return client.fetch<Article | null>(groq`*[_type == "article" && slug.current == $slug][0]${FULL}`, { slug }, { next: { revalidate: 300, tags: ['articles', `article:${slug}`] } });
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? MOCK_CATEGORIES : [];
  return client.fetch<Category[]>(groq`*[_type == "category"] | order(title asc){ _id, _type, title, "slug": slug.current, description }`, {}, { next: { revalidate: 3600, tags: ['articles'] } });
});

export const getAllSeries = cache(async (): Promise<Series[]> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? MOCK_SERIES : [];
  return client.fetch<Series[]>(groq`*[_type == "series"] | order(title asc){ _id, _type, title, "slug": slug.current, description, image ${IMG} }`, {}, { next: { revalidate: 3600, tags: ['articles'] } });
});

export const getCategory = cache(async (slug: string) => (await getCategories()).find((c) => c.slug === slug) ?? null);
export const getSeries = cache(async (slug: string) => (await getAllSeries()).find((s) => s.slug === slug) ?? null);
