'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { SkipLink } from './skip-link';
import { ToastProvider } from '@/components/ui/toast';
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

  return (
    <ToastProvider>
      <SkipLink />
      <Header siteName={site?.name} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer site={site} />
    </ToastProvider>
  );
}
