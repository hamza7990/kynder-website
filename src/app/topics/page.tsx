import type { Metadata } from 'next';
import { Container } from '@/components/ui';
import { Reveal, staggerDelay } from '@/lib/motion';
import { clusters, heading, intro, moreLine, trustMarkers } from '@/data/topics';
import { CoachPool } from '@/components/topics/coach-pool';
import { TopicCard } from '@/components/topics/topic-card';
import { ServiceJsonLd } from '@/components/seo/service-json-ld';
import { buildPageMetadata, pageSeo } from '@/data/seo';
import { getTopicsContent } from '@/lib/content';

export const metadata: Metadata = buildPageMetadata(pageSeo.topics, heading);

// Rendered per request so admin edits to topics appear immediately.
export const dynamic = 'force-dynamic';

export default async function TopicsPage() {
  const topics = await getTopicsContent();
  return (
    <section className="py-section-lg">
      <ServiceJsonLd />
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-[18ch] text-balance font-display text-h2 tracking-display text-navy-deep md:text-display-2">
            {heading}
          </h1>
          <p className="max-w-[54ch] text-lead text-ink-80">{intro}</p>
          <CoachPool />
        </div>

        {/* Grouped by cluster, one grid per group, so labels never separate from
            their cards. 1 col below 640, 2 to 1024, 3 above. */}
        <div className="mt-16 flex flex-col gap-16">
          {clusters.map((cluster) => {
            const items = topics.filter((topic) => topic.cluster === cluster.id);
            if (items.length === 0) return null;
            return (
              <div key={cluster.id}>
                <h2 className="mb-6 font-sans text-small font-semibold uppercase tracking-eyebrow text-navy">
                  {cluster.label}
                </h2>
                <ul className="grid grid-cols-1 gap-6 min-[640px]:grid-cols-2 md:grid-cols-3">
                  {items.map((topic, i) => (
                    <li key={topic.slug}>
                      <Reveal delay={staggerDelay(i)} className="h-full">
                        <TopicCard topic={topic} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center gap-8 border-t border-ink-10 pt-12 text-center">
          <p className="max-w-[60ch] text-lead text-ink-80">{moreLine}</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {trustMarkers.map((marker) => (
              <li key={marker}>
                <span className="inline-flex items-center rounded-full border border-ink-10 bg-cream-card px-4 py-2 text-small font-medium text-navy-deep">
                  {marker}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
