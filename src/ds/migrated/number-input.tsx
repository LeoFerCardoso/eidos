'use client';
// Eidos DS — Components / Number Input.
//
// Numeric entry — currency, percentages, integer ranges, units, ports.
// Wraps `<input type="number">` with our shell, hides the native browser
// spinner, and offers an opt-in vertical stepper for ±1 ranges.
//
// Building blocks (shared with Input):
//   .in-group, .in-control, .in-addon (text · select · stepper)
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono, Skeleton, Spinner, Alert, AlertTitle, AlertDescription, KbdRow } from '@/ds/core';



  const USAGE_CODE = `import { NumberInput } from "@/components/forge/number-input"

export function Demo() {
  const [value, setValue] = React.useState("3")
  return (
    <NumberInput
      value={value}
      onValueChange={setValue}
      min={1} max={99}
      stepper
    />
  )
}`;

  // ─── Reusable NumberInput component with optional stepper ───────────────
  // Mirrors the shipped @eidos/ui NumberInput surface (forms.tsx): stepper +
  // layout('stacked'|'split'), an optional progress `meter` within [min,max],
  // and the docs-API `onValueChange` alias.
  type NumberInputProps = {
    id?: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onValueChange?: (value: string) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    size?: string;
    invalid?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    stepper?: boolean;
    layout?: 'stacked' | 'split';
    meter?: boolean;
    placeholder?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    style?: React.CSSProperties;
  };
  const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(({
    id, value, defaultValue, onChange, onValueChange, onBlur, min, max, step=1,
    size='md', invalid, disabled, readOnly,
    prefix, suffix, stepper=false, layout='stacked', meter=false, placeholder,
    inputMode='numeric',
    style,
  }, ref) => {
    const localRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => localRef.current as HTMLInputElement);
    const nudge = (dir: 1 | -1) => {
      const el = localRef.current;
      if (!el) return;
      if (dir === 1) el.stepUp(); else el.stepDown();
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    // Meter: derive a 0–100 percentage from the current numeric value.
    const numMin = min != null && min !== '' ? Number(min) : null;
    const numMax = max != null && max !== '' ? Number(max) : null;
    const raw = value != null ? Number(value) : (defaultValue != null ? Number(defaultValue) : null);
    const [liveValue, setLiveValue] = React.useState<number | null>(raw);
    const showMeter = meter && numMin != null && numMax != null;
    const meterPct = (() => {
      const v = value != null ? Number(value) : liveValue;
      if (v == null || numMin == null || numMax == null || numMax === numMin) return 0;
      return Math.min(100, Math.max(0, ((v - numMin) / (numMax - numMin)) * 100));
    })();

    const isSplit = stepper && layout === 'split';
    const isStacked = stepper && layout === 'stacked';
    const meterId = showMeter && id ? `${id}-meter` : undefined;

    return (
      <>
        <span
          className={'in-group ' + size + (invalid ? ' is-invalid' : '') + (disabled ? ' is-disabled' : '') + (readOnly ? ' is-readonly' : '')}
          style={style}
        >
          {isSplit && (
            <button type="button" className="in-addon btn" aria-label="Decrease" onClick={() => nudge(-1)} disabled={disabled || readOnly}><Icons.minus size={12}/></button>
          )}
          {prefix}
          <input
            ref={localRef}
            id={id}
            type="number" inputMode={inputMode} step={step}
            className="in-control"
            // tabular figures so digits line up column-to-column and the value
            // doesn't shimmy width as you step (the one field where it's mandatory).
            style={{fontVariantNumeric: 'tabular-nums', ...(isSplit ? {textAlign:'center'} : null)}}
            value={value} defaultValue={defaultValue}
            onChange={(e) => { setLiveValue(e.target.value === '' ? null : Number(e.target.value)); onChange?.(e); onValueChange?.(e.target.value); }}
            onBlur={onBlur}
            min={min} max={max}
            placeholder={placeholder}
            disabled={disabled} readOnly={readOnly}
            aria-invalid={invalid || undefined}
            aria-describedby={meterId}
          />
          {suffix}
          {isSplit && (
            <button type="button" className="in-addon btn" aria-label="Increase" onClick={() => nudge(1)} disabled={disabled || readOnly}><Icons.plus size={12}/></button>
          )}
          {isStacked && (
            <span className="in-addon stepper">
              <button type="button" className="step" aria-label="Increase" onClick={() => nudge(1)} disabled={disabled || readOnly}><Icons.chevronUp size={11}/></button>
              <button type="button" className="step" aria-label="Decrease" onClick={() => nudge(-1)} disabled={disabled || readOnly}><Icons.chevronDown size={11}/></button>
            </span>
          )}
        </span>
        {showMeter && (
          <div
            id={meterId}
            role="progressbar"
            aria-valuenow={Math.round(meterPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Value progress"
            style={{height: 3, borderRadius: 2, background:'var(--bg-elevated)', overflow:'hidden', marginTop: 6}}
          >
            <div style={{width: `${meterPct}%`, height:'100%', background:'var(--ember)', transition:'width var(--dur-fast) var(--ease)'}}/>
          </div>
        )}
      </>
    );
  });

  const CODE_BASIC = [
    `<NumberInput`,
    `  value={port}`,
    `  onValueChange={setPort}`,
    `  min={1} max={65535} step={1}`,
    `/>`,
    ``,
    `// Native browser spinner arrows are hidden globally —`,
    `// type="number" is for keyboard semantics + min/max enforcement,`,
    `// not for visual chrome.`,
  ].join('\n');

  const CODE_STEPPER = [
    `<NumberInput`,
    `  value={replicas}`,
    `  onValueChange={setReplicas}`,
    `  min={1} max={99}`,
    `  stepper`,
    `/>`,
  ].join('\n');

  const CODE_CURRENCY = [
    `<NumberInput`,
    `  value={price}`,
    `  onValueChange={setPrice}`,
    `  step={0.01}`,
    `  inputMode="decimal"`,
    `  prefix="USD"`,
    `  suffix="/ mo"`,
    `/>`,
  ].join('\n');

  const CODE_LAYOUT = [
    `// stacked (default) — chevron pair on the trailing edge`,
    `<NumberInput value={n} onValueChange={setN} min={0} max={99} stepper />`,
    ``,
    `// split — "−" leading, "+" trailing; value is the focal point`,
    `<NumberInput value={n} onValueChange={setN} min={0} max={99}`,
    `  stepper layout="split" />`,
  ].join('\n');

  const CODE_METER = [
    `<NumberInput`,
    `  value={pct}`,
    `  onValueChange={setPct}`,
    `  min={0} max={100} suffix="%"`,
    `  stepper`,
    `  meter            // thin progress bar within [min, max]`,
    `/>`,
  ].join('\n');

  // ─── Page ───────────────────────────────────────────────────────────────
export default function NumberPage() {
    const [price, setPrice] = React.useState('29.00');
    const [replicas, setReplicas] = React.useState('3');
    const [pct, setPct] = React.useState('15');
    const [age, setAge] = React.useState('');
    const ageEmpty = age === '';
    const ageInvalid = !ageEmpty && !(Number(age) >= 18 && Number(age) <= 120);
    // Live status string for the screen-reader announcement region — true to the
    // shipped component's aria-invalid + min/max semantics. Empty when valid.
    const ageStatus = ageInvalid
      ? `${age} is out of range — enter a value between 18 and 120.`
      : '';
    // INNOVATION: clamp-on-blur. Leaving the field with an out-of-range value
    // snaps it back into [18,120] — the documented min/max enforcement, performed.
    // We surface what happened as a visible mono note so the correction is legible.
    const [ageClamp, setAgeClamp] = React.useState<{from: string; to: string} | null>(null);
    const clampAge = () => {
      if (ageEmpty) { setAgeClamp(null); return; }
      const n = Number(age);
      if (Number.isNaN(n)) return;
      const to = Math.min(120, Math.max(18, n));
      if (to !== n) { setAgeClamp({ from: age, to: String(to) }); setAge(String(to)); }
      else setAgeClamp(null);
    };

    // Loading demo: the field hydrates from a remote default; until it resolves
    // we show a Skeleton in place of the control so layout never shifts.
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      const t = setTimeout(() => setLoading(false), 1400);
      return () => clearTimeout(t);
    }, []);

    return (
      <Section
        id="number-input"
        num="31"
        title="Number Input"
        desc="Numeric entry for currency, percentages, ports, replicas, and any other quantitative value. Wraps the native input but hides the browser's spinner — our stepper is opt-in only."
      >
        {/* 1. INSTALLATION */}
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('number-input')} ariaLabel="package manager"/>
        <Lede>
          Ships <Mono>number-input.tsx</Mono> on top of the standard Input shell — hides the native browser spinner, optional opt-in stepper buttons, prefix/suffix slots.
        </Lede>

        {/* 2. USAGE */}
        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="basic" code={USAGE_CODE}>
          <div style={{width:'100%', maxWidth: 320}}>
            <label className="in-label" htmlFor="u-num">Replicas</label>
            <NumberInput id="u-num" defaultValue="3" stepper min="1" max="99"/>
          </div>
        </Frame>

        {/* 3. EXAMPLES */}
        <div className="ds-examples-rule" style={{marginTop: 36, marginBottom: 6}}>
          <span className="t-mono-label">Examples</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        <p style={{color:'var(--fg-muted)', maxWidth:'72ch', marginBottom: 22, lineHeight: 1.6}}>
          The native <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>type="number"</code> spinner arrows are hidden globally — they break our visual rhythm and never match our typography. Use <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>type="number"</code> for what it's good at: numeric keyboards on mobile, <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>min</code> / <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>max</code> / <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>step</code> enforcement, and form-validation semantics. Reach for the explicit <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>.in-addon.stepper</code> only when ±1 buttons add real value.
        </p>

        {/* Basic */}
        <SubHead meta="default">Basic</SubHead>
        <Frame label="No prefix, no stepper — the simplest numeric field" code={CODE_BASIC}>
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="b1">Port</label>
              <NumberInput id="b1" defaultValue="443" min="1" max="65535"/>
              <div className="in-help" style={{marginTop: 6}}>1–65535</div>
            </div>
            <div>
              <label className="in-label" htmlFor="b2">Quantity</label>
              <NumberInput id="b2" defaultValue="1" min="1" placeholder="Enter quantity"/>
            </div>
          </div>
        </Frame>

        {/* Stepper */}
        <SubHead meta="±1 buttons">With stepper</SubHead>
        <Frame label="For integer ranges where ±1 makes sense — replicas, GB volume, retries" code={CODE_STEPPER}>
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="st1">Replicas</label>
              <NumberInput id="st1" value={replicas} onChange={(e)=>setReplicas(e.target.value)} min="1" max="99" stepper/>
              <div className="in-help" style={{marginTop: 6}}>Cluster nodes — integer 1 to 99</div>
            </div>
            <div>
              <label className="in-label" htmlFor="st2">Volume</label>
              <NumberInput id="st2" defaultValue="20" min="0" stepper
                suffix={<span className="in-addon text">GB</span>}
              />
            </div>
          </div>
        </Frame>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          Steppers are best for small integer ranges where the user is most likely tweaking by ±1. For free-typing values (a 5-digit price, a port number, a percentage) the stepper is friction — typing is faster. Hold Cmd/Shift to step by larger increments only if you wire that yourself; the native control doesn't ship that behaviour.
        </p>

        {/* Stepper layout */}
        <SubHead meta="stacked · split">Stepper layout</SubHead>
        <Frame label={'layout="stacked" (default) stacks the chevrons; layout="split" puts − and + on opposite edges'} code={CODE_LAYOUT}>
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="ly1">Stacked (default)</label>
              <NumberInput id="ly1" defaultValue="3" min="0" max="99" stepper layout="stacked"/>
              <div className="in-help" style={{marginTop: 6}}>Chevron pair on the trailing edge</div>
            </div>
            <div>
              <label className="in-label" htmlFor="ly2">Split</label>
              <NumberInput id="ly2" defaultValue="3" min="0" max="99" stepper layout="split"/>
              <div className="in-help" style={{marginTop: 6}}>− leading, + trailing — value-centred</div>
            </div>
          </div>
        </Frame>

        {/* Meter */}
        <SubHead meta="progress bar">Meter</SubHead>
        <Frame label={'meter renders a thin progress bar below the field — only when both min and max are set'} code={CODE_METER}>
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="mt1">Discount</label>
              <NumberInput id="mt1" value={pct} onValueChange={setPct} min="0" max="100" step="1"
                suffix={<span className="in-addon text">%</span>}
                stepper
                meter
              />
              <div className="in-help" style={{marginTop: 6}}>Bar reflects the value within 0–100</div>
            </div>
            <div>
              <label className="in-label" htmlFor="mt2">Volume</label>
              <NumberInput id="mt2" defaultValue="40" min="0" max="100" step="5"
                suffix={<span className="in-addon text">GB</span>}
                stepper
                meter
              />
              <div className="in-help" style={{marginTop: 6}}>Fills proportionally from 0 to 100 GB</div>
            </div>
          </div>
        </Frame>

        {/* Currency */}
        <SubHead meta="currency · prefix">Currency</SubHead>
        <Frame label="Static currency code on the leading edge; period suffix on the trailing edge" code={CODE_CURRENCY}>
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="cur1">Plan price</label>
              <NumberInput id="cur1" value={price} onChange={(e)=>setPrice(e.target.value)} step="0.01" inputMode="decimal"
                prefix={<span className="in-addon text">USD</span>}
                suffix={<span className="in-addon text">/ mo</span>}
              />
            </div>
            <div>
              <label className="in-label" htmlFor="cur2">Currency-switchable</label>
              <NumberInput id="cur2" defaultValue="29.00" step="0.01" inputMode="decimal"
                prefix={
                  <select className="in-addon select" defaultValue="USD" aria-label="Currency">
                    <option>USD</option><option>EUR</option><option>GBP</option><option>BRL</option>
                  </select>
                }
              />
              <div className="in-help" style={{marginTop: 6}}>Pick the currency, then type the amount.</div>
            </div>
            <div>
              <label className="in-label" htmlFor="cur3">Annual budget</label>
              <NumberInput id="cur3" defaultValue="120000" step="100" inputMode="decimal"
                prefix={<span className="in-addon text">$</span>}
                suffix={<span className="in-addon text">USD</span>}
              />
            </div>
            <div>
              <label className="in-label" htmlFor="cur4">Hourly rate</label>
              <NumberInput id="cur4" defaultValue="65" step="0.01" inputMode="decimal"
                prefix={<span className="in-addon text">$</span>}
                suffix={<span className="in-addon text">/ hr</span>}
              />
            </div>
          </div>
        </Frame>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          Use <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>{`inputMode="decimal"`}</code> for currency — it pulls up the period-aware numeric keyboard on mobile (locales that use comma still work; the browser respects the system locale). Format on blur with <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>Intl.NumberFormat</code> if you want thousand separators in the displayed value.
        </p>

        {/* Percentage */}
        <SubHead meta="percent · 0–100">Percentage</SubHead>
        <Frame label="A percent suffix and a 0–100 range — common for discounts, allocations, thresholds">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="pc1">Discount</label>
              <NumberInput id="pc1" value={pct} onValueChange={setPct} min="0" max="100" step="1"
                suffix={<span className="in-addon text">%</span>}
                stepper
                meter
              />
              <div className="in-help" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap: 8, marginTop: 6}}>
                <span>The <code>meter</code> bar fills with the value within 0–100</span>
                <span className="t-mono" style={{minWidth: 32, textAlign:'end'}}>{Math.max(0, Math.min(100, Number(pct)))}%</span>
              </div>
            </div>
            <div>
              <label className="in-label" htmlFor="pc2">CPU allocation</label>
              <NumberInput id="pc2" defaultValue="75" min="0" max="100" step="5"
                suffix={<span className="in-addon text">%</span>}
                stepper
              />
              <div className="in-help" style={{marginTop: 6}}>Step of 5 for cluster planning</div>
            </div>
          </div>
        </Frame>

        {/* Units */}
        <SubHead meta="picker · select-as-suffix">With unit picker</SubHead>
        <Frame label="A select on either side lets the user switch units without leaving the field">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="un1">Timeout</label>
              <NumberInput id="un1" defaultValue="30" min="1"
                suffix={
                  <select className="in-addon select" defaultValue="min" aria-label="Unit">
                    <option>sec</option><option>min</option><option>hr</option><option>day</option>
                  </select>
                }
              />
            </div>
            <div>
              <label className="in-label" htmlFor="un2">Memory</label>
              <NumberInput id="un2" defaultValue="512" min="1"
                suffix={
                  <select className="in-addon select" defaultValue="MB" aria-label="Unit">
                    <option>KB</option><option>MB</option><option>GB</option><option>TB</option>
                  </select>
                }
              />
            </div>
            <div>
              <label className="in-label" htmlFor="un3">Distance</label>
              <NumberInput id="un3" defaultValue="100" min="0" step="0.1" inputMode="decimal"
                suffix={
                  <select className="in-addon select" defaultValue="km" aria-label="Unit">
                    <option>m</option><option>km</option><option>mi</option><option>ft</option>
                  </select>
                }
              />
            </div>
            <div>
              <label className="in-label" htmlFor="un4">Phone country</label>
              <NumberInput id="un4" placeholder="(415) 555-0199"
                inputMode="tel"
                prefix={
                  <select className="in-addon select" defaultValue="+1" aria-label="Country code" style={{paddingInlineEnd: 26}}>
                    <option>+1</option><option>+44</option><option>+55</option><option>+971</option><option>+81</option>
                  </select>
                }
              />
            </div>
          </div>
        </Frame>

        {/* Sizes */}
        <SubHead meta="sm · md · lg">Sizes</SubHead>
        <Frame label="Match the field height of the surrounding form chrome">
          <div className="ds-grid cols-3" style={{width:'100%'}}>
            <div>
              <label className="in-label">Small</label>
              <NumberInput defaultValue="3" stepper size="sm"/>
            </div>
            <div>
              <label className="in-label">Default</label>
              <NumberInput defaultValue="3" stepper size="md"/>
            </div>
            <div>
              <label className="in-label">Large</label>
              <NumberInput defaultValue="3" stepper size="lg"/>
            </div>
          </div>
        </Frame>

        {/* States */}
        <SubHead meta="empty · loading · invalid · disabled · readonly">States &amp; constraints</SubHead>
        <Frame label="Every state the shipped field can be in — each one rendered, not described">
          <div className="ds-grid cols-2" style={{width:'100%'}}>

            {/* INVALID — performs the real interaction: type out of [18,120] and the
                field flips aria-invalid, a danger Alert (role=alert) appears, and an
                aria-live region announces the clamp to assistive tech. */}
            <div>
              <label className="in-label" htmlFor="ag1">Age <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)', marginInlineStart: 6}}>invalid</span></label>
              <NumberInput
                id="ag1"
                value={age}
                onChange={(e)=>{ setAge(e.target.value); setAgeClamp(null); }}
                onBlur={clampAge}
                min="18" max="120"
                placeholder="Try 17 or 121"
                invalid={ageInvalid}
              />
              {ageInvalid
                ? <div style={{marginTop: 8}}>
                    <Alert tone="danger">
                      <AlertTitle>Out of range</AlertTitle>
                      <AlertDescription>Enter a value between <span className="t-mono">18</span> and <span className="t-mono">120</span>, then blur to snap it back.</AlertDescription>
                    </Alert>
                  </div>
                : ageClamp
                  ? <div className="in-help" style={{marginTop: 6, display:'inline-flex', alignItems:'center', gap: 6}}>
                      <Icons.check size={12} style={{color:'var(--ember)'}}/>
                      Clamped <span className="t-mono">{ageClamp.from}</span> → <span className="t-mono">{ageClamp.to}</span> on blur.
                    </div>
                  : <div className="in-help" style={{marginTop: 6}}>Bounds <span className="t-mono">18</span>–<span className="t-mono">120</span> — type out of range to see the error, blur to snap back.</div>
              }
              {/* INNOVATION: live status region — true to the component's aria-invalid +
                  min/max semantics; announces the clamp politely, no extra chrome. */}
              <span role="status" aria-live="polite" className="sr-only">{ageStatus || (ageClamp ? `Value clamped to ${ageClamp.to}.` : '')}</span>
            </div>

            {/* LOADING — the control's place is held by a Skeleton until the remote
                default resolves, so the row never reflows. A Spinner labels the wait. */}
            <div>
              <label className="in-label" htmlFor="ld1">Saved quota
                {loading && <span style={{marginInlineStart: 6, display:'inline-flex', verticalAlign:'middle', color:'var(--fg-faint)'}}><Spinner size="sm" aria-label="Loading saved quota"/></span>}
              </label>
              {loading
                ? <Skeleton variant="box" height={36}/>
                : <NumberInput id="ld1" defaultValue="64" min="0" max="256" step="8" stepper
                    suffix={<span className="in-addon text">GB</span>}
                  />}
              <div className="in-help" style={{marginTop: 6}}>{loading ? 'Fetching the saved value…' : 'Hydrated — Skeleton swapped for the live field.'}</div>
            </div>

            {/* EMPTY — no value yet; placeholder carries the affordance, no error. */}
            <div>
              <label className="in-label" htmlFor="emp">Budget cap <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)', marginInlineStart: 6}}>empty</span></label>
              <NumberInput id="emp" defaultValue="" min="0" step="100" inputMode="decimal"
                prefix={<span className="in-addon text">$</span>}
                placeholder="No cap set"
              />
              <div className="in-help" style={{marginTop: 6}}>Empty is a valid resting state — placeholder, not a zero.</div>
            </div>

            {/* DISABLED */}
            <div>
              <label className="in-label" htmlFor="dis">Locked replicas <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)', marginInlineStart: 6}}>disabled</span></label>
              <NumberInput id="dis" defaultValue="3" stepper disabled/>
              <div className="in-help" style={{marginTop: 6}}>Disabled — value and stepper both inert; controlled at the cluster level.</div>
            </div>

            {/* READONLY */}
            <div>
              <label className="in-label" htmlFor="ro">Build number <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)', marginInlineStart: 6}}>readonly</span></label>
              <NumberInput id="ro" defaultValue="20240615" readOnly/>
              <div className="in-help" style={{marginTop: 6}}>Readonly — selectable and copyable, auto-incremented by CI.</div>
            </div>

            {/* STEP CONSTRAINT */}
            <div>
              <label className="in-label" htmlFor="lim">Step of 5 <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)', marginInlineStart: 6}}>constrained</span></label>
              <NumberInput id="lim" defaultValue="20" min="0" max="100" step="5" stepper
                suffix={<span className="in-addon text">%</span>}
              />
              <div className="in-help" style={{marginTop: 6}}>Native <span className="t-mono">step</span> snaps the increment to 5.</div>
            </div>
          </div>
        </Frame>

        {/* Composing recipes */}
        <SubHead meta="real-world">Composing recipes</SubHead>
        <Frame label="Hostname + port · quantity stepper · range with sliders">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label" htmlFor="rc1">Server target</label>
              <div className="in-group">
                <input id="rc1" className="in-control" defaultValue="api.eidos.io" style={{flex:'1 1 auto'}}/>
                <span className="in-addon" style={{padding: 0, alignSelf:'stretch', width: 1, background:'var(--border)'}} aria-hidden="true"/>
                <input className="in-control" type="number" defaultValue="443" min="1" max="65535" style={{flex:'0 0 80px', textAlign:'center', fontVariantNumeric:'tabular-nums'}}/>
              </div>
              <div className="in-help" style={{marginTop: 6}}>Hostname + port, bound visually as one field</div>
            </div>
            <div>
              <label className="in-label" htmlFor="rc2">Quantity</label>
              <NumberInput id="rc2" defaultValue="3" min="0" stepper layout="split" style={{width: 160}}/>
              <div className="in-help" style={{marginTop: 6}}><code>layout="split"</code> — horizontal ± buttons when the value is the focal point</div>
            </div>
            <div>
              <label className="in-label" htmlFor="rc3">Min retries</label>
              <NumberInput id="rc3" defaultValue="0" min="0" max="10" stepper/>
            </div>
            <div>
              <label className="in-label" htmlFor="rc4">Max retries</label>
              <NumberInput id="rc4" defaultValue="3" min="0" max="10" stepper/>
            </div>
          </div>
        </Frame>

        {/* Accessibility */}
        <SubHead meta="a11y">Accessibility</SubHead>
        {/* Real keyboard map — named keys → the action the native control performs. */}
        <div className="surface" style={{padding: 18, marginTop: 12}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div style={{display:'grid', gap: 2}}>
            <KbdRow label="Step up / down by the configured step" keys={['↑', '↓']}/>
            <KbdRow label="Step by the larger Page increment" keys={['PgUp', 'PgDn']}/>
            <KbdRow label="Jump to min / max when bounds are set" keys={['Home', 'End']}/>
            <KbdRow label="Activate a focused stepper button" keys={['Enter', 'Space']}/>
            <KbdRow label="Move to the field, then to each stepper button" keys={['Tab']}/>
          </div>
          <div style={{color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.6, marginTop: 12}}>The field is fully usable by typing alone — the stepper buttons are an additive affordance, never the only path to a value.</div>
        </div>
        <div className="ds-grid cols-3" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6}}>Built on <code>&lt;input type="number"&gt;</code> with <code>inputmode="numeric"</code>, named by its <code>&lt;label&gt;</code> and exposing <code>min</code> / <code>max</code> / <code>step</code> so the range is announced. Each stepper button carries an <code>aria-label</code> (<em>Increase</em> / <em>Decrease</em>). The optional meter is a <code>role="progressbar"</code> with <code>aria-valuenow/min/max</code>, wired to the field via <code>aria-describedby</code>. Out-of-range entries flip <code>aria-invalid</code> and the clamp is announced through an <code>aria-live="polite"</code> status region.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6}}>The group paints a <code>--ring</code> outline on <code>:focus-within</code>; each stepper button shows its own ring when tabbed to. Invalid state swaps to <code>--ring-danger</code>. The native spinner is hidden in favour of the opt-in stepper. Affix text, hints, and the <code>danger</code> Alert all clear AA on the field surface.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6}}>Only the focus ring, hover, and the meter's width transition animate — all short token eases. Under <code>prefers-reduced-motion: reduce</code> the loading <Mono>Spinner</Mono> swaps rotation for a calm opacity pulse via <code>.ds-spin</code>.</div>
          </div>
        </div>

        {/* RTL */}
        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label="dir=&quot;rtl&quot; — affixes flip, stepper sits at the trailing edge, numerals stay LTR">
          <div dir="rtl" className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label">السعر (Price)</label>
              <NumberInput defaultValue="29.00" step="0.01" inputMode="decimal"
                prefix={<span className="in-addon text">USD</span>}
                suffix={<span className="in-addon text">/ شهر</span>}
              />
            </div>
            <div>
              <label className="in-label">عدد المثيلات (Replicas)</label>
              <NumberInput defaultValue="3" stepper min="1" max="99"/>
            </div>
            <div>
              <label className="in-label">الذاكرة (Memory)</label>
              <NumberInput defaultValue="512"
                suffix={
                  <select className="in-addon select" defaultValue="MB" aria-label="Unit">
                    <option>MB</option><option>GB</option>
                  </select>
                }
              />
            </div>
            <div>
              <label className="in-label">النسبة المئوية (Percentage)</label>
              <NumberInput defaultValue="15" min="0" max="100"
                suffix={<span className="in-addon text">%</span>}
                stepper
              />
            </div>
          </div>
        </Frame>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          Western digits stay LTR even in RTL flow — the W3C bidi algorithm treats <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>0–9</code> as weakly directional. The currency / unit affixes flip via logical properties; the stepper buttons land on the trailing edge automatically because the addon is the last child.
        </p>

        {/* Anatomy */}
        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">The same group + control + addon system as Input — number-specific bits called out</span></div>
          <div className="ds-frame-body" style={{padding: '64px 56px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative', width: 340}} aria-hidden="true">
                <NumberInput defaultValue="29.00" step="0.01" stepper
                  prefix={<span className="in-addon text">USD</span>}
                  suffix={<span className="in-addon text">/ mo</span>}
                />
                {/* Leader lines */}
                <span className="lead v" style={{top: -22, left: 28, height: 18}}/>
                <span className="lead v" style={{top: -22, left: '50%', height: 18}}/>
                <span className="lead v" style={{top: -22, right: 60, height: 18}}/>
                <span className="lead v" style={{bottom: -22, right: 18, height: 18}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                {/* Numbered pins overlaid */}
                <div className="pin" style={{top: -42, left: 28, transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>2</div>
                <div className="pin" style={{top: -42, right: 60, transform:'translateX(50%)'}}>3</div>
                <div className="pin" style={{bottom: -42, right: 18, transform:'translateX(50%)'}}>4</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>5</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Prefix.</b> Currency / unit / scheme. <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>.in-addon.text</code> for static, <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>.in-addon.select</code> for picker.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Control.</b> <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>{`type="number"`}</code> + <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>{`inputMode="numeric"`}</code>/<code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>{`"decimal"`}</code>.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Suffix.</b> Period (<em>/ mo</em>), unit (<em>GB</em>, <em>%</em>), or another picker.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Stepper.</b> Opt-in <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>.in-addon.stepper</code> wraps two buttons calling <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>input.stepUp() / stepDown()</code>.</span>
              <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Native arrows.</b> Hidden globally; never reach for them.</span>
            </div>
          </div>
        </div>

        {/* Decision matrix */}
        <SubHead meta="when to reach for what">When to use</SubHead>
        <Frame label="Pick the right primitive — Number Input vs Slider vs masked Input">
          <div className="ds-grid cols-3" style={{width:'100%'}}>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Number Input</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                The default for any quantitative value. Currency, percentages, ports, replicas, byte counts. Add a stepper when ±1 makes sense.
              </p>
            </div>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Slider</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Bounded ranges (0–100, brightness, volume) where the user is exploring rather than entering a precise value. Pair with a number input that stays in sync.
              </p>
            </div>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Masked Input</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Numeric values with a fixed format — credit cards, phone numbers, IBANs. Keep them as <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>type="text"</code> to preserve the mask.
              </p>
            </div>
          </div>
        </Frame>

        {/* Do / Don't */}
        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — use inputMode="decimal" for prices</div>
            <div className="body">
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Annual budget</label>
                <div className="in-group">
                  <span className="in-addon text">$</span>
                  <input className="in-control" type="text" inputMode="decimal" defaultValue="2,400.00" readOnly/>
                  <span className="in-addon text">USD</span>
                </div>
              </div>
            </div>
            <div className="note">Mobile keyboard shows digits + decimal separator. <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>numeric</code> is digits-only — wrong for currency.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — use Number Input for cards or phones</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Card number</label>
                <div className="in-group"><input className="in-control" type="number" defaultValue="4242424242424242" readOnly/></div>
              </div>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Phone</label>
                <div className="in-group"><input className="in-control" type="number" defaultValue="5551234567" readOnly/></div>
              </div>
            </div>
            <div className="note"><code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>type="number"</code> strips formatting, leading zeros, and parens. Use <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>text</code> + mask instead.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — add a stepper only when ±1 helps</div>
            <div className="body">
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Cluster nodes</label>
                <div className="in-group">
                  <input className="in-control" type="number" defaultValue="3" readOnly/>
                  <span className="in-addon stepper">
                    <button type="button" className="step" tabIndex={-1} aria-label="Increase"><Icons.chevronUp size={10}/></button>
                    <button type="button" className="step" tabIndex={-1} aria-label="Decrease"><Icons.chevronDown size={10}/></button>
                  </span>
                </div>
              </div>
            </div>
            <div className="note">Replicas (1–99), retry count, version bump — yes. Budget, port, decimal price — typing is faster than 70 clicks.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — rely on native browser spinners</div>
            <div className="body">
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Cluster nodes</label>
                <div className="in-group"><input className="in-control" type="number" defaultValue="3" readOnly style={{appearance:'auto', WebkitAppearance:'auto', MozAppearance:'auto'} as unknown as React.CSSProperties}/></div>
              </div>
            </div>
            <div className="note">Chunky, hover-only, hard to discover, and visually mismatched. Globally hidden — reach for our explicit stepper instead.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — constrain with min / max / step</div>
            <div className="body">
              <div className="in-field" style={{width: 240}}>
                <label className="in-label">Replicas</label>
                <div className="in-group"><input className="in-control" type="number" min={1} max={99} step={1} defaultValue="3" readOnly/></div>
                <div className="in-helprow"><span className="in-help">Min 1, max 99</span></div>
              </div>
            </div>
            <div className="note">Native attributes do free work: blocking out-of-range submission, snapping to step, keyboard ↑/↓ uses step. Show bounds in the helper line.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — format on every keystroke</div>
            <div className="body" style={{flexDirection:'column', gap: 6, alignItems:'flex-start'}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Amount</label>
                <div className="in-group"><input className="in-control" defaultValue="1,234" readOnly/></div>
              </div>
              <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>1234 → 1,234 mid-typing</span>
            </div>
            <div className="note">Reformatting as user types fights the cursor and creates surprise. Format on blur, or use a separate display element.</div>
          </div>
        </div>

        {/* 4. API REFERENCE */}
        <SubHead meta="NumberInputProps">API reference</SubHead>
        <AutoPropsTable component="NumberInput" label="<NumberInput />"/>
      </Section>
    );
  }
