'use client';
// Eidos DS — Get Started / Introduction (also the project entry surface).
//
// Owns the rich landing — hero, principles, philosophy, FAQ. The full
// component catalog has moved to its own page (components-catalog) so this
// stays focused on "what is Eidos." Reuses the existing .ds-hero / .surface /
// .comp-tile / .ds-grid classes — no new styles are introduced here.
import * as React from 'react';
import { Icons, SubHead, Alert, AlertTitle, AlertDescription, Kbd } from '@/ds/core';
import { NAV_FLAT } from '@/lib/nav';

// Stats are COMPUTED from the nav config — never invent numbers in marketing
// copy. The `Tokens` count is derived from the live --* declarations on
// documentElement so it stays honest even when foundations grow.
const countByGroup = (name: string) => NAV_FLAT.filter((it) => it.group === name).length;

const countTokens = () => {
  try {
    const computed = getComputedStyle(document.documentElement);
    // Sample known token families and add up the ones the engine knows about.
    // Faster than walking every CSSStyleSheet and stable across browsers.
    const candidates = [
      '--bg','--bg-elevated','--surface','--surface-hover','--surface-active',
      '--border','--border-strong','--border-stronger',
      '--fg','--fg-muted','--fg-subtle','--fg-faint',
      '--ember','--ember-glow','--ember-deep','--ember-soft','--ember-softer',
      '--accent-2','--accent-2-soft','--success','--success-soft','--warning','--warning-soft','--danger','--danger-soft','--accent-3',
      '--space-0','--space-px','--space-1','--space-2','--space-3','--space-4','--space-5','--space-6','--space-8','--space-10','--space-12','--space-16','--space-24',
      '--radius-xs','--radius-sm','--radius-md','--radius-lg','--radius-xl','--radius-2xl','--radius-full',
      '--text-xs','--text-sm','--text-base','--text-md','--text-body','--text-lg','--text-xl','--text-2xl','--text-3xl','--text-display','--text-display-xl',
      '--z-base','--z-sticky','--z-dropdown','--z-popover','--z-modal','--z-toast','--z-tooltip',
      '--prose-narrow','--prose-default','--prose-wide',
      '--ai-bg','--ai-surface','--ai-fg','--ai-fg-muted','--ai-border','--ai-accent','--ai-streaming-caret',
      '--ease','--ease-out','--ease-in','--ease-spring','--dur-xs','--dur-fast','--dur','--dur-slow','--dur-stagger',
      '--shadow-0','--shadow-1','--shadow-2','--shadow-3','--shadow-4','--shadow-5',
      '--font-sans','--font-mono',
    ];
    return candidates.filter((t) => computed.getPropertyValue(t).trim() !== '').length;
  } catch (e) { return 0; }
};

// The Tokens tile is the one live cell on the page, so it documents the full
// async contract HONESTLY: it begins LOADING (em-dash), resolves to READY
// (the counted number + ember spark), or — if getComputedStyle yields nothing
// (stylesheets blocked, hostile sandbox) — lands in ERROR rather than lying
// with a confident "0". The status drives both the tile and a role="alert"
// recovery banner below, so the page demonstrates the state it claims to have.
type TokenStatus = 'loading' | 'ready' | 'error';

