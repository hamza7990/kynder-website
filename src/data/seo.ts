/**
 * Per-page SEO copy: unique <title> and meta description for each route.
 *
 * Descriptions are AUTHORED for search/social (the brief supplies none) and are
 * composed only from facts already in the brief — the positioning paragraph, the
 * page names, the confirmed proof points — with no added claims or hype. They are
 * flagged in docs/PENDING.md for client review, since they are the one class of
 * on-page text not lifted verbatim from the brief.
 *
 * Titles keep the "%s | KYNDER" template from the root layout; `home` overrides
 * the template with the brand's own line.
 */

import type { Metadata } from 'next';
import { site } from './site';

export interface PageSeo {
  /** Absolute path, used for the canonical URL and Open Graph URL. */
  path: string;
  /** Full <title> when the route needs to override the template (home only). */
  absoluteTitle?: string;
  description: string;
}

export const pageSeo = {
  home: {
    path: '/',
    absoluteTitle: 'KYNDER — Kind leadership is strong leadership',
    description:
      'Human-led leadership coaching with Dr. Shereen Williams, grounded in doctoral research into what makes leaders effective across cultures.',
  },
  questions: {
    path: '/questions/',
    description:
      'The 10 Leadership Questions — each with five small, practical steps to work through at your own pace.',
  },
  topics: {
    path: '/topics/',
    description:
      'Choose a coaching topic, not a face. Kynder matches you to the right accredited coach for the area you want to work on.',
  },
  book: {
    path: '/book/',
    description:
      'Book a 1-on-1 leadership coaching session. Pick your topic and Kynder matches you to the right coach.',
  },
  about: {
    path: '/about/',
    description:
      'Dr. Shereen Williams — leadership coach with 25+ years of experience and doctoral research across 17+ countries.',
  },
  contact: {
    path: '/contact/',
    description: 'Get in touch with Kynder about leadership coaching and 1-on-1 sessions.',
  },
} satisfies Record<string, PageSeo>;

/** Open Graph image (generated at build by src/app/opengraph-image.tsx). */
export const ogImageAlt = 'KYNDER — kind leadership is strong leadership';

/**
 * Absolute-relative ref to the generated OG image. Set explicitly on every page:
 * a page-level `openGraph` object replaces the one from the file convention, so
 * the image must be re-declared or it drops off sub-pages. metadataBase resolves
 * it to an absolute URL; the route serves the PNG regardless of query string.
 */
export const ogImage = { url: '/opengraph-image', width: 1200, height: 630, alt: ogImageAlt };

/**
 * Build a page's Metadata: unique title + description, a canonical URL, and
 * matching Open Graph / Twitter fields. The OG/Twitter image is injected for
 * every route by the opengraph-image file convention, so it is not set here.
 */
export function buildPageMetadata(seo: PageSeo, title: string): Metadata {
  const fullTitle = seo.absoluteTitle ?? `${title} | ${site.name}`;
  return {
    title: seo.absoluteTitle ? { absolute: seo.absoluteTitle } : title,
    description: seo.description,
    alternates: { canonical: seo.path },
    openGraph: {
      title: fullTitle,
      description: seo.description,
      url: seo.path,
      images: [ogImage],
    },
    // card + image must be repeated here: a page-level `twitter` object replaces
    // the root one rather than deep-merging, so it would otherwise fall back to
    // 'summary' and drop the image.
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: [ogImage.url],
    },
  };
}
