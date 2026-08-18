/**
 * Site-wide configuration. Everything that varies by environment reads from an
 * env var with a "[PENDING: …]" fallback, so unset values are caught by the
 * content validation script before a production build.
 *
 * Client-exposed values use the NEXT_PUBLIC_ prefix; server-only values do not.
 */
export interface SiteConfig {
  name: string;
  /** Absolute origin, used for canonical URLs, sitemap and Open Graph. */
  url: string;
  tagline: string;
  copyright: string;
  contactEmail: string;
  social: {
    linkedin: string;
    instagram: string;
    youtube: string;
  };
  schedulerBaseUrl: string;
  newsletterEndpoint: string;
  formEndpoint: string;
}

export const site: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'KYNDER',
  // Canonical origin. MUST be set to the real domain before launch — the
  // example.com fallback keeps metadataBase a valid URL but ships wrong
  // canonical/OG links, so it is tracked as a launch-blocking PENDING.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com').replace(/\/$/, ''),
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE ?? '[PENDING: tagline]',
  copyright: process.env.NEXT_PUBLIC_SITE_COPYRIGHT ?? '[PENDING: copyright]',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '[PENDING: contact email]',
  social: {
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? '[PENDING: linkedin url]',
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? '[PENDING: instagram url]',
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE ?? '[PENDING: youtube url]',
  },
  schedulerBaseUrl: process.env.NEXT_PUBLIC_SCHEDULER_URL ?? '[PENDING: scheduler base url]',
  newsletterEndpoint: process.env.NEWSLETTER_ENDPOINT ?? '[PENDING: newsletter endpoint]',
  formEndpoint: process.env.FORM_ENDPOINT ?? '[PENDING: form endpoint]',
};
