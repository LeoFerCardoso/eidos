// Forge (IDP Portal) · Pipelines data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/pipelines (the run console) and /portal/pipelines/[run] (the
// run detail with stages + live log). Bureau services + the shared people pool.
// The pipeline is the bureau golden CI: Build -> Test -> SAST -> Risk gate ->
// Canary -> Promote. Mock but internally consistent.

export type RunStatus = 'running' | 'success' | 'error' | 'pending';

export const STEP_LABELS = ['Build', 'Test', 'SAST', 'Risk gate', 'Canary', 'Promote'];

export interface PipeRun {
  id: string;
  service: string;
  version: string;
  sha: string;
  status: RunStatus;
  author: string;
  branch: string;
  trigger: string;
  started: string;
  duration: string;
  /** 0..6 · how many steps have completed (the current step = stepProgress). */
  stepProgress: number;
  stage: string;
  risk: { score: number; verdict: 'low' | 'med' | 'high' };
  coverageDelta: string;
  blast: string;
  region: string;
}

export const RUNS: PipeRun[] = [
  { id: 'run_8h2k9p', service: 'acerta-api',        version: 'v4.12.1', sha: 'a91c4f0', status: 'running', author: 'Rafael Mendonça',    branch: 'main',           trigger: 'Push to main',   started: '6m ago',   duration: '6m 12s', stepProgress: 4, stage: 'Canary · ring 1', risk: { score: 38, verdict: 'low' },  coverageDelta: '+0.9pp', blast: 'Ring 0 → 2', region: 'br-se-1 · br-ne-1' },
  { id: 'run_8h2k9o', service: 'bureau-ingestion',  version: 'v2.9.3',  sha: 'c012f8e', status: 'error',   author: 'Diego Vasquez',      branch: 'main',           trigger: 'Push to main',   started: '22m ago',  duration: '3m 48s', stepProgress: 1, stage: 'Failed · test',   risk: { score: 71, verdict: 'high' }, coverageDelta: '-2.8pp', blast: 'Ring 0 → 4', region: 'br-se-1' },
  { id: 'run_8h2k9n', service: 'konduto-antifraud', version: 'v3.1.8',  sha: 'b21e88a', status: 'running', author: 'Beatriz Okamoto',    branch: 'main',           trigger: 'Push to main',   started: '14m ago',  duration: '4m 02s', stepProgress: 3, stage: 'Risk gate',        risk: { score: 52, verdict: 'med' },  coverageDelta: '+0.4pp', blast: 'Ring 0 → 2', region: 'br-se-1' },
  { id: 'run_8h2k9m', service: 'score-engine',      version: 'v7.4.0',  sha: '7e8af12', status: 'success', author: 'Thiago Albuquerque', branch: 'main',           trigger: 'Tag v7.4.0',     started: '51m ago',  duration: '7m 41s', stepProgress: 6, stage: 'Promoted',         risk: { score: 24, verdict: 'low' },  coverageDelta: '+1.2pp', blast: 'Ring 0 → 4', region: 'br-se-1 · br-ne-1' },
  { id: 'run_8h2k9l', service: 'identity-proofing', version: 'v3.7.2',  sha: '4d0b21e', status: 'success', author: 'Camila Tanaka',      branch: 'main',           trigger: 'Push to main',   started: '2h ago',   duration: '5m 18s', stepProgress: 6, stage: 'Promoted',         risk: { score: 31, verdict: 'low' },  coverageDelta: '+0.6pp', blast: 'Ring 0 → 3', region: 'br-se-1' },
  { id: 'run_8h2k9k', service: 'scpc-gateway',      version: 'v5.2.0',  sha: '9a2bf73', status: 'pending', author: 'Larissa Fontana',    branch: 'release/5.2',    trigger: 'Manual',         started: 'queued',   duration: '-',      stepProgress: 0, stage: 'Queued',           risk: { score: 0,  verdict: 'low' },  coverageDelta: '0.0pp',  blast: 'Ring 0 → 2', region: 'br-se-1' },
  { id: 'run_8h2k9j', service: 'decision-engine',   version: 'v6.0.4',  sha: 'd5510aa', status: 'success', author: 'Thiago Albuquerque', branch: 'main',           trigger: 'Push to main',   started: '3h ago',   duration: '6m 55s', stepProgress: 6, stage: 'Promoted',         risk: { score: 44, verdict: 'med' },  coverageDelta: '+0.3pp', blast: 'Ring 0 → 4', region: 'br-se-1 · br-ne-1' },
];

