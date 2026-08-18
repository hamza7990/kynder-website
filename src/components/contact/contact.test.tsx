import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactForm } from './contact-form';
import { contact } from '@/data/contact';

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

  it('valid submit with an unset endpoint reports not-connected, never success', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(contact.form.nameLabel), 'Ada');
    await user.type(screen.getByLabelText(contact.form.emailLabel), 'ada@example.com');
    await user.type(screen.getByLabelText(contact.form.messageLabel), 'Hello there');
    await user.click(screen.getByRole('button', { name: contact.form.submitLabel }));

    expect(await screen.findByText(contact.form.notConnected)).toBeInTheDocument();
    expect(screen.queryByText(contact.form.success)).toBeNull();
  });
});
