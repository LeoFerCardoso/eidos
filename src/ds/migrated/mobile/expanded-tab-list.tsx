'use client';
// Forge Mobile — Expanded Tab List. The "All tabs / More" sheet: a vertical or wrapped
// grid of destinations with icon + label, one selected in ember. Used when the app has more
// sections than the bottom Tab Bar can hold. Cross-links to Tab bar.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Skeleton } from '@/ds/core';

// ── Destination data ──────────────────────────────────────────────────────────────────────────
const ALL_DESTINATIONS = [
  { id: 'home',       icon: 'home',           label: 'Home' },
  { id: 'services',   icon: 'server',         label: 'Services' },
  { id: 'deploys',    icon: 'pipeline',        label: 'Deploys' },
  { id: 'agent',      icon: 'sparkle',         label: 'Agent' },
  { id: 'alerts',     icon: 'bell',            label: 'Alerts' },
  { id: 'incidents',  icon: 'incident',        label: 'Incidents' },
  { id: 'logs',       icon: 'list',            label: 'Logs' },
  { id: 'databases',  icon: 'database',        label: 'Databases' },
  { id: 'storage',    icon: 'folder',          label: 'Storage' },
  { id: 'network',    icon: 'globe',           label: 'Network' },
  { id: 'keys',       icon: 'key',             label: 'Keys' },
  { id: 'settings',   icon: 'settings',        label: 'Settings' },
];

// ── Shared icon renderer ──────────────────────────────────────────────────────────────────────
function DstIcon({ name, size = 22, color }: { name: string; size?: number; color?: string }) {
  const Ic = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[name] || Icons.circle;
  return <Ic size={size} color={color} />;
}

// ── Roving-tabindex / arrow-key controller ──────────────────────────────────────────────────────
// Implements the WAI-ARIA Tabs pattern: exactly one tab is in the focus order
// (tabIndex 0 = the selected cell), arrow keys move focus AND selection, and
// Home/End jump to the ends. `axis` decides which arrows are live: 'inline'
// (←/→) for a row/grid, 'block' (↑/↓) for a vertical list. Wrap-around so the
// roving never dead-ends. Returns the per-cell props to spread onto each tab.
function useRovingTabs<T extends { id: string; disabled?: boolean }>(items: T[], activeId: string, setActive: (id: string) => void, axis: 'inline' | 'block' | 'both') {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  // Move `step` cells in the travel direction, hopping over any disabled
  // destination so the roving never lands on an unreachable cell.
  const focusAt = (from: number, step: number) => {
    const n = items.length;
    for (let hops = 0; hops < n; hops++) {
      const idx = (from + step * (hops + 1) + n * (hops + 1)) % n;
      if (!items[idx].disabled) { setActive(items[idx].id); refs.current[items[idx].id]?.focus(); return; }
    }
  };
  const focusEnd = (dir: 1 | -1) => {
    const n = items.length;
    for (let k = 0; k < n; k++) {
      const idx = dir === 1 ? k : n - 1 - k;
      if (!items[idx].disabled) { setActive(items[idx].id); refs.current[items[idx].id]?.focus(); return; }
    }
  };
  return (id: string) => {
    const i = items.findIndex((it) => it.id === id);
    return {
      ref: (el: HTMLButtonElement | null) => { refs.current[id] = el; },
      tabIndex: id === activeId ? 0 : -1,
      onKeyDown: (e: React.KeyboardEvent) => {
        const inline = axis === 'inline' || axis === 'both';
        const block = axis === 'block' || axis === 'both';
        // Logical inline arrows respect RTL: in rtl, ArrowLeft advances, ArrowRight retreats.
        const rtl = e.currentTarget instanceof HTMLElement && getComputedStyle(e.currentTarget).direction === 'rtl';
        const fwd = rtl ? 'ArrowLeft' : 'ArrowRight';
        const back = rtl ? 'ArrowRight' : 'ArrowLeft';
        if (inline && e.key === fwd)      { e.preventDefault(); focusAt(i, 1); }
        else if (inline && e.key === back) { e.preventDefault(); focusAt(i, -1); }
        else if (block && e.key === 'ArrowDown') { e.preventDefault(); focusAt(i, 1); }
        else if (block && e.key === 'ArrowUp')   { e.preventDefault(); focusAt(i, -1); }
        else if (e.key === 'Home')              { e.preventDefault(); focusEnd(1); }
        else if (e.key === 'End')               { e.preventDefault(); focusEnd(-1); }
      },
    };
  };
}

