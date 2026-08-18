/**
 * Punctuation guard — the REAL defence against the copy being silently
 * "smartened". As previously noted, Prettier is not the threat (it does not
 * rewrite characters inside string content); this test is the actual guard.
 *
 * It walks the TypeScript AST of each src/data source file and inspects only
 * STRING LITERALS — comments are deliberately ignored, so prose in a JSDoc block
 * (e.g. an en dash used to describe a range) does not trip the guard. What must
 * stay ASCII is the delivered copy, and that lives in string literals.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_FILES = ['questions.ts', 'topics.ts', 'nav.ts', 'site.ts'];

const FORBIDDEN: Record<string, string> = {
  '’': 'U+2019 RIGHT SINGLE QUOTATION MARK (curly apostrophe)',
  '“': 'U+201C LEFT DOUBLE QUOTATION MARK (curly open quote)',
  '”': 'U+201D RIGHT DOUBLE QUOTATION MARK (curly close quote)',
  '–': 'U+2013 EN DASH',
};

function stringLiteralsOf(file: string): { text: string; line: number }[] {
  const source = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const found: { text: string; line: number }[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node)
    ) {
      const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
      found.push({ text: (node as ts.LiteralLikeNode).text, line });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

describe('src/data copy contains no typographic punctuation', () => {
  it.each(SOURCE_FILES)('%s string literals are plain ASCII', (name) => {
    const file = join(DATA_DIR, name);
    const offenders: string[] = [];
    for (const { text, line } of stringLiteralsOf(file)) {
      for (const [ch, label] of Object.entries(FORBIDDEN)) {
        if (text.includes(ch)) {
          offenders.push(`  line ${line}: ${label} in ${JSON.stringify(text)}`);
        }
      }
    }
    expect(
      offenders,
      `\nTHE COPY IN ${name} HAS BEEN ALTERED — NOT MERELY REFORMATTED.\n` +
        `A typographic character was substituted for the plain ASCII the brief requires\n` +
        `(straight apostrophe ', straight double quote ", hyphen/ASCII dash).\n` +
        `REVERT the character to its ASCII original. Do NOT treat this as a formatting change.\n` +
        offenders.join('\n'),
    ).toEqual([]);
  });
});
