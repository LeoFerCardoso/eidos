'use client';
// Eidos DS — Components / Scroll Area
// DS-PAGE-STANDARD §2.2 (Component template):
//   Installation → Usage → Variants → In context → Accessibility → RTL → Anatomy → Do/Don't → API reference
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  AutoPropsTable,
  Lede,
  Mono,
  KbdRow,
  ScrollArea,
  ComponentInstall,
} from '@/ds/core';

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { ScrollArea } from "@/components/forge/scroll-area"

export function Demo() {
  return (
    <ScrollArea maxHeight="220px" label="Event log">
      {items.map((it) => (
        <div key={it.id}>{it.label}</div>
      ))}
    </ScrollArea>
  )
}`;

const VERTICAL_CODE = `<ScrollArea
  maxHeight="220px"
  label="Event log"
  style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "0 12px" }}
>
  {events.map((ev) => (
    <div key={ev.id}>{ev.label}</div>
  ))}
</ScrollArea>`;

const HORIZONTAL_CODE = `<ScrollArea
  orientation="horizontal"
  maxWidth="100%"
  label="Edge nodes"
  style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: 12 }}
>
  <div style={{ display: "flex", gap: 10 }}>
    {nodes.map((n) => <NodeCard key={n.id} {...n} />)}
  </div>
</ScrollArea>`;

const ALWAYS_CODE = `<ScrollArea
  type="always"
  maxHeight="320px"
  label="Pipeline log"
>
  <LogLines />
</ScrollArea>`;

const RTL_CODE = `<div dir="rtl">
  {/* The browser moves the scrollbar to the inline-start edge (left in RTL).
      Logical properties on child rows keep spacing direction-aware.
      No per-element flipping required. */}
  <ScrollArea maxHeight="220px" label="سجل الأحداث">
    {rows.map((r) => <Row key={r.id} {...r} />)}
  </ScrollArea>
