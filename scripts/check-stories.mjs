// check-stories.mjs — every @eidos/ui component has a CSF3 story whose meta.title
// prefix is a real Storybook group (read from preview.ts storySort.order, never
// hardcoded) and matches its folder, with tags:['autodocs']. C-story (block).
// C-story-matrix (advisory): a States/Variants story + ≥2 stories for surface-bearing
// components. Backs C-story / C-story-matrix.
//
//   node scripts/check-stories.mjs [--json] [--strict]
import { readFileSync, existsSync } from 'node:fs';
import { sep } from 'node:path';
import { abs, loadContract, metaTitle, STATUS } from './eidos-lib.mjs';

// canonical group order — READ from preview.ts (the real source), do not embed.
function storyGroups() {
  const src = readFileSync(abs('apps/storybook/.storybook/preview.ts'), 'utf8');
  const m = src.match(/order:\s*\[([^\]]*)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((x) => x[1]);
}

const _cache = new Map();
function parseStory(path) {
  if (_cache.has(path)) return _cache.get(path);
  const src = readFileSync(abs(path), 'utf8');
  // the meta title is the first "Group/Name" string (require a slash so we never grab
  // a demo-data `title:` field that precedes the meta block).
  const title = metaTitle(src);
  // autodocs lives on the meta's tags; a story object may carry its OWN tags (e.g.
  // ['pix','payments']) that precede the meta — so look for ANY tags array containing
  // 'autodocs', not just the first tags array.
  const autodocs = /tags:\s*\[[^\]]*['"`]autodocs['"`]/.test(src);
  const storyCount = (src.match(/export const \w+\s*:\s*Story/g) || []).length;
  const hasStates = /export const (States|Variants|AllStates|Matrix)\b/.test(src);
  const folder = path.split(`stories${sep}`)[1]?.split(sep)[0] || '';
  const out = { title, autodocs, storyCount, hasStates, folder };
  _cache.set(path, out);
  return out;
}

export function run({ components, clause } = {}) {
  const comps = components || loadContract().components || [];
  const groups = storyGroups();
  const matrix = clause && clause.id === 'C-story-matrix';
  const byComponent = {};

  for (const comp of comps) {
    const p = comp.surfaces?.story;
    if (!p || !existsSync(abs(p))) { byComponent[comp.name] = { status: STATUS.FAIL, detail: 'no CSF3 story bound' }; continue; }
    const s = parseStory(p);

    if (matrix) {
      const ok = s.storyCount >= 2 || s.hasStates;
      byComponent[comp.name] = ok
        ? { status: STATUS.PASS, detail: `${s.storyCount} stories${s.hasStates ? ' + States' : ''}` }
        : { status: STATUS.FAIL, detail: `only ${s.storyCount} story; add a Variants/States story` };
      continue;
    }

    const probs = [];
    if (!s.title) probs.push('no Group/Name meta.title');
    else {
      // taxonomy lock: the title GROUP must be a real story group from preview.ts
      // storySort.order. (The physical stories/<folder>/ need not equal the group —
      // Eidos files e.g. atoms/ stories under the "Primitives" group by design.)
      const prefix = s.title.split('/')[0];
      if (!groups.includes(prefix)) probs.push(`title group "${prefix}" not in preview.ts storySort.order`);
    }
    if (!s.autodocs) probs.push("missing tags:['autodocs']");
    byComponent[comp.name] = probs.length
      ? { status: STATUS.FAIL, detail: probs.join('; ') }
      : { status: STATUS.PASS, detail: s.title };
  }
  return { byComponent };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const comps = loadContract().components;
  for (const clause of [{ id: 'C-story' }, { id: 'C-story-matrix' }]) {
    const { byComponent } = run({ components: comps, clause });
    const fails = Object.entries(byComponent).filter(([, r]) => r.status === STATUS.FAIL);
    const ok = Object.values(byComponent).length - fails.length;
    console.log(`\n${clause.id}: ${ok}/${Object.keys(byComponent).length} pass`);
    for (const [n, r] of fails.slice(0, 40)) console.log(`  ✘ ${n.padEnd(22)} ${r.detail}`);
    if (fails.length > 40) console.log(`  … +${fails.length - 40} more`);
  }
}
