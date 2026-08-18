import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './header';
import { allNavItems, nav } from '@/data/nav';

describe('Header', () => {
  it('renders every phase-1 nav item from nav.ts', () => {
    render(<Header />);
    for (const item of nav) {
      expect(screen.getAllByRole('link', { name: item.label }).length).toBeGreaterThan(0);
    }
  });

  it('does not render gated phase-2 routes while phase2Enabled is false', () => {
    render(<Header />);
    for (const item of allNavItems.filter((i) => i.phase === 2)) {
      expect(screen.queryByText(item.label)).toBeNull();
    }
  });
});
