'use client';
// Eidos DS — Components / Surfaces (card · hairline · divider · code block)
import { Alert, AlertDescription, AlertTitle, Empty, Frame, Icons, LangBadge, Lede, Mono, MOCKS, PropsTable, Section, Skeleton, Spinner, SubHead, TabbedCode, TierBadge, installTabs } from '@/ds/core';

const USAGE_CODE = `import { Surface } from "@/components/forge/surface"

export function Demo() {
  return (
    <Surface variant="card" hoverable>
      <h3>checkout-api</h3>
      <p>Healthy · v4.18.2</p>
    </Surface>
  )
}`;

export default function Surfaces() {
  return (
    <Section id="surfaces" num="12" title="Surfaces" desc="The containers that hold everything else — cards, hairlines, dividers, and code blocks. Depth reads through surface tone and a hairline, not shadow. Compose; never invent a one-off panel.">
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('surface')} ariaLabel="package manager"/>
      <Lede>
        Ships the <Mono>Surface</Mono> primitive plus the <Mono>--bg → --surface → --surface-hover → --surface-overlay</Mono> semantic ladder for layered backgrounds. <Mono>--bg-elevated</Mono> drops below canvas for inset wells.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div className="card hover" style={{maxWidth: 320}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
            <span style={{fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.3}}>checkout-api</span>
            <TierBadge tier="T1"/>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>Healthy · <Mono tone="subtle">v4.18.2</Mono></div>
        </div>
      </Frame>

      {/* 3. EXAMPLES */}
      <SubHead meta="layered">Surface ladder</SubHead>
      <Lede up>
        The full taxonomy lives in <Mono>Foundations / Elevation</Mono>. In a card composition you&apos;ll
        usually only touch three rungs: <Mono>--bg</Mono> (the page underneath),
        <Mono> --surface</Mono> (this card), and <Mono>--bg-elevated</Mono> (any inset well — code block,
        scrollback — placed <i>inside</i> the card).
      </Lede>
      <Frame label="canvas → base → sunken → hover">
        <div style={{padding: 28, background: 'var(--bg)', borderRadius: 'var(--radius-xl)', width:'100%'}}>
          <div className="t-mono-label" style={{padding:0, marginBottom: 10}}>--bg (page)</div>
          <div style={{padding: 16, background:'var(--surface)', borderRadius: 'var(--radius-lg)', border:'1px solid var(--border)'}}>
            <div className="t-mono-label" style={{padding:0, marginBottom: 10}}>--surface (card · 6px)</div>
            <pre style={{
              margin: 0, padding: 12,
              background:'var(--bg-elevated)',
              border:'1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)',
              fontVariantNumeric: 'tabular-nums',
              color:'var(--fg-muted)', lineHeight: 1.6,
            }}>
              <div className="t-mono-label" style={{padding:0, marginBottom: 6}}>--bg-elevated (inset · 4px)</div>
              forge deploy --canary=10
            </pre>
            <div style={{marginTop: 10, padding:'8px 12px', background:'var(--surface-hover)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>
              <span className="t-mono-label" style={{padding:0, marginInlineEnd: 8}}>--surface-hover</span>
              row :hover
            </div>
          </div>
        </div>
      </Frame>

      <SubHead meta="patterns">Card</SubHead>
      <Frame label="hover-able card" code={`<div className="card hover">…</div>`}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 10, width:'100%'}}>
          {(MOCKS && MOCKS.SERVICES ? MOCKS.SERVICES.slice(0,3) : [
            {name:'identity-svc', tier:'T1', lang:'TypeScript', p95: 142, version:'4.18.2'},
            {name:'pix-router', tier:'T1', lang:'Go', p95: 89, version:'2.7.0'},
            {name:'ledger-svc', tier:'T1', lang:'Go', p95: 24, version:'2.3.9'},
          ]).map(s => (
            <div key={s.name} className="card hover">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
                <span style={{fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.3}}>{s.name}</span>
                <TierBadge tier={s.tier}/>
              </div>
              <LangBadge lang={s.lang}/>
              <div style={{display:'flex', gap: 6, marginTop: 12}}>
                <span className="chip">v{s.version}</span>
                <span className="chip ok">p95 {s.p95}ms</span>
              </div>
            </div>
          ))}
        </div>
      </Frame>

      <SubHead meta="states">Surface states</SubHead>
      <Lede up>
        A surface is a container, so its &quot;states&quot; are the lifecycle of the content it
        holds. A card moves through <b style={{color:'var(--fg)'}}>idle → interactive → loading →
        empty → error</b> while the box itself never changes — same tone, same hairline. Compose
        the state <i>inside</i> the surface; never invent a colored panel for it.
      </Lede>
      <Frame label="interactive · loading · empty · error" code={`<div className="card hover" tabIndex={0} role="button">…</div>
<div className="card"><Spinner variant="dots" /> Provisioning…</div>
<div className="card"><Empty>No services yet</Empty></div>
<div className="card"><Alert tone="danger">…</Alert></div>`} lang="tsx">
        <div style={{display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap: 12, width:'100%'}}>
          {/* Interactive — the whole card is one action, so it takes a tab stop and a focus ring */}
          <div
            className="card hover"
            tabIndex={0}
            role="button"
            aria-label="Open checkout-api service detail"
          >
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
              <span style={{fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.3}}>checkout-api</span>
              <TierBadge tier="T1"/>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>Tab here, then Space</span>
              <span className="chip ok">p95 142ms</span>
            </div>
          </div>

          {/* Loading — skeleton + spinner inside the same surface */}
          <div className="card" aria-busy="true">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12}}>
              <Skeleton variant="line" width={110}/>
              <Spinner variant="dots" size="sm" aria-label="Provisioning service"/>
            </div>
            <div className="sk-group">
              <Skeleton variant="line" width="80%"/>
              <Skeleton variant="line" width="55%"/>
            </div>
          </div>

          {/* Empty — the calm "nothing here yet" rung, shipped Empty atom */}
          <div className="card" style={{padding: 0, display:'flex', alignItems:'center'}}>
            <Empty size="sm" icon={<Icons.inbox size={16}/>} title="No services yet" desc="Deploy your first service to see it here."/>
          </div>

          {/* Error — a danger Alert renders inside the surface, not a recolored card */}
          <div className="card" style={{display:'flex', alignItems:'center'}}>
            <Alert tone="danger" style={{width:'100%', border: 0, background:'transparent', padding: 0}}>
              <AlertTitle>Failed to load metrics</AlertTitle>
              <AlertDescription>Upstream returned <Mono tone="subtle">503</Mono> — retrying in <Mono tone="subtle">5s</Mono>.</AlertDescription>
            </Alert>
          </div>
        </div>
      </Frame>

      <SubHead meta="syntax">Code block</SubHead>
      <Frame label=".code-block" code={`forge deploy identity-svc --canary=10`}>
        <pre className="code-block" style={{width:'100%', margin: 0}}>
          <span className="c"># deploy identity-svc with a 10% canary</span>{'\n'}
          <span className="k">forge</span> <span className="f">deploy</span> identity-svc <span className="n">--canary</span>=<span className="s">10</span>{'\n'}
          <span className="c">→ canary: 10% traffic for 5min, then promote</span>
        </pre>
      </Frame>

      <SubHead meta="hairlines">Dividers & hairlines</SubHead>
      <Frame label=".divider · .hairline" row>
        <div style={{width: 240}}>
          <div style={{padding: '8px 0', fontSize: 'var(--text-base)'}}>Section A</div>
          <div className="divider"/>
          <div style={{padding: '8px 0', fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Section B</div>
          <div className="divider"/>
          <div style={{padding: '8px 0', fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Section C</div>
        </div>
      </Frame>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A plain surface is a visual container, not a control — it adds no tab stops. A card enters the tab order only when the whole card is a single action (a <code>button</code> / link, or <code>tabIndex=0</code> + <code>role=&quot;button&quot;</code> as in the states demo above); otherwise its interactive children are focused individually and the card stays passive.</div>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:'6px 14px', marginTop: 12}}>
            <kbd className="kbd">Tab</kbd><span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>Move focus to / from an actionable card</span>
            <kbd className="kbd">Enter</kbd><span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>Activate (link semantics)</span>
            <kbd className="kbd">Space</kbd><span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>Activate (button semantics)</span>
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Give a card meaning through its content, not its box: a heading inside it, or <code>role=&quot;region&quot;</code> with <code>aria-labelledby</code> when it&apos;s a landmark. Hairlines and dividers are decorative and stay <code>aria-hidden</code>; a code block is exposed as <code>&lt;pre&gt;</code>/<code>&lt;code&gt;</code> so its text is selectable and read verbatim.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Depth must never be the only cue — a one-step tone change can be imperceptible, so each rung pairs its surface tone with a hairline border that clears AA non-text contrast (3:1). Body text on every rung keeps AA (4.5:1) in both themes.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Surfaces are static. Any hover lift or shadow change on an interactive card eases with <code>--ease</code> and is dropped under <code>prefers-reduced-motion</code>, leaving the border / tone state to convey the change.</div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — direction-agnostic; only inner text/content aligns to the start'} center code={`<div dir="rtl"><div className="card hover">…</div></div>`} lang="tsx">
        <div dir="rtl">
          <div className="card hover" style={{maxWidth: 320}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
              <span style={{fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.3}}>واجهة الدفع</span>
              <TierBadge tier="T1"/>
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>سليم · <span dir="ltr"><Mono tone="subtle">v4.18.2</Mono></span></div>
          </div>
        </div>
      </Frame>
      <Lede>Surfaces are direction-agnostic — say so. A card, hairline, divider, or code block is a symmetric box with even padding and a hairline on every edge, so it looks identical in both directions. All that flips is the inner content: text aligns to the start (right) edge and the <Mono>space-between</Mono> header swaps which end holds the title versus the badge. Because the layout already uses logical properties (padding, the flex header), there is nothing surface-specific to override. Version strings stay LTR.</Lede>
      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <div className="card" style={{width: 280}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
                  <span style={{fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.3}}>checkout-api</span>
                  <TierBadge tier="T1"/>
                </div>
                <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>Healthy · <Mono tone="subtle">v4.18.2</Mono></div>
              </div>
              <span className="lead v" style={{top: -22, left: 24, height: 18}}/>
              <span className="lead h" style={{top: 18, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 44, left: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <span className="lead v" style={{top: -22, right: 60, height: 18}}/>
              <div className="pin" style={{top: -42, left: 24, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 10, right: -52}}>2</div>
              <div className="pin" style={{top: 36, left: -52}}>3</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
              <div className="pin" style={{top: -42, right: 60, transform:'translateX(50%)'}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Background.</b> <Mono>var(--surface)</Mono> sits one notch above <Mono>--bg</Mono> on the elevation ladder. Hoverable variants lift to <Mono>--surface-hover</Mono>.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>1px border.</b> <Mono>var(--border)</Mono> — a hairline that defines the edge in both themes without competing with the content.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Padding.</b> <Mono>16px</Mono> on all sides. Tight enough to read as a card, loose enough that a heading + meta + chips never feel boxed in.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Border-radius.</b> <Mono>var(--radius-lg)</Mono> (6px) — the standard card radius. Nested wells step down to <Mono>var(--radius-sm)</Mono> (4px) so the corners visually telescope.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Optional elevation.</b> <Mono>var(--elev-1)</Mono> on hover/active for raised variants. Default surfaces stay flat — the border carries the edge.</span>
          </div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="SurfaceProps">API reference</SubHead>
      <PropsTable
        label="<Surface />"
        rows={[
          { prop: 'variant', type: '"card" | "panel" | "row" | "sunken" | "overlay"', default: '"card"', description: 'Visual flavor — card uses --surface, panel uses --surface-overlay, row uses --surface-hover, sunken uses --bg-elevated (inset wells), overlay uses --surface-overlay (popovers/modals).' },
          { prop: 'hoverable', type: 'boolean', default: 'false', description: 'Apply hover state (lifts to --surface-hover + cursor: pointer).' },
          { prop: 'asChild', type: 'boolean', default: 'false', description: 'Render as the wrapped child (e.g. <a>, <Link>) while keeping Surface styling.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Content. Cards typically wrap a heading + meta + chips.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra utility classes merged via cn().' },
        ]}
      />
    </Section>
  );
}
