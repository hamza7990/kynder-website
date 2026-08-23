import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';

/**
 * Public locale segment (Workstream A / A2). Every public route lives under
 * `/[locale]/…` with `locale` ∈ {en, ar}. The actual `<html lang/dir>` is set by
 * the root layout from the `x-locale` header the middleware derives from this
 * prefix (App Router can't set `<html>` from a nested layout). This layout's job
 * is to validate the locale and, in later slices, host the public i18n provider.
 *
 * NB: distinct from the admin's per-account locale — public locale is per-URL.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <>{children}</>;
}
