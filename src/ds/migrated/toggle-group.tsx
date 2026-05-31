'use client';
// Eidos DS — Components / Toggle Group
// Canonical section order (DS-PAGE-STANDARD §2.2):
//   1. Installation   (package managers)
//   2. Usage          (hello world)
//   3. Variants       (default · outline)
//   4. Sizes          (sm · md · lg)
//   5. Modes          (single · multiple · filter chips · icon-only · vertical)
//   6. States         (unselected · selected · disabled)
//   7. In context     (toolbar composition)
//   8. Accessibility  (a11y)
//   9. RTL            (dir=rtl)
//  10. Anatomy
//  11. Do / Don't     (rules)
//  12. API reference  (ToggleGroupProps)
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  Lede,
  Mono,
  ComponentInstall,
  AutoPropsTable,
  ToggleGroup,
  ToggleGroupItem,
} from '@/ds/core';

// ==========================================================================
// 2. USAGE
// ==========================================================================
const USAGE_CODE = `import { ToggleGroup, ToggleGroupItem } from "@/components/forge/toggle-group"

export function Demo() {
  const [view, setView] = React.useState<string | null>("grid")
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(v) => setView(v as string | null)}
      aria-label="View mode"
    >
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="kanban">Kanban</ToggleGroupItem>
    </ToggleGroup>
  )
}`;

