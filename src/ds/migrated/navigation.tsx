'use client';
// Eidos DS — Components / Navigation Menu
// Page standard: Installation → Usage → Variants → In context → Accessibility → RTL → Anatomy → Do/Don't → API reference
import * as React from 'react';
import {
  Icons, ForgeMark, Frame, Section, SubHead, Lede, Mono,
  NavigationMenu, NavigationMenuItem, NavigationMenuContent, NavigationMenuLink,
  ComponentInstall, AutoPropsTable,
} from '@/ds/core';

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/forge/navigation"

export function Demo() {
  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuLink href="/home" active>Home</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="/deploys">Deploys</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="/runbooks">Runbooks</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  )
}`;

const PANEL_CODE = `<NavigationMenu>
  <NavigationMenuItem id="platform">
    <NavigationMenuLink href="#">Platform</NavigationMenuLink>
    <NavigationMenuContent>
      {/* grid of links inside the dropdown */}
      <a href="/catalog" className="nm-panel-item">
        <span className="nm-panel-item-label">Catalog</span>
        <span className="nm-panel-item-desc">Browse all services</span>
      </a>
      <a href="/deploys" className="nm-panel-item">
        <span className="nm-panel-item-label">Deploys</span>
        <span className="nm-panel-item-desc">Recent pipeline runs</span>
      </a>
    </NavigationMenuContent>
  </NavigationMenuItem>
  <NavigationMenuItem>
    <NavigationMenuLink href="/home" active>Home</NavigationMenuLink>
  </NavigationMenuItem>
</NavigationMenu>`;

const ACTIVE_CODE = `<NavigationMenuLink href="/home" active>Home</NavigationMenuLink>`;

const RTL_CODE = `<div dir="rtl">
  <NavigationMenu>
    <NavigationMenuItem>
      <NavigationMenuLink href="#" active>الرئيسية</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem id="rtl-platform">
      <NavigationMenuLink href="#">المنصّة</NavigationMenuLink>
      <NavigationMenuContent>
        <a href="#" className="nm-panel-item">
          <span className="nm-panel-item-label">الكتالوج</span>
        </a>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenu>
