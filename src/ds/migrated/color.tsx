'use client';
// Eidos DS — Foundations / Color (six families, one accent)
import { Section, SubHead, TokenSwatch, CopyButton, Frame, Mono, Kbd, Icons } from '@/ds/core';

// Every token value, ratio, and metric on this page is a number that must
// align across rows — so each mono/value span opts into tabular figures.
const TNUM: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };
const monoTok: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ember)', fontVariantNumeric: 'tabular-nums' };
const monoFaint: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' };

export default function Color() {
  /* Surfaces — canonical 7-tier ladder (Eidos v1.1). Order goes from
     deepest (canvas, behind floating layers) to lightest (active). The
     swatches pull live from CSS so flipping the theme updates them. */
  const surfaces = [
    ['Canvas',             '--canvas',          'oklch(0.13 0.005 60)',  'oklch(0.93 0.003 75)',  'Deepest — only behind floating layers (modal/sidesheet backdrop).'],
    ['Background',         '--bg',              'oklch(0.165 0.006 60)', 'oklch(0.97 0.003 75)',  'Page background. Not pure black.'],
    ['Background elevated','--bg-elevated',     'oklch(0.2 0.006 60)',   'oklch(0.995 0.001 75)', 'Topbar zone, sidebar, code well inside a frame.'],
    ['Surface',            '--surface',         'oklch(0.235 0.007 60)', 'oklch(1 0 0)',          'Default card / frame container.'],
    ['Surface hover',      '--surface-hover',   'oklch(0.275 0.008 60)', 'oklch(0.965 0.003 75)', 'Row hover, button hover.'],
    ['Surface overlay',    '--surface-overlay', 'oklch(0.255 0.007 60)', 'oklch(1 0 0)',          'Floating layers (command palette, sidesheet, modal).'],
    ['Surface active',     '--surface-active',  'oklch(0.32 0.009 60)',  'oklch(0.935 0.004 75)', 'Selected / pressed.'],
  ];
  const fg = [
    ['Foreground',        '--fg',        '#F2EEE8', '#0E0C09', 'Primary text. Titles, body.'],
    ['Foreground muted',  '--fg-muted',  '#A8A39B', '#595550', 'Descriptions, helper, captions.'],
    ['Foreground subtle', '--fg-subtle', '#756F66', '#78736D', 'Metadata, placeholders, disabled.'],
    ['Foreground faint',  '--fg-faint',  '#524C44', '#A8A39B', 'Decorative only — never required reading.'],
  ];
  const accents = [
    ['Ember',      '--ember',      '#FF6B35', '#E85A28'],
    ['Ember glow', '--ember-glow', '#FF8C42', '#FF6B35'],
    ['Ember deep', '--ember-deep', '#E04E1A', '#C24A1F'],
    ['Ice',        '--ice',        '#7DD3FC', '#0EA5E9'],
    ['Violet',     '--violet',     '#A78BFA', '#7C3AED'],
  ];
  const status = [
    ['Success', '--success', '#34D399', '#059669'],
    ['Warning', '--warning', '#FBBF24', '#D97706'],
    ['Danger',  '--danger',  '#F87171', '#DC2626'],
  ];
  return (
    <Section id="color" num="02" title="Color" desc="Semantic, theme-driven palette in OKLCH — a seven-tier surface ladder, four foreground steps, the single theme-driven accent, and a success / warning / danger trio. Tokens name a role, never a hue.">
      <p style={{color:'var(--fg-muted)', maxWidth:'68ch', marginBottom: 22, lineHeight: 1.6}}>
        Eidos v1.1 redefines the surface scale in <b style={{color:'var(--fg)'}}>OKLCH</b> with a subtle warm undertone (~60° hue, very low chroma). The page background is <b style={{color:'var(--fg)'}}>not pure black</b> — true black is reserved for <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--canvas</code>, used only behind floating layers so the modal/sidesheet feels lifted. Seven tiers from canvas to overlay let UI compose real depth even in dark mode. The severity / run-status / health / risk vocabularies live on their own pages.
      </p>

      {/* Philosophy */}
      <div className="ds-grid cols-3" style={{marginBottom: 24}}>
        {[
          ['Semantic, not literal', 'Tokens name a role (--fg-muted), not a hue (--gray-400). Theme switching costs zero per-component work.'],
          ['One accent', 'The accent — ember in Forge, violet in Iris — is reserved for primary action, focus, active nav, the spark, and T1 highlights. Nothing else.'],
          ['Hairlines only', 'No 2px borders, no shadows on cards. Separation comes from a 6%–18% border on a darker surface.'],
        ].map(([t,d]) => (
          <div key={t} className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>{t}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{d}</div>
          </div>
        ))}
      </div>

      {/* Surface scale with usage */}
      <SubHead meta={surfaces.length+' tokens'}>Surface scale</SubHead>
      <div className="ds-grid cols-2">
        {surfaces.map(([name,v,darkVal,lightVal,usage]) => (
          <div key={v} className="surface" style={{padding: 0, overflow:'hidden'}}>
            <div style={{
              height: 64,
              background: `var(${v})`,
              borderBottom:'1px solid var(--border)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)',
              color:'var(--fg-faint)', letterSpacing:'0.08em',
            }}>swatch · live</div>
            <div style={{padding: 14}}>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 12, marginBottom: 6}}>
                <span style={{fontWeight: 600, fontSize: 'var(--text-md)'}}>{name}</span>
                <span style={monoTok}>{v}</span>
              </div>
              <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>{usage}</div>
              <div style={{...monoFaint, marginTop: 8, display:'flex', gap: 14, flexWrap:'wrap'}}>
                <span>dark · {darkVal}</span>
                <span>light · {lightVal}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Elevation visualization */}
      <SubHead meta="layering">Elevation in practice</SubHead>
      <Frame label="canvas → bg → bg-elevated → surface → hover → overlay → active">
        <div style={{display:'flex', flexDirection:'column', gap: 0, width:'100%', maxWidth: 560, margin:'0 auto', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden'}}>
          {surfaces.map(([name, tok, , , usage], i) => (
            <div key={tok} style={{
              background: `var(${tok})`,
              padding:'14px 18px',
              borderTop: i ? '1px solid var(--border)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              fontSize: 'var(--text-base)'
            }}>
              <span style={{color:'var(--fg)', fontWeight: 500}}>{name}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontVariantNumeric:'tabular-nums'}}>{tok}</span>
            </div>
          ))}
        </div>
      </Frame>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth:'64ch'}}>
        Each step is +2–3 lightness in OKLCH. The eye reads the difference as elevation; pair it with a hairline and a shadow only when the element <i>truly</i> floats.
      </p>

      {/* Foreground */}
      <SubHead meta={fg.length+' tokens · 4-step hierarchy'}>Foreground</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Four levels of text emphasis. Pick one per role and stick with it — mixing fg-muted and fg-subtle in a single sentence creates noise.
      </p>
      <div className="ds-grid cols-2">
        {fg.map(([name,v,darkVal,lightVal,usage]) => (
          <div key={v} className="surface" style={{padding: 16}}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 12, marginBottom: 8}}>
              <span style={{color: `var(${v})`, fontSize: 'var(--text-md)', fontWeight: 500}}>The ember stays cool.</span>
              <span style={monoTok}>{v}</span>
            </div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5, marginBottom: 8}}><b style={{color:'var(--fg)'}}>{name}</b> · {usage}</div>
            <div style={{...monoFaint, display:'flex', gap: 14, flexWrap:'wrap'}}>
              <span>dark · {darkVal}</span>
              <span>light · {lightVal}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Accent scale — theme-driven */}
      <SubHead meta="theme-driven">The accent (one per theme)</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        One accent, swapped by the active theme. Components never name a hue — they reach for <Mono>--accent</Mono>, an alias of the theme&rsquo;s <Mono>--ember</Mono>, so every CTA, focus ring, active-nav bar and spark re-colours at once. <b style={{color:'var(--fg)'}}>Forge</b> ships ember; the <b style={{color:'var(--fg)'}}>Iris</b> theme swaps it for violet. Flip the theme in the topbar — the scale below recolours live. The two soft variants are tinted overlays for halos, hover surfaces, and selection backgrounds where the full-strength accent would be too loud.
      </p>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Accent scale · active theme</span><CopyButton text={'/* Components use the theme-neutral alias … */\n--accent: var(--ember);\n\n/* … the active theme defines the ramp. Forge ships: */\n--ember: #FF6B35;\n--ember-glow: #FF8C42;\n--ember-deep: #E04E1A;\n--ember-soft: rgba(255,107,53,0.14);\n--ember-softer: rgba(255,107,53,0.07);'}/></div>
        <div className="ds-frame-body">
          <div className="scale-bar">
            <div className="sb-deep">deep</div>
            <div className="sb-ember">accent</div>
            <div className="sb-glow">glow</div>
            <div style={{background:'var(--ember-soft)', color:'var(--fg)'}}>soft</div>
            <div style={{background:'var(--ember-softer)', color:'var(--fg-muted)'}}>softer</div>
          </div>
          <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, lineHeight: 1.6}}>
            Use the full accent for: <b style={{color:'var(--fg)'}}>primary CTA</b>, <b style={{color:'var(--fg)'}}>active nav indicator</b>, <b style={{color:'var(--fg)'}}>focus ring</b>, <b style={{color:'var(--fg)'}}>the spark</b>, <b style={{color:'var(--fg)'}}>T1 service highlights</b>. Use soft for selection halos, current-row tints, and hover backgrounds. Nothing else — and because they all resolve through <Mono>--accent</Mono>, the whole set re-themes together.
          </div>
        </div>
      </div>

      {/* Accent surfaces in context */}
      <SubHead meta="accent at work">Where the accent lives</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        The focus ring below is <b style={{color:'var(--fg)'}}>real</b>, not painted on — press <Kbd>Tab</Kbd> into this
        preview and the ember <Mono>--ring</Mono> halo appears on keyboard focus only (a mouse click leaves it off, by
        design). That is the single accent doing four jobs: primary action, keyboard focus, active nav, and the T1 spark.
      </p>
      <Frame label="primary CTA · live focus ring · active nav · selected row">
        <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 480, margin:'0 auto'}}>
          <button className="btn ember">Deploy <Icons.rocket size={14}/></button>
          <input
            type="text"
            aria-label="Tab here to see the live ember focus ring"
            placeholder="Tab into me — the ember ring is keyboard-only"
            style={{height: 36, padding:'0 12px', borderRadius: 'var(--radius-lg)', background:'var(--surface)', border:'1px solid var(--border-strong)', color:'var(--fg)', fontSize: 'var(--text-base)', width:'100%'}}
          />
          <div role="tablist" aria-label="Section nav" style={{display:'flex', flexDirection:'column', gap: 0, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden'}}>
            <button role="tab" aria-selected="false" type="button" style={{textAlign:'start', background:'transparent', border:'none', cursor:'pointer', padding:'10px 14px', fontSize: 'var(--text-base)', color:'var(--fg-muted)', borderBottom:'1px solid var(--border)'}}>Overview</button>
            <button role="tab" aria-selected="true" aria-current="page" type="button" style={{textAlign:'start', cursor:'pointer', padding:'10px 14px', fontSize: 'var(--text-base)', color:'var(--ember)', background:'var(--ember-soft)', border:'none', borderInlineStart:'2px solid var(--ember)', borderBottom:'1px solid var(--border)'}}>Services <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>· active</span></button>
            <button role="tab" aria-selected="false" type="button" style={{textAlign:'start', background:'transparent', border:'none', cursor:'pointer', padding:'10px 14px', fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Settings</button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 0, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden', fontSize: 'var(--text-base)'}}>
            <div style={{padding:'8px 12px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between'}}><span>eidos-api</span><span style={{fontFamily:'var(--font-mono)', color:'var(--fg-muted)', fontSize: 'var(--text-xs)', fontVariantNumeric:'tabular-nums'}}>p95 12ms</span></div>
            <div style={{padding:'8px 12px', background:'var(--ember-softer)', display:'flex', justifyContent:'space-between'}}><span>eidos-shipper <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>· T1</span></span><span style={{fontFamily:'var(--font-mono)', color:'var(--fg-muted)', fontSize: 'var(--text-xs)', fontVariantNumeric:'tabular-nums'}}>p95 8ms</span></div>
          </div>
        </div>
      </Frame>

      {/* RTL — the logical-property claim, demonstrated not asserted. The active-nav
          accent rides on border-inline-start, so under dir="rtl" it flips to the
          trailing (now visual-left) edge with zero overrides; the role banner's
          hairline tracks it the same way. Pairs with the theme-flip ratio check above. */}
      <SubHead meta="RTL · العربية">Logical properties under RTL</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Every accent rule above sits on a <Mono>border-inline-start</Mono>, never a physical
        <Mono>border-left</Mono>. That is why a colour role costs zero RTL work: set <Mono>dir="rtl"</Mono>
        on a parent and the active-nav bar and the role-banner hairline jump to the trailing
        edge — now the right — while the ember tint and the on-soft ink stay put. Flip the topbar
        theme pill and these same surfaces re-derive their contrast ratios from the role tokens.
      </p>
      <Frame
        label={'dir="rtl" — the ember accent bar flips to the right edge; the role hairline follows'}
        code={`{/* the accent rules use logical props, so nothing changes for RTL */}
<a className="nav-item active"
   style={{ borderInlineStart: "2px solid var(--ember)",
            background: "var(--ember-soft)", color: "var(--ember)" }}>
  الخدمات
</a>
<div style={{ borderInlineStart: "3px solid var(--info-border)",
              background: "var(--info-soft)", color: "var(--info-text)" }}>
  لخّص الذكاء الاصطناعي هذا الخيط
</div>`}
      >
        <div dir="rtl" style={{display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 480, margin:'0 auto'}}>
          <div style={{display:'flex', flexDirection:'column', gap: 0, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden'}}>
            <div style={{padding:'10px 14px', fontSize: 'var(--text-base)', color:'var(--fg-muted)', borderBottom:'1px solid var(--border)'}}>نظرة عامة</div>
            <div style={{padding:'10px 14px', fontSize: 'var(--text-base)', color:'var(--ember)', background:'var(--ember-soft)', borderInlineStart:'2px solid var(--ember)', borderBottom:'1px solid var(--border)'}}>الخدمات <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>· نشط</span></div>
            <div style={{padding:'10px 14px', fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>الإعدادات</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderRadius:'var(--radius-lg)', background:'var(--info-soft)', borderInlineStart:'3px solid var(--info-border)', border:'1px solid var(--info-border)'}}>
            <Icons.sparkle size={16} style={{color:'var(--info-text)', flexShrink: 0}}/>
            <span style={{flex: 1, minWidth: 0, fontSize:'var(--text-base)', color:'var(--info-text)'}}>لخّص الذكاء الاصطناعي هذا الخيط</span>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        Nothing here is mirrored with <Mono>transform: scaleX(-1)</Mono> — only the inline order and
        the <Mono>border-inline-start</Mono> edge follow <Mono>dir="rtl"</Mono>. The same active-nav row
        in the <Mono>Where ember lives</Mono> frame is left-to-right; logical properties do the flip for free.
      </p>

      {/* On-ember foreground — the text that rides on top of the ember surface.
          Documented as its own token because the value flips with theme: dark
          text on bright ember in dark mode reads as a hot CTA; white text on
          the deeper ember in light mode reads as primary action. Flip the
          topbar pill to see both halves. */}
      <SubHead meta="text on primary">Foreground on primary</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        A button labelled with the ember background needs a foreground colour
        that switches with the theme. <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--ember-fg</code> is dark in dark mode (where ember
        is bright and reads as hot) and white in light mode (where ember
        deepens to a rust tone and dark text would muddy). Same idea behind
        <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}> --danger-fg</code> for destructive actions.
      </p>
      <Frame label="--ember-fg · --danger-fg · live in the active theme">
        <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 560, margin:'0 auto'}}>
          {[
            ['--ember-fg',  '--ember',  'btn ember',       'Deploy'],
            ['--danger-fg', '--danger', 'btn destructive', 'Roll back'],
          ].map(([fgTok, bgTok, cls, label]) => (
            <div key={fgTok} style={{display:'flex', alignItems:'center', gap: 14, padding:'10px 14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)'}}>
              <button className={cls} style={{minWidth: 120, justifyContent:'center'}} tabIndex={-1}>{label}</button>
              <div style={{display:'flex', flexDirection:'column', gap: 2}}>
                <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)', fontVariantNumeric:'tabular-nums'}}>{fgTok} <span style={{color:'var(--fg-faint)'}}>on</span> {bgTok}</span>
                <span style={monoFaint}>dark · #0A0907 &nbsp;·&nbsp; light · #FFFFFF</span>
              </div>
            </div>
          ))}
        </div>
      </Frame>
      <p className="ds-caption">Component authors: when you paint <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>background: var(--ember)</code>, always pair it with <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>color: var(--ember-fg)</code>. Never hardcode <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>#0A0907</code> or <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>#FFFFFF</code> — the token does the theme work for you.</p>

      {/* Cool accents */}
      <SubHead meta={accents.length+' tokens'}>Cool accents</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        The three ember values plus two cool sparingly-used hues — <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--ice</code> for AI/automated content, <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--violet</code> for premium tier signals. Never use either in place of ember.
      </p>
      <div className="ds-grid cols-3">
        {accents.map(([name,v,val,lightVal]) => <TokenSwatch key={v} name={name} varName={v} value={val} lightValue={lightVal}/>)}
      </div>

      {/* Status */}
      <SubHead meta="semantic">Status</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Three semantic tokens for state communication. Each pairs with a soft variant (used for surfaces) and an icon. See <a href="/status" style={{color:'var(--ember)'}}>Status & Semantics</a> for the full vocabulary.
      </p>
      <div className="ds-grid cols-3">
        {status.map(([name,v,val,lightVal]) => <TokenSwatch key={v} name={name} varName={v} value={val} lightValue={lightVal}/>)}
      </div>
      <p style={{marginTop: 26, marginBottom: 8, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        The same three tokens applied through the canonical <a href="/alerts" style={{color:'var(--ember)'}}>Alert</a> component — soft variant on the surface, full saturation on the icon, 30%-mix border so the message reads even on a busy page.
      </p>
      <Frame label="status in context — using the alert primitive">
        <div style={{display:'flex', flexDirection:'column', gap: 10, width:'100%'}}>
          <div className="alert success" style={{width:'100%'}}>
            <Icons.check size={16} className="alert-icon"/>
            <div className="alert-body">
              <div className="alert-title">Build green</div>
              <div className="alert-desc">12s · 0 errors — eidos-api v2.14.0 ready to deploy.</div>
            </div>
          </div>
          <div className="alert warning" style={{width:'100%'}}>
            <Icons.alert size={16} className="alert-icon"/>
            <div className="alert-body">
              <div className="alert-title">SLO warning</div>
              <div className="alert-desc">p95 230ms — 30ms over target. Investigate before the budget burns down further.</div>
            </div>
          </div>
          <div className="alert danger" style={{width:'100%'}}>
            <Icons.x size={16} className="alert-icon"/>
            <div className="alert-body">
              <div className="alert-title">Outage</div>
              <div className="alert-desc">5xx rate 18% on eidos-api — health checks failing on 3/8 instances.</div>
            </div>
          </div>
        </div>
      </Frame>

      {/* Domain vocabularies (severity / run-status / health / risk) moved to their own
          foundation pages — Color keeps only the generic accent + status roles. */}
      <SubHead meta="domain vocabularies">Severity, status, health &amp; risk</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        The platform&apos;s domain palettes — incident <b style={{color:'var(--fg)'}}>severity</b> (P0–P3), pipeline / agent <b style={{color:'var(--fg)'}}>run status</b>, service <b style={{color:'var(--fg)'}}>health</b>, and change <b style={{color:'var(--fg)'}}>risk</b> — are documented in full on <a href="/severity" style={{color:'var(--ember)'}}>Severity &amp; state</a> and <a href="/status" style={{color:'var(--ember)'}}>Status &amp; semantics</a>. They describe <i>meaning</i>, not brand, so they live beside the surfaces that use them rather than in the core palette.
      </p>

      {/* Info role — the cool accent, now first-class */}
      <SubHead meta="role set · sky">Info (the cool accent role)</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Alongside ember and the status trio, <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>info</code> is a first-class role for informational / AI-assisted surfaces (a sky blue; <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--info-text</code> is the legacy <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--ice</code>). Like every functional role it implements the same 7-token contract — solid · strong · soft · subtle · border · text · fg — so an alert or badge reads its tint, border, and on-solid ink from one family. <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--violet</code> stays the premium-tier signal.
      </p>
      <div className="ds-grid cols-3">
        {[
          ['Solid', '--info', 'badge / dot fill, icon'],
          ['Soft', '--info-soft', 'tint background for an info surface'],
          ['Border', '--info-border', 'hairline on a soft info surface'],
          ['Text', '--info-text', 'in-hue text on the page (= --ice)'],
          ['On solid', '--info-fg', 'ink on a solid info fill'],
          ['Violet', '--violet', 'premium-tier signal — never in place of info'],
        ].map(([name, tok, role]) => (
          <div key={tok} className="surface" style={{padding: 16}}>
            <div style={{height: 40, borderRadius:'var(--radius-lg)', background:`var(${tok})`, border:'1px solid var(--border)', marginBottom: 10}}/>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 8}}>
              <span style={{fontWeight: 600, fontSize:'var(--text-md)'}}>{name}</span>
              <span style={monoTok}>{tok}</span>
            </div>
            <div style={{fontSize:'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5, marginTop: 4}}>{role}</div>
          </div>
        ))}
      </div>

      {/* The role set applied — shows how the 7 tokens of a role compose into real UI.
          One row per functional role so the contract reads at a glance. */}
      <SubHead meta="the contract applied">A role in context</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Every role composes the same way. The badge is the <b style={{color:'var(--fg)'}}>solid</b> with <b style={{color:'var(--fg)'}}>on-solid</b> ink; the banner is the <b style={{color:'var(--fg)'}}>soft</b> background with the <b style={{color:'var(--fg)'}}>border</b> hairline and <b style={{color:'var(--fg)'}}>text</b> colour; the inline link uses <b style={{color:'var(--fg)'}}>text</b>. Read one row across to see all seven tokens cooperate.
      </p>
      <Frame label="solid · soft · border · text · on-solid — per role">
        <div style={{display:'flex', flexDirection:'column', gap: 10, width:'100%'}}>
          {[
            ['Info',    '--info',    'AI summarised this thread'],
            ['Success', '--success', 'Deploy #9384 promoted to prod'],
            ['Warning', '--warning', 'p95 is 30ms over target'],
            ['Danger',  '--danger',  '5xx rate 18% on eidos-api'],
          ].map(([name, r, msg]) => (
            <div key={r} style={{display:'flex', alignItems:'center', gap: 14, padding:'12px 14px', borderRadius:'var(--radius-lg)', background:`var(${r}-soft)`, border:`1px solid var(${r}-border)`}}>
              <span className="pill" style={{flex:'0 0 auto', minWidth: 78, justifyContent:'center', background:`var(${r})`, color:`var(${r}-fg)`, borderColor:'transparent', fontWeight: 600}}>{name}</span>
              <span style={{flex: 1, minWidth: 0, fontSize:'var(--text-base)', color:`var(${r}-text)`}}>{msg}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)', whiteSpace:'nowrap', fontVariantNumeric:'tabular-nums'}}>{r}-soft · {r}-border · {r}-text</span>
            </div>
          ))}
        </div>
      </Frame>
      <p className="ds-caption">Same shape as <a href="/alerts" style={{color:'var(--ember)'}}>Alert</a> / <a href="/badges" style={{color:'var(--ember)'}}>Badge</a> — those components read these tokens directly, so a role swap is a one-line change. Ember stays the brand accent (primary action), never a status here.</p>

      {/* Tokens across every state — proves the palette covers the full
          interaction lifecycle, not just the resting case. One field skin
          rendered in default / disabled / invalid / loading, each painted
          only with role tokens (no per-state hex). */}
      <SubHead meta="default · disabled · invalid · loading">Every state from tokens</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        A palette earns its keep at the edges, not the resting case. The same input skin below is painted in
        four states using only role tokens — <Mono>--fg-subtle</Mono> for disabled, <Mono>--danger</Mono> for
        invalid, the ember <Mono>--ring</Mono> for loading focus — so no state needs a hand-picked colour.
      </p>
      <Frame label="one field skin · four states · zero per-state hex">
        <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 480, margin:'0 auto'}}>
          {/* Default */}
          <label style={{display:'flex', flexDirection:'column', gap: 6}}>
            <span style={{fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)', letterSpacing:'0.06em', color:'var(--fg-subtle)', textTransform:'uppercase'}}>Default · --fg on --surface</span>
            <input type="text" defaultValue="eidos-api" aria-label="Service name, default state"
              style={{height: 36, padding:'0 12px', borderRadius:'var(--radius-lg)', background:'var(--surface)', border:'1px solid var(--border-strong)', color:'var(--fg)', fontSize:'var(--text-base)'}}/>
          </label>
          {/* Disabled */}
          <label style={{display:'flex', flexDirection:'column', gap: 6}}>
            <span style={{fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)', letterSpacing:'0.06em', color:'var(--fg-subtle)', textTransform:'uppercase'}}>Disabled · --fg-subtle, no ring</span>
            <input type="text" defaultValue="eidos-api" disabled aria-label="Service name, disabled state"
              style={{height: 36, padding:'0 12px', borderRadius:'var(--radius-lg)', background:'var(--bg-elevated)', border:'1px solid var(--border)', color:'var(--fg-subtle)', fontSize:'var(--text-base)', cursor:'not-allowed'}}/>
          </label>
          {/* Invalid */}
          <label style={{display:'flex', flexDirection:'column', gap: 6}}>
            <span style={{fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)', letterSpacing:'0.06em', color:'var(--fg-subtle)', textTransform:'uppercase'}}>Invalid · --danger border + text</span>
            <input type="text" defaultValue="eidos api" aria-invalid="true" aria-describedby="color-state-err" aria-label="Service name, invalid state"
              style={{height: 36, padding:'0 12px', borderRadius:'var(--radius-lg)', background:'var(--surface)', border:'1px solid var(--danger)', color:'var(--fg)', fontSize:'var(--text-base)', boxShadow:'0 0 0 3px var(--danger-soft)'}}/>
            <span id="color-state-err" role="alert" style={{display:'flex', alignItems:'center', gap: 6, fontSize:'var(--text-sm)', color:'var(--danger-text)', lineHeight: 1.5}}>
              <Icons.alert size={13} style={{flexShrink: 0}}/> No spaces allowed in a service name.
            </span>
          </label>
          {/* Loading */}
          <label style={{display:'flex', flexDirection:'column', gap: 6}}>
            <span style={{fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)', letterSpacing:'0.06em', color:'var(--fg-subtle)', textTransform:'uppercase'}}>Loading · --ring focus + spinner</span>
            <div aria-busy="true" style={{position:'relative', display:'flex', alignItems:'center', height: 36, padding:'0 12px', borderRadius:'var(--radius-lg)', background:'var(--surface)', border:'1px solid var(--ember)', boxShadow:'0 0 0 3px var(--ember-soft)'}}>
              <span style={{fontSize:'var(--text-base)', color:'var(--fg-muted)'}}>Checking availability…</span>
              <Icons.refresh size={14} className="ds-spin" aria-hidden="true" style={{marginInlineStart:'auto', color:'var(--ember)'}}/>
            </div>
          </label>
        </div>
      </Frame>
      <p className="ds-caption">The spinner uses the shared <Mono>.ds-spin</Mono> utility — under <Mono>prefers-reduced-motion: reduce</Mono> its rotation becomes a calm opacity pulse, and the <Mono>aria-busy</Mono> on the field still carries the loading state to assistive tech. The invalid field pairs <Mono>aria-invalid</Mono> with a <Mono>role="alert"</Mono> message, so the error is colour <i>and</i> announced text — never colour alone.</p>

      {/* Borders — 4 hairline tiers (Eidos v1.1 added border-subtle) */}
      <SubHead meta="hairlines, 4 tiers">Borders</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Four opacities of pure white (dark) / slate ink (light). <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--border-subtle</code> is for barely-there row separators inside a table; <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--border</code> is the everyday hairline; the stronger pair wraps inputs and focus halos.
      </p>
      <div className="ds-grid cols-2">
        {[
          ['Border subtle',   '--border-subtle',   'barely-there separator'],
          ['Border',          '--border',          'default hairline'],
          ['Border strong',   '--border-strong',   'interactive boundary'],
          ['Border stronger', '--border-stronger', 'focused / pressed'],
        ].map(([name, tok, role]) => (
          <div key={tok} className="surface" style={{padding: 16, display:'flex', alignItems:'center', gap: 16}}>
            <div aria-hidden="true" style={{
              width: 64, height: 64, borderRadius: 'var(--radius-xl)',
              background:`linear-gradient(45deg, transparent 49%, ${'var('+tok+')'} 49%, ${'var('+tok+')'} 51%, transparent 51%), repeating-conic-gradient(var(--bg) 0% 25%, var(--bg-elevated) 0% 50%) 0 / 8px 8px`,
              border: `1px solid ${'var('+tok+')'}`,
              flexShrink: 0,
            }}/>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{fontWeight: 600, fontSize: 'var(--text-md)', marginBottom: 4}}>{name}</div>
              <div style={{...monoTok, marginBottom: 4}}>{tok}</div>
              <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>{role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Accessibility & pairings */}
      <SubHead meta="contrast">Accessibility & pairings</SubHead>
      <table className="spec">
        <thead><tr><th>Foreground</th><th>On surface</th><th>Ratio</th><th>WCAG</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">--fg</td><td className="mono">--bg</td><td className="mono">17.8 : 1</td><td><span className="chip ok">AAA</span></td></tr>
          <tr><td className="tok-name">--fg-muted</td><td className="mono">--bg</td><td className="mono">7.2 : 1</td><td><span className="chip ok">AAA</span></td></tr>
          <tr><td className="tok-name">--fg-subtle</td><td className="mono">--bg</td><td className="mono">4.8 : 1</td><td><span className="chip ok">AA</span></td></tr>
          <tr><td className="tok-name">--fg-faint</td><td className="mono">--bg</td><td className="mono">3.0 : 1</td><td><span className="chip warn">Large only</span></td></tr>
          <tr><td className="tok-name">--ember</td><td className="mono">--bg</td><td className="mono">5.1 : 1</td><td><span className="chip ok">AA</span></td></tr>
          <tr><td className="tok-name">--ember-fg</td><td className="mono">--ember (button fg)</td><td className="mono">8.6 : 1</td><td><span className="chip ok">AAA</span></td></tr>
          <tr><td className="tok-name">--success</td><td className="mono">--success-soft</td><td className="mono">5.8 : 1</td><td><span className="chip ok">AA</span></td></tr>
          <tr><td className="tok-name">--danger</td><td className="mono">--danger-soft</td><td className="mono">5.4 : 1</td><td><span className="chip ok">AA</span></td></tr>
          <tr><td className="tok-name">--info-text</td><td className="mono">--info-soft</td><td className="mono">5.2 : 1</td><td><span className="chip ok">AA</span></td></tr>
          <tr><td className="tok-name">--info-fg</td><td className="mono">--info (badge fg)</td><td className="mono">7.4 : 1</td><td><span className="chip ok">AAA</span></td></tr>
        </tbody>
      </table>
      <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth:'64ch'}}>
        <Mono>--fg-faint</Mono> never carries required information — only decorative dividers, watermark labels, faint metadata users can ignore. Switch the theme via the topbar pill to verify every ratio above re-derives under light.
      </p>
      <div className="ds-grid cols-2" style={{marginBottom: 18}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard &amp; focus</div>
          <Kbd label="Move focus into a control" keys={['Tab']}/>
          <Kbd label="Move focus backward" keys={['Shift','Tab']}/>
          <Kbd label="Activate the focused control" keys={['Enter']}/>
          <div style={{color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.55, marginTop: 10}}>
            Every control above shows the ember <Mono>--ring</Mono> halo only on <Mono>:focus-visible</Mono> (keyboard),
            not on mouse click — try it in the <b style={{color:'var(--fg)'}}>Where ember lives</b> frame. The ring sits
            at ≥3:1 against its surface in both themes.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Screen reader &amp; state</div>
          <div style={{color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.55}}>
            State is never colour alone. The invalid field sets <Mono>aria-invalid</Mono> and links a
            <Mono>role="alert"</Mono> message via <Mono>aria-describedby</Mono>; the loading field sets
            <Mono>aria-busy</Mono>; status pills pair their hue with an icon. A red-green-colourblind user
            reads every state from text and shape, not the tint.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast</div>
          <div style={{color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.55}}>
            Every text token clears AA on its intended surface (table above). On an ember or danger fill the
            foreground is the paired <Mono>--ember-fg</Mono> / <Mono>--danger-fg</Mono> ink — dark in dark mode,
            white in light — never the accent colour on itself.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.55}}>
            The loading spinner uses <Mono>.ds-spin</Mono>; under <Mono>prefers-reduced-motion: reduce</Mono> its
            rotation is swapped for a calm opacity pulse, so the busy state stays legible without spinning while
            <Mono>aria-busy</Mono> still carries it to assistive tech.
          </div>
        </div>
      </div>

      {/* Anatomy — at the canonical "right before Do/Don't" slot.
          Body uses the default frame chrome (surface in dark, sunken
          in light); the card on top steps up to surface-overlay + shadow-1
          so it pops cleanly in both themes. */}
      <SubHead meta="composition">Tokens at work — anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">A card with five tokens labelled</span></div>
        <div className="ds-frame-body" style={{padding: '64px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 360}} aria-hidden="true">
              <div style={{background:'var(--surface-overlay)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--elev-1)'}}>
                <div style={{padding:'14px 16px', borderBottom:'1px solid var(--border)'}}>
                  <div style={{color:'var(--fg)', fontWeight: 600, fontSize: 'var(--text-body)', marginBottom: 4}}>Service health</div>
                  <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)'}}>Uptime over the last 30 days.</div>
                </div>
                <div style={{padding: 16, color:'var(--fg)', fontSize: 'var(--text-md)'}}>
                  <span style={{color:'var(--ember)', fontWeight: 600, fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>99.94%</span> — within SLO.
                </div>
                <div style={{padding:'10px 14px', background:'var(--bg-elevated)', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', gap: 6}}>
                  <span style={{fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--fg-faint)', fontVariantNumeric:'tabular-nums'}}>updated 2m ago</span>
                </div>
              </div>
              <span className="lead h" style={{top: 22, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 50, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 100, left: -28, width: 24}}/>
              <span className="lead h" style={{bottom: 18, left: -28, width: 24}}/>
              <span className="lead h" style={{top: -2, right: -28, width: 24}}/>
              <div className="pin" style={{top: 14, left: -52}}>1</div>
              <div className="pin" style={{top: 42, left: -52}}>2</div>
              <div className="pin" style={{top: 92, left: -52}}>3</div>
              <div className="pin" style={{bottom: 10, left: -52}}>4</div>
              <div className="pin" style={{top: -10, right: -52}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Title</b> uses <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--fg</code> at full weight. The most important text on a surface always uses --fg, never --fg-muted.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Description</b> uses <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--fg-muted</code>. One step down — descriptive copy that supports the title.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Body number</b> uses <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--ember</code> on a metric the user cares about. One ember per surface.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Footer</b> drops to <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--bg-elevated</code>, separated by <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--border</code>. The inset tone reads as a tray below the body, not as competing chrome.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Card surface</b> is <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--surface-overlay</code> stepped one tier above the frame body, with a <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--border</code> hairline and a soft <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>--elev-1</code>. Three tokens, one promise: this card is lifted on the page.</span>
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — semantic tokens in code</div>
          <div className="body" style={{padding: 16}}>
            <pre style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.6}}>
{`<div style={{
  background: 'var(--surface)',
  color: 'var(--fg)',
  border: '1px solid var(--border)'
}}>`}
            </pre>
          </div>
          <div className="note">A theme switch flips one :root variable and every component follows. No per-component override needed.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — raw hex in product code</div>
          <div className="body" style={{padding: 16}}>
            <pre style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.6}}>
{`<div style={{
  background: '#141517',
  color: '#EDEDED',
  border: '1px solid #1F2024'
}}>`}
            </pre>
          </div>
          <div className="note">Hex values bypass the theme system. The light-mode flip will leave this component dark.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one ember per surface</div>
          <div className="body" style={{gap: 8, padding: 14}}>
            <button className="btn ghost xs">Cancel</button>
            <button className="btn outline xs">Save draft</button>
            <button className="btn ember xs">Deploy</button>
          </div>
          <div className="note">Ember reserves attention. Pair with ghost / outline for the rest of the row.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — multiple embers competing</div>
          <div className="body" style={{gap: 8, padding: 14}}>
            <button className="btn ember xs">Deploy</button>
            <button className="btn ember xs">Rollback</button>
            <button className="btn ember xs">Approve</button>
          </div>
          <div className="note">Three embers cancel each other out. Pick the verb that matters most.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — colour + icon for state</div>
          <div className="body" style={{flexDirection:'column', gap: 8, padding: 14, alignItems:'flex-start'}}>
            <span className="pill success"><Icons.check size={10}/> Healthy</span>
            <span className="pill warning"><Icons.alert size={10}/> Degraded</span>
            <span className="pill danger"><Icons.x size={10}/> Down</span>
          </div>
          <div className="note">Pair colour with shape so users with red-green colourblindness still parse the difference.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — colour alone</div>
          <div className="body" style={{flexDirection:'column', gap: 8, padding: 14, alignItems:'flex-start'}}>
            <span className="pill success">Healthy</span>
            <span className="pill warning">Degraded</span>
            <span className="pill danger">Down</span>
          </div>
          <div className="note">Colour alone is not state communication. Ship the icon.</div>
        </div>
      </div>
    </Section>
  );
}
