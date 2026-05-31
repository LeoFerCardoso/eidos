'use client';
// Eidos DS — Components / Spinner
// Page layout:
//   1. Installation     (TabbedCode: pnpm · npm · yarn · bun · Manual)
//   2. Usage            (Frame: import + minimal render)
//   3. Variants         (ring · dots · bars)
//   4. Sizes            (sm · md · lg · numeric)
//   5. Colors           (currentColor + explicit)
//   6. In context       (button, pill, card placeholder)
//   7. Decision matrix  (Spinner vs Progress vs Skeleton)
//   8. Accessibility    (keyboard · screen reader · contrast · motion)
//   9. RTL
//  10. Anatomy
//  11. Do / Don't
//  12. API reference
import React from 'react';
import {
  Spinner,
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  AutoPropsTable,
  installTabs,
  Lede,
  Mono,
} from '@/ds/core';

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Spinner } from "@/components/forge/spinner"

export function Demo() {
  return <Spinner variant="ring" size="md" />
}`;

const VARIANTS_CODE = `<Spinner variant="ring" />   {/* circular border arc — default */}
<Spinner variant="dots" />   {/* inline-text rhythm */}
<Spinner variant="bars" />   {/* media / equalizer */}`;

const SIZES_CODE = `<Spinner size="sm" />  {/* 12px */}
<Spinner size="md" />  {/* 16px — default */}
<Spinner size="lg" />  {/* 24px */}
<Spinner size={40} />  {/* any positive integer */}`;

const COLORS_CODE = `{/* Wrap in a colored element — Spinner inherits currentColor */}
<span style={{ color: 'var(--ember)' }}>
  <Spinner size="md" />
</span>

{/* Or pass color directly */}
<Spinner size="md" color="var(--ember)" />`;

const INCONTEXT_CODE = `{/* In a button — disable + aria-busy while loading */}
<button className="btn ember" disabled={busy} aria-busy={busy}>
  {busy && <Spinner size={14} color="var(--ember-fg)" aria-label="Deploying" />}
  {busy ? 'Deploying…' : 'Deploy'}
</button>

{/* Inline pill status */}
<span className="pill ember">
  <Spinner size={10} />
  Deploying
</span>

{/* Card placeholder while content fetches */}
<div className="sp-center" role="status" aria-live="polite">
  <Spinner size={24} />
  <span>Loading metrics…</span>
</div>`;

const RTL_CODE = `<div dir="rtl">
  <button className="btn ember">
    <Spinner size={14} color="var(--ember-fg)" aria-label="جاري النشر" />
    جاري النشر…
  </button>
