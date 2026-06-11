'use client';
// Forge — Service detail. Ownership, health, dependencies, APIs and compliance
// for one internal service. The flagship (acerta-api) also carries the Forge AI
// explain panel. Composed only from Eidos DS primitives + portal shell helpers.
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {
  Avatar,
  Banner,
  Button,
  HealthBadge,
  Icons,
  LangBadge,
  Pill,
  Prose,
  RelativeTime,
  SeverityPill,
  Select,
  Sparkline,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
  Timeline,
} from '@/ds/core';
import { FPageHeader, FKpi, FSection, IconBubble, FCardHead, FRows, FRow, Sub } from '@/portal/shell/portal-shell';
import { MetricChartCard } from '@/portal/shell/viz';
import { ApiExplorer } from '@/portal/apis/api-explorer';
import { APIS } from '@/portal/data/apis';
import { getService, SERVICES, type PortalService } from '@/portal/data/services';
import { ADRS, ADR_STATUS_META } from '@/portal/data/architecture-records';
import { CONTEXTS } from '@/portal/data/contexts';
import { RUNBOOKS } from '@/portal/data/runbooks';
import { buildScorecard } from '@/portal/data/scorecards';

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = ['Overview', 'Metrics', 'Dependencies', 'API', 'CI/CD', 'Incidents', 'Context', 'Settings'] as const;
type Tab = (typeof TABS)[number];

// ── Time helpers ──────────────────────────────────────────────────────────────
const NOW = Date.now();
const ago = (mins: number) => new Date(NOW - mins * 60 * 1000);

// ── Timeline events (static; wired to the flagship service) ──────────────────
const TIMELINE_ITEMS = [
  {
    id: 'ev1',
    icon: 'deploy',
    tone: 'done',
    title: 'Deploy v4.12.0 promoted to Ring 4',
    meta: 'Canary clean · auto-promoted by Eidos quality gates',
    at: ago(2),
  },
  {
    id: 'ev2',
    icon: 'gitPullRequest',
    tone: 'done',
    title: 'PR #5218 merged · new CPF enrichment endpoint',
    meta: 'Camila Tanaka · Risk score 48 · +1.1% coverage',
    at: ago(90),
  },
  {
    id: 'ev3',
    icon: 'alert',
    tone: 'error',
    title: 'P2 alert · p95 latency above SLO for 6 minutes',
    meta: 'Correlated with konduto-antifraud v3.1.7 deploy',
    at: ago(360),
  },
  {
    id: 'ev4',
    icon: 'user',
    tone: 'default',
    title: 'On-call rotation handed off',
    meta: 'Larissa Fontana → Bruno Mendes',
    at: ago(720),
  },
  {
    id: 'ev5',
    icon: 'shield',
    tone: 'done',
    title: 'Security scan completed · 0 criticals, 1 low triaged',
    meta: 'Trivy + CodeQL · scan id sec-7834',
    at: ago(1440),
  },
];

const INCIDENTS: { id: string; level: 'p0' | 'p1' | 'p2' | 'p3'; title: string; when: Date }[] = [
  {
    id: 'INC-2041',
    level: 'p2',
    title: 'p95 spike after konduto-antifraud v3.1.7 deploy',
    when: ago(360),
  },
  {
    id: 'INC-2028',
    level: 'p3',
    title: 'Stale consent cache in consent-service',
    when: ago(2880),
  },
  {
    id: 'INC-2011',
    level: 'p1',
    title: 'SCPC gateway timeout caused cascading latency',
    when: ago(11520),
  },
];

// ── On-call mock data ─────────────────────────────────────────────────────────
const ON_CALL = {
  name: 'Bruno Mendes',
  initials: 'BM',
  role: 'SRE · Score & Risk',
  shiftEnds: new Date(NOW + 6 * 3600 * 1000),
};

// ── Team members with access ──────────────────────────────────────────────────
const TEAM_MEMBERS = [
  { name: 'Camila Tanaka', initials: 'CT' },
  { name: 'Bruno Mendes', initials: 'BM' },
  { name: 'Larissa Fontana', initials: 'LF' },
  { name: 'Rafael Souza', initials: 'RS' },
  { name: 'Ana Lima', initials: 'AL' },
  { name: 'Diego Carvalho', initials: 'DC' },
  { name: 'Priya Nair', initials: 'PN' },
  { name: 'João Ferreira', initials: 'JF' },
];

// ── About: GitHub-style README (16:9 hero · shield badges · rendered markdown) ─

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// 16:9 "social preview" banner at the top of the README.
function RepoHero({ svc }: { svc: PortalService }) {
  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        width: '100%',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        marginBlockEnd: 16,
        background:
          'radial-gradient(120% 120% at 0% 0%, color-mix(in oklch, var(--ember) 24%, transparent) 0%, transparent 46%),' +
          'radial-gradient(120% 120% at 100% 100%, color-mix(in oklch, var(--accent-2, #4aa8ff) 18%, transparent) 0%, transparent 52%),' +
          'linear-gradient(150deg, var(--bg-elevated), var(--bg))',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(color-mix(in oklch, var(--fg) 9%, transparent) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          insetInlineStart: 28,
          insetBlockEnd: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <IconBubble icon="server" size={52} tone={svc.alert ? 'danger' : 'ember'} />
        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {svc.name}
          </div>
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {svc.tribe} · {svc.lang}
          </div>
        </div>
      </div>
    </div>
  );
}

// GitHub-style two-segment shield badge (label | value). Styles in example-shell.css.
type ShieldTone = 'green' | 'blue' | 'yellow' | 'red' | 'cyan' | 'gray';
function ShieldBadge({ label, value, tone = 'gray' }: { label: string; value: string; tone?: ShieldTone }) {
  return (
    <span className="shield">
      <span className="shield-l">{label}</span>
      <span className={'shield-v shield-' + tone}>{value}</span>
    </span>
  );
}

const LANG_TONE: Record<string, ShieldTone> = {
  Go: 'cyan',
  TypeScript: 'blue',
  Java: 'red',
  Python: 'yellow',
  Rust: 'red',
};

