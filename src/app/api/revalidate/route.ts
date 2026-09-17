import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

const TAGS: Record<string, string[]> = {
  siteSettings: ['settings'],
  page: ['pages'],
  animal: ['animals'],
  article: ['articles'],
  category: ['articles'],
  series: ['articles'],
  person: ['articles'],
  event: ['events'],
  product: ['products'],
  partner: ['partners'],
};

/**
 * Sanity webhook target: on publish, revalidate the tags for that document
 * type so the change appears within seconds instead of waiting for the ISR
 * window. Configure in sanity.io/manage → API → Webhooks with the secret.
 */
export async function POST(req: Request) {
  const secret = env.sanity.revalidateSecret;
  if (!secret) return NextResponse.json({ ok: false, message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 503 });
  const url = new URL(req.url);
  const provided = url.searchParams.get('secret') ?? req.headers.get('authorization')?.replace(/^Bearer /, '');
  if (provided !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  let body: { _type?: string; slug?: { current?: string } } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body: revalidate everything below */
  }
  const tags = body._type ? (TAGS[body._type] ?? []) : Object.values(TAGS).flat();
  for (const t of new Set(tags)) revalidateTag(t, 'max');
  if (body._type === 'page' && body.slug?.current) revalidatePath(body.slug.current === 'home' ? '/' : `/${body.slug.current}`);
  if (body._type === 'article' && body.slug?.current) revalidatePath(`/stories/${body.slug.current}`);
  return NextResponse.json({ ok: true, revalidated: [...new Set(tags)], at: new Date().toISOString() });
}
