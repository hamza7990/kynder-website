'use client';

import { useState } from 'react';
import { Button, Field, Input } from '@/components/ui';
import { loginAction } from '@/lib/actions/auth';

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch {
      // If redirect was called on server, it will throw a NEXT_REDIRECT error which is normal
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-small text-red-700">
          {error}
        </div>
      )}

      <Field label="Email Address" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@kynder.coach"
          className="bg-cream"
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="bg-cream"
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={loading}
        className="w-full"
      >
        Sign In
      </Button>
    </form>
  );
}
