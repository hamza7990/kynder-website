import type { Locale } from '@/i18n/config';

/**
 * Locale-aware path helpers for the PUBLIC site (Workstream A / A2). Pure
 * functions so they work in both server and client components.
 *
 * Non-localized subtrees (the dashboard + auth) keep their bare paths — they use
 * per-account locale, not URL locale.
 */
const NON_LOCALIZED = ['/admin', '/coach', '/login'];

/** The active locale from a pathname's first segment; defaults to English. */
export function localeFromPathname(pathname: string): Locale {
  return pathname.split('/')[1] === 'ar' ? 'ar' : 'en';
}

/**
 * Prefix an internal app path with the locale. Leaves untouched: external URLs,
 * mailto:/tel:, hashes, already-localized paths, and the non-localized subtrees.
 */
export function localeHref(locale: Locale, href: string): string {
  if (!href.startsWith('/')) return href; // external, mailto:, tel:, #hash, relative
  if (NON_LOCALIZED.some((p) => href === p || href.startsWith(`${p}/`) || href.startsWith(`${p}?`))) {
    return href;
  }
  const seg = href.split('/')[1];
  if (seg === 'en' || seg === 'ar') return href; // already localized
  return href === '/' ? `/${locale}` : `/${locale}${href}`;
}

/**
 * The current path in the other locale — for the language switcher, keeping the
 * user on the same page. Swaps the locale segment (or prefixes if absent).
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/');
  if (parts[1] === 'en' || parts[1] === 'ar') {
    parts[1] = target;
    const joined = parts.join('/');
    return joined === '' ? `/${target}` : joined;
  }
  return pathname === '/' ? `/${target}` : `/${target}${pathname}`;
}
