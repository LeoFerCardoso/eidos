// Forge (IDP Portal) · Workflows (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/workflows + /portal/workflows/[id]. A WORKFLOW is the COMPOSITE
// orchestration level: a graph that SEQUENCES Actions (with branches, guardrails
// and triggers). It does no work itself; every step is an Action call or an
// agent reasoning step. The three Port flagship use-cases are workflow templates
// here. See the domain model in docs/AGENTIC-PLATFORM-VISION.md §2 / §2.1.
//
// The graph is hand-laid (deterministic node positions) so React Flow renders
// the same layout every time (no hydration drift). `actionId` on a node links to
// the real Action in /portal/actions; non-action nodes are agent reasoning,
// guardrails, branches and terminals.

import type { AgentArchetype } from './agents';
import type { TriggerKind } from './actions';

export type WfNodeKind =
  | 'trigger'    // what starts the workflow
  | 'action'     // a catalog Action (links to /portal/actions/[id])
  | 'guardrail'  // a gate that can escalate to a human
  | 'reason'     // agent reasoning (plan / diagnose / prioritize / judge) — no side effect
  | 'verify'     // a check step
  | 'escalate'   // hand off to a human (Decide)
  | 'done';      // terminal

export interface WfNode {
  id: string;
  kind: WfNodeKind;
  label: string;
  sublabel?: string;
  /** Links to the real Action in the registry (action + verify nodes). */
  actionId?: string;
  /** Gate label for guardrail nodes (Auto / 1 approver / 2 approvers / Blocked). */
  gate?: string;
  x: number;
  y: number;
}

export type WfEdgeKind = 'default' | 'approve' | 'deny' | 'branch';
export interface WfEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  kind?: WfEdgeKind;
}

export interface WfRun {
  id: string;
  service: string;
  status: 'running' | 'verified' | 'rolled-back' | 'escalated' | 'failed';
  when: string;
  trigger: string;
}

export interface Workflow {
  id: string;
  name: string;
  desc: string;
  ownerRole: AgentArchetype;
  trigger: { kind: TriggerKind; label: string };
  status: 'published' | 'draft';
  successRate: number; // %
  runsWeek: number;
  lastRun: string;
  nodes: WfNode[];
  edges: WfEdge[];
  runs: WfRun[];
}

// Layout helpers — a centre column with left/right branch lanes.
const C = 280, L = 60, R = 500, STEP = 116;
const row = (i: number) => i * STEP;