// ── Wrapped grid cell ─────────────────────────────────────────────────────────────────────────
function GridCell({ id, icon, label, active, onClick, panelId, rove, disabled = false }: { id: string; icon: string; label: string; active: boolean; onClick: () => void; panelId?: string; rove?: ReturnType<typeof useRovingTabs<{ id: string }>>; disabled?: boolean }) {
  const roving = rove ? rove(id) : { tabIndex: 0 as number };
  const fg = disabled ? 'var(--fg-faint)' : active ? 'var(--accent)' : 'var(--fg-muted)';
  return (
    <button
      {...roving}
      role="tab"
      aria-selected={active}
      aria-label={disabled ? `${label}, locked` : label}
      aria-controls={panelId}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: '100%',
        aspectRatio: '1 / 1',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--ember-soft, rgba(255,107,53,0.12))' : 'var(--surface)',
        border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        padding: 0,
        minHeight: 44,
        minWidth: 44,
        transition: 'background var(--dur, 150ms) var(--ease, ease), border-color var(--dur, 150ms) var(--ease, ease)',
      }}
    >
      <DstIcon name={icon} size={20} color={fg} />
      <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, color: fg, lineHeight: 1.2, textAlign: 'center', paddingInline: 2 }}>{label}</span>
      {disabled && <Icons.lock size={10} color="var(--fg-faint)" style={{ position: 'absolute', insetBlockStart: 6, insetInlineEnd: 6 }} />}
    </button>
  );
}

// ── Vertical list row ─────────────────────────────────────────────────────────────────────────
function ListRow({ id, icon, label, active, onClick, panelId, rove }: { id: string; icon: string; label: string; active: boolean; onClick: () => void; panelId?: string; rove?: ReturnType<typeof useRovingTabs<{ id: string }>> }) {
  const roving = rove ? rove(id) : { tabIndex: 0 as number };
  return (
    <button
      {...roving}
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        height: 50,
        paddingInline: 14,
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--ember-soft, rgba(255,107,53,0.10))' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'start',
      }}
    >
      <span style={{ width: 36, height: 36, borderRadius: 10, background: active ? 'var(--accent)' : 'var(--surface-active)', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
        <DstIcon name={icon} size={18} color={active ? 'var(--ember-fg)' : 'var(--fg-muted)'} />
      </span>
      <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: active ? 600 : 500, color: active ? 'var(--accent)' : 'var(--fg)' }}>{label}</span>
      {active && <Icons.check size={15} color="var(--accent)" />}
    </button>
  );
}

