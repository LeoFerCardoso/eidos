// Navigate, run a sequence of click expressions, then screenshot. Lets us
// capture interactive states (wizard steps, opened menus) headlessly.
//   node scripts/shot-click.mjs /portal/create out.png "btnByText('Use template')" "btnByText('Next')"
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => p && existsSync(p)) || 'google-chrome';
const PORT = 9225;
const BASE = 'http://localhost:3000';
const route = process.argv[2] || '/';
const out = process.argv[3] || '/tmp/shot-click.png';
const clicks = process.argv.slice(4);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => { let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d))); }).on('error', reject);
});
const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', '--no-first-run', '--force-device-scale-factor=1', '--window-size=1400,2400', '--user-data-dir=/tmp/eidos-chrome-click', 'about:blank']);
class CDP { constructor(ws) { this.ws = ws; this.id = 0; this.pending = {}; ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && this.pending[m.id]) { this.pending[m.id](m); delete this.pending[m.id]; } }); }
  send(method, params = {}) { const i = ++this.id; return new Promise((resolve) => { this.pending[i] = (m) => resolve(m.result); this.ws.send(JSON.stringify({ id: i, method, params })); }); } }

const HELPERS = `function btnByText(t){return [...document.querySelectorAll('button')].find(b=>b.textContent.trim().includes(t));}`;

async function main() {
  let targets;
  for (let i = 0; i < 60; i++) { try { targets = await getJSON('/json/list'); break; } catch { await sleep(300); } }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.on('open', res); ws.on('error', rej); });
  const cdp = new CDP(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1500, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: BASE + route });
  await sleep(4800); // allow first-load compile + hydration before interacting
  for (const expr of clicks) {
    const r = await cdp.send('Runtime.evaluate', { expression: `${HELPERS}\n(${expr})?.click() ? 'clicked' : 'no-target'`, returnByValue: true });
    console.log('  click', JSON.stringify(expr), '→', r?.result?.value ?? r?.exceptionDetails?.text ?? '?');
    await sleep(1100);
  }
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(out, Buffer.from(data, 'base64'));
  console.log('WROTE', out);
  ws.close(); chrome.kill();
}
main().catch((e) => { console.error(e); chrome.kill(); process.exit(1); });
