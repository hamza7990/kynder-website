import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { QuestionsExperience } from './questions-experience';
import QuestionsPage from '@/app/questions/page';
import { closingCta, closingLine, questions, stepsLabel } from '@/data/questions';

beforeAll(() => {
  // jsdom implements neither; the deep-link path calls window.scrollTo.
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

const triggers = () =>
  screen.getAllByRole('button').filter((b) => b.hasAttribute('aria-expanded'));

describe('questions — closed on load', () => {
  it('renders all ten questions, every one collapsed', () => {
    render(<QuestionsExperience />);
    const t = triggers();
    expect(t).toHaveLength(10);
    expect(t.every((b) => b.getAttribute('aria-expanded') === 'false')).toBe(true);
  });
});

describe('questions — single open', () => {
  it('opening one closes the previously open one', async () => {
    const user = userEvent.setup();
    render(<QuestionsExperience />);
    const t = triggers();

    await user.click(t[0]!);
    expect(t[0]).toHaveAttribute('aria-expanded', 'true');

    await user.click(t[1]!);
    expect(t[1]).toHaveAttribute('aria-expanded', 'true');
    expect(t[0]).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('questions — keyboard', () => {
  it('Enter and Space toggle the focused question', async () => {
    const user = userEvent.setup();
    render(<QuestionsExperience />);
    const t = triggers();
    t[0]!.focus();

    await user.keyboard('{Enter}');
    expect(t[0]).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Enter}');
    expect(t[0]).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard(' ');
    expect(t[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('Arrow/Home/End move focus between questions', async () => {
    const user = userEvent.setup();
    render(<QuestionsExperience />);
    const t = triggers();
    t[0]!.focus();

    await user.keyboard('{ArrowDown}');
    expect(t[1]).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(t[0]).toHaveFocus();
    await user.keyboard('{End}');
    expect(t[9]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(t[0]).toHaveFocus();
  });
});

describe('questions — deep links', () => {
  it('each of #q-01..#q-10 opens exactly that question', async () => {
    for (const q of questions) {
      window.history.replaceState(null, '', `/questions#q-${q.no}`);
      const view = render(<QuestionsExperience />);

      await waitFor(() => {
        expect(document.getElementById(`q-trigger-${q.no}`)).toHaveAttribute('aria-expanded', 'true');
      });
      const open = triggers().filter((b) => b.getAttribute('aria-expanded') === 'true');
      expect(open).toHaveLength(1);

      view.unmount();
      window.history.replaceState(null, '', '/');
    }
  });
});

describe('questions — pillar filter', () => {
  it('shows the correct subset and tracks aria-pressed + the live count', async () => {
    const user = userEvent.setup();
    render(<QuestionsExperience />);

    const all = screen.getByRole('button', { name: 'All' });
    const courage = screen.getByRole('button', { name: 'COURAGE' });
    const consistency = screen.getByRole('button', { name: 'CONSISTENCY' });

    expect(all).toHaveAttribute('aria-pressed', 'true');
    expect(triggers()).toHaveLength(10);

    await user.click(courage);
    expect(courage).toHaveAttribute('aria-pressed', 'true');
    expect(all).toHaveAttribute('aria-pressed', 'false');
    expect(triggers()).toHaveLength(2); // 01 + 06
    expect(screen.getByRole('status')).toHaveTextContent('2 questions shown');

    await user.click(consistency);
    expect(triggers()).toHaveLength(1); // 07 only
    expect(screen.getByRole('status')).toHaveTextContent('1 question shown');
  });

  it('filtering closes any open question', async () => {
    const user = userEvent.setup();
    render(<QuestionsExperience />);
    const t = triggers();

    await user.click(t[0]!); // open q-01 (COURAGE)
    expect(t[0]).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: 'EMPATHY' }));
    // q-01 is no longer in the subset; none of the visible questions is open.
    expect(triggers().some((b) => b.getAttribute('aria-expanded') === 'true')).toBe(false);
  });
});

describe('questions — content integrity', () => {
  it('never renders the internal "Build note" text', () => {
    const { container } = render(<QuestionsPage />);
    expect(container.textContent).not.toContain('Build note');
  });

  it('renders every question and all 50 steps verbatim from questions.ts', () => {
    render(<QuestionsPage />);

    for (const q of questions) {
      expect(screen.getByText(q.question)).toBeInTheDocument();
      for (const step of q.steps) {
        expect(screen.getByText(step)).toBeInTheDocument();
      }
    }
    expect(screen.getAllByText(stepsLabel)).toHaveLength(10);
    expect(screen.getByText(closingLine)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: closingCta })).toBeInTheDocument();
  });
});
