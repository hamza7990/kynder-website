'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Newsletter sign-up (email only). Submission is wired in Phase 11 — for now the
 * form prevents its default and does nothing.
 */
export function NewsletterForm() {
  const id = useId();

  return (
    <form
      aria-label="Newsletter sign-up"
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-3"
    >
      <label htmlFor={id} className="font-sans text-small font-medium text-cream">
        Email address
      </label>
      <div className="flex flex-col gap-2 xs:flex-row">
        <Input
          id={id}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="flex-1"
        />
        <Button type="submit">Sign up</Button>
      </div>
    </form>
  );
}
