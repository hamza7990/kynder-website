/**
 * Content validator — runs as the `prebuild` step (see package.json).
 *
 * It NEVER stops at the first problem: it collects every failure and, when run
 * as a CLI, prints all of them and exits 1 (or 0 when clean). The checking logic
 * lives in the pure `collectFailures()` so it can be unit-tested with fixtures;
 * the CLI wrapper at the bottom feeds it the real data.
 *
 * Runs on Node's native TypeScript type-stripping (Node >= 23.6 / 24), so it is
 * launched directly as `node scripts/validate-content.ts` with no loader.
 */
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { questions as realQuestions } from '../src/data/questions.ts';
import { topics as realTopics } from '../src/data/topics.ts';
import { site } from '../src/data/site.ts';
import { allNavItems, bookingCta } from '../src/data/nav.ts';
import * as home from '../src/data/home.ts';
import { book } from '../src/data/book.ts';
import { about } from '../src/data/about.ts';
import { contact } from '../src/data/contact.ts';

/** The canonical Pillar union (mirrors the `Pillar` type in questions.ts). */
export const PILLARS: readonly string[] = [
  'COURAGE',
  'COMMUNICATION',
  'EMPATHY',
  'SELF-AWARENESS',
  'CONSISTENCY',
  'GROWTH MINDSET',
];

/** kebab-case a title the same way the topic slugs were derived. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type QuestionLike = { no: string; pillar: string; steps: readonly unknown[] };
type TopicLike = { slug: string; title: string };

export interface ValidateInput {
  questions: readonly QuestionLike[];
  topics: readonly TopicLike[];
  /** Every string reachable in src/data, for the [PENDING: scan. */
  strings: readonly string[];
  nodeEnv?: string;
  allowPending?: string;
}

/** Returns a list of human-readable failures. Empty list == valid. */
export function collectFailures(input: ValidateInput): string[] {
  const { questions, topics, strings } = input;
  const failures: string[] = [];

  // --- questions -----------------------------------------------------------
  if (questions.length !== 10) {
    failures.push(`questions: expected 10, found ${questions.length}`);
  }

  questions.forEach((q, i) => {
    const expectedNo = String(i + 1).padStart(2, '0');
    if (q.steps.length !== 5) {
      failures.push(`question ${q.no ?? `#${i + 1}`}: expected 5 steps, found ${q.steps.length}`);
    }
    if (q.no !== expectedNo) {
      failures.push(
        `question at index ${i}: expected no "${expectedNo}", found "${q.no}" ` +
          `(no values must be "01".."10", unique and sequential)`,
      );
    }
    if (!PILLARS.includes(q.pillar)) {
      failures.push(`question ${q.no}: pillar "${q.pillar}" is outside the Pillar union`);
    }
  });

  const nos = questions.map((q) => q.no);
  [...new Set(nos.filter((n, i) => nos.indexOf(n) !== i))].forEach((n) =>
    failures.push(`question no "${n}" is duplicated`),
  );

  // --- topics --------------------------------------------------------------
  if (topics.length !== 15) {
    failures.push(`topics: expected 15, found ${topics.length}`);
  }

  const slugs = topics.map((t) => t.slug);
  [...new Set(slugs.filter((s, i) => slugs.indexOf(s) !== i))].forEach((s) =>
    failures.push(`topic slug "${s}" is duplicated`),
  );

  topics.forEach((t) => {
    const expected = slugify(t.title);
    if (t.slug !== expected) {
      failures.push(
        `topic "${t.title}": slug "${t.slug}" is not the kebab-case of its title ` +
          `(expected "${expected}")`,
      );
    }
  });

  // --- unresolved placeholders in a production build -----------------------
  if (input.nodeEnv === 'production' && input.allowPending !== 'true') {
    strings
      .filter((s) => s.includes('[PENDING:'))
      .forEach((s) =>
        failures.push(
          `unresolved placeholder in production build: ${JSON.stringify(s)} ` +
            `(set the matching env var, or pass ALLOW_PENDING=true for a preview build)`,
        ),
      );
  }

  return failures;
}

/** Deep-collects every string value reachable from `value`. */
function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out));
}

// --- CLI entry (only when executed directly, not when imported by tests) ----
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const strings: string[] = [];
  collectStrings(
    {
      site,
      allNavItems,
      bookingCta,
      questions: realQuestions,
      topics: realTopics,
      home: { ...home },
      book: { ...book },
      about: { ...about },
      contact: { ...contact },
    },
    strings,
  );

  const failures = collectFailures({
    questions: realQuestions as unknown as QuestionLike[],
    topics: realTopics as unknown as TopicLike[],
    strings,
    nodeEnv: process.env.NODE_ENV,
    allowPending: process.env.ALLOW_PENDING,
  });

  if (failures.length > 0) {
    console.error(`\ncontent validation FAILED — ${failures.length} problem(s):\n`);
    failures.forEach((f) => console.error(`  ✗ ${f}`));
    console.error('');
    process.exit(1);
  }

  console.log('content validation passed — 10 questions, 15 topics, no unresolved placeholders.');
}
