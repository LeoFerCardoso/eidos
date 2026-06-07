'use client';
// Forge — AI-Insights command center. Not a list: a visual intelligence surface
// the forge agent maintains by watching every PR, deploy and inter-service call.
// Panels: an auto-generated architecture graph + a live architectural-drift feed
// (the hero), then the horizon-triaged risk radar. Equifax/Boa Vista domain data;
// composed from Eidos DS primitives + the shared .fp-insight-* recipe.
import * as React from 'react';
import Link from 'next/link';
import {
  AILabel,
  AILabelWithPopover,
  Button,
  Carousel,
  CarouselSlide,
  CarouselControls,
  CarouselDots,
  CountUp,
  Icons,
  Pill,
  Select,
} from '@/ds/core';
import { FPageHeader, FCardHead } from '@/portal/shell/portal-shell';
import { TRIBES } from '@/portal/data/services';
import {
  INSIGHTS,
  OPEN_INSIGHTS,
  type Insight,
  type InsightType,
  type Autonomy,
  type InsightSeverity,
} from '@/portal/data/agent-activity';
import { ARCH_MERMAID } from '@/portal/data/architecture';
import { ADRS, SIGNALS, COMPARATIVE_CARDS } from '@/portal/data/insights-panels';

// ── readout maps (mirror the Home's, scoped to this page) ───────────────────────
const INSIGHT_ICON: Record<InsightType, keyof typeof Icons> = {
  slo: 'slo',
  spof: 'gitFork',
  drift: 'branch',
  lgpd: 'lockKey',
  scaling: 'trending',
  security: 'shield',
};
const TYPE_LABEL: Record<InsightType, string> = {
  slo: 'SLO', spof: 'SPOF', drift: 'Drift', lgpd: 'LGPD', scaling: 'Scaling', security: 'Security',
};
// agent-can-resolve is "nothing for you to do" → quiet neutral pill; colour is
// reserved for the rows that actually need a human (needs-ok, arch call).
const AUTONOMY: Record<Autonomy, { label: string; tone: 'neutral' | 'ember' | 'warning' }> = {
  'agent-can-resolve': { label: 'Agent can resolve', tone: 'neutral' },
  'needs-ok': { label: 'Needs your OK', tone: 'ember' },
  'needs-arch-decision': { label: 'Architecture call', tone: 'warning' },
};
const SEV_LABEL: Record<InsightSeverity, string> = { crit: 'Critical', high: 'High', med: 'Medium' };

const adrLevel = (a: number) => (a >= 90 ? 'hi' : a >= 70 ? 'mid' : 'lo');

function horizonUrgency(weeks: number): 'hot' | 'warm' | 'cool' {
  if (weeks <= 2) return 'hot';
  if (weeks <= 4) return 'warm';
  return 'cool';
}

// Horizon triage buckets (most urgent first).
const BUCKETS: { key: string; label: string; match: (w: number) => boolean }[] = [
  { key: 'now', label: 'Now', match: (w) => w === 0 },
  { key: '2wk', label: 'Within 2 weeks', match: (w) => w >= 1 && w <= 2 },
  { key: '4wk', label: 'Within 4 weeks', match: (w) => w >= 3 && w <= 4 },
  { key: 'later', label: 'Later', match: (w) => w >= 5 },
];

const ALL = 'All';

// ── Mermaid diagram (transparent, client-only — Mermaid touches the DOM) ────────
// Mermaid's API holds GLOBAL state, so two concurrent renders (React StrictMode's
// dev double-invoke, carousel remounts, HMR) corrupt each other and leave a blank
// slide. We therefore (a) initialise once and (b) serialise every render through a
// module-level promise chain, with a fresh id per call.
let mmdInit = false;
let mmdCount = 0;
let mmdChain: Promise<void> = Promise.resolve();