</div>`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SpinnerPage() {
  const [busy, setBusy] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <Section
      id="spinner"
      num="22"
      title="Spinner"
      desc="Tiny, single-purpose loading indicator. Use only when the wait is short (≤10s) and progress is unknown — anything longer or measurable should be a Progress bar."
    >
      {/* ===================================================================
          1. INSTALLATION
          =================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('spinner')} ariaLabel="package manager" />
      <Lede>
        Ships <Mono>Spinner</Mono> with the <Mono>.sp-ring</Mono>, <Mono>.sp-dots</Mono>, and <Mono>.sp-bars</Mono> CSS animations. Inherits <Mono>currentColor</Mono> so it blends without extra wrapper styling.
      </Lede>

      {/* ===================================================================
          2. USAGE
          =================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Spinner variant="ring" size="md" />
      </Frame>

      {/* Examples divider */}
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

      {/* ===================================================================
          3. VARIANTS
          =================================================================== */}
      <SubHead meta="3 variants">Variants</SubHead>
      <Frame label="ring · dots · bars — pick by context" row code={VARIANTS_CODE}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {(['ring', 'dots', 'bars'] as const).map((v) => (
            <div key={v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Spinner variant={v} size="md" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{v}</span>
            </div>
          ))}
        </div>
      </Frame>
      <Lede up>
        <Mono>ring</Mono> suits buttons, page-level waits, and network calls. <Mono>dots</Mono> sits inline in body text without disrupting line height. <Mono>bars</Mono> evokes an audio equalizer for media or streaming contexts.
      </Lede>

      {/* ===================================================================
          4. SIZES
          =================================================================== */}
      <SubHead meta="sm · md · lg · numeric">Sizes</SubHead>
      <Frame label="named tokens and any integer" row code={SIZES_CODE}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
          {([['sm', 12], ['md', 16], ['lg', 24], [40, 40]] as const).map(([label, px]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Spinner variant="ring" size={typeof label === 'number' ? label : label as 'sm' | 'md' | 'lg'} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>
                {typeof label === 'number' ? `${label}px` : `${label} (${px}px)`}
              </span>
            </div>
          ))}
        </div>
      </Frame>

      {/* ===================================================================
          5. COLORS
          =================================================================== */}
      <SubHead meta="currentColor inherits">Colors</SubHead>
      <Frame label="ember · success · warning · danger · ice · muted — set color on a parent or pass color prop" row code={COLORS_CODE}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { name: 'ember',   v: 'var(--ember)' },
            { name: 'success', v: 'var(--success)' },
            { name: 'warning', v: 'var(--warning)' },
            { name: 'danger',  v: 'var(--danger)' },
            { name: 'ice',     v: 'var(--ice)' },
            { name: 'muted',   v: 'var(--fg-muted)' },
          ].map(({ name, v }) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Spinner size="md" color={v} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{name}</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* ===================================================================
          6. IN CONTEXT
          =================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame
        label="inside a button, prefixing a status pill, replacing card content while it fetches"
        code={INCONTEXT_CODE}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn ember"
              disabled={busy}
              aria-busy={busy}
              onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 1500); }}
            >
              {busy
                ? <><Spinner size={14} color="var(--ember-fg)" aria-label="Deploying" /> Deploying…</>
                : <><Icons.rocket size={14} /> Deploy</>
              }
            </button>
            <button
              className="btn outline"
              disabled={loading}
              aria-busy={loading}
              onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}
            >
              {loading && <Spinner size={14} />}
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <span className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Spinner size={10} variant="dots" />
              Syncing
            </span>
            <span className="pill ember" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Spinner size={10} />
              Deploying
            </span>
          </div>

          <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="sp-center" style={{ minHeight: 140 }} role="status" aria-live="polite">
              <Spinner size={24} />
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Loading metrics…</span>
            </div>
          </div>
        </div>
      </Frame>

      {/* ===================================================================
          DECISION MATRIX
          =================================================================== */}
      <SubHead meta="when to use">Spinner vs Progress vs Skeleton</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Decision matrix</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use</th>
              <th>Wait length</th>
              <th>Knowable progress?</th>
              <th>Best for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tok-name">Spinner</td>
              <td className="mono">≤ 10s</td>
              <td className="mono">no</td>
              <td>Button feedback, inline status, async calls without milestones.</td>
            </tr>
            <tr>
              <td className="tok-name">Progress (determinate)</td>
              <td className="mono">{'>'} 10s</td>
              <td className="mono">yes</td>
              <td>Uploads, exports, multi-step jobs — anything you can show 0→100%.</td>
            </tr>
            <tr>
              <td className="tok-name">Skeleton</td>
              <td className="mono">page-level</td>
              <td className="mono">no</td>
              <td>Layout-aware loading state for lists/cards/dashboards on first paint.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===================================================================
          7. ACCESSIBILITY
          =================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            A spinner is not interactive and never in the tab order. When it sits inside a button, set <Mono>aria-busy=&quot;true&quot;</Mono> and <Mono>disabled</Mono> on that control so keyboard users cannot activate an in-flight action. Restore focus after the wait ends.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The visual animation is <Mono>aria-hidden</Mono>; the accessible name comes from a visually-hidden span inside the <Mono>role=&quot;status&quot;</Mono> wrapper. The default label is <Mono>&quot;Loading&quot;</Mono> — override with <Mono>aria-label</Mono> when the wait has a specific name (e.g. <Mono>&quot;Saving changes&quot;</Mono>). Pair with an <Mono>aria-live=&quot;polite&quot;</Mono> region on the placeholder so the announcement fires once.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The spinner inherits <Mono>currentColor</Mono>, so it picks up the surrounding text color and clears WCAG 2.1 non-text contrast (3:1) wherever that text already passes. On an ember fill pass <Mono>var(--ember-fg)</Mono> — the theme-aware ink token (dark in dark mode, white in light mode), never a literal hex.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The rotation is continuous by design. Under <Mono>prefers-reduced-motion: reduce</Mono>, the animation duration stretches to 1800ms — slow enough not to strobe, still visually active. Always pair the spinner with a text label so the loading state reads through <em>without</em> animation.
          </div>
        </div>
      </div>

      {/* ===================================================================
          8. RTL
          =================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='spinners are visually symmetric — only the chrome around them mirrors' code={RTL_CODE}>
        <div dir="rtl" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn ember" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Spinner size={14} color="var(--ember-fg)" />
            جاري النشر…
          </button>
          <span className="pill ember" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Spinner size={10} />
            قيد المزامنة
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
            <Spinner size={14} />
            <span>تحميل البيانات…</span>
          </span>
        </div>
      </Frame>
      <Lede>
        Spinners are visually symmetric, so they look identical under RTL. The layout flip happens around them — <Mono>gap</Mono> in a <Mono>flex</Mono> row places the spinner at the trailing visual edge automatically in both directions. No directional-glyph mirroring needed.
      </Lede>

      {/* ===================================================================
          9. ANATOMY
          =================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Spinner variant="ring" size={64} color="var(--ember)" />
              <span className="lead h" style={{ top: 28, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 12, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 14, right: -28, width: 24 }} />
              <div className="pin" style={{ top: 20, left: -52 }}>1</div>
              <div className="pin" style={{ top: 4, right: -52 }}>2</div>
              <div className="pin" style={{ bottom: 6, right: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Track.</b> 18% of the foreground color at 2px. Stays visible so the loading state is unambiguous even at small sizes.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Arc.</b> Top border at full <Mono>currentColor</Mono>. ~⅓ of the circumference — a full sweep would read as frozen.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Motion.</b> Linear 720ms loop. Under <Mono>prefers-reduced-motion</Mono> the loop slows to 1800ms — still visually active, not strobing.</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          10. DO / DON'T
          =================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — pair with a label</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="surface" style={{ padding: 14, width: '100%' }}>
              <div className="sp-center" style={{ minHeight: 80 }} role="status">
                <Spinner size={20} />
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Loading metrics…</span>
              </div>
            </div>
          </div>
          <div className="note">A spinner alone is ambiguous — "is it stuck?" A label names what&apos;s loading and gives screen readers something to announce.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — spin for 30+ seconds</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="surface" style={{ padding: 14, width: '100%' }}>
              <div className="sp-center" style={{ minHeight: 80 }}>
                <Spinner size={20} />
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Loading…</span>
              </div>
            </div>
          </div>
          <div className="note">If the wait is long, switch to a Progress bar or Skeleton. A 30-second spinner reads as "frozen" or "broken".</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — ember fill needs contrasting ink</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn ember" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Spinner size={14} color="var(--ember-fg)" />
                Deploying…
              </button>
            </div>
          </div>
          <div className="note">On an ember background use <Mono>var(--ember-fg)</Mono> — the theme-aware token (dark in dark mode, white in light mode). Never pass ember-color into a spinner that sits on an ember surface.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — spinner alone in a button</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn ember" disabled style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Spinner size={14} color="var(--ember-fg)" />
              </button>
            </div>
          </div>
          <div className="note">Keep the label visible alongside the spinner so the button&apos;s purpose is clear during the wait — don&apos;t replace the text.</div>
        </div>
      </div>

      {/* ===================================================================
          11. API REFERENCE
          =================================================================== */}
      <SubHead meta="SpinnerProps">API reference</SubHead>
      <AutoPropsTable component="Spinner" label="<Spinner />" />
    </Section>
  );
}
