'use client';
// Forge Charts — Overview. Introduction-style landing; the hero shows real charts.
import { DsOverview } from '@/components/docs';
import { Sparkline, Trend, ScoreGauge, Icons } from '@/ds/core';

const WEEK = [180, 205, 240, 232, 268, 290, 318];
// Deploys by tribe (last 7 days). Delta peaks — the bar chart, the inline label and the aria-label all say so.
const TRIBES: { name: string; deploys: number; pct: number }[] = [
  { name: 'Atlas', deploys: 50, pct: 62 },
  { name: 'Beacon', deploys: 71, pct: 88 },
  { name: 'Cobalt', deploys: 44, pct: 54 },
  { name: 'Delta', deploys: 81, pct: 100 },
  { name: 'Echo', deploys: 59, pct: 73 },
  { name: 'Forge', deploys: 33, pct: 41 },
  { name: 'Grove', deploys: 65, pct: 80 },
];
const PEAK = TRIBES.reduce((a, b) => (b.deploys > a.deploys ? b : a));

function ChartsHero() {
  return (
    <div style={{ display: 'grid', gap: 10, width: '100%' }}>
      <div className="surface" style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span className="t-mono-label">Deploys / week</span>
          <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>318</span>
            <Trend delta={9} unit="%" />
          </span>
        </div>
        <div style={{ marginTop: 8 }}><Sparkline data={WEEK} w={320} h={44} color="var(--ember)" /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10 }}>
        <div className="surface" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span className="t-mono-label">Deploys by tribe</span>
            {/* The chart states its own peak — the honest-encoding thesis, in words next to the bar. */}
            <span className="t-mono-label" style={{ color: 'var(--ember-text)', fontVariantNumeric: 'tabular-nums' }}>{PEAK.name} {PEAK.deploys}</span>
          </div>
          {/* Hand-rolled bar stack carries data, so it gets a text alternative for AT. */}
          <div
            role="img"
            aria-label={`Deploys by tribe over the last 7 days, ${TRIBES.length} tribes. Peak is ${PEAK.name} at ${PEAK.deploys} deploys; lowest is ${TRIBES.reduce((a, b) => (b.deploys < a.deploys ? b : a)).name}.`}
            style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64, marginTop: 12 }}
          >
            {TRIBES.map((t) => (
              <div key={t.name} style={{ flex: 1, height: `${t.pct}%`, background: t.name === PEAK.name ? 'var(--ember)' : 'var(--viz-cat-2)', borderRadius: '3px 3px 0 0', opacity: t.name === PEAK.name ? 1 : 0.85 }} />
            ))}
          </div>
        </div>
        <div className="surface" style={{ padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span className="t-mono-label" style={{ alignSelf: 'flex-start' }}>DORA</span>
          <ScoreGauge variant="compact" value={86} min={0} max={100} label="Elite" />
        </div>
      </div>
    </div>
  );
}

const CHARTS: [string, string][] = [
  ['area', 'Area chart'], ['bar', 'Bar chart'], ['composed', 'Composed chart'], ['gauge', 'Gauge chart'],
  ['heatmap', 'Heatmap'], ['histogram', 'Histogram'], ['line', 'Line chart'], ['pie', 'Pie chart'],
  ['radar', 'Radar chart'], ['radial', 'Radial chart'], ['sankey', 'Sankey diagram'],
];
const DESC: Record<string, string> = {
  area: 'Trend over time with a filled body.', bar: 'Compare discrete buckets — the most precise read.',
  composed: 'Bars + lines on shared axes.', gauge: 'A single value against a target arc.',
  heatmap: 'Density across two dimensions.', histogram: 'Distribution of one variable.',
  line: 'Continuous trend, multiple series.', pie: 'Parts of a whole (≤5 slices).',
  radar: 'Multi-axis profile comparison.', radial: 'Progress as a ring.', sankey: 'Flow between stages.',
};

export default function ChartsOverview() {
  return (
    <DsOverview
      eyebrow="Forge / Charts"
      title="See the data."
      lede="Recharts wrapped in Forge tokens. Every chart reads the same --viz-* palette, the mono axis font, and the one ember accent — so a dashboard built from a dozen of them looks like one product, not twelve widgets."
      hero={{
        eyebrow: 'Recharts · themed · responsive',
        heading: 'Honest encodings, calm surfaces.',
        subtitle: 'Recharts, dressed in Forge tokens.',
        body: 'Bars for comparison, lines for trend, gauges for a single number against a target. Forge picks the encoding the eye reads fastest and tints it with the platform palette — never decoration for its own sake.',
        actions: (
          <>
            <a className="btn ember" href="/charts/bar">Browse charts <Icons.arrowRight size={14} /></a>
            <a className="btn ghost" href="/charts/heatmap">Heatmap</a>
          </>
        ),
        visual: <ChartsHero />,
      }}
      principlesTitle="Principles"
      principles={[
        { t: 'Honest encoding', d: 'Bar length, line slope, arc fill — pick the channel the eye decodes most accurately for the question being asked.' },
        { t: 'One palette', d: 'All series draw from --viz-cat-1..12; categorical stays categorical, sequential ramps one hue. Never hand-pick hex.' },
        { t: 'Calm by default', d: 'Hairline grid, mono axes, tabular numerals, no chart-junk. The data is the only thing that should move.' },
      ]}
      tilesTitle="The charts"
      tiles={CHARTS.map(([slug, label]) => ({ href: `/charts/${slug}`, label, desc: DESC[slug] }))}
      footer={{
        title: 'Building a dashboard?',
        body: 'Compose Metric cards and Score gauges from Forge IDP around these charts.',
        actions: <a className="btn" href="/idp/overview">Forge IDP <Icons.arrowRight size={14} /></a>,
      }}
    />
  );
}
