'use client';

import { useRef, useState } from 'react';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { contact } from '@/data/contact';
import { isBlank, isValidEmail } from '@/lib/validation';
import { track } from '@/lib/analytics';
import { submitContactMessage } from '@/lib/actions/contact';

type FieldName = 'name' | 'email' | 'message';
type Errors = Partial<Record<FieldName, string>>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const ORDER: FieldName[] = ['name', 'email', 'message'];

export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const honeypotRef = useRef<HTMLInputElement>(null);

  const set = (key: FieldName, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const validate = (): Errors => {
    const next: Errors = {};
    if (isBlank(values.name)) next.name = contact.form.errors.nameRequired;
    if (isBlank(values.email)) next.email = contact.form.errors.emailRequired;
    else if (!isValidEmail(values.email)) next.email = contact.form.errors.emailInvalid;
    if (isBlank(values.message)) next.message = contact.form.errors.messageRequired;
    return next;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      const firstInvalid = ORDER.find((key) => found[key]);
      if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    // Honeypot filled → treat as spam, drop silently (no send, no success shown).
    if (honeypotRef.current?.value) {
      setStatus('idle');
      return;
    }
    setStatus('submitting');
    try {
      // Saves to the database via a server action. Success is shown ONLY when the
      // record was actually written — a failed save reports an error, never "sent".
      const res = await submitContactMessage(values);
      if (res.success) {
        setStatus('success');
        track('contact_submitted');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const statusMessage =
    status === 'success'
      ? contact.form.success
      : status === 'error'
        ? contact.form.genericError
        : '';

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      noValidate
      aria-label={contact.heading}
      className="flex flex-col gap-6"
    >
      <Field label={contact.form.nameLabel} htmlFor="contact-name" error={errors.name}>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => set('name', event.target.value)}
        />
      </Field>

      <Field label={contact.form.emailLabel} htmlFor="contact-email" error={errors.email}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => set('email', event.target.value)}
        />
      </Field>

      <Field label={contact.form.messageLabel} htmlFor="contact-message" error={errors.message}>
        <Textarea
          id="contact-message"
          name="message"
          autoComplete="off"
          value={values.message}
          onChange={(event) => set('message', event.target.value)}
        />
      </Field>

      {/* Honeypot: off-screen + aria-hidden so only bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input ref={honeypotRef} type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" isLoading={status === 'submitting'} className="self-start">
        {status === 'submitting' ? contact.form.submittingLabel : contact.form.submitLabel}
      </Button>

      <p role="status" aria-live="polite" className="min-h-[1.5rem] text-body font-medium text-navy-deep">
        {statusMessage}
      </p>
    </form>
  );
}
