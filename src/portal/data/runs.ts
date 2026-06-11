// Forge (IDP Portal) · Runs (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/runs + /portal/runs/[run]. A RUN is one EXECUTION instance of a
// Workflow (the instance level of the domain model). The list is the global
// view; each run drills into a step timeline where every step is an Action call
// with its guardrail verdict inline and a per-step rollback. Runs are derived
// from the workflow definitions so ids match the "Runs of this workflow" links
// in /portal/workflows/[id]. See docs/AGENTIC-PLATFORM-VISION.md §2 / §7.4.

import { WORKFLOWS, getWorkflow, type Workflow, type WfRun, type WfNode } from './workflows';
import { getAction } from './actions';

export type RunStatus = WfRun['status'];

export interface Run {
  id: string;
  workflowId: string;
  workflowName: string;
  agent: string;
  agentRole: string;
  service: string;
  trigger: string;
  status: RunStatus;
  when: string;
  duration: string;
}

// The agent that owns each workflow's runs (the run principal).
const AGENT_BY_WORKFLOW: Record<string, string> = {
  'self-heal-incident': 'Sentinel',
  'ticket-to-prod': 'Deploy-bot',
  'appsec-remediation': 'AppSec-bot',
  'onboard-service': 'Onboard-bot',
  'lgpd-erasure': 'LGPD-bot',
};
const ROLE_BY_WORKFLOW: Record<string, string> = {
  'self-heal-incident': 'Incident manager',
  'ticket-to-prod': 'Developer',
  'appsec-remediation': 'Policy judge',
  'onboard-service': 'Team lead',
  'lgpd-erasure': 'Policy judge',
};

const DURATION = (status: RunStatus, i: number): string => {
  if (status === 'running') return `${2 + (i % 4)}m elapsed`;
  if (status === 'escalated') return 'waiting on approval';
  const secs = 95 + (i * 37) % 240;
  return `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, '0')}s`;
};

export const RUNS: Run[] = WORKFLOWS.flatMap((w) =>
  w.runs.map((r, i) => ({
    id: r.id,
    workflowId: w.id,
    workflowName: w.name,
    agent: AGENT_BY_WORKFLOW[w.id] ?? 'agent',
    agentRole: ROLE_BY_WORKFLOW[w.id] ?? '',
    service: r.service,
    trigger: r.trigger,
    status: r.status,
    when: r.when,
    duration: DURATION(r.status, i),
  })),
);

export const getRun = (id: string): Run | undefined => RUNS.find((r) => r.id === id);

// ── Step timeline ─────────────────────────────────────────────────────────────

export type StepStatus = 'done' | 'running' | 'pending' | 'escalated' | 'rolled-back' | 'skipped' | 'failed';

export interface RunStep {
  id: string;
  kind: WfNode['kind'];
  label: string;
  sublabel?: string;
  actionId?: string;
  status: StepStatus;
  /** Guardrail verdict shown inline on guardrail steps. */
  verdict?: { label: string; tone: 'health-up' | 'warning' | 'ice' };
  duration?: string;
  /** This step can be individually rolled back. */
  reversible?: boolean;
}

export const STEP_STATUS_META: Record<StepStatus, { label: string; tone: 'ember' | 'health-up' | 'ice' | 'warning' | 'danger' | 'neutral' }> = {
  'done':        { label: 'done',        tone: 'health-up' },
  'running':     { label: 'running',     tone: 'ember' },
  'pending':     { label: 'pending',     tone: 'neutral' },
  'escalated':   { label: 'awaiting human', tone: 'warning' },
  'rolled-back': { label: 'rolled back', tone: 'ice' },
  'skipped':     { label: 'skipped',     tone: 'neutral' },
  'failed':      { label: 'failed',      tone: 'danger' },
};

// Hand-authored hero timelines for the most-linked runs. Everything else is
// derived from the workflow definition + the run status (see deriveSteps).
const STEPS_BY_RUN: Record<string, RunStep[]> = {
  // self-heal, currently running, stuck on the blast-radius guardrail
  'wf-4901': [
    { id: 's1', kind: 'trigger', label: 'SLO breach', sublabel: 'credit-score · p99 > 800ms', status: 'done', duration: '0s' },
    { id: 's2', kind: 'action', label: 'Open incident', sublabel: 'open-incident · auto', actionId: 'open-incident', status: 'done', duration: '2s' },
    { id: 's3', kind: 'reason', label: 'Diagnose', sublabel: 'Root cause: deploy v2.3 · confidence 0.86', status: 'done', duration: '34s' },
    { id: 's4', kind: 'guardrail', label: 'Blast radius', sublabel: 'credit-score · 8 dependents · tier-0', status: 'escalated', verdict: { label: 'HIGH · escalated', tone: 'warning' }, duration: '1s' },
    { id: 's5', kind: 'action', label: 'Rollback deploy', sublabel: 'rollback-deploy · to v2.2', actionId: 'rollback-deploy', status: 'pending', reversible: true },
    { id: 's6', kind: 'verify', label: 'Verify', sublabel: 'run-pipeline · smoke', actionId: 'run-pipeline', status: 'pending' },
    { id: 's7', kind: 'action', label: 'Post status update', sublabel: 'post-status-update · internal', actionId: 'post-status-update', status: 'pending' },
    { id: 's8', kind: 'done', label: 'Resolved', status: 'pending' },
  ],
  // self-heal, rolled back
  'wf-4862': [
    { id: 's1', kind: 'trigger', label: 'p99 spike', sublabel: 'ledger', status: 'done', duration: '0s' },
    { id: 's2', kind: 'action', label: 'Open incident', sublabel: 'open-incident · auto', actionId: 'open-incident', status: 'done', duration: '2s' },
    { id: 's3', kind: 'reason', label: 'Diagnose', sublabel: 'Root cause: memory leak · confidence 0.72', status: 'done', duration: '41s' },
    { id: 's4', kind: 'guardrail', label: 'Blast radius', sublabel: 'within envelope', status: 'done', verdict: { label: 'auto', tone: 'health-up' }, duration: '1s' },
    { id: 's5', kind: 'action', label: 'Restart service', sublabel: 'restart-service · auto', actionId: 'restart-service', status: 'done', duration: '18s', reversible: true },
    { id: 's6', kind: 'verify', label: 'Verify', sublabel: 'run-pipeline · smoke FAILED', actionId: 'run-pipeline', status: 'failed', duration: '52s' },
    { id: 's7', kind: 'action', label: 'Auto rollback', sublabel: 'restart reverted · escalated to human', status: 'rolled-back', duration: '12s' },
  ],
};

