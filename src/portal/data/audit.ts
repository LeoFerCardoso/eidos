// Forge (IDP Portal) · Audit log + Approvals queue (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/audit (immutable event feed) and /portal/approvals (the full
// guardrail-escalated queue; Home Decide is the glance version).
//
// - AUDIT_EVENTS: append-only, 18-24 deterministic rows, fixed timestamps.
// - APPROVALS: the superset of DECISIONS from agent-activity.ts (modeled after
//   those rows plus additional rows). Does NOT edit agent-activity.ts.
//
// Agent names match access.ts (Deploy-bot, Sentinel, AppSec-bot, LGPD-bot, etc.).
// Action ids match actions.ts. Run ids match workflows/runs.ts. Service ids match
// services.ts. Timestamps are fixed strings (no new Date() / live clock) for SSR
// stability and LGPD-evidence auditability semantics.

import type { RiskLevel } from './agent-activity';

// ── Audit events ─────────────────────────────────────────────────────────────

export type PrincipalType = 'agent' | 'human';

/** The guardrail disposition for this event. */
export type AuditVerdict =
  | 'auto'           // cleared automatically
  | 'approved'       // approved by a named human
  | 'blocked'        // blocked by policy; action did not execute
  | 'system';        // internal / system operation (no guardrail)

export type AuditOutcome = 'ok' | 'denied' | 'rolled-back';

export interface AuditEvent {
  id: string;
  /** Fixed ISO-ish display string: e.g. "Jun 9, 14:32" */
  timestamp: string;
  principalId: string;
  principalName: string;
  principalType: PrincipalType;
  /** Action catalog id (links to /portal/actions/[id]). */
  actionId: string;
  actionLabel: string;
  /** Target service slug (links to /portal/catalog/[service]). */
  service: string;
  verdict: AuditVerdict;
  /** For "approved" verdicts: the human who approved. */
  approvedBy?: string;
  outcome: AuditOutcome;
  /** Links to /portal/runs/[runId] when tied to a real workflow run. */
  runId?: string;
}