// ==========================================================================
// PAGE
// ==========================================================================
export default function ToggleGroupPage() {
  const [v1, setV1] = React.useState<string | null>('grid');
  const [v2, setV2] = React.useState<string[]>(['bold']);
  const [v3, setV3] = React.useState<string | null>('week');
  const [v4, setV4] = React.useState<string | null>('b');
  const [v5, setV5] = React.useState<string | null>('left');
  const [v6, setV6] = React.useState<string[]>(['active']);
  const [v7, setV7] = React.useState<string | null>('week');
  const [vCtx, setVCtx] = React.useState<string | null>('grid');
  const [marksCtx, setMarksCtx] = React.useState<string[]>(['bold']);
  const [vAr, setVAr] = React.useState<string | null>('grid');
  // In-context: a single toggle group wired to the canonical [data-density] system.
  const [density, setDensity] = React.useState<string | null>('comfortable');

  return (
    <Section
      id="toggle-group"
      num="29"
      title="Toggle Group"
      desc="A row of buttons that act as one control — single-select (radio-like) or multi-select (checkbox-like). Reach for it for view switching, text formatting, and filter chips."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <ComponentInstall slug="toggle-group" />
      <Lede>
        Ships <Mono>ToggleGroup</Mono> and <Mono>ToggleGroupItem</Mono> — a compound API where items are composed as children. No external dependencies; keyboard navigation, focus management, and ARIA roles are built in.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="single"
            value={v1}
            onValueChange={(v) => setV1(v as string | null)}
            aria-label="View mode"
          >
            <ToggleGroupItem value="grid">
              <Icons.grid size={14} /> Grid
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <Icons.menu size={14} /> List
            </ToggleGroupItem>
            <ToggleGroupItem value="kanban">
              <Icons.layers size={14} /> Kanban
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>

      {/* ====================================================================
          EXAMPLES DIVIDER
          ==================================================================== */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ====================================================================
          3. VARIANTS
          ==================================================================== */}
      <SubHead meta="2 variants">Variants</SubHead>

      {/* Default */}
      <Frame
        label="default — shared chrome with inner shadow on active item"
        code={`<ToggleGroup type="single" value={range} onValueChange={setRange} aria-label="Range">
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>`}
      >
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="single"
            value={v3}
            onValueChange={(v) => setV3(v as string | null)}
            aria-label="Date range"
          >
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
            <ToggleGroupItem value="year">Year</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>

      {/* Outline */}
      <Frame
        label='outline — joined border seams, ember fill on active'
        code={`<ToggleGroup type="single" variant="outline" value={range} onValueChange={setRange} aria-label="Range">
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
  <ToggleGroupItem value="year">Year</ToggleGroupItem>
</ToggleGroup>`}
      >
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="single"
            variant="outline"
            value={v3}
            onValueChange={(v) => setV3(v as string | null)}
            aria-label="Date range"
          >
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
            <ToggleGroupItem value="year">Year</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>
      <Lede>
        The <Mono>outline</Mono> variant collapses internal gaps and fuses neighbouring borders into one seam (<Mono>margin-inline-start: -1px</Mono>). Use it on busy surfaces where the default shared chrome reads as extra visual weight. The active item raises <Mono>z-index: 1</Mono> so its ember border paints over the fused seam.
      </Lede>

      {/* ====================================================================
          4. SIZES
          ==================================================================== */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame label="24 / 30 / 36 px — match button heights in the same toolbar">
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <ToggleGroup
              key={s}
              type="single"
              size={s}
              value={v4}
              onValueChange={(v) => setV4(v as string | null)}
              aria-label={`Size ${s}`}
            >
              <ToggleGroupItem value="a">Small</ToggleGroupItem>
              <ToggleGroupItem value="b">Medium</ToggleGroupItem>
              <ToggleGroupItem value="c">Large</ToggleGroupItem>
            </ToggleGroup>
          ))}
        </div>
      </Frame>

      {/* ====================================================================
          5. MODES
          ==================================================================== */}
      <SubHead meta="single · multiple · filter · icon-only · vertical">Modes</SubHead>

      {/* Single */}
      <Frame
        label="type='single' — radiogroup semantics, one or none selected"
        code={`<ToggleGroup type="single" value={view} onValueChange={setView} aria-label="View">
  <ToggleGroupItem value="grid"><Icons.grid size={14}/> Grid</ToggleGroupItem>
  <ToggleGroupItem value="list"><Icons.menu size={14}/> List</ToggleGroupItem>
  <ToggleGroupItem value="kanban"><Icons.layers size={14}/> Kanban</ToggleGroupItem>
</ToggleGroup>`}
      >
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="single"
            value={v1}
            onValueChange={(v) => setV1(v as string | null)}
            aria-label="View mode"
          >
            <ToggleGroupItem value="grid">
              <Icons.grid size={14} /> Grid
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <Icons.menu size={14} /> List
            </ToggleGroupItem>
            <ToggleGroupItem value="kanban">
              <Icons.layers size={14} /> Kanban
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>
      <Lede>
        One button on at a time. Click the active one to deselect (<Mono>value</Mono> becomes <Mono>null</Mono>) — useful for a "show all" / no-filter state. Pass a non-null default if your UI always requires a selection.
      </Lede>

      {/* Multiple */}
      <Frame
        label="type='multiple' — independent toggle buttons, any combination"
        code={`<ToggleGroup type="multiple" value={marks} onValueChange={setMarks} aria-label="Formatting">
  <ToggleGroupItem value="bold" aria-label="Bold"><Icons.bold size={14}/></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic"><Icons.italic size={14}/></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline"><Icons.underline size={14}/></ToggleGroupItem>
</ToggleGroup>`}
      >
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="multiple"
            value={v2}
            onValueChange={(v) => setV2(v as string[])}
            aria-label="Text formatting"
          >
            <ToggleGroupItem value="bold" aria-label="Bold">
              <Icons.bold size={14} />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              <Icons.italic size={14} />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              <Icons.underline size={14} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>

      {/* Filter chips */}
      <Frame
        label="multiple + outline — status filter bar"
        code={`<ToggleGroup type="multiple" variant="outline" value={statuses} onValueChange={setStatuses} aria-label="Status filter">
  <ToggleGroupItem value="active">Active</ToggleGroupItem>
  <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
  <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
  <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
</ToggleGroup>`}
      >
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="multiple"
            variant="outline"
            value={v6}
            onValueChange={(v) => setV6(v as string[])}
            aria-label="Status filter"
          >
            <ToggleGroupItem value="active">Active</ToggleGroupItem>
            <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
            <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
            <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>

      {/* Icon-only */}
      <Frame
        label="icon-only — square segments, aria-label required"
        code={`<ToggleGroup type="single" value={align} onValueChange={setAlign} aria-label="Text alignment">
  <ToggleGroupItem value="left" aria-label="Align left"><Icons.alignLeft size={14}/></ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center"><Icons.alignCenter size={14}/></ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right"><Icons.alignRight size={14}/></ToggleGroupItem>
  <ToggleGroupItem value="justify" aria-label="Justify"><Icons.alignJustify size={14}/></ToggleGroupItem>
</ToggleGroup>`}
      >
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="single"
            value={v5}
            onValueChange={(v) => setV5(v as string | null)}
            aria-label="Text alignment"
          >
            <ToggleGroupItem value="left" aria-label="Align left">
              <Icons.alignLeft size={14} />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              <Icons.alignCenter size={14} />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              <Icons.alignRight size={14} />
            </ToggleGroupItem>
            <ToggleGroupItem value="justify" aria-label="Justify">
              <Icons.alignJustify size={14} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>

      {/* Vertical */}
      <Frame
        label="vertical — for sidebars and tool palettes"
        code={`<ToggleGroup type="single" orientation="vertical" variant="outline"
  value={range} onValueChange={setRange} aria-label="Date range"
>
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
  <ToggleGroupItem value="week">Week</ToggleGroupItem>
  <ToggleGroupItem value="month">Month</ToggleGroupItem>
</ToggleGroup>`}
      >
        <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="single"
            orientation="vertical"
            variant="outline"
            value={v7}
            onValueChange={(v) => setV7(v as string | null)}
            aria-label="Date range"
          >
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
            <ToggleGroupItem value="year">Year</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>

      {/* ====================================================================
          6. STATES
          ==================================================================== */}
      <SubHead meta="default · selected · disabled">States</SubHead>
      <Frame label="unselected → selected → per-item disabled → group disabled">
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          {/* Nothing selected */}
          <ToggleGroup type="single" defaultValue={undefined} aria-label="Unselected">
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
            <ToggleGroupItem value="c">C</ToggleGroupItem>
          </ToggleGroup>
          {/* One selected */}
          <ToggleGroup type="single" defaultValue="a" aria-label="One selected">
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
            <ToggleGroupItem value="c">C</ToggleGroupItem>
          </ToggleGroup>
          {/* Per-item disabled */}
          <ToggleGroup type="single" defaultValue="a" aria-label="Per-item disabled">
            <ToggleGroupItem value="a">Available</ToggleGroupItem>
            <ToggleGroupItem value="b" disabled>Pro only</ToggleGroupItem>
            <ToggleGroupItem value="c" disabled>Enterprise</ToggleGroupItem>
          </ToggleGroup>
          {/* Group disabled */}
          <ToggleGroup type="single" disabled defaultValue="a" aria-label="Group disabled">
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
            <ToggleGroupItem value="c">C</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>

      {/* ====================================================================
          7. IN CONTEXT
          ==================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        A realistic toolbar with a view switcher (single) and a formatting group (multiple) separated by a divider — the most common composition.
      </Lede>
      <Frame label="toolbar — view switcher + text formatting">
        <div style={{ padding: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}>
            <ToggleGroup
              type="single"
              value={vCtx}
              onValueChange={(v) => setVCtx(v as string | null)}
              aria-label="View mode"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Icons.grid size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <Icons.menu size={14} />
              </ToggleGroupItem>
            </ToggleGroup>
            <span style={{ width: 1, height: 20, background: 'var(--border)' }} />
            <ToggleGroup
              type="multiple"
              value={marksCtx}
              onValueChange={(v) => setMarksCtx(v as string[])}
              aria-label="Text formatting"
            >
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Icons.bold size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Icons.italic size={14} />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline">
                <Icons.underline size={14} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </Frame>
      <Lede up>
        The thesis: a toggle group is a <b style={{ color: 'var(--fg)' }}>state control</b>, not chrome. Below, one single-mode group drives the canonical <Mono>data-density</Mono> system live — pick a density and the deploy table re-pads its rows in real time. The same attribute would cascade to every <Mono>.card</Mono> and <Mono>.toolbar</Mono> in a real view.
      </Lede>
      <Frame
        label="live — density switcher wired to data-density (try it)"
        code={`const [density, setDensity] = React.useState<string>("comfortable")

<ToggleGroup type="single" size="sm" value={density} onValueChange={setDensity} aria-label="Row density">
  <ToggleGroupItem value="compact"><Icons.minimize size={13}/> Compact</ToggleGroupItem>
  <ToggleGroupItem value="comfortable"><Icons.menu size={13}/> Comfortable</ToggleGroupItem>
  <ToggleGroupItem value="spacious"><Icons.maximize size={13}/> Spacious</ToggleGroupItem>
</ToggleGroup>

{/* the group's value is just an attribute on the container */}
<div data-density={density}>
  <table className="tbl tbl-data">…</table>
