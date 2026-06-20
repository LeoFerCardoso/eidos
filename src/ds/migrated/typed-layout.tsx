'use client';
// Eidos DS — Get Started / Typed Layout
import { Icons, Section, SubHead, Lede, CodeBlock, Mono, Frame, Box, Stack, Inline, Grid } from '@/ds/core';

// Inline code reference — recedes with --fg-subtle so the single ember accent isn't
// overspent on the token names this page mentions in nearly every sentence.
const Code = ({ children }: { children?: React.ReactNode }) => <Mono tone="subtle">{children}</Mono>;

export default function TypedLayout() {
  return (
    <Section
      id="typed-layout"
      title="Typed Layout"
      desc="Layout in Eidos is a strongly-typed vocabulary. Spacing, color and radius are token props — an off-system value does not compile, and raw markup fails the lint gate.">

      <p style={{ color: 'var(--fg-muted)', maxWidth: '68ch', marginBottom: 22, lineHeight: 1.6 }}>
        Components style themselves; <em>arranging</em> them goes through four primitives —{' '}
        <Code>Box</Code> and its presets <Code>Stack</Code>, <Code>Inline</Code>, <Code>Grid</Code> —
        from <Code>@eidos/ui</Code>. They take only design-token props, so a layout can&apos;t drift
        off the scale or off the palette: the wrong value isn&apos;t a visual regression found weeks
        later, it&apos;s a compile error. Semantics come from the polymorphic <Code>as</Code> prop,
        so the markup stays meaningful HTML.
      </p>

      {/* ── 1. The vocabulary (Scale / Roles) ───────────────────────────── */}
      <SubHead meta="1 primitive · 4 presets">The vocabulary</SubHead>
      <Lede up>
        <Code>Stack</Code> is a vertical flow, <Code>Inline</Code> a horizontal cluster,{' '}
        <Code>Grid</Code> a column set, <Code>Box</Code> the polymorphic base. Every one is the
        same <Code>Box</Code> underneath with different defaults — and the demo below is built
        entirely from them.
      </Lede>
      <Frame label="Stack · Inline · Grid — rendered from token props (live)">
        <div style={{ maxWidth: 520, marginInline: 'auto', inlineSize: '100%' }}>
          <Stack gap="3">
            <Inline justify="between" align="center">
              <Box color="fg">Inline · space-between</Box>
              <Box color="fg-muted">token props only</Box>
            </Inline>
            <Grid columns="3" gap="2">
              <Box p="3" background="surface" radius="md" borderColor="border" color="fg-muted">col 1</Box>
              <Box p="3" background="surface" radius="md" borderColor="border" color="fg-muted">col 2</Box>
              <Box p="3" background="surface" radius="md" borderColor="border" color="fg-muted">col 3</Box>
            </Grid>
          </Stack>
        </div>
      </Frame>
      <CodeBlock
        label="the source of that frame"
        code={`import { Box, Stack, Inline, Grid } from '@eidos/ui';

<Stack gap="3">
  <Inline justify="between" align="center">
    <Box color="fg">Inline · space-between</Box>
    <Box color="fg-muted">token props only</Box>
  </Inline>
  <Grid columns="3" gap="2">
    <Box p="3" background="surface" radius="md" borderColor="border">col 1</Box>
    {/* … */}
  </Grid>
</Stack>`}
        lang="jsx"
      />

      {/* ── 2. In practice (before / after, live after) ─────────────────── */}
      <SubHead meta="applied">From values to decisions</SubHead>
      <Lede up>
        <Code>padding: 16</Code> states a pixel count; <Code>p="4"</Code> states a spacing role
        that stays correct when the scale moves. The card below is the same surface a product
        would ship — assembled from the vocabulary, nothing hand-styled.
      </Lede>
      <Frame label="a real card — built only from the typed primitives (live)">
        <div style={{ maxWidth: 420, marginInline: 'auto', inlineSize: '100%' }}>
          <Stack gap="4" p="4" background="bg-elevated" radius="lg" borderColor="border">
            <Inline justify="between" align="center">
              <Box color="fg">Service health</Box>
              <Box color="fg-muted">SLO 99.9%</Box>
            </Inline>
            <Box color="fg-muted">99.94% uptime over the last 30 days — within SLO.</Box>
            <Inline gap="2">
              <Box as="span" px="3" py="1" background="ember-soft" radius="full" color="fg">healthy</Box>
              <Box as="span" px="3" py="1" background="surface" radius="full" color="fg-muted">p95 14ms</Box>
            </Inline>
          </Stack>
        </div>
      </Frame>
      <CodeBlock
        label="before — off-system, no guardrail"
        code={`<div style={{ display: 'flex', flexDirection: 'column', gap: 14,
             padding: 16, background: '#1c1c1e', borderRadius: 12 }}>
  <span style={{ color: '#888' }}>Service health</span>
</div>`}
        lang="jsx"
      />
      <CodeBlock
        label="after — token vocabulary, compiler-checked"
        code={`<Stack gap="4" p="4" background="bg-elevated" radius="lg">
  <Box as="span" color="fg-muted">Service health</Box>
</Stack>`}
        lang="jsx"
      />

      {/* ── 3. Principles ───────────────────────────────────────────────── */}
      <SubHead meta="rules">Why it&apos;s built this way</SubHead>
      <Lede up>
        A design system should be a set of decisions that are the only ones expressible. Four ideas
        make that real in Eidos.
      </Lede>
      <div className="ds-grid cols-2" style={{ marginBlock: 'var(--space-3) var(--space-6)' }}>
        {[
          ['Tokens are decisions', <>A prop like <Code>background="surface"</Code> records intent, not a hex. Change your mind once at the token source — every surface follows.</>],
          ['The wrong value won’t compile', <>Props are token unions (<Code>SpaceToken</Code>, <Code>BackgroundToken</Code>). <Code>gap="7"</Code> or <Code>background="blurple"</Code> is a TypeScript error.</>],
          ['Semantics via `as`', <><Code>&lt;Box as="nav"&gt;</Code>, <Code>&lt;Stack as="ul"&gt;</Code> — the right element with none of the open string surface. Accessibility is preserved.</>],
          ['The gate closes the loop', <><Code>eslint-plugin-eidos</Code> fails the build on a raw <Code>&lt;div&gt;</Code>, an inline <Code>style</Code>, or a hardcoded color. Docs are probabilities; CI is a contract.</>],
        ].map(([t, d], i) => (
          <div key={i} className="surface" style={{ padding: 16 }}>
            <div className="ds-h-eyebrow" style={{ marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* ── 4. Under the hood (generation) ──────────────────────────────── */}
      <SubHead meta="generated">Generated, never hand-kept</SubHead>
      <Lede up>
        The canonical source is <Code>tokens.css</Code>. One generator emits, in lock-step, the
        typed token unions (<Code>tokens.gen.ts</Code>) and the atomic stylesheet the primitives
        compose (<Code>system.gen.css</Code>) — so the types can only express a value the
        stylesheet actually ships. They cannot drift.
      </Lede>
      <CodeBlock
        label="regenerate after a token change"
        code={`npm run gen:system        # tokens.css → tokens.gen.ts + system.gen.css
npm run check:system      # CI: fails if either artifact is stale`}
        lang="bash"
      />

      {/* ── 5. RTL ──────────────────────────────────────────────────────── */}
      <SubHead meta="bidi">RTL — logical by construction</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        The spacing props are logical: <Code>px</Code>/<Code>py</Code> are the inline/block axes,{' '}
        <Code>ps</Code>/<Code>pe</Code> inline start/end. The same markup mirrors under{' '}
        <Code>dir="rtl"</Code> with no override — the inline-start padding moves to the right.
      </p>
      <Frame label="ps='6' — leading padding flips with direction (live)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div className="t-mono-label" style={{ padding: 0, marginBottom: 8 }}>LTR</div>
            <Inline ps="6" py="2" background="ember-soft" radius="lg" color="fg">ps=&quot;6&quot; leads here →</Inline>
          </div>
          <div dir="rtl">
            <div className="t-mono-label" style={{ padding: 0, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>RTL</div>
            <Inline ps="6" py="2" background="ember-soft" radius="lg" color="fg">حشوة بادئة</Inline>
          </div>
        </div>
      </Frame>

      {/* ── 6. Accessibility & pairings ─────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Real semantics</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <Code>as</Code> renders the correct element — <Code>nav</Code>, <Code>ul</Code>,{' '}
            <Code>li</Code>, <Code>header</Code> — so the accessibility tree is meaningful markup,
            not a stack of <code>div</code>s. Closing the raw-element path never costs semantics.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast pairings</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Color props resolve to theme-aware tokens already tuned to clear AA in light and dark.
            A foreground on <Code>background="surface"</Code> inherits the contrast-safe pair instead
            of an ad-hoc hex that might fail in one mode.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>RTL &amp; reflow</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Logical spacing props mirror under RTL and, being token (rem-derived) values, survive
            200% zoom and 320px reflow (WCAG 1.4.10) without targets overlapping or padding collapsing.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Grouping</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <Code>Stack</Code>/<Code>Inline</Code> gaps convey relationships visually; pairing them
            with the right <Code>as</Code> (a <code>ul</code> of <code>li</code>) means a screen
            reader hears the same grouping a sighted user sees.
          </div>
        </div>
      </div>

      {/* ── 7. Do / Don't ───────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don&apos;t</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — typed primitive</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
{`<Stack gap="4" p="4"
       background="surface">`}
            </pre>
          </div>
          <div className="note">Token props; an off-system value won&apos;t compile.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — raw div + inline style</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
{`<div style={{ display:'flex',
  gap:14, padding:16 }}>`}
            </pre>
          </div>
          <div className="note">No type-check, no token discipline — the lint gate fails the build.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — semantics via `as`</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
{`<Box as="nav">
  <Stack as="ul">…`}
            </pre>
          </div>
          <div className="note">The accessibility tree is real <code>nav</code>/<code>ul</code> markup.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — div soup</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
{`<div><div><div>
  clickable div…`}
            </pre>
          </div>
          <div className="note">Nested <code>div</code>s carry no role — keyboard and SR users lose the structure.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — color tokens</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
{`background="bg-elevated"
color="fg-muted"`}
            </pre>
          </div>
          <div className="note">Theme-aware and AA-safe in light and dark.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — hardcoded color</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>
{`background: '#1c1c1e'
color: '#888'`}
            </pre>
          </div>
          <div className="note">Breaks in one theme; <code>no-hardcoded-color</code> blocks it.</div>
        </div>
      </div>

      {/* ── 8. Reference (prop → token) ─────────────────────────────────── */}
      <SubHead meta="reference">Prop reference</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        Each prop accepts a token union; the value maps to a CSS variable. Full scales live in{' '}
        <Code>Spacing &amp; Radius</Code> and <Code>Color</Code>.
      </p>
      <table className="spec">
        <thead>
          <tr><th>Prop</th><th>Token type</th><th>Maps to</th></tr>
        </thead>
        <tbody>
          <tr><td className="tok-name">p · px · py · pt · pb · ps · pe</td><td className="mono">SpaceToken</td><td>logical padding → <span className="mono">--space-*</span></td></tr>
          <tr><td className="tok-name">gap · gapX · gapY</td><td className="mono">SpaceToken</td><td>flex/grid gap → <span className="mono">--space-*</span></td></tr>
          <tr><td className="tok-name">radius</td><td className="mono">RadiusToken</td><td><span className="mono">--radius-*</span></td></tr>
          <tr><td className="tok-name">background</td><td className="mono">BackgroundToken</td><td><span className="mono">background-color</span></td></tr>
          <tr><td className="tok-name">borderColor</td><td className="mono">BorderToken</td><td><span className="mono">1px solid var(--…)</span></td></tr>
          <tr><td className="tok-name">color</td><td className="mono">TextToken</td><td><span className="mono">color</span></td></tr>
          <tr><td className="tok-name">display · direction · align · justify · wrap</td><td className="mono">enum</td><td>flexbox</td></tr>
          <tr><td className="tok-name">columns</td><td className="mono">1–12</td><td><span className="mono">grid-template-columns</span></td></tr>
          <tr><td className="tok-name">as</td><td className="mono">ElementType</td><td>the rendered semantic element</td></tr>
        </tbody>
      </table>
    </Section>
  );
}
