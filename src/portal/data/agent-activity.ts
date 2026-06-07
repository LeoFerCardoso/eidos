// Forge (IDP Portal) — agent-fleet activity for the Home.
//
// The Home is mission control over an autonomous agent workforce, not a human
// inbox. Three tiers of human involvement, ranked by how much they demand of you:
//
//   DECIDE  — the SMALL set agents escalated because a governance GUARDRAIL fired
//             (touches PII/LGPD, prod data migration, breaking API, cost, security).
//             This is the only queue, and it is small by design.
//   STEER   — AI-Insights: deep, forward-looking architectural risk + an
//             agent-drafted remediation. You set direction, not implementation.
//   OBSERVE — the agent workstream: what the fleet did (mostly DONE), is doing, or
//             will do. Every item is auditable + reversible (Port's "autonomy with
//             auditability"): it carries the checks that passed and a rollback.
//
// Domain: Equifax / Boa Vista credit bureau (see services.ts for the service ids).
import type { Tribe } from './services';

// ── System KPIs — the agentic system's output, not a human backlog ─────────────

export interface SystemKpi {
  key: string;
  label: string;
  /** the headline number — animated from 0 with the DS <CountUp/>. */
  to: number;
  /** static text appended after the animated number (e.g. " / 11"). */
  suffix?: string;
  /** small caption under the value. */
  sub?: string;
  /** 7-point trend series for the sparkline (optional). */
  series?: number[];
  /** signed delta for the Trend chip. */
  delta?: number;
  unit?: string;
  /** lower is better (interventions, risks) → green when delta is negative. */
  inverted?: boolean;
  tone?: 'success' | 'ember' | 'neutral';
  href: string;
}

export const SYSTEM_KPIS: SystemKpi[] = [
  {
    key: 'shipped',
    label: 'Shipped by agents · wk',
    to: 31,
    series: [18, 21, 19, 24, 27, 29, 31],
    delta: 9,
    unit: '%',
    tone: 'success',
    href: '/portal/agents',
  },
  {
    key: 'auto-resolved',
    label: 'Auto-resolved incidents',
    to: 9,
    suffix: ' / 11',
    sub: '2 escalated to you',
    delta: 18,
    unit: '%',
    href: '/portal/agents',
  },
  {
    key: 'interventions',
    label: 'Interventions needed',
    to: 2,
    // No Trend chip: the arrow glyph tracks good/bad, not numeric direction, so
    // an improvement (5 → 2) would render an up-arrow that fights this caption.
    sub: 'down from 5 last week',
    href: '#decide',
  },
  {
    key: 'risks',
    label: 'Risks open',
    to: 4,
    sub: '1 critical · 3 high',
    href: '/portal/insights',
  },
];

// ── DECIDE — human-in-the-loop decisions a guardrail escalated ─────────────────

/** The governance guardrail that forced this to a human. The badge names it. */
export type Guardrail =
  | 'PII · LGPD'
  | 'Prod data migration'
  | 'Breaking API'
  | 'Cost'
  | 'Security';

export type RiskLevel = 'crit' | 'high' | 'med';

export interface Decision {
  id: string;
  /** what the agent wants to do. */
  title: string;
  service: string;
  agent: string;
  /** which guardrail fired → why this needs a human at all. */
  guardrail: Guardrail;
  risk: RiskLevel;
  /** one line: why the policy holds this for a human. */
  why: string;
  /** the agent's recommendation, already worked out. */
  recommendation: string;
  /** true when the proposed change is a reversible migration. */
  reversible?: boolean;
  when: string;
  href: string;
}

export const DECISIONS: Decision[] = [
  {
    id: 'd1',
    title: 'Promote fraud-score rule v3.2.0 to production',
    service: 'konduto-antifraud',
    agent: 'Sentinel',
    guardrail: 'PII · LGPD',
    risk: 'high',
    why: 'Changes scoring on real CPF data, so policy requires a human sign-off.',
    recommendation:
      'Canary on 5% of traffic for 24h was clean: false-positive rate down 12%, no latency regression. Recommend full rollout.',
    when: 'escalated 40m ago',
    href: '/portal/catalog/konduto-antifraud',
  },
  {
    id: 'd2',
    title: 'Apply PII retention fix to consent-service',
    service: 'consent-service',
    agent: 'Forge AI',
    guardrail: 'Prod data migration',
    risk: 'crit',
    why: 'Drops a column holding PII past its retention window, in production.',
    recommendation:
      'Reversible migration drafted and verified on staging (0 rows orphaned). Recommend approve for the next change window.',
    reversible: true,
    when: 'escalated 2h ago',
    href: '/portal/catalog/consent-service',
  },
];