</div>`}
      >
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <ToggleGroup
              type="single"
              size="sm"
              value={density}
              onValueChange={(v) => setDensity((v as string | null) ?? 'comfortable')}
              aria-label="Row density"
            >
              <ToggleGroupItem value="compact">
                <Icons.minimize size={13} /> Compact
              </ToggleGroupItem>
              <ToggleGroupItem value="comfortable">
                <Icons.menu size={13} /> Comfortable
              </ToggleGroupItem>
              <ToggleGroupItem value="spacious">
                <Icons.maximize size={13} /> Spacious
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div
            data-density={density ?? 'comfortable'}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              overflow: 'hidden',
              background: 'var(--surface)',
            }}
          >
            <table className="tbl tbl-data" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Environment</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'end' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { svc: 'api-gateway', env: 'production', ok: true, ms: '1m 04s' },
                  { svc: 'auth-service', env: 'production', ok: true, ms: '48.2s' },
                  { svc: 'web-frontend', env: 'staging', ok: false, ms: '2m 11s' },
                  { svc: 'worker-queue', env: 'production', ok: true, ms: '39.7s' },
                ].map((r) => (
                  <tr key={r.svc}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{r.svc}</td>
                    <td style={{ color: 'var(--fg-muted)' }}>{r.env}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        color: r.ok ? 'var(--success)' : 'var(--danger)',
                        fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: r.ok ? 'var(--success)' : 'var(--danger)',
                        }} />
                        {r.ok ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td style={{
                      textAlign: 'end', fontFamily: 'var(--font-mono)',
                      color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums',
                    }}>{r.ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Frame>

      {/* ====================================================================
          8. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard — single mode</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The group is a single Tab stop. <Mono>ArrowRight</Mono> / <Mono>ArrowDown</Mono> move focus and select the next item (wraps). <Mono>ArrowLeft</Mono> / <Mono>ArrowUp</Mono> move backwards. <Mono>Home</Mono> jumps to the first item, <Mono>End</Mono> to the last. This is the standard roving tabindex pattern for radio groups.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard — multiple mode</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Each item is its own Tab stop. <Mono>Space</Mono> or <Mono>Enter</Mono> toggles the focused button on or off. This matches ARIA Authoring Practices for independent toggle buttons — a group of checkboxes, not a radio group.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Single mode: <Mono>role="radiogroup"</Mono> on the wrapper; items are <Mono>role="radio"</Mono> with <Mono>aria-checked</Mono>. Multiple mode: <Mono>role="group"</Mono>; items are toggle buttons with <Mono>aria-pressed</Mono>. Always pass <Mono>aria-label</Mono> on the group. Icon-only items must carry their own <Mono>aria-label</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast and motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The focused item shows the ember focus ring. The active state is communicated by fill and border — never colour alone. Label and icon contrast meet AA on both fills in dark and light themes. The fill transition respects <Mono>prefers-reduced-motion</Mono>: the background switches instantly with no animation.
          </div>
        </div>
      </div>

      {/* ====================================================================
          9. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — segment order and border-radius mirror automatically'
        code={`<div dir="rtl">
  <ToggleGroup type="single" variant="outline" value={view} onValueChange={setView} aria-label="عرض">
    <ToggleGroupItem value="grid"><Icons.grid size={14}/> شبكة</ToggleGroupItem>
    <ToggleGroupItem value="list"><Icons.menu size={14}/> قائمة</ToggleGroupItem>
    <ToggleGroupItem value="kanban"><Icons.layers size={14}/> كانبان</ToggleGroupItem>
  </ToggleGroup>
