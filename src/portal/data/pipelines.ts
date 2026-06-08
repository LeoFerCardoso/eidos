// Forge (IDP Portal) · Pipelines data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/pipelines (the run console) and /portal/pipelines/[run] (the
// run detail with stages + live log). Bureau services + the shared people pool.
// The pipeline is the bureau golden CI: Build -> Test -> SAST -> Risk gate ->
// Canary -> Promote. Mock but internally consistent.

export type RunStatus = 'running' | 'success' | 'error' | 'pending';

// The bureau golden deployment flow: a quality gate, the four test suites, a
// canary, then progressive activation through the five rings.
export const STEP_LABELS = ['Quality gate', 'Unit', 'Integration', 'E2E', 'Performance', 'Canary', 'Ring rollout'];

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
  /** 0..7 · how many stages have completed (the current stage = stepProgress). */
  stepProgress: number;
  stage: string;
  risk: { score: number; verdict: 'low' | 'med' | 'high' };
  coverageDelta: string;
  blast: string;
  region: string;
  /** Ring rollout: 0 = not started, 1..5 = at that ring, 6 = GA complete. */
  currentRing: number;
  /** Ring 5 (GA) rollout progress, 0..100. */
  gaPercent: number;
}

export const RUNS: PipeRun[] = [
  { id: 'run_8h2k9p', service: 'acerta-api',        version: 'v4.12.1', sha: 'a91c4f0', status: 'running', author: 'Rafael Mendonça',    branch: 'main',           trigger: 'Push to main',   started: '1h 12m ago', duration: '1h 12m', stepProgress: 6, stage: 'Ring 5 · GA · 42%', risk: { score: 38, verdict: 'low' },  coverageDelta: '+0.9pp', blast: 'Ring 1 → 5', region: 'br-se-1 · br-ne-1', currentRing: 5, gaPercent: 42 },
  { id: 'run_8h2k9o', service: 'bureau-ingestion',  version: 'v2.9.3',  sha: 'c012f8e', status: 'error',   author: 'Diego Vasquez',      branch: 'main',           trigger: 'Push to main',   started: '22m ago',  duration: '3m 48s', stepProgress: 1, stage: 'Failed · unit tests', risk: { score: 71, verdict: 'high' }, coverageDelta: '-2.8pp', blast: 'Ring 1 → 5', region: 'br-se-1', currentRing: 0, gaPercent: 0 },
  { id: 'run_8h2k9n', service: 'konduto-antifraud', version: 'v3.1.8',  sha: 'b21e88a', status: 'running', author: 'Beatriz Okamoto',    branch: 'main',           trigger: 'Push to main',   started: '14m ago',  duration: '4m 02s', stepProgress: 3, stage: 'E2E tests',        risk: { score: 52, verdict: 'med' },  coverageDelta: '+0.4pp', blast: 'Ring 1 → 4', region: 'br-se-1', currentRing: 0, gaPercent: 0 },
  { id: 'run_8h2k9m', service: 'score-engine',      version: 'v7.4.0',  sha: '7e8af12', status: 'success', author: 'Thiago Albuquerque', branch: 'main',           trigger: 'Tag v7.4.0',     started: '51m ago',  duration: '7m 41s', stepProgress: 7, stage: 'GA · 100%',         risk: { score: 24, verdict: 'low' },  coverageDelta: '+1.2pp', blast: 'Ring 1 → 5', region: 'br-se-1 · br-ne-1', currentRing: 6, gaPercent: 100 },
  { id: 'run_8h2k9l', service: 'identity-proofing', version: 'v3.7.2',  sha: '4d0b21e', status: 'running', author: 'Camila Tanaka',      branch: 'main',           trigger: 'Push to main',   started: '2h ago',   duration: '2h 04m', stepProgress: 6, stage: 'Ring 4 · Beta',     risk: { score: 31, verdict: 'low' },  coverageDelta: '+0.6pp', blast: 'Ring 1 → 5', region: 'br-se-1', currentRing: 4, gaPercent: 0 },
  { id: 'run_8h2k9k', service: 'scpc-gateway',      version: 'v5.2.0',  sha: '9a2bf73', status: 'pending', author: 'Larissa Fontana',    branch: 'release/5.2',    trigger: 'Manual',         started: 'queued',   duration: '-',      stepProgress: 0, stage: 'Queued',           risk: { score: 0,  verdict: 'low' },  coverageDelta: '0.0pp',  blast: 'Ring 1 → 4', region: 'br-se-1', currentRing: 0, gaPercent: 0 },
  { id: 'run_8h2k9j', service: 'decision-engine',   version: 'v6.0.4',  sha: 'd5510aa', status: 'success', author: 'Thiago Albuquerque', branch: 'main',           trigger: 'Push to main',   started: '3h ago',   duration: '6m 55s', stepProgress: 7, stage: 'GA · 100%',         risk: { score: 44, verdict: 'med' },  coverageDelta: '+0.3pp', blast: 'Ring 1 → 5', region: 'br-se-1 · br-ne-1', currentRing: 6, gaPercent: 100 },
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

// meta per stage: Quality gate, Unit, Integration, E2E, Performance, Canary, Ring rollout.
const STEP_META = ['CRS / verdict', '4,182 tests', '612 specs', '188 flows', 'p95 within 6%', '1% traffic · clean', 'Ring 1 → 5'];

/** Derive the seven deployment stages of a run from its progress + status. */
export function stagesFor(run: PipeRun): Stage[] {
  return STEP_LABELS.map((label, i) => {
    let status: StepStatus;
    if (run.status === 'pending') status = 'pending';
    else if (i < run.stepProgress) status = 'done';
    else if (i === run.stepProgress) status = run.status === 'error' ? 'error' : run.status === 'running' ? 'running' : 'done';
    else status = 'pending';
    let meta = STEP_META[i];
    if (i === 0) meta = `CRS ${run.risk.score} · ${run.risk.verdict}`;
    if (i === 6 && status !== 'pending') meta = run.currentRing >= 6 ? 'GA · 100%' : run.currentRing === 5 ? `Ring 5 · ${run.gaPercent}%` : `Ring ${run.currentRing} of 5`;
    if (status === 'pending') meta = '-';
    if (status === 'error') meta = i === 1 ? '6 failed of 4,061' : 'failed';
    return { id: label.toLowerCase().replace(/\s+/g, '-'), label, status, meta };
  });
}

// ── Ring deployment ──────────────────────────────────────────────────────────
// Feature activation runs through five rings: the first two are internal, the
// last three reach end users, and Ring 5 (GA) ramps to 100%.
export interface RingDef { n: number; label: string; audience: string; scope: 'internal' | 'users'; traffic: string }
export const RING_DEFS: RingDef[] = [
  { n: 1, label: 'Ring 1 · Team',     audience: 'Squad + release owners',     scope: 'internal', traffic: '~1%' },
  { n: 2, label: 'Ring 2 · Internal', audience: 'All Equifax employees',      scope: 'internal', traffic: '~4%' },
  { n: 3, label: 'Ring 3 · Alpha',    audience: 'Opt-in alpha customers',     scope: 'users',    traffic: '12%' },
  { n: 4, label: 'Ring 4 · Beta',     audience: 'Beta cohort · BR-SE',        scope: 'users',    traffic: '35%' },
  { n: 5, label: 'Ring 5 · GA',       audience: 'General availability',       scope: 'users',    traffic: 'ramping' },
];

export type RingStatus = 'done' | 'running' | 'pending';
export interface Ring {
  n: number; label: string; audience: string; scope: 'internal' | 'users';
  status: RingStatus; percent: number; traffic: string;
  err: string; p95: string; slo: 'pass' | 'warn' | '-';
}

const RING_ERR = ['0.04%', '0.11%', '0.18%', '0.22%', '0.21%'];
const RING_P95 = ['128ms', '134ms', '141ms', '146ms', '145ms'];
const RING_SLO: ('pass' | 'warn')[] = ['pass', 'pass', 'pass', 'warn', 'pass'];

/** The five rings for a run, with status + telemetry derived from its progress. */
export function ringsFor(run: PipeRun): Ring[] {
  const cur = run.currentRing; // 0 not started, 1..5 in flight, 6 GA done
  return RING_DEFS.map((d, i) => {
    let status: RingStatus;
    let percent: number;
    if (cur === 0) { status = 'pending'; percent = 0; }
    else if (cur >= 6 || d.n < cur) { status = 'done'; percent = 100; }
    else if (d.n === cur) {
      if (d.n === 5) { status = run.gaPercent >= 100 ? 'done' : 'running'; percent = run.gaPercent; }
      else { status = 'running'; percent = 100; }
    } else { status = 'pending'; percent = 0; }
    const live = status !== 'pending';
    const traffic = d.n === 5 ? (cur >= 6 ? '100%' : cur === 5 ? `${run.gaPercent}%` : d.traffic) : d.traffic;
    return {
      n: d.n, label: d.label, audience: d.audience, scope: d.scope, status, percent,
      traffic: live ? traffic : '-',
      err: live ? RING_ERR[i] : '-',
      p95: live ? RING_P95[i] : '-',
      slo: live ? RING_SLO[i] : '-',
    };
  });
}

/** Index of the in-flight ring for <RingBar currentRing>, or rings.length when
 *  GA is complete (so every cell reads done), or -1 before rollout starts. */
export const ringCursor = (run: PipeRun): number =>
  run.currentRing === 0 ? -1 : run.currentRing >= 6 ? RING_DEFS.length : run.currentRing - 1;

/** Live health gates + metrics for the active rollout (static, SSR-stable). */
export const RING_HEALTH: { name: string; target: string; value: string; status: 'pass' | 'warn' | 'fail' }[] = [
  { name: 'Error rate',        target: '< 0.5%',    value: '0.21%', status: 'pass' },
  { name: 'p95 latency',       target: '< 180ms',   value: '146ms', status: 'pass' },
  { name: 'Saturation',        target: '< 70%',     value: '54%',   status: 'pass' },
  { name: 'Dependency health', target: 'all green',  value: 'green', status: 'pass' },
  { name: 'Synthetic checks',  target: '100% pass',  value: '99.4%', status: 'warn' },
];
export const RING_LIVE = {
  err: [0.18, 0.20, 0.19, 0.21, 0.22, 0.21, 0.21],
  p95: [142, 144, 143, 145, 146, 145, 145],
  slo: [99.92, 99.94, 99.95, 99.95, 99.97, 99.96, 99.97],
};

interface LogLine { id: number; time: string; level: 'info' | 'warn' | 'error' | 'debug'; message: string }

const RUNNING_LOG: LogLine[] = [
  { id: 1, time: '13:21:08', level: 'info', message: '-> eidos-runner acquired deploy token for acerta-api v4.12.1' },
  { id: 2, time: '13:21:08', level: 'debug', message: 'commit a91c4f0 · Rafael Mendonça · feat(acerta): cache CPF lookups for 60s' },
  { id: 3, time: '13:21:11', level: 'info', message: '[1/7] quality gate · Change Risk Score 38/1000 · verdict low · auto-merge eligible' },
  { id: 4, time: '13:21:49', level: 'info', message: '[2/7] unit · 4,182 passed (2m 14s) · coverage 87.4% (+0.9pp)' },
  { id: 5, time: '13:24:02', level: 'info', message: '[3/7] integration · 612 specs passed (3m 41s)' },
  { id: 6, time: '13:27:50', level: 'info', message: '[4/7] e2e · 188 flows passed on the staging mirror' },
  { id: 7, time: '13:31:14', level: 'info', message: '[5/7] performance · p95 138ms · within 6% of budget' },
  { id: 8, time: '13:33:02', level: 'info', message: '[6/7] canary · 1% traffic · error 0.18% · p95 138ms · within SLO' },
  { id: 9, time: '13:36:20', level: 'info', message: '[7/7] ring rollout · Ring 1 Team and Ring 2 Internal promoted (auto)' },
  { id: 10, time: '13:58:44', level: 'info', message: '[7/7] ring rollout · Ring 3 Alpha and Ring 4 Beta promoted · error budget holding' },
  { id: 11, time: '14:18:02', level: 'info', message: '[7/7] ring rollout · Ring 5 GA ramping · 42% traffic · auto-promote armed' },
];

const FAILED_LOG: LogLine[] = [
  { id: 1, time: '09:11:02', level: 'info', message: '-> eidos-runner acquired deploy token for bureau-ingestion v2.9.3' },
  { id: 2, time: '09:11:02', level: 'debug', message: 'commit c012f8e · Diego Vasquez · refactor: extract decision tree into strategy' },
  { id: 3, time: '09:11:05', level: 'info', message: '[1/7] quality gate · Change Risk Score 71/1000 · verdict high' },
  { id: 4, time: '09:11:49', level: 'info', message: '[2/7] unit · go test ./... · running 4,061 specs in 6 workers' },
  { id: 5, time: '09:13:58', level: 'error', message: '[2/7] unit · FAIL ingest/scr_layout_test.go:212 · expected 27 fields, got 26' },
  { id: 6, time: '09:13:58', level: 'error', message: '[2/7] unit · FAIL ingest/reconcile_test.go:88 · nil pointer on empty CNPJ' },
  { id: 7, time: '09:14:01', level: 'error', message: '[2/7] unit · 6 failed of 4,061 · coverage 64.1% (-2.8pp, below 80% gate)' },
  { id: 8, time: '09:14:02', level: 'warn', message: 'pipeline halted at stage 2/7 · integration, e2e, performance, canary and rollout skipped' },
  { id: 9, time: '09:14:02', level: 'error', message: 'run failed · exit code 1 · see test report for the 6 failures' },
];

const genericLog = (run: PipeRun): LogLine[] => [
  { id: 1, time: '12:00:01', level: 'info', message: `-> eidos-runner acquired deploy token for ${run.service} ${run.version}` },
  { id: 2, time: '12:00:01', level: 'debug', message: `commit ${run.sha} · ${run.author}` },
  { id: 3, time: '12:00:04', level: 'info', message: `[1/7] quality gate · Change Risk Score ${run.risk.score}/1000 · verdict ${run.risk.verdict}` },
  { id: 4, time: '12:00:45', level: 'info', message: `[2/7] unit · passed · coverage delta ${run.coverageDelta}` },
  { id: 5, time: '12:02:10', level: 'info', message: '[3/7] integration + [4/7] e2e · passed' },
  { id: 6, time: '12:03:30', level: 'info', message: '[5/7] performance · within budget · [6/7] canary · clean' },
  { id: 7, time: '12:04:55', level: 'info', message: run.status === 'pending' ? 'queued · waiting for a runner' : '[7/7] ring rollout · Ring 5 GA · 100%' },
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
