'use client';
// Eidos AI — Terminal (doc page 21).
// Documents the Terminal component: a focused mono command surface for
// showing what the agent ran and what came back. Line kinds: in / out /
// err / note. Status: idle / running / done / error.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, AutoPropsTable, PropsTable, installTabs, Terminal, Message, Lede, Mono } from '@/ds/core';
import type { TerminalLine } from '@/ds/core';

// ── inline style consts ──────────────────────────────────────────────────────

// ── demo line banks ──────────────────────────────────────────────────────────
const DEPLOY_LINES: TerminalLine[] = [
  { kind: 'in',   text: 'eidos deploy --service identity-svc --ring canary' },
  { kind: 'out',  text: 'Building image…' },
  { kind: 'out',  text: 'Pushed sha:abc123f → registry.eidos.internal/identity-svc:canary' },
  { kind: 'out',  text: 'Promoting canary ring (5% traffic)…' },
  { kind: 'out',  text: '→ Healthy at 02:14:32 UTC  p95=48ms  errors=0' },
  { kind: 'note', text: 'Done. Promote to 25% with --promote or roll back with --rollback.' },
];

const ERROR_LINES: TerminalLine[] = [
  { kind: 'in',  text: 'eidos deploy --service billing-svc --ring canary' },
  { kind: 'out', text: 'Building image…' },
  { kind: 'out', text: 'Pushed sha:def456a → registry.eidos.internal/billing-svc:canary' },
  { kind: 'out', text: 'Promoting canary ring…' },
  { kind: 'err', text: 'Health check failed: GET /healthz → 503 after 10 s' },
  { kind: 'err', text: 'Rollback initiated — restoring previous replica set' },
  { kind: 'out', text: 'Rolled back to billing-svc@sha:prev789 in 4 s' },
  { kind: 'note', text: 'Canary aborted. Check logs with: eidos logs billing-svc --ring canary' },
];

const CTX_LINES: TerminalLine[] = [
  { kind: 'in',  text: 'eidos health identity-svc' },
  { kind: 'out', text: 'status: healthy' },
  { kind: 'out', text: 'p95: 48 ms  p99: 61 ms' },
  { kind: 'out', text: 'error budget: 94%' },
];

