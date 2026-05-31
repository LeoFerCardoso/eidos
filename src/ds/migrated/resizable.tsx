'use client';
// Forge DS — Components / Resizable
// Section order: Installation → Usage → Variants → In context → Accessibility → RTL → Anatomy → Do/Don't → API reference
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  PropsTable,
  AutoPropsTable,
  installTabs,
  Lede,
  Mono,
  Resizable,
  ResizablePanel,
  ResizableHandle,
} from '@/ds/core';

// ==========================================================================
// 1. INSTALLATION
// ==========================================================================
const INSTALL_TABS = installTabs('resizable');

// ==========================================================================
// 2. USAGE
// ==========================================================================
const USAGE_CODE = `import { Resizable, ResizablePanel, ResizableHandle } from "@/components/forge/resizable"

export function Demo() {
  return (
    <Resizable orientation="horizontal" defaultSizes={[30, 70]}>
      <ResizablePanel>Files</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Editor</ResizablePanel>
    </Resizable>
  )
}`;

// ==========================================================================
// PERSISTED SPLIT — a controlled demo that actually writes onSizesChange to
// localStorage, then survives a simulated reload (remount that re-reads it).
// This is the page's thesis made executable, not described.
// ==========================================================================
const STORAGE_KEY = 'forge.docs.resizable.split';
const FALLBACK: [number, number] = [40, 60];

function readStoredSizes(): [number, number] {
  if (typeof window === 'undefined') return FALLBACK;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return FALLBACK;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.length === 2 &&
      typeof parsed[0] === 'number' &&
      typeof parsed[1] === 'number'
    ) {
      return [parsed[0], parsed[1]];
    }
  } catch {
    /* corrupt value → fall back */
  }
  return FALLBACK;
}

const PERSISTED_CODE = `function PersistedSplit() {
  const [sizes, setSizes] = React.useState(() => {
    const raw = localStorage.getItem("forge.docs.resizable.split");
    return raw ? JSON.parse(raw) : [40, 60];
  });

  return (
    <Resizable
      orientation="horizontal"
      sizes={sizes}                       // controlled
      onSizesChange={(next) => {
        setSizes(next);
        localStorage.setItem(             // ← persist on every drag
          "forge.docs.resizable.split",
          JSON.stringify(next),
        );
      }}
    >
      {[<ResizablePanel key="nav">Nav</ResizablePanel>,
        <ResizablePanel key="body">Body</ResizablePanel>]}
    </Resizable>
  );
}`;

function PersistedSplit() {
  // `reloadKey` remounts the inner group; on remount it re-reads localStorage,
  // proving the dragged value outlives the component instance.
  const [reloadKey, setReloadKey] = React.useState(0);
  const [sizes, setSizes] = React.useState<[number, number]>(FALLBACK);
  const [justReloaded, setJustReloaded] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  // Hydrate from storage after mount (SSR-safe).
  React.useEffect(() => {
    setSizes(readStoredSizes());
  }, [reloadKey]);

  const commit = React.useCallback((next: [number, number]) => {
    setSizes(next);
    setTouched(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable → demo still works, just won't persist */
    }
  }, []);

  const simulateReload = React.useCallback(() => {
    setReloadKey((k) => k + 1);
    setJustReloaded(true);
    window.setTimeout(() => setJustReloaded(false), 2200);
  }, []);

  const reset = React.useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setSizes(FALLBACK);
    setTouched(false);
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <div>
      {/* Control bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <button type="button" className="btn outline sm" onClick={simulateReload}>
          <Icons.refresh size={13} /> Simulate reload
        </button>
        <button
          type="button"
          className="btn ghost sm"
          onClick={reset}
          disabled={!touched}
        >
          Reset
        </button>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--fg-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <span style={{ color: 'var(--fg-faint)' }}>localStorage[</span>
          forge.docs.resizable.split
          <span style={{ color: 'var(--fg-faint)' }}>] =</span>
          <span style={{ color: 'var(--fg)' }}>
            [{sizes[0].toFixed(0)}, {sizes[1].toFixed(0)}]
          </span>
        </span>
        {justReloaded && (
          <span
            role="status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.04em',
              color: 'var(--ember)',
            }}
          >
            <Icons.check size={12} /> remounted — value restored
          </span>
        )}
      </div>

      {/* The split, controlled + persisted, remounted by reloadKey */}
      <div
        key={reloadKey}
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          height: 220,
        }}
      >
        <Resizable
          orientation="horizontal"
          sizes={sizes}
          onSizesChange={commit}
          minSize={18}
          maxSize={82}
          style={{ height: '100%' }}
        >
          {[
            <div
              key="nav"
              style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-faint)',
                  marginBottom: 8,
                }}
              >
                Nav
              </div>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--fg-muted)',
                  lineHeight: 1.55,
                }}
              >
                Drag the handle, then press{' '}
                <b style={{ color: 'var(--fg)' }}>Simulate reload</b>. The split you
                set comes back — read from storage on remount.
              </div>
            </div>,
            <div
              key="body"
              style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-faint)',
                  marginBottom: 8,
                }}
              >
                Body
              </div>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--fg-muted)',
                  lineHeight: 1.55,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {touched
                  ? 'Layout saved. Reload the whole docs page — it survives that too.'
                  : 'Untouched — showing the default 40 / 60 split.'}
              </div>
            </div>,
          ]}
        </Resizable>
      </div>
    </div>
  );
}

