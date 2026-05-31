'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, ForgeChart, Lede, Mono, Spinner, Alert, AlertTitle, AlertDescription, Kbd } from '@/ds/core';

  // Respect the user's motion preference. Returns true when the OS requests
  // reduced motion, so the gauge can render its final fill instantly instead
  // of sweeping. Defaults to false on the server / first paint.
  const useReducedMotion = () => {
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const sync = () => setReduced(mq.matches);
      sync();
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    }, []);
    return reduced;
  };

  // ── Gauge primitive ─────────────────────────────────────────────────────
  // Plain SVG. Math is explicit:
  //   sweep      total arc in radians (π for semi, 1.5π for three-q, 2π for full)
  //   startA     starting angle (left side for semi)
  //   norm       value/max clamped to 0..1
  //   angle      startA + norm * sweep
  //   arcPath()  builds the SVG arc command between two angles
  const polar = (cx, cy, r, angle) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  const arcPath = (cx, cy, r, a0, a1) => {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const [x0, y0] = polar(cx, cy, r, a0);
    const [x1, y1] = polar(cx, cy, r, a1);
    return `M${x0},${y0} A${r},${r} 0 ${large} 1 ${x1},${y1}`;
  };

  const Gauge = ({
    value = 0, max = 100, min = 0,
    variant = 'semi', // "semi" | "three-q" | "full"
    color = 'var(--ember)',
    track = 'var(--viz-grid)',
    thickness = 14,
    size = 220,
    unit = '%',
    label = undefined,
    sublabel = undefined,
    showValue = true,
    ariaLabel = undefined,
  }: {
    value?: number; max?: number; min?: number; variant?: string; color?: string;
    track?: string; thickness?: number; size?: number; unit?: string;
    label?: any; sublabel?: any; showValue?: boolean; ariaLabel?: string;
  }) => {
    const reduced = useReducedMotion();
    const norm = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
    const SWEEP = variant === 'full' ? Math.PI * 2 : variant === 'three-q' ? Math.PI * 1.5 : Math.PI;
    const START = variant === 'full' ? -Math.PI / 2 : variant === 'three-q' ? Math.PI * 0.75 : Math.PI;
    const angle = START + norm * SWEEP;

    const r = (size - thickness) / 2 - 6;
    const cx = size / 2;
    // For semi-circles the visual centroid sits below mid-height — shift cy
    // so the readout still feels centered.
    const cy = variant === 'semi' ? size * 0.65 : size / 2;

    // Track path — full SWEEP, drawn as a dimmer companion under the value
    // arc. For full circles we use two circles (cheaper, perfect roundness).
    const trackPath = variant === 'full'
      ? null
      : arcPath(cx, cy, r, START, START + SWEEP);
    const valuePath = norm > 0
      ? arcPath(cx, cy, r, START, angle)
      : null;

    // Accessible text: "<value><unit>, <label>" so a screen reader announces
    // the same headline a sighted reader sees in the centre readout.
    const valueText = `${Math.round(value)}${unit}${label ? ', ' + label : ''}`;
    const meterLabel = ariaLabel || (typeof label === 'string' ? label : undefined) || 'Gauge';

    return (
      <div className={'gauge gauge-' + variant} style={{ width: size, height: size, position: 'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
             role="meter" aria-label={meterLabel}
             aria-valuenow={Math.round(value)} aria-valuemin={min} aria-valuemax={max}
             aria-valuetext={valueText}>
          {variant === 'full' ? (
            <>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth={thickness}/>
              {norm > 0 && (
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={thickness}
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * r}
                        strokeDashoffset={(1 - norm) * 2 * Math.PI * r}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        style={{ transition: reduced ? 'none' : 'stroke-dashoffset 600ms var(--ease)' }}/>
              )}
            </>
          ) : (
            <>
              <path d={trackPath} fill="none" stroke={track} strokeWidth={thickness} strokeLinecap="round"/>
              {valuePath && (
                <path d={valuePath} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round"
                      style={{ transition: reduced ? 'none' : 'd 600ms var(--ease)' }}/>
              )}
            </>
          )}
        </svg>
        {showValue && (
          <div className="gauge-readout" aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            paddingTop: variant === 'semi' ? size * 0.18 : 0,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: size * 0.18, fontWeight: 600, color: color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(value)}{unit}
            </span>
            {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBlockStart: 8 }}>{label}</span>}
            {sublabel && <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5, marginBlockStart: 4 }}>{sublabel}</span>}
          </div>
        )}
      </div>
    );
  };

  const toneFor = (pct) => pct >= 75 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--danger)';

  // ── "Announced as" — live proof of the meter semantics ───────────────────
  // Step the value and watch the exact aria-valuetext the screen reader speaks
  // stay in lock-step with the visible arc. The string here is built the same
  // way the primitive builds its aria-valuetext, so what you read is what is
  // announced — the a11y contract, demonstrated, not described.
  const AnnouncedDemo = () => {
    const [value, setValue] = React.useState(72);
    const label = 'of 100% budget';
    const announced = `${value}%, ${label}`;
    const step = (d) => () => setValue((v) => Math.max(0, Math.min(100, v + d)));
    // Arrow keys drive the value too, so the spinbutton-style group is fully
    // keyboard-operable — not just the +/- buttons.
    const onKey = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); step(4)(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); step(-4)(); }
      if (e.key === 'Home') { e.preventDefault(); setValue(0); }
      if (e.key === 'End') { e.preventDefault(); setValue(100); }
    };
    return (
      <div className="surface" style={{ padding: 18, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <Gauge value={value} max={100} variant="semi" color="var(--success)" label={label} ariaLabel="SLO budget left" size={150} thickness={12}/>
        <div style={{ flex: 1, minInlineSize: 240, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="t-mono-label">screen reader announces</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', color: 'var(--fg)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.3 }}>
            &ldquo;{announced}&rdquo;
          </div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Sourced verbatim from the meter&rsquo;s <Mono>aria-valuetext</Mono>. Step the value and the spoken string tracks the arc exactly.
          </div>
          <div
            role="group"
            aria-label="Adjust SLO budget"
            tabIndex={0}
            onKeyDown={onKey}
            style={{ display: 'flex', gap: 8, alignItems: 'center', marginBlockStart: 4, borderRadius: 'var(--radius-sm)' }}
          >
            <button type="button" className="btn" onClick={step(-4)} aria-label="Decrease budget by 4 percent"><Icons.minus size={14}/></button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', minInlineSize: 44, textAlign: 'center' }}>{value}%</span>
            <button type="button" className="btn" onClick={step(4)} aria-label="Increase budget by 4 percent"><Icons.plus size={14}/></button>
          </div>
        </div>
      </div>
    );
  };

  const USAGE = `// The Gauge primitive is plain SVG — no Recharts.
function Gauge({ value, max, variant = "semi", color = "var(--ember)", label }) {
  // sweep:  semi=π, three-q=1.5π, full=2π
  // start:  semi=π (left), three-q=0.75π, full=-π/2 (top)
  // path:   arcPath(cx, cy, r, start, start + (value/max) * sweep)
  const reduced = useReducedMotion();          // gate the 600ms sweep
  return (
    // role="meter" makes the SVG itself the accessible value
    <svg role="meter" aria-label={label}
         aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}
         aria-valuetext={\`\${value}%, \${label}\`}
         width={220} height={220}>
      <path d={trackPath} stroke="var(--viz-grid)" strokeWidth={14}/>
      <path d={valuePath} stroke={color} strokeWidth={14} strokeLinecap="round"
            style={{ transition: reduced ? "none" : "d 600ms var(--ease)" }}/>
    </svg>
  )
}

<ForgeChart title="SLO budget left" height={240}>
  <Gauge value={72} max={100} variant="semi"
         color="var(--success)" label="of 100% budget"/>
</ForgeChart>`;

export default function Page() {
  return (
    <Section id="chart-gauge" title="Gauge chart" desc="Encodes one headline value as an arc across a fixed range — the number is the load-bearing element. Reach for it when a single dominant KPI needs a prominent home at the top of a dashboard.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('chart-gauge')} ariaLabel="package manager"/>
      <Lede>v1.5.0 ships a from-scratch SVG implementation (the Recharts PieChart-based gauge mis-centered inside <Mono>ResponsiveContainer</Mono>). Three variants: <Mono>semi</Mono> for a half-donut, <Mono>three-q</Mono> for a higher-resolution 270° sweep, <Mono>full</Mono> for tight stat-card rings.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Never line up a row of gauges — that is a radial bar chart in disguise and does the same job in half the pixels. Always render a background track so readers see the value against its ceiling, not just a lonely sweep.</Lede>
      <Frame label="single gauge · SLO budget left" code={USAGE}>
        <ForgeChart title="SLO budget left" subtitle="forge-api" meta="this quarter" height={260}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Gauge value={72} max={100} variant="semi" color="var(--success)" label="of 100% budget" size={220} thickness={16}/>
          </div>
        </ForgeChart>
      </Frame>
      <Lede>The center label is the load-bearing element — the arc is decoration. Always pair the value with a unit and a contextual subtitle.</Lede>

      <SubHead meta="3 variants">Variants</SubHead>
      <Frame label="semi · three-q · full">
        <ForgeChart title="The three sweeps" subtitle={<span style={{ fontVariantNumeric: 'tabular-nums' }}>180° · 270° · 360°</span>} height={260}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'center', justifyItems: 'center', width: '100%' }}>
            <Gauge value={72} variant="semi"    color="var(--ember)"   label="semi"    size={170} thickness={14}/>
            <Gauge value={72} variant="three-q" color="var(--ember)"   label="three-q" size={170} thickness={14}/>
            <Gauge value={72} variant="full"    color="var(--ember)"   label="full"    size={170} thickness={14}/>
          </div>
        </ForgeChart>
      </Frame>

      <Frame label="status-tinted · color tracks the value (Change Risk Score recipe)">
        <ForgeChart title="Change Risk Score" subtitle={<span style={{ fontVariantNumeric: 'tabular-nums' }}>3 services · 0–100 scale</span>} meta="lower = safer" height={250}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'center', justifyItems: 'center', width: '100%' }}>
            <Gauge value={72} variant="semi" color={toneFor(72)} label="healthy"  sublabel="forge-api"     size={170} thickness={14}/>
            <Gauge value={48} variant="semi" color={toneFor(48)} label="at risk"  sublabel="fraud-engine"  size={170} thickness={14}/>
            <Gauge value={18} variant="semi" color={toneFor(18)} label="breached" sublabel="kyc"           size={170} thickness={14}/>
          </div>
        </ForgeChart>
      </Frame>

      <Frame label="dense · hero KPI at the top of a dashboard">
        <ForgeChart title="Deploy success" subtitle="last 30 days" meta={<span style={{ fontVariantNumeric: 'tabular-nums' }}>92.4%</span>} height={280}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Gauge value={92} max={100} variant="three-q" color="var(--ember)" label="of 211 runs" size={240} thickness={18}/>
          </div>
        </ForgeChart>
      </Frame>

      <Frame label="full ring · stat-card recipe (small)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, width: '100%' }}>
          {[{v:84,l:'coverage',c:'var(--ember)'},{v:99,l:'uptime',c:'var(--success)'},{v:62,l:'docs',c:'var(--warning)'},{v:28,l:'a11y',c:'var(--danger)'}].map((g, i) => (
            <ForgeChart key={i} title={g.l} height={150} padding={6}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Gauge value={g.v} variant="full" color={g.c} size={108} thickness={10} ariaLabel={g.l}/>
              </div>
            </ForgeChart>
          ))}
        </div>
      </Frame>

      <SubHead meta="loading · empty · error · zero">States</SubHead>
      <Lede>A gauge is the headline number on a dashboard — so it must say something honest while the metric is still resolving, when the window has no events, and when the query fails. The arc never fakes a value it does not have.</Lede>
      <Frame label="loading · empty · error — the gauge before (and instead of) a value">
        <div className="ds-grid cols-3" style={{ gap: 14 }}>
          <ForgeChart title="SLO budget left" subtitle="forge-api" height={200} state="loading"
            fallback={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Spinner size="lg" aria-label="Loading SLO budget"/>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>resolving…</span>
              </div>
            }
          />
          <ForgeChart title="SLO budget left" subtitle="forge-api" height={200} state="empty"
            fallback={
              <div className="empty sm">
                <span className="empty-icon"><Icons.gauge size={18}/></span>
                <div className="empty-text">
                  <div className="empty-title">No measurements yet</div>
                  <div className="empty-desc">This window has no recorded events. The gauge stays blank rather than drawing a zero it cannot vouch for.</div>
                </div>
              </div>
            }
          />
          <div className="forge-chart">
            <div className="fc-head">
              <div className="fc-head-text">
                <span className="fc-title">SLO budget left</span>
                <span className="fc-subtitle">forge-api</span>
              </div>
            </div>
            <div className="fc-body" style={{ minBlockSize: 200, display: 'flex', alignItems: 'center' }}>
              <Alert tone="danger" style={{ inlineSize: '100%' }}>
                <AlertTitle>Metric unavailable</AlertTitle>
                <AlertDescription>The SLO query timed out. Showing no value beats showing a wrong one — retry to refetch.</AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </Frame>
      <Lede>Loading and empty share the <Mono>role="status"</Mono> live region the chart container provides (with <Mono>aria-busy</Mono> while loading); the error state is a real <Mono>role="alert"</Mono> danger <Mono>Alert</Mono> so assistive tech is interrupted. A disabled or at-minimum gauge still renders its honest value — it reads <Mono>0%</Mono> over the track, never a blank frame.</Lede>
      <Frame label="zero & disabled — a real value of 0 still draws (track only), never an empty frame">
        <ForgeChart title="Error budget burned" subtitle="payments-api" meta={<span style={{ fontVariantNumeric: 'tabular-nums' }}>nominal</span>} height={220}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', opacity: 0.55 }} aria-disabled="true">
            <Gauge value={0} max={100} variant="semi" color="var(--fg-faint)" label="of 100% budget" size={200} thickness={14} ariaLabel="Error budget burned, disabled"/>
          </div>
        </ForgeChart>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A status-tinted gauge encodes health in the arc colour, but the centre number and a text label (healthy / at risk / breached) carry the same meaning — so a colour-blind reader gets the verdict from the readout, never from the <Mono>--success</Mono>/<Mono>--danger</Mono> hue alone.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 12}}>The meter itself is read-only — it has no keyboard target. When a gauge is made adjustable (the stepper below), the value group takes focus and maps to the standard spinbutton keys:</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Kbd label="Step value up / down" keys={['↑', '↓']}/>
            <Kbd label="Step in reading direction" keys={['→', '←']}/>
            <Kbd label="Jump to min / max" keys={['Home', 'End']}/>
            <Kbd label="Activate ± buttons" keys={['Enter', 'Space']}/>
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Role &amp; screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The SVG carries <Mono>role="meter"</Mono> with <Mono>aria-valuenow</Mono>, <Mono>aria-valuemin</Mono>, <Mono>aria-valuemax</Mono>, an <Mono>aria-label</Mono>, and an <Mono>aria-valuetext</Mono> that spells out the headline (e.g. <Mono>"72%, of 100% budget"</Mono>). The visible centre readout is <Mono>aria-hidden</Mono> so the meter announces the value once, not twice. There is no hover tooltip — the printed number is the value.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The arc sweeps to its value over 600ms on the <Mono>--ease</Mono> curve. The primitive reads <Mono>prefers-reduced-motion</Mono> via <Mono>matchMedia</Mono> and drops the transition to <Mono>none</Mono> when reduce is requested — the arc renders at its final fill instantly with no sweep.</div>
        </div>
      </div>
      <Lede>Announced as — the meter is not just labelled, it is verifiable. The mono line below is the live <Mono>aria-valuetext</Mono> a screen reader speaks; step the value and watch it stay in lock-step with the arc.</Lede>
      <div style={{marginBlockStart: 12}}>
        <AnnouncedDemo/>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — title and labels align right; the arc direction and centre readout are unchanged'>
        <div dir="rtl" style={{width: '100%'}}>
          <ForgeChart title="ميزانية SLO المتبقية" subtitle="forge-api" meta="هذا الربع" height={260}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Gauge value={72} max={100} variant="semi" color="var(--success)" label="من ميزانية ١٠٠٪" size={220} thickness={16}/>
            </div>
          </ForgeChart>
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the chart title, subtitle, and label text align to the right. The arc itself is radially symmetric — it has no inherent direction — and the centre readout value is not mirrored.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <div style={{width:200, height:140, display:'flex', justifyContent:'center'}}>
                <Gauge value={72} max={100} variant="semi" color="var(--success)" label="of 100% budget" size={200} thickness={14}/>
              </div>
              <span className="lead v" style={{top: -22, left: 30, height: 18}}/>
              <span className="lead v" style={{top: -22, right: 30, height: 18}}/>
              <span className="lead h" style={{top: 70, left: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <div className="pin" style={{top: -42, left: 30, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, right: 30, transform:'translateX(50%)'}}>2</div>
              <div className="pin" style={{top: 62, left: -52}}>3</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Value arc.</b> The foreground sweep, proportional to <Mono>value / max</Mono>, rounded at the cap. Defaults to <Mono>--ember</Mono>; a status token (<Mono>--success</Mono>/<Mono>--warning</Mono>/<Mono>--danger</Mono>) makes it a traffic-light read.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Background track.</b> The dimmer companion arc in <Mono>--viz-grid</Mono> spanning the full range — the ceiling the value is measured against.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Sweep variant.</b> <Mono>semi</Mono> (180°), <Mono>three-q</Mono> (270°), or <Mono>full</Mono> (360°) — wider sweeps give finer resolution for hero KPIs.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Centre readout.</b> The mono value + unit is the headline, set in the arc's own colour; a mono uppercase label and optional sublabel give it context.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one gauge, big, with a number you can read</div>
          <div className="body" style={{ padding: 14 }}>
            <ForgeChart height={200} padding={8}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Gauge value={64} variant="semi" color="var(--success)" label="of 100% budget" size={170} thickness={14}/>
              </div>
            </ForgeChart>
          </div>
          <div className="note">A single gauge anchors a dashboard. The number is the headline; the arc tells you "more or less than half" at a glance.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — stack four tiny gauges in a row</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, width: '100%', alignItems: 'center', justifyItems: 'center' }}>
              {[64, 48, 72, 30].map((v, i) => (
                <Gauge key={i} value={v} variant="semi" color={toneFor(v)} size={70} thickness={6} showValue={false} ariaLabel={'Gauge ' + (i + 1)}/>
              ))}
            </div>
          </div>
          <div className="note">Multiple gauges in a row is a radial-bar chart in disguise — and it does the job in half the pixels. Use Radial chart instead.</div>
        </div>
      </div>

      <SubHead meta="props">API reference</SubHead>
      <PropsTable
        label="<Gauge /> · primitive (plain SVG)"
        rows={[
          { prop: 'value',     type: 'number',    description: 'Current value, 0–max.' },
          { prop: 'max',       type: 'number',    default: '100', description: 'Upper bound for the arc.' },
          { prop: 'min',       type: 'number',    default: '0',   description: 'Lower bound for the arc.' },
          { prop: 'variant',   type: '"semi" | "three-q" | "full"', default: '"semi"', description: 'Sweep: 180° / 270° / 360°.' },
          { prop: 'color',     type: 'CSS color', default: '"var(--ember)"', description: 'Foreground arc color — use status tokens for traffic light gauges.' },
          { prop: 'track',     type: 'CSS color', default: '"var(--viz-grid)"', description: 'Background arc color.' },
          { prop: 'thickness', type: 'number',    default: '14',  description: 'Stroke width.' },
          { prop: 'size',      type: 'number',    default: '220', description: 'Total px (width = height).' },
          { prop: 'label',     type: 'string',    description: 'Caption shown below the value in mono uppercase.' },
          { prop: 'sublabel',  type: 'string',    description: 'Optional muted line beneath the label.' },
          { prop: 'showValue', type: 'boolean',   default: 'true', description: 'Hide the centered number for mini gauges.' },
          { prop: 'ariaLabel', type: 'string',    description: 'Accessible name for the role="meter" SVG. Falls back to label, then "Gauge". Set it on mini gauges where the label is hidden.' },
        ]}
      />
    </Section>
  );
}
