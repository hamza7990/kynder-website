import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkipLink } from './skip-link';

describe('SkipLink', () => {
  it('is a link that targets #main', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: /skip to content/i });
    expect(link).toHaveAttribute('href', '#main');
  });

  it('is the first focusable element in page order and is focusable', () => {
    // Mirror the layout ordering: skip link first, then other focusables + main.
    render(
      <div>
        <SkipLink />
        <a href="/elsewhere">Elsewhere</a>
        <main id="main" tabIndex={-1}>
          content
        </main>
      </div>,
    );
    const link = screen.getByRole('link', { name: /skip to content/i });
    const focusables = Array.from(document.querySelectorAll<HTMLElement>('a[href], [tabindex]'));
    expect(focusables[0]).toBe(link);

    link.focus();
    expect(document.activeElement).toBe(link);

    // The target is programmatically focusable (tabIndex=-1); the browser moving
    // real focus to it on activation is asserted end-to-end in layout.spec.ts.
    expect(document.getElementById('main')).toHaveAttribute('tabindex', '-1');
  });
});
