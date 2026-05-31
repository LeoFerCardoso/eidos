'use client';
// Eidos Mobile — Navigation drawer. A panel that slides in from the inline-start edge over a
// scrim, holding top-level destinations and account context. Use it when there are more areas
// than a Tab bar's 3–5 slots; reach for it from a hamburger in the app bar, never as the only
// way to reach a primary screen.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

type NavItem = { label: string; icon: React.ReactNode; badge?: string };
const NAV: NavItem[] = [
  { label: 'Home', icon: <Icons.home size={18} /> },
  { label: 'Services', icon: <Icons.server size={18} /> },
  { label: 'Deploys', icon: <Icons.rocket size={18} />, badge: '3' },
  { label: 'Incidents', icon: <Icons.incident size={18} /> },
  { label: 'Pipelines', icon: <Icons.pipeline size={18} /> },
];

// Honours the OS "reduce motion" setting at runtime: the slide/spring becomes a
// plain fade so the documented reduced-motion behaviour is real, not just prose.
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

function Drawer({ open, onClose, active = 1 }: { open: boolean; onClose: () => void; active?: number }) {
  const innerRef = React.useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // Real keyboard contract: Escape closes; Tab is trapped to the panel while open.
  React.useEffect(() => {
    if (!open) return;
    const panel = innerRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    // Move focus into the panel so the trap has somewhere to start.
    panel?.querySelector<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const ease = reduced ? 'var(--ease)' : 'var(--ease-spring)';
  const dur = reduced ? 'var(--dur-fast)' : 'var(--dur-slow)';
  return (
    <>
      <div
        style={{
          position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.5)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--dur) var(--ease)',
        }}
        onClick={onClose}
      />
      <nav
        ref={innerRef}
        aria-label="Primary"
        aria-hidden={!open}
        inert={!open}
        style={{
          position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '78%', maxWidth: 300,
          background: 'var(--bg-elevated)', borderInlineEnd: '1px solid var(--border)', boxShadow: 'var(--shadow-4)',
          // Reduced motion: skip the X-translate spring, fade in place instead.
          transform: reduced ? 'none' : (open ? 'translateX(0)' : 'translateX(-102%)'),
          opacity: reduced ? (open ? 1 : 0) : 1,
          visibility: open ? 'visible' : (reduced ? 'hidden' : 'visible'),
          pointerEvents: open ? 'auto' : 'none',
          transition: reduced ? `opacity ${dur} ${ease}` : `transform ${dur} ${ease}`,
          display: 'flex', flexDirection: 'column', padding: '52px 12px 12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 14px', marginBlockEnd: 8, borderBlockEnd: '1px solid var(--border)' }}>
          <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 10, background: 'var(--surface-active)', color: 'var(--fg)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>F</span>
          <span><span style={{ display: 'block', fontWeight: 700, fontSize: 'var(--text-sm)' }}>Eidos Platform</span><span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>acme-prod</span></span>
        </div>
        {NAV.map((it, i) => (
          <button
            key={it.label}
            aria-current={i === active ? 'page' : undefined}
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', height: 46, padding: '0 12px', borderRadius: 'var(--radius-md)',
              border: 'none', cursor: 'pointer', textAlign: 'start', fontSize: 'var(--text-sm)', fontWeight: i === active ? 650 : 500,
              background: i === active ? 'var(--surface-active)' : 'transparent', color: i === active ? 'var(--fg)' : 'var(--fg-muted)',
            }}
          >
            <span style={{ display: 'flex', color: i === active ? 'var(--accent)' : 'var(--fg-muted)' }}>{it.icon}</span>
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.badge && <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', display: 'grid', placeItems: 'center' }}>{it.badge}</span>}
          </button>
        ))}
        <div style={{ marginBlockStart: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px 0', borderBlockStart: '1px solid var(--border)' }}>
          <span style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: 999, background: 'var(--surface-active)', fontSize: 12, fontWeight: 700 }}>JD</span>
          <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>Jordan Diaz</span>
          <Icons.settings size={16} color="var(--fg-muted)" />
        </div>
      </nav>
    </>
  );
}

