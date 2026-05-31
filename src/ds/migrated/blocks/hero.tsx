'use client';
import { Icons, Frame, Section, SubHead, PropsTable, Mono, Kbd } from '@/ds/core';

// ---- Style tokens ---------------------------------------------------------

// ==========================================================================
// 1. BOLD + DOT GRID — full-bleed dashboard hero, ember glow + dot texture.
//    Use on the marketing landing, the product home, and the H1 splash.
// ==========================================================================
const HERO_BOLD_CODE = `<Hero variant="bold">
  <Hero.Eyebrow>Forge / 2026 H1</Hero.Eyebrow>
  <Hero.Headline>
    Ship safely. <span className="muted">Faster.</span>
  </Hero.Headline>
  <Hero.Actions>
    <Button variant="ember">
      Get started <ArrowRight size={14} />
    </Button>
    <Button variant="ghost">View metrics</Button>
  </Hero.Actions>
</Hero>`;

const HeroBold = () => (
  <div style={{position:'relative', width:'100%', minHeight: 240, padding: 40, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius: 10, overflow:'hidden'}}>
    <div className="hero-grid"/>
    <div className="ember-glow-bg" style={{width: 400, height: 400, right: -100, top: -100}}/>
    <div style={{position:'relative'}}>
      <div className="ds-h-eyebrow" style={{marginBottom: 10}}>Forge / 2026 H1</div>
      <div style={{fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.15, maxWidth: '24ch'}}>
        Ship safely. <span style={{color:'var(--fg-muted)'}}>Faster.</span>
      </div>
      <div style={{marginTop: 18, display:'flex', gap: 8}}>
        <button className="btn ember">Get started <Icons.arrowRight size={14}/></button>
        <button className="btn ghost">View metrics</button>
      </div>
    </div>
  </div>
);

// ==========================================================================
// 2. EDITORIAL / CENTERED — large display type, generous whitespace.
//    Use when the message IS the hero (manifesto, principle, brand page).
// ==========================================================================
const HERO_EDITORIAL_CODE = `<Hero variant="editorial">
  <Hero.Eyebrow centered>Forge — Engineering Charter</Hero.Eyebrow>
  <Hero.Headline centered display>
    We move at the speed of trust,
    <br/>
    not the speed of merge.
  </Hero.Headline>
  <Hero.Lede centered>
    Every deploy carries a name. Every rollback carries a story.
    The loop between intention and impact is sacred.
  </Hero.Lede>
</Hero>`;

const HeroEditorial = () => (
  <div style={{width:'100%', minHeight: 280, padding: '56px 40px', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius: 10, textAlign:'center'}}>
    <div className="ds-h-eyebrow" style={{marginBottom: 18}}>Forge — Engineering Charter</div>
    <div style={{fontSize: 'var(--text-display)', lineHeight: 1.05, fontWeight: 600, letterSpacing:'-0.03em', maxWidth: '16ch', margin:'0 auto'}}>
      We move at the speed of trust,<br/>
      not the speed of merge.
    </div>
    <p style={{fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth: '52ch', margin:'20px auto 0', lineHeight: 1.55}}>
      Every deploy carries a name. Every rollback carries a story. The loop between intention and impact is sacred.
    </p>
  </div>
);

// ==========================================================================
// 3. SPLIT — copy on the inline-start, mock product UI on the inline-end.
//    Use when the product itself is the proof: dashboards, IDEs, runbooks.
// ==========================================================================
const HERO_SPLIT_CODE = `<Hero variant="split">
  <Hero.Copy>
    <Hero.Eyebrow>What's new — v4.18</Hero.Eyebrow>
    <Hero.Headline>
      A runbook for every alert.
    </Hero.Headline>
    <Hero.Lede>
      One-click context: which deploy, which dashboard, which on-call.
      Stop spelunking through Slack at 3 AM.
    </Hero.Lede>
    <Hero.Actions>
      <Button variant="ember">Open runbooks</Button>
      <Button variant="ghost">Tour the change <ArrowRight size={14}/></Button>
    </Hero.Actions>
  </Hero.Copy>
  <Hero.Visual>
    <ServiceMockup tier="T1"/>
  </Hero.Visual>
</Hero>`;