export const WORKFLOWS: Workflow[] = [
  // ── 1. Self-heal incident (flagship) ──────────────────────────────────────
  {
    id: 'self-heal-incident',
    name: 'Self-heal incident',
    desc: 'On an SLO breach, declare the incident, diagnose the cause, and apply the safe remediation behind a blast-radius guardrail. Escalates to a human only when the blast radius is high.',
    ownerRole: 'incident-manager',
    trigger: { kind: 'event', label: 'SLO breach' },
    status: 'published',
    successRate: 84,
    runsWeek: 37,
    lastRun: '12m ago',
    nodes: [
      { id: 'trig', kind: 'trigger', label: 'SLO breach', sublabel: 'Event · Datadog monitor', x: C, y: row(0) },
      { id: 'open', kind: 'action', label: 'Open incident', sublabel: 'auto', actionId: 'open-incident', x: C, y: row(1) },
      { id: 'diag', kind: 'reason', label: 'Diagnose', sublabel: 'Correlate deploys · deps · runbooks', x: C, y: row(2) },
      { id: 'gr', kind: 'guardrail', label: 'Blast radius', sublabel: 'within envelope?', gate: 'auto / escalate', x: C, y: row(3) },
      { id: 'roll', kind: 'action', label: 'Rollback deploy', sublabel: 'auto', actionId: 'rollback-deploy', x: L, y: row(4) },
      { id: 'scale', kind: 'action', label: 'Scale replicas', sublabel: 'auto', actionId: 'scale-replicas', x: C, y: row(4) },
      { id: 'restart', kind: 'action', label: 'Restart service', sublabel: 'auto', actionId: 'restart-service', x: R, y: row(4) },
      { id: 'esc', kind: 'escalate', label: 'Escalate to human', sublabel: 'Decide queue', x: R + 130, y: row(3) + 64 },
      { id: 'verify', kind: 'verify', label: 'Verify', sublabel: 'run-pipeline · smoke', actionId: 'run-pipeline', x: C, y: row(5) },
      { id: 'status', kind: 'action', label: 'Post status update', sublabel: 'auto · internal', actionId: 'post-status-update', x: C, y: row(6) },
      { id: 'done', kind: 'done', label: 'Resolved', x: C, y: row(7) },
    ],
    edges: [
      { id: 'e1', from: 'trig', to: 'open' },
      { id: 'e2', from: 'open', to: 'diag' },
      { id: 'e3', from: 'diag', to: 'gr' },
      { id: 'e4', from: 'gr', to: 'roll', label: 'auto', kind: 'approve' },
      { id: 'e5', from: 'gr', to: 'scale', label: 'auto', kind: 'approve' },
      { id: 'e6', from: 'gr', to: 'restart', label: 'auto', kind: 'approve' },
      { id: 'e7', from: 'gr', to: 'esc', label: 'blast HIGH', kind: 'deny' },
      { id: 'e8', from: 'roll', to: 'verify' },
      { id: 'e9', from: 'scale', to: 'verify' },
      { id: 'e10', from: 'restart', to: 'verify' },
      { id: 'e11', from: 'verify', to: 'status' },
      { id: 'e12', from: 'status', to: 'done' },
    ],
    runs: [
      { id: 'wf-4901', service: 'credit-score', status: 'running', when: '12m ago', trigger: 'SLO breach' },
      { id: 'wf-4880', service: 'kyc-api', status: 'verified', when: '3h ago', trigger: 'SLO breach' },
      { id: 'wf-4862', service: 'ledger', status: 'rolled-back', when: 'Yesterday', trigger: 'p99 spike' },
      { id: 'wf-4844', service: 'feed-ingest', status: 'escalated', when: '2d ago', trigger: 'error rate' },
    ],
  },

  // ── 2. Ticket to production (flagship) ────────────────────────────────────
  {
    id: 'ticket-to-prod',
    name: 'Ticket to production',
    desc: 'Take an assigned ticket all the way to a deployed, verified change: plan, implement, gate on the Change Risk Score, and ship with a one-click rollback handle.',
    ownerRole: 'developer',
    trigger: { kind: 'event', label: 'Ticket assigned' },
    status: 'published',
    successRate: 71,
    runsWeek: 58,
    lastRun: '25m ago',
    nodes: [
      { id: 'trig', kind: 'trigger', label: 'Ticket assigned', sublabel: 'Intake · Jira / Linear', x: C, y: row(0) },
      { id: 'plan', kind: 'reason', label: 'Plan', sublabel: 'Pick skill · estimate blast', x: C, y: row(1) },
      { id: 'impl', kind: 'reason', label: 'Implement', sublabel: 'Branch · code · open PR (github-mcp)', x: C, y: row(2) },
      { id: 'pipe', kind: 'action', label: 'Run pipeline', sublabel: 'build · test', actionId: 'run-pipeline', x: C, y: row(3) },
      { id: 'gate', kind: 'guardrail', label: 'Quality gate', sublabel: 'Change Risk Score', gate: 'auto / N approvers', x: C, y: row(4) },
      { id: 'esc', kind: 'escalate', label: 'Reviewers', sublabel: 'CRS ≥ 600 · 2 approvers', x: R + 130, y: row(4) + 64 },
      { id: 'deploy', kind: 'action', label: 'Deploy service', sublabel: '1 approver if prod', actionId: 'deploy-service', x: C, y: row(5) },
      { id: 'verify', kind: 'verify', label: 'Verify', sublabel: 'post-deploy checks · DORA', x: C, y: row(6) },
      { id: 'done', kind: 'done', label: 'Shipped', sublabel: 'rollback-deploy on standby', x: C, y: row(7) },
    ],
    edges: [
      { id: 'e1', from: 'trig', to: 'plan' },
      { id: 'e2', from: 'plan', to: 'impl' },
      { id: 'e3', from: 'impl', to: 'pipe' },
      { id: 'e4', from: 'pipe', to: 'gate' },
      { id: 'e5', from: 'gate', to: 'deploy', label: 'pass', kind: 'approve' },
      { id: 'e6', from: 'gate', to: 'esc', label: 'high risk', kind: 'deny' },
      { id: 'e7', from: 'esc', to: 'deploy', label: 'approved', kind: 'approve' },
      { id: 'e8', from: 'deploy', to: 'verify' },
      { id: 'e9', from: 'verify', to: 'done' },
    ],
    runs: [
      { id: 'wf-4899', service: 'onboarding-bff', status: 'verified', when: '25m ago', trigger: 'BUR-2231' },
      { id: 'wf-4871', service: 'consent-api', status: 'running', when: '1h ago', trigger: 'BUR-2228' },
      { id: 'wf-4850', service: 'score-engine', status: 'escalated', when: '4h ago', trigger: 'BUR-2219' },
    ],
  },

  // ── 3. AppSec remediation (flagship) ──────────────────────────────────────
  {
    id: 'appsec-remediation',
    name: 'AppSec remediation',
    desc: 'On a new CVE or the nightly scan, prioritize findings by blast radius, open a remediation PR, gate it, ship it, and have the policy-judge sign off any accepted-risk deviations.',
    ownerRole: 'policy-judge',
    trigger: { kind: 'schedule', label: 'Nightly scan / new CVE' },
    status: 'published',
    successRate: 78,
    runsWeek: 44,
    lastRun: '40m ago',
    nodes: [
      { id: 'trig', kind: 'trigger', label: 'Nightly scan', sublabel: 'Schedule · or new-CVE event', x: C, y: row(0) },
      { id: 'prio', kind: 'reason', label: 'Prioritize', sublabel: 'Blast-radius × exploitability × exposure', x: C, y: row(1) },
      { id: 'bump', kind: 'action', label: 'Bump dependency', sublabel: '1 approver', actionId: 'bump-dependency', x: L, y: row(2) },
      { id: 'pr', kind: 'action', label: 'Open remediation PR', sublabel: '1 approver', actionId: 'open-remediation-pr', x: R, y: row(2) },
      { id: 'pipe', kind: 'action', label: 'Run pipeline', sublabel: 'build · test', actionId: 'run-pipeline', x: C, y: row(3) },
      { id: 'gate', kind: 'guardrail', label: 'Quality gate', sublabel: 'Change Risk Score', gate: 'auto / N approvers', x: C, y: row(4) },
      { id: 'deploy', kind: 'action', label: 'Deploy service', sublabel: '1 approver if prod', actionId: 'deploy-service', x: C, y: row(5) },
      { id: 'judge', kind: 'reason', label: 'Policy-judge', sublabel: 'Sign off accepted-risk deviations', x: C, y: row(6) },
      { id: 'done', kind: 'done', label: 'Posture restored', x: C, y: row(7) },
    ],
    edges: [
      { id: 'e1', from: 'trig', to: 'prio' },
      { id: 'e2', from: 'prio', to: 'bump', label: 'dep CVE', kind: 'branch' },
      { id: 'e3', from: 'prio', to: 'pr', label: 'config / code', kind: 'branch' },
      { id: 'e4', from: 'bump', to: 'pipe' },
      { id: 'e5', from: 'pr', to: 'pipe' },
      { id: 'e6', from: 'pipe', to: 'gate' },
      { id: 'e7', from: 'gate', to: 'deploy', label: 'pass', kind: 'approve' },
      { id: 'e8', from: 'deploy', to: 'judge' },
      { id: 'e9', from: 'judge', to: 'done' },
    ],
    runs: [
      { id: 'wf-4905', service: 'lib: openssl · 6 svc', status: 'running', when: '40m ago', trigger: 'CVE-2026-3199' },
      { id: 'wf-4890', service: 'gateway', status: 'verified', when: '2h ago', trigger: 'Nightly scan' },
      { id: 'wf-4877', service: 'identity-svc', status: 'escalated', when: '6h ago', trigger: 'Nightly scan' },
    ],
  },

  // ── 4. Onboard service (self-service, human-led) ──────────────────────────
  {
    id: 'onboard-service',
    name: 'Onboard a service',
    desc: 'Stand up a new service from a golden-path template: repo, pipeline, catalog entry and on-call, all wired to the paved-road defaults.',
    ownerRole: 'team-lead',
    trigger: { kind: 'manual', label: 'New service request' },
    status: 'published',
    successRate: 97,
    runsWeek: 6,
    lastRun: 'Yesterday',
    nodes: [
      { id: 'trig', kind: 'trigger', label: 'New service request', sublabel: 'Manual · self-service', x: C, y: row(0) },
      { id: 'scaffold', kind: 'action', label: 'Scaffold service', sublabel: 'auto · golden path', actionId: 'scaffold-service', x: C, y: row(1) },
      { id: 'db', kind: 'action', label: 'Provision database', sublabel: '2 approvers', actionId: 'provision-database', x: C, y: row(2) },
      { id: 'pipe', kind: 'action', label: 'Run pipeline', sublabel: 'first build', actionId: 'run-pipeline', x: C, y: row(3) },
      { id: 'done', kind: 'done', label: 'Service live', sublabel: 'in catalog · on-call set', x: C, y: row(4) },
    ],
    edges: [
      { id: 'e1', from: 'trig', to: 'scaffold' },
      { id: 'e2', from: 'scaffold', to: 'db' },
      { id: 'e3', from: 'db', to: 'pipe' },
      { id: 'e4', from: 'pipe', to: 'done' },
    ],
    runs: [
      { id: 'wf-4812', service: 'dispute-bff', status: 'verified', when: 'Yesterday', trigger: 'request' },
      { id: 'wf-4790', service: 'pix-aux', status: 'verified', when: '3d ago', trigger: 'request' },
    ],
  },

  // ── 5. LGPD erasure (the blocked-gate showcase) ───────────────────────────
  {
    id: 'lgpd-erasure',
    name: 'LGPD data erasure',
    desc: 'Fulfil a right-to-erasure request. Always human-gated: the destructive purge is blocked by default and needs a DPO ticket plus two approvers before it runs.',
    ownerRole: 'policy-judge',
    trigger: { kind: 'event', label: 'Erasure request' },
    status: 'published',
    successRate: 100,
    runsWeek: 2,
    lastRun: '2d ago',
    nodes: [
      { id: 'trig', kind: 'trigger', label: 'Erasure request', sublabel: 'Event · DPO intake', x: C, y: row(0) },
      { id: 'map', kind: 'reason', label: 'Map PII hops', sublabel: 'Which stores hold the subject', x: C, y: row(1) },
      { id: 'gr', kind: 'guardrail', label: 'Erasure gate', sublabel: 'DPO ticket + 2 approvers', gate: 'blocked by default', x: C, y: row(2) },
      { id: 'purge', kind: 'action', label: 'Purge PII', sublabel: 'irreversible', actionId: 'purge-pii', x: C, y: row(3) },
      { id: 'done', kind: 'done', label: 'Erased · evidenced', sublabel: 'logged to LGPD audit', x: C, y: row(4) },
    ],
    edges: [
      { id: 'e1', from: 'trig', to: 'map' },
      { id: 'e2', from: 'map', to: 'gr' },
      { id: 'e3', from: 'gr', to: 'purge', label: 'approved', kind: 'approve' },
      { id: 'e4', from: 'purge', to: 'done' },
    ],
    runs: [
      { id: 'wf-4801', service: 'subject 048.*', status: 'verified', when: '2d ago', trigger: 'DPO-1182' },
    ],
  },
];

