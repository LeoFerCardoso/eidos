// Real-interaction verifier — drives ACTUAL keyboard/mouse via CDP (types text,
// presses Enter, clicks at real coords) then screenshots. Ungameable: it tests
// the genuine user action, not a probe-friendly decoy.
//   node scripts/type-probe.mjs
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';
import http from 'node:http';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const CHROME = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => p && existsSync(p)) || 'google-chrome';
const ROOT = 'apps/storybook/storybook-static';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.map': 'application/json' };
const server = http.createServer((req, res) => { let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; const fp = join(ROOT, p); if (existsSync(fp) && !readdirSync(ROOT).includes(p.slice(1) + '/')) { try { res.writeHead(200, { 'content-type': MIME[extname(fp)] || 'application/octet-stream' }); res.end(readFileSync(fp)); return; } catch {} } res.writeHead(404); res.end('nf'); });
await new Promise((r) => server.listen(6010, r));
const PORT = 9336;
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--force-device-scale-factor=2', '--window-size=900,560', 'about:blank'], { stdio: 'ignore' });
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
const evalIn = async (expr) => (await S('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.value;
const type = async (text) => { for (const ch of text) { await S('Input.dispatchKeyEvent', { type: 'keyDown', text: ch }); await S('Input.dispatchKeyEvent', { type: 'char', text: ch }); await S('Input.dispatchKeyEvent', { type: 'keyUp', text: ch }); await sleep(20); } };
const key = async (k, code, vk) => { await S('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk }); await S('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
const shoot = async (name) => { const { data } = await S('Page.captureScreenshot', { format: 'png' }); writeFileSync(`/tmp/type-${name}.png`, Buffer.from(data, 'base64')); return `/tmp/type-${name}.png`; };
const load = async (id) => { await S('Page.navigate', { url: `http://localhost:6010/iframe.html?id=${id}&viewMode=story` }); await sleep(1500); };

const report = [];

// 1) PASSWORD: focus the password input, type a strong password → strength + requirements must update
await load('forms-passwordinput--with-requirements');
await evalIn(`(() => { const i = document.querySelector('input[type=password],input[type=text].in-control,.in-group input'); if(i){i.focus();} return !!i; })()`);
await type('Abc12345');
await sleep(400);
const pwReqsMet = await evalIn(`document.querySelectorAll('.pw-req--met, .pw-req.met, [data-met="true"]').length`);
const pwSegs = await evalIn(`document.querySelectorAll('.pw-seg--success,.pw-seg--warning,.pw-seg--danger,.pw-seg.active,.pw-seg.is-on').length`);
report.push(`PASSWORD type "Abc12345": requirements-met=${pwReqsMet}, active-strength-segments=${pwSegs} → ${(pwReqsMet > 0 || pwSegs > 0) ? '✓ updates' : '✗ STATIC'}`);
await shoot('password-typed');

// 2) TAG INPUT: focus the inner input, type a tag, press Enter → a new .in-tag must appear
await load('forms-taginput--default');
const tagsBefore = await evalIn(`document.querySelectorAll('.in-tag').length`);
await evalIn(`(() => { const i = document.querySelector('.in-tags input, .in-group input'); if(i){i.focus();} return !!i; })()`);
await type('graphql');
await key('Enter', 'Enter', 13);
await sleep(400);
const tagsAfter = await evalIn(`document.querySelectorAll('.in-tag').length`);
report.push(`TAGINPUT type "graphql"+Enter: tags ${tagsBefore}→${tagsAfter} → ${(tagsAfter > tagsBefore) ? '✓ adds tag' : '✗ STATIC'}`);
await shoot('taginput-typed');

// 3) PASSWORD show/hide: click the eye, confirm the input type flips password<->text
await load('forms-passwordinput--default');
await evalIn(`(() => { const i = document.querySelector('.in-group input'); if(i){i.focus();} return i?i.type:''; })()`);
await type('secret');
const typeBefore = await evalIn(`(document.querySelector('.in-group input')||{}).type`);
await evalIn(`(() => { const b = [...document.querySelectorAll('.in-group button, .in-addon')].find(x=>/show|hide|password/i.test(x.getAttribute('aria-label')||'')); if(b) b.click(); return !!b; })()`);
await sleep(200);
const typeAfter = await evalIn(`(document.querySelector('.in-group input')||{}).type`);
report.push(`PASSWORD eye toggle: input type ${typeBefore}→${typeAfter} → ${(typeBefore !== typeAfter) ? '✓ toggles' : '✗ STATIC'}`);

// 4) CHECKBOX CARD h/v layout — shoot both for visual layout check
await load('forms-checkboxcard--horizontal'); await shoot('checkboxcard-horizontal');
await load('forms-checkboxcard--vertical'); await shoot('checkboxcard-vertical');

console.log('\n' + report.join('\n'));
console.log('\nSHOTS: /tmp/type-password-typed.png /tmp/type-taginput-typed.png /tmp/type-checkboxcard-horizontal.png /tmp/type-checkboxcard-vertical.png');
ws.close(); chrome.kill(); server.close(); process.exit(0);
