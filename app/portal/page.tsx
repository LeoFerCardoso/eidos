'use client';
// Forge — Home / personal digest. "What needs your attention" landing: a Forge AI
// morning summary, estate KPIs, a ranked attention feed, and an aside with my
// services, on-call and recent incidents. Composed from Eidos DS primitives.
import * as React from 'react';
import Link from 'next/link';
import {
  Avatar,
  HealthBadge,
  Icons,
  Pill,
  SeverityPill,
  Sparkline,
  Trend,
} from '@/ds/core';
import { FPageHeader, FKpi, FSection, IconBubble } from '@/portal/shell/portal-shell';
import { SERVICES, getService } from '@/portal/data/services';

// ── Forge AI morning digest ───────────────────────────────────────────────────
const DIGEST: { tone: 'danger' | 'warning' | 'ok'; text: React.ReactNode; href: string }[] = [
  {
    tone: 'danger',
    text: (
      <>
        <strong>acerta-api</strong> p99 is up <strong>41%</strong> since v4.12.0 — likely the new
        konduto-antifraud rule. I drafted a rollback.
      </>
    ),
    href: '/portal/catalog/acerta-api',
  },
  {
    tone: 'warning',
    text: (
      <>
        <strong>INC-2041</strong> is still open (p95 spike) — on-call is Bruno Mendes, paged 6h ago.
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
    title: 'acerta-api degraded — p99 latency over SLO',
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
    meta: 'Observability — missing trace coverage on 2 endpoints',
    href: '/portal/catalog/bureau-api',
    badge: <Pill tone="warning">Grade B</Pill>,
  },
];

const MY_SERVICES = ['acerta-api', 'score-engine', 'scpc-gateway', 'consent-service'];

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
            <Link className="btn ghost" href="/portal/create">
              <Icons.plus size={13} /> New service
            </Link>
            <button className="btn ember">
              <Icons.sparkle size={13} /> Ask Forge AI
            </button>
          </>
        }
      />

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
                    <Link className="btn ghost sm" href={it.href}>
                      View <Icons.chevronRight size={12} />
                    </Link>
                    <button className="btn ghost sm">
                      <Icons.sparkle size={12} /> Ask Forge AI
                    </button>
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
            <div className="fp-card-head">
              <div className="fp-card-title">On-call · my tribe</div>
              <Pill tone="ember" dot>
                paged
              </Pill>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBlockStart: 4 }}>
              <Avatar name="Bruno Mendes" size="lg" ember />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>Bruno Mendes</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>SRE · Score &amp; Risk · ends in 6h</div>
              </div>
              <button className="btn ghost sm">
                <Icons.bell size={12} /> Page
              </button>
            </div>
          </div>

          {/* My services */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">My services</div>
              <Link href="/portal/catalog" className="ds-link-inline" style={{ fontSize: 'var(--text-sm)' }}>
                View all
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {MY_SERVICES.map((id, i) => {
                const s = getService(id);
                if (!s) return null;
                return (
                  <Link
                    key={id}
                    href={`/portal/catalog/${id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 0',
                      borderBlockEnd: i < MY_SERVICES.length - 1 ? '1px solid var(--border)' : 'none',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 500, flex: 1 }}>{s.name}</span>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{s.p95}ms</span>
                    <HealthBadge state={s.alert ? 'degraded' : 'up'} pulse={s.alert} />
                  </Link>
                );
              })}
            </div>
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

const Sub = ({ children, muted }: { children: React.ReactNode; muted?: boolean }) => (
  <div style={{ fontSize: 'var(--text-xs)', color: muted ? 'var(--fg-muted)' : 'var(--fg)', marginBlockStart: 2 }}>{children}</div>
);
