'use client';
// Forge — API Workbench. A Stripe-style docked, resizable bottom drawer for the
// API detail page. Left: the Forge Shell (a sandbox CLI where you run forge /
// curl commands and read the output). Right: the API Explorer (resource +
// method selectors, headers and parameters with type chips and value inputs,
// a live code snippet, and "Run request" — which composes a command, runs it in
// the shell, and prints the mocked response). Non-modal: the docs stay visible
// and scrollable above it. Mounted via a portal to <body>.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Icons, Pill, Select } from '@/ds/core';
import {
  APIS, endpointsFor, getApi, httpFor, snippetFor, LANGS,
  type Api, type Endpoint, type Field, type Lang,
} from '@/portal/data/apis';

const METHOD_TONE: Record<string, 'success' | 'ice' | 'warning' | 'danger' | 'neutral'> = {
  GET: 'success', POST: 'ice', PUT: 'warning', DELETE: 'danger',
  RPC: 'neutral', QUERY: 'neutral', EVENT: 'neutral',
};

// Field type → short chip label (Stripe-style: Str / Int / Hash / List / Bool).
function typeChip(t: string): string {
  if (/\[\]$/.test(t)) return 'List';
  if (/^int|^number|^float/i.test(t)) return 'Int';
  if (/^bool/i.test(t)) return 'Bool';
  if (/^object|^hash|^map/i.test(t)) return 'Hash';
  return 'Str';
}

interface HeaderRow { name: string; value: string; placeholder?: string }

function headersFor(ep: Endpoint): HeaderRow[] {
  const rows: HeaderRow[] = [];
  if (ep.auth === 'oauth2') rows.push({ name: 'Authorization', value: 'Bearer sandbox_tok_8c2f…e91' });
  if (ep.auth === 'api-key') rows.push({ name: 'X-API-Key', value: 'sk_test_8c2f…e91' });
  const hasBody = ep.method === 'POST' || ep.method === 'PUT' || ep.method === 'RPC' || ep.method === 'QUERY' || ep.method === 'EVENT';
  if (hasBody) rows.push({ name: 'Content-Type', value: 'application/json' });
  if (ep.method === 'POST') rows.push({ name: 'Idempotency-Key', value: '', placeholder: 'optional' });
  return rows;
}

// Seed param values from the endpoint's sample request body (so the explorer
// opens pre-filled, like the docs example).
function seedParams(ep: Endpoint): Record<string, string> {
  const out: Record<string, string> = {};
  let sample: Record<string, unknown> = {};
  if (ep.request) { try { sample = JSON.parse(ep.request); } catch { /* keep empty */ } }
  for (const f of ep.fields ?? []) {
    const v = sample[f.name];
    if (v === undefined) { out[f.name] = ''; continue; }
    out[f.name] = typeof v === 'string' ? v : JSON.stringify(v);
  }
  return out;
}

// Build the live HTTP request from current param values: path params replace
// {name}, query params append a querystring, body params assemble the JSON.
function buildLive(api: Api, ep: Endpoint, params: Record<string, string>): { url: string; body?: string } {
  const r = httpFor(api, ep);
  let url = r.url;
  const query: string[] = [];
  const bodyObj: Record<string, unknown> = {};
  for (const f of ep.fields ?? []) {
    const raw = params[f.name];
    if (raw === undefined || raw === '') continue;
    // Keep declared strings as strings (CPF/CNPJ must not become a number);
    // parse everything else (int / bool / list / hash) from the input.
    let val: unknown = raw;
    if (!/^string$/i.test(f.type)) { try { val = JSON.parse(raw); } catch { val = raw; } }
    if (f.in === 'path') url = url.replace(`{${f.name}}`, encodeURIComponent(raw));
    else if (f.in === 'query') query.push(`${f.name}=${encodeURIComponent(raw)}`);
    else if (f.in === 'body') bodyObj[f.name] = val;
  }
  if (query.length) url += (url.includes('?') ? '&' : '?') + query.join('&');
  const hasBodyFields = (ep.fields ?? []).some((f) => f.in === 'body');
  const body = hasBodyFields
    ? JSON.stringify(bodyObj, null, 2)
    : r.body; // gRPC/GraphQL/Event keep their composed body
  return { url, body };
}

// Compose the shell command for a run (curl, the lingua franca of the console).
function curlCommand(method: string, url: string, headers: HeaderRow[], body?: string): string {
  const parts = [`$ curl -X ${method} "${url}"`];
  for (const h of headers) if (h.value) parts.push(`  -H "${h.name}: ${h.value}"`);
  if (body) parts.push(`  -d '${body.replace(/\n\s*/g, ' ')}'`);
  return parts.join(' \\\n');
}

