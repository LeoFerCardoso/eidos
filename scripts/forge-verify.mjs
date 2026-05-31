// forge-verify.mjs — THE aggregate gate. The single layer the harness was missing,
// and the only thing that may declare a component "Done".
//
//   forge:verify [--component <slug> | --all] [--surface <s>] [--clause <C-id>]
//                [--strict] [--dry] [--json] [--heavy] [--fix]
//
// Reads packages/registry/forge.contract.json, runs check-contract first, then for
// each in-scope component x applicable clause executes the clause's verifier ONCE
// (memoized), applies waivers, and emits reports/state.json + regenerates
// FORGE-HEALTH.md. Exit nonzero (under --strict) iff a gate:"block" clause is `fail`
// (not waived/skip) for an in-scope component. --dry resolves the plan without
// executing (Phase-0 gate). --fix runs only safe gen-* generators then re-verifies.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  ROOT, abs, loadContract, dsVersion, resolveVerifier, VERIFIERS,
  STATE_PATH, STATUS, findWaiver, clauseApplies, sh, runNpm,
} from './forge-lib.mjs';
import { renderHealth } from './forge-health.mjs';

const C = { g: (s) => `\x1b[32m${s}\x1b[0m`, r: (s) => `\x1b[31m${s}\x1b[0m`, y: (s) => `\x1b[33m${s}\x1b[0m`, d: (s) => `\x1b[2m${s}\x1b[0m`, b: (s) => `\x1b[1m${s}\x1b[0m` };

function parseArgs(argv) {
  const f = { surface: null, component: null, clause: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--all') f.all = true;
    else if (a === '--strict') f.strict = true;
    else if (a === '--dry') f.dry = true;
    else if (a === '--json') f.json = true;
    else if (a === '--heavy') f.heavy = true;
    else if (a === '--static') f.static = true;
    else if (a === '--fix') f.fix = true;
    else if (a === '--component') f.component = argv[++i];
    else if (a === '--surface') f.surface = argv[++i];
    else if (a === '--clause') f.clause = argv[++i];
  }
  return f;
}

const isHeavy = (v, id) => v.scope === 'route' || /sb:test/.test(id);

