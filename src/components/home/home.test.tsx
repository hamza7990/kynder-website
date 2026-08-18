import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroSection } from './hero-section';
import { PositioningSection } from './positioning-section';
import { QuestionsPreview } from './questions-preview';
import { TopicsPreview } from './topics-preview';
import { AboutTeaser } from './about-teaser';
import { questions } from '@/data/questions';
import { topics } from '@/data/topics';
import {
  aboutTeaser,
  ctaBand,
  hero,
  positioning,
  proofPoints,
  questionsPreview,
  topicsPreview,
} from '@/data/home';

describe('home — questions preview', () => {
  it('renders exactly 3 questions from questions.ts, each deep-linked', () => {
    render(<QuestionsPreview />);

    for (const q of questions.slice(0, 3)) {
      const link = document.querySelector<HTMLAnchorElement>(`a[href="/questions#q-${q.no}"]`);
      expect(link, `deep link for q-${q.no}`).not.toBeNull();
      expect(within(link!).getByText(q.question)).toBeInTheDocument();
    }

    const deepLinks = Array.from(
      document.querySelectorAll('a[href^="/questions#q-"]'),
    );
    expect(deepLinks).toHaveLength(3);
    // The 4th question is not on the home page.
    expect(screen.queryByText(questions[3]!.question)).toBeNull();
  });
});

describe('home — topics preview', () => {
  it('renders exactly 6 topics, each linking to /book?topic={its own slug}', () => {
    render(<TopicsPreview />);

    for (const t of topics.slice(0, 6)) {
      const link = document.querySelector<HTMLAnchorElement>(`a[href="/book?topic=${t.slug}"]`);
      expect(link, `book link for ${t.slug}`).not.toBeNull();
      expect(within(link!).getByText(t.title)).toBeInTheDocument();
    }

    const bookLinks = Array.from(document.querySelectorAll('a[href^="/book?topic="]'));
    expect(bookLinks).toHaveLength(6);
    // The 7th topic is not on the home page.
    expect(screen.queryByText(topics[6]!.title)).toBeNull();
  });
});

describe('home — PENDING placeholders render literally', () => {
  it('renders hero eyebrow and positioning placeholders verbatim', () => {
    render(
      <>
        <HeroSection />
        <PositioningSection />
      </>,
    );
    expect(hero.eyebrow).toContain('[PENDING:');
    expect(positioning.statement).toContain('[PENDING:');
    expect(screen.getByText(hero.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(positioning.statement)).toBeInTheDocument();
  });

  it('renders the about portrait placeholder verbatim', () => {
    render(<AboutTeaser />);
    expect(aboutTeaser.portrait).toContain('[PENDING:');
    expect(screen.getByText(aboutTeaser.portrait)).toBeInTheDocument();
  });
});

describe('home — no copy string literals in components', () => {
  it('inlines no copy from the data layer (all copy comes from src/data)', () => {
    const dir = join(process.cwd(), 'src/components/home');
    const componentSrc = readdirSync(dir)
      .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
      .map((f) => readFileSync(join(dir, f), 'utf8'))
      .join('\n');
    const pageSrc = readFileSync(join(process.cwd(), 'src/app/page.tsx'), 'utf8');
    const allSrc = componentSrc + '\n' + pageSrc;

    const copy = [
      hero.headline,
      hero.lead,
      hero.eyebrow,
      hero.primaryCta.label,
      hero.secondaryCta.label,
      positioning.statement,
      questionsPreview.heading,
      questionsPreview.lead,
      questionsPreview.linkLabel,
      topicsPreview.heading,
      topicsPreview.lead,
      topicsPreview.linkLabel,
      aboutTeaser.heading,
      aboutTeaser.body,
      aboutTeaser.researchLine,
      aboutTeaser.portrait,
      aboutTeaser.linkLabel,
      ctaBand.heading,
      ctaBand.body,
      ctaBand.cta.label,
      ...questions.map((q) => q.question),
      ...topics.map((t) => t.title),
      ...topics.map((t) => t.blurb),
      ...proofPoints.map((p) => p.label),
    ];

    const leaked = copy.filter((s) => s.length > 3 && allSrc.includes(s));
    expect(leaked, `copy inlined in components:\n${leaked.join('\n')}`).toEqual([]);
  });
});
