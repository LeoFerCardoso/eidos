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
  Sparkline,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tabs,
  Timeline,
} from '@/ds/core';
import { FPageHeader, FKpi, FSection, IconBubble, FCardHead, FRows, FRow, Sub } from '@/portal/shell/portal-shell';
import { getService, type PortalService } from '@/portal/data/services';

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = ['Overview', 'Metrics', 'Dependencies', 'API', 'CI/CD', 'Incidents', 'Settings'] as const;
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
    `- **p95 latency** — ${svc.p95}ms`,
    `- **Test coverage** — ${svc.coverage}%`,
    `- **Language** — ${svc.lang}`,
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
  { label: 'Deploy frequency', value: '7 / wk', delta: '+16%', spark: [3, 4, 4, 5, 5, 6, 7] },
  { label: 'Lead time', value: '1.8h', delta: '−21%', spark: [3.1, 2.8, 2.6, 2.3, 2.1, 1.9, 1.8] },
  { label: 'Change-fail rate', value: '6%', delta: '−2pp', spark: [11, 10, 9, 8, 7, 7, 6] },
  { label: 'MTTR', value: '26m', delta: '−13%', spark: [44, 40, 36, 33, 30, 28, 26] },
];

const SCORECARD: { name: string; grade: string; tone: 'health-up' | 'warning' | 'danger' }[] = [
  { name: 'Reliability', grade: 'A', tone: 'health-up' },
  { name: 'Security', grade: 'A', tone: 'health-up' },
  { name: 'Observability', grade: 'B', tone: 'warning' },
  { name: 'Documentation', grade: 'A', tone: 'health-up' },
  { name: 'Ownership', grade: 'A', tone: 'health-up' },
];

function MetricsTab({ svc, latencySpark }: { svc: PortalService; latencySpark: number[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div className="fp-section-title" style={{ marginBlockEnd: 10 }}>DORA metrics · last 30 days</div>
        <div className="fp-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {DORA.map((d) => (
            <FKpi
              key={d.label}
              label={d.label}
              value={d.value}
              sub={<Sub><span style={{ color: 'var(--success)' }}>{d.delta}</span> vs prev</Sub>}
              trendNode={<Sparkline data={d.spark} w={84} h={24} color="var(--success)" />}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="fp-section-title" style={{ marginBlockEnd: 10 }}>Service metrics</div>
        <div className="fp-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
          <FKpi label="p95 Latency" value={`${svc.p95}ms`} sub={<Sub muted>SLO 300ms</Sub>} trendNode={<Sparkline data={latencySpark.slice(-7)} w={80} h={22} />} />
          <FKpi label="Coverage" value={`${svc.coverage}%`} sub={<Sub muted>tests</Sub>} />
          <FKpi label="Dependencies" value={svc.deps?.length ?? 0} sub={<Sub muted>services</Sub>} />
          <FKpi label="Version" value={`v${svc.version}`} sub={<Sub muted>current</Sub>} />
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
      <FPageHeader
        eyebrow={svc.tribe}
        leading={<IconBubble icon="server" size={40} tone={svc.alert ? 'danger' : 'ember'} />}
        title={svc.name}
        status={<HealthBadge state={svc.alert ? 'degraded' : 'up'} pulse={svc.alert} />}
        subtitle={svc.summary}
        meta={
          <>
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
function ApiTab({ svc }: { svc: PortalService }) {
  const apis = svc.apis ?? [];
  return (
    <div className="fp-card">
      <div className="fp-section-title">API Contract</div>
      {apis.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBlockEnd: 12 }}>
          {apis.map((a) => (
            <Pill key={a} tone="neutral" icon={<Icons.plug size={11} />}>
              {a}
            </Pill>
          ))}
        </div>
      )}
      <pre
        className="mono"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: 14,
          fontSize: 'var(--text-xs)',
          overflowX: 'auto',
          margin: 0,
        }}
      >{`POST /v1/${svc.name.replace(/-api$/, '')}/query
Authorization: Bearer <token>
Content-Type: application/json

{ "document": "***********", "product": "${(apis[0] ?? '—')}" }`}</pre>
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
