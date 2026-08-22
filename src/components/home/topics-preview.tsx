import Link from 'next/link';
import { buttonVariants, Card, Container, SectionHeader } from '@/components/ui';
import { Reveal, staggerDelay } from '@/lib/motion';
import { topicsPreview as staticTopicsPreview } from '@/data/home';
import { topics as staticTopics, type Topic } from '@/data/topics';
import { Section } from './section';

// Six topic cards, each routing to /book pre-filled with that topic's slug.
// No coach names, photos or bios — visitors choose a topic, not a face. Topics
// come from the DB (falling back to topics.ts) so admin edits appear here too.
export function TopicsPreview({
  topics = staticTopics,
  topicsPreview = staticTopicsPreview,
}: {
  topics?: Topic[];
  topicsPreview?: typeof staticTopicsPreview;
}) {
  const preview = topics.slice(0, topicsPreview.count);
  return (
    // 120 padding; cream-card surface — a deliberate shift that groups the six
    // topic cards into one "browse" zone, set apart from the narrative sections.
    <Section space="md" surface="card">
      <Container>
        <Reveal>
          <SectionHeader as="h2" title={topicsPreview.heading} lead={topicsPreview.lead} />
        </Reveal>

        <ul className="mt-12 grid gap-6 xs:grid-cols-2 md:grid-cols-3">
          {preview.map((t, i) => (
            <li key={t.slug}>
              <Reveal delay={staggerDelay(i)} className="h-full">
                <Link
                  href={`/book?topic=${t.slug}`}
                  className="focus-ring block h-full rounded-lg"
                >
                  <Card
                    surface="cream"
                    bordered
                    elevation={0}
                    className="h-full transition-[transform,border-color] duration-fast ease-out hover:border-terracotta motion-safe:hover:-translate-y-0.5"
                  >
                    <h3 className="font-display text-h4 text-navy-deep">{t.title}</h3>
                    <p className="mt-2 text-body text-ink-70">{t.blurb}</p>
                  </Card>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10">
          <Link
            href={topicsPreview.href}
            className={buttonVariants({ variant: 'ghost', size: 'md' })}
          >
            {topicsPreview.linkLabel}
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
