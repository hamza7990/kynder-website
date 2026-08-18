import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Reveal } from './reveal';

function stubReducedMotion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

describe('Reveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders in the visible final state under reduced motion', () => {
    stubReducedMotion(true);
    render(<Reveal>content</Reveal>);
    const el = screen.getByText('content');
    expect(el).toHaveAttribute('data-reveal', 'visible');
    // Reduced-motion classes guarantee opacity 1 / no offset even pre-hydration.
    expect(el).toHaveClass('motion-reduce:opacity-100', 'motion-reduce:translate-y-0');
  });

  it('renders its children and supports a custom element', () => {
    stubReducedMotion(false);
    render(<Reveal as="section">section body</Reveal>);
    expect(screen.getByText('section body').tagName).toBe('SECTION');
  });
});
