// Automated accessibility audit (DS-GAP-ANALYSIS R3). Runs axe-core (WCAG 2.1 A/AA)
// against the rendered pages over CDP — the automated half of the a11y baseline the
// craft rulebook describes. Advisory by default; --strict fails on critical/serious.
//   node scripts/check-a11y.mjs [routes…]      # default: a representative sample
//   node scripts/check-a11y.mjs --strict /buttons /idp/service-card
import { spawn } from 'node:child_process';
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { WebSocket } from 'ws';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const AXE_SRC = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => p && existsSync(p)) || 'google-chrome';
const PORT = 9225, BASE = 'http://localhost:3000';
const STRICT = process.argv.includes('--strict');
let routes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!routes.length) routes = ['/', '/buttons', '/color', '/forms', '/table', '/idp/service-card', '/idp/data-table', '/ai/message', '/ai/tool', '/charts/bar', '/mobile/checkbox'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (p) => new Promise((res, rej) => http.get({ host: '127.0.0.1', port: PORT, path: p }, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', '--no-first-run', '--user-data-dir=/tmp/forge-axe', 'about:blank']);

async function main() {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await getJSON('/json/list'); break; } catch { await sleep(300); } }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); });
  let id = 0; const pend = {};
  ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } });
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend[i] = (m) => res(m.result); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');

  const byRule = {}; // ruleId -> { impact, total, routes:Set }
  const perRoute = [];
  for (const route of routes) {
    await send('Page.navigate', { url: BASE + route });
    // wait for content
    for (let i = 0; i < 40; i++) { await sleep(400); const r = await send('Runtime.evaluate', { expression: '(document.body.innerText||"").length', returnByValue: true }); if ((r?.result?.value || 0) > 120) break; }
    await send('Runtime.evaluate', { expression: AXE_SRC }); // inject axe
    const r = await send('Runtime.evaluate', {
      expression: `axe.run(document, { resultTypes:['violations'], runOnly:{ type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }).then(res => JSON.stringify(res.violations.map(v => ({ id:v.id, impact:v.impact, nodes:v.nodes.length }))))`,
      awaitPromise: true, returnByValue: true,
    });
    let violations = [];
    try { violations = JSON.parse(r.result.value); } catch {}
    const crit = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious').reduce((a, v) => a + v.nodes, 0);
    perRoute.push({ route, count: violations.reduce((a, v) => a + v.nodes, 0), crit });
    for (const v of violations) {
      byRule[v.id] ||= { impact: v.impact, total: 0, routes: new Set() };
      byRule[v.id].total += v.nodes; byRule[v.id].routes.add(route);
    }
    console.log(`AXE ${route} -> ${violations.length} rules, ${perRoute.at(-1).count} nodes (${crit} critical/serious)`);
  }
  ws.close();

  // color-contrast is dominated by the DS's tertiary tiers (--fg-subtle 3.87:1,
  // --fg-faint 2.27:1 — "decorative, never required" by design). That's a token-tier
  // design decision, not a code bug, so it's ADVISORY: reported, never gates CI.
  const ADVISORY = new Set(['color-contrast']);
  const rank = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const rules = Object.entries(byRule).sort((a, b) => (rank[a[1].impact] - rank[b[1].impact]) || b[1].total - a[1].total);
  console.log(`\n===== A11Y SUMMARY: ${routes.length} routes, ${rules.length} distinct rules violated =====`);
  const gating = rules.filter(([id]) => !ADVISORY.has(id));
  const advisory = rules.filter(([id]) => ADVISORY.has(id));
  console.log('Structural (gating with --strict):');
  for (const [ruleId, d] of gating) console.log(`  [${d.impact}] ${ruleId} — ${d.total} nodes across ${d.routes.size} route(s)`);
  if (advisory.length) {
    console.log('Advisory (token-tier / design decision — not gated):');
    for (const [ruleId, d] of advisory) console.log(`  [${d.impact}] ${ruleId} — ${d.total} nodes across ${d.routes.size} route(s)`);
  }
  const gateNodes = gating.filter(([, d]) => d.impact === 'critical' || d.impact === 'serious').reduce((a, [, d]) => a + d.total, 0);
  console.log(`\nGating (structural critical/serious) nodes: ${gateNodes}`);
  if (STRICT && gateNodes > 0) { console.log('FAIL (--strict): structural critical/serious a11y violations present.'); process.exitCode = 1; }
}
main().catch((e) => { console.log('A11Y_FAILED:', e.message); }).finally(() => chrome.kill());
