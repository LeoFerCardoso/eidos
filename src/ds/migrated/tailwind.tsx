'use client';
import { Icons, Section, SubHead, Frame, Lede, Mono } from '@/ds/core';

const TW_V4 = `/* tailwind.css — Tailwind v4, CSS-first */
@import "tailwindcss";

@theme {
  /* Colors — surface */
  --color-bg: #08090A;
  --color-bg-elevated: #0F1011;
  --color-surface: #141517;
  --color-surface-hover: #1A1B1E;
  --color-surface-active: #1F2024;

  /* Colors — foreground */
  --color-fg: #EDEDED;
  --color-fg-muted: #A1A1A6;
  --color-fg-subtle: #6B6B70;
  --color-fg-faint: #4A4A4F;

  /* Colors — ember (the one accent) */
  --color-ember: #FF6B35;
  --color-ember-glow: #FF8C42;
  --color-ember-deep: #E04E1A;
  --color-ember-soft: rgb(255 107 53 / 0.12);
  --color-ember-softer: rgb(255 107 53 / 0.06);

  /* Colors — accents */
  --color-ice: #7DD3FC;
  --color-violet: #A78BFA;

  /* Colors — status */
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-danger: #F87171;

  /* Colors — borders (alpha tokens) */
  --color-border: rgb(255 255 255 / 0.06);
  --color-border-strong: rgb(255 255 255 / 0.12);
  --color-border-stronger: rgb(255 255 255 / 0.18);

  /* Typography */
  --font-sans: "Geist", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
  --font-feature-settings--sans: "cv11", "ss01";
  --font-feature-settings--mono: "tnum", "zero";

  /* Type scale */
  --text-display-xl: 4.5rem;
  --text-display-xl--line-height: 1.02;
  --text-display-xl--letter-spacing: -0.04em;
  --text-display-lg: 3.5rem;
  --text-display-lg--line-height: 1.05;
  --text-display-lg--letter-spacing: -0.03em;
  --text-h1: 2.25rem;
  --text-h1--line-height: 1.15;
  --text-h1--letter-spacing: -0.02em;
  --text-h2: 1.75rem;
  --text-h2--line-height: 1.2;
  --text-h2--letter-spacing: -0.02em;
  --text-h3: 1.25rem;
  --text-h3--line-height: 1.3;
  --text-h3--letter-spacing: -0.01em;
  --text-body-lg: 1.0625rem;
  --text-body: 0.9375rem;
  --text-small: 0.8125rem;
  --text-mono-label: 0.6875rem;
  --text-mono-label--letter-spacing: 0.08em;

  /* Spacing — 4px base */
  --spacing: 0.25rem;

  /* Radius */
  --radius-xs: 3px;
  --radius-sm: 4px;
  --radius-md: 5px;
  --radius-lg: 6px;
  --radius-xl: 8px;
  --radius-2xl: 12px;

  /* Shadows */
  --shadow-1: 0 1px 0 rgb(0 0 0 / 0.4);
  --shadow-2: 0 8px 24px rgb(0 0 0 / 0.35);
  --shadow-3: 0 24px 60px rgb(0 0 0 / 0.55);
  --shadow-ember: 0 0 0 3px rgb(255 107 53 / 0.18);

  /* Motion */
  --ease-eidos: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 120ms;
  --duration-normal: 220ms;
  --duration-slow: 360ms;

  /* Animations */
  --animate-ember-pulse: ember-pulse 2s var(--ease-eidos) infinite;
  --animate-page-enter: fade-in 360ms var(--ease-eidos) both;
  --animate-sheet-in: sheet-in 360ms var(--ease-eidos) both;
  --animate-progress: progress 2.6s var(--ease-eidos) infinite;
}

/* Light theme — opt in with [data-theme="light"] on <html> */
[data-theme="light"] {
  --color-bg: #FAFAFA;
  --color-bg-elevated: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-surface-hover: #F4F4F5;
  --color-surface-active: #ECECEE;
  --color-fg: #0A0A0B;
  --color-fg-muted: #52525B;
  --color-fg-subtle: #71717A;
  --color-fg-faint: #A1A1AA;
  --color-ember: #E85A28;
  --color-ember-glow: #FF6B35;
  --color-ember-soft: rgb(232 90 40 / 0.10);
  --color-border: rgb(0 0 0 / 0.08);
  --color-border-strong: rgb(0 0 0 / 0.14);
  --color-border-stronger: rgb(0 0 0 / 0.22);
}

/* Dark mode — variant so utilities work without [data-theme] */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@keyframes ember-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgb(255 107 53 / 0.5); }
  50%      { box-shadow: 0 0 0 6px rgb(255 107 53 / 0); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes sheet-in {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes progress {
  from { width: 0%; }
  to   { width: 100%; }
}`;

