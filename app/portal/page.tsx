'use client';
// Forge — Home / personal digest. "What needs your attention" landing: a Forge AI
// morning summary, estate KPIs, a ranked attention feed, and an aside with my
// services, on-call and recent incidents. Composed from Eidos DS primitives.
import * as React from 'react';
import Link from 'next/link';
import {
  Avatar,
  Button,
  ForgeMark,
  HealthBadge,
  Icons,
  Pill,
  SeverityPill,
  Sparkline,
  Trend,
} from '@/ds/core';
import { FPageHeader, FKpi, FSection, IconBubble, FCardHead, FRows, FRow, Sub } from '@/portal/shell/portal-shell';
import { SERVICES, getService } from '@/portal/data/services';

// ── Forge AI morning digest ───────────────────────────────────────────────────
const DIGEST: { tone: 'danger' | 'warning' | 'ok'; text: React.ReactNode; href: string }[] = [
  {
    tone: 'danger',
    text: (
      <>
        <strong>acerta-api</strong> p99 is up <strong>41%</strong> since v4.12.0, likely the new
        konduto-antifraud rule. I drafted a rollback.
      </>
    ),
    href: '/portal/catalog/acerta-api',
  },
  {
    tone: 'warning',
    text: (
      <>
        <strong>INC-2041</strong> is still open (p95 spike); on-call is Bruno Mendes, paged 6h ago.
      </>
    ),
    href: '/portal/catalog/acerta-api',
  },
  {
    tone: 'ok',
    text: (
      <>
        Estate health is up <strong>2 pts</strong> week-over-week; 44 deploys shipped, 0 failed gates.
      </>
    ),
    href: '/portal/catalog',
  },
];

const HEALTH_SERIES = [88, 89, 90, 89, 91, 90, 92];
const RISK_SERIES = [48, 45, 44, 42, 40, 41, 38];
const VELOCITY_SERIES = [31, 34, 36, 39, 41, 43, 44];
const COST_SERIES = [410, 430, 440, 455, 470, 480, 488];

// ── Attention feed ─────────────────────────────────────────────────────────────
const FEED: {
  id: string;
  icon: string;
  tone: 'danger' | 'warning';
  title: string;
  meta: string;
  href: string;
  badge: React.ReactNode;
}[] = [
  {
    id: 'f1',
    icon: 'server',
    tone: 'danger',
    title: 'acerta-api degraded · p99 latency over SLO',
    meta: 'Correlated with konduto-antifraud v3.1.7 · Forge AI proposed a rollback',
    href: '/portal/catalog/acerta-api',
    badge: <HealthBadge state="degraded" pulse />,
  },
  {
    id: 'f2',
    icon: 'incident',
    tone: 'danger',
    title: 'INC-2041 · p95 spike after konduto-antifraud deploy',
    meta: 'Opened 6h ago · commander Bruno Mendes · 2 services impacted',
    href: '/portal/catalog/acerta-api',
    badge: <SeverityPill level="p2" />,
  },
  {
    id: 'f3',
    icon: 'shield',
    tone: 'warning',
    title: 'konduto-antifraud false-positive rate +18%',
    meta: 'Since v3.1.7 · review the new fraud-score rule or roll back',
    href: '/portal/catalog/konduto-antifraud',
    badge: <HealthBadge state="degraded" pulse />,
  },
  {
    id: 'f4',
    icon: 'score',
    tone: 'warning',
    title: 'bureau-api scorecard slipped to B',
    meta: 'Observability · missing trace coverage on 2 endpoints',
    href: '/portal/catalog/bureau-api',
    badge: <Pill tone="warning">Grade B</Pill>,
  },
];

const MY_SERVICES = ['acerta-api', 'score-engine', 'scpc-gateway', 'consent-service'];

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

const TONE_ICON: Record<string, 'danger' | 'warn' | 'ember'> = {
  danger: 'danger',
  warning: 'warn',
  ok: 'ember',
};

export default function PortalHome() {
  const degraded = SERVICES.filter((s) => s.alert).length;

  return (
    <>
      <FPageHeader
        eyebrow="Home"
        leading={<Icons.sparkle size={22} style={{ color: 'var(--ember)' } as React.CSSProperties} />}
        title="Good morning, Leonardo"
        subtitle="Here's what needs your attention across the estate today."
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

      {/* Forge AI morning digest */}
      <section
        style={{
          background: 'var(--ember-softer)',
          border: '1px solid color-mix(in oklch, var(--ember) 22%, transparent)',
          borderRadius: 'var(--radius-2xl)',
          padding: '16px 18px',
          marginBlockEnd: 20,
          display: 'flex',
          gap: 14,
        }}
      >
        <IconBubble icon="sparkle" size={36} tone="ember" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBlockEnd: 8 }}>
            <strong style={{ fontSize: 'var(--text-sm)' }}>Forge AI</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
              your morning · 3 things
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DIGEST.map((d, i) => (
              <Link
                key={i}
                href={d.href}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 9,
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.5,
                  color: 'var(--fg)',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    marginBlockStart: 7,
                    flexShrink: 0,
                    background:
                      d.tone === 'danger' ? 'var(--danger)' : d.tone === 'warning' ? 'var(--warning)' : 'var(--success)',
                  }}
                />
                <span>{d.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Estate KPIs */}
      <div className="fp-grid fp-grid-4" style={{ marginBlockEnd: 22 }}>
        <FKpi label="Estate health" value="92" sub={<Sparkline data={HEALTH_SERIES} w={200} h={30} color="var(--success)" />} trendNode={<Trend delta={2} unit="pts" />} />
        <FKpi label="Degraded now" value={degraded} sub={<Sub muted>of {SERVICES.length} services</Sub>} trendNode={<Trend delta={1} unit="" inverted />} />
        <FKpi label="Open incidents" value="1" sub={<Sub muted>1 P2 · 0 P1</Sub>} />
        <FKpi label="Deploys / week" value="44" sub={<Sparkline data={VELOCITY_SERIES} w={200} h={30} />} trendNode={<Trend delta={12} unit="%" />} />
      </div>

      {/* Two columns */}
      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'flex-start', gap: 18 }}>
        {/* Attention feed */}
        <FSection title="Needs attention · ranked by impact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEED.map((it) => (
              <div key={it.id} className="fp-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <IconBubble icon={it.icon} size={38} tone={TONE_ICON[it.tone]} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBlockEnd: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{it.title}</span>
                    {it.badge}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5, margin: 0 }}>{it.meta}</p>
                  <div style={{ display: 'flex', gap: 8, marginBlockStart: 12 }}>
                    <Button variant="ghost" size="sm" asChild><Link href={it.href}>
                      View <Icons.chevronRight size={12} />
                    </Link></Button>
                    <Button variant="ghost" size="sm">
                      <Icons.sparkle size={12} /> Ask Forge AI
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FSection>

        {/* Aside */}
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

          {/* My services */}
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
                return (
                  <FRow key={id} href={`/portal/catalog/${id}`}>
                    <span className="fp-row-main" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{s.name}</span>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{s.p95}ms</span>
                    <HealthBadge state={s.alert ? 'degraded' : 'up'} pulse={s.alert} />
                  </FRow>
                );
              })}
            </FRows>
          </div>

          {/* CTA */}
          <Link
            href="/portal/create"
            className="fp-card fp-card--ember-hero"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}
          >
            <IconBubble icon="package" size={36} tone="ember" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Spin up a new service</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Paved-road templates · ~3 min</div>
            </div>
            <Icons.arrowRight size={16} style={{ color: 'var(--ember)' } as React.CSSProperties} />
          </Link>
        </div>
      </div>
    </>
  );
}
