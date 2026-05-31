'use client';
// Eidos DS — Components / Pill
// A pill is a small inline status label that declares the current condition of
// one thing: healthy, deploying, degraded. Distinct from Chip (attribute token)
// and Badge (count marker).
import React from 'react';
import { Icons, Pill, TierBadge, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono } from '@/ds/core';


  const USAGE_CODE = `import { Pill } from "@eidos/ui"

export function Demo() {
  return (
    <div className="flex gap-2">
      <Pill tone="success" dot>healthy</Pill>
      <Pill tone="ember" live>deploying</Pill>
    </div>
  )
}`;

  const muted = { color: 'var(--fg)' };
  // One shared ember link treatment — keeps the underline tint identical across
  // every cross-reference on the page (Chip / Badge / Status / Chip page).
  const emberLink: React.CSSProperties = {
    color: 'var(--ember)',
    textDecoration: 'underline',
    textDecorationColor: 'color-mix(in srgb, var(--ember) 40%, transparent)',
  };

export default function Pills() {
  const [removable, setRemovable] = React.useState(['branch:main', 'region:us-east', 'status:healthy']);

  return (
    <Section
      id="pills"
      num="09"
      title="Pill"
      desc="A small inline status label that declares what state one thing is in — healthy, deploying, degraded. Set in Geist Mono; toned by verdict. Distinct from Chip (attribute) and Badge (count)."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('pill')} ariaLabel="package manager"/>
      <Lede>
        Part of the inline-label family — see also{' '}
        <a href="/chip" style={emberLink}>Chip</a>
        {' '}(versions, deltas, removable filters) and{' '}
        <a href="/badges" style={emberLink}>Badge</a>
        {' '}(counts: inbox unread, PRs awaiting review).
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Use a pill to communicate a current state — "is it healthy, deploying, queued, down?" One short word, one dot. If you need two words, you need an alert.</Lede>
      <Frame label="status pill · live pulse" row code={USAGE_CODE}>
        <Pill tone="success" dot>healthy</Pill>
        <Pill tone="ember" live>deploying</Pill>
      </Frame>

      {/* 3. EXAMPLES */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* Tones — base palette */}
      <SubHead meta="6 base tones">Pill tones</SubHead>
      <Frame label="base tones · ember · success · warning · danger · ice · neutral" row code={`<Pill tone="ember" dot>live</Pill>
<Pill tone="success" dot>healthy</Pill>
<Pill tone="warning" dot>degraded</Pill>
<Pill tone="danger" dot>down</Pill>
<Pill tone="ice" dot>queued</Pill>
<Pill dot>idle</Pill>`}>
        <Pill tone="ember" dot>live</Pill>
        <Pill tone="success" dot>healthy</Pill>
        <Pill tone="warning" dot>degraded</Pill>
        <Pill tone="danger" dot>down</Pill>
        <Pill tone="ice" dot>queued</Pill>
        <Pill dot>idle</Pill>
      </Frame>
      <Lede>
        These six base tones are the raw palette — pick the verdict colour by hand. Tone is the only thing carrying meaning here — read the <a href="/status" style={emberLink}>Status &amp; semantics</a> table for which tone says what. For a fixed vocabulary, reach for a <b style={muted}>semantic tone</b> below rather than re-deriving a hue every time.
      </Lede>

      {/* Tones — semantic families */}
      <SubHead meta="23 semantic tones">Semantic tones</SubHead>
      <Lede>
        On top of the base palette, <Mono>tone</Mono> accepts four <b style={muted}>semantic families</b> with the meaning baked in — so the same incident severity or run state renders identically everywhere, instead of each team picking its own ember-or-danger. Each family maps to its own role token (<Mono>--severity-*</Mono>, <Mono>--health-*</Mono>, <Mono>--status-*</Mono>, <Mono>--risk-*</Mono>).
      </Lede>
      <Frame label="severity · incident triage (P0–P3)" row code={`<Pill tone="severity-p0" dot>P0 · critical</Pill>
<Pill tone="severity-p1" dot>P1 · high</Pill>
<Pill tone="severity-p2" dot>P2 · medium</Pill>
<Pill tone="severity-p3" dot>P3 · low</Pill>`}>
        <Pill tone="severity-p0" dot>P0 · critical</Pill>
        <Pill tone="severity-p1" dot>P1 · high</Pill>
        <Pill tone="severity-p2" dot>P2 · medium</Pill>
        <Pill tone="severity-p3" dot>P3 · low</Pill>
      </Frame>
      <Frame label="health · service uptime" row code={`<Pill tone="health-up" dot>healthy</Pill>
<Pill tone="health-degraded" dot>degraded</Pill>
<Pill tone="health-down" dot>down</Pill>
<Pill tone="health-unknown" dot>unknown</Pill>`}>
        <Pill tone="health-up" dot>healthy</Pill>
        <Pill tone="health-degraded" dot>degraded</Pill>
        <Pill tone="health-down" dot>down</Pill>
        <Pill tone="health-unknown" dot>unknown</Pill>
      </Frame>
      <Frame label="status · run / pipeline step" row code={`<Pill tone="status-pending" dot>pending</Pill>
<Pill tone="status-running" live>running</Pill>
<Pill tone="status-done" dot>done</Pill>
<Pill tone="status-error" dot>error</Pill>
<Pill tone="status-skipped" dot>skipped</Pill>`}>
        <Pill tone="status-pending" dot>pending</Pill>
        <Pill tone="status-running" live>running</Pill>
        <Pill tone="status-done" dot>done</Pill>
        <Pill tone="status-error" dot>error</Pill>
        <Pill tone="status-skipped" dot>skipped</Pill>
      </Frame>
      <Frame label="risk · change risk score" row code={`<Pill tone="risk-low" dot>low</Pill>
<Pill tone="risk-med" dot>medium</Pill>
<Pill tone="risk-high" dot>high</Pill>
<Pill tone="risk-crit" dot>critical</Pill>`}>
        <Pill tone="risk-low" dot>low</Pill>
        <Pill tone="risk-med" dot>medium</Pill>
        <Pill tone="risk-high" dot>high</Pill>
        <Pill tone="risk-crit" dot>critical</Pill>
      </Frame>
      <Lede>
        Prefer a semantic tone over a hand-picked base hue whenever the state has a fixed vocabulary — severity, health, run status, risk. It keeps the colour-to-meaning mapping consistent across every screen, and it's the surface the <Mono>SeverityPill</Mono> / <Mono>HealthBadge</Mono> presets are built on. The 6 base tones plus these 23 semantic tones are the whole approved set — don't introduce a hue outside it.
      </Lede>

      {/* Live state — pulsing dot for active work */}
      <SubHead meta="active work">Live (pulsing)</SubHead>
      <Frame label="live=true — pulses while work is in flight" row code={`<Pill tone="ember" live>deploying</Pill>
<Pill tone="ice" live>provisioning</Pill>
<Pill tone="warning" live>backfilling</Pill>`}>
        <Pill tone="ember" live>deploying</Pill>
        <Pill tone="ice" live>provisioning</Pill>
        <Pill tone="warning" live>backfilling</Pill>
      </Frame>
      <Lede>
        Use the pulse <b style={muted}>only</b> while something is actively running. A "queued" pill should sit still — pulsing on idle states cries wolf and trains people to ignore the animation when it actually matters.
      </Lede>

      {/* Pills with leading icons */}
      <SubHead meta="iconic">Pills with icons</SubHead>
      <Frame label="lead with a 12px icon when the tone alone isn't enough" row code={`<Pill tone="success" icon={<Icons.check size={11}/>}>merged</Pill>
<Pill tone="danger" icon={<Icons.alert size={11}/>}>incident</Pill>
<Pill tone="ice" icon={<Icons.calendar size={11}/>}>scheduled</Pill>
<Pill tone="ember" icon={<Icons.zap size={11}/>}>boosted</Pill>`}>
        <Pill tone="success" icon={<Icons.check size={11}/>}>merged</Pill>
        <Pill tone="danger" icon={<Icons.alert size={11}/>}>incident</Pill>
        <Pill tone="ice" icon={<Icons.calendar size={11}/>}>scheduled</Pill>
        <Pill tone="ember" icon={<Icons.zap size={11}/>}>boosted</Pill>
      </Frame>
      <Lede>
        Drop the dot when an icon is doing the work. Don't ship both at once — they fight for the leading edge.
      </Lede>

      {/* Removable pills — filter tokens */}
      <SubHead meta="removable">Removable (filter token)</SubHead>
      <Frame label="onRemove renders a trailing ✕ to clear an applied filter" row code={`<Pill tone="ice" onRemove={() => {}} removeLabel="Remove branch">
  <span style={{color:'var(--fg-subtle)', fontWeight: 500}}>branch:</span>main
</Pill>`}>
        <div style={{display:'flex', flexWrap:'wrap', gap: 8, alignItems:'center'}}>
          {removable.map((tag) => (
            <Pill
              key={tag}
              tone="ice"
              onRemove={() => setRemovable((prev) => prev.filter((t) => t !== tag))}
              removeLabel={`Remove ${tag}`}
            >
              <span style={{color:'var(--fg-subtle)', fontWeight: 500}}>{tag.split(':')[0]}:</span>{tag.split(':')[1]}
            </Pill>
          ))}
          {removable.length === 0 && (
            <button
              type="button"
              style={{fontSize:'var(--text-xs)', color:'var(--ember)', background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'var(--font-mono)'}}
              onClick={() => setRemovable(['branch:main', 'region:us-east', 'status:healthy'])}
            >
              Reset
            </button>
          )}
        </div>
      </Frame>
      <Lede>
        Pass <Mono>onRemove</Mono> to render a trailing close button. Always provide <Mono>removeLabel</Mono> — the ✕ icon alone is silent to a screen reader. The key-side prefix ("branch:", "region:") gets <Mono>--fg-subtle</Mono> so the value reads first.
      </Lede>

      {/* In context — service row */}
      <SubHead meta="in context">In a service row</SubHead>
      <Frame label="real-world density — pill status + tier + version + p95 + trend" code={`<Pill tone="success" dot>healthy</Pill>
<TierBadge tier="T1"/>
{/* Chip components follow — see /chip */}`}>
        <div style={{width:'100%'}}>
          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr .6fr 1fr 1fr 1fr', gap: 12, alignItems:'center', justifyItems:'start', padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize: 'var(--text-base)'}}>
            {['Service', 'Status', 'Tier', 'Version', 'p95', 'Δ 24h'].map((h) => (
              <span key={h} style={{color:'var(--fg-subtle)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'.04em', textTransform:'uppercase'}}>{h}</span>
            ))}
          </div>
          {[
            { svc:'checkout-api', state:'success', label:'healthy', tier:'T1', v:'v4.18.2', p95:'142ms' },
            { svc:'auth-edge',    state:'ember',   label:'deploying', live:true, tier:'T1', v:'v2.91.0', p95:'89ms' },
            { svc:'search-svc',   state:'warning', label:'degraded', tier:'T2', v:'v1.44.7', p95:'612ms' },
            { svc:'reports',      state:'ice',     label:'queued',   tier:'T3', v:'v0.12.1', p95:'—' },
          ].map((r, i) => (
            <div key={r.svc} style={{display:'grid', gridTemplateColumns:'1.4fr 1fr .6fr 1fr 1fr 1fr', gap: 12, alignItems:'center', justifyItems:'start', padding:'12px 14px', borderBottom: i===3?'0':'1px solid var(--border)', fontSize: 'var(--text-base)'}}>
              <span style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>{r.svc}</span>
              <Pill tone={r.state as any} dot live={!!r.live}>{r.label}</Pill>
              <TierBadge tier={r.tier}/>
              <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-muted)', fontVariantNumeric:'tabular-nums'}}>{r.v}</span>
              <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-muted)', fontVariantNumeric:'tabular-nums'}}>{r.p95}</span>
              <span style={{color:'var(--fg-subtle)'}}>—</span>
            </div>
          ))}
        </div>
      </Frame>
      <Lede>
        In a table row, the pill is the second column — it tells you whether the row deserves attention. Tier, version, and metrics follow. Version and delta chips are covered on the <a href="/chip" style={emberLink}>Chip page</a>.
      </Lede>

      {/* When to use — slimmed family orientation */}
      <SubHead meta="four roles">Pill, Chip, or Badge?</SubHead>
      <div className="ds-grid cols-2" style={{marginBottom: 22}}>
        <div className="surface" style={{padding: 14}}>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
            <Pill tone="success" dot>healthy</Pill>
            <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>{'<Pill>'}</span>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 500, marginBottom: 4}}>Pill — STATE</div>
          <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55}}>What state something is in: healthy, running, P0, degraded. One short verb or adjective. Pair with a dot, pulse, or icon.</div>
        </div>
        <div className="surface" style={{padding: 14}}>
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
            <span className="badge new">12</span>
            <span className="badge">99+</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>.badge</span>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 500, marginBottom: 4}}>Badge — COUNT</div>
          <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55}}>An integer (or "99+") riding next to a label — inbox unread, PRs awaiting review. See <a href="/badges" style={emberLink}>Badge</a>.</div>
        </div>
      </div>
      <Lede>
        For versions, metrics, deltas, refs, and removable filter tokens — use{' '}
        <a href="/chip" style={emberLink}>Chip</a>
        {' '}instead. Shape is the cue: a capsule (999px radius) says "state"; a rectangle (4px radius) says "attribute".
      </Lede>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Plain pills are static labels and add no tab stop. The removable variant is the exception: its remove control is a real <Mono>{'<button>'}</Mono>, reached by Tab and fired with Enter / Space; Backspace / Delete from the pill also removes it.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>State must not depend on the tint alone — the pill text spells out the status ("Live", "Failed") so it is read aloud. A removable pill's close button carries a <Mono>removeLabel</Mono> ("Remove branch: main"). The pulsing "live" dot is <Mono>aria-hidden</Mono>; the word carries the meaning.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The remove button shows the offset focus ring. Every tone is engineered so its text clears AA contrast against its own fill — foreground is always explicitly set, never inherited. Pills on the ember accent use dark ink rather than ember-on-ember.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Only the "live" pill pulses. Under <Mono>prefers-reduced-motion: reduce</Mono> the pulse stops and the dot rests at full opacity — the static "Live" label still communicates the state.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — dot leads on the right, close button trails on the left'}
        row
        code={`<div dir="rtl">
  <Pill tone="success" dot>سليم</Pill>
  <Pill tone="ember" live>قيد النشر</Pill>
  <Pill tone="ice" onRemove={() => {}} removeLabel="إزالة">البيئة:الإنتاج</Pill>
</div>`}
      >
        <div dir="rtl" style={{display:'flex', flexWrap:'wrap', gap: 8, alignItems:'center'}}>
          <Pill tone="success" dot>سليم</Pill>
          <Pill tone="ember" live>قيد النشر</Pill>
          <Pill tone="warning" dot>متدهور</Pill>
          <Pill tone="danger" dot>متعطل</Pill>
          <Pill tone="ice" onRemove={() => {}} removeLabel="إزالة">
            <span style={{color:'var(--fg-subtle)', fontWeight: 500}}>البيئة:</span>الإنتاج
          </Pill>
        </div>
      </Frame>
      <Lede>
        Pills use <Mono>display: inline-flex</Mono>, so the dot and label flip naturally with the reading direction. The close button uses <Mono>margin-inline-start/end</Mono>, so it always sits on the trailing edge.
      </Lede>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy of a pill</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 96px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div
              aria-hidden="true"
              style={{position:'relative', display:'inline-block', pointerEvents:'none', userSelect:'none'}}
            >
              <span className="pill success" style={{transform:'scale(1.6)', transformOrigin:'center'}}>
                <span className="dot"/>healthy
              </span>
              {/* Leader lines */}
              <span style={{position:'absolute', top: -34, left: 16, width: 1, height: 28, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
              <span style={{position:'absolute', top: -34, left: '54%', width: 1, height: 22, borderInlineStart:'1px dashed var(--border-strong)', opacity: .8}}/>
              <span style={{position:'absolute', top: 30, left: -22, width: 28, height: 1, borderTop:'1px dashed var(--border-strong)', opacity: .8}}/>
              <span style={{position:'absolute', top: 30, right: -28, width: 36, height: 1, borderTop:'1px dashed var(--border-strong)', opacity: .8}}/>
              {/* Pins */}
              <div className="pin" style={{top: -52, left: 8}}>1</div>
              <div className="pin" style={{top: -48, left: '52%'}}>2</div>
              <div className="pin" style={{top: 22, left: -52}}>3</div>
              <div className="pin" style={{top: 22, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'72px auto 0'}}>
            <span className="num">1</span><span><b style={muted}>Status dot.</b> 6×6, <Mono>currentColor</Mono> — picks up the pill's tone automatically. Pass <Mono>live</Mono> to pulse while work is in flight, or use <Mono>icon</Mono> which suppresses the dot.</span>
            <span className="num">2</span><span><b style={muted}>Label.</b> Geist Mono 11 / 0.04em letter-spacing. One short word — "healthy", not "service is healthy". Lowercase. If you need two words, you need an alert, not a pill.</span>
            <span className="num">3</span><span><b style={muted}>Tone background.</b> <Mono>--*-soft</Mono> at 12% alpha. Border at 30% alpha of the same hue. Reads on dark and light themes without a special case.</span>
            <span className="num">4</span><span><b style={muted}>Geometry.</b> Height 22px / radius 999px / 8px horizontal padding. The capsule shape (vs. Chip's 4px rectangle) is the cue: a capsule says "state", a rectangle says "attribute". Pills never wrap.</span>
          </div>
        </div>
      </div>

      {/* Do / Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one-word labels, lowercase</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill tone="success" dot>healthy</Pill>
            <Pill tone="warning" dot>degraded</Pill>
            <Pill tone="danger" dot>down</Pill>
          </div>
          <div className="note">Pills are read at a glance — make every word earn its space.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — sentences inside a pill</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill tone="warning" dot>service is degraded</Pill>
            <Pill tone="danger" dot>action required now</Pill>
          </div>
          <div className="note">If you need a sentence, you need an alert. The pill is a glance, not a paragraph.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pulse only while running</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill tone="ember" live>deploying</Pill>
            <Pill tone="ice" dot>queued</Pill>
          </div>
          <div className="note">Animation = motion in flight. Static dot = settled state.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — pulse on idle states</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill tone="ice" live>queued</Pill>
            <Pill live>idle</Pill>
          </div>
          <div className="note">A pulsing "idle" cries wolf. People stop seeing the animation when it actually means something.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use a pill for state, a chip for attributes</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill tone="success" dot>healthy</Pill>
            <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-muted)'}}>vs.</span>
            <span className="chip">v4.18.2</span>
          </div>
          <div className="note">Same hue can do both — only the shape differs. Capsule = state; rectangle = attribute.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use a pill to carry a version or metric</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill dot>v4.18.2</Pill>
            <Pill tone="ice" dot>p95 142ms</Pill>
          </div>
          <div className="note">Versions and metrics aren't a "state" — they don't earn the capsule shape. Use a <a href="/chip" style={{color:'var(--ember)'}}>Chip</a>.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — limit tones in a row</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill tone="success" dot>healthy</Pill>
            <Pill tone="danger" dot>down</Pill>
          </div>
          <div className="note">Two tones in proximity is the safe maximum — the contrast still reads.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — six tones across one row</div>
          <div className="body" style={{gap: 8, flexWrap:'wrap'}}>
            <Pill tone="ember" dot>active</Pill>
            <Pill tone="success" dot>healthy</Pill>
            <Pill tone="warning" dot>warn</Pill>
            <Pill tone="danger" dot>down</Pill>
            <Pill tone="ice" dot>queued</Pill>
            <Pill dot>idle</Pill>
          </div>
          <div className="note">A row lit in every colour says nothing. Limit to two tones in close proximity.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="PillProps">API reference</SubHead>
      <AutoPropsTable component="Pill" label="<Pill />"/>
    </Section>
    );
  }
