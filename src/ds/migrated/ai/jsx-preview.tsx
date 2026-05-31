'use client';
// Forge AI — JSX Preview (doc page 22).
// Documents the JSX Preview pattern: a live source → rendered output split.
// The DS ships no JSX evaluator — this page demonstrates a SAFE in-page
// new-Function eval on hardcoded source strings (not user input) for the
// documentation demos ONLY. Production consumers must use react-live or a
// sandboxed iframe.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, PropsTable, installTabs, Lede, ArtifactWidget, ArtifactPanel, Message, Mono } from '@/ds/core';

// ── inline style consts ──────────────────────────────────────────────────────

// ── safe eval helper (DOCUMENTATION ONLY — not for production use) ───────────
// Evaluates a JSX-like expression using new Function with an explicit scope.
// ONLY use this on hardcoded, trusted strings. Never eval user input.
type EvalScope = Record<string, unknown>;

function evalJsx(src: string, scope: EvalScope = {}): React.ReactNode {
  try {
    // We convert basic JSX prop syntax to createElement calls via a minimal
    // regex-free approach: rely on the fact that our demo strings use only
    // React.createElement-style expressions so new Function can evaluate them.
    // The scope is injected as named variables.
    const keys = Object.keys(scope);
    const vals = keys.map(k => scope[k]);
    // eslint-disable-next-line no-new-func
    const fn = new Function('React', ...keys, `return (${src});`);
    return fn(React, ...vals) as React.ReactNode;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return (
      <div style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', padding: 12, lineHeight: 1.6 }}>
        <Icons.alert size={13} style={{ verticalAlign: -1, marginInlineEnd: 6 }}/>
        {message}
      </div>
    );
  }
}

// ── Demo 1: basic usage ──────────────────────────────────────────────────────
const DEFAULT_SRC = `React.createElement('div', {
  style: {
    background: 'var(--surface-active)',
    borderRadius: 8,
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  }
}, React.createElement('span', {
  style: { fontSize: 'var(--text-sm)', color: 'var(--fg)', lineHeight: 1.5 }
}, '✦ identity-svc is ', React.createElement('strong', null, 'healthy'),
' — p95 48 ms · error budget 94%'))`;

function BasicUsageDemo() {
  const [src, setSrc] = React.useState(DEFAULT_SRC);
  const rendered = evalJsx(src, {});

  return (
    <div style={{ display: 'flex', gap: 16, width: '100%', minHeight: 260 }}>
      {/* source pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label
          htmlFor="jsx-src-basic"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}
        >
          Source
        </label>
        <textarea
          id="jsx-src-basic"
          value={src}
          onChange={e => setSrc(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1, resize: 'vertical', minHeight: 180,
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            background: 'var(--surface)', color: 'var(--fg)',
            border: '1px solid var(--border)', borderRadius: 6,
            padding: '10px 12px', lineHeight: 1.6,
          }}
        />
      </div>
      {/* preview pane */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}
        aria-live="polite"
        aria-label="JSX preview output"
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>
          Preview
        </span>
        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 6, padding: 14, background: 'var(--bg)', minHeight: 180, display: 'flex', alignItems: 'flex-start' }}>
          {rendered}
        </div>
      </div>
    </div>
  );
}

// ── Demo 2: DS primitives scope ──────────────────────────────────────────────
// The model produced a snippet that uses a Forge pill + status dot. We pass
// the primitives into the eval scope so the evaluated code can reference them.

// Simple inline pill and dot components for the scope demo
const ScopePill = ({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) => (
  <span className={`pill ${tone}`}>{children}</span>
);
const ScopeDot = ({ state = 'online' }: { state?: string }) => (
  <span className={`status-dot ${state}`} aria-label={state}/>
);

const SCOPE_SRC = `React.createElement('div', {
  style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface)', borderRadius: 8 }
},
  React.createElement(StatusDot, { state: 'online' }),
  React.createElement('span', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, 'identity-svc'),
  React.createElement(Pill, { tone: 'success' }, 'T1 · healthy')
)`;

function ScopeDemo() {
  const scope: EvalScope = { Pill: ScopePill, StatusDot: ScopeDot };
  const rendered = evalJsx(SCOPE_SRC, scope);

  return (
    <div style={{ display: 'flex', gap: 16, width: '100%', minHeight: 200 }}>
      <div style={{ flex: 1 }}>
        <label
          htmlFor="jsx-src-scope"
          style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}
        >
          Source (uses Pill + StatusDot from scope)
        </label>
        <textarea
          id="jsx-src-scope"
          readOnly
          defaultValue={SCOPE_SRC}
          style={{
            width: '100%', minHeight: 140, resize: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
            background: 'var(--surface)', color: 'var(--fg)',
            border: '1px solid var(--border)', borderRadius: 6,
            padding: '10px 12px', lineHeight: 1.6,
          }}
        />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }} aria-live="polite" aria-label="Scope demo preview">
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Preview</span>
        <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 6, padding: 14, background: 'var(--bg)', minHeight: 140 }}>
          {rendered}
        </div>
      </div>
    </div>
  );
}