async function execVerifier(id, clause, scope, flags) {
  const v = resolveVerifier(id);
  if (!v) return { status: STATUS.FAIL, detail: `unknown verifier ${id}` };
  if (!v.ready) return { status: STATUS.SKIP, detail: 'verifier not yet implemented (pending)' };
  if (isHeavy(v, id) && !flags.heavy) return { status: STATUS.SKIP, detail: 'route-level gate — run with --heavy (or CI)' };
  if (v.kind === 'ext' && flags.static) return { status: STATUS.SKIP, detail: 'ext gate — skipped (--static)' };

  if (v.kind === 'ext') {
    const name = v.npm;
    const res = runNpm(name, v.args || []);
    return res.code === 0
      ? { status: STATUS.PASS, detail: `${name} ok` }
      : { status: STATUS.FAIL, detail: `${name} exit ${res.code}` };
  }
  // kind === 'script'. New verifiers (hasRun) import + run({component}) in-process;
  // existing scripts (hasRun:false) are shelled out so their import side effects never fire.
  if (v.hasRun && v.module) {
    try {
      const mod = await import(`./${v.module}`);
      if (typeof mod.run === 'function') return await mod.run({ contract: scope.contract, components: scope.components, clause });
      return { status: STATUS.SKIP, detail: `${v.module} has no run() export` };
    } catch (e) {
      return { status: STATUS.FAIL, detail: `verifier error: ${e.message}` };
    }
  }
  if (v.legacyCli) {
    const res = sh('node', [`scripts/${v.legacyCli[0]}`, ...v.legacyCli.slice(1)]);
    return res.code === 0 ? { status: STATUS.PASS, detail: 'ok' } : { status: STATUS.FAIL, detail: `exit ${res.code}` };
  }
  return { status: STATUS.SKIP, detail: 'no run() and no legacy cli' };
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const contract = loadContract();
  const today = new Date();

  // 1) contract first
  const { run: contractRun } = await import('./check-contract.mjs');
  const cValid = contractRun();
  if (cValid.status !== STATUS.PASS) {
    console.error(C.r('✘ contract invalid — fix before verifying:'));
    console.error('  ' + cValid.detail);
    process.exit(1);
  }

  // 2) scope: clauses (filter by --surface/--clause) and components (filter by --component)
  let clauses = contract.clauses;
  if (flags.surface) clauses = clauses.filter((c) => c.surface === flags.surface);
  if (flags.clause) clauses = clauses.filter((c) => c.id === flags.clause);

  const allComponents = contract.components || [];
  let components = allComponents;
  if (flags.component) components = allComponents.filter((c) => c.name === flags.component);

  // ── DRY: resolve the plan, do not execute ──
  if (flags.dry) {
    let unresolved = 0;
    console.log(C.b(`forge:verify --dry · ${clauses.length} clauses · ${components.length || allComponents.length} components`));
    for (const cl of clauses) {
      const v = resolveVerifier(cl.verifier);
      const tag = !v ? C.r('UNRESOLVED') : v.ready ? (isHeavy(v, cl.verifier) ? C.y('ready·heavy') : C.g('ready')) : C.y('pending');
      if (!v) unresolved++;
      console.log(`  ${cl.id.padEnd(20)} ${C.d(cl.gate.padEnd(8))} ${cl.verifier.padEnd(26)} ${tag}`);
    }
    console.log(unresolved ? C.r(`\n✘ ${unresolved} unresolved verifier(s)`) : C.g('\n✔ every clause resolves to a known verifier'));
    process.exit(unresolved ? 1 : 0);
  }

  // ── --fix: run safe generators then continue ──
  if (flags.fix) {
    for (const g of ['gen:nav', 'gen:migrated', 'gen:examples', 'gen:props', 'gen:tokens', 'registry:build']) runNpm(g);
  }

  // 3) execute: each clause's verifier once; map result onto in-scope components.
  const scope = { contract, components: components.length ? components : allComponents };
  const state = {
    contractVersion: contract.version,
    dsVersion: dsVersion(),
    commit: (sh('git', ['rev-parse', '--short', 'HEAD']).stdout || '').trim() || null,
    generatedAt: today.toISOString(),
    summary: { components: 0, done: 0, blockFails: 0, waived: 0, advisoryFails: 0, skipped: 0 },
    surfaces: {},
    repoGates: {},
    components: {},
  };

  // execute each clause verifier once (memoize identical verifier+args could be added later)
  const clauseResult = {};
  for (const cl of clauses) {
    const out = await execVerifier(cl.verifier, cl, scope, flags);
    clauseResult[cl.id] = out;
  }

  // assemble per-component state
  const surfaceTally = {};
  for (const comp of scope.components) {
    const entry = { kind: comp.kind, ds: comp.ds, status: STATUS.PASS, clauses: {} };
    let anyBlockFail = false; let anyFail = false;
    for (const cl of clauses) {
      if (!clauseApplies(cl, comp)) continue;
      const raw = clauseResult[cl.id];
      let res = raw.byComponent ? (raw.byComponent[comp.name] || { status: STATUS.SKIP, detail: 'not reported' }) : raw;
      let status = res.status;
      // apply waiver on a fail
      if (status === STATUS.FAIL) {
        const w = findWaiver(contract, comp.name, cl.id, today);
        if (w) { status = STATUS.WAIVED; res = { ...res, detail: `waiver: ${w.reason}${w.expires ? ` (expires ${w.expires})` : ''}` }; }
      }
      entry.clauses[cl.id] = { status, gate: cl.gate, surface: cl.surface, ...(res.detail ? { detail: res.detail } : {}) };
      // tallies
      if (status === STATUS.FAIL) { anyFail = true; if (cl.gate === 'block') anyBlockFail = true; else state.summary.advisoryFails++; }
      if (status === STATUS.WAIVED) state.summary.waived++;
      if (status === STATUS.SKIP) state.summary.skipped++;
      // surface coverage (existence-ish: pass or waived counts)
      surfaceTally[cl.surface] = surfaceTally[cl.surface] || { ok: 0, n: 0 };
      surfaceTally[cl.surface].n++;
      if (status === STATUS.PASS || status === STATUS.WAIVED) surfaceTally[cl.surface].ok++;
    }
    entry.status = anyBlockFail ? STATUS.FAIL : anyFail ? STATUS.PARTIAL : STATUS.PASS;
    if (entry.status === STATUS.FAIL) state.summary.blockFails++;
    if (entry.status === STATUS.PASS) state.summary.done++;
    state.components[comp.name] = entry;
  }
  state.summary.components = scope.components.length;
  for (const [s, t] of Object.entries(surfaceTally)) state.surfaces[s] = t.n ? +(t.ok / t.n).toFixed(2) : 1;

  // repo-level gate snapshot (for clauses that have no component binding yet)
  for (const cl of clauses) state.repoGates[cl.id] = { status: clauseResult[cl.id].status || 'mixed', gate: cl.gate };

  // 4) write state + regenerate health
  mkdirSync(dirname(abs(STATE_PATH)), { recursive: true });
  writeFileSync(abs(STATE_PATH), JSON.stringify(state, null, 2) + '\n');
  writeFileSync(abs('FORGE-HEALTH.md'), renderHealth(state, contract));

  // 5) report + exit
  if (flags.json) { console.log(JSON.stringify(state, null, 2)); }
  else {
    console.log(C.b(`\nforge:verify · contract ${state.contractVersion} · DS ${state.dsVersion}`));
    if (!scope.components.length) console.log(C.y('  (no components in contract yet — run `npm run gen:contract` to sync them)'));
    console.log(`  ${state.summary.done}/${state.summary.components} done · ${C.r(state.summary.blockFails + ' block-fail')} · ${C.y(state.summary.waived + ' waived')} · ${state.summary.advisoryFails} advisory · ${C.d(state.summary.skipped + ' skipped')}`);
    // repo-gate one-liners for unbound/repo clauses
    for (const cl of clauses) {
      const r = clauseResult[cl.id];
      if (r.byComponent) continue;
      const mark = r.status === 'pass' ? C.g('✔') : r.status === 'skip' ? C.d('·') : (cl.gate === 'block' ? C.r('✘') : C.y('!'));
      console.log(`  ${mark} ${cl.id.padEnd(20)} ${C.d(r.detail || r.status)}`);
    }
    console.log(C.d(`\n  → reports/state.json · FORGE-HEALTH.md`));
  }

  const hardFail = state.summary.blockFails > 0 ||
    clauses.some((cl) => cl.gate === 'block' && !clauseResult[cl.id].byComponent && clauseResult[cl.id].status === 'fail');
  process.exit(flags.strict && hardFail ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
