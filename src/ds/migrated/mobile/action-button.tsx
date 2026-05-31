'use client';
// Eidos Mobile — Action Button. The primary call-to-action on a mobile screen — full-width
// or prominent ember button anchored above the safe area. One ember CTA per screen; secondary
// and destructive variants stay visually distinct so hierarchy reads at a glance.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ── Local helpers ─────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'destructive';
type BtnState   = 'default' | 'loading' | 'disabled';

function ActionBtn({
  variant = 'primary',
  state = 'default',
  label,
  fullWidth = false,
}: {
  variant?: BtnVariant;
  state?: BtnState;
  label: string;
  fullWidth?: boolean;
}) {
  const base: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
    fontSize: 'var(--text-md)',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    border: 'none',
    cursor: state === 'disabled' ? 'not-allowed' : 'pointer',
    opacity: state === 'disabled' ? 0.4 : 1,
    width: fullWidth ? '100%' : 'auto',
    paddingInline: 24,
    transition: 'opacity 0.15s',
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary:     { background: 'var(--accent)', color: 'var(--ember-fg)' },
    secondary:   { background: 'var(--ember-soft)', color: 'var(--accent)' },
    destructive: { background: 'var(--danger-soft)', color: 'var(--danger)' },
  };

  return (
    <button className="focus-ring" style={{ ...base, ...variants[variant] }} disabled={state === 'disabled'} aria-disabled={state === 'disabled'} aria-busy={state === 'loading'}>
      {state === 'loading'
        ? <><SpinnerIcon /><span>{label}</span></>
        : label}
    </button>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="ds-spin">
      <path d="M12 3 a9 9 0 0 1 9 9" />
    </svg>
  );
}

// ── Device screen demo ────────────────────────────────────────────────────────

