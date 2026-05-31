// Interaction probe — loads a story, clicks its first trigger, and reports
// whether an overlay/panel actually appeared (and any exception). Catches
// "renders but doesn't open / is static" bugs that the render-sweep can't.
//   node scripts/probe-stories.mjs overlays-modal--default forms-combobox--default
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';
import http from 'node:http';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => p && existsSync(p)) || 'google-chrome';
const ROOT = 'apps/storybook/storybook-static';
const idx = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8'));
const want = process.argv.slice(2);
const ids = want.map((q) => Object.keys(idx.entries).find((id) => id === q || idx.entries[id].title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(q.toLowerCase().replace(/[^a-z0-9]/g, ''))) || q);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.map': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  const fp = join(ROOT, p);
  if (existsSync(fp) && !readdirSync(ROOT).includes(p.slice(1) + '/')) { try { res.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' }); res.end(readFileSync(fp)); return; } catch {} }
  res.writeHead(404); res.end('nf');
});
await new Promise((r) => server.listen(6009, r));
const PORT = 9335;
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--window-size=1000,700', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => { http.get({ host: 'localhost', port: PORT, path }, (res) => { let d = ''; res.on('data', (c) => d += c); res.on('end', () => resolve(JSON.parse(d))); }).on('error', reject); });
let target; for (let i = 0; i < 40; i++) { try { const v = await getJSON('/json/version'); target = v.webSocketDebuggerUrl; break; } catch { await sleep(250); } }
const ws = new WebSocket(target, { maxPayload: 64 * 1024 * 1024 });
await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); });
let mid = 0; const pending = new Map(); let exc = [];
ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; } if (m.method === 'Runtime.exceptionThrown') exc.push((m.params?.exceptionDetails?.exception?.description || m.params?.exceptionDetails?.text || '').split('\n')[0]); });
const send = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const sendS = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, sessionId, method, params })); });
await sendS('Page.enable'); await sendS('Runtime.enable');
const evalIn = async (expr) => { const { result, exceptionDetails } = await sendS('Runtime.evaluate', { expression: expr, returnByValue: true }); if (exceptionDetails) return { __evalError: exceptionDetails.text }; return result.value; };

const PANEL = `[role="dialog"],[role="listbox"],[role="menu"],[role="tooltip"],.mdl-overlay,.adlg-overlay,.pop-panel,.popover-panel,.sel-panel,.cb-panel,.dm-panel,.mb-panel,.tip-bubble,.hc-panel,.toast,.cmd-panel`;
for (const id of ids) {
  exc = [];
  await sendS('Page.navigate', { url: `http://localhost:6009/iframe.html?id=${id}&viewMode=story` });
  await sleep(1300);
  const before = await evalIn(`document.querySelectorAll('${PANEL}').length`);
  const clicked = await evalIn(`(() => {
    const root = document.querySelector('#storybook-root,#root') || document.body;
    const t = root.querySelector('button:not([disabled]), [role="button"], .sel-trigger, .cb-trigger, [aria-haspopup], .tgl');
    if (!t) return 'NO-TRIGGER';
    t.dispatchEvent(new MouseEvent('pointerdown',{bubbles:true}));
    t.dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));
    t.click();
    // hover-based (tooltip/hovercard)
    t.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));
    t.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
    return t.textContent.trim().slice(0,30) || t.className;
  })()`);
  await sleep(700);
  const after = await evalIn(`document.querySelectorAll('${PANEL}').length`);
  // Deep interact: click first option/item/step/card; toggle inputs; then snapshot.
  const snap = await evalIn(`(() => {
    const root = document.querySelector('#storybook-root,#root') || document.body;
    const before = { trig: (root.querySelector('.cb-trigger,.sel-trigger,button,[role=button]')||{}).textContent||'', val: (root.querySelector('input:not([type=checkbox]):not([type=radio])')||{}).value||'', checked: [...root.querySelectorAll('input[type=checkbox],input[type=radio]')].filter(i=>i.checked).length, toasts: document.querySelectorAll('.toast,[role=status] .toast,.tg-toast,li[role=status]').length };
    const opt = document.querySelector('[role=option],.cb-item,.sel-option,.dm-item,[role=menuitem]');
    if (opt) opt.click();
    const card = root.querySelector('.sel-card,label.sel-card');
    if (card && !opt) card.click();
    const step = root.querySelector('.in-addon.stepper .step,.in-addon.btn');
    if (step && !opt && !card) step.click();
    return JSON.stringify(before);
  })()`);
  await sleep(600);
  const post = await evalIn(`(() => {
    const root = document.querySelector('#storybook-root,#root') || document.body;
    return JSON.stringify({ trig: (root.querySelector('.cb-trigger,.sel-trigger,button,[role=button]')||{}).textContent||'', val: (root.querySelector('input:not([type=checkbox]):not([type=radio])')||{}).value||'', checked: [...root.querySelectorAll('input[type=checkbox],input[type=radio]')].filter(i=>i.checked).length, toasts: document.querySelectorAll('.toast,[role=status] .toast,.tg-toast,li[role=status]').length });
  })()`);
  const opened = (after > before);
  let b={},p={}; try{b=JSON.parse(snap)}catch{} try{p=JSON.parse(post)}catch{}
  const changed = b.trig!==p.trig || b.val!==p.val || b.checked!==p.checked || b.toasts!==p.toasts;
  console.log(`${opened?'OPENS':'no-open'} | ${changed?'✓ INTERACTS':'✗ STATIC'}  ${id}  (panels ${before}→${after}; val "${b.val}"→"${p.val}"; checked ${b.checked}→${p.checked}; toasts ${b.toasts}→${p.toasts})${exc.length ? '  EXC: ' + exc[0] : ''}`);
}
ws.close(); chrome.kill(); server.close(); process.exit(0);
