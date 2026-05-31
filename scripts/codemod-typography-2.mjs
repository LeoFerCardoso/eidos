// Second pass: snap the low-level doc-chrome sizes (10.5 / 11.5 / 12) onto the
// 9-step scale, context-aware per line. Conservative — only touches prose/label
// chrome, never mono numerics or component-internal controls.
//   A) 10.5 on a mono line  → t-mono-label 11 (var(--text-xs))   [eyebrows/labels]
//   B) 11.5 muted/danger, non-mono → t-small 13 (var(--text-base)) [form helper/error]
//   C) 12 muted (fg-faint/subtle/muted), non-mono → t-small 13     [captions/meta]
// Left untouched: mono numerics (11.5/12 mono), 10.5 non-mono, and 12 with no
// muted colour (in-control / btn / alert-title — component internals).
// Run: node scripts/codemod-typography-2.mjs          (dry run)
//      node scripts/codemod-typography-2.mjs --apply
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = 'src/ds/migrated';
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
  });

const counts = {};
const bump = (k) => (counts[k] = (counts[k] || 0) + 1);

for (const file of walk(ROOT)) {
  const src = readFileSync(file, 'utf8');
  const out = src
    .split('\n')
    .map((line) => {
      const mono = /var\(--font-mono\)/.test(line);
      const muted = /var\(--fg-(faint|subtle|muted)\)/.test(line);
      const danger = /var\(--danger\)/.test(line);
      let l = line;
      // A) mono-label eyebrows
      if (mono) {
        l = l.replace(/fontSize: ?10\.5\b/g, () => (bump('A: 10.5 mono → t-mono-label 11'), "fontSize: 'var(--text-xs)'"));
      }
      // B) form helper / error text (non-mono)
      if (!mono && (muted || danger)) {
        l = l.replace(/fontSize: ?11\.5\b/g, () => (bump('B: 11.5 helper → t-small 13'), "fontSize: 'var(--text-base)'"));
      }
      // C) muted captions / meta (non-mono)
      if (!mono && muted) {
        l = l.replace(/fontSize: ?12\b/g, () => (bump('C: 12 caption → t-small 13'), "fontSize: 'var(--text-base)'"));
      }
      return l;
    })
    .join('\n');
  if (out !== src) {
    bump('files changed');
    if (APPLY) writeFileSync(file, out);
  }
}

// Report what is deliberately left behind, for transparency.
const left = (re) =>
  walk(ROOT).reduce((n, f) => n + (readFileSync(f, 'utf8').match(re) || []).length, 0);

console.log(APPLY ? 'APPLIED' : 'DRY RUN');
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(5)}  ${k}`);
console.log('  --- left untouched (by design) ---');
console.log(`  ${String(left(/fontSize: ?10\.5\b/g)).padStart(5)}  10.5 remaining (non-mono labels)`);
console.log(`  ${String(left(/fontSize: ?11\.5\b/g)).padStart(5)}  11.5 remaining (mono numerics)`);
console.log(`  ${String(left(/fontSize: ?12\b/g)).padStart(5)}  12 remaining (mono / component internals)`);
