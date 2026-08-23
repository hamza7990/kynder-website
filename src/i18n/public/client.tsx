'use client';

import { createContext, useContext, useMemo } from 'react';
import {
  createPublicTranslator,
  type PublicDictionary,
  type PublicTranslator,
} from './config';
import en from './en.json';

/**
 * Public i18n context. Defaults to the English dictionary so components rendered
 * OUTSIDE a provider (e.g. in isolated unit tests) still show English rather than
 * raw keys. The provider (set from the resolved URL locale in AppShell) overrides
 * it with the active locale's dictionary.
 */
const PublicI18nContext = createContext<PublicDictionary>(en);

export function PublicI18nProvider({
  dict,
  children,
}: {
  dict: PublicDictionary;
  children: React.ReactNode;
}) {
  return <PublicI18nContext.Provider value={dict}>{children}</PublicI18nContext.Provider>;
}

/** Client translator hook for public components. */
export function usePublicT(): PublicTranslator {
  const dict = useContext(PublicI18nContext);
  return useMemo(() => createPublicTranslator(dict), [dict]);
}
