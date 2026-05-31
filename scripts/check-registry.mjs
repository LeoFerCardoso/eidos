// check-registry.mjs — the registry/CLI install surface is correct.
// C-registry (block): public/r/<name>.json built; has the shadcn $schema;
//   registryDependencies acyclic + all present; every files[].source resolves.
// C-registry-sync (block, INTERIM): the built item's inlined content equals the
//   current registrySrc on disk (i.e. the registry build is not stale). The end-state
//   (§2.2.5) is to inline build-registry directly from the canonical @eidos/ui source
//   so the src/forge/* copies disappear — then this gate becomes build-time equality.
// Backs C-registry / C-registry-sync.
//
//   node scripts/check-registry.mjs [--json] [--strict]
import { readFileSync, existsSync } from 'node:fs';
import { abs, loadContract, STATUS } from './eidos-lib.mjs';

function loadRegistry() {
  const reg = JSON.parse(readFileSync(abs('packages/registry/registry.json'), 'utf8'));
  const byName = new Map(reg.items.map((it) => [it.name, it]));
  return { reg, byName };
}

// replicate build-registry source resolution (styles/* falls back to @eidos/ui)
function sourceResolves(source) {
  if (existsSync(abs(`packages/registry/${source}`))) return true;
  if (source.startsWith('styles/') && existsSync(abs(`packages/ui/${source}`))) return true;
  return false;
}

// global cycle detection across the registry dependency graph
function cycleNodes(byName) {
  const state = new Map(); // 0 unvisited, 1 in-stack, 2 done
  const bad = new Set();
  const visit = (name, stack) => {
    const it = byName.get(name);
    if (!it) return;
    if (state.get(name) === 1) { stack.forEach((n) => bad.add(n)); bad.add(name); return; }
    if (state.get(name) === 2) return;
    state.set(name, 1);
    for (const dep of it.registryDependencies || []) {
      if (/^https?:\/\//.test(dep)) continue;
      visit(dep, [...stack, name]);
    }
    state.set(name, 2);
  };
  for (const name of byName.keys()) visit(name, []);
  return bad;
}

export function run({ components, clause } = {}) {
  const comps = components || loadContract().components || [];
  const { byName } = loadRegistry();
  const cycles = cycleNodes(byName);
  const sync = clause && clause.id === 'C-registry-sync';
  const byComponent = {};

  for (const comp of comps) {
    const name = comp.surfaces?.registry || comp.name;
    const item = byName.get(name);
    const built = abs(`packages/registry/public/r/${name}.json`);

    if (sync) {
      const src = comp.surfaces?.registrySrc;
      if (!item) { byComponent[comp.name] = { status: STATUS.FAIL, detail: 'no registry item' }; continue; }
      if (!existsSync(built)) { byComponent[comp.name] = { status: STATUS.FAIL, detail: 'public/r missing — run registry:build' }; continue; }
      if (!src || !existsSync(abs(src))) { byComponent[comp.name] = { status: STATUS.PASS, detail: 'no src/forge copy (css/style item)' }; continue; }
      const onDisk = readFileSync(abs(src), 'utf8');
      const builtJson = JSON.parse(readFileSync(built, 'utf8'));
      const inlined = (builtJson.files || []).find((f) => (f.content || '').length && f.path?.endsWith('.tsx'));
      byComponent[comp.name] = inlined && inlined.content === onDisk
        ? { status: STATUS.PASS, detail: 'registry build in sync' }
        : { status: STATUS.FAIL, detail: 'built item is stale vs src/forge — run registry:build' };
      continue;
    }

    // C-registry validity
    const probs = [];
    if (!item) probs.push('no registry.json item');
    if (!existsSync(built)) probs.push('public/r/<name>.json not built');
    else {
      const b = JSON.parse(readFileSync(built, 'utf8'));
      if (!/registry-item/.test(b.$schema || '')) probs.push('missing/invalid $schema');
    }
    if (item) {
      for (const dep of item.registryDependencies || []) {
        if (/^https?:\/\//.test(dep)) continue;
        if (!byName.has(dep)) probs.push(`missing registryDependency "${dep}"`);
      }
      if (cycles.has(name)) probs.push('in a registryDependency cycle');
      for (const f of item.files || []) {
        if (!sourceResolves(f.source)) probs.push(`files[].source not found: ${f.source}`);
      }
    }
    byComponent[comp.name] = probs.length
      ? { status: STATUS.FAIL, detail: probs.join('; ') }
      : { status: STATUS.PASS, detail: 'registry item valid' };
  }
  return { byComponent };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const comps = loadContract().components;
  for (const clause of [{ id: 'C-registry' }, { id: 'C-registry-sync' }]) {
    const { byComponent } = run({ components: comps, clause });
    const fails = Object.entries(byComponent).filter(([, r]) => r.status === STATUS.FAIL);
    console.log(`\n${clause.id}: ${Object.keys(byComponent).length - fails.length}/${Object.keys(byComponent).length} pass`);
    for (const [n, r] of fails.slice(0, 40)) console.log(`  ✘ ${n.padEnd(22)} ${r.detail}`);
    if (fails.length > 40) console.log(`  … +${fails.length - 40} more`);
  }
}
