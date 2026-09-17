import { env } from '@/lib/env';

/**
 * Mock content is served when Sanity is not configured, in development or
 * when ALLOW_MOCK_CONTENT=true (for preview deployments before the CMS exists).
 * In production without Sanity and without that flag, pages render their
 * honest empty states rather than placeholder content.
 */
export function mockAllowed(): boolean {
  return !env.hasSanity && (!env.isProduction || process.env.ALLOW_MOCK_CONTENT === 'true');
}

export const CONTENT_SOURCE: 'sanity' | 'mock' | 'none' = env.hasSanity ? 'sanity' : mockAllowed() ? 'mock' : 'none';