export const AUDIT_EVENTS: AuditEvent[] = [
  // ── Jun 9 (today) ─────────────────────────────────────────────────────────
  {
    id: 'ae-001', timestamp: 'Jun 9, 14:32',
    principalId: 'deploy-bot', principalName: 'Deploy-bot', principalType: 'agent',
    actionId: 'deploy-service', actionLabel: 'Deploy service',
    service: 'credit-score',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-9012',
  },
  {
    id: 'ae-002', timestamp: 'Jun 9, 14:18',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    actionId: 'open-incident', actionLabel: 'Open incident',
    service: 'credit-score',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-4901',
  },
  {
    id: 'ae-003', timestamp: 'Jun 9, 14:05',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    actionId: 'scale-replicas', actionLabel: 'Scale replicas',
    service: 'onescore-gateway',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-4901',
  },
  {
    id: 'ae-004', timestamp: 'Jun 9, 13:47',
    principalId: 'ana-silva', principalName: 'Ana Silva', principalType: 'human',
    actionId: 'deploy-service', actionLabel: 'Deploy service',
    service: 'kyc-api',
    verdict: 'approved', approvedBy: 'pedro.alves', outcome: 'ok',
    runId: 'wf-9008',
  },
  {
    id: 'ae-005', timestamp: 'Jun 9, 13:21',
    principalId: 'appsec-bot', principalName: 'AppSec-bot', principalType: 'agent',
    actionId: 'open-remediation-pr', actionLabel: 'Open remediation PR',
    service: 'onescore-gateway',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-9005',
  },
  {
    id: 'ae-006', timestamp: 'Jun 9, 12:58',
    principalId: 'deploy-bot', principalName: 'Deploy-bot', principalType: 'agent',
    actionId: 'deploy-service', actionLabel: 'Deploy service',
    service: 'ledger',
    verdict: 'approved', approvedBy: 'ana.silva', outcome: 'ok',
    runId: 'wf-8999',
  },
  {
    id: 'ae-007', timestamp: 'Jun 9, 12:33',
    principalId: 'lgpd-bot', principalName: 'LGPD-bot', principalType: 'agent',
    actionId: 'purge-pii', actionLabel: 'Purge PII',
    service: 'consent-service',
    verdict: 'blocked', outcome: 'denied',
  },
  {
    id: 'ae-008', timestamp: 'Jun 9, 11:50',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    actionId: 'rollback-deploy', actionLabel: 'Rollback deploy',
    service: 'acerta-api',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-9011',
  },
  {
    id: 'ae-009', timestamp: 'Jun 9, 11:14',
    principalId: 'maria-lopes', principalName: 'Maria Lopes', principalType: 'human',
    actionId: 'rotate-secret', actionLabel: 'Rotate secret',
    service: 'scpc-gateway',
    verdict: 'approved', approvedBy: 'ana.silva', outcome: 'ok',
  },
  {
    id: 'ae-010', timestamp: 'Jun 9, 10:41',
    principalId: 'appsec-bot', principalName: 'AppSec-bot', principalType: 'agent',
    actionId: 'bump-dependency', actionLabel: 'Bump dependency',
    service: 'acerta-api',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-9005',
  },
  {
    id: 'ae-011', timestamp: 'Jun 9, 10:02',
    principalId: 'deploy-bot', principalName: 'Deploy-bot', principalType: 'agent',
    actionId: 'run-pipeline', actionLabel: 'Run pipeline',
    service: 'score-engine',
    verdict: 'auto', outcome: 'ok',
  },
  {
    id: 'ae-012', timestamp: 'Jun 9, 09:37',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    actionId: 'restart-service', actionLabel: 'Restart service',
    service: 'bureau-ingestion',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-4862',
  },
  {
    id: 'ae-013', timestamp: 'Jun 9, 09:11',
    principalId: 'pedro-alves', principalName: 'Pedro Alves', principalType: 'human',
    actionId: 'toggle-feature-flag', actionLabel: 'Toggle feature flag',
    service: 'decision-engine',
    verdict: 'auto', outcome: 'ok',
  },
  {
    id: 'ae-014', timestamp: 'Jun 9, 08:55',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    actionId: 'flush-cache', actionLabel: 'Flush cache',
    service: 'ignite-feature-store',
    verdict: 'auto', outcome: 'ok',
  },
  {
    id: 'ae-015', timestamp: 'Jun 9, 08:20',
    principalId: 'deploy-bot', principalName: 'Deploy-bot', principalType: 'agent',
    actionId: 'deploy-service', actionLabel: 'Deploy service',
    service: 'identity-proofing',
    verdict: 'approved', approvedBy: 'ana.silva', outcome: 'rolled-back',
    runId: 'wf-8970',
  },
  // ── Jun 8 (yesterday) ─────────────────────────────────────────────────────
  {
    id: 'ae-016', timestamp: 'Jun 8, 22:14',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    actionId: 'rollback-deploy', actionLabel: 'Rollback deploy',
    service: 'feed-ingest',
    verdict: 'auto', outcome: 'rolled-back',
    runId: 'wf-8970',
  },
  {
    id: 'ae-017', timestamp: 'Jun 8, 18:09',
    principalId: 'lucas-dpo', principalName: 'Lucas Moreira', principalType: 'human',
    actionId: 'purge-pii', actionLabel: 'Purge PII',
    service: 'consent-service',
    verdict: 'approved', approvedBy: 'maria.lopes', outcome: 'ok',
  },
  {
    id: 'ae-018', timestamp: 'Jun 8, 15:44',
    principalId: 'appsec-bot', principalName: 'AppSec-bot', principalType: 'agent',
    actionId: 'open-remediation-pr', actionLabel: 'Open remediation PR',
    service: 'konduto-antifraud',
    verdict: 'blocked', outcome: 'denied',
  },
  {
    id: 'ae-019', timestamp: 'Jun 8, 12:22',
    principalId: 'maria-lopes', principalName: 'Maria Lopes', principalType: 'human',
    actionId: 'apply-terraform', actionLabel: 'Apply Terraform',
    service: 'cloud-infra',
    verdict: 'approved', approvedBy: 'ana.silva', outcome: 'ok',
  },
  {
    id: 'ae-020', timestamp: 'Jun 8, 09:05',
    principalId: 'deploy-bot', principalName: 'Deploy-bot', principalType: 'agent',
    actionId: 'deploy-service', actionLabel: 'Deploy service',
    service: 'webhook-dispatcher',
    verdict: 'auto', outcome: 'ok',
  },
  {
    id: 'ae-021', timestamp: 'Jun 8, 08:31',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    actionId: 'scale-replicas', actionLabel: 'Scale replicas',
    service: 'acerta-api',
    verdict: 'auto', outcome: 'ok',
  },
  {
    id: 'ae-022', timestamp: 'Jun 8, 07:48',
    principalId: 'appsec-bot', principalName: 'AppSec-bot', principalType: 'agent',
    actionId: 'bump-dependency', actionLabel: 'Bump dependency',
    service: 'device-fingerprint',
    verdict: 'auto', outcome: 'ok',
    runId: 'wf-9005',
  },
];

