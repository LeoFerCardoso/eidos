// Forge (IDP Portal) · Actions registry (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/actions. An ACTION is the ATOMIC executable unit of the platform
// · the codified, parameterized operation that humans (self-service) AND agents/
// workflows call. It is NOT a cron job: a schedule is just one of several
// triggers. It is NOT a workflow: a workflow SEQUENCES actions. See the domain
// model in docs/AGENTIC-PLATFORM-VISION.md §2.
//
// Each action carries an input schema, a guardrail policy (the gate that runs
// before it fires), who/what may run it, its triggers, and the Skill / MCP server
// it is wired to. This is the spine between Skills (agent capability) and MCP
// (transport). Mock but internally consistent · skill ids match skills.ts, mcp
// ids match mcp.ts.

export type ActionCategory = 'Deploy' | 'Infra' | 'Data' | 'Security' | 'Scaffold' | 'Incident';

/** Who may invoke the action. */
export type RunnableBy = 'human' | 'agent' | 'both';

/** What can kick the action off. A schedule (cron) is just one trigger. */
export type TriggerKind = 'manual' | 'agent' | 'event' | 'schedule';

/** The guardrail gate that runs before the action fires. */
export type Gate = 'auto' | '1-approver' | '2-approvers' | 'blocked';

export interface ActionInput {
  name: string;
  type: string;
  required?: boolean;
}

export interface Action {
  id: string;
  name: string;
  desc: string;
  category: ActionCategory;
  /** Lucide icon key (resolved from @eidos/ui Icons). */
  icon: string;
  runnableBy: RunnableBy;
  /** The guardrail policy attached to this action. */
  gate: Gate;
  /** Short human label for the guardrail (e.g. "blast-radius > 1 service"). */
  guardrail: string;
  triggers: TriggerKind[];
  inputs: ActionInput[];
  /** Wired Skill (skills.ts id) · the agent capability that calls this. */
  skill?: string;
  /** Wired MCP server (mcp.ts id) · the transport that exposes it. */
  mcp?: string;
  /** Executions in the last 7 days. */
  runsWeek: number;
  /** Platform-maintained vs collaborator-authored. */
  official: boolean;
  author?: string;
  /** Has a guardrail policy attached. An ungoverned action is a warning. */
  governed: boolean;
  deprecated?: boolean;
  version: string;
}

export const ACTION_CATEGORIES: ActionCategory[] = [
  'Deploy', 'Infra', 'Data', 'Security', 'Scaffold', 'Incident',
];

const CATEGORY_ICON: Record<ActionCategory, string> = {
  Deploy: 'rocket', Infra: 'server', Data: 'database', Security: 'shield', Scaffold: 'package', Incident: 'incident',
};
export const categoryIcon = (c: ActionCategory): string => CATEGORY_ICON[c];

export const GATE_META: Record<Gate, { label: string; tone: 'health-up' | 'ice' | 'warning' | 'danger' }> = {
  'auto':        { label: 'Auto',        tone: 'health-up' },
  '1-approver':  { label: '1 approver',  tone: 'ice' },
  '2-approvers': { label: '2 approvers', tone: 'warning' },
  'blocked':     { label: 'Blocked',     tone: 'danger' },
};

export const RUNNER_META: Record<RunnableBy, { label: string; icon: string }> = {
  human: { label: 'Human-run', icon: 'user' },
  agent: { label: 'Agent-run', icon: 'agent' },
  both:  { label: 'Human + agent', icon: 'refresh' },
};

export const TRIGGER_META: Record<TriggerKind, { label: string; icon: string }> = {
  manual:   { label: 'Manual',   icon: 'command' },
  agent:    { label: 'Agent',    icon: 'agent' },
  event:    { label: 'Event',    icon: 'zap' },
  schedule: { label: 'Schedule', icon: 'clock' },
};

