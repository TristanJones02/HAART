import { getArticles } from '@/lib/content/articles';
import { siteUrl } from '@/lib/seo/metadata';

export const revalidate = 3600;

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] ?? c);

/** RSS 2.0 feed of stories. Replaces the old WordPress /feed/. */
export async function GET() {
  const articles = await getArticles({ limit: 30 });
  const items = articles
    .map(
      (a) => `<item><title>${esc(a.title)}</title><link>${siteUrl}/stories/${a.slug}</link><guid isPermaLink="true">${siteUrl}/stories/${a.slug}</guid><pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate><description>${esc(a.excerpt)}</description>${a.categories?.map((c) => `<category>${esc(c.title)}</category>`).join('') ?? ''}</item>`,
    )
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HAART rescue stories</title><link>${siteUrl}/stories</link><description>Stories from the Homeless and Abused Animal Rescue Team, Perth.</description><language>en-au</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