// ── Derived KPIs ─────────────────────────────────────────────────────────────

const today = AUDIT_EVENTS.filter((e) => e.timestamp.startsWith('Jun 9'));
const agentInitiated = AUDIT_EVENTS.filter((e) => e.principalType === 'agent').length;
const agentPct = Math.round((agentInitiated / AUDIT_EVENTS.length) * 100);
const guardrailBlocks = AUDIT_EVENTS.filter((e) => e.verdict === 'blocked').length;
const rollbacks = AUDIT_EVENTS.filter((e) => e.outcome === 'rolled-back').length;

export const AUDIT_KPIS = [
  { id: 'events', label: 'Events (24h)',       value: String(today.length),    note: 'Across humans and agents.' },
  { id: 'agent',  label: 'Agent-initiated %',  value: `${agentPct}%`,          note: 'Of all governed actions.' },
  { id: 'blocks', label: 'Guardrail blocks',   value: String(guardrailBlocks), note: 'Policy blocked before exec.' },
  { id: 'rolled', label: 'Rollbacks',          value: String(rollbacks),       note: 'Reversed after execution.' },
];

// ── Approvals (full backlog — superset of Home DECIDE) ────────────────────────
//
// DECISIONS from agent-activity.ts are the "glance" version (Home).
// This backlog has more rows, richer blast-radius context and an SLA countdown.
// We do NOT edit agent-activity.ts: we import and extend here.

export type ApprovalStatus = 'pending' | 'approved' | 'denied';

export interface Approval {
  id: string;
  title: string;
  service: string;
  actionId: string;
  actionLabel: string;
  /** The guardrail that fired and its threshold, e.g. "blast-radius > 5, 2 approvers". */
  guardrailLabel: string;
  principalId: string;
  principalName: string;
  principalType: PrincipalType;
  blastRadius: string;
  risk: RiskLevel;
  /** Static SLA countdown string. */
  slaCountdown: string;
  /** True when the SLA countdown is in the danger zone. */
  slaAtRisk: boolean;
  status: ApprovalStatus;
  when: string;
  /** Links to the related run. */
  runId?: string;
}

