// All-stories headless render sweep — loads EVERY Storybook story in a real
// browser and flags any that throw at render (uncaught exception) or show
// Storybook's error overlay. Catches the class of runtime bugs `sb:build` and
// `tsc` cannot (require-in-ESM, undefined-not-a-function, bad hook wiring, …).
//   node scripts/sweep-stories.mjs            → sweep all stories
//   node scripts/sweep-stories.mjs forms      → only stories whose id includes "forms"
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';
import http from 'node:http';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => p && existsSync(p)) || 'google-chrome';

const ROOT = 'apps/storybook/storybook-static';
if (!existsSync(join(ROOT, 'index.json'))) {
  console.error('No storybook-static/index.json — run `npm run sb:build` first.');
  process.exit(2);
}
const idx = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8'));
const filter = process.argv.slice(2);
const allIds = Object.keys(idx.entries).filter((id) => idx.entries[id].type === 'story');
const ids = filter.length ? allIds.filter((id) => filter.some((f) => id.includes(f.toLowerCase()))) : allIds;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.map': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = join(ROOT, p);
  if (existsSync(fp) && !readdirSync(ROOT).includes(p.slice(1) + '/')) {
    try { res.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' }); res.end(readFileSync(fp)); return; } catch {}
  }
  res.writeHead(404); res.end('nf');
});
await new Promise((r) => server.listen(6008, r));

const PORT = 9334;
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--hide-scrollbars', '--window-size=900,600', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => { http.get({ host: 'localhost', port: PORT, path }, (res) => { let d = ''; res.on('data', (c) => d += c); res.on('end', () => resolve(JSON.parse(d))); }).on('error', reject); });

let target;
for (let i = 0; i < 40; i++) { try { const v = await getJSON('/json/version'); target = v.webSocketDebuggerUrl; break; } catch { await sleep(250); } }
const ws = new WebSocket(target, { maxPayload: 64 * 1024 * 1024 });
await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); });

let mid = 0; const pending = new Map();
let bucket = null; // current story's collected errors
ws.on('message', (raw) => {
  const m = JSON.parse(raw);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  if (!bucket) return;
  if (m.method === 'Runtime.exceptionThrown') {
    const e = m.params?.exceptionDetails;
    const txt = e?.exception?.description || e?.text || 'exception';
    bucket.exceptions.push(String(txt).split('\n')[0]);
  } else if (m.method === 'Runtime.consoleAPICalled' && m.params?.type === 'error') {
    const txt = (m.params.args || []).map((a) => a.value || a.description || '').join(' ').trim();
    if (txt) bucket.consoleErrors.push(txt.split('\n')[0]);
  }
});
const send = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const sendS = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, sessionId, method, params })); });
await sendS('Page.enable');
await sendS('Runtime.enable');

const broken = [];
const warned = [];
let n = 0;
for (const id of ids) {
  bucket = { exceptions: [], consoleErrors: [] };
  await sendS('Page.navigate', { url: `http://localhost:6008/iframe.html?id=${id}&viewMode=story` });
  await sleep(1400);
  // Did Storybook render its error overlay, or is the root empty?
  // IMPORTANT: `.sb-errordisplay` is always in the DOM (it's a template element);
  // Storybook adds `.sb-show-errordisplay` to <body> only when an error actually
  // occurred. Using innerText on the always-present template element gave false
  // positives because Chromium returns text even for display:none elements.
  // We rely solely on the body class for overlay detection.
  const { result } = await sendS('Runtime.evaluate', {
    expression: `(() => {
      const overlay = document.body.classList.contains('sb-show-errordisplay');
      const errEl = overlay ? document.querySelector('.sb-errordisplay') : null;
      const txt = overlay && errEl ? (errEl.innerText||'') : '';
      const root = document.querySelector('#storybook-root, #root');
      return JSON.stringify({ overlay, errText: txt.slice(0,160), empty: !root || root.childElementCount === 0 });
    })()`,
    returnByValue: true,
  });
  let dom = { overlay: false, errText: '', empty: false };
  try { dom = JSON.parse(result.value); } catch {}
  const exc = bucket.exceptions.filter((e) => !/ResizeObserver loop/i.test(e));
  const isBroken = exc.length > 0 || dom.overlay;
  if (isBroken) {
    broken.push({ id, why: dom.overlay ? ('overlay: ' + (dom.errText || exc[0] || '')) : exc[0] });
  } else if (dom.empty || bucket.consoleErrors.some((e) => /is not defined|is not a function|Cannot read|undefined is not/i.test(e))) {
    warned.push({ id, why: dom.empty ? 'empty root' : bucket.consoleErrors.find((e) => /is not defined|is not a function|Cannot read|undefined is not/i.test(e)) });
  }
  n++;
}
bucket = null;

console.log(`\nSWEEP: ${n} stories rendered.`);
console.log(`BROKEN (threw / error overlay): ${broken.length}`);
for (const b of broken) console.log(`  ✗ ${b.id} — ${b.why}`);
console.log(`SUSPECT (empty root / ref errors in console): ${warned.length}`);
for (const w of warned) console.log(`  ? ${w.id} — ${w.why}`);
if (!broken.length && !warned.length) console.log('  ✓ all stories rendered clean');

ws.close(); chrome.kill(); server.close();
process.exit(broken.length ? 1 : 0);
