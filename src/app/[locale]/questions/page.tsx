import type { Metadata } from 'next';
import { TrackLink } from '@/components/analytics/track-link';
import { buttonVariants, Container } from '@/components/ui';
import { closingCta, closingLine, heading } from '@/data/questions';
import { QuestionsExperience } from '@/components/questions/questions-experience';
import { buildPageMetadata, pageSeo } from '@/data/seo';
import { FaqJsonLd } from '@/components/seo/faq-json-ld';
import { getQuestionsContent } from '@/lib/content';

export const metadata: Metadata = buildPageMetadata(pageSeo.questions, heading);

// Rendered per request so admin edits to questions appear immediately.
export const dynamic = 'force-dynamic';

export default async function QuestionsPage() {
  const questions = await getQuestionsContent();
  return (
    <section className="py-section-lg">
      <FaqJsonLd />
      <Container>
        <h1 className="max-w-[18ch] text-balance font-display text-h2 tracking-display text-navy-deep md:text-display-2">
          {heading}
        </h1>

        <div className="mt-12">
          <QuestionsExperience questions={questions} />
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-ink-10 pt-12">
          <p className="max-w-[54ch] text-lead text-ink-80">{closingLine}</p>
          <TrackLink
            event="booking_cta_click"
            href="/book"
            className={buttonVariants({ variant: 'primary', size: 'md' })}
          >
            {closingCta}
          </TrackLink>
        </div>
      </Container>
    </section>
  );
}