const HeroSplit = () => (
  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24, width:'100%', minHeight: 280, padding: 32, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius: 10, alignItems:'center'}}>
    <div>
      <div className="ds-h-eyebrow" style={{marginBottom: 10}}>What's new — v4.18</div>
      <div style={{fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.15}}>A runbook for every alert.</div>
      <p style={{fontSize: 'var(--text-md)', color:'var(--fg-muted)', maxWidth: '38ch', margin:'14px 0 0', lineHeight: 1.55}}>
        One-click context: which deploy, which dashboard, which on-call. Stop spelunking through Slack at 3 AM.
      </p>
      <div style={{marginTop: 20, display:'flex', gap: 8}}>
        <button className="btn ember">Open runbooks</button>
        <button className="btn ghost">Tour the change <Icons.arrowRight size={14}/></button>
      </div>
    </div>
    <div className="surface" style={{padding: 16, position:'relative', overflow:'hidden'}}>
      <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 12}}>
        <span className="pill ember"><span className="dot"/>T1</span>
        <span style={{fontSize: 'var(--text-base)', fontWeight: 600}}>identity-svc</span>
        <span className="pill success" style={{marginInlineStart:'auto'}}><span className="dot"/>healthy</span>
      </div>
      <div className="t-mono-label" style={{marginBottom: 6}}>Open alert</div>
      <div style={{fontSize: 'var(--text-base)', color:'var(--fg)', lineHeight: 1.5}}>p95 latency above 200ms — 4 minutes</div>
      <div style={{marginTop: 12, padding: 10, background:'var(--bg)', borderRadius: 'var(--radius-lg)', border:'1px solid var(--border)'}}>
        <div className="t-mono-label" style={{marginBottom: 6}}>Runbook · suggested</div>
        <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>
          1. Check upstream <Mono>bureau-gateway</Mono> latency.<br/>
          2. Failover to read replica.<br/>
          3. Page <Mono>@identity-oncall</Mono>.
        </div>
      </div>
    </div>
  </div>
);

// ==========================================================================
// 4. EYEBROW + LEDE + LADDER — hero anchored by 3-step proof ladder.
//    Use on enterprise landing pages, sales motion, and case studies.
// ==========================================================================
const HERO_LADDER_CODE = `<Hero variant="ladder">
  <Hero.Eyebrow>Forge for platform teams</Hero.Eyebrow>
  <Hero.Headline>The control plane your auditors finally trust.</Hero.Headline>
  <Hero.Lede>
    Every deploy is signed, every change is reversible,
    every incident is a row in the ledger.
  </Hero.Lede>
  <Hero.Actions>
    <Button variant="ember">Book a 20-min walkthrough</Button>
  </Hero.Actions>
  <Hero.Ladder>
    <Stat label="P95 lead time" value="9 min" delta="-42%"/>
    <Stat label="Change-fail rate" value="0.4%" delta="-83%"/>
    <Stat label="MTTR" value="6 min" delta="-71%"/>
  </Hero.Ladder>
</Hero>`;

const Stat = ({label, value, delta}) => (
  <div className="stat" style={{flex: 1, padding:'12px 16px', borderInlineStart:'1px solid var(--border)'}}>
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
    <span style={{fontSize: 'var(--text-xs)', color:'var(--success)', fontVariantNumeric:'tabular-nums', marginTop: 2}}>{delta} YoY</span>
  </div>
);

