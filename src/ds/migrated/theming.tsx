'use client';
import * as React from 'react';
import { Icons, Section, SubHead, CodeBlock, Mono, Lede, Alert, AlertTitle, AlertDescription } from '@/ds/core';

const ThemePreview = ({ theme }: { theme: 'dark' | 'light' }) => (
  <div data-mode={theme} className="surface" style={{padding: 16, display:'flex', flexDirection:'column', gap: 10, background:'var(--bg-elevated)', borderColor:'var(--border)'}}>
    <div style={{display:'flex', alignItems:'baseline', gap: 10}}>
      <span className="ds-h-eyebrow">{theme}</span>
      <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)', fontVariantNumeric:'tabular-nums'}}>data-mode="{theme}"</span>
    </div>
    <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.01em'}}>The quick brown fox</div>
    <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)'}}>jumps over the lazy dog. <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>0123456789</span></div>
    <div style={{display:'flex', gap: 8, marginBlockStart: 4, flexWrap:'wrap'}}>
      <button className="btn ember">Primary</button>
      <button className="btn">Secondary</button>
      <button className="btn ghost">Ghost</button>
    </div>
    <div style={{display:'flex', gap: 6, marginBlockStart: 4}}>
      <span className="pill ember"><span className="dot"/>ember</span>
      <span className="pill ice"><span className="dot"/>ice</span>
      <span className="pill success"><span className="dot"/>success</span>
    </div>
  </div>
);

// INNOVATION — the page documents the data-mode swap; this lets you perform it.
// A real <button> segmented control flips data-mode on a live preview pane, so
// readers feel the same token-graph switch the docs describe. Honours
// prefers-reduced-motion via the system .surface transition tokens.
const LiveThemeSwitch = () => {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  return (
    <div className="surface" style={{padding: 16, display:'flex', flexDirection:'column', gap: 14}}>
      <div role="group" aria-label="Preview theme" style={{display:'flex', gap: 6, alignSelf:'flex-start'}}>
        {(['dark', 'light'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={t === theme ? 'btn ember xs' : 'btn xs'}
            aria-pressed={t === theme}
            onClick={() => setTheme(t)}
          >
            {t === 'dark' ? <Icons.moon size={12}/> : <Icons.sun size={12}/>}
            {t}
          </button>
        ))}
      </div>
      <div data-mode={theme} aria-live="polite" style={{borderRadius: 8, padding: 16, background:'var(--bg)', color:'var(--fg)', display:'flex', flexDirection:'column', gap: 10, transition:'background var(--dur) var(--ease), color var(--dur) var(--ease)'}}>
        <div style={{display:'flex', alignItems:'baseline', gap: 10}}>
          <span className="ds-h-eyebrow">live</span>
          <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)', fontVariantNumeric:'tabular-nums'}}>document.documentElement.dataset.mode = "{theme}"</span>
        </div>
        <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.01em'}}>One graph, two surfaces</div>
        <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The same hierarchy, re-resolved against <Mono>{theme}</Mono>. <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>4.5:1</span> text contrast holds in both.</div>
        <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
          <button className="btn ember">Deploy</button>
          <button className="btn ghost">Cancel</button>
          <span className="pill ember"><span className="dot"/>ember</span>
        </div>
      </div>
    </div>
  );
};

