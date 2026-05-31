'use client';
// Forge AI — Prompt Input (§2.2 component-page standard).
// The composer at the bottom of every chat surface. An auto-sizing multi-line
// textarea, an optional attachment header, a toolbar (attach · model · custom
// tools), and a status-driven submit button. Covers every state from idle to
// streaming with stop, plus attachments, drag-drop, disabled, and error.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, AutoPropsTable, PropsTable, installTabs, Lede, PromptSubmit, ModelBadge, ModelSelector, Attachment, DragDropOverlay, PromptInput, PromptBanner, Mono } from '@/ds/core';

// AI-page inline style convention (agents.tsx idiom)

// ── Labelled state strip ─────────────────────────────────────────────────────
const stack = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8 };

// A single composer showing one specific status label
const StateComposer = ({
  status,
  label,
  text,
  disabled,
  invalid,
}: {
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  label: string;
  text?: string;
  disabled?: boolean;
  invalid?: boolean;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 420 }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>{label}</span>
    <PromptInput
      status={status}
      disabled={disabled}
      invalid={invalid}
      placeholder={
        status === 'submitted' ? 'Sending…' :
        status === 'streaming' ? 'Generating…' :
        status === 'error'     ? 'Request failed — retry?' :
        disabled               ? 'Uploading attachments…' :
        invalid                ? 'Message required before sending' :
                                 'Ask anything…'
      }
      value={text}
      rows={1}
    />
  </div>
);

// Interactive idle composer — full autocomplete demo
const IdleComposer = () => {
  const [text, setText] = React.useState('');
  return (
    <PromptInput
      status="ready"
      placeholder="Ask anything…"
      value={text}
      onChange={setText}
      onSubmit={() => setText('')}
      modelValue="forge-sonnet-4-6"
      onModelChange={() => {}}
    />
  );
};

// Typing composer — pre-filled, cursor at end
const TypingComposer = () => {
  const [text, setText] = React.useState("I'm seeing a p99 spike on identity-svc — anything in the last deploy?");
  return (
    <PromptInput
      status="ready"
      value={text}
      onChange={setText}
      onSubmit={() => {}}
      modelValue="forge-opus-4-7"
      onModelChange={() => {}}
      rows={2}
    />
  );
};

// Streaming composer — stop button
const StreamingComposer = () => {
  const [streaming, setStreaming] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 480 }}>
      <PromptInput
        status={streaming ? 'streaming' : 'ready'}
        placeholder={streaming ? 'Generating response…' : 'Ask anything…'}
        modelValue="forge-sonnet-4-6"
        onModelChange={() => {}}
        onStop={() => setStreaming(false)}
        rows={1}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn xs outline" onClick={() => setStreaming(true)}>
          <Icons.sparkle size={12}/> Simulate streaming
        </button>
        <button className="btn xs ghost" onClick={() => setStreaming(false)}>
          Stop
        </button>
      </div>
    </div>
  );
};

// Full toolbar composer
const FullToolbarComposer = () => {
  const [text, setText] = React.useState("Two screenshots + the log + the trace JSON. Walk me through it.");
  const [model, setModel] = React.useState('forge-opus-4-7');
  const [pinned, setPinned] = React.useState(true);
  const [files, setFiles] = React.useState([
    { id: 'a', name: 'flamegraph-p99.png',   size: '186 KB', kind: 'image' as const, hue: 18 },
    { id: 'b', name: 'incident-0421.log',    size: '8.4 KB', kind: 'file'  as const },
  ]);
  return (
    <div>
      <PromptInput
        status="ready"
        value={text}
        onChange={setText}
        onSubmit={() => {}}
        modelValue={model}
        onModelChange={setModel}
        attachments={files}
        onRemoveAttachment={id => setFiles(arr => arr.filter(x => x.id !== id))}
        footerTools={
          <button
            className={'pi-tool' + (pinned ? ' is-on' : '')}
            title="Pin context"
            onClick={() => setPinned(v => !v)}
            aria-pressed={pinned}
          >
            <Icons.pin size={14}/>
          </button>
        }
        rows={2}
      />
      <div className="pi-helper">
        <span>2 attachments · 1 pinned doc</span>
        <span className="pi-kbd-row">
          <span className="pi-kbd">⇧</span>
          <span className="pi-kbd">⏎</span>
          <span className="pi-kbd-label">new line</span>
          <span className="pi-kbd-sep" aria-hidden="true">·</span>
          <span className="pi-kbd">⏎</span>
          <span className="pi-kbd-label">send</span>
        </span>
      </div>
    </div>
  );
};

// Multiple attachments — image + file mix
const MultiAttachDemo = () => {
  const [files, setFiles] = React.useState([
    { id: 'a', name: 'flamegraph-p99.png',     size: '186 KB', kind: 'image' as const, hue: 18 },
    { id: 'b', name: 'screenshot-error.png',   size: '92 KB',  kind: 'image' as const, hue: 200 },
    { id: 'c', name: 'incident-0421.log',      size: '8.4 KB', kind: 'file'  as const },
    { id: 'd', name: 'trace-billing-svc.json', size: '4.2 KB', kind: 'file'  as const },
  ]);
  return (
    <PromptInput
      status="ready"
      value="Two screenshots + the log + the trace JSON. Walk me through it."
      modelValue="forge-opus-4-7"
      onModelChange={() => {}}
      attachments={files}
      onRemoveAttachment={id => setFiles(arr => arr.filter(x => x.id !== id))}
      rows={2}
    />
  );
};