export default function AiTerminalPage() {
  return (
    <Section
      id="terminal"
      num="21"
      title="Terminal"
      desc="A focused mono command surface that pairs what the agent ran with what came back. Not a terminal emulator — use it when lines are coupled command + output, and use the core LogViewer for raw unbounded log streams."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-terminal')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>Terminal</Mono> with the <Mono>TerminalLine</Mono> type. No external dependencies — styles live in <Mono>ai.css</Mono> under the <Mono>.ai-term*</Mono> block. The prompt prefix, title, and status pill are all optional.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="A 6-line deploy session: in → out → out → out → out → note"
        height={240}
        code={`import { Terminal } from "@/ds/core"
import type { TerminalLine } from "@/ds/core"

const lines: TerminalLine[] = [
  { kind: 'in',   text: 'eidos deploy --service identity-svc --ring canary' },
  { kind: 'out',  text: 'Building image…' },
  { kind: 'out',  text: 'Pushed sha:abc123f → registry.eidos.internal/identity-svc:canary' },
  { kind: 'out',  text: 'Promoting canary ring (5% traffic)…' },
  { kind: 'out',  text: '→ Healthy at 02:14:32 UTC  p95=48ms  errors=0' },
  { kind: 'note', text: 'Done. Promote to 25% with --promote or roll back with --rollback.' },
]

<Terminal
  title="session · identity-svc"
  status="done"
  lines={lines}
/>`}
      >
        <div style={{ width: '100%', maxWidth: 600 }}>
          <Terminal
            title="session · identity-svc"
            status="done"
            lines={DEPLOY_LINES}
          />
        </div>
      </Frame>
      <Lede>
        The title and status pill are optional but strongly recommended — they give the session a label and announce its lifecycle at a glance. The <Mono>note</Mono> kind renders as a muted editorial annotation below the output block.
      </Lede>

      {/* 3. VARIANTS — labeled-rule divider (canonical .ds-examples-rule) */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Variants</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      <SubHead meta="idle · running · done · error">Statuses</SubHead>
      <Frame
        label="Four terminals side by side — idle / running / done / error"
        height={200}
        code={`<Terminal status="idle"    title="session · idle"    lines={[{ kind:'out', text:'Waiting for command…' }]}/>
<Terminal status="running" title="session · running" lines={[{ kind:'in', text:'eidos deploy …' }, { kind:'out', text:'Building…' }]}/>
<Terminal status="done"    title="session · done"    lines={[{ kind:'in', text:'eidos deploy …' }, { kind:'out', text:'Healthy at 02:14 UTC' }]}/>
<Terminal status="error"   title="session · error"   lines={[{ kind:'in', text:'eidos deploy …' }, { kind:'err', text:'Health check failed' }]}/>`}
      >
        <div style={{ display: 'flex', gap: 12, width: '100%', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 220px', minWidth: 180 }}>
            <Terminal
              status="idle"
              title="idle"
              lines={[{ kind: 'out', text: 'Waiting for command…' }]}
            />
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 180 }}>
            <Terminal
              status="running"
              title="running"
              lines={[
                { kind: 'in',  text: 'eidos deploy --ring canary' },
                { kind: 'out', text: 'Building image…' },
              ]}
            />
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 180 }}>
            <Terminal
              status="done"
              title="done"
              lines={[
                { kind: 'in',  text: 'eidos deploy --ring canary' },
                { kind: 'out', text: 'Healthy at 02:14 UTC' },
              ]}
            />
          </div>
          <div style={{ flex: '1 1 220px', minWidth: 180 }}>
            <Terminal
              status="error"
              title="error"
              lines={[
                { kind: 'in',  text: 'eidos deploy --ring canary' },
                { kind: 'err', text: 'Health check failed' },
              ]}
            />
          </div>
        </div>
      </Frame>
      <Lede>
        The status pill is rendered inside the title bar, opposite the ember terminal glyph and the session title. <Mono>running</Mono> activates <Mono>aria-live="polite"</Mono> on the component so a screen reader announces incoming lines. <Mono>error</Mono> renders the pill in danger tone.
      </Lede>

      <SubHead meta="mixed lines">Error block</SubHead>
      <Frame
        label="A deploy that fails on health check — mixes in / out / err / note"
        height={280}
        code={`const lines: TerminalLine[] = [
  { kind: 'in',   text: 'eidos deploy --service billing-svc --ring canary' },
  { kind: 'out',  text: 'Building image…' },
  { kind: 'out',  text: 'Pushed sha:def456a → registry…' },
  { kind: 'out',  text: 'Promoting canary ring…' },
  { kind: 'err',  text: 'Health check failed: GET /healthz → 503 after 10 s' },
  { kind: 'err',  text: 'Rollback initiated — restoring previous replica set' },
  { kind: 'out',  text: 'Rolled back to billing-svc@sha:prev789 in 4 s' },
  { kind: 'note', text: 'Canary aborted. Check logs with: eidos logs billing-svc --ring canary' },
]`}
      >
        <div style={{ width: '100%', maxWidth: 600 }}>
          <Terminal
            title="session · billing-svc"
            status="error"
            lines={ERROR_LINES}
          />
        </div>
      </Frame>
      <Lede>
        Error lines (<Mono>kind: 'err'</Mono>) render in danger tone with an alert icon mark. They can be interspersed freely with <Mono>out</Mono> lines — use them for any line the subprocess wrote to stderr or for agent-detected failures.
      </Lede>

      {/* 4. IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame
        label="Terminal embedded inside an assistant Message bubble after a tool turn"
        height={360}
      >
        <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <Message from="user">
            Check the health of the identity service.
          </Message>
          <Message from="assistant">
            <p style={{ margin: '0 0 12px' }}>Here is what I ran:</p>
            <Terminal
              title="eidos health"
              status="done"
              lines={CTX_LINES}
            />
            <p style={{ margin: '12px 0 0', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
              The identity service is healthy — p95 is well within the 100 ms target and the error budget is at 94%.
            </p>
          </Message>
        </div>
      </Frame>
      <Lede>
        Drop <Mono>Terminal</Mono> directly inside a <Mono>{'<Message from="assistant">'}</Mono> bubble to show the raw tool call alongside the model's interpretation. The mono font signals a machine output while the surrounding prose carries the agent's reasoning.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <code style={{ fontFamily: 'var(--font-mono)' }}>Terminal</code> is a passive display element — it is not itself a Tab stop. If you attach an interactive footer (e.g. a command input via the <code style={{ fontFamily: 'var(--font-mono)' }}>children</code> slot), ensure the input is a real <code style={{ fontFamily: 'var(--font-mono)' }}>{'<input>'}</code> with an accessible label so keyboard users can reach it in the natural Tab order.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader — live region</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The component carries <code style={{ fontFamily: 'var(--font-mono)' }}>role="log"</code> on its outer element. When <code style={{ fontFamily: 'var(--font-mono)' }}>status="running"</code>, it adds <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> so new lines are announced as they stream in. The announcement is polite (not assertive) to avoid interrupting the user's current focus.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Prompt char &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The prompt character (<code style={{ fontFamily: 'var(--font-mono)' }}>$</code> by default) is purely a visual cue — it is included in the DOM as real text so screen readers read "$ eidos deploy …" naturally. The danger tone on <code style={{ fontFamily: 'var(--font-mono)' }}>err</code> lines meets AA; the alert icon is supplementary and does not carry meaning alone (the text is the record).
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>RTL — intentional exception</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Terminal content is always left-to-right by convention — commands and paths are LTR code, regardless of the surrounding UI direction. The component sets <code style={{ fontFamily: 'var(--font-mono)' }}>dir="ltr"</code> on its body so command lines never reverse under an RTL shell. This is intentional and must be documented in any consumer pattern that uses Arabic UI around a terminal.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; UI shell — terminal body stays LTR (intentional)" height={200}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBottom: 4 }}>
            نتيجة التشغيل:
          </div>
          <Terminal
            title="نشر الخدمة"
            status="done"
            lines={[
              { kind: 'in',  text: 'eidos deploy --service identity-svc --ring canary' },
              { kind: 'out', text: '→ Healthy at 02:14:32 UTC  p95=48ms' },
              { kind: 'note', text: 'Done. Promote to 25% with --promote.' },
            ]}
          />
        </div>
      </Frame>
      <Lede>
        The surrounding UI (the label "نتيجة التشغيل" and the title "نشر الخدمة") mirrors under <Mono>dir="rtl"</Mono>. The terminal body and all command lines stay left-to-right — <Mono>dir="ltr"</Mono> is set on the body element. Terminals are code surfaces; their content is always LTR regardless of the page direction. Document this clearly in your product's RTL guide.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 520, width: '100%' }} aria-hidden="true">
              <Terminal
                title="session · identity-svc"
                status="done"
                lines={[
                  { kind: 'in',  text: 'eidos deploy --service identity-svc' },
                  { kind: 'out', text: '→ Healthy at 02:14:32 UTC' },
                  { kind: 'err', text: 'Health check failed (example error line)' },
                  { kind: 'note', text: 'Done. Review with eidos logs.' },
                ]}
              />
              {/* terminal glyph (pin 1) */}
              <span className="lead h" style={{ top: 14, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 6, left: -52 }}>1</div>
              {/* title (pin 2) */}
              <span className="lead v" style={{ top: -22, left: 72, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 72, transform: 'translateX(-50%)' }}>2</div>
              {/* status (pin 3) */}
              <span className="lead v" style={{ top: -22, right: 36, height: 18 }}/>
              <div className="pin" style={{ top: -42, right: 36, transform: 'translateX(50%)' }}>3</div>
              {/* in line (pin 4) */}
              <span className="lead h" style={{ top: 60, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 52, right: -52 }}>4</div>
              {/* out line (pin 5) */}
              <span className="lead h" style={{ top: 86, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 78, right: -52 }}>5</div>
              {/* err line (pin 6) */}
              <span className="lead h" style={{ top: 112, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 104, right: -52 }}>6</div>
              {/* note line (pin 7) */}
              <span className="lead h" style={{ top: 138, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 130, right: -52 }}>7</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Terminal glyph.</b> A single ember <Mono>Icons.terminal</Mono> mark anchoring the title bar — the one accent in the chrome. Decorative (<Mono>aria-hidden</Mono>); the status pill, not the glyph, carries machine state for screen readers.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> Optional session label — e.g. "session · billing-svc". Geist Mono, muted. Omit for anonymous terminals.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Status pill.</b> One of idle / running / done / error. Controls <Mono>aria-live</Mono>; visible as a small pill in the title bar.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Input line (<Mono>in</Mono>).</b> The command that was run. Prefixed by the prompt character (<Mono>$</Mono> default). Geist Mono, full-brightness foreground.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Output line (<Mono>out</Mono>).</b> Standard stdout. Geist Mono, muted foreground (<Mono>--fg-muted</Mono>).</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Error line (<Mono>err</Mono>).</b> Stderr / failure output. Danger tone with an alert icon mark. The text is the record — do not rely on color alone.</span>
            <span className="num">7</span><span><b style={{ color: 'var(--fg)' }}>Note line (<Mono>note</Mono>).</b> Editorial annotation between blocks — e.g. "Done. Promote to 25% with --promote." Displayed without a prompt prefix, in muted italic.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair a command with its output</div>
          <div className="body" style={{ padding: 14 }}>
            <Terminal
              title="deploy"
              status="done"
              lines={[
                { kind: 'in',  text: 'eidos deploy --service identity-svc' },
                { kind: 'out', text: '→ Healthy at 02:14 UTC' },
              ]}
            />
          </div>
          <div className="note">Terminal is designed for paired command + output. The user sees what ran and what came back in a single focused block.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — dump 1 000 raw log lines</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', lineHeight: 1.6, maxHeight: 80, overflow: 'hidden' }}>
              <div>2026-05-28T02:14:01Z INFO starting server</div>
              <div>2026-05-28T02:14:01Z INFO binding :8080</div>
              <div>2026-05-28T02:14:02Z DEBUG health probe ok</div>
              <div style={{ color: 'var(--fg-faint)' }}>… 997 more lines …</div>
            </div>
          </div>
          <div className="note">For raw log streams use the core <code style={{ fontFamily: 'var(--font-mono)' }}>LogViewer</code> (IDP Blocks → Log viewer) which virtualises rows, supports search, and handles large buffers. Terminal is for short focused sessions, not log tailing.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use note lines for agent commentary</div>
          <div className="body" style={{ padding: 14 }}>
            <Terminal
              status="done"
              lines={[
                { kind: 'in',   text: 'eidos promote --ring canary --pct 25' },
                { kind: 'out',  text: 'Promoted. Error budget holding at 91%.' },
                { kind: 'note', text: 'Monitor for 10 min before the 50% step.' },
              ]}
            />
          </div>
          <div className="note">The note kind is an editorial annotation — use it for the agent's interpretation or recommended next step, clearly visually separated from raw output.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use Terminal for prose output</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', lineHeight: 1.7, background: 'var(--surface-active)', borderRadius: 6, padding: 10 }}>
              The identity service is currently healthy. Its p95 latency is within the SLO. The error budget is at 94%. I recommend promoting the canary to 25% traffic.
            </div>
          </div>
          <div className="note">Prose belongs in a Message bubble, not a terminal block. Use Terminal only when the content is machine-generated command + output, not model-generated natural language.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="TerminalProps">API reference</SubHead>
      <AutoPropsTable component="Terminal" label="<Terminal />"/>
      <PropsTable
        label="TerminalLine"
        rows={[
          { prop: 'kind', type: '"in" | "out" | "err" | "note"', required: true, description: 'Line type. in = command (with prompt prefix), out = stdout, err = stderr/failure (danger tone + icon), note = editorial annotation (no prompt, muted italic).' },
          { prop: 'text', type: 'string',                        required: true, description: 'The line content.' },
        ]}
      />
    </Section>
  );
}
