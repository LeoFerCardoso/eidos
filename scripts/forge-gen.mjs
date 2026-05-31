// forge-gen.mjs — contract data layer + scaffold.
//
//   node scripts/forge-gen.mjs contract --sync   # rebuild contract.components[] from disk
//   node scripts/forge-gen.mjs contract --check   # fail if the contract is out of sync
//   node scripts/forge-gen.mjs component <slug> --ds <ds>   # (scaffold — see §4, Phase 3)
//
// `contract --sync` is the keystone of the harness: it joins every installable unit
// across its FOUR surfaces (registry item · @eidos/ui export · Storybook story · docs
// page) by a normalised slug and writes the bound `components[]` the verifiers read.
// It preserves clauses + waivers; it only rewrites `components` and the `generated` flag.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { basename, relative, sep } from 'node:path';
import {
  ROOT, abs, CONTRACT_PATH, loadContract, walk, toSlug, metaTitle,
} from './forge-lib.mjs';

// ── parse @eidos/ui exports → where each symbol is DEFINED ──────────────────────
function exportMap() {
  const files = walk('packages/ui/src', (p) => /\.tsx?$/.test(p) && !/\.stories\./.test(p) && !p.includes(`${sep}stories${sep}`));
  const byName = new Map(); // ExportName → relpath (first definition wins)
  const defRe = /export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_]\w*)/g;
  // local re-export lists `export { Foo, Bar as Baz }` (NOT `... from './x'`, which surfaces a symbol defined elsewhere)
  const listRe = /export\s*\{([^}]*)\}\s*(?!from)/g;
  for (const f of files) {
    const src = readFileSync(abs(f), 'utf8');
    let m;
    while ((m = defRe.exec(src))) if (!byName.has(m[1])) byName.set(m[1], f);
    while ((m = listRe.exec(src))) {
      // strip comments inside the export list (e.g. `// Phase 2 atoms`) before splitting,
      // else the name right after a comment gets dropped.
      const list = m[1].replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
      for (const piece of list.split(',')) {
        const name = (piece.includes(' as ') ? piece.split(' as ')[1] : piece).trim().replace(/^type\s+/, '');
        if (/^[A-Za-z_]\w*$/.test(name) && !byName.has(name)) byName.set(name, f);
      }
    }
  }
  // index by slug too, so 'metric-card' → 'MetricCard'
  const bySlug = new Map();
  for (const [name, file] of byName) {
    const slug = toSlug(name);
    if (!bySlug.has(slug)) bySlug.set(slug, { name, file });
  }
  return { byName, bySlug };
}

// ── parse Storybook stories → slug (last meta.title segment) → path ─────────────
function storyMap() {
  const files = walk('packages/ui/src/stories', (p) => /\.stories\.tsx?$/.test(p));
  const bySlug = new Map();
  for (const f of files) {
    const src = readFileSync(abs(f), 'utf8');
    const title = metaTitle(src);
    if (!title || !title.includes('/')) continue;
    const seg = title.split('/').pop();
    const slug = toSlug(seg);
    if (!bySlug.has(slug)) bySlug.set(slug, { path: f, title });
  }
  return bySlug;
}

// ── parse docs pages → slug → [{ path, ds }] (a slug can collide across DSs, e.g.
//    label.tsx (core/forms) vs ai/label.tsx (ai) — keep BOTH and disambiguate per
//    component by domain). ─────────────────────────────────────────────────────────
function docsMap() {
  const files = walk('src/ds/migrated', (p) => p.endsWith('.tsx') && !/(registry|changelog)\.tsx?$/.test(basename(p)));
  const bySlug = new Map();
  for (const f of files) {
    const parts = f.replace(/^.*src\/ds\/migrated\//, '').replace(/\.tsx$/, '').split('/');
    const ds = parts.length > 1 ? parts[0] : 'core';
    const slug = toSlug(parts[parts.length - 1]);
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug).push({ path: f, ds });
  }
  return bySlug;
}

