import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Leadership</Badge>);
    expect(screen.getByText('Leadership')).toBeInTheDocument();
  });

  it('renders a <span>', () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText('Tag').tagName).toBe('SPAN');
  });

  it('applies the variant class', () => {
    render(<Badge variant="gold">Strategy</Badge>);
    expect(screen.getByText('Strategy')).toHaveClass('bg-gold-soft');
  });

  it('merges a custom className', () => {
    render(<Badge className="custom-x">Culture</Badge>);
    expect(screen.getByText('Culture')).toHaveClass('custom-x');
  });
});