// ==========================================================================
// PAGE
// ==========================================================================
export default function ResizablePage() {
  // ── Live state for horizontal demo ──────────────────────────────────────
  const [hSizes, setHSizes] = React.useState<[number, number]>([30, 70]);
  // ── Live state for vertical demo ────────────────────────────────────────
  const [vSizes, setVSizes] = React.useState<[number, number]>([60, 40]);

  return (
    <Section
      id="resizable"
      title="Resizable"
      desc="A handle between two panels that the user drags to set the split. Used for left rails, preview panes, and split editors. Persist the width per workspace so the user only sets it once."
    >
      {/* ==================================================================
          1. INSTALLATION
          ================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_TABS} ariaLabel="package manager" />
      <Lede>
        Zero external dependencies — built directly on pointer events and the Forge CSS layer.
        The compound API uses <Mono>{'<ResizablePanel>'}</Mono> and <Mono>{'<ResizableHandle />'}</Mono>
        as direct children of <Mono>{'<Resizable>'}</Mono>. Sizing, the handle, and
        <Mono>aria-controls</Mono> wiring are all managed by the root component.
      </Lede>

      {/* ==================================================================
          2. USAGE
          ================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="horizontal split · drag or use Arrow keys" code={USAGE_CODE}>
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            height: 200,
          }}
        >
          <Resizable
            orientation="horizontal"
            defaultSizes={[30, 70]}
            style={{ height: '100%' }}
          >
            {[
              <div
                key="a"
                style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-faint)',
                    marginBottom: 8,
                  }}
                >
                  Files
                </div>
                {['index.tsx', 'styles.css', 'config.json'].map((f) => (
                  <div
                    key={f}
                    style={{
                      padding: '4px 6px',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--fg-muted)',
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>,
              <div
                key="b"
                style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-faint)',
                    marginBottom: 8,
                  }}
                >
                  Editor
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
                  Drag the handle or focus it and press Arrow keys.
                </div>
              </div>,
            ]}
          </Resizable>
        </div>
      </Frame>

      {/* ==================================================================
          Examples divider
          ================================================================== */}
      <div
        style={{
          marginTop: 36,
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--fg-faint)',
          }}
        >
          Examples
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ==================================================================
          3a. VARIANT — horizontal split
          ================================================================== */}
      <SubHead meta="horizontal split">Horizontal — left rail</SubHead>
      <Frame
        label={
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            first panel: {Math.round(hSizes[0])}% · clamp 10–90
          </span>
        }
        code={`<Resizable orientation="horizontal" defaultSizes={[30, 70]}
  onSizesChange={setSizes}>
  {[
    <ResizablePanel key="a">Files</ResizablePanel>,
    <ResizablePanel key="b">Editor</ResizablePanel>,
  ]}
</Resizable>`}
      >
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            height: 280,
          }}
        >
          <Resizable
            orientation="horizontal"
            defaultSizes={[30, 70]}
            onSizesChange={setHSizes}
            style={{ height: '100%' }}
          >
            {[
              <div
                key="a"
                style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-faint)',
                    marginBottom: 8,
                  }}
                >
                  Files
                </div>
                {[
                  'index.tsx',
                  'config.json',
                  'README.md',
                  'styles.css',
                  'package.json',
                ].map((f) => (
                  <div
                    key={f}
                    style={{
                      padding: '4px 6px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--fg-muted)',
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>,
              <div
                key="b"
                style={{ padding: 20, background: 'var(--surface)', height: '100%' }}
              >
                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--fg-muted)',
                    lineHeight: 1.6,
                  }}
                >
                  Drag the handle to resize the file list. Wire{' '}
                  <Mono>onSizesChange</Mono> to <Mono>localStorage</Mono> so the
                  next reload remembers the split.
                </div>
              </div>,
            ]}
          </Resizable>
        </div>
      </Frame>

      {/* ==================================================================
          3b. VARIANT — vertical split
          ================================================================== */}
      <SubHead meta="vertical split">Vertical — preview pane</SubHead>
      <Frame
        label={
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>
            top panel: {Math.round(vSizes[0])}% · clamp 10–90
          </span>
        }
        code={`<Resizable orientation="vertical" defaultSizes={[66, 34]}>
  {[
    <ResizablePanel key="top">Editor</ResizablePanel>,
    <ResizablePanel key="bottom">Preview</ResizablePanel>,
  ]}
</Resizable>`}
      >
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            height: 360,
          }}
        >
          <Resizable
            orientation="vertical"
            defaultSizes={[60, 40]}
            onSizesChange={setVSizes}
            style={{ height: '100%' }}
          >
            {[
              <div
                key="top"
                style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-faint)',
                    marginBottom: 8,
                  }}
                >
                  Editor
                </div>
                <pre
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.5,
                    color: 'var(--fg-muted)',
                  }}
                >{`function deploy() {
  return forge.push('us-east-1');
}`}</pre>
              </div>,
              <div
                key="bottom"
                style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-faint)',
                    marginBottom: 8,
                  }}
                >
                  Preview
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>
                  Drag the handle up or down. Min height keeps the toolbar
                  always visible.
                </div>
              </div>,
            ]}
          </Resizable>
        </div>
      </Frame>

      {/* ==================================================================
          3c. VARIANT — persisted split (the thesis, demonstrated)
          ================================================================== */}
      <SubHead meta="persisted · localStorage">Persisted — survives reload</SubHead>
      <Lede up>
        The reason Resizable exists is that the user sets the split{' '}
        <b style={{ color: 'var(--fg)' }}>once</b>. This demo is controlled:{' '}
        <Mono>onSizesChange</Mono> writes the pair to <Mono>localStorage</Mono> on
        every drag. Press <b style={{ color: 'var(--fg)' }}>Simulate reload</b> to
        remount the group — it re-reads storage and comes back exactly where you
        left it.
      </Lede>
      <Frame label="controlled · drag, then simulate a reload" code={PERSISTED_CODE}>
        <PersistedSplit />
      </Frame>

      {/* ==================================================================
          4. IN CONTEXT — three-column IDE layout
          ================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        Two nested <Mono>Resizable</Mono> groups compose a classic three-column
        IDE layout: a collapsible sidebar on the left, then an editor/terminal
        vertical split filling the rest. Each group carries its own handle
        and keyboard model.
      </Lede>
      <Frame
        label="sidebar + editor/terminal — both splits are live"
        code={`{/* Outer horizontal: sidebar vs main */}
