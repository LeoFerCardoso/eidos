'use client';
// Forge Mobile — Bottom sheet (scaffold). The mobile counterpart of a popover/dialog:
// an edge-anchored panel with a grab handle, for actions and contextual detail.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Spinner, Skeleton, Alert, AlertTitle, AlertDescription } from '@/ds/core';

let sheetSeq = 0;

type SheetPhase = 'idle' | 'committing' | 'done';

function SheetDemo() {
  const [open, setOpen] = React.useState(true);
  const [phase, setPhase] = React.useState<SheetPhase>('idle');
  const [chosen, setChosen] = React.useState<string | null>(null);
  const titleId = React.useMemo(() => `m-sheet-title-${++sheetSeq}`, []);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const actions = ['Promote to 100%', 'Hold canary', 'View run'];
  const busy = phase === 'committing';

  // Focus management: trap inside the panel while open, restore to the trigger on close.
  React.useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const sel = 'button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])';
    const first = panel.querySelector<HTMLElement>(sel);
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(sel));
      if (nodes.length === 0) return;
      const lo = nodes[0], hi = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === lo) { e.preventDefault(); hi.focus(); }
      else if (!e.shiftKey && document.activeElement === hi) { e.preventDefault(); lo.focus(); }
    };
    panel.addEventListener('keydown', onKey);
    return () => panel.removeEventListener('keydown', onKey);
  }, [open]);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const close = React.useCallback(() => {
    setOpen(false);
    // Restore focus to the trigger so keyboard users land where they left off.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // The sheet performs the deploy it documents: a primary pick commits in place
  // (rows lock + a busy line), then resolves to a confirmed line before closing.
  const pick = React.useCallback((a: string, primary: boolean) => {
    setChosen(a);
    if (!primary) { close(); return; }
    setPhase('committing');
    timer.current = setTimeout(() => {
      setPhase('done');
      timer.current = setTimeout(close, 900);
    }, 1100);
  }, [close]);

  const reopen = React.useCallback(() => { setPhase('idle'); setChosen(null); setOpen(true); }, []);

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <button ref={triggerRef} className="btn ember sm" aria-haspopup="dialog" aria-expanded={open} onClick={reopen}>Open sheet</button>
        {chosen && !open && (
          <span className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }} aria-live="polite">{chosen}</span>
        )}
      </div>
      {open && <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.45)' }} aria-hidden="true" onClick={busy ? undefined : close} />}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!open}
        aria-busy={busy}
        style={{
          position: 'absolute', insetInline: 0, insetBlockEnd: 0,
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--dur-slow) var(--ease-spring)',
          background: 'var(--surface)', borderStartStartRadius: 'var(--radius-2xl)', borderStartEndRadius: 'var(--radius-2xl)',
          borderBlockStart: '1px solid var(--border)', padding: '10px 16px 20px',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)', margin: '0 auto 14px' }} />
        <div id={titleId} style={{ fontWeight: 600, fontSize: 'var(--text-md)', marginBottom: 4 }}>Deploy identity-svc</div>
        <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', marginBottom: 14 }}>
          Promote the canary to <span className="t-mono" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--fg)' }}>100%</span> across all rings.
        </div>
        {phase === 'done' ? (
          <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 6px', color: 'var(--success)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
            <Icons.check size={16} /> Promoted to <span className="t-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>100%</span> — all rings live.
          </div>
        ) : (
          actions.map((a, i) => (
            <button
              key={a}
              className={'btn ' + (i === 0 ? 'ember' : '')}
              disabled={busy}
              aria-busy={busy && i === 0}
              style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 8 }}
              onClick={() => pick(a, i === 0)}
            >
              {busy && i === 0
                ? <Spinner size={14} color="var(--ember-fg)" aria-label="Promoting" />
                : i === 0 ? <Icons.rocket size={14} /> : <Icons.chevronRight size={14} />}
              {busy && i === 0 ? 'Promoting…' : a}
            </button>
          ))
        )}
        {phase !== 'done' && (
          <button className="btn ghost" disabled={busy} style={{ width: '100%', justifyContent: 'center' }} onClick={close}>Cancel</button>
        )}
      </div>
    </>
  );
}

// A non-interactive snapshot of the sheet panel — shared chrome (handle, title,
// subtext) so each State card shows the same surface, only the body differs.
function SheetSnapshot({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface-overlay)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '8px 14px 14px', maxWidth: 280, margin: '0 auto' }}>
      <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)', margin: '0 auto 12px' }} />
      <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', marginBottom: 2 }}>Deploy identity-svc</div>
      <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', marginBottom: 12 }}>Promote the canary across all rings.</div>
      {children}
    </div>
  );
}

function StateCard({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="surface" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <span className="t-mono-label">{label}</span>
      {children}
      <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55, marginBlockStart: 'auto' }}>{hint}</div>
    </div>
  );
}

