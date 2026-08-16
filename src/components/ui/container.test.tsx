import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from './container';

describe('Container', () => {
  it('renders a div by default with the container class', () => {
    render(<Container>content</Container>);
    const el = screen.getByText('content');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('container-kynder');
  });

  it('renders a custom element via the `as` prop', () => {
    render(<Container as="section">section content</Container>);
    const el = screen.getByText('section content');
    expect(el.tagName).toBe('SECTION');
  });

  it('merges a custom className', () => {
    render(<Container className="extra">x</Container>);
    expect(screen.getByText('x')).toHaveClass('container-kynder', 'extra');
  });
});
