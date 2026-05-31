'use client';
// Eidos Mobile — Menu. A small popover of actions anchored to its trigger (an overflow ⋯ or
// a labelled button), opening beside it rather than from the screen edge. Use it for a few
// inline actions where the anchor matters; for a longer object-scoped list, use the Action sheet.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Kbd } from '@/ds/core';

type Item = { label: string; icon: React.ReactNode; destructive?: boolean; check?: boolean };

function Menu({ open, items, onClose, align = 'end', triggerRef }: { open: boolean; items: Item[]; onClose: () => void; align?: 'start' | 'end'; triggerRef?: React.RefObject<HTMLButtonElement | null> }) {
  // Roving tabindex: exactly one item is tabbable at a time and holds DOM focus,
  // so the keyboard map this page documents (Arrow / Home / End / Escape) is real.
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = React.useState(0);
  // Skip the very first render so two demos shown open-by-default don't fight for
  // page focus on load; focus management only runs on a real open/close transition.
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (open) {
      setActive(0);
      const id = requestAnimationFrame(() => itemRefs.current[0]?.focus());
      return () => cancelAnimationFrame(id);
    }
    triggerRef?.current?.focus();
  }, [open, triggerRef]);

  const move = (next: number) => {
    const i = (next + items.length) % items.length;
    setActive(i);
    itemRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); move(active + 1); break;
      case 'ArrowUp':   e.preventDefault(); move(active - 1); break;
      case 'Home':      e.preventDefault(); move(0); break;
      case 'End':       e.preventDefault(); move(items.length - 1); break;
      case 'Escape':    e.preventDefault(); onClose(); break; // effect restores trigger focus
    }
  };

  if (!open) return null;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <div
        role="menu"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        style={{
          position: 'absolute', insetBlockStart: 50, [align === 'end' ? 'insetInlineEnd' : 'insetInlineStart']: 12,
          minWidth: 196, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-3)', padding: 6, transformOrigin: align === 'end' ? 'top right' : 'top left',
          animation: 'm-menu-in var(--dur-fast) var(--ease-spring)',
        }}
      >
        {items.map((it, i) => (
          <React.Fragment key={it.label}>
            {it.destructive && i > 0 && <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />}
            <button
              role="menuitem"
              ref={(el) => { itemRefs.current[i] = el; }}
              tabIndex={i === active ? 0 : -1}
              onClick={onClose}
              onMouseEnter={() => setActive(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', height: 40, padding: '0 10px', borderRadius: 'var(--radius-md)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'start', fontSize: 'var(--text-sm)', fontWeight: 500, color: it.destructive ? 'var(--danger)' : 'var(--fg)' }}
            >
              <span style={{ display: 'flex', color: it.destructive ? 'var(--danger)' : 'var(--fg-muted)' }}>{it.icon}</span>
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.check && <Icons.check size={14} color="var(--accent)" />}
            </button>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

function MenuScreen() {
  const [open, setOpen] = React.useState(true);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', insetBlockStart: 12, insetInline: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', borderBlockEnd: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700 }}>Deploys</span>
        <button ref={triggerRef} onClick={() => setOpen((o) => !o)} aria-label="More" aria-haspopup="menu" aria-expanded={open} className="btn icon"><Icons.more size={18} /></button>
      </div>
      <Menu open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} items={[
        { label: 'Newest first', icon: <Icons.sort size={15} />, check: true },
        { label: 'Group by service', icon: <Icons.layers size={15} /> },
        { label: 'Export CSV', icon: <Icons.download size={15} /> },
        { label: 'Clear history', icon: <Icons.trash size={15} />, destructive: true },
      ]} />
    </div>
  );
}