// ── Device screen — "More" sheet (grid layout) ────────────────────────────────────────────────
function ExpandedTabScreen() {
  const [active, setActive] = React.useState('deploys');
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const rove = useRovingTabs(ALL_DESTINATIONS, active, setActive, 'inline');
  const activeIndex = ALL_DESTINATIONS.findIndex((d) => d.id === active);
  const activeLabel = ALL_DESTINATIONS[activeIndex]?.label ?? '';

  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); setDismissed(activeLabel); closeRef.current?.focus(); } }}
    >
      {/* Status bar */}
      <div style={{ height: 44, flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 6px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
        <span>9:41</span>
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><Icons.activity size={12} /><Icons.battery size={13} /></span>
      </div>

      {/* Sheet header — title + a live position read-out that mirrors the SR
          announcement ("N of 12"), making the roving-tabindex state visible. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 16, paddingBlock: '12px 8px', borderBlockEnd: '1px solid var(--border)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 13 }}>All sections</span>
          <span aria-hidden="true" style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 10, letterSpacing: '0.04em', color: 'var(--fg-faint)' }}>{activeIndex + 1} / {ALL_DESTINATIONS.length}</span>
        </span>
        <button ref={closeRef} aria-label="Dismiss sheet" onClick={() => setDismissed(activeLabel)} style={{ border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 999, display: 'grid', placeItems: 'center', background: 'var(--surface-active)' }}>
          <Icons.x size={14} color="var(--fg-muted)" />
        </button>
      </div>

      {/* Live "navigated to" confirmation — proves selection drives a destination */}
      {dismissed && (
        <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 6, paddingInline: 16, paddingBlock: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ember)' }}>
          <Icons.check size={12} color="var(--ember)" /> Navigated · {dismissed}
        </div>
      )}

      {/* Grid */}
      <div
        id="etl-grid-panel"
        role="tablist"
        aria-label="All sections"
        style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, alignContent: 'start' }}
      >
        {ALL_DESTINATIONS.map((d) => (
          <GridCell key={d.id} {...d} active={d.id === active} panelId="etl-grid-panel" rove={rove} onClick={() => { setActive(d.id); setDismissed(d.label); }} />
        ))}
      </div>

      {/* Bottom nav stub */}
      <nav style={{ display: 'flex', borderBlockStart: '1px solid var(--border)', background: 'var(--bg)', paddingBlockEnd: 14 }}>
        {ALL_DESTINATIONS.slice(0, 4).map((t) => {
          const on = t.id === active;
          return (
            <button key={t.id} onClick={() => setActive(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 0', cursor: 'pointer', color: on ? 'var(--ember)' : 'var(--fg-faint)', border: 'none', background: 'none' }}>
              <DstIcon name={t.icon} size={20} color={on ? 'var(--ember)' : 'var(--fg-faint)'} />
              <span style={{ fontSize: 10, fontWeight: on ? 600 : 500 }}>{t.label}</span>
            </button>
          );
        })}
        <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 0', cursor: 'pointer', color: 'var(--ember)', border: 'none', background: 'none' }}>
          <Icons.more size={20} color="var(--ember)" />
          <span style={{ fontSize: 10, fontWeight: 600 }}>More</span>
        </button>
      </nav>
    </div>
  );
}

// ── Vertical list variant demo ────────────────────────────────────────────────────────────────
function VerticalListDemo() {
  const [active, setActive] = React.useState('alerts');
  const items = ALL_DESTINATIONS.slice(4, 10);
  const rove = useRovingTabs(items, active, setActive, 'block');
  return (
    <div
      id="etl-list-panel"
      role="tablist"
      aria-label="More sections"
      style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {items.map((d) => (
        <ListRow key={d.id} {...d} active={d.id === active} panelId="etl-list-panel" rove={rove} onClick={() => setActive(d.id)} />
      ))}
    </div>
  );
}

// ── Mini sheet frame (state demos) ──────────────────────────────────────────────────────────
function MiniSheet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', background: 'var(--bg)', width: 200 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBlockEnd: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>All sections</span>
        <span style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--surface-active)', display: 'grid', placeItems: 'center' }}><Icons.x size={12} color="var(--fg-muted)" /></span>
      </div>
      <div style={{ padding: 10, minHeight: 132, display: 'flex' }}>{children}</div>
    </div>
  );
}

