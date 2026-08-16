import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from './field';
import { Input } from './input';
import { Textarea } from './textarea';

describe('Field + Input', () => {
  it('associates the label with the control', () => {
    render(
      <Field label="Full name">
        <Input placeholder="Jane" />
      </Field>,
    );
    // getByLabelText resolves only when label/for wiring is correct.
    expect(screen.getByLabelText('Full name')).toBe(screen.getByPlaceholderText('Jane'));
  });

  it('renders a hint and wires aria-describedby', () => {
    render(
      <Field label="Email" hint="We never share it.">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    const hint = screen.getByText('We never share it.');
    expect(input.getAttribute('aria-describedby')).toContain(hint.id);
  });

  it('marks the control invalid and describes the error when error is set', () => {
    render(
      <Field label="Email" error="Invalid email.">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const error = screen.getByText('Invalid email.');
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
  });
});

describe('Input / Textarea', () => {
  it('Input renders an <input>', () => {
    render(<Input aria-label="bare" />);
    expect(screen.getByLabelText('bare').tagName).toBe('INPUT');
  });

  it('Textarea renders a <textarea> and wires the Field', () => {
    render(
      <Field label="Message">
        <Textarea />
      </Field>,
    );
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA');
  });
});
