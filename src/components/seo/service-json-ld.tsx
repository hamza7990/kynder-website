import { site } from '@/data/site';
import { pageSeo } from '@/data/seo';
import { topics } from '@/data/topics';
import { JsonLd } from './json-ld';

/**
 * Service schema for /topics: leadership coaching provided by KYNDER, with the
 * 15 coaching topics as the offer catalogue (titles verbatim from topics.ts).
 */
export function ServiceJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Leadership coaching',
        url: `${site.url}${pageSeo.topics.path}`,
        description: pageSeo.topics.description,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Coaching Topics',
          itemListElement: topics.map((topic) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: topic.title },
          })),
        },
      }}
    />
  );
}
