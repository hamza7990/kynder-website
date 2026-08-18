import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from '@/app/about/page';
import { about } from '@/data/about';
import { proofPoints } from '@/data/home';

describe('about page', () => {
  it('renders the PENDING portrait placeholder and reuses the three proof points', () => {
    render(<AboutPage />);
    expect(screen.getByText(about.portrait)).toBeInTheDocument();
    for (const point of proofPoints) {
      expect(screen.getByText(point.value)).toBeInTheDocument();
    }
  });

  it('ends with a CTA to /book', () => {
    render(<AboutPage />);
    expect(screen.getByRole('link', { name: about.ctaLabel })).toHaveAttribute('href', '/book');
  });
});
