'use client';
// Eidos DS — Components / StatusDot
// 8px coloured dot that maps to a `--status-*`, `--health-*`, `--severity-*`
// or `--risk-*` token. The single most reusable atom in any IDP surface —
// rides next to a label in tables, pipeline rows, ring cohorts, log lines,
// service catalogs.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, StatusDot, Lede, Mono } from '@/ds/core';


  const USAGE_CODE = `import { StatusDot } from "@/components/forge/status-dot"

export function Demo() {
  return (
    <span className="row">
      <StatusDot tone="running" pulse />
      <span>Deploying to canary…</span>
    </span>
  )
}`;

  const row = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-base)', color: 'var(--fg-muted)' };
  const tonePalette = [
    { group: 'Status', items: ['pending','running','done','error','skipped'] },
    { group: 'Health', items: ['up','degraded','down','unknown'] },
    { group: 'Severity', items: ['p0','p1','p2','p3'] },
  ];

  // Live demo — a four-step pipeline that advances on a timer. Each step is
  // pending → running (pulse) → done, with one scripted error so every tone the
  // dot owns gets exercised in motion, not just enumerated. The same scrub
  // logic drives the timeline whether motion is reduced or not — the only
  // difference is whether the running dot pulses, which the CSS decides.
  const STEPS = ['checkout', 'build', 'test', 'deploy'] as const;
  const ERROR_AT = 2; // the "test" step fails on this run
  type Phase = 'pending' | 'running' | 'done' | 'error';

  function LivePipeline() {
    const [active, setActive] = React.useState(0);
    const [playing, setPlaying] = React.useState(true);
    const failed = active >= ERROR_AT;

    React.useEffect(() => {
      if (!playing || failed) return; // a halted run stays halted until replay
      const id = window.setInterval(() => {
        setActive((a) => (a + 1 > STEPS.length ? 0 : a + 1)); // loop back at the end
      }, 1400);
      return () => window.clearInterval(id);
    }, [playing, failed]);

    const phaseOf = (i: number): Phase => {
      if (i < active) return i === ERROR_AT ? 'error' : 'done';
      if (i === active) return i === ERROR_AT ? 'error' : 'running';
      return 'pending';
    };
    const replay = () => { setActive(0); setPlaying(true); };

    return (
      <div style={{display:'flex', flexDirection:'column', gap: 18}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap: 10}}>
          {STEPS.map((label, i) => {
            const phase = phaseOf(i);
            return (
              <div key={label} style={{
                display:'flex', alignItems:'center', gap: 10,
                padding:'12px 14px',
                border:'1px solid var(--border)', borderRadius:'var(--radius-lg)',
                background: phase === 'pending' ? 'transparent' : 'var(--surface)',
                opacity: phase === 'pending' ? 0.55 : 1,
                transition:'opacity .2s ease, background .2s ease',
              }}>
                <StatusDot tone={phase} pulse={phase === 'running'}/>
                <span style={{color:'var(--fg)', fontSize:'var(--text-base)'}}>{label}</span>
              </div>
            );
          })}
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 14, flexWrap:'wrap'}}>
          <button type="button" className="btn ember sm" onClick={() => setPlaying((p) => !p)} disabled={failed}>
            {playing ? 'Pause' : 'Resume'}
          </button>
          <button type="button" className="btn ghost sm" onClick={replay}>Replay run</button>
          <span aria-live="polite" style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color: failed ? 'var(--status-error)' : 'var(--fg-faint)', letterSpacing:'0.04em', fontVariantNumeric:'tabular-nums'}}>
            {failed
              ? `run halted — ${STEPS[ERROR_AT]} failed (exit 1)`
              : `step ${Math.min(active + 1, STEPS.length)} / ${STEPS.length} — ${phaseOf(Math.min(active, STEPS.length - 1))}`}
          </span>
        </div>
      </div>
    );
  }

