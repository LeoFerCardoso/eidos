// One-off codemod: snap doc-prose font sizes in migrated pages onto the
// 9-step Eidos type scale (Foundations/Typography). Context-aware per line:
//   • a section-intro line (carries a 68ch/64ch measure) → t-body (15)
//   • everything else (card body, captions) → t-small (13)
//   • inline-code mono const (12) → t-small (13)
// Component-internal sizes (11.5/10.5/9.5/16/22/… inside demos) are left
// untouched — they are the artefact being demonstrated, not doc prose.
// Run: node scripts/codemod-typography.mjs            (dry run, prints counts)
//      node scripts/codemod-typography.mjs --apply     (writes files)
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = 'src/ds/migrated';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : [];
  });
}

const counts = {};
const bump = (k, n = 1) => (counts[k] = (counts[k] || 0) + n);

for (const file of walk(ROOT)) {
  const src = readFileSync(file, 'utf8');
  const out = src
    .split('\n')
    .map((line) => {
      const isIntro = /6[48]ch/.test(line); // 68ch / 64ch measure ⇒ section intro/lede
      let l = line;
      if (isIntro) {
        // Section intro / lede ⇒ t-body 15
        l = l.replace(/var\(--text-sm\)/g, () => (bump('intro:--text-sm→body'), 'var(--text-body)'));
        l = l.replace(/fontSize: ?13\.5\b/g, () => (bump('intro:13.5→body'), "fontSize: 'var(--text-body)'"));
        l = l.replace(/fontSize: ?12\.5\b/g, () => (bump('intro:12.5→body'), "fontSize: 'var(--text-body)'"));
      } else {
        // Card body / caption ⇒ t-small 13
        l = l.replace(/fontSize: ?13\.5\b/g, () => (bump('card:13.5→base'), "fontSize: 'var(--text-base)'"));
        l = l.replace(/fontSize: ?12\.5\b/g, () => (bump('card:12.5→base'), "fontSize: 'var(--text-base)'"));
        // 14.5 is between 13 and 15 → round to t-body 15
        l = l.replace(/fontSize: ?14\.5\b/g, () => (bump('14.5→body'), "fontSize: 'var(--text-body)'"));
      }
      // Inline-code mono helper (12px ember mono) ⇒ t-small 13, on any line
      if (/var\(--font-mono\)/.test(l) && /var\(--ember\)/.test(l)) {
        l = l.replace(/fontSize: ?12\b/g, () => (bump('mono:12→base'), "fontSize: 'var(--text-base)'"));
      }
      return l;
    })
    .join('\n');

  if (out !== src) {
    bump('files changed');
    if (APPLY) writeFileSync(file, out);
  }
}

console.log(APPLY ? 'APPLIED' : 'DRY RUN');
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(5)}  ${k}`);
}
