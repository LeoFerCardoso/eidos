'use client';
// Eidos Mobile — Checkbox. A tappable row combining a label and a square
// box with a checkmark for multi-select lists (settings panels, filter
// sheets, bulk-action drawers). States: unchecked, checked, indeterminate,
// disabled. The ember fill with dark-ink checkmark meets WCAG AA; the full
// row is the touch target (≥44px tall), never just the box alone.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ── Primitive ────────────────────────────────────────────────────────────────

type CheckState = 'unchecked' | 'checked' | 'indeterminate';

function CheckBox({
  state = 'unchecked',
  disabled = false,
}: {
  state?: CheckState;
  disabled?: boolean;
}) {
  const checked = state === 'checked';
  const mixed   = state === 'indeterminate';
  const active  = checked || mixed;
  return (
    <span
      role="checkbox"
      aria-checked={mixed ? 'mixed' : checked}
      aria-disabled={disabled || undefined}
      style={{
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: 'var(--radius-md)',
        border: active ? 'none' : `1.5px solid ${disabled ? 'var(--fg-faint)' : 'var(--border-strong)'}`,
        background: active ? (disabled ? 'var(--fg-faint)' : 'var(--accent)') : 'transparent',
        display: 'grid',
        placeItems: 'center',
        transition: 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
      }}
      aria-hidden="true"
    >
      {checked && !disabled && (
        <Icons.check size={13} color="var(--ember-fg)" strokeWidth={2.5} />
      )}
      {checked && disabled && (
        <Icons.check size={13} color="var(--bg)" strokeWidth={2.5} />
      )}
      {mixed && (
        <Icons.minus size={11} color={disabled ? 'var(--bg)' : 'var(--ember-fg)'} strokeWidth={2.5} />
      )}
    </span>
  );
}

function CheckRow({
  label,
  sublabel,
  state = 'unchecked',
  disabled = false,
}: {
  label: string;
  sublabel?: string;
  state?: CheckState;
  disabled?: boolean;
}) {
  const [s, setS] = React.useState<CheckState>(state);
  function cycle() {
    if (disabled) return;
    setS((prev) => prev === 'checked' ? 'unchecked' : 'checked');
  }
  return (
    <div
      className={disabled ? undefined : 'focus-ring'}
      role="checkbox"
      aria-checked={s === 'indeterminate' ? 'mixed' : s === 'checked'}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={cycle}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); cycle(); } }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 44,
        paddingInline: 'var(--space-4)',
        paddingBlock: 'var(--space-2)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        background: 'transparent',
      }}
    >
      <CheckBox state={disabled ? state : s} disabled={disabled} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-px)' }}>
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: disabled ? 'var(--fg-muted)' : 'var(--fg)', lineHeight: 1.35 }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>{sublabel}</span>
        )}
      </span>
    </div>
  );
}

// ── Screen demo ──────────────────────────────────────────────────────────────

