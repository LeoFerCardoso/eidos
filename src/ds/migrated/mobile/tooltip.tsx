'use client';
// Eidos Mobile — Tooltip. A transient explanatory callout shown on hover or keyboard focus
// of a control, with a pointer toward its anchor. The shipped @eidos/ui Tooltip portals to
// document.body (position:fixed) and auto-flips at the viewport edge. On touch there is no
// hover, so a mobile surface drives it with the controlled `open` prop (tap toggles) or relies
// on focus. For rich help content use a Popover instead. Dismissible per WCAG 1.4.13 — Escape
// or a tap outside closes the tooltip.
import * as React from 'react';
import { AutoPropsTable, Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Tooltip } from '@/ds/core';

// Icon-only button anchor. The shipped Tooltip clones this child to wire hover/focus + ARIA.
function IconBtn({ icon, label, tip, side, open, onOpenChange }: {
  icon: React.ReactNode; label: string; tip: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  open?: boolean; onOpenChange?: (o: boolean) => void;
}) {
  return (
    <Tooltip content={tip} side={side} open={open} onOpenChange={onOpenChange}>
      <button
        type="button"
        aria-label={label}
        style={{
          display: 'grid', placeItems: 'center', width: 44, height: 44,
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
          background: 'var(--surface)', color: 'var(--fg)', cursor: 'pointer',
        }}
      >
        {icon}
      </button>
    </Tooltip>
  );
}