const HeroLadder = () => (
  <div style={{width:'100%', padding: 36, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius: 10}}>
    <div className="ds-h-eyebrow" style={{marginBottom: 10}}>Forge for platform teams</div>
    <div style={{fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing:'-0.02em', maxWidth: '20ch', lineHeight: 1.15}}>
      The control plane your auditors finally trust.
    </div>
    <p style={{fontSize: 'var(--text-md)', color:'var(--fg-muted)', maxWidth: '52ch', margin:'14px 0 0', lineHeight: 1.55}}>
      Every deploy is signed, every change is reversible, every incident is a row in the ledger.
    </p>
    <div style={{marginTop: 18}}>
      <button className="btn ember">Book a 20-min walkthrough <Icons.arrowRight size={14}/></button>
    </div>
    <div style={{marginTop: 28, display:'flex', borderTop:'1px solid var(--border)', paddingTop: 4}}>
      <Stat label="P95 lead time"  value="9 min" delta="-42%"/>
      <Stat label="Change-fail rate" value="0.4%" delta="-83%"/>
      <Stat label="MTTR"             value="6 min" delta="-71%"/>
    </div>
  </div>
);

// ==========================================================================
// 5. QUIET — single line, single CTA, no subtitle. The library/docs hero.
// ==========================================================================
const HERO_QUIET_CODE = `<Hero variant="quiet">
  <Hero.Headline small>
    Forge UI <span className="muted">— components, primitives, patterns.</span>
  </Hero.Headline>
  <Hero.Actions>
    <Button variant="ember" size="sm">
      Browse components <ArrowRight size={12}/>
    </Button>
  </Hero.Actions>
</Hero>`;

const HeroQuiet = () => (
  <div style={{width:'100%', padding:'24px 28px', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'space-between', gap: 24, flexWrap:'wrap'}}>
    <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.01em'}}>
      Forge UI <span style={{color:'var(--fg-muted)', fontWeight: 500}}>— components, primitives, patterns.</span>
    </div>
    <button className="btn ember sm">Browse components <Icons.arrowRight size={12}/></button>
  </div>
);

