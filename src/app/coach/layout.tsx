import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getI18n } from '@/i18n/server';
import { I18nProvider } from '@/i18n/client';
import { cn } from '@/lib/cn';
import { Sidebar } from '@/components/dashboard/sidebar';

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect('/login?redirect=/coach');
  }

  const { locale, dir } = await getI18n();

  return (
    <I18nProvider locale={locale}>
      <div
        dir={dir}
        lang={locale}
        className={cn('flex min-h-screen bg-cream text-ink', locale === 'ar' && 'font-arabic')}
      >
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </I18nProvider>
  );
}
