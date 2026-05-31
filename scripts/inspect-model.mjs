// Open ModelSelector on /ai/model-selector and DUMP the computed styles
// + bounding rect of the portaled menu, so we can see what is actually
// making it tall in the browser (no guessing).
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => p && existsSync(p)) || 'google-chrome';

const PORT = 9225;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
    let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check',
  '--window-size=1400,1800', '--user-data-dir=/tmp/eidos-chrome-inspect', 'about:blank',
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
  await cdp.send('Page.navigate', { url: 'http://localhost:3000/ai/model-selector' });
  await sleep(3500);
  const inspect = `(() => {
    const t = document.querySelector('.pi-model');
    if (!t) return JSON.stringify({ err: 'no-trigger' });
    t.click();
    return new Promise((res) => setTimeout(() => {
      const m = document.querySelector('.pi-menu-portal') || document.querySelector('.pi-menu--portal') || document.querySelector('.pi-menu');
      if (!m) return res(JSON.stringify({ err: 'no-menu' }));
      const cs = getComputedStyle(m);
      const r = m.getBoundingClientRect();
      const itemRects = Array.from(m.querySelectorAll('.pi-menu-item')).map((el) => {
        const c = getComputedStyle(el);
        return {
          rect: el.getBoundingClientRect(),
          padding: c.padding, height: c.height, minHeight: c.minHeight,
          display: c.display, flex: c.flex, alignSelf: c.alignSelf,
        };
      });
      res(JSON.stringify({
        menu: {
          className: m.className,
          style: m.getAttribute('style'),
          rect: r,
          // The big ones — what is the box dimension and from what?
          height: cs.height, width: cs.width,
          minHeight: cs.minHeight, maxHeight: cs.maxHeight,
          position: cs.position,
          top: cs.top, bottom: cs.bottom, left: cs.left, right: cs.right,
          display: cs.display, flex: cs.flex, alignSelf: cs.alignSelf,
          overflow: cs.overflow, overflowY: cs.overflowY,
          parent: { tagName: m.parentElement && m.parentElement.tagName, id: m.parentElement && m.parentElement.id, className: m.parentElement && m.parentElement.className },
        },
        body: {
          display: getComputedStyle(document.body).display,
          flexDirection: getComputedStyle(document.body).flexDirection,
          alignItems: getComputedStyle(document.body).alignItems,
          height: getComputedStyle(document.body).height,
        },
        items: itemRects,
      }, null, 2));
    }, 600));
  })()`;
  const r = await cdp.send('Runtime.evaluate', { expression: inspect, returnByValue: true, awaitPromise: true });
  console.log(r?.result?.value);
  ws.close();
}
main().catch((e) => console.log('FAIL:', e.message)).finally(() => chrome.kill());
