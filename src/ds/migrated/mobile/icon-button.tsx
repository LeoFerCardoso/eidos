'use client';
// Forge Mobile — Icon Button. A 44 × 44 px tappable icon-only control used in nav bars and
// toolbars. Three visual weights — plain (ghost), tinted (ember-soft bg), filled (ember) —
// give it a clear hierarchy role. Every instance MUST carry an aria-label; the icon is
// always decorative.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ── Local helpers ─────────────────────────────────────────────────────────────

type IcBtnVariant = 'plain' | 'tinted' | 'filled';

function IconBtn({
  icon,
  label,
  variant = 'plain',
  disabled = false,
  size = 44,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: IcBtnVariant;
  disabled?: boolean;
  size?: number;
}) {
  const bg: Record<IcBtnVariant, string> = {
    plain:  'transparent',
    tinted: 'var(--ember-soft)',
    filled: 'var(--accent)',
  };
  const fg: Record<IcBtnVariant, string> = {
    plain:  'var(--fg)',
    tinted: 'var(--accent)',
    filled: 'var(--ember-fg)',
  };

  return (
    <button
      className="focus-ring"
      aria-label={label}
      disabled={disabled}
      style={{
        display: 'grid', placeItems: 'center',
        width: size, height: size,
        borderRadius: variant === 'filled' ? 12 : 10,
        background: bg[variant],
        color: fg[variant],
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
      }}
    >
      {icon}
    </button>
  );
}

// ── Device screen demo ────────────────────────────────────────────────────────

