import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NewsletterForm } from './newsletter-form';

describe('NewsletterForm', () => {
  it('associates the label with the email input', () => {
    render(<NewsletterForm />);
    const input = screen.getByLabelText('Email address');
    expect(input).toHaveAttribute('type', 'email');
    expect(input.tagName).toBe('INPUT');
  });

  it('prevents the default form submission', () => {
    render(<NewsletterForm />);
    const form = screen.getByRole('form', { name: /newsletter/i });
    const submit = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submit);
    expect(submit.defaultPrevented).toBe(true);
  });
});