function MermaidViz({ chart }: { chart: string }) {
  const [svg, setSvg] = React.useState<string | null>(null);
  React.useEffect(() => {
    let active = true;
    const rid = 'fp-mmd-' + (++mmdCount);
    mmdChain = mmdChain.then(async () => {
      if (!active) return;
      try {
        const m = (await import('mermaid')).default;
        if (!mmdInit) {
          m.initialize({
            startOnLoad: false,
            theme: 'base',
            securityLevel: 'loose',
            themeVariables: {
              background: 'transparent',
              primaryColor: 'rgba(255,255,255,0.04)',
              primaryBorderColor: 'rgba(255,255,255,0.28)',
              primaryTextColor: '#F2EEE8',
              lineColor: 'rgba(255,255,255,0.32)',
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
              fontSize: '12px',
            },
          });
          mmdInit = true;
        }
        const r = await m.render(rid, chart);
        if (active) setSvg(r.svg);
      } catch {
        if (active) setSvg(null);
      }
    });
    return () => { active = false; };
  }, [chart]);
  return svg ? (
    <div className="fp-mermaid" role="img" aria-label="Service architecture diagram" dangerouslySetInnerHTML={{ __html: svg }} />
  ) : (
    <div className="fp-mermaid" aria-hidden="true" />
  );
}

