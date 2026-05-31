'use client';
// Eidos AI — Artifact (doc page 20).
// Documents ArtifactWidget + ArtifactPanel: the two-part surface for any
// self-contained thing the model produced — a document, HTML page, app, or
// code file. The widget is a compact chip in the chat; the panel is the
// full docked host.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, PropsTable, installTabs, Lede, ArtifactWidget, ArtifactPanel, Message, Prose, ProseCode, Mono, Empty, Skeleton, Spinner, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';

// ── MarkdownBody — render markdown text via react-markdown into <Prose/> ────
// Mirrors the pattern documented on the AI / Markdown page (dynamic import
// in useEffect so the renderer is kept out of the static graph). Used by
// the Artifact demos to render kind:"document" content faithfully inside
// the drawer body.
function MarkdownBody({ source }: { source: string }) {
  const [RM, setRM] = React.useState<any>(null);
  const [rGfm, setRGfm] = React.useState<any>(null);
  const [rSan, setRSan] = React.useState<any>(null);
  React.useEffect(() => {
    let active = true;
    Promise.all([
      import('react-markdown'),
      import('remark-gfm'),
      import('rehype-sanitize'),
    ]).then(([md, gfm, san]) => {
      if (!active) return;
      setRM(() => md.default);
      setRGfm(() => gfm.default);
      setRSan(() => san.default);
    });
    return () => { active = false; };
  }, []);
  if (!RM) {
    return <Prose><p style={{ color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)' }}>Loading renderer…</p></Prose>;
  }
  return (
    <Prose>
      <RM
        remarkPlugins={[rGfm]}
        rehypePlugins={[rSan]}
        components={{
          a: (p: any) => <a {...p} target="_blank" rel="noreferrer noopener" />,
          pre: ({ children }: any) => <>{children}</>,
          code: ({ className, children, ...p }: any) => {
            const m = /language-(\w+)/.exec(className || '');
            return m
              ? <ProseCode lang={m[1]}>{String(children).replace(/\n$/, '')}</ProseCode>
              : <code className={className} {...p}>{children}</code>;
          },
        }}
      >
        {source}
      </RM>
    </Prose>
  );
}

// ── Per-kind body — picks the right renderer for the artifact's kind ────────
function ArtifactBody({ artifact }: { artifact: any }) {
  if (artifact?.kind === 'document' && artifact.content) {
    return <MarkdownBody source={artifact.content}/>;
  }
  if (artifact?.kind === 'code' && artifact.content) {
    return <ProseCode lang={artifact.lang || 'tsx'}>{artifact.content}</ProseCode>;
  }
  if (artifact?.kind === 'html' && artifact.html) {
    return <Prose><div dangerouslySetInnerHTML={{ __html: artifact.html }}/></Prose>;
  }
  // Falls back to ArtifactPanel's default rendering when there's no override.
  return null;
}

// ── Streaming body — the artifact is still being written by the model ───────
// What a real artifact does before it settles: a Skeleton stands in for the
// unwritten lines so the panel height doesn't jump when the text lands. The
// container carries aria-busy so a screen reader knows content is in flight.
function StreamingBody() {
  return (
    <div aria-busy="true" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span className="ai-art-stream-note" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', color: 'var(--fg-faint)' }}>
        <Spinner size="sm" aria-label="Eidos AI is writing the artifact"/> writing…
      </span>
      <Skeleton variant="line" width="42%"/>
      <Skeleton lines={3} width="100%"/>
      <Skeleton lines={2} width="88%"/>
    </div>
  );
}

// ── inline style consts (no hand-rolled font sizes for prose) ────────────────

// ── demo artifacts ───────────────────────────────────────────────────────────
const DOC_ARTIFACT = {
  id: 'doc-1',
  kind: 'document' as const,
  title: 'Service Design Brief',
  meta: '3.2 KB · markdown',
  content: `# Service Design Brief — identity-svc

## Overview
The identity service issues, rotates, and validates JWT credentials for all internal Eidos services.

## Auth model
Stateless JWTs signed with RS256. Tokens expire in 15 minutes; a separate refresh flow extends sessions.

## Threat model
Replay attacks mitigated by jti claims. Stolen tokens expire quickly. Token revocation via a short-lived Redis deny-list.`,
};

const CODE_ARTIFACT = {
  id: 'code-1',
  kind: 'code' as const,
  title: 'identity-svc/main.go',
  meta: '126 lines · go',
  lang: 'go',
  content: `package main

import (
  "log"
  "net/http"
  "github.com/eidos/identity-svc/internal/auth"
)

func main() {
  mux := http.NewServeMux()
  mux.Handle("/v1/token",  auth.IssueHandler())
  mux.Handle("/v1/verify", auth.VerifyHandler())
  mux.Handle("/v1/revoke", auth.RevokeHandler())
  log.Fatal(http.ListenAndServe(":8080", mux))
}`,
};

const HTML_ARTIFACT = {
  id: 'html-1',
  kind: 'html' as const,
  title: 'Incident Summary',
  meta: '8.1 KB · html',
  html: '<p style="margin:0;font-family:sans-serif;font-size:14px;line-height:1.6;color:#c9cdd3">p95 latency spiked to 1.2 s at 14:02 UTC. Error budget 38% remaining. Two open incidents linked to the upstream billing-svc deployment at 13:55.</p>',
};

const APP_ARTIFACT = {
  id: 'app-1',
  kind: 'app' as const,
  title: 'Cost Explorer',
  meta: 'interactive',
};

// ── Usage demo ───────────────────────────────────────────────────────────────
// The chat sits as `flex: 1`; the inline Drawer-backed ArtifactPanel docks
// to the trailing edge. When closed, the Drawer collapses to inline-size:0
// and the chat reclaims the full width. When open, the Drawer animates to
// its `width` and the chat naturally shrinks to make room.
function UsageDemo() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<any>(DOC_ARTIFACT);
  // The earned move: a panel doesn't pop in fully-formed — it LANDS. Opening
  // a widget kicks the panel through streaming → settled, exactly how a real
  // artifact arrives from the model. Under prefers-reduced-motion we skip the
  // delay and show the settled content immediately (no perceived motion).
  const [phase, setPhase] = React.useState<'streaming' | 'ready'>('ready');
  const timer = React.useRef<number | null>(null);

  const handleOpen = (a: any) => {
    if (timer.current) window.clearTimeout(timer.current);
    setActive(a);
    setOpen(true);
    const reduce = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('ready'); return; }
    setPhase('streaming');
    timer.current = window.setTimeout(() => setPhase('ready'), 1100);
  };

  React.useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: 360, alignItems: 'stretch' }}>
      {/* Chat column — flex: 1, shrinks when the panel opens. Uses the
          canonical .msg-thread so the AI spacing tokens (thread padding,
          turn gap, follow-up gap, avatar gap) apply consistently. */}
      <div className="msg-thread fluid" style={{ flex: 1, minWidth: 0 }}>
        <Message from="user">Draft a design brief for the identity service.</Message>
        <Message from="assistant">
          <p style={{ margin: '0 0 10px' }}>Here is the brief. I also attached the initial Go skeleton:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ArtifactWidget artifact={DOC_ARTIFACT} onOpen={() => handleOpen(DOC_ARTIFACT)}/>
            <ArtifactWidget artifact={CODE_ARTIFACT} onOpen={() => handleOpen(CODE_ARTIFACT)}/>
          </div>
        </Message>
      </div>
      {/* Drawer — always rendered. The Drawer (inline variant) handles its
          own open/closed width animation, so the chat sibling shrinks /
          grows around it without conditional rendering. */}
      <ArtifactPanel
        artifact={active}
        open={open}
        onClose={() => setOpen(false)}
        width={420}
      >
        {phase === 'streaming' ? <StreamingBody/> : <ArtifactBody artifact={active}/>}
      </ArtifactPanel>
    </div>
  );
}

