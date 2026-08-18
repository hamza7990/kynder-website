'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { pillars, questions } from '@/data/questions';
import { PillarFilter, type PillarFilterValue } from './pillar-filter';
import { QuestionItem } from './question-item';

const HASH_RE = /^#q-(\d{2})$/;

/**
 * The interactive Leadership Questions experience: a single-open accordion with a
 * pillar filter, deep-link (#q-NN) open + scroll, hash sync without history spam,
 * and roving keyboard navigation. All copy comes from questions.ts.
 */
export function QuestionsExperience() {
  const [openNo, setOpenNo] = useState<string | null>(null);
  const [filter, setFilter] = useState<PillarFilterValue>('ALL');
  const listRef = useRef<HTMLDivElement>(null);

  const visible = filter === 'ALL' ? questions : questions.filter((q) => q.pillar === filter);

  const scrollToQuestion = useCallback((no: string) => {
    requestAnimationFrame(() => {
      document.getElementById(`q-${no}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }, []);

  // Deep link: open + scroll to #q-NN on mount and whenever the hash changes.
  useEffect(() => {
    const applyHash = () => {
      const match = HASH_RE.exec(window.location.hash);
      if (!match) return;
      const no = match[1]!;
      if (!questions.some((q) => q.no === no)) return;
      setFilter('ALL'); // the target must be present regardless of any active filter
      setOpenNo(no);
      scrollToQuestion(no);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [scrollToQuestion]);

  // Replace (never push) so Back leaves the page instead of stepping through states.
  const setHash = (fragment: string | null) => {
    const base = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', fragment ? `${base}#${fragment}` : base);
  };

  const toggle = (no: string) => {
    setOpenNo((prev) => {
      const next = prev === no ? null : no;
      setHash(next ? `q-${no}` : null);
      return next;
    });
  };

  const changeFilter = (next: PillarFilterValue) => {
    setFilter(next);
    setOpenNo(null); // filtering never leaves an orphan question open
    setHash(null);
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const root = listRef.current;
    if (!root) return;
    const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-q-trigger]'));
    const index = triggers.indexOf(event.currentTarget);
    if (index === -1) return;
    event.preventDefault();
    const target =
      event.key === 'ArrowDown'
        ? triggers[(index + 1) % triggers.length]
        : event.key === 'ArrowUp'
          ? triggers[(index - 1 + triggers.length) % triggers.length]
          : event.key === 'Home'
            ? triggers[0]
            : triggers[triggers.length - 1];
    target?.focus();
  };

  return (
    <div>
      <PillarFilter pillars={pillars} active={filter} onChange={changeFilter} />

      {/* Result count announced to screen readers when the filter changes. */}
      <p className="sr-only" role="status" aria-live="polite">
        {visible.length === 1 ? '1 question shown' : `${visible.length} questions shown`}
      </p>

      <div ref={listRef} className="mt-10 border-t border-ink-10">
        {visible.length === 0 ? (
          <p className="py-12 text-body text-ink-70">No questions match this filter.</p>
        ) : (
          visible.map((q) => (
            <QuestionItem
              key={q.no}
              question={q}
              open={openNo === q.no}
              onToggle={toggle}
              onTriggerKeyDown={onTriggerKeyDown}
            />
          ))
        )}
      </div>
    </div>
  );
}