<Resizable orientation="horizontal" defaultSizes={[22, 78]} collapsible>
  {[
    <ResizablePanel key="sidebar">Explorer</ResizablePanel>,
    {/* Inner vertical: editor vs terminal */}
    <Resizable key="main" orientation="vertical" defaultSizes={[68, 32]}>
      {[
        <ResizablePanel key="editor">Editor</ResizablePanel>,
        <ResizablePanel key="terminal">Terminal</ResizablePanel>,
      ]}
    </Resizable>,
  ]}
</Resizable>`}
      >
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            height: 320,
          }}
        >
          <Resizable
            orientation="horizontal"
            defaultSizes={[22, 78]}
            collapsible
            style={{ height: '100%' }}
          >
            {[
              <div
                key="sidebar"
                style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-faint)',
                    marginBottom: 8,
                  }}
                >
                  Explorer
                </div>
                {['src/', '├ app/', '│ └ page.tsx', 'public/', 'package.json'].map((f) => (
                  <div
                    key={f}
                    style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', padding: '2px 0' }}
                  >
                    {f}
                  </div>
                ))}
              </div>,
              <div key="main" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Resizable
                  orientation="vertical"
                  defaultSizes={[68, 32]}
                  style={{ height: '100%' }}
                >
                  {[
                    <div
                      key="editor"
                      style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--fg-faint)',
                          marginBottom: 8,
                        }}
                      >
                        Editor
                      </div>
                      <pre
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--fg-muted)',
                          lineHeight: 1.5,
                        }}
                      >{`export default function Page() {
  return <h1>Hello Forge</h1>
}`}</pre>
                    </div>,
                    <div
                      key="terminal"
                      style={{ padding: 16, background: 'var(--bg)', height: '100%' }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-xs)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--fg-faint)',
                          marginBottom: 8,
                        }}
                      >
                        Terminal
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--fg-muted)',
                        }}
                      >
                        $ pnpm dev
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--text-sm)',
                          color: 'var(--fg-muted)',
                        }}
                      >
                        {'> ready on http://localhost:3000'}
                      </div>
                    </div>,
                  ]}
                </Resizable>
              </div>,
            ]}
          </Resizable>
        </div>
      </Frame>

      {/* ==================================================================
          5. ACCESSIBILITY
          ================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBottom: 8, color: 'var(--fg)' }}>
            Keyboard
          </div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The handle is a real tab stop (<Mono>tabIndex={'{0}'}</Mono>). Arrow keys nudge
            the split — <Mono>ArrowLeft</Mono> / <Mono>ArrowRight</Mono> for horizontal,{' '}
            <Mono>ArrowUp</Mono> / <Mono>ArrowDown</Mono> for vertical — by <Mono>step</Mono>{' '}
            percentage points. <Mono>Shift+Arrow</Mono> jumps by <Mono>largeStep</Mono>.{' '}
            <Mono>Home</Mono> and <Mono>End</Mono> snap to the min and max.{' '}
            <Mono>Enter</Mono> toggles collapse when <Mono>collapsible</Mono> is set.
            All key handling is implemented in JS on the handle element — no pointer required.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBottom: 8, color: 'var(--fg)' }}>
            Screen reader
          </div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The handle carries <Mono>role="separator"</Mono> with{' '}
            <Mono>aria-orientation</Mono>, <Mono>aria-label</Mono> ("Resize panels"),{' '}
            <Mono>aria-valuenow</Mono> / <Mono>aria-valuemin</Mono> /{' '}
            <Mono>aria-valuemax</Mono> reporting the first panel's size in percent, and{' '}
            <Mono>aria-controls</Mono> pointing at the first panel. Screen readers
            announce the current split as a slider value.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBottom: 8, color: 'var(--fg)' }}>
            Focus &amp; contrast
          </div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The handle shows the Forge offset focus ring (<Mono>--ring</Mono>) on keyboard
            focus and widens its hit area to a comfortable target even though the visible
            seam is only 1px. The seam and the hover / active state clear AA contrast
            against both adjoining panel surfaces.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBottom: 8, color: 'var(--fg)' }}>
            Motion
          </div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Dragging tracks the pointer with no easing. The collapse / restore animation
            is a short token transition (<Mono>--ease</Mono>). Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono>, the{' '}
            <Mono>.rz-handle</Mono> transition is set to <Mono>none</Mono> so collapse
            and restore jump straight to the target width with no motion.
          </div>
        </div>
      </div>

      {/* ==================================================================
          6. RTL
          ================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — first panel on the right; drag direction follows the inline axis'
        code={`<div dir="rtl">
  <Resizable orientation="horizontal" defaultSizes={[30, 70]}>
    {[
      <ResizablePanel key="a">الملفات</ResizablePanel>,
      <ResizablePanel key="b">المحرر</ResizablePanel>,
    ]}
  </Resizable>
