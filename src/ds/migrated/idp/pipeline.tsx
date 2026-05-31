'use client';
// Eidos DS — Components / Pipeline
// Two horizontal visual variants for build → test → deploy flow:
//   stepper · chevron
// For top-down (vertical) sequences, use <Timeline/> instead.
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Pipeline, Lede, Mono } from '@/ds/core';


const STEPS = [
  { id: 'checkout', label: 'Checkout',   status: 'done',    meta: '2.1s' },
  { id: 'build',    label: 'Build',      status: 'done',    meta: '48s' },
  { id: 'test',     label: 'Test',       status: 'done',    meta: '92s' },
  { id: 'sast',     label: 'SAST',       status: 'running', meta: 'scanning' },
  { id: 'canary',   label: 'Canary',     status: 'pending', meta: '—' },
  { id: 'promote',  label: 'Promote',    status: 'pending', meta: '—' },
];
const FAILED = STEPS.map((s, i) => i === 3 ? { ...s, status: 'error', meta: 'CVE-2024-xxxx' }
                                            : i > 3 ? { ...s, status: 'skipped' } : s);

const USAGE = `import { Pipeline } from "@/components/forge/pipeline"

export function Demo() {
  return (
    <Pipeline
      variant="stepper"
      steps={[
        { id: "build", label: "Build", status: "done" },
        { id: "test",  label: "Test",  status: "running" },
        { id: "deploy",label: "Deploy",status: "pending" },
      ]}
    />
  )
}`;

