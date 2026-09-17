import type { Metadata } from 'next';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const m = await pageMetadata('home', '/');
  return { ...m, title: 'HAART: Homeless and Abused Animal Rescue Team, Perth' };
}

export default async function HomePage() {
  return <BuilderPage slug="home" />;
}
