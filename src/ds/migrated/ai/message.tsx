'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, Message, MessageActions, AILabel, installTabs, Lede, Mono } from '@/ds/core';


  // Action toolbar under assistant messages is now the canonical DS-core
  // <MessageActions/> (replaces the local AssistantActions clone).

  // ─── code snippets shown in the page ────────────────────────────────────
  const USAGE_CODE = `<Message from="user">
  Where do I find the Tier-1 incident runbooks?
</Message>

<Message from="assistant">
  In <code>docs/runbooks/tier-1/</code> — each service has its own
  Markdown file with the on-call rotation, dashboards, and rollback
  steps for the last three releases.
</Message>`;

  const VARIANTS_CODE = `<Message from="user">…</Message>
<Message from="assistant">…</Message>
<Message from="system">Session opened · forge-ai/sonnet-4-6</Message>`;

  const MARKDOWN_CODE = `<Message from="assistant" meta={<>
  <span className="name">Forge AI</span>
  <span className="dot"/> <span>just now</span>
</>}>
  Three things to check first:

  - <code>config/grpc.toml</code> for the retry budget
  - <code>traces.id=$incident</code> in Datadog
  - the deploy diff for the last commit

  If those look clean, run <code>forge incident replay --id 0421</code>.
</Message>`;

  const ATTACHMENTS_CODE = `<Message
  from="user"
  attachments={[
    { name: 'crash-2024-11-14.log', size: '4.2 KB', kind: 'file' },
    { name: 'flamegraph.png',       size: '186 KB', kind: 'image' },
  ]}>
  Stuck on this — anything jump out?
</Message>`;

  const ERROR_CODE = `<Message
  from="assistant"
  error="Model timed out after 8s. Click regenerate to try again.">
  I was checking your incident traces when…
</Message>`;

  const STREAMING_CODE = `<Message from="assistant" streaming>
  Looking at the last three deploy diffs
</Message>`;

  const AI_LABEL_CODE = `<Message from="assistant" meta={<>
  <span className="name">Forge AI</span>
  <AILabel variant="pill" size="sm">AI</AILabel>
  <span className="dot"/> <span>2 min ago</span>
</>}>
  …
</Message>`;

  // ─── live demo helpers ──────────────────────────────────────────────────
  const Sample = ({ children }) => (
    <div className="msg-thread" style={{ width: '100%' }}>{children}</div>
  );

  const InteractiveAssistant = () => {
    const [vote, setVote] = React.useState(null);
    return (
      <Message
        from="assistant"
        meta={<>
          <span className="name">Forge AI</span>
          <span className="dot"/>
          <span>just now</span>
        </>}
        actions={
          <MessageActions
            onCopy={() => {}}
            onRegen={() => {}}
            vote={vote}
            onVote={setVote}
          />
        }
      >
        Three things to check first:
        <ul>
          <li><code>config/grpc.toml</code> for the retry budget</li>
          <li><code>traces.id=$incident</code> in Datadog</li>
          <li>the deploy diff for the last commit</li>
        </ul>
        <p style={{ marginTop: 8 }}>
          If those look clean, run <code>forge incident replay --id 0421</code>.
        </p>
      </Message>
    );
  };

  // The "Marked as AI" demo composes the real <AILabel variant="pill" size="sm"/>
  // straight from @forge/ui — no local clone, so the page always tracks the
  // shipped badge contract (and stays on the type scale).

  // ─── page ────────────────────────────────────────────────────────────────