export default function PipelinePage() {
  return (
    <Section id="pipeline" title="Pipeline" desc="Left-to-right tracker for a build → test → deploy run — the CI/CD bar on a deploy page, the inline status cell in a deploy table, the hero on a release dashboard. Two variants: stepper and chevron.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('pipeline')} ariaLabel="package manager"/>
      <Lede>One <Mono>steps</Mono> input drives both variants. The <Mono>status</Mono> of each step is mapped to a Eidos <Mono>--status-*</Mono> token — running pulses, done is green, error is red.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Stepper and chevron share one step model — each step&rsquo;s status maps to a Eidos status token. Compose one of the two variants instead of hand-drawing an arrow row, and reach for Timeline for vertical, time-ordered sequences.</Lede>
      <Frame label="stepper · default" code={USAGE}>
        <Pipeline steps={STEPS}/>
      </Frame>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>Variants</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="default · dot + label + dotted connector">Stepper</SubHead>
      <Frame label="happy path">
        <Pipeline variant="stepper" steps={STEPS}/>
      </Frame>
      <Frame label="failed at SAST · downstream skipped">
        <Pipeline variant="stepper" steps={FAILED}/>
      </Frame>
      <Frame label="compact · drops labels (for table cells)" row>
        <Pipeline variant="stepper" steps={STEPS} compact/>
      </Frame>

      <SubHead meta="chained arrows · pull-request-status feel">Chevron</SubHead>
      <Frame label="GitHub Actions / Argo CD flow">
        <Pipeline variant="chevron" steps={STEPS}/>
      </Frame>
      <Lede>Each chevron's tail is masked into the next one's head — no gap, no double border. The active cell gets ember tint; failed goes danger.</Lede>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The pipeline is a status display, not a control, so it stays out of the tab order by default — there is nothing to activate. When a step is wired to open its stage log, that step is the only focus stop in the strip: <Mono>Tab</Mono> moves to it, <Mono>Enter</Mono> or <Mono>Space</Mono> opens the log, and the dotted connectors between steps are decorative (<Mono>aria-hidden</Mono>) so they are never landed on.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The strip is an ordered list (<Mono>&lt;ol&gt;</Mono>); the status glyph is <Mono>aria-hidden</Mono>, so each step carries a visually-hidden name combining label and status — <Mono>&ldquo;SAST, running&rdquo;</Mono>. The in-flight step is marked <Mono>aria-current="step"</Mono>, and its status node is a polite <Mono>aria-live</Mono> region so the next stage is announced as the run advances, never as a silent colour change.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each step pairs its <Mono>--status-*</Mono> tint with a glyph and a text status — a check for done, a spinner for running, an x for error, a dash for skipped — so the run state reads in greyscale. Status colours and the labels on top meet AA against both the stepper dots and the chevron fills.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Density &amp; motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The compact (label-less) stepper keeps each dot at the minimum target and surfaces the label on hover/focus; an interactive step keeps a visible focus ring that the chevron mask does not clip. Under <Mono>prefers-reduced-motion: reduce</Mono> the running step&rsquo;s ember halo stops pulsing and rests as a static ember ring — the in-flight step still reads, without motion.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — step order reads right-to-left; labels and meta align to the inline-start (right) edge'>
        <div dir="rtl">
          <Pipeline variant="stepper" steps={[
            { id: 'checkout', label: 'سحب الكود',  status: 'done',    meta: '2.1s' },
            { id: 'build',    label: 'بناء',        status: 'done',    meta: '48s' },
            { id: 'test',     label: 'اختبار',      status: 'running', meta: 'جارٍ' },
            { id: 'deploy',   label: 'نشر',         status: 'pending', meta: '—' },
          ]}/>
        </div>
      </Frame>
      <Lede>
        Under <Mono>dir="rtl"</Mono> the stepper reads right-to-left — step one anchors at the inline-start (right) edge and the strip progresses toward the left. Step labels and meta lines align from the right. The connector rail uses <Mono>border-inline-start</Mono> so it mirrors automatically. The ember running pulse and status icons are non-directional and stay as-is.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy — stepper variant</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Pipeline variant="stepper" steps={[
                { id: 'build', label: 'Build',  status: 'done',    meta: '48s' },
                { id: 'test',  label: 'Test',   status: 'running', meta: 'scanning' },
                { id: 'deploy',label: 'Deploy', status: 'pending', meta: '—' },
              ]}/>
              {/* pin 1 — step dot, above Build */}
              <span className="lead v" style={{ top: -26, left: 20, height: 20 }} />
              <div className="pin" style={{ top: -48, left: 20, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — status icon, above Test dot */}
              <span className="lead v" style={{ top: -26, left: 170, height: 20 }} />
              <div className="pin" style={{ top: -48, left: 170, transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — step label + meta, below Build label */}
              <span className="lead v" style={{ bottom: -26, left: 44, height: 20 }} />
              <div className="pin" style={{ bottom: -48, left: 44, transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — dotted connector rail, between Build and Test */}
              <span className="lead v" style={{ bottom: -26, left: 110, height: 20 }} />
              <div className="pin" style={{ bottom: -48, left: 110, transform: 'translateX(-50%)' }}>4</div>
              {/* pin 5 — ember halo pulse on the running step */}
              <span className="lead h" style={{ top: 10, right: -32, width: 28 }} />
              <div className="pin" style={{ top: 2, right: -56 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Step dot.</b> Coloured via <Mono>--status-done</Mono> (green), <Mono>--status-running</Mono> (ember), <Mono>--status-error</Mono> (red), or neutral for pending — the token, never a hard colour.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Status icon.</b> Check for done, spinner for running, x for error, dash for skipped — always paired with colour so state reads in greyscale. The glyph is <Mono>aria-hidden</Mono>; the step name spells out &ldquo;label, status&rdquo; and the in-flight step carries <Mono>aria-current="step"</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Label + meta.</b> Geist Sans 500/13 label above, Geist Mono muted meta (duration, scan result) below. <Mono>compact</Mono> mode drops both — dots only, for table cells.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Dotted connector rail.</b> A decorative <Mono>border-top: dashed</Mono> line at the dot centreline, skipped by assistive tech. Becomes a solid filled bar for the chevron variant.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Ember halo.</b> The running step grows a concentric ring — <Mono>var(--accent)</Mono> at 40% opacity — that pulses via <Mono>@keyframes</Mono>. Suppressed under <Mono>prefers-reduced-motion</Mono>.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pick the variant for the surface</div>
          <div className="body">
            <Pipeline variant="stepper" steps={STEPS} compact/>
          </div>
          <div className="note">Stepper for inline rows, chevron for hero / PR status bars. For vertical sequences use Timeline.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — invent a custom arrow row</div>
          <div className="body" style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>build → test → … → ship</div>
          <div className="note">Hand-drawn arrows re-derive bugs we've already fixed. Compose one of the two variants.</div>
        </div>
      </div>

      <SubHead meta="PipelineProps">API reference</SubHead>
      {/* Generated from the typed Pipeline props (scripts/gen-props.mjs) — can't drift from the component. */}
      <AutoPropsTable component="Pipeline" label="<Pipeline />"/>
      <Lede><b style={{color:'var(--fg)'}}>Step.status:</b> <Mono>"done"</Mono>, <Mono>"running"</Mono>, <Mono>"pending"</Mono>, <Mono>"error"</Mono>, <Mono>"skipped"</Mono> — mapped to <Mono>--status-*</Mono> tokens.</Lede>
    </Section>
  );
}
