'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui';

interface InteractiveFormProps {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string; message?: string }>;
  successMessage?: string;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function InteractiveForm({
  action,
  successMessage = 'Changes saved successfully!',
  submitLabel = 'Save Changes',
  children,
  className,
}: InteractiveFormProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await action(formData);
      if (res?.error) {
        showToast({
          type: 'error',
          title: 'Error',
          message: res.error,
        });
      } else {
        showToast({
          type: 'success',
          title: 'Success',
          message: res?.message || successMessage,
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={loading}
          className="btn-press"
        >
          💾 {submitLabel}
        </Button>
      </div>
    </form>
  );
}
