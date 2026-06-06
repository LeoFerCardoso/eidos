'use client';
// Forge — Home / personal digest. "What needs your attention" landing: a Forge AI
// morning summary, estate KPIs, a ranked attention feed, and an aside with my
// services, on-call and recent incidents. Composed from Eidos DS primitives.
import * as React from 'react';
import Link from 'next/link';
import {
  Avatar,
  Button,
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

// Ember pixel-mosaic for the welcome hero — a grid of small ember squares that
// grows denser + brighter toward the bottom edge (a "dissolve rising" texture).
// Seeded with Math.sin so server and client render the exact same pattern (no
// hydration drift), and the per-cell opacity does the gradient work; CSS masks
// the top into transparency and the .wh-gradient mesh sits in front of it.
const HeroMosaic = React.memo(function HeroMosaic() {
  const COLS = 104;
  const ROWS = 16;
  const CELL = 16;
  const GAP = 2;
  const rnd = (c: number, r: number) => {
    const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const rects: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    const rowF = r / (ROWS - 1); // 0 at the top → 1 at the bottom
    for (let c = 0; c < COLS; c++) {
      // Denser toward the bottom: a cell is "on" only when its noise falls
      // under the row's rising threshold.
      if (rnd(c, r) > rowF * 1.15 + 0.02) continue;
      const opacity = (0.06 + rowF * 0.4) * (0.55 + rnd(c + 13, r + 7) * 0.45);
      rects.push(
        <rect
          key={`${c}-${r}`}
          x={c * CELL}
          y={r * CELL}
          width={CELL - GAP}
          height={CELL - GAP}
          rx={1.5}
          opacity={Number(opacity.toFixed(3))}
        />,
      );
    }
  }
  return (
    <svg
      className="wh-mosaic"
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {rects}
    </svg>
  );
});

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

      {/* Welcome hero — sits directly under the header; greeting stays above. */}
      <section className="fp-welcome-hero page-enter">
        <HeroMosaic />
        <div className="wh-gradient" aria-hidden="true" />
        <span
          className="ember-glow-bg"
          aria-hidden="true"
          style={{ width: 420, height: 420, insetInlineEnd: -140, insetBlockStart: -170 } as React.CSSProperties}
        />
        <div className="wh-inner">
          <div className="wh-copy">
            <span className="wh-eyebrow t-mono-label">Welcome back</span>
            <h2 className="wh-title">Your whole estate, calm and under control.</h2>
            <p className="wh-sub">
              Catalog, pipelines and incidents in one console. Forge AI watches the estate around the
              clock, so the things that need you surface before they page you.
            </p>
            <div className="wh-actions">
              <Button variant="ember">
                <Icons.sparkle size={13} /> Ask Forge AI
              </Button>
              <Button variant="ghost" asChild><Link href="/portal/catalog">
                <Icons.catalog size={13} /> Explore catalog
              </Link></Button>
            </div>
          </div>
          <div className="wh-mark" aria-hidden="true">
            <Icons.sparkle size={42} />
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
