import type { Metadata } from 'next';
import { HeroSection } from '@/components/home/hero-section';
import { PositioningSection } from '@/components/home/positioning-section';
import { QuestionsPreview } from '@/components/home/questions-preview';
import { TopicsPreview } from '@/components/home/topics-preview';
import { AboutTeaser } from '@/components/home/about-teaser';
import { CtaBand } from '@/components/home/cta-band';
import { OrganizationJsonLd } from '@/components/seo/organization-json-ld';
import { buildPageMetadata, pageSeo } from '@/data/seo';
import { site } from '@/data/site';
import { getHomeContent, getQuestionsContent, getTopicsContent } from '@/lib/content';

export const metadata: Metadata = buildPageMetadata(pageSeo.home, site.name);

// Rendered per request so CMS edits appear immediately; content is read from the
// database (falling back to src/data) via the resolvers in lib/content.
export const dynamic = 'force-dynamic';

// Home is a narrative page of previews, not a catalogue. Copy is resolved from
// the DB with a static fallback — no copy lives in this file.
export default async function HomePage() {
  const [home, questions, topics] = await Promise.all([
    getHomeContent(),
    getQuestionsContent(),
    getTopicsContent(),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <HeroSection hero={home.hero} />
      <PositioningSection positioning={home.positioning} />
      <QuestionsPreview questions={questions} questionsPreview={home.questionsPreview} />
      <TopicsPreview topics={topics} topicsPreview={home.topicsPreview} />
      <AboutTeaser aboutTeaser={home.aboutTeaser} proofPoints={home.proofPoints} />
      <CtaBand />
    </>
  );
}
