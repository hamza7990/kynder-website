/**
 * Tests for scripts/validate-content.ts.
 *
 * `collectFailures()` is the exit logic: a non-empty return maps directly to the
 * CLI's `process.exit(1)`, an empty return to `exit(0)`. So the pure-function
 * cases below ("missing a step" -> non-empty, "valid" -> empty, "many problems"
 * -> all reported) are the same guarantees the CLI gives, checked deterministically.
 * The subprocess cases then prove the wiring: real data exits 0 (pending allowed),
 * and a production build with an unresolved placeholder exits non-zero.
 */
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { collectFailures } from '../../../scripts/validate-content';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SCRIPT = join(REPO_ROOT, 'scripts', 'validate-content.ts');

const validQuestion = (no: string) => ({ no, pillar: 'COURAGE', steps: ['a', 'b', 'c', 'd', 'e'] });
const tenValidQuestions = Array.from({ length: 10 }, (_, i) => validQuestion(String(i + 1).padStart(2, '0')));
const fifteenValidTopics = Array.from({ length: 15 }, (_, i) => ({ slug: `topic-${i}`, title: `Topic ${i}` }));

describe('collectFailures', () => {
  it('returns no failures for valid data', () => {
    expect(collectFailures({ questions: tenValidQuestions, topics: fifteenValidTopics, strings: [] })).toEqual([]);
  });

  it('flags a question that is missing a step (would exit non-zero)', () => {
    const broken = tenValidQuestions.map((q, i) => (i === 2 ? { ...q, steps: ['a', 'b', 'c', 'd'] } : q));
    const failures = collectFailures({ questions: broken, topics: fifteenValidTopics, strings: [] });
    expect(failures.length).toBeGreaterThan(0);
    expect(failures.some((f) => /expected 5 steps, found 4/.test(f))).toBe(true);
  });

  it('reports MULTIPLE distinct failures in a single run', () => {
    const brokenQuestions = [
      { no: '01', pillar: 'COURAGE', steps: ['a', 'b', 'c', 'd'] }, // missing a step
      { no: '99', pillar: 'NOPE', steps: ['a', 'b', 'c', 'd', 'e'] }, // bad no + bad pillar
    ];
    const brokenTopics = [
      { slug: 'Dup', title: 'Dup' },
      { slug: 'Dup', title: 'Dup' },
    ]; // wrong count + duplicate slug + slug not kebab-case
    const failures = collectFailures({ questions: brokenQuestions, topics: brokenTopics, strings: [] });

    expect(failures.some((f) => /expected 10, found 2/.test(f))).toBe(true);
    expect(failures.some((f) => /expected 5 steps/.test(f))).toBe(true);
    expect(failures.some((f) => /outside the Pillar union/.test(f))).toBe(true);
    expect(failures.some((f) => /expected 15, found 2/.test(f))).toBe(true);
    expect(failures.some((f) => /is duplicated/.test(f))).toBe(true);
    expect(failures.some((f) => /is not the kebab-case/.test(f))).toBe(true);
    expect(failures.length).toBeGreaterThanOrEqual(6);
  });

  it('flags [PENDING: only in production and only without ALLOW_PENDING', () => {
    const strings = ['[PENDING: tagline]'];
    expect(
      collectFailures({ questions: tenValidQuestions, topics: fifteenValidTopics, strings, nodeEnv: 'production' }).some(
        (f) => /placeholder/.test(f),
      ),
    ).toBe(true);
    expect(
      collectFailures({
        questions: tenValidQuestions,
        topics: fifteenValidTopics,
        strings,
        nodeEnv: 'production',
        allowPending: 'true',
      }),
    ).toEqual([]);
    expect(
      collectFailures({ questions: tenValidQuestions, topics: fifteenValidTopics, strings, nodeEnv: 'development' }),
    ).toEqual([]);
  });
});

describe('validate-content CLI (subprocess)', () => {
  it('exits 0 on the real data when pending is allowed (dev context)', () => {
    const out = execFileSync('node', [SCRIPT], {
      cwd: REPO_ROOT,
      env: { ...process.env, NODE_ENV: 'development' },
      encoding: 'utf8',
    });
    expect(out).toMatch(/passed/);
  });

  it('exits non-zero on a production build with an unresolved placeholder', () => {
    let code = 0;
    let stderr = '';
    try {
      execFileSync('node', [SCRIPT], {
        cwd: REPO_ROOT,
        // Force a deterministic placeholder regardless of the host env.
        env: { ...process.env, NODE_ENV: 'production', ALLOW_PENDING: '', NEXT_PUBLIC_SITE_NAME: '[PENDING: probe]' },
        encoding: 'utf8',
        stdio: 'pipe',
      });
    } catch (err) {
      const e = err as { status?: number; stderr?: string };
      code = e.status ?? -1;
      stderr = e.stderr ?? '';
    }
    expect(code).toBe(1);
    expect(stderr).toMatch(/unresolved placeholder/);
  });
});