// ── Shell line model ──────────────────────────────────────────────────────────
type Line = { t: 'banner' | 'art' | 'in' | 'out' | 'ok' | 'err'; text: string };

// ASCII banner printed at the top of the shell — the Forge CLI signature
// (figlet "ANSI Shadow"), so the sandbox reads like a real terminal.
const FORGE_ART = [
  '███████╗ ██████╗ ██████╗  ██████╗ ███████╗',
  '██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝',
  '█████╗  ██║   ██║██████╔╝██║  ███╗█████╗  ',
  '██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  ',
  '██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗',
  '╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝',
].join('\n');

const BANNER: Line[] = [
  { t: 'art', text: FORGE_ART },
  { t: 'banner', text: 'Forge CLI · v2.4.0 · sandbox (test mode). Commands run against the mocked API catalog.' },
  { t: 'banner', text: "Type 'help' for commands, or 'forge api <resource> <method>' to call an endpoint." },
];

// ── Workbench ─────────────────────────────────────────────────────────────────

export function ApiWorkbench({
  api, initialIdx = 0, open, onClose,
}: { api: Api; initialIdx?: number; open: boolean; onClose: () => void }) {
  const [height, setHeight] = React.useState(440);
  const [maxed, setMaxed] = React.useState(false);
  const [pane, setPane] = React.useState<'shell' | 'inspector'>('shell');

  // API Explorer state
  const [resourceId, setResourceId] = React.useState(api.id);
  const [methodIdx, setMethodIdx] = React.useState(initialIdx);
  const [headerVals, setHeaderVals] = React.useState<HeaderRow[]>([]);
  const [paramVals, setParamVals] = React.useState<Record<string, string>>({});
  const [lang, setLang] = React.useState<Lang>('curl');
  const [showCode, setShowCode] = React.useState(true);

  // Shell state
  const [lines, setLines] = React.useState<Line[]>(BANNER);
  const [input, setInput] = React.useState('');
  const [running, setRunning] = React.useState(false);
  const [lastResponse, setLastResponse] = React.useState<{ ep: Endpoint; body: string } | null>(null);

  const resource = getApi(resourceId) ?? api;
  const endpoints = React.useMemo(() => endpointsFor(resource), [resource]);
  const ep = endpoints[methodIdx] ?? endpoints[0];

  const outRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // When the drawer opens for a new endpoint, sync the selection.
  React.useEffect(() => {
    if (open) { setResourceId(api.id); setMethodIdx(initialIdx); }
  }, [open, api.id, initialIdx]);

  // Re-seed headers + params whenever the selected endpoint changes.
  React.useEffect(() => {
    if (!ep) return;
    setHeaderVals(headersFor(ep));
    setParamVals(seedParams(ep));
  }, [resourceId, methodIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the shell scrolled to the latest line.
  React.useEffect(() => { outRef.current?.scrollTo({ top: outRef.current.scrollHeight }); }, [lines]);

  React.useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  if (!open) return null;

  const live = buildLive(resource, ep, paramVals);
  const code = snippetFor(resource, ep, lang, { url: live.url, body: live.body });

  const append = (next: Line[]) => setLines((prev) => [...prev, ...next]);

  // Run the current endpoint with the explorer's values.
  const runRequest = () => {
    if (running) return;
    setPane('shell');
    setRunning(true);
    append([{ t: 'in', text: curlCommand(ep.method, live.url, headerVals, live.body) }]);
    window.setTimeout(() => {
      append([
        { t: 'ok', text: `200 OK · ${ep.p95 > 0 ? `${ep.p95}ms` : 'async'} · sandbox` },
        { t: 'out', text: ep.example },
      ]);
      setLastResponse({ ep, body: ep.example });
      setRunning(false);
    }, 480);
  };

  // Parse a typed shell command (best-effort mock).
  const runTyped = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    append([{ t: 'in', text: `$ ${trimmed}` }]);
    setInput('');
    if (trimmed === 'clear') { setLines(BANNER); return; }
    if (trimmed === 'help') {
      append([{ t: 'out', text: [
        'forge api <resource> <method>   run a catalog endpoint (e.g. forge api acerta-consulta POST)',
        'curl -X <M> "<url>" ...          call the API directly',
        'forge whoami                     show the sandbox identity',
        'clear                            clear the screen',
      ].join('\n') }]);
      return;
    }
    if (trimmed === 'forge whoami') {
      append([{ t: 'out', text: 'svc:sandbox · platform identity · scopes: read,write (test mode)' }]);
      return;
    }
    // forge api <resource> <method>
    const m = trimmed.match(/^forge\s+api\s+(\S+)\s+(\S+)/i);
    if (m) {
      const target = getApi(m[1]);
      if (!target) { append([{ t: 'err', text: `forge: unknown resource '${m[1]}'. See the catalog.` }]); return; }
      const eps = endpointsFor(target);
      const found = eps.find((e) => e.method.toLowerCase() === m[2].toLowerCase()) ?? eps[0];
      setRunning(true);
      window.setTimeout(() => {
        append([{ t: 'ok', text: `200 OK · ${found.p95 > 0 ? `${found.p95}ms` : 'async'} · sandbox` }, { t: 'out', text: found.example }]);
        setLastResponse({ ep: found, body: found.example });
        setRunning(false);
      }, 420);
      return;
    }
    if (/^curl\b/i.test(trimmed)) {
      // Match the URL to a catalog endpoint; answer with its mock.
      const all = APIS.flatMap((a) => endpointsFor(a).map((e) => ({ a, e })));
      const hit = all.find(({ a, e }) => trimmed.includes(httpFor(a, e).url.split('?')[0].replace(/\{[^}]+\}/g, '')));
      const answer = hit?.e.example ?? '{\n  "status": "ok"\n}';
      setRunning(true);
      window.setTimeout(() => {
        append([{ t: 'ok', text: '200 OK · sandbox' }, { t: 'out', text: answer }]);
        setRunning(false);
      }, 420);
      return;
    }
    append([{ t: 'err', text: `forge: command not found: ${trimmed.split(' ')[0]}. Try 'help'.` }]);
  };

  const effHeight = maxed ? 'calc(100vh - 56px)' : `${height}px`;

  const onResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setMaxed(false);
    const startY = e.clientY;
    const startH = height;
    const onMove = (ev: MouseEvent) => {
      const next = Math.min(Math.max(startH + (startY - ev.clientY), 260), window.innerHeight - 80);
      setHeight(next);
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const drawer = (
    <div className="fp-wb" style={{ blockSize: effHeight }} role="dialog" aria-label="API Workbench">
      <div className="fp-wb-resize" onMouseDown={onResizeStart} role="separator" aria-label="Resize workbench" aria-orientation="horizontal" />

      <div className="fp-wb-head">
        <span className="fp-wb-title">Workbench</span>
        <Pill tone="ice">Sandbox</Pill>
        <div className="fp-wb-tabs" role="tablist" aria-label="Left pane">
          {(['shell', 'inspector'] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={pane === k} className={`fp-wb-tab${pane === k ? ' is-active' : ''}`} onClick={() => setPane(k)}>
              {k === 'shell' ? 'Shell' : 'Inspector'}
            </button>
          ))}
        </div>
        <div className="fp-wb-head-actions">
          <button type="button" className="fp-wb-iconaction" onClick={() => setMaxed((v) => !v)} aria-label={maxed ? 'Restore' : 'Maximize'} title={maxed ? 'Restore' : 'Maximize'}>
            {maxed ? <Icons.minimize size={15} /> : <Icons.maximize size={15} />}
          </button>
          <button type="button" className="fp-wb-iconaction" onClick={onClose} aria-label="Close workbench" title="Close">
            <Icons.x size={16} />
          </button>
        </div>
      </div>

      <div className="fp-wb-body">
        {/* Left — Shell / Inspector */}
        <div className="fp-wb-left">
          {pane === 'shell' ? (
            <div className="fp-wb-shell">
              <div className="fp-wb-shell-bar">
                <span className="fp-wb-shell-dot" aria-hidden="true" />
                <span className="fp-wb-shell-name mono">forge-shell · sandbox</span>
                <button type="button" className="fp-wb-iconaction" onClick={() => setLines(BANNER)} aria-label="Clear shell" title="Clear">
                  <Icons.trash size={13} />
                </button>
              </div>
              <div className="fp-wb-shell-out mono" ref={outRef} onClick={() => inputRef.current?.focus()}>
                {lines.map((l, i) => (
                  <pre key={i} className={`fp-wb-line is-${l.t}`}>{l.text}</pre>
                ))}
                {running ? (
                  <pre className="fp-wb-line is-out">running…</pre>
                ) : (
                  <div className="fp-wb-promptline">
                    <span className="sign" aria-hidden="true">$</span>
                    <input
                      ref={inputRef}
                      className="fp-wb-cmd"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') runTyped(input); }}
                      placeholder="forge api acerta-consulta POST"
                      aria-label="Shell command"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="fp-wb-inspector">
              {lastResponse ? (
                <>
                  <div className="fp-wb-insp-head mono">
                    <Pill tone={METHOD_TONE[lastResponse.ep.method]}>{lastResponse.ep.method}</Pill>
                    <span className="ok">200 OK</span>
                    <span>{lastResponse.ep.path}</span>
                  </div>
                  <pre className="fp-wb-line is-out mono" style={{ padding: '14px 16px' }}>{lastResponse.body}</pre>
                </>
              ) : (
                <div className="fp-empty"><Icons.terminal size={14} /><span>Run a request to inspect its response here.</span></div>
              )}
            </div>
          )}
        </div>

        {/* Right — API Explorer */}
        <div className="fp-wb-explorer">
          <div className="fp-wb-exp-scroll">
            <div className="fp-wb-exp-h">API Explorer</div>

            <div className="fp-wb-selrow">
              <label className="fp-wb-sel">
                <span className="k">Resource</span>
                <Select
                  value={resourceId}
                  onValueChange={(v) => { setResourceId(v); setMethodIdx(0); }}
                  options={APIS.map((a) => ({ value: a.id, label: `${a.name} · ${a.kind}` }))}
                  width="100%"
                  searchable
                />
              </label>
              <label className="fp-wb-sel">
                <span className="k">Method</span>
                <Select
                  value={String(methodIdx)}
                  onValueChange={(v) => setMethodIdx(Number(v))}
                  options={endpoints.map((e, i) => ({ value: String(i), label: `${e.method} ${e.path}` }))}
                  width="100%"
                />
              </label>
            </div>

            <div className="fp-wb-sec">
              <div className="fp-wb-sec-h">Headers</div>
              {headerVals.length === 0 ? (
                <p className="fp-wb-sec-empty">No headers required.</p>
              ) : headerVals.map((h, i) => (
                <div key={h.name} className="fp-wb-field-row">
                  <span className="fp-wb-field-name mono">{h.name}</span>
                  <span className="fp-wb-type">Str</span>
                  <input
                    className="fp-wb-val mono"
                    value={h.value}
                    placeholder={h.placeholder ? `// ${h.placeholder}` : '// enter a value'}
                    onChange={(e) => setHeaderVals((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                    aria-label={h.name}
                    spellCheck={false}
                  />
                </div>
              ))}
            </div>

            <div className="fp-wb-sec">
              <div className="fp-wb-sec-h">Parameters</div>
              {(ep.fields ?? []).length === 0 ? (
                <p className="fp-wb-sec-empty">This endpoint takes no parameters.</p>
              ) : (ep.fields ?? []).map((f: Field) => (
                <div key={f.name} className="fp-wb-field-row">
                  <span className="fp-wb-field-name mono">
                    {f.name}{f.req && <span className="req" aria-hidden="true">*</span>}
                  </span>
                  <span className="fp-wb-type">{typeChip(f.type)}</span>
                  <input
                    className="fp-wb-val mono"
                    value={paramVals[f.name] ?? ''}
                    placeholder="// enter the value"
                    onChange={(e) => setParamVals((prev) => ({ ...prev, [f.name]: e.target.value }))}
                    aria-label={f.name}
                    spellCheck={false}
                  />
                </div>
              ))}
            </div>

            {showCode && (
              <div className="fp-wb-code">
                <div className="fp-wb-code-head">
                  <span className="fp-wb-langsel">
                    <Select value={lang} onValueChange={(v) => setLang(v as Lang)} options={LANGS.map((l) => ({ value: l.id, label: l.label }))} width="148px" />
                  </span>
                  <button type="button" className="fp-copy" onClick={() => { navigator.clipboard?.writeText(code).catch(() => {}); }}>
                    <Icons.copy size={12} /> Copy
                  </button>
                </div>
                <pre className="fp-wb-code-body mono">{code}</pre>
              </div>
            )}
          </div>

          <div className="fp-wb-foot">
            <button type="button" className="fp-wb-link" onClick={() => setShowCode((s) => !s)}>
              <Icons.terminal size={12} /> {showCode ? 'Hide code' : 'Show code'}
            </button>
            <span className="fp-wb-foot-spacer" />
            <Button variant="ghost" size="sm" onClick={() => setLines(BANNER)}>Clear</Button>
            <Button variant="ember" size="sm" onClick={runRequest} disabled={running}>
              <Icons.play size={12} /> {running ? 'Running…' : 'Run request'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(drawer, document.body) : null;
}
