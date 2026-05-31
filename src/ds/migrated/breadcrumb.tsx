'use client';
// Eidos DS — Components / Breadcrumb.
// A hierarchical trail of links from root to current page. Use for nested
// content (Service → Deploy → Logs), not for linear flows (use a stepper).
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, Lede, Mono,
  Breadcrumb,
} from '@/ds/core';

// ── Code samples ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Breadcrumb } from "@/components/forge/breadcrumb"

export function Demo() {
  return (
    <Breadcrumb
      items={[
        { label: 'Services', href: '/services' },
        { label: 'forge-api', href: '/services/forge-api' },
        { label: 'v2.14.0' },
      ]}
    />
  )
}`;

const CHEVRON_CODE = `<Breadcrumb
  separator="chevron"
  items={[
    { label: 'Services', href: '/services' },
    { label: 'forge-api', href: '/services/forge-api' },
    { label: 'Deploys', href: '/services/forge-api/deploys' },
    { label: 'v2.14.0' },
  ]}
/>`;

const SLASH_CODE = `<Breadcrumb
  separator="slash"
  items={[
    { label: 'Services', href: '/services' },
    { label: 'forge-api', href: '/services/forge-api' },
    { label: 'Settings' },
  ]}
/>`;

const DOT_CODE = `<Breadcrumb
  separator="dot"
  items={[
    { label: 'Services', href: '/services' },
    { label: 'forge-api', href: '/services/forge-api' },
    { label: 'Settings' },
  ]}
/>`;

const COMPACT_CODE = `<Breadcrumb
  size="sm"
  items={[
    { label: 'Services', href: '/services' },
    { label: 'forge-api', href: '/services/forge-api' },
    { label: 'Settings' },
  ]}
/>`;

const COLLAPSE_CODE = `<Breadcrumb
  maxItems={3}
  items={[
    { label: 'Services', href: '/services' },
    { label: 'forge-api', href: '/services/forge-api' },
    { label: 'Environments', href: '...' },
    { label: 'Production', href: '...' },
    { label: 'Deploys', href: '...' },
    { label: 'v2.14.0' },
  ]}
/>`;

const ICON_CODE = `import { Home } from "lucide-react"

<Breadcrumb
  items={[
    { label: 'Services', href: '/services', icon: <Home size={13} /> },
    { label: 'forge-api', href: '/services/forge-api' },
    { label: 'Deploys' },
  ]}
/>`;

const RTL_CODE = `<div dir="rtl">
  <Breadcrumb
    label="مسار التنقّل"
    items={[
      { label: 'الخدمات', href: '/services', icon: <Home size={13} /> },
      { label: 'forge-api', href: '/services/forge-api' },
      { label: 'عمليات النشر' },
    ]}
  />