function IconButtonScreen() {
  const [liked, setLiked] = React.useState(false);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Nav bar */}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', paddingInline: 8, borderBlockEnd: '1px solid var(--border)', gap: 4 }}>
        <IconBtn icon={<Icons.chevronLeft size={20} />} label="Back" variant="plain" />
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 'var(--text-md)' }}>Pipeline #1,204</span>
        <IconBtn icon={<Icons.share size={18} />}    label="Share"   variant="plain" />
        <IconBtn icon={<Icons.more size={20} />}     label="More actions" variant="plain" />
      </div>

      {/* Status card */}
      <div style={{ margin: 14, padding: 14, borderRadius: 12, background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icons.pipeline size={16} color="var(--fg-muted)" />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>main @ a3f92c1</span>
          <span style={{ marginInlineStart: 'auto', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--success)', background: 'var(--success-soft)', padding: '2px 7px', borderRadius: 6 }}>passed</span>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)', fontWeight: 600 }}>Build, test and deploy to staging</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>
          <Icons.clock size={12} color="var(--fg-subtle)" />
          <span>3 m 41 s</span>
          <span style={{ marginInlineStart: 8 }}>triggered by L. Cardoso</span>
        </div>
      </div>

      {/* Toolbar row */}
      <div style={{ paddingInline: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Actions</span>
        <IconBtn icon={<Icons.rollback size={18} />} label="Roll back" variant="plain" />
        <IconBtn icon={<Icons.deploy size={18} />}   label="Re-deploy" variant="tinted" />
        <button
          className="focus-ring"
          aria-label={liked ? 'Unlike this pipeline' : 'Like this pipeline'}
          aria-pressed={liked}
          onClick={() => setLiked(l => !l)}
          style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 12, background: liked ? 'var(--accent)' : 'transparent', color: liked ? 'var(--ember-fg)' : 'var(--fg)', border: 'none', cursor: 'pointer' }}
        >
          <Icons.star size={18} />
        </button>
      </div>

      {/* Steps list */}
      <div style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto' }}>
        {[
          { step: 'Install dependencies', dur: '41 s', ok: true },
          { step: 'Run unit tests',        dur: '1 m 12 s', ok: true },
          { step: 'Build production bundle', dur: '58 s', ok: true },
          { step: 'Deploy to staging',     dur: '32 s', ok: true },
        ].map(({ step, dur, ok }) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'var(--surface)' }}>
            <span style={{ width: 20, height: 20, borderRadius: 20, background: ok ? 'var(--success-soft)' : 'var(--danger-soft)', display: 'grid', placeItems: 'center' }}>
              {ok ? <Icons.check size={11} color="var(--success)" /> : <Icons.x size={11} color="var(--danger)" />}
            </span>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg)', fontWeight: 500 }}>{step}</span>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{dur}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MobileIconButton() {
  return (
    <Section
      id="icon-button"
      num="01"
      title="Icon Button"
      desc="A 44 × 44 px icon-only tappable control for nav bars and toolbars. Three variants — plain (ghost), tinted (ember-soft), filled (ember) — set a clear hierarchy. Every instance requires an aria-label."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Place icon buttons in nav bars for navigation and in toolbars for contextual actions. Reserve the filled variant for the one promoted action in a row — the others stay plain or tinted.</Lede>
      <Frame label="Nav bar (plain back + share) and toolbar (plain roll-back, tinted re-deploy, filled star — tap to toggle)" center>
        <DeviceFrame initial="iphone-se"><IconButtonScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Plain (ghost) · Tinted (ember-soft bg) · Filled (ember — at most once per bar)">
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'flex-start', padding: '28px 24px', flexWrap: 'wrap' }}>
          {(
            [
              { variant: 'plain',  icon: <Icons.share size={20} />,   label: 'Share',      desc: 'plain' },
              { variant: 'tinted', icon: <Icons.deploy size={20} />,  label: 'Re-deploy',  desc: 'tinted' },
              { variant: 'filled', icon: <Icons.rocket size={20} />,  label: 'Launch',     desc: 'filled' },
            ] as { variant: IcBtnVariant; icon: React.ReactNode; label: string; desc: string }[]
          ).map(({ variant, icon, label, desc }) => (
            <span key={desc} style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <IconBtn icon={icon} label={label} variant={variant} />
              <span className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{desc}</span>
            </span>
          ))}
        </div>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Frame label="Default · Disabled — disabled applies to all three variants">
        <div style={{ display: 'flex', gap: 28, justifyContent: 'center', alignItems: 'flex-start', padding: '24px 24px' }}>
          {(
            [
              { label: 'Share',   icon: <Icons.share size={20} />,  variant: 'plain'  as IcBtnVariant, disabled: false, desc: 'default (plain)'  },
              { label: 'Share',   icon: <Icons.share size={20} />,  variant: 'plain'  as IcBtnVariant, disabled: true,  desc: 'disabled (plain)' },
              { label: 'Deploy',  icon: <Icons.deploy size={20} />, variant: 'tinted' as IcBtnVariant, disabled: false, desc: 'default (tinted)' },
              { label: 'Deploy',  icon: <Icons.deploy size={20} />, variant: 'tinted' as IcBtnVariant, disabled: true,  desc: 'disabled (tinted)'},
            ]
          ).map(({ label, icon, variant, disabled, desc }) => (
            <span key={desc} style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <IconBtn icon={icon} label={label} variant={variant} disabled={disabled} />
              <span className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textAlign: 'center', maxWidth: 72 }}>{desc}</span>
            </span>
          ))}
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '80px 40px 72px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', display: 'inline-block' }} aria-hidden="true">
              {/* The button */}
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--ember-soft)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
                <Icons.deploy size={20} color="var(--accent)" />
              </div>
              {/* Pin 1 — hit area */}
              <span className="lead v" style={{ top: -36, left: '50%', height: 30 }} />
              <div className="pin" style={{ top: -62, left: '50%', transform: 'translateX(-50%)' }}>1</div>
              {/* Pin 2 — tinted bg */}
              <span className="lead h" style={{ top: 10, right: -38, width: 32 }} />
              <div className="pin" style={{ top: -2, right: -70 }}>2</div>
              {/* Pin 3 — icon */}
              <span className="lead h" style={{ top: 24, left: -38, width: 32 }} />
              <div className="pin" style={{ top: 12, left: -70 }}>3</div>
              {/* Pin 4 — corner radius */}
              <span className="lead v" style={{ bottom: -36, left: 8, height: 30 }} />
              <div className="pin" style={{ bottom: -62, left: -6 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Touch target.</b> Fixed <code style={{ fontFamily: 'var(--font-mono)' }}>44 × 44 px</code> — exactly the WCAG 2.5.5 and Apple HIG minimum. Never reduce width or height below this, even if the visible icon is smaller.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Tinted background.</b> <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>var(--ember-soft)</code> (~14% opacity ember) distinguishes the tinted variant from a plain ghost without an ember fill. On the filled variant this becomes solid <code style={{ fontFamily: 'var(--font-mono)' }}>var(--accent)</code>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Icon.</b> 18 – 20 px, centred. Always uses <code style={{ fontFamily: 'var(--font-mono)' }}>aria-hidden="true"</code> — meaning lives in the parent's <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> instead.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Corner radius.</b> <code style={{ fontFamily: 'var(--font-mono)' }}>10 – 12 px</code> depending on variant. Filled uses 12 px to feel like a contained action; plain uses 10 px so hover/focus states read lightly.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 10 }}>Keyboard</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 14, rowGap: 7, margin: 0 }}>
            <dt className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>Tab</dt>
            <dd style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Moves focus to the button; a disabled button is skipped.</dd>
            <dt className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>Enter</dt>
            <dd style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Fires the action (native <code style={{ fontFamily: 'var(--font-mono)' }}>{'<button>'}</code> behaviour).</dd>
            <dt className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>Space</dt>
            <dd style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Same as Enter; for a toggle button it flips <code style={{ fontFamily: 'var(--font-mono)' }}>aria-pressed</code>.</dd>
          </dl>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockStart: 10 }}>Focus is shown by the global ring (<code style={{ fontFamily: 'var(--font-mono)' }}>:focus-visible</code> on <code style={{ fontFamily: 'var(--font-mono)' }}>.focus-ring</code>) — never suppress it.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Required aria-label</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Because the button contains only an icon, <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> is non-optional. Describe the action, not the icon — "Roll back deployment" beats "Rollback icon". The icon itself carries <code style={{ fontFamily: 'var(--font-mono)' }}>aria-hidden</code>.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Contrast on fills</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Filled: ember icon on ember fill is <b>not acceptable</b> — use <code style={{ fontFamily: 'var(--font-mono)' }}>var(--ember-fg)</code> dark ink. Tinted: ember icon on the ~14% soft tint meets AA. Plain: foreground icon on <code style={{ fontFamily: 'var(--font-mono)' }}>var(--bg)</code> meets AA at all tiers.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Touch target ≥ 44 px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The component is designed at exactly 44 × 44 px. When placing buttons in a compact nav bar, use <code style={{ fontFamily: 'var(--font-mono)' }}>gap: 4px</code> rather than overlap to keep each target independent.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Toggle state</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>A button that toggles (e.g. the Like star above) carries <code style={{ fontFamily: 'var(--font-mono)' }}>aria-pressed</code> and swaps its <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> ("Like" ↔ "Unlike") so the on/off state is announced — colour change alone is never the only signal.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Press / hover transitions are short and opacity-only. Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion: reduce</code> the global ds.css rule drops them to an instant state change; the focus ring stays.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — directional icons (back, forward) mirror; non-directional icons stay as-is'} center code={`<nav dir="rtl">
  {/* chevronRight becomes the visual "back" in RTL */}
  <IconBtn icon={<Icons.chevronRight />} label="رجوع" variant="plain" />
  <span>خط أنابيب #1,204</span>
  {/* share is non-directional — no flip needed */}
  <IconBtn icon={<Icons.share />} label="مشاركة" variant="plain" />
