'use client';
// Eidos DS — Components / Sidebar
// The collapsible vertical nav rail for app shells. Different from the
// design-system's own sidenav (which is a docs primitive); this page
// documents the GENERIC sidebar pattern: expanded vs collapsed, sections,
// trailing actions, footer.
import * as React from 'react';
import {
  Icons,
  ForgeMark,
  Frame,
  Section,
  SubHead,
  Lede,
  Mono,
  ComponentInstall,
  AutoPropsTable,
  Sidebar,
  SidebarSection,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
} from '@/ds/core';

// ── Demo shell ──────────────────────────────────────────────────────────────
// Reused across multiple Frame previews. The caller controls the open state.

const DemoNav = ({ open, children }: { open: boolean; children?: React.ReactNode }) => (
  <Sidebar
    collapsible="icon"
    open={open}
    style={{ height: 340 }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 14px' }}>
      <ForgeMark size={20} />
      {open && <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Eidos Studio</span>}
    </div>
    <SidebarSection label="Workspace">
      <SidebarItem icon={<Icons.home size={14} />} active href="#" onClick={(e) => e.preventDefault()}>Home</SidebarItem>
      <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#" onClick={(e) => e.preventDefault()}>Services</SidebarItem>
      <SidebarItem icon={<Icons.rocket size={14} />} href="#" onClick={(e) => e.preventDefault()}>Deployments</SidebarItem>
      <SidebarItem icon={<Icons.doc size={14} />} href="#" onClick={(e) => e.preventDefault()}>Logs</SidebarItem>
    </SidebarSection>
    <SidebarSection label="Account">
      <SidebarItem icon={<Icons.settings size={14} />} href="#" onClick={(e) => e.preventDefault()}>Settings</SidebarItem>
    </SidebarSection>
    <SidebarFooter>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: open ? '4px 8px' : '4px 0', justifyContent: open ? 'flex-start' : 'center' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 'var(--text-xs)', flexShrink: 0 }}>AL</div>
        {open && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ada Lovelace</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ada@forge</div>
          </div>
        )}
      </div>
    </SidebarFooter>
    {children}
  </Sidebar>
);

const BORDER_WRAP: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 10,
  overflow: 'hidden',
  display: 'inline-flex',
};

// ── Code snippets ────────────────────────────────────────────────────────────

const USAGE_CODE = `import {
  Sidebar, SidebarSection, SidebarItem, SidebarFooter
} from "@eidos/ui"

export function AppShell() {
  return (
    <Sidebar collapsible="icon" defaultOpen>
      <SidebarSection label="Workspace">
        <SidebarItem icon={<Home size={14} />} active href="/home">
          Home
        </SidebarItem>
        <SidebarItem icon={<Cpu size={14} />} badge={12} href="/services">
          Services
        </SidebarItem>
      </SidebarSection>
      <SidebarFooter>
        {/* user identity */}
      </SidebarFooter>
    </Sidebar>
  )
}`;

const EXPANDED_CODE = `<Sidebar collapsible="icon" defaultOpen>
  {/* … */}
</Sidebar>`;

const COLLAPSED_CODE = `<Sidebar collapsible="icon" defaultOpen={false}>
  {/* … */}
</Sidebar>`;

const GROUPS_CODE = `<SidebarSection label="Platform">
  <SidebarGroup label="Infrastructure">
    <SidebarItem icon={<Cpu size={14} />} href="#">Services</SidebarItem>
    <SidebarItem icon={<Rocket size={14} />} badge={3} href="#">Deployments</SidebarItem>
  </SidebarGroup>
  <SidebarGroup label="Observability" defaultCollapsed>
    <SidebarItem icon={<FileText size={14} />} href="#">Logs</SidebarItem>
    <SidebarItem icon={<Bell size={14} />} badge={7} href="#">Alerts</SidebarItem>
  </SidebarGroup>
</SidebarSection>`;

