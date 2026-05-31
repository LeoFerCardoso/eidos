'use client';
// Eidos AI — Chain of Thought. A collapsible, multi-step reasoning trace
// where each step has a kind (think/search/observe/plan/read/done) and its
// own icon. Richer than Reasoning's single prose blob.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, Lede, ChainOfThought, Mono } from '@/ds/core';


// ── Usage demo — 5-step trace ────────────────────────────────────────────────
const USAGE_STEPS = [
  { kind: 'think',   label: 'What caused the p99 spike on identity-svc?', detail: 'Looking at deploys in the last 24 h overlapping with the spike window.' },
  { kind: 'search',  label: 'Search deploy log', detail: 'forge.deploys · since=24h · tier=T1' },
  { kind: 'observe', label: '4 Tier-1 deploys found — identity-svc @ 0421 is the newest', detail: 'pool-size: 8 → 32 and retry-budget: 3 → 8 in the same commit.' },
  { kind: 'plan',    label: 'Check only the pool-size change — it sits on the spike\'s code path' },
  { kind: 'done',    label: 'Recommend reverting pool-size; keep the retry-budget bump for now' },
];

const USAGE_CODE = `import { ChainOfThought } from "@/ds/core"

<ChainOfThought
  title="Chain of thought"
  defaultOpen={true}
  steps={[
    { kind: "think",   label: "What caused the p99 spike?", detail: "Checking deploys…" },
    { kind: "search",  label: "Search deploy log",          detail: "forge.deploys · since=24h" },
    { kind: "observe", label: "4 Tier-1 deploys found",    detail: "identity-svc @ 0421 is newest" },
    { kind: "plan",    label: "Check only pool-size change" },
    { kind: "done",    label: "Recommend reverting pool-size" },
  ]}
/>`;

// ── Step kinds side-by-side ──────────────────────────────────────────────────
const KIND_STEPS = [
  { kind: 'think',   label: 'Think — initial question or hypothesis' },
  { kind: 'search',  label: 'Search — query a tool or knowledge source' },
  { kind: 'observe', label: 'Observe — interpret a result' },
  { kind: 'plan',    label: 'Plan — decide the next action' },
  { kind: 'read',    label: 'Read — parse a document or schema' },
  { kind: 'done',    label: 'Done — conclusion or final answer' },
];

// ── Streaming demo ────────────────────────────────────────────────────────────
const ALL_STEPS = [
  { kind: 'think',   label: 'What\'s driving the p99 spike?',           detail: 'Spike began 14:07 UTC — correlate with deploy window.' },
  { kind: 'search',  label: 'Search deploy log · since=24h · tier=T1',  detail: 'forge.deploys' },
  { kind: 'observe', label: '4 T1 deploys — identity-svc is newest',    detail: 'Committed 14:02 · +15 files changed' },
  { kind: 'plan',    label: 'Diff identity-svc @ 0421',                  detail: 'pool-size 8→32 and retry-budget 3→8 in same commit' },
  { kind: 'done',    label: 'Revert pool-size; keep retry-budget',       detail: 'pool-size is the only change on the spike\'s code path' },
];

function StreamingDemo() {
  const [visibleCount, setVisibleCount] = React.useState(1);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (done) {
      const id = setTimeout(() => { setVisibleCount(1); setDone(false); }, 2400);
      return () => clearTimeout(id);
    }
    if (visibleCount >= ALL_STEPS.length) {
      const id = setTimeout(() => setDone(true), 1200);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setVisibleCount(v => v + 1), 500);
    return () => clearTimeout(id);
  }, [visibleCount, done]);

  // Two-signal status: the newest streamed step is `active` (ember mark);
  // everything above it has settled to `done` (muted mark). Once the trace
  // settles, every step is `done`. This is the page's only ember accent in
  // the demos — the live cursor travelling the reasoning trace.
  const streaming = !done && visibleCount < ALL_STEPS.length;
  const steps = ALL_STEPS.slice(0, visibleCount).map((s, i, arr) => ({
    ...s,
    status: streaming && i === arr.length - 1 ? 'active' : 'done',
  }));

  return (
    <div aria-live="polite" aria-label="Chain of thought streaming">
      <ChainOfThought
        title="Chain of thought"
        defaultOpen={true}
        steps={steps}
      />
    </div>
  );
}

