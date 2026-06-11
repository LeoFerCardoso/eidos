// Forge (IDP Portal) · Intake queue (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge".
//
// Backs /portal/intake. The INTAKE QUEUE is where agent work ORIGINATES:
// tickets from Jira and ServiceNow are triaged, a service is identified,
// an agent is assigned, and the ticket-to-prod workflow is spun up.
// See docs/AGENTIC-PLATFORM-VISION.md §7.10 and §5 UC-1 step 1.
//
// Key cross-references:
//  - assignedAgentId: agent id in src/portal/data/agents.ts
//  - workflowId: workflow id in src/portal/data/workflows.ts
//  - runId: run id in src/portal/data/runs.ts (where a run has started)
//  - serviceId: service id in src/portal/data/services.ts

export type IntakeSource = 'jira' | 'servicenow';

// Five-stage triage pipeline: new -> triaged -> assigned -> running -> done.
export type TriageStatus = 'new' | 'triaged' | 'assigned' | 'running' | 'done';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface IntakeTicket {
  id: string;
  /** Source system ticket reference (e.g. "PROJ-1234" or "INC0012345"). */
  ref: string;
  source: IntakeSource;
  /** Short title copied from the source ticket. */
  title: string;
  /** Service slug matching services.ts id. */
  serviceId: string;
  /** Display name for the service (avoids importing full services.ts in renders). */
  serviceName: string;
  priority: Priority;
  triageStatus: TriageStatus;
  /** Agent id from agents.ts. Set once status reaches "assigned". */
  assignedAgentId?: string;
  /** Agent display name (cached for render without re-fetching agents.ts). */
  assignedAgentName?: string;
  /** Workflow id from workflows.ts — almost always "ticket-to-prod". */
  workflowId?: string;
  /** Run id from runs.ts — set once a run has started (status "running" or "done"). */
  runId?: string;
  /** When the ticket arrived in the queue. Deterministic strings, no Date.now(). */
  arrivedAt: string;
  /** How long the ticket waited before triage. Set once triaged. */
  timeToTriage?: string;
  /** True when this ticket has been flagged as needing human review. */
  needsHuman?: boolean;
  /** Extra note explaining why the ticket needs human attention. */
  flagReason?: string;
  /** For "done" tickets: short outcome label shown in the row. */
  outcome?: string;
}

export const PRIORITY_META: Record<Priority, { label: string; tone: 'danger' | 'warning' | 'ice' | 'neutral' }> = {
  critical: { label: 'Critical', tone: 'danger' },
  high:     { label: 'High',     tone: 'warning' },
  medium:   { label: 'Medium',   tone: 'ice' },
  low:      { label: 'Low',      tone: 'neutral' },
};

export const TRIAGE_STATUS_META: Record<TriageStatus, { label: string; tone: 'neutral' | 'ice' | 'warning' | 'ember' | 'health-up' }> = {
  new:      { label: 'New',      tone: 'neutral' },
  triaged:  { label: 'Triaged',  tone: 'ice' },
  assigned: { label: 'Assigned', tone: 'warning' },
  running:  { label: 'Running',  tone: 'ember' },
  done:     { label: 'Done',     tone: 'health-up' },
};