</div>`;

// ── Shared demo helpers ───────────────────────────────────────────────────────

const ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 0',
  fontSize: 'var(--text-base)',
  color: 'var(--fg-muted)',
};

function EventRows({ count = 24, max = 24 }: { count?: number; max?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{ ...ROW_STYLE, borderBottom: i < max - 1 ? '1px solid var(--border)' : 'none' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
            #{String(i + 1).padStart(2, '0')}
          </span>
          <span>Service event — region us-east-1</span>
        </div>
      ))}
    </>
  );
}

const VIEWPORT_STYLE: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-xl)',
  padding: '0 12px',
  background: 'var(--surface)',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ScrollAreaPage() {
  return (
    <Section
      id="scroll-area"
      title="Scroll Area"
      desc="A bounded scrolling region with thin, auto-hiding, themeable scrollbars. Wrap long lists, log transcripts, or code blocks that would otherwise push the layout."
    >
      {/* ══════════════════════════════════════════════════════════════════════
          1. INSTALLATION
          ══════════════════════════════════════════════════════════════════════ */}
      <ComponentInstall slug="scroll-area" />

      {/* ══════════════════════════════════════════════════════════════════════
          2. USAGE
          ══════════════════════════════════════════════════════════════════════ */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <ScrollArea maxHeight="220px" label="Event log" style={VIEWPORT_STYLE}>
          <EventRows count={8} max={8} />
        </ScrollArea>
      </Frame>
      <Lede>
        Pass <Mono>maxHeight</Mono> (vertical) or <Mono>maxWidth</Mono> (horizontal) to bound the
        viewport, then drop any content inside. The scrollbar is invisible at rest and reveals on
        hover — no markup, no JS timers.
      </Lede>

      {/* ══════════════════════════════════════════════════════════════════════
          3. VARIANTS
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>
          Variants
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Vertical */}
      <SubHead meta="vertical">Vertical</SubHead>
      <Frame
        label="auto-hide thumb · thin track · 999px radius"
        code={VERTICAL_CODE}
      >
        <ScrollArea maxHeight="220px" label="Event log" style={VIEWPORT_STYLE}>
          <EventRows count={24} max={24} />
        </ScrollArea>
      </Frame>

      {/* Horizontal */}
      <SubHead meta="horizontal">Horizontal</SubHead>
      <Frame label="horizontal track for wide rows" code={HORIZONTAL_CODE}>
        <ScrollArea
          orientation="horizontal"
          maxWidth="100%"
          label="Edge nodes"
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 12,
            background: 'var(--surface)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, paddingInlineEnd: 4 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                style={{
                  minWidth: 160,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 10,
                  fontSize: 'var(--text-sm)',
                  color: 'var(--fg-muted)',
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--fg)' }}>edge-{i + 1}</div>
                <div>us-east-1</div>
                <div className="pill" style={{ marginTop: 6 }}>Healthy</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Frame>

      {/* Always visible */}
      <SubHead meta="always">Always visible</SubHead>
      <Frame
        label='type="always" — scrollbar is never hidden'
        code={ALWAYS_CODE}
      >
        <ScrollArea
          type="always"
          maxHeight="220px"
          label="Pipeline log"
          style={VIEWPORT_STYLE}
        >
          <EventRows count={24} max={24} />
        </ScrollArea>
      </Frame>
      <Lede>
        Use <Mono>type="always"</Mono> for dense data panels where users benefit from a persistent
        position indicator — chat transcripts, terminal output, diff views.
      </Lede>

      {/* ══════════════════════════════════════════════════════════════════════
          4. IN CONTEXT
          ══════════════════════════════════════════════════════════════════════ */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="filter sidebar — stable chrome, scrollable list">
        <div
          style={{
            display: 'flex',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: 'var(--surface)',
            width: 340,
          }}
        >
          <div style={{ padding: '14px 16px', borderInlineEnd: '1px solid var(--border)', flex: '0 0 180px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 10 }}>
              Filters
            </div>
            <ScrollArea maxHeight="220px" label="Filter list" style={{ paddingInlineEnd: 4 }}>
              {[
                'All services', 'Healthy', 'Degraded', 'Down',
                'Region: us-east-1', 'Region: us-west-2', 'Region: eu-central-1',
                'Tier: T1', 'Tier: T2', 'Tier: T3',
                'On-call active', 'No incidents',
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '7px 0',
                    fontSize: 'var(--text-sm)',
                    color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)',
                    fontWeight: i === 0 ? 500 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {item}
                </div>
              ))}
            </ScrollArea>
          </div>
          <div style={{ padding: '14px 16px', flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 10 }}>
              Results
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
              Showing 3 of 12 services
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        The Scroll Area keeps the filter panel at a fixed height so the main canvas never reflows
        when the list is long. The scrollbar appears only on hover — the panel looks clean until
        the user needs it.
      </Lede>

      {/* ══════════════════════════════════════════════════════════════════════
          5. ACCESSIBILITY
          ══════════════════════════════════════════════════════════════════════ */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', margin: 0, lineHeight: 1.55 }}>
            When <Mono>focusable</Mono> is true (the default) the viewport receives{' '}
            <Mono>tabIndex=0</Mono> so it enters the Tab order. An explicit{' '}
            <Mono>onKeyDown</Mono> drives the keys below in every browser (generic divs only
            keyboard-scroll natively in Firefox), and it is RTL-aware. If children are entirely
            interactive (links, buttons) the browser already scrolls the focused element into
            view — set <Mono>focusable={'{false}'}</Mono> there.
          </p>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', margin: 0, lineHeight: 1.55 }}>
            A focusable viewport carries <Mono>role="region"</Mono> and the <Mono>aria-label</Mono>{' '}
            you provide (e.g. "Event log"). This lets screen-reader users navigate directly to the
            region via the landmarks list. The scrollbar gutter is purely visual and never exposed
            to AT.
          </p>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus ring</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', margin: 0, lineHeight: 1.55 }}>
            A focused viewport shows the standard ember focus ring (
            <Mono>--ring</Mono> via <Mono>:focus-visible</Mono>). The ring is
            suppressed for pointer events — only keyboard/sequential focus triggers it.
          </p>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <p className="t-small" style={{ color: 'var(--fg-muted)', margin: 0, lineHeight: 1.55 }}>
            The only animation is the scrollbar fade on hover / scroll-end (
            <Mono>transition: scrollbar-color 200ms</Mono>). Programmatic scrolling respects{' '}
            <Mono>scroll-behavior: smooth</Mono>; the browser automatically snaps instead of gliding
            under <Mono>prefers-reduced-motion: reduce</Mono>.
          </p>
        </div>
      </div>

      {/* Keyboard map — mirrors the shipped onKeyDown handler 1:1 */}
      <div className="surface" style={{ marginTop: 16, padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}>
          Keyboard map · focusable viewport
        </div>
        <KbdRow label="Scroll by one line" meta="vertical axis" keys={['↑', '↓']} />
        <KbdRow label="Scroll by one line" meta="horizontal · RTL-aware" keys={['←', '→']} />
        <KbdRow label="Scroll by one page" meta="± clientHeight" keys={['PgUp', 'PgDn']} />
        <KbdRow label="Jump to start of axis" keys={['Home']} />
        <KbdRow label="Jump to end of axis" keys={['End']} />
        <KbdRow label="Move focus out of the region" keys={['Tab']} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. RTL
          ══════════════════════════════════════════════════════════════════════ */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — scrollbar moves to the inline-start edge (left)'}
        code={RTL_CODE}
        lang="tsx"
      >
        <div dir="rtl">
          <ScrollArea
            maxHeight="220px"
            label="سجل الأحداث"
            style={VIEWPORT_STYLE}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                style={{
                  ...ROW_STYLE,
                  borderBottom: i < 11 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  #{String(i + 1).padStart(2, '0')}
                </span>
                <span>حدث خدمة — المنطقة us-east-1</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      </Frame>
      <Lede>
        Because the viewport relies on the browser's native scroll, the scrollbar moves to the
        inline-start edge — the <b style={{ color: 'var(--fg)' }}>left</b> in RTL — and rows align
        to the inline-start (right). Each row spaces its index and label with a flex{' '}
        <Mono>gap</Mono>, which is direction-agnostic, so the layout reads correctly in both
        directions. The thin themed thumb is purely presentational — nothing about it mirrors.
      </Lede>

      {/* ══════════════════════════════════════════════════════════════════════
          7. ANATOMY
          ══════════════════════════════════════════════════════════════════════ */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              {/* Static visual of a scroll area with a visible thumb */}
              <div style={{
                height: 180,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: 12,
                background: 'var(--surface)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      ...ROW_STYLE,
                      borderBottom: i < 6 ? '1px solid var(--border)' : 'none',
                      fontSize: 'var(--text-base)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    <span>Service event</span>
                  </div>
                ))}
                {/* Track */}
                <div style={{ position: 'absolute', top: 6, bottom: 6, insetInlineEnd: 4, width: 8, borderRadius: 'var(--radius-full)', background: 'var(--border)', opacity: 0.35 }} />
                {/* Thumb */}
                <div style={{ position: 'absolute', top: 22, insetInlineEnd: 5, width: 6, height: 60, borderRadius: 'var(--radius-full)', background: 'var(--border-strong)' }} />
              </div>
              {/* Leads */}
              <span className="lead h" style={{ top: 30, left: -36, width: 30 }} />
              <span className="lead h" style={{ top: 24, right: -36, width: 30 }} />
              <span className="lead h" style={{ top: 60, right: -36, width: 30 }} />
              <span className="lead v" style={{ top: -22, right: 12, height: 18 }} />
              <span className="lead v" style={{ bottom: -22, right: 12, height: 18 }} />
              {/* Pins */}
              <div className="pin" style={{ top: 22, left: -58 }}>1</div>
              <div className="pin" style={{ top: 16, right: -58 }}>2</div>
              <div className="pin" style={{ top: 52, right: -58 }}>3</div>
              <div className="pin" style={{ top: -42, right: 12, transform: 'translateX(50%)' }}>4</div>
              <div className="pin" style={{ bottom: -42, right: 12, transform: 'translateX(50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Viewport.</b> The clipped content area. Anything taller than <Mono>maxHeight</Mono> scrolls.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Track.</b> Translucent rail — the runway for the thumb. Painted at ~35% opacity on hover.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Thumb.</b> Filled with <Mono>var(--border-strong)</Mono>. Position reflects the scroll offset.</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Hidden at rest.</b> Both track and thumb fade in on hover via <Mono>scrollbar-color</Mono> transition.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Gutter.</b> 8px wide, 999px radius. Occupies the inline-end edge; moves to inline-start in RTL.</span>
          </div>
        </div>
      </div>

      {/* Decision matrix */}
      <SubHead meta="when to use">Scroll Area vs page scroll</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick the right scope</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Content</th>
              <th>Pattern</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Long article / docs page</td><td className="tok-name">Page scroll</td></tr>
            <tr><td>Side panel · sidesheet · modal body</td><td className="tok-name">Scroll Area inside the panel</td></tr>
            <tr><td>Code block · chat transcript · log row list</td><td className="tok-name">Scroll Area</td></tr>
            <tr><td>Wide table with many columns</td><td className="tok-name">Scroll Area · horizontal</td></tr>
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          8. DO / DON'T
          ══════════════════════════════════════════════════════════════════════ */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — wrap a fixed-height panel that must not reflow the page
          </div>
          <div className="body">
            <ScrollArea
              maxHeight="120px"
              label="Filter list"
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '0 12px',
                background: 'var(--surface)',
              }}
            >
              {['Filter: All', 'Filter: Healthy', 'Filter: Degraded', 'Filter: Disabled', 'Filter: Custom…', 'Filter: Region · us-east-1', 'Filter: Region · us-west-2'].map((label, i) => (
                <div key={i} style={{ padding: '6px 0', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', borderBottom: i < 6 ? '1px solid var(--border)' : 'none' }}>
                  {label}
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="note">A bounded filter list keeps the surrounding chrome stable. The user always sees the same workspace shape.</div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — wrap the whole page in a Scroll Area
          </div>
          <div className="body" style={{ padding: 14, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
            Nested scroll bars + lost overscroll = a page that fights the browser's reading habits.
          </div>
          <div className="note">The browser's own scroll is faster, supports trackpad inertia natively, and never traps focus. Reach for Scroll Area only when content has a fixed viewport ceiling.</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          9. API REFERENCE
          ══════════════════════════════════════════════════════════════════════ */}
      <SubHead meta="ScrollAreaProps">API reference</SubHead>
      <AutoPropsTable component="ScrollArea" label="<ScrollArea />" />
    </Section>
  );
}
