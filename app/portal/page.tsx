'use client';
// Forge — Home / mission control over an autonomous agent workforce.
//
// The Home is NOT a human inbox. Agents work 24x7 by default; the human is the
// director. Spine, ranked by how much it demands of you (Port's agentic model —
// "autonomy with auditability", governance via guardrails):
//   ① DECIDE  — the small set agents escalated because a GUARDRAIL fired (HITL).
//   ② STEER   — AI-Insights: deep architectural risk + agent-drafted remediation.
//   ③ OBSERVE — the agent workstream: what shipped, auditable + reversible.
// Built from Eidos DS primitives; the welcome hero above is unchanged.
import * as React from 'react';
import Link from 'next/link';
import {
  AILabel,
  Avatar,
  Button,
  CountUp,
  ForgeMark,
  HealthBadge,
  Icons,
  MetricCard,
  Pill,
} from '@/ds/core';
import { FPageHeader, IconBubble, FCardHead, FRows, FRow } from '@/portal/shell/portal-shell';
import { getService } from '@/portal/data/services';
import {
  SYSTEM_KPIS,
  DECISIONS,
  WORKSTREAM,
  WORKSTREAM_SUMMARY,
  OPEN_INSIGHTS,
  MY_SERVICES,
  gradeFor,
  type RiskLevel,
  type InsightType,
  type Autonomy,
  type WorkStatus,
  type Grade,
} from '@/portal/data/agent-activity';

// Doom-fire heat-simulation tunables for the welcome-hero background. No UI
// controls — these are the knobs: lateral wind, base combustion, cooling rate
// (flame height) and the frame cadence.
const FLAME = {
  WIND: -0.35,    // lateral drift: <0 leans toward inline-start, >0 inline-end
  FUEL: 0.95,     // combustion intensity at the base (0..1)
  COOLING: 0.14,  // decay per row: higher = shorter flames, lower = taller
  FRAME_MS: 55,   // ~18fps — a calm flicker, not a strobe
};

// Character-mosaic variant — faithful to the reference terminal-fire "density"
// mode: the heat field is rendered as the literal monospace ramp " ░ ▒ ▓ █"
// inside a <pre> (Geist Mono, tracking-widest, leading-none), NOT drawn squares.
// Grid (COLS×ROWS) is measured from the container + font metrics so the glyphs
// tile the whole hero. Colour is var(--ember) with a soft ember glow.
const FLAME_CHARS = [' ', '░', '▒', '▓', '█'];

