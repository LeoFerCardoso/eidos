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

// ── Detection origin + on-call trace ─────────────────────────────────────────
// Incidents are CREATED by integrations, not forms: the source chip names the
// system that raised it (manual declaration is the exception, via the drawer).
export type SourceKind = 'prometheus' | 'dynatrace' | 'grafana' | 'pagerduty' | 'servicenow' | 'forge-ai' | 'manual';
export interface IncidentSource { kind: SourceKind; detail: string }
export interface Paging { rotation: string; ackedBy: string; ackedIn: string; escalations: number }

export const SOURCE_META: Record<SourceKind, { label: string; icon: string }> = {
  prometheus: { label: 'Prometheus', icon: 'flame' },
  dynatrace: { label: 'Dynatrace', icon: 'activity' },
  grafana: { label: 'Grafana', icon: 'lineChart' },
  pagerduty: { label: 'PagerDuty', icon: 'bell' },
  servicenow: { label: 'ServiceNow', icon: 'clipboard' },
  'forge-ai': { label: 'Forge AI', icon: 'sparkle' },
  manual: { label: 'Manual', icon: 'user' },
};

// ── Agent diagnosis (the self-heal-incident run, seen from the war room) ─────
export interface Evidence { kind: 'deploy' | 'pr' | 'dep-edge' | 'runbook' | 'metric'; label: string }
export interface Remediation {
  summary: string;
  action: string; // action id → /portal/actions/[slug]
  blastRadius: 'low' | 'medium' | 'high';
  blastNote: string;
  gate: 'auto' | '1-approver' | '2-approvers';
  state: 'awaiting-approval' | 'auto-applied' | 'applied' | 'proposed';
  approver?: string;
}
export interface Diagnosis {
  agent: string;
  agentRole: string;
  hypothesis: string;
  confidence: number; // 0..1
  evidence: Evidence[];
  workflow: string; // workflow id → /portal/workflows/[id]
  remediation: Remediation;
}

