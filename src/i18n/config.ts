import en from './en.json';
import ar from './ar.json';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

// English is the source of truth for the key shape; Arabic mirrors it.
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ar: ar as Dictionary,
};

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'ar';
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export function dirFor(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export type TranslateVars = Record<string, string | number>;

/**
 * Resolves a dotted key (e.g. `"bookings.showing"`) against a dictionary and
 * interpolates `{var}` placeholders. Falls back to the raw key when a string is
 * missing, which makes any untranslated key obvious rather than silently blank.
 */
export function createTranslator(dict: Dictionary) {
  return function t(key: string, vars?: TranslateVars): string {
    let node: unknown = dict;
    for (const part of key.split('.')) {
      if (node && typeof node === 'object' && part in (node as Record<string, unknown>)) {
        node = (node as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    if (typeof node !== 'string') return key;
    if (!vars) return node;
    return node.replace(/\{(\w+)\}/g, (_, name: string) =>
      name in vars ? String(vars[name]) : `{${name}}`,
    );
  };
}

export type Translator = ReturnType<typeof createTranslator>;
