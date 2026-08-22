'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { useT } from '@/i18n/client';
import { Button } from '@/components/ui';
import { updateLocaleAction } from '@/lib/actions/auth';
import type { Locale } from '@/i18n/config';

/**
 * Per-admin interface-language control. Writes the choice to the user record
 * (via updateLocaleAction) so it follows the account across devices/sessions,
 * then refreshes so the dashboard re-renders in the new language and direction.
 */
export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const t = useT();
  const router = useRouter();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<Locale>(currentLocale);
  const [isPending, startTransition] = useTransition();

  const save = () => {
    startTransition(async () => {
      const res = await updateLocaleAction(selected);
      if (res.error) {
        showToast({ type: 'error', title: t('toast.error'), message: res.error });
        return;
      }
      showToast({ type: 'success', title: t('toast.success'), message: t('profile.languageSaved') });
      // Re-run the server layout so it reads the new locale cookie and applies
      // dir/lang + the Arabic font across the dashboard.
      router.refresh();
    });
  };

  return (
    <div className="rounded-2xl border border-ink-10 bg-cream-card p-8 shadow-1 space-y-6">
      <div>
        <h2 className="border-b border-ink-10 pb-3 font-display text-h3 font-bold text-navy-deep">
          {t('profile.languageHeading')}
        </h2>
        <p className="mt-3 text-small text-ink-70">{t('profile.languageDescription')}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="block flex-1">
          <span className="mb-1 block font-sans text-small font-semibold uppercase tracking-eyebrow text-ink-70">
            {t('profile.languageLabel')}
          </span>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value === 'ar' ? 'ar' : 'en')}
            className="w-full rounded-lg border border-ink-20 bg-cream p-3 text-body text-navy-deep focus:outline-none focus:ring-1 focus:ring-terracotta"
          >
            <option value="en">{t('profile.english')}</option>
            <option value="ar">{t('profile.arabic')}</option>
          </select>
        </label>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={save}
          isLoading={isPending}
          disabled={selected === currentLocale || isPending}
        >
          {t('profile.saveLanguage')}
        </Button>
      </div>
    </div>
  );
}
