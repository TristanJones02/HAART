import { env } from '@/lib/env';

/**
 * Mock content is served when Sanity is not configured and this is not the
 * live site — in development, and on a Vercel preview deployment, which is
 * how the whole site can be reviewed before the CMS exists. ALLOW_MOCK_CONTENT
 * forces it on anywhere else. On the live site without Sanity and without that
 * flag, pages render their honest empty states rather than placeholder
 * content: a charity's real domain never shows invented numbers.
 */
export function mockAllowed(): boolean {
  return !env.hasSanity && (!env.isLiveSite || process.env.ALLOW_MOCK_CONTENT === 'true');
}

export const CONTENT_SOURCE: 'sanity' | 'mock' | 'none' = env.hasSanity ? 'sanity' : mockAllowed() ? 'mock' : 'none';