// ==========================================================================
// PAGE
// ==========================================================================
export default function HeroPattern() {
  return (
    <Section
      id="hero"
      num="17"
      title="Hero"
      desc="Five hero patterns for landings, marketing pages and product splash. Pick the variant that matches the surface's job — never copy the loudest one by default."
    >
      {/* ====================================================================
          1. BOLD + DOT GRID
          ==================================================================== */}
      <SubHead meta="01 · loud, full-bleed">Bold + dot grid</SubHead>
      <Frame label="hero — bold variant" code={HERO_BOLD_CODE}>
        <HeroBold/>
      </Frame>
      <p className="ds-caption">
        The default marketing hero. Ember glow + dot grid texture; one ember CTA, one ghost. Use for the product home and the brand splash — never for app-internal pages.
      </p>

      {/* ====================================================================
          2. EDITORIAL
          ==================================================================== */}
      <SubHead meta="02 · centered, no media">Editorial</SubHead>
      <Frame label="hero — editorial variant" code={HERO_EDITORIAL_CODE}>
        <HeroEditorial/>
      </Frame>
      <p className="ds-caption">
        Display type does the heavy lifting. No image, no chrome — just an eyebrow, a headline that breathes, and a quiet lede. Use for charters, manifestos, principles, and brand pages.
      </p>

      {/* ====================================================================
          3. SPLIT
          ==================================================================== */}
      <SubHead meta="03 · two-column">Split — copy + product shot</SubHead>
      <Frame label="hero — split variant" code={HERO_SPLIT_CODE}>
        <HeroSplit/>
      </Frame>
      <p className="ds-caption">
        Use when the product itself is the proof. Visual weight on the inline-end column; copy + CTAs on the inline-start. Mock UI should be a real, recognisable artifact (not a stock illustration).
      </p>

      {/* ====================================================================
          4. LADDER
          ==================================================================== */}
      <SubHead meta="04 · proof underneath">Eyebrow + lede + stat ladder</SubHead>
      <Frame label="hero — ladder variant" code={HERO_LADDER_CODE}>
        <HeroLadder/>
      </Frame>
      <p className="ds-caption">
        Headline above; three-stat ladder below the CTA. Use on enterprise landings and case studies where credibility is the conversion lever. Cap at three stats — four reads as a dashboard, not a hero.
      </p>

      {/* ====================================================================
          5. QUIET
          ==================================================================== */}
      <SubHead meta="05 · one line, one CTA">Quiet</SubHead>
      <Frame label="hero — quiet variant" code={HERO_QUIET_CODE}>
        <HeroQuiet/>
      </Frame>
      <p className="ds-caption">
        The library hero. Single row, no subtitle, one small ember CTA. Use on docs landings, design system home, and section roots — surfaces where the hero is a wayfinding sign, not the message.
      </p>

      {/* ====================================================================
          DECISION MATRIX
          ==================================================================== */}
      <SubHead meta="when to use which">Decision matrix</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">variant guide</span></div>
        <table className="tbl" style={{margin: 0}}>
          <thead>
            <tr><th style={{padding:'10px 12px'}}>Variant</th><th>Use for</th><th>Avoid when</th><th>Per surface</th></tr>
          </thead>
          <tbody>
            <tr><td className="tok-name">bold</td><td>Marketing landing, product splash, brand home</td><td>Inside the product chrome — too loud against app surfaces</td><td className="mono">max 1</td></tr>
            <tr><td className="tok-name">editorial</td><td>Manifestos, charters, brand & principle pages</td><td>The reader needs to act on something — there's no CTA</td><td className="mono">max 1</td></tr>
            <tr><td className="tok-name">split</td><td>Feature launches where the product IS the proof</td><td>You don't have a real artifact to show — stock shots backfire</td><td className="mono">max 1</td></tr>
            <tr><td className="tok-name">ladder</td><td>Enterprise landing, case studies, sales motion</td><td>You can't back the numbers in writing</td><td className="mono">max 1</td></tr>
            <tr><td className="tok-name">quiet</td><td>Docs landing, section roots, library home</td><td>The page is the funnel's first kiss — too modest</td><td className="mono">unlimited</td></tr>
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy — bold variant</span></div>
        <div className="ds-frame-body" style={{padding: '56px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 440, padding: 28, background:'var(--bg)', border:'1px solid var(--border)', borderRadius: 10, overflow:'hidden'}} aria-hidden="true">
              <div className="hero-grid"/>
              <div style={{position:'relative'}}>
                <div className="ds-h-eyebrow" style={{marginBottom: 8}}>Forge / 2026</div>
                <div style={{fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing:'-0.02em', maxWidth: '20ch', lineHeight: 1.15}}>
                  Ship safely. <span style={{color:'var(--fg-muted)'}}>Faster.</span>
                </div>
                <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin:'10px 0 0', maxWidth: '32ch', lineHeight: 1.5}}>
                  The deploy pipeline auditors stop arguing with.
                </p>
                <div style={{marginTop: 14, display:'flex', gap: 8}}>
                  <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}>Get started <Icons.arrowRight size={12}/></button>
                  <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>View metrics</button>
                </div>
              </div>
              {/* leader pins */}
              <div className="pin" style={{top: 18, right: -32}}>1</div>
              <div className="pin" style={{top: 50, right: -32}}>2</div>
              <div className="pin" style={{top: 92, right: -32}}>3</div>
              <div className="pin" style={{bottom: 70, right: -32}}>4</div>
              <div className="pin" style={{bottom: -32, left: '50%', transform:'translateX(-50%)'}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'48px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Eyebrow.</b> Geist Mono <Mono>--text-xs</Mono>, uppercase, <Mono>--fg-subtle</Mono>. Locates the hero in time and product space.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Headline.</b> Geist Sans 600, <Mono>--text-3xl</Mono> (bold/split/ladder) up to <Mono>--text-display</Mono> (editorial), <Mono>letter-spacing: -0.02em</Mono>. Cap at 6–8 words; lean on a muted span for tonal half-beat.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Lede.</b> Geist Sans <Mono>--text-body</Mono>, <Mono>--fg-muted</Mono>, <Mono>max-width: 52ch</Mono>. Optional — drop entirely on the quiet variant.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>CTAs.</b> One ember (the ask), one ghost (the doubt). Never two embers — the eye picks neither.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Ornament.</b> Dot grid + ember glow on bold; absent on editorial and quiet. Decoration, not signal — keeps the headline anchored without fighting it.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Decoration, not meaning</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Heading order is correct — the hero headline is the page's one <Mono>h1</Mono> (drop to <Mono>h2</Mono> via the <Mono>as</Mono> prop when it sits below another h1). Links and buttons are real controls, never <Mono>div</Mono>s wired with onClick; the dot grid and glow are <Mono>aria-hidden</Mono> ornament that carry no information.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Headline and lede sit on a solid <Mono>--bg-elevated</Mono> surface above the texture, so they stay AA-legible regardless of the dot grid or ember glow behind them. The muted half-beat span still clears AA against that surface — it fades tone, not legibility.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The hero does not auto-advance and the glow does not animate; any pulsing ornament you add is gated behind <Mono>prefers-reduced-motion</Mono>. There is no carousel here — if you compose one, it pauses on focus, hover, and reduced-motion.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The primary ember CTA is the first focusable control, with the ghost action second — focus order matches the visual hierarchy and the reading direction (it flips correctly under <Mono>dir="rtl"</Mono>). The decorative layers are never focusable.</div>
        </div>
      </div>
      <div className="surface" style={{padding: 18, marginTop: 12}}>
        <div className="t-mono-label" style={{marginBottom: 12}}>Keyboard</div>
        <Kbd label={<>Move to the next hero action (ember → ghost)</>} keys="Tab" />
        <Kbd label={<>Move to the previous action</>} keys={['Shift', 'Tab']} />
        <Kbd label={<>Activate the focused button or link</>} keys={['Enter', 'Space']} />
        <Kbd label={<>Follow the focused link CTA</>} keys="Enter" />
        <div style={{color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight: 1.55, marginTop: 8}}>
          The hero exposes no custom key handlers — every control is a native <Mono>button</Mono> or <Mono>a</Mono>, so the browser's default tab/activation model is the whole contract. There is nothing to trap and nothing to escape.
        </div>
      </div>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one ember CTA, one ghost</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 10, padding: 18}}>
            <div className="ds-h-eyebrow">Forge / 2026</div>
            <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.015em'}}>Ship safely. Faster.</div>
            <div style={{display:'flex', gap: 8}}>
              <button className="btn ember sm">Get started</button>
              <button className="btn ghost sm">View metrics</button>
            </div>
          </div>
          <div className="note">The eye finds the ember; the ghost lets people opt out without competing with the ask.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — three competing CTAs of equal weight</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 10, padding: 18}}>
            <div className="ds-h-eyebrow">Forge / 2026</div>
            <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.015em'}}>Ship safely. Faster.</div>
            <div style={{display:'flex', gap: 8}}>
              <button className="btn ember sm">Get started</button>
              <button className="btn ember sm">Book a demo</button>
              <button className="btn ember sm">Talk to sales</button>
            </div>
          </div>
          <div className="note">Three primaries cancel each other out. Pick the single ask that defines the surface.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — headline reads in one breath</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 6, padding: 18}}>
            <div className="ds-h-eyebrow">v4.18</div>
            <div style={{fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.15}}>A runbook for every alert.</div>
          </div>
          <div className="note">Six words, one verb. The reader gets the whole idea before the page finishes painting.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — paragraph in the headline slot</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 6, padding: 18}}>
            <div className="ds-h-eyebrow">v4.18</div>
            <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.015em', lineHeight: 1.2}}>
              Forge now ships an opinionated runbook surface that links every alert to the deploy that caused it and the on-call who owns it, plus a one-click Slack handoff.
            </div>
          </div>
          <div className="note">If the headline takes a paragraph to say, the lede is doing it wrong. Compress the headline; expand the lede.</div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — eyebrow, headline, CTAs flip with the reading direction' code={`<div dir="rtl">
  <Hero variant="bold">
    <Hero.Eyebrow>فورج / النصف الأول 2026</Hero.Eyebrow>
    <Hero.Headline>
      انشر بأمان. <span className="muted">أسرع.</span>
    </Hero.Headline>
    <Hero.Actions>
      <Button variant="ember">
        ابدأ الآن <ArrowRight size={14} className="rtl:scale-x-[-1]"/>
      </Button>
      <Button variant="ghost">عرض المقاييس</Button>
    </Hero.Actions>
  </Hero>