// ── Auto-postmortem (agent-drafted, human-edited) ────────────────────────────
export interface PostmortemActionItem { id: string; title: string; owner: string; status: 'open' | 'in-progress' | 'done' }
export interface Postmortem {
  status: 'draft' | 'published';
  draftedBy: string;
  editedBy?: string;
  summary: string;
  rootCause: string;
  impact: string;
  whatWentWell: string[];
  whatHurt: string[];
  actionItems: PostmortemActionItem[];
  adrSuggestion?: { id: string; title: string };
}

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
  /** Static countdown to the TTR SLA for ACTIVE incidents (mock). */
  slaLeft?: string;
  // detection origin + on-call trace
  source: IncidentSource;
  paging?: Paging;
  // agent self-heal (UC-2)
  diagnosis?: Diagnosis;
  postmortem?: Postmortem;
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
    slaLeft: '16m',
    source: { kind: 'prometheus', detail: 'rule acerta-p95-sustained · SLO burn 14x' },
    paging: { rotation: 'score-risk-oncall', ackedBy: 'Rafael Mendonça', ackedIn: '84s', escalations: 1 },
    diagnosis: {
      agent: 'Sentinel',
      agentRole: 'Incident manager',
      hypothesis: 'Deploy D-9182 (v4.12.0) changed the CPF cache and tripled fan-out to score-engine; the auto-scaler lags by two minutes, so p95 crossed the SLO.',
      confidence: 0.86,
      evidence: [
        { kind: 'deploy', label: 'Deploy D-9182 · v4.12.0 · 22m ago' },
        { kind: 'dep-edge', label: 'acerta-api → score-engine · 3x fan-out' },
        { kind: 'metric', label: 'p95 612ms vs SLO 300ms' },
        { kind: 'runbook', label: 'rb-acerta-rollback · 98% success' },
      ],
      workflow: 'self-heal-incident',
      remediation: {
        summary: 'Trip the score-engine circuit breaker while the rollback canary recovers p95.',
        action: 'toggle-feature-flag',
        blastRadius: 'high',
        blastNote: '3 dependents · tier-0 scoring path',
        gate: '1-approver',
        state: 'awaiting-approval',
      },
    },
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
      body: 'Deploy D-9182 (v4.12.0) shipped a CPF cache change that triples fan-out to score-engine, and the auto-scaler is two minutes behind, so p95 crossed the SLO. The rollback to v4.11.9 is the lowest-risk fix and is already recovering p95.',
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
    source: { kind: 'forge-ai', detail: 'anomaly watch · approval rate down 18%' },
    paging: { rotation: 'antifraud-oncall', ackedBy: 'Beatriz Okamoto', ackedIn: '2m 10s', escalations: 0 },
    diagnosis: {
      agent: 'Sentinel',
      agentRole: 'Incident manager',
      hypothesis: 'Rule fp-velocity-v3 in konduto v3.1.7 tightened the velocity threshold and started catching legitimate retries as fraud.',
      confidence: 0.91,
      evidence: [
        { kind: 'deploy', label: 'konduto v3.1.7 · rule pack update' },
        { kind: 'metric', label: 'false-positive rate +18% in 40m' },
        { kind: 'runbook', label: 'rb-rule-revert · 99% success' },
      ],
      workflow: 'self-heal-incident',
      remediation: {
        summary: 'Revert rule fp-velocity-v3 to its prior version; keep the rest of the rule set.',
        action: 'apply-runbook',
        blastRadius: 'low',
        blastNote: '1 service · reversible rule flip',
        gate: 'auto',
        state: 'auto-applied',
      },
    },
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
    source: { kind: 'dynatrace', detail: 'Davis · 5xx anomaly on the SCPC upstream' },
    paging: { rotation: 'bureau-oncall', ackedBy: 'Diego Vasquez', ackedIn: '61s', escalations: 0 },
    postmortem: {
      status: 'published',
      draftedBy: 'Scribe · incident-manager agent',
      editedBy: 'Diego Vasquez',
      summary: 'The SCPC upstream certificate expired at 09:12 and the gateway began timing out. Failover to br-ne-1 restored reads in 7 minutes while the certificate was renewed; primary traffic was restored at 09:36.',
      rootCause: 'The upstream TLS certificate for the SCPC feed expired. Renewal was tracked in a partner spreadsheet, outside the platform certificate inventory, so no expiry alert fired.',
      impact: '22 minutes of degraded SCPC reads in br-se-1. ~5.6k customer consultations were served from the secondary region with +180ms p95. No data loss.',
      whatWentWell: [
        'rb-bureau-failover ran cleanly · reads moved to br-ne-1 in under 2 minutes.',
        'Dynatrace Davis pinpointed the upstream hop before a human joined the call.',
      ],
      whatHurt: [
        'Partner certificate was invisible to the inventory · no 30-day expiry warning.',
        'Status page update lagged the failover by 9 minutes.',
      ],
      actionItems: [
        { id: 'ai-1', title: 'Import partner certs into the platform certificate inventory', owner: 'Diego Vasquez', status: 'in-progress' },
        { id: 'ai-2', title: 'Auto-post status page updates from the failover runbook', owner: 'Larissa Fontana', status: 'open' },
        { id: 'ai-3', title: 'Add SCPC upstream cert expiry to the Sentinel watchlist', owner: 'Sentinel · agent', status: 'done' },
      ],
      adrSuggestion: { id: 'ADR-0051', title: 'All external-feed certificates live in the platform inventory' },
    },
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
    source: { kind: 'grafana', detail: 'alert ocr-queue-depth · threshold 5k' },
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
    source: { kind: 'forge-ai', detail: 'record-count watch · P0 auto-raised' },
    paging: { rotation: 'data-bureau-oncall', ackedBy: 'Thiago Albuquerque', ackedIn: '48s', escalations: 0 },
    postmortem: {
      status: 'draft',
      draftedBy: 'Scribe · incident-manager agent',
      summary: 'A malformed batch from a bureau partner dropped 0.4% of records for 11 minutes. Ingestion was paused with DLQ capture, the records were reprocessed, and reconciliation confirmed 100% recovery.',
      rootCause: 'The partner batch schema added a nullable field without notice; the strict parser rejected affected rows instead of quarantining them.',
      impact: '11 minutes of partial ingestion. 0.4% of records delayed, none lost. ~14k downstream consultations briefly served from stale data.',
      whatWentWell: [
        'Forge AI raised the P0 from the record-count watch in under a minute.',
        'rb-ingest-halt captured every rejected row to the DLQ · zero data loss.',
      ],
      whatHurt: [
        'Partner schema changes arrive unannounced · no contract test on the feed.',
        'Reconciliation tooling required a manual query to confirm recovery.',
      ],
      actionItems: [
        { id: 'ai-1', title: 'Add a contract test on the partner batch schema', owner: 'Diego Vasquez', status: 'open' },
        { id: 'ai-2', title: 'Quarantine (not reject) rows that fail schema validation', owner: 'Thiago Albuquerque', status: 'in-progress' },
        { id: 'ai-3', title: 'One-click reconciliation report after DLQ replay', owner: 'Scribe · agent', status: 'open' },
      ],
      adrSuggestion: { id: 'ADR-0052', title: 'Bureau feeds quarantine malformed rows instead of rejecting batches' },
    },
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


// ── Unavailability heatmap (hour-bucket × weekday, trailing 30d) ─────────────
// Minutes of customer-facing degradation. The 12-16/16-20 weekday band tracks
// the deploy window; the small Sat spike is the bureau batch replay.
export const UNAVAIL_ROWS = ['00', '04', '08', '12', '16', '20'];
export const UNAVAIL_COLS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const UNAVAIL_HEAT: number[][] = [
  [0, 2, 0, 0, 3, 0, 0],
  [2, 0, 0, 4, 0, 11, 0],
  [3, 6, 2, 5, 4, 0, 0],
  [9, 18, 7, 22, 12, 0, 2],
  [14, 26, 11, 31, 17, 3, 0],
  [4, 8, 3, 9, 6, 0, 0],
];
export const UNAVAIL_AI = 'Of the 232 degraded minutes in the last 30 days, 78% sit in the 12:00-20:00 weekday band, and Tue/Thu peaks line up with the deploy window. Moving konduto rule-pack deploys out of Thursday afternoons removes the worst cell.';