function DrawerScreen() {
  const [open, setOpen] = React.useState(false);
  const hamburgerRef = React.useRef<HTMLButtonElement | null>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    // Return focus to the control that opened it — a closed drawer must not
    // strand the keyboard on a now-hidden element.
    hamburgerRef.current?.focus();
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Backing screen — made inert + aria-hidden while the drawer is open so
          neither pointer nor screen reader can reach the content behind it. */}
      <div
        inert={open}
        aria-hidden={open || undefined}
        style={{ position: 'absolute', inset: 0 }}
      >
        <div style={{ position: 'absolute', insetBlockStart: 12, insetInline: 0, height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', borderBlockEnd: '1px solid var(--border)' }}>
          <button ref={hamburgerRef} onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="btn icon"><Icons.menu size={18} /></button>
          <span style={{ fontWeight: 700 }}>Services</span>
        </div>
        <div style={{ position: 'absolute', insetBlockStart: 56, insetInline: 0, insetBlockEnd: 0, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>3 healthy</span>
          <div style={{ height: 64, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }} />
          <div style={{ height: 64, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }} />
        </div>
      </div>
      <Drawer open={open} onClose={close} active={1} />
    </div>
  );
}

export default function MobileDrawer() {
  return (
    <Section
      id="drawer"
      num="01"
      title="Navigation drawer"
      desc="A panel that slides from the inline-start edge for destinations and account context that do not fit the Tab bar. Opens from a hamburger; mirrors automatically in RTL."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Layer the drawer over content the user can return to. Never gate a primary screen behind it alone — critical destinations belong in the Tab bar.</Lede>
      <Frame label="Tap the hamburger · slides in over a scrim · Esc, tap-outside, or picking a row closes it" center>
        <DeviceFrame initial="iphone-se"><DrawerScreen /></DeviceFrame>
      </Frame>
      <Lede up>It opens closed: tap the hamburger to slide it in. While open, focus is trapped to the panel, <Mono>Esc</Mono> closes it and returns focus to the hamburger, and the screen behind goes <Mono>inert</Mono>. Toggle your OS "reduce motion" setting and re-open — the spring collapses to a plain fade.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '56px 36px 52px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ position: 'relative', height: 240, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', background: 'rgba(8,9,10,0.4)' }}>
                <div style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '76%', background: 'var(--bg-elevated)', borderInlineEnd: '1px solid var(--border)', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBlockEnd: 10, borderBlockEnd: '1px solid var(--border)' }}><span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', color: 'var(--ember-fg)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12 }}>F</span><span style={{ fontWeight: 700, fontSize: 12 }}>Eidos Platform</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 8px', borderRadius: 8, background: 'var(--surface-active)', fontSize: 12, fontWeight: 650 }}><Icons.server size={14} color="var(--accent)" /> Services</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 34, padding: '0 8px', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}><Icons.rocket size={14} /> <span style={{ flex: 1 }}>Deploys</span><span style={{ minWidth: 16, height: 16, borderRadius: 999, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center' }}>3</span></div>
                </div>
              </div>
              <span className="lead h" style={{ top: 30, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 96, left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 40, right: -28, width: 24 }} />
              <div className="pin" style={{ top: 22, right: -52 }}>1</div>
              <div className="pin" style={{ top: 88, left: -52 }}>2</div>
              <div className="pin" style={{ bottom: 32, right: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '52px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Scrim.</b> The dimmed remainder of the screen stays visible so the user keeps their place; tapping it closes the drawer.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Header + items.</b> A product/tenant header over 46px destination rows. The current page is filled with <Mono>--surface-active</Mono> and an ember icon.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Count badge.</b> A pill with <b style={{ color: 'var(--fg)' }}>dark ink on the ember fill</b> — never ember text on ember.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>Every behaviour below is wired into the live demo above — open it and try the keys.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <div className="kbd-row"><span className="kbd">Enter</span><span className="label" style={{ color: 'var(--fg-muted)' }}>on the hamburger — opens; focus jumps to the first row</span></div>
          <div className="kbd-row"><span className="kbd">Tab</span><span className="label" style={{ color: 'var(--fg-muted)' }}>cycles the rows; wraps at the ends — focus is trapped to the panel</span></div>
          <div className="kbd-row"><span className="kbd">Esc</span><span className="label" style={{ color: 'var(--fg-muted)' }}>closes and returns focus to the hamburger</span></div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Roles &amp; landmark</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The panel is a <Mono>nav</Mono> landmark; the active row carries <Mono>aria-current=&quot;page&quot;</Mono>. The hamburger reports <Mono>aria-expanded</Mono>, and while open the backing screen is <Mono>inert</Mono> + <Mono>aria-hidden</Mono> so neither pointer nor reader reaches it.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The current page reads from fill + weight + an ember icon, never colour alone. The count badge is dark ink (<Mono>--ember-fg</Mono>) on the ember fill — never ember-on-ember.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>A live <Mono>matchMedia(&quot;(prefers-reduced-motion: reduce)&quot;)</Mono> check swaps the inline-start spring for a plain opacity fade — no slide, no overshoot.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the panel slides in from the right; the scrim covers the left'} center code={`<nav style={{ insetInlineStart: 0, transform: 'translateX(-102%)' }} /> {/* start edge = right in RTL */}`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><DrawerScreen /></DeviceFrame></div>
      </Frame>
      <Lede>Built on logical properties, the panel is pinned to <Mono>inset-inline-start</Mono> — the right edge under <Mono>dir="rtl"</Mono> — so it slides in from the right while the scrim dims the left. Each nav row's leading icon moves to the right and the count badge to the left; the icons are non-directional, so none takes a <Mono>scaleX(-1)</Mono> flip.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — overflow areas, current marked</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch', maxWidth: 200, margin: '0 auto', fontSize: 'var(--text-base)' }}>
            <span style={{ display: 'flex', gap: 10, alignItems: 'center', height: 34, padding: '0 8px', borderRadius: 8, background: 'var(--surface-active)', fontWeight: 650 }}><Icons.server size={14} color="var(--accent)" /> Services</span>
            <span style={{ display: 'flex', gap: 10, alignItems: 'center', height: 34, padding: '0 8px', color: 'var(--fg-muted)' }}><Icons.pipeline size={14} /> Pipelines</span>
          </div>
          <div className="note">The destinations that don't fit a Tab bar, with the current page clearly held.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — hide the only path to a core screen</div>
          <div className="body" style={{ justifyContent: 'center', color: 'var(--fg-faint)', fontSize: 'var(--text-base)', textAlign: 'center', padding: '0 14px' }}>
            The single most-used screen reachable <i>only</i> behind a hamburger
          </div>
          <div className="note">A drawer is discovered late. Keep the 3–5 primary destinations in a fixed Tab bar.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="drawer"
        lang="tsx"
        code={`<button aria-label="Open menu" aria-expanded={open} onClick={open}><Icons.menu /></button>

{/* backing screen — inert + aria-hidden while open */}
<div inert={open} aria-hidden={open || undefined}>…app content</div>

<div className="m-drawer-scrim" onClick={close} />     {/* Esc + tap-outside */}
<nav aria-label="Primary" className="m-drawer" data-open={open}>
  …header, destination rows (aria-current="page"), account footer
</nav>

/* width 78% / max 300; transform: translateX(-102%) → 0 from inline-start.
   on open: focus → first row, Tab trapped, Esc closes + returns focus to ⌘.
   prefers-reduced-motion: reduce → the spring becomes an opacity fade.
   logical props mirror the whole thing in RTL. */`}
      />
      <p className="ds-caption" style={{ marginTop: 12 }}>
        Keep primary destinations in the <a href="/mobile/tab-bar.html" style={{ color: 'var(--ember)' }}>Tab bar</a>; the drawer is for the overflow.
      </p>
    </Section>
  );
}
