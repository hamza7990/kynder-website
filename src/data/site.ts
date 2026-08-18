/**
 * Site-wide configuration. Everything that varies by environment reads from an
 * env var with a "[PENDING: …]" fallback, so unset values are caught by the
 * content validation script before a production build.
 *
 * Client-exposed values use the NEXT_PUBLIC_ prefix; server-only values do not.
 */
export interface SiteConfig {
  name: string;
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
}

export const site: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'KYNDER',
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
};
