'use client';
import React from 'react';
import { Icons, Frame, SubHead, Lede, Mono } from '@/ds/core';
import { Section, AutoPropsTable } from '@/ds/core';
import { TabbedCode, installTabs } from '@/ds/core';

// Import the canonical Skeleton component — no inline impl, no <style>
import { Skeleton } from '@/ds/core';

// Helpful composites used in examples
const SkLine  = (p: React.ComponentProps<typeof Skeleton>) => <Skeleton variant="line"   {...p}/>;
const SkBox   = (p: React.ComponentProps<typeof Skeleton>) => <Skeleton variant="box"    {...p}/>;
const SkAv    = (p: React.ComponentProps<typeof Skeleton>) => <Skeleton variant="circle" {...p}/>;

const USAGE_CODE = `import { Skeleton } from "@eidos/ui"

export function Demo() {
  return <Skeleton variant="line" width={220} />
}`;

// ---- Page ---------------------------------------------------------------
export default function Page() {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Section
      id="skeleton"
      title="Skeleton"
      desc="Placeholder shapes shown while data loads — preserves the eventual layout so the page does not reflow when content arrives. Use for first paints past ~300 ms."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('skeleton')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>Skeleton</Mono> plus the <Mono>.sk</Mono> CSS layer (shimmer animation, three variants). Pick <em>Manual</em> to copy the files by hand.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Reach for Skeleton on lists, cards, profiles, and dashboards — anywhere a shimmer reads as "almost there" instead of "broken". Under 300 ms, show nothing.</Lede>
      <Frame label="basic" code={USAGE_CODE}>
        <SkLine width={220}/>
      </Frame>

      {/* 3. EXAMPLES */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* Primitives */}
      <SubHead meta="primitives">Primitives</SubHead>
      <Frame
        label="three shapes — line, circle, box · everything else composes from these"
        code={`<Skeleton variant="line" />
<Skeleton variant="line" width={140} />
<Skeleton variant="circle" size={32} />
<Skeleton variant="box" width={200} height={120} />`}
      >
        <div style={{padding: 24, display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 420}}>
          <SkLine/>
          <SkLine width={220}/>
          <div style={{display:'flex', alignItems:'center', gap: 14}}>
            <SkAv size={32}/>
            <SkAv size={48}/>
            <SkAv size={64}/>
          </div>
          <SkBox width="100%" height={120}/>
        </div>
      </Frame>
      <Lede>Lines have a 6px radius (matches paragraph rhythm). Circles take a <Mono>size</Mono> shortcut (radius is half automatically). Boxes use the standard 8px radius for cards.</Lede>

      {/* Multi-line mode */}
      <SubHead meta="lines">Multi-line mode</SubHead>
      <Frame
        label="lines prop — N stacked bars, last one at 62% width (AI streaming placeholder)"
        code={`<Skeleton variant="line" lines={3} />
<Skeleton variant="line" lines={5} />`}
      >
        <div style={{padding: 24, display:'flex', flexDirection:'column', gap: 28, width:'100%', maxWidth: 480}}>
          {[2, 3, 5].map((n) => (
            <div key={n}>
              <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-muted)', display:'block', marginBottom: 8}}>{n} lines</span>
              <Skeleton variant="line" lines={n}/>
            </div>
          ))}
        </div>
      </Frame>
      <Lede>The last bar renders at 62% width — this mirrors paragraph rhythm and doubles as the streaming-content placeholder that replaces the retired AI-specific skeleton.</Lede>

      {/* Card skeleton */}
      <SubHead meta="composition">Card placeholder</SubHead>
      <Frame
        label="composes the eventual card layout — never shown alone"
        code={`<div className="surface">
  <Skeleton variant="box" width="100%" height={140} />
  <Skeleton variant="line" width="80%" />
  <Skeleton variant="line" width="60%" />
</div>`}
      >
        <div style={{padding: 24, display:'flex', justifyContent:'center', width:'100%'}}>
          <div className="surface" style={{padding: 14, width: 320}}>
            <SkBox width="100%" height={140}/>
            <div style={{marginTop: 14}}><SkLine width="80%"/></div>
            <div style={{marginTop: 10}}><SkLine width="60%"/></div>
            <div style={{marginTop: 14, display:'flex', gap: 10}}>
              <SkLine width={64} height={28}/>
              <SkLine width={64} height={28}/>
            </div>
          </div>
        </div>
      </Frame>

      {/* List skeleton */}
      <SubHead meta="list">List placeholder</SubHead>
      <Frame
        label="row skeleton mirrors avatar + 2 lines · render N rows for N expected items"
        code={`{Array.from({length: 5}, (_, i) => (
  <div key={i} className="row">
    <Skeleton variant="circle" size={36}/>
    <div>
      <Skeleton variant="line" width={140}/>
      <Skeleton variant="line" width={220}/>
    </div>
  </div>
))}`}
      >
        <div style={{padding: 24, display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 460}}>
          {Array.from({length: 5}, (_, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap: 12}}>
              <SkAv size={36}/>
              <div style={{flex:1, display:'flex', flexDirection:'column', gap: 6}}>
                <SkLine width={140}/>
                <SkLine width={220}/>
              </div>
              <SkLine width={56} height={20}/>
            </div>
          ))}
        </div>
      </Frame>

      {/* Table skeleton */}
      <SubHead meta="table">Table placeholder</SubHead>
      <Frame
        label="header + N rows · same column widths as the eventual data"
      >
        <div style={{padding: 0, width:'100%'}}>
          <div style={{padding:'10px 14px', display:'grid', gridTemplateColumns:'2fr 1.4fr 1fr 80px', gap: 14, borderBottom:'1px solid var(--border)', background:'var(--surface)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform:'uppercase', letterSpacing:'.06em', color:'var(--fg-faint)'}}>
            <span>Project</span><span>Owner</span><span>Updated</span><span>Status</span>
          </div>
          {Array.from({length: 6}, (_, i) => (
            <div key={i} style={{padding:'12px 14px', display:'grid', gridTemplateColumns:'2fr 1.4fr 1fr 80px', gap: 14, alignItems:'center', borderBottom:'1px solid var(--border)'}}>
              <SkLine width={`${60 + (i*3) % 30}%`}/>
              <SkLine width={`${50 + (i*7) % 30}%`}/>
              <SkLine width={64}/>
              <SkLine width={56} height={18}/>
            </div>
          ))}
        </div>
      </Frame>

      {/* Profile / dashboard */}
      <SubHead meta="dashboard">Profile dashboard</SubHead>
      <Frame
        label="rich layout · header + stat tiles + main content"
      >
        <div style={{padding: 24, width:'100%'}}>
          <div style={{display:'flex', alignItems:'center', gap: 14, marginBottom: 24}}>
            <SkAv size={56}/>
            <div style={{flex:1, display:'flex', flexDirection:'column', gap: 8}}>
              <SkLine width={180}/>
              <SkLine width={120}/>
            </div>
            <SkLine width={120} height={32}/>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 14, marginBottom: 24}}>
            {[0,1,2].map(i => (
              <div key={i} className="surface" style={{padding: 14}}>
                <SkLine width={80} height={10}/>
                <div style={{marginTop: 12}}><SkLine width={120} height={28}/></div>
                <div style={{marginTop: 10}}><SkLine width={140}/></div>
              </div>
            ))}
          </div>
          <SkBox width="100%" height={180}/>
        </div>
      </Frame>

      {/* Live demo: skeleton → content */}
      <SubHead meta="live demo">Skeleton → content</SubHead>
      <Frame
        label="watch the skeleton dissolve as data arrives · click reload"
      >
        <div style={{padding: 24, width:'100%'}}>
          <button className="btn sm" onClick={() => { setLoaded(false); setTimeout(() => setLoaded(true), 1500); }}>
            <Icons.refresh size={12}/> Reload
          </button>
          <div className="surface" style={{padding: 16, marginTop: 14}}>
            {loaded ? (
              <div style={{display:'flex', alignItems:'center', gap: 14}}>
                <span className="avatar md ember">LF</span>
                <div style={{flex:1}}>
                  <div className="t-body" style={{fontWeight: 500, color:'var(--fg)'}}>Layla Faraj</div>
                  <div className="t-small" style={{color:'var(--fg-muted)'}}>Lead designer · Eidos core team</div>
                </div>
                <button className="btn sm">Profile</button>
              </div>
            ) : (
              <div style={{display:'flex', alignItems:'center', gap: 14}}>
                <SkAv size={40}/>
                <div style={{flex:1, display:'flex', flexDirection:'column', gap: 6}}>
                  <SkLine width={140}/>
                  <SkLine width={220}/>
                </div>
                <SkLine width={56} height={28}/>
              </div>
            )}
          </div>
        </div>
      </Frame>
      <Lede>The skeleton mirrors the eventual layout — same avatar size, same line-count, same trailing button. When data arrives, the swap is silent: no scroll jump, no reflow.</Lede>

      {/* Custom shapes */}
      <SubHead meta="custom">Custom shapes</SubHead>
      <Frame
        label="any width × height combination · use box for non-text shapes"
        code={`<Skeleton variant="line" width="80%" height={24}/>   // headline
<Skeleton variant="box" width={64} height={64}/>     // thumbnail
<Skeleton variant="circle" size={48}/>               // avatar`}
      >
        <div style={{padding: 24, display:'flex', alignItems:'center', gap: 24, flexWrap:'wrap'}}>
          <SkLine width={300} height={40}/>
          <SkBox width={64} height={64}/>
          <SkAv size={48}/>
          <SkLine width={120} height={32}/>
        </div>
      </Frame>

      {/* Decision matrix */}
      <SubHead meta="when to use">Skeleton vs Spinner vs Progress</SubHead>
      <div className="dd-grid">
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Skeleton</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBottom: 8}}>The page IS loading the layout. Rich content with predictable shape — cards, lists, profiles, tables.</div>
          <div className="t-small" style={{color:'var(--fg-subtle)'}}>First paint, route transitions, late-arriving data.</div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Spinner</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBottom: 8}}>An action is happening — submit, refresh, in-place reload. Indeterminate but bounded.</div>
          <div className="t-small" style={{color:'var(--fg-subtle)'}}>Buttons, inline indicators.</div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Progress</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBottom: 8}}>Determinate progress — file upload, multi-step background job. Show real % when known.</div>
          <div className="t-small" style={{color:'var(--fg-subtle)'}}>Uploads, exports, batch processes.</div>
        </div>
      </div>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Skeletons are inert placeholders — they hold no focus and have no key bindings. Avoid placing focusable controls inside the loading state so that Tab order doesn&apos;t shift when real content swaps in.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The shapes are decorative (<Mono>aria-hidden</Mono>). Use the <Mono>label</Mono> prop to emit a visually-hidden &quot;Loading…&quot; span inside a <Mono>role=&quot;status&quot;</Mono> wrapper on the topmost group — never let a reader narrate every placeholder bar. Clear <Mono>aria-busy</Mono> on the container when data arrives.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Placeholders are non-text and exempt from text contrast, but the shimmer must stay subtle: a low-contrast tint over <Mono>--surface</Mono> so it reads as &quot;loading&quot; without flashing. The layout matches the eventual content so focus lands in the same place after the swap.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Under <Mono>prefers-reduced-motion</Mono> the shimmer sweep stops and the placeholder rests as a flat tinted block — still clearly a loading state, with no continuous animation.</div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — placeholders align to the start; leading avatar moves right'}
        code={`<div dir="rtl">
  <div className="row">
    <Skeleton variant="circle" size={36}/>
    <div>
      <Skeleton variant="line" width={140}/>
      <Skeleton variant="line" width={220}/>
    </div>
  </div>
</div>`}
        lang="tsx"
      >
        <div dir="rtl" style={{padding: 24, display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 460}}>
          {Array.from({length: 4}, (_, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap: 12}}>
              <SkAv size={36}/>
              <div style={{flex:1, display:'flex', flexDirection:'column', gap: 6}}>
                <SkLine width={140}/>
                <SkLine width={220}/>
              </div>
              <SkLine width={56} height={20}/>
            </div>
          ))}
        </div>
      </Frame>
      <Lede>
        Skeletons are pure logical layout, so they mirror for free: the leading <Mono>circle</Mono> avatar moves to the start (now the right), the text bars right-align, and a trailing meta bar moves to the left — all from the flex direction, no explicit mirror. The shimmer sweep is a horizontal gradient that is direction-neutral; nothing needs <Mono>scaleX(-1)</Mono>. Sizing it with logical spacing rather than <Mono>margin-left</Mono>/<Mono>right</Mono> keeps it correct under <Mono>dir=&quot;rtl&quot;</Mono>.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 320, padding: 14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)'}} aria-hidden="true">
              <div style={{display:'flex', alignItems:'center', gap: 12}}>
                <SkAv size={40}/>
                <div style={{flex:1, display:'flex', flexDirection:'column', gap: 6}}>
                  <SkLine width={140}/>
                  <SkLine width={200}/>
                </div>
              </div>
              <div style={{marginTop: 14, display:'flex', flexDirection:'column', gap: 8}}>
                <SkLine width="92%"/>
                <SkLine width="76%"/>
                <SkLine width="58%"/>
              </div>
              <span className="lead h" style={{top: 32, left: -28, width: 24}}/>
              <span className="lead v" style={{top: -22, left: 56, height: 18}}/>
              <span className="lead h" style={{top: 76, right: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <div className="pin" style={{top: 24, left: -52}}>1</div>
              <div className="pin" style={{top: -42, left: 56, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: 68, right: -52}}>3</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Circle avatar.</b> <Mono>variant=&quot;circle&quot;</Mono> with the same diameter as the eventual <Mono>Avatar</Mono>. Border-radius is half the size automatically.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Title lines.</b> Two <Mono>line</Mono> bars at 70–90% width — mirrors a heading + subtitle so the layout never jumps when text arrives.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Body lines.</b> 3 lines, descending widths (92% · 76% · 58%) — reads as a paragraph, not a stripe pattern.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Shimmer.</b> 1.4s ease-in-out gradient sweep between <Mono>--surface</Mono> and <Mono>--surface-hover</Mono>. Pauses under <Mono>prefers-reduced-motion</Mono>.</span>
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don&apos;t</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — match the eventual layout</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 12, width:'100%'}}>
            <div style={{display:'flex', alignItems:'center', gap: 12}}>
              <SkAv size={36}/>
              <div style={{flex:1, display:'flex', flexDirection:'column', gap: 6}}>
                <SkLine width={140}/>
                <SkLine width={220}/>
              </div>
            </div>
          </div>
          <div className="note">Same avatar size, same line count, same button-bar. When real data arrives, nothing visibly shifts.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don&apos;t — show a generic loading rectangle</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 12, width:'100%'}}>
            <SkBox width="100%" height={140}/>
          </div>
          <div className="note">A featureless gray block doesn&apos;t preview anything. Layout still jumps when data arrives — and the user feels it.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — render the right number of rows</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, width:'100%'}}>
            {Array.from({length: 4}, (_, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap: 10}}>
                <SkAv size={20}/><SkLine width="60%" height={10}/>
              </div>
            ))}
          </div>
          <div className="note">If you know the page size (e.g. always 20 rows), render 20 skeleton rows. Anything fewer collapses on data arrival.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don&apos;t — keep skeletons up for &gt; 5 seconds</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, width:'100%'}}>
            <div style={{padding: 14, background:'var(--danger-soft)', border:'1px solid rgba(248,113,113,0.30)', borderRadius: 'var(--radius-xl)', color:'var(--danger)', fontSize: 'var(--text-sm)', fontFamily:'var(--font-mono)', display:'flex', alignItems:'center', gap: 8}}>
              <Icons.alert size={14} aria-hidden="true" />
              skeleton.duration = 12.4s — switch to error state
            </div>
          </div>
          <div className="note">After 5–8 seconds the user assumes &quot;broken&quot;. Switch to a real error/empty state with a Retry. Skeletons are for &quot;almost there&quot;, not &quot;still trying&quot;.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="SkeletonProps">API reference</SubHead>
      <AutoPropsTable component="Skeleton" label="<Skeleton />" />
    </Section>
  );
}
