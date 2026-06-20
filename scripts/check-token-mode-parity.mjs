// Token mode-parity gate — the safe realization of "you cannot forget a light/dark
// variant," the authoring-time safety a `light-dark()` rewrite would buy, WITHOUT the
// runtime/DTCG ripple or cross-theme visual risk.
//
// Rule: for every theme, each *color-valued* token declared in the theme's DARK block
// must EITHER have an explicit override in that theme's LIGHT block, OR be listed in
// tokens/mode-invariant.allowlist.json (a conscious "this color is the same in both
// modes" decision). A NEW color token added to a dark block without a light variant and
// without an allowlist entry fails the build — so the omission is caught, not shipped.
//
//   node scripts/check-token-mode-parity.mjs          # check (exit 1 on drift)
//   node scripts/check-token-mode-parity.mjs --init    # (re)seed the allowlist from disk
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const SOURCE = ['packages/ui/styles/tokens.css', 'src/styles/tokens.css'].find(existsSync);
if (!SOURCE) { console.error('check-token-mode-parity: no token source found'); process.exit(1); }
const css = readFileSync(SOURCE, 'utf8');
const ALLOWLIST = 'tokens/mode-invariant.allowlist.json';

const THEMES = ['dusk', 'fjord', 'cobalt', 'garnet', 'graphite', 'dune'];
// Each pair: the dark selector and its light counterpart.
const PAIRS = [
  { theme: 'default', dark: /:root\s*\{/g, light: /^\[data-mode="light"\]\s*\{/gm },
  ...THEMES.map((t) => ({
    theme: t,
    dark: new RegExp(`\\[data-ds-theme="${t}"\\]\\s*\\{`, 'g'),
    light: new RegExp(`\\[data-ds-theme="${t}"\\]\\[data-mode="light"\\]\\s*\\{`, 'g'),
  })),
];

// First balanced { … } body for a selector (token values never contain `{`).
function block(re) {
  const m = re.exec(css);
  if (!m) return '';
  let i = m.index + m[0].length, depth = 1;
  const start = i;
  for (; i < css.length && depth; i++) { if (css[i] === '{') depth++; else if (css[i] === '}') depth--; }
  return css.slice(start, i - 1);
}
const DECL = /--([\w-]+)\s*:\s*([^;]+);/g;
function decls(body) {
  const out = new Map();
  let m;
  while ((m = DECL.exec(body))) out.set(m[1], m[2].trim());
  return out;
}
// A token participates in mode parity only if its value is a literal color (aliases via
// var() follow their target; non-colors like spacing/shadow/duration are mode-agnostic).
const isColor = (v) => /^(#|rgb|rgba|hsl|hsla|oklch|oklab|color\()/i.test(v);

const darkOnly = {};
for (const { theme, dark, light } of PAIRS) {
  const d = decls(block(dark));
  const l = decls(block(light));
  const names = [...d.entries()].filter(([, v]) => isColor(v)).map(([n]) => n);
  darkOnly[theme] = names.filter((n) => !l.has(n)).sort();
}

if (process.argv.includes('--init')) {
  writeFileSync(ALLOWLIST, JSON.stringify(darkOnly, null, 2) + '\n');
  const total = Object.values(darkOnly).reduce((a, b) => a + b.length, 0);
  console.log(`Wrote ${ALLOWLIST} — ${total} mode-invariant color tokens across ${PAIRS.length} themes.`);
  process.exit(0);
}

const allow = existsSync(ALLOWLIST) ? JSON.parse(readFileSync(ALLOWLIST, 'utf8')) : {};
let failed = false;
for (const { theme } of PAIRS) {
  const allowed = new Set(allow[theme] || []);
  const offenders = darkOnly[theme].filter((n) => !allowed.has(n));
  if (offenders.length) {
    failed = true;
    console.error(`✘ [${theme}] color token(s) with no light variant and not allowlisted: ${offenders.join(', ')}`);
    console.error(`   → add a [data-mode="light"] override, or (if intentionally mode-invariant) run \`npm run check:token-parity -- --init\` and commit.`);
  }
}
if (failed) process.exit(1);
console.log(`✔ token mode parity holds across ${PAIRS.length} themes (source ${SOURCE}).`);
