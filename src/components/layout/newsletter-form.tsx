'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { track } from '@/lib/analytics';
import { isValidEmail } from '@/lib/validation';
import { usePublicT } from '@/i18n/public/client';
import { site } from '@/data/site';

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'notConnected' | 'invalid';

const isPending = (value: string) => value.startsWith('[PENDING');

/**
 * Newsletter sign-up (email only). Posts to NEWSLETTER_ENDPOINT when set and
 * fires `newsletter_submitted` only on a genuinely accepted submission. While the
 * endpoint is unset it reports honestly as not connected — never a false success.
 */
export function NewsletterForm() {
  const t = usePublicT();
  const id = useId();
  const errorId = `${id}-status`;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('invalid');
      return;
    }
    if (isPending(site.newsletterEndpoint)) {
      setStatus('notConnected');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch(site.newsletterEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) track('newsletter_submitted');
    } catch {
      setStatus('error');
    }
  };

  const message =
    status === 'invalid'
      ? t('newsletter.invalidEmail')
      : status === 'notConnected'
        ? t('newsletter.notConnected')
        : status === 'success'
          ? t('newsletter.success')
          : status === 'error'
            ? t('newsletter.error')
            : '';

  return (
    <form
      aria-label="Newsletter sign-up"
      onSubmit={(event) => void onSubmit(event)}
      noValidate
      className="flex flex-col gap-3"
    >
      <label htmlFor={id} className="font-sans text-small font-medium text-cream">
        {t('newsletter.emailLabel')}
      </label>
      <div className="flex flex-col gap-2 xs:flex-row">
        <Input
          id={id}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t('newsletter.placeholder')}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status === 'invalid' || undefined}
          aria-describedby={message ? errorId : undefined}
          className="flex-1"
        />
        <Button type="submit" isLoading={status === 'submitting'}>
          {status === 'submitting' ? t('newsletter.submittingLabel') : t('newsletter.submitLabel')}
        </Button>
      </div>
      <p id={errorId} role="status" aria-live="polite" className="min-h-[1.25rem] text-small text-cream">
        {message}
      </p>
    </form>
  );
}
