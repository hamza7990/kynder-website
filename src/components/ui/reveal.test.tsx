import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reveal } from './reveal';

// jsdom provides no IntersectionObserver, so Reveal falls back to showing
// content immediately — which is exactly the reduced-motion / no-JS behaviour.
describe('Reveal', () => {
  it('renders its children', () => {
    render(<Reveal>revealed content</Reveal>);
    expect(screen.getByText('revealed content')).toBeInTheDocument();
  });

  it('becomes visible when IntersectionObserver is unavailable', () => {
    render(<Reveal>visible</Reveal>);
    expect(screen.getByText('visible')).toHaveAttribute('data-reveal', 'visible');
  });

  it('renders a custom element via the `as` prop', () => {
    render(<Reveal as="section">section</Reveal>);
    expect(screen.getByText('section').tagName).toBe('SECTION');
  });
});
