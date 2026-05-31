'use client';
// Forge Mobile — Progress. Two shapes for "work is happening": a linear bar for a known share
// of a task (upload, rollout) and a circular spinner for an unknown wait. Determinate shows the
// real percentage; indeterminate just animates. The fill is the page's one ember accent.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

function LinearProgress({ value, label }: { value?: number; label?: string }) {
  const indeterminate = value == null;
  return (
    <span style={{ display: 'block' }}>
      {label && (
        <span style={{ display: 'flex', justifyContent: 'space-between', marginBlockEnd: 6, fontSize: 'var(--text-sm)' }}>
          <span style={{ color: 'var(--fg)', fontWeight: 550 }}>{label}</span>
          {!indeterminate && <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 650, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{value}%</span>}
        </span>
      )}
      <span role="progressbar" aria-valuenow={indeterminate ? undefined : value} aria-valuemin={0} aria-valuemax={100} aria-label={label} style={{ position: 'relative', display: 'block', height: 6, borderRadius: 999, background: 'var(--surface-active)', overflow: 'hidden' }}>
        {indeterminate ? (
          <span className="m-progress-indeterminate" style={{ position: 'absolute', insetBlock: 0, width: '40%', borderRadius: 999, background: 'var(--accent)' }} />
        ) : (
          <span style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: `${value}%`, borderRadius: 999, background: 'var(--accent)', transition: 'width var(--dur) var(--ease)' }} />
        )}
      </span>
    </span>
  );
}

function Ring({ value, size = 44 }: { value?: number; size?: number }) {
  const sw = 4;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const indeterminate = value == null;
  return (
    <span role="progressbar" aria-valuenow={indeterminate ? undefined : value} aria-valuemin={0} aria-valuemax={100} style={{ display: 'inline-grid', placeItems: 'center', position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} className={indeterminate ? 'ds-spin' : ''} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-active)" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth={sw} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={indeterminate ? c * 0.7 : c * (1 - (value || 0) / 100)} style={{ transition: 'stroke-dashoffset var(--dur) var(--ease)' }} />
      </svg>
      {!indeterminate && <span style={{ position: 'absolute', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</span>}
    </span>
  );
}

function ProgressScreen() {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setPct((p) => (p >= 100 ? 0 : p + 4)), 220);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: '58px 18px 0', height: '100%', display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>Rollout</div>
      <LinearProgress label="Canary → prod" value={pct} />
      <LinearProgress label="Draining old pods" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Ring value={pct} />
        <Ring />
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>determinate ring · spinner</span>
      </div>
    </div>
  );
}

export default function MobileProgress() {
  return (
    <Section
      id="progress"
      num="01"
      title="Progress"
      desc="Two indicators for work in flight — a linear bar for a known share of a finite task, a circular spinner for an unknown wait. Always prefer determinate when you can estimate progress."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>A moving bar that never fills is worse than a number. Reach for determinate whenever you can estimate progress — even a rough percentage is more reassuring than an infinite spinner.</Lede>
      <Frame label="Determinate bar fills to the real % · indeterminate just animates" center>
        <DeviceFrame initial="iphone-se"><ProgressScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Linear & circular, determinate vs indeterminate">
        <div style={{ display: 'grid', gap: 22, maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
          <LinearProgress label="Determinate" value={64} />
          <LinearProgress label="Indeterminate" />
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
            <Ring value={64} /><Ring value={25} /><Ring />
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Progressbar role</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Both shapes are <code style={{ fontFamily: 'var(--font-mono)' }}>role="progressbar"</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>aria-valuemin/max</code>; determinate sets <code style={{ fontFamily: 'var(--font-mono)' }}>aria-valuenow</code>, indeterminate omits it so AT announces "busy".</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Not a focus stop</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Progress is a non-interactive status — no keyboard map, no Tab stop. The changing <code style={{ fontFamily: 'var(--font-mono)' }}>aria-valuenow</code> is announced from its existing place in the reading order.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Number, not colour</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Determinate progress always shows the percentage in text, so the state is legible without perceiving the ember fill.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The indeterminate sweep and spinner slow and simplify under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> rather than strobing.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Done is announced</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Completion hands off to a result (a Toast or updated state) via a live region — the bar vanishing is not enough on its own.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the linear bar fills from the start, i.e. right-to-left'} center code={`<div dir="rtl">{/* linear + ring */}</div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><ProgressScreen /></DeviceFrame></div>
      </Frame>
      <Lede>The fill is pinned with <Mono>insetInlineStart:0</Mono>, so the linear bar grows from the start — right-to-left in RTL — and the label/% row (laid out with <Mono>justify-content:space-between</Mono>) puts the label on the leading right side and the % on the left. The circular ring is direction-agnostic: its sweep is geometric, so it reads the same either way.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <span style={{ display: 'flex', justifyContent: 'space-between', marginBlockEnd: 10 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Canary → prod</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>64%</span>
              </span>
              <span style={{ position: 'relative', display: 'block', height: 8, borderRadius: 999, background: 'var(--surface-active)' }}>
                <span style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '64%', borderRadius: 999, background: 'var(--accent)' }} />
              </span>
              <span className="lead h" style={{ top: 2, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -24, left: '32%', height: 18 }} />
              <span className="lead v" style={{ bottom: -24, left: '82%', height: 18 }} />
              <div className="pin" style={{ top: -6, right: -52 }}>1</div>
              <div className="pin" style={{ bottom: -46, left: '32%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -46, left: '82%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Value.</b> The real percentage in mono beside the label — a determinate bar always states its number.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Fill.</b> Grows left-to-right (inline-start to -end) in <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--accent</code> — the page's single ember moment.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Track.</b> The remaining length on <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--surface-active</code>, quiet behind the fill.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — determinate when you know the share</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}><LinearProgress label="Uploading 41 / 64 MB" value={64} /></div>
          <div className="note">A real percentage sets expectations; the user knows roughly how long is left.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — fake an indeterminate bar for a known task</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}><LinearProgress label="Uploading… (no %)" /></div>
          <div className="note">A bar that never fills feels stuck. If you can estimate the share, show it.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="progress"
        lang="tsx"
        code={`{/* linear */}
<div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
  className="m-progress"><span style={{ width: \`\${pct}%\` }} /></div>

{/* circular spinner — reuse the .ds-spin keyframe */}
<svg className="ds-spin" /* stroke var(--accent), dasharray arc */ />

/* fill var(--accent) on var(--surface-active); always print the % for determinate.
   indeterminate omits aria-valuenow; both ease down under reduced motion. */`}
      />
    </Section>
  );
}