// Upload-in-progress
const UploadingDemo = () => {
  const [pct, setPct] = React.useState(34);
  React.useEffect(() => {
    const t = setInterval(() => setPct(v => v >= 100 ? 12 : v + 6), 300);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pi">
      <div className="pi-head">
        <Attachment file={{ name: 'screen-recording.mov', size: '14.2 MB', kind: 'file' }} progress={pct}/>
        <Attachment file={{ name: 'flamegraph.png', size: '186 KB', kind: 'image', hue: 280 }} progress={100}/>
      </div>
      <div className="pi-body">
        <textarea className="pi-textarea" rows={1} placeholder="Uploading — submit unlocks once ready" disabled/>
      </div>
      <div className="pi-foot">
        <button className="pi-tool" disabled><Icons.paperclip size={15}/></button>
        <ModelSelector value="forge-sonnet-4-6" onChange={() => {}}/>
        <span className="spacer"/>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
          uploading {pct}%
        </span>
        <button className="pi-submit" disabled aria-label="Sending disabled while uploading">
          <span className="pi-submit-spin"/>
        </button>
      </div>
    </div>
  );
};

// Simple drop-zone (inline)
const DropZoneDemo = () => {
  const [drag, setDrag] = React.useState(false);
  return (
    <div
      className={'pi' + (drag ? ' is-dragging' : '')}
      style={{ maxWidth: 540 }}
      onDragEnter={e => { e.preventDefault(); setDrag(true); }}
      onDragOver={e => e.preventDefault()}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); }}
    >
      <div className="pi-body">
        <textarea className="pi-textarea" placeholder="Drag a file anywhere on this composer…" rows={2}/>
      </div>
      {drag ? (
        <div className="pi-drop-hint">
          <Icons.upload size={14}/> Drop to attach
        </div>
      ) : (
        <div className="pi-foot">
          <button className="pi-tool"><Icons.paperclip size={15}/></button>
          <ModelSelector value="forge-sonnet-4-6" onChange={() => {}}/>
          <span className="spacer"/>
          <PromptSubmit status="ready" hasText={false} onClick={() => {}}/>
        </div>
      )}
    </div>
  );
};

// ── New: banner + actions + hint + elevated showcase ─────────────────────────
// One composer that puts all four optional slots side-by-side so the cumulative
// effect is obvious: a ribbon above, a "+" actions trigger, a soft drop shadow,
// and a supporting caption below.
const EnhancedComposer = () => {
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('forge-sonnet-4-6');
  const [picked, setPicked] = React.useState<string | null>(null);
  return (
    <PromptInput
      status="ready"
      value={text}
      onChange={setText}
      onSubmit={() => setText('')}
      modelValue={model}
      onModelChange={setModel}
      elevated
      topBanner={
        <PromptBanner tone="promo" cta="Upgrade →">
          Access premium models &amp; features
        </PromptBanner>
      }
      actions={[
        { id: 'upload',  icon: 'upload',   label: 'Upload images or files', description: 'PNG, JPG, PDF, log files — up to 20 MB' },
        { id: 'image',   icon: 'sparkle',  label: 'Generate image',         description: 'Describe a picture and the agent will draw it' },
        { id: 'search',  icon: 'search',   label: 'Deep search',            description: 'Browse trusted sources for a longer answer' },
        { id: 'tools',   icon: 'terminal', label: 'Run a tool',             description: 'Open the tool picker (file, shell, web, …)' },
        { divider: true, id: '__div', label: '' },
        { id: 'clear',   icon: 'trash',    label: 'Clear conversation',     destructive: true, description: 'Removes every message from this thread' },
      ]}
      onActionSelect={id => setPicked(id)}
      footerHint={
        <>AI can make mistakes — please double-check important answers.{' '}
          {picked && (
            <span style={{ color: 'var(--ember)', fontFamily: 'var(--font-mono)' }}>
              picked: {picked}
            </span>
          )}
        </>
      }
    />
  );
};

// Banner gallery — one composer per tone, side-by-side so the row of icons +
// tints reads at a glance.
const BannerGallery = () => {
  const items: { tone: 'promo' | 'info' | 'warn' | 'success' | 'danger'; cta?: string; text: React.ReactNode }[] = [
    { tone: 'promo',   cta: 'Upgrade →', text: <>Access premium models &amp; features</> },
    { tone: 'info',    text: <>Beta agent · responses may take longer than usual</> },
    { tone: 'success', text: <>Connected to <b>identity-svc</b> · 4 tools available</> },
    { tone: 'warn',    cta: 'Switch model',  text: <>Approaching the daily limit · <b>92% used</b></> },
    { tone: 'danger',  cta: 'Retry',         text: <>Connection lost · check your network</> },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {items.map(it => (
        <PromptInput
          key={it.tone}
          status="ready"
          placeholder="Ask anything…"
          rows={1}
          topBanner={
            <PromptBanner tone={it.tone} cta={it.cta}>{it.text}</PromptBanner>
          }
        />
      ))}
    </div>
  );
};

