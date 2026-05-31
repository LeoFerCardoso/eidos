// check-slop.mjs — consolidated anti-AI-slop lint (advisory). Flags the review tells
// from .claude/craft/anti-ai-slop.md that a script CAN catch: placeholder CDNs,
// filler copy, hardcoded font-family outside var(--font-*), emoji feature-icons.
// Frame `code` snippets are stripped first. Backs C-no-slop (gate: advisory).
//
//   node scripts/check-slop.mjs [--json]
import { readFileSync, existsSync } from 'node:fs';
import { abs, loadContract, STATUS } from './forge-lib.mjs';

const stripTemplates = (s) => s.replace(/`(?:\\.|[^`\\])*`/g, '``');

const TELLS = [
  { re: /(images\.unsplash\.com|placehold\.co|placehold\.it|picsum\.photos|via\.placeholder|dummyimage\.com)/i, msg: 'placeholder CDN' },
  { re: /lorem ipsum/i, msg: 'lorem ipsum filler' },
  { re: /font-family:\s*(?!var\(--font)['"a-z]/i, msg: 'hardcoded font-family (use var(--font-*))' },
  { re: />\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, msg: 'emoji in JSX text (use an Icon)' },
];

export function run({ components } = {}) {
  const comps = components || loadContract().components || [];
  const byComponent = {};
  for (const comp of comps) {
    const p = comp.surfaces?.docs;
    if (!p || !existsSync(abs(p))) { byComponent[comp.name] = { status: STATUS.SKIP, detail: 'no docs page' }; continue; }
    const src = stripTemplates(readFileSync(abs(p), 'utf8'));
    const hits = TELLS.filter((t) => t.re.test(src)).map((t) => t.msg);
    byComponent[comp.name] = hits.length
      ? { status: STATUS.FAIL, detail: hits.join('; ') }
      : { status: STATUS.PASS, detail: 'clean' };
  }
  return { byComponent };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { byComponent } = run({ components: loadContract().components });
  const fails = Object.entries(byComponent).filter(([, r]) => r.status === STATUS.FAIL);
  console.log(`anti-slop: ${fails.length} page(s) with tells`);
  for (const [n, r] of fails.slice(0, 50)) console.log(`  ! ${n.padEnd(22)} ${r.detail}`);
}
