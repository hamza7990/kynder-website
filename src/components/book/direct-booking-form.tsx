'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { usePublicT } from '@/i18n/public/client';
import { createBookingAction } from '@/lib/actions/bookings';

interface DirectBookingFormProps {
  topicSlug: string;
  topicTitle: string;
}

export function DirectBookingForm({ topicSlug, topicTitle }: DirectBookingFormProps) {
  const t = usePublicT();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const clientName = formData.get('clientName')?.toString().trim();
    const clientEmail = formData.get('clientEmail')?.toString().trim();
    const clientPhone = formData.get('clientPhone')?.toString().trim();
    const dateStr = formData.get('date')?.toString();
    const notes = formData.get('notes')?.toString().trim();

    if (!clientName || !clientEmail || !dateStr) {
      setError(t('bookForm.errors.required'));
      setLoading(false);
      return;
    }

    try {
      const res = await createBookingAction({
        clientName,
        clientEmail,
        clientPhone,
        topicSlug,
        topicTitle,
        date: new Date(dateStr),
        notes,
      });

      if (res.success) {
        router.push('/book/confirmed');
      } else {
        setError(t('bookForm.errors.failed'));
      }
    } catch {
      setError(t('bookForm.errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="rounded-xl border border-ink-10 bg-cream-card p-8 shadow-1">
      <div className="mb-6 border-b border-ink-10 pb-4">
        <h3 className="font-display text-h3 font-bold text-navy-deep">
          {t('bookForm.title')}
        </h3>
        <p className="mt-1 text-small text-ink-70">
          {t('bookForm.selectedTopicPrefix')}{' '}
          <span className="font-semibold text-navy-deep">{topicTitle}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-danger-soft bg-danger-soft p-4 text-small text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label={t('bookForm.nameLabel')} htmlFor="clientName">
          <Input
            id="clientName"
            name="clientName"
            required
            placeholder={t('bookForm.namePlaceholder')}
            className="bg-cream"
          />
        </Field>

        <Field label={t('bookForm.emailLabel')} htmlFor="clientEmail">
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            required
            placeholder={t('bookForm.emailPlaceholder')}
            className="bg-cream"
          />
        </Field>

        <Field label={t('bookForm.phoneLabel')} htmlFor="clientPhone">
          <Input
            id="clientPhone"
            name="clientPhone"
            type="tel"
            placeholder={t('bookForm.phonePlaceholder')}
            className="bg-cream"
          />
        </Field>

        <Field label={t('bookForm.dateLabel')} htmlFor="date">
          <Input
            id="date"
            name="date"
            type="datetime-local"
            min={minDate}
            required
            className="bg-cream"
          />
        </Field>

        <Field label={t('bookForm.notesLabel')} htmlFor="notes">
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder={t('bookForm.notesPlaceholder')}
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
          {t('bookForm.submit')}
        </Button>
      </form>
    </div>
  );
}
