'use client';
// Eidos DS — Components / Separator
// Section order (DS-PAGE-STANDARD §2.2):
//   1. Installation
//   2. Usage
//   3. Variants (Horizontal · Dashed · Vertical · Inside a toolbar)
//   4. In context
//   5. Accessibility
//   6. RTL
//   7. Anatomy
//   8. Do / Don't
//   9. API reference
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Separator, Lede, Mono } from '@/ds/core';

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Separator } from "@/components/forge/separator"

export function Demo() {
  return (
    <div>
      <div>Profile</div>
      <Separator />
      <div>Account</div>
    </div>
  )
}`;

const VERTICAL_CODE = `<div style={{ display: "flex", alignItems: "center", gap: 14 }}>
  <span>Eidos Cloud</span>
  <Separator orientation="vertical" />
  <span>us-east-1</span>
  <Separator orientation="vertical" />
  <span>Team · 24 seats</span>
</div>`;

const DASHED_CODE = `<Separator variant="dashed" />`;

const SEMANTIC_CODE = `{/* Structural boundary — announced by screen readers */}
<Separator decorative={false} />`;

const RTL_CODE = `<div dir="rtl">
  {/* The rule is mirror-symmetric — nothing to flip.
      Items in a flex row pack from the right. */}
  <span>فورج كلاود</span>
  <Separator orientation="vertical" />
  <span>us-east-1</span>
</div>`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SeparatorPage() {
  return (
    <Section
      id="separator"
      title="Separator"
      desc="A 1-px hairline that groups content into bands. Decorative by default — pass decorative={false} when the boundary carries structural meaning for screen readers."
    >
      {/* ==================================================================
          1. INSTALLATION
          ================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('separator')} ariaLabel="package manager" />
      <Lede>
        Ships <Mono>Separator</Mono> — a zero-dependency divider with the correct <Mono>role="separator"</Mono> / <Mono>aria-orientation</Mono> when semantic, or <Mono>aria-hidden</Mono> when decorative. The <Mono>.separator</Mono> and <Mono>.toolbar-sep</Mono> CSS classes live in the shared stylesheet.
      </Lede>

      {/* ==================================================================
          2. USAGE
          ================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede up>Place between sections of a page, between clusters in a toolbar, or vertically between siblings in a flex row. If you can remove it and nothing blurs together, remove it.</Lede>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <div style={{ padding: '10px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Profile</div>
          <Separator />
          <div style={{ padding: '10px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Account</div>
        </div>
      </Frame>

      {/* ==================================================================
          3. VARIANTS
          ================================================================== */}
      <div className="ds-examples-rule" style={{ marginTop: 36, marginBottom: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ── Horizontal solid ─────────────────────────────────────────────── */}
      <SubHead meta="2 variants">Variants</SubHead>
      <Frame
        label="solid (default) · dashed"
        code={`<Separator variant="solid" />  {/* default */}
