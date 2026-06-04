// Headless console capture over CDP — surfaces EVERY console message
// (log/info/warn/error), uncaught exceptions and React hydration warnings for a
// route. Use to verify a page is truly clean in the browser (verify-render only
// catches a subset).  Usage: node scripts/console-check.mjs /portal/catalog/acerta-api
import { spawn } from 'node:child_process';
import http from 'node:http';
import { existsSync } from 'node:fs';
import { WebSocket } from 'ws';

const CHROME = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find((p) => p && existsSync(p)) || 'google-chrome';

const PORT = 9224;
const BASE = 'http://localhost:3000';
const route = process.argv[2] || '/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) => new Promise((resolve, reject) => {
  http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
    let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve(JSON.parse(d)));
  }).on('error', reject);
});

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check',
  '--user-data-dir=/tmp/eidos-chrome-console', 'about:blank',
]);

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = {}; this.handlers = [];
    ws.on('message', (raw) => { const m = JSON.parse(raw);
      if (m.id && this.pending[m.id]) { this.pending[m.id](m); delete this.pending[m.id]; }
      else if (m.method) this.handlers.forEach((h) => h(m)); }); }
  send(method, params = {}) { const i = ++this.id; return new Promise((resolve) => { this.pending[i] = (m) => resolve(m.result); this.ws.send(JSON.stringify({ id: i, method, params })); }); }
  on(fn) { this.handlers.push(fn); }
}

const fmtArg = (a) => a?.value ?? a?.description ?? (a?.preview ? JSON.stringify(a.preview) : a?.type) ?? '';

async function main() {
  let targets;
  for (let i = 0; i < 60; i++) { try { targets = await getJSON('/json/list'); break; } catch { await sleep(300); } }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.on('open', res); ws.on('error', rej); });
  const cdp = new CDP(ws);

  const msgs = [];
  cdp.on((m) => {
    if (m.method === 'Runtime.consoleAPICalled') {
      msgs.push({ kind: m.params.type, text: m.params.args.map(fmtArg).join(' ') });
    } else if (m.method === 'Runtime.exceptionThrown') {
      const e = m.params.exceptionDetails;
      msgs.push({ kind: 'exception', text: e.exception?.description || e.text });
    } else if (m.method === 'Log.entryAdded') {
      msgs.push({ kind: m.params.entry.level, text: m.params.entry.text });
    }
  });

  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Page.enable');
  await cdp.send('Page.navigate', { url: BASE + route });
  await sleep(4800);
  // Optional click expressions (extra args) to exercise interactive states.
  const clicks = process.argv.slice(3);
  const HELPERS = `function btnByText(t){return [...document.querySelectorAll('button')].find(b=>b.textContent.trim().includes(t));}`;
  for (const expr of clicks) {
    await cdp.send('Runtime.evaluate', { expression: `${HELPERS}\n(${expr})?.click()` });
    await sleep(1100);
  }
  ws.close();

  const interesting = msgs.filter((m) => ['error', 'warning', 'exception'].includes(m.kind));
  console.log(`\n=== CONSOLE for ${route} ===`);
  console.log(`total messages: ${msgs.length} · errors/warnings/exceptions: ${interesting.length}`);
  for (const m of interesting) console.log(`  [${m.kind}] ${m.text.slice(0, 280)}`);
  if (interesting.length === 0) console.log('  ✓ clean — no errors, warnings, or exceptions');
  chrome.kill();
  process.exit(interesting.length ? 1 : 0);
}
main().catch((e) => { console.error(e); chrome.kill(); process.exit(2); });
