// eidos-lib.mjs — shared spine for the Eidos contract harness.
//
// One place defines: where the contract lives, the registry of known verifiers,
// the surface-resolution helpers, and the slug normaliser that joins a component
// across its FOUR surfaces (docs page · @eidos/ui export · Storybook story ·
// registry item). forge-verify / forge-gen / forge-health / check-contract all
// import from here so the bar can never drift between tools.
//
// Zero runtime dependencies (node builtins only), matching packages/cli.
import {
  readFileSync, existsSync, readdirSync, statSync,
} from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(HERE, '..');

export const CONTRACT_PATH = 'packages/registry/eidos.contract.json';
export const SCHEMA_PATH = 'packages/registry/eidos.contract.schema.json';
export const PAGE_STANDARD_PATH = 'docs/ds-page-standard.json';
export const STATE_PATH = 'reports/state.json';
export const HEALTH_PATH = 'EIDOS-HEALTH.md';

export const abs = (p) => (p && p.startsWith('/') ? p : join(ROOT, p));

export function readJSON(p) {
  return JSON.parse(readFileSync(abs(p), 'utf8'));
}

export function loadContract() {
  return readJSON(CONTRACT_PATH);
}

// ── DS_VERSION (single source of truth) ───────────────────────────────────────
export function dsVersion() {
  const src = readFileSync(abs('src/lib/site.ts'), 'utf8');
  const m = src.match(/DS_VERSION\s*=\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

// ── slug normaliser: the join key across the four surfaces ────────────────────
// "MetricCard" / "metric_card" / "metric-card" → "metric-card".
export function toSlug(s) {
  return String(s)
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2') // acronym boundary: JSONInspector→JSON-Inspector, OTPInput→OTP-Input, AILabel→AI-Label
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')     // camelCase boundary: MetricCard→Metric-Card
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── CSF meta title: the `title:` that belongs to the story's meta object (NOT a
//    demo-data `title:` that may precede it, e.g. an AskUser option "Backend / Platform").
export function metaTitle(src) {
  const i = src.search(/(?:const\s+meta\s*=|export\s+default)\s*\{/);
  const region = i >= 0 ? src.slice(i) : src;
  const m = region.match(/title:\s*['"`]([^'"`]+)['"`]/);
  return m ? m[1] : null;
}

// ── recursive file walk (skips node_modules / dist / .next / .turbo) ───────────
const SKIP = new Set(['node_modules', 'dist', '.next', '.turbo', 'storybook-static', '.git']);
export function walk(dirRel, filter = () => true, out = []) {
  const dir = abs(dirRel);
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    const rel = relative(ROOT, full);
    const st = statSync(full);
    if (st.isDirectory()) walk(rel, filter, out);
    else if (filter(rel)) out.push(rel);
  }
  return out;
}

// ── THE VERIFIER REGISTRY ──────────────────────────────────────────────────────
// Every clause names a verifier here. `kind`:
//   - 'script'  : a node script under scripts/ exporting `run({ components, contract })`
//   - 'ext'     : an npm workspace script; shelled out, exit code = pass/fail (repo-level)
//   - 'self'    : check-contract (runs first, separately)
// `ready:false` → not yet implemented; forge-verify reports its clauses as `skip`
// (never blocks) and check-contract still treats the id as resolved. Flip to true
// as each verifier lands. This is the honest path from spine → full coverage.
export const VERIFIERS = {
  // existing repo scripts — shelled out (hasRun:false → never imported, so no import side effects)
  'verify-render':         { kind: 'script', hasRun: false, ready: true,  scope: 'route',  legacyCli: ['verify-render.mjs'] },
  'check-frame-code':      { kind: 'script', hasRun: false, ready: true,  scope: 'page',   legacyCli: ['check-frame-code.mjs'] },
  'check-nav':             { kind: 'script', hasRun: false, ready: true,  scope: 'repo',   legacyCli: ['check-nav.mjs', '--strict'] },
  'check-a11y':            { kind: 'script', hasRun: false, ready: true,  scope: 'route',  legacyCli: ['check-a11y.mjs', '--strict'] },
  'check-visual':          { kind: 'script', hasRun: false, ready: true,  scope: 'route',  legacyCli: ['check-visual.mjs'] },
  'gen-tokens-check':      { kind: 'ext',    npm: 'gen:tokens', args: ['--', '--check'], ready: true, scope: 'repo' },

  // new verifiers (this upgrade) — import + run({component})
  'check-ds-page-structure': { kind: 'script', module: 'check-ds-page-structure.mjs', hasRun: true, ready: true,  scope: 'page' },
  'check-no-page-style':     { kind: 'script', module: 'check-no-page-style.mjs',     hasRun: true, ready: true,  scope: 'page' },
  'check-4-surface-parity':  { kind: 'script', module: 'check-4-surface-parity.mjs',  hasRun: true, ready: true,  scope: 'component' },
  'check-stories':           { kind: 'script', module: 'check-stories.mjs',           hasRun: true, ready: true,  scope: 'component' },
  'check-registry':          { kind: 'script', module: 'check-registry.mjs',          hasRun: true, ready: true,  scope: 'component' },
  'check-contrast-fill':     { kind: 'script', module: 'check-contrast-fill.mjs',     hasRun: true, ready: false, scope: 'route' },
  'check-slop':              { kind: 'script', module: 'check-slop.mjs',              hasRun: true, ready: true,  scope: 'page' },

  // self
  'check-contract':        { kind: 'self', module: 'check-contract.mjs', hasRun: true, ready: true, scope: 'repo' },
};

// EXT:<npm-script> verifiers resolve dynamically (the clause string carries the name).
export function resolveVerifier(id) {
  if (id.startsWith('EXT:')) {
    return { kind: 'ext', npm: id.slice(4), ready: true, scope: 'repo', dynamic: true };
  }
  return VERIFIERS[id] || null;
}

// ── shell helper (for ext verifiers + legacy CLI fallback) ────────────────────
export function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', ...opts });
  return { code: r.status ?? 1, stdout: r.stdout || '', stderr: r.stderr || '' };
}

export function runNpm(script, extra = []) {
  return sh('npm', ['run', script, ...extra]);
}

// ── status helpers ─────────────────────────────────────────────────────────────
export const STATUS = { PASS: 'pass', FAIL: 'fail', PARTIAL: 'partial', WAIVED: 'waived', SKIP: 'skip' };

// A waiver matches if {component,clause} match and it has not expired.
export function findWaiver(contract, component, clause, today) {
  const list = contract.waivers || [];
  return list.find((w) => {
    if (w.component !== component || w.clause !== clause) return false;
    if (w.expires) return new Date(w.expires) >= today;
    return true;
  }) || null;
}

// in-scope check: clause.appliesTo vs component.kind ("all" = wildcard)
export function clauseApplies(clause, comp) {
  const applies = clause.appliesTo || ['component'];
  return applies.includes('all') || applies.includes(comp.kind);
}
