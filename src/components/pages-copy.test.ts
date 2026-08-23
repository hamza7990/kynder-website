import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as topics from '@/data/topics';
import { about } from '@/data/about';
import { book } from '@/data/book';
import { contact } from '@/data/contact';
import { proofPoints } from '@/data/home';

/** All string values reachable from a value (functions/types ignored). */
function collect(value: unknown, out: string[]): void {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collect(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collect(v, out));
}

const copy: string[] = [];
collect({ ...topics, topicLine: undefined }, copy);
collect(book, copy);
collect(about, copy);
collect(contact, copy);
collect(proofPoints, copy);

const DIRS = [
  'src/components/topics',
  'src/components/book',
  'src/components/contact',
  // Public route pages moved under [locale]/ in A2 Slice 2.
  'src/app/[locale]/topics',
  'src/app/[locale]/book',
  'src/app/[locale]/about',
  'src/app/[locale]/contact',
];

function readComponents(dir: string): string {
  const abs = join(process.cwd(), dir);
  let out = '';
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) out += readComponents(join(dir, entry.name));
    else if (entry.name.endsWith('.tsx') && !entry.name.endsWith('.test.tsx')) {
      out += readFileSync(join(abs, entry.name), 'utf8') + '\n';
    }
  }
  return out;
}

const source = DIRS.map(readComponents).join('\n');

describe('pages 8/10/11 — copy comes only from src/data', () => {
  it('inlines no data copy string in any component or page', () => {
    // Inlined copy would appear as a quoted string literal or JSX text — not as a
    // substring of an identifier (e.g. "Contact" inside ContactForm), so match the
    // delimited forms only.
    const inlined = (s: string) =>
      source.includes(`"${s}"`) || source.includes(`'${s}'`) || source.includes(`>${s}<`);
    const leaked = [...new Set(copy)].filter((s) => s.length > 4 && inlined(s));
    expect(leaked, `copy inlined in components:\n${leaked.join('\n')}`).toEqual([]);
  });
});
