import type { Metadata } from 'next';
import { BuilderPage, pageMetadata } from '@/lib/content/pageRoute';
import { DonationCompleted } from '@/components/donate/DonationCompleted';

export async function generateMetadata(): Promise<Metadata> {
  return { ...(await pageMetadata('donate-thank-you', '/donate/thank-you')), robots: { index: false, follow: true } };
}

export default async function ThankYouPage(props: PageProps<'/donate/thank-you'>) {
  return (
    <>
      <DonationCompleted />
      <BuilderPage slug="donate-thank-you" searchParams={await props.searchParams} />
    </>
  );
}
