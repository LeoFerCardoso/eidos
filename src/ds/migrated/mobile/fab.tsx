'use client';
// Forge Mobile — Floating action button. One ember circle pinned above the content for the
// single most-likely action on a screen (new service, new deploy). The icon is dark ink on
// the ember fill. At most one per screen; it clears the Tab bar and the safe-area inset.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, PropsTable } from '@/ds/core';

function Fab({ extended, icon, label, disabled }: { extended?: boolean; icon: React.ReactNode; label?: string; disabled?: boolean }) {
  return (
    <button
      aria-label={extended ? undefined : label}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: extended ? 8 : 0,
        height: 56, width: extended ? 'auto' : 56, padding: extended ? '0 20px' : 0,
        borderRadius: extended ? 28 : 999, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? 'var(--surface-active)' : 'var(--accent)',
        color: disabled ? 'var(--fg-subtle)' : 'var(--ember-fg)',
        boxShadow: disabled ? 'none' : 'var(--shadow-3)',
        fontSize: 'var(--text-sm)', fontWeight: 650, justifyContent: 'center',
      }}
    >
      <span style={{ display: 'flex' }}>{icon}</span>
      {extended && label}
    </button>
  );
}

function FabScreen({ extended }: { extended?: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ paddingBlockStart: 50, padding: '50px 16px 0' }}>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBlockEnd: 12 }}>Services</div>
        {['payments-api', 'identity-svc', 'search-index', 'billing-worker'].map((n) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBlockEnd: '1px solid var(--border)' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 10, background: 'var(--surface-active)' }}><Icons.server size={16} /></span>
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 550 }}>{n}</span>
            <Icons.chevronRight size={16} color="var(--fg-faint)" />
          </div>
        ))}
      </div>
      {/* Tab bar to show the FAB clearing it */}
      <div style={{ position: 'absolute', insetBlockEnd: 0, insetInline: 0, height: 56, display: 'flex', borderBlockStart: '1px solid var(--border)', background: 'var(--bg)' }}>
        {[['home', 'Home'], ['server', 'Services'], ['rocket', 'Deploys'], ['user', 'You']].map(([ic, l], i) => {
          const Ic = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[ic];
          return <span key={l} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: i === 1 ? 'var(--fg)' : 'var(--fg-faint)' }}><Ic size={18} /><span style={{ fontSize: 'var(--text-xs)' }}>{l}</span></span>;
        })}
      </div>
      <span style={{ position: 'absolute', insetBlockEnd: 70, insetInlineEnd: 16 }}>
        <Fab extended={extended} icon={<Icons.plus size={24} />} label="New service" />
      </span>
    </div>
  );
}

