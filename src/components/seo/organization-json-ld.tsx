import { site } from '@/data/site';
import { pageSeo } from '@/data/seo';
import { JsonLd } from './json-ld';

const notPending = (v: string) => !v.startsWith('[PENDING');

/** Organization schema for the home page. Only non-PENDING facts are emitted. */
export function OrganizationJsonLd() {
  const sameAs = [site.social.linkedin, site.social.instagram, site.social.youtube].filter(
    notPending,
  );

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    description: pageSeo.home.description,
  };
  if (sameAs.length) data.sameAs = sameAs;
  if (notPending(site.contactEmail)) data.email = site.contactEmail;

  return <JsonLd data={data} />;
}
