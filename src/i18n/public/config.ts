import type { Locale } from '@/i18n/config';
import en from './en.json';
import ar from './ar.json';

/**
 * PUBLIC-site interface dictionary (Workstream A / A2). Deliberately SEPARATE from
 * the admin dictionary (`src/i18n/en.json`): different audience, different register.
 * The dashboard is a tool; the public site is the brand.
 *
 * A2 scope: interface CHROME only (buttons, menu/aria, footer headings, form
 * labels/validation, empty/error microcopy). Client marketing copy — hero,
 * positioning, the questions, topic blurbs, page headings — stays English and is
 * translated in A3 after owner sign-off. Arabic values here are DRAFT pending the
 * owner's review (he is the sole Arabic reviewer). Numbers/dates stay Western via
 * src/lib/format.ts.
 *
 * English is the source of truth for the key shape; Arabic mirrors it. The English
 * strings are copied verbatim from the components they replace — do not reword.
 */
export type PublicDictionary = typeof en;

const dictionaries: Record<Locale, PublicDictionary> = { en, ar };

export function getPublicDictionary(locale: Locale): PublicDictionary {
  return dictionaries[locale] ?? en;
}

export type PublicTranslateVars = Record<string, string | number>;

/**
 * Resolve a dotted key against a public dictionary and interpolate `{var}`
 * placeholders. Falls back to the raw key when a string is missing, so an
 * untranslated key is obvious rather than silently blank. (Same pattern as the
 * admin translator, replicated here to keep the public i18n fully independent.)
 */
export function createPublicTranslator(dict: PublicDictionary) {
  return function t(key: string, vars?: PublicTranslateVars): string {
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

export type PublicTranslator = ReturnType<typeof createPublicTranslator>;