export default function MobileFab() {
  return (
    <Section
      id="fab"
      num="01"
      title="Floating action button"
      desc="A single ember circle floating above content for the one action a screen exists to encourage — create a service, start a deploy. At most one per screen."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Reserve the FAB for a genuinely primary, frequent action. The icon sits in dark ink on the ember fill. Never hide a destructive action behind it.</Lede>
      <Frame label="One ember FAB, trailing-bottom, clearing the Tab bar and safe area" center>
        <DeviceFrame initial="iphone-se"><FabScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Icon-only for a known action · extended with a label when the verb needs naming">
        <div style={{ display: 'flex', gap: 28, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <Fab icon={<Icons.plus size={24} />} label="New" />
          <Fab extended icon={<Icons.plus size={20} />} label="New service" />
          <Fab extended icon={<Icons.rocket size={18} />} label="Deploy" />
        </div>
      </Frame>

      <SubHead meta="enabled · disabled">States</SubHead>
      <Lede>Two states only — there is no hover on touch and no loading variant; gate the FAB on a precondition by disabling it, never by hiding it mid-scroll.</Lede>
      <Frame label="Enabled (ember, lifted) · disabled (de-emphasised, flat) when the action isn't yet available">
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end', justifyContent: 'center', padding: 28 }}>
          <div style={{ display: 'grid', placeItems: 'center', gap: 10 }}>
            <Fab extended icon={<Icons.plus size={20} />} label="New service" />
            <Mono>enabled</Mono>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', gap: 10 }}>
            <Fab extended disabled icon={<Icons.plus size={20} />} label="New service" />
            <Mono>disabled</Mono>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>The FAB is a real <Mono>&lt;button&gt;</Mono> — it inherits the keyboard contract, the canonical ember focus ring (<Mono>--ring</Mono>), and the disabled semantics for free; the work is the label, the touch target, and the contrast on ember.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Keyboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', alignItems: 'baseline', color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>
            <Mono>Tab</Mono><span>Moves focus to the FAB; the canonical ember ring shows at ≥3:1.</span>
            <Mono>Enter</Mono><span>Triggers the action.</span>
            <Mono>Space</Mono><span>Triggers the action (native <Mono>&lt;button&gt;</Mono> behaviour).</span>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Roles &amp; ARIA</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>An icon-only FAB carries an <Mono>aria-label</Mono> naming the verb ("New service"); the extended variant shows that label inline, so it drops the redundant <Mono>aria-label</Mono>. A disabled FAB sets <Mono>disabled</Mono>, removing it from the tab order — never style-only.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch, reach &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>At 56px it clears the 44px minimum and sits in the thumb arc, offset so it never overlaps a Tab bar target. The glyph is dark <Mono>--ember-fg</Mono> ink on the ember fill — full AA — never ember-on-ember.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion &amp; content</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The FAB is static — no entrance animation, nothing to honour under <Mono>prefers-reduced-motion</Mono>. The list pads its trailing edge so the FAB never covers the last row, and it is never the only path to the action.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the FAB flips to the bottom-left; an extended FAB leads with its icon on the right'} center code={`<div dir="rtl">
  {/* insetInlineEnd pins the FAB bottom-left in RTL */}
  <button className="m-fab m-fab--extended">
    <Icons.plus /> خدمة جديدة
  </button>
</div>`} lang="tsx">
        <DeviceFrame initial="iphone-se"><div dir="rtl" style={{ height: '100%' }}><FabScreen extended /></div></DeviceFrame>
      </Frame>
      <Lede>The FAB is pinned with <Mono>insetInlineEnd</Mono>, so it moves from the bottom-trailing to the <b style={{ color: 'var(--fg)' }}>bottom-left</b> corner — still in the thumb arc. An extended FAB uses <Mono>inline-flex</Mono>, so the icon leads on the right and the label follows the reading direction; the plus glyph is symmetric and needs no <Mono>scaleX(-1)</Mono>.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 260, height: 130 }} aria-hidden="true">
              <div style={{ position: 'absolute', insetBlockEnd: 0, insetInline: 0, height: 40, borderBlockStart: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', color: 'var(--fg-faint)' }}>
                <Icons.home size={16} /><Icons.server size={16} /><Icons.rocket size={16} /><Icons.user size={16} />
              </div>
              <span style={{ position: 'absolute', insetBlockEnd: 52, insetInlineEnd: 8, width: 56, height: 56, borderRadius: 999, background: 'var(--accent)', color: 'var(--ember-fg)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-3)' }}><Icons.plus size={26} /></span>
              <span className="lead h" style={{ bottom: 78, left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 60, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 18, left: -28, width: 24 }} />
              <div className="pin" style={{ bottom: 70, left: -52 }}>1</div>
              <div className="pin" style={{ bottom: 52, right: -52 }}>2</div>
              <div className="pin" style={{ bottom: 10, left: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Fill + icon.</b> A 56px <Mono>--accent</Mono> circle; the glyph is dark <Mono>--ember-fg</Mono> ink, never ember-on-ember.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Elevation.</b> <Mono>--shadow-3</Mono> lifts it above the scrolling content, so it reads as floating, not inline.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Position.</b> Trailing-bottom, offset to clear the Tab bar and <Mono>env(safe-area-inset-bottom)</Mono> — within thumb reach but not over a nav item.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — one primary, constructive action</div>
          <div className="body" style={{ justifyContent: 'center' }}><Fab extended icon={<Icons.plus size={20} />} label="New service" /></div>
          <div className="note">The single thing this screen is for, named and reachable by the thumb.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — a cluster of FABs, or a destructive one</div>
          <div className="body" style={{ gap: 12, justifyContent: 'center' }}>
            <Fab icon={<Icons.plus size={22} />} label="Add" />
            <Fab icon={<Icons.edit size={20} />} label="Edit" />
            <span style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--danger)', color: 'var(--danger-fg)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-3)' }}><Icons.trash size={22} /></span>
          </div>
          <div className="note">Multiple FABs split focus and burn the accent; a delete floating over content invites a mis-tap. Keep it to one safe action.</div>
        </div>
      </div>

      <p className="ds-caption" style={{ marginTop: 12 }}>
        Pair it with a fixed <a href="/mobile/tab-bar.html" style={{ color: 'var(--ember)' }}>Tab bar</a>; it's the handset answer to a primary toolbar button.
      </p>

      <SubHead meta="FabProps">API reference</SubHead>
      <CodeBlock
        label="markup"
        lang="tsx"
        code={`<button aria-label="New service" className="m-fab">
  <Icons.plus size={24} />
</button>
{/* extended — label is visible, so no aria-label */}
<button className="m-fab m-fab--extended"><Icons.plus /> New service</button>

/* 56px circle, var(--accent) fill, var(--ember-fg) icon, var(--shadow-3).
   pinned bottom-trailing, clearing the tab bar + safe-area inset.
   one per screen; never destructive. */`}
      />
      <PropsTable
        label="<Fab />"
        rows={[
          { prop: 'icon', type: 'ReactNode', required: true, description: 'The single glyph. 24px icon-only, ~20px when extended. Symmetric icons need no RTL mirror.' },
          { prop: 'label', type: 'string', description: 'Action name. Rendered inline when extended; supplied as aria-label when icon-only — always set it.' },
          { prop: 'extended', type: 'boolean', default: 'false', description: 'Pill with a visible label. Use when the verb needs naming; the label replaces the aria-label.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'De-emphasised, flat, not-allowed; leaves the tab order. Gate a precondition by disabling, never by hiding.' },
        ]}
      />
    </Section>
  );
}
