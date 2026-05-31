// Click through to question 5 (which has allowOther), type in the
// "other" input, and confirm a Continue button appears.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p)) || 'google-chrome';

const PORT = 9230;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
    let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check', '--force-device-scale-factor=1',
  '--window-size=900,1100', '--user-data-dir=/tmp/eidos-chrome-test-other', 'about:blank',
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

  // Scroll to interactive flow
  await cdp.send('Runtime.evaluate', { expression: `(() => {
    const el = Array.from(document.querySelectorAll('h2,h3,.ds-subhead')).find(n => (n.textContent||'').toLowerCase().includes('interactive flow'));
    if (el) el.scrollIntoView({ block: 'start' });
  })()` });
  await sleep(500);

  const probe = `(() => {
    const q = document.querySelector('.ask .ask-q');
    if (!q) return JSON.stringify({ err: 'no-ask-q' });
    return JSON.stringify({
      title: q.querySelector('.ask-q-title')?.innerText || null,
      step:  q.querySelector('.ask-q-step')?.innerText || null,
      hasOther: !!q.querySelector('.ask-opt-other'),
      hasCTA:   !!q.querySelector('.ask-q-cta'),
      ctaLabel: q.querySelector('.ask-q-cta')?.innerText || null,
      hasSkip:  !!q.querySelector('.ask-q-skip'),
      otherActive: !!q.querySelector('.ask-opt-other.is-on'),
    });
  })()`;

  // Click first option 4 times to reach question 5 (deployment, has allowOther)
  for (let i = 0; i < 4; i++) {
    const before = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true });
    console.log('before click ' + (i+1) + ':', before?.result?.value);
    // For the multi-select question we need to click an option AND continue
    const isMulti = JSON.parse(before?.result?.value || '{}').ctaLabel === 'Continue →' ||
                    (before?.result?.value || '').includes('"ctaLabel":"Continue');
    await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.ask .ask-q .ask-opt:not(.ask-opt-other)')?.click()` });
    await sleep(150);
    if (isMulti) {
      // Click Continue
      await cdp.send('Runtime.evaluate', { expression: `document.querySelector('.ask .ask-q .ask-q-cta')?.click()` });
    }
    await sleep(700);
  }

  // We should now be on Q5 (deployment)
  const onQ5 = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true });
  console.log('on Q5:', onQ5?.result?.value);
  let shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync('/tmp/shot-ask-q5-before.png', Buffer.from(shot.data, 'base64'));

  // Type in the "other" input
  await cdp.send('Runtime.evaluate', { expression: `(() => {
    const input = document.querySelector('.ask .ask-q .ask-opt-other input');
    if (!input) return 'no-input';
    const setVal = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setVal.call(input, 'Cloudflare Workers');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return 'typed';
  })()` });
  await sleep(400);
  const afterType = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true });
  console.log('after typing in other:', afterType?.result?.value);
  shot = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync('/tmp/shot-ask-q5-after.png', Buffer.from(shot.data, 'base64'));

  ws.close();
}
main().catch((e) => console.log('FAIL:', e.message)).finally(() => chrome.kill());
