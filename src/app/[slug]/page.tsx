import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BuilderPage, DEDICATED_SLUGS, pageMetadata } from '@/lib/content/pageRoute';
import { getAllPageSlugs } from '@/lib/content/pages';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.filter((s) => !DEDICATED_SLUGS.has(s)).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return pageMetadata(slug, `/${slug}`);
}

export default async function GenericPage(props: PageProps<'/[slug]'>) {
  const { slug } = await props.params;
  if (DEDICATED_SLUGS.has(slug)) notFound();
  const searchParams = await props.searchParams;
  return <BuilderPage slug={slug} searchParams={searchParams} />;
}