</div>`}
      >
        <div dir="rtl" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <ToggleGroup
            type="single"
            variant="outline"
            value={vAr}
            onValueChange={(v) => setVAr(v as string | null)}
            aria-label="عرض"
          >
            <ToggleGroupItem value="grid">
              <Icons.grid size={14} /> شبكة
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <Icons.menu size={14} /> قائمة
            </ToggleGroupItem>
            <ToggleGroupItem value="kanban">
              <Icons.layers size={14} /> كانبان
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Frame>
      <Lede>
        The group container uses <Mono>display: inline-flex</Mono>. The outline variant uses <Mono>border-start-start-radius</Mono> / <Mono>border-end-start-radius</Mono> and <Mono>border-start-end-radius</Mono> / <Mono>border-end-end-radius</Mono> (logical properties), so the outer corners round on whichever end is visually first. The roving tabindex Arrow keys are direction-aware: <Mono>ArrowRight</Mono> moves forward in the reading direction (next visually) in LTR and RTL alike because the physical direction is recalculated from the group's computed <Mono>direction</Mono>.
      </Lede>

      {/* ====================================================================
          10. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <div
                className="tg outline"
                role="radiogroup"
                aria-label="View mode"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={false}
                  tabIndex={-1}
                  className="tg-btn"
                  style={{ cursor: 'default' }}
                >
                  <Icons.grid size={14} /><span>Grid</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={true}
                  tabIndex={-1}
                  className="tg-btn is-active"
                  style={{ cursor: 'default' }}
                >
                  <Icons.menu size={14} /><span>List</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={false}
                  tabIndex={-1}
                  className="tg-btn"
                  style={{ cursor: 'default' }}
                >
                  <Icons.layers size={14} /><span>Kanban</span>
                </button>
              </div>
              <span className="lead v" style={{ top: -28, left: 48, height: 22 }} />
              <span className="lead v" style={{ bottom: -28, left: '50%', height: 22, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ top: -28, right: 48, height: 22 }} />
              <span className="lead h" style={{ top: 14, right: -36, width: 32 }} />
              <span className="lead h" style={{ bottom: 14, left: -36, width: 32 }} />
              <div className="pin" style={{ top: -52, left: 48, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ bottom: -52, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: -52, right: 48, transform: 'translateX(50%)' }}>3</div>
              <div className="pin" style={{ top: 6, right: -60 }}>4</div>
              <div className="pin" style={{ bottom: 6, left: -60 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Group item.</b> A single <Mono>{'<button>'}</Mono> per option. Min-height 30px, 12px horizontal padding, 4px inner border-radius. Accepts icon + label or icon-only with <Mono>aria-label</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Active item.</b> Default variant lifts to <Mono>--bg-elevated</Mono> with a 1px ring + shadow; outline variant swaps to <Mono>--ember-soft</Mono> fill with ember border and <Mono>z-index: 1</Mono> so it paints over the fused seam.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Shared chrome.</b> The group container holds the outer border, 2px padding, and 6px outer radius. Items share a 2px gap. Outer corners are logical so they mirror correctly under <Mono>dir="rtl"</Mono>.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Selection role.</b> <Mono>type="single"</Mono> → <Mono>role="radiogroup"</Mono> + <Mono>aria-checked</Mono> (radio semantics). <Mono>type="multiple"</Mono> → <Mono>role="group"</Mono> + <Mono>aria-pressed</Mono> (toggle-button semantics).</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Seam (outline only).</b> Neighbours share one 1px border via <Mono>margin-inline-start: -1px</Mono>. The active item raises <Mono>z-index: 1</Mono> so its ember border wins over the shared seam.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          11. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep options short (2–5)</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <ToggleGroup type="single" defaultValue="m" aria-label="Size">
              <ToggleGroupItem value="s">S</ToggleGroupItem>
              <ToggleGroupItem value="m">M</ToggleGroupItem>
              <ToggleGroupItem value="l">L</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="note">Beyond five segments the row gets dense and hard to tap. Switch to a <a href="/select">Select</a> or <a href="/combobox">Combobox</a> for longer lists.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — pack 7+ buttons in one row</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <ToggleGroup type="single" defaultValue="d1" size="sm" aria-label="Days">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <ToggleGroupItem key={i} value={`d${i}`}>{d}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="note">Cramped segments miss-tap on touch. Split choices into a hierarchical group or use a Combobox.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — label icon-only items</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
              <ToggleGroupItem value="left" aria-label="Align left"><Icons.alignLeft size={14} /></ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center"><Icons.alignCenter size={14} /></ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right"><Icons.alignRight size={14} /></ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="note">Icon-only segments need <Mono>aria-label</Mono> — the visual glyph is the only cue for sighted users, but keyboard and screen-reader users need the name.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use for commands (Save, Delete)</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <ToggleGroup type="single" variant="outline" defaultValue="save" aria-label="Actions">
              <ToggleGroupItem value="cancel">Cancel</ToggleGroupItem>
              <ToggleGroupItem value="save">Save</ToggleGroupItem>
              <ToggleGroupItem value="delete">Delete</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="note">Toggle Group is for state, not action. Save / Cancel / Delete are commands — use <a href="/buttons">Button</a> or a button bar.</div>
        </div>
      </div>

      {/* ====================================================================
          12. API REFERENCE
          ==================================================================== */}
      <SubHead meta="ToggleGroupProps">API reference</SubHead>
      <AutoPropsTable component="ToggleGroup" />
      <AutoPropsTable component="ToggleGroupItem" />
    </Section>
  );
}
