'use client';
// Eidos AI — Confirmation. The agent asks before doing something consequential.
// A pending card with Confirm/Cancel; resolves to a settled result line.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Confirmation, Message, Mono } from '@/ds/core';

// ── inline style consts ───────────────────────────────────────────────────────

// ── cycling state demo ────────────────────────────────────────────────────────
type ConfState = 'pending' | 'confirmed' | 'cancelled';

function CycleDemo({
  tone = 'default',
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: {
  tone?: string;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const [state, setState] = React.useState<ConfState>('pending');
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <Confirmation
        title={title}
        message={message}
        tone={tone}
        state={state}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={() => setState('confirmed')}
        onCancel={() => setState('cancelled')}
      />
      {state !== 'pending' && (
        <button
          className="btn xs ghost"
          style={{ marginTop: 12 }}
          onClick={() => setState('pending')}
        >
          Reset to pending
        </button>
      )}
    </div>
  );
}

export default function AiConfirmationPage() {
  const [ctxState, setCtxState] = React.useState<ConfState>('pending');

  return (
    <Section
      id="confirmation"
      num="12"
      title="Confirmation"
      desc="The agent asks before doing something consequential: a pending card with a clear title, the action's scope, and two buttons — Cancel to abort, Confirm to proceed."
    >
      {/* ── 1. INSTALLATION ─────────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('confirmation')} ariaLabel="package manager"/>
      <Lede>Once resolved, the card collapses to a settled result line so the thread stays readable — the decision stays visible without occupying full card height.</Lede>
      <Lede>
        Ships <Mono>Confirmation</Mono>. No extra dependencies — styles come from <Mono>ai.css</Mono> under the <Mono>.ai-confirm</Mono> block. Compose it inside any <Mono>Message</Mono> bubble or as a standalone card in a tool-call result.
      </Lede>

      {/* ── 2. USAGE ─────────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame
        label="Default — pending state with Confirm and Cancel"
        height={200}
        code={`import { Confirmation } from "@/ds/core"

<Confirmation
  title="Open a P1 incident for billing-svc?"
  message="This will page the on-call engineer and start an incident timeline."
  onConfirm={() => console.log('confirmed')}
  onCancel={() => console.log('cancelled')}
/>`}
      >
        <CycleDemo
          title="Open a P1 incident for billing-svc?"
          message="This will page the on-call engineer and start an incident timeline."
        />
      </Frame>
      <Lede>
        The default tone uses an ember Confirm button. Clicking Confirm or Cancel resolves the card to a one-line result. Click "Reset to pending" to cycle the state.
      </Lede>

      {/* ── 3. VARIANTS ──────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Variants</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="tone=danger">Danger tone</SubHead>
      <Frame
        label="tone=&quot;danger&quot; — destructive actions: red Confirm button"
        height={200}
        code={`<Confirmation
  tone="danger"
  title="Drop the canary deploy?"
  message="All canary pods will be terminated. The rollout cannot be resumed."
  confirmLabel="Drop deploy"
  onConfirm={…}
  onCancel={…}
/>`}
      >
        <CycleDemo
          tone="danger"
          title="Drop the canary deploy?"
          message="All canary pods will be terminated. The rollout cannot be resumed."
          confirmLabel="Drop deploy"
        />
      </Frame>
      <Lede>
        Use <Mono>tone="danger"</Mono> for destructive or irreversible actions. The Confirm button switches to the danger red so the risk is visually unambiguous — not just conveyed by the message text.
      </Lede>

      <SubHead meta="pending · confirmed · cancelled">States</SubHead>
      <Frame
        label="pending → confirmed — click Confirm; pending → cancelled — click Cancel"
        height={240}
        code={`const [state, setState] = useState<'pending'|'confirmed'|'cancelled'>('pending');

<Confirmation
  title="Open a P1 incident for billing-svc?"
  state={state}
  onConfirm={() => setState('confirmed')}
  onCancel={() => setState('cancelled')}
/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', maxWidth: 440 }}>
          <div>
            <div className="t-mono-label" style={{ marginBottom: 6 }}>pending</div>
            <Confirmation
              title="Roll back identity-svc to v2.3.1?"
              message="The current version will be replaced. Running requests will drain."
              state="pending"
              onConfirm={() => {}}
              onCancel={() => {}}
            />
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBottom: 6 }}>confirmed</div>
            <Confirmation
              title="Roll back identity-svc to v2.3.1?"
              state="confirmed"
            />
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBottom: 6 }}>cancelled</div>
            <Confirmation
              title="Roll back identity-svc to v2.3.1?"
              state="cancelled"
            />
          </div>
        </div>
      </Frame>
      <Lede>
        The settled states (confirmed / cancelled) render a compact result line — a check or cross with the resolved label — so the thread history stays readable without repeating the full card.
      </Lede>

      {/* ── 4. IN CONTEXT ────────────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame
        label="Confirmation inside a Message bubble — after a tool proposes an action"
        height={320}
      >
        <div style={{ width: '100%', maxWidth: 540 }}>
          <Message from="assistant">
            <p style={{ margin: '0 0 12px', lineHeight: 1.55 }}>
              The canary deploy for <Mono>payments-svc</Mono> is at <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>8%</span> and error rate has climbed to <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>2.4%</span>. I recommend dropping it and rolling back to <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>v3.1.0</span>.
            </p>
            <Confirmation
              title="Drop the canary deploy for payments-svc?"
              message="All canary pods will be terminated. Traffic returns fully to the stable ring."
              tone="danger"
              confirmLabel="Drop deploy"
              state={ctxState}
              onConfirm={() => setCtxState('confirmed')}
              onCancel={() => setCtxState('cancelled')}
            />
            {ctxState !== 'pending' && (
              <button
                className="btn xs ghost"
                style={{ marginTop: 10 }}
                onClick={() => setCtxState('pending')}
              >
                Reset
              </button>
            )}
          </Message>
        </div>
      </Frame>
      <Lede>
        Drop <Mono>Confirmation</Mono> directly inside a <Mono>{'<Message from="assistant">'}</Mono> bubble after the agent's reasoning. The card inherits the bubble surface; the Confirm button is the primary action.
      </Lede>

      {/* ── 5. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px', margin: 0, alignItems: 'baseline' }}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Move between the two buttons — Cancel first (inline-start), Confirm second.</dd>
            <dt><span className="kbd-chord"><kbd className="kbd">Shift</kbd><kbd className="kbd">Tab</kbd></span></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Move focus backward through the buttons.</dd>
            <dt><span className="kbd-chord"><kbd className="kbd">Enter</kbd><kbd className="kbd">Space</kbd></span></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Activate the focused button — fires <code style={{ fontFamily: 'var(--font-mono)' }}>onConfirm</code> or <code style={{ fontFamily: 'var(--font-mono)' }}>onCancel</code>.</dd>
            <dt><kbd className="kbd">Esc</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>Not handled — the card is inline, not a modal, so it neither traps focus nor auto-cancels. Wire a wrapper <code style={{ fontFamily: 'var(--font-mono)' }}>onKeyDown</code> to <code style={{ fontFamily: 'var(--font-mono)' }}>onCancel</code> if the product needs it.</dd>
          </dl>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginTop: 10 }}>
            Both actions are real <code style={{ fontFamily: 'var(--font-mono)' }}>{'<button>'}</code> elements and natural sequential Tab stops — no <code style={{ fontFamily: 'var(--font-mono)' }}>tabindex</code> needed.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The card carries <code style={{ fontFamily: 'var(--font-mono)' }}>role="group"</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> set to the <code style={{ fontFamily: 'var(--font-mono)' }}>title</code> prop (or "Confirmation" when title is omitted), so the group is announced by its action. Meaning is carried entirely by the visible title and message text — the leading alert glyph and the settled check/cross are decorative and add no information a screen reader needs.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The danger Confirm button uses the <code style={{ fontFamily: 'var(--font-mono)' }}>btn danger</code> token — red on a dark surface clears AA. Default Confirm uses the ember token (<code style={{ fontFamily: 'var(--font-mono)' }}>btn ember</code>) — dark ink on ember fills, never ember text on ember background. On keyboard focus both draw the canonical <code style={{ fontFamily: 'var(--font-mono)' }}>:focus-visible</code> ring — a <code style={{ fontFamily: 'var(--font-mono)' }}>var(--ring)</code> outline at <code style={{ fontFamily: 'var(--font-mono)' }}>var(--ring-offset)</code>, never <code style={{ fontFamily: 'var(--font-mono)' }}>outline: none</code> without a substitute.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The pending → result swap is an instantaneous React re-render — the <code style={{ fontFamily: 'var(--font-mono)' }}>.ai-confirm</code> block defines no transition or keyframe animation, so there is nothing for <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> to suppress. Safe by construction; no motion is introduced on state change.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ───────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — icon leads from start (right), Cancel / Confirm mirror" height={180}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 440 }}>
          <Confirmation
            title="هل تريد إغلاق النشر التجريبي؟"
            message="سيتم إيقاف جميع البودز التجريبية وإعادة حركة المرور إلى الحلقة المستقرة."
            tone="danger"
            confirmLabel="إغلاق النشر"
            cancelLabel="إلغاء"
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </div>
      </Frame>
      <Lede>
        Layout uses logical CSS properties throughout — the alert icon leads from the right, the action buttons mirror (Cancel at inline-start, Confirm at inline-end), and the title + message wrap naturally. No per-direction overrides needed.
      </Lede>

      {/* ── 7. ANATOMY ───────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 420, width: '100%' }} aria-hidden="true">
              <Confirmation
                title="Open a P1 incident for billing-svc?"
                message="This will page the on-call engineer and start an incident timeline."
                onConfirm={() => {}}
                onCancel={() => {}}
              />
              {/* pin 1 — icon */}
              <span className="lead h" style={{ top: 22, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 14, left: -52 }}>1</div>
              {/* pin 2 — title */}
              <span className="lead v" style={{ top: -22, left: '40%', height: 18 }}/>
              <div className="pin" style={{ top: -42, left: '40%', transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — message */}
              <span className="lead h" style={{ top: 50, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 42, right: -52 }}>3</div>
              {/* pin 4 — actions */}
              <span className="lead v" style={{ bottom: -22, right: 40, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, right: 40, transform: 'translateX(50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Icon.</b> Alert triangle — purely decorative. The tint follows the tone: ember for default, danger red for destructive. Meaning is always carried by the visible title, never by the glyph alone.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> One sentence: what the agent is about to do. Named directly ("Open a P1 incident") — never generic ("Are you sure?"). This is the <Mono>aria-label</Mono> text for screen readers.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Message.</b> The consequence. What will happen, why it matters, what can't be undone. Optional but recommended for destructive actions.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Actions.</b> Cancel (ghost) at inline-start, Confirm (ember or danger) at inline-end. The primary action is always rightmost (LTR) / leftmost (RTL) — the natural reach of the dominant hand and the reading-direction close.</span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — confirm destructive or irreversible actions</div>
          <div className="body" style={{ padding: 14 }}>
            <Confirmation
              title="Drop the canary deploy?"
              tone="danger"
              confirmLabel="Drop deploy"
              state="pending"
              onConfirm={() => {}}
              onCancel={() => {}}
            />
          </div>
          <div className="note">A destructive, irreversible action gets a danger-tone card. The title names exactly what will be dropped.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — confirm every model reply</div>
          <div className="body" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Confirmation title="Summarise this ticket?" state="pending" onConfirm={() => {}} onCancel={() => {}}/>
          </div>
          <div className="note">Summaries, lookups, and read-only actions need no confirmation — asking every time trains users to click Confirm reflexively, defeating the guard.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — name the action specifically</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--fg)' }}>Drop the canary deploy for payments-svc?</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginTop: 4 }}>All canary pods will be terminated.</div>
          </div>
          <div className="note">The title says exactly what service, what action, and the consequence. Users read it once and decide.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use a generic title</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--fg)' }}>Are you sure?</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginTop: 4 }}>This action may have consequences.</div>
          </div>
          <div className="note">"Are you sure?" with no context provides no information. Users learn to click through it without reading.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────────── */}
      <SubHead meta="ConfirmationProps">API reference</SubHead>
      <AutoPropsTable component="Confirmation" label="<Confirmation />"/>
    </Section>
  );
}
