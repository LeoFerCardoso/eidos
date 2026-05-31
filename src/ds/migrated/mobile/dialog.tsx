'use client';
// Forge Mobile — Dialog. A centered, modal interruption that demands a decision before
// anything else continues: a destructive confirm, an auth step, a blocking error. Use it
// sparingly — for a list of choices or non-blocking detail, the Action sheet fits the thumb better.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// Honor prefers-reduced-motion: the documented spring/scale entrance collapses
// to a plain cross-fade. Real, not just copy.
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

function Dialog({ open, onClose, destructive, bgRef }: { open: boolean; onClose: () => void; destructive?: boolean; bgRef: React.RefObject<HTMLDivElement | null> }) {
  const reduced = useReducedMotion();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  // Real modal behaviour the docs promise: on open move focus into the panel,
  // trap Tab inside it, close on Escape, and mark the screen behind inert + aria-hidden.
  React.useEffect(() => {
    if (!open) return;
    const bg = bgRef.current;
    bg?.setAttribute('aria-hidden', 'true');
    bg?.setAttribute('inert', '');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      // Focus trap: cycle within the panel's tabbable controls.
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    // Land focus on the non-destructive escape route (Cancel), never the destructive default.
    const cancel = panelRef.current?.querySelector<HTMLButtonElement>('[data-cancel]');
    cancel?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      bg?.removeAttribute('aria-hidden');
      bg?.removeAttribute('inert');
    };
  }, [open, onClose, bgRef]);

  return (
    <>
      {open && <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.55)' }} onClick={onClose} />}
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        aria-hidden={open ? undefined : true}
        style={{
          position: 'absolute', insetInlineStart: '50%', insetBlockStart: '50%',
          transform: reduced ? 'translate(-50%,-50%)' : (open ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0.94)'),
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          width: 'calc(100% - 56px)', maxWidth: 300, background: 'var(--surface)', borderRadius: 'var(--radius-xl, 18px)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-3, 0 24px 48px rgba(0,0,0,0.4))', padding: '22px 20px 16px',
          transition: reduced ? 'opacity var(--dur-fast) var(--ease)' : 'transform var(--dur) var(--ease-spring), opacity var(--dur-fast) var(--ease)',
        }}
      >
        <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 999, background: destructive ? 'var(--danger-soft)' : 'var(--surface-active)', color: destructive ? 'var(--danger)' : 'var(--fg)', marginBlockEnd: 12 }}>
          {destructive ? <Icons.rollback size={18} /> : <Icons.info size={18} />}
        </span>
        <div id={titleId} style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBlockEnd: 4 }}>Roll back deploy?</div>
        <div id={descId} style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5, marginBlockEnd: 18 }}>
          Reverts <b style={{ color: 'var(--fg)' }}>payments-api</b> to v4.2.1. In-flight requests on v4.3.0 will drain first.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className={'btn ' + (destructive ? 'destructive' : 'ember')} tabIndex={open ? 0 : -1} style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
            {destructive ? 'Roll back' : 'Confirm'}
          </button>
          <button data-cancel className="btn ghost" tabIndex={open ? 0 : -1} style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  );
}

function DialogScreen() {
  const [open, setOpen] = React.useState(true);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const bgRef = React.useRef<HTMLDivElement>(null);
  const wasOpen = React.useRef(open);

  // Restore focus to the trigger when the dialog closes (open → closed only).
  React.useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button ref={triggerRef} className="btn ember sm" onClick={() => setOpen(true)}>Roll back</button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} destructive bgRef={bgRef} />
    </div>
  );
}

