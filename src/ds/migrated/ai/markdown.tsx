'use client';
// Eidos AI — Markdown surface (§2.2 component-page standard).
// Prose is the rendering target for all assistant markdown output — headings,
// paragraphs, lists, tables, code blocks, blockquotes, task lists, links, and
// inline formatting. The DS ships .ai-prose chrome; consumers bring their own
// renderer (react-markdown + remark-gfm + rehype-sanitize is the reference).
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, PropsTable, installTabs, Prose, ProseCode, Lede, Mono } from '@/ds/core';

// AI-page inline style convention (agents.tsx idiom)

// ── live render demo ───────────────────────────────────────────────────────
// react-markdown is imported at the top level — this is a 'use client' page
// so there is no SSR concern. DO NOT move react-markdown into core/ai.
const DEMO_MD = `# Deploying a service

A **Eidos deployment** pushes one or more _services_ through a graduated ring
rollout: canary → 25 % → 100 %. Use \`eidos deploy\` from the repo root.

## Prerequisites

Before you deploy, confirm:

- The service passes \`eidos lint\` and \`eidos test\`.
- ~~Manually push a Docker image~~ — the CLI handles image build and push.
- You have at least **one ring** configured in \`eidos.yaml\`.

### Ordered rollout steps

1. Build and tag the image (commit SHA).
2. Push to the registry.
3. Promote through \`canary → 25% → 100%\` on a healthy error budget.
4. Auto-rollback triggers when the budget burns faster than the threshold.

#### Task list

- [x] \`eidos.yaml\` ring definitions committed
- [x] CI passing on \`main\`
- [ ] On-call notified
- [ ] Rollback plan documented

> **Tip:** pin a ring with \`--hold\` to pause auto-promotion while you
> watch metrics.
>
> — Eidos Platform team

---

Here is the deploy command:

\`\`\`bash
eidos deploy \\
  --service identity-svc \\
  --ring canary \\
  --hold
\`\`\`

### Service health after deploy

| Service | Ring | p95 (ms) | Error budget |
|---|---|---|---|
| identity-svc | canary | 142 | 94 % |
| billing-svc | 25 % | 188 | 87 % |
| marketing-cms | 100 % | 76 | 99 % |

See the [pipeline docs](/idp/pipeline) for the full rollout model.
`;

// ReactMarkdown is pure React — import at module level in a 'use client' page.
// Heavy deps (Mermaid, KaTeX, Shiki) must use dynamic import in useEffect.
let ReactMarkdown: any = null;
let remarkGfm: any = null;
let rehypeSanitize: any = null;

