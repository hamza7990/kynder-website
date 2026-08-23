import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { pageSeo } from '@/data/seo';

// Statically emitted to /sitemap.xml at build.
export const dynamic = 'force-static';

const LOCALES = ['en', 'ar'] as const;

/** '/' → '/en', '/about/' → '/en/about/'. */
function localize(locale: string, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Public, indexable routes only, emitted in both locales with hreflang
 * alternates so search engines pair the /en and /ar versions. /styleguide is
 * internal and /book/confirmed is noindex, so neither is listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(pageSeo).flatMap((page) => {
    const languages = {
      en: `${site.url}${localize('en', page.path)}`,
      ar: `${site.url}${localize('ar', page.path)}`,
    };
    return LOCALES.map((locale) => ({
      url: `${site.url}${localize(locale, page.path)}`,
      changeFrequency: 'monthly' as const,
      priority: page.path === '/' ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
