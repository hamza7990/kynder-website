import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './card';

describe('Card', () => {
  it('renders children inside a div', () => {
    render(<Card>Body</Card>);
    const el = screen.getByText('Body');
    expect(el.tagName).toBe('DIV');
  });

  it('uses cream-card surface and elevation 1 by default (never white)', () => {
    render(<Card>Default</Card>);
    const el = screen.getByText('Default');
    expect(el).toHaveClass('bg-cream-card', 'shadow-1');
  });

  it('applies surface, elevation and padding props', () => {
    render(
      <Card surface="cream" elevation={3} padding="lg" bordered>
        Custom
      </Card>,
    );
    const el = screen.getByText('Custom');
    expect(el).toHaveClass('bg-cream', 'shadow-3', 'p-8', 'border');
  });

  it('forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
