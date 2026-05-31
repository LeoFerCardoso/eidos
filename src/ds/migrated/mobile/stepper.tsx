'use client';
// Eidos Mobile — Stepper. A −/value/+ control for adjusting a small integer by one tap at
// a time: replicas, retries, concurrency. Use it when the range is tight and the exact
// number matters; for a wide or approximate range, use a Slider.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

function Stepper({ value, onChange, min = 0, max = 99, unit }: { value: number; onChange?: (v: number) => void; min?: number; max?: number; unit?: string }) {
  const atMin = value <= min;
  const atMax = value >= max;
  const step = (dir: -1 | 1) => onChange?.(Math.min(max, Math.max(min, value + dir)));
  const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const rtl = e.currentTarget.matches(':dir(rtl)') || e.currentTarget.closest('[dir="rtl"]') != null;
    // Up/Down are unambiguous; Left/Right follow reading direction so RTL doesn't invert intent.
    if (e.key === 'ArrowUp' || (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight'))) { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowDown' || (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft'))) { e.preventDefault(); step(-1); }
    else if (e.key === 'Home') { e.preventDefault(); onChange?.(min); }
    else if (e.key === 'End') { e.preventDefault(); onChange?.(max); }
  };
  const Btn = ({ dir, disabled }: { dir: -1 | 1; disabled: boolean }) => (
    <button
      type="button"
      className="focus-ring"
      aria-label={dir === 1 ? 'Increase' : 'Decrease'}
      disabled={disabled}
      onClick={() => step(dir)}
      style={{
        width: 44, height: 44, flex: 'none', display: 'grid', placeItems: 'center', border: 'none', borderRadius: 999,
        background: 'none', color: disabled ? 'var(--fg-faint)' : 'var(--fg)', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {dir === 1 ? <Icons.plus size={18} /> : <Icons.minus size={18} />}
    </button>
  );
  return (
    <span role="spinbutton" tabIndex={0} className="focus-ring" aria-valuenow={value} aria-valuemin={min} aria-valuemax={max} aria-label={unit ? `Value, ${unit}` : 'Value'} onKeyDown={onKeyDown} style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: '1px solid var(--border-strong)', background: 'var(--surface)' }}>
      <Btn dir={-1} disabled={atMin} />
      <span style={{ minWidth: 44, textAlign: 'center', fontVariantNumeric: 'tabular-nums', fontWeight: 650, fontSize: 'var(--text-md)', fontFamily: 'var(--font-mono)' }}>{value}{unit}</span>
      <Btn dir={1} disabled={atMax} />
    </span>
  );
}

function StepperRow({ label, sub, ...rest }: { label: string; sub?: string; value: number; onChange?: (v: number) => void; min?: number; max?: number; unit?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBlockEnd: '1px solid var(--border)' }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 550 }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>{sub}</span>}
      </span>
      <Stepper {...rest} />
    </div>
  );
}

function StepperScreen() {
  const [replicas, setReplicas] = React.useState(3);
  const [retries, setRetries] = React.useState(2);
  const [canary, setCanary] = React.useState(1);
  return (
    <div style={{ padding: '58px 18px 0', height: '100%' }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBlockEnd: 6 }}>Scaling</div>
      <StepperRow label="Replicas" sub="2–10" value={replicas} onChange={setReplicas} min={2} max={10} />
      <StepperRow label="Retries" sub="On failure" value={retries} onChange={setRetries} min={0} max={5} />
      <StepperRow label="Canary pods" sub="Max 1" value={canary} onChange={setCanary} min={0} max={1} />
    </div>
  );
}

