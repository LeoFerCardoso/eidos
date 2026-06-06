#!/usr/bin/env node
// check-portal-copy — deterministic copy/style gate for the Forge PORTAL screens
// (src/portal/**, app/portal/**). Encodes the conversational design rules that
// were memory-only (so they had no teeth): see .claude memory `ui-no-default-
// interface` + `eidos-button-hierarchy`.
//
// HARD FAIL (exit 1):
//   • em-dash (—, U+2014) in user-facing copy — the "ZERO travessão" rule.
//
// Scope note: this gate enforces ONLY what is deterministic with zero legit
// exceptions. Button-size and raw-hex were considered and deliberately NOT
// linted — both flag legitimate dense-context cases (chat/notif action bars,
// FCardHead actions, syntax-highlight colour maps, artifact srcdoc HTML), so a
// warning there is noise that trains people to ignore the gate. Those stay a
// screenshot-review responsibility, not an automated check.
//
// Comments, // line comments and `template literals` are stripped before the
// copy scan so code/demo strings and authoring notes never trip the gate — the
// same stripping the PreToolUse hook uses, so hook ⇄ CI stay consistent.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['src/portal', 'app/portal'];
const CWD = process.cwd();

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

// Strip block comments, line comments and template literals — but keep newline
// count stable so reported line numbers map back to the real source.
function stripNonCopy(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + m.slice(p1.length).replace(/[^\n]/g, ' '))
    .replace(/`(?:\\.|[^`\\])*`/g, (m) => m.replace(/[^\n]/g, ' '));
}

const files = ROOTS.flatMap((r) => walk(join(CWD, r)));
const errors = [];

for (const file of files) {
  const rel = relative(CWD, file);
  const src = readFileSync(file, 'utf8');
  const copyLines = stripNonCopy(src).split('\n');
  const srcLines = src.split('\n');

  copyLines.forEach((line, i) => {
    if (line.includes('—')) {
      errors.push(`${rel}:${i + 1}  em-dash (—) in copy — use "·", "," or rewrite\n      ${srcLines[i].trim()}`);
    }
  });
}

if (errors.length) {
  console.error(`\n✖ check-portal-copy — ${errors.length} blocking error(s):`);
  for (const e of errors) console.error('  ' + e);
  console.error('\nThe em-dash (—) is banned in portal copy. Replace with "·", a comma, or rewrite the sentence.\n');
  process.exit(1);
}

console.log(`✓ check-portal-copy — ${files.length} portal files clean (no em-dash in copy).`);
