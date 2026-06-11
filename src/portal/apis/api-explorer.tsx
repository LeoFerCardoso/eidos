'use client';
// Forge — API explorer (Postman-inspired). The ONE component behind
// /portal/apis/[id] and the service detail's API tab. A master-detail over the
// API's endpoints: pick an endpoint on the left, read its docs, copy an
// integration snippet in six languages, or run it in a sandbox console
// (editable request body → request payload + mocked 200 response). An OpenAPI
// toggle swaps the master-detail for the machine-readable spec.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill } from '@/ds/core';
import {
  endpointsFor, httpFor, openapiFor, snippetFor, LANGS,
  type Api, type Endpoint, type HttpMethod, type Lang,
} from '@/portal/data/apis';
import { ApiWorkbench } from '@/portal/apis/api-workbench';

const METHOD_TONE: Record<HttpMethod, 'success' | 'ice' | 'warning' | 'danger' | 'neutral'> = {
  GET: 'success',
  POST: 'ice',
  PUT: 'warning',
  DELETE: 'danger',
  RPC: 'neutral',
  QUERY: 'neutral',
  EVENT: 'neutral',
};

const AUTH_NOTE: Record<Endpoint['auth'], React.ReactNode> = {
  oauth2: <>OAuth2 bearer token · set <span className="mono">FORGE_TOKEN</span> from your service credentials.</>,
  'api-key': <>Partner API key in the <span className="mono">X-API-Key</span> header · rotate it in Settings.</>,
  mtls: <>Mutual TLS required · present your client certificate to the gateway.</>,
  none: <>No authentication required for this endpoint.</>,
};

// ── Small reusables ───────────────────────────────────────────────────────────

function CopyAction({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <button
      type="button"
      className="fp-copy"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch { /* clipboard blocked */ }
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? <Icons.check size={12} /> : <Icons.copy size={12} />}
      {done ? 'Copied' : label}
    </button>
  );
}


export function OpenApiBlock({ api }: { api: Api }) {
  return (
    <div className="fp-card" style={{ padding: 0 }}>
      <div className="fp-api-doc-head">
        <span className="mono">{api.id}.openapi.yaml</span>
        <CopyAction text={openapiFor(api)} label="Copy spec" />
      </div>
      <pre className="fp-api-doc mono">{openapiFor(api)}</pre>
    </div>
  );
}

// ── Endpoint list (master) ────────────────────────────────────────────────────

