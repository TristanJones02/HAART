import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { getPage } from '@/lib/content/pages';
import { buildMetadata } from '@/lib/seo/metadata';
import { portableToText } from '@/lib/sanity/portable';

/** Metadata for a page-builder page, falling back to its first lead paragraph. */
export async function pageMetadata(slug: string, path: string): Promise<Metadata> {
  const page = await getPage(slug);
  if (!page) return {};
  const first = page.sections.find((s) => s._type === 'section.hero' || s._type === 'section.pageHeader') as { lead?: string; heading?: string } | undefined;
  const rich = page.sections.find((s) => s._type === 'section.richText') as { body?: Parameters<typeof portableToText>[0] } | undefined;
  const description = first?.lead ?? portableToText(rich?.body).slice(0, 155);
  return buildMetadata({ title: page.title, description, path, seo: page.seo, noIndex: page.seo?.noIndex });
}

/**
 * Renders a page-builder page or 404s. Builder pages never read search
 * params on the server, so they prerender and cache at the CDN; query
 * parameters (?animal=, ?frequency=, ?sent=) are read client-side.
 */
export async function BuilderPage({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();
  return <SectionRenderer sections={page.sections} />;
}

/** Slugs served by dedicated routes rather than the generic [slug] route. */
export const DEDICATED_SLUGS = new Set(['home', 'adopt-dogs', 'adopt-cats', 'adopt-apply-dogs', 'adopt-apply-cats', 'foster-apply-dogs', 'foster-apply-cats', 'donate-thank-you', 'partners-apply']);