// ── Body states demo — loading, error (role="alert"), populated ───────────────────────────────
function BodyStatesDemo() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {/* Loading */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MiniSheet>
          <div role="status" aria-label="Loading sections" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, width: '100%', alignContent: 'start' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="box" height={56} radius={8} />
            ))}
          </div>
        </MiniSheet>
        <span className="t-mono-label" style={{ fontSize: 10, color: 'var(--fg-faint)' }}>loading</span>
      </div>
      {/* Error */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MiniSheet>
          <div role="alert" className="alert danger" style={{ width: '100%', alignSelf: 'center' }}>
            <span className="alert-icon"><Icons.alert size={15} /></span>
            <div className="alert-body">
              <div className="alert-title">Couldn&rsquo;t load sections</div>
              <div className="alert-desc">Check your connection and try again.</div>
              <button className="btn ghost" style={{ alignSelf: 'start', marginBlockStart: 6, height: 28, paddingInline: 10, fontSize: 'var(--text-sm)' }}>
                <Icons.refresh size={13} /> Retry
              </button>
            </div>
          </div>
        </MiniSheet>
        <span className="t-mono-label" style={{ fontSize: 10, color: 'var(--danger, var(--fg-faint))' }}>error</span>
      </div>
      {/* Populated */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <MiniSheet>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, width: '100%', alignContent: 'start' }}>
            {ALL_DESTINATIONS.slice(0, 6).map((d, i) => {
              const active = i === 2;
              return (
                <div key={d.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 8, background: active ? 'var(--ember-soft)' : 'var(--surface)', border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)', padding: '8px 4px', minHeight: 56 }}>
                  <DstIcon name={d.icon} size={16} color={active ? 'var(--accent)' : 'var(--fg-muted)'} />
                  <span style={{ fontSize: 9, fontWeight: active ? 600 : 500, color: active ? 'var(--accent)' : 'var(--fg-muted)' }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </MiniSheet>
        <span className="t-mono-label" style={{ fontSize: 10, color: 'var(--fg-faint)' }}>loaded</span>
      </div>
    </div>
  );
}

// ── Variants demo ─────────────────────────────────────────────────────────────────────────────
function VariantsDemo() {
  const gridItems = ALL_DESTINATIONS.slice(0, 8);
  const [gridActive, setGridActive] = React.useState('logs');
  const gridRove = useRovingTabs(gridItems, gridActive, setGridActive, 'inline');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '24px 20px' }}>
      {/* Grid */}
      <div>
        <div className="t-mono-label" style={{ marginBottom: 12 }}>Grid — 4 columns · ← → to move</div>
        <div
          id="etl-variant-grid"
          role="tablist"
          aria-label="More sections"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}
        >
          {gridItems.map((d) => (
            <GridCell key={d.id} {...d} active={d.id === gridActive} panelId="etl-variant-grid" rove={gridRove} onClick={() => setGridActive(d.id)} />
          ))}
        </div>
      </div>
      {/* List */}
      <div>
        <div className="t-mono-label" style={{ marginBottom: 12 }}>Vertical list · ↑ ↓ to move</div>
        <VerticalListDemo />
      </div>
      {/* States — every cell state a destination can hold */}
      <div>
        <div className="t-mono-label" style={{ marginBottom: 12 }}>Cell states</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 280 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <GridCell id="st-default" icon="server" label="Services" active={false} onClick={() => {}} />
            <span className="t-mono-label" style={{ fontSize: 10, color: 'var(--fg-faint)', textAlign: 'center' }}>default</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <GridCell id="st-selected" icon="pipeline" label="Deploys" active onClick={() => {}} />
            <span className="t-mono-label" style={{ fontSize: 10, color: 'var(--accent)', textAlign: 'center' }}>selected</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <GridCell id="st-disabled" icon="key" label="Keys" active={false} onClick={() => {}} disabled />
            <span className="t-mono-label" style={{ fontSize: 10, color: 'var(--fg-faint)', textAlign: 'center' }}>locked</span>
          </div>
        </div>
        <div style={{ marginTop: 10, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5, maxWidth: 360 }}>A destination the signed-in user can&rsquo;t reach renders <Mono tone="subtle">aria-disabled</Mono> with a lock glyph — visible, never just dimmed — and is skipped by both pointer and arrow keys.</div>
      </div>
      {/* Body states — what the sheet shows while the destination list resolves */}
      <div>
        <div className="t-mono-label" style={{ marginBottom: 12 }}>Body states — loading · error · loaded</div>
        <BodyStatesDemo />
        <div style={{ marginTop: 12, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5, maxWidth: 420 }}>While the list resolves the body holds a <Mono tone="subtle">role="status"</Mono> skeleton grid; on failure it swaps to a <Mono tone="subtle">role="alert"</Mono> danger panel with a focusable Retry — the chrome (header, dismiss) stays put so the sheet is never empty.</div>
      </div>
    </div>
  );
}