</div>`;

const RESPONSIVE_CODE = `// A real page-header bar. The breadcrumb measures its own track with a
// ResizeObserver and raises maxItems the moment the trail would wrap —
// the middle crumbs fold into the ellipsis DropdownMenu automatically.
function PageHeader({ width }: { width: number }) {
  const collapse = width < 440  // narrow → fold the middle into "…"
  return (
    <header className="bc-bar">
      <Breadcrumb
        size="sm"
        maxItems={collapse ? 2 : undefined}
        items={[
          { label: 'Services',    href: '/services',    icon: <Home size={13} /> },
          { label: 'forge-api',   href: '/services/forge-api' },
          { label: 'Environments',href: '/.../environments' },
          { label: 'Production',  href: '/.../production' },
          { label: 'v2.14.0' },
        ]}
      />
    </header>
  )
}`;

// ── Fixture data ──────────────────────────────────────────────────────────────

// Deep five-level trail for the responsive page-header demo.
const HEADER_ITEMS = [
  { label: 'Services', href: '/services' },
  { label: 'forge-api', href: '/services/forge-api' },
  { label: 'Environments', href: '/services/forge-api/environments' },
  { label: 'Production', href: '/services/forge-api/environments/production' },
  { label: 'v2.14.0' },
];

const BASE_ITEMS = [
  { label: 'Services', href: '/services' },
  { label: 'forge-api', href: '/services/forge-api' },
  { label: 'v2.14.0' },
];

const LONG_ITEMS = [
  { label: 'Services', href: '/services' },
  { label: 'forge-api', href: '/services/forge-api' },
  { label: 'Environments', href: '/services/forge-api/environments' },
  { label: 'Production', href: '/services/forge-api/environments/production' },
  { label: 'Deploys', href: '/services/forge-api/environments/production/deploys' },
  { label: 'v2.14.0' },
];

const INSTALL_TABS = [
  { label: 'pnpm',   code: 'pnpm dlx eidos@latest add breadcrumb', lang: 'bash' },
  { label: 'npm',    code: 'npx eidos@latest add breadcrumb',       lang: 'bash' },
  { label: 'yarn',   code: 'yarn dlx eidos@latest add breadcrumb',  lang: 'bash' },
  { label: 'bun',    code: 'bunx eidos@latest add breadcrumb',      lang: 'bash' },
  { label: 'shadcn', code: 'npx shadcn@latest add https://forge.equifax.dev/r/breadcrumb.json', lang: 'bash' },
];

// ── Responsive page-header demo (signature "In context" move) ──────────────────
//
// A real page-header bar that owns its own width. A ResizeObserver watches the
// breadcrumb track and raises `maxItems` the instant the full trail would no
// longer fit — the middle crumbs fold into the ellipsis DropdownMenu live, not
// as a static screenshot. The grip is a keyboard-operable slider so the reader
// can drive the collapse from a focus ring, no pointer required.

const HEADER_MIN = 320;
const HEADER_MAX = 720;
const COLLAPSE_AT = 440; // px of track below which the middle folds

function ResponsiveHeaderDemo() {
  const [width, setWidth] = React.useState(HEADER_MAX);
  const dragging = React.useRef(false);
  const shellRef = React.useRef<HTMLDivElement | null>(null);

  // Track the rendered width so the collapse decision follows real layout,
  // not just the slider value (the bar is clamped to the column on small screens).
  const [measured, setMeasured] = React.useState(HEADER_MAX);
  const barRef = React.useRef<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    const el = barRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setMeasured(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const collapsed = measured < COLLAPSE_AT;

  const clamp = (n: number) => Math.max(HEADER_MIN, Math.min(HEADER_MAX, n));

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !shellRef.current) return;
    const left = shellRef.current.getBoundingClientRect().left;
    setWidth(clamp(e.clientX - left));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 64 : 16;
    if (e.key === 'ArrowLeft') { e.preventDefault(); setWidth((w) => clamp(w - step)); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); setWidth((w) => clamp(w + step)); }
    else if (e.key === 'Home') { e.preventDefault(); setWidth(HEADER_MIN); }
    else if (e.key === 'End') { e.preventDefault(); setWidth(HEADER_MAX); }
  };

  return (
    <div>
      {/* Live status strip — mono readout + collapse state. */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBlockEnd: 14, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        letterSpacing: '0.04em', color: 'var(--fg-subtle)',
      }}>
        <span>track</span>
        <span style={{ color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(measured)}px
        </span>
        <span aria-hidden="true" style={{ color: 'var(--fg-faint)' }}>·</span>
        <span
          aria-live="polite"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: collapsed ? 'var(--ember-text)' : 'var(--fg-subtle)',
          }}
        >
          <span aria-hidden="true" style={{
            inlineSize: 6, blockSize: 6, borderRadius: '50%',
            background: collapsed ? 'var(--ember)' : 'var(--border-strong)',
          }}/>
          {collapsed ? 'collapsed — middle in ⋯' : 'full trail'}
        </span>
      </div>

      {/* Resizable shell: the bar + a grip handle that doubles as a slider. */}
      <div
        ref={shellRef}
        style={{ display: 'flex', alignItems: 'stretch', maxInlineSize: '100%' }}
      >
        <div style={{ inlineSize: width, maxInlineSize: '100%', minInlineSize: 0 }}>
          <header
            ref={barRef}
            className="bc-bar"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingBlock: 12, paddingInline: 16,
              border: '1px solid var(--border)',
              borderStartStartRadius: 'var(--radius-lg)',
              borderEndStartRadius: 'var(--radius-lg)',
              borderInlineEnd: 'none',
              background: 'var(--bg-elevated)',
              minInlineSize: 0,
            }}
          >
            <span aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--fg-faint)', flex: '0 0 auto' }}>
              <Icons.panelLeft size={15} />
            </span>
            <div style={{ minInlineSize: 0, overflow: 'hidden' }}>
              <Breadcrumb
                size="sm"
                label="Page location"
                maxItems={collapsed ? 2 : undefined}
                items={HEADER_ITEMS}
              />
            </div>
          </header>
        </div>

        {/* Grip — pointer-draggable AND a keyboard slider (role=slider). */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Resize the page-header bar"
          aria-orientation="vertical"
          aria-valuemin={HEADER_MIN}
          aria-valuemax={HEADER_MAX}
          aria-valuenow={Math.round(width)}
          aria-valuetext={`${Math.round(width)} pixels${collapsed ? ', breadcrumb collapsed' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={onKeyDown}
          className="bc-grip"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            inlineSize: 22, flex: '0 0 auto',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderStartEndRadius: 'var(--radius-lg)',
            borderEndEndRadius: 'var(--radius-lg)',
            color: 'var(--fg-faint)',
            cursor: 'ew-resize', touchAction: 'none',
          }}
        >
          <Icons.gripVertical size={14} />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <Section
      id="breadcrumb"
      num="18"
      title="Breadcrumb"
      desc="A horizontal trail of links from root to current page. Use it whenever a page lives more than one level deep — it answers 'where am I?' without forcing the user back into the navigation."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_TABS} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>Breadcrumb</Mono> with an <Mono>items</Mono> prop and four separator
        variants. The last item is always rendered as the current page (<Mono>aria-current="page"</Mono>,
        plain text). Long trails collapse via <Mono>maxItems</Mono> into a
        DropdownMenu ellipsis.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Breadcrumb items={BASE_ITEMS} />
      </Frame>

      {/* 3. EXAMPLES divider eyebrow */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* 3a. SEPARATOR VARIANTS */}
      <SubHead meta="4 separators">Separator variants</SubHead>
      <Lede up>
        Choose the separator that matches your product's visual language.
        Chevron (default) and arrow are <em>directional</em> — they mirror under <Mono>dir="rtl"</Mono>.
        Slash and dot are non-directional and never transform.
      </Lede>
      <Frame label="chevron — default, directional" code={CHEVRON_CODE}>
        <Breadcrumb separator="chevron" items={[
          { label: 'Services', href: '/services' },
          { label: 'forge-api', href: '/services/forge-api' },
          { label: 'Deploys', href: '/services/forge-api/deploys' },
          { label: 'v2.14.0' },
        ]} />
      </Frame>
      <Frame label="slash — non-directional" code={SLASH_CODE}>
        <Breadcrumb separator="slash" items={[
          { label: 'Services', href: '/services' },
          { label: 'forge-api', href: '/services/forge-api' },
          { label: 'Settings' },
        ]} />
      </Frame>
      <Frame label="dot — non-directional" code={DOT_CODE}>
        <Breadcrumb separator="dot" items={[
          { label: 'Services', href: '/services' },
          { label: 'forge-api', href: '/services/forge-api' },
          { label: 'Settings' },
        ]} />
      </Frame>

      {/* 3b. COMPACT */}
      <SubHead meta="compact">Compact size</SubHead>
      <Lede up>
        Pass <Mono>size="sm"</Mono> for the compact variant — smaller font and tighter
        gaps. Designed for page-header bars where the breadcrumb sits next to the topbar.
      </Lede>
      <Frame label="sm — for page-header bars" code={COMPACT_CODE}>
        <Breadcrumb size="sm" items={[
          { label: 'Services', href: '/services' },
          { label: 'forge-api', href: '/services/forge-api' },
          { label: 'Settings' },
        ]} />
      </Frame>

      {/* 3c. OVERFLOW COLLAPSE */}
      <SubHead meta="truncated">Overflow collapse</SubHead>
      <Lede up>
        When a trail is deeper than <Mono>maxItems</Mono>, the middle crumbs collapse
        into an ellipsis button that opens a DropdownMenu. The first and last items
        always remain visible.
      </Lede>
      <Frame label="maxItems={3} — collapse middle" code={COLLAPSE_CODE}>
        <Breadcrumb maxItems={3} items={LONG_ITEMS} />
      </Frame>

      {/* 3d. WITH ICON */}
      <SubHead meta="with icon">With icon</SubHead>
      <Frame label="leading icon on the root crumb" code={ICON_CODE}>
        <Breadcrumb items={[
          { label: 'Services', href: '/services', icon: <Icons.home size={13} /> },
          { label: 'forge-api', href: '/services/forge-api' },
          { label: 'Deploys' },
        ]} />
      </Frame>

      {/* 4. IN CONTEXT — responsive page-header bar (live) */}
      <SubHead meta="responsive · live">In context</SubHead>
      <Lede up>
        A breadcrumb earns its keep in the page-header bar. Drag the grip (or focus it
        and press <Mono>←</Mono> / <Mono>→</Mono>) to shrink the bar: a
        <Mono>ResizeObserver</Mono> on the trail folds the middle crumbs into the ellipsis
        <Mono>DropdownMenu</Mono> the moment they would wrap — root and current page stay
        pinned. This is the truncation doing real work, not a static screenshot.
      </Lede>
      <Frame label="resizable page-header bar — collapses on its own" code={RESPONSIVE_CODE}>
        <ResponsiveHeaderDemo />
      </Frame>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Tab moves through each ancestor link in document order. Enter or Space follows a link or activates an onClick item. The current page is plain text and is not focusable — there is nowhere to navigate. The ellipsis trigger is a real <Mono>&lt;button&gt;</Mono> reachable by Tab; the DropdownMenu it opens has full arrow-key navigation, Enter/Space to select, and Escape to close.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>The trail is a <Mono>&lt;nav aria-label="Breadcrumb"&gt;</Mono> wrapping an <Mono>&lt;ol&gt;</Mono> — screen readers announce position ("link 2 of 4"). The current page carries <Mono>aria-current="page"</Mono>; separators are <Mono>aria-hidden</Mono>. The ellipsis button exposes an accessible label such as "Show 3 hidden items".</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Links show the ember focus ring (<Mono>--ring</Mono>) on their padded hit area. Ancestor links use <Mono>--fg-muted</Mono> and the current page uses <Mono>--fg</Mono> at 500-weight — both clear WCAG AA on the page surface. Current page distinction is weight + <Mono>aria-current</Mono>, never colour alone.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', lineHeight: 1.55}}>Only the hover colour/background fade on links uses <Mono>--dur-fast</Mono>. The component-scoped <Mono>prefers-reduced-motion</Mono> guard (<Mono>.bc-link</Mono>, <Mono>.bc-ellipsis</Mono> in <Mono>ds.css</Mono>) collapses it to instant. Responsive collapse is a layout reflow, not an animation — no entrance transition on the trail itself.</div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — chevron/arrow flip; slash/dot stay unchanged'
        code={RTL_CODE}
      >
        <div dir="rtl" style={{width:'100%'}}>
          <Breadcrumb
            label="مسار التنقّل"
            separator="chevron"
            items={[
              { label: 'الخدمات', href: '/services', icon: <Icons.home size={13} /> },
              { label: 'forge-api', href: '/services/forge-api' },
              { label: 'عمليات النشر', href: '/services/forge-api/deploys' },
              { label: 'v2.14.0' },
            ]}
          />
        </div>
      </Frame>
      <Lede>
        Under <Mono>dir="rtl"</Mono> the chevron and arrow separators flip via
        <Mono>transform: scaleX(-1)</Mono> so they always point toward the next, more specific
        segment — tracking reading direction, not physical "right". Slash and dot are
        non-directional and are never transformed.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <Breadcrumb
                items={[
                  { label: 'Services', href: '/services', icon: <Icons.home size={13} /> },
                  { label: 'forge-api', href: '/services/forge-api' },
                  { label: 'Deploys' },
                ]}
              />
              <span className="lead v" style={{top: -22, left: 36, height: 18}}/>
              <span className="lead v" style={{top: -22, left: 130, height: 18}}/>
              <span className="lead v" style={{bottom: -22, right: 34, height: 18}}/>
              <div className="pin" style={{top: -42, left: 36, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, left: 130, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{bottom: -42, right: 34, transform:'translateX(50%)'}}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Root.</b> Optional 13px leading icon + label. Always links to the closest meaningful root — not necessarily the app home.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Separator.</b> Faint glyph between items (<Mono>aria-hidden</Mono>). Chevron or arrow are directional and mirror in RTL; slash and dot do not.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Current page.</b> Plain text, 500-weight, with <Mono>aria-current="page"</Mono>. Never a link — the user is already here.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — every ancestor is a link</div>
          <div className="body" style={{padding: 14}}>
            <Breadcrumb items={[
              { label: 'Services', href: '/services' },
              { label: 'forge-api', href: '/services/forge-api' },
              { label: 'Logs' },
            ]} />
          </div>
          <div className="note">Each ancestor crumb is a working link. The user can jump back any number of levels in a single click.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use breadcrumb as tab navigation</div>
          <div className="body" style={{padding: 14}}>
            <Breadcrumb items={[
              { label: 'Overview', href: '/overview' },
              { label: 'Deploys', href: '/overview/deploys' },
              { label: 'Runbooks', href: '/overview/runbooks' },
              { label: 'Settings' },
            ]} />
          </div>
          <div className="note">Sibling pages don't belong in a breadcrumb — that's a Tablist or sidenav. Breadcrumbs show hierarchy, not alternatives.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — collapse deep trails with maxItems</div>
          <div className="body" style={{padding: 14}}>
            <Breadcrumb maxItems={3} items={LONG_ITEMS} />
          </div>
          <div className="note">Long trails overwhelm narrow layouts. Use maxItems to collapse the middle — root and current page always stay visible.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — make the current page a link</div>
          <div className="body" style={{padding: 14}}>
            <Breadcrumb items={[
              { label: 'Services', href: '/services' },
              { label: 'forge-api', href: '/services/forge-api' },
              { label: 'Settings', href: '/services/forge-api/settings' },
            ]} />
          </div>
          <div className="note">The last crumb should always be the current page rendered as plain text. Linking to where you already are confuses screen readers and breaks aria-current semantics.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="BreadcrumbProps">API reference</SubHead>
      <AutoPropsTable component="Breadcrumb" label="<Breadcrumb />"/>
      <PropsTable
        label="BreadcrumbItemDef"
        rows={[
          { prop: 'label', type: 'ReactNode', required: true, description: 'Visible text for this crumb.' },
          { prop: 'href', type: 'string', default: 'undefined', description: 'Navigation destination. Renders as an <a>. Mutually exclusive with onClick-only usage (both can coexist — href is used, onClick fires too).' },
          { prop: 'onClick', type: '(e: MouseEvent) => void', default: 'undefined', description: 'Action handler. Use for SPA navigation or preventing default when href is also set.' },
          { prop: 'icon', type: 'ReactNode', default: 'undefined', description: 'Optional 13–14px leading icon. Rendered as aria-hidden.' },
        ]}
      />
    </Section>
  );
}
