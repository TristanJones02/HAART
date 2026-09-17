import type { Metadata } from 'next';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';

export const revalidate = 300;


export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('partners-apply', '/partners/apply');
}

export default async function PartnersApplyPage() {
  return <BuilderPage slug="partners-apply" />;
}
