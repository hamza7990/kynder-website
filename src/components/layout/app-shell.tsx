'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { SkipLink } from './skip-link';
import { ToastProvider } from '@/components/ui/toast';
import { localeFromPathname } from '@/lib/i18n/locale-path';
import type { SiteContent } from '@/lib/content';

export function AppShell({
  children,
  site,
}: {
  children: React.ReactNode;
  site?: SiteContent;
}) {
  const pathname = usePathname() ?? '';
  const isDashboardOrAuth =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/coach') ||
    pathname === '/login';

  if (isDashboardOrAuth) {
    return (
      <ToastProvider>
        <main id="main">{children}</main>
      </ToastProvider>
    );
  }

  // Public locale drives header/footer link prefixes and the switcher's active state.
  const locale = localeFromPathname(pathname);

  return (
    <ToastProvider>
      <SkipLink />
      <Header siteName={site?.name} locale={locale} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer site={site} locale={locale} />
    </ToastProvider>
  );
}