export const getWorkflow = (id: string): Workflow | undefined => WORKFLOWS.find((w) => w.id === id);

export const RUN_STATUS_META: Record<WfRun['status'], { label: string; tone: 'ember' | 'health-up' | 'ice' | 'warning' | 'danger' }> = {
  'running':     { label: 'running',     tone: 'ember' },
  'verified':    { label: 'verified',    tone: 'health-up' },
  'rolled-back': { label: 'rolled back', tone: 'ice' },
  'escalated':   { label: 'escalated',   tone: 'warning' },
  'failed':      { label: 'failed',      tone: 'danger' },
};

const totalRuns = WORKFLOWS.reduce((m, w) => m + w.runsWeek, 0);
const avgSuccess = Math.round(WORKFLOWS.reduce((m, w) => m + w.successRate, 0) / WORKFLOWS.length);

export const KPIS = [
  { id: 'workflows', label: 'Workflows', value: String(WORKFLOWS.length), note: 'Composite orchestrations.' },
  { id: 'autonomous', label: 'Autonomous-eligible', value: String(WORKFLOWS.filter((w) => w.ownerRole !== 'team-lead').length), note: 'Agent-owned templates.' },
  { id: 'runs', label: 'Runs / week', value: String(totalRuns), note: 'Across every workflow.' },
  { id: 'success', label: 'Avg success', value: `${avgSuccess}%`, note: 'Verified without rollback.' },
];