function CheckboxScreen() {
  const [items, setItems] = React.useState([
    { id: 'alerts',   label: 'Deployment alerts',   sub: 'Push + email',         checked: true },
    { id: 'reviews',  label: 'Review requests',      sub: 'Assigned to me',       checked: true },
    { id: 'outages',  label: 'Incident pages',       sub: 'P0 and P1 only',       checked: false },
    { id: 'digests',  label: 'Weekly digest',        sub: 'Every Monday 9 AM',    checked: false },
  ]);

  function toggle(id: string) {
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, checked: !it.checked } : it));
  }

  const checkedCount = items.filter((i) => i.checked).length;
  const allChecked = checkedCount === items.length;
  const someChecked = checkedCount > 0 && checkedCount < items.length;

  function toggleAll() {
    const next = !allChecked;
    setItems((prev) => prev.map((it) => ({ ...it, checked: next })));
  }

  // Earned, on-thesis micro-interaction: an empty selection is an *invalid*
  // state for a notifications sheet — surface it live, in product voice,
  // wired to the same count that drives the indeterminate parent box.
  const noneChecked = checkedCount === 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Nav bar */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', paddingInline: 'var(--space-4)', borderBlockEnd: '1px solid var(--border)', flexShrink: 0, marginBlockStart: 'var(--space-3)' }}>
        <span id="checkbox-demo-group-label" style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>Notification settings</span>
      </div>

      {/* Select-all row */}
      <div
        className="focus-ring"
        role="checkbox"
        aria-checked={allChecked ? true : someChecked ? 'mixed' : false}
        aria-controls="checkbox-demo-group"
        tabIndex={0}
        onClick={toggleAll}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleAll(); } }}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 44, paddingInline: 'var(--space-4)', paddingBlock: 'var(--space-2)', cursor: 'pointer', borderBlockEnd: '1px solid var(--border)' }}
      >
        <CheckBox state={allChecked ? 'checked' : someChecked ? 'indeterminate' : 'unchecked'} />
        <span style={{ flex: 1, fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--fg)' }}>
          {allChecked ? 'Deselect all' : 'Select all'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontSize: 'var(--text-xs)', color: noneChecked ? 'var(--danger-text)' : 'var(--fg-muted)' }}>
          {checkedCount}/{items.length}
        </span>
      </div>

      {/* Item rows — a true group so the select-all and rows share one labelled context */}
      <div
        id="checkbox-demo-group"
        role="group"
        aria-labelledby="checkbox-demo-group-label"
        aria-describedby={noneChecked ? 'checkbox-demo-warning' : undefined}
        aria-invalid={noneChecked || undefined}
        style={{ flex: 1, overflowY: 'auto' }}
      >
        {items.map((it, i) => (
          <div key={it.id}>
            <div
              className="focus-ring"
              role="checkbox"
              aria-checked={it.checked}
              tabIndex={0}
              onClick={() => toggle(it.id)}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(it.id); } }}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 52, paddingInline: 'var(--space-4)', paddingBlock: 'var(--space-2)', cursor: 'pointer', background: it.checked ? 'var(--ember-softer)' : 'transparent' }}
            >
              <CheckBox state={it.checked ? 'checked' : 'unchecked'} />
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-px)' }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--fg)', lineHeight: 1.35 }}>{it.label}</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>{it.sub}</span>
              </span>
            </div>
            {i < items.length - 1 && (
              <div style={{ marginInlineStart: 50, height: 1, background: 'var(--border)' }} />
            )}
          </div>
        ))}

        {/* Disabled item */}
        <div style={{ marginInlineStart: 50, height: 1, background: 'var(--border)' }} />
        <CheckRow label="Auto-remediation" sublabel="Requires Premium plan" state="unchecked" disabled />

        {/* Live validation — empty selection is invalid; announced via role="alert" */}
        {noneChecked && (
          <div
            id="checkbox-demo-warning"
            role="alert"
            style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', margin: 'var(--space-4)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--danger-border)', background: 'var(--danger-subtle)' }}
          >
            <span style={{ flexShrink: 0, display: 'grid', placeItems: 'center', marginBlockStart: 'var(--space-px)', color: 'var(--danger-text)' }} aria-hidden="true">
              <Icons.alert size={15} />
            </span>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--danger-text)', lineHeight: 1.5 }}>
              No channels selected — you&rsquo;ll miss every deploy and incident page. Turn at least one on.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Static variant grid (for Variants section) ────────────────────────────────

function StaticCheckRow({
  label,
  sublabel,
  state = 'unchecked',
  disabled = false,
}: {
  label: string;
  sublabel?: string;
  state?: CheckState;
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 44,
        paddingInline: 'var(--space-4)',
        paddingBlock: 'var(--space-2)',
        opacity: disabled ? 0.45 : 1,
        background: state === 'checked' ? 'var(--ember-softer)' : 'transparent',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <CheckBox state={state} disabled={disabled} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-px)' }}>
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: disabled ? 'var(--fg-muted)' : 'var(--fg)', lineHeight: 1.35 }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>{sublabel}</span>
        )}
      </span>
    </div>
  );
}

// ── Loading skeleton row (for the Loading state demo) ─────────────────────────