// ── In context (CoT + Response) ───────────────────────────────────────────────
const IN_CTX_STEPS = [
  { kind: 'think',   label: 'User is asking about the p99 spike — check Tier-1 deploys first' },
  { kind: 'search',  label: 'listDeploys · since=24h · tier=T1' },
  { kind: 'observe', label: 'identity-svc @ 0421 is the only deploy in the spike window' },
  { kind: 'plan',    label: 'Recommend reverting the pool-size change' },
  { kind: 'done',    label: 'Answer ready' },
];

// ─── page ─────────────────────────────────────────────────────────────────
export default function ChainOfThoughtPage() {
  return (
    <Section
      id="ai-chain-of-thought"
      num="16"
      title="Chain of Thought"
      desc="A stepped trace of how the agent moved from question to answer — think → search → observe → plan → done. Each step has its own kind and icon. Show it when the answer hinges on the work."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-chain-of-thought')} ariaLabel="package manager"/>
      <Lede>Use ChainOfThought when you need a structured step-by-step trace. For a prose thinking blob, use Reasoning instead.</Lede>
      <Lede>
        Ships <Mono>ChainOfThought</Mono> from the <Mono>@/ds/core</Mono> agentic layer.
        The collapsible header is a real <Mono>&lt;button&gt;</Mono> with{' '}
        <Mono>aria-expanded</Mono>; steps render as a semantic{' '}
        <Mono>&lt;ol&gt;</Mono> and each step's kind label is textual — the icon is decorative.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="5-step trace — think · search · observe · plan · done" code={USAGE_CODE} height={360}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <ChainOfThought
            title="Chain of thought"
            defaultOpen={true}
            steps={USAGE_STEPS}
          />
        </div>
      </Frame>
      <Lede>
        The header shows a step count ("5 steps") and a chevron that toggles the body.
        Steps are ordered — screen readers announce position in the list ("item 1 of 5").
        The label text is always the primary signal; the kind icon reinforces the step type
        but is never the only signal.
      </Lede>

      {/* EXAMPLES divider */}
      <div style={{ marginBlockStart: 36, marginBlockEnd: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="t-mono-label">Examples</span>
        <span style={{ flex: 1, blockSize: 1, background: 'var(--border)' }}/>
      </div>

      {/* Step kinds */}
      <SubHead meta="6 kinds">Step kinds</SubHead>
      <Frame label="think · search · observe · plan · read · done — each kind with its own icon" height={380}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <ChainOfThought
            title="Step kinds"
            defaultOpen={true}
            steps={KIND_STEPS}
          />
        </div>
      </Frame>
      <Lede>
        The <Mono>kind</Mono> maps to a fixed icon set from the core icon library:
        <Mono>think</Mono> → sparkle, <Mono>search</Mono> → search,{' '}
        <Mono>observe</Mono> → eye, <Mono>plan</Mono> → clipboard,{' '}
        <Mono>read</Mono> → book, <Mono>done</Mono> → check.
        Unknown kinds fall back to sparkle — no rendering error.
      </Lede>

      {/* Streaming */}
      <SubHead meta="interactive · streaming">Streaming</SubHead>
      <Frame label="steps append every ~500 ms — the ember active mark leads, settled steps go muted; resets after a pause" height={320}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <StreamingDemo/>
        </div>
      </Frame>
      <Lede>
        Drive <Mono>steps</Mono> from your streaming state — append a step object
        as each new token arrives, and set the newest step's <Mono>status</Mono> to{' '}
        <Mono>"active"</Mono> (ember mark) while it lands, demoting it to <Mono>"done"</Mono>{' '}
        (muted mark) as the next step appends. The active cursor travels the trace.
        The component is stateless: you control what's visible. Wrap it in{' '}
        <Mono>aria-live="polite"</Mono> so new steps are announced; the count in the
        header updates automatically.
      </Lede>

      {/* In context */}
      <SubHead meta="composition · show your work then answer">In context</SubHead>
      <Frame label="ChainOfThought above, then the Response — the canonical 'show your work then answer' pattern" height={420}>
        <div style={{ width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="t-mono-label">
            Eidos AI <span style={{ marginInline: 6, color: 'var(--fg-faint)' }}>·</span> just now
          </div>
          <ChainOfThought
            title="Chain of thought"
            defaultOpen={false}
            steps={IN_CTX_STEPS}
          />
          <div style={{
            padding: '10px 14px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10, borderEndStartRadius: 4,
            fontSize: 'var(--text-base)', color: 'var(--fg)', maxWidth: '94%',
            lineHeight: 1.6,
          }}>
            The <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ember)' }}>identity-svc</code> deploy
            at 14:02 is the only one in the spike window. The pool-size change (8 → 32) is the sole diff
            on the p99 code path — recommend reverting it. The retry-budget bump is safe to keep.
          </div>
        </div>
      </Frame>
      <Lede>
        After the trace settles, collapse it (<Mono>defaultOpen={`{false}`}</Mono>) so the
        answer sits in front of the user unobstructed. The ChainOfThought stays one click away for
        anyone who wants to audit the work. This mirrors the{' '}
        <a href="/ai/reasoning" style={{ color: 'var(--ember)' }}>Reasoning</a> pattern but with
        structured steps instead of a single prose blob.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The header is a single <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;button&gt;</code>:
            Tab reaches it, Enter/Space toggles the step list. Once open, the{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;ol&gt;</code> is passive reading content —
            Tab continues to any links in step detail text, never trapping focus inside the disclosure.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The header exposes <code style={{ fontFamily: 'var(--font-mono)' }}>aria-expanded</code> and
            the collapsed body is <code style={{ fontFamily: 'var(--font-mono)' }}>aria-hidden</code>. The
            step count in the header is plain text ("5 steps"). Each step's kind icon is decorative (
            <code style={{ fontFamily: 'var(--font-mono)' }}>aria-hidden</code>) — the kind and label are
            carried by the visible text. Steps render as an <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;ol&gt;</code>{' '}
            so position is announced ("item 3 of 5"). Wrap streaming demos in{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> so new steps are announced as they arrive.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The header button shows a 2px ember focus ring on{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>:focus-visible</code>. The step mark carries
            colour as a status cue — <code style={{ fontFamily: 'var(--font-mono)' }}>--fg-muted</code>{' '}
            for a settled (done) step, <code style={{ fontFamily: 'var(--font-mono)' }}>--ember</code> for the
            active one. Colour is never the sole signal: the active step is also the last item in the{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>&lt;ol&gt;</code> and is announced by{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live</code> as it arrives, so position and
            announcement carry the same meaning to non-sighted users. Step labels on{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>--fg</code> and details on{' '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>--fg-muted</code> over the page background both
            clear 4.5:1 AA. The header title is the lone ember accent — flat type, no tile.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> the step
            list opens and closes instantly (no max-height slide). The streaming demo still appends steps
            on schedule — only the reveal animation is suppressed, not the state machine. Any connector
            line between steps renders statically.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — step icon leads from the start (right) edge, connector mirrors" height={300}>
        <div dir="rtl" style={{ width: '100%', maxWidth: 560 }}>
          <ChainOfThought
            title="سلسلة التفكير"
            defaultOpen={true}
            steps={[
              { kind: 'think',   label: 'ما سبب ارتفاع p99 على identity-svc؟', detail: 'مقارنة النشر بنافذة الارتفاع' },
              { kind: 'search',  label: 'البحث في سجل النشر', detail: 'forge.deploys · since=24h' },
              { kind: 'observe', label: 'تم العثور على 4 عمليات نشر — identity-svc هو الأحدث' },
              { kind: 'plan',    label: 'فحص تغيير pool-size فقط' },
              { kind: 'done',    label: 'التوصية بالتراجع عن pool-size' },
            ]}
          />
        </div>
      </Frame>
      <Lede>
        Logical CSS properties flip the layout automatically: the step icon moves to the start
        (right) edge, the connector runs down the start side, and the detail text wraps right
        to left. The header count ("5 steps") and chevron mirror accordingly. The kind icons are
        non-directional — they do not need{' '}
        <Mono>transform: scaleX(-1)</Mono>.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 480 }} aria-hidden="true">
              <ChainOfThought
                title="Chain of thought"
                defaultOpen={true}
                steps={[
                  { kind: 'think',   label: 'What caused the p99 spike?',         detail: 'Check T1 deploys first.' },
                  { kind: 'search',  label: 'Search deploy log · since=24h' },
                  { kind: 'done',    label: 'Revert pool-size change' },
                ]}
              />
              {/* leads */}
              <span className="lead h" style={{ top: 16, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 16, right: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 52, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 80, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 108, left: -32, width: 28 }}/>
              {/* pins */}
              <div className="pin" style={{ top: 8, left: -54 }}>1</div>
              <div className="pin" style={{ top: 8, right: -54 }}>2</div>
              <div className="pin" style={{ top: 44, left: -54 }}>3</div>
              <div className="pin" style={{ top: 72, left: -54 }}>4</div>
              <div className="pin" style={{ top: 100, left: -54 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Header.</b> A mono, uppercase ember title + a muted step count + a chevron — no icon tile. A single <Mono>&lt;button&gt;</Mono> with <Mono>aria-expanded</Mono>. The count ("· 3 steps") is plain text, updated as steps are appended.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Chevron.</b> Rotates 180° when open. Mirrors to the start edge in RTL. Non-directional icons in the step marks do not mirror.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Step mark.</b> A bare kind icon — sparkle / search / eye / clipboard / book / check — in <Mono>--fg-muted</Mono>, no tile or fill. Decorative (<Mono>aria-hidden</Mono>); the label carries the meaning.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Step label.</b> The primary step text — a question, a query, an observation, a recommendation. Full-weight. The kind name is implicit in the icon, not repeated in text.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Step detail.</b> Optional one-liner below the label — a tool path, a count, a raw observation. Mono-faced and muted to read as metadata.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show CoT when the answer hinges on the work</div>
          <div className="body" style={{ padding: 14 }}>
            <ChainOfThought
              title="Chain of thought"
              defaultOpen={false}
              steps={[
                { kind: 'think',   label: 'Which deploy caused the spike?' },
                { kind: 'search',  label: 'listDeploys · tier=T1 · since=24h' },
                { kind: 'observe', label: 'identity-svc @ 0421 is the only candidate' },
                { kind: 'done',    label: 'Recommend revert' },
              ]}
            />
          </div>
          <div className="note">Collapsed by default after settling — one click to audit the reasoning. The answer stays in front of the user.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — pad answers with fake CoT for show</div>
          <div className="body" style={{ padding: 14 }}>
            <ChainOfThought
              title="Chain of thought"
              defaultOpen={true}
              steps={[
                { kind: 'think', label: 'The user said hello' },
                { kind: 'think', label: 'I should respond with a greeting' },
                { kind: 'plan',  label: 'Decide to say hello back' },
                { kind: 'done',  label: 'Say hello' },
              ]}
            />
          </div>
          <div className="note">A CoT that documents "thinking about saying hello" adds noise. Use CoT only when the trace earns its keep.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — collapse the trace after settling</div>
          <div className="body" style={{ padding: 14 }}>
            <ChainOfThought
              title="Chain of thought"
              defaultOpen={false}
              steps={USAGE_STEPS}
            />
          </div>
          <div className="note">The answer is what the user came for. A collapsed CoT is one click away — it doesn't compete with the response.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — leave CoT expanded over the response</div>
          <div className="body" style={{ padding: 14 }}>
            <ChainOfThought
              title="Chain of thought"
              defaultOpen={true}
              steps={[
                { kind: 'think',   label: 'Examining the deploy log…' },
                { kind: 'search',  label: 'listDeploys · since=24h' },
                { kind: 'observe', label: 'Found 4 candidates' },
                { kind: 'plan',    label: 'Narrowing to pool-size change' },
                { kind: 'done',    label: 'Recommendation ready' },
              ]}
            />
          </div>
          <div className="note">An always-expanded trace buries the response. Mirror <a href="/ai/reasoning" style={{ color: 'var(--ember)' }}>Reasoning</a>: auto-collapse when done.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="ChainOfThoughtProps">API reference</SubHead>
      <AutoPropsTable component="ChainOfThought" label="<ChainOfThought />"/>
      <PropsTable
        label="CotStep"
        rows={[
          { prop: 'kind', type: '"think" | "search" | "observe" | "plan" | "read" | "done"', default: '"think"', description: 'Step type. Maps to a fixed icon (sparkle/search/eye/clipboard/book/check). Unknown kinds fall back to sparkle.' },
          { prop: 'label', type: 'string', required: true, description: 'Primary step text — a question, query, observation, or recommendation. Screen readers read this as the step content.' },
          { prop: 'detail', type: 'string', default: undefined, description: 'Optional one-line metadata below the label — a tool path, count, or raw observation. Mono-faced and muted.' },
          { prop: 'status', type: 'string', default: '"done"', description: 'Step status. Reserved for future use (running/pending states). Currently drives data-status on the step element.' },
        ]}
      />
    </Section>
  );
}
