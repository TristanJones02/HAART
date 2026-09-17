import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';

export const revalidate = 300;

const SPECIES = { dogs: 'adopt-dogs', cats: 'adopt-cats' } as const;

export function generateStaticParams() {
  return Object.keys(SPECIES).map((species) => ({ species }));
}

export async function generateMetadata(props: PageProps<'/adopt/[species]'>): Promise<Metadata> {
  const { species } = await props.params;
  const slug = SPECIES[species as keyof typeof SPECIES];
  return slug ? pageMetadata(slug, `/adopt/${species}`) : {};
}

export default async function ListingPage(props: PageProps<'/adopt/[species]'>) {
  const { species } = await props.params;
  const slug = SPECIES[species as keyof typeof SPECIES];
  if (!slug) notFound();
  return <BuilderPage slug={slug} searchParams={await props.searchParams} />;
}