// Dismissible — clicking the × removes the banner, the composer shrinks to
// the no-banner layout (single rounded card). Resets on the demo's Reset.
const DismissibleBanner = () => {
  const [shown, setShown] = React.useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      <PromptInput
        status="ready"
        placeholder="Describe the bug…"
        rows={1}
        topBanner={shown
          ? (
            <PromptBanner
              tone="info"
              cta="Learn more"
              onDismiss={() => setShown(false)}
            >
              New: drag & drop file context · no more pasting paths
            </PromptBanner>
          )
          : undefined
        }
      />
      {!shown && (
        <button
          type="button"
          className="btn xs ghost"
          onClick={() => setShown(true)}
        >
          Restore banner
        </button>
      )}
    </div>
  );
};

// Banner-only — keeps the simple single-promo example used in the original
// "Top banner" section. Now uses PromptBanner.
const BannerComposer = () => (
  <PromptInput
    status="ready"
    placeholder="Describe the bug…"
    rows={1}
    topBanner={
      <PromptBanner tone="info">
        Beta agent · responses may take longer than usual
      </PromptBanner>
    }
  />
);

// "+" actions menu only — paperclip replaced by + trigger
const ActionsComposer = () => {
  const [picked, setPicked] = React.useState<string | null>(null);
  return (
    <PromptInput
      status="ready"
      placeholder="Type a message, or pick an action…"
      rows={1}
      modelValue="forge-sonnet-4-6"
      onModelChange={() => {}}
      actions={[
        { id: 'upload', icon: 'upload',  label: 'Upload images or files', description: 'PNG, JPG, PDF — up to 20 MB' },
        { id: 'image',  icon: 'sparkle', label: 'Generate image',         description: 'Describe a picture' },
        { id: 'search', icon: 'search',  label: 'Deep search',            description: 'Browse trusted sources' },
      ]}
      onActionSelect={id => setPicked(id)}
      footerHint={picked ? <>You picked <Mono>{picked}</Mono></> : undefined}
    />
  );
};

// ── Code snippets ────────────────────────────────────────────────────────────
const USAGE_CODE = `import { PromptInput } from "@/ds/core";

export function Chat() {
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState<'ready' | 'streaming'>('ready');

  return (
    <PromptInput
      status={status}
      value={text}
      onChange={setText}
      onSubmit={(msg) => { send(msg); setStatus('streaming'); }}
      onStop={() => setStatus('ready')}
      modelValue="forge-sonnet-4-6"
      onModelChange={setModel}
    />
  );
}`;

const STREAMING_CODE = `// While streaming: submit button becomes the stop square.
// Restore 'ready' once the stream settles.
<PromptInput
  status="streaming"
  onStop={() => setStatus('ready')}
/>`;

const ATTACH_CODE = `<PromptInput
  attachments={files}
  onRemoveAttachment={(id) => setFiles(f => f.filter(x => x.id !== id))}
/>`;

const ERROR_CODE = `<PromptInput
  status="error"    // submit button shows the retry icon
  invalid           // paints the danger border + ring
/>`;

const STATUS_CODE = `<PromptSubmit status="ready"/>      // arrow-up · ember · disabled when empty
<PromptSubmit status="submitted"/>  // spinner · disabled
<PromptSubmit status="streaming"/>  // stop square · still clickable
<PromptSubmit status="error"/>      // alert icon · danger fill`;

const ENHANCE_CODE = `<PromptInput
  status="ready"
  elevated                                       // adds --shadow-1 (subtle lift)
  topBanner={                                    // any ReactNode — typically <PromptBanner>
    <PromptBanner tone="promo" cta="Upgrade →">
      Access premium models & features
    </PromptBanner>
  }
  actions={[                                     // "+" replaces paperclip
    { id: 'upload', icon: 'upload',  label: 'Upload images or files', description: 'PNG, JPG, PDF, log' },
    { id: 'image',  icon: 'sparkle', label: 'Generate image',         description: 'Describe a picture' },
    { id: 'search', icon: 'search',  label: 'Deep search',            description: 'Browse trusted sources' },
    { divider: true, id: '__div', label: '' },
    { id: 'clear',  icon: 'trash',   label: 'Clear conversation', destructive: true },
  ]}
  onActionSelect={(id) => run(id)}
  footerHint={                                   // caption BELOW the field
    <>AI can make mistakes — please double-check important answers.</>
  }
/>`;

const BANNER_GALLERY_CODE = `// 5 tones — promo (ember default) · info · success · warn · danger
<PromptInput topBanner={<PromptBanner tone="promo"   cta="Upgrade →">Access premium models & features</PromptBanner>}/>
<PromptInput topBanner={<PromptBanner tone="info">                  Beta agent · responses may take longer</PromptBanner>}/>
<PromptInput topBanner={<PromptBanner tone="success">               Connected to <b>identity-svc</b> · 4 tools available</PromptBanner>}/>
<PromptInput topBanner={<PromptBanner tone="warn"    cta="Switch model">Approaching the daily limit · <b>92% used</b></PromptBanner>}/>
<PromptInput topBanner={<PromptBanner tone="danger"  cta="Retry">     Connection lost · check your network</PromptBanner>}/>`;