export default function MobileDialog() {
  return (
    <Section
      id="dialog"
      num="01"
      title="Dialog"
      desc="A centered modal interruption that blocks the screen until the user decides — a destructive confirm, an auth step, an unrecoverable error. Traps focus; dims everything behind it."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Use only when nothing else should proceed. For a menu of actions, reach for the Action sheet — it sits under the thumb and does not block the entire screen.</Lede>
      <Frame label="Tab is trapped inside the panel · Esc or scrim closes and returns focus to the trigger" center>
        <DeviceFrame initial="iphone-se"><DialogScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Standard confirm vs destructive — the danger action carries dark ink, not red text">
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', padding: 24 }}>
          {[false, true].map((d) => (
            <div key={String(d)} style={{ width: 240, background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-2)', padding: '18px 16px 14px' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 999, background: d ? 'var(--danger-soft)' : 'var(--surface-active)', color: d ? 'var(--danger)' : 'var(--fg)', marginBlockEnd: 10 }}>
                {d ? <Icons.rollback size={16} /> : <Icons.info size={16} />}
              </span>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{d ? 'Roll back deploy?' : 'Promote canary?'}</div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', margin: '4px 0 12px' }}>{d ? 'Reverts to v4.2.1.' : 'Sends 100% of traffic.'}</div>
              <button className={'btn sm ' + (d ? 'destructive' : 'ember')} style={{ width: '100%', justifyContent: 'center', marginBlockEnd: 6 }}>{d ? 'Roll back' : 'Promote'}</button>
              <button className="btn ghost sm" style={{ width: '100%', justifyContent: 'center' }}>Cancel</button>
            </div>
          ))}
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '60px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              <div style={{ background: 'rgba(8,9,10,0.5)', borderRadius: 16, padding: '20px 28px' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 16px 14px' }}>
                  <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 999, background: 'var(--danger-soft)', color: 'var(--danger)', marginBlockEnd: 10 }}><Icons.rollback size={16} /></span>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Roll back deploy?</div>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', margin: '4px 0 12px' }}>Reverts payments-api to v4.2.1.</div>
                  <button className="btn sm destructive" tabIndex={-1} style={{ width: '100%', justifyContent: 'center', marginBlockEnd: 6, cursor: 'default' }}>Roll back</button>
                  <button className="btn ghost sm" tabIndex={-1} style={{ width: '100%', justifyContent: 'center', cursor: 'default' }}>Cancel</button>
                </div>
              </div>
              <span className="lead h" style={{ top: 12, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 60, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 64, left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 30, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 5, left: -52 }}>1</div>
              <div className="pin" style={{ top: 52, right: -52 }}>2</div>
              <div className="pin" style={{ bottom: 56, left: -52 }}>3</div>
              <div className="pin" style={{ bottom: 22, left: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Scrim.</b> A 50–55% dim over the whole screen; content behind it is <Mono>inert</Mono> and <Mono>aria-hidden</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Icon + title + body.</b> One framing icon, a question-form title, and a single line naming exactly what will happen.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Primary action.</b> Full-width; ember for safe confirms, <Mono>.destructive</Mono> for destructive — always with dark ink on the fill.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Cancel.</b> A ghost button beneath, never less prominent than one tap away — Escape and scrim-tap also dismiss.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 10 }}>Keyboard</div>
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div className="kbd-row" role="listitem"><span className="label">Open / focus the Cancel route</span><span className="kbd-chord trailing"><kbd className="kbd">Enter</kbd></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Cycle within the panel (trapped)</span><span className="kbd-chord trailing"><kbd className="kbd">Tab</kbd> / <kbd className="kbd">⇧Tab</kbd></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Invoke the focused action</span><span className="kbd-chord trailing"><kbd className="kbd">Enter</kbd></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Dismiss, restore trigger focus</span><span className="kbd-chord trailing"><kbd className="kbd">Esc</kbd></span></div>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Role &amp; labelling</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>Destructive confirms use <Mono>role=&quot;alertdialog&quot;</Mono> with <Mono>aria-modal</Mono>, <Mono>aria-labelledby</Mono> the title and <Mono>aria-describedby</Mono> the consequence line. The screen behind is set <Mono>inert</Mono> + <Mono>aria-hidden</Mono> while open.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Focus &amp; dismiss paths</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>On open focus lands on Cancel — never the destructive default — and Tab is trapped inside the panel. <kbd className="kbd">Esc</kbd>, the Cancel button, and a scrim tap all close it; focus returns to the trigger so no one is stranded.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Colour + ink</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>The danger button uses a red fill with dark ink (full AA) plus a leading icon — risk is never signalled by red text alone. Under <Mono>prefers-reduced-motion</Mono> the scale-in drops to a plain cross-fade.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — body text and the leading icon align to the start (right); the centered modal and scrim are symmetric'} center code={`<div dir="rtl">{/* alertdialog */}</div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><DialogScreen /></DeviceFrame></div>
      </Frame>
      <Lede>Because the dialog is centered with <Mono>insetInlineStart: 50%</Mono> + <Mono>translate(-50%,-50%)</Mono>, the panel itself is symmetric — only its contents flow: the framing icon and title move to the right, the body line aligns to the start, and the stacked Roll back / Cancel buttons keep their full-width order. The scrim is direction-agnostic.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — one blocking decision, named</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 220, margin: '0 auto' }}>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Delete environment?</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', margin: '4px 0 10px' }}>staging-eu and its 14 secrets are removed.</div>
            <button className="btn sm destructive" style={{ justifyContent: 'center', marginBlockEnd: 6 }}>Delete</button>
            <button className="btn ghost sm" style={{ justifyContent: 'center' }}>Cancel</button>
          </div>
          <div className="note">A single consequence spelled out, two clear paths. The user can't proceed by accident.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — a menu of choices</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 220, margin: '0 auto', color: 'var(--fg-muted)' }}>
            <button className="btn sm" style={{ justifyContent: 'flex-start', marginBlockEnd: 6 }}>Promote</button>
            <button className="btn sm" style={{ justifyContent: 'flex-start', marginBlockEnd: 6 }}>Hold</button>
            <button className="btn sm" style={{ justifyContent: 'flex-start', marginBlockEnd: 6 }}>Roll back</button>
            <button className="btn sm" style={{ justifyContent: 'flex-start' }}>View run</button>
          </div>
          <div className="note">A centered modal full of options fights the thumb. A bottom Action sheet is reachable and dismissible.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="dialog"
        lang="tsx"
        code={`<div className="m-dialog-scrim" onClick={close} />
<div role="alertdialog" aria-modal="true"
  aria-labelledby="t" aria-describedby="d" className="m-dialog">
  <Icon /> <h2 id="t">Roll back deploy?</h2>
  <p id="d">Reverts payments-api to v4.2.1.</p>
  <button className="btn destructive">Roll back</button>
  <button className="btn ghost">Cancel</button>
</div>

/* trap focus on open, restore on close; mark page content inert.
   destructive = role alertdialog + .destructive button (dark ink on red). */`}
      />
      <p className="ds-caption" style={{ marginTop: 12 }}>
        For a non-blocking list of actions, use the <a href="/mobile/action-sheet.html" style={{ color: 'var(--ember)' }}>Action sheet</a>; for contextual detail, the <a href="/mobile/sheet.html" style={{ color: 'var(--ember)' }}>Bottom sheet</a>.
      </p>
    </Section>
  );
}