export const getRun = (id: string): PipeRun | undefined => RUNS.find((r) => r.id === id);

export const STATUS_META: Record<RunStatus, { label: string; tone: 'status-running' | 'status-done' | 'status-error' | 'status-pending'; dot: 'running' | 'done' | 'error' | 'pending' }> = {
  running: { label: 'Running', tone: 'status-running', dot: 'running' },
  success: { label: 'Success', tone: 'status-done', dot: 'done' },
  error: { label: 'Failed', tone: 'status-error', dot: 'error' },
  pending: { label: 'Queued', tone: 'status-pending', dot: 'pending' },
};

export type StepStatus = 'done' | 'running' | 'pending' | 'error';
export interface Stage { id: string; label: string; status: StepStatus; meta: string }

const STEP_META = ['38s', '2m 14s · 4,182 tests', '0 criticals', 'score / verdict', 'ring 1 · 42%', 'Ring 2 → 4'];

/** Derive the six stages of a run from its progress + status. */
export function stagesFor(run: PipeRun): Stage[] {
  return STEP_LABELS.map((label, i) => {
    let status: StepStatus;
    if (run.status === 'pending') status = 'pending';
    else if (i < run.stepProgress) status = 'done';
    else if (i === run.stepProgress) status = run.status === 'error' ? 'error' : run.status === 'running' ? 'running' : 'done';
    else status = 'pending';
    let meta = STEP_META[i];
    if (i === 3) meta = `score ${run.risk.score} · ${run.risk.verdict}`;
    if (status === 'pending') meta = '-';
    if (status === 'error') meta = i === 1 ? '6 failed of 4,061' : 'failed';
    return { id: label.toLowerCase().replace(/\s+/g, '-'), label, status, meta };
  });
}

interface LogLine { id: number; time: string; level: 'info' | 'warn' | 'error' | 'debug'; message: string }

const RUNNING_LOG: LogLine[] = [
  { id: 1, time: '14:32:08', level: 'info', message: '-> eidos-runner acquired deploy token for acerta-api v4.12.1' },
  { id: 2, time: '14:32:08', level: 'debug', message: 'commit a91c4f0 · Rafael Mendonça · feat(acerta): cache CPF lookups for 60s' },
  { id: 3, time: '14:32:11', level: 'info', message: '[1/6] build · go build ./... · OK (38s)' },
  { id: 4, time: '14:32:49', level: 'info', message: '[2/6] test · go test ./... · 4,182 passed (2m 14s) · coverage 87.4% (+0.9pp)' },
  { id: 5, time: '14:35:03', level: 'info', message: '[3/6] sast · trivy + codeql · 0 criticals · 2 low (allowlisted)' },
  { id: 6, time: '14:35:31', level: 'info', message: '[4/6] risk gate · Change Risk Score 38/100 · verdict low · blast Ring 0 -> 2' },
  { id: 7, time: '14:35:32', level: 'info', message: '[4/6] risk gate · under 300 threshold · no human approval required' },
  { id: 8, time: '14:35:33', level: 'info', message: '[5/6] canary · deploying to ring 0 (internal · 8 pods)' },
  { id: 9, time: '14:36:01', level: 'info', message: '[5/6] canary · shifting 1% production traffic to v4.12.1' },
  { id: 10, time: '14:36:14', level: 'debug', message: '[5/6] canary · health window: error rate 0.18% · p95 138ms · within SLO' },
  { id: 11, time: '14:38:00', level: 'info', message: '[5/6] canary · ring 1 · 42% traffic · holding for observation window' },
];

