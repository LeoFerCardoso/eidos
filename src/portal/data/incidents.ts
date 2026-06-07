// Forge (IDP Portal) — Incidents data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/incidents (the board) and /portal/incidents/[id] (the war
// room). Bureau services + people. Relative times live in the event `meta`
// (not a live clock) so the page stays deterministic. Mock but consistent.

export type Severity = 'p0' | 'p1' | 'p2' | 'p3';
export type IncStatus = 'investigating' | 'mitigating' | 'monitoring' | 'resolved';

export interface Person { name: string; initials: string; role: string }

const P: Record<string, Person> = {
  rafael: { name: 'Rafael Mendonça', initials: 'RM', role: 'Staff Engineer · Score & Risk' },
  larissa: { name: 'Larissa Fontana', initials: 'LF', role: 'Senior SRE · Platform' },
  mariana: { name: 'Mariana Castelli', initials: 'MC', role: 'Engineering Manager' },
  beatriz: { name: 'Beatriz Okamoto', initials: 'BO', role: 'Senior Engineer · Anti-Fraud' },
  thiago: { name: 'Thiago Albuquerque', initials: 'TA', role: 'Principal Engineer · Risk' },
  diego: { name: 'Diego Vasquez', initials: 'DV', role: 'Staff Engineer · Data & Bureau' },
};

export interface TLEvent { id: string; title: string; meta?: string; icon?: string; tone?: string; person?: Person; current?: boolean; done?: boolean }
export interface Affected { svc: string; customers: string; region: string; state: 'up' | 'degraded' | 'down' }
export interface Responder { person: Person; role: 'Commander' | 'IC' | 'Comms' | 'Responder' }
export interface Runbook { id: string; title: string; success: number; runs: number; last: string }

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncStatus;
  summary: string;
  commander: string;
  started: string;
  duration: string;
  customers: string;
  region: string;
  servicesAffected: number;
  ttrTarget?: string;
  budgetLeft?: string;
  // war-room detail
  timeline: TLEvent[];
  affected: Affected[];
  responders: Responder[];
  runbooks: Runbook[];
  suspectedDeploy?: { id: string; service: string; version: string; sha: string; author: Person };
  ai?: { title: string; body: string };
}

export const STATUS_META: Record<IncStatus, { label: string; tone: 'status-running' | 'status-pending' | 'status-done'; live?: boolean }> = {
  investigating: { label: 'Investigating', tone: 'status-pending' },
  mitigating: { label: 'Mitigating', tone: 'status-running', live: true },
  monitoring: { label: 'Monitoring', tone: 'status-running', live: true },
  resolved: { label: 'Resolved', tone: 'status-done' },
};

