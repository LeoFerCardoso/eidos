// Screenshot a running docs route (full page) for visual QA. Requires `npm run start`.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { WebSocket } from 'ws';
import { existsSync, writeFileSync } from 'node:fs';

const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => p && existsSync(p)) || 'google-chrome';
const PORT = 9344, BASE = 'http://localhost:3000';
const route = process.argv[2] || '/';
const out = process.argv[3] || `/tmp/route${route.replace(/\//g, '-')}.png`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (p) => new Promise((res, rej) => http.get({ host: '127.0.0.1', port: PORT, path: p }, (r) => { let d = ''; r.on('data', (c) => d += c); r.on('end', () => res(JSON.parse(d))); }).on('error', rej));

const chrome = spawn(CHROME, [`--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2', '--window-size=1280,1200', '--user-data-dir=/tmp/eidos-route', 'about:blank'], { stdio: 'ignore' });
let targets;
for (let i = 0; i < 50; i++) { try { targets = await getJSON('/json/list'); break; } catch { await sleep(300); } }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); });
let id = 0; const pend = {};
ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.id && pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1200, deviceScaleFactor: 2, mobile: false });
await send('Page.navigate', { url: BASE + route });
await sleep(3500);
const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1280, height: 900, scale: 1 } });
writeFileSync(out, Buffer.from(data, 'base64'));
console.log('SHOT ' + out);
ws.close(); chrome.kill(); process.exit(0);
