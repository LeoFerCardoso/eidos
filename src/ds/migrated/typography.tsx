'use client';
// Forge DS — Foundations / Typography (Geist + Geist Mono)
import { Icons, Frame, Section, SubHead, Lede, Mono } from '@/ds/core';

export default function Typography() {
  return (
    <Section id="typography" num="03" title="Typography" desc="Two families, nothing else — Geist Sans for UI and body, Geist Mono for numerics, captions, and eyebrows. Tabular figures keep changing numbers from dancing on update.">
      <Lede>
        Two families do all the work. <b style={{color:'var(--fg)'}}>Geist</b> for prose and UI; <b style={{color:'var(--fg)'}}>Geist Mono</b> for identifiers, metrics, code, and tabular numerics. Both ship with <Mono>cv11</Mono> + <Mono>ss01</Mono> stylistic sets enabled, and <Mono>tnum</Mono> + <Mono>zero</Mono> on every monospace usage so digits stay aligned and the slashed-zero is unambiguous.
      </Lede>

      {/* Philosophy cards */}
      <div className="ds-grid cols-3" style={{marginBottom: 24}}>
        {[
          ['Two families, no exceptions', 'No serifs, no decorative faces. Geist + Geist Mono carry the entire system.'],
          ['Sans names · mono measures', 'Names of things → sans. Numbers, IDs, hashes, code → mono. The split makes data scannable.'],
          ['Tight tracking on display', 'Display sizes use -0.02 to -0.04em tracking. Body and small stay at 0 — never tighten body.'],
        ].map(([t,d]) => (
          <div key={t} className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>{t}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{d}</div>
          </div>
        ))}
      </div>

      {/* Stacks */}
      <SubHead meta="2 families">Stacks</SubHead>
      <div className="ds-grid cols-2">
        <div className="surface" style={{padding: 18}}>
          <div className="t-mono-label">--font-sans</div>
          <div style={{fontSize: 'var(--text-display)', marginTop: 8, letterSpacing: '-0.02em', fontWeight: 600, lineHeight: 1.05}}>Geist</div>
          <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', marginTop: 8, lineHeight: 1.5}}>'Geist', 'Inter', -apple-system, system-ui, sans-serif</div>
          <div style={{borderTop:'1px solid var(--border)', paddingTop: 12, marginTop: 14, fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>
            Variable axis from 100 to 900. We use 400 (body), 500 (UI controls), 600 (display, headings).
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-mono-label">--font-mono</div>
          <div style={{fontSize: 'var(--text-display)', marginTop: 8, fontFamily:'var(--font-mono)', letterSpacing: '-0.01em', fontWeight: 500, lineHeight: 1.05}}>Geist Mono</div>
          <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', marginTop: 8, lineHeight: 1.5}}>'Geist Mono', 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace</div>
          <div style={{borderTop:'1px solid var(--border)', paddingTop: 12, marginTop: 14, fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>
            Use 400 for code, 500 for tabular numerics in tables and metrics, no 600 — display is always sans.
          </div>
        </div>
      </div>

      {/* Type scale */}
      <SubHead meta="9 steps">Scale</SubHead>
      <Lede up>
        Nine canonical sizes. Headings use 600 weight with negative tracking to read as a system family; body and small stay at 400 with neutral tracking for legibility.
      </Lede>
      <div className="surface" style={{padding: '4px 22px'}}>
        {[
          ['t-display-xl','Forge platform.', '4.5rem / 72px', '1.02', '600', '-0.04em'],
          ['t-display-lg','Ship safely. Faster.', '3.5rem / 56px', '1.05', '600', '-0.03em'],
          ['t-h1','Service catalog', '2.25rem / 36px', '1.15', '600', '-0.02em'],
          ['t-h2','Open GMUDs', '1.75rem / 28px', '1.2', '600', '-0.02em'],
          ['t-h3','Recent deploys', '1.25rem / 20px', '1.3', '500', '-0.01em'],
          ['t-body-lg','Body large — used for ledes and section intros, sits between H3 and body.', '1.0625rem / 17px', '1.55', '400', '0'],
          ['t-body','Body — the workhorse. 15px base. Used for descriptions, table cells, sidesheets.', '0.9375rem / 15px', '1.55', '400', '0'],
          ['t-small','Small — secondary metadata, helper text, captions.', '0.8125rem / 13px', '1.5', '400', '0'],
          ['t-mono-label','MONOSPACE LABEL · 11PX · UPPERCASE', '0.6875rem / 11px', '1', '500', '0.08em'],
        ].map(row => (
          <div key={row[0]} className="type-row">
            <div className={'sample ' + row[0]} style={{ fontFamily: row[0]==='t-mono-label' ? 'var(--font-mono)' : undefined }}>{row[1]}</div>
            <div className="specs">
              <div><b>{row[0]}</b></div>
              <div>size {row[2]}</div>
              <div>line {row[3]} · weight {row[4]} · track {row[5]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* When-to-use map */}
      <SubHead meta="usage">Where each step lives</SubHead>
      <table className="spec">
        <thead><tr><th>Token</th><th>Where</th><th>Pair</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">t-display-xl</td><td>Marketing hero. Once per page.</td><td className="mono">+ no eyebrow needed</td></tr>
          <tr><td className="tok-name">t-display-lg</td><td>Onboarding step title, splash modal title.</td><td className="mono">+ t-body-lg lede</td></tr>
          <tr><td className="tok-name">t-h1</td><td>Page title in product chrome.</td><td className="mono">+ t-mono-label eyebrow</td></tr>
          <tr><td className="tok-name">t-h2</td><td>Section title.</td><td className="mono">+ t-small description</td></tr>
          <tr><td className="tok-name">t-h3</td><td>Card title, sub-section.</td><td className="mono">+ t-small description</td></tr>
          <tr><td className="tok-name">t-body-lg</td><td>Lede paragraph below display headings.</td><td className="mono">→ t-body for paragraphs</td></tr>
          <tr><td className="tok-name">t-body</td><td>Default paragraph, table cells, descriptions.</td><td className="mono">+ t-mono for numerics</td></tr>
          <tr><td className="tok-name">t-small</td><td>Helper text, captions, footer metadata.</td><td className="mono">+ t-mono-label for labels</td></tr>
          <tr><td className="tok-name">t-mono-label</td><td>Eyebrows above titles, table column headers.</td><td className="mono">→ t-h1 / t-h2</td></tr>
        </tbody>
      </table>

      {/* Mono usage */}
      <SubHead meta="numbers, identifiers">Mono usage</SubHead>
      <Lede up>
        Mono is reserved for things you'd grep for: identifiers (forge-api), versions (v4.18.2), measurements (142ms), hashes (a3f9b2), and inline code. <Mono>tnum</Mono> + <Mono>zero</Mono> are always on, so columns stay aligned through state changes and the digit zero never reads as "O".
      </Lede>
      <Frame label="metrics with t-mono + tnum" code={`<span className="t-mono-label">P95 LATENCY</span>
<span className="t-mono">142ms</span>
<span className="t-mono">v4.18.2</span>`}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 22, width:'100%'}}>
          {[
            ['p95 latency', '142ms', 'var(--fg)'],
            ['version', 'v4.18.2', 'var(--fg)'],
            ['deploys today', '+147', 'var(--ember)'],
            ['uptime', '99.94%', 'var(--success)'],
          ].map(([label, value, color]) => (
            <div key={label}>
              <div className="t-mono-label" style={{padding: 0, marginBottom: 6}}>{label}</div>
              <div className="t-mono" style={{fontSize: 'var(--text-2xl)', color, fontVariantNumeric:'tabular-nums'}}>{value}</div>
            </div>
          ))}
        </div>
      </Frame>

      {/* Mono in code */}
      <SubHead meta="code blocks">Code & inline</SubHead>
      <Frame label="inline code · code block" code={`Use <code>--ember</code> for primary actions.

\`\`\`bash
$ npm i @forge/design-system
\`\`\``}>
        <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 540}}>
          <div style={{fontSize: 'var(--text-md)', color:'var(--fg)', lineHeight: 1.6}}>
            Use <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)', background:'var(--ember-soft)', padding:'2px 6px', borderRadius: 'var(--radius-sm)'}}>--ember</code> for primary actions.
          </div>
          <pre style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', background:'var(--bg)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 14, margin: 0, lineHeight: 1.5}}>
{`$ npm i @forge/design-system
+ @forge/design-system@4.18.2
+ added 1 package in 1.4s`}
          </pre>
        </div>
      </Frame>

      {/* Tabular alignment demonstration */}
      <SubHead meta="tnum">Tabular numerics in tables</SubHead>
      <Frame label="tnum on, tnum off — count the misalignment">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24, width:'100%'}}>
          <div>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>tnum on (correct)</div>
            <table style={{width:'100%', fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', fontVariantNumeric:'tabular-nums'}}>
              <tbody>
                <tr><td style={{color:'var(--fg-muted)', padding:'4px 0'}}>forge-api</td><td style={{textAlign:'right', color:'var(--fg)'}}>142ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)', padding:'4px 0'}}>forge-shipper</td><td style={{textAlign:'right', color:'var(--fg)'}}>1,420ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)', padding:'4px 0'}}>forge-ledger</td><td style={{textAlign:'right', color:'var(--fg)'}}>21ms</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>tnum off (misaligned)</div>
            <table style={{width:'100%', fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', fontVariantNumeric:'normal'}}>
              <tbody>
                <tr><td style={{color:'var(--fg-muted)', padding:'4px 0'}}>forge-api</td><td style={{textAlign:'right', color:'var(--fg)'}}>142ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)', padding:'4px 0'}}>forge-shipper</td><td style={{textAlign:'right', color:'var(--fg)'}}>1,420ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)', padding:'4px 0'}}>forge-ledger</td><td style={{textAlign:'right', color:'var(--fg)'}}>21ms</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </Frame>

      {/* Headline + lede pairing */}
      <SubHead meta="composition">Headline + lede</SubHead>
      <Lede up>
        The eyebrow + heading + lede stack is the canonical page-opener. Eyebrow names the section, heading carries the verb, lede expands in one sentence.
      </Lede>
      <Frame label="t-mono-label · t-h1 · t-body-lg">
        <div style={{maxWidth: 560}}>
          <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>Service catalog · Section</div>
          <div className="t-h1" style={{marginBottom: 10}}>Service catalog</div>
          <div className="t-body-lg" style={{color:'var(--fg-muted)', lineHeight: 1.55}}>The single registry of every service Forge runs. Click a service to see its SLOs, oncall, runbook, and the last 30 deploys.</div>
        </div>
      </Frame>

      {/* Anatomy of a heading */}
      <SubHead meta="composition">Anatomy of a heading</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Heading + eyebrow + lede</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 480}} aria-hidden="true">
              <div>
                <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>Eyebrow · 11px mono</div>
                <div style={{fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.15, marginBottom: 10}}>Heading title</div>
                <div style={{fontSize: 'var(--text-lg)', color:'var(--fg-muted)', lineHeight: 1.55}}>Lede sentence in body-large explaining the section in one breath.</div>
              </div>
              <span className="lead h" style={{top: 8, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 50, left: -28, width: 24}}/>
              <span className="lead h" style={{bottom: 22, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 50, right: -28, width: 24}}/>
              <div className="pin" style={{top: 0, left: -52}}>1</div>
              <div className="pin" style={{top: 42, left: -52}}>2</div>
              <div className="pin" style={{bottom: 14, left: -52}}>3</div>
              <div className="pin" style={{top: 42, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Eyebrow.</b> 11px Geist Mono 500, 0.08em letter-spacing, uppercase. Names the section. Always above the heading.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Heading.</b> Geist 600 with -0.02em tracking. Tracking tightens at larger sizes.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Lede.</b> 17px Geist 400 in <Mono>--fg-muted</Mono>. One sentence. Sets expectations for the section.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Negative tracking.</b> Display sizes get -0.02 to -0.04em — large type loosens optically and needs to be pulled back.</span>
          </div>
        </div>
      </div>

      {/* Vertical rhythm */}
      <SubHead meta="rhythm">Vertical rhythm</SubHead>
      <Lede up>
        Section spacing follows a 4 / 8 / 16 / 24 / 40 / 64 ramp. Headings stick close to their lede (gap = 10–14px); ledes sit further from the next section (gap = 24–40px). The asymmetry binds the heading to its content.
      </Lede>
      <Frame label="title → lede (close) → next section (far)">
        <div style={{maxWidth: 480}}>
          <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>Operations</div>
          <div style={{fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing:'-0.02em', marginBottom: 10}}>Open GMUDs</div>
          <div style={{fontSize: 'var(--text-md)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 40}}>Three queued, two awaiting approval, one in flight.</div>
          <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>Operations</div>
          <div style={{fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing:'-0.02em', marginBottom: 10}}>Recent deploys</div>
          <div style={{fontSize: 'var(--text-md)', color:'var(--fg-muted)', lineHeight: 1.55}}>21 in the last 24 hours, all green.</div>
        </div>
      </Frame>

      {/* RTL */}
      <SubHead meta="bidi">RTL</SubHead>
      <Lede up>
        Geist supports Latin, Latin-extended, and Vietnamese natively. For Arabic / Hebrew, the font stack falls back to system Arabic — alignment is handled with logical properties (<Mono>text-align: start</Mono>), never <Mono>left</Mono> / <Mono>right</Mono>.
      </Lede>
      <Frame label='dir="rtl" — heading + lede flip naturally'>
        <div dir="rtl" style={{maxWidth: 560}}>
          <div className="t-mono-label" style={{padding: 0, marginBottom: 8, fontFamily:'var(--font-mono)'}}>كتالوج الخدمات</div>
          <div style={{fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.15, marginBottom: 10}}>كتالوج الخدمات</div>
          <div style={{fontSize: 'var(--text-lg)', color:'var(--fg-muted)', lineHeight: 1.65}}>السجل الموحد لكل خدمة تشغلها فورج. انقر على الخدمة لعرض اتفاقيات مستوى الخدمة، والمناوبة، ودليل التشغيل.</div>
        </div>
      </Frame>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Minimum sizes &amp; line length</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Body copy holds at 14px or larger; the smallest mono caption / eyebrow stays at 11–12px and is never the carrier of essential prose. Measures cap around 60–75 characters so lines don&apos;t fatigue the eye.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Resize &amp; reflow</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The scale is rem-based, so text honours the user&apos;s browser font size and survives 200% zoom without clipping (WCAG 1.4.4). Line-height (1.5+ for body) is preserved so scaled text stays readable.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast &amp; weight</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every step&apos;s default colour meets AA on its surface — <Mono>--fg</Mono> for body, <Mono>--fg-muted</Mono> for secondary, <Mono>--fg-faint</Mono> only for large or non-essential text. Hierarchy comes from size and weight, never colour alone.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Semantics &amp; RTL</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A type step is a visual role, not a document outline — map headings to real <Mono>{'<h1>'}</Mono>–<Mono>{'<h6>'}</Mono> in order so screen readers get the structure. <Mono>text-align: start</Mono> and logical spacing keep the rhythm correct under RTL.</div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair Geist with Geist Mono</div>
          <div className="body" style={{flexDirection:'column', gap:6}}>
            <div style={{fontSize: 'var(--text-xl)', fontWeight:600, letterSpacing:'-0.02em'}}>identity-svc</div>
            <div className="t-mono" style={{color:'var(--fg-subtle)'}}>v4.18.2 · p95 142ms</div>
          </div>
          <div className="note">Sans for naming, mono for measurement. The split makes data scannable.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — mix decorative fonts</div>
          <div className="body" style={{flexDirection:'column', gap: 6}}>
            <div style={{fontSize: 'var(--text-xl)', fontFamily:'serif', fontStyle:'italic'}}>identity-svc</div>
            <div style={{fontFamily:'cursive', fontSize: 'var(--text-md)', color:'var(--fg-subtle)'}}>p95 142ms</div>
          </div>
          <div className="note">Forge ships only Geist + Geist Mono. Don't introduce serifs or display faces.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — tabular numerics in tables</div>
          <div className="body">
            <table style={{width:'100%', maxWidth: 220, fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', fontVariantNumeric:'tabular-nums'}}>
              <tbody>
                <tr><td style={{color:'var(--fg-muted)'}}>p50</td><td style={{textAlign:'right'}}>12ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)'}}>p95</td><td style={{textAlign:'right'}}>142ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)'}}>p99</td><td style={{textAlign:'right'}}>1,420ms</td></tr>
              </tbody>
            </table>
          </div>
          <div className="note">tnum keeps decimal points and digit columns aligned. Required for any value the user compares.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — proportional digits in tables</div>
          <div className="body">
            <table style={{width:'100%', maxWidth: 220, fontFamily:'var(--font-sans)', fontSize: 'var(--text-base)'}}>
              <tbody>
                <tr><td style={{color:'var(--fg-muted)'}}>p50</td><td style={{textAlign:'right'}}>12ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)'}}>p95</td><td style={{textAlign:'right'}}>142ms</td></tr>
                <tr><td style={{color:'var(--fg-muted)'}}>p99</td><td style={{textAlign:'right'}}>1,420ms</td></tr>
              </tbody>
            </table>
          </div>
          <div className="note">Sans-proportional digits are different widths — column reads jagged.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — eyebrow + heading + lede</div>
          <div className="body" style={{flexDirection:'column', gap:8, alignItems:'flex-start', padding: 16}}>
            <div className="t-mono-label" style={{padding: 0}}>Operations</div>
            <div style={{fontSize: 'var(--text-xl)', fontWeight:600, letterSpacing:'-0.02em'}}>Open GMUDs</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Three queued, two awaiting approval.</div>
          </div>
          <div className="note">The eyebrow names the section, the heading carries the verb, the lede expands in one sentence.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — bare heading with no context</div>
          <div className="body" style={{flexDirection:'column', gap: 8, alignItems:'flex-start', padding: 16}}>
            <div style={{fontSize: 'var(--text-xl)', fontWeight:600, letterSpacing:'-0.02em'}}>Open GMUDs</div>
          </div>
          <div className="note">Without an eyebrow or lede, the user can't tell where the page ends and the section begins.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — neutral tracking on body</div>
          <div className="body" style={{padding: 16}}>
            <div style={{fontSize: 'var(--text-md)', lineHeight: 1.55, letterSpacing: 0, color:'var(--fg-muted)', maxWidth: 280}}>
              Build green. p95 latency dropped 18% after the cache warmer rollout — within SLO for the first time this quarter.
            </div>
          </div>
          <div className="note">Tracking 0 at body sizes. Tightening below that hurts legibility at small sizes.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — tighten body tracking</div>
          <div className="body" style={{padding: 16}}>
            <div style={{fontSize: 'var(--text-md)', lineHeight: 1.55, letterSpacing: '-0.02em', color:'var(--fg-muted)', maxWidth: 280}}>
              Build green. p95 latency dropped 18% after the cache warmer rollout — within SLO for the first time this quarter.
            </div>
          </div>
          <div className="note">Negative tracking on body letters them blur into each other.</div>
        </div>
      </div>
    </Section>
  );
}