export default function MobileStepper() {
  return (
    <Section
      id="stepper"
      num="01"
      title="Stepper"
      desc="A minus/value/plus control for nudging a small integer one step — replicas, retries, canary pods. Buttons disable at bounds. For wide approximate ranges, use a Slider instead."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Reach for Stepper when the range is tight and the exact value matters. For wide ranges where getting close fast is enough, a Slider gives the user faster control.</Lede>
      <Frame label="Tap − / + · the buttons disable at min and max" center>
        <DeviceFrame initial="iphone-se"><StepperScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Frame label="Mid-range · at minimum (− disabled) · at maximum (+ disabled) · with a unit suffix">
        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '18px 24px', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {([
            ['Mid-range', <Stepper key="mid" value={3} min={0} max={10} />],
            ['At min · − off', <Stepper key="min" value={0} min={0} max={10} />],
            ['At max · + off', <Stepper key="max" value={10} min={0} max={10} />],
            ['With unit', <Stepper key="unit" value={5} min={0} max={60} unit="s" />],
          ] as const).map(([caption, node]) => (
            <React.Fragment key={caption}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textAlign: 'end', whiteSpace: 'nowrap' }}>{caption}</span>
              {node}
            </React.Fragment>
          ))}
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '70px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 999, border: '1px solid var(--border-strong)', background: 'var(--surface)' }}>
                <span style={{ width: 56, height: 56, display: 'grid', placeItems: 'center' }}><Icons.minus size={20} /></span>
                <span style={{ minWidth: 56, textAlign: 'center', fontWeight: 700, fontSize: 'var(--text-xl)', fontFamily: 'var(--font-mono)' }}>3</span>
                <span style={{ width: 56, height: 56, display: 'grid', placeItems: 'center' }}><Icons.plus size={20} /></span>
              </span>
              <span className="lead v" style={{ top: -26, left: 28, height: 20 }} />
              <span className="lead v" style={{ top: -26, left: '50%', height: 20, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -26, right: 28, height: 20 }} />
              <div className="pin" style={{ top: -48, left: 18 }}>1</div>
              <div className="pin" style={{ top: -48, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -48, right: 18 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Decrement.</b> A 44px button; dims and disables at <Mono>min</Mono> so the value can't underflow.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Value.</b> Tabular mono numerals so the width is stable as digits change — no jitter between 9 and 10.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Increment.</b> Mirror of the decrement; disables at <Mono>max</Mono>. Both share a pill track.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="surface" style={{ padding: 18, marginTop: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 18px', alignItems: 'baseline', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
          <Mono>Tab</Mono><span style={{ color: 'var(--fg-muted)' }}>Moves focus onto the control (the whole pill), then to each button.</span>
          <Mono>↑ / →</Mono><span style={{ color: 'var(--fg-muted)' }}>Increment by one. In <Mono>dir="rtl"</Mono> the reading-direction key is <Mono>←</Mono>, so intent never inverts.</span>
          <Mono>↓ / ←</Mono><span style={{ color: 'var(--fg-muted)' }}>Decrement by one (mirrored under RTL).</span>
          <Mono>Home</Mono><span style={{ color: 'var(--fg-muted)' }}>Jump to <Mono>min</Mono>.</span>
          <Mono>End</Mono><span style={{ color: 'var(--fg-muted)' }}>Jump to <Mono>max</Mono>.</span>
          <Mono>Enter / Space</Mono><span style={{ color: 'var(--fg-muted)' }}>On a focused − / + button, steps in that direction.</span>
        </div>
      </div>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Roles & ARIA</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The pill is <Mono>role="spinbutton"</Mono>, focusable, and carries <Mono>aria-valuenow</Mono> / <Mono>aria-valuemin</Mono> / <Mono>aria-valuemax</Mono> so AT announces the live value and the range. At a bound the relevant button is truly <Mono>disabled</Mono> (not just dimmed), so it's announced as unavailable.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus, contrast & motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Each button and the spinbutton paint the canonical ember <Mono>:focus-visible</Mono> ring, so keyboard focus is never invisible. The glyphs use <Mono>var(--fg)</Mono> on <Mono>var(--surface)</Mono> (AA+); disabled drops to <Mono>var(--fg-faint)</Mono>, which signals state without carrying meaning alone. There is no animation, so nothing to gate under <Mono>prefers-reduced-motion</Mono>.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch targets</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Each button is a full 44×44 square with the glyph centred, so repeated taps land without straying onto the value.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Direct-entry escape hatch</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>For ranges past ~20, let the value itself be tapped to type a number — stepping 50 times is not a path.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the −/value/+ control mirrors to the leading (right) side'} center code={`<div dir="rtl"><StepperRow label="النسخ" value={3} min={2} max={10} /></div>`} lang="tsx">
        <div dir="rtl">
          <div style={{ maxWidth: 320, margin: '0 auto', padding: '8px 0' }}>
            <StepperRow label="Replicas" sub="2–10" value={3} min={2} max={10} />
            <StepperRow label="Retries" sub="On failure" value={2} min={0} max={5} />
          </div>
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the whole −/value/+ pill mirrors to the leading (right) side of the row. − and + keep their decrement / increment meaning through logical order — they don't swap roles — and the tabular value stays centred between them.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — tight ranges where the number matters</div>
          <div className="body" style={{ justifyContent: 'center' }}><Stepper value={3} min={1} max={10} /></div>
          <div className="note">1–10 replicas: a few taps, the exact value is visible and intentional.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — wide ranges one tap at a time</div>
          <div className="body" style={{ justifyContent: 'center' }}><Stepper value={250} min={0} max={1000} /></div>
          <div className="note">Reaching 1000 by tapping is hostile. Use a Slider, or let the value be typed.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="stepper"
        lang="tsx"
        code={`<span role="spinbutton" aria-valuenow={v} aria-valuemin={min} aria-valuemax={max}
  className="m-stepper">
  <button aria-label="Decrease" disabled={v <= min} onClick={() => set(v - 1)}>−</button>
  <span className="m-stepper-value">{v}</span>            {/* tabular mono numerals */}
  <button aria-label="Increase" disabled={v >= max} onClick={() => set(v + 1)}>+</button>
</span>

/* each button 44×44; pill track 1px var(--border-strong);
   the spinbutton is tabIndex={0} — arrow keys step it, Home/End jump to bounds */`}
      />
    </Section>
  );
}
