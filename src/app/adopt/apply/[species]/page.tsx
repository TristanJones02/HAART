import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';

const SPECIES = { dogs: 'adopt-apply-dogs', cats: 'adopt-apply-cats' } as const;

export function generateStaticParams() {
  return Object.keys(SPECIES).map((species) => ({ species }));
}

export async function generateMetadata(props: PageProps<'/adopt/apply/[species]'>): Promise<Metadata> {
  const { species } = await props.params;
  const slug = SPECIES[species as keyof typeof SPECIES];
  return slug ? pageMetadata(slug, `/adopt/apply/${species}`) : {};
}

export default async function AdoptApplyPage(props: PageProps<'/adopt/apply/[species]'>) {
  const { species } = await props.params;
  const slug = SPECIES[species as keyof typeof SPECIES];
  if (!slug) notFound();
  return <BuilderPage slug={slug} searchParams={await props.searchParams} />;
}
