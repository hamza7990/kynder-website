import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

let mockSearch = '';
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mockSearch),
  usePathname: () => '/en/book',
  useRouter: () => ({ push: () => {}, replace: () => {}, prefetch: () => {} }),
}));

import BookPage from '@/app/[locale]/book/page';
import BookingConfirmedPage from '@/app/[locale]/book/confirmed/page';
import { book } from '@/data/book';
import { topics } from '@/data/topics';

afterEach(() => {
  mockSearch = '';
});

describe('book page', () => {
  it('mounts the direct booking form (scheduler env unset), not a calendar iframe', () => {
    mockSearch = `topic=${topics[0]!.slug}`;
    render(<BookPage />);
    // With no external scheduler configured, /book shows the built-in booking
    // form that saves to the database — never an embedded third-party calendar.
    expect(screen.getByRole('heading', { name: /request a 1-on-1 session/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm & request session/i })).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('has no "Confirm Booking" control and no href="#"', () => {
    mockSearch = `topic=${topics[0]!.slug}`;
    const { container } = render(<BookPage />);
    expect(container.textContent).not.toContain('Confirm Booking');
    expect(container.querySelector('a[href="#"]')).toBeNull();
  });

  it('shows a clear choose-a-topic state for an invalid topic', () => {
    mockSearch = 'topic=not-a-real-topic';
    render(<BookPage />);
    expect(screen.getByText(book.noTopic.title)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: book.noTopic.cta })).toHaveAttribute('href', '/en/topics');
  });

  it('shows a clear choose-a-topic state when ?topic= is missing', () => {
    mockSearch = '';
    render(<BookPage />);
    expect(screen.getByText(book.noTopic.title)).toBeInTheDocument();
  });
});

describe('booking confirmed page', () => {
  it('links back to /questions and has no href="#"', async () => {
    // BookingConfirmedPage is now an async server component; await its tree.
    const { container } = render(await BookingConfirmedPage());
    expect(screen.getByRole('link', { name: book.confirmed.cta })).toHaveAttribute('href', '/en/questions');
    expect(container.querySelector('a[href="#"]')).toBeNull();
  });
});
