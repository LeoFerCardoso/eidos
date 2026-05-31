// Capture a specific region of a page: navigate, scroll element into view,
// then screenshot just the viewport.
//   node scripts/shot-region.mjs /ai/reasoning '.ds-section:has(h2#anatomy)' anatomy
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p)) || 'google-chrome';

const PORT = 9226;
const BASE = 'http://localhost:3000';
const route = process.argv[2] || '/';
const selector = process.argv[3] || 'body';
const name = process.argv[4] || 'region';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
    let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check', '--force-device-scale-factor=1',
  '--window-size=1400,1000', '--user-data-dir=/tmp/eidos-chrome-region', 'about:blank',
]);

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = {};
    ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && this.pending[m.id]) { this.pending[m.id](m); delete this.pending[m.id]; } }); }
  send(method, params = {}) { const i = ++this.id; return new Promise((resolve) => { this.pending[i] = (m) => resolve(m.result); this.ws.send(JSON.stringify({ id: i, method, params })); }); }
}

async function main() {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await getJSON('/json/list'); break; } catch { await sleep(300); } }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.on('open', res); ws.on('error', rej); });
  const cdp = new CDP(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: BASE + route });
  await sleep(3500);
  await cdp.send('Runtime.evaluate', { expression: `document.documentElement.setAttribute('data-theme','dark')` });
  await sleep(500);
  // Scroll the target into view and grab its rect
  const probe = `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return JSON.stringify({ err: 'no-el' });
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
    return new Promise((r) => setTimeout(() => {
      const rect = el.getBoundingClientRect();
      r(JSON.stringify({ rect: { x: Math.max(0, rect.left), y: Math.max(0, rect.top), w: rect.width, h: rect.height } }));
    }, 300));
  })()`;
  const probeR = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true, awaitPromise: true });
  console.log('probe =>', probeR?.result?.value);
  await sleep(400);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const out = '/tmp/shot-' + name + '.png';
  writeFileSync(out, Buffer.from(data, 'base64'));
  console.log('WROTE', out);
  ws.close();
}
main().catch((e) => console.log('FAIL:', e.message)).finally(() => chrome.kill());
