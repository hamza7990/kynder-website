import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

let mockSearch = '';
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

import BookPage from '@/app/book/page';
import BookingConfirmedPage from '@/app/book/confirmed/page';
import { book } from '@/data/book';
import { topics } from '@/data/topics';

afterEach(() => {
  mockSearch = '';
});

describe('book page', () => {
  it('renders the not-connected placeholder (scheduler env unset), not a calendar', () => {
    mockSearch = `topic=${topics[0]!.slug}`;
    render(<BookPage />);
    expect(screen.getByText(book.scheduler.notConnectedTitle)).toBeInTheDocument();
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
    expect(screen.getByRole('link', { name: book.noTopic.cta })).toHaveAttribute('href', '/topics');
  });

  it('shows a clear choose-a-topic state when ?topic= is missing', () => {
    mockSearch = '';
    render(<BookPage />);
    expect(screen.getByText(book.noTopic.title)).toBeInTheDocument();
  });
});

describe('booking confirmed page', () => {
  it('links back to /questions and has no href="#"', () => {
    const { container } = render(<BookingConfirmedPage />);
    expect(screen.getByRole('link', { name: book.confirmed.cta })).toHaveAttribute('href', '/questions');
    expect(container.querySelector('a[href="#"]')).toBeNull();
  });
});
