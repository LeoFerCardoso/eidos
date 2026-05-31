// eidos — the Eidos Design System CLI.
//
// "Own the code, copied not imported": `init` installs the Eidos base layer
// (design tokens + ds.css + cn) once, then `add <component>` copies a component's
// source into your repo, resolving its registry dependencies topologically.
//
// The registry is shadcn-`registry-item.json`-schema compatible, so the same
// items also work with `npx shadcn@latest add <url>`. This CLI is the branded,
// zero-dependency wrapper (node builtins only).
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync,
} from 'node:fs';
import { join, dirname, resolve, isAbsolute } from 'node:path';
import { spawnSync } from 'node:child_process';

const C = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  ember: (s) => `\x1b[38;5;208m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};
const ok = (s) => console.log(`${C.green('✔')} ${s}`);
const info = (s) => console.log(`${C.cyan('›')} ${s}`);
const note = (s) => console.log(`  ${C.dim(s)}`);

const CONFIG_FILE = 'components.json';
const DEFAULT_CONFIG = {
  $schema: 'https://eidos.equifax.dev/schema/components.json',
  registry: 'https://eidos.equifax.dev/r',
  aliases: { components: 'components', ui: 'components/forge', lib: 'lib', styles: 'styles' },
  rsc: false,
  tsx: true,
};

// ── arg parsing ────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { flags[key] = next; i++; }
      else flags[key] = true;
    } else positional.push(a);
  }
  return { positional, flags };
}

// ── config ──────────────────────────────────────────────────────────────────
function loadConfig(cwd, flags) {
  const path = join(cwd, CONFIG_FILE);
  let cfg = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { ...DEFAULT_CONFIG };
  if (flags.registry) cfg.registry = flags.registry;
  return cfg;
}

// ── registry fetch (http(s) URL or local path) ───────────────────────────────
async function fetchItem(registry, name) {
  if (/^https?:\/\//.test(registry)) {
    const url = `${registry.replace(/\/$/, '')}/${name}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not fetch ${name} from ${url} (${res.status})`);
    return res.json();
  }
  const base = isAbsolute(registry) ? registry : resolve(process.cwd(), registry);
  const file = join(base, `${name}.json`);
  if (!existsSync(file)) throw new Error(`Registry item not found: ${file}`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

async function fetchIndex(registry) {
  const idx = await fetchItem(registry, 'registry');
  return idx.items || [];
}

// ── topological resolution of registryDependencies ───────────────────────────
async function resolveGraph(registry, names) {
  const items = new Map();
  const order = [];
  async function visit(name, stack) {
    if (items.has(name)) return;
    if (stack.includes(name)) throw new Error(`Cyclic registry dependency: ${[...stack, name].join(' → ')}`);
    const item = await fetchItem(registry, name);
    for (const dep of item.registryDependencies || []) {
      // External registry deps (full URLs) are passed through, not recursed.
      if (/^https?:\/\//.test(dep)) continue;
      await visit(dep, [...stack, name]);
    }
    items.set(name, item);
    order.push(item);
  }
  for (const n of names) await visit(n, []);
  return order; // dependencies first
}

// ── file writing with alias remap ─────────────────────────────────────────────
function remapTarget(target, aliases) {
  // Targets are emitted as e.g. "components/forge/status-dot.tsx", "lib/utils.ts",
  // "styles/forge/tokens.css". Remap the leading segment via the alias map so a
  // project can relocate where Eidos files land.
  const seg = target.split('/')[0];
  const rest = target.split('/').slice(1).join('/');
  if (seg === 'components' && aliases.components && aliases.components !== 'components') {
    return join(aliases.components, rest);
  }
  if (seg === 'lib' && aliases.lib && aliases.lib !== 'lib') return join(aliases.lib, rest);
  if (seg === 'styles' && aliases.styles && aliases.styles !== 'styles') return join(aliases.styles, rest);
  return target;
}

function writeFiles(cwd, item, aliases, { force }) {
  const written = [];
  for (const f of item.files || []) {
    const target = remapTarget(f.target || f.path, aliases);
    const abs = join(cwd, target);
    if (existsSync(abs) && !force) { note(`skip (exists): ${target}  ${C.dim('— use --force to overwrite')}`); continue; }
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, f.content);
    written.push(target);
  }
  return written;
}

// ── npm dep install ──────────────────────────────────────────────────────────
function detectPM(cwd) {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun';
  return 'npm';
}
function installDeps(cwd, deps, { noInstall }) {
  if (!deps.length) return;
  const pm = detectPM(cwd);
  const addCmd = pm === 'npm' ? ['install'] : ['add'];
  if (noInstall) { note(`would install (${pm}): ${deps.join(' ')}`); return; }
  info(`installing deps (${pm}): ${deps.join(' ')}`);
  const r = spawnSync(pm, [...addCmd, ...deps], { cwd, stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`dependency install failed (${pm})`);
}

// ── commands ──────────────────────────────────────────────────────────────────
async function cmdInit(cwd, flags) {
  const cfg = loadConfig(cwd, flags);
  const path = join(cwd, CONFIG_FILE);
  if (!existsSync(path) || flags.force) {
    writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n');
    ok(`wrote ${CONFIG_FILE}`);
  } else {
    info(`${CONFIG_FILE} already exists`);
  }
  // The base style item carries the tokens + ds.css layer + cn.
  const graph = await resolveGraph(cfg.registry, ['forge']);
  const deps = new Set();
  for (const item of graph) {
    const written = writeFiles(cwd, item, cfg.aliases, { force: flags.force });
    for (const w of written) ok(`added ${w}`);
    for (const d of item.dependencies || []) deps.add(d);
  }
  installDeps(cwd, [...deps], { noInstall: !!flags['no-install'] });
  console.log();
  ok(C.bold('Eidos base installed.'));
  note('Import the layer in your global stylesheet (order matters):');
  note(`  @import "./${cfg.aliases.styles}/eidos/tokens.css";`);
  note(`  @import "./${cfg.aliases.styles}/eidos/ds.css";`);
  note(`Then: ${C.ember('eidos add <component>')}`);
}

async function cmdAdd(cwd, names, flags) {
  if (!names.length) throw new Error('Usage: eidos add <component...>');
  const cfg = loadConfig(cwd, flags);
  // Always ensure the base is present in the graph.
  const graph = await resolveGraph(cfg.registry, names.includes('forge') ? names : ['forge', ...names]);
  const deps = new Set();
  let any = false;
  for (const item of graph) {
    const written = writeFiles(cwd, item, cfg.aliases, { force: flags.force });
    for (const w of written) { ok(`added ${w}  ${C.dim('(' + item.name + ')')}`); any = true; }
    for (const d of item.dependencies || []) deps.add(d);
  }
  installDeps(cwd, [...deps], { noInstall: !!flags['no-install'] });
  console.log();
  if (any) ok(C.bold(`Added: ${names.join(', ')}`));
  else info('Nothing to write (already installed). Use --force to overwrite.');
}

async function cmdList(cwd, flags) {
  const cfg = loadConfig(cwd, flags);
  const items = await fetchIndex(cfg.registry);
  console.log(C.bold('\nEidos registry') + C.dim(`  (${cfg.registry})\n`));
  for (const i of items) {
    const dep = (i.registryDependencies || []).filter((d) => d !== 'forge');
    console.log(`  ${C.ember(i.name.padEnd(20))} ${C.dim(i.type.replace('registry:', ''))}`);
    if (i.description) console.log(`    ${C.dim(i.description)}`);
    if (dep.length) console.log(`    ${C.dim('needs: ' + dep.join(', '))}`);
  }
  console.log();
}

async function cmdDiff(cwd, names, flags) {
  if (!names.length) throw new Error('Usage: eidos diff <component>');
  const cfg = loadConfig(cwd, flags);
  let drift = 0;
  for (const name of names) {
    const item = await fetchItem(cfg.registry, name);
    for (const f of item.files || []) {
      const target = remapTarget(f.target || f.path, cfg.aliases);
      const abs = join(cwd, target);
      if (!existsSync(abs)) { note(`${target}: not installed`); continue; }
      const local = readFileSync(abs, 'utf8');
      if (local === f.content) ok(`${target}: up to date`);
      else { console.log(`${C.red('~')} ${target}: ${C.red('differs from upstream')}`); drift++; }
    }
  }
  if (drift) info(`${drift} file(s) differ. Re-run ${C.ember('eidos add ' + names.join(' ') + ' --force')} to update.`);
}

function help() {
  console.log(`
${C.ember(C.bold('eidos'))} — the Eidos Design System CLI

${C.bold('Usage')}
  eidos <command> [components...] [options]

${C.bold('Commands')}
  init                 Set up the project and install the Eidos base layer
  add <component...>   Copy component(s) into your repo (with their deps)
  list                 List components available in the registry
  diff <component...>  Compare installed files against the registry

${C.bold('Options')}
  --registry <url|path>   Registry base (default from components.json)
  --force                 Overwrite existing files
  --no-install            Copy files but don't install npm dependencies
  -h, --help              Show this help
`);
}

export async function run(argv) {
  const { positional, flags } = parseArgs(argv);
  const [command, ...rest] = positional;
  const cwd = process.cwd();
  if (flags.help || flags.h || !command) return help();
  switch (command) {
    case 'init': return cmdInit(cwd, flags);
    case 'add': return cmdAdd(cwd, rest, flags);
    case 'list': return cmdList(cwd, flags);
    case 'diff': return cmdDiff(cwd, rest, flags);
    default: throw new Error(`Unknown command: ${command}. Run 'eidos --help'.`);
  }
}
