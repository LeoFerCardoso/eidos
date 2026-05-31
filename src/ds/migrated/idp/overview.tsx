'use client';
// Forge IDP — Overview. Introduction-style landing; the hero shows the platform LIVE:
// a real service card (the detailed recipe — header health, latency spark, team footer)
// over a deploy pipeline that advances build → test → deploy → done, the same "make the
// platform legible while it works" thesis the AI overview argues with its streaming hero.
import * as React from 'react';
import { DsOverview } from '@/components/docs';
import { ServiceCard, Pipeline, MOCKS, Icons } from '@/ds/core';

const svc0 = (MOCKS.SERVICES || [])[0];
const PEOPLE = MOCKS.PEOPLE || [];
// ServiceCard footer reads a TEAM, not one owner — pass real contributors so the
// AvatarGroup (3 + overflow counter) renders instead of being silently dropped.
const TEAM = [
  { name: PEOPLE[1]?.name || 'Camila Tanaka', initials: PEOPLE[1]?.initials || 'CT', ember: true },
  { name: PEOPLE[0]?.name || 'Leonardo Cardoso', initials: PEOPLE[0]?.initials || 'LC' },
  { name: PEOPLE[4]?.name || 'Thiago Albuquerque', initials: PEOPLE[4]?.initials || 'TA' },
  { name: PEOPLE[7]?.name || 'Larissa Fontana', initials: PEOPLE[7]?.initials || 'LF' },
];
// p95 latency series for the detailed-variant sparkline (ms, last 24h).
const LATENCY = [188, 174, 162, 159, 171, 148, 152, 139, 144, 138, 142];

// The deploy advances stage-by-stage; each frame is the canonical step model the
// Pipeline component renders. The last frame settles on a fully-shipped build.
const FRAMES: { id: string; label: string; status: string; meta: string }[][] = [
  [
    { id: 'build', label: 'Build', status: 'running', meta: '0:31' },
    { id: 'test', label: 'Test', status: 'pending', meta: 'queued' },
    { id: 'deploy', label: 'Deploy', status: 'pending', meta: 'queued' },
  ],
  [
    { id: 'build', label: 'Build', status: 'done', meta: '48s' },
    { id: 'test', label: 'Test', status: 'running', meta: '1:08' },
    { id: 'deploy', label: 'Deploy', status: 'pending', meta: 'queued' },
  ],
  [
    { id: 'build', label: 'Build', status: 'done', meta: '48s' },
    { id: 'test', label: 'Test', status: 'done', meta: '92s' },
    { id: 'deploy', label: 'Deploy', status: 'running', meta: '25%' },
  ],
  [
    { id: 'build', label: 'Build', status: 'done', meta: '48s' },
    { id: 'test', label: 'Test', status: 'done', meta: '92s' },
    { id: 'deploy', label: 'Deploy', status: 'done', meta: '4.18.2' },
  ],
];

// Honour prefers-reduced-motion in JS — the CSS guard only freezes the running
// halo, not the frame loop. When reduced motion is requested we render the final
// fully-deployed frame statically: no interval, no perpetual re-run.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

function IdpHero() {
  const reduced = usePrefersReducedMotion();
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    if (reduced) { setFrame(FRAMES.length - 1); return; }
    const advance = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, 1600);
    return () => clearInterval(advance);
  }, [reduced]);

  const steps = FRAMES[frame];
  const shipped = steps[steps.length - 1].status === 'done';

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', width: '100%' }}>
      {svc0 ? (
        React.createElement(ServiceCard as any, {
          service: svc0,
          variant: 'detailed',
          sparkSeries: LATENCY,
          contributors: TEAM,
        })
      ) : null}
      <div className="surface" style={{ padding: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          <span className="t-mono-label">Deploy pipeline</span>
          <span
            className="t-mono-label"
            aria-live="polite"
            style={{ color: shipped ? 'var(--success)' : 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}
          >
            {shipped ? 'shipped' : 'in flight'}
          </span>
        </div>
        <div style={{ marginBlockStart: 'var(--space-3)' }}>
          <Pipeline variant="stepper" steps={steps} />
        </div>
      </div>
    </div>
  );
}

const BLOCKS: [string, string][] = [
  ['data-table', 'Data table'], ['pipeline', 'Pipeline'], ['log-viewer', 'Log viewer'], ['diff-viewer', 'Diff viewer'],
  ['filter-panel', 'Filter panel'], ['json-inspector', 'JSON inspector'], ['ring-bar', 'Ring bar'], ['timeline', 'Timeline'], ['tree-view', 'Tree view'],
];
const D: Record<string, string> = {
  'data-table': 'Sort, filter, paginate, select.', pipeline: 'Stage graph with live status.', 'log-viewer': 'Streamed, filterable logs.',
  'diff-viewer': 'Side-by-side / unified diffs.', 'filter-panel': 'Faceted query builder.', 'json-inspector': 'Collapsible JSON tree.',
  'ring-bar': 'Canary → 100% rollout bar.', timeline: 'Chronological event rail.', 'tree-view': 'Nested hierarchy.',
  'agent-card': 'Agent catalog tile.', 'metric-card': 'KPI tile — Card + Trend + Sparkline.', 'score-gauge': 'Health / risk gauge.', 'service-card': 'Catalog service tile.',
};

export default function IdpOverview() {
  return (
    <DsOverview
      eyebrow="Forge / IDP"
      title="Run the platform."
      lede="The mid-level compositions a Backstage-class internal developer platform needs — data tables, pipelines, log and diff viewers, service and score cards — assembled entirely from core primitives, ready to drop into a console."
      hero={{
        eyebrow: 'Blocks · Elements · screens',
        heading: 'Platform surfaces, pre-baked.',
        subtitle: 'Tables, pipelines, cards — from core primitives.',
        body: 'A service card is a Card + Pill + Avatar + Sparkline; a pipeline is a stage graph over status tokens. Forge IDP codifies the compositions that repeat across a developer platform so every console reads the same.',
        actions: (
          <>
            <a className="btn ember" href="/idp/data-table">Browse blocks <Icons.arrowRight size={14} /></a>
            <a className="btn ghost" href="/example/service-catalog">See a console</a>
          </>
        ),
        visual: <IdpHero />,
      }}
      principlesTitle="Principles"
      principles={[
        { t: 'Compose, never reinvent', d: 'Every block is a documented arrangement of core primitives — promoted only once the pattern repeats across surfaces.' },
        { t: 'Dense but calm', d: 'Tables, logs, and pipelines pack data; hairlines and one ember keep them legible at a glance, not crowded.' },
        { t: 'Owned, not imported', d: 'Copy a block into your console and edit it. There is no black-box dependency between you and a layout change.' },
      ]}
      tilesTitle="Blocks"
      tiles={BLOCKS.map(([slug, label]) => ({ href: `/idp/${slug}`, label, desc: D[slug] }))}
      footer={{
        title: 'Elements & example screens',
        body: 'Card recipes (service / metric / score / agent) and full IDP screens are one click away.',
        actions: <a className="btn" href="/example/service-detail">Service detail <Icons.arrowRight size={14} /></a>,
      }}
    />
  );
}
