import { about } from '@/data/about';
import { site } from '@/data/site';
import { pageSeo } from '@/data/seo';
import { JsonLd } from './json-ld';

/**
 * Person schema for /about. The name is the brief-confirmed heading; nothing that
 * is still [PENDING] (bio, credentials) is asserted as fact.
 */
export function PersonJsonLd() {
  const name = about.heading.replace(/^About\s+/, '');
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        url: `${site.url}${pageSeo.about.path}`,
        description: pageSeo.about.description,
        jobTitle: 'Leadership coach',
        worksFor: { '@type': 'Organization', name: site.name, url: site.url },
      }}
    />
  );
}