// ── RTL demo ─────────────────────────────────────────────────────────────────────────────────
function RtlExpandedDemo() {
  const items = ALL_DESTINATIONS.slice(0, 6);
  const [active, setActive] = React.useState('agent');
  const rove = useRovingTabs(items, active, setActive, 'inline');

  return (
    <div dir="rtl" style={{ padding: '20px 16px' }}>
      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 12, textAlign: 'start' }}>جميع الأقسام</div>
      <div
        id="etl-rtl-panel"
        role="tablist"
        aria-label="جميع الأقسام"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}
      >
        {items.map((d) => (
          <GridCell key={d.id} {...d} active={d.id === active} panelId="etl-rtl-panel" rove={rove} onClick={() => setActive(d.id)} />
        ))}
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────────────────────
export default function MobileExpandedTabList() {
  return (
    <Section
      id="expanded-tab-list"
      num="01"
      title="Expanded Tab List"
      desc="An expanded grid or list of all app destinations, shown when the Tab Bar's five slots are not enough. One destination is selected in ember. Triggered from a More tab. Cross-links to Tab bar."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Surface this sheet from the More tab in the Tab Bar when the app has more than five top-level destinations. One cell is always selected; tapping a destination dismisses the sheet and navigates. Use the grid layout for eight or more sections, the vertical list for six to eight.</Lede>
      <Frame label="12-destination More sheet — tap a cell, or focus the grid and use ← → / Home / End; Esc navigates" center>
        <DeviceFrame initial="iphone-se"><ExpandedTabScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants {'&'} states</SubHead>
      <Frame label="Grid (4-col, ← →) · vertical list (↑ ↓) · cell + body states — focus a cell and arrow between them">
        <VariantsDemo />
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              {/* Sheet mockup */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--bg)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBlockEnd: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>All sections</span>
                  <span style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--surface-active)', display: 'grid', placeItems: 'center' }}>
                    <Icons.x size={12} color="var(--fg-muted)" />
                  </span>
                </div>
                {/* Grid cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, padding: 10 }}>
                  {ALL_DESTINATIONS.slice(0, 6).map((d, i) => {
                    const active = i === 2;
                    return (
                      <div
                        key={d.id}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 8, background: active ? 'rgba(255,107,53,0.10)' : 'var(--surface)', border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)', padding: '10px 4px' }}
                      >
                        <DstIcon name={d.icon} size={18} color={active ? 'var(--accent)' : 'var(--fg-muted)'} />
                        <span style={{ fontSize: 9, fontWeight: active ? 600 : 500, color: active ? 'var(--accent)' : 'var(--fg-muted)' }}>{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Annotation leads */}
              <span className="lead h" style={{ top: 22, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 22, right: -28, width: 24 }} />
              <span className="lead v" style={{ top: -26, left: '50%', height: 22, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -26, left: '20%', height: 22, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -26, left: '52%', height: 22, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: 12, left: -52 }}>1</div>
              <div className="pin" style={{ top: 12, right: -52 }}>2</div>
              <div className="pin" style={{ top: -48, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ bottom: -48, left: '20%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: -48, left: '52%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Sheet header.</b> Title ("All sections") + a dismiss button on the trailing edge. The header does not scroll with the grid.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Dismiss control.</b> A <Mono tone="subtle">30px</Mono> filled circle button — always reachable at the trailing end of the header.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Destination cell.</b> Icon + label, <Mono tone="subtle">≥ 44 × 44px</Mono>. Active cell has an ember border and ember-soft background; icon turns ember-coloured.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Active indicator.</b> The ember border + background combination — colour is never the sole signal; the bolder label weight backs it up.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Grid.</b> <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>role="tablist"</code> wrapping a CSS grid; each cell is <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>role="tab"</code> with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>aria-selected</code>.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard map — roving tabindex</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px', margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>
            <dt><Mono>Tab</Mono></dt><dd style={{ margin: 0 }}>Enters the tablist on its one selected cell, then leaves it — the group is a single tab stop.</dd>
            <dt><Mono>← →</Mono></dt><dd style={{ margin: 0 }}>Move focus and selection across the grid; wraps at the ends. Inverted under <Mono>dir="rtl"</Mono>.</dd>
            <dt><Mono>↑ ↓</Mono></dt><dd style={{ margin: 0 }}>Move focus and selection in the vertical list variant.</dd>
            <dt><Mono>Home End</Mono></dt><dd style={{ margin: 0 }}>Jump to the first / last enabled destination.</dd>
            <dt><Mono>Esc</Mono></dt><dd style={{ margin: 0 }}>Navigates to the selection and returns focus to the dismiss control.</dd>
            <dt><Mono tone="subtle">disabled</Mono></dt><dd style={{ margin: 0 }}>A locked cell (<Mono>aria-disabled</Mono>) is hopped over by the arrows and skipped by <Mono>Tab</Mono> — never a dead focus stop.</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader — tablist + tab roles</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The container is <Mono>role="tablist"</Mono> with <Mono>aria-label="All sections"</Mono>. Each cell is <Mono>role="tab"</Mono> with <Mono>aria-selected</Mono> and <Mono>aria-controls</Mono> pointing at the grid panel. VoiceOver announces "Deploys, tab, <Mono tone="subtle">3 of 12</Mono>, selected".</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus {'&'} contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The active cell uses an ember border + soft-ember background + bold label weight — three distinct signals, not just colour. The ember icon on a surface cell meets AA contrast. The canonical focus-visible ring paints on the focused cell during keyboard interaction only.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch target {'&'} reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Each grid cell is <Mono tone="subtle">≥ 44 × 44px</Mono> (min <Mono tone="subtle">80px</Mono> tall: icon + gap + label + padding). The only motion is a <Mono tone="subtle">150ms</Mono> background/border tint on select; it honours the global <Mono>prefers-reduced-motion</Mono> reset and has no entrance animation to suppress.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — grid reads right-to-left; first destination is at the top-right'} center>
        <RtlExpandedDemo />
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the grid's inline axis reverses — the first destination cell is at the top-<b style={{ color: 'var(--fg)' }}>right</b> and the grid fills leftward. The dismiss button moves to the <Mono>insetInlineEnd</Mono> (left) of the header. Icon glyphs and labels are non-directional and need no mirroring.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — always show one selection</div>
          <div className="body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, width: '100%' }}>
            {ALL_DESTINATIONS.slice(0, 6).map((d, i) => {
              const active = i === 1;
              return (
                <div key={d.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', borderRadius: 8, background: active ? 'rgba(255,107,53,0.10)' : 'var(--surface)', border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)' }}>
                  <DstIcon name={d.icon} size={16} color={active ? 'var(--accent)' : 'var(--fg-muted)'} />
                  <span style={{ fontSize: 9, fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : 'var(--fg-muted)' }}>{d.label}</span>
                </div>
              );
            })}
          </div>
          <div className="note">Exactly one cell is always in the selected state, mirroring the Tab Bar's active tab. Never show an empty selection.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use for contextual actions</div>
          <div className="body" style={{ flexDirection: 'column', gap: 6, width: '100%', paddingInline: 8 }}>
            {['Edit profile', 'Share link', 'Archive', 'Delete'].map((a) => (
              <div key={a} style={{ height: 36, display: 'flex', alignItems: 'center', paddingInline: 10, borderRadius: 6, border: '1px solid var(--border)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>{a}</div>
            ))}
          </div>
          <div className="note">For actions that operate on an item — edit, share, delete — use a contextual action sheet or menu, not the expanded tab list.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="expanded-tab-list"
        lang="tsx"
        code={`<div
  id="sections-panel"
  role="tablist"
  aria-label="All sections"
  onKeyDown={onArrowKeys}   // ← → wrap + hop over disabled; Home/End jump; RTL inverts ← →
>
  {destinations.map((d) => (
    <button
      key={d.id}
      role="tab"
      aria-selected={d.id === active}
      aria-controls="sections-panel"
      aria-disabled={d.locked || undefined}   // locked → skipped by Tab + arrows
      disabled={d.locked}
      tabIndex={d.id === active ? 0 : -1}   // roving tabindex: one tab stop
      ref={(el) => (refs.current[d.id] = el)}
      onClick={() => { setActive(d.id); onDismiss(); }}
      className={\`m-etl-cell \${d.id === active ? 'active' : ''}\`}
    >
      <span className="m-etl-icon-wrap">
        <d.Icon size={20} />
      </span>
      <span className="m-etl-label">{d.label}</span>
    </button>
  ))}
</div>

/* .m-etl-cell         — display: grid; place-items: center; gap: 6px;
                         min-width: 44px; min-height: 80px; border-radius: var(--radius-md);
                         border: 1px solid var(--border); background: var(--surface);
   .m-etl-cell.active  — border-color: var(--accent);
                         background: var(--ember-soft, rgba(255,107,53,0.10));
                         color: var(--accent); font-weight: 600;
   .m-etl-icon-wrap    — color: var(--fg-muted);  (active → var(--accent)) */`}
      />
    </Section>
  );
}