// ── Kinds demo ───────────────────────────────────────────────────────────────
function KindsDemo() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<any>(null);

  const KINDS = [DOC_ARTIFACT, HTML_ARTIFACT, APP_ARTIFACT, CODE_ARTIFACT];

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: 320, alignItems: 'stretch' }}>
      <div className="msg-thread fluid" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ margin: '0 0 4px', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
          Click a widget — the drawer docks to the right and this column shrinks to make room.
        </p>
        {KINDS.map(a => (
          <ArtifactWidget
            key={a.id}
            artifact={a as any}
            onOpen={() => { setActive(a); setOpen(true); }}
          />
        ))}
      </div>
      <ArtifactPanel
        artifact={active || DOC_ARTIFACT}
        open={open}
        onClose={() => setOpen(false)}
        width={420}
      >
        <ArtifactBody artifact={active || DOC_ARTIFACT}/>
      </ArtifactPanel>
    </div>
  );
}

// ── Tabs demo ────────────────────────────────────────────────────────────────
function TabsDemo() {
  const [open, setOpen] = React.useState(true);

  const tabArtifact = {
    id: 'tab-1',
    kind: 'code' as const,
    title: 'health-check.ts',
    meta: '42 lines · typescript',
    lang: 'ts',
  };

  const tabs = [
    {
      id: 'preview',
      label: 'Preview',
      content: (
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="pill success">Healthy</span>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>identity-svc · p95 48 ms</span>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.7 }}>
            <div>GET /healthz → 200 OK</div>
            <div>db: connected (4.2 ms)</div>
            <div>redis: connected (0.8 ms)</div>
          </div>
        </div>
      ),
    },
    {
      id: 'code',
      label: 'Code',
      content: (
        <pre style={{ margin: 0, padding: 16, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', lineHeight: 1.7, overflowX: 'auto' }}>
          <code>{`export async function healthCheck() {
  const db = await checkDatabase();
  const redis = await checkRedis();
  return {
    status: db.ok && redis.ok ? 'healthy' : 'degraded',
    latency: db.latencyMs,
  };
}`}</code>
        </pre>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 0, width: '100%', minHeight: 260 }}>
      <div style={{ flex: '0 0 280px', padding: 16, borderInlineEnd: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ArtifactWidget artifact={tabArtifact} onOpen={() => setOpen(true)}/>
        {!open && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-faint)' }}>Panel closed — click to reopen</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <ArtifactPanel
          artifact={tabArtifact}
          open={open}
          onClose={() => setOpen(false)}
          tabs={tabs}
        />
      </div>
    </div>
  );
}

// ── Actions demo ─────────────────────────────────────────────────────────────
function ActionsDemo() {
  const [open, setOpen] = React.useState(true);
  const [downloaded, setDownloaded] = React.useState(false);

  const actions = (
    <div style={{ display: 'flex', gap: 4 }}>
      <button
        type="button"
        className="btn ghost sm"
        aria-label="Download"
        title="Download"
        onClick={() => setDownloaded(true)}
      >
        <Icons.download size={13}/>
        {downloaded && <span style={{ marginInlineStart: 4, fontSize: 'var(--text-xs)' }}>Saved</span>}
      </button>
      <button type="button" className="btn ghost sm" aria-label="Share" title="Share">
        <Icons.share size={13}/>
      </button>
    </div>
  );

  return (
    <div style={{ width: '100%', minHeight: 200 }}>
      <ArtifactPanel
        artifact={DOC_ARTIFACT as any}
        open={open}
        onClose={() => setOpen(false)}
        actions={actions}
      />
      {!open && (
        <button className="btn ghost sm" onClick={() => { setOpen(true); setDownloaded(false); }}>
          Reopen panel
        </button>
      )}
    </div>
  );
}

// ── State demos ──────────────────────────────────────────────────────────────
// An artifact is never just "has content". A panel must render the moment it
// is still being written, the moment generation fails, and the moment there is
// nothing to show. Each is a real, labelled ArtifactPanel — not prose.

// STREAMING — the model is still writing the artifact. Skeleton lines stand in
// for the unwritten body; the container is aria-busy. Pinned open.
function StreamingState() {
  return (
    <div style={{ width: '100%', minHeight: 220 }}>
      <ArtifactPanel artifact={DOC_ARTIFACT as any} open width={360}>
        <StreamingBody/>
      </ArtifactPanel>
    </div>
  );
}

// ERROR — generation failed. A danger Alert carries role="alert" (assertive)
// so an SR announces it; Retry is a real focusable button.
function ErrorState() {
  const [retried, setRetried] = React.useState(false);
  return (
    <div style={{ width: '100%', minHeight: 220 }}>
      <ArtifactPanel artifact={{ ...DOC_ARTIFACT, meta: 'generation failed' } as any} open width={360}>
        <Alert tone="danger" assertive>
          <AlertTitle>Couldn&rsquo;t finish the artifact</AlertTitle>
          <AlertDescription>The model stopped after the heading — the upstream request to <Mono>eidos-ai/sonnet-4-6</Mono> was cut off. Your prompt is preserved.</AlertDescription>
          <AlertActions>
            <button type="button" className="btn sm" onClick={() => setRetried(true)}>
              <Icons.refresh size={13}/> {retried ? 'Retrying…' : 'Retry'}
            </button>
          </AlertActions>
        </Alert>
      </ArtifactPanel>
    </div>
  );
}

// EMPTY — the panel is docked but nothing has been produced yet (or the app
// artifact has no mounted preview). Composes the shared Empty State pattern.
function EmptyState() {
  return (
    <div style={{ width: '100%', minHeight: 220 }}>
      <ArtifactPanel artifact={{ ...APP_ARTIFACT, meta: 'no preview yet' } as any} open width={360}>
        <Empty
          size="sm"
          icon={<Icons.rocket size={16}/>}
          title="No preview yet"
          desc="Pass children with your iframe or live mount to render the app here. Until then the panel stays docked and quiet."
        />
      </ArtifactPanel>
    </div>
  );
}

export default function AiArtifactPage() {
  return (
    <Section
      id="artifact"
      num="20"
      title="Artifact"
      desc="A self-contained thing the model produced that lives beyond the chat turn — a document, an HTML page, a code file, or an app. Surface as a compact widget chip in the thread, docked full beside the conversation."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-artifact')} ariaLabel="package manager"/>
      <Lede up>
        Ships <Mono>ArtifactWidget</Mono> and <Mono>ArtifactPanel</Mono>. The widget is a compact chip for message bubbles; the panel is the full docked host with a header, optional tabs, an actions slot, and a scrollable body. Both consume the <Mono>ArtifactRef</Mono> shape.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="Two ArtifactWidgets in an assistant bubble → click to open the side panel" height={360} code={`import { ArtifactWidget, ArtifactPanel } from "@/ds/core"

const [open, setOpen] = useState(false);
const [active, setActive] = useState(docArtifact);

// Inside the assistant Message:
<ArtifactWidget artifact={docArtifact}  onOpen={() => { setActive(docArtifact);  setOpen(true); }}/>
<ArtifactWidget artifact={codeArtifact} onOpen={() => { setActive(codeArtifact); setOpen(true); }}/>

// Beside the thread:
<ArtifactPanel artifact={active} open={open} onClose={() => setOpen(false)}/>`}>
        <UsageDemo/>
      </Frame>
      <Lede>
        The chat column and panel column sit in a flex row. Clicking a widget opens the panel and the artifact <b>lands</b> — the body streams a <Mono>Skeleton</Mono> placeholder (header note: <Mono>writing…</Mono>, container <Mono>aria-busy</Mono>) before the settled content swaps in, so the panel height never jumps. The close button (×) in the panel header dismisses it; <Mono>Esc</Mono> closes it too. Under <Mono>prefers-reduced-motion</Mono> the streaming step is skipped and the content appears at once.
      </Lede>

      {/* 3a. KINDS */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Variants</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="4 kinds">Kinds</SubHead>
      <Frame label="document · html · app · code — each kind shows a different icon + panel" height={320} code={`// kind drives the icon tile and the default content renderer
<ArtifactWidget artifact={{ id, kind: 'document', title: 'Design Brief', meta: '3 KB · markdown' }}/>
<ArtifactWidget artifact={{ id, kind: 'html',     title: 'Incident Summary', meta: '8 KB' }}/>
<ArtifactWidget artifact={{ id, kind: 'app',      title: 'Cost Explorer', meta: 'interactive' }}/>
<ArtifactWidget artifact={{ id, kind: 'code',     title: 'main.go', meta: '126 lines · go', lang: 'go' }}/>`}>
        <KindsDemo/>
      </Frame>
      <Lede>
        The <Mono>kind</Mono> field drives the icon tile (doc / globe / rocket / terminal) and the label shown in the meta line. The panel's default content renderer switches on <Mono>kind</Mono>: documents split on double newlines into paragraphs; HTML panels render the <Mono>html</Mono> field; code renders in a <Mono>{'<pre>'}</Mono> block; apps show a placeholder prompting a custom <Mono>children</Mono> mount.
      </Lede>

      {/* 3b. TABS */}
      <SubHead meta="code + preview">Tabs</SubHead>
      <Frame label="tabs=[{id:'preview',…},{id:'code',…}] — switch between rendered and source" height={280} code={`<ArtifactPanel
  artifact={tsArtifact}
  open={open}
  onClose={() => setOpen(false)}
  tabs={[
    { id: 'preview', label: 'Preview', content: <HealthPreview/> },
    { id: 'code',    label: 'Code',    content: <CodeBlock code={src}/> },
  ]}
/>`}>
        <TabsDemo/>
      </Frame>
      <Lede>
        Pass <Mono>tabs</Mono> to render a tab strip under the panel header. The first tab is selected by default. Tab buttons carry <Mono>role="tab"</Mono> and <Mono>aria-selected</Mono>; the panel header stays visible in all tabs for consistent orientation.
      </Lede>

      {/* 3c. ACTIONS SLOT */}
      <SubHead meta="actions slot">Actions</SubHead>
      <Frame label="actions={<>…</>} — mini icon buttons in the panel header (Download / Share)" height={220} code={`const actions = (
  <>
    <button className="btn ghost sm" aria-label="Download" onClick={download}>
      <Icons.download size={13}/>
    </button>
    <button className="btn ghost sm" aria-label="Share">
      <Icons.share size={13}/>
    </button>
  </>
);

<ArtifactPanel artifact={docArtifact} open actions={actions} onClose={…}/>`}>
        <ActionsDemo/>
      </Frame>
      <Lede>
        The <Mono>actions</Mono> slot renders between the title/meta block and the close button in the header strip. Use <Mono>btn ghost sm</Mono> icon-only buttons so they stay flush with the panel chrome. The close button is always last at the trailing edge.
      </Lede>

      {/* 3d. STATES */}
      <SubHead meta="streaming · error · empty">States</SubHead>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: '68ch' }}>
        An artifact is never just &ldquo;has content.&rdquo; These are the three states the panel must render explicitly — the model still writing, a generation that failed, and a docked panel with nothing to show yet.
      </p>
      <div className="ds-grid cols-3" style={{ gap: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}>Streaming</div>
          <StreamingState/>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>
            A <Mono>Skeleton</Mono> stands in for the unwritten body; the container is <Mono>aria-busy</Mono> and a spinner announces <Mono>writing…</Mono> via <Mono>aria-live</Mono>.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}>Error</div>
          <ErrorState/>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>
            A danger <Mono>Alert</Mono> (<Mono>role=&quot;alert&quot;</Mono>) fills the body; the prompt is preserved and Retry is a real focusable button.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}>Empty</div>
          <EmptyState/>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>
            Composes the shared <a href="/empty" style={{ color: 'var(--ember)' }}>Empty State</a> — small tile, title, lede. The panel stays docked rather than collapsing, so the layout doesn&rsquo;t shift when content lands.
          </p>
        </div>
      </div>

      {/* 4. IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede>
        The canonical layout: a 2-column flex row with the thread on the left and the docked panel filling the right. On narrow viewports the panel slides over the thread as a fixed-position overlay; on wide viewports it sits side-by-side. The widget in the message is the only entry point — never open the panel without a user gesture.
      </Lede>
      <CodeBlock
        label="recommended container shell"
        lang="tsx"
        code={`<div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
  {/* left: the conversation thread */}
  <div style={{ flex: 1, overflowY: 'auto' }}>
    <Conversation messages={messages}/>
  </div>

  {/* right: the artifact panel, conditionally rendered */}
  {panelOpen && (
    <div style={{ width: 480, borderInlineStart: '1px solid var(--border)', overflowY: 'auto' }}>
      <ArtifactPanel
        artifact={activeArtifact}
        open
        onClose={() => setPanelOpen(false)}
        actions={actions}
        tabs={tabs}
      />
    </div>
  )}
</div>`}
      />

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 14, rowGap: 8, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <kbd className="kbd">Tab</kbd><span>Moves to the widget chip, then into the panel — tabs, action buttons, close.</span>
            <kbd className="kbd">Enter</kbd><span>Activates the focused <code style={{ fontFamily: 'var(--font-mono)' }}>ArtifactWidget</code> button — opens the panel.</span>
            <kbd className="kbd">Space</kbd><span>Same as Enter — both fire the native <code style={{ fontFamily: 'var(--font-mono)' }}>{'<button>'}</code> click.</span>
            <kbd className="kbd">Esc</kbd><span>Closes the panel — the underlying <code style={{ fontFamily: 'var(--font-mono)' }}>Drawer</code> listens for it and calls <code style={{ fontFamily: 'var(--font-mono)' }}>onClose</code>. Already wired; no extra handler needed.</span>
            <kbd className="kbd">←/→</kbd><span>Moves between tabs when a <code style={{ fontFamily: 'var(--font-mono)' }}>tabs</code> strip is present (roving tabindex recommended on the tablist).</span>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Roles &amp; screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The widget&rsquo;s <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> encodes kind + title — <i>&ldquo;Open document: Service Design Brief&rdquo;</i>. The panel is a <code style={{ fontFamily: 'var(--font-mono)' }}>Drawer</code>, so it carries <code style={{ fontFamily: 'var(--font-mono)' }}>role=&quot;dialog&quot;</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>aria-labelledby</code> pointing at the header title (the inline variant sets <code style={{ fontFamily: 'var(--font-mono)' }}>aria-modal=&quot;false&quot;</code> since it docks rather than traps). The close button is labelled <code style={{ fontFamily: 'var(--font-mono)' }}>&quot;Close drawer&quot;</code>; tab buttons are <code style={{ fontFamily: 'var(--font-mono)' }}>role=&quot;tab&quot;</code> inside a <code style={{ fontFamily: 'var(--font-mono)' }}>role=&quot;tablist&quot;</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>aria-selected</code>. The streaming body is <code style={{ fontFamily: 'var(--font-mono)' }}>aria-busy</code>; the error state is a danger <code style={{ fontFamily: 'var(--font-mono)' }}>Alert</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>role=&quot;alert&quot;</code>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The widget and every panel control use the standard <code style={{ fontFamily: 'var(--font-mono)' }}>:focus-visible</code> double-shadow ring. The active tab indicator is an ember underline — ember text/marks on <code style={{ fontFamily: 'var(--font-mono)' }}>--surface</code> clear AA (4.5:1). Icon-only action buttons carry <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> so their function is communicated regardless of the icon. The kind label and meta row are real visible text, never aria-only.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The panel slide-in and the artifact <i>land</i> transition (empty → streaming → settled) both respect <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code>: under it the streaming step is skipped and content appears at once, and the slide fires instantly. The tab content swap has no fade by default; the spinner&rsquo;s rotation is the only persistent animation and it collapses under reduced-motion.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — widget chevron and panel header flip via logical properties" height={280}>
        <div dir="rtl" style={{ display: 'flex', gap: 0, width: '100%', minHeight: 240 }}>
          <div style={{ flex: '0 0 280px', padding: 16, borderInlineEnd: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ArtifactWidget
              artifact={{ ...DOC_ARTIFACT, title: 'وثيقة تصميم الخدمة', meta: '3.2 كيلوبايت' } as any}
            />
            <ArtifactWidget
              artifact={{ ...CODE_ARTIFACT, title: 'identity-svc/main.go', meta: '126 سطر' } as any}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ArtifactPanel
              artifact={{ ...DOC_ARTIFACT, title: 'وثيقة تصميم الخدمة', meta: '3.2 كيلوبايت' } as any}
              open
            />
          </div>
        </div>
      </Frame>
      <Lede>
        The widget uses logical CSS properties (<Mono>padding-inline</Mono>, <Mono>margin-inline</Mono>) so the icon tile, title, and external-link chevron mirror automatically under <Mono>dir="rtl"</Mono>. The panel header follows the same rule — the close button moves to the inline-start (right) edge. No manual transform is needed.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Widget anatomy — the compact chip (parts 1–4) */}
            <div>
              <div style={{ marginBottom: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Widget</div>
              <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
                <ArtifactWidget artifact={DOC_ARTIFACT as any}/>
                <span className="lead v" style={{ top: -22, left: 14, height: 18 }}/>
                <span className="lead v" style={{ top: -22, left: 52, height: 18 }}/>
                <span className="lead h" style={{ top: 14, right: -30, width: 26 }}/>
                <span className="lead v" style={{ bottom: -22, left: 80, height: 18 }}/>
                <div className="pin" style={{ top: -42, left: 14, transform: 'translateX(-50%)' }}>1</div>
                <div className="pin" style={{ top: -42, left: 52, transform: 'translateX(-50%)' }}>2</div>
                <div className="pin" style={{ top: 6, right: -54 }}>3</div>
                <div className="pin" style={{ bottom: -42, left: 80, transform: 'translateX(-50%)' }}>4</div>
              </div>
            </div>
            {/* Panel anatomy — the docked host (parts 5–9), the more complex surface */}
            <div>
              <div style={{ marginBottom: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Panel</div>
              <div className="stage" style={{ position: 'relative', inlineSize: 300 }} aria-hidden="true">
                <ArtifactPanel
                  artifact={DOC_ARTIFACT as any}
                  width={300}
                  onClose={() => {}}
                  actions={<button type="button" className="btn ghost sm" tabIndex={-1} aria-hidden="true"><Icons.download size={13}/></button>}
                  tabs={[
                    { id: 'preview', label: 'Preview', content: null },
                    { id: 'code', label: 'Code', content: null },
                  ]}
                >
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
                    The identity service issues, rotates, and validates JWT credentials for all internal Eidos services.
                  </p>
                </ArtifactPanel>
                <span className="lead h" style={{ top: 22, left: -34, width: 30 }}/>
                <span className="lead v" style={{ top: -22, right: 42, height: 22 }}/>
                <span className="lead h" style={{ top: 22, right: -34, width: 30 }}/>
                <span className="lead h" style={{ top: 64, left: -34, width: 30 }}/>
                <span className="lead h" style={{ bottom: 40, left: -34, width: 30 }}/>
                <div className="pin" style={{ top: 14, left: -58 }}>5</div>
                <div className="pin" style={{ top: -42, right: 34 }}>8</div>
                <div className="pin" style={{ top: 14, right: -58 }}>9</div>
                <div className="pin" style={{ top: 56, left: -58 }}>6</div>
                <div className="pin" style={{ bottom: 32, left: -58 }}>7</div>
              </div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 640, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Icon tile.</b> 32×32 squircle bearing the kind icon — <Mono>doc</Mono> for document, <Mono>globe</Mono> for HTML, <Mono>rocket</Mono> for app, <Mono>terminal</Mono> for code. Never re-tint; the tile uses <Mono>--surface-active</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> The artifact's name — same-size bold sans. Truncates with an ellipsis when the widget is in a narrow column.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>External-link icon.</b> <Mono>Icons.externalLink</Mono> at the trailing edge — signals "opens a panel" to sighted users. Decorative; the widget's <Mono>aria-label</Mono> carries the intent.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Meta line.</b> Kind label + optional short meta ("12 KB · markdown"). Geist Mono on <Mono>--fg-muted</Mono>.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Panel header.</b> The same kind icon, the artifact title, and the meta row — the stable orientation strip that stays fixed while the body scrolls and across every tab.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Tab strip.</b> Optional <Mono>tabs</Mono> rendered under the header as <Mono>role="tab"</Mono> buttons; the active tab carries an ember underline. Omit for single-view artifacts.</span>
            <span className="num">7</span><span><b style={{ color: 'var(--fg)' }}>Scrollable body.</b> The artifact content — markdown, a <Mono>{'<pre>'}</Mono> code block, sanitized HTML, or your own <Mono>children</Mono> mount. Scrolls independently of the header.</span>
            <span className="num">8</span><span><b style={{ color: 'var(--fg)' }}>Actions slot.</b> The <Mono>actions</Mono> node (Download, Share, …) sits between the meta block and the close button as <Mono>btn ghost sm</Mono> icon buttons.</span>
            <span className="num">9</span><span><b style={{ color: 'var(--fg)' }}>Close button.</b> Always last at the inline-end edge of the header. Calls <Mono>onClose</Mono>; only rendered when an <Mono>onClose</Mono> handler is supplied.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — dock the panel beside the thread</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 8, width: '100%', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
              <div style={{ flex: 1, border: '1px dashed var(--border)', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Thread</div>
              <div style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 6, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>Panel</div>
            </div>
          </div>
          <div className="note">The 2-column layout keeps the conversation visible while the user reads or edits the artifact. Focus is not trapped — the user can return to the thread without closing the panel.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — open the panel as a blocking modal</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Service Design Brief</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>A full-screen modal overlay</div>
            </div>
          </div>
          <div className="note">A modal blocks the thread and forces the user to close the artifact before they can reply. Use a docked panel or a side-sheet instead so the conversation stays accessible.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use the widget as the only entry point</div>
          <div className="body" style={{ padding: 14 }}>
            <ArtifactWidget artifact={CODE_ARTIFACT as any} onOpen={() => {}}/>
          </div>
          <div className="note">The chip in the message thread is the discovery surface. One gesture opens the panel — no separate "View artifact" button needed.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wrap the widget in another bordered card</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 12, background: 'var(--surface-active)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', marginBottom: 8 }}>Attached file</div>
              <ArtifactWidget artifact={CODE_ARTIFACT as any}/>
            </div>
          </div>
          <div className="note">The widget already carries its own border and background. Wrapping it doubles the chrome and increases visual weight without adding information.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="ArtifactProps">API reference</SubHead>
      <PropsTable
        label="ArtifactRef"
        rows={[
          { prop: 'id',      type: 'string',                                        required: true,    description: 'Unique identifier for the artifact. Used as the React key.' },
          { prop: 'kind',    type: '"document" | "html" | "app" | "code"',           required: true,    description: 'Drives the icon tile and the default content renderer.' },
          { prop: 'title',   type: 'string',                                        required: true,    description: 'Artifact name — shown in the widget title line and panel header.' },
          { prop: 'meta',    type: 'string',                                        default: undefined, description: 'Short subtitle / meta string ("12 KB · markdown", "342 lines").' },
          { prop: 'lang',    type: 'string',                                        default: undefined, description: 'Language identifier for code artifacts ("ts", "go", "py"). Informational.' },
          { prop: 'content', type: 'string',                                        default: undefined, description: 'Inline text content. Document: rendered as paragraphs. Code: rendered in <pre>.' },
          { prop: 'html',    type: 'string',                                        default: undefined, description: 'Pre-rendered HTML for kind="html". Consumer is responsible for sanitizing.' },
        ]}
      />
      <PropsTable
        label="<ArtifactWidget />"
        rows={[
          { prop: 'artifact',  type: 'ArtifactRef', required: true,    description: 'The artifact to represent. Drives icon, title, meta, and aria-label.' },
          { prop: 'onOpen',    type: '() => void',  default: undefined, description: 'Called when the user clicks (or activates via keyboard) the widget.' },
          { prop: 'className', type: 'string',      default: undefined, description: 'Additional class names appended to the widget button.' },
        ]}
      />
      <PropsTable
        label="<ArtifactPanel />"
        rows={[
          { prop: 'artifact',  type: 'ArtifactRef',                                      required: true,    description: 'The artifact being shown. Drives the header icon, title, meta.' },
          { prop: 'open',      type: 'boolean',                                           default: 'true',   description: 'When false the panel renders null — the caller controls visibility.' },
          { prop: 'onClose',   type: '() => void',                                        default: undefined, description: 'Renders a close button in the header when provided. Call to toggle open.' },
          { prop: 'actions',   type: 'ReactNode',                                         default: undefined, description: 'Extra controls (Download, Share, …) rendered between the title and close button.' },
          { prop: 'tabs',      type: '{ id: string; label: string; content: ReactNode }[]', default: undefined, description: 'When set, renders a tab strip under the header. First tab is selected by default.' },
          { prop: 'children',  type: 'ReactNode',                                         default: undefined, description: 'Custom body content. If omitted (and no tabs), the default renderer fires by kind.' },
          { prop: 'className', type: 'string',                                            default: undefined, description: 'Additional class names on the panel aside element.' },
        ]}
      />
    </Section>
  );
}
