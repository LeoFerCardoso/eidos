// Click through the Ask hero demo and capture each step to prove the
// auto-advance works. Outputs /tmp/shot-ask-step-{1..N}.png.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p)) || 'google-chrome';

const PORT = 9229;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
    let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check', '--force-device-scale-factor=1',
  '--window-size=900,1100', '--user-data-dir=/tmp/eidos-chrome-test-ask', 'about:blank',
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
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 900, height: 1100, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: 'http://localhost:3000/ai/ask' });
  await sleep(3500);
  await cdp.send('Runtime.evaluate', { expression: `document.documentElement.setAttribute('data-theme','dark')` });
  await sleep(400);

  // Scroll to the Interactive flow frame
  await cdp.send('Runtime.evaluate', { expression: `(() => {
    const el = Array.from(document.querySelectorAll('h2,h3,.ds-subhead'))
      .find(n => n.textContent && n.textContent.toLowerCase().includes('interactive flow'));
    if (el) el.scrollIntoView({ block: 'start' });
  })()` });
  await sleep(500);

  // Capture each step. We can't see "current question" externally, but we
  // can query `.ask-q-title` text and count options + step counter.
  const probe = `(() => {
    const q = document.querySelector('.ask .ask-q');
    if (!q) return JSON.stringify({ err: 'no-ask-q' });
    return JSON.stringify({
      title: q.querySelector('.ask-q-title')?.innerText || null,
      step:  q.querySelector('.ask-q-step')?.innerText || null,
      optionCount: q.querySelectorAll('.ask-opt').length,
      summary: document.querySelector('.ask.is-done .ask-summary')?.innerText || null,
    });
  })()`;

  const before = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true });
  console.log('STEP 1:', before?.result?.value);
  let shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync('/tmp/shot-ask-step-1.png', Buffer.from(shot.data, 'base64'));

  // Click first option (single-select question — should auto-advance)
  await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.ask .ask-q .ask-opt')?.click()` });
  await sleep(600); // wait past advanceDelayMs + transition
  const after = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true });
  console.log('STEP 2 (after click q1):', after?.result?.value);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync('/tmp/shot-ask-step-2.png', Buffer.from(shot.data, 'base64'));

  ws.close();
}
main().catch((e) => console.log('FAIL:', e.message)).finally(() => chrome.kill());
