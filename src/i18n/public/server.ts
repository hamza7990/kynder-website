import 'server-only';
import type { Locale } from '@/i18n/config';
import { createPublicTranslator, getPublicDictionary, type PublicTranslator } from './config';

/**
 * Server translator for public server components. Pass the locale from the route
 * `[locale]` param (or the `x-locale` header). Client components use `usePublicT`.
 */
export function getPublicT(locale: Locale): PublicTranslator {
  return createPublicTranslator(getPublicDictionary(locale));
}