export default function Theming() {
  return (
    <Section
      id="theming"
      num="04"
      title="Theming"
      desc="Eidos ships dark and light. Both share one token graph — light is not a translation, it's the same hierarchy seen on paper. Customise per-product by overriding individual tokens."
    >
      {/* Toggle behavior */}
      <SubHead meta="how it works">The data-mode attribute</SubHead>
      <Lede up>
        Theme is selected by setting <Mono>data-mode</Mono> on the document root. Every token in <Mono>tokens.css</Mono> reads that attribute and switches its underlying value — no JS theming layer, no class swap on every component.
      </Lede>
      <CodeBlock label="HTML root" lang="html" code={`<!-- Default — both work -->
<html data-mode="dark">
<html data-mode="light">

<!-- Persist with localStorage in a tiny inline script -->
<script>
  const t = localStorage.getItem('eidos-mode') || 'dark';
  document.documentElement.dataset.mode = t;
</script>`}/>

      {/* Side-by-side preview */}
      <SubHead meta="side by side">Dark · Light</SubHead>
      <div className="ds-grid cols-2">
        <ThemePreview theme="dark"/>
        <ThemePreview theme="light"/>
      </div>

      {/* Live switch — performs the documented data-mode swap */}
      <Lede up>
        Flip it yourself — the control below sets <Mono>data-mode</Mono> on a live pane the same way your app's toggle would. Nothing re-mounts; the token graph just re-resolves.
      </Lede>
      <LiveThemeSwitch/>

      {/* Customising tokens */}
      <SubHead meta="customising">Override a token</SubHead>
      <Lede up>
        Override any token in your product's CSS — Eidos tokens are CSS variables, so the cascade does the work. Scope the override to <Mono>:root</Mono> for a global change or to a specific selector for a sub-tree.
      </Lede>
      <CodeBlock label="theme-overrides.css" lang="css" code={`/* Replace ember with a product-specific accent */
:root[data-mode="dark"] {
  --ember: oklch(72% 0.17 60);          /* warmer, more amber */
  --ember-soft: oklch(72% 0.17 60 / 0.12);
  --ember-glow: oklch(76% 0.20 60);
}

/* Light mode — keep contrast tuned for paper */
:root[data-mode="light"] {
  --ember: oklch(60% 0.17 50);
}

/* Scope an override to one product surface */
.product-billing {
  --ember: oklch(70% 0.18 230);          /* cool ice-blue accent */
  --bg-elevated: oklch(18% 0.01 240);
}`}/>

      {/* The failure mode an override can introduce — a real, labelled invalid state.
          Alert tone="danger" already renders role="alert" (assertive live region). */}
      <div style={{marginBlockStart: 'var(--space-4)'}}>
        <Alert tone="danger">
          <AlertTitle>Override dropped text below AA</AlertTitle>
          <AlertDescription>
            Setting <Mono>--bg-elevated</Mono> to a lighter surface without re-tuning <Mono>--fg-muted</Mono> measured <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>3.1:1</span> — under the <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>4.5:1</span> minimum. Every override must re-check the pairings it touches; the contrast verifier fails the build, not the user.
          </AlertDescription>
        </Alert>
      </div>

      {/* Token surface */}
      <SubHead meta="token reference">The 6 surface tokens</SubHead>
      <Lede up>
        These are the tokens 90% of theming work touches. Everything else (semantic colors, type, spacing) inherits from these via <Mono>color-mix</Mono> and <Mono>oklch</Mono>.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Theming surface</span></div>
        <table className="spec" style={{margin: 0}}>
          <thead>
            <tr><th>Token</th><th>Role</th><th>Override when</th></tr>
          </thead>
          <tbody>
            <tr><td className="tok-name">--bg</td><td>Page canvas</td><td>You need a different working surface (rare)</td></tr>
            <tr><td className="tok-name">--bg-elevated</td><td>Cards, frames, hero blocks</td><td>You want softer card contrast</td></tr>
            <tr><td className="tok-name">--surface</td><td>Inputs, buttons, pills</td><td>You're tuning interactive contrast</td></tr>
            <tr><td className="tok-name">--surface-hover</td><td>Hover state for the above</td><td>Always — keep delta perceptible (~6% L)</td></tr>
            <tr><td className="tok-name">--border</td><td>Hairline default</td><td>Your product needs a different border weight</td></tr>
            <tr><td className="tok-name">--ember</td><td>Primary accent (single)</td><td>Per-product re-brand only</td></tr>
          </tbody>
        </table>
      </div>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 'var(--space-3)'}}>Keyboard — the theme toggle</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockEnd: 'var(--space-3)'}}>The switch is a row of native <Mono>{'<button>'}</Mono>s in a <Mono>role="group"</Mono>; the active one carries <Mono>aria-pressed</Mono>, and the pane is <Mono>aria-live="polite"</Mono> so the change announces.</div>
          <dl style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:'var(--space-2) var(--space-3)', margin:0, alignItems:'baseline'}}>
            <dt style={{margin:0}}><kbd className="kbd">Tab</kbd></dt>
            <dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight:1.55}}>Moves focus onto each theme button; the ember focus ring shows the target.</dd>
            <dt style={{margin:0}}><kbd className="kbd">Enter</kbd> / <kbd className="kbd">Space</kbd></dt>
            <dd style={{margin:0, color:'var(--fg-muted)', fontSize:'var(--text-base)', lineHeight:1.55}}>Activates the focused button, sets <Mono>data-mode</Mono>, and flips <Mono>aria-pressed</Mono>.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Both themes pass AA</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Dark and light share one token graph, and every fg-on-surface pairing is tuned to AA — <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>4.5:1</span> text, <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>3:1</span> non-text — in <em>both</em>. Override a token and you re-check the pairings it touches; a custom surface can quietly drop text below the threshold (see the alert above).</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Respect the system</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Default the theme from <Mono>prefers-color-scheme</Mono> so users who chose light or dark at the OS level land in it, and let a manual <Mono>data-mode</Mono> override persist. Never force one theme on everyone.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Focus &amp; forced colours</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The ember focus ring (<Mono>--ring</Mono>) stays visible against every surface in both themes. Don&apos;t hard-code colours that defeat forced-colours / high-contrast mode — let the token layer resolve.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The live pane eases its swap with <Mono>--dur</Mono> / <Mono>--ease</Mono>. Under <Mono>prefers-reduced-motion: reduce</Mono> the crossfade is dropped so the switch is instant for motion-sensitive users.</div>
        </div>
      </div>

      {/* Do/don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep it to a few tokens</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 6, fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
            <div>--ember: <span style={{color:'var(--ember)'}}>oklch(72% 0.17 60)</span></div>
            <div>--bg-elevated: <span style={{color:'var(--accent-2)'}}>oklch(18% 0.01 240)</span></div>
          </div>
          <div className="note">Two clear overrides. Keep the rest of the system intact so cross-product muscle memory survives.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — re-skin everything</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 4, fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
            <div>--bg: ...</div>
            <div>--surface: ...</div>
            <div>--border: ...</div>
            <div>--fg: ...</div>
            <div>--ember: ...</div>
            <div>--font-display: ...</div>
          </div>
          <div className="note">If your product needs every token rewritten, you don't want Eidos — start a separate system.</div>
        </div>
      </div>
    </Section>
  );
}