// Derive a believable timeline for any run from its workflow + status.
function deriveSteps(w: Workflow, status: RunStatus): RunStep[] {
  // Linear order (array order), drop the side escalate node.
  const seq = w.nodes.filter((n) => n.kind !== 'escalate');
  // Collapse same-y branch siblings: keep the first as taken, others skipped.
  const seenY = new Set<number>();
  const cut =
    status === 'verified' ? seq.length :
    status === 'running' ? Math.max(2, Math.round(seq.length * 0.6)) :
    status === 'escalated' ? seq.findIndex((n) => n.kind === 'guardrail') + 1 || Math.round(seq.length * 0.5) :
    status === 'rolled-back' ? Math.round(seq.length * 0.7) :
    Math.round(seq.length * 0.5);

  return seq.map((n, i) => {
    const sibling = n.y !== undefined && seenY.has(n.y);
    if (n.y !== undefined) seenY.add(n.y);
    let st: StepStatus;
    if (sibling) st = 'skipped';
    else if (i < cut) st = 'done';
    else if (i === cut) st = status === 'running' ? 'running' : status === 'escalated' ? 'escalated' : status === 'failed' ? 'failed' : status === 'rolled-back' ? 'rolled-back' : 'pending';
    else st = 'pending';
    if (status === 'verified') st = 'done';
    return {
      id: n.id,
      kind: n.kind,
      label: n.label,
      sublabel: n.sublabel,
      actionId: n.actionId,
      status: st,
      verdict: n.kind === 'guardrail' ? { label: st === 'escalated' ? 'escalated' : 'auto', tone: st === 'escalated' ? 'warning' as const : 'health-up' as const } : undefined,
      reversible: n.kind === 'action' && (st === 'done'),
    };
  });
}

export const stepsFor = (run: Run): RunStep[] => {
  if (STEPS_BY_RUN[run.id]) return STEPS_BY_RUN[run.id];
  const w = getWorkflow(run.workflowId);
  return w ? deriveSteps(w, run.status) : [];
};

// Right-rail context for a run (what the agent consumed + artifacts).
export interface RunContext {
  consumed: string[];
  guardrails: number;
  approver?: string;
  artifacts: { label: string; kind: string }[];
}

export const contextFor = (run: Run): RunContext => {
  const steps = stepsFor(run);
  const guardrails = steps.filter((s) => s.kind === 'guardrail').length;
  // A run whose current step is escalated is waiting on a human, even while its
  // top-level status still reads "running".
  const hasEscalated = run.status === 'escalated' || steps.some((s) => s.status === 'escalated');
  const approver = hasEscalated ? 'ana.silva (pending)' : run.status === 'verified' ? 'auto-gated' : undefined;
  return {
    consumed: [`svc ${run.service}`, `trigger ${run.trigger}`, `workflow ${run.workflowName}`],
    guardrails,
    approver,
    artifacts: [
      { label: run.id.toUpperCase(), kind: 'run' },
      ...(run.workflowId === 'self-heal-incident' ? [{ label: 'INC-318', kind: 'incident' }] : []),
      ...(run.workflowId === 'ticket-to-prod' || run.workflowId === 'appsec-remediation' ? [{ label: 'PR #338', kind: 'pr' }] : []),
    ],
  };
};

// ── KPIs ──────────────────────────────────────────────────────────────────────
const running = RUNS.filter((r) => r.status === 'running').length;
const escalated = RUNS.filter((r) => r.status === 'escalated').length;
const rolledBack = RUNS.filter((r) => r.status === 'rolled-back').length;
const autonomousPct = Math.round((RUNS.filter((r) => r.status === 'verified').length / RUNS.length) * 100);

export const KPIS = [
  { id: 'runs', label: 'Runs (24h)', value: String(RUNS.length), note: 'Workflow executions.' },
  { id: 'running', label: 'Running now', value: String(running), note: 'In flight across the fleet.' },
  { id: 'awaiting', label: 'Awaiting approval', value: String(escalated), note: 'Escalated to a human.' },
  { id: 'rolled', label: 'Rolled back', value: String(rolledBack), note: `${autonomousPct}% verified clean.` },
];