// resolve the docs page for a component, preferring its canonical home DS. A core
// component documented on both src/ds/migrated/tabs.tsx (canonical) and mobile/tabs.tsx
// (a mobile demo) must bind to the CORE page; an AI component prefers its ai/ page.
// Tries the name and its ai-prefix-stripped form (ai-label → label under ai/).
function resolveDocs(docs, name, isAi) {
  const base = toSlug(name);
  // ordered: exact first, then ai-stripped, then plural (pill→pills, badge→badges) — many
  // atoms have a PLURAL family page while the registry slug is singular. Order is preserved
  // by the stable sort so an exact match always beats a plural one on a DS tie.
  const slugs = [];
  const add = (s) => { if (s && !slugs.includes(s)) slugs.push(s); };
  add(base);
  add(base.replace(/^ai-/, ''));
  add(base + 's');
  if (base.endsWith('y')) add(base.slice(0, -1) + 'ies');
  const cands = slugs.flatMap((s) => docs.get(s) || []);
  if (!cands.length) return null;
  // lower rank wins. core is canonical for shared components; mobile pages are demos.
  const RANK = { core: 0, idp: 1, charts: 1, patterns: 1, blocks: 1, mobile: 3, ai: 4 };
  const rank = (c) => (isAi ? (c.ds === 'ai' ? 0 : 2) : (RANK[c.ds] ?? 2));
  return [...cands].sort((a, b) => rank(a) - rank(b))[0];
}

// ── registry items (the install catalog = the component spine) ─────────────────
function registryItems() {
  const reg = JSON.parse(readFileSync(abs('packages/registry/registry.json'), 'utf8'));
  return (reg.items || []).filter((it) => it.type === 'registry:ui');
}

const AI_SLUGS = null; // inferred per-item below

function sync() {
  const contract = loadContract();
  const { bySlug: exBySlug } = exportMap();
  const stories = storyMap();
  const docs = docsMap();
  const items = registryItems();

  const components = [];
  for (const it of items) {
    const slug = it.name;
    const ex = exBySlug.get(slug) || null;
    const story = stories.get(slug) || null;
    const regSrc = (it.files || []).map((f) => f.source).find((s) => /src\/forge\/.+\.tsx$/.test(s))
      || (existsSync(abs(`packages/registry/src/forge/${slug}.tsx`)) ? `packages/registry/src/forge/${slug}.tsx` : '');

    // domain inference (independent of docs — docs binding depends on it, not vice-versa):
    // AI if the export source lives under an /ai/ path, the name is ai-prefixed, or the
    // registry source matches a known AI component.
    const isAi = (ex && /\/ai\//.test(ex.file)) || /^ai-/.test(slug) || /src\/forge\/(ai-|tool|reasoning|agent|prompt|model|message|response|conversation|context|persona|citation|sources|transcription|speech|chain-of-thought|plan|task|checkpoint|confirmation|queue|artifact|ask-user|shimmer|suggestion|prose)/.test(regSrc);
    const doc = resolveDocs(docs, slug, isAi);

    components.push({
      name: slug,
      kind: isAi ? 'ai' : 'component',
      ds: doc ? doc.ds : (isAi ? 'ai' : 'core'),
      title: it.title || slug,
      surfaces: {
        docs: doc ? doc.path : '',
        export: ex ? ex.name : '',
        exportFile: ex ? ex.file : '',
        story: story ? story.path : '',
        registry: slug,
        registrySrc: regSrc,
      },
    });
  }
  components.sort((a, b) => a.name.localeCompare(b.name));

  // coverage stats for the operator
  const stat = (k) => components.filter((c) => c.surfaces[k]).length;
  const next = { ...contract, generated: true, components };
  return { next, components, stat };
}

const argv = process.argv.slice(2);
const cmd = argv[0];

if (cmd === 'contract') {
  const check = argv.includes('--check');
  const { next, components, stat } = sync();
  if (check) {
    const cur = readFileSync(abs(CONTRACT_PATH), 'utf8');
    const want = JSON.stringify(next, null, 2) + '\n';
    if (cur !== want) { console.error('✘ contract.components[] out of sync — run `npm run gen:contract`.'); process.exit(1); }
    console.log('✔ contract in sync with disk.'); process.exit(0);
  }
  writeFileSync(abs(CONTRACT_PATH), JSON.stringify(next, null, 2) + '\n');
  console.log(`Synced ${components.length} components → ${CONTRACT_PATH}`);
  console.log(`  surfaces present — docs ${stat('docs')} · export ${stat('export')} · story ${stat('story')} · registry ${components.length}`);
  const missing = components.filter((c) => !c.surfaces.docs || !c.surfaces.export || !c.surfaces.story).length;
  console.log(`  ${missing} component(s) missing ≥1 of docs/export/story (parity gaps the contract now tracks).`);
} else if (cmd === 'component') {
  console.error('forge gen component <slug> — scaffold lands in Phase 3 (§4). Use the `new-component` skill meanwhile.');
  process.exit(2);
} else {
  console.error('usage: forge-gen.mjs contract --sync|--check  |  component <slug> --ds <ds>');
  process.exit(2);
}
