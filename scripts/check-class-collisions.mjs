#!/usr/bin/env node
// check-class-collisions — deterministic gate for DS class × Tailwind-utility
// name collisions.
//
// WHY (the bug this prevents): the DS styles component variants as bare modifier
// classes appended to a base, e.g. `.btn.outline`, `.pg.outline`, `.tg.outline`.
// The Button emits `class="btn outline sm"`. Tailwind v4 (PostCSS) generates a
// bare `.outline` UTILITY (`outline-style: solid; outline-width: 1px`) with NO
// colour → it falls back to `currentColor` (= --fg, white) and paints a 1px white
// outline on top of EVERY outline button, system-wide. It cost four round-trips
// to find because the symptom looks like a `border`, but the culprit is the CSS
// `outline` property injected by the utility whose name collides with the DS
// modifier. Fix lives in tokens.css: `.btn.outline:not(:focus-visible){ outline:
// 2px solid transparent }` (neutralise at rest, keep the focus ring).
//
// WHAT this checks: every class token the DS authors in a selector (packages/ui/
// styles/*.css + src/styles/*.css) that equals a bare Tailwind utility name. Each
// such collision MUST be in ALLOWLIST below — either neutralised (a required
// regex must be present) or justified as benign. A NEW, unlisted collision fails
// the build, forcing a human to neutralise + document it (like .outline) or
// rename the DS modifier. Tailwind utilities are generated at build time, so we
// compare against a curated list of bare (single-token) v4 utilities, not a grep.
//
// HARD FAIL (exit 1): a colliding modifier that is not in ALLOWLIST, or an
// allowlisted-as-neutralised token whose neutraliser regex is missing.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CWD = process.cwd();
const CSS_DIRS = ['packages/ui/styles', 'src/styles'];

// Bare (single-token, no dash) Tailwind v4 utilities that emit real declarations
// — the only utilities whose NAME can collide with a DS bare modifier class.
// Dashed utilities (text-sm, bg-red-500, outline-2 …) can never collide with the
// DS's bare variant tokens (outline / ghost / ember / sm …), so they are omitted.
const TW_UTILITIES = new Set([
  'block', 'inline', 'flex', 'grid', 'table', 'contents', 'hidden', 'isolate',
  'static', 'fixed', 'absolute', 'relative', 'sticky', 'visible', 'invisible',
  'container', 'border', 'rounded', 'shadow', 'ring', 'outline', 'truncate',
  'italic', 'underline', 'overline', 'uppercase', 'lowercase', 'capitalize',
  'antialiased', 'blur', 'invert', 'grayscale', 'sepia', 'transform', 'transition',
]);

// Every collision MUST be listed here. `neutralizer` (when set) is asserted to be
// present in `file` — the proof the collision is defused. No `neutralizer` means
// the Tailwind utility's effect is the SAME as the DS modifier's intent (benign),
// with a written reason.
const ALLOWLIST = {
  outline: {
    reason:
      'Tailwind .outline (outline-style:solid;outline-width:1px → white currentColor) painted on every .btn/.pg/.tg .outline. Neutralised at rest in tokens.css; focus ring kept via :focus-visible.',
    neutralizer: {
      file: 'packages/ui/styles/tokens.css',
      // .btn.outline:not(:focus-visible) { … outline: … }
      regex: /\.btn\.outline:not\(:focus-visible\)\s*\{[^}]*\boutline\s*:/,
    },
  },
  block: {
    reason:
      'DS uses .block as a modifier on .ai-math / .fc; Tailwind .block sets display:block, which matches the intended block layout. Benign.',
  },
  grid: {
    reason:
      'DS uses .grid inside .ds-hero; Tailwind .grid sets display:grid, which is exactly the intended layout. Benign.',
  },
  sticky: {
    reason:
      'DS uses .sticky on sticky table headers; Tailwind .sticky sets position:sticky, the intended effect. Benign.',
  },
};

// Strip block + line comments so selector text inside /* … */ never trips the
// scan (keep it simple — we only need clean selectors, not line numbers).
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

function cssFiles() {
  const out = [];
  for (const dir of CSS_DIRS) {
    const abs = join(CWD, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) if (f.endsWith('.css')) out.push([dir, f, join(abs, f)]);
  }
  return out;
}

// token -> Set("dir/file :: selector") of where the colliding modifier appears.
const found = {};
for (const [dir, f, abs] of cssFiles()) {
  const css = stripComments(readFileSync(abs, 'utf8'));
  const ruleRe = /([^{}]+)\{/g;
  let m;
  while ((m = ruleRe.exec(css))) {
    const sel = m[1].trim();
    if (!sel || sel.startsWith('@')) continue; // skip at-rules (@media, @keyframes…)
    const classes = sel.match(/\.[a-zA-Z][\w-]*/g) || [];
    for (const c of classes) {
      const name = c.slice(1);
      if (TW_UTILITIES.has(name)) {
        (found[name] ||= new Set()).add(`${dir}/${f} :: ${sel.slice(0, 80)}`);
      }
    }
  }
}

const errors = [];
const handled = [];
for (const [token, where] of Object.entries(found)) {
  const entry = ALLOWLIST[token];
  if (!entry) {
    errors.push(
      `NEW collision: the DS authors a ".${token}" class, but ".${token}" is a Tailwind utility.\n` +
        `      Seen in: ${[...where].slice(0, 4).join('\n               ')}\n` +
        `      Fix: neutralise it (see ".btn.outline:not(:focus-visible)" in tokens.css) OR rename the DS modifier,\n` +
        `      then add ".${token}" to ALLOWLIST in scripts/check-class-collisions.mjs with a reason.`,
    );
    continue;
  }
  if (entry.neutralizer) {
    const nf = join(CWD, entry.neutralizer.file);
    const ok = existsSync(nf) && entry.neutralizer.regex.test(readFileSync(nf, 'utf8'));
    if (!ok) {
      errors.push(
        `".${token}" is allowlisted as NEUTRALISED, but the neutraliser is missing/changed in ${entry.neutralizer.file}.\n` +
          `      Expected a rule matching ${entry.neutralizer.regex}. Restore it or update ALLOWLIST.`,
      );
      continue;
    }
    handled.push(`.${token} (neutralised in ${entry.neutralizer.file})`);
  } else {
    handled.push(`.${token} (benign: ${entry.reason.split('.')[0]})`);
  }
}

if (errors.length) {
  console.error('✗ check-class-collisions — DS class × Tailwind utility collision\n');
  for (const e of errors) console.error('  • ' + e + '\n');
  console.error(`${errors.length} collision issue(s). See header of scripts/check-class-collisions.mjs.`);
  process.exit(1);
}

console.log(
  `✓ check-class-collisions — ${handled.length} known DS×Tailwind collision(s) handled, no new ones.`,
);
for (const h of handled) console.log('    · ' + h);