function RepoBadges({ svc }: { svc: PortalService }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBlockEnd: 18 }}>
      <ShieldBadge label="build" value={svc.alert ? 'failing' : 'passing'} tone={svc.alert ? 'red' : 'green'} />
      <ShieldBadge label="coverage" value={`${svc.coverage}%`} tone={svc.coverage >= 85 ? 'green' : 'yellow'} />
      <ShieldBadge label="version" value={`v${svc.version}`} tone="blue" />
      <ShieldBadge label="lang" value={svc.lang} tone={LANG_TONE[svc.lang] ?? 'gray'} />
      <ShieldBadge label="uptime" value="99.97%" tone="green" />
      {svc.pii && <ShieldBadge label="LGPD" value="compliant" tone="green" />}
      <ShieldBadge label="license" value="Internal" tone="gray" />
    </div>
  );
}

// ── README markdown ──────────────────────────────────────────────────────────
const ACERTA_MD = [
  '## Overview',
  '',
  'The **acerta-api** is the primary CPF/CNPJ query gateway for the Boa Vista **Acerta** product line. It orchestrates registration data, credit restrictions, risk score and estimated income into a single enriched response.',
  '',
  '> Serves ~12M queries/day across **Acerta Essential**, **Plus** and **Complete**.',
  '',
  '## Architecture',
  '',
  'Written in **Go 1.22** and deployed as a horizontally-scalable container on the Forge platform. Requests are authenticated via **mTLS** and authorized through `consent-service` before reaching the orchestration layer.',
  '',
  '- `scpc-gateway` · negative and positive bureau data',
  '- `score-engine` · OneScore risk value (0–1000)',
  '- `konduto-antifraud` · fraud-signal gating',
  '- `consent-service` · LGPD legal-basis validation',
  '',
  '## Endpoints',
  '',
  '| Method | Path | Product | Description |',
  '| ------ | ---- | ------- | ----------- |',
  '| `POST` | `/v1/acerta/query` | Essential | Registration + negative records |',
  '| `POST` | `/v1/acerta/query/plus` | Plus | + credit score + income estimate |',
  '| `POST` | `/v1/acerta/query/complete` | Complete | + payment-capacity recommendation |',
  '',
  '## Local development',
  '',
  '```bash',
  'git clone git@forge:score-risk/acerta-api',
  'cd acerta-api',
  'make deps && make run-local   # starts on :8080',
  '```',
  '',
  '### Environment variables',
  '',
  '```bash',
  'SCPC_GATEWAY_URL=https://scpc-gateway.forge.internal',
  'SCORE_ENGINE_URL=https://score-engine.forge.internal',
  'CONSENT_SERVICE_URL=https://consent-service.forge.internal',
  'KONDUTO_API_KEY=<vault:acerta/konduto>',
  '```',
  '',
  '## Observability & SLOs',
  '',
  '- **Availability** · target `99.95%`, current **99.97%**',
  '- **p95 latency** · target `< 300ms`, current **240ms**',
  '- **Error rate** · target `< 0.5%`, current **0.21%**',
  '',
  'Dashboards: [Grafana](#) · [Traces](#) · [Logs](#)',
  '',
  '## Runbooks',
  '',
  '1. [Latency spike mitigation](#)',
  '2. [Failover to bureau-gateway](#)',
  '3. [Consent cache flush](#)',
  '',
  '## Ownership',
  '',
  '**Squad Query** · Score & Risk tribe · Slack `#squad-query`',
].join('\n');

const genericReadme = (svc: PortalService) =>
  [
    '## Overview',
    '',
    svc.summary,
    '',
    '## Quick start',
    '',
    '```bash',
    `git clone git@forge:${slug(svc.tribe)}/${svc.name}`,
    `cd ${svc.name}`,
    'make deps && make run-local',
    '```',
    '',
    '## Observability',
    '',
    `- **p95 latency** · ${svc.p95}ms`,
    `- **Test coverage** · ${svc.coverage}%`,
    `- **Language** · ${svc.lang}`,
    svc.pii ? '- **Data** · Personal data · LGPD in-scope' : '',
    '',
    '## Ownership',
    '',
    `**${svc.squad}** · ${svc.tribe} tribe · Slack \`#${slug(svc.squad)}\``,
  ]
    .filter((l) => l !== '')
    .join('\n');

function ServiceReadme({ svc }: { svc: PortalService }) {
  const md = svc.id === 'acerta-api' ? ACERTA_MD : genericReadme(svc);
  return (
    <>
      <RepoHero svc={svc} />
      <RepoBadges svc={svc} />
      <Prose>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
          {md}
        </ReactMarkdown>
      </Prose>
    </>
  );
}

// ── Metrics tab: DORA + service metrics + readiness scorecard ─────────────────
const DORA = [
  { label: 'Deploy frequency', value: '7 / wk', delta: '+16%', good: true, spark: [3, 4, 4, 5, 5, 6, 7] },
  { label: 'Lead time', value: '1.8h', delta: '-21%', good: true, spark: [3.1, 2.8, 2.6, 2.3, 2.1, 1.9, 1.8] },
  { label: 'Change-fail rate', value: '6%', delta: '-2pp', good: true, spark: [11, 10, 9, 8, 7, 7, 6] },
  { label: 'MTTR', value: '26m', delta: '-13%', good: true, spark: [44, 40, 36, 33, 30, 28, 26] },
];

// Golden-signal trend cards for the Service metrics section. Series are mock but
// deterministic per service (no Math.random — SSR-safe); throughput is derived
// from coverage/deploys/p95. The previous-window ghost is plotted dashed.
type SignalUnit = 'ms' | 'pp' | 'pct';
function deltaOf(s: number[], unit: SignalUnit, goodUp: boolean): { label: string; good: boolean } {
  const a = s[0];
  const d = s[s.length - 1] - a;
  const good = goodUp ? d >= 0 : d <= 0;
  const sign = d > 0 ? '+' : d < 0 ? '-' : '';
  const mag = Math.abs(d);
  const label =
    unit === 'ms' ? `${sign}${Math.round(mag)}ms` :
    unit === 'pp' ? `${sign}${mag.toFixed(2)}pp` :
    `${sign}${Math.round(Math.abs(d / a) * 100)}%`;
  return { label, good };
}
function ghostOf(s: number[], unit: SignalUnit, goodUp: boolean): number[] {
  return s.map((v) => {
    if (unit === 'pp' && goodUp) return +(v - 0.04).toFixed(2); // availability: prior window a touch lower
    if (unit === 'pp') return +(v + 0.12).toFixed(2);           // error rate: prior window a touch higher
    if (unit === 'ms') return Math.round(v * 1.07);             // latency: prior window ~7% slower
    return Math.round(v * 0.93);                                // throughput: prior window ~7% lower
  });
}

