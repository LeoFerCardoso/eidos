// Forge (IDP Portal) — AI Evaluations (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/evaluations (experiments + online scorers) and
// /portal/evaluations/[id] (per-case results). The model follows Braintrust /
// Langfuse practice trimmed to Forge's thesis: OFFLINE experiments run an agent
// version against a frozen golden dataset with scorers; ONLINE scorers grade
// production traces continuously. Scores are not vanity metrics here: the
// verified success rate that drives the autonomy ramp in /portal/access and
// the pre-deploy quality gate both read from this layer.

export type ScorerKind = 'llm-judge' | 'heuristic' | 'human';
export type ExperimentStatus = 'improved' | 'regressed' | 'baseline' | 'running';
export type EvalTrigger = 'pre-deploy gate' | 'nightly' | 'manual';

export interface Scorer {
  id: string;
  name: string;
  kind: ScorerKind;
  desc: string;
  onlinePerDay: number; // production scores/day (0 = offline-only)
  avg: number; // trailing 7d online average
  trend: number; // delta vs prior 7d
}

export const SCORERS: Scorer[] = [
  { id: 'answer-fit', name: 'answer-fit', kind: 'llm-judge', desc: 'Does the output answer what was asked, at the right scope?', onlinePerDay: 1180, avg: 0.84, trend: -0.02 },
  { id: 'groundedness', name: 'groundedness', kind: 'llm-judge', desc: 'Is every claim supported by a retrieved source or a tool result?', onlinePerDay: 1180, avg: 0.88, trend: 0.01 },
  { id: 'pii-leak', name: 'pii-leak', kind: 'heuristic', desc: 'No CPF, name or address fragments in the output (1.0 = clean). LGPD evidence.', onlinePerDay: 2410, avg: 0.999, trend: 0 },
  { id: 'tool-success', name: 'tool-success', kind: 'heuristic', desc: 'Tool calls that returned without error, first try.', onlinePerDay: 3260, avg: 0.93, trend: -0.04 },
  { id: 'human-review', name: 'human-review', kind: 'human', desc: 'Thumbs from engineers on chat answers and HITL approvals.', onlinePerDay: 64, avg: 0.91, trend: 0.02 },
];

export const SCORER_KIND_META: Record<ScorerKind, { label: string }> = {
  'llm-judge': { label: 'LLM judge' },
  heuristic: { label: 'Heuristic' },
  human: { label: 'Human' },
};

export interface ExperimentScore { scorer: string; value: number; baseline: number }

export interface Experiment {
  id: string;
  name: string;
  agentId: string;
  agent: string;
  dataset: string;
  cases: number;
  passed: number;
  model: string;
  candidate: string; // the version under test
  baseline: string; // what it is compared against
  trigger: EvalTrigger;
  status: ExperimentStatus;
  when: string;
  scores: ExperimentScore[];
}