// ── Demo 3: model artifact wiring ────────────────────────────────────────────
const ARTIFACT_SRC = `React.createElement('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }
},
  React.createElement('h3', {
    style: { margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600 }
  }, 'Service health card'),
  React.createElement('div', {
    style: { display: 'flex', gap: 8, flexWrap: 'wrap' }
  },
    React.createElement('span', { className: 'pill success' }, 'healthy'),
    React.createElement('span', { className: 'pill neutral' }, 'p95: 48 ms'),
    React.createElement('span', { className: 'pill neutral' }, 'budget: 94%')
  )
)`;

const jsxArtifact = {
  id: 'jsx-art-1',
  kind: 'code' as const,
  title: 'ServiceHealthCard.jsx',
  meta: '14 lines · jsx',
  lang: 'jsx',
  content: ARTIFACT_SRC,
};

function ArtifactContextDemo() {
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [tab, setTab] = React.useState<'preview' | 'code'>('preview');

  const previewContent = (
    <div style={{ padding: 16 }} aria-live="polite" aria-label="JSX preview output">
      {evalJsx(ARTIFACT_SRC, {})}
    </div>
  );

  const codeContent = (
    <pre style={{ margin: 0, padding: 16, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      <code>{ARTIFACT_SRC}</code>
    </pre>
  );

  const tabs = [
    { id: 'preview', label: 'Preview', content: previewContent },
    { id: 'code',    label: 'Code',    content: codeContent },
  ];

  return (
    <div style={{ display: 'flex', gap: 0, width: '100%', minHeight: 320 }}>
      {/* thread column */}
      <div style={{ flex: '0 0 300px', borderInlineEnd: '1px solid var(--border)' }}>
        <Message from="user">Generate a service health card component.</Message>
        <Message from="assistant">
          <p style={{ margin: '0 0 10px', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>Here is a compact health card. Click to preview:</p>
          <ArtifactWidget artifact={jsxArtifact} onOpen={() => setPanelOpen(true)}/>
        </Message>
      </div>
      {/* panel column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {panelOpen
          ? (
            <ArtifactPanel
              artifact={jsxArtifact}
              open={panelOpen}
              onClose={() => setPanelOpen(false)}
              tabs={tabs.map(t => ({ ...t, id: t.id }))}
            />
          )
          : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-faint)', fontSize: 'var(--text-base)', gap: 8 }}>
              <Icons.externalLink size={14}/>
              <span>Click the widget to open</span>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default function AiJsxPreviewPage() {
  return (
    <Section
      id="jsx-preview"
      num="22"
      title="JSX Preview"
      desc="A live source-to-render split: the user or model edits JSX in a textarea on the left; the right pane re-renders the output immediately. Reach for it when generative UI output should be editable in the thread."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-jsx-preview')} ariaLabel="package manager"/>
      <Lede>The DS ships no JSX evaluator — this page demonstrates the pattern with a safe in-page eval on known strings only. Production consumers must use react-live or a sandboxed iframe.</Lede>
      <Lede>
        This is a <strong>pattern</strong>, not a shipped component. There is no <Mono>{'<JsxPreview/>'}</Mono> in the package. The page shows the correct wiring so you can author the wrapper yourself using <Mono>react-live</Mono> or a sandboxed <Mono>{'<iframe>'}</Mono> for production, and demonstrates the pattern with a minimal in-page eval for documentation purposes only.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="Left: source textarea · Right: live preview (aria-live polite)"
        height={340}
        code={`// DOCUMENTATION DEMO ONLY — do not ship new Function to production.
// See "Wiring it up" section for the production-safe approach.

function JsxPreviewDemo({ defaultSrc }: { defaultSrc: string }) {
  const [src, setSrc] = useState(defaultSrc);
  const rendered = evalJsx(src, {});   // safe eval on controlled strings

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* source pane */}
      <div style={{ flex: 1 }}>
        <label htmlFor="jsx-src">Source</label>
        <textarea
          id="jsx-src"
          value={src}
          onChange={e => setSrc(e.target.value)}
        />
      </div>
      {/* preview pane */}
      <div flex={1} aria-live="polite" aria-label="JSX preview output">
        <span>Preview</span>
        <div>{rendered}</div>
      </div>
    </div>
  );
}`}
      >
        <BasicUsageDemo/>
      </Frame>
      <Lede>
        Edit the source textarea — the preview pane re-renders on every keystroke. The preview region carries <Mono>aria-live="polite"</Mono> so a screen reader announces re-render results without interrupting the user's typing.
      </Lede>

      {/* 3a. DS PRIMITIVES IN SCOPE */}
      <SubHead meta="eval scope">Reusing DS primitives</SubHead>
      <Frame
        label="Pass Forge components into the eval scope so snippets can reference them"
        height={260}
        code={`// Pass your DS primitives into the scope object:
const scope = {
  Pill:      ({ children, tone }) => <span className={\`pill \${tone}\`}>{children}</span>,
  StatusDot: ({ state }) => <span className={\`status-dot \${state}\`}/>,
  // … any component the snippet might reference
};

// In evalJsx:
function evalJsx(src: string, scope: Record<string, unknown>) {
  const keys = Object.keys(scope);
  const vals = keys.map(k => scope[k]);
  // eslint-disable-next-line no-new-func
  const fn = new Function('React', ...keys, \`return (\${src});\`);
  return fn(React, ...vals);
}

<JsxPreviewDemo defaultSrc={src} scope={scope}/>`}
      >
        <ScopeDemo/>
      </Frame>
      <Lede>
        Any component reference inside the source string must be present in the <Mono>scope</Mono> object. Pass primitives as plain wrapper functions so the eval environment gets a stable reference without bundler overhead. Keep the scope minimal — every added component is a potential surface for scope pollution.
      </Lede>

      {/* 3b. MODEL ARTIFACT WIRING */}
      <SubHead meta="model artifact">In context — model artifact</SubHead>
      <Frame
        label="An ArtifactWidget in a Message bubble opens an ArtifactPanel with Preview + Code tabs"
        height={360}
        code={`// Wire a JSX artifact through ArtifactPanel tabs:
const tabs = [
  { id: 'preview', label: 'Preview', content: <JsxPreviewPane src={artifact.content}/> },
  { id: 'code',    label: 'Code',    content: <pre><code>{artifact.content}</code></pre> },
];

<ArtifactWidget artifact={jsxArtifact} onOpen={() => setPanelOpen(true)}/>
<ArtifactPanel artifact={jsxArtifact} open={panelOpen} tabs={tabs} onClose={…}/>`}
      >
        <ArtifactContextDemo/>
      </Frame>
      <Lede>
        The canonical wiring: the model produces a JSX artifact, which lands as an <Mono>ArtifactWidget</Mono> chip in the bubble. Clicking it opens the <Mono>ArtifactPanel</Mono> with two tabs — Preview (live render) and Code (source). See the <a href="/ai/artifact" style={{ color: 'var(--ember)' }}>Artifact</a> page for full panel docs.
      </Lede>

      {/* 4. WIRING IT UP */}
      <SubHead meta="production pattern">Wiring it up</SubHead>
      <Lede>
        The in-page <Mono>new Function</Mono> eval is safe only for hardcoded, trusted strings in a documentation context. For production — where JSX may come from a model or a user — you must isolate execution. Two recommended approaches:
      </Lede>
      <CodeBlock
        label="Option A — react-live (recommended for internal tools)"
        lang="tsx"
        code={`// npm install react-live
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

export function JsxPreview({ code, scope }: { code: string; scope: object }) {
  return (
    <LiveProvider code={code} scope={scope} noInline={false}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <LiveEditor aria-label="JSX source"/>
          <LiveError/>
        </div>
        <div style={{ flex: 1 }} aria-live="polite" aria-label="JSX preview output">
          <LivePreview/>
        </div>
      </div>
    </LiveProvider>
  );
}`}
      />
      <CodeBlock
        label="Option B — sandboxed iframe (recommended for user-generated content)"
        lang="tsx"
        code={`// Compile JSX server-side (esbuild / sucrase), inject into a sandboxed iframe.
// The iframe has no access to the parent's cookies, localStorage, or DOM.
export function JsxPreviewIframe({ compiledHtml }: { compiledHtml: string }) {
  return (
    <iframe
      title="JSX preview"
      sandbox="allow-scripts"      // no allow-same-origin!
      srcDoc={compiledHtml}
      aria-label="JSX preview output"
      style={{ width: '100%', border: 'none', minHeight: 200 }}
    />
  );
}

// On the server (route handler):
import { transform } from '@swc/core';
const { code } = await transform(jsxSource, { jsc: { parser: { syntax: 'ecmascript', jsx: true } } });
// Wrap in a minimal HTML shell and return compiledHtml.`}
      />

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The source textarea is a real <code style={{ fontFamily: 'var(--font-mono)' }}>{'<textarea>'}</code> with an explicit <code style={{ fontFamily: 'var(--font-mono)' }}>{'<label>'}</code> — it is a natural Tab stop and accepts keyboard input. The preview pane is non-interactive. If you add a "Re-render" button for lazy evaluation, make it a <code style={{ fontFamily: 'var(--font-mono)' }}>{'<button>'}</code> reachable via Tab and activatable with Enter/Space.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Live region</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The preview pane carries <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label="JSX preview output"</code>. Screen readers announce re-renders after the user pauses typing. Keep the debounce short (200–400 ms) — a screen reader user needs feedback that the re-render happened.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Error display</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Eval errors render in the preview pane with an alert icon and the error message as real text — not color alone. If you use <code style={{ fontFamily: 'var(--font-mono)' }}>react-live</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>{'<LiveError/>'}</code> already does this. Announce errors with <code style={{ fontFamily: 'var(--font-mono)' }}>role="alert"</code> so screen readers interrupt and surface the failure.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Iframe (Option B)</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Give the iframe a <code style={{ fontFamily: 'var(--font-mono)' }}>title</code> attribute ("JSX preview") so screen readers can identify the embedded frame as a named landmark. Without a title, VoiceOver announces it as an anonymous frame and users lose context.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — textarea and preview pane mirror; source content stays LTR" height={280}>
        <div dir="rtl" style={{ display: 'flex', gap: 16, width: '100%', minHeight: 220 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label
              htmlFor="jsx-src-rtl"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}
            >
              المصدر
            </label>
            <textarea
              id="jsx-src-rtl"
              readOnly
              dir="ltr"
              defaultValue={`React.createElement('div', {
  style: { display:'flex', gap:8, padding:12,
           background:'var(--surface)', borderRadius:8 }
},
  React.createElement('span', {
    style: { fontSize:'var(--text-sm)', fontWeight:600 }
  }, 'خدمة الهوية — صحية')
)`}
              style={{
                flex: 1, minHeight: 140, resize: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
                background: 'var(--surface)', color: 'var(--fg)',
                border: '1px solid var(--border)', borderRadius: 6,
                padding: '10px 12px', lineHeight: 1.6,
              }}
            />
          </div>
          <div
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}
            aria-live="polite"
            aria-label="معاينة JSX"
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>
              المعاينة
            </span>
            <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 6, padding: 14, background: 'var(--bg)', minHeight: 140 }}>
              {evalJsx(`React.createElement('div', {
  style: { display:'flex', gap:8, padding:12,
           background:'var(--surface)', borderRadius:8 }
},
  React.createElement('span', {
    style: { fontSize:'var(--text-sm)', fontWeight:600 }
  }, 'خدمة الهوية — صحية')
)`, {})}
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        Under <Mono>dir="rtl"</Mono> the two-pane layout mirrors — the source textarea is on the right and the preview pane is on the left. The textarea itself carries <Mono>dir="ltr"</Mono> because JSX source is always LTR code. The label text and pane headings use Arabic. This pattern is the same as the Terminal intentional LTR exception.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 560, width: '100%' }} aria-hidden="true">
              <div style={{ display: 'flex', gap: 16 }}>
                {/* source pane */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>Source</label>
                  <textarea
                    readOnly
                    defaultValue={'React.createElement(\'div\', null, \'Hello\')'}
                    style={{ minHeight: 80, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', resize: 'none', lineHeight: 1.6 }}
                  />
                </div>
                {/* preview pane */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>Preview</span>
                  <div style={{ minHeight: 80, border: '1px solid var(--border)', borderRadius: 6, padding: '8px 10px', background: 'var(--bg)', display: 'flex', alignItems: 'center' }}>
                    <div>Hello</div>
                  </div>
                </div>
              </div>
              {/* pin 1 — source pane label */}
              <span className="lead v" style={{ top: -22, left: 14, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 14, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — source textarea */}
              <span className="lead h" style={{ top: 56, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 48, left: -52 }}>2</div>
              {/* pin 3 — preview pane */}
              <span className="lead h" style={{ top: 56, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 48, right: -52 }}>3</div>
              {/* pin 4 — error display (conceptual) */}
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Source label.</b> An accessible <Mono>{'<label>'}</Mono> paired with the textarea via <Mono>htmlFor</Mono>. "Source" or "JSX source" in your product's language — but the textarea content is always LTR code.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Source textarea.</b> A real <Mono>{'<textarea>'}</Mono>. Monospace font, <Mono>dir="ltr"</Mono>, <Mono>spellCheck={'{false}'}</Mono>. Carries <Mono>resize: vertical</Mono> so the user can expand it without horizontal scroll.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Preview pane.</b> The rendered output of the evaluated source. <Mono>aria-live="polite"</Mono> announces re-renders to screen readers. Visually separated from the source by a border and the light background token.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Error display.</b> When eval throws, the error message replaces (or overlays) the preview output in danger tone. Use <Mono>role="alert"</Mono> for interrupting announcements; plain text is the record — not color alone.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — sandbox in production</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <span className="pill success">react-live</span>
            <span className="pill success">sandboxed iframe</span>
          </div>
          <div className="note">Any JSX that a model or user might produce is untrusted. Use react-live (runs in a controlled Babel scope) or a sandboxed iframe (hardware-isolated) — never eval untrusted strings on the host page.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — eval user input with new Function on a shared host</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--danger)' }}>new Function('React', src)(React)</code>
          </div>
          <div className="note">This gives arbitrary code access to your app's globals, cookies, and localStorage. It is safe only for hardcoded strings in a documentation page where you control the content.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — wire as an ArtifactPanel tab</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 6, fontSize: 'var(--text-sm)' }}>
              <span className="pill ember">Preview</span>
              <span className="pill neutral">Code</span>
            </div>
          </div>
          <div className="note">The Preview + Code tab pair inside an ArtifactPanel is the canonical surface for model-generated components. The Artifact page provides the full panel API.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — ship the in-page eval to production</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              The <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>evalJsx</code> helper on this page is a documentation convenience. It is fine for a DS docs page where all strings are authored by the DS team. It is not a component to copy into a product.
            </div>
          </div>
          <div className="note">Copy the production pattern (react-live or iframe) from the "Wiring it up" section, not the demo eval.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="JsxPreviewProps">API reference</SubHead>
      <Lede>
        This is a <strong>pattern page</strong> — no component is exported from the package. The table below documents the props of the <Mono>JsxPreviewDemo</Mono> inline helper used on this page; treat it as a starting point for your own implementation.
      </Lede>
      <PropsTable
        label="JsxPreviewDemo (inline helper — not exported)"
        rows={[
          { prop: 'defaultSrc', type: 'string',                         required: true,    description: 'The initial JSX source string. Must be a known-safe, hardcoded value.' },
          { prop: 'scope',      type: 'Record<string, unknown>',         default: '{}',     description: 'Components / values injected into the eval environment as named variables.' },
          { prop: 'onChange',   type: '(src: string) => void',           default: undefined, description: 'Called on every source change. Use to debounce expensive re-renders.' },
          { prop: 'aria-label', type: 'string',                         default: '"JSX preview output"', description: 'aria-label on the preview pane (the live region). Override for localisation.' },
        ]}
      />
      <PropsTable
        label="evalJsx (inline helper — not exported)"
        rows={[
          { prop: 'src',   type: 'string',                   required: true,  description: 'The source expression to evaluate. Must be a single JSX/React.createElement expression.' },
          { prop: 'scope', type: 'Record<string, unknown>',  default: '{}',   description: 'Named bindings injected before src is evaluated. React is always injected automatically.' },
          { prop: 'returns', type: 'React.ReactNode',        default: undefined, description: 'The evaluated node, or an error message rendered in danger tone if eval throws.' },
        ]}
      />
    </Section>
  );
}
