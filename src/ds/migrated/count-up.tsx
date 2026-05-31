'use client';
// Eidos DS — Components / CountUp
// Number that ticks from 0 → target as it scrolls into view. Promoted from
// the legacy `Counter` atom — name aligns with industry vocabulary
// (CountUp.js, react-countup). Counter remains exported as an alias.
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, CountUp, Lede, Mono } from '@/ds/core';


  const USAGE_CODE = `import { CountUp } from "@/components/forge/count-up"

export function Demo() {
  return (
    <div className="stat">
      <span className="value"><CountUp to={142} suffix="%" /></span>
      <span className="caption">throughput</span>
    </div>
  )
}`;

export default function CountUpPage() {
  return (
    <Section id="count-up" title="Count up" desc="A monospace number that animates from 0 → target value as it scrolls into view. Used for hero stats, dashboard KPIs, marketing pages — anywhere a static number would feel inert.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('count-up')} ariaLabel="package manager"/>
      <Lede>Ships <Mono>&lt;CountUp/&gt;</Mono> (canonical) and <Mono>&lt;Counter/&gt;</Mono> (alias). Uses <Mono>IntersectionObserver</Mono> — animation fires once, when the element first enters the viewport.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <span style={{fontSize: 'var(--text-2xl)', fontWeight: 600, color:'var(--fg)'}}><CountUp to={142} suffix="%"/></span>
        <span style={{fontSize: 'var(--text-2xl)', fontWeight: 600, color:'var(--fg)'}}><CountUp to={1284}/></span>
      </Frame>

      <div className="ds-examples-rule" style={{ marginTop: 36, marginBottom: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="from · prefix · suffix · decimals">Formatting</SubHead>
      <Frame label="every knob" row code={`<CountUp to={4214} suffix=" / mo" />
<CountUp to={2.4} suffix="x" decimals={1} />
<CountUp to={9999} prefix="$" />
<CountUp to={98.6} suffix="%" decimals={1} />
<CountUp from={50} to={80} suffix="%" />`}>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><CountUp to={4214} suffix=" / mo"/></span>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><CountUp to={2.4} suffix="x" decimals={1}/></span>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><CountUp to={9999} prefix="$"/></span>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><CountUp to={98.6} suffix="%" decimals={1}/></span>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><CountUp from={50} to={80} suffix="%"/></span>
      </Frame>

      <SubHead meta="duration">Duration</SubHead>
      <Frame label="default 1200ms · slower for hero, faster for table" row code={`<CountUp to={1284} dur={600} />
<CountUp to={1284} dur={1200} />
<CountUp to={1284} dur={2400} />`}>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><span className="t-mono-label" style={{marginInlineEnd: 8}}>fast</span><CountUp to={1284} dur={600}/></span>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><span className="t-mono-label" style={{marginInlineEnd: 8}}>default</span><CountUp to={1284} dur={1200}/></span>
        <span style={{fontSize: 'var(--text-xl)', color:'var(--fg)'}}><span className="t-mono-label" style={{marginInlineEnd: 8}}>slow</span><CountUp to={1284} dur={2400}/></span>
      </Frame>

      <SubHead meta="in context">Hero stat row composition</SubHead>
      <Frame label="four metrics composed of CountUp + caption">
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0, 1fr))', gap: 12}}>
          {[
            { v: 248, suf: '',   cap: 'Services' },
            { v: 32,  suf: '',   cap: 'Active agents' },
            { v: 1284,suf: '',   cap: 'Deploys / week' },
            { v: 98.6,suf: '%',  cap: 'P0 SLA', dec: 1 },
          ].map((s,i) => (
            <div key={i} style={{padding:'18px 18px 14px', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', background:'var(--surface)'}}>
              <div style={{fontSize: 'var(--text-3xl)', fontWeight: 600, color:'var(--fg)', lineHeight: 1}}>
                <CountUp to={s.v} suffix={s.suf} decimals={s.dec || 0}/>
              </div>
              <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-faint)', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:'var(--font-mono)', marginTop: 10}}>{s.cap}</div>
            </div>
          ))}
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>CountUp renders display text, not a control — there is no focus stop and nothing to operate. It sits inside whatever stat tile or heading hosts it and never intercepts tab order.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The tick is purely visual; the final formatted value (with its prefix/suffix) is what reads. Because the animation runs once on first view, SRs encounter a stable number — pair the value with its caption ("142% throughput") so it announces with meaning, not as a bare figure.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The number inherits its surrounding colour (typically --fg on the page or card surface), keeping it above AA; the digits use tabular numerals so the count does not jitter in width as it ticks.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The 0→target ramp fires once via IntersectionObserver, never loops, and never re-triggers on prop change. Under <Mono>prefers-reduced-motion</Mono>, CountUp's own check in JS collapses the duration to zero so the final value paints immediately with no tick.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the number itself never reverses; only the block aligns to the start'} center code={`<div dir="rtl"><CountUp to={142} suffix="%"/></div>`} lang="tsx">
        <div dir="rtl" style={{display:'flex', flexWrap:'wrap', gap: 24, alignItems:'center'}}>
          <span style={{fontSize: 'var(--text-2xl)', fontWeight: 600, color:'var(--fg)'}}><CountUp to={142} suffix="%"/></span>
          <span style={{fontSize: 'var(--text-2xl)', fontWeight: 600, color:'var(--fg)'}}><CountUp to={1284}/></span>
        </div>
      </Frame>
      <Lede>The digits do not mirror. Per the Unicode bidi algorithm a run of numerals always renders left-to-right, so <Mono>1284</Mono> reads <Mono>1284</Mono> in both directions — only the surrounding label and the block's alignment move to the start edge. A trailing <Mono>suffix</Mono> like <Mono>%</Mono> stays attached to the number; a <Mono>prefix</Mono> sign sits before it as written. Nothing about the count animation is direction-aware.</Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 600, color: 'var(--fg)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', display: 'inline-flex', alignItems: 'baseline', gap: 1 }}>
                <span style={{ fontSize: 'var(--text-xl)', color: 'var(--fg-muted)' }}>$</span>
                <CountUp to={9999} prefix="" />
                <span style={{ fontSize: 'var(--text-lg)', color: 'var(--fg-muted)' }}> / mo</span>
              </span>
              {/* pin 1 — prefix */}
              <span className="lead v" style={{ top: -28, left: 2, height: 22 }} />
              <div className="pin" style={{ top: -50, left: 2, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — animated value */}
              <span className="lead v" style={{ top: -28, left: '42%', height: 22 }} />
              <div className="pin" style={{ top: -50, left: '42%', transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — suffix */}
              <span className="lead v" style={{ bottom: -28, right: 4, height: 22 }} />
              <div className="pin" style={{ bottom: -50, right: 4, transform: 'translateX(50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Prefix.</b> Static string rendered before the animated figure (e.g. <Mono>"$"</Mono>). Does not participate in the count animation — it appears immediately at full opacity alongside the ticking number.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Animated value.</b> Tabular mono digits so character widths stay fixed and the layout never jitters as the count ticks. Eases from 0 to <Mono>to</Mono> over <Mono>dur</Mono> ms via <Mono>IntersectionObserver</Mono>; fires once on first viewport entry. Under <Mono>prefers-reduced-motion</Mono> the duration collapses to 0 — the final value paints immediately.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Suffix.</b> Static string appended after the figure (e.g. <Mono>"%"</Mono>, <Mono>" / mo"</Mono>). Like prefix, it is non-animated and stays stable throughout the count. Both prefix and suffix inherit the surrounding text size and weight from the host element.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — animate hero stats</div>
          <div className="body"><span style={{fontSize: 'var(--text-3xl)', fontWeight: 600, color:'var(--fg)'}}><CountUp to={2487}/></span></div>
          <div className="note">A big number that arrives static reads like an asset. The 1.2s tick says "this is fresh data," and it's free.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — animate every cell in a dense table</div>
          <div className="body">
            <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric:'tabular-nums', color:'var(--fg-muted)'}}>1,284 deploys</div>
            <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric:'tabular-nums', color:'var(--fg-muted)'}}>98.6% SLA</div>
            <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric:'tabular-nums', color:'var(--fg-muted)'}}>4.2% CFR</div>
          </div>
          <div className="note">Reserve CountUp for hero / top-of-page. In tables, motion is noise — use plain mono numerics.</div>
        </div>
      </div>

      <SubHead meta="CountUpProps">API reference</SubHead>
      <AutoPropsTable component="CountUp" label="<CountUp />"/>
      <p style={{fontSize: 'var(--text-base)', color:'var(--fg-faint)', marginTop: 10, lineHeight: 1.6}}>The legacy <Mono>&lt;Counter/&gt;</Mono> name still works — it now points at this same component.</p>
    </Section>
  );
}