function SkeletonRow({ wide }: { wide?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: 44, paddingInline: 'var(--space-4)', paddingBlock: 'var(--space-2)' }} aria-hidden="true">
      <span className="m-skel" style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 'var(--radius-md)' }} />
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <span className="m-skel" style={{ width: wide ? '70%' : '55%', height: 11, borderRadius: 'var(--radius-md)' }} />
        <span className="m-skel" style={{ width: wide ? '45%' : '35%', height: 9, borderRadius: 'var(--radius-md)' }} />
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MobileCheckbox() {
  return (
    <Section
      id="checkbox"
      num="01"
      title="Checkbox"
      desc="A tappable full-row control for multi-select lists. States: unchecked, checked, indeterminate (partial group selection), disabled, loading, and invalid (empty selection). The full row is the touch target — never just the box."
    >
      {/* ── Usage ── */}
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>
        Use checkboxes for independent on/off choices within a list — filter sheets,
        notification preferences, bulk-action drawers. For a single standalone toggle,
        use a <Mono>Switch</Mono> instead.
      </Lede>
      <Frame label="Notification settings sheet · tap a row to toggle · Select all drives indeterminate" center>
        <DeviceFrame initial="iphone-se"><CheckboxScreen /></DeviceFrame>
      </Frame>

      {/* ── Variants / States ── */}
      <SubHead meta="variants">States</SubHead>
      <Frame label="Unchecked · checked (ember fill + dark checkmark) · indeterminate · disabled">
        <div role="group" aria-labelledby="checkbox-states-label" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', padding: 'var(--space-4) var(--space-6)', maxWidth: 380, margin: '0 auto' }}>
          <span id="checkbox-states-label" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', marginBlockEnd: 'var(--space-1)' }}>Box states</span>
          <StaticCheckRow label="Unchecked" sublabel="Default state" state="unchecked" />
          <StaticCheckRow label="Checked" sublabel="Ember fill, dark-ink mark" state="checked" />
          <StaticCheckRow label="Indeterminate" sublabel="Partial group selection" state="indeterminate" />
          <StaticCheckRow label="Disabled" sublabel="Cannot be changed" state="unchecked" disabled />
          <StaticCheckRow label="Disabled checked" sublabel="Locked on, no interaction" state="checked" disabled />
        </div>
      </Frame>

      {/* ── Loading & error states ── */}
      <SubHead meta="states">Loading &amp; error</SubHead>
      <Lede>
        While preferences sync, the list shows a shimmer skeleton — never an empty box.
        An empty selection is <b style={{ color: 'var(--fg)' }}>invalid</b> for a
        notifications sheet, so it surfaces a <Mono>role="alert"</Mono> banner the moment
        the count hits zero (try deselecting everything in the live sheet above).
      </Lede>
      <Frame label="Loading (shimmer skeleton, honours reduced-motion) · empty selection → role=&quot;alert&quot;" row>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 320 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', paddingInline: 'var(--space-4)', marginBlockEnd: 'var(--space-2)' }}>Loading</span>
          <div aria-busy="true" aria-label="Loading notification preferences">
            <SkeletonRow wide />
            <SkeletonRow />
            <SkeletonRow wide />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 320 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', paddingInline: 'var(--space-4)', marginBlockEnd: 'var(--space-2)' }}>Empty / invalid</span>
          <div
            role="alert"
            style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', marginInline: 'var(--space-4)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--danger-border)', background: 'var(--danger-subtle)' }}
          >
            <span style={{ flexShrink: 0, display: 'grid', placeItems: 'center', marginBlockStart: 'var(--space-px)', color: 'var(--danger-text)' }} aria-hidden="true">
              <Icons.alert size={15} />
            </span>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--danger-text)', lineHeight: 1.5 }}>
              No channels selected — you&rsquo;ll miss every deploy and incident page. Turn at least one on.
            </span>
          </div>
        </div>
      </Frame>

      {/* ── Anatomy ── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 36px 72px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', background: 'var(--ember-softer)' }} aria-hidden="true">
              {/* Box */}
              <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 'var(--radius-md)', background: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                <Icons.check size={13} color="var(--ember-fg)" strokeWidth={2.5} />
              </span>
              {/* Label */}
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--fg)' }}>Deployment alerts</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginInlineStart: 4 }}>Push + email</span>

              {/* Pin 1 — box */}
              <span className="lead v" style={{ top: -32, left: 11, height: 26 }} />
              <div className="pin" style={{ top: -56, left: -2 }}>1</div>

              {/* Pin 2 — checkmark */}
              <span className="lead v" style={{ top: -22, left: 22, height: 16 }} />
              <div className="pin" style={{ top: -46, left: 14 }}>2</div>

              {/* Pin 3 — label */}
              <span className="lead v" style={{ bottom: -30, left: 56, height: 24 }} />
              <div className="pin" style={{ bottom: -54, left: 40 }}>3</div>

              {/* Pin 4 — touch row */}
              <span className="lead h" style={{ top: '50%', right: -36, width: 30 }} />
              <div className="pin" style={{ top: '50%', right: -64, transform: 'translateY(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Checkbox box.</b> 22×22px, <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--radius-md</code> corners. Unchecked: hairline border. Checked: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--accent</code> fill.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Checkmark glyph.</b> Dark <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--ember-fg</code> ink, 13px, strokeWidth 2.5. Indeterminate uses a dash instead.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Label + sublabel.</b> Primary label at <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--text-md</code> weight 500; optional sublabel at <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--text-sm --fg-muted</code>.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Touch row.</b> Full-width, ≥44px tall. The tappable surface is the entire row — not just the box — for comfortable mobile use.</span>
          </div>
        </div>
      </div>

      {/* ── Accessibility ── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 'var(--space-3)' }}>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Role + state</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Each row carries <code style={{ fontFamily: 'var(--font-mono)' }}>role="checkbox"</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>aria-checked</code> (<code style={{ fontFamily: 'var(--font-mono)' }}>true</code> / <code style={{ fontFamily: 'var(--font-mono)' }}>false</code> / <code style={{ fontFamily: 'var(--font-mono)' }}>"mixed"</code>). The rows sit in <code style={{ fontFamily: 'var(--font-mono)' }}>role="group"</code> + <code style={{ fontFamily: 'var(--font-mono)' }}>aria-labelledby</code> on the &ldquo;Notification settings&rdquo; heading; the select-all box uses <code style={{ fontFamily: 'var(--font-mono)' }}>aria-controls</code> to point at that group, reporting <code style={{ fontFamily: 'var(--font-mono)' }}>"mixed"</code> while only some rows are checked. When the selection empties, the group flips to <code style={{ fontFamily: 'var(--font-mono)' }}>aria-invalid</code> and adds <code style={{ fontFamily: 'var(--font-mono)' }}>aria-describedby</code> pointing at the live <code style={{ fontFamily: 'var(--font-mono)' }}>role="alert"</code> banner.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Keyboard</div>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 'var(--space-4)', rowGap: 'var(--space-2)', color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <dt style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>Tab</dt>
            <dd style={{ margin: 0 }}>Move focus to the next row; <code style={{ fontFamily: 'var(--font-mono)' }}>Shift+Tab</code> the previous.</dd>
            <dt style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>Space</dt>
            <dd style={{ margin: 0 }}>Toggle the focused row checked / unchecked.</dd>
            <dt style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>Enter</dt>
            <dd style={{ margin: 0 }}>Same as <code style={{ fontFamily: 'var(--font-mono)' }}>Space</code> — toggle the focused row.</dd>
          </dl>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockStart: 'var(--space-3)' }}>
            Disabled rows are skipped — <code style={{ fontFamily: 'var(--font-mono)' }}>tabIndex="-1"</code> + <code style={{ fontFamily: 'var(--font-mono)' }}>aria-disabled="true"</code> — and never receive key events.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Contrast, focus + motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Dark <code style={{ fontFamily: 'var(--font-mono)' }}>--ember-fg</code> checkmark on the ember fill meets WCAG AA (contrast {'>'}4.5:1); the danger banner is <code style={{ fontFamily: 'var(--font-mono)' }}>--danger-text</code> on <code style={{ fontFamily: 'var(--font-mono)' }}>--danger-subtle</code>, never red-on-red. Focus rides the canonical <code style={{ fontFamily: 'var(--font-mono)' }}>.focus-ring</code> — a 2px ember outline at 2px offset, painted outside the row so the box border never swallows it. State changes are colour-only (no transform), and the loading skeleton honours <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> by resting as static grey.
          </div>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 'var(--space-2)' }}>Touch target ≥44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The interactive region is the entire row (full width, ≥44px tall), not just the 22px box. This satisfies iOS HIG and WCAG 2.5.5 for comfortable single-finger taps even on small-format devices.
          </div>
        </div>
      </div>

      {/* ── RTL ── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — box moves to the inline-end side; label reads right-to-left'} center>
        <div dir="rtl" role="group" aria-labelledby="checkbox-rtl-label" style={{ maxWidth: 340, margin: '0 auto', padding: '8px 0' }}>
          <span id="checkbox-rtl-label" style={{ display: 'block', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--fg)', paddingInline: 14, marginBlockEnd: 6 }}>إعدادات الإشعارات</span>
          <StaticCheckRow label="تنبيهات النشر" sublabel="دفع + بريد إلكتروني" state="checked" />
          <StaticCheckRow label="طلبات المراجعة" sublabel="مخصصة لي" state="unchecked" />
          <StaticCheckRow label="تقارير أسبوعية" sublabel="معطّل" state="unchecked" disabled />
        </div>
      </Frame>
      <Lede>
        The box anchors with logical <Mono>gap</Mono> inside a flex row, so it naturally
        moves to the <b style={{ color: 'var(--fg)' }}>inline-end</b> position in RTL.
        All padding uses <Mono>paddingInline</Mono>; the sublabel separator uses{' '}
        <Mono>marginInlineStart</Mono>. No <Mono>scaleX(-1)</Mono> needed —
        the checkmark glyph is symmetric.
      </Lede>

      {/* ── Do / Don't ── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — make the full row tappable</div>
          <div className="body" style={{ flexDirection: 'column', gap: 4, alignItems: 'stretch', padding: '12px 16px' }}>
            <StaticCheckRow label="Deployment alerts" sublabel="Push + email" state="checked" />
            <StaticCheckRow label="Weekly digest" sublabel="Every Monday 9 AM" state="unchecked" />
          </div>
          <div className="note">The hit area spans the full row width and is ≥44px tall. Users can tap anywhere on the row, not just the small box.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — isolate the box as the only target</div>
          <div className="body" style={{ flexDirection: 'column', gap: 12, alignItems: 'flex-start', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-strong)', background: 'var(--accent)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <Icons.check size={13} color="var(--ember-fg)" strokeWidth={2.5} />
              </span>
              <span style={{ fontSize: 'var(--text-md)', color: 'var(--fg)', cursor: 'default' }}>Deployment alerts</span>
            </div>
          </div>
          <div className="note">A 22px box alone is too small for reliable touch. The text label is non-interactive, forcing precise tapping and failing WCAG 2.5.5.</div>
        </div>
      </div>

      {/* ── Spec ── */}
      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="checkbox-row"
        lang="tsx"
        code={`<div
  className="focus-ring"           /* 2px ember outline at 2px offset on :focus-visible */
  role="checkbox"
  aria-checked={checked}           /* true | false | "mixed" */
  aria-disabled={disabled}
  tabIndex={disabled ? -1 : 0}
  onClick={toggle}
  onKeyDown={(e) => {
    if (e.key === ' ' || e.key === 'Enter') toggle();
  }}
  style={{ minHeight: 44, paddingInline: 'var(--space-4)' }}
>
  {/* Box: 22×22, --radius-md, --accent fill when active */}
  <span aria-hidden="true" className="m-check-box">
    {checked && <Icons.check color="var(--ember-fg)" strokeWidth={2.5} />}
    {mixed   && <Icons.minus color="var(--ember-fg)" strokeWidth={2.5} />}
  </span>
  <span className="m-check-label">{label}</span>
</div>

/* Group validity: when no row is checked the wrapping role="group"
   sets aria-invalid + aria-describedby → a live role="alert" banner. */
<div role="group" aria-labelledby={titleId}
  aria-invalid={count === 0 || undefined}
  aria-describedby={count === 0 ? warnId : undefined}>
  {/* rows… */}
  {count === 0 && <p id={warnId} role="alert">Select at least one channel.</p>}
</div>

/* Checked row bg: var(--ember-softer) (≈7% tint) for scanned state at a glance.
   Disabled: opacity 0.45, tabIndex -1, aria-disabled="true". */`}
      />
    </Section>
  );
}