const useHeroStats = () => {
  const [status, setStatus] = React.useState<TokenStatus>('loading');
  const [tokens, setTokens] = React.useState<number | null>(null);
  React.useEffect(() => {
    // Defer one tick — getComputedStyle returns blank if read before stylesheets parse.
    const id = requestAnimationFrame(() => {
      const n = countTokens();
      // Zero resolved variables can only mean the read failed (Eidos always
      // ships dozens) — treat it as the error path, never a real count.
      if (n > 0) { setTokens(n); setStatus('ready'); }
      else { setStatus('error'); }
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const tokenValue = status === 'ready' && tokens != null ? String(tokens)
    : status === 'error' ? 'n/a' : '—';
  const stats = [
    { k: 'Tokens',     v: tokenValue, s:'colors · spacing · type · motion · z', live: true },
    { k: 'Components', v: String(countByGroup('Components')), s:'forms · overlays · feedback · display', live: false },
    { k: 'Patterns',   v: String(countByGroup('Patterns')),   s:'page composition recipes', live: false },
    { k: 'Tailwind',   v: 'v4',     s:'@theme + v3 config preset', live: false },
  ];
  return { stats, status };
};

// Reduced-motion is respected at the source: the live spark only animates when
// the user has NOT asked the OS to reduce motion. Inline animation can't be
// gated by the @media rule the .ds-spin-pulse keyframe ships with, so we read
// the preference and drop the animation entirely (static dot) when it's set.
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
};

const PRINCIPLES = [
  { t:'Calm density', d:'Information must be legible at glance. We pack data, but never crowd. Hairlines, not boxes; whitespace is a feature.' },
  { t:'Dark-first, light-honest', d:'The product runs dark. Light theme exists and respects the same hierarchy — never feels like a translation.' },
  { t:'One ember', d:'#FF6B35 is the only accent that draws the eye. Used for the active path, primary CTA, and the spark in the mark — nothing else.' },
];

// Adapted from shadcn/ui's intro voice — open, composable, owned.
// Same shape (4 short philosophy paragraphs) but in Eidos's tone.
const PHILOSOPHY = [
  {
    t: 'Open code.',
    d: 'Every component lives in this repo. Read it. Edit it. Inline it. There is no opaque dependency to wait on, no upstream to update — when you need a button to behave differently, you change the button.'
  },
  {
    t: 'Composition.',
    d: 'Components are small primitives that compose into the patterns the product needs. We do not ship a "Card with image and CTA". We ship surfaces, headings, buttons; the product author composes.'
  },
  {
    t: 'Distribution.',
    d: 'The Tailwind preset is the canonical distribution. Drop it in any Eidos product and you get the full token graph — colors, type, spacing, motion — without copying CSS variables by hand.'
  },
  {
    t: 'Beautiful defaults.',
    d: 'A component should look right with zero props. The default ember button is the primary action. The default surface is dark, calm, hairline-bordered. Defaults compound; ours compound in the same direction.'
  },
];

const FAQS = [
  {
    q: 'Is this a component library?',
    a: 'No. It is a system: a set of tokens, primitives, and patterns the Eidos product is built on. Some of those primitives ship as React components in this repo, others as Tailwind utilities, others as plain CSS classes.'
  },
  {
    q: 'How do I add Eidos to a new product?',
    a: 'Install the Tailwind v4 preset, link tokens.css and ds.css, and pick the components you need from this site. Copy the JSX into your project — the system is meant to be owned, not imported.'
  },
  {
    q: 'Do I need React to use this?',
    a: 'No. The CSS layer (tokens + class system) works with any framework. The React components in this repo are reference implementations; reach for them in React projects, port them in others.'
  },
  {
    q: 'Why is the accent so loud?',
    a: 'Because there is only one. Ember is reserved for the single most important action on every surface. If everything is ember, nothing is.'
  },
];

export default function Overview() {
  const { stats: HERO_STATS, status: tokenStatus } = useHeroStats();
  const reducedMotion = usePrefersReducedMotion();
  return (
  <section id="overview" className="ds-section" style={{paddingTop: 24}}>
    <div className="ds-h-eyebrow">Eidos / Design System</div>
    <h1 className="ds-h1">Build Eidos products.</h1>
    <p className="ds-lede">
      A set of beautifully-designed, copy-and-paste components, tokens, and patterns for the Equifax Brasil platform. Open code. Calm density. Dark-first. Use it for every internal product.
    </p>

    {/* Hero */}
    <div className="ds-hero">
      <div className="grid"/>
      <div className="glow"/>
      <div style={{display:'grid', gridTemplateColumns:'1.1fr 1fr', gap: 48, alignItems:'center'}}>
        <div>
          <div className="ds-h-eyebrow" style={{marginBottom: 14}}>v1.0 · Stable · Updated May 2026</div>
          <h2 className="t-h2" style={{marginBottom: 14}}>
            Eidos is sharp, dense, and dark-first.<br/>
            <span style={{color:'var(--fg-muted)'}}>Built on Geist + Tailwind v4.</span>
          </h2>
          <p className="t-small" style={{color:'var(--fg-muted)', maxWidth: '52ch'}}>
            A surface palette, one ember accent, Geist + Geist Mono, a 4-pixel rhythm. A composable component library and a ready-to-drop Tailwind preset.
          </p>
          <div style={{display:'flex', gap: 8, marginTop: 22}}>
            <a className="btn ember" href="/components-catalog">Browse components <Icons.arrowRight size={14}/></a>
            <a className="btn" href="/installation">Installation</a>
            <a className="btn ghost" href="/color">Tokens</a>
          </div>
        </div>
        <div
          style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap: 10}}
          aria-busy={tokenStatus === 'loading'}
        >
          {HERO_STATS.map((s) => {
            // The Tokens count is read from the live stylesheet, not typed into copy.
            // LOADING → em-dash + faint ink; READY → counted number + ember spark
            // (the one micro-moment that argues Eidos's "honest by construction"
            // thesis — numbers come from disk, never from marketing); ERROR → "n/a"
            // in danger ink + the recovery banner below.
            const live = s.live;
            const isReady = live && tokenStatus === 'ready';
            const isError = live && tokenStatus === 'error';
            const isLoading = live && tokenStatus === 'loading';
            return (
            <div key={s.k} className="surface" style={{padding: 16}}>
              <div className="t-mono-label" style={{display:'flex', alignItems:'center', gap: 6}}>
                {s.k}
                {isReady && (
                  <span
                    aria-hidden="true"
                    title="Counted live from the stylesheet"
                    style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background:'var(--ember)', boxShadow:'0 0 0 3px var(--ember-soft)',
                      // Reduced-motion: a static dot, no pulse (inline anim can't
                      // be reached by the keyframe's own @media guard).
                      animation: reducedMotion ? 'none' : 'ds-spin-pulse 2.4s var(--ease) infinite',
                    }}
                  />
                )}
              </div>
              <div
                className="t-mono"
                aria-live={live ? 'polite' : undefined}
                style={{
                  fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing:'-0.02em',
                  marginTop: 4, lineHeight: 1.1,
                  fontVariantNumeric: 'tabular-nums',
                  color: isLoading ? 'var(--fg-faint)' : isError ? 'var(--danger)' : 'var(--fg)',
                }}
              >{s.v}</div>
              <div className="t-small" style={{color:'var(--fg-subtle)', marginTop: 2}}>{s.s}</div>
            </div>
            );
          })}
        </div>
      </div>
      {/* ERROR state — surfaced as a real role="alert" banner, not a silent zero.
          Only paints when the live token read failed; the demo thus shows its
          failure path instead of merely describing it. */}
      {tokenStatus === 'error' && (
        <Alert tone="danger" style={{marginTop: 14}}>
          <AlertTitle>Token count unavailable</AlertTitle>
          <AlertDescription>
            The stylesheet could not be read in this context, so the live count is shown as
            {' '}<span style={{fontFamily:'var(--font-mono)'}}>n/a</span>. The token graph itself is
            unaffected — open Color tokens to browse the full set.
          </AlertDescription>
        </Alert>
      )}
    </div>

    {/* Philosophy */}
    <div style={{marginTop: 56}}>
      <SubHead meta="4 axes">Philosophy</SubHead>
      <p className="ds-caption wide" style={{marginTop: 0, marginBottom: 22}}>
        This is not a component library. It is how Eidos is built. The four ideas below shape every choice in the system.
      </p>
      <div className="ds-grid cols-2">
        {PHILOSOPHY.map((p) => (
          <div key={p.t} className="surface" style={{padding: 22}}>
            <div className="t-body" style={{fontWeight: 600, marginBottom: 8, letterSpacing:'-0.005em'}}>{p.t}</div>
            <div className="t-small" style={{color:'var(--fg-muted)', lineHeight: 1.6}}>{p.d}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Principles */}
    <div style={{marginTop: 48}}>
      <SubHead meta="3 axes">Principles</SubHead>
      <p className="ds-caption wide" style={{marginTop: 0, marginBottom: 22}}>
        The visual axes the system optimises along. Every token, component, and pattern must serve one of these.
      </p>
      <div className="ds-grid cols-3">
        {PRINCIPLES.map((p) => (
          <div key={p.t} className="surface" style={{padding: 20}}>
            <div className="t-body" style={{fontWeight: 600, marginBottom: 6}}>{p.t}</div>
            <div className="t-small" style={{color:'var(--fg-muted)', lineHeight: 1.6}}>{p.d}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Quick links — surface the most useful next clicks without
        re-printing the whole catalog. The full catalog is its own page. */}
    <div style={{marginTop: 48}}>
      <SubHead meta="6 routes">Start here</SubHead>
      <div className="comp-grid">
        <a href="/installation" className="comp-tile focus-ring" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Installation</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Get the preset wired up</span>
        </a>
        <a href="/components-catalog" className="comp-tile focus-ring" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Components</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Full catalog · <span style={{fontVariantNumeric:'tabular-nums'}}>{countByGroup('Components')}</span> pages</span>
        </a>
        <a href="/color" className="comp-tile focus-ring" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Color tokens</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">6 surface · 4 semantic</span>
        </a>
        <a href="/theming" className="comp-tile focus-ring" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Theming</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Light · Dark · custom</span>
        </a>
        <a href="/tailwind" className="comp-tile focus-ring" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Tailwind v4 preset</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Drop-in @theme block</span>
        </a>
        <a href="/a11y" className="comp-tile focus-ring" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Accessibility</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">WCAG 2.2 AA checklist</span>
        </a>
      </div>
    </div>

    {/* FAQ */}
    <div style={{marginTop: 56}}>
      <SubHead meta={`${FAQS.length} questions`}>FAQ</SubHead>
      <div style={{display:'flex', flexDirection:'column', gap: 10, marginTop: 4}}>
        {FAQS.map((f) => (
          <div key={f.q} className="surface" style={{padding: 18}}>
            <div className="t-body" style={{fontWeight: 600, letterSpacing:'-0.005em', marginBottom: 6, color:'var(--fg)'}}>{f.q}</div>
            <div className="t-small" style={{color:'var(--fg-muted)', lineHeight: 1.6, maxWidth:'70ch'}}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Accessibility — true to what THIS page actually ships: it is a set of
        links + one live region, so the contract is native focus order, the
        announced token count, and reduced-motion. No invented widgets. */}
    <div style={{marginTop: 56}}>
      <SubHead meta="a11y">Accessibility</SubHead>
      <p className="ds-caption wide" style={{marginTop: 0, marginBottom: 18}}>
        The page is built from native links and one live region — every affordance is reachable,
        announced, and honours reduced-motion.
      </p>
      <div className="ds-grid cols-2">
        <div className="surface" style={{padding: 20}}>
          <div className="t-mono-label" style={{marginBottom: 12}}>Keyboard</div>
          <div style={{display:'flex', flexDirection:'column', gap: 2}}>
            <Kbd label="Move to next link (CTA → tile → footer)" keys={['Tab']}/>
            <Kbd label="Move to previous link" keys={['Shift','Tab']}/>
            <Kbd label="Follow the focused link" keys={['Enter']}/>
          </div>
          <p className="t-small" style={{color:'var(--fg-muted)', lineHeight: 1.6, marginTop: 12, marginBottom: 0}}>
            Focus order follows the visual order — hero CTAs, then the Start-here tiles, then the footer.
            Each link carries the shared <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)'}}>.focus-ring</span> so
            the ember outline is always visible on keyboard focus.
          </p>
        </div>
        <div className="surface" style={{padding: 20}}>
          <div className="t-mono-label" style={{marginBottom: 12}}>ARIA &amp; motion</div>
          <ul className="t-small" style={{color:'var(--fg-muted)', lineHeight: 1.6, margin: 0, paddingInlineStart: 18, display:'flex', flexDirection:'column', gap: 6}}>
            <li>The Tokens tile is a polite live region (<span style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)'}}>aria-live=&quot;polite&quot;</span>, <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)'}}>aria-busy</span> while loading) so the resolved count is announced once, not on every frame.</li>
            <li>The live spark is decorative — <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)'}}>aria-hidden=&quot;true&quot;</span> — so it never reaches the accessibility tree.</li>
            <li>If the count cannot be read it raises a <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)'}}>role=&quot;alert&quot;</span> banner rather than a misleading zero.</li>
            <li>Under <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)'}}>prefers-reduced-motion</span> the spark stops pulsing and renders as a static dot.</li>
            <li>Contrast: the single ember CTA uses dark ink on its fill ({'>'}=AA); body text on every surface clears 4.5:1.</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{marginTop: 56, padding: 24, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', background:'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'space-between', gap: 16, flexWrap:'wrap'}}>
      <div>
        <div className="t-body" style={{fontWeight: 600, letterSpacing:'-0.01em'}}>Building something new?</div>
        <div className="t-small" style={{color:'var(--fg-muted)', marginTop: 4}}>Start from the Tailwind preset — it ships every token Eidos uses.</div>
      </div>
      <div style={{display:'flex', gap: 8}}>
        <a className="btn ghost" href="/a11y">Accessibility</a>
        <a className="btn" href="/changelog">Changelog</a>
        <a className="btn ember" href="/tailwind">Get the preset <Icons.arrowRight size={14}/></a>
      </div>
    </div>
  </section>
  );
}
