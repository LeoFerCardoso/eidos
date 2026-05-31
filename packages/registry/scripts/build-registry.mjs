// build-registry.mjs — flattens registry.json into static per-item JSON under
// public/r/<name>.json (shadcn `build`-compatible output) plus a public/r/registry.json
// index. Each file's `content` is inlined from disk so a consumer's CLI never has
// to fetch the source separately.
//
//   node scripts/build-registry.mjs
//
// Source resolution: a file `source` is read relative to the registry package
// root; `styles/*` sources fall back to the canonical @eidos/ui package so the
// design tokens + ds.css layer stay single-sourced.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(HERE, '..'); // packages/registry
const UI = resolve(PKG, '..', 'ui'); // packages/ui (canonical CSS)
const OUT = join(PKG, 'public', 'r');

const registry = JSON.parse(readFileSync(join(PKG, 'registry.json'), 'utf8'));

function resolveSource(source) {
  const local = join(PKG, source);
  if (existsSync(local)) return local;
  if (source.startsWith('styles/')) {
    const inUi = join(UI, source);
    if (existsSync(inUi)) return inUi;
  }
  throw new Error(`Registry source not found: ${source}`);
}

mkdirSync(OUT, { recursive: true });

const index = [];
for (const item of registry.items) {
  const files = (item.files || []).map((f) => {
    const abs = resolveSource(f.source);
    return {
      path: f.target || f.source,
      target: f.target,
      type: f.type,
      content: readFileSync(abs, 'utf8'),
    };
  });

  const out = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.dependencies ? { dependencies: item.dependencies } : {}),
    ...(item.devDependencies ? { devDependencies: item.devDependencies } : {}),
    ...(item.registryDependencies ? { registryDependencies: item.registryDependencies } : {}),
    ...(item.cssVars ? { cssVars: item.cssVars } : {}),
    ...(item.css ? { css: item.css } : {}),
    files,
  };

  writeFileSync(join(OUT, `${item.name}.json`), JSON.stringify(out, null, 2) + '\n');
  index.push({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    registryDependencies: item.registryDependencies || [],
    dependencies: item.dependencies || [],
  });
}

writeFileSync(
  join(OUT, 'registry.json'),
  JSON.stringify({ name: registry.name, homepage: registry.homepage, items: index }, null, 2) + '\n',
);

console.log(`Built ${registry.items.length} registry items → packages/registry/public/r/`);
for (const i of index) console.log(`  • ${i.name} (${i.type})${i.registryDependencies.length ? '  ← ' + i.registryDependencies.join(', ') : ''}`);