export default function MessagePage() {
  return (
    <Section
      id="ai-message"
      num="01"
      title="Message"
      desc="One turn in a chat thread — role alone drives alignment, fill, and avatar across user, assistant, and system. Reach for Message when the model answers conversationally; use Response for multi-block documents."
    >
      {/* Phase 1 DEF-01: .msg-* styles live in ds.css and are shared by every
          surface that composes Message. No local <style> block on this page. */}

      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-message')} ariaLabel="package manager"/>
      <Lede up>
        Ships the <Mono>Message</Mono> shell plus an opinionated
        action toolbar. Markdown rendering, attachments, and the streaming
        caret are all built-in — no extra peer deps beyond the Forge baseline.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="user prompt + assistant reply" code={USAGE_CODE} height={220}>
        <Sample>
          <Message from="user">
            Where do I find the Tier-1 incident runbooks?
          </Message>
          <Message from="assistant" meta={<><span className="name">Forge AI</span><span className="dot"/><span>just now</span></>}>
            In <code>docs/runbooks/tier-1/</code> — each service has its own Markdown file with the on-call rotation, dashboards, and rollback steps for the last three releases.
          </Message>
        </Sample>
      </Frame>

      {/* 3. EXAMPLES SECTION HEAD */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* VARIANTS */}
      <SubHead meta="3 roles">Roles</SubHead>
      <Frame label="user · assistant · system" code={VARIANTS_CODE} height={260}>
        <Sample>
          <Message from="user">Where are the runbooks?</Message>
          <Message from="assistant" meta={<><span className="name">Forge AI</span></>}>
            In <code>docs/runbooks/tier-1/</code>.
          </Message>
          <Message from="system">Session opened · forge-ai/sonnet-4-6</Message>
        </Sample>
      </Frame>
      <Lede>
        <b>User</b> gets the ember-soft fill on the trailing edge — the speaker is "us". <b>Assistant</b> reads as flat prose on the leading edge — no bubble surface, so the model answer is the page-level content, not a competing chip. <b>System</b> is a dashed, full-width caption: it's a marker, not a turn.
      </Lede>

      {/* VARIANTS — bubble / compact / plain */}
      <SubHead meta="bubble · compact · plain">Variants</SubHead>
      <Frame label="three densities of the same turn" code={`<Message from="assistant" variant="bubble">…</Message>
<Message from="assistant" variant="compact">…</Message>
<Message from="assistant" variant="plain">…</Message>`} height={360}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', color: 'var(--fg-subtle)', textTransform: 'uppercase', marginBottom: 8 }}>bubble — default chat turn</div>
            <Sample>
              <Message from="assistant" meta={<><span className="name">Forge AI</span></>}>
                Retry budget on <code>grpc.toml</code> went from 3 to 8.
              </Message>
            </Sample>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', color: 'var(--fg-subtle)', textTransform: 'uppercase', marginBottom: 8 }}>compact — sidebars, dense threads</div>
            <Sample>
              <Message from="assistant" variant="compact" meta={<><span className="name">Forge AI</span></>}>
                Retry budget on <code>grpc.toml</code> went from 3 to 8.
              </Message>
            </Sample>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', color: 'var(--fg-subtle)', textTransform: 'uppercase', marginBottom: 8 }}>plain — no bubble (use sparingly)</div>
            <Sample>
              <Message from="assistant" variant="plain" meta={<><span className="name">Forge AI</span></>}>
                Retry budget on <code>grpc.toml</code> went from 3 to 8.
              </Message>
            </Sample>
          </div>
        </div>
      </Frame>
      <Lede>
        For long-form model output — headings, tables, diagrams, multi-block markdown — reach for <a href="/ai/response" style={{ color: 'var(--ember)' }}>Response</a> instead. <Mono>Message</Mono> is for short turns where the bubble carries the boundary between speakers.
      </Lede>

      {/* MARKDOWN BODY */}
      <SubHead meta="lists · code · links">Rich body</SubHead>
      <Frame label="assistant reply with inline code, list, and a follow-up" code={MARKDOWN_CODE} height={260}>
        <Sample>
          <Message from="assistant" meta={<><span className="name">Forge AI</span><span className="dot"/><span>just now</span></>}>
            Three things to check first:
            <ul>
              <li><code>config/grpc.toml</code> for the retry budget</li>
              <li><code>traces.id=$incident</code> in Datadog</li>
              <li>the deploy diff for the last commit</li>
            </ul>
            <p style={{ marginTop: 8 }}>
              If those look clean, run <code>forge incident replay --id 0421</code>.
            </p>
          </Message>
        </Sample>
      </Frame>
      <Lede>
        Inline <Mono>code</Mono> uses the ember accent on an elevated chip so it stays readable inside the ember-soft user bubble. Block code (<Mono>&lt;pre&gt;</Mono>) drops to the page background with a hairline border — same look the catalog uses for snippets.
      </Lede>

      {/* ACTIONS TOOLBAR */}
      <SubHead meta="copy · regenerate · 👍 / 👎">Actions toolbar</SubHead>
      <Frame label="hover the assistant message to reveal the toolbar" height={220}>
        <Sample>
          <Message from="user">Three things to check?</Message>
          <InteractiveAssistant/>
        </Sample>
      </Frame>
      <Lede>
        Actions stay at 60% opacity until the row is hovered or focused — they exist for the user who wants them, they don't shout at everyone else. Vote state is sticky so the user can change their mind.
      </Lede>

      {/* ATTACHMENTS */}
      <SubHead meta="files + images">Attachments</SubHead>
      <Frame label="user message with two attachments" code={ATTACHMENTS_CODE} height={200}>
        <Sample>
          <Message
            from="user"
            attachments={[
              { name: 'crash-2024-11-14.log', size: '4.2 KB', kind: 'file' },
              { name: 'flamegraph.png',       size: '186 KB', kind: 'image' },
            ]}
          >
            Stuck on this — anything jump out?
          </Message>
        </Sample>
      </Frame>

      {/* AI LABEL COMPOSITION */}
      <SubHead meta="composition · with AI Label">Marked as AI</SubHead>
      <Frame label="pair Message with the AI Label component so the AI source stays visible" code={AI_LABEL_CODE} height={200}>
        <Sample>
          <Message from="assistant" meta={
            <>
              <span className="name">Forge AI</span>
              <AILabel variant="pill" size="sm">AI</AILabel>
              <span className="dot"/>
              <span>2 min ago</span>
            </>
          }>
            The retry budget on <code>grpc.toml</code> was bumped from 3 to 8 in the last deploy. That's enough to mask a downstream timeout — worth reverting first.
          </Message>
        </Sample>
      </Frame>
      <Lede>
        Slot the existing <a href="/ai/label" style={{ color: 'var(--ember)' }}>AI Label</a> into the message <Mono>meta</Mono> row when the model answer is being surfaced into a non-chat context (a doc, a side-sheet, a notification) — so the AI source travels with the answer.
      </Lede>

      {/* STREAMING / LOADING */}
      <SubHead meta="streaming">Streaming</SubHead>
      <Frame label="caret blinks while the model is still emitting tokens" code={STREAMING_CODE} height={140}>
        <Sample>
          <Message from="assistant" streaming meta={<><span className="name">Forge AI</span></>}>
            Looking at the last three deploy diffs
          </Message>
        </Sample>
      </Frame>

      {/* ERROR */}
      <SubHead meta="error">Error</SubHead>
      <Frame label="model failure — body fades, error row + retry below" code={ERROR_CODE} height={180}>
        <Sample>
          <Message
            from="assistant"
            error="Model timed out after 8s. Click regenerate to try again."
            meta={<><span className="name">Forge AI</span></>}
          >
            I was checking your incident traces when…
          </Message>
        </Sample>
      </Frame>

      {/* A11Y */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The bubble holds no focus by itself — Tab stops are the things inside it: links in the body, attachment chips, and the action toolbar (Copy / Regenerate / 👍 / 👎), each a real button fired with Enter/Space. The toolbar must be keyboard-reachable even though it only paints at full opacity on hover; vote buttons toggle and reflect their pressed state to Space.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each turn carries the role in its accessible name (the avatar derives an <code style={{fontFamily:'var(--font-mono)'}}>alt</code> from <code style={{fontFamily:'var(--font-mono)'}}>from</code>, e.g. "Forge AI said"), so user / assistant / system is spoken, not just shown by alignment. A streaming assistant turn sits in an <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> region and is marked <code style={{fontFamily:'var(--font-mono)'}}>aria-busy="true"</code> until tokens stop; the error string is announced via <code style={{fontFamily:'var(--font-mono)'}}>role="alert"</code>, and vote buttons expose <code style={{fontFamily:'var(--font-mono)'}}>aria-pressed</code>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Body text on the <code style={{fontFamily:'var(--font-mono)'}}>--ember-soft</code> user bubble and the flat assistant prose on the page background both clear AA, and inline code keeps its ember chip readable inside the tinted user bubble. The error state surfaces a <code style={{fontFamily:'var(--font-mono)'}}>--danger-soft</code> row with danger-tone text at AA; the ember bot avatar carries dark ink, never ember-on-ember. Toolbar buttons show a visible focus ring.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the streaming caret stops blinking (steady ember bar, or the full text at once), and the toolbar opacity transition is removed so it appears immediately on focus instead of fading.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — user bubble flips to the trailing edge, assistant to the leading edge" height={220}>
        <div dir="rtl" style={{ width: '100%' }}>
          <Sample>
            <Message from="user">أين أجد كتيبات الحوادث؟</Message>
            <Message from="assistant" meta={<><span className="name">Forge AI</span></>}>
              في <code>docs/runbooks/tier-1/</code> — لكل خدمة ملف Markdown خاص بها.
            </Message>
          </Sample>
        </div>
      </Frame>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 380 }} aria-hidden="true">
              <Message from="assistant" meta={<><span className="name">Forge AI</span><span className="dot"/><span>just now</span></>}
                       actions={
                         <>
                           <button className="msg-action"><Icons.copy size={13}/></button>
                           <button className="msg-action"><Icons.refresh size={13}/></button>
                           <button className="msg-action"><Icons.check size={13}/></button>
                         </>
                       }>
                Three things to check first — start with the retry budget.
              </Message>
              <span className="lead h" style={{ top: 12, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 42, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 96, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 138, right: -32, width: 28 }}/>
              <div className="pin" style={{ top: 6, left: -54 }}>1</div>
              <div className="pin" style={{ top: 36, left: -54 }}>2</div>
              <div className="pin" style={{ top: 90, left: -54 }}>3</div>
              <div className="pin" style={{ top: 132, right: -54 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Avatar.</b> Composes the global <Mono>Avatar</Mono> atom. The assistant gets <Mono>ember</Mono>; the user gets the neutral disc. Hide it with <Mono>avatar=&#123;false&#125;</Mono> in dense threads.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Meta row.</b> Speaker name + timestamp in mono caption. Slot an <Mono>&lt;AILabel/&gt;</Mono> here when the message is being surfaced outside the chat surface.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Bubble.</b> Only the <b style={{ color: 'var(--fg)' }}>user</b> side fills — <Mono>--ember-soft</Mono> at a 12px radius, with the corner closest to the avatar collapsed to 4px to point back at the speaker. The <b style={{ color: 'var(--fg)' }}>assistant</b> reply is transparent flat prose (no fill, no border) so the answer reads as the page content.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Actions toolbar.</b> Composes <Mono>.btn.ghost</Mono> at <Mono>26px</Mono>. Lives outside the bubble, fades in on hover so a passive read stays uncluttered.</span>
          </div>
        </div>
      </div>

      {/* DO/DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — let the role drive everything</div>
          <div className="body" style={{ padding: 14 }}>
            <Sample>
              <Message from="user">Where?</Message>
              <Message from="assistant" meta={<><span className="name">Forge AI</span></>}>In <code>docs/runbooks/tier-1/</code>.</Message>
            </Sample>
          </div>
          <div className="note">Role decides fill, alignment, and avatar in one go — the caller picks <Mono>from</Mono>, the system handles the rest.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — re-skin every message with custom hex</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="msg-thread">
              <div className="msg user">
                <div className="msg-stack">
                  <div className="msg-bubble" style={{ background: '#5b21b6', borderColor: '#7c3aed', color: 'white' }}>Where?</div>
                </div>
              </div>
              <div className="msg assistant">
                <div className="msg-stack">
                  <div className="msg-bubble" style={{ background: '#064e3b', borderColor: '#10b981', color: '#a7f3d0' }}>In docs/runbooks/tier-1/</div>
                </div>
              </div>
            </div>
          </div>
          <div className="note">Off-token colours break the rest of the surface. Stick to <Mono>--ember-soft</Mono> / <Mono>--surface</Mono>.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — stack messages with breathing room</div>
          <div className="body" style={{ padding: 14 }}>
            <Sample>
              <Message from="system">Session opened</Message>
              <Message from="user">Stuck on this — log attached.</Message>
              <Message from="assistant" meta={<><span className="name">Forge AI</span></>}>Looking — give me a moment.</Message>
            </Sample>
          </div>
          <div className="note">18px gap between rows is enough to read the thread without a separator on every turn.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — separate every row with a divider</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%' }}>
              <Message from="user">Stuck on this.</Message>
              <div style={{ height: 1, background: 'var(--border-strong)', margin: '10px 0' }}/>
              <Message from="assistant" meta={<><span className="name">Forge AI</span></>}>Looking.</Message>
              <div style={{ height: 1, background: 'var(--border-strong)', margin: '10px 0' }}/>
              <Message from="user">Anything?</Message>
            </div>
          </div>
          <div className="note">The bubble already carries the boundary — a divider just adds visual noise.</div>
        </div>
      </div>

      {/* PROPS */}
      <SubHead meta="MessageProps">API reference</SubHead>
      <AutoPropsTable component="Message" label="<Message />"/>
    </Section>
  );
}
