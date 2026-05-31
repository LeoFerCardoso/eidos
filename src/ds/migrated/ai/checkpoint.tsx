'use client';
// Eidos AI — Checkpoint. A save-point between turns the user can restore.
// A centered chip on a hairline rule marks where the conversation can be
// rewound, with an optional time stamp and a Restore affordance.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Checkpoint, Message, Mono } from '@/ds/core';

// ── inline style consts ───────────────────────────────────────────────────────

export default function AiCheckpointPage() {
  // in-context demo state — Restore rewinds the thread to the save-point
  // (discards the turn that followed) and stays rewound until Reset.
  const [restored, setRestored] = React.useState(false);
  const [ctxKey, setCtxKey] = React.useState(0);

  const handleRestore = () => setRestored(true);

  return (
    <Section
      id="checkpoint"
      num="13"
      title="Checkpoint"
      desc="A save-point between turns that the user can restore. A centered chip on a hairline rule marks where context was captured, giving the user a reliable rewind point if the agent goes off-track."
    >
      {/* ── 1. INSTALLATION ─────────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-checkpoint')} ariaLabel="package manager"/>
      <Lede>Add one after consequential actions, never after every message.</Lede>
      <Lede>
        Ships <Mono>Checkpoint</Mono>. No extra dependencies — styles come from <Mono>ai.css</Mono> under the <Mono>.ai-checkpoint</Mono> block. Compose it between <Mono>Message</Mono> turns or between <Mono>Tool</Mono> calls in an agent trace.
      </Lede>

      {/* ── 2. USAGE ─────────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="A single Checkpoint chip on a hairline rule"
        height={80}
        code={`import { Checkpoint } from "@/ds/core"

<Checkpoint />`}
      >
        <div style={{ width: '100%', maxWidth: 540 }}>
          <Checkpoint />
        </div>
      </Frame>
      <Lede>
        The default renders a small ember flag marker, the "Checkpoint" label, and the hairline rule. Drop it anywhere in a thread or agent trace.
      </Lede>

      {/* ── 3. VARIANTS ──────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Variants</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="with time">With timestamp</SubHead>
      <Frame
        label="time prop — mono timestamp beside the label"
        height={80}
        code={`<Checkpoint time="14:32" />
<Checkpoint time="2 min ago" />
<Checkpoint label="Incident saved" time="14:32" />`}
      >
        <div style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Checkpoint time="14:32"/>
          <Checkpoint label="Incident saved" time="2 min ago"/>
        </div>
      </Frame>
      <Lede>
        Pass any React node to <Mono>time</Mono> — relative strings ("2 min ago"), clock times ("14:32"), or a <Mono>{'<RelativeTime>'}</Mono> component. The time renders in Geist Mono beside the label.
      </Lede>

      <SubHead meta="with restore">With Restore</SubHead>
      <Frame
        label="onRestore — shows a Restore button inside the chip"
        height={80}
        code={`<Checkpoint
  label="Before rollback"
  time="14:32"
  onRestore={() => restoreConversation()}
/>`}
      >
        <div style={{ width: '100%', maxWidth: 540 }}>
          <Checkpoint
            label="Before rollback"
            time="14:32"
            onRestore={() => {}}
          />
        </div>
      </Frame>
      <Lede>
        Passing <Mono>onRestore</Mono> adds a Restore button inside the chip. It is a real <Mono>{'<button>'}</Mono> — Tab-reachable, with an explicit <Mono>aria-label="Restore conversation to {'{label}'}"</Mono> so the action is unambiguous out of context. The chip does not close or collapse after restore; the page owns reflecting the restored state.
      </Lede>

      <SubHead meta="custom label">Custom label</SubHead>
      <Frame
        label="label prop — name the checkpoint after what was captured"
        height={120}
        code={`<Checkpoint label="Before rollback" />
<Checkpoint label="Canary at 8%" time="08:17" />
<Checkpoint label="Plan agreed" time="just now" />`}
      >
        <div style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Checkpoint label="Before rollback"/>
          <Checkpoint label="Canary at 8%" time="08:17"/>
          <Checkpoint label="Plan agreed" time="just now"/>
        </div>
      </Frame>
      <Lede>
        Name the checkpoint after what was captured — "Before rollback", "Plan agreed" — so the restore affordance is self-explanatory without reading the surrounding thread.
      </Lede>

      {/* ── 4. IN CONTEXT ────────────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame
        label="Checkpoint between Message turns — Restore rewinds the thread to the save-point"
        height={420}
        key={ctxKey}
      >
        <div style={{ width: '100%', maxWidth: 540 }}>
          <Message from="user">
            Roll back identity-svc to v2.3.1 and open a P1 incident.
          </Message>
          <Message from="assistant">
            I've triggered the rollback for identity-svc. The deploy is draining traffic now. Estimated completion: 90 seconds.
          </Message>

          <Checkpoint
            label="After rollback trigger"
            time="14:34"
            onRestore={handleRestore}
          />

          {/* Turns AFTER the save-point — Restore rewinds them away, the literal thesis. */}
          {restored ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBlock: 8 }}>
              <span className="pill ember" role="status">
                <Icons.check size={10}/> Rewound to this checkpoint — later turns discarded
              </span>
            </div>
          ) : (
            <Message from="assistant">
              Rollback complete. v2.3.1 is live. P1 incident INC-4421 opened — the on-call engineer has been paged.
            </Message>
          )}
        </div>
      </Frame>
      <Lede>
        Place a Checkpoint immediately after a consequential action — a rollback, an incident open, a data mutation — so the user always has a known-good rewind point. Restore here genuinely rewinds: the turn that followed the save-point is discarded and the thread returns to its captured state. Press Reset to replay.
      </Lede>
      <button
        className="btn xs ghost focus-ring"
        style={{ marginBlockStart: 8 }}
        onClick={() => { setRestored(false); setCtxKey(k => k + 1); }}
      >
        Reset demo
      </button>

      {/* ── 5. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 10 }}>Keyboard</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '34%', paddingBlock: 6, paddingInlineEnd: 12, verticalAlign: 'top' }}><span className="kbd-chord"><span className="kbd">Tab</span></span></td>
                <td style={{ paddingBlock: 6, color: 'var(--fg-muted)', lineHeight: 1.55 }}>Moves focus to the Restore button — the only Tab stop; the chip is a static separator.</td>
              </tr>
              <tr>
                <td style={{ paddingBlock: 6, paddingInlineEnd: 12, verticalAlign: 'top' }}><span className="kbd-chord"><span className="kbd">Enter</span><span className="kbd">Space</span></span></td>
                <td style={{ paddingBlock: 6, color: 'var(--fg-muted)', lineHeight: 1.55 }}>Activates Restore and fires <Mono>onRestore</Mono>.</td>
              </tr>
              <tr>
                <td style={{ paddingBlock: 6, paddingInlineEnd: 12, verticalAlign: 'top' }}><span className="kbd-chord"><span className="kbd">Shift</span><span className="kbd">Tab</span></span></td>
                <td style={{ paddingBlock: 6, color: 'var(--fg-muted)', lineHeight: 1.55 }}>Moves focus back to the preceding turn.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', lineHeight: 1.6 }}>
            The root carries <Mono>role="separator"</Mono> with an <Mono>aria-label</Mono> combining label and time (<Mono>"Checkpoint · 14:32"</Mono>). The flag icon is <Mono>aria-hidden</Mono>. The Restore button carries its own <Mono>aria-label="Restore conversation to {'{label}'}"</Mono>, so it announces the full intent even though its visible text is just "Restore".
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', lineHeight: 1.6 }}>
            Restore paints an authored <Mono>.ai-checkpoint-restore:focus-visible</Mono> ring (<Mono>--ring</Mono>) with a tight offset suited to its inline placement inside the separator — not just the inherited UA outline. The label is text in <Mono>--fg</Mono> on <Mono>--surface</Mono>, above the 4.5:1 AA minimum; ember is reserved for the small flag marker, the chip's single accent. The hairline uses <Mono>--border</Mono>, verified in dark and light themes.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', lineHeight: 1.6 }}>
            Under <Mono>prefers-reduced-motion</Mono> the restore state-change is instant — no fade or slide as later turns are discarded. The hairline rule is static (no pulse or draw animation).
          </div>
        </div>
      </div>

      {/* ── 6. RTL ───────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — chip reads from the start (right), hairlines extend symmetrically" height={120}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Checkpoint label="نقطة تفتيش" time="14:32"/>
          <Checkpoint label="بعد التراجع" time="الآن" onRestore={() => {}}/>
        </div>
      </Frame>
      <Lede>
        Checkpoint uses logical CSS properties throughout. The hairlines are equal on both sides (they're symmetric by design), so RTL requires no overrides. The chip content reads right-to-left; the Restore button flips to the inline-start edge.
      </Lede>

      {/* ── 7. ANATOMY ───────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 480, width: '100%' }} aria-hidden="true">
              <Checkpoint label="After rollback trigger" time="14:34" onRestore={() => {}}/>
              {/* pin 1 — left hairline */}
              <span className="lead v" style={{ top: -22, left: '5%', height: 18 }}/>
              <div className="pin" style={{ top: -42, left: '5%', transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — flag marker (just inline-start of the centered label) */}
              <span className="lead v" style={{ top: -22, left: '44%', height: 18 }}/>
              <div className="pin" style={{ top: -42, left: '44%', transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — label */}
              <span className="lead v" style={{ top: -22, left: '50%', height: 18 }}/>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — time */}
              <span className="lead v" style={{ bottom: -22, left: '65%', height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: '65%', transform: 'translateX(-50%)' }}>4</div>
              {/* pin 5 — Restore button */}
              <span className="lead v" style={{ bottom: -22, right: '8%', height: 18 }}/>
              <div className="pin" style={{ bottom: -42, right: '8%', transform: 'translateX(50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Hairlines.</b> Two equal horizontal rules flanking the chip — <Mono>--border</Mono> color, 1px height. They read as a separator and visually divide the thread into before/after segments.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Flag marker.</b> A small <Mono>Icons.flag</Mono> glyph in ember — <Mono>aria-hidden</Mono>. The chip's single accent: it signals "this is a save point" by convention (flag = marker in the ground) while the label stays in <Mono>--fg</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Names the checkpoint. Default is "Checkpoint"; override with something that tells the user what was captured ("Before rollback", "Plan agreed").</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Time.</b> Optional mono timestamp. Accept a string or ReactNode — use a <Mono>{'<RelativeTime>'}</Mono> component for live ticking.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Restore button.</b> Only rendered when <Mono>onRestore</Mono> is provided. A ghost button inside the chip — Tab-reachable with its own <Mono>aria-label</Mono> and an authored focus ring. Fires the callback; does not update state internally.</span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — mark turn-level save-points after consequential actions</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', padding: '8px 0' }}>… incident INC-4421 opened and the on-call paged.</div>
              <Checkpoint label="After incident open" time="14:34" onRestore={() => {}}/>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', padding: '8px 0' }}>Starting remediation steps…</div>
            </div>
          </div>
          <div className="note">One Checkpoint after the incident was opened — a meaningful rewind point if the remediation goes wrong.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — auto-checkpoint every message</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', padding: '4px 0' }}>Hello! How can I help?</div>
              <Checkpoint/>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', padding: '4px 0' }}>Let me check the service health.</div>
              <Checkpoint/>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', padding: '4px 0' }}>p95 latency is 620ms.</div>
              <Checkpoint/>
            </div>
          </div>
          <div className="note">A checkpoint after every turn dilutes the signal and clutters the thread. Users stop noticing them — and stop trusting them.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — name the checkpoint after what was captured</div>
          <div className="body" style={{ padding: 14 }}>
            <Checkpoint label="Before rollback" time="14:32"/>
          </div>
          <div className="note">"Before rollback" tells the user exactly what state will be restored. They can decide without reading the surrounding messages.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use the default label for every checkpoint</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Checkpoint/>
              <Checkpoint/>
            </div>
          </div>
          <div className="note">Two generic "Checkpoint" labels side by side are indistinguishable. Always name the checkpoint after the state it captures.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────────── */}
      <SubHead meta="CheckpointProps">API reference</SubHead>
      <AutoPropsTable component="Checkpoint" label="<Checkpoint />"/>
    </Section>
  );
}