const TW_V3 = `// tailwind.config.js — Tailwind v3 preset
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover: 'var(--surface-hover)',
          active: 'var(--surface-active)',
        },
        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          faint: 'var(--fg-faint)',
        },
        ember: {
          DEFAULT: 'var(--ember)',
          glow: 'var(--ember-glow)',
          deep: 'var(--ember-deep)',
          soft: 'var(--ember-soft)',
          softer: 'var(--ember-softer)',
        },
        ice: 'var(--ice)',
        violet: 'var(--violet)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          stronger: 'var(--border-stronger)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem',  { lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display-lg': ['3.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'h1':         ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2':         ['1.75rem', { lineHeight: '1.2',  letterSpacing: '-0.02em', fontWeight: '600' }],
        'h3':         ['1.25rem', { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '500' }],
        'body-lg':    ['1.0625rem', { lineHeight: '1.55' }],
        'body':       ['0.9375rem', { lineHeight: '1.55' }],
        'small':      ['0.8125rem', { lineHeight: '1.5' }],
        'mono-label': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        xs: '3px', sm: '4px', md: '5px', lg: '6px', xl: '8px', '2xl': '12px',
      },
      boxShadow: {
        1: '0 1px 0 rgba(0,0,0,0.4)',
        2: '0 8px 24px rgba(0,0,0,0.35)',
        3: '0 24px 60px rgba(0,0,0,0.55)',
        ember: '0 0 0 3px rgba(255,107,53,0.18)',
      },
      transitionTimingFunction: {
        eidos: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '120ms', DEFAULT: '220ms', slow: '360ms',
      },
      animation: {
        'ember-pulse': 'ember-pulse 2s cubic-bezier(0.16,1,0.3,1) infinite',
        'page-enter':  'fade-in 360ms cubic-bezier(0.16,1,0.3,1) both',
        'sheet-in':    'sheet-in 360ms cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        'ember-pulse': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,107,53,0.5)' },
          '50%':     { boxShadow: '0 0 0 6px rgba(255,107,53,0)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};`;

const TW_TOKENS_CSS = `/* tokens.css — drop-in CSS variables (works without Tailwind too) */
:root {
  --bg: #08090A; --bg-elevated: #0F1011;
  --surface: #141517; --surface-hover: #1A1B1E; --surface-active: #1F2024;
  --fg: #EDEDED; --fg-muted: #A1A1A6; --fg-subtle: #6B6B70; --fg-faint: #4A4A4F;
  --ember: #FF6B35; --ember-glow: #FF8C42; --ember-deep: #E04E1A;
  --ember-soft: rgba(255,107,53,0.12); --ember-softer: rgba(255,107,53,0.06);
  --ice: #7DD3FC; --violet: #A78BFA;
  --success: #34D399; --warning: #FBBF24; --danger: #F87171;
  --border: rgba(255,255,255,0.06); --border-strong: rgba(255,255,255,0.12); --border-stronger: rgba(255,255,255,0.18);
}
[data-theme="light"] {
  --bg: #FAFAFA; --bg-elevated: #FFFFFF;
  --surface: #FFFFFF; --surface-hover: #F4F4F5; --surface-active: #ECECEE;
  --fg: #0A0A0B; --fg-muted: #52525B; --fg-subtle: #71717A; --fg-faint: #A1A1AA;
  --ember: #E85A28; --ember-glow: #FF6B35;
  --ember-soft: rgba(232,90,40,0.10);
  --border: rgba(0,0,0,0.08); --border-strong: rgba(0,0,0,0.14); --border-stronger: rgba(0,0,0,0.22);
}`;

