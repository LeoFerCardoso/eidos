'use client';
// Eidos DS — Foundations / Motion (quiet, deterministic, ember-led)
import * as React from 'react';
import { Icons, Frame, Section, SubHead, SpecRow, Mono } from '@/ds/core';

export default function Motion() {
  const [pulse, setPulse] = React.useState(0);
  const [demoOn, setDemoOn] = React.useState(true);
  return (
    <Section id="motion" num="07" title="Motion" desc="Three durations, one ease — the whole vocabulary. Motion in Eidos confirms actions or guides attention; it never decorates. Every transition respects reduced-motion.">
      <p style={{fontSize:'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', marginBottom: 24, lineHeight: 1.6}}>
        Motion in Eidos is a <b style={{color:'var(--fg)'}}>layer of meaning</b>, not decoration. We use one ease and three durations everywhere, and reserve the ember pulse for the literal "this is live" moments. Hover transitions are short. Surface changes are decisive. Loading states are real progress, never indeterminate spinners. The product moves only when something has changed.
      </p>

      {/* Philosophy */}
      <div className="ds-grid cols-3" style={{marginBottom: 24}}>
        {[
          ['One ease', <>Out-quint <Mono tone="subtle">cubic-bezier(0.16, 1, 0.3, 1)</Mono>. Decisive ramp-up, settled landing. Used on everything.</>],
          ['Three durations', <><Mono tone="subtle">120 / 220 / 360ms</Mono>. Hover · default · enter. Anything outside that scale is a mistake.</>],
          ['Determinate over indeterminate', <>Real progress beats a spinning circle. Show <Mono tone="subtle">64%</Mono>, not &ldquo;loading&hellip;&rdquo;.</>],
        ].map(([t,d]) => (
          <div key={String(t)} className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>{t}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{d}</div>
          </div>
        ))}
      </div>

      {/* Tokens */}
      <SubHead meta="3 durations · 1 ease">Tokens</SubHead>
      <table className="spec">
        <thead><tr><th>Token</th><th>Value</th><th>Use</th></tr></thead>
        <tbody>
          <SpecRow token="--dur-fast" value="120ms" usage="Hover, focus, keyboard press, copy feedback"/>
          <SpecRow token="--dur" value="220ms" usage="Default — buttons, surface hover, theme swap, popover"/>
          <SpecRow token="--dur-slow" value="360ms" usage="Page enter, sidesheet slide-in, modal scrim fade"/>
          <SpecRow token="--ease" value="cubic-bezier(0.16, 1, 0.3, 1)" usage="The only ease. Out-quint. Decisive."/>
          <SpecRow token="--ease-spring" value="cubic-bezier(0.34, 1.56, 0.64, 1)" usage="Reserved for switch thumb, radio dot — small overshoot rewards interaction."/>
        </tbody>
      </table>

      {/* Duration visual */}
      <SubHead meta="visualisation">Duration scale</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Click to replay. Same translate distance, three durations — feel the difference between hover-fast and surface-default.
      </p>
      <Frame label="120 · 220 · 360ms — same translation, three durations">
        <div style={{display:'flex', flexDirection:'column', gap: 16, width:'100%', maxWidth: 480, margin:'0 auto'}}>
          {[120, 220, 360].map((d) => (
            <div key={d} style={{display:'flex', alignItems:'center', gap: 12}}>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--ember)', inlineSize: 64, textAlign:'end', fontVariantNumeric:'tabular-nums'}}>{d}ms</span>
              <div style={{position:'relative', flex: 1, blockSize: 32, background:'var(--bg)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow:'hidden'}}>
                <div
                  key={pulse + '-' + d}
                  className="motion-track-dot"
                  style={{ animation: `motion-track-slide ${d}ms var(--ease) forwards` }}
                />
              </div>
            </div>
          ))}
          <button className="btn xs ghost" style={{alignSelf:'flex-start'}} onClick={() => setPulse(p => p+1)}>Replay <Icons.play size={12}/></button>
        </div>
      </Frame>

      {/* When-to-use map */}
      <SubHead meta="decision">Which duration where</SubHead>
      <table className="spec">
        <thead><tr><th>Surface change</th><th>Duration</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">Button hover · focus</td><td className="mono">120ms</td><td>Cursor is already there — long durations feel laggy.</td></tr>
          <tr><td className="tok-name">Tab indicator slide</td><td className="mono">220ms</td><td>The bar moves with the user's eye; medium duration matches the saccade.</td></tr>
          <tr><td className="tok-name">Theme swap (dark↔light)</td><td className="mono">220ms</td><td>Surfaces, fg, borders all transition together for a single moment.</td></tr>
          <tr><td className="tok-name">Popover open</td><td className="mono">220ms</td><td>Content arrives, eye lands. Fast enough to stay invisible.</td></tr>
          <tr><td className="tok-name">Sidesheet slide-in</td><td className="mono">360ms</td><td>A whole panel arrives — the user needs time to register where it came from.</td></tr>
          <tr><td className="tok-name">Modal scrim fade</td><td className="mono">360ms</td><td>The page recedes; gradual is what makes the modal feel "above".</td></tr>
          <tr><td className="tok-name">Page route change</td><td className="mono">360ms</td><td>Content swap with 8px translate-up; reads as "next view".</td></tr>
          <tr><td className="tok-name">Switch thumb</td><td className="mono">220ms · spring</td><td>Tiny overshoot rewards the interaction — the only place we use spring.</td></tr>
        </tbody>
      </table>

      {/* Live demos */}
      <SubHead meta="live">Live demos</SubHead>
      <div className="ds-grid cols-3">
        <div className="motion-card">
          <div className="label"><span style={{fontSize: 'var(--text-base)', fontWeight: 500}}>Ember pulse</span><code>.ember-pulse</code></div>
          <div className="stage">
            <span className="pill ember ember-pulse"><span className="dot"/>live</span>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Reserved for: in-flight deploys, oncall indicators, the spark in the mark, live data streams. Not for "look at me".</div>
        </div>

        <div className="motion-card">
          <div className="label"><span style={{fontSize: 'var(--text-base)', fontWeight: 500}}>Page enter</span><code>.page-enter</code></div>
          <div className="stage">
            <button className="btn ember" onClick={() => setPulse(p => p+1)}>Replay <Icons.play size={12}/></button>
            <div key={pulse} className="page-enter" style={{position:'absolute', inset: 12, background:'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg-muted)', fontSize: 'var(--text-base)', border: '1px solid var(--border)'}}>
              <span className="ds-h-eyebrow">Catalog</span>
            </div>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Translates <Mono tone="subtle">8px</Mono> and fades. <Mono tone="subtle">360ms</Mono>. On every route change.</div>
        </div>

        <div className="motion-card">
          <div className="label"><span style={{fontSize: 'var(--text-base)', fontWeight: 500}}>Progress / shimmer</span><code>.progress</code></div>
          <div className="stage">
            <div style={{width: '70%'}}>
              <div className="progress"><div style={{width: '64%', animation:'progress 2.6s var(--ease) infinite'}}/></div>
              <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', marginTop: 8, textAlign:'center'}}>building · 64%</div>
            </div>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Determinate progress in ember; never indeterminate spinners.</div>
        </div>

        <div className="motion-card">
          <div className="label"><span style={{fontSize: 'var(--text-base)', fontWeight: 500}}>Switch (spring)</span><code>--ease-spring</code></div>
          <div className="stage">
            <label className="fc">
              <input type="checkbox" role="switch" className="fc-input" checked={demoOn} onChange={() => setDemoOn(s => !s)}/>
              <span className="fc-toggle-track" aria-hidden="true">
                <span className="fc-toggle-thumb"/>
              </span>
              <span className="fc-text">
                <span className="fc-label" style={{fontSize: 'var(--text-base)'}}>Auto-deploy</span>
              </span>
            </label>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Tiny overshoot on the thumb. The only place we use spring — small enough to feel deliberate.</div>
        </div>

        <div className="motion-card">
          <div className="label"><span style={{fontSize: 'var(--text-base)', fontWeight: 500}}>Hover lift</span><code>120ms</code></div>
          <div className="stage">
            <button
              className="btn ember"
              style={{transform:'translateY(0)', transition:'transform 120ms var(--ease)'}}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              onFocus={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onBlur={e => e.currentTarget.style.transform = 'translateY(0)'}
            >Hover or focus me</button>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>1px lift on hover <em>and</em> keyboard focus. The user's hand — or the focus ring — registers it as feedback before the eye does.</div>
        </div>

        <div className="motion-card">
          <div className="label"><span style={{fontSize: 'var(--text-base)', fontWeight: 500}}>Skeleton shimmer</span><code>shimmer</code></div>
          <div className="stage">
            <div style={{width:'70%', display:'flex', flexDirection:'column', gap: 8}}>
              <div className="skl" style={{width:'80%'}}/>
              <div className="skl" style={{width:'60%'}}/>
              <div className="skl" style={{width:'90%'}}/>
            </div>
          </div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Use only when the layout will be the same once data arrives. Otherwise the layout shift is worse than the wait.</div>
        </div>
      </div>

      {/* Anatomy of a transition */}
      <SubHead meta="composition">Anatomy of a transition</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">A button hover · 120ms · 4 phases</span></div>
        <div className="ds-frame-body" style={{padding: 56}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 480, height: 200}} aria-hidden="true">
              {/* Curve visualisation */}
              <svg viewBox="0 0 480 160" width={480} height={160} style={{position:'absolute', inset:'0 0 auto 0'}}>
                {/* axes */}
                <line x1={20} y1={140} x2={460} y2={140} stroke="var(--border)" strokeWidth="1"/>
                <line x1={20} y1={20} x2={20} y2={140} stroke="var(--border)" strokeWidth="1"/>
                {/* out-quint curve */}
                <path d="M 20 140 C 88 90, 220 22, 460 20" fill="none" stroke="var(--ember)" strokeWidth="2"/>
                {/* axis labels */}
                <text x={20} y={156} fill="var(--fg-subtle)" fontSize="11" fontFamily="var(--font-mono)" style={{fontVariantNumeric:'tabular-nums'}}>0ms</text>
                <text x={420} y={156} fill="var(--fg-subtle)" fontSize="11" fontFamily="var(--font-mono)" style={{fontVariantNumeric:'tabular-nums'}}>120ms</text>
                <text x={2} y={140} fill="var(--fg-subtle)" fontSize="11" fontFamily="var(--font-mono)" style={{fontVariantNumeric:'tabular-nums'}}>0%</text>
                <text x={2} y={24} fill="var(--fg-subtle)" fontSize="11" fontFamily="var(--font-mono)" style={{fontVariantNumeric:'tabular-nums'}}>100%</text>
              </svg>
              <span className="lead h" style={{top: 20, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 90, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 140, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 60, right: -28, width: 24}}/>
              <div className="pin" style={{top: 12, left: -52}}>1</div>
              <div className="pin" style={{top: 82, left: -52}}>2</div>
              <div className="pin" style={{top: 52, right: -52}}>3</div>
              <div className="pin" style={{top: 132, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'24px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>End state.</b> The destination — opacity 1, transform 0. Out-quint front-loads progress, so the user reads "done" before the timeline ends.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Inflection.</b> ~50% time, ~85% progress. The eye locks onto the new state here, even though motion technically continues.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Settle.</b> The last 15% of progress over 50% of time. Decisively soft landing — no jitter.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Start.</b> 0ms, 0%. The transition launches with momentum, never with a slow ease-in.</span>
          </div>
        </div>
      </div>

      {/* Reduced motion */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Honour <Mono>prefers-reduced-motion</Mono> for every non-essential animation. The state change still happens — the <em>transition</em> between states drops to a hard cut. Status pulses (<Mono>ember-pulse</Mono>, <Mono>oncall-pulse</Mono>) become a static dot.
      </p>
      <ul style={{margin:'0 0 16px', paddingInlineStart: 18, display:'flex', flexDirection:'column', gap: 6, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'72ch', lineHeight: 1.6}}>
        <li><b style={{color:'var(--fg)'}}>Motion is never the only signal.</b> A pulsing dot also carries a text label (<Mono>live</Mono>, <Mono>deploying</Mono>); progress also shows a numeric percent. Nothing relies on animation alone to convey state.</li>
        <li><b style={{color:'var(--fg)'}}>Contrast holds at rest.</b> When motion is suppressed the resting frame must still pass AA — the ember dot on <Mono>--ember-soft</Mono> and the 64% fill on the track read at full contrast with no animation.</li>
        <li><b style={{color:'var(--fg)'}}>Vestibular safety.</b> Translate and scale animations are the riskiest; under reduced-motion they collapse to opacity-only or a hard cut, never a swooping move.</li>
      </ul>
      <SubHead meta="keyboard">Keyboard &amp; ARIA — interactive demos</SubHead>
      <table className="spec">
        <thead><tr><th>Control</th><th>Key</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">Replay button</td><td className="mono">Enter · Space</td><td>Re-runs the duration-scale / page-enter animation. Native <code style={{fontFamily:'var(--font-mono)'}}>{'<button>'}</code> — focus-visible ring, no <code style={{fontFamily:'var(--font-mono)'}}>outline:none</code>.</td></tr>
          <tr><td className="tok-name">Auto-deploy switch</td><td className="mono">Space</td><td>Toggles the spring-thumb demo. <code style={{fontFamily:'var(--font-mono)'}}>{'<input role="switch">'}</code> exposes checked state to AT; the visual track is <code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code>.</td></tr>
          <tr><td className="tok-name">Hover-lift button</td><td className="mono">Tab</td><td>A real <code style={{fontFamily:'var(--font-mono)'}}>{'<button>'}</code> — focusing it mirrors the hover lift via <code style={{fontFamily:'var(--font-mono)'}}>onFocus</code>/<code style={{fontFamily:'var(--font-mono)'}}>onBlur</code>, so the feedback is identical for pointer and keyboard.</td></tr>
          <tr><td className="tok-name">Ember pulse / shimmer</td><td className="mono">—</td><td>Decorative only — never the sole carrier of state, so they are not in the tab order and AT skips them.</td></tr>
        </tbody>
      </table>
      <Frame label="reduced-motion behaviour" lang="css" code={`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .ember-pulse { box-shadow: 0 0 0 0 rgba(255,107,53,0.5) !important; }
}`}>
        <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6}}>
          All durations collapse to 0.01ms; the state still flips but the eye doesn't track motion. Pulses freeze in their resting state.
        </div>
      </Frame>

      {/* Keyframes library */}
      <SubHead meta="vocabulary">Keyframes</SubHead>
      <Frame label="Keyframe library" lang="css" code={`@keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes ember-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0.5); }
  50% { box-shadow: 0 0 0 6px rgba(255,107,53,0); }
}
@keyframes oncall-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.6); }
  50% { box-shadow: 0 0 0 4px rgba(251,191,36,0); }
}
@keyframes sheet-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes progress { from { width: 0%; } to { width: 100%; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}>
        <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6}}>
          Six keyframes carry the entire system. <Mono>fade-in</Mono> + <Mono>page-enter</Mono> for content; <Mono>ember-pulse</Mono> + <Mono>oncall-pulse</Mono> for live status; <Mono>sheet-in</Mono> for floating layers.
        </div>
      </Frame>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pulse only on live work</div>
          <div className="body" style={{flexDirection:'column', gap: 8, alignItems:'flex-start', padding: 14}}>
            <span className="pill ember ember-pulse"><span className="dot"/>deploying</span>
            <span className="pill success"><span className="dot"/>healthy</span>
          </div>
          <div className="note">Pulse means motion is happening. A green "healthy" service isn't pulsing — it's at rest.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — pulse decoratively</div>
          <div className="body" style={{flexDirection:'column', gap: 8, alignItems:'flex-start', padding: 14}}>
            <span className="pill ember ember-pulse"><span className="dot"/>v4.18</span>
            <span className="pill ember ember-pulse"><span className="dot"/>new</span>
          </div>
          <div className="note">If everything pulses, nothing communicates "live". The pulse stops meaning anything.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — determinate progress</div>
          <div className="body" style={{flexDirection:'column', gap: 8, alignItems:'flex-start', padding: 14}}>
            <div style={{width:'100%'}}>
              <div className="progress"><div style={{width:'64%'}}/></div>
              <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', marginTop: 6}}>uploading · 64% · 2.1MB / 3.3MB</div>
            </div>
          </div>
          <div className="note">Real progress + real numbers. The user knows what's happening and how much is left.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — indeterminate spinners</div>
          <div className="body" style={{flexDirection:'column', gap: 8, padding: 14}}>
            <div style={{inlineSize: 32, blockSize: 32, border:'3px solid var(--border-strong)', borderBlockStartColor:'var(--ember)', borderRadius:'50%', animation:'ds-spin 1s linear infinite'}}/>
            <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>loading...</span>
          </div>
          <div className="note">A spinner says "we have no idea how long this will take". Show a percentage or a step count if you can.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one ease everywhere</div>
          <div className="body" style={{padding: 14}}>
            <pre className="t-mono" style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.6}}>
{`transition: all var(--dur)
            var(--ease);`}
            </pre>
          </div>
          <div className="note">Out-quint on every component. The whole product moves with one rhythm.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — invent eases per component</div>
          <div className="body" style={{padding: 14}}>
            <pre className="t-mono" style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.6}}>
{`transition: all 240ms
  cubic-bezier(.5,0,.7,.4);`}
            </pre>
          </div>
          <div className="note">Custom curves per component fragment the feel. Stick to <code style={{fontFamily:'var(--font-mono)'}}>--ease</code>.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — honour reduced-motion</div>
          <div className="body" style={{padding: 14}}>
            <pre className="t-mono" style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.6}}>
{`@media (prefers-
  reduced-motion: reduce) {
  * { transition-duration:
      0.01ms !important; }
}`}
            </pre>
          </div>
          <div className="note">State changes still happen — only the motion is suppressed. Required for vestibular-disorder users.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — animate "look at me" entries</div>
          <div className="body" style={{padding: 14, flexDirection:'column', gap: 8, alignItems:'flex-start'}}>
            <div style={{padding: 10, background:'var(--ember-soft)', color:'var(--fg)', borderRadius: 'var(--radius-lg)', animation:'pulse-bounce 1.4s var(--ease) infinite', fontSize: 'var(--text-base)'}}>
              ✨ NEW FEATURE
            </div>
          </div>
          <div className="note">Bouncing badges, sparkles, swelling pills — all marketing tropes. Eidos announces with copy, not animation.</div>
        </div>
      </div>
    </Section>
  );
}