function HeroFlameChars() {
  const ref = React.useRef<HTMLPreElement | null>(null);

  React.useEffect(() => {
    const pre = ref.current;
    if (!pre) return;
    const { WIND, FUEL, COOLING, FRAME_MS } = FLAME;

    let COLS = 0, ROWS = 0;
    let heat = new Float32Array(0);

    const measure = () => {
      const rect = pre.getBoundingClientRect();
      const cs = getComputedStyle(pre);
      const span = document.createElement('span');
      span.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-family:${cs.fontFamily};font-size:${cs.fontSize};letter-spacing:${cs.letterSpacing}`;
      span.textContent = '█'.repeat(50);
      document.body.appendChild(span);
      const charW = span.getBoundingClientRect().width / 50 || 8;
      document.body.removeChild(span);
      const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) || 12;
      COLS = Math.max(24, Math.floor(rect.width / charW) + 2);
      ROWS = Math.max(8, Math.floor(rect.height / lineH) + 1);
      heat = new Float32Array(COLS * (ROWS + 1));
    };

    const step = () => {
      const base = ROWS * COLS;
      for (let x = 0; x < COLS; x++) {
        heat[base + x] = Math.random() < 0.15 ? Math.random() * 0.4 + (FUEL - 0.4) : FUEL;
      }
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          let windShift = 0;
          if (WIND !== 0 && Math.random() < Math.abs(WIND)) windShift = WIND > 0 ? 1 : -1;
          const sx = (x + windShift + COLS) % COLS;
          const parent = heat[(y + 1) * COLS + sx] || 0;
          const decay = Math.random() * COOLING * 1.5;
          heat[y * COLS + x] = Math.max(0, parent - decay);
        }
      }
    };

    const render = () => {
      const n = FLAME_CHARS.length;
      let out = '';
      for (let y = 0; y < ROWS; y++) {
        let line = '';
        for (let x = 0; x < COLS; x++) {
          const idx = Math.min(n - 1, Math.floor(heat[y * COLS + x] * n * 1.1));
          line += FLAME_CHARS[idx];
        }
        out += y < ROWS - 1 ? line + '\n' : line;
      }
      pre.textContent = out;
    };

    measure();
    for (let i = 0; i < ROWS + 8; i++) step();
    render();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = 0, visible = true;
    const loop = (t: number) => {
      if (visible && t - last >= FRAME_MS) {
        last = t;
        step();
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    if (!reduce) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => { measure(); render(); });
    ro.observe(pre);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(pre);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <pre ref={ref} className="wh-mosaic wh-flame-chars" aria-hidden="true" />;
}

// Faint static square-mosaic — a very low-opacity background texture (the original
// dissolve pattern), behind the fire. Seeded with Math.sin → SSR-stable.
function HeroMosaicBG() {
  const COLS = 104, ROWS = 16, CELL = 16, GAP = 2;
  const rnd = (c: number, r: number) => {
    const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const rects: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    const rowF = r / (ROWS - 1);
    for (let c = 0; c < COLS; c++) {
      if (rnd(c, r) > rowF * 1.15 + 0.02) continue;
      const o = (0.06 + rowF * 0.4) * (0.55 + rnd(c + 13, r + 7) * 0.45);
      rects.push(<rect key={`${c}-${r}`} x={c * CELL} y={r * CELL} width={CELL - GAP} height={CELL - GAP} rx={1.5} opacity={Number(o.toFixed(3))} />);
    }
  }
  return (
    <svg className="wh-mosaic-bg" viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} preserveAspectRatio="none" aria-hidden="true">
      {rects}
    </svg>
  );
}

// ── readout helpers ────────────────────────────────────────────────────────────

// Severity → the shared "risk" pill tone + the IconBubble tone.
const RISK_PILL: Record<RiskLevel, 'risk-crit' | 'risk-high' | 'risk-med'> = {
  crit: 'risk-crit',
  high: 'risk-high',
  med: 'risk-med',
};
const RISK_BUBBLE: Record<RiskLevel, 'danger' | 'warn' | 'neutral'> = {
  crit: 'danger',
  high: 'warn',
  med: 'neutral',
};

const INSIGHT_ICON: Record<InsightType, keyof typeof Icons> = {
  slo: 'slo',
  spof: 'gitFork',
  drift: 'branch',
  lgpd: 'lockKey',
  scaling: 'trending',
  security: 'shield',
};

const AUTONOMY: Record<Autonomy, { label: string; tone: 'success' | 'ember' | 'warning' }> = {
  'agent-can-resolve': { label: 'Agent can resolve', tone: 'success' },
  'needs-ok': { label: 'Needs your OK', tone: 'ember' },
  'needs-arch-decision': { label: 'Architecture call', tone: 'warning' },
};

// Horizon urgency drives the chip colour: 'now' and weeks ≤ 2 are hot.
function horizonUrgency(horizon: string): 'hot' | 'warm' | 'cool' {
  if (horizon === 'now') return 'hot';
  const wk = parseInt(horizon.replace(/[^0-9]/g, ''), 10) || 99;
  if (wk <= 2) return 'hot';
  if (wk <= 4) return 'warm';
  return 'cool';
}

const STATUS_PILL: Record<WorkStatus, React.ReactNode> = {
  done: <Pill tone="neutral">shipped</Pill>,
  inflight: <Pill tone="ember" live>running</Pill>,
  scheduled: <Pill tone="neutral" dot>scheduled</Pill>,
};

const GRADE_TONE: Record<Grade, 'success' | 'ember' | 'warning' | 'danger'> = {
  A: 'success',
  B: 'ember',
  C: 'warning',
  D: 'danger',
};

const QUICK_START: { icon: keyof typeof Icons; label: string; meta: string; href: string }[] = [
  { icon: 'package', label: 'Scaffold a service', meta: 'Paved-road templates · ~3 min', href: '/portal/create' },
  { icon: 'agent', label: 'Create an agent', meta: 'Give the fleet a new job', href: '/portal/agents/new' },
  { icon: 'key', label: 'Request access', meta: 'Self-service, policy-gated', href: '/portal/catalog' },
  { icon: 'runbook', label: 'Open a runbook', meta: 'Operational playbooks', href: '/portal/catalog' },
];

export default function PortalHome() {
  // Time-aware greeting + date label, client-only to stay SSR-stable (the first
  // paint matches the server, then the effect fills in the live values).
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => { setNow(new Date()); }, []);
  const hour = now ? now.getHours() : 8;
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateLabel = now
    ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()
    : null;

  return (
    <>
      <FPageHeader
        eyebrow={<>{dateLabel ? `${dateLabel} · ` : ''}SCORE &amp; RISK</>}
        leading={<Icons.sparkle size={22} style={{ color: 'var(--ember)' } as React.CSSProperties} />}
        title={`${greeting}, Leonardo`}
        subtitle="Your agents have been shipping overnight. Here's the little that needs a human today."
        actions={
          <>
            <Button variant="ghost" asChild><Link href="/portal/create">
              <Icons.plus size={13} /> New service
            </Link></Button>
            <Button variant="ember">
              <Icons.sparkle size={13} /> Ask Forge AI
            </Button>
          </>
        }
      />


      {/* Welcome hero — sits directly under the header; greeting stays above.
          Background: an animated terminal-fire mosaic (density ramp " ░ ▒ ▓ █"
          rendered as monospace glyphs, var(--ember)). */}
      <section className="fp-welcome-hero page-enter">
        {/* Layered background watermarks (all behind the fire): a faint static
            mosaic texture + two ForgeMark marks at different sizes/positions. */}
        <HeroMosaicBG />
        <div className="wh-mark-bg wh-mark-bg--a" aria-hidden="true"><ForgeMark size={360} variant="outline" /></div>
        <div className="wh-mark-bg wh-mark-bg--b" aria-hidden="true"><ForgeMark size={150} variant="outline" /></div>
        <HeroFlameChars />
        <div className="wh-gradient" aria-hidden="true" />
        <span
          className="ember-glow-bg"
          aria-hidden="true"
          style={{ width: 420, height: 420, insetInlineEnd: -140, insetBlockStart: -170 } as React.CSSProperties}
        />
        {/* Directional scrim — darkens the copy column so text/buttons stay
            legible over the fire, while the flames keep breathing on the end side. */}
        <div className="wh-scrim" aria-hidden="true" />
        {/* Sparkles — same faint watermark style as the marks, spread out so they
            don't overlap the ForgeMarks. */}
        <div className="wh-sparkles" aria-hidden="true">
          {[
            { x: 13, y: 26, s: 18, d: 0 },
            { x: 30, y: 64, s: 13, d: 1.1 },
            { x: 44, y: 20, s: 22, d: 2.0 },
            { x: 58, y: 72, s: 14, d: 0.7 },
            { x: 70, y: 30, s: 16, d: 2.6 },
            { x: 90, y: 80, s: 12, d: 1.6 },
          ].map((sp, i) => (
            <span
              key={i}
              className="wh-sparkle"
              style={{ insetInlineStart: `${sp.x}%`, insetBlockStart: `${sp.y}%`, animationDelay: `${sp.d}s` } as React.CSSProperties}
            >
              <Icons.sparkle size={sp.s} />
            </span>
          ))}
        </div>
        <div className="wh-inner">
          <div className="wh-copy">
            <span className="wh-eyebrow t-mono-label">The Forge</span>
            <h2 className="wh-title">Less friction. More shipping.</h2>
            <p className="wh-sub">
              From idea to production, Forge removes the obstacles between engineers and impact.
              Standardized paths, built-in best practices and AI-powered workflows keep teams moving
              forward.
            </p>
            <div className="wh-actions">
              <Button variant="ember" asChild><Link href="/portal/create">
                <Icons.plus size={13} /> Forge a service
              </Link></Button>
              <Button variant="ghost" asChild><Link href="/portal/catalog">
                <Icons.catalog size={13} /> Explore the catalog
              </Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Home body — one vertical rhythm with generous space between the major
          sections (KPIs · Decide · Steer · Observe), so the page breathes. */}
      <div className="fp-home-body">
      {/* System KPIs — the agentic system's output, not a human backlog.
          Canonical DS MetricCard (label mono · Trend top-right · value · spark · foot). */}
      <div className="fp-grid fp-grid-4">
        {SYSTEM_KPIS.map((k) => (
          <Link key={k.key} href={k.href} className="fp-kpi-link">
            <MetricCard
              size="lg"
              label={k.label}
              value={<CountUp to={k.to} suffix={k.suffix} />}
              delta={k.delta}
              deltaUnit={k.unit}
              inverted={k.inverted}
              series={k.series}
              sparkColor={k.tone === 'success' ? 'var(--success)' : undefined}
              foot={k.sub}
            />
          </Link>
        ))}
      </div>

      {/* ① DECIDE — the only human queue, kept small by design. */}
      <section className="fp-section" id="decide">
        <div className="fp-section-head">
          <h2 className="fp-section-title">
            <Icons.gate size={13} /> Needs you · human decisions
          </h2>
          <span className="fp-section-note">{DECISIONS.length} of {WORKSTREAM_SUMMARY.shipped + DECISIONS.length} actions needed a human</span>
        </div>

        {DECISIONS.length === 0 ? (
          <div className="fp-decide-clear">
            <IconBubble icon="check" size={36} tone="success" />
            <div>
              <strong>Nothing needs you.</strong> Agents have it. Anything risky will surface here.
            </div>
          </div>
        ) : (
          <div className="fp-decide">
            {DECISIONS.map((d) => (
              <div key={d.id} className="fp-decide-row">
                <IconBubble icon="gate" size={38} tone={RISK_BUBBLE[d.risk]} />
                <div className="fp-decide-body">
                  <div className="fp-decide-top">
                    <span className="fp-decide-title">{d.title}</span>
                    <Pill tone={RISK_PILL[d.risk]} icon={<Icons.lock size={11} />}>{d.guardrail}</Pill>
                  </div>
                  <div className="fp-decide-meta">
                    <code>{d.service}</code> · {d.agent} · {d.when}
                  </div>
                  <p className="fp-decide-why">{d.why}</p>
                  <div className="fp-decide-rec">
                    <AILabel variant="dot" />
                    <span>{d.recommendation}{d.reversible ? ' This change is reversible.' : ''}</span>
                  </div>
                  <div className="fp-decide-actions">
                    <Button variant="ember" size="sm">
                      <Icons.check size={12} /> Approve
                    </Button>
                    <Button variant="outline" size="sm" asChild><Link href={d.href}>
                      Review <Icons.chevronRight size={12} />
                    </Link></Button>
                    <Button variant="ghost" size="sm">Dismiss</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ② STEER — AI-Insights (top here; full radar on /portal/insights). */}
      <section className="fp-section">
        <div className="fp-section-head">
          <h2 className="fp-section-title">
            <Icons.brain size={13} /> AI-Insights · {OPEN_INSIGHTS.length} risks to steer
          </h2>
          <Link href="/portal/insights" className="ds-link-inline">View all<Icons.chevronRight size={12} /></Link>
        </div>
        <div className="fp-insights">
          {OPEN_INSIGHTS.slice(0, 4).map((it) => {
            const Ico = Icons[INSIGHT_ICON[it.type]] || Icons.circle;
            const a = AUTONOMY[it.autonomy];
            return (
              <div key={it.id} className="fp-insight-row">
                <span className={`fp-insight-ico u-${it.type}`}><Ico size={17} /></span>
                <div className="fp-insight-body">
                  <div className="fp-insight-top">
                    <span className={`fp-insight-horizon u-${horizonUrgency(it.horizon)}`}>
                      <Icons.clock size={11} /> {it.horizon}
                    </span>
                    <span className="fp-insight-title">{it.title}</span>
                    <Pill tone={a.tone}>{a.label}</Pill>
                  </div>
                  <div className="fp-insight-meta">{it.blastRadius} · {it.evidence}</div>
                  <div className="fp-insight-rem-row">
                    <div className="fp-insight-rem">
                      <AILabel variant="dot" /> <span>{it.remediation}</span>
                    </div>
                    <Link href={it.href} className="ds-link-inline fp-insight-steer">Steer<Icons.chevronRight size={12} /></Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ③ OBSERVE — agent workstream (auditable + reversible) + ambient aside. */}
      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'flex-start', gap: 18 }}>
        <section className="fp-section">
          <div className="fp-section-head">
            <h2 className="fp-section-title">
              <Icons.activity size={13} /> Agent workstream · last 24h
            </h2>
            <span className="fp-section-note">
              {WORKSTREAM_SUMMARY.shipped} shipped · {WORKSTREAM_SUMMARY.regressions} regressions · ~{WORKSTREAM_SUMMARY.hoursSaved}h saved · coverage +{WORKSTREAM_SUMMARY.coverageDelta} pts
            </span>
          </div>
          <div className="fp-work">
            {WORKSTREAM.map((w) => (
              <div key={w.id} className="fp-work-row">
                <span className={`fp-work-status u-${w.status}`} aria-hidden="true" />
                <div className="fp-work-body">
                  <div className="fp-work-top">
                    <Link href={w.href} className="fp-work-title">{w.title}</Link>
                    {STATUS_PILL[w.status]}
                  </div>
                  <div className="fp-work-meta">
                    {w.agent} · <code>{w.service}</code> · {w.scope} · {w.when}
                  </div>
                  <div className="fp-work-foot">
                    <span className="fp-work-impact">{w.impact}</span>
                    {w.checks && w.checks.length > 0 && (
                      <span className="fp-work-verified" title={`Verified: ${w.checks.join(', ')}`}>
                        <Icons.badgeCheck size={13} /> verified
                      </span>
                    )}
                    <span className="fp-work-spacer" />
                    {w.status === 'done' && (
                      <Button variant="ghost" size="sm" asChild><Link href={w.href}>
                        <Icons.auditLog size={12} /> Audit
                      </Link></Button>
                    )}
                    {w.status === 'done' && w.reversible && (
                      <Button variant="ghost" size="sm">
                        <Icons.rollback size={12} /> Roll back
                      </Button>
                    )}
                    {w.status === 'inflight' && (
                      <Button variant="ghost" size="sm" asChild><Link href={w.href}>
                        Watch <Icons.chevronRight size={12} />
                      </Link></Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ambient aside */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* On-call */}
          <div className="fp-card">
            <FCardHead title="On-call · my tribe" action={<Pill tone="ember" dot>paged</Pill>} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBlockStart: 4 }}>
              <Avatar name="Bruno Mendes" size="lg" ember />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>Bruno Mendes</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>SRE · Score &amp; Risk · ends in 6h</div>
              </div>
              <Button variant="ghost" size="sm">
                <Icons.bell size={12} /> Page
              </Button>
            </div>
          </div>

          {/* My services — with a derived scorecard grade */}
          <div className="fp-card">
            <FCardHead
              title="My services"
              action={
                <Link href="/portal/catalog" className="ds-link-inline" style={{ fontSize: 'var(--text-sm)' }}>
                  View all
                </Link>
              }
            />
            <FRows>
              {MY_SERVICES.map((id) => {
                const s = getService(id);
                if (!s) return null;
                const grade = gradeFor(s.coverage, s.alert);
                return (
                  <FRow key={id} href={`/portal/catalog/${id}`}>
                    <span className="fp-row-main" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{s.name}</span>
                    <Pill tone={GRADE_TONE[grade]}>{grade}</Pill>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{s.p95}ms</span>
                    <HealthBadge state={s.alert ? 'degraded' : 'up'} pulse={s.alert} />
                  </FRow>
                );
              })}
            </FRows>
          </div>

          {/* Quick start — self-service paved roads (humans + agents) */}
          <div className="fp-card">
            <FCardHead title="Quick start" />
            <FRows>
              {QUICK_START.map((q) => {
                return (
                  <FRow key={q.label} href={q.href}>
                    <IconBubble icon={q.icon} size={30} tone="neutral" />
                    <span className="fp-row-main">
                      <span className="fp-qs-label">{q.label}</span>
                      <span className="fp-qs-meta">{q.meta}</span>
                    </span>
                    <Icons.chevronRight size={15} style={{ color: 'var(--fg-muted)' } as React.CSSProperties} />
                  </FRow>
                );
              })}
            </FRows>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