// ── OBSERVE — the agent workstream (auditable + reversible) ────────────────────

export type WorkStatus = 'done' | 'inflight' | 'scheduled';

export interface AgentWork {
  id: string;
  agent: string;
  /** what the agent did / is doing. */
  title: string;
  service: string;
  status: WorkStatus;
  /** the outcome in one phrase (the impact). */
  impact: string;
  /** what it touched — scope of the change (for auditability). */
  scope: string;
  /** the checks that passed → the trust signal. Empty while inflight/scheduled. */
  checks?: string[];
  /** is the change reversible in one click? */
  reversible?: boolean;
  when: string;
  href: string;
}

/** Roll-up shown above the workstream feed. */
export const WORKSTREAM_SUMMARY = {
  shipped: 31,
  regressions: 0,
  hoursSaved: 14,
  coverageDelta: 3,
};

export const WORKSTREAM: AgentWork[] = [
  {
    id: 'w1',
    agent: 'Forge AI',
    title: 'Rolled back acerta-api to v4.11.3 after a p99 regression',
    service: 'acerta-api',
    status: 'done',
    impact: 'p99 back to 240ms (was 339ms)',
    scope: '1 deploy reverted · 0 schema changes',
    checks: ['build', 'integration tests', 'p99 probe'],
    reversible: true,
    when: '2h ago',
    href: '/portal/catalog/acerta-api',
  },
  {
    id: 'w2',
    agent: 'Sentinel',
    title: 'Patched CVE-2026-1847 in onescore-gateway',
    service: 'onescore-gateway',
    status: 'done',
    impact: '1 high-severity CVE closed',
    scope: 'jwt library 8.5.1 → 9.0.2 · 3 files',
    checks: ['build', 'unit tests', 'dependency scan'],
    reversible: true,
    when: '5h ago',
    href: '/portal/catalog/onescore-gateway',
  },
  {
    id: 'w3',
    agent: 'Testsmith',
    title: 'Raised score-engine test coverage',
    service: 'score-engine',
    status: 'done',
    impact: 'coverage 84% → 91%',
    scope: '37 generated tests · 0 source changes',
    checks: ['build', 'tests', 'mutation score'],
    reversible: true,
    when: '8h ago',
    href: '/portal/catalog/score-engine',
  },
  {
    id: 'w4',
    agent: 'Depbot',
    title: 'Bumped 12 dependencies across 4 services',
    service: '4 services',
    status: 'done',
    impact: 'all gates green · 0 regressions',
    scope: '12 minor/patch bumps · lockfiles only',
    checks: ['build', 'tests', 'license check'],
    reversible: true,
    when: '11h ago',
    href: '/portal/agents',
  },
  {
    id: 'w5',
    agent: 'Sentinel',
    title: 'Scanning bureau-ingestion for SQL-injection patterns',
    service: 'bureau-ingestion',
    status: 'inflight',
    impact: 'about 60% complete',
    scope: '142 query sites analyzed so far',
    when: 'running now',
    href: '/portal/catalog/bureau-ingestion',
  },
  {
    id: 'w6',
    agent: 'Forge AI',
    title: 'Nightly golden-path drift sweep across the estate',
    service: 'estate-wide',
    status: 'scheduled',
    impact: 'flags services off the paved road',
    scope: 'all 30 services',
    when: 'tonight at 22:00',
    href: '/portal/agents',
  },
];

// ── STEER — AI-Insights (top, for the Home; full radar lives in Slice B) ───────

export type InsightType = 'slo' | 'spof' | 'drift' | 'lgpd' | 'scaling' | 'security';

/** How much of a human this insight needs to move forward. */
export type Autonomy = 'agent-can-resolve' | 'needs-ok' | 'needs-arch-decision';

export type InsightSeverity = 'crit' | 'high' | 'med';
export type InsightStatus = 'open' | 'resolved';

export interface Insight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  /** display label e.g. "~5 wk", "now". */
  horizon: string;
  /** weeks until it bites (0 = now/live) — drives the horizon triage buckets. */
  weeks: number;
  title: string;
  tribe: Tribe;
  /** what fails / who is affected, in one phrase. */
  blastRadius: string;
  /** service ids this insight touches (resolve via getService for chips). */
  affectedServices: string[];
  /** the one-line evidence behind the call. */
  evidence: string;
  /** the remediation an agent already drafted. */
  remediation: string;
  autonomy: Autonomy;
  status: InsightStatus;
  /** resolved-only: when + who/what closed it. */
  resolvedWhen?: string;
  resolvedBy?: string;
  href: string;
}