const SCORECARD: { name: string; grade: string; tone: 'health-up' | 'warning' | 'danger' }[] = [
  { name: 'Reliability', grade: 'A', tone: 'health-up' },
  { name: 'Security', grade: 'A', tone: 'health-up' },
  { name: 'Observability', grade: 'B', tone: 'warning' },
  { name: 'Documentation', grade: 'A', tone: 'health-up' },
  { name: 'Ownership', grade: 'A', tone: 'health-up' },
];

function MetricsTab({ svc, latencySpark }: { svc: PortalService; latencySpark: number[] }) {
  const lat = latencySpark.slice(-7);
  const within = (ok: boolean) =>
    ok ? <Pill tone="health-up" dot>within SLO</Pill> : <Pill tone="warning" dot>over SLO</Pill>;

  // Derived, deterministic throughput (requests/min) trend.
  const tputBase = 5200 + svc.coverage * 90 - svc.p95 * 3;
  const tput = Array.from({ length: 7 }, (_, i) =>
    Math.max(600, Math.round(tputBase * (0.9 + 0.018 * i) + Math.sin(i + svc.p95) * tputBase * 0.02)));

  const signals: {
    label: string; value: string; note: string; unit: SignalUnit; goodUp: boolean;
    series: number[]; badge?: React.ReactNode;
  }[] = [
    { label: 'Availability', value: '99.97%', note: 'SLO 99.95%', unit: 'pp', goodUp: true,
      series: [99.92, 99.95, 99.96, 99.95, 99.97, 99.96, 99.97], badge: within(true) },
    { label: 'p95 latency', value: `${svc.p95}ms`, note: 'SLO < 300ms', unit: 'ms', goodUp: false,
      series: lat, badge: within(svc.p95 <= 300) },
    { label: 'Error rate', value: '0.18%', note: 'SLO < 0.5%', unit: 'pp', goodUp: false,
      series: [0.40, 0.30, 0.50, 0.20, 0.20, 0.30, 0.18], badge: within(true) },
    { label: 'Throughput', value: `${(tput[tput.length - 1] / 1000).toFixed(1)}k`, note: 'requests / min', unit: 'pct', goodUp: true,
      series: tput },
  ];

  const facts = [`Coverage ${svc.coverage}%`, `v${svc.version}`, `${svc.deps?.length ?? 0} dependencies`, svc.squad]
    .filter(Boolean) as string[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div className="fp-section-title" style={{ marginBlockEnd: 10 }}>DORA metrics · last 30 days</div>
        <div className="fp-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {DORA.map((d) => (
            <MetricChartCard
              key={d.label}
              label={d.label}
              value={d.value}
              delta={{ label: d.delta, good: d.good }}
              series={d.spark}
              prev={d.spark.map((v, i) => +(v * (0.82 + 0.04 * ((i * 7) % 3))).toFixed(2))}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="fp-section-title" style={{ marginBlockEnd: 10 }}>Service metrics · golden signals</div>
        <div className="fp-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {signals.map((s) => (
            <MetricChartCard
              key={s.label}
              label={s.label}
              value={s.value}
              badge={s.badge}
              delta={deltaOf(s.series, s.unit, s.goodUp)}
              note={s.note}
              series={s.series}
              prev={ghostOf(s.series, s.unit, s.goodUp)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBlockStart: 12 }}>
          {facts.map((f) => <span key={f} className="fp-meta-chip mono">{f}</span>)}
        </div>
      </div>

      <div className="fp-card">
        <FCardHead title="Scorecard · Production readiness" action={<Pill tone="health-up" dot>Grade A</Pill>} />
        <FRows>
          {SCORECARD.map((s) => (
            <FRow key={s.name} style={{ paddingBlock: 10, fontSize: 'var(--text-sm)' }}>
              <span className="fp-row-main">{s.name}</span>
              <Pill tone={s.tone}>{s.grade}</Pill>
            </FRow>
          ))}
        </FRows>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ServiceDetailPage() {
  const params = useParams<{ service: string }>();
  const id = Array.isArray(params.service) ? params.service[0] : params.service;
  const svc = id ? getService(id) : undefined;
  const [tab, setTab] = React.useState<Tab>('Overview');

  if (!svc) {
    return (
      <>
        <FPageHeader title="Service not found" subtitle={`No service with id "${id}".`} />
        <Link className="ds-link-inline" href="/portal/catalog">
          ← Back to catalog
        </Link>
      </>
    );
  }

  // Sparkline data (24 h latency proxy based on p95)
  const latencySpark = React.useMemo(() => {
    const base = svc.p95;
    return Array.from({ length: 24 }, (_, n) =>
      Math.max(20, Math.round(base + Math.sin(n / 3) * base * 0.16)),
    );
  }, [svc.p95]);

  const SLOs = [
    {
      name: 'Availability',
      target: '99.95%',
      current: '99.97%',
      spark: [99.92, 99.95, 99.96, 99.95, 99.97, 99.96, 99.97],
    },
    {
      name: 'p95 latency',
      target: '< 300ms',
      current: `${svc.p95}ms`,
      spark: latencySpark.slice(-7),
    },
    {
      name: 'Error rate',
      target: '< 0.5%',
      current: '0.18%',
      spark: [0.4, 0.3, 0.5, 0.2, 0.2, 0.3, 0.18],
    },
  ];

  return (
    <>
      {/* Header */}
      {/* T4 detail header: no icon tile in front of the title; the back link
          rides the eyebrow and the title stands alone. */}
      <FPageHeader
        back={{ href: '/portal/catalog', label: 'Services' }}
        title={svc.name}
        status={<HealthBadge state={svc.alert ? 'degraded' : 'up'} pulse={svc.alert} />}
        subtitle={svc.summary}
        meta={
          <>
            <Pill tone="neutral" icon={<Icons.layers size={11} />}>{svc.tribe}</Pill>
            <LangBadge lang={svc.lang} />
            <Pill tone="neutral" icon={<Icons.tag size={11} />}>
              v{svc.version}
            </Pill>
            <Pill tone="neutral" icon={<Icons.deploy size={11} />}>
              deploy {svc.deploys}
            </Pill>
            <Pill tone="neutral" icon={<Icons.user size={11} />}>
              {svc.squad}
            </Pill>
            {svc.pii && (
              <Pill tone="warning" icon={<Icons.lock size={11} />}>
                PII · LGPD
              </Pill>
            )}
          </>
        }
        actions={
          <>
            <Button variant="ghost">
              <Icons.runbook size={13} /> Runbook
            </Button>
            <Button variant="ghost">
              <Icons.externalLink size={13} /> Open repo
            </Button>
            <Button variant="ember">
              <Icons.sparkle size={13} /> Ask Forge AI
            </Button>
          </>
        }
      />

      {/* Tab bar sits directly below the header */}
      <Tabs
        className="fp-flat-tabs"
        value={tab}
        onValueChange={(v) => setTab(v as Tab)}
        variant="line"
        style={{ marginBlockEnd: 'var(--fp-section-gap)' }}
      >
        <TabsList aria-label="Service sections">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview: no wrapper surface — content is flat on the page */}
        <TabsContent value="Overview">
          <OverviewTab svc={svc} SLOs={SLOs} />
        </TabsContent>
        <TabsContent value="Metrics">
          <MetricsTab svc={svc} latencySpark={latencySpark} />
        </TabsContent>
        <TabsContent value="Dependencies">
          <DepsTab svc={svc} />
        </TabsContent>
        <TabsContent value="API">
          <ApiTab svc={svc} />
        </TabsContent>
        <TabsContent value="CI/CD">
          <SoonTab tab="CI/CD" />
        </TabsContent>
        <TabsContent value="Incidents">
          <IncidentsTab />
        </TabsContent>
        <TabsContent value="Context">
          <ContextTab svc={svc} />
        </TabsContent>
        <TabsContent value="Settings">
          <SoonTab tab="Settings" />
        </TabsContent>
      </Tabs>
    </>
  );
}

