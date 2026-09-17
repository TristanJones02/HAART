import type { Metadata } from 'next';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';
import { DonationCompleted } from '@/components/donate/DonationCompleted';

export const revalidate = 300;


export async function generateMetadata(): Promise<Metadata> {
  return { ...(await pageMetadata('donate-thank-you', '/donate/thank-you')), robots: { index: false, follow: true } };
}

export default async function ThankYouPage() {
  return (
    <>
      <DonationCompleted />
      <BuilderPage slug="donate-thank-you" />
    </>
  );
}
