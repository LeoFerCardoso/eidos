// build-registry-manifest.mjs — assemble packages/registry/registry.json from the
// component slices produced by extract-registry.mjs (registry.generated.json).
//
// Items:
//   forge        registry:style — base layer (tokens.css + ds.css + cn). Prereq for all.
//   forge-ai     registry:file  — the AI stylesheet (ai.css). Prereq for AI components only,
//                                  so non-AI installs don't pull 118KB of AI CSS.
//   <component>  registry:ui    — one per curated component; registryDependencies =
//                                  [forge (+forge-ai if AI), ...component deps]; dependencies = npm.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const REG = join(ROOT, 'packages/registry');

const gen = JSON.parse(readFileSync(join(REG, 'registry.generated.json'), 'utf8'));
const TITLE = (s) => s.replace(/(^|-)([a-z])/g, (_, d, c) => (d ? ' ' : '') + c.toUpperCase()).trim();

const items = [];

items.push({
  name: 'forge',
  type: 'registry:style',
  title: 'Forge base',
  description:
    'The Forge design-system foundation — semantic design tokens (OKLCH, light + dark), the shared ds.css component layer, and the cn() class helper. Install this once before adding any component.',
  dependencies: ['clsx', 'tailwind-merge'],
  registryDependencies: [],
  files: [
    { source: 'styles/tokens.css', type: 'registry:file', target: 'styles/forge/tokens.css' },
    { source: 'styles/ds.css', type: 'registry:file', target: 'styles/forge/ds.css' },
    { source: 'src/forge/lib/utils.ts', type: 'registry:lib', target: 'lib/utils.ts' },
  ],
});

items.push({
  name: 'forge-ai',
  type: 'registry:file',
  title: 'Forge AI styles',
  description: 'The ai.css layer that styles the Forge AI components (.ai-* classes). Pulled automatically when you add an AI component.',
  registryDependencies: ['forge'],
  files: [{ source: 'styles/ai.css', type: 'registry:file', target: 'styles/forge/ai.css' }],
});

for (const it of gen.items) {
  const regDeps = ['forge', ...(it.ai ? ['forge-ai'] : []), ...it.deps];
  items.push({
    name: it.name,
    type: 'registry:ui',
    title: TITLE(it.name),
    description: `Forge ${TITLE(it.name)} component.`,
    ...(it.npm.length ? { dependencies: it.npm } : {}),
    registryDependencies: [...new Set(regDeps)],
    files: [{ source: `src/forge/${it.name}.tsx`, type: 'registry:ui', target: `components/forge/${it.name}.tsx` }],
  });
}

const out = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'forge',
  homepage: 'https://eidos.equifax.dev',
  items,
};
writeFileSync(join(REG, 'registry.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`MANIFEST_ITEMS=${items.length}`);
console.log(`AI_ITEMS=${gen.items.filter((i) => i.ai).length}`);
console.log(`WITH_NPM=${gen.items.filter((i) => i.npm.length).length}`);
