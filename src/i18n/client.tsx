'use client';

import { createContext, useContext, useMemo } from 'react';
import {
  createTranslator,
  dirFor,
  getDictionary,
  type Locale,
  type Translator,
} from './config';

interface I18nValue {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: Translator;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Makes the active interface language available to client components inside the
 * dashboard. The locale comes from the logged-in user's record (resolved by the
 * server layout); both dictionaries are bundled so switching is instant.
 */
export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(
    () => ({ locale, dir: dirFor(locale), t: createTranslator(getDictionary(locale)) }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}

export function useT(): Translator {
  return useI18n().t;
}
