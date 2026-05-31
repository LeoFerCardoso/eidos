import { Section, SubHead, Lede, CodeBlock, TabbedCode, Mono, installTabs, Alert, AlertTitle, AlertDescription, AlertMeta, Spinner } from '@/ds/core';

// Inline code reference, subtle tone by default. The Eidos accent (ember) caps
// at ~2× per screen, so this page — which names a token/flag/file in almost
// every sentence — would massively overspend it if every ref were ember. Spend
// the single accent on the install-step markers + the success state, and let
// every inline code ref recede with var(--fg-subtle).
const Code = ({ children }: { children?: React.ReactNode }) => <Mono tone="subtle">{children}</Mono>;

export default function Page() {
  return (
    <Section
      id="installation"
      title="Installation"
      desc="Eidos is distributed as copy-in components — you own the code, not a black-box dependency. Install the base layer once, then add components with the eidos CLI.">

      {/* ── Quick start ──────────────────────────────────────────────────── */}
      <SubHead meta="cli">Quick start</SubHead>
      <Lede up>
        Two steps. <Code>init</Code> installs the Eidos base layer (design tokens,
        the <Code>ds.css</Code> component styles, and the <Code>cn()</Code> helper) once;{' '}
        <Code>add</Code> copies a component's source into your repo and resolves its
        component + npm dependencies automatically.
      </Lede>
      <CodeBlock
        label="terminal"
        code={`# 1 — install the Eidos base layer once
npx eidos@latest init

# 2 — add components (deps resolved automatically)
npx eidos@latest add metric-card
#   → also copies trend + sparkline (its component deps)`}
        lang="bash"
      />
      <p className="ds-caption">
        After <Code>init</Code>, import the layer once at your app root (order matters):{' '}
        <Code>styles/forge/tokens.css</Code> → <Code>styles/forge/ds.css</Code>. Add{' '}
        <Code>styles/forge/ai.css</Code> only if you use the AI components — the CLI
        pulls it in for you when you add one.
      </p>

      {/* ── Per-component install (the canonical block) ──────────────────── */}
      <SubHead meta="add">Add a component</SubHead>
      <Lede up>
        Every component page opens with this block. The CLI copies the file into
        <Code>components/forge/</Code> — owned, not imported — and installs any npm
        peers the component needs. Pick your package manager:
      </Lede>
      <TabbedCode tabs={installTabs('metric-card')} ariaLabel="package manager"/>

      {/* ── shadcn-compatible ────────────────────────────────────────────── */}
      <SubHead meta="compat">shadcn-compatible</SubHead>
      <Lede up>
        The Eidos registry follows the shadcn <Code>registry-item.json</Code> schema,
        so the stock shadcn CLI works against it too — point it at a component URL:
      </Lede>
      <CodeBlock
        label="terminal"
        code={`npx shadcn@latest add https://eidos.equifax.dev/r/metric-card.json`}
        lang="bash"
      />

      {/* ── How it resolves ──────────────────────────────────────────────── */}
      <SubHead meta="setup">What gets installed</SubHead>
      <Lede up>
        Eidos is plain React over a semantic CSS layer — no Tailwind utilities baked
        into components, no Radix. An install lands exactly three kinds of file.
      </Lede>
      <div className="ds-grid cols-3" style={{ alignItems: 'stretch', marginBlock: 'var(--space-3) var(--space-6)' }}>
        {[
          { n: '1', title: 'Base layer (once)', body: <><Code>eidos init</Code> writes the design tokens, <Code>ds.css</Code>, and the <Code>cn()</Code> helper. Required before any component.</> },
          { n: '2', title: 'Component source', body: <>Each <Code>add</Code> drops a self-contained <Code>.tsx</Code> into <Code>components/forge/</Code>, plus any Eidos components it depends on.</> },
          { n: '3', title: 'Fonts', body: <>Load Geist Sans + Geist Mono (a Google Fonts <Code>&lt;link&gt;</Code> or your framework's font loader) so <Code>--font-sans</Code> / <Code>--font-mono</Code> resolve.</> },
        ].map((c) => (
          <div key={c.n} className="surface" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 'var(--space-5)', blockSize: '100%' }}>
            <span className="t-mono-label" style={{ color: 'var(--ember)', fontVariantNumeric: 'tabular-nums' }}>{c.n} · {c.title}</span>
            <p className="t-small" style={{ margin: 0, color: 'var(--fg-muted)' }}>{c.body}</p>
          </div>
        ))}
      </div>

      {/* ── Install states (what the CLI actually reports) ───────────────── */}
      <SubHead meta="states">Install states</SubHead>
      <Lede up>
        <Code>eidos add</Code> resolves the dependency graph, then copies files. Here
        are the three outcomes it reports — what each looks like in your terminal and how
        to recover from the one that fails.
      </Lede>
      <div className="ds-grid" style={{ gap: 'var(--space-3)', marginBlock: 'var(--space-3) var(--space-6)' }}>
        {/* Resolving — busy / loading. The Spinner carries className="alert-icon" so
            Alert treats it as the leading mark; the alert root is role="status". */}
        <Alert tone="info" assertive={false} aria-busy="true">
          <Spinner size={16} className="alert-icon" aria-label="Resolving metric-card" />
          <AlertTitle>Resolving metric-card…</AlertTitle>
          <AlertDescription>
            Reading the registry and walking the dependency graph. The whole tree —
            <Code>trend</Code> and <Code>sparkline</Code> — installs in one pass.
          </AlertDescription>
        </Alert>

        {/* Installed — success. Single ember-free success tone; dark ink on soft fill. */}
        <Alert tone="success">
          <AlertTitle>Added metric-card + 2 dependencies</AlertTitle>
          <AlertDescription>
            Wrote <Code>components/forge/metric-card.tsx</Code> (plus <Code>trend</Code>,
            <Code>sparkline</Code>) and installed <Code>recharts</Code>. Import it and ship.
          </AlertDescription>
          <AlertMeta>
            <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>3 files</span>
            <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>1 npm peer</span>
            <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>412 ms</span>
          </AlertMeta>
        </Alert>

        {/* Error — base layer missing. role="alert" (assertive) + a concrete recovery. */}
        <Alert tone="danger">
          <AlertTitle>Base layer not found</AlertTitle>
          <AlertDescription>
            No <Code>styles/forge/</Code> in this project. Run <Code>eidos init</Code>{' '}
            once to write the tokens, <Code>ds.css</Code>, and the <Code>cn()</Code> helper,
            then re-run <Code>add</Code>. Nothing was copied — the install is atomic.
          </AlertDescription>
          <AlertMeta>
            <span className="mono" style={{ fontVariantNumeric: 'tabular-nums' }}>exit 1</span>
            <span className="mono">E_NO_BASE</span>
          </AlertMeta>
        </Alert>
      </div>
      <p className="ds-caption">
        Re-running <Code>add</Code> on an existing component is a no-op unless the registry
        version moved — then it shows the diff and asks before overwriting your copy.
      </p>

      {/* ── Manual install ──────────────────────────────────────────────── */}
      <SubHead meta="manual">Manual install</SubHead>
      <Lede up>
        Prefer to copy by hand? Every component page lists its source and dependencies.
        Copy the base layer + the component file, install the listed npm peers, and import
        the stylesheet layer so the semantic classes resolve.
      </Lede>
      <CodeBlock
        label="components/forge/metric-card.tsx"
        code={`// 1. Copy styles/forge/{tokens,ds}.css + lib/utils.ts (the base layer).
// 2. Copy the component file (and any Eidos deps it imports).
// 3. Install its npm peers, e.g.  npm install clsx tailwind-merge
//    (charts → recharts · AI → ai react-markdown).
// 4. Import the layer once at your app root:
//      import './styles/forge/tokens.css';
//      import './styles/forge/ds.css';
import { MetricCard } from '@/components/forge/metric-card';`}
        lang="jsx"
      />

      {/* ── Layout & responsiveness ──────────────────────────────────────── */}
      <SubHead meta="layout">Layout &amp; responsiveness</SubHead>
      <Lede up>
        Eidos components style themselves; <em>arranging</em> them is your call. You do
        <strong> not</strong> need Tailwind for grids or responsiveness — the design
        system ships semantic layout helpers and the components use logical CSS
        properties, so they adapt to viewport and direction out of the box.
      </Lede>
      <CodeBlock
        label="grid + responsiveness (no Tailwind required)"
        code={`/* Grid: the .ds-grid helper + a column count. */
<div className="ds-grid cols-3">   {/* cols-2 · cols-3 · cols-4 · cols-6 */}
  <MetricCard …/> <MetricCard …/> <MetricCard …/>
</div>

/* Responsive: plain CSS media queries in your own stylesheet —
   compose Eidos classes, collapse columns where you need to. */
@media (max-width: 760px) {
  .ds-grid.cols-3 { grid-template-columns: 1fr; }
}

/* RTL is automatic: components use logical properties
   (inline-start / inline-end), so dir="rtl" mirrors them with no extra work. */`}
        lang="jsx"
      />
      <p className="ds-caption">
        Tokens are real CSS variables (<Code>--space-*</Code>, <Code>--radius-*</Code>,
        <Code>--text-*</Code>), so you can build any custom layout in plain CSS or inline
        styles and stay perfectly on-brand — no utility framework needed.
      </p>

      {/* ── Optional Tailwind ────────────────────────────────────────────── */}
      <SubHead meta="optional">Optional: Tailwind</SubHead>
      <Lede up>
        Tailwind is <strong>optional</strong>. Eidos components carry zero Tailwind
        utilities, so they work in any React project (or Vue/Svelte/plain HTML) with or
        without it. If your app already uses Tailwind v4, opt into a token bridge so
        utilities like <Code>bg-surface</Code> / <Code>text-fg-muted</Code> resolve to the
        live, theme-aware Eidos tokens:
      </Lede>
      <CodeBlock
        label="app.css — optional Tailwind token bridge"
        code={`@import "tailwindcss";

/* Map Eidos tokens → Tailwind utilities (theme-aware: tracks light/dark). */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-border: var(--border);
  --color-ember: var(--ember);
  --font-sans: 'Geist', system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;
}`}
        lang="css"
      />
      <p className="ds-caption">
        With the bridge in place you can mix Eidos components and Tailwind utilities for
        bespoke screens — but it's never required to use the design system.
      </p>

      {/* ── CLI reference ───────────────────────────────────────────────── */}
      <SubHead meta="cli">CLI reference</SubHead>
      <Lede up>
        The <Code>eidos</Code> CLI mirrors the shadcn ergonomics — own the code, copied
        not imported.
      </Lede>
      <CodeBlock
        label="terminal"
        code={`# install the base layer (run once per project)
eidos init

# add one or more components (component + npm deps resolved)
eidos add metric-card data-table tool

# list everything available in the registry
eidos list

# diff local components against the registry (drift check)
eidos diff metric-card`}
        lang="bash"
      />

      {/* ── Accessibility (true to this page's interactive surfaces) ──────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>
        This page is itself built from Eidos primitives. The interactive surfaces above —
        the package-manager tabs, every copy button, and the three install-state alerts —
        carry their real semantics.
      </Lede>
      <div className="ds-grid cols-2" style={{ marginBlock: 'var(--space-3) var(--space-2)' }}>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-2)' }}>Keyboard</div>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 'var(--space-4)', rowGap: 'var(--space-2)', alignItems: 'baseline' }}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>moves through the tablist, then each copy button, in source order.</dd>
            <dt><kbd className="kbd">←</kbd> / <kbd className="kbd">→</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>roving focus across the npm / pnpm / yarn / bun tabs.</dd>
            <dt><kbd className="kbd">Enter</kbd> / <kbd className="kbd">Space</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>activates the focused tab or copies the focused block.</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-2)' }}>Screen reader</div>
          <p className="t-small" style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            The state alerts announce their outcome: the resolving and success cards are{' '}
            <Code>role="status"</Code> (polite, with <Code>aria-busy</Code> while resolving),
            and the failure card is <Code>role="alert"</Code> (assertive) so a blocked install
            interrupts. The package-manager tabs expose <Code>role="tablist"</Code> with the
            active tab marked <Code>aria-selected</Code>.
          </p>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-2)' }}>Focus &amp; contrast</div>
          <p className="t-small" style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            Every tab and copy button paints the ember focus ring (<Code>--ring</Code>) at
            ≥3:1 against the surface. Each alert tone pairs a soft tinted fill with a
            same-hue icon and dark <Code>--fg</Code> body text — the meaning never rides on
            colour alone, and each tone clears AA for body copy.
          </p>
        </div>
        <div className="surface" style={{ padding: 'var(--space-5)' }}>
          <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-2)' }}>Motion</div>
          <p className="t-small" style={{ margin: 0, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            The resolving spinner uses the system <Code>.sp-*</Code> animation. Under{' '}
            <Code>prefers-reduced-motion: reduce</Code> its spin slows to a calm pace while
            the <Code>role="status"</Code> label keeps carrying the busy state to assistive
            tech — the wait stays legible without the motion.
          </p>
        </div>
      </div>
    </Section>
  );
}