// In-context mobile surface. Touch has no hover, so each anchor is a CONTROLLED Tooltip:
// tapping the button toggles its `open` state (only one open at a time).
function TooltipScreen() {
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const toggle = (k: string) => setOpenKey((cur) => (cur === k ? null : k));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingBlock: '52px 0', paddingInline: 14, flex: 1 }}>
        <div style={{ fontSize: 'var(--text-xl, 20px)', fontWeight: 700, letterSpacing: '-0.02em', marginBlockEnd: 4 }}>Pipeline · INC-1841</div>
        <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBlockEnd: 20 }}>identity-svc — 3 stages</div>
        {/* Stage rows */}
        {[
          { name: 'Build', status: 'passed', dur: '1m 12s' },
          { name: 'Test', status: 'passed', dur: '3m 44s' },
          { name: 'Deploy', status: 'failed', dur: '0m 38s' },
        ].map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, paddingInline: 10, borderRadius: 'var(--radius-md)', background: 'var(--surface)', marginBlockEnd: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: s.status === 'passed' ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 550 }}>{s.name}</span>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', fontVariantNumeric: 'var(--tnum)' }}>{s.dur}</span>
          </div>
        ))}
        {/* Toolbar — tap a button to toggle its tooltip (mobile has no hover) */}
        <div style={{ display: 'flex', gap: 8, marginBlockStart: 20 }}>
          <Tooltip content="Rollback to last good build" open={openKey === 'rollback'} onOpenChange={(o) => setOpenKey(o ? 'rollback' : null)}>
            <button type="button" aria-label="Rollback to last good build" onClick={() => toggle('rollback')}
              style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--fg)', cursor: 'pointer' }}>
              <Icons.rollback size={17} />
            </button>
          </Tooltip>
          <Tooltip content={copied ? 'Copied!' : 'Copy run ID to clipboard'} open={openKey === 'copy'} onOpenChange={(o) => setOpenKey(o ? 'copy' : null)}>
            <button
              type="button"
              aria-label="Copy run ID"
              onClick={() => { toggle('copy'); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
              style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface)', color: copied ? 'var(--accent)' : 'var(--fg)', cursor: 'pointer' }}
            >
              {copied ? <Icons.check size={17} /> : <Icons.copy size={17} />}
            </button>
          </Tooltip>
          <Tooltip content="View full audit log" open={openKey === 'audit'} onOpenChange={(o) => setOpenKey(o ? 'audit' : null)}>
            <button type="button" aria-label="View full audit log" onClick={() => toggle('audit')}
              style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--fg)', cursor: 'pointer' }}>
              <Icons.auditLog size={17} />
            </button>
          </Tooltip>
          <Tooltip content="Flag for review" open={openKey === 'flag'} onOpenChange={(o) => setOpenKey(o ? 'flag' : null)}>
            <button type="button" aria-label="Flag for review" onClick={() => toggle('flag')}
              style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--fg)', cursor: 'pointer' }}>
              <Icons.flag size={17} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default function MobileTooltip() {
  return (
    <Section
      id="tooltip"
      num="01"
      title="Tooltip"
      desc="A transient explanatory hint anchored to a control; opens on hover or keyboard focus and auto-flips at the viewport edge. For supplemental, non-critical context — never information the user must act on."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Tooltips supplement icon-only buttons with a text label. The shipped <Mono>Tooltip</Mono> opens after a short <Mono>delayDuration</Mono> (500ms default) on hover and instantly on focus. Touch devices have no hover event, so this mobile toolbar makes each tooltip <b>controlled</b> — a tap toggles its <Mono>open</Mono> state. For rich help content — links, structured text — use a Popover instead.</Lede>
      <Frame label="Pipeline toolbar — tap any icon button to toggle its tooltip" center>
        <DeviceFrame initial="iphone-se"><TooltipScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Sides</SubHead>
      <Lede>The <Mono>side</Mono> prop places the bubble on the <Mono>top</Mono>, <Mono>right</Mono>, <Mono>bottom</Mono>, or <Mono>left</Mono> of the trigger. It auto-flips to the opposite side when the chosen side would clip the viewport.</Lede>
      <Frame
        label="side='top' · 'right' · 'bottom' · 'left' — hover or focus a button to reveal its tooltip"
        code={`<Tooltip content="Rollback to last good build" side="top">
  <button aria-label="Rollback">{/* icon */}</button>
</Tooltip>`}
        lang="tsx"
      >
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', padding: '60px 24px' }}>
          {([
            { side: 'top', icon: <Icons.rollback size={17} />, label: 'Rollback', tip: 'Rollback to last good build' },
            { side: 'right', icon: <Icons.copy size={17} />, label: 'Copy', tip: 'Copy run ID' },
            { side: 'bottom', icon: <Icons.auditLog size={17} />, label: 'Audit log', tip: 'View full audit log' },
            { side: 'left', icon: <Icons.flag size={17} />, label: 'Flag', tip: 'Flag for review' },
          ] as const).map((v) => (
            <div key={v.side} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}>{v.side}</span>
              <IconBtn icon={v.icon} label={v.label} tip={v.tip} side={v.side} />
            </div>
          ))}
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Keyboard &amp; role</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The bubble carries <code style={{ fontFamily: 'var(--font-mono)' }}>role="tooltip"</code> and the trigger gets <code style={{ fontFamily: 'var(--font-mono)' }}>aria-describedby</code> while open. Tab to the control to show it on focus; press Escape to dismiss per WCAG 1.4.13 (Content on Hover or Focus).</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Hoverable &amp; dismissible</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Moving the pointer onto the bubble cancels the close timer, so the content can be read; leaving reschedules the close. Scroll or resize dismisses it. The icon-only button becomes fully named for VoiceOver and TalkBack.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion: reduce</code> the bubble appears instantly with no slide, and the open delay is skipped — the <code style={{ fontFamily: 'var(--font-mono)' }}>.tip-instant</code> class drops the transition.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Touch target ≥ 44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The bubble is <code style={{ fontFamily: 'var(--font-mono)' }}>pointer-events:none</code> until hovered, so it never shrinks the anchor's hit area. The anchor button retains its own ≥44px target independently.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the position math reads computed direction and mirrors align; the centre case is unchanged'} center code={`<div dir="rtl">
  <Tooltip content="نسخ المعرف" side="top">
    <button aria-label="نسخ">{/* icon */}</button>
  </Tooltip>
</div>`} lang="tsx">
        <div dir="rtl" style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', padding: '64px 24px 24px' }}>
          {([
            { label: 'الرجوع', icon: <Icons.rollback size={17} /> },
            { label: 'نسخ المعرف', icon: <Icons.copy size={17} /> },
            { label: 'إبلاغ للمراجعة', icon: <Icons.flag size={17} /> },
          ] as const).map((v) => (
            <IconBtn key={v.label} icon={v.icon} label={v.label} tip={v.label} side="top" />
          ))}
        </div>
      </Frame>
      <Lede>The Tooltip reads the trigger's computed <Mono>direction</Mono> and mirrors <Mono>align="start"</Mono> / <Mono>"end"</Mono> across the inline axis, so <Mono>start</Mono> hugs the inline-start edge in both directions. The default centre alignment needs no change, and the bubble text renders in the RTL script direction.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              {/* Callout */}
              <span style={{
                display: 'inline-block', padding: '6px 10px',
                borderRadius: 'var(--radius-lg)', background: 'var(--surface-overlay)',
                border: '1px solid var(--border)', color: 'var(--fg)',
                fontSize: 'var(--text-base)', fontWeight: 500, whiteSpace: 'nowrap',
                marginBlockEnd: 9, position: 'relative',
              }}>
                Rollback to last good build
                <span aria-hidden="true" style={{ position: 'absolute', insetBlockEnd: -7, insetInlineStart: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid var(--surface-overlay)' }} />
              </span>
              {/* Anchor */}
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--accent)', background: 'var(--surface)', outline: '2px solid var(--accent)', outlineOffset: 2 }}>
                  <Icons.rollback size={17} color="var(--fg)" />
                </span>
              </span>
              <span className="lead h" style={{ insetBlockStart: 6, insetInlineStart: -30, width: 26 }} />
              <span className="lead h" style={{ insetBlockStart: 6, insetInlineEnd: -30, width: 26 }} />
              <span className="lead v" style={{ insetBlockStart: 28, insetInlineStart: '50%', height: 10 }} />
              <span className="lead h" style={{ insetBlockEnd: 22, insetInlineEnd: -30, width: 26 }} />
              <div className="pin" style={{ insetBlockStart: -6, insetInlineStart: -56 }}>1</div>
              <div className="pin" style={{ insetBlockStart: -6, insetInlineEnd: -56 }}>2</div>
              <div className="pin" style={{ insetBlockStart: 18, insetInlineStart: -4 }}>3</div>
              <div className="pin" style={{ insetBlockEnd: 14, insetInlineEnd: -56 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, marginBlock: '72px 0', marginInline: 'auto' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Callout body.</b> <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>var(--surface-overlay)</code> background with a 1px border so it lifts clearly above any surface without a heavy shadow. Portaled to <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>document.body</code> at <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>position:fixed</code> to escape <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>overflow:hidden</code>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Text.</b> Plain, short — one sentence max. The bubble sets <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>role="tooltip"</code> and the trigger references it with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>aria-describedby</code>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Pointer.</b> Points at the centre of the trigger; the resolved side (after viewport flip) decides which edge it sits on. The position math reads the trigger's computed direction so it stays RTL-correct.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Anchor control.</b> The trigger that owns the hover / focus events; the shipped Tooltip clones it to attach the listeners and the <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>aria-describedby</code> reference. It keeps its own ≥44px touch target independently.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — short label for an icon-only action</div>
          <div className="body" style={{ gap: 16, justifyContent: 'center', alignItems: 'center', padding: '16px 0' }}>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span role="tooltip" style={{ position: 'absolute', insetBlockEnd: '100%', insetInlineStart: '50%', transform: 'translateX(-50%)', marginBlockEnd: 9, whiteSpace: 'nowrap', padding: '5px 9px', borderRadius: 'var(--radius-lg)', background: 'var(--surface-overlay)', border: '1px solid var(--border)', color: 'var(--fg)', fontSize: 'var(--text-base)', fontWeight: 500 }}>
                Rollback to last good build
                <span aria-hidden="true" style={{ position: 'absolute', insetBlockEnd: -6, insetInlineStart: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--surface-overlay)' }} />
              </span>
              <button type="button" aria-label="Rollback" style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--accent)', background: 'var(--surface)', color: 'var(--fg)', cursor: 'pointer' }}>
                <Icons.rollback size={17} />
              </button>
            </span>
          </div>
          <div className="note">A single action label names the icon button for sighted and AT users alike.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — rich content or interactive elements</div>
          <div className="body" style={{ justifyContent: 'center', alignItems: 'center', padding: '16px 0' }}>
            <span style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 'var(--radius-lg)', background: 'var(--surface-overlay)', border: '1px solid var(--border)', color: 'var(--fg)', fontSize: 'var(--text-base)', maxWidth: 200 }}>
              <span style={{ display: 'block', fontWeight: 600, marginBlockEnd: 4 }}>Rollback</span>
              <span style={{ display: 'block', color: 'var(--fg-muted)', fontSize: 'var(--text-xs)', lineHeight: 1.5, marginBlockEnd: 8 }}>This will reset the deployment to build #184 from 3 hours ago. Are you sure?</span>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>Confirm</span>
            </span>
          </div>
          <div className="note">Interactive content and multi-step flows belong in a Popover or Action Sheet — not a tooltip.</div>
        </div>
      </div>

      <SubHead meta="reference">API reference</SubHead>
      <AutoPropsTable component="Tooltip" label="<Tooltip />" />
      <CodeBlock
        label="tooltip"
        lang="tsx"
        code={`import { Tooltip } from '@eidos/ui';

// Hover / focus (default) — opens after delayDuration, ESC dismisses
<Tooltip content="Rollback to last good build" side="top">
  <button type="button" aria-label="Rollback to last good build">
    <Icons.rollback size={17} />
  </button>
</Tooltip>

// Mobile (no hover) — drive it controlled; a tap toggles open
const [open, setOpen] = React.useState(false);

<Tooltip content="Copy run ID" open={open} onOpenChange={setOpen}>
  <button
    type="button"
    aria-label="Copy run ID"
    onClick={() => setOpen((o) => !o)}
  >
    <Icons.copy size={17} />
  </button>
</Tooltip>

/* The bubble portals to document.body at position:fixed, carries role="tooltip",
   wires aria-describedby on the trigger while open, auto-flips at the viewport
   edge, and respects prefers-reduced-motion (instant, no slide). */`}
      />
    </Section>
  );
}
