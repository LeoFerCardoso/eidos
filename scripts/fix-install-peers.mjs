// One-shot: reconcile the per-page installTabs('name','peers') calls with reality.
// Eidos components are semantic-CSS React — NOT Radix, NOT class-variance-authority.
// Strip those categorically-wrong tokens from the peer string. If what's left is
// only the cn() baseline (clsx tailwind-merge), drop the 2nd arg so the page falls
// back to installTabs' DEFAULT_PEERS. Genuine third-party libs (recharts, embla,
// vaul, cmdk, react-day-picker, date-fns, sonner, katex, mermaid, react-markdown,
// ai, remark-gfm) are preserved.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/ds/migrated';
const files = [];
(function walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx')) files.push(p);
  }
})(ROOT);

const STRIP = (peers) =>
  peers
    .split(/\s+/)
    .filter(Boolean)
    .filter((tok) => !tok.startsWith('@radix-ui/') && tok !== 'class-variance-authority')
    .join(' ');

const BASELINE = new Set(['clsx tailwind-merge', 'tailwind-merge clsx', 'clsx', 'tailwind-merge', '']);

let changed = 0;
let stripped = 0;
let dropped = 0;
const re = /installTabs\(\s*'([^']*)'\s*,\s*'([^']*)'\s*\)/g;

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  let touched = false;
  const next = src.replace(re, (whole, name, peers) => {
    const cleaned = STRIP(peers);
    if (cleaned === peers) return whole; // nothing to do
    touched = true;
    stripped++;
    if (BASELINE.has(cleaned)) { dropped++; return `installTabs('${name}')`; }
    return `installTabs('${name}', '${cleaned}')`;
  });
  if (touched) { writeFileSync(f, next); changed++; }
}

console.log(`Files changed: ${changed}`);
console.log(`installTabs calls cleaned: ${stripped} (of which ${dropped} fell back to default peers)`);