export const APPROVALS: Approval[] = [
  // Rows derived from DECISIONS (same scenario, richer metadata)
  {
    id: 'ap-d1',
    title: 'Promote fraud-score rule v3.2.0 to production',
    service: 'konduto-antifraud',
    actionId: 'deploy-service', actionLabel: 'Deploy service',
    guardrailLabel: 'PII in prod path, 1 approver required',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    blastRadius: 'HIGH · PII · 4 downstream services',
    risk: 'high',
    slaCountdown: '3h left', slaAtRisk: false,
    status: 'pending', when: '40m ago',
  },
  {
    id: 'ap-d2',
    title: 'Apply PII retention fix to consent-service',
    service: 'consent-service',
    actionId: 'purge-pii', actionLabel: 'Purge PII',
    guardrailLabel: 'Prod data migration, 2 approvers required',
    principalId: 'lgpd-bot', principalName: 'LGPD-bot', principalType: 'agent',
    blastRadius: 'CRIT · PII · irreversible data removal',
    risk: 'crit',
    slaCountdown: '1h left', slaAtRisk: true,
    status: 'pending', when: '2h ago',
  },
  // Additional rows specific to the full backlog
  {
    id: 'ap-003',
    title: 'Apply Terraform to prod networking workspace',
    service: 'cloud-infra',
    actionId: 'apply-terraform', actionLabel: 'Apply Terraform',
    guardrailLabel: 'Infra change, 2 approvers required',
    principalId: 'deploy-bot', principalName: 'Deploy-bot', principalType: 'agent',
    blastRadius: 'HIGH · prod networking · all services',
    risk: 'high',
    slaCountdown: '8h left', slaAtRisk: false,
    status: 'pending', when: '1h ago',
  },
  {
    id: 'ap-004',
    title: 'Grant AppSec-bot access to tier-0 services',
    service: 'konduto-antifraud',
    actionId: 'grant-access', actionLabel: 'Grant access',
    guardrailLabel: 'Access grant, 2 approvers required',
    principalId: 'appsec-bot', principalName: 'AppSec-bot', principalType: 'agent',
    blastRadius: 'MED · tier-0 write scope expansion',
    risk: 'med',
    slaCountdown: '24h left', slaAtRisk: false,
    status: 'pending', when: '2h ago',
  },
  {
    id: 'ap-005',
    title: 'Rotate shared DB credential for score-engine',
    service: 'score-engine',
    actionId: 'rotate-secret', actionLabel: 'Rotate secret',
    guardrailLabel: 'Shared secret rotation, 1 approver required',
    principalId: 'sentinel', principalName: 'Sentinel', principalType: 'agent',
    blastRadius: 'MED · 2 consumers, brief reconnect window',
    risk: 'med',
    slaCountdown: '6h left', slaAtRisk: false,
    status: 'pending', when: '3h ago',
  },
  {
    id: 'ap-006',
    title: 'Deploy identity-proofing v2.1.0 to prod',
    service: 'identity-proofing',
    actionId: 'deploy-service', actionLabel: 'Deploy service',
    guardrailLabel: 'Blast radius > 5, 2 approvers required',
    principalId: 'deploy-bot', principalName: 'Deploy-bot', principalType: 'agent',
    blastRadius: 'HIGH · 6 dependents · PII',
    risk: 'high',
    slaCountdown: '45m left', slaAtRisk: true,
    status: 'pending', when: '4h ago',
    runId: 'wf-8999',
  },
];

export const getPendingApprovals = (): Approval[] =>
  APPROVALS.filter((a) => a.status === 'pending');

// KPIs for the approvals page
const pending = APPROVALS.filter((a) => a.status === 'pending').length;
const atRisk = APPROVALS.filter((a) => a.slaAtRisk).length;

export const APPROVAL_KPIS = [
  { id: 'pending',  label: 'Pending',           value: String(pending),  note: 'Awaiting a human decision.' },
  { id: 'wait',     label: 'Median wait',        value: '2h 14m',         note: 'P50 across open queue.' },
  { id: 'sla',      label: 'SLA at risk',        value: String(atRisk),   note: 'Under 2h to breach.' },
  { id: 'approved', label: 'Approved this week', value: '14',             note: '3 denied, 0 auto-escalated.' },
];