// ── Overview tab ─────────────────────────────────────────────────────────────
type SloRow = { name: string; target: string; current: string; spark: number[] };

function OverviewTab({
  svc,
  SLOs,
}: {
  svc: PortalService;
  SLOs: SloRow[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Status banner — health-driven, first element inside Overview */}
      {svc.alert ? (
        <DegradedBanner svc={svc} />
      ) : (
        <Banner
          tone="success"
          icon="shield"
          title="Trusted"
          message="All quality gates green · ADR conformance 100% · 0 security findings open."
        />
      )}

      {/* Two-column layout: main (2fr) + aside (1fr) */}
      <div
        className="fp-grid"
        style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start', gap: 20 }}
      >
        {/* MAIN column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* About — README-style (metric cards now live in the Metrics tab) */}
          <div className="fp-card">
            <ServiceReadme svc={svc} />
            {svc.apis && svc.apis.length > 0 && (
              <>
                <div
                  className="fp-section-title"
                  style={{ marginBlockStart: 20 }}
                >
                  Exposed APIs
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {svc.apis.map((a) => (
                    <Pill key={a} tone="neutral" icon={<Icons.plug size={11} />}>
                      {a}
                    </Pill>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ASIDE column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* On-call · primary */}
          <div className="fp-card">
            <FCardHead
              title="On-call · primary"
              action={<Button variant="ghost" size="sm"><Icons.refresh size={11} /> Rotate</Button>}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '6px 0 10px',
              }}
            >
              <Avatar name={ON_CALL.name} size="lg" ember />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>
                  {ON_CALL.name}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                  {ON_CALL.role}
                </div>
              </div>
              <Button variant="ghost" size="sm" title="Page on-call">
                <Icons.bell size={12} /> Page
              </Button>
            </div>
            <div
              style={{
                borderBlockStart: '1px solid var(--border)',
                paddingBlockStart: 10,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--text-sm)',
                color: 'var(--fg-muted)',
              }}
            >
              <span>Shift ends</span>
              <RelativeTime value={ON_CALL.shiftEnds} />
            </div>
          </div>

          {/* Members with access */}
          <div className="fp-card">
            <FCardHead
              title="Members with access"
              action={<Button variant="ghost" size="sm" style={{ fontSize: 'var(--text-xs)' }}>Manage access</Button>}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0 4px' }}>
              <Avatar.Group max={6} size="sm">
                {TEAM_MEMBERS.map((m) => (
                  <Avatar key={m.name} name={m.name} size="sm" />
                ))}
              </Avatar.Group>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                {TEAM_MEMBERS.length} members
              </span>
            </div>
          </div>

          {/* SLO summary */}
          <div className="fp-card">
            <FCardHead title="SLO summary" action={<Pill tone="health-up" dot>All passing</Pill>} />
            <div className="tbl-wrap">
              <table className="tbl" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Indicator</th>
                    <th>Target</th>
                    <th style={{ textAlign: 'end' }}>Current</th>
                    <th style={{ textAlign: 'end' }}>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {SLOs.map((s) => (
                    <tr key={s.name}>
                      <td>{s.name}</td>
                      <td className="mono" style={{ color: 'var(--fg-muted)' }}>
                        {s.target}
                      </td>
                      <td className="mono" style={{ textAlign: 'end' }}>
                        {s.current}
                      </td>
                      <td style={{ textAlign: 'end' }}>
                        <Sparkline data={s.spark} w={70} h={22} color="var(--success)" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent incidents */}
          <div className="fp-card">
            <FCardHead
              title="Recent incidents"
              action={<a href="/portal/catalog" className="ds-link-inline" style={{ fontSize: 'var(--text-sm)' }}>View all</a>}
            />
            <FRows>
              {INCIDENTS.map((inc) => (
                <FRow key={inc.id} style={{ paddingBlock: 8 }}>
                  <SeverityPill level={inc.level} />
                  <div className="fp-row-main">
                    <div
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {inc.title}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--fg-muted)',
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      <span className="mono">{inc.id}</span>
                      <span>·</span>
                      <RelativeTime value={inc.when} />
                    </div>
                  </div>
                </FRow>
              ))}
            </FRows>
          </div>

          {/* Activity — summarized (last 4 events) */}
          <div className="fp-card">
            <FCardHead title="Activity" />
            <Timeline items={TIMELINE_ITEMS.slice(0, 4)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Degraded status banner (Forge AI explain) ─────────────────────────────────
function DegradedBanner({ svc }: { svc: PortalService }) {
  return (
    <div
      role="alert"
      style={{
        background: 'color-mix(in oklch, var(--danger) 10%, transparent)',
        border: '1px solid color-mix(in oklch, var(--danger) 30%, transparent)',
        borderRadius: 'var(--radius-2xl)',
        padding: '16px 18px',
        display: 'flex',
        gap: 14,
      }}
    >
      <IconBubble icon="alert" size={36} tone="danger" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBlockEnd: 6 }}>
          <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>Forge AI</strong>
          <Pill tone="danger" dot style={{ fontSize: 'var(--text-xs)' }}>
            degradation detected
          </Pill>
        </div>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            lineHeight: 1.55,
            margin: 0,
            color: 'var(--fg)',
          }}
        >
          The <strong>p99</strong> of <code className="mono">{svc.name}</code> rose{' '}
          <strong>41%</strong> since deploy <code className="mono">v{svc.version}</code>{' '}
          ({svc.deploys}). Over the same window, the dependency{' '}
          <Link className="ds-link-inline" href="/portal/catalog/konduto-antifraud">
            konduto-antifraud
          </Link>{' '}
          saw <strong>+18% false-positive rate</strong>. Likely cause: the new fraud-score rule in{' '}
          <code className="mono">v3.1.7</code>. Recommendation: <strong>rollback konduto-antifraud</strong>{' '}
          to <code className="mono">v3.1.6</code> or disable the rule via feature flag.
        </p>
        <div style={{ display: 'flex', gap: 8, marginBlockStart: 12, flexWrap: 'wrap' }}>
          <Button variant="ember" size="sm">
            <Icons.rollback size={12} /> Roll back
          </Button>
          <Button variant="ghost" size="sm">
            <Icons.deploy size={12} /> View deploy
          </Button>
          <Button variant="ghost" size="sm">
            <Icons.sparkle size={12} /> Open in Forge AI
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Dependencies tab ──────────────────────────────────────────────────────────
function DepsTab({ svc }: { svc: PortalService }) {
  const deps = (svc.deps ?? []).map((d) => getService(d)).filter(Boolean) as PortalService[];
  if (deps.length === 0)
    return (
      <div className="fp-card fp-empty">
        This service declares no internal dependencies.
      </div>
    );
  return (
    <div className="fp-card" style={{ padding: 0 }}>
      <div className="tbl-wrap">
        <table className="tbl" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Dependency</th>
              <th>Tribe</th>
              <th>Health</th>
              <th>P95</th>
              <th style={{ textAlign: 'end' }} />
            </tr>
          </thead>
          <tbody>
            {deps.map((d) => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td>{d.tribe}</td>
                <td>
                  <HealthBadge state={d.alert ? 'degraded' : 'up'} pulse={d.alert} />
                </td>
                <td className="mono">{d.p95}ms</td>
                <td style={{ textAlign: 'end' }}>
                  <Button variant="ghost" size="sm" asChild><Link href={`/portal/catalog/${d.id}`}>
                    Open <Icons.chevronRight size={12} />
                  </Link></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── API tab ───────────────────────────────────────────────────────────────────
// The SAME explorer as /portal/apis/[id] (Endpoints | OpenAPI | Try it), scoped
// to this service's APIs. With more than one API, a selector switches between
// them; the full detail is one click away.
function ApiTab({ svc }: { svc: PortalService }) {
  const apis = React.useMemo(() => APIS.filter((a) => a.service === svc.id), [svc.id]);
  const [apiId, setApiId] = React.useState(apis[0]?.id ?? '');
  React.useEffect(() => { setApiId(apis[0]?.id ?? ''); }, [apis]);
  const api = apis.find((a) => a.id === apiId) ?? apis[0];

  if (!api) {
    return (
      <div className="fp-empty">
        <Icons.braces size={16} />
        <span>This service exposes no registered API. Register one in <Link href="/portal/apis" className="u-link">APIs</Link>.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="fp-toolbar" style={{ marginBlockEnd: 14 }}>
        {apis.length > 1 && (
          <span className="fp-filter-select">
            <Select value={api.id} onValueChange={setApiId} options={apis.map((a) => ({ value: a.id, label: `${a.name} · ${a.kind} ${a.version}` }))} width="280px" />
          </span>
        )}
        <span className="fp-agents-count">{api.consumers} consumers · p95 {api.p95}ms</span>
        <span style={{ marginInlineStart: 'auto' }}>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/portal/apis/${api.id}`}><Icons.externalLink size={11} /> Full API page</Link>
          </Button>
        </span>
      </div>
      <ApiExplorer api={api} />
    </div>
  );
}

// ── Incidents tab ─────────────────────────────────────────────────────────────
function IncidentsTab() {
  return (
    <div className="fp-card">
      <FCardHead
        title="Recent incidents"
        action={<a href="/portal/catalog" className="ds-link-inline" style={{ fontSize: 'var(--text-sm)' }}>View all</a>}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {INCIDENTS.map((inc) => (
          <div
            key={inc.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 0',
              borderBlockStart: '1px solid var(--border)',
            }}
          >
            <SeverityPill level={inc.level} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {inc.title}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg-muted)',
                  display: 'flex',
                  gap: 6,
                }}
              >
                <span className="mono">{inc.id}</span>
                <span>·</span>
                <RelativeTime value={inc.when} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Context tab ───────────────────────────────────────────────────────────────

/**
 * Blast-radius formula (mirrors §2.1 of AGENTIC-PLATFORM-VISION.md):
 *   score = dependents_count + pii_bonus + critical_bonus
 * where:
 *   dependents_count = number of services in SERVICES whose deps include this id
 *   pii_bonus        = +2 if svc.pii is true
 *   critical_bonus   = +3 if the service id is in the hardcoded tier-0 set
 *                      (acerta-api, score-engine, decision-engine, consent-service,
 *                       scpc-gateway, konduto-antifraud — the revenue / compliance path)
 *
 * Thresholds:  score >= 8 = HIGH, >= 4 = MEDIUM, else LOW
 */
const TIER_0_IDS = new Set([
  'acerta-api',
  'score-engine',
  'decision-engine',
  'consent-service',
  'scpc-gateway',
  'konduto-antifraud',
]);

function computeBlastRadius(svc: PortalService): {
  score: number;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  dependents: PortalService[];
  pii: boolean;
  tier0: boolean;
} {
  const dependents = SERVICES.filter((s) => s.deps?.includes(svc.id) && s.id !== svc.id);
  const pii = svc.pii === true;
  const tier0 = TIER_0_IDS.has(svc.id);
  const score = dependents.length + (pii ? 2 : 0) + (tier0 ? 3 : 0);
  const level: 'HIGH' | 'MEDIUM' | 'LOW' = score >= 8 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW';
  return { score, level, dependents, pii, tier0 };
}

/** Contexts that are plausibly relevant to a given service — deterministic subset. */
const SERVICE_CONTEXT_IDS: Record<string, string[]> = {
  'acerta-api':         ['catalog', 'slo', 'consent', 'runbooks', 'scoremodels', 'apidocs'],
  'score-engine':       ['catalog', 'slo', 'features', 'scoremodels', 'dashboards'],
  'konduto-antifraud':  ['catalog', 'fraudrules', 'incidents', 'runbooks', 'features'],
  'scpc-gateway':       ['catalog', 'bureau', 'slo', 'runbooks', 'conf-bureau'],
  'identity-proofing':  ['catalog', 'consent', 'conf-lgpd', 'apidocs'],
  'consent-service':    ['catalog', 'consent', 'conf-lgpd', 'secrets', 'apidocs'],
  'decision-engine':    ['catalog', 'slo', 'scoremodels', 'apidocs', 'dashboards'],
  'bureau-ingestion':   ['catalog', 'bureau', 'scr', 'upload-scr', 'conf-bureau'],
  'device-fingerprint': ['catalog', 'fraudrules', 'incidents', 'apidocs'],
  'audit-trail':        ['catalog', 'secrets', 'conf-lgpd', 'apidocs'],
};
const FALLBACK_CONTEXT_IDS = ['catalog', 'slo', 'runbooks'];

function getContextsForService(id: string) {
  const ids = SERVICE_CONTEXT_IDS[id] ?? FALLBACK_CONTEXT_IDS;
  return ids.map((cid) => CONTEXTS.find((c) => c.id === cid)).filter(Boolean) as typeof CONTEXTS;
}

/** ADRs that apply to a service — matched by tag overlap or service name mention. */
function getAdrsForService(svc: PortalService) {
  const nameWords = svc.name.toLowerCase().split(/[-_]/);
  const tribeWords = svc.tribe.toLowerCase().split(/[\s&]+/);
  return ADRS.filter((adr) => {
    if (adr.status === 'deprecated' || adr.status === 'superseded') return false;
    const combined = [...adr.tags, adr.context.toLowerCase(), adr.title.toLowerCase()].join(' ');
    if (svc.pii && (adr.tags.includes('lgpd') || adr.tags.includes('security'))) return true;
    if (nameWords.some((w) => w.length > 3 && combined.includes(w))) return true;
    if (tribeWords.some((w) => w.length > 3 && combined.includes(w))) return true;
    // platform ADRs (delivery, reliability, api) apply to everyone
    if (['delivery', 'reliability', 'api', 'platform'].some((t) => adr.tags.includes(t))) return true;
    return false;
  }).slice(0, 4);
}

/** Runbooks for this service. */
function getRunbooksForService(id: string) {
  return RUNBOOKS.filter((r) => r.service === id);
}

/** Recent events from the static timeline — reused from module-level TIMELINE_ITEMS. */
const RECENT_EVENTS_SUMMARY = [
  { label: 'Deploy v4.12.0 promoted (Ring 4)', when: '2h ago', service: 'acerta-api' },
  { label: 'PR #5218 merged (CPF enrichment)', when: '90m ago', service: 'acerta-api' },
  { label: 'P2 alert: p95 above SLO', when: '6h ago', service: 'acerta-api' },
];

/** Thin-context reasons for a service (derived, not from data files). */
function thinContextReasons(svc: PortalService, runbooks: typeof RUNBOOKS, adrs: typeof ADRS): string[] {
  const reasons: string[] = [];
  if (!svc.squad) reasons.push('owner');
  if (runbooks.length === 0) reasons.push('runbooks');
  if (adrs.length === 0) reasons.push('ADRs');
  // docs coverage: generic services without the flagship README
  if (svc.id !== 'acerta-api' && !SERVICE_CONTEXT_IDS[svc.id]) reasons.push('docs');
  return reasons;
}

/** Scorecard grades for a service derived from the readiness + docs scorecards. */
function getScorecardGrades(id: string): Array<{ name: string; overall: number }> {
  return ['readiness', 'docs', 'security'].map((sid) => {
    const view = buildScorecard(sid as 'readiness' | 'docs' | 'security');
    const row = view.rows.find((r) => r.id === id);
    return row ? { name: view.scorecard.name, overall: row.overall } : null;
  }).filter(Boolean) as Array<{ name: string; overall: number }>;
}

function gradeFromScore(score: number): { letter: string; tone: 'health-up' | 'warning' | 'danger' } {
  if (score >= 85) return { letter: 'A', tone: 'health-up' };
  if (score >= 70) return { letter: 'B', tone: 'health-up' };
  if (score >= 55) return { letter: 'C', tone: 'warning' };
  return { letter: 'D', tone: 'danger' };
}

/** Format a compact YAML-ish agent payload from service data. */
function buildAgentPayload(svc: PortalService, dependents: PortalService[], adrs: typeof ADRS, runbooks: typeof RUNBOOKS, blast: ReturnType<typeof computeBlastRadius>): string {
  const deps = svc.deps ?? [];
  const adrsLine = adrs.map((a) => `${a.id}: ${a.title}`).join('\n    ');
  const runbooksLine = runbooks.map((r) => `${r.id}: ${r.title} (${r.automation}, ${r.success}% success)`).join('\n    ');
  const dependentsLine = dependents.map((d) => `${d.id} [${d.tribe}]`).join(', ');
  return [
    `# agent context bundle — ${svc.name}`,
    `service:`,
    `  id: ${svc.id}`,
    `  name: ${svc.name}`,
    `  lang: ${svc.lang}`,
    `  tribe: ${svc.tribe}`,
    `  squad: ${svc.squad}`,
    `  version: v${svc.version}`,
    `  pii: ${svc.pii ? 'true' : 'false'}`,
    `  data_class: ${svc.pii ? 'PII / Restricted' : 'Internal'}`,
    `blast_radius:`,
    `  score: ${blast.score}`,
    `  level: ${blast.level}`,
    `  dependents: ${blast.dependents.length}`,
    deps.length > 0 ? `dependencies_out:\n  - ${deps.join('\n  - ')}` : `dependencies_out: []`,
    dependents.length > 0 ? `dependencies_in:\n  - ${dependentsLine}` : `dependencies_in: []`,
    `runbooks:`,
    runbooks.length > 0 ? `  - ${runbooksLine}` : `  (none attached)`,
    `governance:`,
    adrs.length > 0 ? `  adrs:\n    ${adrsLine}` : `  adrs: (none matched)`,
    `on_call: ${ON_CALL.name} (${ON_CALL.role})`,
  ].join('\n');
}

function BlastRadiusChip({ blast }: { blast: ReturnType<typeof computeBlastRadius> }) {
  const tone = blast.level === 'HIGH' ? 'danger' : blast.level === 'MEDIUM' ? 'warning' : 'neutral';
  return (
    <Pill
      tone={tone}
      dot
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        padding: '3px 10px',
      }}
    >
      Blast radius {blast.level} &middot; {blast.dependents.length} dependents
      {blast.pii ? ' · PII' : ''}
      {blast.tier0 ? ' · tier-0' : ''}
    </Pill>
  );
}

function ContextTab({ svc }: { svc: PortalService }) {
  const [agentView, setAgentView] = React.useState(false);

  const blast = React.useMemo(() => computeBlastRadius(svc), [svc]);
  const adrs = React.useMemo(() => getAdrsForService(svc), [svc]);
  const runbooks = React.useMemo(() => getRunbooksForService(svc.id), [svc.id]);
  const contexts = React.useMemo(() => getContextsForService(svc.id), [svc.id]);
  const grades = React.useMemo(() => getScorecardGrades(svc.id), [svc.id]);
  const thinReasons = React.useMemo(() => thinContextReasons(svc, runbooks, adrs), [svc, runbooks, adrs]);

  const deps = (svc.deps ?? []).map((d) => SERVICES.find((s) => s.id === d)).filter(Boolean) as PortalService[];
  const agentPayload = React.useMemo(
    () => buildAgentPayload(svc, blast.dependents, adrs, runbooks, blast),
    [svc, blast, adrs, runbooks],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Thin-context warning */}
      {thinReasons.length > 0 && (
        <div
          role="alert"
          style={{
            background: 'color-mix(in oklch, var(--warning) 10%, transparent)',
            border: '1px solid color-mix(in oklch, var(--warning) 30%, transparent)',
            borderRadius: 'var(--radius-xl)',
            padding: '12px 16px',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <Icons.alert size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginBlockStart: 2 }} />
          <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--fg)' }}>Thin context:</strong>{' '}
            <span style={{ color: 'var(--fg)' }}>
              agents acting on this service are missing{' '}
              <strong>{thinReasons.join(', ')}</strong>.
              Enrich the catalog to enable safer autonomous operations.
            </span>
          </div>
        </div>
      )}

      {/* Blast radius + view-as-agent toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <BlastRadiusChip blast={blast} />
        <Button
          variant={agentView ? 'outline' : 'ghost'}
          size="sm"
          onClick={() => setAgentView((v) => !v)}
          aria-pressed={agentView}
        >
          <Icons.sparkle size={12} />
          {agentView ? 'Human view' : 'View as agent'}
        </Button>
      </div>

      {/* Agent payload view */}
      {agentView && (
        <div className="fp-card" style={{ padding: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBlockEnd: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Agent context bundle
            </span>
            <Pill tone="neutral" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
              YAML preview
            </Pill>
          </div>
          <pre
            className="mono"
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
              padding: 16,
              fontSize: 'var(--text-xs)',
              lineHeight: 1.65,
              overflowX: 'auto',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {agentPayload}
          </pre>
        </div>
      )}

      {/* Two-column layout: left (ownership + deps + governance) · right (knowledge + data) */}
      <div
        className="fp-grid"
        style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start', gap: 14 }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Ownership */}
          <div className="fp-card">
            <FCardHead title="Ownership" />
            <FRows>
              <FRow style={{ paddingBlock: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', minInlineSize: 72 }}>Squad</span>
                <span className="fp-row-main" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{svc.squad}</span>
              </FRow>
              <FRow style={{ paddingBlock: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', minInlineSize: 72 }}>Tribe</span>
                <span className="fp-row-main" style={{ fontSize: 'var(--text-sm)' }}>{svc.tribe}</span>
              </FRow>
              <FRow style={{ paddingBlock: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', minInlineSize: 72 }}>On-call</span>
                <span className="fp-row-main" style={{ fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={ON_CALL.name} size="xs" />
                  {ON_CALL.name}
                </span>
              </FRow>
              <FRow style={{ paddingBlock: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', minInlineSize: 72 }}>Team</span>
                <span className="fp-row-main">
                  <Avatar.Group max={4} size="xs">
                    {TEAM_MEMBERS.slice(0, 5).map((m) => (
                      <Avatar key={m.name} name={m.name} size="xs" />
                    ))}
                  </Avatar.Group>
                </span>
              </FRow>
            </FRows>
          </div>

          {/* Dependencies — both directions in ONE card (an empty "in" list is a
              quiet line, not a card of its own). */}
          <div className="fp-card">
            <FCardHead
              title="Dependencies"
              action={
                <Pill tone="neutral" style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
                  {deps.length} out · {blast.dependents.length} in
                </Pill>
              }
            />
            {([
              { key: 'out', label: 'Calls', list: deps, empty: 'No outbound dependencies.' },
              { key: 'in', label: 'Called by', list: blast.dependents, empty: 'No known callers.' },
            ] as const).map((sec, i) => (
              <React.Fragment key={sec.key}>
                <div
                  className="mono"
                  style={{
                    fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.05em',
                    color: 'var(--fg-faint)', marginBlockStart: i === 0 ? 6 : 14, marginBlockEnd: 2,
                  }}
                >
                  {sec.label}
                </div>
                {sec.list.length === 0 ? (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>{sec.empty}</div>
                ) : (
                  <FRows>
                    {sec.list.map((d) => (
                      <FRow key={d.id} style={{ paddingBlock: 7 }}>
                        <HealthBadge state={d.alert ? 'degraded' : 'up'} pulse={d.alert} />
                        <div className="fp-row-main" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Link
                            href={`/portal/catalog/${d.id}`}
                            className="ds-link-inline"
                            style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}
                          >
                            {d.name}
                          </Link>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{d.tribe}</span>
                        </div>
                      </FRow>
                    ))}
                  </FRows>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Governance: ADRs + scorecard grades */}
          <div className="fp-card">
            <FCardHead
              title="Governance"
              action={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/architecture">All ADRs</Link>
                </Button>
              }
            />
            {adrs.length === 0 ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', paddingBlockStart: 6 }}>
                No ADRs matched for this service.
              </div>
            ) : (
              <FRows>
                {adrs.map((adr) => {
                  const meta = ADR_STATUS_META[adr.status];
                  return (
                    <FRow key={adr.id} style={{ paddingBlock: 8, alignItems: 'flex-start' }}>
                      <div className="fp-row-main" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1.35 }}>
                          {adr.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
                          {adr.id} &middot; {adr.owner}
                        </div>
                      </div>
                      <Pill tone={meta.tone} style={{ flexShrink: 0, fontSize: 'var(--text-xs)' }}>
                        {meta.label}
                      </Pill>
                    </FRow>
                  );
                })}
              </FRows>
            )}
            {grades.length > 0 && (
              <>
                <div className="fp-section-title" style={{ marginBlockStart: 14, marginBlockEnd: 8 }}>Scorecard grades</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {grades.map((g) => {
                    const { letter, tone } = gradeFromScore(g.overall);
                    return (
                      <div
                        key={g.name}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4,
                          padding: '8px 14px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-lg)',
                        }}
                      >
                        <Pill tone={tone} style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
                          {letter}
                        </Pill>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textAlign: 'center' }}>
                          {g.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Data classification */}
          <div className="fp-card">
            <FCardHead title="Data classification" />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBlockStart: 6 }}>
              {svc.pii ? (
                <>
                  <Pill tone="warning" icon={<Icons.lock size={11} />}>PII</Pill>
                  <Pill tone="warning" icon={<Icons.lock size={11} />}>LGPD in-scope</Pill>
                  <Pill tone="neutral">Restricted</Pill>
                </>
              ) : (
                <Pill tone="neutral">Internal</Pill>
              )}
              <Pill tone="neutral" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                {svc.lang}
              </Pill>
              {TIER_0_IDS.has(svc.id) && (
                <Pill tone="danger" dot>tier-0</Pill>
              )}
            </div>
          </div>

          {/* Attached contexts */}
          <div className="fp-card">
            <FCardHead
              title="Attached contexts"
              action={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/contexts">Context lake</Link>
                </Button>
              }
            />
            {contexts.length === 0 ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', paddingBlockStart: 6 }}>
                No contexts attached.
              </div>
            ) : (
              <FRows>
                {contexts.map((ctx) => (
                  <FRow key={ctx.id} style={{ paddingBlock: 7 }}>
                    <div
                      className="fp-ctx-ic"
                      aria-hidden="true"
                    >
                      <Icons.database size={13} />
                    </div>
                    <div className="fp-row-main">
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{ctx.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                        {ctx.desc}
                      </div>
                    </div>
                    {/* Quiet mono label: with one source for nearly every row, a
                        pill repeated down the column is noise, not information. */}
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', flexShrink: 0 }}>
                      {ctx.source}
                    </span>
                  </FRow>
                ))}
              </FRows>
            )}
          </div>

          {/* Runbooks */}
          <div className="fp-card">
            <FCardHead
              title="Runbooks"
              action={
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/portal/runbooks">All runbooks</Link>
                </Button>
              }
            />
            {runbooks.length === 0 ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', paddingBlockStart: 6 }}>
                No runbooks attached to this service.
              </div>
            ) : (
              <FRows>
                {runbooks.map((rb) => (
                  <FRow key={rb.id} style={{ paddingBlock: 8, alignItems: 'flex-start' }}>
                    <div className="fp-row-main" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, lineHeight: 1.35 }}>
                        {rb.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                        {rb.category} &middot; {rb.avg} avg &middot; {rb.success}% success
                      </div>
                    </div>
                    <Pill
                      tone={rb.automation === 'automated' ? 'health-up' : rb.automation === 'semi' ? 'ice' : 'warning'}
                      style={{ flexShrink: 0, fontSize: 'var(--text-xs)' }}
                    >
                      {rb.automation === 'automated' ? 'Automated' : rb.automation === 'semi' ? 'Semi-auto' : 'Manual'}
                    </Pill>
                  </FRow>
                ))}
              </FRows>
            )}
          </div>

          {/* Recent changes */}
          <div className="fp-card">
            <FCardHead title="Recent changes" />
            <FRows>
              <FRow style={{ paddingBlock: 8 }}>
                <Icons.deploy size={13} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
                <div className="fp-row-main">
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                    Deploy v{svc.version} to production
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                    {svc.deploys}
                  </div>
                </div>
              </FRow>
              {svc.id === 'acerta-api' && RECENT_EVENTS_SUMMARY.slice(0, 2).map((ev, i) => (
                <FRow key={i} style={{ paddingBlock: 8 }}>
                  <Icons.gitPullRequest size={13} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
                  <div className="fp-row-main">
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{ev.label}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{ev.when}</div>
                  </div>
                </FRow>
              ))}
            </FRows>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Coming soon placeholder ───────────────────────────────────────────────────
function SoonTab({ tab }: { tab: string }) {
  return (
    <div className="fp-card fp-empty">
      <div style={{ fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 6 }}>
        {tab} · next increment
      </div>
      <div>
        This tab ships in the next Forge slice. The structure and data are already ready to wire
        up.
      </div>
    </div>
  );
}