</div>`}>
        <div dir="rtl" style={{position:'relative', width:'100%', minHeight: 240, padding: 40, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius: 10, overflow:'hidden'}}>
          <div className="hero-grid"/>
          <div className="ember-glow-bg" style={{width: 400, height: 400, insetInlineEnd: -100, top: -100}}/>
          <div style={{position:'relative'}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 10}}>فورج / النصف الأول 2026</div>
            <div style={{fontSize: 'var(--text-3xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.15, maxWidth: '24ch'}}>
              انشر بأمان. <span style={{color:'var(--fg-muted)'}}>أسرع.</span>
            </div>
            <p style={{fontSize: 'var(--text-md)', color:'var(--fg-muted)', maxWidth: '48ch', margin:'12px 0 0', lineHeight: 1.55}}>
              خط أنابيب النشر الذي يتوقف عنده المدققون عن الجدال.
            </p>
            <div style={{marginTop: 18, display:'flex', gap: 8}}>
              <button className="btn ember">ابدأ الآن <Icons.arrowRight size={14} style={{transform:'scaleX(-1)'}}/></button>
              <button className="btn ghost">عرض المقاييس</button>
            </div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        Use logical properties (<Mono>inset-inline-*</Mono>, <Mono>border-inline-*</Mono>) for the glow position and any divider rules. Mirror directional arrows with <Mono>transform: scaleX(-1)</Mono> so "forward" still tracks the reading direction. The dot grid is symmetric — leave it alone.
      </p>

      {/* ====================================================================
          ANATOMY PROPS
          ==================================================================== */}
      <SubHead meta="HeroProps">Anatomy props</SubHead>
      <PropsTable
        label="<Hero /> + sub-components"
        rows={[
          { prop: 'variant',  type: '"bold" | "editorial" | "split" | "ladder" | "quiet"', default: '"bold"', description: 'The hero composition. See the decision matrix above.' },
          { prop: 'align',    type: '"start" | "center"', default: '"start"', description: 'Text alignment. Centered is implied by editorial; explicit on others.' },
          { prop: 'glow',     type: 'boolean', default: 'true', description: 'Render the ember radial glow ornament. Auto-off on editorial and quiet.' },
          { prop: 'grid',     type: 'boolean', default: 'true', description: 'Render the dot-grid texture. Auto-off on editorial and quiet.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Composition slot — Hero.Eyebrow, Hero.Headline, Hero.Lede, Hero.Actions, Hero.Visual, Hero.Ladder.' },
        ]}
      />
      <PropsTable
        label="<Hero.Headline />"
        rows={[
          { prop: 'as',      type: '"h1" | "h2"', default: '"h1"', description: 'Render element. Use h2 when the hero is below another h1 on the page.' },
          { prop: 'display', type: 'boolean', default: 'false', description: 'Bump to display type (40–56px). Editorial only.' },
          { prop: 'small',   type: 'boolean', default: 'false', description: 'Drop to 18px single-line. Quiet variant only.' },
          { prop: 'children',type: 'ReactNode', required: true, description: 'Headline copy. Wrap softer half-beats in <span className="muted"> to fade them.' },
        ]}
      />
    </Section>
  );
}
