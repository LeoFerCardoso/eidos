'use client';
// Eidos DS — Components / Slider.
// Inspired by shadcn/ui's Slider (Radix). Single value or range, sizes,
// vertical orientation, marks, paired with inputs, RTL, and invalid state.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono } from '@/ds/core';



  const USAGE_CODE = `import { Slider } from "@/components/forge/slider"

export function Demo() {
  const [value, setValue] = React.useState(50)
  return (
    <Slider value={value} onChange={setValue} min={0} max={100} step={1} label="Volume"/>
  )
}`;

  // ---- Slider primitive --------------------------------------------------
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const snap  = (v, st) => Math.round(v / st) * st;

  const Slider = (props) => {
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const st  = props.step ?? 1;
    const orientation = props.orientation || 'horizontal';
    const size = props.size || 'md';
    const values = Array.isArray(props.value) ? props.value : [props.value ?? min];
    const onChange = props.onChange || (() => {});
    const trackRef = React.useRef(null);
    const [drag, setDrag] = React.useState(-1);
    const isVert = orientation === 'vertical';
    const cls = ['sl']
      .concat(size !== 'md' ? [size] : [])
      .concat(isVert ? ['vertical'] : [])
      .concat(props.disabled ? ['is-disabled'] : [])
      .concat(props.invalid ? ['is-invalid'] : [])
      .join(' ');

    const pct = (v) => ((v - min) / (max - min)) * 100;

    const valueAtPos = (clientX, clientY) => {
      const rect = trackRef.current.getBoundingClientRect();
      let raw;
      if (isVert) {
        raw = 1 - (clientY - rect.top) / rect.height;
      } else {
        const isRtl = getComputedStyle(trackRef.current).direction === 'rtl';
        raw = (clientX - rect.left) / rect.width;
        if (isRtl) raw = 1 - raw;
      }
      raw = clamp(raw, 0, 1);
      return clamp(snap(min + raw * (max - min), st), min, max);
    };

    const closestThumb = (v) => {
      let idx = 0, best = Infinity;
      values.forEach((tv, i) => {
        const d = Math.abs(tv - v);
        if (d < best) { best = d; idx = i; }
      });
      return idx;
    };

    const updateAt = (idx, v) => {
      const next = values.slice();
      next[idx] = v;
      if (values.length === 2) next.sort((a, b) => a - b);
      onChange(values.length === 1 ? next[0] : next);
    };

    const onPointerDown = (e) => {
      if (props.disabled) return;
      const v = valueAtPos(e.clientX, e.clientY);
      const idx = closestThumb(v);
      setDrag(idx);
      updateAt(idx, v);
      e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (drag < 0) return;
      const v = valueAtPos(e.clientX, e.clientY);
      updateAt(drag, v);
    };
    const onPointerUp = () => setDrag(-1);

    const onKey = (idx, e) => {
      const cur = values[idx];
      const big = (max - min) * 0.10;
      let next = cur;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = cur + st;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = cur - st;
      else if (e.key === 'PageUp') next = cur + big;
      else if (e.key === 'PageDown') next = cur - big;
      else if (e.key === 'Home') next = min;
      else if (e.key === 'End') next = max;
      else return;
      e.preventDefault();
      updateAt(idx, clamp(snap(next, st), min, max));
    };

    const lo = values.length === 2 ? Math.min(...values) : min;
    const hi = values.length === 2 ? Math.max(...values) : values[0];
    const rangeStyle = isVert
      ? { bottom: `${pct(lo)}%`, top: `${100 - pct(hi)}%` }
      : { insetInlineStart: `${pct(lo)}%`, insetInlineEnd: `${100 - pct(hi)}%` };

    return (
      <div
        className={cls}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-disabled={props.disabled || undefined}
        aria-invalid={props.invalid || undefined}
      >
        <div ref={trackRef} className="sl-track">
          <div className="sl-range" style={rangeStyle}/>
        </div>
        {values.map((v, i) => {
          const style = isVert
            ? { bottom: `${pct(v)}%`, left: '50%' }
            : { insetInlineStart: `${pct(v)}%`, top: '50%' };
          return (
            <span
              key={i}
              className={'sl-thumb' + (drag === i ? ' is-dragging' : '')}
              role="slider"
              tabIndex={props.disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={v}
              aria-label={props.label || (values.length === 2 ? (i === 0 ? 'Lower' : 'Upper') : 'Value')}
              aria-orientation={orientation}
              onKeyDown={(e) => onKey(i, e)}
              style={style}
            />
          );
        })}
      </div>
    );
  };

  // helper — small label row above a slider. Eyebrow uses the canonical
  // .t-mono-label class; the value is mono with tabular-nums so digits stay
  // column-aligned as the thumb moves.
  const LabelRow = ({ children, value }) => (
    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBlockEnd: 12}}>
      <span className="t-mono-label">{children}</span>
      <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-base)', fontWeight:600, color:'var(--fg)', fontVariantNumeric:'tabular-nums'}}>{value}</span>
    </div>
  );

  // small mono read-out used in the vertical column heads (tabular-nums so the
  // number doesn't jiggle as it changes).
  const Readout = ({ children }) => (
    <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-base)', fontWeight:600, color:'var(--fg)', fontVariantNumeric:'tabular-nums'}}>{children}</span>
  );

  // ---- demos ------------------------------------------------------------
