// Click the first ArtifactWidget on /ai/artifact and capture the
// docked-open state to verify the chat shrinks + the drawer renders the
// document body via markdown.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p)) || 'google-chrome';

const PORT = 9231;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
    let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check', '--force-device-scale-factor=1',
  '--window-size=1400,1200', '--user-data-dir=/tmp/eidos-chrome-artifact', 'about:blank',
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
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1400, height: 1200, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: 'http://localhost:3000/ai/artifact' });
  await sleep(3500);
  await cdp.send('Runtime.evaluate', { expression: `document.documentElement.setAttribute('data-theme','dark')` });
  await sleep(400);

  // Scroll to the Usage frame
  await cdp.send('Runtime.evaluate', { expression: `(() => {
    const el = Array.from(document.querySelectorAll('h2,h3,.ds-subhead')).find(n => (n.textContent||'').toLowerCase().includes('usage'));
    if (el) el.scrollIntoView({ block: 'start' });
  })()` });
  await sleep(400);

  // Click the FIRST ArtifactWidget (Service Design Brief, document)
  await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.ai-art-widget')?.click()` });
  await sleep(900); // wait for drawer slide-in + markdown loader

  const probe = `(() => {
    const root = document.querySelector('.dr-root.variant-inline');
    if (!root) return JSON.stringify({ err: 'no-drawer' });
    const dr = root.querySelector('.dr');
    return JSON.stringify({
      state: root.getAttribute('data-state'),
      rootW: root.getBoundingClientRect().width,
      drW: dr ? dr.getBoundingClientRect().width : 0,
      title: root.querySelector('.dr-title .ai-art-panel-title')?.innerText || null,
      bodyHasProse: !!root.querySelector('.dr-body .ai-prose'),
      headingsCount: root.querySelectorAll('.dr-body .ai-prose h1, .dr-body .ai-prose h2').length,
    });
  })()`;
  const r = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true });
  console.log('OPEN STATE:', r?.result?.value);

  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync('/tmp/shot-artifact-docked.png', Buffer.from(data, 'base64'));
  console.log('WROTE /tmp/shot-artifact-docked.png');
  ws.close();
}
main().catch((e) => console.log('FAIL:', e.message)).finally(() => chrome.kill());
