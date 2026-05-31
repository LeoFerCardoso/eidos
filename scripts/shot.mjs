// Headless screenshot over CDP (reuses the verify-render Chrome pattern).
//   node scripts/shot.mjs /ai/agents dark   → /tmp/shot-ai-agents-dark.png
// Args: <route> [theme=dark|light] [outPath]
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find((p) => p && existsSync(p)) || 'google-chrome';

const PORT = 9223;
const BASE = 'http://localhost:3000';
const route = process.argv[2] || '/';
const theme = process.argv[3] || 'dark';
const out = process.argv[4] || `/tmp/shot${route.replace(/\//g, '-')}-${theme}.png`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
    let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check',
  '--force-device-scale-factor=1', '--window-size=1400,2400',
  '--user-data-dir=/tmp/eidos-chrome-shot', 'about:blank',
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
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 2400, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: BASE + route });
  await sleep(3500);
  await cdp.send('Runtime.evaluate', { expression: `document.documentElement.setAttribute('data-theme','${theme}')` });
  await sleep(900);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  writeFileSync(out, Buffer.from(data, 'base64'));
  console.log('WROTE', out);
  ws.close();
}
main().catch((e) => console.log('SHOT_FAILED:', e.message)).finally(() => chrome.kill());