function LiveMarkdownDemo() {
  const [ready, setReady] = React.useState(false);
  const [RM, setRM] = React.useState<any>(null);
  const [rGfm, setRGfm] = React.useState<any>(null);
  const [rSan, setRSan] = React.useState<any>(null);

  React.useEffect(() => {
    let active = true;
    Promise.all([
      import('react-markdown'),
      import('remark-gfm'),
      import('rehype-sanitize'),
    ]).then(([md, gfm, san]) => {
      if (!active) return;
      setRM(() => md.default);
      setRGfm(() => gfm.default);
      setRSan(() => san.default);
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  if (!ready || !RM) {
    return (
      <Prose style={{ maxWidth: 640 }}>
        <p style={{ color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)' }}>
          Loading renderer…
        </p>
      </Prose>
    );
  }

  return (
    <Prose style={{ maxWidth: 640 }}>
      <RM
        remarkPlugins={[rGfm]}
        rehypePlugins={[rSan]}
        components={{
          // Open links in a new tab
          a: (props: any) => <a {...props} target="_blank" rel="noreferrer noopener" />,
          // react-markdown v10 dropped the `inline` prop: a fenced block is a
          // `code` with a `language-*` className wrapped in `pre`. Unwrap the
          // `pre` and route only language-tagged code to ProseCode; bare `code`
          // (inline, or a fence with no language) stays an inline chip.
          pre: ({ children }: any) => <>{children}</>,
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return match
              ? <ProseCode lang={match[1]}>{String(children).replace(/\n$/, '')}</ProseCode>
              : <code className={className} {...props}>{children}</code>;
          },
        }}
      >
        {DEMO_MD}
      </RM>
    </Prose>
  );
}

// ── code snippets ──────────────────────────────────────────────────────────
const WIRE_CODE = `import ReactMarkdown from 'react-markdown';
import remarkGfm    from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Prose, ProseCode } from '@/ds/core';

function Response({ text }: { text: string }) {
  return (
    <Prose streaming={isStreaming} aria-label="Assistant reply">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a:   (p) => <a {...p} target="_blank" rel="noreferrer"/>,
          // v10: distinguish by the language-* className, not an inline prop.
          pre:  ({ children }) => <>{children}</>,
          code: ({ className, children, ...p }) => {
            const m = /language-(\\w+)/.exec(className ?? '');
            return m
              ? <ProseCode lang={m[1]}>{String(children).replace(/\\n$/, '')}</ProseCode>
              : <code className={className} {...p}>{children}</code>;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </Prose>
  );
}`;

const STREAMING_CODE = `// Streaming: mark the surface live, trail the caret.
// Prose injects aria-live="polite" + aria-busy when streaming={true}.
<Prose streaming>
  {/* react-markdown output — last block gets the blinking caret */}
  <ReactMarkdown>{partialText}</ReactMarkdown>
</Prose>`;

const PROSE_ONLY_CODE = `// Static (non-streaming) — just the semantic wrapper.
<Prose>
  <h2>Deploying a service</h2>
  <p>Run <code>eidos deploy</code> from the repo root.</p>
  <ul>
    <li>Builds the image and tags it with the commit SHA</li>
    <li>Promotes through canary → 25% → 100%</li>
  </ul>
</Prose>`;

export default function AiMarkdown() {
  return (
    <Section
      id="markdown"
      num="05"
      title="Markdown"
      desc="The rendering target for all assistant output — pipe the model's text through a markdown renderer into the Prose surface. Headings, lists, tables, code blocks, and links inherit the Eidos type scale automatically."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-prose')} ariaLabel="package manager"/>
      <Lede>The DS never bundles a renderer: you bring react-markdown (and plugins), the DS provides the chrome.</Lede>
      <Lede>
        Ships <Mono>Prose</Mono> (the <Mono>.ai-prose</Mono> editorial surface, with optional streaming caret) and <Mono>ProseCode</Mono> (the fenced code-block chrome inside prose: language header + copy button + scrollable body). The DS does not bundle a markdown renderer — consumers wire <Mono>react-markdown</Mono> + plugins and pass the output as children.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="Prose — static assistant reply" code={PROSE_ONLY_CODE} height={260}>
        <Prose style={{ maxWidth: 560 }}>
          <h2>Deploying a service</h2>
          <p>Run <code>eidos deploy</code> from the service root — it builds, pushes, and rolls out across the configured rings.</p>
          <ul>
            <li>Builds the image and tags it with the commit SHA</li>
            <li>Promotes through <strong>canary → 25% → 100%</strong> on a healthy error budget</li>
            <li>Auto-rolls back if the error budget burns</li>
          </ul>
        </Prose>
      </Frame>
      <Lede>
        Wrap any already-rendered HTML (react-markdown output, hand-authored JSX) in <Mono>{'<Prose>'}</Mono>. Every child element inherits the heading scale, 68ch prose cap, inline code chip, and ember links from <Mono>.ai-prose</Mono>.
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* FULL FEATURE SHOWCASE */}
      <SubHead meta="all markdown features">Full render demo</SubHead>
      <Lede>
        A live pipeline: the raw markdown string below passes through <Mono>ReactMarkdown</Mono> + <Mono>remark-gfm</Mono> + <Mono>rehype-sanitize</Mono> into <Mono>{'<Prose>'}</Mono>. Every element you see is rendered by the consumer's renderer into DS chrome — no custom parsing in core.
      </Lede>
      <Frame label="live react-markdown → Prose pipeline · headings · lists · task list · blockquote · HR · table · code block" height={700}>
        <LiveMarkdownDemo/>
      </Frame>
      <Lede>
        Headings map to the DS scale (h1=28px/–0.02em, h2=22px, h3=17px). Tables reuse the <Mono>.ai-prose table</Mono> chrome with a mono header. Fenced code blocks mapped to <Mono>ProseCode</Mono> get the language label + copy button. Task list checkboxes are pointer-events none but remain visually consistent with the DS surface.
      </Lede>

      {/* STREAMING */}
      <SubHead meta="streaming · aria-live">Streaming</SubHead>
      <Frame label="streaming=true — caret trails the last block, surface is aria-live=&quot;polite&quot;" code={STREAMING_CODE}>
        <Prose streaming style={{ maxWidth: 560 }}>
          <h3>The identity service is degraded</h3>
          <p>
            Based on the trace you shared, p95 latency on <code>identity-svc</code> is <strong>482 ms</strong> — above the 400 ms target — and the error budget is burning at 38%. Two open incidents match the pattern.
          </p>
        </Prose>
      </Frame>
      <Lede>
        Pass <Mono>streaming</Mono> to inject <Mono>aria-live="polite"</Mono> + <Mono>aria-busy={`{true}`}</Mono> on the wrapper and trail the ember blink caret on the last block. Remove the prop once the stream settles — the caret disappears and <Mono>aria-busy</Mono> clears.
      </Lede>

      {/* CODE BLOCKS */}
      <SubHead meta="code surface">ProseCode</SubHead>
      <Frame label="ProseCode — fenced code block: language header · copy · scrollable body" height={300}>
        <Prose style={{ maxWidth: 640 }}>
          <p>Run the deploy command from the service root:</p>
          <ProseCode lang="bash">{`eidos deploy \\
  --service identity-svc \\
  --ring canary \\
  --hold`}</ProseCode>
          <p>The CLI also accepts a <code>--dry-run</code> flag:</p>
          <ProseCode lang="bash">{`eidos deploy --service identity-svc --dry-run`}</ProseCode>
        </Prose>
      </Frame>
      <Lede>
        <Mono>ProseCode</Mono> is the prose-scoped code surface — it lives inside <Mono>{'<Prose>'}</Mono> and escapes the 68ch body cap with <Mono>.ai-wide</Mono> semantics. For a standalone, documented code block outside prose use the core <Mono>{'<CodeBlock>'}</Mono> primitive instead.
      </Lede>

      {/* WIRING IT UP */}
      <SubHead meta="react-markdown">Wiring it up</SubHead>
      <CodeBlock
        label="react-markdown + remark-gfm + rehype-sanitize → Prose"
        lang="tsx"
        code={WIRE_CODE}
      />
      <Lede>
        The critical invariants: (1) always use <Mono>rehype-sanitize</Mono> to strip raw HTML from model output so the model cannot inject markup; (2) remap the <Mono>a</Mono> renderer to open external links in a new tab; (3) remap fenced <Mono>code</Mono> blocks to <Mono>ProseCode</Mono> so they render with the DS chrome. The DS never bundles react-markdown — this keeps core tree-shakeable and lets consumers upgrade the renderer independently.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="assistant turn inside a message thread — Prose as the response body" height={420}>
        <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* User question */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px 14px', background: 'var(--ember-soft)', border: '1px solid color-mix(in srgb, var(--ember) 22%, transparent)', borderRadius: 12, borderEndEndRadius: 4, color: 'var(--fg)', fontSize: 'var(--text-md)', lineHeight: 1.55, maxWidth: '70%' }}>
              What's the canary rollout strategy for identity-svc?
            </div>
          </div>
          {/* Assistant reply */}
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--ember-soft)', border: '1px solid color-mix(in srgb, var(--ember) 22%, transparent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Icons.sparkle size={16} style={{ color: 'var(--ember)' }}/>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>EIDOS PLATFORM AGENT</span>
              <Prose>
                <p>The canary ring receives <strong>5%</strong> of traffic. If the p95 latency stays below 400 ms and the error budget burn is under 1×, the ring auto-promotes after 15 minutes.</p>
                <ul>
                  <li>Canary → 25% after 15 min at healthy budget</li>
                  <li>25% → 100% after another 30 min</li>
                  <li>Rollback triggers if p95 {'>'} 600 ms for 2 consecutive minutes</li>
                </ul>
                <ProseCode lang="yaml">{`rollout:
  rings: [canary, 25, 100]
  budgetThreshold: 1x
  holdOnAlert: true`}</ProseCode>
              </Prose>
            </div>
          </div>
        </div>
      </Frame>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Rendered prose is reading content — the only Tab stops are the links it contains, reached in document order and activated with Enter. Code blocks are not focus traps; when a <code style={{ fontFamily: 'var(--font-mono)' }}>ProseCode</code> copy button is present it is a real button reachable by Tab and triggered with Enter/Space. Headings h1–h3 are available to the screen-reader heading rotor.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Always render real semantic elements — <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;h2&gt;</code>/<code style={{ fontFamily: 'var(--font-mono)' }}>&lt;h3&gt;</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;ul&gt;</code>/<code style={{ fontFamily: 'var(--font-mono)' }}>&lt;ol&gt;</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;table&gt;</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;th&gt;</code> headers — so heading navigation and list/table announce correctly. When the surface is streaming, <code style={{ fontFamily: 'var(--font-mono)' }}>streaming</code> adds <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> so settled blocks are announced as they land.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Links use the ember accent <em>and</em> an underline so they are never signalled by colour alone; they show a visible focus ring on Tab. Body text on the surface, inline-code ember on the elevated chip, and mono captions all meet AA. Verify any syntax-highlight colours the renderer adds against the code block background.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            If blocks fade or slide in as markdown streams, <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> must render each finished block instantly with no entrance animation — the text simply appears. The ember caret in <code style={{ fontFamily: 'var(--font-mono)' }}>Prose streaming</code> uses a steps() blink; under reduced motion it stays solid, removing the flicker.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — blockquote border flips to the trailing edge, lists indent from the start" code={`<div dir="rtl"><Prose>…</Prose></div>`}>
        <div dir="rtl" style={{ width: '100%' }}>
          <Prose style={{ maxWidth: 560 }}>
            <h2>نشر الخدمة</h2>
            <p>
              يرسل <code>eidos deploy</code> الخدمة عبر مراحل الطرح التدريجي: قناة التجربة → 25% → 100%. تحقق من سلامة الميزانية في كل مرحلة قبل الترقية.
            </p>
            <ul>
              <li>يبني الصورة ويضع علامة الإيداع عليها</li>
              <li>يروّج عبر <strong>القناة → 25% → 100%</strong> وفق الميزانية</li>
              <li>يتراجع تلقائيًا عند استنفاد ميزانية الخطأ</li>
            </ul>
            <blockquote>نصيحة: استخدم <code>--hold</code> لإيقاف الترقية التلقائية.</blockquote>
          </Prose>
        </div>
      </Frame>
      <Lede>
        All spacing in <Mono>.ai-prose</Mono> uses logical CSS properties, so text direction and indentation flip automatically. The blockquote ember border switches to the inline-end edge; list markers appear on the trailing side. No per-page override needed.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 560 }} aria-hidden="true">
              <Prose style={{ maxWidth: 560 }}>
                <h2>Deploying a service</h2>
                <p>
                  Run <code>eidos deploy</code> from the repo root. The deploy command builds the image, pushes it, and <a href="#" onClick={e => e.preventDefault()}>rolls out across rings</a>.
                </p>
                <ProseCode lang="bash">{`eidos deploy --service identity-svc --ring canary`}</ProseCode>
                <blockquote>Tip: pin a ring with <code>--hold</code>.</blockquote>
              </Prose>
              {/* pins */}
              <span className="lead v" style={{ top: -22, left: 60, height: 18 }}/>
              <span className="lead v" style={{ top: -22, left: 200, height: 18 }}/>
              <span className="lead h" style={{ top: 68, right: -34, width: 30 }}/>
              <span className="lead v" style={{ bottom: -22, left: 30, height: 18 }}/>
              <span className="lead h" style={{ top: 130, left: -34, width: 30 }}/>
              <div className="pin" style={{ top: -42, left: 60, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: 200, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 60, right: -58 }}>3</div>
              <div className="pin" style={{ bottom: -42, left: 30, transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ top: 122, left: -58 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 620, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Heading scale.</b> h1=28px/–0.02em · h2=22px · h3=17px/600 — always <Mono>var(--fg)</Mono> (never muted). First heading gets no top margin.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Prose body.</b> 15px/1.65 Geist Sans. Body lines are capped at 68ch — wide blocks (tables, code, diagrams) escape the cap and may fill the container.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Inline code chip.</b> Geist Mono, 0.86em, on an elevated 1px bordered tile. Color is ember for immediate scannability.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Blockquote.</b> 2px ember inline-start border, italic, muted text. In RTL the border flips to the inline-end edge automatically via logical CSS.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Block code (ProseCode).</b> Escaped from the 68ch cap. Mono header: language label + copy button. Scrollable body; never wraps or overflows the page.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — render the AST and sanitize</div>
          <div className="body" style={{ padding: 14 }}>
            <Prose style={{ maxWidth: 400 }}>
              <p>Use <code>rehype-sanitize</code> to strip raw HTML.</p>
              <ul>
                <li>Safe: headings, lists, bold, links</li>
                <li>Stripped: <code>{'<script>'}</code>, <code>{'<iframe>'}</code>, event attrs</li>
              </ul>
            </Prose>
          </div>
          <div className="note">Parse through a renderer that converts markdown to a sanitized AST before outputting HTML. Raw HTML injection from model output is the primary XSS vector.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — dump raw markdown as text</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
              {'## Deploying a service\n\nRun `eidos deploy` from…\n\n- Builds the image\n- Pushes to the registry'}
            </div>
          </div>
          <div className="note">Displaying raw markdown text forces users to read the syntax noise. Always render through the pipeline into Prose.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — mark the surface aria-live while streaming</div>
          <div className="body" style={{ padding: 14 }}>
            <Prose streaming style={{ maxWidth: 400 }}>
              <p>The identity service is <strong>degraded</strong> — p95 latency is 482 ms.</p>
            </Prose>
          </div>
          <div className="note">Pass <Mono>streaming</Mono> so screen readers hear each settled block as it arrives. Remove it when the stream ends to clear <Mono>aria-busy</Mono>.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — allow raw HTML from model output</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ background: 'var(--danger-soft)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--danger)', lineHeight: 1.5 }}>
              dangerouslySetInnerHTML={'{'}rawMarkdown{'}'}
            </div>
          </div>
          <div className="note">Never use <Mono>dangerouslySetInnerHTML</Mono> with model output. Always pass through rehype-sanitize or an equivalent HTML sanitizer.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="ProseProps">API reference</SubHead>
      <PropsTable
        label="<Prose />"
        rows={[
          { prop: 'streaming', type: 'boolean', default: 'false', description: 'Injects aria-live="polite" + aria-busy={true} and trails the ember blink caret on the last rendered block. Remove once the stream settles.' },
          { prop: 'as', type: 'string', default: '"div"', description: 'The wrapper element tag. Use "article" for long-form standalone responses.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Appended to .ai-prose. Use to add context-specific max-width or margin overrides.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Rendered markdown output — react-markdown nodes, hand-authored JSX, or any mix of prose elements.' },
        ]}
      />
      <PropsTable
        label="<ProseCode />"
        rows={[
          { prop: 'lang', type: 'string', default: '"bash"', description: 'Language label shown in the code block header. Displayed as-is (no syntax highlighting in core — bring Shiki if you need it).' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'The raw code string. Trimmed of trailing newlines before render.' },
        ]}
      />
    </Section>
  );
}
