import Link from 'next/link';
import { Badge, buttonVariants, Card, Container, SectionHeader } from '@/components/ui';
import { Reveal, staggerDelay } from '@/lib/motion';
import { questionsPreview as staticQuestionsPreview } from '@/data/home';
import { questions as staticQuestions, type Question } from '@/data/questions';
import { Section } from './section';

// Closed-state previews only — the first `count` questions, each deep-linking to
// its anchor on /questions. Not expandable here. Questions come from the DB
// (falling back to questions.ts) so admin edits appear here too.
export function QuestionsPreview({
  questions = staticQuestions,
  questionsPreview = staticQuestionsPreview,
}: {
  questions?: Question[];
  questionsPreview?: typeof staticQuestionsPreview;
}) {
  const preview = questions.slice(0, questionsPreview.count);
  return (
    // 120 padding; cream (default) — stays in the narrative flow after positioning.
    <Section space="md">
      <Container>
        <Reveal>
          <SectionHeader as="h2" title={questionsPreview.heading} lead={questionsPreview.lead} />
        </Reveal>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {preview.map((q, i) => (
            <li key={q.no}>
              <Reveal delay={staggerDelay(i)} className="h-full">
                <Link
                  href={`/questions#q-${q.no}`}
                  className="focus-ring block h-full rounded-lg"
                  aria-label={`${q.no}. ${q.question}`}
                >
                  <Card
                    surface="cream"
                    bordered
                    elevation={0}
                    className="h-full transition-[transform,border-color] duration-fast ease-out hover:border-terracotta motion-safe:hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-display text-h3 text-navy-deep">{q.no}</span>
                      <Badge variant="terracotta">{q.pillar}</Badge>
                    </div>
                    <p className="mt-4 text-lead text-navy-deep">{q.question}</p>
                  </Card>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10">
          <Link
            href={questionsPreview.href}
            className={buttonVariants({ variant: 'ghost', size: 'md' })}
          >
            {questionsPreview.linkLabel}
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