export default function MobileSheet() {
  return (
    <Section
      id="sheet"
      num="01"
      title="Bottom sheet"
      desc="An edge-anchored panel with a grab handle that slides up over a scrim — for confirmations, action lists, and contextual detail. Centered dialogs fight the thumb; this does not."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Reach for the bottom sheet instead of a centered modal whenever the decision is short and the trigger is near the bottom of the screen, within thumb reach.</Lede>
      <Frame label="Slides up over a scrim · grab handle · pick the primary action to watch it commit" center>
        <DeviceFrame><SheetDemo /></DeviceFrame>
      </Frame>

      <SubHead meta="idle · committing · resolved · empty · error">States</SubHead>
      <Lede>A sheet is rarely just a static menu — it commits an action. Each panel below is a fixed snapshot of one state the live demo above moves through, so a builder can see exactly what to render.</Lede>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <StateCard label="committing" hint="Rows lock, the primary row swaps to a spinner, the panel sets aria-busy. Scrim taps are ignored mid-flight.">
          <SheetSnapshot>
            <button className="btn ember" disabled aria-busy="true" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 8 }}>
              <Spinner size={14} color="var(--ember-fg)" aria-label="Promoting" /> Promoting…
            </button>
            <button className="btn" disabled style={{ width: '100%', justifyContent: 'flex-start' }}>Hold canary</button>
          </SheetSnapshot>
        </StateCard>
        <StateCard label="resolved" hint="The committed action collapses to a single confirmed line (role=status), then the sheet auto-dismisses.">
          <SheetSnapshot>
            <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', color: 'var(--success)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              <Icons.check size={16} /> Promoted to <span className="t-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>100%</span> — all rings live.
            </div>
          </SheetSnapshot>
        </StateCard>
        <StateCard label="empty" hint="No action is available yet (the run is still gating). Show why, not a blank panel — never an empty list.">
          <SheetSnapshot>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0', textAlign: 'center', color: 'var(--fg-muted)' }}>
              <Skeleton variant="circle" size={28} />
              <div style={{ fontSize: 'var(--text-sm)' }}>No actions yet — the canary is still gating.</div>
              <div className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>3 of 5 checks passed</div>
            </div>
          </SheetSnapshot>
        </StateCard>
        <StateCard label="error" hint="A failed commit surfaces an inline danger Alert (role=alert) above the rows so the user can retry without losing context.">
          <SheetSnapshot>
            <Alert tone="danger" style={{ marginBottom: 10, textAlign: 'start' }}>
              <AlertTitle>Promotion failed</AlertTitle>
              <AlertDescription>Ring <span className="t-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>eu-west-1</span> rejected the canary. Hold and retry.</AlertDescription>
            </Alert>
            <button className="btn ember" style={{ width: '100%', justifyContent: 'flex-start' }}><Icons.rocket size={14} /> Retry promote</button>
          </SheetSnapshot>
        </StateCard>
      </div>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              <div style={{ background: 'rgba(8,9,10,0.45)', borderRadius: 16, padding: '24px 12px 12px' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 16px 18px' }}>
                  <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--border-strong)', margin: '0 auto 12px' }} />
                  <div style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Roll back deploy?</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginTop: 2 }}>Reverts payments-api to v4.2.1.</div>
                  <button className="btn ember" tabIndex={-1} style={{ width: '100%', marginTop: 12, cursor: 'default' }}>Roll back</button>
                  <button className="btn ghost" tabIndex={-1} style={{ width: '100%', marginTop: 8, cursor: 'default' }}>Cancel</button>
                </div>
              </div>
              <span className="lead h" style={{ top: 8, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 56, left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 64, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 28, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: -1, left: -52 }}>1</div>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 47, left: -52 }}>3</div>
              <div className="pin" style={{ bottom: 55, right: -52 }}>4</div>
              <div className="pin" style={{ bottom: 19, right: -52 }}>5</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>6</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Scrim.</b> Dimmed overlay behind the panel; tapping it dismisses the sheet.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Grab handle.</b> 36×4px pill at the top edge signalling drag-to-dismiss.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Title + subtext.</b> One-line decision name with a short supporting line.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Action list.</b> Full-width buttons; at most one ember for the primary action.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Cancel.</b> Trailing ghost button — an explicit escape beside tap-scrim and drag-down.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Safe-area inset.</b> Trailing-block padding via <Mono>env(safe-area-inset-bottom)</Mono> clears the home indicator.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 10}}>Keyboard</div>
          <dl style={{margin: 0, display:'grid', gridTemplateColumns:'auto 1fr', columnGap: 14, rowGap: 8, alignItems:'baseline'}}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Move to the next action; focus is <b style={{color:'var(--fg)'}}>trapped</b> inside the open panel and wraps from the last control back to the first.</dd>
            <dt><kbd className="kbd">Shift</kbd> <kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Move to the previous action; from the first control it wraps to the last.</dd>
            <dt><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Activate the focused action. The primary row then commits in place: it locks the list and sets <Mono>aria-busy</Mono> until it resolves.</dd>
            <dt><kbd className="kbd">Esc</kbd></dt>
            <dd className="t-small" style={{margin: 0, color:'var(--fg-muted)', lineHeight: 1.55}}>Close the sheet; focus is restored to the trigger so a keyboard user lands exactly where they left off.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>ARIA &amp; screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The panel is <Mono>role="dialog"</Mono> + <Mono>aria-modal="true"</Mono>, named by its title via <Mono>aria-labelledby</Mono>, and toggles <Mono>aria-hidden</Mono> when closed. The trigger carries <Mono>aria-haspopup="dialog"</Mono> + <Mono>aria-expanded</Mono>. During a commit the panel sets <Mono>aria-busy</Mono>; the resolved line is a <Mono>role="status"</Mono> live region and an error surfaces as a <Mono>role="alert"</Mono> danger alert.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>Touch &amp; gesture fallback</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Every action row is full-width and clears the 44px touch target with 8px between rows so a thumb can't double-hit. Drag-to-dismiss is only a shortcut: a visible Cancel button, <Mono>Esc</Mono>, and a scrim tap all close the sheet — no one is stranded if they can't perform the drag.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-small" style={{fontWeight: 600, marginBlockEnd: 6}}>Motion &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The spring slide-up softens to a quick fade under <Mono>prefers-reduced-motion</Mono>, and the busy spinner swaps to an opacity pulse. The panel and its text hold AA over the scrim; the ember action carries dark ink (<Mono>--ember-fg</Mono>), never ember text.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — full-width action labels and any leading icon align to the start (right)'} center code={`<div dir="rtl">{/* bottom sheet */}</div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame><SheetDemo /></DeviceFrame></div>
      </Frame>
      <Lede>The edge-anchored panel (<Mono>insetInline:0</Mono>) and its centered grab handle are symmetric, so only the contents flow: the title, body, and each <Mono>justify-content:flex-start</Mono> action label align to the start (now the right), and any leading row icon follows. The <Mono>chevronRight</Mono> on the secondary rows is directional and should carry <Mono>scaleX(-1)</Mono> so it still points along the reading direction; the safe-area <Mono>env(safe-area-inset-bottom)</Mono> inset is unaffected.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one decision, short list</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap:8, color:'var(--fg-muted)'}}>
            <div style={{width:36, height:4, borderRadius:999, background:'var(--border-strong)', margin:'0 auto 4px'}}/>
            <button className="btn ember" style={{justifyContent:'flex-start'}}><Icons.rocket size={14}/> Promote to 100%</button>
            <button className="btn" style={{justifyContent:'flex-start'}}>Hold canary</button>
            <button className="btn ghost" style={{justifyContent:'center'}}>Cancel</button>
          </div>
          <div className="note">A handle, two or three actions, and an explicit Cancel. Shallow enough to read in one glance.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — pack a full form</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap:6, color:'var(--fg-faint)'}}>
            <span className="in-control" style={{padding:'6px 8px', fontSize:'var(--text-sm)'}}>Service name</span>
            <span className="in-control" style={{padding:'6px 8px', fontSize:'var(--text-sm)'}}>Region</span>
            <span className="in-control" style={{padding:'6px 8px', fontSize:'var(--text-sm)'}}>Strategy</span>
            <span style={{fontSize:'var(--text-xs)'}}>…six more fields, scrolling under the keyboard</span>
          </div>
          <div className="note">A scrolling form fights the keyboard and the drag gesture. Push a full screen instead.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="sheet motion"
        lang="css"
        code={`.m-sheet {
  transform: translateY(100%);
  transition: transform var(--dur-slow) var(--ease-spring);
  border-start-start-radius: var(--radius-2xl);
  border-start-end-radius: var(--radius-2xl);
  padding-block-end: max(20px, env(safe-area-inset-bottom));
}
.m-sheet[data-open="true"] { transform: translateY(0); }
/* role="dialog" aria-modal aria-labelledby; Tab traps inside, Escape +
   scrim-tap + Cancel all close, focus restores to the trigger on close.
   A committing action sets aria-busy + disables the rows; the result is a
   role="status" line, a failure a role="alert" danger Alert. */`}
      />
      <p className="ds-caption" style={{ marginTop: 12 }}>
        The bottom sheet is the mobile sibling of the desktop <a href="/sidesheet" style={{ color: 'var(--ember)' }}>sidesheet</a> and <a href="/drawer" style={{ color: 'var(--ember)' }}>drawer</a>.
      </p>
    </Section>
  );
}