<Separator variant="dashed" />`}
      >
        <div style={{ width: '100%', maxWidth: 320 }}>
          <div style={{ padding: '12px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Profile</div>
          <Separator variant="solid" />
          <div style={{ padding: '12px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Account</div>
          <Separator variant="dashed" />
          <div style={{ padding: '12px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Billing</div>
        </div>
      </Frame>
      <Lede>Use <Mono>variant="solid"</Mono> (default) for structural boundaries. Use <Mono>variant="dashed"</Mono> for softer, non-structural breaks — time-based groups, optional sections, or a visual breath between related clusters.</Lede>

      {/* ── Vertical ─────────────────────────────────────────────────────── */}
      <SubHead meta="vertical">Vertical</SubHead>
      <Frame label="inside a flex row · stretches to row height" code={VERTICAL_CODE}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'var(--surface)' }}>
          <div>
            <div className="t-mono-label">Workspace</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>Eidos Cloud</div>
          </div>
          <Separator orientation="vertical" />
          <div>
            <div className="t-mono-label">Region</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>us-east-1</div>
          </div>
          <Separator orientation="vertical" />
          <div>
            <div className="t-mono-label">Plan</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>Team · 24 seats</div>
          </div>
        </div>
      </Frame>
      <Lede>The vertical separator renders as a <Mono>{'<span>'}</Mono> (inline-flow compatible) with <Mono>align-self: stretch</Mono> so it fills the row height automatically. No fixed height needed.</Lede>

      {/* ── Semantic ─────────────────────────────────────────────────────── */}
      <SubHead meta="decorative vs semantic">Semantic use</SubHead>
      <Frame label="decorative={false} → role=separator · announced by screen readers" code={SEMANTIC_CODE}>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <div style={{ padding: '8px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>User preferences</div>
          <Separator decorative={false} />
          <div style={{ padding: '8px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Team settings</div>
          <Separator decorative={false} />
          <div style={{ padding: '8px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Billing {'&'} plans</div>
        </div>
      </Frame>
      <Lede>Decorative is the right default for most uses — the surrounding headings and spacing already communicate the grouping. Flip to <Mono>decorative={'{false}'}</Mono> only when the line is the primary signal of structure (e.g., a settings sidebar where sections have no visible headings).</Lede>

      {/* ── Inside a toolbar ─────────────────────────────────────────────── */}
      <SubHead meta="inline">Inside a toolbar</SubHead>
      <Frame label="`.toolbar-sep` — the shorthand used by Toolbar / Menubar">
        <div className="toolbar">
          <button className="btn icon ghost" aria-label="Bold"><Icons.bold size={14} /></button>
          <button className="btn icon ghost" aria-label="Italic"><Icons.italic size={14} /></button>
          <span className="toolbar-sep" aria-hidden="true" />
          <button className="btn icon ghost" aria-label="Link"><Icons.link size={14} /></button>
        </div>
      </Frame>
      <Lede>The <Mono>.toolbar-sep</Mono> utility class is a 1-px vertical rule tuned for <Mono>Toolbar</Mono> and <Mono>Menubar</Mono> — same <Mono>--border</Mono> token, 4px margin on each side. Prefer <Mono>Separator orientation="vertical"</Mono> everywhere else.</Lede>

      {/* ==================================================================
          4. IN CONTEXT
          ================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="settings card — horizontal separators between rows">
        <div style={{ width: 360, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--bg)' }}>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', marginBottom: 4 }}>Eidos Cloud</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Manage your workspace settings</div>
          </div>
          <Separator />
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 4 }}>Team</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>24 members · Pro plan</div>
          </div>
          <Separator />
          <div style={{ padding: '16px 20px' }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 4 }}>Billing</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Next renewal: June 1, 2026</div>
          </div>
          <Separator />
          <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn outline sm">Manage workspace</button>
          </div>
        </div>
      </Frame>

      {/* ==================================================================
          5. ACCESSIBILITY
          ================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            A separator is not interactive — it is never in the tab order and has no key bindings. Keyboard users move past it to the next focusable control as if it were not there.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            A meaningful divider takes <Mono>role="separator"</Mono> (with <Mono>aria-orientation="vertical"</Mono> when vertical) so the boundary is announced. A purely decorative line sets <Mono>aria-hidden="true"</Mono> via <Mono>decorative={'{true}'}</Mono> (default) so it is skipped entirely.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The hairline uses <Mono>--border</Mono>. On busy or elevated surfaces step up to <Mono>--border-strong</Mono> via <Mono>className</Mono>. A separator is a visual aid — it is exempt from 4.5:1 text contrast — but grouping must never depend on the line alone; keep headings and spacing that carry the same meaning.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            None. A separator is static — it never animates or transitions, so there is nothing to disable under <Mono>prefers-reduced-motion</Mono>.
          </div>
        </div>
      </div>

      {/* ==================================================================
          6. RTL
          ================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — symmetric rule; items pack from the right'
        code={RTL_CODE}
        lang="tsx"
      >
        <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'var(--surface)' }}>
          <div>
            <div className="t-mono-label">مساحة العمل</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>فورج كلاود</div>
          </div>
          <Separator orientation="vertical" />
          <div>
            <div className="t-mono-label">المنطقة</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>us-east-1</div>
          </div>
        </div>
      </Frame>
      <Lede>Honestly minimal: a separator is mirror-symmetric, so RTL changes nothing about the line itself. A horizontal <Mono>{'<hr>'}</Mono> is unaffected, and a vertical rule in a flex row inherits the start-edge alignment of its parent — items pack from the right while the hairline stays put. No directional glyph to mirror.</Lede>

      {/* ==================================================================
          7. ANATOMY
          ================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              <div style={{ padding: '10px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Profile</div>
              <Separator orientation="horizontal" variant="solid" />
              <div style={{ padding: '10px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>Eidos Cloud</span>
                <Separator orientation="vertical" />
                <span>us-east-1</span>
              </div>
              <Separator orientation="horizontal" variant="dashed" />
              <div style={{ padding: '10px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Yesterday</div>
              <span className="lead h" style={{ top: 30, right: -28, width: 24 }} />
              <span className="lead v" style={{ top: 44, left: 130, height: 18 }} />
              <span className="lead h" style={{ top: 86, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 30, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 22, right: -52 }}>1</div>
              <div className="pin" style={{ top: 22, left: -52 }}>2</div>
              <div className="pin" style={{ top: 44, left: 130, transform: 'translate(-50%, -100%)' }}>3</div>
              <div className="pin" style={{ top: 78, right: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Horizontal rule.</b> Full-bleed 1px hairline rendered as <Mono>{'<hr>'}</Mono> between sibling content blocks.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Color.</b> <Mono>var(--border)</Mono> — same token across orientations and variants.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Vertical variant.</b> Renders as <Mono>{'<span>'}</Mono> with <Mono>align-self: stretch</Mono> inside a flex row. Used between clusters in a toolbar or stat row.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Dashed variant.</b> <Mono>border-top: 1px dashed var(--border)</Mono>. For soft, non-structural breaks — time-based dividers, optional sections.</span>
          </div>
        </div>
      </div>

      {/* ==================================================================
          8. DO / DON'T
          ================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — use separators when two blocks would otherwise blur</div>
          <div className="body">
            <div style={{ width: 260 }}>
              <div style={{ padding: '8px 0', fontSize: 'var(--text-base)' }}>Profile</div>
              <Separator />
              <div style={{ padding: '8px 0', fontSize: 'var(--text-base)' }}>Account</div>
            </div>
          </div>
          <div className="note">The hairline tells the reader these are sibling sections, not children. Spacing alone would be ambiguous.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — stack separators inside an already-bordered container</div>
          <div className="body">
            <div style={{ width: 260, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 8, background: 'var(--surface)' }}>
              <div style={{ padding: '8px', fontSize: 'var(--text-base)' }}>Item A</div>
              <Separator />
              <div style={{ padding: '8px', fontSize: 'var(--text-base)' }}>Item B</div>
            </div>
          </div>
          <div className="note">The card border already groups the children. The extra hairline competes with it and adds visual noise.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — use vertical for inline clusters</div>
          <div className="body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <span style={{ fontSize: 'var(--text-base)' }}>Eidos Cloud</span>
              <Separator orientation="vertical" />
              <span style={{ fontSize: 'var(--text-base)' }}>us-east-1</span>
            </div>
          </div>
          <div className="note">A vertical rule cleanly separates stat or label clusters within a flex row without breaking the horizontal flow.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use as the only grouping signal</div>
          <div className="body">
            <div style={{ width: 260 }}>
              <Separator />
              <div style={{ padding: '8px 0', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>No headings above or below</div>
              <Separator />
            </div>
          </div>
          <div className="note">A hairline alone cannot communicate what the groups mean. Always pair with a heading, label, or visible context.</div>
        </div>
      </div>

      {/* ==================================================================
          9. API REFERENCE
          ================================================================== */}
      <SubHead meta="SeparatorProps">API reference</SubHead>
      <AutoPropsTable component="Separator" label="<Separator />" />
    </Section>
  );
}
