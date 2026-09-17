import type { Metadata, Viewport } from 'next';
import { Nunito, Source_Sans_3 } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@/components/layout/Analytics';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { getSiteSettings } from '@/lib/content/settings';
import { JsonLd, organisationJsonLd } from '@/lib/seo/jsonld';
import { siteUrl } from '@/lib/seo/metadata';
import './globals.css';

// Self-hosted through next/font (downloaded at build, served from this origin),
// with size-adjusted fallbacks so text never shifts when the font arrives.
const nunito = Nunito({ subsets: ['latin'], weight: ['700', '800', '900'], variable: '--font-nunito', display: 'optional', adjustFontFallback: true });
const sourceSans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-source-sans', display: 'optional', adjustFontFallback: true });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'HAART: Homeless and Abused Animal Rescue Team, Perth', template: '%s | HAART' },
  description: 'HAART is a not-for-profit, no-kill animal rescue in Perth, Western Australia. Foster-based, volunteer-run, no government funding.',
  applicationName: 'HAART',
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const settings = await getSiteSettings();
  return (
    <html lang="en-AU" className={`${nunito.variable} ${sourceSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-paper-0 text-charcoal-900">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <Header nav={settings.navigation.header} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer settings={settings} />
        </MotionProvider>
        <JsonLd data={organisationJsonLd(settings)} />
        <Analytics />
      </body>
    </html>
  );
}
