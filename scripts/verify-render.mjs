// Headless render check over the Chrome DevTools protocol (no puppeteer).
// For each route: Page.navigate, wait for load, then poll Runtime.evaluate
// from the Node side (DOM checks only — never navigate inside an awaited eval,
// which would destroy the execution context). Reports shell/content signals
// and any page errors.
import { spawn } from 'node:child_process';
import http from 'node:http';
import { WebSocket } from 'ws';

// Resolve a Chrome/Chromium binary: explicit CHROME_PATH wins, else try common
// macOS/Linux locations so this works locally and in CI (browser-actions/setup-chrome).
import { existsSync } from 'node:fs';
const CHROME =
  [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].find((p) => p && existsSync(p)) || 'google-chrome';
const PORT = 9222;
const BASE = 'http://localhost:3000';
const routes = process.argv.slice(2);
if (!routes.length) routes.push('/');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJSON = (path) =>
  new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port: PORT, path }, (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve(JSON.parse(d)));
      })
      .on('error', reject);
  });

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=/tmp/eidos-chrome-verify',
  'about:blank',
]);

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = {};
    this.errors = [];
    this.consoleErrors = [];
    ws.on('message', (raw) => {
      const m = JSON.parse(raw);
      if (m.id && this.pending[m.id]) {
        this.pending[m.id](m);
        delete this.pending[m.id];
      } else if (m.method === 'Runtime.exceptionThrown') {
        this.errors.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text);
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        // React render errors surface here (not as exceptionThrown). Stringify args.
        const text = (m.params.args || [])
          .map((a) => a.description || a.value || (a.preview && a.preview.description) || '')
          .join(' ')
          .trim();
        // Ignore benign noise (favicon, external local listeners, dev HMR pings).
        // Known-benign dev warnings that don't stop a page rendering:
        //  • favicon / external local listeners / RDT promo
        //  • controlled `value` without `onChange` — intentional in static demo previews
        const benign = /favicon|\/api\/mynas|Download the React DevTools|provided a `value` prop to a form field without an `onChange`/i;
        if (text && !benign.test(text)) this.consoleErrors.push(text);
      }
    });
  }
  send(method, params = {}) {
    const i = ++this.id;
    return new Promise((resolve) => {
      this.pending[i] = (m) => resolve(m.result);
      this.ws.send(JSON.stringify({ id: i, method, params }));
    });
  }
}

async function main() {
  let targets;
  for (let i = 0; i < 50; i++) {
    try {
      targets = await getJSON('/json/list');
      break;
    } catch {
      await sleep(300);
    }
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.on('open', res);
    ws.on('error', rej);
  });
  const cdp = new CDP(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const probe = `(() => {
    const shell = document.querySelector('.ds-sidenav, .ds-app');
    const links = document.querySelectorAll('.ds-sidenav a, .ds-link').length;
    // Example screens render full-screen OUTSIDE the docs shell, composing the
    // Eidos example shells (.fp-* IDP rail/grid/card, or the AI .ai-shell).
    const example = document.querySelector('.fp-rail, [class*="fp-"], .ai-shell, [class*="fshell"], #example-root, .f-shell');
    const txt = (document.body.innerText || '');
    const splash = txt.includes('Loading Eidos');
    // Intentional placeholder pages (mobile components queued for a dedicated build).
    const scaffold = /to be designed|to be built|Scaffolded —/i.test(txt);
    const crumbs = (document.querySelector('.crumbs')||{}).innerText || null;
    const h1 = (document.querySelector('h1, .ds-h1')||{}).innerText || null;
    return JSON.stringify({ hasShell: !!shell, navLinks: links, hasExample: !!example, scaffold, splash, crumbs, h1, bodyLen: txt.length });
  })()`;

  const failures = [];
  for (const route of routes) {
    cdp.errors.length = 0;
    cdp.consoleErrors.length = 0;
    await cdp.send('Page.navigate', { url: BASE + route });
    let result = null;
    const deadline = Date.now() + 22000;
    while (Date.now() < deadline) {
      await sleep(500);
      const r = await cdp.send('Runtime.evaluate', { expression: probe, returnByValue: true });
      const v = r?.result?.value ? JSON.parse(r.result.value) : null;
      // Settled once the CONTENT (not just the shell) has rendered. DSPageLoader
      // mounts page content async after the docs shell appears, so require a real
      // body — otherwise we'd snapshot the empty shell mid-compile. Example screens
      // have no docs shell, so a content-rich body alone settles them.
      if (v && !v.splash && v.bodyLen > 120 && (v.hasShell || v.hasExample || v.bodyLen > 400)) {
        result = v;
        break;
      }
      result = v;
    }
    const isExample = route.startsWith('/example/');
    // A route fails if: nothing rendered, stuck on splash, no shell AND no example
    // mount, a thin body (render error left an empty content column), an uncaught
    // exception, or a React render console.error.
    const reasons = [];
    if (!result) reasons.push('no-render');
    else if (result.splash) reasons.push('stuck-splash');
    else if (isExample) {
      // Example screens render full-screen OUTSIDE the docs shell — the real
      // signal is "rendered real content", not the presence of a shell.
      if (result.bodyLen < 200) reasons.push('thin-body(' + result.bodyLen + ')');
    } else {
      if (!result.hasShell && !result.hasExample) reasons.push('no-shell');
      // Thin body = a render error left the content column empty. Scaffold
      // placeholders legitimately have short bodies — don't flag them.
      if (result.bodyLen < 200 && !result.scaffold) reasons.push('thin-body(' + result.bodyLen + ')');
    }
    if (cdp.errors.length) reasons.push('exception');
    if (cdp.consoleErrors.length) reasons.push('console-error');

    console.log(`ROUTE ${route} ->`, JSON.stringify(result));
    if (cdp.errors.length) console.log('   PAGE ERRORS:', cdp.errors.slice(0, 5).join(' | '));
    if (cdp.consoleErrors.length) console.log('   CONSOLE ERRORS:', cdp.consoleErrors.slice(0, 5).join(' | '));
    if (reasons.length) failures.push({ route, reasons, errs: [...cdp.errors, ...cdp.consoleErrors].slice(0, 3) });
  }
  ws.close();

  console.log(`\n===== SWEEP SUMMARY: ${routes.length - failures.length}/${routes.length} clean =====`);
  if (failures.length) {
    console.log(`FAILURES (${failures.length}):`);
    for (const f of failures) console.log(`  ✗ ${f.route} [${f.reasons.join(', ')}]${f.errs.length ? ' :: ' + f.errs.join(' | ') : ''}`);
    process.exitCode = 1;
  } else {
    console.log('All routes rendered clean (shell present, no exceptions, no console errors).');
  }
}

main()
  .catch((e) => console.log('VERIFY_FAILED:', e.message))
  .finally(() => chrome.kill());
