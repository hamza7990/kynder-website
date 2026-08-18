import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { pageSeo } from '@/data/seo';

// Statically emitted to /sitemap.xml at build.
export const dynamic = 'force-static';

/**
 * Public, indexable routes only. /styleguide is internal (excluded here and in
 * robots.txt) and /book/confirmed is noindex, so neither is listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(pageSeo).map((page) => ({
    url: `${site.url}${page.path}`,
    changeFrequency: 'monthly',
    priority: page.path === '/' ? 1 : 0.8,
  }));
}
