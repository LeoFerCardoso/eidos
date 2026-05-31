// Headless screenshot of specific Storybook stories — to eyeball visual fixes.
// Serves apps/storybook/storybook-static, drives Chrome via CDP, writes PNGs to /tmp.
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';
import http from 'node:http';
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find((p) => p && existsSync(p)) || 'google-chrome';

const ROOT = 'apps/storybook/storybook-static';
const idx = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8'));
// pick first matching story id per query
const want = process.argv.slice(2);
const ids = want.map((q) => Object.keys(idx.entries).find((id) => id === q || idx.entries[id].title.toLowerCase().includes(q.toLowerCase())) || q);

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
await new Promise((r) => server.listen(6007, r));

const PORT = 9333;
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2', '--window-size=900,520', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => { http.get({ host: 'localhost', port: PORT, path }, (res) => { let d = ''; res.on('data', (c) => d += c); res.on('end', () => resolve(JSON.parse(d))); }).on('error', reject); });

let target;
for (let i = 0; i < 40; i++) { try { const v = await getJSON('/json/version'); target = v.webSocketDebuggerUrl; break; } catch { await sleep(250); } }
const ws = new WebSocket(target, { maxPayload: 64 * 1024 * 1024 });
await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); });
let mid = 0; const pending = new Map();
ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const sendS = (method, params = {}) => new Promise((r) => { const id = ++mid; pending.set(id, r); ws.send(JSON.stringify({ id, sessionId, method, params })); });
await sendS('Page.enable');

const out = [];
for (const id of ids) {
  await sendS('Page.navigate', { url: `http://localhost:6007/iframe.html?id=${id}&viewMode=story` });
  await sleep(2200);
  const { data } = await sendS('Page.captureScreenshot', { format: 'png' });
  const file = `/tmp/shot-${id}.png`;
  writeFileSync(file, Buffer.from(data, 'base64'));
  out.push(file);
}
console.log('SHOTS:\n' + out.join('\n'));
ws.close(); chrome.kill(); server.close();
process.exit(0);
