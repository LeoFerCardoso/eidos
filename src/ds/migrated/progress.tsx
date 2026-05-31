'use client';
// Eidos DS — Components / Progress
// Linear bar, circular ring, segmented stepper — all backed by the same .prog-* primitive.
// Determinate when you can measure; indeterminate only when you genuinely cannot.
import * as React from 'react';
import {
  Progress,
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  installTabs,
  AutoPropsTable,
  Lede,
  Mono,
} from '@/ds/core';

const { useState, useEffect } = React;

// ── Code snippets ────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Progress } from "@/components/forge/progress"

export function Demo() {
  return <Progress value={64} label="Building identity-svc"/>
}`;

// ── Live demo component ───────────────────────────────────────────────────────
// A live IDP deploy that obeys this page's own rules: it advances forward,
// holds at 100% on its success tone, then jump-cuts back to 0 (never shrinks
// the bar) before the next run. Determinate the whole way — never a sawtooth.

const PHASES = [
  { sub: 'compiling Go binaries', label: 'building identity-svc' },
  { sub: 'running 142 unit tests', label: 'testing identity-svc' },
  { sub: 'canary at 5% traffic', label: 'rolling identity-svc' },
];

const LiveProgress = () => {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf: number;
    let start = performance.now();
    const RUN = 4200; // fill 0→100
    const HOLD = 1100; // dwell at 100% on success
    const RESET = 360; // brief gap before the jump-cut to 0
    const tick = (t: number) => {
      const elapsed = t - start;
      if (elapsed <= RUN) {
        setDone(false);
        setPct(Math.round((elapsed / RUN) * 100));
      } else if (elapsed <= RUN + HOLD) {
        setPct(100);
        setDone(true);
      } else if (elapsed <= RUN + HOLD + RESET) {
        // hold the completed bar; the jump-cut to 0 happens on the next cycle
      } else {
        start = t;
        setPct(0); // jump-cut, not a reverse animation
        setDone(false);
        setPhase((p) => (p + 1) % PHASES.length);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const p = PHASES[phase];
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <Progress
        value={pct}
        status={done ? 'success' : 'primary'}
        label={done ? p.label.replace(/^\w+/, 'shipped') : p.label}
        sub={done ? 'all checks passed' : p.sub}
        aria-label={`${p.label} — ${pct}%`}
      />
    </div>
  );
};

// A mono micro-label that names each lifecycle state above its bar — same
// Geist Mono eyebrow vocabulary as the section divider, on the type scale.
const StateEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'block',
      marginBlockEnd: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: 'var(--fg-faint)',
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  return (
    <Section
      id="progress"
      num="29"
      title="Progress"
      desc="A bar that says how far. Use determinate when you know how much remains. Indeterminate is the fallback — never the default."
    >

      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('progress')} ariaLabel="package manager" />
      <Lede>
        Eidos Progress ships three forms from one component: a continuous bar, a circular ring,
        and a segmented stepper. All visuals live in <Mono>ds.css</Mono> under the{' '}
        <Mono>.prog-*</Mono> namespace so Alert, AI error meters, and table footers compose
        the same primitive without duplicating styles.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <Progress value={64} label="Building identity-svc" />
        </div>
      </Frame>

      {/* Divider eyebrow */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* 3. VARIANTS — Determinate */}
      <SubHead meta="determinate · default">Determinate</SubHead>
      <Frame
        label="<Progress value={64}/> · width tracks value"
        code={`<Progress
  value={64}
  label="building identity-svc"
  sub="compiling Go binaries"
/>`}
      >
        <Progress value={64} label="building identity-svc" sub="compiling Go binaries" />
      </Frame>
      <p className="ds-caption">
        Reach for determinate progress whenever the system can measure completion — uploads, builds,
        batch jobs, multi-step flows. The percentage anchors the user's expectation of how much longer.
      </p>

      {/* Live */}
      <SubHead meta="live · animated">Live updates</SubHead>
      <Frame
        label="fills forward · 800ms ease · switches to success at 100% · jump-cuts to 0 — never reverses"
        code={`const [pct, setPct] = useState(0)
