import type { Metadata, Viewport } from 'next';
import { Inter, Lora } from 'next/font/google';
import '@/styles/globals.css';
import { SkipLink } from '@/components/layout/skip-link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

// Self-hosted via next/font — fonts are downloaded at build time and served
// from our own origin. No render-blocking external font CSS.
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

export const metadata: Metadata = {
  title: {
    default: 'KYNDER',
    template: '%s | KYNDER',
  },
  description: 'KYNDER leadership coaching.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body>
        <SkipLink />
        <Header />
        {/* tabIndex=-1 makes <main> the programmatic focus target for the skip link. */}
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
