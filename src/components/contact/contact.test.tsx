import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactForm } from './contact-form';
import { contact } from '@/data/contact';
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

    await user.click(screen.getByRole('button', { name: contact.form.submitLabel }));

    expect(screen.getByText(contact.form.errors.nameRequired)).toBeInTheDocument();
    expect(screen.getByText(contact.form.errors.emailRequired)).toBeInTheDocument();
    expect(screen.getByText(contact.form.errors.messageRequired)).toBeInTheDocument();

    const name = screen.getByLabelText(contact.form.nameLabel);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    const email = screen.getByLabelText(contact.form.emailLabel);
    expect(email.getAttribute('aria-describedby')).toContain('contact-email-error');
  });

  it('invalid email produces the specific invalid-email message', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(contact.form.nameLabel), 'Ada');
    await user.type(screen.getByLabelText(contact.form.emailLabel), 'not-an-email');
    await user.type(screen.getByLabelText(contact.form.messageLabel), 'Hello there');
    await user.click(screen.getByRole('button', { name: contact.form.submitLabel }));

    expect(screen.getByText(contact.form.errors.emailInvalid)).toBeInTheDocument();
  });

  it('a submission that fails to save reports an error, never success', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(contact.form.nameLabel), 'Ada');
    await user.type(screen.getByLabelText(contact.form.emailLabel), 'ada@example.com');
    await user.type(screen.getByLabelText(contact.form.messageLabel), 'Hello there');
    await user.click(screen.getByRole('button', { name: contact.form.submitLabel }));

    // The server action was called (attempted to save)...
    expect(submitContactMessage).toHaveBeenCalledOnce();
    // ...and since it failed, the user sees an error and NEVER a false success.
    expect(await screen.findByText(contact.form.genericError)).toBeInTheDocument();
    expect(screen.queryByText(contact.form.success)).toBeNull();
  });
});
