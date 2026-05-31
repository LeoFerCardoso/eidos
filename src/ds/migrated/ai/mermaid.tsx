'use client';
// Forge AI — Mermaid diagrams in replies (§2.2 component-page standard).
// The DS ships the `Diagram` surface slot; this page renders Mermaid live via
// dynamic import inside useEffect (never at module load) and drops the SVG
// into `<Diagram caption=…>`. Mermaid touches the DOM — it must never run
// at build time or during SSR.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, CodeBlock, PropsTable, installTabs, Lede, Diagram, Skeleton, Spinner, Alert, AlertTitle, AlertDescription, Empty, Kbd, Mono } from '@/ds/core';

// AI-page inline style convention (agents.tsx / markdown.tsx idiom)

// ── Mermaid diagrams ─────────────────────────────────────────────────────────
const FLOWCHART = `flowchart TD
  A[User prompt] --> B{Plan}
  B --> C[Call getServiceHealth]
  B --> D[Call openIncident]
  C --> E[Observe results]
  D --> E
  E --> F[Draft answer]`;

const SEQUENCE = `sequenceDiagram
  participant U as User
  participant A as Agent
  participant T as Tool
  U->>A: What is the canary rollout?
  A->>T: getServiceHealth(identity-svc)
  T-->>A: p95=142ms, budget=94%
  A->>U: Canary is healthy — 5% traffic at 142ms p95`;

const STATE = `stateDiagram-v2
  [*] --> Idle
  Idle --> Typing: user input
  Typing --> Submitting: enter / send
  Submitting --> Streaming: model token
  Streaming --> Done: stream end
  Done --> Idle: new turn
  Submitting --> Error: network fail
  Error --> Idle: retry`;

// Counter keeps Mermaid IDs unique across re-renders / multiple instances.
let mmdCounter = 0;

type MmdStatus = 'loading' | 'ready' | 'error';

function MermaidDiagram({ chart, caption, ariaLabel }: { chart: string; caption: string; ariaLabel: string }) {
  const [svg, setSvg] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<MmdStatus>('loading');
  const id = React.useRef('mmd-' + (++mmdCounter));

  React.useEffect(() => {
    let active = true;
    setStatus('loading');
    import('mermaid').then(async (m) => {
      m.default.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' });
      try {
        const result = await m.default.render(id.current, chart);
        if (active) { setSvg(result.svg); setStatus('ready'); }
      } catch {
        // Surface a parse/render failure as a real error — never a permanent skeleton.
        if (active) { setSvg(null); setStatus('error'); }
      }
    });
    return () => { active = false; };
  }, [chart]);

  // LOADING — Skeleton holds the slot so the layout doesn't jump on mount.
  if (status === 'loading') return <Skeleton lines={5} label="Rendering diagram" style={{ maxWidth: 520 }}/>;

  // ERROR — invalid Mermaid source. A danger Alert with role="alert" announces it.
  if (status === 'error') {
    return (
      <Alert tone="danger" assertive>
        <AlertTitle>Couldn&rsquo;t render the diagram</AlertTitle>
        <AlertDescription>Mermaid rejected the source — usually a syntax error. The raw text is preserved so nothing is lost.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Diagram caption={caption}>
      <span
        role="img"
        aria-label={ariaLabel}
        dangerouslySetInnerHTML={{ __html: svg! }}
      />
    </Diagram>
  );
}

// ── live switcher (the page's one earned micro-interaction) ─────────────────
// Swapping the kind changes the `chart` prop, which re-runs MermaidDiagram's
// [chart] effect — a true re-render (Skeleton flash → fresh SVG), not a tab swap.
const KINDS = [
  { id: 'flowchart', label: 'Flowchart', chart: FLOWCHART, caption: 'Agent run loop · flowchart TD', ariaLabel: 'Flowchart: user prompt flows into plan, which branches to two tool calls, merges into observe, then draft answer' },
  { id: 'sequence',  label: 'Sequence',  chart: SEQUENCE,  caption: 'Agent–tool exchange · sequenceDiagram', ariaLabel: 'Sequence diagram: user prompts agent, agent calls getServiceHealth tool, tool returns metrics, agent replies' },
  { id: 'state',     label: 'State',     chart: STATE,     caption: 'Prompt-input lifecycle · stateDiagram-v2', ariaLabel: 'State diagram: idle to typing to submitting to streaming to done, with an error branch back to idle on retry' },
] as const;

function DiagramSwitcher() {
  const [kind, setKind] = React.useState<(typeof KINDS)[number]['id']>('flowchart');
  const active = KINDS.find((k) => k.id === kind)!;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div role="group" aria-label="Diagram kind" style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            className={'btn sm' + (k.id === kind ? ' ember' : ' ghost')}
            aria-pressed={k.id === kind}
            onClick={() => setKind(k.id)}
          >
            {k.label}
          </button>
        ))}
      </div>
      <MermaidDiagram chart={active.chart} caption={active.caption} ariaLabel={active.ariaLabel}/>
    </div>
  );
}