export default function StatusDotPage() {
  return (
    <Section id="status-dot" title="Status dot" desc="An 8px coloured dot mapped to a semantic token. The smallest possible signal — drops next to a label inside any row, cell, or pipeline step.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('status-dot')} ariaLabel="package manager"/>
      <Lede>Ships <Mono>&lt;StatusDot/&gt;</Mono> + the matching <Mono>.s-dot</Mono> class. Pair it with any label — its only job is to colour-cue a state, not to carry text.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <span style={row}><StatusDot tone="running" pulse/><span style={{color:'var(--fg)'}}>Deploying to canary…</span></span>
      </Frame>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="13 tones">Every tone</SubHead>
      <Frame label="StatusDot covers Status / Health / Severity tokens">
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap: 24}}>
          {tonePalette.map(g => (
            <div key={g.group}>
              <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform:'uppercase', color:'var(--fg-faint)', marginBottom: 12}}>{g.group}</div>
              <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                {g.items.map(t => (
                  <span key={t} style={row}>
                    <StatusDot tone={t}/>
                    <span style={{color:'var(--fg)'}}>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Frame>

      <SubHead meta="3 sizes">Sizes</SubHead>
      <Frame label="sm 6 / md 8 / lg 10" row code={`<StatusDot tone="up" size="sm" />
<StatusDot tone="up" />
<StatusDot tone="up" size="lg" />`}>
        <span style={row}><StatusDot tone="up" size="sm"/><span>sm · 6px</span></span>
        <span style={row}><StatusDot tone="up"/><span>md · 8px</span></span>
        <span style={row}><StatusDot tone="up" size="lg"/><span>lg · 10px</span></span>
      </Frame>

      <SubHead meta="motion">Pulse</SubHead>
      <Frame label="emphasis on in-flight states · respects prefers-reduced-motion" row code={`<StatusDot tone="running" pulse />
<StatusDot tone="degraded" pulse />
<StatusDot tone="p0" pulse />`}>
        <span style={row}><StatusDot tone="running" pulse/><span>Running</span></span>
        <span style={row}><StatusDot tone="degraded" pulse/><span>Degraded</span></span>
        <span style={row}><StatusDot tone="p0" pulse/><span>P0 incident</span></span>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth:'64ch'}}>Pulse is the only animation in this primitive. Reserve it for events <em>actively in flight</em> — running pipelines, degraded services mid-investigation, open P0 incidents.</p>

      <SubHead meta="live · state-cueing in motion">Live state</SubHead>
      <Frame label="a real run — each step walks pending → running (pulse) → done, with one scripted failure">
        <LivePipeline/>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth:'64ch'}}>This is the dot doing its one job: the active step pulses while it runs, then settles solid as <Mono>done</Mono> or freezes on <Mono>error</Mono>. With <Mono>prefers-reduced-motion: reduce</Mono> the timeline still advances and the colours still change — only the pulse stops, so the meaning survives without the movement.</p>

      <SubHead meta="in context">In context</SubHead>
      <Frame label="pipeline · service row · log line">
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap: 20, fontSize: 'var(--text-base)'}}>
          {/* Pipeline-style row */}
          <div style={{display:'flex', alignItems:'center', gap: 14, padding:'10px 14px', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', background:'var(--surface)'}}>
            <span style={row}><StatusDot tone="done"/><span>checkout</span></span>
            <span style={{color:'var(--fg-faint)'}}>›</span>
            <span style={row}><StatusDot tone="done"/><span>build</span></span>
            <span style={{color:'var(--fg-faint)'}}>›</span>
            <span style={row}><StatusDot tone="running" pulse/><span>test</span></span>
            <span style={{color:'var(--fg-faint)'}}>›</span>
            <span style={row}><StatusDot tone="pending"/><span>deploy</span></span>
          </div>
          {/* Service row */}
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', background:'var(--surface)'}}>
            <span style={row}><StatusDot tone="degraded" pulse/><span style={{color:'var(--fg)'}}>payments-api</span></span>
            <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>p99: 412ms · err: 1.4%</span>
          </div>
          {/* Log lines */}
          <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', display:'flex', flexDirection:'column', gap: 4}}>
            <span style={row}><StatusDot tone="done" size="sm"/><span>12:42:03  202  POST /v1/deploys/forge-api</span></span>
            <span style={row}><StatusDot tone="error" size="sm"/><span>12:42:04  500  POST /v1/agents/run</span></span>
            <span style={row}><StatusDot tone="skipped" size="sm"/><span>12:42:05  --   skipped: gate failed</span></span>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The dot is a static indicator with no focus or key bindings. If a row is interactive, the dot rides along with the row&apos;s own focus — never make the 8px dot the focus target on its own.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Pair the dot with a visible text label — that label is what readers announce. The dot itself is decorative and should be <code>aria-hidden</code>; if it must stand alone, give it an explicit text alternative (&quot;Status: degraded&quot;).</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Colour alone never carries meaning — always show a label so colour-blind users aren&apos;t excluded. Each tone is drawn from the semantic token set and clears AA non-text contrast (3:1) against the row surface in both themes.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The optional pulse signals &quot;live&quot;. Under <code>prefers-reduced-motion</code> the pulse stops and the dot rests solid, keeping the meaning without the animation.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — the dot leads on the right, the label right-aligns'}
        row
        code={`<div dir="rtl">
  <span className="row">
    <StatusDot tone="running" pulse />
    <span>جارٍ النشر إلى canary…</span>
  </span>
</div>`}
        lang="tsx"
      >
        <div dir="rtl">
          <span style={row}><StatusDot tone="running" pulse/><span style={{color:'var(--fg)'}}>جارٍ النشر إلى canary…</span></span>
        </div>
      </Frame>
      <Lede>
        Mirroring here is honestly minimal: the dot is a perfect circle, so it never flips — under <Mono>dir="rtl"</Mono> it simply leads on the start edge (now the right) and the label right-aligns, driven by the logical flex order, not a transform. The pulse ring radiates symmetrically and is direction-neutral, so there is no <Mono>scaleX(-1)</Mono> to apply; pairing the dot with text via <Mono>gap</Mono> rather than a directional margin keeps it correct.
      </Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <StatusDot tone="running" size="lg"/>
              <span className="lead h" style={{top: 4, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 4, right: -28, width: 24}}/>
              <span className="lead v" style={{top: -22, left: 4, height: 18}}/>
              <div className="pin" style={{top: -42, left: 4, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -6, left: -52}}>2</div>
              <div className="pin" style={{top: -6, right: -52}}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Fill.</b> One semantic token: <Mono>--status-*</Mono>, <Mono>--health-*</Mono>, <Mono>--severity-*</Mono>. Never paint with a brand color (ember/ice) — those are for emphasis, not state.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Shape.</b> Perfect circle. 8px default, 6px when riding inline with mono text, 10px in heroes / hero cards.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Pulse.</b> Animated ring uses <Mono>currentColor</Mono>. Only for <em>in-flight</em> states (running, degraded, p0).</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair with a label</div>
          <div className="body">
            <span style={row}><StatusDot tone="degraded" pulse/><span style={{color:'var(--fg)'}}>payments-api</span></span>
          </div>
          <div className="note">The dot encodes state; the label encodes which thing. Together they're parseable; alone, neither is.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use as a standalone status badge</div>
          <div className="body">
            <StatusDot tone="error"/>
          </div>
          <div className="note">A dot with no label can't say <em>what</em> failed. Use a SeverityPill or HealthBadge if you need the state to read independently.</div>
        </div>
      </div>

      <SubHead meta="StatusDotProps">API reference</SubHead>
      <AutoPropsTable component="StatusDot" label="<StatusDot />"/>
    </Section>
  );
}
