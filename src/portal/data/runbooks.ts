// Forge (IDP Portal) — Runbook catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/runbooks — every operational runbook the SRE team owns. The
// view leads with what on-call cares about: automation level, success rate,
// how often it runs, when it last ran, and which incidents it resolves. Mock
// but consistent.

export type Automation = 'automated' | 'semi' | 'manual';
export type RbCategory = 'Rollback' | 'Failover' | 'Scaling' | 'Recovery' | 'Mitigation' | 'Maintenance';
export type Trigger = 'alert' | 'manual' | 'auto';

export interface Runbook {
  id: string;
  title: string;
  desc: string;
  category: RbCategory;
  service: string;
  automation: Automation;
  success: number; // %
  runs: number; // last 90d
  lastRun: string;
  avg: string; // avg duration
  owner: string;
  trigger: Trigger;
  incidents: number; // resolved via this runbook
}

export const CATEGORIES: RbCategory[] = ['Rollback', 'Failover', 'Scaling', 'Recovery', 'Mitigation', 'Maintenance'];

export const AUTOMATION_META: Record<Automation, { label: string; tone: 'health-up' | 'ice' | 'warning'; color: string }> = {
  automated: { label: 'Automated', tone: 'health-up', color: 'var(--success)' },
  semi: { label: 'Semi-auto', tone: 'ice', color: 'var(--accent-2)' },
  manual: { label: 'Manual', tone: 'warning', color: 'var(--warning)' },
};

export const RUNBOOKS: Runbook[] = [
  { id: 'rb-acerta-rollback', title: 'Roll back acerta-api to last good', desc: 'Reverts the active deploy to the previous healthy version.', category: 'Rollback',   service: 'acerta-api',        automation: 'automated', success: 98, runs: 41, lastRun: 'yesterday',  avg: '2m 10s', owner: 'Larissa Fontana', trigger: 'auto',   incidents: 12 },
  { id: 'rb-bureau-failover', title: 'Fail bureau feeds to secondary',     desc: 'Switches SCPC and bureau feeds to the br-ne-1 region.',      category: 'Failover',   service: 'scpc-gateway',      automation: 'automated', success: 97, runs: 19, lastRun: '2 days ago', avg: '3m 40s', owner: 'Diego Vasquez',   trigger: 'alert',  incidents: 6 },
  { id: 'rb-scale-workers',   title: 'Scale a worker pool to target depth', desc: 'Right-sizes a worker pool based on queue depth.',           category: 'Scaling',    service: 'document-ocr',      automation: 'automated', success: 95, runs: 52, lastRun: '4 days ago', avg: '1m 20s', owner: 'Larissa Fontana', trigger: 'alert',  incidents: 4 },
  { id: 'rb-rule-revert',     title: 'Revert an antifraud rule',           desc: 'Rolls a konduto rule back to its prior version.',           category: 'Rollback',   service: 'konduto-antifraud', automation: 'semi',      success: 99, runs: 88, lastRun: 'today',      avg: '45s',    owner: 'Beatriz Okamoto', trigger: 'manual', incidents: 9 },
  { id: 'rb-acerta-circuit',  title: 'Trip the score-engine circuit',      desc: 'Opens the circuit breaker to shed load from score-engine.', category: 'Mitigation', service: 'acerta-api',        automation: 'semi',      success: 94, runs: 23, lastRun: '1 week ago', avg: '30s',    owner: 'Thiago Albuquerque', trigger: 'manual', incidents: 5 },
  { id: 'rb-ingest-halt',     title: 'Halt ingestion and capture to DLQ',  desc: 'Pauses ingestion and routes records to the dead-letter queue.', category: 'Mitigation', service: 'bureau-ingestion', automation: 'semi',     success: 100,runs: 7,  lastRun: '6 days ago', avg: '1m 05s', owner: 'Diego Vasquez',   trigger: 'alert',  incidents: 3 },
  { id: 'rb-db-failover',     title: 'Promote read replica to primary',    desc: 'Promotes the standby replica during a primary outage.',     category: 'Failover',   service: 'identity-proofing', automation: 'manual',    success: 92, runs: 5,  lastRun: '3 weeks ago',avg: '6m 30s', owner: 'Larissa Fontana', trigger: 'manual', incidents: 2 },
  { id: 'rb-cache-flush',     title: 'Flush and warm the device cache',    desc: 'Clears the Redis device cache and pre-warms hot keys.',      category: 'Recovery',   service: 'device-fingerprint',automation: 'automated', success: 96, runs: 31, lastRun: '5 days ago', avg: '50s',    owner: 'Beatriz Okamoto', trigger: 'alert',  incidents: 3 },
  { id: 'rb-consent-replay',  title: 'Replay consent events from log',     desc: 'Re-applies missed consent changes from the event log.',     category: 'Recovery',   service: 'consent-service',   automation: 'manual',    success: 88, runs: 4,  lastRun: '1 month ago',avg: '12m',    owner: 'Larissa Fontana', trigger: 'manual', incidents: 1 },
  { id: 'rb-cert-rotate',     title: 'Rotate an expiring upstream cert',   desc: 'Renews and deploys an upstream TLS certificate.',           category: 'Maintenance',service: 'scpc-gateway',      automation: 'semi',      success: 90, runs: 14, lastRun: '2 weeks ago',avg: '4m',     owner: 'Diego Vasquez',   trigger: 'manual', incidents: 1 },
  { id: 'rb-recovery-replay', title: 'Reprocess stuck recovery cases',     desc: 'Drains and reprocesses the recovery case backlog.',         category: 'Recovery',   service: 'recovery-comms',    automation: 'manual',    success: 79, runs: 6,  lastRun: '5 weeks ago',avg: '18m',    owner: 'Mariana Castelli', trigger: 'manual', incidents: 2 },
  { id: 'rb-canary-abort',    title: 'Abort a canary and roll forward',    desc: 'Stops a failing canary and restores full traffic.',         category: 'Rollback',   service: 'decision-engine',   automation: 'automated', success: 97, runs: 28, lastRun: '3 days ago', avg: '1m 50s', owner: 'Thiago Albuquerque', trigger: 'auto', incidents: 7 },
];