</div>`;

// ── Demo helpers ──────────────────────────────────────────────────────────────

function PanelDemo() {
  const [open, setOpen] = React.useState('');
  return (
    <div style={{ minHeight: 200 }}>
      <NavigationMenu value={open} onValueChange={setOpen}>
        <NavigationMenuItem id="demo-platform">
          <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>Platform</NavigationMenuLink>
          <NavigationMenuContent>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 12, minWidth: 320 }}>
              {[
                ['Catalog', 'Browse all services'],
                ['Deploys', 'Recent pipeline runs'],
                ['Runbooks', 'Incident playbooks'],
                ['SLOs', 'Reliability targets'],
              ].map(([label, desc]) => (
                <a key={label} href="#" className="nm-panel-item" onClick={(e) => e.preventDefault()}>
                  <span className="nm-panel-item-label">{label}</span>
                  <span className="nm-panel-item-desc">{desc}</span>
                </a>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem id="demo-ops">
          <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>Operations</NavigationMenuLink>
          <NavigationMenuContent>
            <div style={{ padding: 12, minWidth: 180 }}>
              {['GMUDs', 'Incidents', 'On-call', 'Alerts'].map((label) => (
                <a key={label} href="#" className="nm-panel-item" onClick={(e) => e.preventDefault()}>
                  <span className="nm-panel-item-label">{label}</span>
                </a>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" active onClick={(e) => e.preventDefault()}>Home</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
}

function InContextDemo() {
  const [active, setActive] = React.useState('home');
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', height: 44, borderBottom: '1px solid var(--border)', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginInlineEnd: 12 }}>
          <ForgeMark size={14} />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>Eidos</span>
        </div>
        <NavigationMenu>
          {[
            { id: 'home', label: 'Home' },
            { id: 'catalog', label: 'Catalog' },
            { id: 'deploys', label: 'Deploys' },
            { id: 'runbooks', label: 'Runbooks' },
          ].map((item) => (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink
                href="#"
                active={active === item.id}
                onClick={(e) => { e.preventDefault(); setActive(item.id); }}
              >
                {item.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenu>
        <span style={{ marginInlineStart: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-subtle)', padding: '2px 6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4 }}>⌘K</span>
      </div>
      <div style={{ padding: '20px 16px', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>
        Active: <strong style={{ color: 'var(--fg)' }}>{active}</strong>
      </div>
    </div>
  );
}

function RtlDemo() {
  const [open, setOpen] = React.useState('');
  return (
    <div dir="rtl" style={{ width: '100%' }}>
      <NavigationMenu value={open} onValueChange={setOpen}>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" active onClick={(e) => e.preventDefault()}>الرئيسية</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem id="rtl-demo-ops">
          <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>المنصّة</NavigationMenuLink>
          <NavigationMenuContent>
            <div style={{ padding: 12, minWidth: 180 }}>
              {['الكتالوج', 'عمليات النشر', 'كتب التشغيل'].map((label) => (
                <a key={label} href="#" className="nm-panel-item" onClick={(e) => e.preventDefault()}>
                  <span className="nm-panel-item-label">{label}</span>
                </a>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>العمليات</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Navigation() {
  return (
    <Section
      id="navigation"
      num="13"
      title="Navigation Menu"
      desc="Horizontal nav bar for primary app destinations. Supports dropdown content panels, roving keyboard focus, hover intent delay, and direction-aware RTL panel placement."
    >

      {/* ── 1. INSTALLATION ─────────────────────────────────────────────────── */}
      <ComponentInstall slug="navigation" />

      {/* ── 2. USAGE ─────────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>
        Compose <Mono>NavigationMenu</Mono> {'>'} <Mono>NavigationMenuItem</Mono> {'>'} <Mono>NavigationMenuLink</Mono>. The active item gets <Mono>aria-current="page"</Mono> automatically.
        Add a <Mono>NavigationMenuContent</Mono> sibling inside any item to enable a dropdown panel.
      </Lede>
      <Frame label="basic nav bar" code={USAGE_CODE}>
        <NavigationMenu>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" active onClick={(e) => e.preventDefault()}>Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>Deploys</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>Runbooks</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </Frame>

      {/* Examples divider */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ── 3. VARIANTS ──────────────────────────────────────────────────────── */}
      <SubHead meta="active state">Active link</SubHead>
      <Lede up>
        The <Mono>active</Mono> prop marks the current page. It adds the <Mono>.is-active</Mono> class and
        sets <Mono>aria-current="page"</Mono> for screen readers — one active item per bar.
      </Lede>
      <Frame label="active · inactive links" code={ACTIVE_CODE}>
        <NavigationMenu>
          {['Home', 'Catalog', 'Deploys', 'Runbooks', 'SLOs'].map((label, i) => (
            <NavigationMenuItem key={label}>
              <NavigationMenuLink href="#" active={i === 0} onClick={(e) => e.preventDefault()}>
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenu>
      </Frame>

      <SubHead meta="dropdown panels">Content panels</SubHead>
      <Lede up>
        Drop a <Mono>NavigationMenuContent</Mono> inside any <Mono>NavigationMenuItem</Mono> to add a
        floating panel. The trigger gets a caret and <Mono>aria-expanded</Mono>/<Mono>aria-controls</Mono>.
        Hover opens after <Mono>delayDuration</Mono> ms (default 200); keyboard ArrowDown or Enter
        also opens the panel.
      </Lede>
      <Frame label="hover or ArrowDown to open — click outside or Escape to close" code={PANEL_CODE}>
        <PanelDemo />
      </Frame>

      {/* ── 4. IN CONTEXT ────────────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        NavigationMenu typically sits in a topbar alongside a brand mark and a trailing action cluster.
        The <Mono>marginInlineStart: auto</Mono> idiom pushes the trailing cluster to the visual end — flips automatically under RTL.
      </Lede>
      <Frame label="topbar + navigation menu + active switching">
        <InContextDemo />
      </Frame>

      {/* ── 5. ACCESSIBILITY ─────────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard model</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The top-level list is a single tab stop (roving tabindex). <Mono>ArrowLeft</Mono> / <Mono>ArrowRight</Mono> rove
            between items. <Mono>ArrowDown</Mono> or <Mono>Enter</Mono> opens a content panel — focus moves to the first link inside it.
            <Mono>Tab</Mono> / <Mono>Shift+Tab</Mono> cycle within the open panel. <Mono>Escape</Mono> closes the panel and returns focus to the trigger.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>ARIA roles &amp; attributes</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            <Mono>{'<nav>'}</Mono> with <Mono>aria-label="Main navigation"</Mono> creates a landmark.
            The top-level <Mono>{'<ul>'}</Mono> is a plain list; each <Mono>{'<li>'}</Mono> is <Mono>role="none"</Mono>.
            Panel triggers carry <Mono>aria-expanded</Mono> + <Mono>aria-controls</Mono> pointing at the panel region.
            The active link has <Mono>aria-current="page"</Mono>.
            The content panel is <Mono>role="region"</Mono> with an accessible label. No menu/menuitem semantics — links are plain <Mono>{'<a>'}</Mono> elements.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast &amp; focus</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Every item and panel link shows the canonical ember focus ring on <Mono>:focus-visible</Mono>.
            The active indicator (ember underline) meets AA contrast against both dark and light surfaces.
            Muted idle labels (<Mono>--fg-muted</Mono>) are supplemental only — the active link also
            carries an underline indicator so state is never communicated by colour alone.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Panel entrance and the hover delay are the only animations. Under <Mono>prefers-reduced-motion: reduce</Mono>
            the panel appears instantly (no fade/slide) and the hover delay is bypassed — the
            component-scoped <Mono>@media</Mono> block sets <Mono>transition: none</Mono> and
            <Mono>animation: none</Mono> on all <Mono>.nm-*</Mono> elements.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ───────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — panel anchors to the right trigger edge; bar reads right-to-left' code={RTL_CODE}>
        <RtlDemo />
      </Frame>
      <Lede>
        Panel placement reads <Mono>getComputedStyle(trigger).direction</Mono> (falling back to
        the closest <Mono>[dir]</Mono> ancestor) to decide whether to anchor from the leading or
        trailing edge of the trigger. Under <Mono>dir="rtl"</Mono> the panel opens toward the
        inline-start (right side of screen), not the start of the logical axis. Non-directional glyphs
        (the caret chevron) do not mirror; the bar layout itself reverses via logical CSS <Mono>margin-inline</Mono>.
      </Lede>

      {/* ── 7. ANATOMY ───────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 520 }} aria-hidden="true">
              {/* Anatomy specimen — topbar with nav items */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '10px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--fg)', marginInlineEnd: 12 }}>
                  <ForgeMark size={14} /> Eidos
                </div>
                {/* Nav item — active */}
                <div style={{ position: 'relative', padding: '6px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg)', fontWeight: 600, cursor: 'default' }}>
                  Home
                  <span style={{ position: 'absolute', insetInline: 4, bottom: 0, height: 2, background: 'var(--ember)', borderRadius: 2 }} />
                </div>
                {/* Nav item — idle */}
                <div style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', cursor: 'default' }}>Catalog</div>
                {/* Nav item with caret */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', cursor: 'default' }}>
                  Platform <Icons.chevronDown size={12} />
                </div>
                <span style={{ marginInlineStart: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-subtle)', padding: '2px 6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4 }}>⌘K</span>
              </div>
              {/* Pins */}
              <span className="lead v" style={{ top: -28, left: 40, height: 24 }} />
              <span className="lead v" style={{ top: -28, left: 140, height: 24 }} />
              <span className="lead v" style={{ bottom: -28, left: 140, height: 24 }} />
              <span className="lead v" style={{ top: -28, left: 260, height: 24 }} />
              <span className="lead v" style={{ top: -28, right: 40, height: 24 }} />
              <div className="pin" style={{ top: -52, left: 40, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -52, left: 140, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -52, left: 140, transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: -52, left: 260, transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ top: -52, right: 40, transform: 'translateX(50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Brand mark.</b> Leads the bar. Anchors visual identity; doubles as a home link. Separated from the nav by <Mono>margin-inline-end</Mono>.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Nav link.</b> <Mono>13px</Mono> Geist Sans 500. Idle: <Mono>--fg-muted</Mono>. Hover: <Mono>--fg</Mono>. Active: <Mono>--fg</Mono> + ember underline. <Mono>8px 12px</Mono> padding for a comfortable hit area.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Active indicator.</b> <Mono>2px</Mono> ember bar pinned to <Mono>bottom: 0</Mono> via logical <Mono>inset-inline: 4px</Mono>. Travels with the current item; one indicator per bar.</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Panel trigger.</b> Identical to a plain link visually but carries a <Mono>12px</Mono> caret chevron and <Mono>aria-expanded</Mono>. Opens a fixed-position content panel on hover or ArrowDown.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Trailing cluster.</b> <Mono>margin-inline-start: auto</Mono> parks actions (⌘K, avatar, status) at the visual end — flips automatically under RTL with no extra override.</span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd do">
          <div className="label">Do</div>
          <div className="body">
            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" active onClick={(e) => e.preventDefault()}>Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>Catalog</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" onClick={(e) => e.preventDefault()}>Deploys</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenu>
          </div>
          <p>Use NavigationMenuLink with real <Mono>href</Mono> values. Mark exactly one item <Mono>active</Mono> so users know where they are.</p>
        </div>
        <div className="dd dont">
          <div className="label">Don't</div>
          <div className="body">
            <div style={{ display: 'flex', gap: 2 }}>
              {['Home', 'Catalog', 'Deploys', 'Runbooks', 'SLOs', 'Alerts', 'GMUDs', 'Settings'].map((label) => (
                <span key={label} style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', cursor: 'default' }}>{label}</span>
              ))}
            </div>
          </div>
          <p>Don't cram 8+ items into a flat bar — it overflows and loses hierarchy. Group secondary destinations inside a content panel or move them to a sidebar.</p>
        </div>
        <div className="dd do">
          <div className="label">Do</div>
          <div className="body" style={{ padding: '12px' }}>
            <Mono>aria-label="Main navigation"</Mono> on the <Mono>{'<nav>'}</Mono> — Eidos applies this automatically. On pages with multiple navigations, use distinct labels so screen-reader users can distinguish them.
          </div>
          <p>Let the component manage ARIA roles and attributes — override only when you have a second nav landmark on the same page.</p>
        </div>
        <div className="dd dont">
          <div className="label">Don't</div>
          <div className="body" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', background: 'var(--ember)', color: 'var(--ember-fg)', borderRadius: 4, cursor: 'default' }}>Home</span>
              <span style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', background: 'var(--ember)', color: 'var(--ember-fg)', borderRadius: 4, cursor: 'default' }}>Catalog</span>
              <span style={{ padding: '6px 12px', fontSize: 'var(--text-sm)', background: 'var(--ember)', color: 'var(--ember-fg)', borderRadius: 4, cursor: 'default' }}>Deploys</span>
            </div>
          </div>
          <p>Don't use ember fill for every nav item — reserve it for the single primary action per screen. Nav links use the subtle underline indicator instead.</p>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────────── */}
      <SubHead meta="NavigationMenuProps">API reference</SubHead>
      <AutoPropsTable component="NavigationMenu" label="NavigationMenuProps" />
      <AutoPropsTable component="NavigationMenuItem" label="NavigationMenuItemProps" />
      <AutoPropsTable component="NavigationMenuContent" label="NavigationMenuContentProps" />
      <AutoPropsTable component="NavigationMenuLink" label="NavigationMenuLinkProps" />

    </Section>
  );
}