export default function MobileMenu() {
  return (
    <Section
      id="menu"
      num="01"
      title="Menu"
      desc="A compact popover of actions anchored to its trigger — an overflow button, sort, or inline more. Because it points back at what spawned it, the anchor carries context."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>When the action list is long or about one specific object, the bottom-edge Action sheet is the better thumb target — the menu is for short lists anchored to the control that triggered them.</Lede>
      <Frame label="Tap ⋯ in the bar · the menu opens from the trigger corner" center>
        <DeviceFrame initial="iphone-se"><MenuScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Items</SubHead>
      <Frame label="Plain · selected (ember check) · destructive (after a divider)">
        <div style={{ width: 220, margin: '0 auto', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-2)', padding: 6 }}>
          {[['Newest first', true, false], ['Group by service', false, false]].map(([l, c]) => (
            <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 10px', fontSize: 'var(--text-sm)' }}><Icons.sort size={15} color="var(--fg-muted)" /><span style={{ flex: 1 }}>{l}</span>{c && <Icons.check size={14} color="var(--accent)" />}</div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 10px', fontSize: 'var(--text-sm)', color: 'var(--danger)' }}><Icons.trash size={15} color="var(--danger)" /> Clear history</div>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '60px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBlockEnd: 6 }}>
                <span style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 8, background: 'var(--surface-active)' }}><Icons.more size={16} /></span>
              </div>
              <div style={{ marginInlineStart: 'auto', width: 200, background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-2)', padding: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 10px', fontSize: 'var(--text-sm)' }}><Icons.sort size={15} color="var(--fg-muted)" /><span style={{ flex: 1 }}>Newest first</span><Icons.check size={14} color="var(--accent)" /></div>
                <div style={{ height: 1, background: 'var(--border)', margin: '6px 4px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 38, padding: '0 10px', fontSize: 'var(--text-sm)', color: 'var(--danger)' }}><Icons.trash size={15} color="var(--danger)" /> Clear history</div>
              </div>
              <span className="lead h" style={{ top: 8, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 56, left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 22, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 1, right: -52 }}>1</div>
              <div className="pin" style={{ top: 48, left: -52 }}>2</div>
              <div className="pin" style={{ bottom: 14, left: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Trigger.</b> The ⋯ or button the menu belongs to; it carries <Mono>aria-haspopup</Mono> and flips <Mono>aria-expanded</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Items.</b> 40px rows on an elevated card, opening from the trigger corner. A selected item shows an ember check, never an ember background.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Divider + destructive.</b> A hairline separates a destructive verb, tinted <Mono>--danger</Mono>, from routine items.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>Every key below is wired into the live demo above — open the menu, then drive it from the keyboard. Roving <Mono>tabIndex</Mono> keeps exactly one item focusable; the rest is documented contract.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBottom: 12 }}>Keyboard map</div>
          <Kbd label="Move to next item" keys="↓" />
          <Kbd label="Move to previous item" keys="↑" />
          <Kbd label="Jump to first / last" keys={['Home', 'End']} />
          <Kbd label="Activate the focused item" keys={['↵', 'Space']} />
          <Kbd label="Close, restore focus to trigger" keys="Esc" />
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBottom: 12 }}>Roles &amp; state</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The trigger carries <Mono>aria-haspopup="menu"</Mono> and flips <Mono>aria-expanded</Mono>; the popover is a <Mono>role="menu"</Mono> (<Mono>aria-orientation="vertical"</Mono>) of <Mono>menuitem</Mono> buttons. Each focused item paints the canonical <Mono>:focus-visible</Mono> ring — never <Mono>outline:none</Mono> without a substitute.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBottom: 12 }}>Touch &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Items are 40px with full-width hit areas; on a handset too tight for the thumb, escalate to an Action sheet. A chosen item is marked by an ember check at the trailing edge, not a coloured fill — so it survives greyscale and every label keeps full text contrast.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-mono-label" style={{ marginBottom: 12 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The open scales in via <Mono>m-menu-in</Mono>; under <Mono>prefers-reduced-motion: reduce</Mono> ds.css drops the animation, so the popover appears in place with no transform.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the popover anchors to the trailing corner, so it opens from the left'} center code={`<div dir="rtl">{/* trigger + role=menu */}</div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><MenuScreen /></DeviceFrame></div>
      </Frame>
      <Lede>The menu pins to the trailing corner via <Mono>insetInlineEnd</Mono>, which is the left in RTL — so it opens from the left below the ⋯. Within each item the leading icon flips to the right and the selected ember check moves to the left (the trailing edge); the divider above the destructive Clear history stays full-width. The ⋯ is a non-directional glyph, so it isn't mirrored.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — a few inline actions, anchored</div>
          <div className="body" style={{ justifyContent: 'flex-end' }}>
            <div style={{ width: 180, background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)', padding: 5, fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', gap: 8, padding: '7px 8px' }}><Icons.sort size={14} /> Newest first</div>
              <div style={{ display: 'flex', gap: 8, padding: '7px 8px' }}><Icons.download size={14} /> Export</div>
            </div>
          </div>
          <div className="note">Two or three actions pointing back at the ⋯ that opened them.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — twelve items mid-screen</div>
          <div className="body" style={{ justifyContent: 'center', color: 'var(--fg-faint)', fontSize: 'var(--text-base)', flexDirection: 'column', alignItems: 'stretch', maxWidth: 180, margin: '0 auto' }}>
            {Array.from({ length: 6 }).map((_, i) => <span key={i} style={{ padding: '4px 8px' }}>Action {i + 1}…</span>)}
            <span style={{ padding: '4px 8px' }}>…six more</span>
          </div>
          <div className="note">A long floating list is hard to reach and easy to mis-tap. Move it to a bottom Action sheet.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="menu"
        lang="tsx"
        code={`<button aria-haspopup="menu" aria-expanded={open} onClick={toggle}>⋯</button>
{open && (
  <div role="menu" className="m-menu" /* opens from the trigger corner */>
    <button role="menuitem">Newest first <Icons.check /></button>
    <hr />
    <button role="menuitem" data-destructive>Clear history</button>
  </div>
)}

/* selected = trailing ember check; destructive = var(--danger) after a divider.
   Roving tabIndex: ↑/↓ move focus, Home/End jump, Enter/Space activate.
   Escape / outside-tap closes and restores focus to the trigger. */`}
      />
      <p className="ds-caption" style={{ marginTop: 12 }}>
        For a longer, object-scoped verb list, prefer the <a href="/mobile/action-sheet.html" style={{ color: 'var(--ember)' }}>Action sheet</a>.
      </p>
    </Section>
  );
}
