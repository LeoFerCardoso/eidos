// Frame / CodeBlock / TabbedCode code-snippet guard.
//
// The docs render a live demo (the JSX children) next to a hand-written `code`
// string. Nothing ties the two together, so a snippet can drift from the demo
// it claims to show. This is the structural weakness of the no-Storybook setup
// (docs/DS-GAP-ANALYSIS.md §4 / P0.4).
//
// We can't prove a snippet MATCHES its demo statically, but we CAN prove the
// worst drift never ships: a snippet that wouldn't even parse if a user pasted
// it. This walks every migrated page (+ examples) with the TypeScript parser,
// extracts each `code` attribute and its `lang`, and syntax-checks the JS/TSX
// ones. Bash/CSS/JSON/HTML snippets are skipped (not our grammar).
//
// Usage:
//   node scripts/check-frame-code.mjs           # report (exit 0)
//   node scripts/check-frame-code.mjs --strict   # exit 1 if any snippet fails to parse
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');

const ROOTS = ['src/ds/migrated', 'src/ds/examples'];
const STRICT = process.argv.includes('--strict');
// langs we own a grammar for; everything else (bash, css, json, html, text) is skipped.
const CODE_LANGS = new Set(['jsx', 'tsx', 'ts', 'js', 'typescript', 'javascript', undefined, '']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx') && !p.endsWith('registry.ts')) out.push(p);
  }
  return out;
}

// Pull the raw text of a `code` / `lang` JSX attribute initializer.
function attrText(init) {
  if (!init) return undefined;
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression) {
    const e = init.expression;
    if (ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
    if (ts.isStringLiteral(e)) return e.text;
    if (ts.isTemplateExpression(e)) {
      // Reconstruct, replacing ${…} interpolations with a benign placeholder so
      // the snippet still parses (the interpolated value is runtime, not shape).
      let s = e.head.text;
      for (const span of e.templateSpans) s += '_EXPR_' + span.literal.text;
      return s;
    }
  }
  return undefined; // dynamic / non-literal → can't check
}

function snippetsFromFile(file) {
  const text = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found = [];
  (function visit(node) {
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'code') {
      const attrs = node.parent; // JsxAttributes
      let lang;
      for (const a of attrs.properties) {
        if (ts.isJsxAttribute(a) && a.name.getText(sf) === 'lang') lang = attrText(a.initializer);
      }
      const code = attrText(node.initializer);
      if (code != null) found.push({ code, lang, line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1 });
    }
    ts.forEachChild(node, visit);
  })(sf);
  return found;
}

// Two legitimate documentation patterns are not drift and must not be flagged:
//   1. multiple sibling JSX elements shown together (<A/> <B/>) — a user pastes
//      them inside a parent, so we wrap pure-JSX snippets in a fragment;
//   2. `…` / `{…}` ellipsis placeholders standing in for omitted code.
function normalize(code) {
  return code
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '{null}') // {/* … */} JSX comment → valid child expr
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // block comments
    .replace(/(?<!:)\/\/[^\n]*/g, '') // line comments (skip URLs like http://)
    .replace(/=\{\s*(?:…|\.\.\.)\s*\}/g, '={null}') // ={…} / ={...} prop placeholder
    .replace(/(^|[\s([{,])(?:…|\.\.\.)(?=[\s)\]},/>])/g, '$1null') // bare … / ... placeholder
    .replace(/…/g, 'x'); // any remaining ellipsis lives in a string / JSX text — harmless
}
// A snippet is a "module" (parse as-is) when it has top-level imports/exports or
// statements; otherwise it's a JSX fragment we can safely wrap.
function isModule(code) {
  return /^\s*(import |export )/m.test(code) || /^(const |let |var |function |class |async )/m.test(code);
}
// `…` placeholders and multi-sibling JSX examples are documentation patterns, not
// drift. TS error 2657 ("JSX expressions must have one parent element") is exactly
// the sibling-examples case (a reader pastes them inside a parent), so it's ignored.
const IGNORE_CODES = new Set([2657]);
const hasJsx = (code) => /<[A-Za-z][\w.]*[\s/>]/.test(code);
function parseErrors(code, lang) {
  let c = normalize(code);
  // .ts snippets are NOT JSX — parse as TS so generics / comparisons aren't read as tags.
  const isTs = lang === 'ts' || lang === 'typescript';
  // Drop leading import lines — they're not where demo/preview drift lives, and they
  // turn an otherwise-wrappable JSX snippet into a module we can't fragment-wrap.
  c = c.replace(/^\s*import\s+[^\n]*\n/gm, '');
  const kind = isTs ? ts.ScriptKind.TS : ts.ScriptKind.TSX;
  // Pure-JSX fragment snippets get wrapped so multiple siblings are valid; modules
  // and .ts snippets parse as-is.
  const src = !isTs && !isModule(c) ? `const __frag = (<>\n${c}\n</>);` : c;
  const sf = ts.createSourceFile('snippet' + (isTs ? '.ts' : '.tsx'), src, ts.ScriptTarget.Latest, false, kind);
  return (sf.parseDiagnostics || [])
    .filter((d) => !IGNORE_CODES.has(d.code))
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'));
}

let total = 0, checked = 0, failed = 0;
const failures = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    for (const sn of snippetsFromFile(file)) {
      total++;
      if (!CODE_LANGS.has(sn.lang)) continue; // skip bash/css/json/html/…
      // Skip snippets that aren't component demos: CSS rules, object/config data,
      // and prose-comment pseudocode mislabeled as jsx have no JSX element to drift.
      if (!hasJsx(sn.code)) continue;
      checked++;
      const errs = parseErrors(sn.code, sn.lang);
      if (errs.length) {
        failed++;
        failures.push({ file, line: sn.line, lang: sn.lang || '(default jsx)', errs, preview: sn.code.slice(0, 70).replace(/\n/g, ' ⏎ ') });
      }
    }
  }
}

console.log(`Frame code-snippet check: ${total} code props, ${checked} JS/TSX-checked, ${failed} failed to parse.`);
if (failures.length) {
  for (const f of failures) {
    console.log(`\n  ✗ ${f.file}:${f.line}  [lang: ${f.lang}]`);
    console.log(`    ${f.preview}`);
    console.log(`    → ${f.errs.slice(0, 2).join(' · ')}`);
  }
  if (STRICT) process.exitCode = 1;
} else {
  console.log('All JS/TSX snippets parse cleanly — no compile-breaking drift.');
}
