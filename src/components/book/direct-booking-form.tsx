'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, Textarea } from '@/components/ui';
import { createBookingAction } from '@/lib/actions/bookings';

interface DirectBookingFormProps {
  topicSlug: string;
  topicTitle: string;
}

export function DirectBookingForm({ topicSlug, topicTitle }: DirectBookingFormProps) {
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
      setError('Please fill in all required fields.');
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
        setError('Failed to book session. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
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
          Request a 1-on-1 Session
        </h3>
        <p className="mt-1 text-small text-ink-70">
          Selected Topic: <span className="font-semibold text-navy-deep">{topicTitle}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-danger-soft bg-danger-soft p-4 text-small text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Your Full Name" htmlFor="clientName">
          <Input
            id="clientName"
            name="clientName"
            required
            placeholder="e.g. Maya Sterling"
            className="bg-cream"
          />
        </Field>

        <Field label="Email Address" htmlFor="clientEmail">
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            required
            placeholder="maya@company.com"
            className="bg-cream"
          />
        </Field>

        <Field label="Phone / WhatsApp (Optional)" htmlFor="clientPhone">
          <Input
            id="clientPhone"
            name="clientPhone"
            type="tel"
            placeholder="+1 555 123 4567"
            className="bg-cream"
          />
        </Field>

        <Field label="Preferred Date & Time" htmlFor="date">
          <Input
            id="date"
            name="date"
            type="datetime-local"
            min={minDate}
            required
            className="bg-cream"
          />
        </Field>

        <Field label="What would you like to focus on? (Optional)" htmlFor="notes">
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Briefly describe the challenge, conversation, or decision you'd like to explore..."
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
          Confirm & Request Session
        </Button>
      </form>
    </div>
  );
}
