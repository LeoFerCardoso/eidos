// Token spec export (DS-GAP-ANALYSIS P3). The canonical authored source is
// packages/ui/styles/tokens.css (the shipped token layer); this emits a
// machine-readable W3C Design-Tokens-Format file (tokens/forge.tokens.json) that
// Figma / Style Dictionary / iOS·Android exporters can consume. Dark is the
// canonical $value; light overrides ride in $extensions.
//   node scripts/gen-tokens.mjs           # write tokens/forge.tokens.json
//   node scripts/gen-tokens.mjs --check   # fail (exit 1) if the committed file is stale
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

// Canonical source moved to the @eidos/ui package post-monorepo. Fall back to the
// legacy in-app path only if the canonical one is absent (keeps old checkouts working).
const SOURCES = ['packages/ui/styles/tokens.css', 'src/styles/tokens.css'];
const SOURCE = SOURCES.find((p) => existsSync(p));
if (!SOURCE) { console.error(`gen-tokens: no token source found (looked for ${SOURCES.join(', ')})`); process.exit(1); }
const css = readFileSync(SOURCE, 'utf8');

// Extract the body of a `<selector> { … }` block by brace-counting (token values
// never contain `{`, so the first balanced close wins).
function block(re) {
  const m = re.exec(css);
  if (!m) return '';
  let i = m.index + m[0].length, depth = 1;
  const start = i;
  for (; i < css.length && depth; i++) { if (css[i] === '{') depth++; else if (css[i] === '}') depth--; }
  return css.slice(start, i - 1);
}
const rootBody = block(/:root\s*\{/g);
// The Forge light token block. Anchored to line-start so it matches the bare
// `[data-mode="light"] {` and never the Iris `[data-ds-theme="iris"][data-mode="light"]`
// block (which starts with `[data-ds-theme=`) nor component rules (a class before `{`).
const lightBody = block(/^\[data-mode="light"\]\s*\{/gm);

const DECL = /--([\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*([^*]*(?:\*(?!\/)[^*]*)*)\*\/)?/g;
function decls(body) {
  const out = new Map();
  let m;
  while ((m = DECL.exec(body))) out.set(m[1], { value: m[2].trim(), desc: (m[3] || '').trim() });
  return out;
}
const root = decls(rootBody);
const light = decls(lightBody);

// ---- type inference (DTCG $type) -----------------------------------------
function typeOf(name, value) {
  if (/^var\(--/.test(value)) return 'alias';
  if (/^(#|rgb|rgba|hsl|oklch|oklab|color\()/.test(value)) return 'color';
  if (/cubic-bezier|steps\(/.test(value)) return 'cubicBezier';
  if (/^-?[\d.]+m?s$/.test(value)) return 'duration';
  if (name.startsWith('shadow') || / rgba?\([^)]*\)/.test(value) && /\dpx/.test(value)) return 'shadow';
  if (/Geist|sans-serif|monospace|system-ui|-apple-system/.test(value)) return 'fontFamily';
  if (/^-?[\d.]+(px|rem|em|ch|vh|vw|%)$/.test(value) || value === '0') return 'dimension';
  if (/^-?[\d.]+$/.test(value)) return 'number';
  return 'other';
}
// category = first name segment (color tokens collapse under "color")
const COLOR_GROUPS = new Set(['canvas','bg','surface','border','fg','ember','ice','violet','success','warning','danger','info','status','severity','risk','health','viz','ai','ring']);
function categoryOf(name, type) {
  const head = name.split('-')[0];
  if (type === 'color') return 'color';
  if (type === 'dimension') return head === 'text' ? 'fontSize' : head === 'space' ? 'spacing' : head === 'radius' ? 'radius' : head === 'bp' ? 'breakpoint' : 'dimension';
  if (type === 'duration') return 'duration';
  if (type === 'cubicBezier') return 'easing';
  if (type === 'shadow') return 'shadow';
  if (type === 'fontFamily') return 'fontFamily';
  if (type === 'number') return head === 'z' ? 'zIndex' : head === 'opacity' ? 'opacity' : 'number';
  return 'other';
}
// resolve var(--x) → DTCG reference {category.x}
const catByName = new Map();
for (const [name, { value }] of root) {
  const t = typeOf(name, value);
  catByName.set(name, t === 'alias' ? null : categoryOf(name, t));
}
function toRef(value) {
  const m = value.match(/^var\(--([\w-]+)\)$/);
  if (!m) return null;
  const target = m[1], cat = catByName.get(target);
  return cat ? `{${cat}.${target}}` : `{${target}}`;
}

// ---- build DTCG tree ------------------------------------------------------
const TYPE_FOR_CAT = { color: 'color', fontSize: 'dimension', spacing: 'dimension', radius: 'dimension', breakpoint: 'dimension', dimension: 'dimension', duration: 'duration', easing: 'cubicBezier', shadow: 'shadow', fontFamily: 'fontFamily', number: 'number', zIndex: 'number', opacity: 'number', other: undefined };
const tree = { $description: `Eidos Design System tokens — generated from ${SOURCE}. Do not edit by hand; edit the CSS and re-run scripts/gen-tokens.mjs.` };
let count = 0;
for (const [name, { value, desc }] of root) {
  const t = typeOf(name, value);
  const ref = t === 'alias' ? toRef(value) : null;
  const cat = ref ? catByName.get(value.match(/^var\(--([\w-]+)\)$/)[1]) || 'other' : categoryOf(name, t);
  const $type = TYPE_FOR_CAT[cat];
  const token = { $value: ref || value };
  if ($type) token.$type = $type;
  if (desc) token.$description = desc;
  const lv = light.get(name);
  if (lv && lv.value !== value) token.$extensions = { 'com.forge.theme.light': /^var\(--/.test(lv.value) ? (toRef(lv.value) || lv.value) : lv.value };
  (tree[cat] ||= {})[name] = token;
  count++;
}

const OUT = 'tokens/forge.tokens.json';
const next = JSON.stringify(tree, null, 2) + '\n';
const cats = Object.keys(tree).filter((k) => !k.startsWith('$'));
const lightCount = [...root].filter(([n, { value }]) => light.has(n) && light.get(n).value !== value).length;

// --check: assert the committed export tracks the source (used by clause C-tokens-dtcg).
if (process.argv.includes('--check')) {
  const prev = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (prev !== next) {
    console.error(`✘ ${OUT} is stale vs ${SOURCE} — run \`npm run gen:tokens\` and commit.`);
    process.exit(1);
  }
  console.log(`✔ ${OUT} in sync with ${SOURCE} (${count} tokens).`);
  process.exit(0);
}

mkdirSync('tokens', { recursive: true });
writeFileSync(OUT, next);
console.log(`Wrote ${OUT} — ${count} tokens across ${cats.length} groups (${cats.join(', ')}); ${lightCount} with light overrides; source ${SOURCE}.`);
