import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { PositioningSection } from '@/components/home/positioning-section';
import { QuestionsPreview } from '@/components/home/questions-preview';
import { TopicsPreview } from '@/components/home/topics-preview';
import { AboutTeaser } from '@/components/home/about-teaser';
import { CtaBand } from '@/components/home/cta-band';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';
import { buildPageMetadata, pageSeo } from '@/data/seo';
import { isLocale } from '@/i18n/config';
import { site } from '@/data/site';
import { getHomeContent, getQuestionsContent, getTopicsContent } from '@/lib/content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(pageSeo.home, site.name, isLocale(locale) ? locale : 'en');
}

// Rendered per request so CMS edits appear immediately; content is read from the
// database (falling back to src/data) via the resolvers in lib/content.
export const dynamic = 'force-dynamic';

// Home is a narrative page of previews, not a catalogue. Copy is resolved from
// the DB with a static fallback — no copy lives in this file.
export default async function HomePage({
  params,
}: {
  params?: Promise<{ locale: string }>;
} = {}) {
  const resolved = params ? await params : { locale: 'en' };
  const locale = isLocale(resolved.locale) ? resolved.locale : 'en';
  const [home, questions, topics] = await Promise.all([
    getHomeContent(),
    getQuestionsContent(locale),
    getTopicsContent(locale),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <HeroSection hero={home.hero} locale={locale} />
      <PositioningSection positioning={home.positioning} />
      <QuestionsPreview questions={questions} questionsPreview={home.questionsPreview} locale={locale} />
      <TopicsPreview topics={topics} topicsPreview={home.topicsPreview} locale={locale} />
      <AboutTeaser aboutTeaser={home.aboutTeaser} proofPoints={home.proofPoints} locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
