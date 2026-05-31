// forge-ui full-catalog E2E — install components across every family into a throwaway
// project against the locally-built registry, then typecheck the installed tree to prove
// dependency resolution produced a coherent, compiling component set. No network.
import { mkdtempSync, existsSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(HERE, '..', 'bin', 'forge-ui.mjs');
const REGISTRY = resolve(HERE, '..', '..', 'registry', 'public', 'r');
const ROOT = resolve(HERE, '..', '..', '..');

const results = [];
const check = (label, cond) => results.push({ label, pass: !!cond });

const proj = mkdtempSync(join(tmpdir(), 'forge-full-'));
writeFileSync(join(proj, 'package.json'), JSON.stringify({ name: 'consumer', private: true }, null, 2));

const cli = (args) =>
  spawnSync('node', [CLI, ...args, '--registry', REGISTRY, '--no-install'], { cwd: proj, encoding: 'utf8' });

check('init exit 0', cli(['init']).status === 0);

// One representative component per family; each exercises dependency resolution.
const SAMPLE = [
  ['metric-card', ['components/forge/metric-card.tsx', 'components/forge/trend.tsx', 'components/forge/sparkline.tsx']],
  ['health-badge', ['components/forge/health-badge.tsx', 'components/forge/pill.tsx']],
  ['data-table', ['components/forge/data-table.tsx']],
  ['forge-chart', ['components/forge/forge-chart.tsx']],
  ['tool', ['components/forge/tool.tsx', 'components/forge/icons.tsx', 'styles/forge/ai.css']],
  ['message', ['components/forge/message.tsx']],
  ['drawer', ['components/forge/drawer.tsx']],
  ['device-frame', ['components/forge/device-frame.tsx']],
  ['frame', ['components/forge/frame.tsx']],
];

for (const [name, expectedFiles] of SAMPLE) {
  const r = cli(['add', name]);
  check(`add ${name} exit 0`, r.status === 0);
  for (const f of expectedFiles) check(`  ${name} → ${f}`, existsSync(join(proj, f)));
}

check('base tokens.css', existsSync(join(proj, 'styles/forge/tokens.css')));
check('base ds.css', existsSync(join(proj, 'styles/forge/ds.css')));
check('ai.css (forge-ai) pulled by AI component', existsSync(join(proj, 'styles/forge/ai.css')));
check('lib/utils.ts (cn)', existsSync(join(proj, 'lib/utils.ts')));

const installed = existsSync(join(proj, 'components/forge'))
  ? readdirSync(join(proj, 'components/forge')).filter((f) => f.endsWith('.tsx'))
  : [];
check('installed >= 12 component files', installed.length >= 12);

writeFileSync(
  join(proj, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020', lib: ['dom', 'dom.iterable', 'esnext'], module: 'esnext',
        moduleResolution: 'bundler', jsx: 'react-jsx', strict: false, noEmit: true,
        esModuleInterop: true, skipLibCheck: true, baseUrl: '.',
        paths: { '@/components/forge/*': ['./components/forge/*'], '@/lib/utils': ['./lib/utils'] },
        typeRoots: [resolve(ROOT, 'node_modules/@types')],
      },
      include: ['components/**/*.tsx', 'lib/**/*.ts'],
    },
    null,
    2,
  ),
);

const tsc = spawnSync(
  'node',
  [resolve(ROOT, 'node_modules/typescript/bin/tsc'), '--noEmit', '-p', 'tsconfig.json'],
  { cwd: proj, encoding: 'utf8' },
);
// Under --no-install the consumer hasn't run npm, so external libs (clsx,
// tailwind-merge, recharts, ai, react-markdown…) are legitimately absent. Those
// TS2307 "Cannot find module '<bare-specifier>'" errors are EXPECTED and not a
// fault of the generated component code — filter them out. Any other error (a
// broken @/components/forge/* alias, a missing local symbol, a type mismatch)
// still fails the check.
const isExternalMissing = (l) => /Cannot find module '(?!@\/|\.)/.test(l);
const tscErrs = (tsc.stdout || '')
  .split('\n')
  .filter((l) => /error TS/.test(l))
  .filter((l) => !isExternalMissing(l));
check('installed tree typechecks (0 errors, external libs aside)', tscErrs.length === 0);

const failed = results.filter((r) => !r.pass);
const summary =
  results.map((r) => `${r.pass ? 'PASS' : 'FAIL'}  ${r.label}`).join('\n') +
  `\n\n${failed.length === 0 ? 'ALL_PASS' : 'SOME_FAIL (' + failed.length + ')'}  [${results.length} checks]\n` +
  (tscErrs.length ? `\n--- tsc errors ---\n${tscErrs.slice(0, 20).join('\n')}\n` : '') +
  `project: ${proj}\n`;
writeFileSync(join(tmpdir(), 'forge-cli-e2e-full.txt'), summary);
console.log(summary);
if (failed.length === 0) { try { rmSync(proj, { recursive: true, force: true }); } catch {} }
process.exit(failed.length === 0 ? 0 : 1);