export const INTAKE_TICKETS: IntakeTicket[] = [
  // ── Running tickets (have a run id) ─────────────────────────────────────
  {
    id: 'iq-001',
    ref: 'BUR-2231',
    source: 'jira',
    title: 'Bump openssl to 3.4.1 across bureau services',
    serviceId: 'acerta-api',
    serviceName: 'acerta-api',
    priority: 'critical',
    triageStatus: 'running',
    assignedAgentId: 'sre',
    assignedAgentName: 'SRE Copilot',
    workflowId: 'ticket-to-prod',
    runId: 'wf-4899',
    arrivedAt: '45m ago',
    timeToTriage: '3m',
  },
  {
    id: 'iq-002',
    ref: 'BUR-2228',
    source: 'jira',
    title: 'Migrate consent-api endpoint to new LGPD v2 contract',
    serviceId: 'consent-service',
    serviceName: 'consent-service',
    priority: 'high',
    triageStatus: 'running',
    assignedAgentId: 'lgpd',
    assignedAgentName: 'LGPD Auditor',
    workflowId: 'ticket-to-prod',
    runId: 'wf-4871',
    arrivedAt: '2h ago',
    timeToTriage: '8m',
  },
  {
    id: 'iq-003',
    ref: 'INC0019834',
    source: 'servicenow',
    title: 'score-engine latency regression post v7.3.1 deploy',
    serviceId: 'score-engine',
    serviceName: 'score-engine',
    priority: 'critical',
    triageStatus: 'running',
    assignedAgentId: 'score',
    assignedAgentName: 'Score Reviewer',
    workflowId: 'ticket-to-prod',
    runId: 'wf-4871',
    arrivedAt: '3h ago',
    timeToTriage: '4m',
  },

  // ── Assigned tickets (agent assigned, no run yet) ─────────────────────
  {
    id: 'iq-004',
    ref: 'BUR-2219',
    source: 'jira',
    title: 'score-engine: add shadow-mode flag for v8 model rollout',
    serviceId: 'score-engine',
    serviceName: 'score-engine',
    priority: 'high',
    triageStatus: 'assigned',
    assignedAgentId: 'score',
    assignedAgentName: 'Score Reviewer',
    workflowId: 'ticket-to-prod',
    arrivedAt: '4h ago',
    timeToTriage: '11m',
  },
  {
    id: 'iq-005',
    ref: 'INC0019801',
    source: 'servicenow',
    title: 'konduto-antifraud: increase Pix false-positive threshold by 2pp',
    serviceId: 'konduto-antifraud',
    serviceName: 'konduto-antifraud',
    priority: 'high',
    triageStatus: 'assigned',
    assignedAgentId: 'fraud',
    assignedAgentName: 'Fraud Analyst',
    workflowId: 'ticket-to-prod',
    arrivedAt: '5h ago',
    timeToTriage: '7m',
  },
  {
    id: 'iq-006',
    ref: 'BUR-2215',
    source: 'jira',
    title: 'bureau-ingestion: retry logic for SCR feed timeout',
    serviceId: 'bureau-ingestion',
    serviceName: 'bureau-ingestion',
    priority: 'medium',
    triageStatus: 'assigned',
    assignedAgentId: 'scr',
    assignedAgentName: 'SCR Reconciler',
    workflowId: 'ticket-to-prod',
    arrivedAt: '6h ago',
    timeToTriage: '14m',
  },

  // ── Triaged (service identified, agent not yet assigned) ──────────────
  {
    id: 'iq-007',
    ref: 'BUR-2210',
    source: 'jira',
    title: 'ignite-feature-store: add freshness SLA alert for thin-file features',
    serviceId: 'ignite-feature-store',
    serviceName: 'ignite-feature-store',
    priority: 'medium',
    triageStatus: 'triaged',
    arrivedAt: '7h ago',
    timeToTriage: '22m',
  },
  {
    id: 'iq-008',
    ref: 'INC0019770',
    source: 'servicenow',
    title: 'acerta-api: remove deprecated X-Client-Token header from v4 contract',
    serviceId: 'acerta-api',
    serviceName: 'acerta-api',
    priority: 'low',
    triageStatus: 'triaged',
    arrivedAt: '9h ago',
    timeToTriage: '31m',
  },
  {
    id: 'iq-009',
    ref: 'BUR-2204',
    source: 'jira',
    title: 'identity-proofing: upgrade biometric SDK to v5 before deprecation',
    serviceId: 'identity-proofing',
    serviceName: 'identity-proofing',
    priority: 'high',
    triageStatus: 'triaged',
    arrivedAt: 'Yesterday',
    timeToTriage: '18m',
  },

  // ── New (arrived, not yet triaged) ────────────────────────────────────
  {
    id: 'iq-010',
    ref: 'BUR-2200',
    source: 'jira',
    title: 'identity-proofing: support SERPRO identity document for onboarding flow v3',
    serviceId: 'identity-proofing',
    serviceName: 'identity-proofing',
    priority: 'medium',
    triageStatus: 'new',
    arrivedAt: '12h ago',
  },
  {
    id: 'iq-011',
    ref: 'INC0019749',
    source: 'servicenow',
    // This ticket sat past SLA without triage - flagged by Forge AI
    title: 'onescore-gateway: p99 spikes on high-load windows, needs circuit breaker',
    serviceId: 'onescore-gateway',
    serviceName: 'onescore-gateway',
    priority: 'high',
    triageStatus: 'new',
    arrivedAt: 'Yesterday',
    needsHuman: true,
    flagReason: 'No triage after 18h (SLA: 4h). High-priority ticket on a tier-0 service needs owner assignment.',
  },
  {
    id: 'iq-012',
    ref: 'BUR-2196',
    source: 'jira',
    title: 'risk-monitor: add Kafka consumer lag to the drift alert payload',
    serviceId: 'risk-monitor',
    serviceName: 'risk-monitor',
    priority: 'low',
    triageStatus: 'new',
    arrivedAt: '2d ago',
  },

  // ── Done tickets ──────────────────────────────────────────────────────
  {
    id: 'iq-013',
    ref: 'BUR-2188',
    source: 'jira',
    title: 'identity-proofing: add onboardingSource tracking to audit log',
    serviceId: 'identity-proofing',
    serviceName: 'identity-proofing',
    priority: 'medium',
    triageStatus: 'done',
    assignedAgentId: 'kyc',
    assignedAgentName: 'KYC Navigator',
    workflowId: 'ticket-to-prod',
    runId: 'wf-4812',
    arrivedAt: '2d ago',
    timeToTriage: '6m',
    outcome: 'shipped · verified',
  },
  {
    id: 'iq-014',
    ref: 'INC0019601',
    source: 'servicenow',
    title: 'scpc-gateway: add read-replica failover for SCPC negative-base queries',
    serviceId: 'scpc-gateway',
    serviceName: 'scpc-gateway',
    priority: 'high',
    triageStatus: 'done',
    assignedAgentId: 'scr',
    assignedAgentName: 'SCR Reconciler',
    workflowId: 'ticket-to-prod',
    runId: 'wf-4790',
    arrivedAt: '3d ago',
    timeToTriage: '9m',
    outcome: 'shipped · verified',
  },
  {
    id: 'iq-015',
    ref: 'BUR-2177',
    source: 'jira',
    title: 'consent-service: prune orphaned opt-out records older than 2y',
    serviceId: 'consent-service',
    serviceName: 'consent-service',
    priority: 'low',
    triageStatus: 'done',
    assignedAgentId: 'lgpd',
    assignedAgentName: 'LGPD Auditor',
    workflowId: 'ticket-to-prod',
    arrivedAt: '4d ago',
    timeToTriage: '5m',
    outcome: 'shipped · verified',
  },
];

