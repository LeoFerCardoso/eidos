// eidos E2E — prove init + add against the locally-built registry, end to end,
// with no network. Creates a throwaway consumer project, runs the CLI, and asserts
// every file landed with the right content + that dependency resolution worked.
import { mkdtempSync, existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(HERE, '..', 'bin', 'eidos.mjs');
const REGISTRY = resolve(HERE, '..', '..', 'registry', 'public', 'r');

const results = [];
function check(label, cond) {
  results.push({ label, pass: !!cond });
}

const proj = mkdtempSync(join(tmpdir(), 'forge-consumer-'));
// Make it look like a real project (npm) so PM detection works.
writeFileSync(join(proj, 'package.json'), JSON.stringify({ name: 'consumer', private: true }, null, 2));

function cli(args) {
  return spawnSync('node', [CLI, ...args, '--registry', REGISTRY, '--no-install'], {
    cwd: proj, encoding: 'utf8',
  });
}

// 1) init — writes components.json + the base layer (tokens.css, ds.css, lib/utils.ts)
const initRes = cli(['init']);
check('init exit 0', initRes.status === 0);
check('components.json written', existsSync(join(proj, 'components.json')));
check('base: styles/forge/tokens.css', existsSync(join(proj, 'styles/forge/tokens.css')));
check('base: styles/forge/ds.css', existsSync(join(proj, 'styles/forge/ds.css')));
check('base: lib/utils.ts (cn)', existsSync(join(proj, 'lib/utils.ts')));
if (existsSync(join(proj, 'lib/utils.ts'))) {
  check('cn() present in lib/utils.ts', readFileSync(join(proj, 'lib/utils.ts'), 'utf8').includes('export function cn'));
}
if (existsSync(join(proj, 'styles/forge/tokens.css'))) {
  check('tokens.css has --ember token', readFileSync(join(proj, 'styles/forge/tokens.css'), 'utf8').includes('--ember'));
}

// 2) add health-badge — must topologically pull `pill` (its registryDependency after Badge consolidation)
const addRes = cli(['add', 'health-badge']);
check('add exit 0', addRes.status === 0);
check('health-badge.tsx written', existsSync(join(proj, 'components/forge/health-badge.tsx')));
check('pill.tsx auto-installed (dep)', existsSync(join(proj, 'components/forge/pill.tsx')));
if (existsSync(join(proj, 'components/forge/health-badge.tsx'))) {
  const hb = readFileSync(join(proj, 'components/forge/health-badge.tsx'), 'utf8');
  check('health-badge imports pill via alias', hb.includes("@/components/forge/pill"));
  check('health-badge exports HealthBadge', /export\s+(function\s+HealthBadge|\{[^}]*\bHealthBadge\b)/.test(hb));
}

// 3) idempotency — re-adding skips existing files (no crash, exit 0)
const reAdd = cli(['add', 'health-badge']);
check('re-add idempotent (exit 0)', reAdd.status === 0);

// 4) list — surfaces the catalog
const listRes = cli(['list']);
check('list exit 0', listRes.status === 0);
check('list shows health-badge', (listRes.stdout || '').includes('health-badge'));

// 5) diff — clean install reports up to date (use pill, which is now the dep)
const diffRes = cli(['diff', 'pill']);
check('diff exit 0', diffRes.status === 0);
check('diff reports up to date', (diffRes.stdout || '').includes('up to date'));

// verdict
const failed = results.filter((r) => !r.pass);
const summary =
  results.map((r) => `${r.pass ? 'PASS' : 'FAIL'}  ${r.label}`).join('\n') +
  `\n\n${failed.length === 0 ? 'ALL_PASS' : 'SOME_FAIL (' + failed.length + ')'}  [${results.length} checks]\n` +
  `project: ${proj}\n`;
writeFileSync(join(tmpdir(), 'forge-cli-e2e.txt'), summary);
console.log(summary);

// keep the project dir for inspection on failure; clean on success
if (failed.length === 0) { try { rmSync(proj, { recursive: true, force: true }); } catch {} }
process.exit(failed.length === 0 ? 0 : 1);
