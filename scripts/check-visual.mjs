// Visual-regression check (DS-GAP-ANALYSIS R3). Screenshots a fixed viewport per
// route over CDP and pixel-diffs it against a committed baseline; flags routes
// whose rendering changed. Pairs with verify-render (which proves a route renders)
// by proving it renders THE SAME.
//   node scripts/check-visual.mjs --update [routes…]   # (re)create baselines
//   node scripts/check-visual.mjs [routes…]            # diff vs baselines (report)
//   node scripts/check-visual.mjs --strict [routes…]   # exit 1 on any regression
// Baselines: tests/visual-baselines/<slug>.png ; diffs written to /tmp on mismatch.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { WebSocket } from 'ws';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => p && existsSync(p)) || 'google-chrome';
const PORT = 9228, BASE = 'http://localhost:3000';
const UPDATE = process.argv.includes('--update');
const STRICT = process.argv.includes('--strict');
const BASE_DIR = 'tests/visual-baselines';
const W = 1280, H = 1600, THRESH = 0.001; // 0.1% of pixels may differ (anti-aliasing noise)
let routes = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!routes.length) routes = ['/', '/buttons', '/color', '/table', '/idp/service-card', '/idp/metric-card', '/ai/message', '/charts/bar', '/mobile/cards', '/patterns/dot-grid'];

const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (p) => new Promise((res, rej) => http.get({ host: '127.0.0.1', port: PORT, path: p }, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));
mkdirSync(BASE_DIR, { recursive: true });
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--no-first-run', '--user-data-dir=/tmp/eidos-visual', 'about:blank']);

async function main() {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await getJSON('/json/list'); break; } catch { await sleep(300); } }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); });
  let id = 0; const pend = {};
  ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && pend[m.id]) { pend[m.id](m); delete pend[m.id]; } });
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend[i] = (m) => res(m.result); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });

  const results = [];
  for (const route of routes) {
    await send('Page.navigate', { url: BASE + route });
    for (let i = 0; i < 40; i++) { await sleep(400); const r = await send('Runtime.evaluate', { expression: '(document.body.innerText||"").length', returnByValue: true }); if ((r?.result?.value || 0) > 120) break; }
    await send('Runtime.evaluate', { expression: `document.documentElement.setAttribute('data-theme','dark')` });
    await sleep(600);
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
    const buf = Buffer.from(shot.data, 'base64');
    const file = join(BASE_DIR, slug(route) + '.png');
    if (UPDATE || !existsSync(file)) { writeFileSync(file, buf); results.push({ route, status: existsSync(file) && !UPDATE ? 'created' : UPDATE ? 'updated' : 'created' }); console.log(`${UPDATE ? 'UPDATED' : 'BASELINE'} ${route}`); continue; }
    const cur = PNG.sync.read(buf);
    const base = PNG.sync.read(readFileSync(file));
    if (cur.width !== base.width || cur.height !== base.height) { results.push({ route, status: 'size-changed' }); console.log(`✗ ${route} — size changed (${base.width}x${base.height} → ${cur.width}x${cur.height})`); continue; }
    const diff = new PNG({ width: cur.width, height: cur.height });
    const changed = pixelmatch(cur.data, base.data, diff.data, cur.width, cur.height, { threshold: 0.1 });
    const ratio = changed / (cur.width * cur.height);
    if (ratio > THRESH) {
      const dpath = `/tmp/visual-diff-${slug(route)}.png`;
      writeFileSync(dpath, PNG.sync.write(diff));
      results.push({ route, status: 'regression', ratio, dpath });
      console.log(`✗ ${route} — ${changed} px (${(ratio * 100).toFixed(2)}%) changed → ${dpath}`);
    } else {
      results.push({ route, status: 'match' });
      console.log(`✓ ${route} — match (${changed} px)`);
    }
  }
  ws.close();
  const regressions = results.filter((r) => r.status === 'regression' || r.status === 'size-changed');
  console.log(`\n===== VISUAL SUMMARY: ${results.length} routes — ${results.filter((r) => r.status === 'match').length} match, ${regressions.length} regressed, ${results.filter((r) => /created|updated/.test(r.status)).length} baselined =====`);
  if (STRICT && regressions.length) { console.log('FAIL (--strict): visual regressions present.'); process.exitCode = 1; }
}
main().catch((e) => console.log('VISUAL_FAILED:', e.message)).finally(() => chrome.kill());
