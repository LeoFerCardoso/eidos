// check-contract.mjs — validates packages/registry/eidos.contract.json against
// eidos.contract.schema.json (dependency-free subset validator) PLUS the semantic
// invariants no schema can express: dsVersion mirrors src/lib/site.ts, every clause
// names a verifier the harness knows about, clause ids are unique, every waiver has
// a non-empty reason. Backs clause C-contract-valid.
//
//   node scripts/check-contract.mjs [--json]
//
// Exit 0 when valid; 1 otherwise. Exports run() for forge-verify aggregation.
import { readFileSync } from 'node:fs';
import {
  ROOT, abs, CONTRACT_PATH, SCHEMA_PATH, dsVersion, resolveVerifier,
} from './eidos-lib.mjs';

// ── minimal JSON-Schema validator (the subset our schema uses) ─────────────────
function validate(node, schema, path, errs) {
  if (!schema || typeof schema !== 'object') return;
  if (schema.enum && !schema.enum.includes(node)) {
    errs.push(`${path}: ${JSON.stringify(node)} not in enum [${schema.enum.join(', ')}]`);
  }
  const t = schema.type;
  if (t) {
    const ok =
      (t === 'object' && node && typeof node === 'object' && !Array.isArray(node)) ||
      (t === 'array' && Array.isArray(node)) ||
      (t === 'string' && typeof node === 'string') ||
      (t === 'boolean' && typeof node === 'boolean') ||
      (t === 'number' && typeof node === 'number');
    if (!ok) { errs.push(`${path}: expected ${t}, got ${Array.isArray(node) ? 'array' : typeof node}`); return; }
  }
  if (typeof node === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(node)) errs.push(`${path}: "${node}" fails pattern ${schema.pattern}`);
    if (schema.minLength != null && node.length < schema.minLength) errs.push(`${path}: shorter than minLength ${schema.minLength}`);
  }
  if (Array.isArray(node)) {
    if (schema.minItems != null && node.length < schema.minItems) errs.push(`${path}: fewer than minItems ${schema.minItems}`);
    if (schema.items) node.forEach((it, i) => validate(it, schema.items, `${path}[${i}]`, errs));
  }
  if (node && typeof node === 'object' && !Array.isArray(node)) {
    for (const req of schema.required || []) {
      if (!(req in node)) errs.push(`${path}: missing required "${req}"`);
    }
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties || {}));
      for (const k of Object.keys(node)) {
        if (k.startsWith('$')) continue; // tolerate $schema / $comment
        if (!allowed.has(k)) errs.push(`${path}: unexpected property "${k}"`);
      }
    }
    for (const [k, sub] of Object.entries(schema.properties || {})) {
      if (k in node) validate(node[k], sub, `${path}.${k}`, errs);
    }
  }
}

export function run() {
  const errs = [];
  let contract, schema;
  try { contract = JSON.parse(readFileSync(abs(CONTRACT_PATH), 'utf8')); }
  catch (e) { return { status: 'fail', detail: `cannot read contract: ${e.message}` }; }
  try { schema = JSON.parse(readFileSync(abs(SCHEMA_PATH), 'utf8')); }
  catch (e) { return { status: 'fail', detail: `cannot read schema: ${e.message}` }; }

  validate(contract, schema, '$', errs);

  // semantic invariants
  const ds = dsVersion();
  if (contract.dsVersion && ds && contract.dsVersion !== ds) {
    errs.push(`dsVersion mismatch: contract ${contract.dsVersion} != site.ts ${ds}`);
  }
  const ids = new Set();
  for (const c of contract.clauses || []) {
    if (ids.has(c.id)) errs.push(`duplicate clause id ${c.id}`);
    ids.add(c.id);
    if (!resolveVerifier(c.verifier)) errs.push(`clause ${c.id}: unknown verifier "${c.verifier}"`);
  }
  for (const w of contract.waivers || []) {
    if (!ids.has(w.clause)) errs.push(`waiver references unknown clause ${w.clause}`);
    if (!w.reason || !w.reason.trim()) errs.push(`waiver ${w.component}/${w.clause}: empty reason`);
  }

  return errs.length
    ? { status: 'fail', detail: errs.join('\n  ') , errors: errs }
    : { status: 'pass', detail: `${contract.clauses.length} clauses, ${(contract.components || []).length} components, dsVersion ${contract.dsVersion}` };
}

// ── CLI ────────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const json = process.argv.includes('--json');
  const r = run();
  if (json) console.log(JSON.stringify(r, null, 2));
  else if (r.status === 'pass') console.log(`\x1b[32m✔\x1b[0m contract valid — ${r.detail}`);
  else console.error(`\x1b[31m✘\x1b[0m contract invalid:\n  ${r.detail}`);
  process.exit(r.status === 'pass' ? 0 : 1);
}
