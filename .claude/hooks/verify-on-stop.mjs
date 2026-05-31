#!/usr/bin/env node
// Stop hook — the genuinely missing gate. When a task ends, derive the components
// touched this session (from `git diff --name-only`), map each changed file to the
// component(s) whose contract surfaces include it, and run the fast static slice of
// forge:verify for them. If any gate:"block" clause FAILS (not waived), block the
// stop (exit 2) and surface the failing clauses so the model fixes before finishing.
// "The verifier's green beats your opinion." Defensive: no git / no contract / no
// changed components → allow (exit 0).
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const sh = (cmd) => { try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { return ''; } };

function changedFiles() {
  const out = [sh('git diff --name-only'), sh('git diff --name-only --cached'), sh('git ls-files --others --exclude-standard')].join('\n');
  return [...new Set(out.split('\n').map((s) => s.trim()).filter(Boolean))];
}

function main() {
  const contractPath = resolve(ROOT, 'packages/registry/forge.contract.json');
  if (!existsSync(contractPath)) process.exit(0);
  let contract;
  try { contract = JSON.parse(readFileSync(contractPath, 'utf8')); } catch { process.exit(0); }
  const files = changedFiles();
  if (!files.length) process.exit(0);

  // map changed files → components whose surfaces include them
  const touched = new Set();
  for (const comp of contract.components || []) {
    const s = comp.surfaces || {};
    const surfaceFiles = [s.docs, s.exportFile, s.story, s.registrySrc].filter(Boolean);
    if (surfaceFiles.some((sf) => files.some((f) => f.endsWith(sf) || sf.endsWith(f)))) touched.add(comp.name);
  }
  if (!touched.size) process.exit(0);

  const slugs = [...touched].slice(0, 12); // cap the Stop check
  const failing = [];
  for (const slug of slugs) {
    const out = sh(`node scripts/forge-verify.mjs --component ${slug} --static --strict --json`);
    let state;
    try { state = JSON.parse(out); } catch { continue; }
    const comp = state.components?.[slug];
    if (!comp) continue;
    for (const [id, c] of Object.entries(comp.clauses || {})) {
      if (c.status === 'fail' && c.gate === 'block') failing.push(`${slug} · ${id}${c.detail ? ` — ${c.detail}` : ''}`);
    }
  }

  if (failing.length) {
    process.stderr.write(
      `Stop blocked by forge:verify — ${failing.length} block-clause failure(s) on touched component(s):\n` +
      failing.map((l) => `  • ${l}`).join('\n') +
      `\nFix these (or add a reviewed waiver in forge.contract.json) and re-verify with \`npm run forge:verify -- --component <slug> --strict\`.\n`,
    );
    process.exit(2);
  }
  process.exit(0);
}
main();
