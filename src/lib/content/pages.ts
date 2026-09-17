import { cache } from 'react';
import type { Page } from '@/lib/content/types';
import { getReadClient, groq } from '@/lib/sanity/client';
import { MOCK_PAGES } from '@/lib/mock/pages';
import { mockAllowed } from './mode';
import { PAGE } from './groq';

export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? (MOCK_PAGES.find((p) => p.slug === slug) ?? null) : null;
  const page = await client.fetch<Page | null>(groq`*[_type == "page" && slug.current == $slug][0]${PAGE}`, { slug }, { next: { revalidate: 300, tags: ['pages', `page:${slug}`] } });
  return page;
});

export const getAllPageSlugs = cache(async (): Promise<string[]> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? MOCK_PAGES.map((p) => p.slug) : [];
  return client.fetch<string[]>(groq`*[_type == "page" && defined(slug.current) && seo.noIndex != true].slug.current`, {}, { next: { revalidate: 3600, tags: ['pages'] } });
});
