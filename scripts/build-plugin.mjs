// Assembles the distributable `plugin/eidos-harness/` from the live `.claude/` harness,
// so the same agents/skills/commands/hooks/content that work in this repo can be installed
// in other repos via the marketplace. Run: `npm run build:plugin`.
//
// Portability: every `.claude/` path reference in copied text (and hook commands) is
// rewritten to `${CLAUDE_PLUGIN_ROOT}/` so it resolves when installed elsewhere.
import { cpSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const claude = resolve(root, '.claude');
const out = resolve(root, 'plugin/eidos-harness');

// Scanned component dirs + reference-content dirs the skills read by path.
const dirs = ['agents', 'skills', 'commands', 'output-styles', 'design-systems', 'craft'];
for (const dir of dirs) {
  const src = resolve(claude, dir);
  const dst = resolve(out, dir);
  rmSync(dst, { recursive: true, force: true });
  if (existsSync(src)) cpSync(src, dst, { recursive: true });
}

// Rewrite `.claude/` -> `${CLAUDE_PLUGIN_ROOT}/` in every text file under the plugin.
const PLUGIN_ROOT = '${CLAUDE_PLUGIN_ROOT}';
function rewrite(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) rewrite(p);
    else if (/\.(md|mjs|txt|json)$/.test(name)) {
      const before = readFileSync(p, 'utf8');
      const after = before.split('.claude/').join(PLUGIN_ROOT + '/');
      if (after !== before) writeFileSync(p, after);
    }
  }
}
rewrite(out);

// Translate settings.json hooks -> plugin hooks/hooks.json with portable command paths.
const settings = JSON.parse(readFileSync(resolve(claude, 'settings.json'), 'utf8'));
const hooks = JSON.parse(JSON.stringify(settings.hooks || {}));
for (const event of Object.values(hooks)) {
  for (const matcher of event) {
    for (const h of matcher.hooks || []) {
      if (h.command) h.command = h.command.replace(/node \.claude\/hooks\//g, `node ${PLUGIN_ROOT}/hooks/`);
    }
  }
}
mkdirSync(resolve(out, 'hooks'), { recursive: true });
cpSync(resolve(claude, 'hooks'), resolve(out, 'hooks'), { recursive: true });
writeFileSync(resolve(out, 'hooks/hooks.json'), JSON.stringify({ hooks }, null, 2) + '\n');

const count = (d) => (existsSync(resolve(out, d)) ? readdirSync(resolve(out, d)).length : 0);
console.log(
  `Built plugin/eidos-harness from .claude/ (agents:${count('agents')} skills:${count('skills')} ` +
    `commands:${count('commands')} design-systems:${count('design-systems')}). Paths -> \${CLAUDE_PLUGIN_ROOT}.`,
);
