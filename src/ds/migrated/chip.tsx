'use client';
// Eidos DS — Components / Chip
// Page layout:
//   1. Installation     (TabbedCode: pnpm · npm · yarn · bun · Manual)
//   2. Usage            (Frame: import + minimal render)
//   3. Variants
//      3a. Tones        (neutral · ok · bad · warn · ember · tier-*)
//      3b. With trend   (up · down arrows)
//      3c. With icon    (leading colour dot / icon)
//      3d. Removable    (interactive filter chips + live compiled query)
//      3e. States       (empty · loading · disabled · invalid)
//   4. In context       (service health row — realistic density)
//   5. Accessibility
//   6. RTL
//   7. Anatomy
//   8. Do / Don't
//   9. API reference
import React from 'react';
import {
  Icons,
  Chip,
  Pill,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  AutoPropsTable,
  installTabs,
  Lede,
  Mono,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/ds/core';

// ==========================================================================
// 2. USAGE
// ==========================================================================
const USAGE_CODE = `import { Chip } from "@eidos/ui"

export function Demo() {
  return (
    <div className="flex gap-2">
      <Chip>v4.18.2</Chip>
      <Chip tone="ok" trend="up">+12.4%</Chip>
    </div>
  )
}`;

// ==========================================================================
// 3a. TONES
// ==========================================================================
const TONES_CODE = `{/* Neutral (default) */}
<Chip>v4.18.2</Chip>

{/* ok / bad / warn — use for deltas and findings */}
<Chip tone="ok">p95 142ms</Chip>
<Chip tone="bad">SAST 3</Chip>
<Chip tone="warn">SAST 1</Chip>

{/* ember — accent highlight, use sparingly */}
<Chip tone="ember">T1</Chip>

{/* tier family */}
<Chip tone="tier-t1">tier-t1</Chip>
<Chip tone="tier-t2">tier-t2</Chip>
<Chip tone="tier-t3">tier-t3</Chip>`;

// ==========================================================================
// 3b. WITH TREND
// ==========================================================================
const TREND_CODE = `<Chip tone="ok"  trend="up">+12.4%</Chip>
<Chip tone="bad" trend="down">-2.1%</Chip>
<Chip tone="ok"  trend="up">+0.8%</Chip>
<Chip tone="bad" trend="down">-4.0%</Chip>`;

// ==========================================================================
// 3c. WITH ICON
// ==========================================================================
const ICON_CODE = `{/* Language-colour dot as leading icon — use var(--*) tokens */}
<Chip icon={
  <span style={{ display:'inline-block', width:8, height:8,
    borderRadius:'50%', background:'var(--accent-2)' }}/>
}>Python</Chip>

<Chip icon={
  <span style={{ display:'inline-block', width:8, height:8,
    borderRadius:'50%', background:'var(--warning)' }}/>
}>JavaScript</Chip>

<Chip icon={<Icons.branch size={10}/>}>main</Chip>
<Chip icon={<Icons.tag size={10}/>}>v2.91.0</Chip>`;

// ==========================================================================
// 3d. REMOVABLE
// ==========================================================================
const REMOVABLE_CODE = `import { useState } from "react"
import { Chip } from "@eidos/ui"

const DEFAULT = ['region:us-east-1', 'tier:T1', 'lang:Go']

export function FilterBar() {
  const [filters, setFilters] = useState(DEFAULT)
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(f => (
        <Chip
          key={f}
          onRemove={() => setFilters(prev => prev.filter(x => x !== f))}
          removeLabel={\`Remove filter \${f}\`}
        >
          <span style={{ color:'var(--fg-subtle)', fontWeight:500 }}>
            {f.split(':')[0]}:
          </span>
          {f.split(':')[1]}
        </Chip>
      ))}
    </div>
  )
}`;

// ==========================================================================
// 3e. STATES
// ==========================================================================
const STATES_CODE = `{/* Empty — render guidance, not a blank row */}
<span className="filter-empty">No filters applied — matching all services</span>

{/* Loading — skeleton at the chip's ~22px height */}
<span role="status" aria-label="Loading filters">
  <span className="sk-line" style={{ inlineSize: 64, blockSize: 22 }} />
</span>

{/* Disabled — locked / read-only filter */}
<Chip aria-disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
  <span style={{ color: "var(--fg-subtle)" }}>env:</span>production
  <Icons.lock size={10} />
</Chip>

{/* Invalid — chip shows symptom, Alert shows remedy */}
<Chip tone="bad">region:??</Chip>
<Alert tone="danger">          {/* role="alert" auto-set */}
  <AlertTitle>Filter not applied</AlertTitle>
  <AlertDescription>region:?? is not a known region.</AlertDescription>
</Alert>`;

// Small labelled row used by the States frame so each state is named.
function StateRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',
        gap: 16,
        alignItems: 'start',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.04em',
          color: 'var(--fg-faint)',
          lineHeight: 1.5,
          paddingBlockStart: 2,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', minBlockSize: 22 }}>
        {children}
      </div>
    </div>
  );
}