const FAILED_LOG: LogLine[] = [
  { id: 1, time: '09:11:02', level: 'info', message: '-> eidos-runner acquired deploy token for bureau-ingestion v2.9.3' },
  { id: 2, time: '09:11:02', level: 'debug', message: 'commit c012f8e · Diego Vasquez · refactor: extract decision tree into strategy' },
  { id: 3, time: '09:11:05', level: 'info', message: '[1/6] build · go build ./... · OK (44s)' },
  { id: 4, time: '09:11:49', level: 'info', message: '[2/6] test · go test ./... · running 4,061 specs in 6 workers' },
  { id: 5, time: '09:13:58', level: 'error', message: '[2/6] test · FAIL ingest/scr_layout_test.go:212 · expected 27 fields, got 26' },
  { id: 6, time: '09:13:58', level: 'error', message: '[2/6] test · FAIL ingest/reconcile_test.go:88 · nil pointer on empty CNPJ' },
  { id: 7, time: '09:14:01', level: 'error', message: '[2/6] test · 6 failed of 4,061 · coverage 64.1% (-2.8pp, below 80% gate)' },
  { id: 8, time: '09:14:02', level: 'warn', message: 'pipeline halted at stage 2/6 · downstream stages skipped' },
  { id: 9, time: '09:14:02', level: 'error', message: 'run failed · exit code 1 · see test report for the 6 failures' },
];

const genericLog = (run: PipeRun): LogLine[] => [
  { id: 1, time: '12:00:01', level: 'info', message: `-> eidos-runner acquired deploy token for ${run.service} ${run.version}` },
  { id: 2, time: '12:00:01', level: 'debug', message: `commit ${run.sha} · ${run.author}` },
  { id: 3, time: '12:00:04', level: 'info', message: '[1/6] build · OK (41s)' },
  { id: 4, time: '12:00:45', level: 'info', message: `[2/6] test · passed · coverage delta ${run.coverageDelta}` },
  { id: 5, time: '12:02:10', level: 'info', message: '[3/6] sast · 0 criticals' },
  { id: 6, time: '12:02:38', level: 'info', message: `[4/6] risk gate · Change Risk Score ${run.risk.score}/100 · verdict ${run.risk.verdict}` },
  { id: 7, time: '12:02:55', level: 'info', message: run.status === 'pending' ? 'queued · waiting for a runner' : '[6/6] promote · all gates green' },
];

export function logFor(run: PipeRun): LogLine[] {
  if (run.id === 'run_8h2k9p') return RUNNING_LOG;
  if (run.id === 'run_8h2k9o') return FAILED_LOG;
  return genericLog(run);
}

export const ARTIFACTS = [
  { name: 'sbom.spdx.json', kind: 'compliance', size: '184 KiB' },
  { name: 'coverage/lcov.info', kind: 'doc', size: '912 KiB' },
  { name: 'trivy-report.json', kind: 'shield', size: '46 KiB' },
];

/** Console KPIs. */
export const KPIS = [
  { id: 'today', label: 'Runs today', value: '128', note: 'Across 30 services.' },
  { id: 'success', label: 'Success rate', value: '94%', note: 'Trailing 24h.' },
  { id: 'p50', label: 'Median duration', value: '6m 04s', note: 'Build to promote.' },
  { id: 'failing', label: 'Failing now', value: '1', note: 'Needs attention.' },
];

/** Forge AI read for a failed run (the diagnosis, woven in). */
export function aiReadFor(run: PipeRun): { title: string; body: string } | null {
  if (run.id === 'run_8h2k9o') {
    return {
      title: 'Why this run failed',
      body: 'Commit c012f8e dropped the SCR layout from 27 to 26 fields and stopped guarding empty CNPJs. Two tests caught it before any traffic shifted. Restore the 27th field and add a nil check in reconcile; no rollback needed.',
    };
  }
  return null;
}
