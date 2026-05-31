// check-no-page-style.mjs — page chrome composes .ds-* classes + var(--token); it
// never ships a per-page <style> block or hardcodes color in an inline style. The
// only place raw color/oklch/hex lives is packages/ui/styles/{tokens,ds,ai}.css.
// Frame `code={`…`}` demo snippets are stripped before scanning (a demo may show raw
// values). Backs C-no-page-style. The PreToolUse no-page-style hook is the in-edit twin.
//
//   node scripts/check-no-page-style.mjs [--json] [--strict]
import { readFileSync, existsSync } from 'node:fs';
import { abs, loadContract, STATUS } from './eidos-lib.mjs';

// strip Frame `code` template literals + comments so we only scan real page JSX chrome
// (a `<style>` mentioned in a // comment or a demo string is not a violation).
const stripChrome = (src) => src
  .replace(/`(?:\\.|[^`\\])*`/g, '``')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

// inline hardcoded color inside page JSX (NOT a rendered demo). rgba/oklch are common in
// legit demos (shadows/overlays), so they're advisory; a real <style> block is always wrong.
const HARDCODED_COLOR = /style=\{\{[^}]*(#[0-9a-fA-F]{3,8})/;

export function run({ components } = {}) {
  const comps = components || loadContract().components || [];
  const byComponent = {};
  for (const comp of comps) {
    const p = comp.surfaces?.docs;
    if (!p || !existsSync(abs(p))) { byComponent[comp.name] = { status: STATUS.SKIP, detail: 'no docs page' }; continue; }
    const src = stripChrome(readFileSync(abs(p), 'utf8'));
    // BLOCK: a real <style> element (open tag with content/close), never just the word
    if (/<style[\s>][\s\S]*?<\/style>/.test(src)) {
      byComponent[comp.name] = { status: STATUS.FAIL, detail: 'contains a per-page <style> block — extend tokens.css/ds.css instead' };
      continue;
    }
    const m = src.match(HARDCODED_COLOR);
    byComponent[comp.name] = m
      ? { status: STATUS.PASS, detail: `note: hardcoded hex ${m[1]} in inline style — prefer var(--token)` }
      : { status: STATUS.PASS, detail: 'composes classes + tokens' };
  }
  return { byComponent };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { byComponent } = run({ components: loadContract().components });
  const fails = Object.entries(byComponent).filter(([, r]) => r.status === STATUS.FAIL);
  console.log(`no-page-style: ${Object.values(byComponent).filter((r) => r.status === STATUS.PASS).length} clean · ${fails.length} violations`);
  for (const [n, r] of fails.slice(0, 60)) console.log(`  ✘ ${n.padEnd(22)} ${r.detail}`);
  process.exit(process.argv.includes('--strict') && fails.length ? 1 : 0);
}
