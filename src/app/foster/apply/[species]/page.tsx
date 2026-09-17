import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';

export const revalidate = 300;


const SPECIES = { dogs: 'foster-apply-dogs', cats: 'foster-apply-cats' } as const;

export function generateStaticParams() {
  return Object.keys(SPECIES).map((species) => ({ species }));
}

export async function generateMetadata(props: PageProps<'/foster/apply/[species]'>): Promise<Metadata> {
  const { species } = await props.params;
  const slug = SPECIES[species as keyof typeof SPECIES];
  return slug ? pageMetadata(slug, `/foster/apply/${species}`) : {};
}

export default async function FosterApplyPage(props: PageProps<'/foster/apply/[species]'>) {
  const { species } = await props.params;
  const slug = SPECIES[species as keyof typeof SPECIES];
  if (!slug) notFound();
  return <BuilderPage slug={slug} />;
}
