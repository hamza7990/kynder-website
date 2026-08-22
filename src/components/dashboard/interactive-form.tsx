'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui';
import { useT } from '@/i18n/client';

interface InteractiveFormProps {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: string; message?: string }>;
  successMessage?: string;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function InteractiveForm({
  action,
  successMessage,
  submitLabel,
  children,
  className,
}: InteractiveFormProps) {
  const { showToast } = useToast();
  const t = useT();
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
          title: t('toast.error'),
          message: res.error,
        });
      } else {
        showToast({
          type: 'success',
          title: t('toast.success'),
          message: res?.message || successMessage || t('toast.changesSaved'),
        });
      }
    } catch {
      showToast({
        type: 'error',
        title: t('toast.error'),
        message: t('toast.somethingWrong'),
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
          💾 {submitLabel || t('common.saveChanges')}
        </Button>
      </div>
    </form>
  );
}
