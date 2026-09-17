import { cache } from 'react';
import type { Partner, Product, ProductKind } from '@/lib/content/types';
import { getReadClient, groq } from '@/lib/sanity/client';
import { MOCK_PARTNERS } from '@/lib/mock/partners';
import { MOCK_PRODUCTS } from '@/lib/mock/products';
import { mockAllowed } from './mode';
import { IMG } from './groq';

export const getPartners = cache(async (): Promise<Partner[]> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? MOCK_PARTNERS : [];
  return client.fetch<Partner[]>(groq`*[_type == "partner"] | order(sortOrder asc, name asc){ _id, _type, name, "slug": slug.current, logo ${IMG}, url, category, description, tier, sortOrder }`, {}, { next: { revalidate: 3600, tags: ['partners'] } });
});

export const getProducts = cache(async (kind: ProductKind | 'all' = 'all', limit = 24): Promise<Product[]> => {
  const client = getReadClient();
  if (!client) return mockAllowed() ? MOCK_PRODUCTS.filter((p) => kind === 'all' || p.kind === kind).slice(0, limit) : [];
  return client.fetch<Product[]>(
    groq`*[_type == "product" && available == true && ($kind == "all" || kind == $kind)] | order(sortOrder asc, name asc)[0...$limit]{ _id, _type, name, "slug": slug.current, kind, price, priceNote, image ${IMG}, description, squareLink, externalUrl, available, sortOrder }`,
    { kind, limit },
    { next: { revalidate: 600, tags: ['products'] } },
  );
});