function EndpointList({
  endpoints, activeIdx, onSelect,
}: { endpoints: Endpoint[]; activeIdx: number; onSelect: (i: number) => void }) {
  return (
    <div className="fp-apix-list" role="tablist" aria-label="Endpoints" aria-orientation="vertical">
      <div className="fp-apix-list-head">
        <span className="t">Endpoints</span>
        <span className="c mono">{endpoints.length}</span>
      </div>
      {endpoints.map((e, i) => (
        <button
          key={`${e.method}-${e.path}`}
          type="button"
          role="tab"
          aria-selected={i === activeIdx}
          className={`fp-apix-ep${i === activeIdx ? ' is-active' : ''}`}
          onClick={() => onSelect(i)}
        >
          <Pill tone={METHOD_TONE[e.method]}>{e.method}</Pill>
          <span className="fp-apix-ep-tx">
            <span className="s">{e.summary}{e.deprecated && <span className="fp-apix-ep-dep">deprecated</span>}</span>
            <span className="p mono">{e.path}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function CodeBlock({ head, code }: { head: React.ReactNode; code: string }) {
  return (
    <div className="fp-code">
      <div className="fp-code-head">
        <span className="fp-code-head-t">{head}</span>
        <CopyAction text={code} />
      </div>
      <pre className="fp-code-body mono">{code}</pre>
    </div>
  );
}

// ── Docs tab ──────────────────────────────────────────────────────────────────

function DocsView({ api, ep }: { api: Api; ep: Endpoint }) {
  const r = httpFor(api, ep);
  return (
    <div className="fp-apix-docs">
      {ep.fields && ep.fields.length > 0 && (
        <section>
          <h3 className="fp-apix-h">Parameters</h3>
          <div className="fp-card" style={{ padding: 0 }}>
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr>
              </thead>
              <tbody>
                {ep.fields.map((f) => (
                  <tr key={f.name}>
                    <td className="mono">{f.name}</td>
                    <td className="mono" style={{ color: 'var(--fg-muted)' }}>{f.in}</td>
                    <td className="mono" style={{ color: 'var(--fg-muted)' }}>{f.type}</td>
                    <td style={{ color: f.req ? 'var(--warning)' : 'var(--fg-faint)' }}>{f.req ? 'required' : 'optional'}</td>
                    <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {r.body && (
        <section>
          <h3 className="fp-apix-h">Request body</h3>
          <CodeBlock head={<span className="mono">application/json</span>} code={r.body} />
        </section>
      )}
      <section>
        <h3 className="fp-apix-h">Response · <span style={{ color: 'var(--success)' }}>200 OK</span></h3>
        <CodeBlock head={<span className="mono">application/json</span>} code={ep.example} />
      </section>
    </div>
  );
}

// ── Integrate tab · brand-coloured language tabs + Shiki highlight ────────────

// Shiki grammar per Forge language id.
const SHIKI_LANG: Record<Lang, string> = {
  curl: 'bash', js: 'javascript', python: 'python', go: 'go', java: 'java', csharp: 'csharp',
};

// Brand lettermark for each language tab (fixed brand hex, not Eidos tokens —
// these are identities). Ink chosen for contrast on the brand fill.
const LANG_BRAND: Record<Lang, { short: string; bg: string; fg: string }> = {
  curl:   { short: '>_', bg: '#22272E', fg: '#7EE787' },
  js:     { short: 'JS', bg: '#F7DF1E', fg: '#000000' },
  python: { short: 'Py', bg: '#3776AB', fg: '#FFD43B' },
  go:     { short: 'Go', bg: '#00ADD8', fg: '#FFFFFF' },
  java:   { short: 'J',  bg: '#E76F00', fg: '#FFFFFF' },
  csharp: { short: 'C#', bg: '#512BD4', fg: '#FFFFFF' },
};

function LangMark({ id }: { id: Lang }) {
  const b = LANG_BRAND[id];
  return <span className="fp-lang-ic" style={{ background: b.bg, color: b.fg }} aria-hidden="true">{b.short}</span>;
}

/** Shiki-highlighted code (dual light/dark theme via CSS vars). Falls back to
 *  plain mono until the highlighter loads — shiki is dynamic-imported so it
 *  only enters the bundle when the Integrate tab is opened. */
function CodeHL({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = React.useState<string | null>(null);
  React.useEffect(() => {
    let on = true;
    import('shiki')
      .then(async ({ codeToHtml }) => {
        const out = await codeToHtml(code, {
          lang,
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        });
        if (on) setHtml(out);
      })
      .catch(() => { if (on) setHtml(null); });
    return () => { on = false; };
  }, [code, lang]);
  if (html) return <div className="fp-hl" dangerouslySetInnerHTML={{ __html: html }} />;
  return <pre className="fp-code-body mono">{code}</pre>;
}

function IntegrateView({ api, ep }: { api: Api; ep: Endpoint }) {
  const [lang, setLang] = React.useState<Lang>('curl');
  const code = snippetFor(api, ep, lang) ?? '';
  const label = LANGS.find((l) => l.id === lang)?.label ?? lang;
  return (
    <div className="fp-apix-integrate">
      <div className="fp-lang-tabs" role="tablist" aria-label="Language">
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={lang === l.id}
            className={`fp-lang-tab${lang === l.id ? ' is-active' : ''}`}
            onClick={() => setLang(l.id)}
          >
            <LangMark id={l.id} />
            {l.label}
          </button>
        ))}
      </div>
      <div className="fp-code">
        <div className="fp-code-head">
          <span className="fp-code-head-t"><LangMark id={lang} /> {label}</span>
          <CopyAction text={code} />
        </div>
        <CodeHL code={code} lang={SHIKI_LANG[lang]} />
      </div>
      <p className="fp-apix-authnote">
        <Icons.lock size={11} /> {AUTH_NOTE[ep.auth]}
      </p>
    </div>
  );
}

// ── Try it (inline sandbox console) ───────────────────────────────────────────

function ConsoleView({ api, ep }: { api: Api; ep: Endpoint }) {
  const r = httpFor(api, ep);
  const hasBody = !!r.body;
  const [token, setToken] = React.useState('sandbox_tok_8c2f…e91');
  const [body, setBody] = React.useState(r.body ?? '');
  const [phase, setPhase] = React.useState<'idle' | 'sending' | 'done'>('idle');
  const [sent, setSent] = React.useState('');

  const valid = React.useMemo(() => {
    if (!hasBody) return true;
    try { JSON.parse(body); return true; } catch { return false; }
  }, [body, hasBody]);

  const send = () => {
    if (!valid) return;
    setSent(body);
    setPhase('sending');
    window.setTimeout(() => setPhase('done'), 460);
  };

  return (
    <div className="fp-api-try">
      <div className="fp-apix-reqline mono">
        <Pill tone={METHOD_TONE[ep.method]}>{ep.method}</Pill>
        <span className="u">{r.url}</span>
      </div>

      {r.note && <p className="fp-apix-note">{r.note}</p>}

      <label className="fp-apix-field">
        <span className="k">Authorization</span>
        <input
          className="fp-apix-input mono"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          aria-label="Sandbox token"
          spellCheck={false}
        />
      </label>

      {hasBody && (
        <label className="fp-apix-field">
          <span className="k">Request body <span className="mono" style={{ color: 'var(--fg-faint)' }}>application/json</span></span>
          <textarea
            className="fp-apix-input fp-apix-textarea mono"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={Math.min(10, Math.max(4, body.split('\n').length))}
            aria-label="Request body"
            spellCheck={false}
          />
          {!valid && <span className="fp-apix-invalid"><Icons.alert size={11} /> Body is not valid JSON.</span>}
        </label>
      )}

      <div className="fp-apix-send-row">
        <Button variant="ember" onClick={send} disabled={!valid || phase === 'sending'}>
          <Icons.play size={12} /> {phase === 'sending' ? 'Sending…' : 'Send request'}
        </Button>
        <span className="fp-api-try-note">
          Sandbox call with your platform identity ({ep.auth}); production data is masked by the LGPD proxy.
        </span>
      </div>

      {phase === 'done' && (
        <div className="fp-apix-result">
          {sent && (
            <div className="fp-api-try-res">
              <div className="fp-api-try-res-head mono">
                <span>Request payload</span>
                <span>{r.method} · sandbox</span>
              </div>
              <pre className="fp-api-doc mono" style={{ borderStartStartRadius: 0, borderStartEndRadius: 0 }}>{sent}</pre>
            </div>
          )}
          <div className="fp-api-try-res">
            <div className="fp-api-try-res-head mono">
              <span className="ok">200 OK</span>
              <span>{ep.p95 > 0 ? `${ep.p95}ms` : 'async'} · sandbox</span>
            </div>
            <pre className="fp-api-doc mono" style={{ borderStartStartRadius: 0, borderStartEndRadius: 0 }}>{ep.example}</pre>
          </div>
        </div>
      )}

      {phase === 'idle' && (
        <div className="fp-empty">
          <Icons.terminal size={14} />
          <span>Edit the request and send it to see the payload and the response shape.</span>
        </div>
      )}
    </div>
  );
}

// ── Endpoint panel (detail) ───────────────────────────────────────────────────

function EndpointPanel({ api, ep }: { api: Api; ep: Endpoint }) {
  const [tab, setTab] = React.useState<'docs' | 'integrate' | 'tryit'>('docs');
  const r = httpFor(api, ep);
  return (
    <div className="fp-apix-panel">
      <div className="fp-apix-head">
        <Pill tone={METHOD_TONE[ep.method]}>{ep.method}</Pill>
        <span className="fp-apix-head-path mono">{ep.path}</span>
        <CopyAction text={r.url} label="Copy URL" />
      </div>

      <p className="fp-apix-summary">{ep.summary}</p>

      <div className="fp-apix-meta">
        <Link href={`/portal/catalog/${api.service}`} className="fp-meta-chip mono u-link-quiet"><Icons.server size={11} /> {api.service}</Link>
        <span className="fp-meta-chip"><Icons.lock size={11} /> {ep.auth}</span>
        <span className="fp-meta-chip mono">{ep.p95 > 0 ? `p95 ${ep.p95}ms` : 'async'}</span>
        {ep.deprecated && <Pill tone="warning">Deprecated</Pill>}
      </div>

      <div className="fp-tabs" role="tablist" aria-label="Endpoint detail" style={{ marginBlock: '14px 14px' }}>
        {([['docs', 'Docs'], ['integrate', 'Integrate'], ['tryit', 'Try it']] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            className={`fp-tab${tab === k ? ' is-active' : ''}`}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'docs' && <DocsView api={api} ep={ep} />}
      {tab === 'integrate' && <IntegrateView api={api} ep={ep} />}
      {tab === 'tryit' && <ConsoleView key={`${ep.method}-${ep.path}`} api={api} ep={ep} />}
    </div>
  );
}

// ── Explorer (master-detail + OpenAPI toggle) ─────────────────────────────────

export function ApiExplorer({ api }: { api: Api }) {
  const endpoints = endpointsFor(api);
  const [idx, setIdx] = React.useState(0);
  const [showSpec, setShowSpec] = React.useState(false);
  const [wbOpen, setWbOpen] = React.useState(false);

  // Reset when the API changes (the service tab switches APIs in place).
  React.useEffect(() => { setIdx(0); setShowSpec(false); setWbOpen(false); }, [api.id]);

  const ep = endpoints[idx] ?? endpoints[0];

  return (
    <div className="fp-apix">
      <div className="fp-apix-bar">
        <span className="fp-apix-bar-t mono">{api.kind} · {endpoints.length} endpoints · {api.version}</span>
        <span style={{ marginInlineStart: 'auto', display: 'inline-flex', gap: 8 }}>
          <Button variant={showSpec ? 'outline' : 'ghost'} size="sm" onClick={() => setShowSpec((s) => !s)}>
            <Icons.book size={12} /> {showSpec ? 'Hide OpenAPI' : 'OpenAPI spec'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWbOpen(true)}>
            <Icons.terminal size={12} /> Workbench
          </Button>
        </span>
      </div>

      {showSpec ? (
        <OpenApiBlock api={api} />
      ) : (
        <div className="fp-apix-grid">
          <EndpointList endpoints={endpoints} activeIdx={idx} onSelect={setIdx} />
          <EndpointPanel api={api} ep={ep} />
        </div>
      )}

      <ApiWorkbench api={api} initialIdx={idx} open={wbOpen} onClose={() => setWbOpen(false)} />
    </div>
  );
}