export const TRIGGER_META: Record<Trigger, { label: string; tone: 'ember' | 'ice' | 'neutral' }> = {
  auto: { label: 'Auto', tone: 'ember' },
  alert: { label: 'On alert', tone: 'ice' },
  manual: { label: 'Manual', tone: 'neutral' },
};

export const successColor = (n: number): string => (n >= 95 ? 'var(--success)' : n >= 85 ? 'var(--fg)' : 'var(--danger)');

/** Automation coverage, for the breakdown bars. */
const total = RUNBOOKS.length;
export const AUTOMATION_MIX = (['automated', 'semi', 'manual'] as Automation[]).map((a) => ({
  automation: a,
  label: AUTOMATION_META[a].label,
  color: AUTOMATION_META[a].color,
  count: RUNBOOKS.filter((r) => r.automation === a).length,
  pct: (RUNBOOKS.filter((r) => r.automation === a).length / total) * 100,
}));

/** Runbooks that need attention — low success or gone stale. */
export const NEEDS_ATTENTION = RUNBOOKS.filter((r) => r.success < 90).sort((a, b) => a.success - b.success);

export const KPIS = [
  { id: 'total', label: 'Runbooks', value: String(RUNBOOKS.length), note: `Across ${CATEGORIES.length} categories.` },
  { id: 'auto', label: 'Automated', value: Math.round((RUNBOOKS.filter((r) => r.automation === 'automated').length / total) * 100) + '%', note: 'Run without a human.' },
  { id: 'success', label: 'Avg success', value: Math.round(RUNBOOKS.reduce((m, r) => m + r.success, 0) / total) + '%', note: 'Last 90 days.' },
  { id: 'runs', label: 'Runs · 90d', value: String(RUNBOOKS.reduce((m, r) => m + r.runs, 0)), note: 'Total executions.' },
];

export const AI_READ = {
  title: 'The runbook to fix or retire',
  body: 'Reprocess stuck recovery cases sits at 79% success, the lowest in the catalog, is fully manual, and last ran five weeks ago on recovery-comms, the same service dragging the DORA band. It is the best automation candidate: scripting the drain-and-reprocess step would lift success and cut an 18-minute manual job. Forge can draft the automation from the last three runs.',
};
