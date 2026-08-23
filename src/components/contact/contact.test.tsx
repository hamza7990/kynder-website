import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from './contact-form';
import en from '@/i18n/public/en.json';
import { submitContactMessage } from '@/lib/actions/contact';

// The contact form now persists via a server action. Mock it so the test can
// drive the failure path deterministically (no database in the test env).
vi.mock('@/lib/actions/contact', () => ({
  submitContactMessage: vi.fn(async () => ({ error: 'Could not send your message right now.' })),
}));

describe('contact form', () => {
  it('empty submit shows inline errors tied to each field via aria', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole('button', { name: en.contactForm.submitLabel }));

    expect(screen.getByText(en.contactForm.errors.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(en.contactForm.errors.emailRequired)).toBeInTheDocument();
    expect(screen.getByText(en.contactForm.errors.messageRequired)).toBeInTheDocument();

    const name = screen.getByLabelText(en.contactForm.nameLabel);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    const email = screen.getByLabelText(en.contactForm.emailLabel);
    expect(email.getAttribute('aria-describedby')).toContain('contact-email-error');
  });

  it('invalid email produces the specific invalid-email message', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(en.contactForm.nameLabel), 'Ada');
    await user.type(screen.getByLabelText(en.contactForm.emailLabel), 'not-an-email');
    await user.type(screen.getByLabelText(en.contactForm.messageLabel), 'Hello there');
    await user.click(screen.getByRole('button', { name: en.contactForm.submitLabel }));

    expect(screen.getByText(en.contactForm.errors.emailInvalid)).toBeInTheDocument();
  });

  it('a submission that fails to save reports an error, never success', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(en.contactForm.nameLabel), 'Ada');
    await user.type(screen.getByLabelText(en.contactForm.emailLabel), 'ada@example.com');
    await user.type(screen.getByLabelText(en.contactForm.messageLabel), 'Hello there');
    await user.click(screen.getByRole('button', { name: en.contactForm.submitLabel }));

    // The server action was called (attempted to save)...
    expect(submitContactMessage).toHaveBeenCalledOnce();
    // ...and since it failed, the user sees an error and NEVER a false success.
    expect(await screen.findByText(en.contactForm.genericError)).toBeInTheDocument();
    expect(screen.queryByText(en.contactForm.success)).toBeNull();
  });
});
