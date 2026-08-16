import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from './section-header';

describe('SectionHeader', () => {
  it('renders eyebrow, title (as h2) and lead', () => {
    render(<SectionHeader eyebrow="How it works" title="A better path" lead="Some lead copy." />);
    expect(screen.getByText('How it works')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 2, name: 'A better path' });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText('Some lead copy.')).toBeInTheDocument();
  });

  it('omits eyebrow and lead when not provided', () => {
    render(<SectionHeader title="Just a title" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.queryByText('How it works')).not.toBeInTheDocument();
  });

  it('renders the title at the requested heading level', () => {
    render(<SectionHeader as="h3" title="Third level" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Third level' })).toBeInTheDocument();
  });

  it('applies dark-tone text colour', () => {
    render(<SectionHeader tone="dark" title="On dark" />);
    expect(screen.getByRole('heading', { name: 'On dark' })).toHaveClass('text-cream');
  });
});
