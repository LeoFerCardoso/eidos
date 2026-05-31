// check-4-surface-parity.mjs — THE keystone gate. For each component the contract
// binds, verify all four surfaces resolve on disk: docs page · @forge/ui export ·
// Storybook story · registry item. A component that exists on only 1–2 surfaces is
// broken — the registry/CLI promise is "install any component, component-by-component".
// Backs clause C-export. Honors waivers via forge-verify.
//
//   node scripts/check-4-surface-parity.mjs [--json] [--strict]
import { existsSync } from 'node:fs';
import { abs, loadContract, STATUS } from './forge-lib.mjs';

// Which surfaces a given kind/ds must have. Sub-utilities (no docs of their own) are
// expected to carry a waiver rather than be silently green.
function requiredSurfaces(comp) {
  const req = ['export', 'story', 'registry'];
  // every documentable component should own a docs page; examples/overviews excluded upstream
  req.push('docs');
  return req;
}

function resolveSurface(comp, surface) {
  const s = comp.surfaces || {};
  switch (surface) {
    case 'docs': return !!s.docs && existsSync(abs(s.docs));
    case 'export': return !!s.export && !!s.exportFile && existsSync(abs(s.exportFile));
    case 'story': return !!s.story && existsSync(abs(s.story));
    case 'registry': return existsSync(abs(`packages/registry/public/r/${s.registry || comp.name}.json`));
    default: return false;
  }
}

export function run({ components } = {}) {
  const comps = components || loadContract().components || [];
  const byComponent = {};
  for (const comp of comps) {
    const missing = requiredSurfaces(comp).filter((s) => !resolveSurface(comp, s));
    byComponent[comp.name] = missing.length
      ? { status: STATUS.FAIL, detail: `missing surface(s): ${missing.join(', ')}` }
      : { status: STATUS.PASS, detail: '4-surface parity ok' };
  }
  return { byComponent };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { byComponent } = run({ components: loadContract().components });
  const fails = Object.entries(byComponent).filter(([, r]) => r.status === STATUS.FAIL);
  const ok = Object.values(byComponent).filter((r) => r.status === STATUS.PASS).length;
  console.log(`4-surface parity: ${ok}/${Object.keys(byComponent).length} complete`);
  for (const [name, r] of fails.slice(0, 60)) console.log(`  ✘ ${name.padEnd(22)} ${r.detail}`);
  if (fails.length > 60) console.log(`  … +${fails.length - 60} more`);
  process.exit(process.argv.includes('--strict') && fails.length ? 1 : 0);
}
