// Open-then-screenshot — loads a story, clicks its first trigger button, waits,
// then screenshots the OPEN state (shoot-stories only captures the closed state).
//   node scripts/shoot-open.mjs overlays-modal--hero-variant
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';
import http from 'node:http';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => p && existsSync(p)) || 'google-chrome';
const ROOT = 'apps/storybook/storybook-static';
const idx = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8'));
const ids = process.argv.slice(2).map((q) => Object.keys(idx.entries).find((id) => id === q || idx.entries[id].title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(q.toLowerCase().replace(/[^a-z0-9]/g, ''))) || q);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.map': 'application/json' };
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const fp = join(ROOT, p); if (existsSync(fp) && !readdirSync(ROOT).includes(p.slice(1) + '/')) { try { res.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' }); res.end(readFileSync(fp)); return; } catch {} } res.writeHead(404); res.end('nf'); });
await new Promise((r) => server.listen(6011, r));
const PORT = 9337;
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2', '--window-size=900,620', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => { http.get({ host: 'localhost', port: PORT, path }, (res) => { let d = ''; res.on('data', (c) => d += c); res.on('end', () => resolve(JSON.parse(d))); }).on('error', reject); });
let target; for (let i = 0; i < 40; i++) { try { const v = await getJSON('/json/version'); target = v.webSocketDebuggerUrl; break; } catch { await sleep(250); } }
const ws = new WebSocket(target, { maxPayload: 64 * 1024 * 1024 });
await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); });
let mid = 0; const pending = new Map();
ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, sessionId, method, params })); });
await S('Page.enable');
const out = [];
for (const id of ids) {
  await S('Page.navigate', { url: `http://localhost:6011/iframe.html?id=${id}&viewMode=story` });
  await sleep(1500);
  await S('Runtime.evaluate', { expression: `(() => { const b = (document.querySelector('#storybook-root,#root')||document.body).querySelector('button:not([disabled]),[role=button]'); if(b) b.click(); return !!b; })()`, returnByValue: true });
  await sleep(900);
  const { data } = await S('Page.captureScreenshot', { format: 'png' });
  const f = `/tmp/open-${id}.png`; writeFileSync(f, Buffer.from(data, 'base64')); out.push(f);
}
console.log('SHOTS:\n' + out.join('\n'));
ws.close(); chrome.kill(); server.close(); process.exit(0);