function ActionButtonScreen() {
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  function handleDeploy() {
    if (loading || done) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
    setTimeout(() => setDone(false), 4000);
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Nav bar */}
      <div style={{ height: 50, display: 'flex', alignItems: 'center', paddingInline: 16, borderBlockEnd: '1px solid var(--border)', gap: 10 }}>
        <Icons.rocket size={18} color="var(--fg-muted)" />
        <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Deploy to Production</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
        {[
          { label: 'Environment', value: 'production', icon: 'server' },
          { label: 'Branch',      value: 'main @ a3f92c1', icon: 'branch' },
          { label: 'Build',       value: '#1,204 — passed', icon: 'check' },
        ].map(({ label, value, icon }) => {
          const Ic = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[icon];
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'var(--surface)' }}>
              <Ic size={16} color="var(--fg-muted)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)', fontWeight: 500, marginBlockStart: 2 }}>{value}</div>
              </div>
            </div>
          );
        })}

        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--warning-soft)', color: 'var(--warning)', fontSize: 'var(--text-sm)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Icons.alert size={14} color="var(--warning)" />
          <span>This will replace the active production release. Confirm before proceeding.</span>
        </div>
      </div>

      {/* Sticky footer with action button */}
      <div style={{ padding: '12px 16px 20px', borderBlockStart: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          className="focus-ring"
          onClick={handleDeploy}
          disabled={loading}
          aria-busy={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            height: 50, borderRadius: 14, border: 'none', cursor: loading ? 'default' : 'pointer',
            background: done ? 'var(--success-soft)' : 'var(--accent)',
            color: done ? 'var(--success)' : 'var(--ember-fg)',
            fontSize: 'var(--text-md)', fontWeight: 600, width: '100%',
          }}
          aria-label={loading ? 'Deploying…' : done ? 'Deployed' : 'Deploy to production'}
        >
          {loading
            ? <><SpinnerIcon /><span style={{ color: 'var(--ember-fg)' }}>Deploying…</span></>
            : done
            ? <><Icons.check size={18} color="var(--success)" /><span>Deployed</span></>
            : <><Icons.deploy size={18} /><span>Deploy to Production</span></>}
        </button>
        <button className="focus-ring" style={{ height: 44, borderRadius: 12, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Variant showcase rows ─────────────────────────────────────────────────────

function VariantRow({ variant, label }: { variant: BtnVariant; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 180 }}>
      <ActionBtn variant={variant} label={label} fullWidth />
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{variant}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MobileActionButton() {
  return (
    <Section
      id="action-button"
      num="01"
      title="Action Button"
      desc="The primary call-to-action on a mobile screen — full-width ember button anchored above the safe area. One ember CTA per screen; secondary and destructive variants carry distinct fills."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Reserve the ember fill for the single highest-priority action on a screen. Every other action on that screen uses secondary, ghost, or a plain text link.</Lede>
      <Frame label="Deploy screen — ember primary CTA pinned above safe area; tap to see loading state" center>
        <DeviceFrame initial="iphone-se"><ActionButtonScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Primary (ember fill) · Secondary (ember-tinted) · Destructive (danger-tinted)">
        <div style={{ display: 'flex', gap: 16, padding: 24, flexWrap: 'wrap' }}>
          <VariantRow variant="primary"     label="Deploy" />
          <VariantRow variant="secondary"   label="Roll Back" />
          <VariantRow variant="destructive" label="Delete Service" />
        </div>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Frame label="Default · Loading (in-progress) · Disabled">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24, maxWidth: 320, marginInline: 'auto' }}>
          <div>
            <ActionBtn variant="primary" state="default" label="Approve Release" fullWidth />
            <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBlockStart: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>default</div>
          </div>
          <div>
            <ActionBtn variant="primary" state="loading" label="Approving…" fullWidth />
            <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBlockStart: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>loading</div>
          </div>
          <div>
            <ActionBtn variant="primary" state="disabled" label="Approve Release" fullWidth />
            <div style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', marginBlockStart: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>disabled</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 40px 72px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              {/* The button itself */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 14, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-md)', fontWeight: 600, userSelect: 'none' }}>
                <Icons.deploy size={18} color="var(--ember-fg)" />
                <span>Deploy to Production</span>
              </div>
              {/* Safe-area spacer visual */}
              <div style={{ marginBlockStart: 8, height: 20, borderRadius: 8, background: 'var(--surface)', opacity: 0.5 }} />

              {/* Pin 1 — ember fill */}
              <span className="lead v" style={{ top: -36, left: 40, height: 30 }} />
              <div className="pin" style={{ top: -62, left: 20 }}>1</div>
              {/* Pin 2 — label + icon */}
              <span className="lead v" style={{ top: -36, left: '50%', height: 30 }} />
              <div className="pin" style={{ top: -62, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              {/* Pin 3 — corner radius + height */}
              <span className="lead h" style={{ top: 12, right: -38, width: 32 }} />
              <div className="pin" style={{ top: 0, right: -68 }}>3</div>
              {/* Pin 4 — safe-area spacer */}
              <span className="lead v" style={{ bottom: -36, left: '50%', height: 30 }} />
              <div className="pin" style={{ bottom: -62, left: '50%', transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Ember fill.</b> Solid <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>var(--accent)</code> — the single ember moment on the screen. Never tinted or softened for the primary variant.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Label + leading icon.</b> Dark ink <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>var(--ember-fg)</code> on the fill for full AA. Weight 600 at <code style={{ fontFamily: 'var(--font-mono)' }}>--text-md</code> (15 px). Icon is optional but improves scanability.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Height + radius.</b> Fixed <code style={{ fontFamily: 'var(--font-mono)' }}>50 px</code> height exceeds the 44 px touch minimum; <code style={{ fontFamily: 'var(--font-mono)' }}>14 px</code> radius softens corners without rounding to pill.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Safe-area spacing.</b> At least <code style={{ fontFamily: 'var(--font-mono)' }}>env(safe-area-inset-bottom)</code> below the button so it is never clipped by a home indicator or navigation bar.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 8 }}>Keyboard map</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', alignItems: 'baseline', color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <Mono>Tab</Mono><span>Moves focus to the button; an ember <Mono>:focus-visible</Mono> ring (the live primary, secondary, and Cancel buttons above carry it) marks the focused control.</span>
            <Mono>Enter</Mono><span>Activates the focused button.</span>
            <Mono>Space</Mono><span>Activates the focused button — native <Mono>{'<button>'}</Mono> semantics, no key handler needed.</span>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Roles &amp; state</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>A native <Mono>{'<button>'}</Mono>; the visible label is the accessible name. During loading it sets <Mono>aria-busy="true"</Mono> and the accessible name switches to the in-progress phrase; disabled sets <Mono>disabled</Mono> + <Mono>aria-disabled</Mono>. Icon-only variants need an explicit <Mono>aria-label</Mono>; pair completion with a <Mono>role="status"</Mono> live region.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Contrast on the ember fill</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Label and icon use <Mono>var(--ember-fg)</Mono> — near-black <Mono>#0A0907</Mono> — on the bright <Mono>#FF6B35</Mono> fill. Contrast exceeds 4.5 : 1 (AA) in both themes. The focus ring uses <Mono>var(--ring)</Mono> (solid ember) with a 2 px offset, so it stays visible against the fill.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Reduced motion &amp; touch target</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Under <Mono>prefers-reduced-motion: reduce</Mono> the loading spinner stops rotating and falls back to a gentle opacity pulse (<Mono>.ds-spin</Mono> guard). The full-width button is 50 px tall — 6 px above the WCAG 2.5.5 minimum; never drop below 44 px.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — icon and label order mirrors; inline padding stays symmetric'} center code={`<button dir="rtl" className="m-action-btn primary focus-ring">
  <Icons.deploy />
  <span>نشر في الإنتاج</span>
</button>`} lang="tsx">
        <div dir="rtl" style={{ padding: 24, maxWidth: 320, marginInline: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 14, background: 'var(--accent)', color: 'var(--ember-fg)', fontSize: 'var(--text-md)', fontWeight: 600, userSelect: 'none' }}>
            <Icons.deploy size={18} color="var(--ember-fg)" />
            <span>نشر في الإنتاج</span>
          </div>
        </div>
      </Frame>
      <Lede>The icon flips to the leading (right) side in RTL via the natural flex row-reverse of <Mono>dir="rtl"</Mono>. Logical <Mono>paddingInline</Mono> keeps horizontal spacing equal. The ember fill, dark label colour, and height are unchanged — nothing about colour or touch target changes with writing direction.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — one ember CTA, secondary action in tint</div>
          <div className="body" style={{ flexDirection: 'column', gap: 10 }}>
            <ActionBtn variant="primary"   label="Approve Release" fullWidth />
            <ActionBtn variant="secondary" label="View Diff" fullWidth />
          </div>
          <div className="note">Reserve ember for the primary action. Use the tinted secondary style for supporting actions so hierarchy is unambiguous.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — multiple ember buttons compete</div>
          <div className="body" style={{ flexDirection: 'column', gap: 10 }}>
            <ActionBtn variant="primary" label="Approve Release" fullWidth />
            <ActionBtn variant="primary" label="Roll Back" fullWidth />
          </div>
          <div className="note">Two ember fills on the same screen cancel each other out — the hierarchy collapses and neither action feels primary.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="action-button"
        lang="tsx"
        code={`/* Primary — ember fill, dark ink label. .focus-ring paints the
   canonical ember :focus-visible outline (var(--ring), 2px offset). */
<button className="m-action-btn primary focus-ring" aria-label="Deploy to production">
  <Icons.deploy />
  Deploy to Production
</button>

/* Secondary — ember-soft tint */
<button className="m-action-btn secondary focus-ring">Roll Back</button>

/* Destructive — danger-soft tint */
<button className="m-action-btn destructive focus-ring">Delete Service</button>

/* Loading state — aria-busy + spinner; .ds-spin honours
   prefers-reduced-motion (rotate → opacity pulse). */
<button className="m-action-btn primary focus-ring" aria-busy="true" aria-label="Deploying…">
  <SpinnerIcon className="ds-spin" />
  Deploying…
</button>

/* Disabled */
<button className="m-action-btn primary focus-ring" disabled aria-disabled="true">
  Approve Release
</button>

/* Tokens:
   height 50px; border-radius 14px; font-weight 600; font-size var(--text-md)
   primary:     bg var(--accent);       color var(--ember-fg)
   secondary:   bg var(--ember-soft);   color var(--accent)
   destructive: bg var(--danger-soft);  color var(--danger)
   disabled:    opacity 0.4; cursor not-allowed
   focus:       .focus-ring → outline var(--ring-width) solid var(--ring)
   safe-area:   padding-block-end env(safe-area-inset-bottom) on the parent container */`}
      />
    </Section>
  );
}
