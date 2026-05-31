'use client';
// Forge Mobile — Swipe actions. Drag a row left to reveal trailing actions (archive, delete).
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Skeleton, Spinner, Empty, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';

const ACTIONS_W = 132;

const ACTION_LABEL: React.CSSProperties = {
  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 4, fontSize: 'var(--text-xs)', fontWeight: 600, border: 'none',
};

function SwipeRow({ name, svc, time, openInitial = false, onArchive, onDelete }: { name: string; svc: string; time: string; openInitial?: boolean; onArchive?: () => void; onDelete?: () => void }) {
  const [x, setX] = React.useState(openInitial ? -ACTIONS_W : 0);
  const drag = React.useRef<{ startX: number; base: number } | null>(null);
  const [grabbing, setGrabbing] = React.useState(false);
  // archived = the on-thesis undo window: the row collapses to an Undo strip
  // for a beat before it's gone, so a reflex archive is always recoverable.
  const [archived, setArchived] = React.useState(false);
  const open = x <= -ACTIONS_W / 2;

  const archive = () => { setArchived(true); onArchive?.(); };
  const undo = () => { setArchived(false); setX(0); };

  const onDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, base: x };
    setGrabbing(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.startX;
    setX(Math.max(-ACTIONS_W, Math.min(0, drag.current.base + dx)));
  };
  const onUp = () => {
    if (!drag.current) return;
    setX((cur) => (cur < -ACTIONS_W / 2 ? -ACTIONS_W : 0));
    drag.current = null;
    setGrabbing(false);
  };
  // keyboard fallback — the row is focusable; ←/→ open and close it, matching the swipe.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); setX(-ACTIONS_W); }
    else if (e.key === 'ArrowRight' || e.key === 'Escape') { e.preventDefault(); setX(0); }
  };

  // Undo strip — the row archived; offer a single recovery action.
  if (archived) {
    return (
      <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 14px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 8 }}><Icons.inbox size={14} color="var(--fg-subtle)" />Archived “{name}”</span>
        <button onClick={undo} className="btn ghost xs" aria-label={`Undo archiving ${name}`} style={{ color: 'var(--ember)' }}>Undo</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
      {/* trailing actions revealed underneath */}
      <div style={{ position: 'absolute', insetBlock: 0, insetInlineEnd: 0, width: ACTIONS_W, display: 'flex' }}>
        <button onClick={archive} tabIndex={open ? 0 : -1} aria-label={`Archive ${name}`} style={{ ...ACTION_LABEL, background: 'var(--surface-active)', color: 'var(--fg-muted)' }}><Icons.inbox size={16} />Archive</button>
        <button onClick={onDelete} tabIndex={open ? 0 : -1} aria-label={`Delete ${name}`} style={{ ...ACTION_LABEL, background: 'var(--danger)', color: 'var(--danger-fg)' }}><Icons.trash size={16} />Delete</button>
      </div>
      {/* draggable foreground — focusable so the actions stay keyboard-reachable */}
      <div
        role="button" tabIndex={0} aria-label={`${name}. Swipe or press the left arrow for actions`} aria-expanded={open}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}
        style={{ position: 'relative', background: 'var(--bg)', transform: `translateX(${x}px)`, transition: drag.current ? 'none' : 'transform 220ms var(--ease)', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px', touchAction: 'pan-y', cursor: grabbing ? 'grabbing' : 'grab' }}
      >
        <Icons.server size={16} color="var(--fg-muted)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', display: 'flex', gap: 6, alignItems: 'baseline' }}>
            <span>{svc}</span>
            <span aria-hidden="true">·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.01em' }}>{time}</span>
          </div>
        </div>
        <Icons.chevronLeft size={13} color="var(--fg-faint)" style={{ opacity: 0.5 }} />
      </div>
    </div>
  );
}

const SEED_ROWS = [
  { id: 'a', name: 'Deploy succeeded', svc: 'identity-svc', time: '9:38' },
  { id: 'b', name: 'Canary at 25%', svc: 'pix-router', time: '9:21' },
  { id: 'c', name: 'SLO budget at 38%', svc: 'fraud-scorer', time: '8:50' },
  { id: 'd', name: 'PR review requested', svc: 'payments-api', time: '8:12' },
];