export const STATUS_META: Record<ExperimentStatus, { label: string; tone: 'success' | 'danger' | 'neutral' | 'status-running' }> = {
  improved: { label: 'Improved', tone: 'success' },
  regressed: { label: 'Regressed', tone: 'danger' },
  baseline: { label: 'Baseline', tone: 'neutral' },
  running: { label: 'Running', tone: 'status-running' },
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-2241', name: 'score-reviewer v2.4 pre-deploy', agentId: 'score', agent: 'Score Reviewer',
    dataset: 'golden-credit-50', cases: 50, passed: 41, model: 'Opus 4.7',
    candidate: 'v2.4 · prompt #9', baseline: 'v2.3 · prompt #8 (production)',
    trigger: 'pre-deploy gate', status: 'regressed', when: '3h ago',
    scores: [
      { scorer: 'answer-fit', value: 0.83, baseline: 0.84 },
      { scorer: 'groundedness', value: 0.74, baseline: 0.81 },
      { scorer: 'pii-leak', value: 1.0, baseline: 1.0 },
      { scorer: 'tool-success', value: 0.9, baseline: 0.96 },
    ],
  },
  {
    id: 'exp-2240', name: 'sre-copilot v3.4 pre-deploy', agentId: 'sre', agent: 'SRE Copilot',
    dataset: 'golden-incidents-30', cases: 30, passed: 29, model: 'Opus 4.7',
    candidate: 'v3.4 · prompt #12', baseline: 'v3.3 · prompt #11 (production)',
    trigger: 'pre-deploy gate', status: 'improved', when: 'Yesterday',
    scores: [
      { scorer: 'answer-fit', value: 0.91, baseline: 0.87 },
      { scorer: 'groundedness', value: 0.93, baseline: 0.9 },
      { scorer: 'tool-success', value: 0.97, baseline: 0.95 },
    ],
  },
  {
    id: 'exp-2239', name: 'bureau-assistant nightly', agentId: 'bureau', agent: 'Bureau Assistant',
    dataset: 'golden-scr-40', cases: 40, passed: 36, model: 'Sonnet 4.6',
    candidate: 'v2.1 · prompt #6', baseline: 'v2.1 · prior nightly',
    trigger: 'nightly', status: 'baseline', when: 'Yesterday',
    scores: [
      { scorer: 'answer-fit', value: 0.86, baseline: 0.86 },
      { scorer: 'groundedness', value: 0.89, baseline: 0.88 },
      { scorer: 'pii-leak', value: 1.0, baseline: 1.0 },
    ],
  },
  {
    id: 'exp-2238', name: 'lgpd-auditor v1.5 pre-deploy', agentId: 'lgpd', agent: 'LGPD Auditor',
    dataset: 'golden-consent-25', cases: 25, passed: 25, model: 'Haiku 4.5',
    candidate: 'v1.5 · prompt #4', baseline: 'v1.4 · prompt #3 (production)',
    trigger: 'pre-deploy gate', status: 'improved', when: '2d ago',
    scores: [
      { scorer: 'answer-fit', value: 0.94, baseline: 0.9 },
      { scorer: 'pii-leak', value: 1.0, baseline: 1.0 },
      { scorer: 'tool-success', value: 0.98, baseline: 0.94 },
    ],
  },
  {
    id: 'exp-2237', name: 'fraud-analyst rule explainer', agentId: 'fraud', agent: 'Fraud Analyst',
    dataset: 'golden-rules-35', cases: 35, passed: 32, model: 'Sonnet 4.6',
    candidate: 'v2.8 · prompt #7', baseline: 'v2.7 · prompt #6 (production)',
    trigger: 'manual', status: 'improved', when: '3d ago',
    scores: [
      { scorer: 'answer-fit', value: 0.9, baseline: 0.85 },
      { scorer: 'groundedness', value: 0.92, baseline: 0.9 },
    ],
  },
  {
    id: 'exp-2236', name: 'kyc-navigator nightly', agentId: 'kyc', agent: 'KYC Navigator',
    dataset: 'golden-kyc-30', cases: 30, passed: 0, model: 'Sonnet 4.6',
    candidate: 'v1.2 · prompt #5', baseline: 'v1.2 · prior nightly',
    trigger: 'nightly', status: 'running', when: 'now',
    scores: [],
  },
];

export const getExperiment = (id: string): Experiment | undefined => EXPERIMENTS.find((e) => e.id === id);

// ── Hero experiment cases (exp-2241) ─────────────────────────────────────────
export interface EvalCase {
  id: string;
  input: string;
  expected: string;
  output: string;
  scores: { scorer: string; value: number }[];
  pass: boolean;
  traceId?: string; // → /portal/traces/[id]
}

export const CASES_BY_EXPERIMENT: Record<string, EvalCase[]> = {
  'exp-2241': [
    { id: '#03', input: 'Prime applicant · 14 tradelines · clean SCR', expected: 'APPROVE · R1', output: 'APPROVE · R1', scores: [{ scorer: 'answer-fit', value: 0.96 }, { scorer: 'groundedness', value: 0.94 }], pass: true },
    { id: '#07', input: 'Thin-file · 3 tradelines · CadPos opt-in', expected: 'APPROVE · R2+R7', output: 'REVIEW · R2', scores: [{ scorer: 'answer-fit', value: 0.55 }, { scorer: 'groundedness', value: 0.62 }], pass: false, traceId: 'tr-81231' },
    { id: '#12', input: 'Thin-file · 2 tradelines · CadPos opt-in', expected: 'APPROVE · R2+R7', output: 'REVIEW · R2+R9', scores: [{ scorer: 'answer-fit', value: 0.4 }, { scorer: 'groundedness', value: 0.58 }], pass: false, traceId: 'tr-81234' },
    { id: '#18', input: 'Recent negativation · 1 open protest', expected: 'DECLINE · R4', output: 'DECLINE · R4', scores: [{ scorer: 'answer-fit', value: 0.97 }, { scorer: 'groundedness', value: 0.95 }], pass: true },
    { id: '#23', input: 'Thin-file · 4 tradelines · no CadPos', expected: 'REVIEW · R2', output: 'REVIEW · R2', scores: [{ scorer: 'answer-fit', value: 0.93 }, { scorer: 'groundedness', value: 0.71 }], pass: true },
    { id: '#31', input: 'Restructured debt · 8 tradelines', expected: 'REVIEW · R5', output: 'REVIEW · R5', scores: [{ scorer: 'answer-fit', value: 0.92 }, { scorer: 'groundedness', value: 0.9 }], pass: true },
    { id: '#38', input: 'Thin-file · 3 tradelines · CadPos opt-in', expected: 'APPROVE · R2+R7', output: 'REVIEW · R2+R9', scores: [{ scorer: 'answer-fit', value: 0.48 }, { scorer: 'groundedness', value: 0.6 }], pass: false },
    { id: '#44', input: 'Prime · joint application · 11 tradelines', expected: 'APPROVE · R1+R3', output: 'APPROVE · R1+R3', scores: [{ scorer: 'answer-fit', value: 0.95 }, { scorer: 'groundedness', value: 0.93 }], pass: true },
  ],
};

