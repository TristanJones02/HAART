import type { Metadata } from 'next';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('partners-apply', '/partners/apply');
}

export default async function PartnersApplyPage(props: PageProps<'/partners/apply'>) {
  return <BuilderPage slug="partners-apply" searchParams={await props.searchParams} />;
}