// ── KPIs ──────────────────────────────────────────────────────────────────────

const today = INTAKE_TICKETS.filter(
  (t) => t.arrivedAt.endsWith('m ago') || t.arrivedAt.endsWith('h ago'),
);
const triagedToday = today.filter(
  (t) => t.triageStatus !== 'new',
);
const autoAssigned = INTAKE_TICKETS.filter((t) => t.assignedAgentId !== undefined);
const autoAssignedPct = Math.round((autoAssigned.length / INTAKE_TICKETS.length) * 100);

// Median time-to-triage in minutes from the deterministic strings.
const TTT_MINS = INTAKE_TICKETS
  .filter((t) => t.timeToTriage !== undefined)
  .map((t) => parseInt(t.timeToTriage!, 10));
TTT_MINS.sort((a, b) => a - b);
const medianTTT = TTT_MINS[Math.floor(TTT_MINS.length / 2)];

const inQueue = INTAKE_TICKETS.filter(
  (t) => t.triageStatus !== 'done',
).length;

export const KPIS = [
  { id: 'queue', label: 'In queue', value: String(inQueue), note: 'Tickets awaiting assignment or running.' },
  { id: 'triaged', label: 'Triaged today', value: String(triagedToday.length), note: 'Moved past "new" in the last 24h.' },
  { id: 'auto', label: 'Auto-assigned', value: `${autoAssignedPct}%`, note: 'Agent assigned without human routing.' },
  { id: 'median', label: 'Median to first run', value: `${medianTTT}m`, note: 'From ticket arrival to workflow start.' },
];

export const AI_INTAKE_READ = {
  title: 'SLA breach in queue',
};