// ── List KPIs + the Forge AI read ─────────────────────────────────────────────
export const KPIS = [
  { id: 'experiments', label: 'Experiments (7d)', value: String(EXPERIMENTS.length), note: '4 gate runs, 2 nightly.' },
  { id: 'online', label: 'Online scores / day', value: '8.1k', note: 'Across 5 scorers in production.' },
  { id: 'fit', label: 'Fleet answer-fit', value: '0.84', note: 'Trailing 7 days, online.' },
  { id: 'gate', label: 'Regressions blocked', value: '3', note: 'Caught by the pre-deploy gate this quarter.' },
];

export const AI_READ = {
  title: 'The gate held score-reviewer v2.4 · stale features, not the prompt',
  body: 'v2.4 regressed groundedness 0.81 to 0.74 on golden-credit-50 while answer-fit held, and the pre-deploy gate blocked promotion. The 3 failing cases share the thin-file cohort: feature-store.lookup returned 26h-old vectors (freshness SLO is 24h). Fix the Ignite refresh, not the prompt; see trace tr-81234.',
};


// ── T2 Pulse additions (viz family) ──────────────────────────────────────────
/** Fleet answer-fit online, trailing 30 days, vs the prior month ghost. */
export const FIT_TREND = [0.81, 0.82, 0.82, 0.83, 0.82, 0.84, 0.83, 0.84, 0.85, 0.84, 0.85, 0.86, 0.85, 0.84, 0.85, 0.86, 0.86, 0.85, 0.84, 0.83, 0.82, 0.83, 0.84, 0.84, 0.85, 0.84, 0.83, 0.84, 0.84, 0.84];
export const FIT_TREND_PREV = [0.79, 0.80, 0.79, 0.80, 0.81, 0.80, 0.81, 0.82, 0.81, 0.82, 0.81, 0.82, 0.83, 0.82, 0.83, 0.82, 0.83, 0.82, 0.83, 0.82, 0.81, 0.82, 0.83, 0.82, 0.83, 0.82, 0.83, 0.82, 0.83, 0.82];

/** Judge (answer-fit) × human-review agreement, sampled pairs (trailing 7d). */
export const AGREEMENT_POINTS = [
  { x: 0.96, y: 1.0 }, { x: 0.91, y: 1.0 }, { x: 0.88, y: 1.0 }, { x: 0.93, y: 1.0 },
  { x: 0.84, y: 1.0 }, { x: 0.79, y: 1.0 }, { x: 0.86, y: 1.0 }, { x: 0.95, y: 1.0 },
  { x: 0.74, y: 1.0 }, { x: 0.71, y: 0.0 }, { x: 0.66, y: 0.0 }, { x: 0.59, y: 0.0 },
  { x: 0.52, y: 0.0 }, { x: 0.48, y: 0.0 }, { x: 0.63, y: 1.0 }, { x: 0.81, y: 1.0 },
  { x: 0.89, y: 1.0 }, { x: 0.92, y: 1.0 }, { x: 0.44, y: 0.0 }, { x: 0.57, y: 0.0 },
  { x: 0.76, y: 1.0 }, { x: 0.69, y: 0.0 }, { x: 0.83, y: 1.0 }, { x: 0.90, y: 1.0 },
];
export const AGREEMENT_AI = 'Judge and humans agree on 21 of 24 sampled pairs; every disagreement sits in the 0.6-0.75 score band. Treat that band as the human-review queue instead of a hard pass/fail threshold.';