function SwipeScreen() {
  const [rows, setRows] = React.useState(SEED_ROWS);
  const remove = (id: string) => setRows((r) => r.filter((row) => row.id !== id));
  const reset = () => setRows(SEED_ROWS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 44, flex: '0 0 auto' }} />
      <div style={{ padding: '4px 16px 12px', fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Notifications</div>
      <div style={{ flex: 1, overflow: 'auto' }} aria-label="Notifications list">
        {rows.length === 0 ? (
          <Empty size="sm" iconName="inbox" title="Inbox zero" desc="Every row archived or deleted." action={<button type="button" className="btn ghost xs" onClick={reset}>Restore demo</button>} />
        ) : rows.map((row, i) => (
          <SwipeRow key={row.id} name={row.name} svc={row.svc} time={row.time} openInitial={i === 0} onDelete={() => remove(row.id)} />
        ))}
      </div>
    </div>
  );
}

export default function MobileSwipe() {
  return (
    <Section id="swipe" num="01" title="Swipe actions"
      desc="Drag a row to the inline-end to reveal trailing actions — archive then delete. Use it to speed up per-row actions in a long list without cluttering every row with buttons.">
      <SubHead meta="interactive · drag a row left">Usage</SubHead>
      <Lede>Snap open past the halfway point; snap closed otherwise. Keep the destructive action last and tinted danger so a thumb never hits it by reflex — and give Archive an <b style={{ color: 'var(--fg)' }}>Undo</b> beat, since a recoverable mistake beats a confirm dialog on every swipe.</Lede>
      <Frame label="archive → undo · delete removes the row · clear the list for empty" center>
        <DeviceFrame initial="iphone-se"><SwipeScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="loading · empty · error · disabled">States</SubHead>
      <Lede>A swipe list isn{"'"}t one row — it{"'"}s a list with a lifecycle. Show the placeholder while rows stream in, an honest empty when there{"'"}s nothing to act on, an inline error when a swipe action fails, and a disabled action when the operation can{"'"}t run yet.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        {/* Loading — skeleton rows */}
        <Frame label="loading — rows stream in">
          <div role="status" aria-busy="true" aria-label="Loading notifications" style={{ width: '100%' }}>
            <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Loading notifications</span>
            {[0, 1, 2].map((i) => (
              <div key={i} aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px', borderBottom: '1px solid var(--border)' }}>
                <Skeleton variant="circle" size={16} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton variant="line" width="62%" height={11} />
                  <Skeleton variant="line" width="34%" height={9} />
                </div>
                <Spinner size="sm" aria-label="Loading row" />
              </div>
            ))}
          </div>
        </Frame>
        {/* Empty — inbox zero */}
        <Frame label="empty — nothing to act on" center>
          <Empty size="sm" iconName="inbox" title="Inbox zero" desc="No notifications to archive or delete. New alerts land here as they arrive." />
        </Frame>
        {/* Error — a swipe action failed */}
        <Frame label="error — the action failed">
          <Alert tone="danger">
            <AlertTitle>Couldn{"'"}t delete &ldquo;Deploy succeeded&rdquo;</AlertTitle>
            <AlertDescription>The row snapped back. The delete request to <Mono tone="subtle">identity-svc</Mono> timed out — your data is unchanged.</AlertDescription>
            <AlertActions><button type="button" className="btn ember xs" tabIndex={-1}>Retry</button><button type="button" className="btn ghost xs" tabIndex={-1}>Dismiss</button></AlertActions>
          </Alert>
        </Frame>
        {/* Disabled — action not yet available */}
        <Frame label="disabled — action unavailable" center>
          <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--border)', borderRadius: 12, width: '100%', maxWidth: 300 }}>
            <div style={{ position: 'absolute', insetBlock: 0, insetInlineEnd: 0, width: ACTIONS_W, display: 'flex' }}>
              <button disabled aria-label="Archive (unavailable while syncing)" style={{ ...ACTION_LABEL, background: 'var(--surface-active)', color: 'var(--fg-faint)', opacity: 0.55, cursor: 'not-allowed' }}><Icons.inbox size={16} />Archive</button>
              <button disabled aria-label="Delete (unavailable while syncing)" style={{ ...ACTION_LABEL, background: 'var(--surface-active)', color: 'var(--fg-faint)', opacity: 0.55, cursor: 'not-allowed' }}><Icons.trash size={16} />Delete</button>
            </div>
            <div style={{ position: 'relative', background: 'var(--bg)', transform: 'translateX(-100px)', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px' }}>
              <Spinner size="sm" color="var(--fg-subtle)" aria-label="Syncing row" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--fg-muted)' }}>Syncing…</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>actions disabled until the row settles</div>
              </div>
            </div>
          </div>
        </Frame>
      </div>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ position: 'absolute', insetBlock: 0, insetInlineEnd: 0, width: ACTIONS_W, display: 'flex' }}>
                  <div style={{ ...ACTION_LABEL, background: 'var(--surface-active)', color: 'var(--fg-muted)' }}><Icons.inbox size={16} />Archive</div>
                  <div style={{ ...ACTION_LABEL, background: 'var(--danger)', color: 'var(--danger-fg)' }}><Icons.trash size={16} />Delete</div>
                </div>
                <div style={{ position: 'relative', background: 'var(--bg)', transform: 'translateX(-100px)', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px' }}>
                  <Icons.server size={16} color="var(--fg-muted)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Deploy succeeded</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>identity-svc · <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>9:38</span></div>
                  </div>
                </div>
              </div>
              <span className="lead h" style={{ top: 24, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, right: 50, height: 18 }} />
              <span className="lead v" style={{ bottom: -22, right: 88, height: 18 }} />
              <span className="lead v" style={{ bottom: -22, right: 22, height: 18 }} />
              <span className="lead h" style={{ top: 24, right: -28, width: 24 }} />
              <div className="pin" style={{ top: 15, left: -52 }}>1</div>
              <div className="pin" style={{ top: -42, right: 50, transform: 'translateX(50%)' }}>2</div>
              <div className="pin" style={{ bottom: -42, right: 88, transform: 'translateX(50%)' }}>3</div>
              <div className="pin" style={{ bottom: -42, right: 22, transform: 'translateX(50%)' }}>4</div>
              <div className="pin" style={{ top: 15, right: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Foreground row.</b> The draggable content (icon, label, meta) that slides over the actions.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Trailing actions.</b> Revealed underneath at the inline-end — quiet first, danger last.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Archive (quiet).</b> Surface-tinted, reversible action nearest the row edge.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Delete (danger).</b> Danger-filled with <b style={{ color: 'var(--fg)' }}>danger-fg ink</b>, placed furthest so it isn{"'"}t hit by reflex.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Snap threshold.</b> Past half the action width the row snaps open; before it, it snaps closed.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>The row in the demo above is a focusable <Mono>role=&quot;button&quot;</Mono>; tab to it and the canonical ember focus ring appears. The keyboard map mirrors the swipe, so the gesture is never the only way in.</Lede>
      <div className="surface" style={{marginTop: 12, padding: 18}}>
        <div style={{fontWeight: 600, marginBottom: 12}}>Keyboard</div>
        <dl style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 16px', margin: 0, alignItems: 'baseline'}}>
          <dt style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>Tab</dt>
          <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Move focus to the next row; the focus ring marks the active row. Tab again into an open row's <b style={{color:'var(--fg)'}}>Archive</b> then <b style={{color:'var(--fg)'}}>Delete</b> buttons.</dd>
          <dt style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>&larr;</dt>
          <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Open the focused row, revealing its trailing actions (the keyboard equivalent of swiping toward the inline-end).</dd>
          <dt style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>&rarr; / Esc</dt>
          <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Snap the row closed and hide the actions.</dd>
          <dt style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.04em'}}>Enter</dt>
          <dd style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Invoke the focused action — Archive collapses the row into an <b style={{color:'var(--fg)'}}>Undo</b> strip, Delete removes it (try it in the demo above). The row stays a <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>44px</span> target closed; each open action is a full-height <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>~66px</span>-wide button, well past <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>44&times;44px</span>.</dd>
        </dl>
      </div>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>ARIA state</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The row carries <Mono>aria-expanded</Mono> that flips true when the actions are revealed; each action button has an <Mono>aria-label</Mono> binding the verb to the row name (&quot;Delete Deploy succeeded&quot;), and hidden actions are pulled from the tab order with <Mono>tabindex=-1</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>VoiceOver / TalkBack</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The actions are exposed as the row's <b style={{color:'var(--fg)'}}>accessibility custom actions / context menu</b>, announced as "Actions available: Archive, Delete" — so a screen-reader user reaches them without performing the swipe.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Gesture has a fallback</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Swipe is never the only path: the same actions are always reachable from the row's detail screen or a long-press menu, so anyone who can't drag still archives and deletes.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The snap transition shortens under <Mono tone="subtle">prefers-reduced-motion</Mono>. Action labels keep AA contrast on their fills — <b style={{color:'var(--fg)'}}>danger-fg</b> on danger, <b style={{color:'var(--fg)'}}>muted</b> on surface — and each action carries an icon plus a word, not colour alone.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the trailing actions reveal from the leading (left) side'} center code={`<div dir="rtl" className="m-swipe">
  {/* actions pinned with insetInlineEnd surface on the left in RTL */}
  <div className="m-swipe-actions"><Archive/><Delete/></div>
  <div className="m-swipe-fg">…</div>
</div>`} lang="tsx">
        <div dir="rtl" style={{ maxWidth: 320, margin: '0 auto', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <SwipeRow name="Deploy succeeded" svc="identity-svc" time="9:38" openInitial />
          <SwipeRow name="Canary at 25%" svc="pix-router" time="9:21" />
        </div>
      </Frame>
      <Lede>The actions are pinned with <Mono>insetInlineEnd</Mono>, so in RTL you swipe toward the inline-end and the archive/delete buttons appear on the <b style={{ color: 'var(--fg)' }}>leading (left)</b> side; the destructive Delete still sits last. The row's chevron affordance is directional — point it with a logical <Mono>chevron-start</Mono> glyph (or a <Mono>scaleX(-1)</Mono> mirror) so it tracks the swipe in either direction.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — danger last</div>
          <div className="body" style={{gap:0, padding:0}}>
            <div style={{display:'flex', width:'100%'}}>
              <span style={{flex:1, padding:'12px 0', textAlign:'center', background:'var(--surface-active)', color:'var(--fg-muted)', fontSize: 'var(--text-xs)', fontWeight:600}}>Archive</span>
              <span style={{flex:1, padding:'12px 0', textAlign:'center', background:'var(--danger)', color:'var(--danger-fg)', fontSize:'var(--text-xs)', fontWeight:600}}>Delete</span>
            </div>
          </div>
          <div className="note">Quiet archive nearest the edge, danger delete furthest. A reflex swipe lands on the safe action.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — destructive at the edge</div>
          <div className="body" style={{gap:0, padding:0}}>
            <div style={{display:'flex', width:'100%'}}>
              <span style={{flex:1, padding:'12px 0', textAlign:'center', background:'var(--danger)', color:'var(--danger-fg)', fontSize:'var(--text-xs)', fontWeight:600}}>Delete</span>
              <span style={{flex:1, padding:'12px 0', textAlign:'center', background:'var(--surface-active)', color:'var(--fg-muted)', fontSize: 'var(--text-xs)', fontWeight:600}}>Archive</span>
            </div>
          </div>
          <div className="note">Delete nearest the edge invites accidental data loss on an over-swipe. Keep destructive furthest.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock label="swipe row" lang="tsx" code={`const [x, setX] = useState(0);
const open = x <= -actionsW / 2;
// clamp drag to [-actionsW, 0]; on release snap to whichever side is closer
// keyboard fallback — the row is focusable; arrows mirror the swipe
const onKey = (e) => {
  if (e.key === 'ArrowLeft') setX(-actionsW);          // reveal actions
  if (e.key === 'ArrowRight' || e.key === 'Escape') setX(0); // hide
};
<div className="m-swipe">
  <div className="m-swipe-actions">
    <Archive tabIndex={open ? 0 : -1} aria-label={\`Archive \${name}\`} />
    <Delete  tabIndex={open ? 0 : -1} aria-label={\`Delete \${name}\`} />
  </div>
  <div className="m-swipe-fg" role="button" tabIndex={0} aria-expanded={open}
       style={{ transform: \`translateX(\${x}px)\` }}
       onPointerMove={onMove} onPointerUp={snap} onKeyDown={onKey}>…</div>
</div>`} />
    </Section>
  );
}
