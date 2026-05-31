'use client';
// Forge AI — Shimmer (§2.2 component-page standard).
// Documents the Shimmer text placeholder: an animated gradient sweep over a
// short label that bridges the "before first token" beat. TEXT-ONLY.
// Image loading placeholders are handled by ImageView (image.tsx) and Skeleton.
// Both Shimmer and Skeleton are in core/ai/content; styles in ai.css.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Shimmer, Skeleton, Prose, Mono } from '@/ds/core';


// ── Interactive demo — cycle Shimmer labels ───────────────────────────────
const SHIMMER_LABELS = ['Thinking…', 'Searching the codebase…', 'Generating…', 'Reasoning…'];

function ShimmerCycleDemo() {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SHIMMER_LABELS.length), 1800);
    return () => clearInterval(t);
  }, []);
  return <Shimmer>{SHIMMER_LABELS[idx]}</Shimmer>;
}

// ── In-context demo — message bubble with Shimmer then text ──────────────
function InContextDemo() {
  const [phase, setPhase] = React.useState<'shimmer' | 'skeleton' | 'done'>('shimmer');
  // Loop the full latency choreography so the Shimmer → Skeleton → content
  // beat replays for the reader without a reload — the live sequence is the
  // point of the demo. Honour reduced-motion by not animating the cycle.
  React.useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('done'); return; }
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setPhase('shimmer');
      timers = [
        setTimeout(() => setPhase('skeleton'), 1600),
        setTimeout(() => setPhase('done'), 3200),
        setTimeout(run, 5200),
      ];
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* User bubble */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ padding: '10px 14px', background: 'var(--ember-soft)', border: '1px solid var(--ember-border)', borderRadius: 12, borderEndEndRadius: 4, color: 'var(--fg)', fontSize: 'var(--text-base)', lineHeight: 1.55, maxWidth: '70%' }}>
          What is the current error budget for identity-svc?
        </div>
      </div>
      {/* Agent reply */}
      <div style={{ display: 'flex', gap: 12 }}>
        <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--ember-soft)', border: '1px solid var(--ember-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Icons.sparkle size={16} style={{ color: 'var(--ember)' }}/>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>Forge platform agent</span>
          {phase === 'shimmer' && (
            <Shimmer>Searching the codebase…</Shimmer>
          )}
          {phase === 'skeleton' && (
            <Skeleton lines={3} width={400} label="Loading response…"/>
          )}
          {phase === 'done' && (
            <Prose>
              <p>The error budget for <code>identity-svc</code> is at <strong>38%</strong> remaining. Two open incidents are burning it at an elevated rate.</p>
            </Prose>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Code snippets ─────────────────────────────────────────────────────────
const SHIMMER_USAGE_CODE = `import { Shimmer } from "@/ds/core"

// Before the first token arrives:
<Shimmer>Thinking…</Shimmer>`;

const SKELETON_USAGE_CODE = `import { Skeleton } from "@/ds/core"

// While content streams in — label drives the
// role="status" + sr-only announcement:
<Skeleton lines={3} width={480} label="Loading response…"/>`;

const IN_CONTEXT_CODE = `// Phase 1 — waiting for the first token:
{isWaiting && <Shimmer>Thinking…</Shimmer>}

// Phase 2 — first token received, content is streaming.
// label keeps the live region announcing once Shimmer is gone:
{isStreaming && !isWaiting && (
  <Skeleton lines={3} width={480} label="Loading response…"/>
)}

// Phase 3 — stream complete:
{isDone && (
  <Prose streaming={false}>
    <ReactMarkdown>{text}</ReactMarkdown>
  </Prose>
)}`;

export default function AiShimmer() {
  return (
    <Section
      id="shimmer"
      num="04"
      title="Shimmer"
      desc="The text loading affordance for AI latency: Shimmer (animated gradient sweep over a label) bridges the beat before the first token. For image loading placeholders, see the Image page."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-shimmer')} ariaLabel="package manager"/>
      <Lede>
        Shimmer is a <b>text-only</b> placeholder. It renders a short label ("Thinking…", "Searching…") behind an animated gradient sweep — a visual signal that the model is active but hasn't produced output yet. Use <Mono>Skeleton</Mono> for line-level content placeholders while tokens stream in. Use <a href="/ai/image" style={{ color: 'var(--ember)' }}>ImageView</a> for image loading states — its shimmer is built in.
      </Lede>
      <Lede>
        Ships <Mono>Shimmer</Mono> (the animated text label — gradient sweep stops under <Mono>prefers-reduced-motion</Mono>) and <Mono>Skeleton</Mono> (block placeholder lines). Both import from <Mono>@/ds/core</Mono>; styles live in <Mono>ai.css</Mono>.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="Shimmer — animated text label before the first token arrives" row code={SHIMMER_USAGE_CODE}>
        <Shimmer>Thinking…</Shimmer>
      </Frame>
      <Lede>
        Drop <Mono>{'<Shimmer>'}</Mono> wherever you need to signal "the model is active but hasn't produced output yet." It renders its children behind a gradient sweep that pulses. The sweep stops cleanly under <Mono>prefers-reduced-motion</Mono> — the label stays visible as static text.
      </Lede>

      <Frame label="Skeleton — block placeholder while content streams in" code={SKELETON_USAGE_CODE} height={100}>
        <Skeleton lines={3} width={480} label="Loading response…"/>
      </Frame>
      <Lede>
        <Mono>{'<Skeleton>'}</Mono> renders the requested number of placeholder bars. The last line is always narrower (62% width) to mimic real prose ending mid-line. The bars animate with a subtle pulse — also stopped under <Mono>prefers-reduced-motion</Mono>. Pass <Mono>label</Mono> while streaming so the bars wrap in a <Mono>role="status"</Mono> live region — without it they are purely decorative (<Mono>aria-hidden</Mono>).
      </Lede>

      {/* EXAMPLES EYEBROW */}
      <div className="ds-examples-rule" style={{ marginTop: 36, marginBottom: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* SHIMMER TEXT LABELS */}
      <SubHead meta="text labels">Text label variants</SubHead>
      <Frame label="Thinking · Searching the codebase · Generating… · Reasoning…" row>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SHIMMER_LABELS.map(label => (
            <Shimmer key={label}>{label}</Shimmer>
          ))}
        </div>
      </Frame>
      <Lede>
        The label text signals the model's current activity. Keep labels short (under 4 words), present-tense, and ending with an ellipsis to reinforce the "in-progress" state. The shimmer sweep is the only animation — no spinner, no bouncing dots.
      </Lede>

      <SubHead meta="cycling demo">Cycling labels</SubHead>
      <Frame label="labels cycle every 1.8 s — live demo" row>
        <ShimmerCycleDemo/>
      </Frame>
      <Lede>
        When the model goes through multiple stages (plan → search → generate), cycle the Shimmer label to reflect each stage. Update the label via a state change — the sweep continues without interruption.
      </Lede>

      {/* SKELETON VARIANTS */}
      <SubHead meta="2 · 3 · 5 lines">Skeleton — line counts</SubHead>
      <Frame label="2 lines · 3 lines · 5 lines — last line is always shorter" height={260}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 480 }}>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>2 lines</span>
            <Skeleton lines={2} width={480}/>
          </div>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>3 lines</span>
            <Skeleton lines={3} width={480}/>
          </div>
          <div>
            <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>5 lines</span>
            <Skeleton lines={5} width={480}/>
          </div>
        </div>
      </Frame>
      <Lede>
        Match the line count to the expected length of the response. 2 lines for a short answer, 3 for a paragraph, 5 for a multi-step explanation. If you don't know the length, default to 3.
      </Lede>

      {/* IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede>
        The two affordances work in sequence: <Mono>Shimmer</Mono> appears immediately on submit (before the first token), then transitions to <Mono>Skeleton</Mono> once the model has started streaming, then the full rendered response replaces the skeleton.
      </Lede>
      <Frame label="Shimmer → Skeleton → content — live sequence demo" height={200} code={IN_CONTEXT_CODE}>
        <InContextDemo/>
      </Frame>
      <Lede>
        Each phase maps to a model state: Shimmer = waiting for first token (<Mono>isWaiting</Mono>), Skeleton = streaming (<Mono>isStreaming</Mono>), content = done. Replace all three by conditioning on the AI SDK's stream state — <Mono>status === 'submitted'</Mono> → Shimmer, <Mono>status === 'streaming'</Mono> → Skeleton, <Mono>status === 'ready'</Mono> → content.
      </Lede>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Live region</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <Mono>Shimmer</Mono> renders with <Mono>aria-live="polite"</Mono> so the text label ("Thinking…", "Searching…") is announced to screen readers when it first appears or changes. Use polite (not assertive) — loading states should not interrupt the user's current reading position.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Skeleton announces with <Mono>label</Mono></div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The placeholder bars are always <Mono>aria-hidden</Mono>, but the streaming Skeleton takes a <Mono>label</Mono> prop. When set, it wraps the bars in <Mono>role="status"</Mono> with an <Mono>sr-only</Mono> "Loading response…" span — so the moment Shimmer disappears at the first token, a screen reader still hears that the reply is loading. Pass <Mono>label</Mono> on the topmost group only, never per bar.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Under <Mono>prefers-reduced-motion: reduce</Mono>, both the Shimmer gradient sweep and the Skeleton pulse animation are stopped. The shimmer label is still visible as static text; the skeleton bars are still visible as muted lines.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Don't replace text with a spinner</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Spinners are visually ambiguous and announce nothing useful. Use the Shimmer text label ("Thinking…") before streaming and let the <Mono>Prose streaming</Mono> caret trail the live content once tokens arrive.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — Arabic label flows from the inline-start edge; skeleton bars and the shorter last line align to the start edge"
        code={`<div dir="rtl">
  <Shimmer>جارٍ التفكير…</Shimmer>
  <Skeleton lines={3} width={400} label="جارٍ التحميل…"/>
</div>`}
      >
        <div dir="rtl" style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Shimmer>جارٍ التفكير…</Shimmer>
          <Skeleton lines={3} width={400} label="جارٍ التحميل…"/>
        </div>
      </Frame>
      <Lede>
        Both affordances are layout-agnostic: the Shimmer label is an inline span, so RTL text reflows to the inline-start edge automatically, and the skeleton bars (including the shorter last line) align to the start edge of their flex column. The gradient sweep itself runs along the same visual axis in both directions — it carries no meaning, so it is not mirrored. Localize the <Mono>label</Mono> on both ("جارٍ التفكير…" = "Thinking…", "جارٍ التحميل…" = "Loading…").
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 420 }} aria-hidden="true">
              {/* Shimmer */}
              <div style={{ marginBottom: 28 }}>
                <Shimmer>Searching the codebase…</Shimmer>
              </div>
              {/* Skeleton */}
              <Skeleton lines={3} width={420}/>

              {/* Shimmer pins */}
              <span className="lead v" style={{ top: -22, left: 80, height: 18 }}/>
              <div className="pin" style={{ top: -42, left: 80, transform: 'translateX(-50%)' }}>1</div>
              <span className="lead h" style={{ top: 10, right: -34, width: 30 }}/>
              <div className="pin" style={{ top: 2, right: -56 }}>2</div>

              {/* Skeleton pins */}
              <span className="lead v" style={{ bottom: -22, left: 60, height: 18 }}/>
              <div className="pin" style={{ bottom: -42, left: 60, transform: 'translateX(-50%)' }}>3</div>
              <span className="lead h" style={{ bottom: 20, right: -34, width: 30 }}/>
              <div className="pin" style={{ bottom: 12, right: -56 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Shimmer label.</b> The text content passed as <Mono>children</Mono> — "Thinking…", "Generating…", etc. Always ends with an ellipsis to reinforce the in-progress state. This is the only place a loading state has a text description for screen readers.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Gradient sweep.</b> A CSS gradient animation that passes over the label along a fixed visual axis (the sweep is decorative, so it is not mirrored in RTL). Stops under <Mono>prefers-reduced-motion</Mono> — the label stays visible as static text. This is text-only; image loading shimmer lives in ImageView.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Skeleton lines.</b> Muted bars sized to the expected text height. The count (<Mono>lines</Mono> prop) approximates the length of the response. The last bar is always narrower (62%) to mimic natural line endings.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Skeleton pulse.</b> A subtle opacity pulse on the bars, also stopped under <Mono>prefers-reduced-motion</Mono>. The bars are <Mono>aria-hidden</Mono>; pass <Mono>label</Mono> to wrap them in a <Mono>role="status"</Mono> live region so the streaming state is still announced after Shimmer is gone.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use Shimmer for text loading only</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Shimmer>Thinking…</Shimmer>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>↓ first token arrives</span>
              <Skeleton lines={2} width={320}/>
            </div>
          </div>
          <div className="note">Shimmer is a text-only label placeholder. Use it before the first token arrives. For image loading, use ImageView (its shimmer is built-in); for content skeletons, use Skeleton.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — replace streamed text with a spinner</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--ember)', borderTopColor: 'transparent', display: 'inline-block' }}/>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Loading response…</span>
            </div>
          </div>
          <div className="note">A spinner gives no sense of progress — it could mean "1 second" or "30 seconds". Use Shimmer (labelled text) + Skeleton (content-shaped placeholder) instead.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — match the skeleton to the expected column width</div>
          <div className="body" style={{ padding: 14 }}>
            <Skeleton lines={3} width={300}/>
          </div>
          <div className="note">Constrain <Mono>width</Mono> to the prose column so the switch from skeleton to content doesn't cause a layout jump.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use Skeleton for the "before first token" beat</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>// ✗ skeleton before any tokens:</span>
              <Skeleton lines={3} width={300}/>
            </div>
          </div>
          <div className="note">A skeleton with no shimmer gives no indication that the model is active. Use Shimmer first — it carries a readable label that communicates intent to sighted users and screen readers alike.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="ShimmerProps">API reference</SubHead>
      <AutoPropsTable component="Shimmer" label="<Shimmer />"/>
      <AutoPropsTable component="Skeleton" label="<Skeleton />"/>
    </Section>
  );
}
