import { describe, expect, it } from 'vitest';
import { topics } from '../topics';

const ALLOWED_CLUSTERS = ['conversations', 'team-trust', 'self', 'growth'] as const;

describe('coaching topics — structure', () => {
  it('has 15 topics with unique slugs', () => {
    expect(topics).toHaveLength(15);
    const slugs = topics.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every cluster is one of the four allowed', () => {
    const bad = topics
      .filter((t) => !ALLOWED_CLUSTERS.includes(t.cluster))
      .map((t) => `${t.slug}:${t.cluster}`);
    expect(bad).toEqual([]);
  });

  it('no allowed cluster is empty', () => {
    const empty = ALLOWED_CLUSTERS.filter((c) => !topics.some((t) => t.cluster === c));
    expect(empty).toEqual([]);
  });
});