export const ACTIONS: Action[] = [
  // ── Deploy ──────────────────────────────────────────────────────────────────
  { id: 'deploy-service', name: 'Deploy service', icon: 'rocket', desc: 'Roll a service version out to an environment through its release pipeline.', category: 'Deploy', runnableBy: 'both', gate: '1-approver', guardrail: 'Production targets need one approver.', triggers: ['manual', 'agent', 'event'], inputs: [{ name: 'service', type: 'ServiceRef', required: true }, { name: 'version', type: 'semver', required: true }, { name: 'env', type: 'dev | stg | prod', required: true }], skill: 'deploy-gating', mcp: 'github', runsWeek: 96, official: true, governed: true, version: 'v2.3.0' },
  { id: 'rollback-deploy', name: 'Rollback deploy', icon: 'undo', desc: 'Revert a service to its previous healthy version. The default self-heal remediation.', category: 'Deploy', runnableBy: 'both', gate: 'auto', guardrail: 'Auto for the last-known-good version; older targets escalate.', triggers: ['manual', 'agent', 'event'], inputs: [{ name: 'service', type: 'ServiceRef', required: true }, { name: 'toVersion', type: 'semver' }], skill: 'deploy-gating', mcp: 'k8s', runsWeek: 31, official: true, governed: true, version: 'v1.9.1' },
  { id: 'toggle-feature-flag', name: 'Toggle feature flag', icon: 'flag', desc: 'Flip a feature flag on or off for a scope, with the consumers it affects resolved first.', category: 'Deploy', runnableBy: 'both', gate: '1-approver', guardrail: 'Flags wrapping a prod path need one approver.', triggers: ['manual', 'agent'], inputs: [{ name: 'flag', type: 'FlagKey', required: true }, { name: 'state', type: 'on | off', required: true }, { name: 'scope', type: 'Scope' }], mcp: 'github', runsWeek: 54, official: true, governed: true, version: 'v1.4.0' },
  { id: 'run-pipeline', name: 'Run pipeline', icon: 'pipeline', desc: 'Trigger a CI/CD pipeline run for a service. Used as a step inside larger workflows.', category: 'Deploy', runnableBy: 'both', gate: 'auto', guardrail: 'No gate · the pipeline carries its own quality gates.', triggers: ['manual', 'agent', 'event', 'schedule'], inputs: [{ name: 'service', type: 'ServiceRef', required: true }, { name: 'ref', type: 'git-ref' }], skill: 'deploy-gating', mcp: 'github', runsWeek: 142, official: true, governed: true, version: 'v3.0.2' },

  // ── Infra ───────────────────────────────────────────────────────────────────
  { id: 'scale-replicas', name: 'Scale replicas', icon: 'layers', desc: 'Change the replica count for a workload on GKE. The default capacity remediation.', category: 'Infra', runnableBy: 'both', gate: 'auto', guardrail: 'Auto within the service capacity envelope; beyond it escalates.', triggers: ['manual', 'agent', 'event'], inputs: [{ name: 'workload', type: 'WorkloadRef', required: true }, { name: 'replicas', type: 'int', required: true }], skill: 'capacity-planning', mcp: 'k8s', runsWeek: 67, official: true, governed: true, version: 'v1.6.0' },
  { id: 'restart-service', name: 'Restart service', icon: 'refresh', desc: 'Roll-restart a workload to clear a stuck state. Non-destructive, drains connections first.', category: 'Infra', runnableBy: 'both', gate: 'auto', guardrail: 'Auto · rolling restart with connection draining.', triggers: ['manual', 'agent', 'event'], inputs: [{ name: 'workload', type: 'WorkloadRef', required: true }], mcp: 'k8s', runsWeek: 23, official: true, governed: true, version: 'v1.2.1' },
  { id: 'apply-terraform', name: 'Apply Terraform', icon: 'cpu', desc: 'Apply an approved Terraform plan to cloud infrastructure.', category: 'Infra', runnableBy: 'both', gate: '2-approvers', guardrail: 'Infra changes need two approvers and a clean plan.', triggers: ['manual'], inputs: [{ name: 'workspace', type: 'TfWorkspace', required: true }, { name: 'planId', type: 'PlanRef', required: true }], mcp: 'terraform', runsWeek: 8, official: true, governed: true, version: 'v0.9.0' },
  { id: 'flush-cache', name: 'Flush cache', icon: 'trash', desc: 'Invalidate a cache namespace. Cheap, reversible, used in incident recovery.', category: 'Infra', runnableBy: 'both', gate: 'auto', guardrail: 'Auto · cache rebuilds on next read.', triggers: ['manual', 'agent'], inputs: [{ name: 'namespace', type: 'string', required: true }], mcp: 'k8s', runsWeek: 39, official: true, governed: true, version: 'v1.0.3' },

  // ── Security ──────────────────────────────────────────────────────────────────
  { id: 'open-remediation-pr', name: 'Open remediation PR', icon: 'gitPullRequest', desc: 'Open a pull request that bumps a vulnerable dependency or fixes a misconfiguration.', category: 'Security', runnableBy: 'agent', gate: '1-approver', guardrail: 'Agent-opened PRs still pass through the change gate.', triggers: ['agent', 'event'], inputs: [{ name: 'finding', type: 'FindingRef', required: true }, { name: 'service', type: 'ServiceRef', required: true }], skill: 'schema-diffing', mcp: 'github', runsWeek: 44, official: true, governed: true, version: 'v1.5.2' },
  { id: 'rotate-secret', name: 'Rotate secret', icon: 'lock', desc: 'Rotate a credential and roll it out to every consumer that holds it.', category: 'Security', runnableBy: 'both', gate: '1-approver', guardrail: 'Shared secrets need one approver before rotation.', triggers: ['manual', 'agent', 'schedule'], inputs: [{ name: 'secretRef', type: 'SecretRef', required: true }], mcp: 'k8s', runsWeek: 12, official: true, governed: true, version: 'v1.3.0' },
  { id: 'grant-access', name: 'Grant access', icon: 'user', desc: 'Grant a principal (human or agent) a scoped permission, with an optional expiry.', category: 'Security', runnableBy: 'both', gate: '2-approvers', guardrail: 'Access grants need two approvers; prod scopes are time-boxed.', triggers: ['manual', 'agent'], inputs: [{ name: 'principal', type: 'PrincipalRef', required: true }, { name: 'scope', type: 'Scope', required: true }, { name: 'expiry', type: 'duration' }], mcp: 'consent', runsWeek: 17, official: true, governed: true, version: 'v2.0.1' },
  { id: 'bump-dependency', name: 'Bump dependency', icon: 'arrowUp', desc: 'Raise a dependency to a patched version and run the consumer contract checks.', category: 'Security', runnableBy: 'agent', gate: '1-approver', guardrail: 'Breaking-change detection routes to the owning team.', triggers: ['agent', 'schedule'], inputs: [{ name: 'package', type: 'string', required: true }, { name: 'toVersion', type: 'semver', required: true }], skill: 'schema-diffing', mcp: 'github', runsWeek: 61, official: false, author: 'Beatriz Okamoto', governed: true, version: 'v0.8.0' },

  // ── Data ────────────────────────────────────────────────────────────────────
  { id: 'provision-database', name: 'Provision database', icon: 'database', desc: 'Stand up a managed database with the bureau baseline (encryption, backups, PII tags).', category: 'Data', runnableBy: 'both', gate: '2-approvers', guardrail: 'New data stores need two approvers and a data-classification.', triggers: ['manual'], inputs: [{ name: 'engine', type: 'postgres | mysql', required: true }, { name: 'tier', type: 'Tier', required: true }, { name: 'owner', type: 'TeamRef', required: true }], mcp: 'snowflake', runsWeek: 4, official: true, governed: true, version: 'v1.1.0' },
  { id: 'snapshot-database', name: 'Snapshot database', icon: 'download', desc: 'Take an on-demand snapshot before a risky migration. Restorable.', category: 'Data', runnableBy: 'both', gate: 'auto', guardrail: 'Auto · read-only, no production impact.', triggers: ['manual', 'agent', 'schedule'], inputs: [{ name: 'database', type: 'DbRef', required: true }], mcp: 'snowflake', runsWeek: 29, official: true, governed: true, version: 'v1.0.0' },
  { id: 'requeue-feed', name: 'Requeue bureau feed', icon: 'refresh', desc: 'Re-enqueue a failed SCR / SCPC feed batch for reprocessing.', category: 'Data', runnableBy: 'both', gate: 'auto', guardrail: 'Auto · idempotent, dedupes on the batch id.', triggers: ['manual', 'agent', 'event'], inputs: [{ name: 'feed', type: 'SCR | SCPC | CadPos', required: true }, { name: 'batchId', type: 'string', required: true }], mcp: 'bureau', runsWeek: 18, official: true, governed: true, version: 'v1.4.1' },
  { id: 'purge-pii', name: 'Purge PII', icon: 'trash', desc: 'Hard-delete a subject’s PII across every store on an LGPD erasure request.', category: 'Data', runnableBy: 'both', gate: 'blocked', guardrail: 'Irreversible. Blocked by default · requires a DPO ticket + two approvers.', triggers: ['manual'], inputs: [{ name: 'subjectId', type: 'CPF', required: true }, { name: 'ticket', type: 'DpoTicketRef', required: true }], mcp: 'consent', runsWeek: 2, official: true, governed: true, version: 'v1.2.0' },

  // ── Scaffold ──────────────────────────────────────────────────────────────────
  { id: 'scaffold-service', name: 'Scaffold service', icon: 'package', desc: 'Create a new service from a golden-path template: repo, pipeline, catalog entry, on-call.', category: 'Scaffold', runnableBy: 'human', gate: 'auto', guardrail: 'Auto · provisions only paved-road defaults.', triggers: ['manual'], inputs: [{ name: 'name', type: 'string', required: true }, { name: 'template', type: 'TemplateRef', required: true }, { name: 'tribe', type: 'TribeRef', required: true }], mcp: 'github', runsWeek: 6, official: true, governed: true, version: 'v2.1.0' },

  // ── Incident ──────────────────────────────────────────────────────────────────
  { id: 'open-incident', name: 'Open incident', icon: 'incident', desc: 'Declare an incident, page the on-call, and open a war room with the context pre-loaded.', category: 'Incident', runnableBy: 'both', gate: 'auto', guardrail: 'Auto · declaring is always safe; severity drives paging.', triggers: ['manual', 'agent', 'event'], inputs: [{ name: 'service', type: 'ServiceRef', required: true }, { name: 'severity', type: 'SEV1..4', required: true }], skill: 'incident-comms', mcp: 'pagerduty', runsWeek: 14, official: true, governed: true, version: 'v1.7.0' },
  { id: 'apply-runbook', name: 'Apply runbook', icon: 'runbook', desc: 'Execute an approved runbook step against a service during an incident.', category: 'Incident', runnableBy: 'agent', gate: '1-approver', guardrail: 'Each runbook step shows its blast radius and waits for go.', triggers: ['agent'], inputs: [{ name: 'runbook', type: 'RunbookRef', required: true }, { name: 'step', type: 'int' }], skill: 'runbook-authoring', mcp: 'k8s', runsWeek: 21, official: true, governed: true, version: 'v1.1.3' },
  { id: 'post-status-update', name: 'Post status update', icon: 'chat', desc: 'Publish a stakeholder / status-page update drafted from the incident timeline.', category: 'Incident', runnableBy: 'both', gate: 'auto', guardrail: 'Auto for internal; the public status page needs one approver.', triggers: ['manual', 'agent'], inputs: [{ name: 'incident', type: 'IncidentRef', required: true }, { name: 'channel', type: 'internal | public' }], skill: 'incident-comms', mcp: 'pagerduty', runsWeek: 26, official: false, author: 'Diego Ferreira', governed: false, version: 'v0.6.1' },
];