</div>`}
      >
        <div dir="rtl">
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              height: 220,
            }}
          >
            <Resizable
              orientation="horizontal"
              defaultSizes={[30, 70]}
              style={{ height: '100%' }}
            >
              {[
                <div
                  key="a"
                  style={{ padding: 16, background: 'var(--surface)', height: '100%' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-faint)',
                      marginBottom: 8,
                    }}
                  >
                    الملفات
                  </div>
                  {['index.tsx', 'styles.css'].map((f) => (
                    <div
                      key={f}
                      style={{ padding: '4px 6px', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}
                    >
                      {f}
                    </div>
                  ))}
                </div>,
                <div
                  key="b"
                  style={{ padding: 20, background: 'var(--surface)', height: '100%', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}
                >
                  المحرر
                </div>,
              ]}
            </Resizable>
          </div>
        </div>
      </Frame>
      <Lede>
        The group is a flex row. In <Mono>dir="rtl"</Mono> the first panel sits
        on the right and the second flexes to fill the left. The seam line uses
        <Mono>inset-inline-start</Mono> so it stays centred under both writing
        directions. Drag direction is direction-aware: the component reads the
        nearest <Mono>[dir]</Mono> ancestor at runtime (via{' '}
        <Mono>getComputedStyle</Mono>) and flips the delta sign for RTL, so
        dragging toward the inline-end grows the first panel regardless of
        direction. The grip glyph is not directional — it stays as-is.
      </Lede>

      {/* ==================================================================
          7. ANATOMY
          ================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head">
          <span className="label">anatomy</span>
        </div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="stage"
              style={{ position: 'relative', width: 420 }}
              aria-hidden="true"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  height: 180,
                }}
              >
                {/* First panel */}
                <div
                  style={{
                    width: 160,
                    padding: 16,
                    background: 'var(--surface)',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--fg-faint)',
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    Files
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                    index.tsx
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                    styles.css
                  </div>
                </div>
                {/* Handle */}
                <div
                  style={{
                    width: 10,
                    cursor: 'col-resize',
                    background: 'var(--surface)',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      insetInlineStart: '50%',
                      top: 0,
                      bottom: 0,
                      width: 1,
                      transform: 'translateX(-50%)',
                      background: 'var(--border-strong)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      insetInlineStart: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 14,
                      height: 28,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--surface-overlay)',
                      border: '1px solid var(--border-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--fg-muted)',
                    }}
                  >
                    <Icons.gripVertical size={12} />
                  </div>
                </div>
                {/* Second panel */}
                <div
                  style={{
                    flex: 1,
                    padding: 16,
                    background: 'var(--surface)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--fg-muted)',
                  }}
                >
                  Editor
                </div>
              </div>
              {/* Leads */}
              <span className="lead v" style={{ top: -22, left: 80, height: 18 }} />
              <span className="lead v" style={{ top: -22, right: 120, height: 18 }} />
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: '50%', right: -36, width: 30 }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              {/* Pins */}
              <div className="pin" style={{ top: -42, left: 80, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, right: 120, transform: 'translateX(50%)' }}>2</div>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: 'calc(50% - 12px)', right: -58 }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>First panel.</b> Primary region. Its percentage width is
              the controlled value; wire <Mono>onSizesChange</Mono> to{' '}
              <Mono>localStorage</Mono> to persist it.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Second panel.</b> Secondary region. Flexes to fill
              the remaining space.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Hit zone.</b> 10px transparent column
              (<Mono>.rz-handle-h</Mono>). The wider silent padding lets the user grab the handle
              on the first try; the visible 1px <Mono>--border-strong</Mono> seam sits at its centre.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Grip pill.</b> Pill-shaped affordance on{' '}
              <Mono>--surface-overlay</Mono> with <Mono>--elev-1</Mono>. The same glyph
              rotates 90° for horizontal dividers — one primitive, both axes.
            </span>
            <span className="num">5</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Min / max constraint.</b> Percentage clamps.
              Below <Mono>minSize</Mono> with <Mono>collapsible</Mono>, the panel snaps to
              <Mono>collapsedSize</Mono> (default 0) so the handle stays findable.
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================
          8. DO / DON'T
          ================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — make the hit area larger than the visible line
          </div>
          <div className="body" style={{ padding: 16 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--surface)',
              }}
            >
              <span
                style={{
                  position: 'relative',
                  width: 10,
                  height: 36,
                  cursor: 'col-resize',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    insetInlineStart: '50%',
                    top: 0,
                    bottom: 0,
                    width: 1,
                    transform: 'translateX(-50%)',
                    background: 'var(--border-strong)',
                  }}
                />
              </span>
              <span className="t-small" style={{ color: 'var(--fg-muted)' }}>
                visible 1px line · hit zone 10px
              </span>
            </div>
          </div>
          <div className="note">
            A 1px line is impossible to grab. Pad the hit area silently so the user finds
            the handle on the first try.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — let a panel collapse to zero without a recovery path
          </div>
          <div className="body" style={{ padding: 16 }}>
            <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              When the panel reaches 0px, the handle becomes a 1px sliver. The user cannot
              find it again to restore the split.
            </div>
          </div>
          <div className="note">
            Either clamp at a minimum (e.g. 10%), or use <Mono>collapsible</Mono> so Enter
            on the handle can restore the panel. Never let the handle disappear.
          </div>
        </div>
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — persist the split per workspace
          </div>
          <div className="body" style={{ padding: 16 }}>
            <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              Wire <Mono>onSizesChange</Mono> to <Mono>localStorage</Mono>. The next
              reload loads the same layout the user configured — no re-work needed.
            </div>
          </div>
          <div className="note">
            Storage key should be scoped to the workspace or page so two
            different views can carry independent splits.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — nest too many splits without a collapse affordance
          </div>
          <div className="body" style={{ padding: 16 }}>
            <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              Three or more nested splits multiply the chrome. On narrow viewports the
              minimum sizes conflict and the layout breaks.
            </div>
          </div>
          <div className="note">
            Use at most two levels of nesting; add a <Mono>collapsible</Mono> panel on the
            outer split so users can reclaim space quickly.
          </div>
        </div>
      </div>

      {/* ==================================================================
          9. API REFERENCE
          ================================================================== */}
      <SubHead meta="ResizableProps">API reference</SubHead>
      <AutoPropsTable component="Resizable" label="<Resizable />" />
      <PropsTable
        label="<ResizableHandle />"
        rows={[
          {
            prop: 'withHandle',
            type: 'boolean',
            default: 'true',
            description: 'Render the visible grip pill in the divider centre.',
          },
          {
            prop: 'className',
            type: 'string',
            default: undefined,
            description: 'Extra classes on the handle element.',
          },
        ]}
      />
      <PropsTable
        label="<ResizablePanel />"
        rows={[
          {
            prop: 'className',
            type: 'string',
            default: undefined,
            description: 'Extra utility classes on the panel div.',
          },
          {
            prop: 'style',
            type: 'CSSProperties',
            default: undefined,
            description: 'Extra inline styles. Merged on top of the injected sizing style.',
          },
          {
            prop: 'children',
            type: 'ReactNode',
            default: undefined,
            description: 'Panel content.',
          },
        ]}
      />
    </Section>
  );
}