export const INCIDENTS: Incident[] = [
  {
    id: 'INC-1247',
    title: 'acerta-api p95 latency spike',
    service: 'acerta-api',
    severity: 'p1',
    status: 'mitigating',
    summary: 'Sustained p95 above 600ms across br-se-1. Three services impacted while the rollback to v4.11.9 is in flight.',
    commander: 'Rafael Mendonça',
    started: '14m ago',
    duration: '14m',
    customers: '~12k',
    region: 'br-se-1',
    servicesAffected: 3,
    ttrTarget: '16m / 30m',
    budgetLeft: '38%',
    timeline: [
      { id: 't1', title: 'Alert fired · acerta-api p95 over 600ms', meta: '14m ago · Prometheus rule acerta-p95-sustained · P1', icon: 'alert', tone: 'danger' },
      { id: 't2', title: 'PagerDuty paged the on-call rotation', meta: '13m ago · auto-escalation after 90s no-ack', icon: 'bell', tone: 'warning' },
      { id: 't3', title: 'Rafael Mendonça acknowledged the page', meta: '12m ago · acked from mobile', person: P.rafael, tone: 'running' },
      { id: 't4', title: 'War room opened in Slack #inc-1247', meta: '11m ago · responders and runbooks pinned', icon: 'chat', tone: 'neutral' },
      { id: 't5', title: 'Status page set to investigating', meta: '9m ago · public · elevated latency on consultations', icon: 'globe', tone: 'neutral' },
      { id: 't6', title: 'Forge AI correlated deploy D-9182 (v4.12.0)', meta: '6m ago · 3x fan-out to score-engine · auto-scaler 2m behind', icon: 'sparkle', tone: 'running' },
      { id: 't7', title: 'Mitigation: rollback to v4.11.9 started', meta: '3m ago · runbook rb-acerta-rollback · automated', icon: 'undo', tone: 'running', current: true },
      { id: 't8', title: 'Canary recovering · p95 612ms to 188ms', meta: '1m ago · monitoring the next 4 minutes', icon: 'activity', tone: 'success' },
    ],
    affected: [
      { svc: 'acerta-api', customers: '~8.2k', region: 'br-se-1', state: 'degraded' },
      { svc: 'score-engine', customers: '~3.1k', region: 'br-se-1', state: 'degraded' },
      { svc: 'onescore-gateway', customers: '~720', region: 'br-se-1 · br-ne-1', state: 'up' },
    ],
    responders: [
      { person: P.rafael, role: 'Commander' },
      { person: P.larissa, role: 'IC' },
      { person: P.mariana, role: 'Comms' },
    ],
    runbooks: [
      { id: 'rb-acerta-rollback', title: 'Roll back acerta-api to last good', success: 98, runs: 41, last: 'yesterday' },
      { id: 'rb-acerta-circuit', title: 'Trip the score-engine circuit breaker', success: 94, runs: 23, last: '2 weeks ago' },
      { id: 'rb-scale-out', title: 'Force auto-scaler to target capacity', success: 91, runs: 67, last: '3 days ago' },
    ],
    suspectedDeploy: { id: 'D-9182', service: 'acerta-api', version: 'v4.12.0', sha: 'a91f2dc', author: P.rafael },
    ai: {
      title: 'Probable cause and the safe move',
      body: 'Deploy D-9182 (v4.12.0) shipped a CPF cache change 14 minutes ago that triples fan-out to score-engine. The auto-scaler is two minutes behind demand, so p95 crossed the SLO. The rollback to v4.11.9 is the lowest-risk mitigation and is already recovering p95. No data loss; no human gate needed to complete it.',
    },
  },
  {
    id: 'INC-1246',
    title: 'konduto-antifraud false-positive surge',
    service: 'konduto-antifraud',
    severity: 'p2',
    status: 'monitoring',
    summary: 'A new rule in v3.1.7 lifted the false-positive rate 18%. Rule reverted; watching approval rates recover.',
    commander: 'Beatriz Okamoto',
    started: '1h ago',
    duration: '1h 06m',
    customers: '~2.4k',
    region: 'br-se-1',
    servicesAffected: 1,
    timeline: [
      { id: 't1', title: 'Anomaly flagged · approval rate down 18%', meta: '66m ago · Forge AI anomaly watch', icon: 'sparkle', tone: 'warning' },
      { id: 't2', title: 'Beatriz Okamoto took command', meta: '61m ago', person: P.beatriz, tone: 'running' },
      { id: 't3', title: 'Suspect rule fp-velocity-v3 disabled', meta: '48m ago · runbook rb-rule-revert', icon: 'undo', tone: 'running' },
      { id: 't4', title: 'Approval rate recovering toward baseline', meta: '12m ago · monitoring', icon: 'activity', tone: 'success', current: true },
    ],
    affected: [{ svc: 'konduto-antifraud', customers: '~2.4k', region: 'br-se-1', state: 'degraded' }],
    responders: [
      { person: P.beatriz, role: 'Commander' },
      { person: P.larissa, role: 'IC' },
    ],
    runbooks: [
      { id: 'rb-rule-revert', title: 'Revert an antifraud rule to prior version', success: 99, runs: 88, last: 'today' },
      { id: 'rb-shadow-eval', title: 'Re-run the rule in shadow mode', success: 96, runs: 31, last: '5 days ago' },
    ],
    ai: {
      title: 'What changed',
      body: 'Rule fp-velocity-v3 in konduto v3.1.7 tightened the velocity threshold and caught more legitimate retries as fraud. Reverting the single rule restores approval rates without touching the rest of the rule set.',
    },
  },
  {
    id: 'INC-1245',
    title: 'scpc-gateway upstream timeout',
    service: 'scpc-gateway',
    severity: 'p1',
    status: 'resolved',
    summary: 'SCPC upstream feed timed out for 22 minutes. Failed over to the secondary region; root cause was an expired upstream cert.',
    commander: 'Diego Vasquez',
    started: '2 days ago',
    duration: '22m',
    customers: '~5.6k',
    region: 'br-se-1',
    servicesAffected: 2,
    timeline: [
      { id: 't1', title: 'Alert · scpc-gateway 5xx rate over 5%', meta: 'day 2 · 09:14 · P1', icon: 'alert', tone: 'danger' },
      { id: 't2', title: 'Failed over to br-ne-1 secondary', meta: 'day 2 · 09:21 · runbook rb-bureau-failover', icon: 'undo', tone: 'running' },
      { id: 't3', title: 'Upstream cert renewed and validated', meta: 'day 2 · 09:33', person: P.diego, tone: 'running' },
      { id: 't4', title: 'Resolved · traffic restored to primary', meta: 'day 2 · 09:36', icon: 'check', tone: 'success', done: true },
    ],
    affected: [
      { svc: 'scpc-gateway', customers: '~5.6k', region: 'br-se-1', state: 'up' },
      { svc: 'bureau-ingestion', customers: '~1.1k', region: 'br-se-1', state: 'up' },
    ],
    responders: [
      { person: P.diego, role: 'Commander' },
      { person: P.larissa, role: 'IC' },
    ],
    runbooks: [{ id: 'rb-bureau-failover', title: 'Fail bureau feeds over to secondary', success: 97, runs: 19, last: '2 days ago' }],
  },
  {
    id: 'INC-1244',
    title: 'document-ocr queue backlog',
    service: 'document-ocr',
    severity: 'p3',
    status: 'resolved',
    summary: 'OCR worker pool fell behind during a batch onboarding push. Scaled workers; backlog cleared in 40 minutes.',
    commander: 'Camila Tanaka',
    started: '4 days ago',
    duration: '40m',
    customers: '~900',
    region: 'br-se-1',
    servicesAffected: 1,
    timeline: [
      { id: 't1', title: 'Queue depth over threshold', meta: 'day 4 · 14:02 · P3', icon: 'alert', tone: 'warning' },
      { id: 't2', title: 'Scaled OCR workers 4 to 12', meta: 'day 4 · 14:09 · runbook rb-scale-workers', icon: 'undo', tone: 'running' },
      { id: 't3', title: 'Backlog cleared', meta: 'day 4 · 14:42', icon: 'check', tone: 'success', done: true },
    ],
    affected: [{ svc: 'document-ocr', customers: '~900', region: 'br-se-1', state: 'up' }],
    responders: [{ person: { name: 'Camila Tanaka', initials: 'CT', role: 'Staff Engineer · Identity' }, role: 'Commander' }],
    runbooks: [{ id: 'rb-scale-workers', title: 'Scale a worker pool to target depth', success: 95, runs: 52, last: '4 days ago' }],
  },
  {
    id: 'INC-1243',
    title: 'bureau-ingestion partial data gap',
    service: 'bureau-ingestion',
    severity: 'p0',
    status: 'resolved',
    summary: 'A malformed batch dropped 0.4% of records for 11 minutes. Reprocessed from the dead-letter queue; full reconciliation confirmed.',
    commander: 'Thiago Albuquerque',
    started: '6 days ago',
    duration: '11m',
    customers: '~14k',
    region: 'br-se-1 · br-ne-1',
    servicesAffected: 2,
    timeline: [
      { id: 't1', title: 'Forge AI flagged a record-count drop', meta: 'day 6 · 03:11 · P0 auto-raised', icon: 'sparkle', tone: 'danger' },
      { id: 't2', title: 'Ingestion paused, DLQ capture enabled', meta: 'day 6 · 03:14 · runbook rb-ingest-halt', icon: 'undo', tone: 'running' },
      { id: 't3', title: 'Reprocessed 0.4% of records from DLQ', meta: 'day 6 · 03:19', person: P.thiago, tone: 'running' },
      { id: 't4', title: 'Resolved · reconciliation 100%', meta: 'day 6 · 03:22', icon: 'check', tone: 'success', done: true },
    ],
    affected: [
      { svc: 'bureau-ingestion', customers: '~14k', region: 'br-se-1 · br-ne-1', state: 'up' },
      { svc: 'bureau-reconciler', customers: '~14k', region: 'br-se-1', state: 'up' },
    ],
    responders: [
      { person: P.thiago, role: 'Commander' },
      { person: P.diego, role: 'IC' },
      { person: P.larissa, role: 'Responder' },
    ],
    runbooks: [{ id: 'rb-ingest-halt', title: 'Halt ingestion and capture to DLQ', success: 100, runs: 7, last: '6 days ago' }],
  },
];

export const getIncident = (id: string): Incident | undefined => INCIDENTS.find((i) => i.id === id);

export const activeCount = INCIDENTS.filter((i) => i.status !== 'resolved').length;

/** Board KPIs. */
export const KPIS = [
  { id: 'open', label: 'Open incidents', value: String(activeCount), note: '1 P1, 1 P2 right now.' },
  { id: 'p0', label: 'P0 this quarter', value: '1', note: 'Resolved in 11m.' },
  { id: 'mtta', label: 'Mean time to ack', value: '74s', note: 'Trailing 90 days.' },
  { id: 'mttr', label: 'Mean time to restore', value: '24m', note: 'Down 54% year over year.' },
];