const OFFCANVAS_CODE = `<Sidebar collapsible="offcanvas" open={open} onOpenChange={setOpen}>
  {/* full sidebar content — appears as overlay */}
</Sidebar>`;

const RTL_CODE = `// borderInlineEnd flips automatically → rail docks to the right in RTL.
// Icon-to-label order reverses via inline-flex gap.
// The panel-left toggle icon mirrors with scaleX(-1) under [dir=rtl].
<div dir="rtl">
  <Sidebar collapsible="icon" defaultOpen>
    <SidebarItem icon={<Home size={14} />} active href="#">
      الرئيسية
    </SidebarItem>
    <SidebarItem icon={<Cpu size={14} />} badge={12} href="#">
      الخدمات
    </SidebarItem>
  </Sidebar>
</div>`;

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SidebarPage() {
  const [interactive, setInteractive] = React.useState(true);
  const [offcanvasOpen, setOffcanvasOpen] = React.useState(false);

  return (
    <Section
      id="sidebar"
      title="Sidebar"
      desc="The vertical nav rail for app shells — sections, badges, footer, and a collapse state. Pair with a Topbar so primary navigation always lives in the same physical place."
    >
      {/* ── 1. INSTALLATION ─────────────────────────────────────────────────── */}
      <ComponentInstall slug="sidebar" />
      <Lede>
        Ships <Mono>Sidebar</Mono> plus the slot components <Mono>SidebarSection</Mono>, <Mono>SidebarGroup</Mono>, <Mono>SidebarItem</Mono>, and <Mono>SidebarFooter</Mono>. Persist collapse state at the workspace level — the component manages nothing in storage.
      </Lede>

      {/* ── 2. USAGE ────────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={BORDER_WRAP}>
          <DemoNav open={true} />
        </div>
      </Frame>

      {/* ── Examples divider ───────────────────────────────────────────────── */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ── 3. VARIANTS ─────────────────────────────────────────────────────── */}
      <SubHead meta="2 widths">Expanded · Collapsed</SubHead>
      <Frame
        label="232 px expanded · 56 px icon rail · 240 ms ease"
        code={`${EXPANDED_CODE}\n${COLLAPSED_CODE}`}
      >
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 24 }}>
          <div style={BORDER_WRAP}><DemoNav open={true} /></div>
          <div style={BORDER_WRAP}><DemoNav open={false} /></div>
        </div>
      </Frame>

      {/* ── Interactive collapse ─────────────────────────────────────────────── */}
      <SubHead meta="interactive">Try the collapse</SubHead>
      <Frame
        label="toggle the rail · content reflows"
        code={`const [open, setOpen] = React.useState(true);

<Sidebar collapsible="icon" open={open} onOpenChange={setOpen}>
  {/* … */}
</Sidebar>`}
      >
        <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', width: '100%', minHeight: 340 }}>
          <Sidebar
            collapsible="icon"
            open={interactive}
            onOpenChange={setInteractive}
            style={{ height: 340 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 14px' }}>
              <ForgeMark size={20} />
              {interactive && <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Eidos Studio</span>}
            </div>
            <SidebarSection label="Workspace">
              <SidebarItem icon={<Icons.home size={14} />} active href="#" onClick={(e) => e.preventDefault()}>Home</SidebarItem>
              <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#" onClick={(e) => e.preventDefault()}>Services</SidebarItem>
              <SidebarItem icon={<Icons.rocket size={14} />} href="#" onClick={(e) => e.preventDefault()}>Deployments</SidebarItem>
              <SidebarItem icon={<Icons.doc size={14} />} href="#" onClick={(e) => e.preventDefault()}>Logs</SidebarItem>
            </SidebarSection>
            <SidebarFooter>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: interactive ? '4px 8px' : '4px 0', justifyContent: interactive ? 'flex-start' : 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 'var(--text-xs)', flexShrink: 0 }}>AL</div>
                {interactive && (
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ada Lovelace</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ada@forge</div>
                  </div>
                )}
              </div>
            </SidebarFooter>
          </Sidebar>
          <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 14, borderInlineStart: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>Services</span>
              <button className="btn icon outline sm" onClick={() => setInteractive((o) => !o)} aria-label="Toggle sidebar">
                <Icons.panelLeft size={14} />
              </button>
            </div>
            <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
              Click either toggle. The rail collapses to 56 px icon-only; workspace content reflows.
            </div>
          </div>
        </div>
      </Frame>

      {/* ── Collapsible groups ──────────────────────────────────────────────── */}
      <SubHead meta="collapsible groups">Groups</SubHead>
      <Frame label="SidebarGroup — press Enter/Space on the header to toggle" code={GROUPS_CODE}>
        <div style={BORDER_WRAP}>
          <Sidebar collapsible="none" style={{ height: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 14px' }}>
              <ForgeMark size={20} />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Eidos Studio</span>
            </div>
            <SidebarSection label="Platform">
              <SidebarGroup label="Infrastructure">
                <SidebarItem icon={<Icons.cpu size={14} />} href="#" onClick={(e) => e.preventDefault()}>Services</SidebarItem>
                <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#" onClick={(e) => e.preventDefault()}>Deployments</SidebarItem>
              </SidebarGroup>
              <SidebarGroup label="Observability" defaultCollapsed>
                <SidebarItem icon={<Icons.doc size={14} />} href="#" onClick={(e) => e.preventDefault()}>Logs</SidebarItem>
                <SidebarItem icon={<Icons.bell size={14} />} badge={7} href="#" onClick={(e) => e.preventDefault()}>Alerts</SidebarItem>
              </SidebarGroup>
            </SidebarSection>
            <SidebarFooter>
              <div style={{ padding: '4px 8px', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>Settings</div>
            </SidebarFooter>
          </Sidebar>
        </div>
      </Frame>

      {/* ── Off-canvas ──────────────────────────────────────────────────────── */}
      <SubHead meta="overlay">Off-canvas</SubHead>
      <Frame label="collapsible=&quot;offcanvas&quot; — overlay + scrim + focus trap + body scroll lock" code={OFFCANVAS_CODE}>
        <div style={{ position: 'relative', width: 400, height: 260, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg)' }}>
          <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
            <button className="btn icon ghost sm" aria-label="Open sidebar" onClick={() => setOffcanvasOpen(true)}>
              <Icons.menu size={14} />
            </button>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>App Shell</span>
          </div>
          <div style={{ padding: '16px', color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            Click the menu icon to open the off-canvas panel. ESC or clicking the scrim closes it.
          </div>
          <Sidebar collapsible="offcanvas" open={offcanvasOpen} onOpenChange={setOffcanvasOpen} style={{ height: '100%', position: 'absolute', insetBlockStart: 0, insetInlineStart: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px 16px' }}>
              <ForgeMark size={20} />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Eidos Studio</span>
            </div>
            <SidebarSection label="Workspace">
              <SidebarItem icon={<Icons.home size={14} />} active href="#" onClick={(e) => e.preventDefault()}>Home</SidebarItem>
              <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#" onClick={(e) => e.preventDefault()}>Services</SidebarItem>
            </SidebarSection>
            <SidebarFooter>
              <div style={{ padding: '4px 8px', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>
                Press ESC or click outside to close.
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>
      </Frame>

      {/* ── 5. ACCESSIBILITY ────────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <div role="list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div className="kbd-row" role="listitem">
              <span className="label" style={{ color: 'var(--fg-muted)' }}>Walk nav links in DOM order</span>
              <kbd className="kbd">Tab</kbd>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label" style={{ color: 'var(--fg-muted)' }}>Move between items inside the rail</span>
              <span className="kbd-chord"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd></span>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label" style={{ color: 'var(--fg-muted)' }}>Activate a link or group header</span>
              <kbd className="kbd">Enter</kbd>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label" style={{ color: 'var(--fg-muted)' }}>Toggle a collapsible group</span>
              <kbd className="kbd">Space</kbd>
            </div>
            <div className="kbd-row" role="listitem">
              <span className="label" style={{ color: 'var(--fg-muted)' }}>Close off-canvas, restore trigger focus</span>
              <kbd className="kbd">Esc</kbd>
            </div>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The rail renders as <Mono>{'<nav aria-label="Primary">'}</Mono>. The current page link carries <Mono>aria-current="page"</Mono>. The collapse toggle button uses <Mono>aria-expanded</Mono>. In icon-only mode each <Mono>SidebarItem</Mono> carries an <Mono>aria-label</Mono> so the accessible name is never lost.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus management (off-canvas)</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            When <Mono>collapsible="offcanvas"</Mono> opens, focus moves to the first focusable element inside the panel and a Tab trap wraps last→first / first→last. Sibling roots receive <Mono>inert</Mono> to prevent assistive tech from escaping. On close, focus returns to the trigger element.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The width and transform transitions use <Mono>--dur-normal var(--ease)</Mono>. Under <Mono>prefers-reduced-motion: reduce</Mono>, the <Mono>.sb-rail</Mono> class switches both to <Mono>transition: none</Mono>, so the rail snaps between states instantly.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ──────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — rail docks to the right; icons sit to the right of labels'
        center
        code={RTL_CODE}
        lang="tsx"
      >
        <div dir="rtl" style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', minHeight: 340, width: '100%' }}>
          <Sidebar collapsible="none" style={{ height: 340 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 14px' }}>
              <ForgeMark size={20} />
              <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>فورج ستوديو</span>
            </div>
            <SidebarSection label="مساحة العمل">
              <SidebarItem icon={<Icons.home size={14} />} active href="#" onClick={(e) => e.preventDefault()}>الرئيسية</SidebarItem>
              <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#" onClick={(e) => e.preventDefault()}>الخدمات</SidebarItem>
              <SidebarItem icon={<Icons.rocket size={14} />} href="#" onClick={(e) => e.preventDefault()}>النشر</SidebarItem>
            </SidebarSection>
            <SidebarFooter>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 'var(--text-xs)' }}>م ل</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>مريم لقاء</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>mariam@forge</div>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 14, borderInlineStart: '1px solid var(--border)' }}>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>الخدمات</span>
            <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
              يستقر الشريط الجانبي على الحافة اليمنى تلقائيًا بفضل خاصية <Mono>borderInlineEnd</Mono>، دون الحاجة إلى أي تجاوزات.
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        The rail anchors to the inline-start edge via <Mono>borderInlineEnd</Mono>, so in RTL it docks to the <b style={{ color: 'var(--fg)' }}>right</b> with no override. Each row uses an inline-flex gap, so the icon lands to the right of its label automatically. The collapse toggle uses <Mono>panelLeft</Mono>, which the CSS mirrors with <Mono>scaleX(-1)</Mono> under <Mono>[dir=rtl]</Mono>.
      </Lede>

      {/* ── 7. ANATOMY ──────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <div style={{
                width: 232, height: 340,
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10,
                padding: 8, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden',
              }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 14px' }}>
                  <ForgeMark size={20} />
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Eidos Studio</span>
                </div>
                {/* Section label */}
                <div style={{ padding: '6px 10px 2px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Workspace</div>
                {/* Active row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '6px 10px', borderRadius: 'var(--radius-lg)', background: 'var(--surface-hover)', fontSize: 'var(--text-base)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Icons.home size={14} /><span>Home</span></span>
                </div>
                {/* Normal row with badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '6px 10px', fontSize: 'var(--text-base)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Icons.cpu size={14} /><span>Services</span></span>
                  <span className="sb-item-badge badge">12</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', fontSize: 'var(--text-base)' }}>
                  <Icons.rocket size={14} /><span>Deployments</span>
                </div>
                {/* Footer */}
                <div style={{ marginTop: 'auto' }}>
                  <hr className="separator horizontal" style={{ margin: '10px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))', color: 'var(--ember-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 'var(--text-xs)' }}>AL</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Ada Lovelace</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ada@forge</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Leader lines */}
              <span className="lead h" style={{ top: 22, insetInlineEnd: -28, width: 24 }} />
              <span className="lead h" style={{ top: 64, insetInlineStart: -28, width: 24 }} />
              <span className="lead h" style={{ top: 96, insetInlineEnd: -28, width: 24 }} />
              <span className="lead h" style={{ top: 130, insetInlineStart: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 36, insetInlineEnd: -28, width: 24 }} />
              {/* Pins */}
              <div className="pin" style={{ top: 12, insetInlineEnd: -52 }}>1</div>
              <div className="pin" style={{ top: 54, insetInlineStart: -52 }}>2</div>
              <div className="pin" style={{ top: 86, insetInlineEnd: -52 }}>3</div>
              <div className="pin" style={{ top: 120, insetInlineStart: -52 }}>4</div>
              <div className="pin" style={{ bottom: 26, insetInlineEnd: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Brand block.</b> Eidos mark + product name at the top. Hidden when the rail collapses to 56 px.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Section heading.</b> Mono uppercase label (Workspace, Account). Groups items by intent; hidden when collapsed.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Nav row.</b> 14 px icon + label, with an optional trailing count badge. Label reads via <Mono>aria-label</Mono> when icon-only.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Active state.</b> <Mono>aria-current="page"</Mono> + <Mono>surface-hover</Mono> tint so the current route is visible by shape, not colour alone.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Footer.</b> User identity anchored to the bottom via <Mono>margin-block-start: auto</Mono>.</span>
          </div>
        </div>
      </div>

      {/* ── Decision matrix ──────────────────────────────────────────────────── */}
      <SubHead meta="when to use">Sidebar vs Navigation Menu vs Drawer</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">pick the right pattern</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead><tr><th style={{ padding: '10px 12px' }}>Use</th><th>Pattern</th></tr></thead>
          <tbody>
            <tr><td>Persistent primary nav in an app shell</td><td className="tok-name">Sidebar</td></tr>
            <tr><td>Horizontal nav at the top of a marketing page</td><td className="tok-name">Navigation Menu</td></tr>
            <tr><td>Mobile-only side nav opened by a hamburger</td><td className="tok-name">Drawer / Sidebar (offcanvas)</td></tr>
            <tr><td>Contextual right-side detail panel</td><td className="tok-name">Sidesheet</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — pair icon-only mode with a tooltip</div>
          <div className="body">
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4, padding: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
              <button className="btn icon ghost sm tt" data-tt="Home" aria-label="Home"><Icons.home size={14} /></button>
              <button className="btn icon ghost sm tt" data-tt="Services" aria-label="Services"><Icons.cpu size={14} /></button>
              <button className="btn icon ghost sm tt" data-tt="Deployments" aria-label="Deployments"><Icons.rocket size={14} /></button>
            </div>
          </div>
          <div className="note">Icons are the only identifier in collapsed mode. Pass a <Mono>tooltip</Mono> prop (or use the <Mono>tt</Mono> class) so the label is one hover away. Always include an <Mono>aria-label</Mono> too.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — auto-collapse on every page change</div>
          <div className="body" style={{ padding: 16, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
            "The sidebar keeps closing every time I navigate." — Anyone, ever.
          </div>
          <div className="note">Persist the collapse state in localStorage or a workspace-level store. It is a user preference, not a per-page guess.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────────── */}
      <SubHead meta="SidebarProps">API reference</SubHead>
      <AutoPropsTable component="Sidebar" label="SidebarProps" />
      <AutoPropsTable component="SidebarItem" label="SidebarItemProps" />
      <AutoPropsTable component="SidebarSection" label="SidebarSectionProps" />
      <AutoPropsTable component="SidebarGroup" label="SidebarGroupProps" />
      <AutoPropsTable component="SidebarFooter" label="SidebarFooterProps" />
    </Section>
  );
}
