import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MobileNav } from './mobile-nav';

const PANEL_FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

describe('MobileNav', () => {
  it('flips aria-expanded on the trigger when toggled', () => {
    render(<MobileNav />);
    const trigger = screen.getByRole('button', { name: /open menu/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(<MobileNav />);
    const trigger = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.activeElement).toBe(trigger);
  });

  it('locks body scroll while open and restores it on close', () => {
    render(<MobileNav />);
    const trigger = screen.getByRole('button', { name: /open menu/i });
    expect(document.body.style.overflow).toBe('');

    fireEvent.click(trigger);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.body.style.overflow).toBe('');
  });

  it('traps Tab focus in both directions inside the drawer', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const dialog = screen.getByRole('dialog');
    const items = Array.from(dialog.querySelectorAll<HTMLElement>(PANEL_FOCUSABLE));
    expect(items.length).toBeGreaterThan(1);
    const first = items[0]!;
    const last = items[items.length - 1]!;

    // Tab off the last element wraps to the first.
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    // Shift+Tab off the first element wraps to the last.
    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
