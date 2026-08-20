import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Footer } from './footer';

// vitest hoists vi.mock above the imports, so Footer receives this site config.
// LinkedIn/Instagram/YouTube are configured (arbitrary test URLs); contactEmail
// is left unset so its [PENDING: ...] fallback path is exercised in the same render.
vi.mock('@/data/site', () => ({
  site: {
    name: 'KYNDER',
    tagline: 'Test tagline',
    copyright: '© Test copyright',
    contactEmail: '[PENDING: contact email]',
    social: {
      linkedin: 'https://example.com/linkedin',
      instagram: 'https://example.com/instagram',
      youtube: 'https://example.com/youtube',
    },
    schedulerBaseUrl: '[PENDING: scheduler base url]',
    newsletterEndpoint: '[PENDING: newsletter endpoint]',
  },
}));

describe('Footer', () => {
  it('renders every configured social as an external link', () => {
    render(<Footer />);
    for (const name of ['LinkedIn', 'Instagram', 'YouTube']) {
      const link = screen.getByRole('link', { name });
      expect(link.getAttribute('href')).toMatch(/^https:\/\//);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('renders the [PENDING: ...] fallback as text, not a link', () => {
    render(<Footer />);
    expect(screen.getByText('[PENDING: contact email]')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '[PENDING: contact email]' })).toBeNull();
  });

  it('reads tagline and copyright from site.ts', () => {
    render(<Footer />);
    expect(screen.getByText('Test tagline')).toBeInTheDocument();
    expect(screen.getByText('© Test copyright')).toBeInTheDocument();
  });
});
