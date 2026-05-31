// One-shot codemod: replace the hand-rolled prose-style consts (lede / ledeUp /
// cap / captn / mono) with the <Lede> / <Mono> primitives (DS-PAGE-STANDARD §3.5).
// Verified size-equivalent: <Mono> uses --text-sm (13) == inline mono's --text-base
// (13); <Lede> renders .ds-caption (15 / fg-muted / lh1.6 / mt14) == inline lede/cap.
//
//   node scripts/codemod-prose-primitives.mjs           # dry-run report
//   node scripts/codemod-prose-primitives.mjs --write     # apply
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WRITE = process.argv.includes('--write');
const ROOT = 'src/ds/migrated';

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx') && !p.endsWith('registry.ts')) out.push(p);
  }
  return out;
}

// Paired open/close replacements. mono FIRST so any <code style={mono}> inside a
// lede paragraph is already <Mono> before the <p> wrapper is rewritten.
const PAIRS = [
  [/<code\s+style=\{mono\}>([\s\S]*?)<\/code>/g, (m, inner) => `<Mono>${inner}</Mono>`],
  [/<p\s+style=\{ledeUp\}>([\s\S]*?)<\/p>/g, (m, inner) => `<Lede up>${inner}</Lede>`],
  [/<p\s+style=\{lede\}>([\s\S]*?)<\/p>/g, (m, inner) => `<Lede>${inner}</Lede>`],
  [/<p\s+style=\{captn\}>([\s\S]*?)<\/p>/g, (m, inner) => `<Lede>${inner}</Lede>`],
  [/<p\s+style=\{cap\}>([\s\S]*?)<\/p>/g, (m, inner) => `<Lede>${inner}</Lede>`],
];
const NAMES = ['lede', 'ledeUp', 'cap', 'captn', 'mono'];

let filesChanged = 0, totalRepl = 0, constsRemoved = 0;
const leftovers = [];
for (const file of walk(ROOT)) {
  let src = readFileSync(file, 'utf8');
  let repl = 0, removedHere = 0;
  for (const [re, fn] of PAIRS) src = src.replace(re, (...a) => { repl++; return fn(a[0], a[1]); });

  // Remove now-unused const decls (only if no remaining style={name} or ...name usage).
  for (const n of NAMES) {
    const stillUsed = new RegExp(`style=\\{${n}\\}|\\.\\.\\.\\s*${n}\\b`).test(src);
    if (!stillUsed) {
      const declRe = new RegExp(`^[ \\t]*const\\s+${n}\\s*=\\s*\\{[^}]*\\}(?:\\s+as\\s+const)?;[ \\t]*\\n`, 'm');
      if (declRe.test(src)) { src = src.replace(declRe, ''); removedHere++; }
    } else if (new RegExp(`style=\\{${n}\\}`).test(src)) {
      leftovers.push(`${file}: style={${n}} still present (merged / non-<p>/<code> usage)`);
    }
  }

  // Only a file we actually transformed needs an import fix — guards against
  // false matches (e.g. changelog entries that mention "<Lede>"/"<Mono>" as text).
  if (repl === 0 && removedHere === 0) continue;
  if (/<Lede(\s|>)/.test(src)) src = ensureImports(src, true, /<Mono>/.test(src), file);
  else if (/<Mono>/.test(src)) src = ensureImports(src, false, true, file);

  totalRepl += repl; constsRemoved += removedHere; filesChanged++;
  if (WRITE) writeFileSync(file, src);
}

function ensureImports(src, needLede, needMono, file) {
  // Lede/Mono are exported from core AND re-exported from '@/components/docs'.
  const m =
    src.match(/import\s*\{([^}]*)\}\s*from\s*(['"]@\/ds\/core['"]);/s) ||
    src.match(/import\s*\{([^}]*)\}\s*from\s*(['"]@\/components\/docs['"]);/s);
  if (!m) { leftovers.push(`${file}: no core/docs import block — add Lede/Mono manually`); return src; }
  const have = new Set(m[1].split(',').map((s) => s.trim()).filter(Boolean));
  let added = false;
  // Don't duplicate a `type X` entry; only add the bare names.
  if (needLede && ![...have].some((h) => /\bLede\b/.test(h))) { have.add('Lede'); added = true; }
  if (needMono && ![...have].some((h) => /\bMono\b/.test(h))) { have.add('Mono'); added = true; }
  if (!added) return src;
  return src.replace(m[0], `import { ${[...have].join(', ')} } from ${m[2]};`);
}

console.log(`${WRITE ? 'APPLIED' : 'DRY-RUN'}: ${filesChanged} files, ${totalRepl} <p>/<code> replacements, ${constsRemoved} const decls removed.`);
if (leftovers.length) {
  console.log(`\nLeftovers for manual review (${leftovers.length}):`);
  for (const l of leftovers) console.log('  • ' + l);
}
