// check-ds-page-structure.mjs — the executable form of DS-PAGE-STANDARD.md. Parses
// each docs page once (memoized) and answers, per clause, against docs/ds-page-standard.json
// (the rules live there as DATA). Backs C-docs-sections, C-a11y-section, C-rtl-frame,
// C-anatomy, C-do-dont, C-autopropstable, C-lede. Honors per-DS exemptions (charts/
// patterns RTL optional, patterns AutoProps exempt).
//
//   node scripts/check-ds-page-structure.mjs [--json] [--strict]
import { readFileSync, existsSync } from 'node:fs';
import { abs, loadContract, readJSON, PAGE_STANDARD_PATH, STATUS } from './eidos-lib.mjs';

const STD = readJSON(PAGE_STANDARD_PATH);

// strip Frame `code={`…`}` demo snippets (template literals) + line/block comments so a
// <SubHead> shown INSIDE a demo never pollutes the page's real section sequence.
const stripDemos = (s) => s
  .replace(/`(?:\\.|[^`\\])*`/g, '``')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

const _pages = new Map();
function parsePage(path) {
  if (_pages.has(path)) return _pages.get(path);
  const raw = readFileSync(abs(path), 'utf8');
  const chrome = stripDemos(raw);
  const metas = [...chrome.matchAll(new RegExp(STD.markers.subHead.regex, 'g'))].map((m) => m[1]);
  const descM = raw.match(new RegExp(STD.markers.sectionDesc.regex));
  // markers (anatomy/dd-grid/rtl/AutoPropsTable) are real rendered chrome, scan the full src
  const out = { src: raw, metas, desc: descM ? descM[1] : null };
  _pages.set(path, out);
  return out;
}

function hasMarker(src, marker) {
  const def = STD.markers[marker];
  if (!def) return false;
  if (def.all && !def.all.every((s) => src.includes(s))) return false;
  if (def.any && !def.any.some((s) => src.includes(s))) return false;
  if (def.regex && !new RegExp(def.regex).test(src)) return false;
  return true;
}

function templateFor(comp) {
  return comp.kind === 'foundation' ? STD.templates.foundation : STD.templates.component;
}

// match a found meta eyebrow to a template section → its order (or null)
function sectionOrder(meta, tmpl) {
  const lc = meta.toLowerCase();
  for (const sec of tmpl.sections) {
    if (sec.metaSuffix && meta.endsWith(sec.metaSuffix)) return sec.order;
    if ((sec.meta || []).some((tok) => lc.includes(tok.toLowerCase()))) return sec.order;
  }
  return null;
}

function checkOne(comp, clauseId) {
  const p = comp.surfaces?.docs;
  if (!p || !existsSync(abs(p))) return { status: STATUS.SKIP, detail: 'no docs page' };
  const { src, metas, desc } = parsePage(p);
  const tmpl = templateFor(comp);

  switch (clauseId) {
    case 'C-docs-sections': {
      // keep meta + order paired so the reported name stays aligned after filtering
      const seq = metas.map((m) => ({ m, o: sectionOrder(m, tmpl) })).filter((x) => x.o != null);
      for (let i = 1; i < seq.length; i++) {
        if (seq[i].o < seq[i - 1].o) return { status: STATUS.FAIL, detail: `"${seq[i].m}" appears after "${seq[i - 1].m}"` };
      }
      return { status: STATUS.PASS, detail: `${seq.length} ordered sections` };
    }
    case 'C-a11y-section': {
      const hasA11y = metas.some((m) => /a11y/i.test(m));
      if (!hasA11y) return { status: STATUS.FAIL, detail: 'no <SubHead meta="a11y"> section' };
      const kw = ['keyboard', 'aria', 'contrast', 'motion', 'screen reader', 'focus'];
      const hits = kw.filter((k) => new RegExp(k, 'i').test(src)).length;
      return hits >= 2 ? { status: STATUS.PASS, detail: `a11y section (${hits} topics)` }
        : { status: STATUS.FAIL, detail: 'a11y section thin (needs keyboard/ARIA/contrast/motion)' };
    }
    case 'C-rtl-frame': {
      if ((STD.exempt.rtlOptionalDs || []).includes(comp.ds)) return { status: STATUS.PASS, detail: `RTL optional for ${comp.ds}` };
      return hasMarker(src, 'rtlFrame') ? { status: STATUS.PASS, detail: 'has dir="rtl" frame' }
        : { status: STATUS.FAIL, detail: 'no live RTL frame' };
    }
    case 'C-anatomy':
      return hasMarker(src, 'anatomy') ? { status: STATUS.PASS, detail: 'visual anatomy' }
        : { status: STATUS.FAIL, detail: 'no .ana/.ana-list visual anatomy' };
    case 'C-do-dont':
      return hasMarker(src, 'ddGrid') ? { status: STATUS.PASS, detail: '.dd-grid' }
        : { status: STATUS.FAIL, detail: 'no .dd-grid Do/Don\'t' };
    case 'C-autopropstable': {
      if ((STD.exempt.autoPropsExemptDs || []).includes(comp.ds)) return { status: STATUS.PASS, detail: `CSS-vars page (${comp.ds})` };
      if (hasMarker(src, 'autoPropsTable')) return { status: STATUS.PASS, detail: '<AutoPropsTable>' };
      return { status: STATUS.FAIL, detail: hasMarker(src, 'handTable') ? 'hand-authored table — use <AutoPropsTable>' : 'no API reference' };
    }
    case 'C-lede': {
      if (desc == null) return { status: STATUS.SKIP, detail: 'no desc lede found' };
      if (desc.length > STD.ledeMaxChars) return { status: STATUS.FAIL, detail: `lede ${desc.length} chars (> ${STD.ledeMaxChars})` };
      if (/[<>]/.test(desc)) return { status: STATUS.FAIL, detail: 'markup in lede' };
      return { status: STATUS.PASS, detail: `lede ${desc.length} chars` };
    }
    default:
      return { status: STATUS.SKIP, detail: 'unhandled clause' };
  }
}

export function run({ components, clause } = {}) {
  const comps = components || loadContract().components || [];
  const id = clause?.id || 'C-docs-sections';
  const byComponent = {};
  for (const comp of comps) byComponent[comp.name] = checkOne(comp, id);
  return { byComponent };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const comps = loadContract().components;
  for (const id of ['C-docs-sections', 'C-a11y-section', 'C-rtl-frame', 'C-anatomy', 'C-do-dont', 'C-autopropstable', 'C-lede']) {
    const { byComponent } = run({ components: comps, clause: { id } });
    const vals = Object.values(byComponent);
    const fail = vals.filter((r) => r.status === STATUS.FAIL).length;
    const pass = vals.filter((r) => r.status === STATUS.PASS).length;
    const skip = vals.filter((r) => r.status === STATUS.SKIP).length;
    console.log(`${id.padEnd(20)} pass ${String(pass).padStart(3)} · fail ${String(fail).padStart(3)} · skip ${String(skip).padStart(3)}`);
  }
}
