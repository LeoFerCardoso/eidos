'use client';
// Eidos Mobile — Slider. A draggable thumb on a track for choosing an approximate value
// across a continuous range: traffic split, budget, threshold. The filled portion is the
// one ember accent; a live value label removes the guesswork.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

function Slider({ value, onChange, min = 0, max = 100, label, unit = '%' }: { value: number; onChange?: (v: number) => void; min?: number; max?: number; label?: string; unit?: string }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <span style={{ display: 'block' }}>
      {label && (
        <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBlockEnd: 8 }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ember)', fontVariantNumeric: 'tabular-nums' }}>{value}{unit}</span>
        </span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{
          width: '100%', height: 28, margin: 0, cursor: 'pointer', WebkitAppearance: 'none', appearance: 'none', background: 'transparent',
          ['--pct' as string]: `${pct}%`,
        }}
        className="m-slider-input"
      />
    </span>
  );
}

function SliderScreen() {
  const [canary, setCanary] = React.useState(20);
  const [cpu, setCpu] = React.useState(70);
  const [budget, setBudget] = React.useState(4);
  return (
    <div style={{ padding: '58px 18px 0', height: '100%', display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Rollout</div>
      <Slider label="Canary traffic" value={canary} onChange={setCanary} />
      <Slider label="CPU threshold" value={cpu} onChange={setCpu} />
      <Slider label="Error budget" value={budget} onChange={setBudget} min={0} max={10} unit="%" />
    </div>
  );
}

export default function MobileSlider() {
  return (
    <Section
      id="slider"
      num="01"
      title="Slider"
      desc="A thumb dragged along a track for approximate values across a continuous range — canary traffic, CPU threshold, error budget. When the exact digit matters, use a Stepper instead."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>The filled track is the screen's one ember accent; a live label shows the value as it moves. Reach for Slider when getting close fast matters more than the exact digit.</Lede>
      <Frame label="Drag the thumb · the filled track and the value update live" center>
        <DeviceFrame initial="iphone-se"><SliderScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="states">Values</SubHead>
      <Frame label="Low · mid · high — the filled portion reads the value at a glance">
        <div style={{ display: 'grid', gap: 22, maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
          <Slider label="10%" value={10} />
          <Slider label="50%" value={50} />
          <Slider label="90%" value={90} />
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <span style={{ display: 'flex', justifyContent: 'space-between', marginBlockEnd: 12 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Canary traffic</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ember)', fontVariantNumeric: 'tabular-nums' }}>40%</span>
              </span>
              <span style={{ position: 'relative', display: 'block', height: 6, borderRadius: 999, background: 'var(--surface-active)' }}>
                <span style={{ position: 'absolute', insetInlineStart: 0, insetBlockStart: 0, height: 6, width: '40%', borderRadius: 999, background: 'var(--ember)' }} />
                <span style={{ position: 'absolute', insetInlineStart: '40%', insetBlockStart: '50%', transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: 999, background: 'var(--bg-elevated)', border: '2px solid var(--ember)', boxShadow: 'var(--shadow-1)' }} />
              </span>
              <span className="lead h" style={{ top: 4, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -24, left: '15%', height: 20 }} />
              <span className="lead v" style={{ bottom: -24, left: '40%', height: 20, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -24, left: '70%', height: 20 }} />
              <div className="pin" style={{ top: -8, right: -52 }}>1</div>
              <div className="pin" style={{ bottom: -46, left: '15%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -46, left: '40%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ bottom: -46, left: '70%', transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Live value.</b> A mono, tabular readout in <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--ember</code> — the exact number you'd otherwise have to guess from the thumb.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Filled track.</b> The portion behind the thumb fills with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--ember</code> — the page's single ember moment.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Thumb.</b> A 22px elevated disc with an ember ring; large enough to grab without covering the value.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Rest track.</b> The remaining range on <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>--surface-active</code>, quiet behind the fill.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch &amp; thumb size</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The thumb's hit area spans a 28px row even though it looks 22px, so it's grabbable; tapping anywhere on the track jumps to that value.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Slider semantics</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>A native <code style={{ fontFamily: 'var(--font-mono)' }}>input[type=range]</code> brings <code style={{ fontFamily: 'var(--font-mono)' }}>role="slider"</code> and arrow-key stepping for free; the live label is its visible value.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Value, not colour alone</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The number is always shown, so the setting is legible without seeing the ember fill — and the thumb position reinforces it.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Snap for precision</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Set a <code style={{ fontFamily: 'var(--font-mono)' }}>step</code> when only whole or 5% values are valid, so a shaky drag can't land on 47%.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the track fills from the right and the value moves to the leading side'} center code={`<div dir="rtl"><Slider label="حركة Canary" value={30} /></div>`} lang="tsx">
        <div dir="rtl">
          <div style={{ display: 'grid', gap: 22, maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
            <Slider label="Canary traffic" value={30} />
            <Slider label="CPU threshold" value={70} />
          </div>
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the filled portion grows from the leading edge, so it fills right-to-left, and the live value label moves to the leading (left) side of its row; the thumb keeps tracking the same fraction along the track.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — approximate value, show the number</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}><Slider label="Canary traffic" value={30} /></div>
          <div className="note">Drag to roughly a third; the live label confirms 30% so there's no guessing.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — a few discrete options</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}><Slider label="Strategy (1=Rolling 2=Blue/green 3=Canary)" value={2} min={1} max={3} unit="" /></div>
          <div className="note">Three named choices aren't a continuum. Use a Segmented control or radios so each option is labelled.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="slider"
        lang="css"
        code={`/* native range, styled — fill via a gradient at --pct */
.m-slider-input {
  --pct: 0%; --fill-x: 0; /* fill anchor: 0=leading, 100%=trailing */
  appearance: none; height: 28px; background: transparent;
}
.m-slider-input::-webkit-slider-runnable-track {
  height: 6px; border-radius: 999px;
  background: linear-gradient(var(--ember), var(--ember)) var(--fill-x) / var(--pct) 100% no-repeat,
              var(--surface-active);
}
/* RTL: anchor the webkit fill to the trailing (right) edge so it mirrors the flipped thumb */
[dir="rtl"] .m-slider-input { --fill-x: 100%; }
/* Firefox mirrors natively via ::-moz-range-progress */
.m-slider-input::-webkit-slider-thumb {
  appearance: none; width: 22px; height: 22px; margin-top: -8px;
  border-radius: 999px; background: var(--bg-elevated);
  border: 2px solid var(--ember); box-shadow: var(--shadow-1);
}
/* always render the numeric value beside the label */`}
      />
    </Section>
  );
}