const done = pct >= 100
useEffect(() => { /* tick pct from polling or a websocket */ }, [])

// finished → switch to the outcome tone; a restart jump-cuts to 0.
return (
  <Progress
    value={pct}
    status={done ? "success" : "primary"}
    label={done ? "shipped identity-svc" : "building identity-svc"}
  />
)`}
      >
        <LiveProgress />
      </Frame>
      <p className="ds-caption">
        A live deploy that follows its own rules: the bar only ever moves forward, flips to its{' '}
        <Mono>success</Mono> tone the moment it lands on 100%, then jump-cuts back to 0 for the next
        run rather than visibly shrinking. The 800ms width transition makes each polled update feel
        committed instead of jumpy.
      </p>

      {/* Sizes */}
      <SubHead meta="4 sizes">Sizes</SubHead>
      <Frame
        label=".xs (2px) · .sm (4px) · .md (6px) · .lg (10px)"
        code={`<Progress value={45} size="xs"/>
<Progress value={62} size="sm"/>
<Progress value={78} size="md"/>
<Progress value={36} size="lg"/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', maxWidth: 460 }}>
          <Progress value={45} size="xs" label="xs · 2px" />
          <Progress value={62} size="sm" label="sm · 4px (default)" />
          <Progress value={78} size="md" label="md · 6px" />
          <Progress value={36} size="lg" label="lg · 10px" />
        </div>
      </Frame>
      <p className="ds-caption">
        Default to <Mono>sm</Mono>. Use <Mono>xs</Mono> for inline status (next to a row label),{' '}
        <Mono>md</Mono> when the bar is the focal point of a card, and <Mono>lg</Mono> only for
        hero callouts.
      </p>

      {/* Status tints */}
      <SubHead meta="status">Status tints</SubHead>
      <Frame
        label="primary · success · warning · danger · neutral"
        code={`<Progress value={72}/>
<Progress value={100} status="success"/>
<Progress value={92} status="warning"/>
<Progress value={100} status="danger"/>
<Progress value={42} status="neutral"/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', maxWidth: 460 }}>
          <Progress value={72} label="In progress" sub="primary · ember" />
          <Progress value={100} status="success" label="Completed" sub="success · all checks passed" />
          <Progress value={92} status="warning" label="Approaching quota" sub="warning · 92% of 100 GB" />
          <Progress value={100} status="danger" label="Failed at step 4" sub="danger · transient retry" />
          <Progress value={42} status="neutral" label="Paused" sub="neutral · awaiting approval" />
        </div>
      </Frame>

      {/* States — the lifecycle, each one named and shown */}
      <SubHead meta="lifecycle · idle → loading → done / error">States</SubHead>
      <Frame label="every state a deploy bar passes through — named, visible, side by side">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%', maxWidth: 460 }}>
          {/* idle / empty — nothing started yet */}
          <div>
            <StateEyebrow>idle · queued</StateEyebrow>
            <Progress status="neutral" label="building identity-svc" sub="awaiting a runner" aria-label="building identity-svc — queued" />
          </div>
          {/* loading — indeterminate, duration unknown */}
          <div>
            <StateEyebrow>loading · indeterminate</StateEyebrow>
            <Progress status="primary" label="building identity-svc" sub="pulling base image" aria-label="building identity-svc — in progress, duration unknown" />
          </div>
          {/* in progress — determinate */}
          <div>
            <StateEyebrow>in progress · determinate</StateEyebrow>
            <Progress value={64} label="building identity-svc" sub="compiling Go binaries" aria-label="building identity-svc — 64%" />
          </div>
          {/* success */}
          <div>
            <StateEyebrow>success · settled</StateEyebrow>
            <Progress value={100} status="success" label="shipped identity-svc" sub="all 142 checks passed" aria-label="shipped identity-svc — complete" />
          </div>
          {/* error — bar in danger tone + a real role=alert beside it */}
          <div>
            <StateEyebrow>error · failed</StateEyebrow>
            <Progress value={38} status="danger" label="building identity-svc" sub="failed at step 4 of 9" aria-label="building identity-svc — failed at 38%" />
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        A bar is a state machine, so document it as one. <Mono>idle</Mono> is an indeterminate sweep
        on the neutral tint — it reads as "queued", not "stuck at 0%". <Mono>loading</Mono> is the
        same sweep on the ember tint, for active work whose duration is genuinely unknown.{' '}
        <Mono>in&nbsp;progress</Mono> switches to a measured determinate bar the moment a percentage
        exists. <Mono>success</Mono> and <Mono>error</Mono> settle on their outcome tone so a row
        scans without reading the label. The error case never hides the failure — it surfaces it.
      </p>

      {/* Error, surfaced — Progress inside a role="alert" so SR users hear it */}
      <SubHead meta="error · announced">Failure, surfaced</SubHead>
      <Frame
        label='<Progress status="danger"/> inside a role="alert" — the failure is spoken, not buried'
        code={`<div role="alert" className="alert danger">
  <AlertTitle>Build failed</AlertTitle>
  <AlertDescription>identity-svc stopped at step 4 of 9 (vet).</AlertDescription>
  <AlertExtra>
    <Progress value={38} status="danger" label="building identity-svc" sub="failed · 38%"/>
  </AlertExtra>
</div>`}
      >
        <div className="alert danger" role="alert" style={{ width: '100%' }}>
          <Icons.alert size={16} className="alert-icon" />
          <div className="alert-body">
            <div className="alert-title">Build failed</div>
            <div className="alert-desc">identity-svc stopped at step 4 of 9 (vet). Re-run from the pipeline console.</div>
            <div className="alert-extra">
              <Progress value={38} size="sm" status="danger" label="building identity-svc" sub="failed · 38%" />
            </div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        A failed bar should be heard, not just seen. Wrapping the danger bar in a{' '}
        <Mono>role="alert"</Mono> container makes the assertive live region speak the title and
        description the instant the build fails — the bar alone carries no <Mono>aria-live</Mono>,
        so the surrounding alert is what announces the outcome.
      </p>

      {/* Indeterminate */}
      <SubHead meta="when you can't measure">Indeterminate</SubHead>
      <Frame
        label="reserved for unknown durations"
        code={`<Progress label="Querying remote registry"/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, width: '100%', maxWidth: 460 }}>
          <Progress label="Querying remote registry" sub="response time unknown" />
          <Progress size="md" status="neutral" label="Connecting to provider" sub="no progress contract from upstream" />
        </div>
      </Frame>
      <p className="ds-caption">
        Indeterminate means: "the system is busy and we genuinely don't know how long." If you
        can show 8 of 12 steps, show determinate. Don't reach for indeterminate just because
        progress is hard to wire — users read it as "frozen" after a few seconds.
      </p>

      {/* Buffer */}
      <SubHead meta="dual-layer">Buffer</SubHead>
      <Frame
        label="received vs confirmed · streaming uploads"
        code={`<Progress value={54} buffered={78} label="Streaming → object store"/>`}
      >
        <Progress value={54} buffered={78} label="Streaming → object store" sub="received 78 MB · confirmed 54 MB" />
      </Frame>
      <p className="ds-caption">
        The lighter <Mono>--ember-soft</Mono> layer shows what the client has received; the solid
        bar shows what the backend has confirmed. Use for streaming uploads, video buffers, and
        any flow where receive and persist drift apart.
      </p>

      {/* Striped */}
      <SubHead meta="texture">Striped</SubHead>
      <Frame
        label="long-running uploads — adds visible motion"
        code={`<Progress value={67} striped size="md" label="Encrypting backup" sub="14 GB of 21 GB"/>`}
      >
        <Progress value={67} striped size="md" label="Encrypting backup" sub="14 GB of 21 GB" />
      </Frame>

      {/* Segmented */}
      <SubHead meta="discrete steps">Segmented</SubHead>
      <Frame
        label="segments prop · stepper for known phases"
        code={`<Progress
  segments={['Build','Test','Canary','Ring 3','Ring 4']}
  activeSegment={2}
  label="Deploy ring 2 · canary running"
/>`}
      >
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Progress
            segments={['Build', 'Test', 'Canary', 'Ring 3', 'Ring 4']}
            activeSegment={2}
            label="Deploy ring 2 · canary running"
            sub="step 3 of 5"
          />
        </div>
      </Frame>
      <p className="ds-caption">
        Segmented progress is for flows with discrete, named phases — deploy rings, multi-step
        forms, onboarding. Use when the user benefits from knowing <em>which</em> step is in
        flight, not just <em>how much</em> overall.
      </p>

      {/* Circular */}
      <SubHead meta="compact · dial">Circular</SubHead>
      <Frame
        label="compact for tiles, dashboards, table cells"
        row
        code={`<Progress variant="circular" value={64}/>
<Progress variant="circular" value={92} status="success"/>
<Progress variant="circular" value={38} status="warning"/>
<Progress variant="circular" value={12} status="danger"/>
<Progress variant="circular"/>
<Progress variant="circular" value={48} circleSize={80} strokeWidth={6}/>`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <Progress variant="circular" value={64} aria-label="64% complete" />
          <Progress variant="circular" value={92} status="success" aria-label="92% — success" />
          <Progress variant="circular" value={38} status="warning" aria-label="38% — warning" />
          <Progress variant="circular" value={12} status="danger" aria-label="12% — danger" />
          <Progress variant="circular" aria-label="Loading" />
          <Progress variant="circular" value={48} circleSize={80} strokeWidth={6} aria-label="48% — large" />
        </div>
      </Frame>

      {/* 4. IN CONTEXT — file uploader */}
      <SubHead meta="in context · full lifecycle">File uploader</SubHead>
      <Frame label="every state in one queue — queued · uploading · done · failed">
        <div style={{ width: '100%', maxWidth: 540 }}>
          <div className="prog-row">
            <div className="ico"><Icons.file size={16} /></div>
            <div>
              <div className="name">contracts-2026.pdf</div>
              <div className="meta">2.4 MB · uploading…</div>
              <Progress value={67} size="xs" style={{ marginTop: 6 }} aria-label="contracts-2026.pdf — 67% uploaded" />
            </div>
            <span className="pct">67%</span>
          </div>
          <div className="prog-row">
            <div className="ico"><Icons.file size={16} /></div>
            <div>
              <div className="name">audit-log-q3.csv</div>
              <div className="meta">1.1 MB · uploaded</div>
              <Progress value={100} size="xs" status="success" style={{ marginTop: 6 }} aria-label="audit-log-q3.csv — upload complete" />
            </div>
            <span className="pct" style={{ color: 'var(--success)' }}>100%</span>
          </div>
          <div className="prog-row">
            <div className="ico"><Icons.file size={16} /></div>
            <div>
              <div className="name">tx-export-2026-04.xlsx</div>
              <div className="meta">812 KB · upload failed</div>
              <Progress value={38} size="xs" status="danger" style={{ marginTop: 6 }} aria-label="tx-export-2026-04.xlsx — upload failed at 38%" />
            </div>
            <span className="pct" style={{ color: 'var(--danger)' }}>38%</span>
          </div>
          {/* idle / queued — indeterminate, awaiting its turn in the queue */}
          <div className="prog-row">
            <div className="ico"><Icons.file size={16} /></div>
            <div>
              <div className="name">vendor-soc2.pdf</div>
              <div className="meta">3.0 MB · queued</div>
              <Progress size="xs" status="neutral" style={{ marginTop: 6 }} aria-label="vendor-soc2.pdf — queued, waiting to upload" />
            </div>
            <span className="pct" style={{ color: 'var(--fg-faint)' }}>—</span>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        One queue, four states. Uploading rows are determinate; the queued row is indeterminate
        with a neutral tint and an em-dash for the percent — it reads as "waiting", not "stuck at
        0%". Completed and failed rows switch the bar to its outcome tone and the percent picks up
        the matching token (<Mono>--success</Mono> / <Mono>--danger</Mono>) so the column scans
        in one pass.
      </p>

      {/* In context: inside an Alert */}
      <SubHead meta="in context · alert">Composed inside Alert</SubHead>
      <Frame
        label="<Progress/> inside <AlertExtra/> — the same primitive AI errors use"
        code={`<Alert variant="warning">
  <AlertTitle>Disk usage critical</AlertTitle>
  <AlertDescription>Compaction will pause if free space drops below 5%.</AlertDescription>
  <AlertExtra>
    <Progress value={92} status="warning" label="used" sub="92 / 100 GB"/>
  </AlertExtra>
</Alert>`}
      >
        <div className="alert warning" style={{ width: '100%' }}>
          <Icons.alert size={16} className="alert-icon" />
          <div className="alert-body">
            <div className="alert-title">Disk usage critical</div>
            <div className="alert-desc">Compaction will pause if free space drops below 5%.</div>
            <div className="alert-extra">
              <Progress value={92} size="sm" status="warning" label="used" sub="92 / 100 GB" />
            </div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        Progress is the single primitive for quota / window / disk-usage bars throughout the system.
        Alerts don't ship their own meter — drop a <Mono>{'<Progress/>'}</Mono> inside{' '}
        <Mono>{'<AlertExtra/>'}</Mono> with a matching <Mono>status</Mono> and it inherits the
        alert's tone automatically.
      </p>

      {/* Decision matrix */}
      <SubHead meta="when to use which">Decision matrix</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Variant guide</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Variant</th>
              <th>Use for</th>
              <th>Avoid for</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="tok-name">linear</td><td>Uploads, builds, batch jobs — anything with a measurable %</td><td className="mono">Unknown durations</td></tr>
            <tr><td className="tok-name">indeterminate</td><td>Genuinely unknown remote work (3rd-party API, queue depth)</td><td className="mono">Anything you can count</td></tr>
            <tr><td className="tok-name">buffered</td><td>Streaming where receive ≠ confirm</td><td className="mono">Plain uploads</td></tr>
            <tr><td className="tok-name">segmented</td><td>Discrete named phases — deploy ring, multi-step form</td><td className="mono">Continuous % progress</td></tr>
            <tr><td className="tok-name">circular</td><td>Tight footprints — table cell, tile corner</td><td className="mono">Long copy alongside</td></tr>
            <tr><td className="tok-name">striped</td><td>Long uploads where motion reassures</td><td className="mono">{'Quick < 2s actions'}</td></tr>
          </tbody>
        </table>
      </div>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <p className="t-small" style={{ margin: 0, lineHeight: 1.6 }}>
            <strong>Keyboard.</strong> Progress is a status role, not a control: it is not in the
            tab order and exposes <em>no</em> key bindings — <Mono>Tab</Mono> skips past it,{' '}
            <Mono>Arrow</Mono>/<Mono>Enter</Mono>/<Mono>Space</Mono> do nothing, and it is never
            given <Mono>tabindex</Mono>. There are genuinely no keys to map; a focusable bar would
            be a bug. <strong>Announcements.</strong> <Mono>{'<Progress/>'}</Mono> does not set{' '}
            <Mono>aria-live</Mono>, so value changes are announced only inside a container with{' '}
            <Mono>aria-live="polite"</Mono> (e.g. the alert body below). Without that wrapper a
            screen reader reads the bar once on entry and is silent as it advances.
          </p>
        </div>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <p className="t-small" style={{ margin: 0, lineHeight: 1.6 }}>
            <strong>role="progressbar"</strong> is set on every form. Determinate bars expose{' '}
            <Mono>aria-valuenow</Mono>, <Mono>aria-valuemin={'{0}'}</Mono>, and{' '}
            <Mono>aria-valuemax={'{100}'}</Mono> so screen readers announce the percentage.{' '}
            <Mono>aria-valuetext</Mono> accepts a human string (e.g. "6 of 12 steps") when a raw
            percentage would be confusing.
          </p>
        </div>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <p className="t-small" style={{ margin: 0, lineHeight: 1.6 }}>
            <strong>Indeterminate mode</strong> omits <Mono>aria-valuenow</Mono> (per ARIA spec)
            and sets <Mono>aria-busy="true"</Mono> on the progressbar element. Screen readers
            announce the region as "busy" and will re-read the label when the bar becomes
            determinate.
          </p>
        </div>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <p className="t-small" style={{ margin: 0, lineHeight: 1.6 }}>
            <strong>Labels.</strong> Always pass <Mono>aria-label</Mono> or <Mono>label</Mono>
            {' '}(which sets the visible head and the accessible name). A nameless progressbar is
            useless to screen readers. If the label is rendered elsewhere in the page, use{' '}
            <Mono>aria-labelledby</Mono> pointing at that element's id.
          </p>
        </div>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <p className="t-small" style={{ margin: 0, lineHeight: 1.6 }}>
            <strong>Contrast.</strong> Ember fill (#FF6B35) on the default surface-hover track
            meets WCAG 3:1 non-text contrast. Status fills (success/warning/danger) are validated
            against both light and dark surfaces. No text sits directly on a colored fill.
          </p>
        </div>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <p className="t-small" style={{ margin: 0, lineHeight: 1.6 }}>
            <strong>Reduced motion.</strong> No information is carried by motion — the bar
            conveys progress through the value alone, so it always reads when paired with a
            visible percentage. Under <Mono>prefers-reduced-motion: reduce</Mono> the{' '}
            <Mono>.prog-*</Mono> block stops every looping affordance (indeterminate sweep,
            segmented shimmer, striped scroll, circular rotate) and the value tweens, so the
            determinate fill and ring <em>snap</em> to their final width/offset — progress is
            communicated without any movement.
          </p>
        </div>
      </div>
      <Frame
        label="role=progressbar + aria-* — legible to screen readers"
        code={`<Progress
  value={64}
  aria-label="Building identity-svc"
/>

{/* Indeterminate — omit value */}
<Progress
  aria-label="Connecting to provider"
/>`}
      >
        <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Progress value={64} label="Building identity-svc" />
          <Progress label="Connecting to provider" />
        </div>
      </Frame>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — bar fills from the trailing (left) edge'}
        code={`<div dir="rtl">
  <Progress value={64} label="جاري بناء identity-svc"/>
</div>`}
      >
        <div dir="rtl" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 460 }}>
          <Progress value={64} label="جاري بناء identity-svc" sub="تجميع ثنائيات Go" />
          <Progress value={92} status="success" label="اكتمل النسخ الاحتياطي" sub="٢١ غيغابايت" />
          <Progress label="جارٍ الاتصال بمزود الخدمة" />
          <Progress
            segments={['بناء', 'اختبار', 'كناري', 'حلقة ٣', 'حلقة ٤']}
            activeSegment={2}
            label="حلقة النشر"
            sub="الخطوة ٣ من ٥"
          />
        </div>
      </Frame>
      <Lede>
        Width is non-directional, so the bar naturally fills from the trailing (left) edge under{' '}
        <Mono>dir="rtl"</Mono> — exactly how Arabic readers expect "more" to grow. The indeterminate
        keyframe is mirrored (<Mono>prog-indeterminate-rtl</Mono>) so the wash also tracks reading
        direction. The buffer layer uses <Mono>inset-inline-start</Mono> so it anchors correctly
        in both directions.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 460 }} aria-hidden="true">
              <Progress value={64} label="building identity-svc" sub="compiling Go binaries" size="md" />
              {/* Leader lines */}
              <span className="lead h" style={{ top: 8, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 8, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: 110, height: 18 }} />
              <span className="lead v" style={{ bottom: -22, left: '34%', height: 18 }} />
              <span className="lead h" style={{ bottom: 0, right: -28, width: 24 }} />
              {/* Pins */}
              <div className="pin" style={{ top: 0, left: -52 }}>1</div>
              <div className="pin" style={{ top: 0, right: -52 }}>2</div>
              <div className="pin" style={{ bottom: -42, left: 110, transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ bottom: -42, left: '34%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: -8, right: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '72px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Label.</b> Geist Sans, weight 500, <Mono>--text-sm</Mono>. Verb-first ("Building", "Uploading"), with an optional muted sub-label after an em-dash.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Percentage.</b> Geist Mono, <Mono>--text-xs</Mono>, muted, with <Mono>tnum</Mono> so the digits hold their column and don't jitter as the value changes.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Track.</b> <Mono>--surface-hover</Mono> with a full pill radius. Height follows <Mono>size</Mono> — 2 / 4 / 6 / 10px for xs / sm / md / lg; <Mono>sm</Mono> is the default (this diagram shows <Mono>md</Mono>).</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Fill.</b> Ember by default. Width transitions 800ms with <Mono>--ease</Mono> so updates feel committed, not jumpy.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Trailing edge.</b> Where the bar ends — the eye lands here. Animate towards completion, never backwards.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — show the percentage</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Progress value={64} label="Building identity-svc" />
          </div>
          <div className="note">A bar without a number forces the user to estimate. The percent makes "is it stuck?" answerable.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — hide the number behind hover</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Progress value={64} aria-label="Building" />
          </div>
          <div className="note">If the data exists, surface it. Hover-only progress is hostile on touch and assistive tech.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — determinate when measurable</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Progress value={42} label="Encrypting backup" sub="9 GB of 21 GB" />
          </div>
          <div className="note">Counts and totals make a bar honest. The user trusts the bar more than reassuring copy.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — indeterminate as a default</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Progress label="Encrypting backup" />
          </div>
          <div className="note">The same upload, with measurement removed. Reads as "stuck" within seconds.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — match status to outcome</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Progress value={100} status="success" label="Build passed" sub="all 142 tests" />
          </div>
          <div className="note">A finished bar should switch to its outcome tone. "100% ember" reads as still-running.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — animate backwards</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Progress value={48} label="Build retried" sub="restarted from 0%" />
          </div>
          <div className="note">If a job restarts, jump-cut to 0 (no transition) — don't shrink the bar visibly. Reverse motion reads as "rolled back".</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — segmented for named phases</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Progress
              segments={['Build', 'Test', 'Canary', 'Ring 3', 'Ring 4']}
              activeSegment={2}
              label="Deploy ring 2"
              sub="step 3 of 5"
            />
          </div>
          <div className="note">Discrete phases get discrete segments. The user reads "which phase" and "how many left" in one glance.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — pile multiple bars per row</div>
          <div className="body" style={{ flexDirection: 'column', gap: 6 }}>
            <Progress value={42} size="xs" label="CPU" />
            <Progress value={67} size="xs" label="Memory" />
            <Progress value={88} size="xs" label="Disk" />
            <Progress value={31} size="xs" label="Network" />
          </div>
          <div className="note">Four bars stacked competes with a sparkline or gauge. If you need to compare metrics, those primitives read faster.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="ProgressProps">API reference</SubHead>
      <AutoPropsTable component="Progress" label="<Progress />" />
    </Section>
  );
}
