import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from '@/app/[locale]/about/page';
import { about } from '@/data/about';
import { proofPoints } from '@/data/home';

describe('about page', () => {
  it('renders the portrait image and reuses the three proof points', async () => {
    // AboutPage is an async server component; await it to get the element tree.
    render(await AboutPage());
    const img = document.querySelector<HTMLImageElement>(`img[src="${about.portrait}"]`);
    expect(img, 'portrait image should be rendered').not.toBeNull();
    expect(img!.alt).toBeTruthy();
    for (const point of proofPoints) {
      expect(screen.getByText(point.value)).toBeInTheDocument();
    }
  });

  it('ends with a CTA to /book', async () => {
    render(await AboutPage());
    expect(screen.getByRole('link', { name: about.ctaLabel })).toHaveAttribute('href', '/book');
  });
});