// ── Metric tile — label · value · delta · caption + a mini bar chart ────────────
function MiniBars({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const n = data.length;
  return (
    <span className="fp-mbars" aria-hidden="true">
      {data.map((v, i) => (
        <span
          key={i}
          className="fp-mbar"
          style={{ blockSize: `${Math.max(10, (v / max) * 100)}%`, opacity: 0.4 + 0.6 * (i / (n - 1)) } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

function MetricTile({ label, to, delta, good, cap, bars }: {
  label: string; to: number; delta: string; good: boolean; cap: React.ReactNode; bars: number[];
}) {
  return (
    <div className="fp-mkpi">
      <div className="fp-mkpi-main">
        <div className="fp-mkpi-label">{label}</div>
        <div className="fp-mkpi-valrow">
          <span className="fp-mkpi-value"><CountUp to={to} /></span>
          <span className={`fp-mkpi-delta ${good ? 'is-up' : 'is-down'}`}>{delta}</span>
        </div>
        <div className="fp-mkpi-cap">{cap}</div>
      </div>
      <MiniBars data={bars} />
    </div>
  );
}

// ── Compact slide viz (custom SVG, narrow-column friendly) ──────────────────────
// Semicircle arc gauge (Gauges/Arcs format).
function ArcGauge({ pct, caption }: { pct: number; caption: string }) {
  const r = 78, cx = 100, cy = 96, circ = Math.PI * r;
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <div className="fp-arc">
      <svg viewBox="0 0 200 110" className="fp-arc-svg" aria-hidden="true">
        <path d={d} className="fp-arc-track" />
        <path d={d} className="fp-arc-fill" style={{ strokeDasharray: circ, strokeDashoffset: circ * (1 - pct / 100) } as React.CSSProperties} />
      </svg>
      <div className="fp-arc-center">
        <span className="fp-arc-val">{pct}<i>%</i></span>
        <span className="fp-arc-cap">{caption}</span>
      </div>
    </div>
  );
}

// Big area trend with a headline number (Area format).
function AreaViz({ data, big, unit }: { data: number[]; big: string; unit?: string }) {
  const w = 320, h = 96, max = Math.max(...data), min = Math.min(...data), span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 6 - ((v - min) / span) * (h - 14)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <div className="fp-aviz">
      <div className="fp-aviz-big">{big}{unit && <i>{unit}</i>}</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="fp-aviz-svg" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="aviz-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--ember)" stopOpacity="0.32" /><stop offset="1" stopColor="var(--ember)" stopOpacity="0" /></linearGradient></defs>
        <path d={`${line} L ${w} ${h} L 0 ${h} Z`} fill="url(#aviz-g)" />
        <path d={line} fill="none" stroke="var(--ember)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

// Radar over a few estate dimensions (Radar format).
function RadarViz({ axes }: { axes: { label: string; value: number }[] }) {
  const n = axes.length, cx = 110, cy = 104, R = 78;
  const pt = (i: number, rad: number): [number, number] => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
  };
  const ring = (f: number) => axes.map((_, i) => pt(i, R * f).join(',')).join(' ');
  const poly = axes.map((ax, i) => pt(i, (R * ax.value) / 100).join(',')).join(' ');
  return (
    <svg viewBox="0 0 220 208" className="fp-rviz" aria-hidden="true">
      {[0.34, 0.67, 1].map((f) => <polygon key={f} points={ring(f)} className="fp-rviz-grid" />)}
      {axes.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="fp-rviz-spoke" />; })}
      <polygon points={poly} className="fp-rviz-area" />
      {axes.map((ax, i) => { const [x, y] = pt(i, R + 16); return <text key={i} x={x} y={y} className="fp-rviz-label">{ax.label}</text>; })}
    </svg>
  );
}

// Flickering-grid texture for the banner (à la magicui FlickeringGrid). A regular
// grid of small SQUARES — the COLOUR lives only in the squares (each is painted
// from the ember gradient, gradientUnits=userSpaceOnUse → samples its position)
// over a neutral banner surface. ~40% of cells flicker independently via a CSS
// animation whose delay/duration is seeded per cell (deterministic → SSR-stable,
// no hydration drift, no Math.random). slice + xMax anchor keep the cells square
// at any banner width and the dense ember end pinned to the inline-end. The mask
// fades the grid out before the copy. Reduced-motion freezes it (CSS).
function BannerMosaic() {
  const SQ = 4, PITCH = 7; // squareSize 4, gap 3 → dense
  const COLS = 176, ROWS = 12;
  const W = COLS * PITCH, H = ROWS * PITCH; // content fills the viewBox exactly → no right-edge gap
  const rnd = (c: number, r: number) => {
    const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const rects: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const colF = c / (COLS - 1);
      // full-width opacity ramp: darker on the inline-start, brighter toward the end.
      const mx = (0.08 + colF * 0.78) * (0.55 + rnd(c + 13, r + 7) * 0.45);
      const flick = rnd(c, r) > 0.64; // ~36% of cells flicker
      const delay = (rnd(c + 5, r + 9) * 2.6).toFixed(2);
      const dur = (0.9 + rnd(c + 7, r + 3) * 1.7).toFixed(2); // faster → more marked
      rects.push(
        <rect
          key={`${c}-${r}`}
          x={c * PITCH} y={r * PITCH} width={SQ} height={SQ} rx={0.8}
          opacity={Number(mx.toFixed(3))}
          className={flick ? 'fp-flick' : undefined}
          style={flick ? ({ animationDelay: `${delay}s`, animationDuration: `${dur}s`, '--mx': mx.toFixed(3) } as React.CSSProperties) : undefined}
        />,
      );
    }
  }
  return (
    <svg className="fp-ai-banner-mosaic" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        {/* Theme accent gradient (ember scale), corner to corner. Bound to the
            theme tokens via style so it follows the active theme. */}
        <linearGradient id="fp-banner-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2={H}>
          <stop offset="0%" style={{ stopColor: 'var(--ember-deep)' }} />
          <stop offset="50%" style={{ stopColor: 'var(--ember)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--ember-glow)' }} />
        </linearGradient>
      </defs>
      <g fill="url(#fp-banner-grad)">{rects}</g>
    </svg>
  );
}

// ── Dismissible intro banner (session-only → always shows on refresh) ────────────
function InsightsBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;
  return (
    <div className="fp-ai-banner" role="note">
      <BannerMosaic />
      <span className="fp-ai-banner-spark" aria-hidden="true"><Icons.sparkles size={28} /></span>
      <div className="fp-ai-banner-text">
        <strong className="fp-ai-banner-title">Forge AI is watching your estate</strong>
        <p className="fp-ai-banner-desc">Every PR, deploy and inter-service call is analyzed for drift, risk and opportunity, surfaced right here as it happens.</p>
      </div>
      <button type="button" className="fp-ai-banner-close" onClick={() => setDismissed(true)} aria-label="Dismiss banner">
        <Icons.x size={16} />
      </button>
    </div>
  );
}

export default function InsightsPage() {
  const [type, setType] = React.useState<string>(ALL);
  const [autonomy, setAutonomy] = React.useState<string>(ALL);
  const [tribe, setTribe] = React.useState<string>(ALL);

  const resolved = React.useMemo(() => INSIGHTS.filter((i) => i.status === 'resolved'), []);

  const filtered = React.useMemo(() => {
    return OPEN_INSIGHTS.filter(
      (i) =>
        (type === ALL || TYPE_LABEL[i.type] === type) &&
        (autonomy === ALL || AUTONOMY[i.autonomy].label === autonomy) &&
        (tribe === ALL || i.tribe === tribe),
    );
  }, [type, autonomy, tribe]);

  // Overview counts read the full open set, not the filtered view.
  const crit = OPEN_INSIGHTS.filter((i) => i.severity === 'crit').length;
  const high = OPEN_INSIGHTS.filter((i) => i.severity === 'high').length;
  const within30 = OPEN_INSIGHTS.filter((i) => i.weeks <= 4).length;
  const agentResolvable = OPEN_INSIGHTS.filter((i) => i.autonomy === 'agent-can-resolve').length;

  const typeOptions = [{ value: ALL, label: 'All types' }, ...(Object.keys(TYPE_LABEL) as InsightType[]).map((t) => ({ value: TYPE_LABEL[t], label: TYPE_LABEL[t] }))];
  const autonomyOptions = [{ value: ALL, label: 'All autonomy' }, ...Object.values(AUTONOMY).map((a) => ({ value: a.label, label: a.label }))];
  const tribeOptions = [{ value: ALL, label: 'All tribes' }, ...TRIBES.map((t) => ({ value: t, label: t }))];

  return (
    <>
      <FPageHeader
        eyebrow="PLATFORM INTELLIGENCE"
        title="AI-Insights"
        status={<Pill tone="ember" live>live · 0.4s lag</Pill>}
        subtitle="The forge agent watches every PR, deploy and inter-service call, and surfaces what humans miss."
      />

      <InsightsBanner />

      <div className="fp-ins-cols">
        {/* LEFT (2/3) — the insights radar */}
        <div className="fp-ins-left">
      {/* Filters — type · autonomy · tribe (horizon is the grouping axis). */}
      <div className="fp-toolbar" id="radar">
        <span className="fp-filter-select">
          <Select value={type} onValueChange={setType} options={typeOptions} width="150px" />
        </span>
        <span className="fp-filter-select">
          <Select value={autonomy} onValueChange={setAutonomy} options={autonomyOptions} width="180px" />
        </span>
        <span className="fp-filter-select">
          <Select value={tribe} onValueChange={setTribe} options={tribeOptions} width="170px" />
        </span>
        {(type !== ALL || autonomy !== ALL || tribe !== ALL) && (
          <Button variant="ghost" size="sm" className="fp-filter-clear" onClick={() => { setType(ALL); setAutonomy(ALL); setTribe(ALL); }}>
            <Icons.x size={13} /> Clear
          </Button>
        )}
        <span className="fp-radar-count">{filtered.length === OPEN_INSIGHTS.length ? `${filtered.length} risks` : `${filtered.length} of ${OPEN_INSIGHTS.length} risks`}</span>
      </div>

      {/* Triage — grouped by horizon, most urgent first. */}
      {filtered.length === 0 ? (
        <div className="fp-decide-clear">
          <Icons.check size={16} /> No open risks match these filters.
        </div>
      ) : (
        BUCKETS.map((b) => {
          const rows = filtered.filter((i) => b.match(i.weeks));
          if (rows.length === 0) return null;
          return (
            <section key={b.key} className="fp-radar-group">
              <div className="fp-radar-group-head">
                <span className={`fp-radar-bucket u-${horizonUrgency(b.key === 'now' ? 0 : b.key === '2wk' ? 2 : b.key === '4wk' ? 4 : 5)}`}>{b.label}</span>
                <span className="fp-radar-group-count">{rows.length}</span>
              </div>
              <div className="fp-insights">
                {rows.map((it) => (
                  <InsightRow key={it.id} it={it} />
                ))}
              </div>
            </section>
          );
        })
      )}

      {/* Resolved — what the fleet/humans already closed (trust + history). */}
      {resolved.length > 0 && (
        <section className="fp-radar-group fp-radar-resolved">
          <div className="fp-radar-group-head">
            <span className="fp-section-title" style={{ marginBlockEnd: 0 }}>
              <Icons.check size={13} /> Resolved · last 30 days
            </span>
            <span className="fp-radar-group-count">{resolved.length}</span>
          </div>
          <div className="fp-rows">
            {resolved.map((it) => {
              const Ico = Icons[INSIGHT_ICON[it.type]] || Icons.circle;
              return (
                <div key={it.id} className="fp-resolved-row">
                  <span className="fp-resolved-ico"><Ico size={14} /></span>
                  <span className="fp-resolved-title">{it.title}</span>
                  <span className="fp-resolved-meta"><AILabel variant="dot" size="sm" /> {it.resolvedBy} · {it.resolvedWhen}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
        </div>{/* /fp-ins-left */}

        {/* RIGHT (1/3) — carousels of big insights, metrics, signals, comparatives */}
        <aside className="fp-ins-right">
          {/* Big insights — 1 per view */}
          <section className="fp-rcar">
            <div className="fp-rcar-head"><span className="fp-section-title"><Icons.layers size={13} /> Big insights</span></div>
            <Carousel label="Big insights" opts={{ align: 'start' }}>
              {/* big formatted text — lead slide */}
              <CarouselSlide width="100%">
                <article className="fp-bslide fp-bslide--mesh">
                  <div className="fp-bslide-head"><span className="fp-bslide-eyebrow"><Icons.trending size={13} /> LEVERAGE</span><AILabel variant="box" size="sm" /></div>
                  <div className="fp-bslide-body fp-bslide-body--text">
                    <p className="fp-bigtext"><strong>Last month</strong>, automation saved your team <em>48.3 hours</em> of manual work.</p>
                  </div>
                  <p className="fp-bslide-foot">Across dep-bumps, test generation and CVE triage, up <strong>+22%</strong> month over month.</p>
                </article>
              </CarouselSlide>
              {/* arc gauge */}
              <CarouselSlide width="100%">
                <article className="fp-bslide">
                  <div className="fp-bslide-head"><span className="fp-bslide-eyebrow"><Icons.agent size={13} /> AUTONOMY</span><h3 className="fp-bslide-title">Agent autonomy this month</h3><AILabel variant="box" size="sm" /></div>
                  <div className="fp-bslide-body"><ArcGauge pct={78} caption="resolved by agents" /></div>
                  <p className="fp-bslide-foot">Agents resolved <strong>78%</strong> of your work, <em>1.4×</em> the alliance median. Your job was steering, not typing.</p>
                </article>
              </CarouselSlide>
              {/* 2 · area trend */}
              <CarouselSlide width="100%">
                <article className="fp-bslide">
                  <div className="fp-bslide-head"><span className="fp-bslide-eyebrow"><Icons.activity size={13} /> THROUGHPUT</span><h3 className="fp-bslide-title">Changes shipped · last 7 days</h3><AILabel variant="box" size="sm" /></div>
                  <div className="fp-bslide-body"><AreaViz data={[12, 15, 14, 18, 17, 22, 19, 24, 21, 27, 25, 31]} big="31" /></div>
                  <p className="fp-bslide-foot"><strong>31</strong> changes merged with <strong>0</strong> regressions, mostly dep-bumps, test-gen and CVE patches.</p>
                </article>
              </CarouselSlide>
              {/* 3 · ADR bars */}
              <CarouselSlide width="100%">
                <article className="fp-bslide">
                  <div className="fp-bslide-head"><span className="fp-bslide-eyebrow"><Icons.compliance size={13} /> GOVERNANCE</span><h3 className="fp-bslide-title">ADR adherence · 28 services</h3><AILabel variant="box" size="sm" /></div>
                  <div className="fp-bslide-body fp-bslide-body--list">
                    <div className="fp-adr-list">
                      {ADRS.slice(0, 4).map((adr) => (
                        <div key={adr.id} className="fp-adr">
                          <div className="fp-adr-top">
                            <Pill tone="ember">{adr.id}</Pill>
                            <span className="fp-adr-title">{adr.title}</span>
                            <span className="fp-adr-pct">{adr.adoption}%</span>
                          </div>
                          <span className="fp-adr-bar"><span className="fp-adr-fill" data-level={adrLevel(adr.adoption)} style={{ inlineSize: `${adr.adoption}%` } as React.CSSProperties} /></span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="fp-bslide-foot"><strong>82%</strong> on async-first; the <em>acerta → konduto</em> sync call is the active breach.</p>
                </article>
              </CarouselSlide>
              {/* 4 · radar */}
              <CarouselSlide width="100%">
                <article className="fp-bslide">
                  <div className="fp-bslide-head"><span className="fp-bslide-eyebrow"><Icons.gauge size={13} /> ESTATE HEALTH</span><h3 className="fp-bslide-title">Health across dimensions</h3><AILabel variant="box" size="sm" /></div>
                  <div className="fp-bslide-body"><RadarViz axes={[{ label: 'Coverage', value: 88 }, { label: 'SLO', value: 92 }, { label: 'Security', value: 81 }, { label: 'Tests', value: 86 }, { label: 'Docs', value: 64 }]} /></div>
                  <p className="fp-bslide-foot">Strong on <em>SLO</em> and coverage; <strong>Docs at 64%</strong> is the gap the agents are closing next.</p>
                </article>
              </CarouselSlide>
              {/* architecture (Mermaid diagram) */}
              <CarouselSlide width="100%">
                <article className="fp-bslide">
                  <div className="fp-bslide-head">
                    <span className="fp-bslide-eyebrow"><Icons.gitFork size={13} /> ARCHITECTURE</span>
                    <h3 className="fp-bslide-title">Live service graph</h3>
                    <AILabel variant="box" size="sm" />
                  </div>
                  <div className="fp-bslide-body fp-bslide-body--graph"><MermaidViz chart={ARCH_MERMAID} /></div>
                  <p className="fp-bslide-foot">Drift detected: <em>acerta → konduto</em> is a sync single point of failure for 4 services.</p>
                </article>
              </CarouselSlide>
              <CarouselControls />
              <CarouselDots />
            </Carousel>
          </section>

          {/* Metrics — 2 per view */}
          <section className="fp-rcar">
            <div className="fp-rcar-head"><span className="fp-section-title"><Icons.gauge size={13} /> Radar at a glance</span><AILabel variant="mark" size="sm" /></div>
            <Carousel label="Radar metrics" opts={{ align: 'start' }}>
              <CarouselSlide width="calc(50% - 6px)"><MetricTile label="Open risks" to={OPEN_INSIGHTS.length} delta="+2 wk" good={false} cap={`${crit} critical · ${high} high`} bars={[6, 7, 6, 8, 7, 9, 10]} /></CarouselSlide>
              <CarouselSlide width="calc(50% - 6px)"><MetricTile label="Within 30 days" to={within30} delta="+1 wk" good={false} cap="acting window" bars={[5, 6, 6, 7, 7, 8, 8]} /></CarouselSlide>
              <CarouselSlide width="calc(50% - 6px)"><MetricTile label="Agent-resolvable" to={agentResolvable} delta="+1 wk" good cap="no human needed" bars={[1, 2, 2, 2, 3, 2, 3]} /></CarouselSlide>
              <CarouselSlide width="calc(50% - 6px)"><MetricTile label="Resolved · 30d" to={resolved.length} delta="+3 wk" good cap="by the fleet" bars={[0, 1, 1, 2, 2, 3, 3]} /></CarouselSlide>
              <CarouselControls />
              <CarouselDots />
            </Carousel>
          </section>

          {/* Signals — 1 per view */}
          <section className="fp-rcar">
            <div className="fp-rcar-head"><span className="fp-section-title"><Icons.activity size={13} /> Signals · last 24h</span></div>
            <Carousel label="Signals" opts={{ align: 'start' }}>
              {SIGNALS.map((s) => {
                const SIco = Icons[s.icon] || Icons.circle;
                return (
                  <CarouselSlide key={s.id} width="100%">
                    <div className="fp-sig">
                      <div className="fp-sig-top">
                        <span className={`fp-sig-badge u-${s.tone}`}><SIco size={12} /> {s.badge}</span>
                        <span className="fp-pr-when">{s.when}</span>
                      </div>
                      <div className="fp-sig-title">{s.title}</div>
                      <p className="fp-sig-detail">{s.detail}</p>
                      <div className="fp-pr-svc"><Icons.flame size={11} /> {s.target}</div>
                    </div>
                  </CarouselSlide>
                );
              })}
              <CarouselControls />
              <CarouselDots />
            </Carousel>
          </section>

          {/* Comparatives — 1 per view */}
          <section className="fp-rcar">
            <div className="fp-rcar-head"><span className="fp-section-title"><Icons.trending size={13} /> You vs your cohorts</span></div>
            <Carousel label="Comparatives" opts={{ align: 'start' }}>
              {COMPARATIVE_CARDS.map((card) => {
                const max = Math.max(...card.cohorts.map((c) => c.value));
                return (
                  <CarouselSlide key={card.key} width="100%">
                    <div className="fp-card fp-cmp">
                      <div className="fp-cmp-title">{card.title}</div>
                      <div className="fp-cmp-big">{card.big}</div>
                      <div className="fp-cmp-sub">{card.sub} <AILabel variant="mark" size="sm" /></div>
                      <div className="fp-cmp-bars">
                        {card.cohorts.map((c) => (
                          <div key={c.label} className={`fp-cmp-row${c.highlight ? ' is-you' : ''}`}>
                            <span className="fp-cmp-label">{c.label}</span>
                            <span className="fp-cmp-track"><span className="fp-cmp-fill" style={{ inlineSize: `${(c.value / max) * 100}%` } as React.CSSProperties} /></span>
                            <span className="fp-cmp-val">{c.display}</span>
                          </div>
                        ))}
                      </div>
                      <div className="fp-cmp-notes">
                        {card.notes.map((n) => (
                          <div key={n.label} className="fp-cmp-note">
                            <span className="fp-cmp-note-l">{n.label}</span>
                            <span className="fp-cmp-note-v">{n.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CarouselSlide>
                );
              })}
              <CarouselControls />
              <CarouselDots />
            </Carousel>
          </section>
        </aside>
      </div>{/* /fp-ins-cols */}
    </>
  );
}

function InsightRow({ it }: { it: Insight }) {
  const Ico = Icons[INSIGHT_ICON[it.type]] || Icons.circle;
  const a = AUTONOMY[it.autonomy];
  const sevColor = it.severity === 'crit' ? 'var(--danger)' : it.severity === 'high' ? 'var(--warning)' : 'var(--fg-muted)';
  return (
    <div className="fp-insight-row">
      <span className={`fp-insight-ico u-${it.type}`}><Ico size={17} /></span>
      <div className="fp-insight-body">
        <div className="fp-insight-top">
          <span className={`fp-insight-horizon u-${horizonUrgency(it.weeks)}`}>
            <Icons.clock size={11} /> {it.horizon}
          </span>
          <span className="fp-insight-title">{it.title}</span>
          <Pill tone={a.tone}>{a.label}</Pill>
        </div>
        <div className="fp-insight-meta">
          <span className="fp-insight-sev" style={{ color: sevColor } as React.CSSProperties}>{SEV_LABEL[it.severity]}</span>
          {' · '}{it.tribe}{' · '}{it.blastRadius}
        </div>
        <p className="fp-insight-desc">{it.evidence}</p>
        <div className="fp-insight-rem-row">
          <div className="fp-insight-rem">
            <AILabelWithPopover variant="dot" label="Proposed fix" model="eidos-ai/forge-agent" ts="moments ago" confidence={0.9}>The Forge agent drafted this remediation. Review the plan before steering.</AILabelWithPopover>
            <span>{it.remediation}</span>
          </div>
          <Link href={it.href} className="ds-link-inline fp-insight-steer">Steer<Icons.chevronRight size={12} /></Link>
        </div>
      </div>
    </div>
  );
}