</nav>`} lang="tsx">
        <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px', background: 'var(--surface)', borderRadius: 12, maxWidth: 340, marginInline: 'auto' }}>
          <IconBtn icon={<Icons.chevronRight size={20} />} label="رجوع" variant="plain" />
          <span style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 'var(--text-sm)' }}>خط أنابيب #١٢٠٤</span>
          <IconBtn icon={<Icons.share size={18} />}   label="مشاركة"  variant="plain" />
          <IconBtn icon={<Icons.more size={20} />}    label="المزيد"   variant="plain" />
        </div>
      </Frame>
      <Lede>Directional icons — <Mono>chevronLeft</Mono> / <Mono>chevronRight</Mono>, arrows — must mirror under <span dir="ltr" style={{fontFamily:'var(--font-mono)', fontSize:'inherit'}}>dir="rtl"</span> using <Mono>transform: scaleX(-1)</Mono>, or swap to the opposite chevron. Non-directional icons (share, more, star) need no transformation; their visual meaning is orientation-neutral.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — label every icon button</div>
          <div className="body" style={{ gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <IconBtn icon={<Icons.rollback size={18} />} label="Roll back deployment" variant="plain" />
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>aria-label="Roll back deployment"</code>
            </div>
          </div>
          <div className="note">A descriptive aria-label turns a mystery glyph into a clear action for screen reader and voice-control users.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — pack too many filled buttons in one bar</div>
          <div className="body" style={{ gap: 8 }}>
            <IconBtn icon={<Icons.deploy size={18} />}    label="Deploy"   variant="filled" />
            <IconBtn icon={<Icons.rollback size={18} />}  label="Rollback" variant="filled" />
            <IconBtn icon={<Icons.trash size={18} />}     label="Delete"   variant="filled" />
          </div>
          <div className="note">Multiple filled (ember) buttons in a single toolbar create visual noise — use at most one filled per row, the rest stay plain or tinted.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="icon-button"
        lang="tsx"
        code={`/* Plain (ghost) — .focus-ring shows the global :focus-visible outline */
<button aria-label="Share" className="m-icon-btn plain focus-ring">
  <Icons.share aria-hidden="true" />
</button>

/* Tinted (ember-soft) */
<button aria-label="Re-deploy" className="m-icon-btn tinted focus-ring">
  <Icons.deploy aria-hidden="true" />
</button>

/* Filled (ember) — at most one per toolbar */
<button aria-label="Launch" className="m-icon-btn filled focus-ring">
  <Icons.rocket aria-hidden="true" />
</button>

/* Toggle — aria-pressed + label swap announce on/off state */
<button aria-label={liked ? 'Unlike' : 'Like'} aria-pressed={liked}
        className="m-icon-btn focus-ring">
  <Icons.star aria-hidden="true" />
</button>

/* Disabled */
<button aria-label="Deploy" className="m-icon-btn tinted" disabled aria-disabled="true">
  <Icons.deploy aria-hidden="true" />
</button>

/* Tokens:
   size:         44 × 44 px (hard minimum — touch target)
   border-radius: plain/tinted 10px · filled 12px
   plain:   bg transparent;         color var(--fg)
   tinted:  bg var(--ember-soft);   color var(--accent)
   filled:  bg var(--accent);       color var(--ember-fg)  ← NEVER ember icon on ember bg
   disabled: opacity 0.4 */`}
      />
    </Section>
  );
}
