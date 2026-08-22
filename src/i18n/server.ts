import 'server-only';
import { getSession } from '@/lib/auth';
import {
  createTranslator,
  dirFor,
  getDictionary,
  type Locale,
  type Translator,
} from './config';

export interface ServerI18n {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: Translator;
}

/**
 * Resolves the interface language for the current request from the logged-in
 * user's saved locale. Used by admin/coach server components. The public site
 * never calls this — it stays English/LTR regardless of who is logged in.
 */
export async function getI18n(): Promise<ServerI18n> {
  const session = await getSession();
  const locale: Locale = session?.locale === 'ar' ? 'ar' : 'en';
  return { locale, dir: dirFor(locale), t: createTranslator(getDictionary(locale)) };
}