const DISMISSIBLE_CODE = `// Pass onDismiss to make the banner closable — caller owns the state.
const [shown, setShown] = React.useState(true);

<PromptInput
  topBanner={shown
    ? <PromptBanner tone="info" cta="Learn more" onDismiss={() => setShown(false)}>
        New: drag & drop file context — no more pasting paths
      </PromptBanner>
    : undefined
  }
/>`;

export default function PromptInputPage() {
  return (
    <Section
      id="ai-prompt-input"
      num="03"
      title="Prompt Input"
      desc="The composer at the bottom of every chat surface: an auto-sizing textarea, an attachment header, a toolbar (attach · model · custom tools), and a status-aware submit button. Enter sends, Shift+Enter adds a line."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-prompt-input')} ariaLabel="package manager"/>
      <Lede>Submit is the only ember affordance — every other tool stays ghost — and it flips to a stop square while the model streams so the user can always cancel.</Lede>
      <Lede>
        Ships <Mono>PromptInput</Mono> (the full composer shell), <Mono>PromptSubmit</Mono> (status-driven submit button), <Mono>ModelSelector</Mono> (drop-up model picker), <Mono>Attachment</Mono> (chip with optional progress bar), <Mono>DropZone</Mono>, and <Mono>DragDropOverlay</Mono>. Each part is also independently exported for custom toolbars.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="textarea · attach · model selector · submit" code={USAGE_CODE} height={230}>
        <IdleComposer/>
      </Frame>
      <Lede>
        The minimal setup: <Mono>status</Mono>, <Mono>value</Mono>/<Mono>onChange</Mono>, <Mono>onSubmit</Mono>, and <Mono>modelValue</Mono>/<Mono>onModelChange</Mono>. Enter submits; Shift+Enter inserts a newline. The submit button auto-disables when the textarea is empty.
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* ALL STATES */}
      <SubHead meta="7 states">States</SubHead>
      <Lede>
        Every state is prop-driven via <Mono>status</Mono> (idle / typing / submitting / streaming / error) plus <Mono>disabled</Mono> and <Mono>invalid</Mono>. Label each state so users always know what the composer is doing.
      </Lede>
      <Frame label="idle · typing · submitting · streaming · disabled · error · invalid" height={700}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', alignItems: 'center' }}>
          <StateComposer status="ready"     label="idle"       />
          <StateComposer status="ready"     label="typing"     text="I'm seeing a p99 spike on identity-svc…"/>
          <StateComposer status="submitted" label="submitting" text="What changed in the last deploy?"/>
          <StateComposer status="streaming" label="streaming"  text="Generating response…"/>
          <StateComposer status="ready"     label="disabled"   disabled/>
          <StateComposer status="error"     label="error"      text="Last request failed"/>
          <StateComposer status="ready"     label="invalid"    invalid/>
        </div>
      </Frame>
      <Lede>
        Idle is the blank composer. Typing has text but the user hasn't submitted yet. Submitting locks the textarea and shows the spinner. Streaming replaces the submit arrow with a stop square — the user can always cancel. Disabled locks the entire composer (e.g. while attachments upload). Error shows the retry icon. Invalid paints a danger border + ring for form-level validation.
      </Lede>

      {/* TYPING */}
      <SubHead meta="interactive">Typing</SubHead>
      <Frame label="interactive · pre-filled prompt · enter to send · shift-enter for new line" code={`<PromptInput\n  status="ready"\n  value={text}\n  onChange={setText}\n  onSubmit={send}\n/>`} height={220}>
        <TypingComposer/>
      </Frame>

      {/* STREAMING */}
      <SubHead meta="send → stop">Streaming</SubHead>
      <Frame label="status=streaming — submit becomes stop square · aria-label changes to &quot;Stop generating&quot;" code={STREAMING_CODE} height={200}>
        <StreamingComposer/>
      </Frame>
      <Lede>
        While <Mono>status="streaming"</Mono> the submit button renders a solid square with <Mono>aria-label="Stop generating"</Mono>. Clicking it calls <Mono>onStop</Mono>. This ensures users can always interrupt a long response, even if they can't type a new prompt.
      </Lede>

      {/* FULL TOOLBAR */}
      <SubHead meta="full kit">Full toolbar</SubHead>
      <Frame label="every slot wired · 2 attachments · pin toggle · model · keyboard hint" code={`<PromptInput\n  status="ready"\n  attachments={files}\n  footerTools={<button className="pi-tool is-on"><Icons.pin/></button>}\n  modelValue={model}\n  onModelChange={setModel}\n/>`} height={340}>
        <FullToolbarComposer/>
      </Frame>
      <Lede>
        Attachments live in the header so they sit above the textarea and are easy to remove before sending. The keyboard hint (⇧⏎ = new line, ⏎ = send) goes <em>under</em> the shell as helper text — never inside it, never as a tooltip.
      </Lede>

      {/* ENHANCED — banner · + actions · hint · elevated */}
      <SubHead meta="banner · actions · hint · shadow">Enhanced composer</SubHead>
      <Lede>
        Four optional slots elevate the bare composer into a marketing-aware, action-rich surface: <Mono>topBanner</Mono> (ribbon inside the shell), <Mono>actions</Mono> (replaces the paperclip with a <strong>+ context menu</strong>), <Mono>elevated</Mono> (adds <Mono>--shadow-1</Mono>), <Mono>footerHint</Mono> (supporting caption below). All four are independent — turn on only the ones you need.
      </Lede>
      <Frame label="all four slots on: banner · + actions menu · footerHint · elevated shadow" code={ENHANCE_CODE} height={300}>
        <EnhancedComposer/>
      </Frame>
      <Lede>
        The submit button uses the new <strong>soft ember</strong> tint at rest (ember-soft fill + ember glyph), ramping to solid ember on hover. That keeps the composer from screaming for attention while it still owns the accent for the "send" moment.
      </Lede>

      <SubHead meta="ribbon">Top banner</SubHead>
      <Frame label="topBanner={…} — soft ribbon at the top of the .pi shell · sides + bottom flush · top corners of the input rounded" height={200}>
        <BannerComposer/>
      </Frame>
      <Lede>
        When <Mono>topBanner</Mono> is set, the outer shell paints a softer <Mono>--bg-elevated</Mono> backdrop and the focus ring still wraps the WHOLE component (banner + input together). Inside, the input area becomes a nested <Mono>--surface</Mono> card with rounded TOP corners — its left, right, and bottom edges share the outer container, so only the top edge of the input shows the rounding. Author the banner contents with <Mono>{'<PromptBanner/>'}</Mono> for the canonical icon + label + CTA layout, or pass any ReactNode for full control.
      </Lede>

      <SubHead meta="5 tones">Banner tones</SubHead>
      <Lede>
        <Mono>PromptBanner</Mono> ships five tones, mapping to the DS status colours. Tone tints only the leading icon and the trailing CTA — the banner background stays transparent so it shares the shell surface with the input field. Override the default icon via <Mono>icon="…"</Mono> (any <Mono>Icons.*</Mono> name).
      </Lede>
      <Frame label="promo (ember default) · info · success · warn · danger" code={BANNER_GALLERY_CODE} height={520}>
        <BannerGallery/>
      </Frame>
      <Lede>
        Pick the tone that matches the message intent — <strong>promo</strong> for upgrade / new-feature nudges, <strong>info</strong> for system context (beta, region), <strong>success</strong> for confirmations (connected, saved), <strong>warn</strong> for soft guardrails (cost cap approaching, model fallback), <strong>danger</strong> for blocked / failed states. Avoid mixing tones on the same screen — pick one banner per surface.
      </Lede>

      <SubHead meta="onDismiss × ">Dismissible</SubHead>
      <Frame label="set onDismiss to show the × — caller controls the visible state" code={DISMISSIBLE_CODE} height={200}>
        <DismissibleBanner/>
      </Frame>
      <Lede>
        Adding <Mono>onDismiss</Mono> renders a × button after the CTA (or at the trailing edge if no CTA). The component does <em>not</em> hold the dismissed state itself — your app owns it (typically a React state + a <Mono>localStorage</Mono> key), so the banner can re-appear when relevant context changes. When the banner is removed, the composer collapses back to its single-rounded-card layout — no height jump on top, just the banner ribbon disappearing.
      </Lede>

      <SubHead meta="+ context menu">Actions menu</SubHead>
      <Frame label="actions={[…]} replaces the paperclip with a + button + portaled menu" height={260}>
        <ActionsComposer/>
      </Frame>
      <Lede>
        Each action takes <Mono>id</Mono>, <Mono>label</Mono>, optional <Mono>icon</Mono> (any <Mono>Icons.*</Mono> name), and optional <Mono>description</Mono> (rendered muted under the label). Add <Mono>{`{ divider: true }`}</Mono> to insert a hairline separator. Set <Mono>destructive: true</Mono> for danger-tinted rows like <em>Clear conversation</em>. The menu is portaled to <Mono>{`<body>`}</Mono> so it escapes any container clipping (same pattern as <Mono>ModelSelector</Mono>).
      </Lede>

      {/* ATTACHMENTS */}
      <SubHead meta="drop · preview · upload">Attachments</SubHead>
      <Frame label="full-shell drop overlay — drag a file over the composer to trigger the veil" height={280}>
        <DragDropOverlay
          initialFiles={[{ id: 'f1', name: 'incident-0421.log', size: '8.4 KB', kind: 'file' }]}
        />
      </Frame>
      <Lede>
        While a file hovers, the entire composer paints an ember-tinted veil with a 2px dashed border. The veil is <Mono>pointer-events: none</Mono> so the underlying drop target keeps receiving events. On drop the file appears as a chip in the header — no separate "uploaded" toast.
      </Lede>

      <Frame label="4 attachments · 2 images render their 40×40 preview · 2 files show the file icon · × removes" code={ATTACH_CODE} height={260}>
        <MultiAttachDemo/>
      </Frame>
      <Lede>
        Image attachments get a 40×40 thumbnail; non-image files get <Mono>Icons.file</Mono> on a neutral tile. Both share the same chip shape, name + size meta, and close button — only the leading slot differs. The row wraps freely in the header so it never clips.
      </Lede>

      <Frame label="upload in progress · textarea locked · per-attachment progress bar · live pct label" height={260}>
        <UploadingDemo/>
      </Frame>
      <Lede>
        While any attachment is uploading the textarea, attach tool, and submit button are all locked — there is nothing meaningful the user can do. Each chip shows a slim 2px ember progress bar so the user can see which file is the slow one.
      </Lede>

      {/* DRAG AND DROP */}
      <SubHead meta="drag · drop · paste">Drag-and-drop</SubHead>
      <Frame label="drag a file over the composer — the footer swaps for a drop hint (no overlay variant)" height={240}>
        <DropZoneDemo/>
      </Frame>
      <Lede>
        The inline drop hint replaces the footer while a file is hovering — a lighter variant than the full-shell overlay, for surfaces where a veil would be visually disruptive.
      </Lede>

      {/* MODEL SELECTOR */}
      <SubHead meta="model picker">Model selector</SubHead>
      <Frame label="click the model badge — popover anchors above the trigger, never clips the page edge" height={300}>
        <div className="pi" style={{ maxWidth: 480 }}>
          <div className="pi-body">
            <textarea className="pi-textarea" placeholder="Try a different model…" rows={1} readOnly/>
          </div>
          <div className="pi-foot">
            <button className="pi-tool"><Icons.paperclip size={15}/></button>
            <ModelSelector value="forge-opus-4-7" onChange={() => {}}/>
            <span className="spacer"/>
            <PromptSubmit status="ready" hasText={true} onClick={() => {}}/>
          </div>
        </div>
      </Frame>
      <Lede>
        Each model entry shows a 2-letter mono badge (S/O/H), the readable name, and the pricing right-aligned. The popover anchors above the trigger so it never escapes the page when the composer is near the bottom.
      </Lede>

      {/* SUBMIT STATES */}
      <SubHead meta="4 states">Submit status</SubHead>
      <Frame label="ready · submitted · streaming · error — four states, one button" code={STATUS_CODE} height={360}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', alignItems: 'center' }}>
          {(['ready', 'submitted', 'streaming', 'error'] as const).map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', maxWidth: 420 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-faint)', width: 80, textAlign: 'right', flexShrink: 0 }}>{s}</span>
              <div className="pi" style={{ flex: 1 }}>
                <div className="pi-body">
                  <textarea className="pi-textarea" rows={1} defaultValue={
                    s === 'submitted' ? 'Sending…' :
                    s === 'streaming' ? 'Generating…' :
                    s === 'error'     ? 'Last request failed' :
                                       'What changed in the last deploy?'
                  } readOnly/>
                </div>
                <div className="pi-foot">
                  <button className="pi-tool"><Icons.paperclip size={15}/></button>
                  <span className="spacer"/>
                  <PromptSubmit status={s} hasText={true} onClick={() => {}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame>

      {/* ERROR / INVALID */}
      <SubHead meta="error · invalid">Error &amp; invalid</SubHead>
      <Frame label="error=retry icon · invalid=danger border+ring (validation failure)" code={ERROR_CODE} height={240}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', maxWidth: 420 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', width: 80, textAlign: 'right', flexShrink: 0 }}>error</span>
            <PromptInput status="error" placeholder="Last request failed — retry?" rows={1}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', maxWidth: 420 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', width: 80, textAlign: 'right', flexShrink: 0 }}>invalid</span>
            <PromptInput status="ready" invalid placeholder="Message is required before sending" rows={1}/>
          </div>
        </div>
      </Frame>
      <Lede>
        <Mono>status="error"</Mono> swaps the submit icon to the alert/retry glyph with a danger fill — the user can tap it to retry the last request. <Mono>invalid</Mono> paints the danger border + ring for form-level validation (e.g. the textarea is required). Both are visually distinct from each other.
      </Lede>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Enter submits; Shift+Enter inserts a newline — document these in the helper row below the shell, never hidden. Tab moves from the textarea into footer tools (attach → pin → model → submit). The model picker opens on Enter/Space and arrow-down, moves with arrows, closes on Esc. Each attachment chip's × removes it with Enter/Space; Backspace in an empty textarea removes the last attachment.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The textarea has <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> from <code style={{ fontFamily: 'var(--font-mono)' }}>placeholder</code> (or supply your own). The submit button's <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> tracks state — "Send" / "Stop generating" / "Retry" — so its role is spoken, never inferred from an icon. The model picker is <code style={{ fontFamily: 'var(--font-mono)' }}>aria-haspopup="menu"</code> + <code style={{ fontFamily: 'var(--font-mono)' }}>aria-expanded</code>. Upload progress is an <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> region; each chip's remove button is labelled "Remove {'{name}'}" and the drag-drop overlay hint is real text.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Focus-within paints an ember border + ring on the whole shell so the active composer is unambiguous. The invalid state uses a danger border with a matching ring, so validity is never colour-only. The ember submit carries dark <code style={{ fontFamily: 'var(--font-mono)' }}>--ember-fg</code> ink. The streaming stop flips to <code style={{ fontFamily: 'var(--font-mono)' }}>--fg</code> on a contrasting fill. Disabled tools drop to 40% opacity but the layout keeps an AA placeholder. All tools show a 2px ember focus ring.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code>: the submit spinner becomes a static "sending" label, textarea auto-grow snaps instead of animating, the drag overlay appears without a fade, and the hover lift on submit is removed.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — toolbar mirrors, submit moves to the leading edge, attach trails" height={200}>
        <div dir="rtl" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <PromptInput
            status="ready"
            placeholder="اسأل أي شيء…"
            modelValue="forge-sonnet-4-6"
            onModelChange={() => {}}
            rows={2}
          />
        </div>
      </Frame>
      <Lede>
        The entire composer uses logical CSS properties. The attach icon (leading) and submit (trailing) swap sides; the model picker reads from the start edge; textarea text flows right-to-left. No per-page override needed.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 520 }} aria-hidden="true">
              <div className="pi">
                <div className="pi-head">
                  <div className="pi-att">
                    <span className="thumb"><Icons.file size={13}/></span>
                    <span className="name">trace.json</span>
                    <button className="close"><Icons.x size={11}/></button>
                  </div>
                </div>
                <div className="pi-body">
                  <textarea className="pi-textarea" rows={1} defaultValue="What changed in the last deploy?" readOnly/>
                </div>
                <div className="pi-foot">
                  <button className="pi-tool"><Icons.paperclip size={15}/></button>
                  <button className="pi-model">
                    <ModelBadge short="S"/><span className="name">Sonnet 4.6</span>
                    <Icons.chevronDown size={11}/>
                  </button>
                  <span className="spacer"/>
                  <PromptSubmit status="ready" hasText={true} onClick={() => {}}/>
                </div>
              </div>
              {/* anatomy leads */}
              <span className="lead h" style={{ top: 18, left: -34, width: 30 }}/>
              <span className="lead h" style={{ top: 62, left: -34, width: 30 }}/>
              <span className="lead h" style={{ top: 110, left: -34, width: 30 }}/>
              <span className="lead h" style={{ top: 110, right: -34, width: 30 }}/>
              <div className="pin" style={{ top: 10, left: -58 }}>1</div>
              <div className="pin" style={{ top: 54, left: -58 }}>2</div>
              <div className="pin" style={{ top: 102, left: -58 }}>3</div>
              <div className="pin" style={{ top: 102, right: -58 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Attachment header.</b> Optional. Renders the attachment chips — same shape as Tag Input + File Input. Wraps freely so the row never overflows the shell.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Body (textarea).</b> Auto-resizing. <Mono>min-height: 24px</Mono>, <Mono>max-height: 220px</Mono> — past the cap it scrolls inside the shell, never pushing the page.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Toolbar start.</b> Tools cluster: attach, pin, slash commands, model selector. All use <Mono>.pi-tool</Mono> — a slim ghost button. The model selector is the only bordered element in the toolbar.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Submit.</b> The only ember-filled affordance in the composer. Status-driven: ready (send arrow) · submitted (spinner) · streaming (stop square, still tappable) · error (retry icon).</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — swap send → stop while streaming</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="pi" style={{ maxWidth: 320 }}>
              <div className="pi-body"><textarea className="pi-textarea" rows={1} defaultValue="Generating…" readOnly disabled/></div>
              <div className="pi-foot">
                <button className="pi-tool"><Icons.paperclip size={15}/></button>
                <span className="spacer"/>
                <PromptSubmit status="streaming" hasText={true} onClick={() => {}}/>
              </div>
            </div>
          </div>
          <div className="note">The stop square gives users a reliable escape hatch. A long response is never a trap.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — disable the whole composer while streaming</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="pi" style={{ maxWidth: 320 }}>
              <div className="pi-body"><textarea className="pi-textarea" rows={1} placeholder="…disabled…" disabled/></div>
              <div className="pi-foot">
                <button className="pi-tool" disabled><Icons.paperclip size={15}/></button>
                <span className="spacer"/>
                <button className="pi-submit" disabled><Icons.arrowUp size={14}/></button>
              </div>
            </div>
          </div>
          <div className="note">Disabling everything removes the stop affordance. The streaming stop must always remain reachable.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep one ember CTA</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="pi" style={{ maxWidth: 320 }}>
              <div className="pi-body"><textarea className="pi-textarea" rows={1} defaultValue="Where are the runbooks?" readOnly/></div>
              <div className="pi-foot">
                <button className="pi-tool"><Icons.paperclip size={15}/></button>
                <span className="spacer"/>
                <PromptSubmit status="ready" hasText={true} onClick={() => {}}/>
              </div>
            </div>
          </div>
          <div className="note">Submit is the only ember-filled button. All other tools are ghost so the eye always knows where to land.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — make every tool an ember pill</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="pi" style={{ maxWidth: 320 }}>
              <div className="pi-body"><textarea className="pi-textarea" rows={1} defaultValue="…" readOnly/></div>
              <div className="pi-foot">
                <button className="btn xs ember"><Icons.paperclip size={13}/></button>
                <button className="btn xs ember"><Icons.command size={13}/></button>
                <button className="btn xs ember"><Icons.pin size={13}/></button>
                <span className="spacer"/>
                <button className="btn xs ember">Send</button>
              </div>
            </div>
          </div>
          <div className="note">Three ember buttons means no clear primary action. Submit must be the only ember affordance.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="PromptInputProps">API reference</SubHead>
      <PropsTable
        label="<PromptInput />"
        rows={[
          { prop: 'status', type: '"ready" | "submitted" | "streaming" | "error"', default: '"ready"', description: 'Drives the submit button icon + fill and the textarea disabled state.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Locks the entire composer — textarea, tools, and submit all disabled. Use while attachments are uploading.' },
          { prop: 'invalid', type: 'boolean', default: 'false', description: 'Danger border + ring for validation failure. Does not disable the composer.' },
          { prop: 'value', type: 'string', default: undefined, description: 'Controlled textarea value.' },
          { prop: 'onChange', type: '(value: string) => void', default: undefined, description: 'Called on every keystroke (controlled usage).' },
          { prop: 'onSubmit', type: '(value: string) => void', default: undefined, description: 'Fired on Enter (without Shift) or submit button click when status="ready".' },
          { prop: 'onStop', type: '() => void', default: undefined, description: 'Fired on the stop button click when status="streaming".' },
          { prop: 'modelValue', type: 'string', default: undefined, description: 'Current model id. Omit to hide the model selector.' },
          { prop: 'onModelChange', type: '(id: string) => void', default: undefined, description: 'Called when the user picks a different model.' },
          { prop: 'attachments', type: '(AttachmentFile & { id: string })[]', default: '[]', description: 'Files rendered as chips in the attachment header.' },
          { prop: 'onRemoveAttachment', type: '(id: string) => void', default: undefined, description: 'Called when a chip × is clicked.' },
          { prop: 'footerTools', type: 'ReactNode', default: undefined, description: 'Extra content rendered in the footer after the attach button and before the spacer.' },
          { prop: 'contextSlot', type: 'ReactNode', default: undefined, description: 'Stable slot for the context indicator (e.g. <ContextGauge/>), rendered right before the model selector and submit button.' },
          { prop: 'topBanner', type: 'ReactNode', default: undefined, description: 'Ribbon ABOVE the textarea, INSIDE the bordered shell. Use for upgrade prompts, region notices, beta tags.' },
          { prop: 'actions', type: 'PromptInputAction[]', default: undefined, description: 'When set, replaces the default paperclip with a "+" button that opens a context menu of these items. Each item: { id, label, icon?, description?, divider?, destructive?, onSelect? }.' },
          { prop: 'onActionSelect', type: '(id: string) => void', default: undefined, description: 'Called when an actions menu item is clicked. Receives the item id; item-level onSelect also fires.' },
          { prop: 'footerHint', type: 'ReactNode', default: undefined, description: 'Supporting text BELOW the bordered shell — small, muted, centred. Use for legal nags ("AI can make mistakes…").' },
          { prop: 'elevated', type: 'boolean', default: 'false', description: 'Adds a subtle DS shadow (--shadow-1) below the field for a soft lift.' },
          { prop: 'placeholder', type: 'string', default: '"Ask anything…"', description: 'Textarea placeholder — also used as aria-label.' },
          { prop: 'rows', type: 'number', default: '1', description: 'Initial textarea rows. The component auto-grows up to max-height: 220px.' },
        ]}
      />
      <AutoPropsTable component="PromptBanner" label="<PromptBanner />"/>
      <PropsTable
        label="PromptInputAction (actions item)"
        rows={[
          { prop: 'id', type: 'string', required: true, description: 'Stable identifier passed to onActionSelect.' },
          { prop: 'label', type: 'string', required: true, description: 'Visible row label.' },
          { prop: 'description', type: 'string', default: undefined, description: 'Optional second line below the label (muted).' },
          { prop: 'icon', type: 'string', default: undefined, description: 'Icon name from the @/ds/core Icons map (e.g. "upload", "sparkle").' },
          { prop: 'divider', type: 'boolean', default: 'false', description: 'Renders a hairline separator instead of a clickable row.' },
          { prop: 'destructive', type: 'boolean', default: 'false', description: 'Tints the row danger — for "Clear", "Delete", etc.' },
          { prop: 'onSelect', type: '() => void', default: undefined, description: 'Item-level click handler. The component-level onActionSelect also fires.' },
        ]}
      />
      <AutoPropsTable component="PromptSubmit" label="<PromptSubmit />"/>
      <AutoPropsTable component="ModelSelector" label="<ModelSelector />"/>
    </Section>
  );
}
