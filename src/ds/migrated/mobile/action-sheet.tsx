'use client';
// Forge Mobile — Action sheet. A bottom-anchored list of actions on a single object,
// triggered by a "more" affordance. Unlike the Bottom sheet (which holds content) it is a
// short verb menu; unlike the Dialog it doesn't block — it's reachable and tap-to-dismiss.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

type Action = { label: string; icon: React.ReactNode; destructive?: boolean };

// Honor prefers-reduced-motion: the documented "slide-up shortens to a fade"
// is real here, not just copy. Returns true when the user has asked for less motion.
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function Sheet({ open, onClose, title, actions }: { open: boolean; onClose: () => void; title?: string; actions: Action[] }) {
  const reduced = useReducedMotion();
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // Escape closes; move focus to the first action on open so keyboard users land inside the menu.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', onKey);
    const first = sheetRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]');
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      {open && <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.45)' }} onClick={onClose} />}
      <div
        ref={sheetRef}
        role="menu"
        aria-label={title}
        aria-hidden={open ? undefined : true}
        style={{
          position: 'absolute', insetInline: 8, insetBlockEnd: 8,
          // Reduced motion: hold position and only cross-fade. Otherwise spring up from the edge.
          transform: reduced ? 'none' : (open ? 'translateY(0)' : 'translateY(120%)'),
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: reduced
            ? 'opacity var(--dur-fast) var(--ease)'
            : 'transform var(--dur-slow) var(--ease-spring), opacity var(--dur-fast) var(--ease)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}
      >
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl, 16px)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-3)', overflow: 'hidden' }}>
          {title && <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', borderBlockEnd: '1px solid var(--border)' }}>{title}</div>}
          {actions.map((a) => (
            <button key={a.label} role="menuitem" tabIndex={open ? 0 : -1} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', height: 52, padding: '0 16px', background: 'none', border: 'none', borderBlockEnd: '1px solid var(--border)', cursor: 'pointer', textAlign: 'start', fontSize: 'var(--text-sm)', fontWeight: 550, color: a.destructive ? 'var(--danger)' : 'var(--fg)' }}>
              <span style={{ display: 'flex', color: a.destructive ? 'var(--danger)' : 'var(--fg-muted)' }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} tabIndex={open ? 0 : -1} style={{ height: 52, borderRadius: 'var(--radius-xl, 16px)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-2)', fontWeight: 650, fontSize: 'var(--text-sm)', color: 'var(--fg)', cursor: 'pointer' }}>Cancel</button>
      </div>
    </>
  );
}

const ACTIONS: Action[] = [
  { label: 'View run', icon: <Icons.externalLink size={16} /> },
  { label: 'Re-run deploy', icon: <Icons.refresh size={16} /> },
  { label: 'Pin to top', icon: <Icons.pin size={16} /> },
  { label: 'Roll back', icon: <Icons.rollback size={16} />, destructive: true },
];

function ActionScreen() {
  const [open, setOpen] = React.useState(true);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const wasOpen = React.useRef(open);

  // Restore focus to the ⋯ trigger when the sheet closes (open → closed only).
  React.useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', insetBlockStart: 56, insetInline: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
        <span style={{ fontWeight: 650 }}>payments-api</span>
        <button ref={triggerRef} onClick={() => setOpen(true)} aria-haspopup="menu" aria-expanded={open} aria-label="More actions" className="btn icon"><Icons.more size={18} /></button>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="payments-api · v4.3.0" actions={ACTIONS} />
    </div>
  );
}

export default function MobileActionSheet() {
  return (
    <Section
      id="action-sheet"
      num="01"
      title="Action sheet"
      desc="A bottom-anchored verb list for one object — the actions behind a row's overflow affordance. Sits under the thumb, dismisses on a tap outside. Cancel stands apart on its own surface."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Action sheet is the everyday partner to Dialog (which blocks) and Bottom sheet (which holds content, not just verbs). Use it for the per-row actions of a long list.</Lede>
      <Frame label="Tap the ⋯ on the row · pick a verb · tap-outside to cancel" center>
        <DeviceFrame initial="iphone-se"><ActionScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '60px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', textAlign: 'center', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', borderBlockEnd: '1px solid var(--border)' }}>payments-api · v4.3.0</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 46, padding: '0 16px', borderBlockEnd: '1px solid var(--border)', fontSize: 'var(--text-sm)', fontWeight: 550 }}><Icons.refresh size={15} color="var(--fg-muted)" /> Re-run deploy</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 46, padding: '0 16px', fontSize: 'var(--text-sm)', fontWeight: 550, color: 'var(--danger)' }}><Icons.rollback size={15} color="var(--danger)" /> Roll back</div>
              </div>
              <div style={{ marginBlockStart: 8, height: 46, borderRadius: 16, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontWeight: 650, fontSize: 'var(--text-sm)' }}>Cancel</div>
              <span className="lead h" style={{ top: 8, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 38, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 84, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 18, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 1, left: -52 }}>1</div>
              <div className="pin" style={{ top: 30, right: -52 }}>2</div>
              <div className="pin" style={{ top: 76, right: -52 }}>3</div>
              <div className="pin" style={{ bottom: 12, left: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Context header.</b> Names the object the verbs act on — so "Roll back" can never be misread as global.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Action rows.</b> One verb each, leading monoline icon, 52px tall. Ordered most-common first.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Destructive action.</b> Tinted with <Mono>--danger</Mono> and placed last, away from the resting thumb.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Cancel.</b> A separate card below the list — the largest, safest target and the obvious escape.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 10 }}>Keyboard</div>
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div className="kbd-row" role="listitem"><span className="label">Open / focus first action</span><span className="kbd-chord trailing"><kbd className="kbd">Enter</kbd></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Move between actions</span><span className="kbd-chord trailing"><kbd className="kbd">Tab</kbd></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Invoke action</span><span className="kbd-chord trailing"><kbd className="kbd">Enter</kbd></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Dismiss, restore trigger focus</span><span className="kbd-chord trailing"><kbd className="kbd">Esc</kbd></span></div>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Roles &amp; focus</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>The list is <Mono>role=&quot;menu&quot;</Mono> of <Mono>menuitem</Mono>s, labelled by the context header; the trigger is <Mono>aria-haspopup=&quot;menu&quot;</Mono> with <Mono>aria-expanded</Mono>. On open, focus moves to the first action; on close it returns to the ⋯ trigger.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Touch &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>Each row is a 52px full-width target and the detached Cancel is the biggest, lowest one — under the resting thumb. The destructive row pairs a leading icon with <Mono>--danger</Mono>, so colour is never the only signal.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Reduced motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>Three paths close it — <kbd className="kbd">Esc</kbd>, the Cancel card, and a scrim tap. Under <Mono>prefers-reduced-motion</Mono> the slide-up is dropped and the sheet only cross-fades in place.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — each action row mirrors: leading icon to the right, label right-aligned'} center code={`<div dir="rtl">{/* role=menu rows */}</div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><ActionScreen /></DeviceFrame></div>
      </Frame>
      <Lede>The rows are <Mono>display:flex</Mono> with <Mono>text-align:start</Mono>, so the leading icon moves to the right edge and each label right-aligns; the bottom-anchored sheet (<Mono>insetInline:8</Mono>) and its detached Cancel card stay put, as does the destructive Roll back row in last place. None of the glyphs are directional, so no icon needs <Mono>scaleX(-1)</Mono>.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — short verbs on one object</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 220, margin: '0 auto', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>
            <span style={{ display: 'flex', gap: 10, padding: '8px 0', borderBlockEnd: '1px solid var(--border)' }}><Icons.refresh size={15} /> Re-run deploy</span>
            <span style={{ display: 'flex', gap: 10, padding: '8px 0', color: 'var(--danger)' }}><Icons.rollback size={15} color="var(--danger)" /> Roll back</span>
          </div>
          <div className="note">Three or four verbs, the riskiest tinted and last. Reads in one glance.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — a scrolling settings form</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 220, margin: '0 auto', color: 'var(--fg-faint)', fontSize: 'var(--text-base)' }}>
            <span className="in-control" style={{ padding: '6px 8px' }}>Replicas</span>
            <span className="in-control" style={{ padding: '6px 8px' }}>Region</span>
            <span>…ten more rows scrolling under the thumb</span>
          </div>
          <div className="note">Inputs and long lists belong in a Bottom sheet or a full screen — the action sheet is verbs only.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="action sheet"
        lang="tsx"
        code={`<div className="m-sheet-scrim" onClick={close} />
<div role="menu" aria-label="payments-api · v4.3.0" className="m-actionsheet">
  <header>payments-api · v4.3.0</header>
  <button role="menuitem"><Icons.refresh /> Re-run deploy</button>
  <button role="menuitem" data-destructive><Icons.rollback /> Roll back</button>
</div>
<button className="m-actionsheet-cancel">Cancel</button>   {/* separate card */}

/* slide up from the bottom edge; destructive last, var(--danger). */`}
      />
    </Section>
  );
}