export default function Page() {
    const [v1, set1]       = React.useState(40);
    const [budget, setBud] = React.useState([1500, 4500]);
    const [v3, set3]       = React.useState(60);
    const [v4, set4]       = React.useState(50);
    const [v5, set5]       = React.useState(50);
    const [pct, setPct]    = React.useState(50);
    const [vol, setVol]    = React.useState(35);
    const [bri, setBri]    = React.useState(60);
    const [pad, setPad]    = React.useState(16);
    const [count, setCount]= React.useState(4);
    const [vRtl, setVRtl]  = React.useState(75);

    return (
      <Section
        id="slider"
        title="Slider"
        desc='Pick a value or range along a continuous track — drag the thumb, click the track, or use the keyboard. The filled segment shows the current value at a glance.'
      >
        {/* 1. INSTALLATION */}
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('slider')} ariaLabel="package manager"/>
        <Lede>
          Ships <Mono>slider.tsx</Mono> — a custom pointer + keyboard widget (the thumb is <Mono>role="slider"</Mono>), no Radix runtime. Single value or range arrays, vertical orientation, keyboard nav, and RTL all included.
        </Lede>

        {/* 2. USAGE */}
        <SubHead meta="hello world">Usage</SubHead>
        <Lede>Pair with a number label or input when the exact value matters. For a small integer where precision is the goal, the Stepper is a better fit.</Lede>
        <Frame label="basic" code={USAGE_CODE}>
          <div style={{padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <LabelRow value={v1}>Volume</LabelRow>
            <Slider value={v1} onChange={set1} label="Volume"/>
          </div>
        </Frame>

        {/* 3. EXAMPLES */}
        <div style={{
          marginBlockStart: 36, marginBlockEnd: 6,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--fg-faint)',
          }}>Examples</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        {/* Single value */}
        <SubHead meta="basic">Single value</SubHead>
        <Frame
          label="one thumb · click track to jump · arrows nudge by step"
          code={`<Slider value={vol} onChange={setVol} label="Volume"/>`}
        >
          <div style={{padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <LabelRow value={v1}>Volume</LabelRow>
            <Slider value={v1} onChange={set1} label="Volume"/>
          </div>
        </Frame>
        <Lede>
          Click anywhere on the track to jump the thumb. <Mono>↑/→</Mono> and <Mono>↓/←</Mono> nudge by <Mono>step</Mono>; <Mono>PageUp/Down</Mono> jump 10%; <Mono>Home/End</Mono> snap to the ends.
        </Lede>

        {/* Range */}
        <SubHead meta="two thumbs">Range</SubHead>
        <Frame
          label="pass an array of two values · order is preserved automatically"
          code={`<Slider
  value={budget}        // [1500, 4500]
  onChange={setBudget}
  min={0} max={10000} step={100}
  label="Budget"
/>`}
        >
          <div style={{padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <LabelRow value={`$${budget[0].toLocaleString()} – $${budget[1].toLocaleString()}`}>Budget</LabelRow>
            <Slider value={budget} onChange={setBud} min={0} max={10000} step={100}/>
          </div>
        </Frame>
        <Lede>
          Drag past the other thumb and the values swap so they always render ascending. Each thumb is independently focusable — the keyboard cycles through them.
        </Lede>

        {/* Sizes */}
        <SubHead meta="sm · md · lg">Sizes</SubHead>
        <Frame
          label="thumb 12 / 16 / 20 px · track 4 / 6 / 8 px"
          code={`<Slider size="sm" value={v} onChange={setV}/>
<Slider           value={v} onChange={setV}/>  // md
<Slider size="lg" value={v} onChange={setV}/>`}
        >
          <div style={{display:'grid', gap: 28, padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <div><LabelRow value={v3}>Small</LabelRow><Slider size="sm" value={v3} onChange={set3}/></div>
            <div><LabelRow value={v4}>Default</LabelRow><Slider value={v4} onChange={set4}/></div>
            <div><LabelRow value={v5}>Large</LabelRow><Slider size="lg" value={v5} onChange={set5}/></div>
          </div>
        </Frame>
        <Lede>
          Use <Mono>sm</Mono> in dense surfaces (toolbars, table-cell editors), <Mono>lg</Mono> in touch-first or media-control surfaces. Default <Mono>md</Mono> covers the rest.
        </Lede>

        {/* States */}
        <SubHead meta="states">States</SubHead>
        <Frame
          label="default · disabled · invalid"
          code={`<Slider value={50} onChange={setV}/>
<Slider value={30} disabled/>
<Slider value={92} invalid/>`}
        >
          <div style={{display:'grid', gap: 24, padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <div><LabelRow value="50">Default</LabelRow><Slider value={50} onChange={()=>{}}/></div>
            <div><LabelRow value="30">Disabled</LabelRow><Slider value={30} disabled/></div>
            <div>
              <LabelRow value="92">Invalid</LabelRow>
              <Slider value={92} onChange={()=>{}} invalid/>
              <div style={{fontSize:'var(--text-base)', lineHeight:1.5, color:'var(--danger)', marginBlockStart: 8}}>Over the limit (max 80).</div>
            </div>
          </div>
        </Frame>
        <Lede>
          Disabled keeps the value visible but unreachable. Invalid tints the filled track and the thumb border <Mono>--danger</Mono> so the bad value is unmistakable, with a helper line below explaining the constraint.
        </Lede>

        {/* Marks */}
        <SubHead meta="ticks">With marks</SubHead>
        <Frame
          label="thumb snaps to every 25% · marks below show the discrete stops"
          code={`{/* step makes the thumb snap; the tick row is plain markup */}
<Slider value={pct} onChange={setPct} min={0} max={100} step={25}/>
<div className="sl-marks">
  {[0, 25, 50, 75, 100].map((m) => (
    <span key={m} className={"sl-mark" + (m <= pct ? " active" : "")}
          style={{ insetInlineStart: \`\${m}%\` }}>
      <span/><span>{m}</span>
    </span>
  ))}
</div>`}
        >
          <div style={{padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <Slider value={pct} onChange={setPct} min={0} max={100} step={25}/>
            <div className="sl-marks">
              {[0,25,50,75,100].map(m => (
                <span key={m} className={'sl-mark' + (m <= pct ? ' active' : '')} style={{insetInlineStart: `${m}%`}}>
                  <span/>
                  <span>{m}</span>
                </span>
              ))}
            </div>
          </div>
        </Frame>
        <Lede>
          Use marks when only specific values are meaningful (every 25%, every quarter-second, every replica count). Pair with <Mono>step</Mono> so the thumb snaps to those tick positions instead of landing between them.
        </Lede>

        {/* Vertical */}
        <SubHead meta="orientation">Vertical</SubHead>
        <Frame
          label="orientation=&quot;vertical&quot; · for mixers, brightness panels, console UIs"
          code={`<Slider
  orientation="vertical"
  value={vol}
  onChange={setVol}
  label="Volume"
/>`}
        >
          <div style={{display:'flex', gap: 48, alignItems:'flex-end', padding:'24px', justifyContent:'center', width:'100%'}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 12}}>
              <Readout>{vol}</Readout>
              <Slider orientation="vertical" value={vol} onChange={setVol} label="Volume"/>
              <span className="t-mono-label">Volume</span>
            </div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 12}}>
              <Readout>{bri}</Readout>
              <Slider orientation="vertical" value={bri} onChange={setBri} label="Brightness"/>
              <span className="t-mono-label">Brightness</span>
            </div>
          </div>
        </Frame>
        <Lede>
          Up arrow always increases regardless of orientation — keyboard rules don't flip. Visual layout flows bottom-to-top so larger values sit higher on screen, matching the user's mental model.
        </Lede>

        {/* With number input */}
        <SubHead meta="composition">With number input</SubHead>
        <Frame
          label="shared state · drag updates the field · type updates the thumb"
          code={`<Slider value={pad} onChange={setPad} min={0} max={48} step={2} label="Padding"/>
<Input type="number" value={pad} onChange={e => setPad(+e.target.value)}
       min={0} max={48} step={2} suffix="px"/>`}
        >
          <div style={{padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <div style={{display:'flex', alignItems:'center', gap: 16}}>
              <div style={{flex: 1}}>
                <div className="t-mono-label" style={{marginBlockEnd: 10}}>Padding</div>
                <Slider value={pad} onChange={setPad} min={0} max={48} step={2} label="Padding"/>
              </div>
              <div className="in-field" style={{width: 96}}>
                <div className="in-group sm">
                  <input type="number" className="in-control" value={pad} onChange={e => setPad(Math.max(0, Math.min(48, +e.target.value || 0)))} min={0} max={48} step={2}/>
                  <span className="in-addon text">px</span>
                </div>
              </div>
            </div>
          </div>
        </Frame>
        <Lede>
          Pair the slider with a <a href="/number-input">Number Input</a> when the user needs to type an exact value. They share state — the slider visualizes, the input edits.
        </Lede>

        {/* Stepper */}
        <SubHead meta="composition">As a stepper</SubHead>
        <Frame
          label="step=1 with marks · for small integer ranges (1–10, 1–7)"
          code={`{/* step=1 snaps to integers; the tick row is plain markup */}
<Slider value={count} onChange={setCount} min={1} max={10} step={1} label="Replicas"/>
<div className="sl-marks">
  {[1,2,3,4,5,6,7,8,9,10].map((m) => (
    <span key={m} className={"sl-mark" + (m <= count ? " active" : "")}
          style={{ insetInlineStart: \`\${((m - 1) / 9) * 100}%\` }}>
      <span/>
    </span>
  ))}
</div>`}
        >
          <div style={{padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <LabelRow value={count}>Replicas</LabelRow>
            <Slider value={count} onChange={setCount} min={1} max={10} step={1} label="Replicas"/>
            <div className="sl-marks" style={{marginBlockStart: 8}}>
              {[1,2,3,4,5,6,7,8,9,10].map(m => (
                <span key={m} className={'sl-mark' + (m <= count ? ' active' : '')} style={{insetInlineStart: `${((m-1)/9)*100}%`}}>
                  <span/>
                </span>
              ))}
            </div>
          </div>
        </Frame>
        <Lede>
          For small integer ranges, set <Mono>step=1</Mono> and render a tick at every position. Reads as a continuous control but lands on integers only — no <Mono>3.4732</Mono>.
        </Lede>

        {/* Accessibility */}
        <SubHead meta="a11y">Accessibility</SubHead>
        <Lede up>Each thumb is a focusable <Mono>role="slider"</Mono> widget. The mapping below is exactly what <Mono>slider.tsx</Mono> ships — no aspirational behaviour.</Lede>
        <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
          {/* Keyboard — real key map (named keys → actions) */}
          <div className="surface" style={{padding: 18}}>
            <div className="t-mono-label" style={{marginBlockEnd: 12}}>Keyboard · focused thumb</div>
            <dl style={{display:'grid', gridTemplateColumns:'auto 1fr', columnGap: 16, rowGap: 8, margin: 0, alignItems:'baseline'}}>
              <dt style={{margin:0}}><Mono>← / ↓</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.5}}>Decrease by one <Mono>step</Mono></dd>
              <dt style={{margin:0}}><Mono>→ / ↑</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.5}}>Increase by one <Mono>step</Mono> (↑ always increases, both orientations)</dd>
              <dt style={{margin:0}}><Mono>PageDn / PageUp</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.5}}>Move by 10% of the range</dd>
              <dt style={{margin:0}}><Mono>Home / End</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.5}}>Jump to <Mono>min</Mono> / <Mono>max</Mono></dd>
              <dt style={{margin:0}}><Mono>Tab</Mono></dt><dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.5}}>Move to the next thumb (each is in the tab order)</dd>
            </dl>
          </div>
          {/* Screen reader — true to the shipped ARIA */}
          <div className="surface" style={{padding: 18}}>
            <div className="t-mono-label" style={{marginBlockEnd: 12}}>Screen reader · ARIA</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every thumb carries <Mono>role="slider"</Mono> with <Mono>aria-valuemin</Mono>, <Mono>aria-valuemax</Mono>, a live <Mono>aria-valuenow</Mono>, and <Mono>aria-orientation</Mono>. Name the control with the <Mono>label</Mono> prop (→ <Mono>aria-label</Mono>); on a two-thumb range the thumbs announce as <Mono>Lower</Mono> and <Mono>Upper</Mono>. Because <Mono>aria-valuenow</Mono> reads as a bare number, mirror any units in a visible read-out next to the track.</div>
          </div>
          {/* Focus & contrast */}
          <div className="surface" style={{padding: 18}}>
            <div className="t-mono-label" style={{marginBlockEnd: 12}}>Focus &amp; contrast</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The focused thumb shows the ember focus ring via <Mono>:focus-visible</Mono> (<Mono>--ring</Mono>; <Mono>--ring-danger</Mono> when <Mono>invalid</Mono>) — never <Mono>outline:none</Mono>. The filled segment, track, and thumb border each clear AA non-text contrast (3:1) in both themes; the value is always echoed as a number or label, never by fill position alone.</div>
          </div>
          {/* Motion */}
          <div className="surface" style={{padding: 18}}>
            <div className="t-mono-label" style={{marginBlockEnd: 12}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The thumb follows the pointer with no easing. The only animation is the thumb&apos;s spring scale on hover/active plus a brief fill ease on keyboard steps — both zeroed under <Mono>prefers-reduced-motion: reduce</Mono>, so the fill and thumb snap straight to the new value.</div>
          </div>
        </div>

        {/* RTL */}
        <SubHead meta="RTL · العربية">Right-to-left</SubHead>
        <Frame
          label='dir="rtl" — track fills from the right, drag direction normalised'
          code={`<div dir="rtl">
  <Slider value={vol} onChange={setVol} label="Volume"/>
</div>`}
        >
          <div dir="rtl" style={{padding:'20px 24px', width:'100%', maxWidth: 520}}>
            <LabelRow value={vRtl}>مستوى الصوت</LabelRow>
            <Slider value={vRtl} onChange={setVRtl} label="Volume"/>
          </div>
        </Frame>
        <Lede>
          Under <Mono>dir="rtl"</Mono>, the filled track grows from the trailing edge (visually right). Click position is normalised so dragging "forward" — toward higher values — always increases the value. Arrow keys are direction-agnostic: <Mono>↑</Mono> always increases.
        </Lede>

        {/* Anatomy */}
        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">Anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 96px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div
                aria-hidden="true"
                style={{position:'relative', width:'100%', maxWidth: 460, pointerEvents:'none', userSelect:'none'}}
              >
                {/* Static label + value row */}
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBlockEnd: 12, position:'relative'}}>
                  <span className="t-mono-label">Volume</span>
                  <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-base)', fontWeight:600, color:'var(--fg)', fontVariantNumeric:'tabular-nums'}}>60</span>
                </div>
                {/* Static slider markup — no React state, no events */}
                <div className="sl">
                  <div className="sl-track">
                    <div className="sl-range" style={{insetInlineStart: 0, insetInlineEnd: '40%'}}/>
                  </div>
                  <span className="sl-thumb" style={{insetInlineStart: '60%', top: '50%'}}/>
                </div>
                {/* Leader lines (dashed) — connect each pin to its anchor */}
                {/* 1 — Track (trailing empty segment, around 85%) */}
                <span style={{position:'absolute', insetBlockStart: 32, insetInlineStart:'85%', width: 1, height: 36, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
                {/* 2 — Range (filled segment, around 28%) */}
                <span style={{position:'absolute', insetBlockStart: 32, insetInlineStart:'28%', width: 1, height: 36, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
                {/* 3 — Thumb (60%) */}
                <span style={{position:'absolute', insetBlockStart: 38, insetInlineStart:'60%', width: 1, height: 30, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
                {/* 4 — Value display (top, trailing edge) */}
                <span style={{position:'absolute', insetBlockStart: -28, insetInlineEnd: 14, width: 1, height: 22, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
                {/* Pins — comfortably offset from the component */}
                <div className="pin" style={{insetBlockStart: 76, insetInlineStart:'85%', transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{insetBlockStart: 76, insetInlineStart:'28%', transform:'translateX(-50%)'}}>2</div>
                <div className="pin" style={{insetBlockStart: 76, insetInlineStart:'60%', transform:'translateX(-50%)'}}>3</div>
                <div className="pin" style={{insetBlockStart: -52, insetInlineEnd: 6}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'72px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Track.</b> The full extent of the value range. Click anywhere on it to jump the closest thumb to that point.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Range.</b> The filled segment. Visualises the current value, or for a two-thumb slider, the selected interval.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Thumb.</b> The draggable handle. <code style={{fontFamily:'var(--font-mono)'}}>role="slider"</code> with <code style={{fontFamily:'var(--font-mono)'}}>aria-valuemin / max / now</code>. Focusable — arrow keys nudge by <code style={{fontFamily:'var(--font-mono)'}}>step</code>.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Value display</b> (optional). A label, paired Input, or marks. The slider alone shows shape, not the exact number.</span>
            </div>
          </div>
        </div>

        {/* When to use */}
        <SubHead meta="when to use">Slider vs Number Input</SubHead>
        <div className="dd-grid">
          <div className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBlockEnd: 6}}>Slider</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginBlockEnd: 8}}>
              Bounded range, exact value is secondary, the user wants a feel for "where am I on the spectrum". Volume, brightness, opacity, weight, padding.
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Pair with a label or input when precision matters.</div>
          </div>
          <div className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBlockEnd: 6}}>Number Input</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginBlockEnd: 8}}>
              Precise value, unbounded or wide range, typed entry is faster than dragging. Price, file size, line height, custom dimensions.
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Combine with a slider for both speed and precision.</div>
          </div>
        </div>

        {/* Do/Don't */}
        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — show the current value alongside</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, width:'100%'}}>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                <span className="t-mono-label">Volume</span>
                <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-base)', fontWeight:600, color:'var(--fg)', fontVariantNumeric:'tabular-nums'}}>72</span>
              </div>
              <Slider value={72} onChange={()=>{}} label="Volume"/>
            </div>
            <div className="note">A slider visualises shape, not numbers. Always show the current value as a label, in a paired Input, or via marks — otherwise the user can't tell <em>72</em> from <em>74</em>.</div>
          </div>

          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — use a slider for an unbounded range</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, width:'100%'}}>
              <div className="t-mono-label">Custom budget</div>
              <Slider value={500} onChange={()=>{}} min={0} max={10000} label="Custom budget"/>
            </div>
            <div className="note">When the user can plausibly enter any value across orders of magnitude (price, file size), a Number Input is faster and more precise. Use a slider only for a bounded, scannable range.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — match step to the data's resolution</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, width:'100%'}}>
              <div className="t-mono-label">Replicas (1–10)</div>
              <Slider value={4} onChange={()=>{}} min={1} max={10} step={1} label="Replicas"/>
            </div>
            <div className="note">For integer counts, use <Mono>step=1</Mono>. For percent-only, <Mono>step=5</Mono>. The thumb snaps to meaningful values instead of producing fractional noise.</div>
          </div>

          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — split a binary choice into a slider</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, width:'100%'}}>
              <div className="t-mono-label">Notifications · off / on</div>
              <Slider value={1} onChange={()=>{}} min={0} max={1} step={1} label="Notifications"/>
            </div>
            <div className="note">Two-state controls are <a href="/switch">Switch</a>'s job. A slider with two stops looks like a continuous range and confuses everyone.</div>
          </div>
        </div>

        {/* 4. API REFERENCE */}
        <SubHead meta="SliderProps">API reference</SubHead>
        <AutoPropsTable component="Slider" label="<Slider />"/>
      </Section>
    );
  }