// ── code snippets ─────────────────────────────────────────────────────────────
const WIRE_CODE = `import { Diagram, Skeleton, Alert, AlertTitle, AlertDescription } from '@/ds/core';

let counter = 0;

function MermaidDiagram({ chart, caption, ariaLabel }) {
  const [svg, setSvg] = React.useState(null);
  const [status, setStatus] = React.useState('loading'); // loading | ready | error
  const id = React.useRef('mmd-' + (++counter));

  React.useEffect(() => {
    let active = true;
    setStatus('loading');
    import('mermaid').then(async (m) => {
      m.default.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' });
      try {
        const { svg } = await m.default.render(id.current, chart);
        if (active) { setSvg(svg); setStatus('ready'); }
      } catch {
        if (active) setStatus('error'); // never leave a permanent Skeleton
      }
    });
    return () => { active = false; };
  }, [chart]);

  if (status === 'loading') return <Skeleton lines={5} label="Rendering diagram"/>;

  if (status === 'error') return (
    <Alert tone="danger" assertive>
      <AlertTitle>Couldn't render the diagram</AlertTitle>
      <AlertDescription>Mermaid rejected the source — usually a syntax error.</AlertDescription>
    </Alert>
  );

  return (
    <Diagram caption={caption}>
      <span role="img" aria-label={ariaLabel} dangerouslySetInnerHTML={{ __html: svg }}/>
    </Diagram>
  );
}`;

const INSTALL_CODE = `// The DS never bundles Mermaid.
// Install separately in your app:
// pnpm add mermaid
// Then import() it inside useEffect — never at module level.`;