export const getAction = (id: string): Action | undefined => ACTIONS.find((a) => a.id === id);

// ── KPIs (same shape the .fp-kpi strip expects) ───────────────────────────────
const agentEnabled = ACTIONS.filter((a) => a.runnableBy !== 'human').length;
const runsWeek = ACTIONS.reduce((m, a) => m + a.runsWeek, 0);
const governedPct = Math.round((ACTIONS.filter((a) => a.governed).length / ACTIONS.length) * 100);

export const KPIS = [
  { id: 'actions', label: 'Actions', value: String(ACTIONS.length), note: 'Codified, executable units.' },
  { id: 'agent', label: 'Agent-enabled', value: String(agentEnabled), note: 'Callable by agents, not just humans.' },
  { id: 'runs', label: 'Runs / week', value: String(runsWeek), note: 'Across humans, agents and workflows.' },
  { id: 'governed', label: 'Governed', value: `${governedPct}%`, note: 'Carry a guardrail policy.' },
];

export const AI_READ = {
  title: 'Forge AI read',
};

// ── Static run history per action (for the detail page) ───────────────────────
export interface ActionRun { id: string; principal: string; isAgent: boolean; target: string; when: string; outcome: 'ok' | 'escalated' | 'rolled-back' }

const RUNS_BY_ACTION: Record<string, ActionRun[]> = {
  'deploy-service': [
    { id: 'r-9012', principal: 'Deploy-bot', isAgent: true, target: 'credit-score · prod', when: '12m ago', outcome: 'ok' },
    { id: 'r-9008', principal: 'ana.silva', isAgent: false, target: 'kyc-api · stg', when: '1h ago', outcome: 'ok' },
    { id: 'r-8999', principal: 'Deploy-bot', isAgent: true, target: 'ledger · prod', when: '3h ago', outcome: 'escalated' },
  ],
  'rollback-deploy': [
    { id: 'r-9011', principal: 'Sentinel', isAgent: true, target: 'credit-score · prod', when: '20m ago', outcome: 'ok' },
    { id: 'r-8970', principal: 'Sentinel', isAgent: true, target: 'feed-ingest · prod', when: 'Yesterday', outcome: 'rolled-back' },
  ],
  'open-remediation-pr': [
    { id: 'r-9005', principal: 'AppSec-bot', isAgent: true, target: 'lib bump · 6 services', when: '40m ago', outcome: 'ok' },
    { id: 'r-8990', principal: 'AppSec-bot', isAgent: true, target: 'tls config · gateway', when: '2h ago', outcome: 'escalated' },
  ],
  'purge-pii': [
    { id: 'r-8888', principal: 'lucas.dpo', isAgent: false, target: 'subject 048.* · erasure', when: '2d ago', outcome: 'ok' },
  ],
};

const DEFAULT_RUNS = (a: Action): ActionRun[] => [
  { id: 'r-' + a.id.slice(0, 4), principal: a.runnableBy === 'human' ? 'maria.lopes' : 'Deploy-bot', isAgent: a.runnableBy !== 'human', target: 'credit-score', when: '1h ago', outcome: 'ok' },
  { id: 'r-' + a.id.slice(0, 3) + 'x', principal: 'pedro.alves', isAgent: false, target: 'kyc-api', when: 'Yesterday', outcome: 'ok' },
];

export const runsFor = (a: Action): ActionRun[] => RUNS_BY_ACTION[a.id] ?? DEFAULT_RUNS(a);