export const INSIGHTS: Insight[] = [
  {
    id: 'i2',
    type: 'spof',
    severity: 'crit',
    horizon: 'now',
    weeks: 0,
    title: 'konduto-antifraud is a single point of failure for 4 downstream services',
    tribe: 'Anti-Fraud',
    blastRadius: 'Acerta product line · OneScore',
    affectedServices: ['konduto-antifraud', 'acerta-api', 'onescore-gateway'],
    evidence: 'The fraud-score call has no fallback or circuit-breaker; one outage stalls the Acerta line.',
    remediation: 'Agent proposed a circuit-breaker plus a degraded-mode scoring rule.',
    autonomy: 'needs-ok',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i4',
    type: 'lgpd',
    severity: 'crit',
    horizon: '~1 wk',
    weeks: 1,
    title: 'consent-service retains PII past its policy window on 1 table',
    tribe: 'Identity',
    blastRadius: 'LGPD audit exposure',
    affectedServices: ['consent-service'],
    evidence: 'A retention-job misconfiguration leaves consent_events 40 days beyond the policy limit.',
    remediation: 'Agent drafted the retention-job fix as a reversible migration (see DECIDE).',
    autonomy: 'needs-ok',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i5',
    type: 'scaling',
    severity: 'high',
    horizon: '~2 wk',
    weeks: 2,
    title: 'ignite-feature-store heap grows unbounded under the new feature set',
    tribe: 'Platform',
    blastRadius: 'Score & Risk feature serving',
    affectedServices: ['ignite-feature-store'],
    evidence: 'Resident memory climbs ~6% per day since v2.4; at trend it hits the pod limit and OOMs in ~2 weeks.',
    remediation: 'Agent drafted an eviction-policy patch plus a heap-profile dashboard.',
    autonomy: 'needs-ok',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i6',
    type: 'lgpd',
    severity: 'med',
    horizon: '~2 wk',
    weeks: 2,
    title: 'device-fingerprint stores raw client IPs beyond the retention policy',
    tribe: 'Anti-Fraud',
    blastRadius: 'LGPD exposure on telemetry',
    affectedServices: ['device-fingerprint'],
    evidence: 'Raw IPs persist 90 days in the events table; policy caps PII-adjacent telemetry at 30.',
    remediation: 'Agent can ship a hashing + 30-day TTL migration automatically.',
    autonomy: 'agent-can-resolve',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i3',
    type: 'drift',
    severity: 'high',
    horizon: '~3 wk',
    weeks: 3,
    title: '6 services still authenticate against the deprecated SCPC gateway',
    tribe: 'Data & Bureau',
    blastRadius: 'Identity · Data & Bureau',
    affectedServices: ['scpc-gateway', 'bureau-ingestion', 'cadastro-positivo-ingestor', 'identity-proofing'],
    evidence: 'scpc-gateway is scheduled for deprecation; 6 direct integrations remain on the legacy auth path.',
    remediation: 'Agents can migrate 4 automatically; 2 touch PII and route to you for sign-off.',
    autonomy: 'agent-can-resolve',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i7',
    type: 'scaling',
    severity: 'med',
    horizon: '~3 wk',
    weeks: 3,
    title: 'webhook-dispatcher retries are unbounded and can hammer partner endpoints',
    tribe: 'Decisioning',
    blastRadius: 'Partner integrations',
    affectedServices: ['webhook-dispatcher'],
    evidence: 'No backoff cap on 5xx; a slow partner triggers an exponential retry storm.',
    remediation: 'Agent can add capped exponential backoff plus a per-partner circuit-breaker.',
    autonomy: 'agent-can-resolve',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i8',
    type: 'security',
    severity: 'high',
    horizon: '~4 wk',
    weeks: 4,
    title: 'audit-trail writes to a single region, so a region outage drops audit events',
    tribe: 'Platform',
    blastRadius: 'Compliance · audit completeness',
    affectedServices: ['audit-trail'],
    evidence: 'The write path has no cross-region replication; an outage loses events with no backfill.',
    remediation: 'Agent drafted a dual-region write-ahead log RFC.',
    autonomy: 'needs-arch-decision',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i9',
    type: 'spof',
    severity: 'med',
    horizon: '~4 wk',
    weeks: 4,
    title: 'bureau-ingestion has no rate limit on the SCPC feed, risking backpressure',
    tribe: 'Data & Bureau',
    blastRadius: 'Bureau data freshness',
    affectedServices: ['bureau-ingestion', 'scpc-gateway'],
    evidence: 'A feed burst saturates the ingestion queue and delays downstream reconciliation.',
    remediation: 'Agent proposed a token-bucket limiter plus a spillover buffer.',
    autonomy: 'needs-ok',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i1',
    type: 'slo',
    severity: 'high',
    horizon: '~5 wk',
    weeks: 5,
    title: 'acerta-api call chain will breach its p99 SLO at projected Q3 load',
    tribe: 'Score & Risk',
    blastRadius: 'Acerta product line · 3 services',
    affectedServices: ['acerta-api', 'score-engine', 'ignite-feature-store'],
    evidence:
      'The synchronous acerta-api → score-engine → ignite-feature-store chain is at 95% of its p99 budget; +30% query growth tips it over.',
    remediation: 'Agent drafted an async-decoupling RFC plus a read-through cache layer.',
    autonomy: 'needs-arch-decision',
    status: 'open',
    href: '/portal/insights',
  },
  {
    id: 'i10',
    type: 'spof',
    severity: 'med',
    horizon: '~5 wk',
    weeks: 5,
    title: 'decision-engine and policy-studio share a synchronous config fetch',
    tribe: 'Decisioning',
    blastRadius: 'Decisioning latency coupling',
    affectedServices: ['decision-engine', 'policy-studio'],
    evidence: 'A policy-studio slowdown blocks decision-engine evaluations on the shared config call.',
    remediation: 'Agent proposed a cached config snapshot with async invalidation.',
    autonomy: 'needs-arch-decision',
    status: 'open',
    href: '/portal/insights',
  },
  // ── Resolved — what the fleet/humans already closed (trust + history) ──────────
  {
    id: 'r1',
    type: 'drift',
    severity: 'med',
    horizon: 'resolved',
    weeks: 0,
    title: 'score-engine test coverage raised back above 90%',
    tribe: 'Score & Risk',
    blastRadius: 'Defect-escape risk',
    affectedServices: ['score-engine'],
    evidence: 'Coverage had drifted to 84% over 8 weeks.',
    remediation: 'Testsmith generated 37 tests; coverage is now 91%.',
    autonomy: 'agent-can-resolve',
    status: 'resolved',
    resolvedWhen: '6d ago',
    resolvedBy: 'Testsmith',
    href: '/portal/insights',
  },
  {
    id: 'r2',
    type: 'security',
    severity: 'high',
    horizon: 'resolved',
    weeks: 0,
    title: 'scpc-gateway TLS certificate rotation automated',
    tribe: 'Data & Bureau',
    blastRadius: 'Outage risk on cert expiry',
    affectedServices: ['scpc-gateway'],
    evidence: 'Rotation was manual and had lapsed twice.',
    remediation: 'Sentinel shipped an auto-rotation job with a 30-day expiry alert.',
    autonomy: 'agent-can-resolve',
    status: 'resolved',
    resolvedWhen: '9d ago',
    resolvedBy: 'Sentinel',
    href: '/portal/insights',
  },
  {
    id: 'r3',
    type: 'slo',
    severity: 'high',
    horizon: 'resolved',
    weeks: 0,
    title: 'acerta-api rolled back after a p99 regression',
    tribe: 'Score & Risk',
    blastRadius: 'Acerta latency',
    affectedServices: ['acerta-api'],
    evidence: 'v4.12.0 pushed p99 from 240ms to 339ms.',
    remediation: 'Forge AI reverted to v4.11.3 and verified p99 recovery.',
    autonomy: 'needs-ok',
    status: 'resolved',
    resolvedWhen: '12d ago',
    resolvedBy: 'Forge AI',
    href: '/portal/insights',
  },
];

/** Open insights only — the Home shows the top few, the radar shows all. */
export const OPEN_INSIGHTS = INSIGHTS.filter((i) => i.status === 'open');

// ── My services — derive a scorecard grade from the service data ───────────────

export type Grade = 'A' | 'B' | 'C' | 'D';

/** Coverage-and-health derived grade — no new schema, just a readout. */
export function gradeFor(coverage: number, alert?: boolean): Grade {
  if (alert) return coverage >= 90 ? 'B' : 'C';
  if (coverage >= 90) return 'A';
  if (coverage >= 80) return 'B';
  if (coverage >= 70) return 'C';
  return 'D';
}

export const MY_SERVICES = ['acerta-api', 'score-engine', 'scpc-gateway', 'consent-service'];