export default function AiMermaid() {
  return (
    <Section
      id="mermaid"
      num="07"
      title="Mermaid"
      desc="Render Mermaid diagrams inside AI replies using the Diagram surface. The DS ships only the styled slot; Mermaid is dynamic-imported inside useEffect so it never runs at build time."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-diagram')} ariaLabel="package manager"/>
      <Lede>Any diagram type works — flowchart, sequence, state, ER, Gantt — as long as your Mermaid version supports it.</Lede>
      <Lede>
        Ships <Mono>Diagram</Mono> (the <Mono>.ai-diagram</Mono> surface with a mono <Mono>figcaption</Mono>) and <Mono>Skeleton</Mono> (the loading placeholder). The DS does not bundle Mermaid — install <Mono>mermaid</Mono> in your app and dynamic-import it inside <Mono>useEffect</Mono> (see "Wiring it up" below).
      </Lede>

      {/* 2. USAGE — live diagram-kind switcher (the one real micro-interaction) */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="MermaidDiagram component — pick a kind to re-render live (Skeleton → Diagram)" height={420}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <DiagramSwitcher/>
        </div>
      </Frame>
      <Lede>
        Pick a kind above — the wrapper re-runs its <Mono>useEffect([chart])</Mono>, flashes the <Mono>Skeleton</Mono> so the layout does not jump, then lands the fresh SVG in <Mono>{'<Diagram caption={…}>'}</Mono> with its bordered surface and mono figcaption. This is the component&rsquo;s only stateful behaviour: <Mono>chart</Mono> changes, the diagram re-renders.
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 'var(--space-8)', marginBlockEnd: 'var(--space-1)' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* DIAGRAM KINDS */}
      <SubHead meta="sequence diagram">Sequence</SubHead>
      <Frame label="sequenceDiagram — participant interactions with arrows and replies" height={360}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <MermaidDiagram
            chart={SEQUENCE}
            caption="Agent–tool sequence: user asks, agent queries tool, tool replies, agent answers"
            ariaLabel="Sequence diagram: user sends prompt to agent, agent calls getServiceHealth tool, tool returns metrics, agent replies to user"
          />
        </div>
      </Frame>
      <Lede>
        Sequence diagrams are the right choice when a reply describes multi-step interactions between services or participants. Each participant becomes a labelled column; arrows carry the message.
      </Lede>

      <SubHead meta="state diagram">State machine</SubHead>
      <Frame label="stateDiagram-v2 — prompt-input lifecycle states" height={400}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <MermaidDiagram
            chart={STATE}
            caption="Prompt-input state machine — idle → typing → submitting → streaming → done"
            ariaLabel="State diagram: idle transitions to typing on user input, typing to submitting on send, submitting to streaming on first token, streaming to done on stream end, done back to idle on new turn, submitting to error on failure, error back to idle on retry"
          />
        </div>
      </Frame>
      <Lede>
        Use state diagrams when a reply describes a system's lifecycle. The <Mono>stateDiagram-v2</Mono> syntax handles named states, transitions, and branch labels in a compact form.
      </Lede>

      {/* STATES */}
      <SubHead meta="loading · error · empty">States</SubHead>
      <Frame label="the three states the wrapper renders — loading, error, empty" height={420}>
        <div style={{ width: '100%', maxWidth: 600, display: 'grid', gap: 'var(--space-6)' }}>
          {/* LOADING — Skeleton holds the slot until Mermaid resolves */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBlockEnd: 'var(--space-2)' }}>
              <span className="t-mono-label">Loading</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>
                <Spinner size="sm" aria-label="Rendering diagram"/> awaiting render
              </span>
            </div>
            <Skeleton lines={4} label="Rendering diagram" style={{ maxWidth: 480 }}/>
          </div>
          {/* ERROR — invalid source surfaces a danger Alert (role="alert") */}
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-2)' }}>Error · invalid source</div>
            <Alert tone="danger" assertive>
              <AlertTitle>Couldn&rsquo;t render the diagram</AlertTitle>
              <AlertDescription>Mermaid rejected the source — usually a syntax error. The raw text is preserved so nothing is lost.</AlertDescription>
            </Alert>
          </div>
          {/* EMPTY — no diagram in this reply yet */}
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 'var(--space-2)' }}>Empty · no diagram requested</div>
            <Empty
              size="sm"
              iconName="workflow"
              title="No diagram in this reply"
              desc="Mermaid renders only when the model returns a fenced ```mermaid block."
            />
          </div>
        </div>
      </Frame>
      <Lede>
        The wrapper is a three-state machine — <Mono>loading</Mono> shows the <Mono>Skeleton</Mono>, a render failure surfaces a danger <Mono>Alert</Mono> (carrying <Mono>role="alert"</Mono>) instead of a stuck placeholder, and a reply with no diagram falls back to <Mono>Empty</Mono>. A swallowed catch that leaves the Skeleton forever is the bug this replaces.
      </Lede>

      {/* WIRING IT UP */}
      <SubHead meta="consumer pattern">Wiring it up</SubHead>
      <CodeBlock
        label="MermaidDiagram wrapper — the full consumer pattern"
        lang="tsx"
        code={WIRE_CODE}
      />
      <Lede>
        Three invariants: (1) always dynamic-import inside <Mono>useEffect</Mono> — Mermaid reads <Mono>document</Mono> and must not run at build time; (2) each rendered diagram needs a unique <Mono>id</Mono> — use a stable ref, not <Mono>Math.random()</Mono>, to survive re-renders without double-rendering; (3) wrap the result in <Mono>{'<Diagram caption={…}>'}</Mono> — never paste a raw SVG into prose without the surface.
      </Lede>

      <SubHead meta="dependency note">Dependency</SubHead>
      <CodeBlock
        label="Mermaid is not bundled by Forge — add it to your app"
        lang="bash"
        code={`pnpm add mermaid
# or
npm install mermaid`}
      />
      <Lede>
        The DS core never imports Mermaid so it stays out of every page's initial bundle. Diagrams lazy-load on demand. Keep Mermaid pinned to a specific minor to avoid the breaking syntax changes that occasionally land between major versions.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="diagram inside an assistant reply — Diagram sits after the prose explanation" height={520}>
        <div style={{ width: '100%', maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* User */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px 14px', background: 'var(--ember-soft)', border: '1px solid var(--ember-border)', borderRadius: 12, borderEndEndRadius: 4, color: 'var(--fg)', fontSize: 'var(--text-md)', lineHeight: 1.55, maxWidth: '70%' }}>
              Can you show me the agent run loop as a diagram?
            </div>
          </div>
          {/* Agent */}
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--ember-soft)', border: '1px solid var(--ember-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Icons.sparkle size={16} style={{ color: 'var(--ember)' }}/>
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-subtle)', display: 'block', marginBottom: 8 }}>FORGE PLATFORM AGENT</span>
              <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--fg)', marginBottom: 12 }}>
                The agent run loop has four steps — plan, call tools, observe results, and draft the answer. Here is the flowchart:
              </p>
              <MermaidDiagram
                chart={FLOWCHART}
                caption="Agent run loop — plan → tool calls → observe → answer"
                ariaLabel="Flowchart showing the agent run loop with four steps"
              />
            </div>
          </div>
        </div>
      </Frame>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The SVG host element carries <code style={{ fontFamily: 'var(--font-mono)' }}>role="img"</code> and an <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> that describes what the diagram shows — not just "diagram" but the actual content ("Flowchart: user prompt flows into plan…"). The <code style={{ fontFamily: 'var(--font-mono)' }}>figcaption</code> in <code style={{ fontFamily: 'var(--font-mono)' }}>Diagram</code> is visible and read by AT as the figure's accessible name. A text fallback (a paragraph summarizing the diagram content) is strongly recommended for complex graphs.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard map</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 'var(--space-3)' }}>
            A static diagram has no Tab stops inside the SVG. These keys apply only when nodes are interactive (Mermaid <code style={{ fontFamily: 'var(--font-mono)' }}>click</code> events) — each node renders as a real focusable <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;a&gt;</code>/<code style={{ fontFamily: 'var(--font-mono)' }}>button</code>:
          </div>
          <Kbd label="Move to next / previous node" keys="Tab"/>
          <Kbd label="Activate the focused node link" keys="Enter"/>
          <Kbd label="Activate a node button" keys="Space"/>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockStart: 'var(--space-3)' }}>
            Each interactive node shows the standard focus-visible ring. The <code style={{ fontFamily: 'var(--font-mono)' }}>Skeleton</code> placeholder is <code style={{ fontFamily: 'var(--font-mono)' }}>aria-hidden</code> (and announces "Rendering diagram" via its <code style={{ fontFamily: 'var(--font-mono)' }}>label</code> on a <code style={{ fontFamily: 'var(--font-mono)' }}>role="status"</code> wrapper) so it is never a Tab trap.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Colour &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Initialize Mermaid with <code style={{ fontFamily: 'var(--font-mono)' }}>theme: 'dark'</code> to match the DS surface. The dark theme ships lines and labels that clear AA against the diagram background. Do not use colour as the only encoding for meaning — add text labels to nodes and edges so the diagram is legible without colour vision.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The Mermaid SVG renders statically — there is no animation in the output. The <code style={{ fontFamily: 'var(--font-mono)' }}>Skeleton</code> shimmer respects <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> (it stops under the media query) and snaps to the diagram instantly on mount.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — Diagram caption and surface mirror; SVG content is LTR" height={380}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 560 }}>
          <MermaidDiagram
            chart={FLOWCHART}
            caption="حلقة تشغيل الوكيل — خطة → استدعاء الأدوات → رصد → إجابة"
            ariaLabel="مخطط انسيابي: موجه المستخدم يتدفق إلى الخطة، ثم استدعاءات الأداة، ثم الرصد، ثم صياغة الإجابة"
          />
        </div>
      </Frame>
      <Lede>
        The <Mono>Diagram</Mono> surface uses logical CSS, so the caption text and border flip to the start edge in RTL. The SVG content itself is rendered by Mermaid in LTR — this is correct, since flowchart direction (TD/LR) is a graph property, not a text direction. Provide an Arabic <Mono>aria-label</Mono> and <Mono>caption</Mono> so screen readers and visible captions are in the reader's language.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 400 }} aria-hidden="true">
              <Diagram caption="Agent run loop · flowchart TD">
                <div style={{ height: 120, background: 'var(--surface)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                  {'<svg> — rendered by Mermaid'}
                </div>
              </Diagram>
              {/* pins */}
              <span className="lead v" style={{ top: -22, left: 40, height: 18 }}/>
              <span className="lead h" style={{ top: 60, right: -32, width: 28 }}/>
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ top: -42, left: 40, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: 52, right: -56 }}>2</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Surface.</b> The <Mono>.ai-diagram</Mono> figure — a bordered, rounded container that escapes the 68ch prose cap so wide graphs render without clipping.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>SVG slot.</b> The Mermaid-rendered SVG injected via <Mono>dangerouslySetInnerHTML</Mono>. Wrap the span with <Mono>role="img"</Mono> + <Mono>aria-label</Mono> so the SVG content is accessible as an image.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Caption.</b> Geist Mono figcaption under the diagram. Always provide one — it names the diagram type and the claim it supports. In RTL it aligns to the start edge automatically.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — caption every diagram</div>
          <div className="body" style={{ padding: 14 }}>
            <Diagram caption="Agent run loop · flowchart TD">
              <div style={{ height: 72, background: 'var(--surface)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                {'[ flowchart SVG ]'}
              </div>
            </Diagram>
          </div>
          <div className="note">A caption names the diagram type and what it shows. Screen readers use it as the accessible name; sighted readers use it to orient before reading the graph.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — paste raw SVG without the Diagram surface</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ height: 72, background: 'var(--surface)', borderRadius: 4, border: '2px dashed var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
              {'<span dangerouslySetInnerHTML…/>'}
            </div>
          </div>
          <div className="note">A raw SVG has no caption, no accessible name, and no border. It also inherits prose line-height which breaks Mermaid's layout. Always wrap in Diagram.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — dynamic-import Mermaid in useEffect</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              React.useEffect(() ={'>'} {'{'}<br/>
              {'  '}import('mermaid').then(…)<br/>
              {'}'}, [chart]);
            </div>
          </div>
          <div className="note">Mermaid accesses document. A top-level import will crash Next.js server rendering. Always lazy-import inside useEffect.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — import Mermaid at the module top level</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--danger)', lineHeight: 1.6 }}>
              import mermaid from 'mermaid';<br/>
              <span style={{ color: 'var(--fg-faint)' }}>// ReferenceError: document is not defined</span>
            </div>
          </div>
          <div className="note">Top-level Mermaid import causes build-time DOM access. The server has no document — this crashes the build or silently renders nothing.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="DiagramProps">API reference</SubHead>
      <PropsTable
        label="<Diagram />"
        rows={[
          { prop: 'caption', type: 'ReactNode', default: undefined, description: 'Figcaption text under the diagram surface. Strongly recommended — used as the accessible name context and visible label. Rendered in Geist Mono.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'The rendered diagram markup. Typically a <span role="img" aria-label={…} dangerouslySetInnerHTML={{__html: svg}}/>.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Appended to .ai-diagram. Use for max-width overrides on unusually wide or narrow diagrams.' },
          { prop: 'style', type: 'CSSProperties', default: undefined, description: 'Inline styles on the figure element.' },
        ]}
      />
      <PropsTable
        label="<Skeleton />"
        rows={[
          { prop: 'lines', type: 'number', default: '3', description: 'Number of placeholder lines. The last line renders at 62% width to simulate trailing text.' },
          { prop: 'width', type: 'string | number', default: undefined, description: 'Max width of the skeleton block.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Appended to .ai-skel.' },
          { prop: 'style', type: 'CSSProperties', default: undefined, description: 'Inline styles on the wrapper div.' },
        ]}
      />
      <Lede>
        The DS provides the surface slots — <Mono>Diagram</Mono> and <Mono>Skeleton</Mono>. Consumers own the Mermaid integration: <Mono>pnpm add mermaid</Mono>, then copy the <Mono>MermaidDiagram</Mono> wrapper from "Wiring it up" above into their app. The DS never bundles Mermaid.
      </Lede>
    </Section>
  );
}