export default function Tailwind() {
  return (
    <Section
      id="tailwind"
      num="05"
      title="Tailwind"
      desc="Eidos is built CSS-first. Drop the @theme block into your tailwind.css and every Eidos token becomes a Tailwind utility — bg-ember, text-fg-muted, rounded-lg, animate-ember-pulse, ease-eidos."
    >
      {/* Path picker */}
      <SubHead meta="pick one">Which preset do you need?</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 'var(--space-2)'}}>
        <div className="surface" style={{padding: 'var(--space-4)', borderColor:'var(--ember-soft)'}}>
          <div style={{display:'flex', alignItems:'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)'}}>
            <span className="pill ember"><span className="dot"/>recommended</span>
            <span className="t-body" style={{fontWeight: 600}}>Tailwind v4</span>
          </div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            CSS-first via <Mono>@theme</Mono>. One <Mono>tailwind.css</Mono> file, no JS config. Light/dark via <Mono>data-theme</Mono>.
          </div>
        </div>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div style={{display:'flex', alignItems:'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)'}}>
            <span className="pill"><span className="dot"/>legacy</span>
            <span className="t-body" style={{fontWeight: 600}}>Tailwind v3</span>
          </div>
          <div className="t-small" style={{color:'var(--fg-muted)'}}>
            Classic <Mono>tailwind.config.js</Mono>. Use this only if you can't upgrade to v4 yet — same tokens under the hood.
          </div>
        </div>
      </div>

      {/* v4 — primary path */}
      <SubHead meta="recommended">Tailwind v4 — the @theme preset</SubHead>
      <Lede up>
        v4 reads tokens straight from CSS. Paste this block into your <Mono>tailwind.css</Mono> entry and every Eidos token becomes a utility. No <Mono>tailwind.config.js</Mono>, no JS, no plugin hop.
      </Lede>
      <Frame label="tailwind.css" lang="css" code={TW_V4}>
        <div style={{display:'flex', gap: 'var(--space-2)', flexWrap:'wrap'}}>
          <span className="inline-tag">colors → bg-ember, text-fg, border-border-strong</span>
          <span className="inline-tag">type → text-h1, text-mono-label, font-mono</span>
          <span className="inline-tag">radius → rounded-lg, rounded-2xl</span>
          <span className="inline-tag">motion → animate-ember-pulse, ease-eidos, duration-normal</span>
        </div>
      </Frame>
      <Lede>
        The <Mono>@custom-variant dark</Mono> at the bottom lets you write <Mono>dark:bg-surface</Mono> and have it match the <Mono>data-theme="dark"</Mono> selector — no class swap needed.
      </Lede>

      {/* v3 — legacy path */}
      <SubHead meta="legacy">Tailwind v3 — drop-in config</SubHead>
      <Lede up>
        Still on v3? Same tokens, classic config. Pair this with <Mono>tokens.css</Mono> imported globally — the JS object reads CSS variables, so <Mono>data-theme</Mono> still drives theme switching.
      </Lede>
      <Frame label="tailwind.config.js" lang="jsx" code={TW_V3}>
        <div className="t-small" style={{color:'var(--fg-muted)'}}>
          <Mono>darkMode: ['class', '[data-theme="dark"]']</Mono> makes <Mono>dark:</Mono> utilities respect the same attribute selector v4 uses.
        </div>
      </Frame>

      {/* Tokens-only escape hatch */}
      <SubHead meta="no Tailwind">tokens.css — escape hatch</SubHead>
      <Lede up>
        Can't pull Tailwind into a project (legacy app, email template, embedded widget)? Drop just <Mono>tokens.css</Mono>. The variables work everywhere CSS does — including the dark/light theme switch via <Mono>[data-theme]</Mono>.
      </Lede>
      <Frame label="tokens.css" lang="css" code={TW_TOKENS_CSS}>
        <div className="t-small" style={{color:'var(--fg-muted)'}}>
          Pure CSS variables, zero build step. Same tokens, no Tailwind required.
        </div>
      </Frame>

      {/* Conventions */}
      <SubHead meta="rules">Conventions</SubHead>
      <table className="spec">
        <thead><tr><th>Convention</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td>Use semantic tokens (<code style={{fontFamily:'var(--font-mono)'}}>bg-surface</code>, not <code style={{fontFamily:'var(--font-mono)'}}>bg-zinc-900</code>)</td><td>Keeps the light theme honest. Raw zinc/slate breaks on theme switch.</td></tr>
          <tr><td>One <code style={{fontFamily:'var(--font-mono)'}}>bg-ember</code> per surface</td><td>Ember signals attention. More than one cancels itself out.</td></tr>
          <tr><td><code style={{fontFamily:'var(--font-mono)'}}>ease-eidos</code> + <code style={{fontFamily:'var(--font-mono)'}}>duration-normal</code> on every transition</td><td>Single ease, three durations. No bespoke timings in components.</td></tr>
          <tr><td>Numbers in <code style={{fontFamily:'var(--font-mono)'}}>font-mono</code> + <code style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>tnum</code></td><td>p95, versions, counts must be tabular so digits don't dance on update.</td></tr>
          <tr><td>Borders are hairlines (<code style={{fontFamily:'var(--font-mono)'}}>border-border</code>)</td><td>Eidos doesn't use 2px borders or thick dividers anywhere.</td></tr>
        </tbody>
      </table>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-body" style={{fontWeight: 600, marginBottom: 'var(--space-2)'}}>Contrast-safe pairings</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The token utilities are pre-paired for AA: <Mono>bg-surface</Mono> with <Mono>text-fg</Mono>, <Mono>bg-ember</Mono> with dark ink (<Mono>text-bg</Mono>) — never <Mono>text-ember on bg-ember</Mono>. Reaching for raw <Mono>bg-zinc-*</Mono> / <Mono>text-slate-*</Mono> bypasses those guarantees and breaks on theme switch.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-body" style={{fontWeight: 600, marginBottom: 'var(--space-2)'}}>Focus ring</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Use the ember ring utilities (<Mono>ring-ring</Mono> / <Mono>outline-ring</Mono>) for focus rather than removing outlines — keyboard focus must stay visible on every interactive class you compose.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-body" style={{fontWeight: 600, marginBottom: 'var(--space-2)'}}>Never colour alone</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>State utilities (<Mono>text-danger</Mono>, <Mono>bg-warning</Mono>) carry colour only — always pair them with a label or icon so meaning survives for colour-blind users and in forced-colours mode.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div className="t-body" style={{fontWeight: 600, marginBottom: 'var(--space-2)'}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Animation utilities like <Mono>animate-ember-pulse</Mono> must be guarded with the <Mono>motion-reduce:</Mono> variant (e.g. <Mono>motion-reduce:animate-none</Mono>) so they stop under <Mono>prefers-reduced-motion</Mono>.</div>
        </div>
      </div>

      {/* Where to go for examples */}
      <SubHead meta="examples">Where do the usage examples live?</SubHead>
      <Lede up>
        Every component page in this site ships its own copy-paste snippet — Tailwind classes for buttons, pills, cards, surfaces and the rest. Look at any component page's frame footer for the source.
      </Lede>
      <div className="ds-grid cols-3">
        <a href="/buttons" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Buttons</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Primary · Secondary · Ghost</span>
        </a>
        <a href="/pills" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Pills &amp; Chips</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">State · attribute</span>
        </a>
        <a href="/card" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Card</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Surface composition</span>
        </a>
      </div>
    </Section>
  );
}
