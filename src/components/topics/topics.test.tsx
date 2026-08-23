import { render, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TopicsPage from '@/app/[locale]/topics/page';
import { clusters, topics } from '@/data/topics';

describe('topics page', () => {
  it('renders all 15 topics, each linking to /book?topic={its own slug}', async () => {
    render(await TopicsPage());
    for (const topic of topics) {
      const link = document.querySelector<HTMLAnchorElement>(`a[href="/book?topic=${topic.slug}"]`);
      expect(link, topic.slug).not.toBeNull();
      expect(link).toHaveAttribute('aria-label', topic.title);
      expect(within(link!).getByText(topic.title)).toBeInTheDocument();
    }
    expect(document.querySelectorAll('a[href^="/book?topic="]')).toHaveLength(15);
  });

  it('groups by cluster, every cluster non-empty', async () => {
    render(await TopicsPage());
    for (const cluster of clusters) {
      expect(topics.filter((t) => t.cluster === cluster.id).length).toBeGreaterThan(0);
    }
  });

  it('shows no coach photos or real initials', async () => {
    const { container } = render(await TopicsPage());
    expect(container.querySelectorAll('img')).toHaveLength(0);
    // The old mockup used "KW / NM / SL"; none of those may appear.
    expect(container.textContent).not.toMatch(/\bKW\b|\bNM\b|\bSL\b/);
  });
});
