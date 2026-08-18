import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { HIDDEN_ROUTES } from '@/lib/routes';

// Statically emitted to /robots.txt at build.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep internal-only routes (e.g. /styleguide) out of crawlers.
      disallow: HIDDEN_ROUTES.map((route) => `${route}/`),
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
