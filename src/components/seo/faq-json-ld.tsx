import { questions } from '@/data/questions';
import { JsonLd } from './json-ld';

/**
 * FAQPage schema for /questions. Question text is verbatim from questions.ts; the
 * answer is the question's five practical steps, also verbatim.
 */
export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.steps.join(' ') },
        })),
      }}
    />
  );
}
