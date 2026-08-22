import type { Metadata, Viewport } from 'next';
import { Inter, Lora, IBM_Plex_Sans_Arabic } from 'next/font/google';
import '@/styles/globals.css';
import { Analytics } from '@/components/analytics/analytics';
import { AppShell } from '@/components/layout/app-shell';
import { site } from '@/data/site';
import { pageSeo, ogImage } from '@/data/seo';
import { getSiteContent } from '@/lib/content';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Arabic UI face for the admin/coach dashboard in RTL mode. Lora and Inter have
// no Arabic coverage, so this provides proper, legible Arabic at small sizes in
// tables. Self-hosted by next/font (no runtime Google requests).
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageSeo.home.absoluteTitle ?? site.name,
    template: `%s | ${site.name}`,
  },
  description: pageSeo.home.description,
  applicationName: site.name,
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_GB',
    title: pageSeo.home.absoluteTitle ?? site.name,
    description: pageSeo.home.description,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageSeo.home.absoluteTitle ?? site.name,
    description: pageSeo.home.description,
    images: [ogImage.url],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Header/Footer copy is read from the DB (falling back to static site data).
  const siteContent = await getSiteContent();
  return (
    <html lang="en" dir="ltr" className={`${lora.variable} ${inter.variable} ${plexArabic.variable}`}>
      <body>
        <Analytics />
        <AppShell site={siteContent}>{children}</AppShell>
      </body>
    </html>
  );
}
