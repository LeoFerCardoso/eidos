// Nav ↔ page integrity check (DS-GAP-ANALYSIS P2.11). Asserts the generated nav
// and the migrated-page registry agree, so a nav entry can't point at a missing
// page (404) and a page can't be orphaned out of the nav. Run AFTER the gen
// scripts (predev/prebuild already run them).
//   node scripts/check-nav.mjs            # report
//   node scripts/check-nav.mjs --strict    # exit 1 on any mismatch (CI)
import { readFileSync } from 'node:fs';

const STRICT = process.argv.includes('--strict');
const nav = readFileSync('src/lib/nav.ts', 'utf8');
const reg = readFileSync('src/ds/migrated/registry.ts', 'utf8');
const exReg = readFileSync('src/ds/examples/registry.ts', 'utf8');

// MIGRATED route keys (overview = the home route '/').
const migrated = new Set([...reg.matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1]));
// Standalone example screens render at /example/<name> via EXAMPLES_REG, not MIGRATED.
const examples = new Set([...exReg.matchAll(/^\s*"([^"]+)":/gm)].map((m) => m[1]));

// Nav hrefs (the generated NAV is pretty-printed JSON: "href": "/slug").
// Internal routes start with "/"; external links (http…) are skipped.
const hrefs = [...nav.matchAll(/"href":\s*"([^"]+)"/g)].map((m) => m[1]);
const internal = hrefs.filter((h) => /^\/[\w/-]*$/.test(h));
const keyForHref = (href) => (href === '/' ? 'overview' : href.replace(/^\//, ''));

// 1) every internal nav href resolves to a migrated page or an example screen
const resolves = (h) => (h.startsWith('/example/') ? examples.has(h.slice('/example/'.length)) : migrated.has(keyForHref(h)));
const danglingNav = internal.filter((h) => !resolves(h));
// 2) every migrated page (except overview) is reachable from the nav
const navKeys = new Set(internal.map(keyForHref));
const orphanPages = [...migrated].filter((k) => k !== 'overview' && !navKeys.has(k));

console.log(`Nav ↔ page check: ${internal.length} internal nav links, ${migrated.size} migrated pages.`);
let bad = 0;
if (danglingNav.length) {
  bad += danglingNav.length;
  console.log(`\n✗ ${danglingNav.length} nav link(s) with no migrated page (would 404):`);
  for (const h of danglingNav) console.log(`   ${h}  → expected key "${keyForHref(h)}"`);
}
if (orphanPages.length) {
  bad += orphanPages.length;
  console.log(`\n✗ ${orphanPages.length} migrated page(s) not in the nav (orphaned):`);
  for (const k of orphanPages) console.log(`   ${k}`);
}
if (!bad) console.log('All nav links resolve to a page, and every page is in the nav. ✓');
else if (STRICT) process.exitCode = 1;
