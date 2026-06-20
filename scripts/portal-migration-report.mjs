// Portal → typed-vocabulary migration analyzer.
//
// The migration is a RATCHET, not a blind codemod: many portal inline styles use
// off-grid spacing (gap:14, gap:10) that has no token, and many raw <div>s carry `.fp-*`
// classes that encode design (a `.fp-card` is the <Card> component, not a <Box>). So
// conversion is a per-screen decision. This script quantifies the work and ranks screens
// so the ratchet burns down worst-first, and flags which inline styles are trivially
// token-mappable vs which need a spacing/normalization decision.
//
//   node scripts/portal-migration-report.mjs           # print ranked worklist + totals
//   node scripts/portal-migration-report.mjs --md       # also write reports/portal-migration-worklist.md
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['app/portal', 'src/portal'];
const SPACE_PX = new Set([0, 1, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 96]); // the --space grid
const SPACE_KEYS = ['padding', 'margin', 'gap', 'rowGap', 'columnGap', 'top', 'left', 'right', 'bottom'];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.tsx?$/.test(e)) out.push(p);
  }
  return out;
}

// Is every spacing number inside this style object on the token grid?
function styleMappable(objText) {
  let mappable = true;
  for (const key of SPACE_KEYS) {
    const re = new RegExp(`${key}\\s*:\\s*(\\d+)`, 'g');
    let m;
    while ((m = re.exec(objText))) if (!SPACE_PX.has(Number(m[1]))) mappable = false;
  }
  return mappable;
}

const rows = [];
let totDiv = 0, totStyle = 0, totMappable = 0, totDecision = 0;
for (const root of ROOTS) {
  let files = [];
  try { files = walk(root); } catch { continue; }
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const raw = (src.match(/<(div|section|nav|span|ul|ol|li|header|footer|aside|main|article)[\s/>]/g) || []).length;
    const styleBlocks = src.match(/style=\{\{[^}]*\}\}/g) || [];
    let mappable = 0, decision = 0;
    for (const b of styleBlocks) (styleMappable(b) ? mappable++ : decision++);
    if (raw === 0 && styleBlocks.length === 0) continue;
    rows.push({ f, raw, style: styleBlocks.length, mappable, decision });
    totDiv += raw; totStyle += styleBlocks.length; totMappable += mappable; totDecision += decision;
  }
}
rows.sort((a, b) => (b.raw + b.style) - (a.raw + a.style));

const head = `Portal migration worklist — ${rows.length} files, ${totDiv} raw elements, ${totStyle} inline styles ` +
  `(${totMappable} token-mappable, ${totDecision} need a spacing decision).`;
console.log(head + '\n');
console.log('  raw  style  (map/dec)  file');
for (const r of rows.slice(0, 25))
  console.log(`  ${String(r.raw).padStart(4)} ${String(r.style).padStart(5)}   ${r.mappable}/${r.decision}\t${r.f}`);
if (rows.length > 25) console.log(`  … and ${rows.length - 25} more`);

if (process.argv.includes('--md')) {
  mkdirSync('reports', { recursive: true });
  const md = [`# ${head}`, '', 'Ranked worst-first. `map` = inline styles whose spacing is on the token grid (mechanical); `dec` = styles with off-grid spacing needing a normalization decision.', '', '| raw | style | map | dec | file |', '| ---: | ---: | ---: | ---: | --- |',
    ...rows.map((r) => `| ${r.raw} | ${r.style} | ${r.mappable} | ${r.decision} | \`${r.f}\` |`)].join('\n') + '\n';
  writeFileSync('reports/portal-migration-worklist.md', md);
  console.log('\nWrote reports/portal-migration-worklist.md');
}