// ==========================================================================
// PAGE
// ==========================================================================
export default function ChipPage() {
  const [filters, setFilters] = React.useState([
    'region:us-east-1',
    'tier:T1',
    'lang:Go',
  ]);

  return (
    <Section
      id="chip"
      num="09b"
      title="Chip"
      desc="An inline attribute token — 4px-radius rectangle, Geist Mono. Use for versions, refs, deltas, metrics, and removable filter values. Distinct from Pill (state) and Badge (count)."
    >
      {/* ====================================================================
          Sibling cross-link
          ==================================================================== */}
      <Lede>
        See also{' '}
        <a
          href="/pills"
          style={{
            color: 'var(--ember)',
            textDecoration: 'underline',
            textDecorationColor: 'color-mix(in srgb, var(--ember) 40%, transparent)',
          }}
        >
          Pill
        </a>{' '}
        (status label: "healthy", "deploying") and{' '}
        <a
          href="/badges"
          style={{
            color: 'var(--ember)',
            textDecoration: 'underline',
            textDecorationColor: 'color-mix(in srgb, var(--ember) 40%, transparent)',
          }}
        >
          Badge
        </a>{' '}
        (count: inbox unread, PRs awaiting review).
      </Lede>

      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('chip')} ariaLabel="package manager" />
      <Lede>
        Ships alongside <Mono>Pill</Mono> and <Mono>Badge</Mono> from the same{' '}
        <Mono>@eidos/ui</Mono> package. The CLI copies the component file into
        your repo — Eidos is source-shipped, not a locked dependency. Pick the{' '}
        <em>Manual</em> tab if you need to hand-install.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="version + delta trend" row code={USAGE_CODE}>
        <Chip>v4.18.2</Chip>
        <Chip tone="ok" trend="up">
          +12.4%
        </Chip>
      </Frame>
      <Lede>
        The chip reads like a <Mono>{'<kbd>'}</Mono>: rectangular, monospaced,
        tight. Pass <Mono>tone</Mono> to colour by verdict, <Mono>trend</Mono>{' '}
        to lead with a 10 px arrow, and <Mono>onRemove</Mono> to make it
        dismissible.
      </Lede>

      {/* ====================================================================
          3. VARIANTS — Examples divider
          ==================================================================== */}
      <div
        style={{
          marginTop: 36,
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--fg-faint)',
          }}
        >
          Examples
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ---- Tones ---- */}
      <SubHead meta="8 tones">Tones</SubHead>
      <Frame
        label="neutral · ok · bad · warn · ember · tier-t1 · tier-t2 · tier-t3"
        row
        code={TONES_CODE}
      >
        <Chip>v4.18.2</Chip>
        <Chip tone="ok">p95 142ms</Chip>
        <Chip tone="bad">SAST 3</Chip>
        <Chip tone="warn">SAST 1</Chip>
        <Chip tone="ember">T1</Chip>
        <Chip tone="tier-t1">tier-t1</Chip>
        <Chip tone="tier-t2">tier-t2</Chip>
        <Chip tone="tier-t3">tier-t3</Chip>
      </Frame>
      <Lede>
        <Mono>ok</Mono> / <Mono>bad</Mono> / <Mono>warn</Mono> map to verdict
        tones for deltas and finding counts.{' '}
        <Mono>tier-t1</Mono> / <Mono>tier-t2</Mono> / <Mono>tier-t3</Mono> are
        the reliability-tier colours used on service rows. Reserve{' '}
        <Mono>ember</Mono> for the single highest-priority slot — the single
        accent rule applies.
      </Lede>

      {/* ---- With trend ---- */}
      <SubHead meta="leading arrow">With trend</SubHead>
      <Frame
        label="trend=up · trend=down — the arrow doubles the sign for colour-blind readers"
        row
        code={TREND_CODE}
      >
        <Chip tone="ok" trend="up">
          +12.4%
        </Chip>
        <Chip tone="bad" trend="down">
          -2.1%
        </Chip>
        <Chip tone="ok" trend="up">
          +0.8%
        </Chip>
        <Chip tone="bad" trend="down">
          -4.0%
        </Chip>
      </Frame>
      <Lede>
        Always pair a delta value with <Mono>trend</Mono>. The tint encodes
        verdict; the arrow encodes direction. Together they survive greyscale —
        a reader who cannot distinguish green from red still sees the arrow.
        Trend arrows do <em>not</em> mirror under <Mono>dir=&quot;rtl&quot;</Mono>{' '}
        — up always means up.
      </Lede>

      {/* ---- With icon ---- */}
      <SubHead meta="leading icon">With icon</SubHead>
      <Frame
        label="colour dot · lucide icon — use when the attribute has a recognised visual symbol"
        row
        code={ICON_CODE}
      >
        <Chip
          icon={
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent-2)',
              }}
            />
          }
        >
          Python
        </Chip>
        <Chip
          icon={
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--warning)',
              }}
            />
          }
        >
          JavaScript
        </Chip>
        <Chip icon={<Icons.branch size={10} />}>main</Chip>
        <Chip icon={<Icons.tag size={10} />}>v2.91.0</Chip>
      </Frame>
      <Lede>
        Pass any <Mono>ReactNode</Mono> to <Mono>icon</Mono>. Use an 8 px
        colour dot for language/runtime identity (GitHub linguist pattern) —
        always from <Mono>var(--*)</Mono> tokens, never raw hex. Use a 10 px
        icon glyph for categorical tags like branch or ref. Keep the icon
        decorative — the label still carries the meaning.
      </Lede>

      {/* ---- Removable ---- */}
      <SubHead meta="interactive">Removable (filter chips)</SubHead>
      <Frame
        label="onRemove renders a trailing × — remove a chip and the compiled query below updates"
        row
        code={REMOVABLE_CODE}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
              minBlockSize: 24,
            }}
          >
            {filters.map((f) => (
              <Chip
                key={f}
                onRemove={() =>
                  setFilters((prev) => prev.filter((x) => x !== f))
                }
                removeLabel={`Remove filter ${f}`}
              >
                <span style={{ color: 'var(--fg-subtle)', fontWeight: 500 }}>
                  {f.split(':')[0]}:
                </span>
                {f.split(':')[1]}
              </Chip>
            ))}
            {filters.length === 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.04em',
                    color: 'var(--fg-subtle)',
                  }}
                >
                  No filters applied — matching all services
                </span>
                <button
                  type="button"
                  className="t-link"
                  style={{
                    fontSize: 'var(--text-xs)',
                    letterSpacing: '0.04em',
                    color: 'var(--ember)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 4px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  onClick={() =>
                    setFilters(['region:us-east-1', 'tier:T1', 'lang:Go'])
                  }
                >
                  Reset
                </button>
              </span>
            )}
          </div>

          {/* INNOVATION — the chips ARE a query. Show what they compile to,
              live, so removing a chip visibly rewrites the predicate. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 10,
              marginBlockStart: 16,
              paddingBlockStart: 12,
              borderBlockStart: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--fg-faint)',
                flex: '0 0 auto',
              }}
              aria-hidden="true"
            >
              where
            </span>
            <code
              aria-live="polite"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-sm)',
                fontVariantNumeric: 'tabular-nums',
                color: 'var(--fg-muted)',
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}
            >
              {filters.length === 0 ? (
                <span style={{ color: 'var(--fg-faint)' }}>(no predicate)</span>
              ) : (
                filters.map((f, i) => (
                  <React.Fragment key={f}>
                    {i > 0 && (
                      <span style={{ color: 'var(--ember)' }}> AND </span>
                    )}
                    <span style={{ color: 'var(--fg-subtle)' }}>
                      {f.split(':')[0]}
                    </span>
                    <span style={{ color: 'var(--fg-faint)' }}> = </span>
                    <span style={{ color: 'var(--fg)' }}>
                      {f.split(':')[1]}
                    </span>
                  </React.Fragment>
                ))
              )}
            </code>
          </div>
        </div>
      </Frame>
      <Lede>
        Passing <Mono>onRemove</Mono> adds the <Mono>removable</Mono> class and
        renders a trailing <Mono>chip-x</Mono> button with the given{' '}
        <Mono>removeLabel</Mono>. The label-side key (<Mono>region:</Mono>,{' '}
        <Mono>tier:</Mono>) should use <Mono>--fg-subtle</Mono> so the value
        reads first. Always provide a descriptive <Mono>removeLabel</Mono> — the
        ✕ glyph alone is meaningless to a screen reader. The compiled{' '}
        <Mono>where</Mono> predicate underneath is{' '}
        <Mono>aria-live=&quot;polite&quot;</Mono>, so each removal is announced
        as the query rewrites.
      </Lede>

      {/* ====================================================================
          3e. STATES — empty · loading · disabled · invalid
          ==================================================================== */}
      <SubHead meta="empty · loading · disabled · invalid">States</SubHead>
      <Frame
        label="every state a filter bar passes through, rendered explicitly"
        code={STATES_CODE}
      >
        <div style={{ display: 'grid', gap: 18, width: '100%' }}>
          {/* Empty */}
          <StateRow label="Empty — no filters yet">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.04em',
                color: 'var(--fg-subtle)',
              }}
            >
              No filters applied — matching all services
            </span>
          </StateRow>

          {/* Loading */}
          <StateRow label="Loading — facets resolving">
            <span
              role="status"
              aria-label="Loading filters"
              style={{ display: 'inline-flex', gap: 8 }}
            >
              {[64, 52, 78].map((w) => (
                <span
                  key={w}
                  aria-hidden="true"
                  className="sk-line"
                  style={{
                    inlineSize: w,
                    blockSize: 22,
                    borderRadius: 4,
                    display: 'inline-block',
                  }}
                />
              ))}
            </span>
          </StateRow>

          {/* Disabled */}
          <StateRow label="Disabled — locked / read-only filter">
            <Chip
              aria-disabled="true"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <span style={{ color: 'var(--fg-subtle)', fontWeight: 500 }}>
                env:
              </span>
              production
              <Icons.lock size={10} aria-hidden="true" />
            </Chip>
          </StateRow>

          {/* Invalid */}
          <StateRow label="Invalid — unparseable filter value">
            <div style={{ display: 'grid', gap: 8 }}>
              <Chip tone="bad">
                <span style={{ color: 'var(--fg-subtle)', fontWeight: 500 }}>
                  region:
                </span>
                ??
              </Chip>
              <Alert tone="danger">
                <AlertTitle>Filter not applied</AlertTitle>
                <AlertDescription>
                  <Mono tone="subtle">region:??</Mono> is not a known region.
                  Remove it or pick a value like{' '}
                  <Mono tone="subtle">us-east-1</Mono>.
                </AlertDescription>
              </Alert>
            </div>
          </StateRow>
        </div>
      </Frame>
      <Lede>
        A chip never invents its own loading or error chrome. While facets
        resolve, render a <Mono>sk-line</Mono> skeleton at the chip's ~22 px
        height; a locked filter is a chip with <Mono>aria-disabled</Mono> at
        0.5 opacity (and a lock glyph so it does not rely on dimness alone); a
        value that fails validation gets a <Mono>bad</Mono> chip plus a sibling{' '}
        <Mono>role=&quot;alert&quot;</Mono> Alert that names the fix — the chip
        carries the symptom, the alert carries the remedy.
      </Lede>

      {/* ====================================================================
          4. IN CONTEXT
          ==================================================================== */}
      <SubHead meta="real surface">In a service row</SubHead>
      <Lede up>
        Chips appear alongside a <Mono>Pill</Mono> status in the
        second-through-last columns of a service table. The pill answers
        &ldquo;is it healthy?&rdquo; — the chips answer &ldquo;what version,
        how fast, by how much did it change?&rdquo;
      </Lede>
      <Frame
        label="health · version · p95 latency · Δ 24h trend"
        code={`<Pill tone="success" dot>healthy</Pill>
<Chip>v4.18.2</Chip>
<Chip>p95 142ms</Chip>
<Chip tone="ok" trend="up">+0.8%</Chip>`}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
              gap: 12,
              alignItems: 'center',
              justifyItems: 'start',
              padding: '10px 14px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {['Service', 'Status', 'Version', 'p95', 'Δ 24h'].map((h) => (
              <span
                key={h}
                style={{
                  color: 'var(--fg-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {[
            {
              svc: 'checkout-api',
              health: 'success',
              label: 'healthy',
              live: false,
              v: 'v4.18.2',
              p95: '142ms',
              delta: { tone: 'ok' as const, up: true, n: '0.8%' },
            },
            {
              svc: 'auth-edge',
              health: 'ember',
              label: 'deploying',
              live: true,
              v: 'v2.91.0',
              p95: '89ms',
              delta: { tone: 'ok' as const, up: true, n: '1.2%' },
            },
            {
              svc: 'search-svc',
              health: 'warning',
              label: 'degraded',
              live: false,
              v: 'v1.44.7',
              p95: '612ms',
              delta: { tone: 'bad' as const, up: false, n: '4.0%' },
            },
            {
              svc: 'reports',
              health: 'ice',
              label: 'queued',
              live: false,
              v: 'v0.12.1',
              p95: '—',
              delta: null,
            },
          ].map((r, i) => (
            <div
              key={r.svc}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr',
                gap: 12,
                alignItems: 'center',
                justifyItems: 'start',
                padding: '10px 14px',
                borderBottom: i === 3 ? '0' : '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--fg)',
                  fontSize: 'var(--text-base)',
                }}
              >
                {r.svc}
              </span>
              <Pill tone={r.health as any} dot live={r.live}>
                {r.label}
              </Pill>
              <Chip>{r.v}</Chip>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--fg-muted)',
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: 'var(--text-base)',
                }}
              >
                {r.p95}
              </span>
              {r.delta ? (
                <Chip tone={r.delta.tone} trend={r.delta.up ? 'up' : 'down'}>
                  {r.delta.up ? '+' : '-'}
                  {r.delta.n}
                </Chip>
              ) : (
                <span style={{ color: 'var(--fg-subtle)' }}>—</span>
              )}
            </div>
          ))}
        </div>
      </Frame>
      <Lede>
        The <Mono>Pill</Mono> is always the leftmost metadata column — it
        answers whether the row needs attention. Chips follow in density order:
        version (identity), latency (current cost), trend (change). Put the
        noisiest tinted chip (trend) last so the eye reads status before delta.
      </Lede>

      {/* ====================================================================
          5. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 14,
              rowGap: 8,
              alignItems: 'baseline',
            }}
          >
            {[
              ['Tab', 'Move to the next removable chip’s ✕ button. A plain (non-removable) chip is a static <span> and is skipped — it holds no value to act on.'],
              ['Shift + Tab', 'Move to the previous ✕ button.'],
              ['Enter / Space', 'Activate the focused ✕ — fires onRemove and drops that filter.'],
            ].map(([keys, action]) => (
              <React.Fragment key={keys}>
                <kbd
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--fg)',
                    background: 'var(--surface-hover)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '2px 6px',
                    whiteSpace: 'nowrap',
                    justifySelf: 'start',
                  }}
                >
                  {keys}
                </kbd>
                <span
                  style={{
                    color: 'var(--fg-muted)',
                    fontSize: 'var(--text-base)',
                    lineHeight: 1.55,
                  }}
                >
                  {action}
                </span>
              </React.Fragment>
            ))}
          </div>
          <div
            style={{
              color: 'var(--fg-subtle)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.55,
              marginBlockStart: 10,
            }}
          >
            The chip body itself takes <em>no</em> tab stop and binds no{' '}
            <Mono>Backspace</Mono> / <Mono>Delete</Mono> shortcut — only the ✕{' '}
            <Mono>{'<button>'}</Mono> is interactive, so focus lands exactly on
            the thing it removes.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div
            style={{
              color: 'var(--fg-muted)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.55,
            }}
          >
            The chip text is read verbatim — write values that make sense
            standalone: &ldquo;v4.18.2&rdquo;, &ldquo;p95 142ms&rdquo;,
            &ldquo;+12.4%&rdquo;. The trend arrow is{' '}
            <Mono>aria-hidden</Mono> — the sign in the text carries the
            direction. The remove button must carry a meaningful{' '}
            <Mono>removeLabel</Mono>: &ldquo;Remove filter
            region:us-east-1&rdquo;, not the default &ldquo;Remove&rdquo;.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Contrast &amp; colour
          </div>
          <div
            style={{
              color: 'var(--fg-muted)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.55,
            }}
          >
            Every tone is a <Mono>--*-soft</Mono> alpha tint laid over the dark
            surface, paired with the matching <Mono>--*-text</Mono> foreground so
            text always clears AA — including the <Mono>ember</Mono> tone, which is{' '}
            <Mono>--ember-text</Mono> (ember-glow) on <Mono>--ember-soft</Mono>: the
            14% tint stays dark enough that the brighter glow foreground reads as
            high-contrast, never a flat ember-on-ember fill. Verdict (ok / bad /
            warn) is signalled by arrow direction <em>and</em> tint so it survives
            greyscale and deuteranopia.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div
            style={{
              color: 'var(--fg-muted)',
              fontSize: 'var(--text-base)',
              lineHeight: 1.55,
            }}
          >
            A static chip has no animation. The only moving parts are the
            remove button's hover transition (eased with <Mono>--ease</Mono>)
            and the loading <Mono>sk-line</Mono> shimmer. Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono> both are suppressed: the
            ✕ hover snaps without easing and the skeleton holds a static tint —
            no layout shift, and every interaction still works.
          </div>
        </div>
      </div>

      {/* ====================================================================
          6. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — remove ✕ moves to the logical start; trend arrow stays vertical'
        row
        code={`<div dir="rtl">
  <Chip>v4.18.2</Chip>
  <Chip tone="ok"  trend="up">+12.4%</Chip>
  <Chip tone="bad" trend="down">-2.1%</Chip>
  <Chip
    onRemove={() => {}}
    removeLabel="إزالة الفلتر: المنطقة"
  >
    <span style={{ color:'var(--fg-subtle)', fontWeight:500 }}>المنطقة:</span>
    الشرق الأمريكي
  </Chip>
  <Chip tone="ember">T1</Chip>
</div>`}
      >
        <div
          dir="rtl"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Chip>v4.18.2</Chip>
          <Chip tone="ok" trend="up">
            +12.4%
          </Chip>
          <Chip tone="bad" trend="down">
            -2.1%
          </Chip>
          <Chip onRemove={() => {}} removeLabel="إزالة الفلتر: المنطقة">
            <span style={{ color: 'var(--fg-subtle)', fontWeight: 500 }}>
              المنطقة:
            </span>
            الشرق الأمريكي
          </Chip>
          <Chip tone="ember">T1</Chip>
        </div>
      </Frame>
      <Lede>
        The chip uses <Mono>display: inline-flex</Mono> with logical CSS
        spacing, so the leading icon and the trailing remove button flip
        automatically with the reading direction — the ✕ moves to the{' '}
        <em>logical end</em> (left in RTL). Trend arrows (
        <Mono>trend=&quot;up&quot;</Mono> /{' '}
        <Mono>trend=&quot;down&quot;</Mono>) do <em>not</em> mirror — vertical
        direction is locale-independent.
      </Lede>

      {/* ====================================================================
          7. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head">
          <span className="label">anatomy</span>
        </div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div
            className="ana"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div
              className="stage"
              style={{ position: 'relative' }}
              aria-hidden="true"
            >
              {/* The chip under study — scaled up for legibility */}
              <span
                style={{
                  display: 'inline-flex',
                  transform: 'scale(1.9)',
                  transformOrigin: 'center',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                <Chip
                  tone="ok"
                  trend="up"
                  onRemove={() => {}}
                  removeLabel="Remove"
                >
                  +12.4%
                </Chip>
              </span>

              {/* Pin 1 — trend arrow */}
              <span
                className="lead v"
                style={{ top: -28, left: 2, height: 22 }}
              />
              <div
                className="pin"
                style={{ top: -50, left: 2, transform: 'translateX(-50%)' }}
              >
                1
              </div>

              {/* Pin 2 — label text */}
              <span
                className="lead v"
                style={{ top: -28, left: '46%', height: 22 }}
              />
              <div
                className="pin"
                style={{
                  top: -50,
                  left: '46%',
                  transform: 'translateX(-50%)',
                }}
              >
                2
              </div>

              {/* Pin 3 — remove button */}
              <span
                className="lead v"
                style={{ top: -28, right: 4, height: 22 }}
              />
              <div
                className="pin"
                style={{ top: -50, right: 4, transform: 'translateX(50%)' }}
              >
                3
              </div>

              {/* Pin 4 — background / border / radius */}
              <span
                className="lead h"
                style={{ top: '50%', right: -30, width: 24 }}
              />
              <div
                className="pin"
                style={{ top: 'calc(50% - 10px)', right: -52 }}
              >
                4
              </div>
            </div>
          </div>

          <div
            className="ana-list"
            style={{ maxWidth: 560, margin: '64px auto 0' }}
          >
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Trend arrow.</b> 10 px{' '}
              <Mono>arrowUp</Mono> / <Mono>arrowDown</Mono>, wrapped in a{' '}
              <Mono>ch-arrow</Mono> span that is <Mono>aria-hidden</Mono>.
              Present only when <Mono>trend</Mono> prop is set. Does not mirror
              in RTL — vertical direction is locale-independent.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Label.</b> Geist Mono{' '}
              <Mono>--text-xs</Mono> / 0.04 em letter-spacing. One short token:
              a version, a metric, a signed delta. No wrapping — the chip is
              always a single line.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Remove button.</b>{' '}
              <Mono>chip-x</Mono> — a real{' '}
              <Mono>{'<button type="button">'}</Mono>, 9 px ✕ icon,{' '}
              <Mono>aria-label</Mono> from <Mono>removeLabel</Mono>. Present
              only when <Mono>onRemove</Mono> is set. It is the chip's{' '}
              <em>only</em> tab stop and shows a{' '}
              <Mono>var(--ring)</Mono> focus-visible ring; Enter / Space
              activate it.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Geometry.</b> Height ~22 px /
              border-radius <Mono>4px</Mono> / 6 px horizontal padding. The
              rectangular shape (vs. Pill's <Mono>999px</Mono> capsule) is the
              visual signal: a rectangle says &ldquo;attribute&rdquo;, a capsule
              says &ldquo;state&rdquo;.
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — use a chip for attributes
          </div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Chip>v4.18.2</Chip>
            <Chip>p95 142ms</Chip>
            <Chip tone="ok" trend="up">
              +0.8%
            </Chip>
          </div>
          <div className="note">
            Version, latency, and delta are facts about a service, not its
            current condition. Chip is the right token.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — use a chip for a status
          </div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Chip tone="ok">healthy</Chip>
            <Chip tone="bad">down</Chip>
          </div>
          <div className="note">
            &ldquo;Healthy&rdquo; and &ldquo;down&rdquo; describe current state
            — that is what Pill is for. A chip with no dot misleads: it reads as
            an attribute label, not a live status.
          </div>
        </div>

        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — pair a delta with sign and arrow
          </div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Chip tone="ok" trend="up">
              +12.4%
            </Chip>
            <Chip tone="bad" trend="down">
              -2.1%
            </Chip>
          </div>
          <div className="note">
            Arrow + tint + sign = three independent channels for the same
            verdict. Survives greyscale and deuteranopia.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — rely on colour alone for a delta
          </div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Chip tone="ok">12.4%</Chip>
            <Chip tone="bad">2.1%</Chip>
          </div>
          <div className="note">
            Without a sign or arrow, a greyscale reader cannot tell which number
            is good news. Always pass <Mono>trend</Mono> and include the sign.
          </div>
        </div>

        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — label the remove button
          </div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Chip
              onRemove={() => {}}
              removeLabel="Remove filter region:us-east-1"
            >
              <span style={{ color: 'var(--fg-subtle)', fontWeight: 500 }}>
                region:
              </span>
              us-east-1
            </Chip>
          </div>
          <div className="note">
            The ✕ glyph is silent to a screen reader. Pass a descriptive{' '}
            <Mono>removeLabel</Mono> that names exactly what will be removed.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don't — stack more than two toned chips in
            one row
          </div>
          <div className="body" style={{ gap: 8, flexWrap: 'wrap' }}>
            <Chip tone="ok">ok</Chip>
            <Chip tone="bad">bad</Chip>
            <Chip tone="warn">warn</Chip>
            <Chip tone="ember">T1</Chip>
          </div>
          <div className="note">
            Four competing tones cancel each other out. Keep at most two verdict
            tones per visual group; use neutral for the rest.
          </div>
        </div>
      </div>

      {/* ====================================================================
          9. API REFERENCE
          ==================================================================== */}
      <SubHead meta="ChipProps">API reference</SubHead>
      <AutoPropsTable component="Chip" label="<Chip />" />
    </Section>
  );
}
