// Forge (IDP Portal) — AI Traces (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/traces (the log) and /portal/traces/[id] (the span tree).
// A trace is one end-to-end agent execution: a chat turn, a workflow-run step,
// or an eval case. Every trace contains SPANS (typed units of work with a
// duration, tokens and cost) that nest to reflect the execution flow. The span
// vocabulary follows the Braintrust anatomy, trimmed to what Forge shows:
// task · llm · tool · function · score · review. Mock but consistent: agents,
// runs and services cross-reference the rest of the portal.

export type SpanType = 'task' | 'llm' | 'tool' | 'function' | 'score' | 'review';
export type TraceStatus = 'ok' | 'error';
export type TraceSource = 'chat' | 'run' | 'eval' | 'automation';
export type TraceEnv = 'prod' | 'staging';

export interface SpanScore { name: string; value: number; judge?: string; reasoning?: string }

export interface Span {
  id: string;
  depth: number; // nesting level; 0 = root task
  type: SpanType;
  name: string;
  durMs: number;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number; // USD
  error?: boolean;
  // detail panel
  model?: string;
  params?: string;
  input?: string;
  output?: string;
  meta?: { k: string; v: string }[];
  score?: SpanScore;
}

export interface Trace {
  id: string;
  root: string; // root task name
  agentId: string;
  agent: string;
  model: string;
  source: TraceSource;
  service?: string;
  runId?: string; // → /portal/runs/[id]
  env: TraceEnv;
  status: TraceStatus;
  when: string;
  spans: Span[];
  // aggregates (computed from spans at module load)
  spansCount: number;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  latencyMs: number;
}

export const SPAN_META: Record<SpanType, { label: string; icon: string }> = {
  task: { label: 'Task', icon: 'layers' },
  llm: { label: 'LLM', icon: 'chat' },
  tool: { label: 'Tool', icon: 'plug' },
  function: { label: 'Function', icon: 'braces' },
  score: { label: 'Score', icon: 'score' },
  review: { label: 'Review', icon: 'user' },
};

export const SOURCE_META: Record<TraceSource, { label: string; icon: string }> = {
  chat: { label: 'Chat', icon: 'chat' },
  run: { label: 'Run', icon: 'activity' },
  eval: { label: 'Eval', icon: 'checkCheck' },
  automation: { label: 'Automation', icon: 'zap' },
};

// ── Formatters (deterministic) ────────────────────────────────────────────────
export const fmtMs = (ms: number): string =>
  ms >= 60_000
    ? `${Math.floor(ms / 60_000)}m ${String(Math.round((ms % 60_000) / 1000)).padStart(2, '0')}s`
    : ms >= 1000
      ? `${(ms / 1000).toFixed(2).replace(/\.?0+$/, '')}s`
      : `${ms}ms`;
export const fmtUsd = (n: number): string => (n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(4)}`);
export const fmtTok = (n: number): string =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);

// ── Trace builder: aggregates derive from the spans ──────────────────────────
type TraceCfg = Omit<Trace, 'spans' | 'spansCount' | 'tokensIn' | 'tokensOut' | 'cost' | 'latencyMs'>;
const T = (cfg: TraceCfg, spans: Span[]): Trace => ({
  ...cfg,
  spans,
  spansCount: spans.length,
  tokensIn: spans.reduce((m, s) => m + (s.tokensIn ?? 0), 0),
  tokensOut: spans.reduce((m, s) => m + (s.tokensOut ?? 0), 0),
  cost: spans.reduce((m, s) => m + (s.cost ?? 0), 0),
  latencyMs: spans[0]?.durMs ?? 0,
});

// ── Hero 1 · SRE Copilot diagnosing INC-1247 (workflow run wf-4901) ──────────
const SPANS_DIAGNOSE: Span[] = [
  {
    id: 's0', depth: 0, type: 'task', name: 'diagnose-incident', durMs: 8400,
    input: 'INC-1247 · acerta-api p95 over 600ms · region br-se-1',
    output: 'Root cause: deploy D-9182 tripled fan-out to score-engine; auto-scaler 2m behind. Remediation: rollback to v4.11.9 (rb-acerta-rollback, 98% success).',
    meta: [{ k: 'workflow', v: 'self-heal-incident' }, { k: 'run', v: 'wf-4901' }, { k: 'step', v: 'diagnose' }],
  },
  {
    id: 's1', depth: 1, type: 'function', name: 'load-context', durMs: 420,
    output: 'Bundle: service acerta-api · 3 dependents · ADR-0040 · 3 runbooks · last 5 deploys',
    meta: [{ k: 'contexts', v: 'runbook-library, service-catalog' }],
  },
  {
    id: 's2', depth: 1, type: 'llm', name: 'plan-diagnosis', durMs: 3100, tokensIn: 2840, tokensOut: 412, cost: 0.062,
    model: 'Opus 4.7', params: 'temp 0.2 · max 4096',
    input: 'Given the alert, the context bundle and the last 5 deploys, plan the diagnosis steps.',
    output: '1) Query p95 by upstream 2) Pull Davis problems 3) Correlate with deploy timeline 4) Check scaler lag',
  },
  {
    id: 's3', depth: 2, type: 'tool', name: 'prometheus.query_range', durMs: 640,
    input: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{svc="acerta-api"}[5m]))',
    output: '612ms sustained since 14:02 · fan-out to score-engine 3.1x baseline',
    meta: [{ k: 'mcp', v: 'prometheus-mcp' }],
  },
  {
    id: 's4', depth: 2, type: 'tool', name: 'dynatrace.davis_problems', durMs: 810,
    output: 'P-2231 open · response time degradation acerta-api · root-cause candidate: deployment event 14:00',
    meta: [{ k: 'mcp', v: 'dynatrace-mcp' }],
  },
  {
    id: 's5', depth: 2, type: 'tool', name: 'gitlab.recent_deploys', durMs: 310,
    output: 'D-9182 acerta-api v4.12.0 at 14:00 (CPF cache change) · prior good v4.11.9',
    meta: [{ k: 'mcp', v: 'gitlab-mcp' }],
  },
  {
    id: 's6', depth: 1, type: 'llm', name: 'correlate-root-cause', durMs: 2200, tokensIn: 6114, tokensOut: 388, cost: 0.071,
    model: 'Opus 4.7', params: 'temp 0.1 · max 2048',
    input: 'Metrics + Davis problem + deploy timeline. State the root-cause hypothesis with confidence.',
    output: 'Deploy D-9182 changed the CPF cache and tripled fan-out to score-engine; the auto-scaler lags by two minutes. Confidence 0.86.',
  },
  {
    id: 's7', depth: 1, type: 'function', name: 'draft-remediation', durMs: 140,
    output: 'rollback-deploy → v4.11.9 · gate 1-approver (blast high: 3 dependents, tier-0)',
  },
  {
    id: 's8', depth: 1, type: 'score', name: 'groundedness', durMs: 920, tokensIn: 1480, tokensOut: 96, cost: 0.004,
    model: 'Haiku 4.5',
    score: {
      name: 'groundedness', value: 0.92, judge: 'Haiku 4.5',
      reasoning: 'Every claim in the hypothesis is supported by a cited span: the fan-out ratio by prometheus.query_range, the deploy by gitlab.recent_deploys, the scaler lag by Davis P-2231. No unsupported assertions.',
    },
  },
];

// ── Hero 2 · Bureau Assistant chat turn with a degraded tool ─────────────────
const SPANS_CHAT: Span[] = [
  {
    id: 's0', depth: 0, type: 'task', name: 'handle-chat-message', durMs: 21400,
    input: 'Why did the SCR reconciliation reject batch 2026-06-08T03 with layout code L-44?',
    output: 'L-44 means a field-length violation in segment R2. Batch 2026-06-08T03 carries 12 records where consignado contracts exceed the 9-digit limit; the fix is the v4 layout mapper, shipped in scr-gateway v2.9.',
    meta: [{ k: 'channel', v: 'Forge chat' }, { k: 'thread', v: 'th-5582' }],
  },
  {
    id: 's1', depth: 1, type: 'function', name: 'load-context', durMs: 380,
    output: 'Contexts: scr-layout-spec (v4), bureau-feed-contracts · 14 chunks retrieved',
  },
  {
    id: 's2', depth: 1, type: 'llm', name: 'plan-answer', durMs: 1900, tokensIn: 3211, tokensOut: 180, cost: 0.019,
    model: 'Sonnet 4.6', params: 'temp 0.3 · max 2048',
    output: 'Need the L-44 definition and the batch rejection sample: call scr-layout.lookup and bureau.batch_sample.',
  },
  {
    id: 's3', depth: 2, type: 'tool', name: 'scr-layout.lookup', durMs: 60000, error: true,
    input: '{ "code": "L-44" }',
    output: 'TIMEOUT after 60s · scpc-gateway-mcp degraded',
    meta: [{ k: 'mcp', v: 'scpc-gateway-mcp' }, { k: 'retry', v: '1 scheduled' }],
  },
  {
    id: 's4', depth: 2, type: 'tool', name: 'scr-layout.lookup (retry)', durMs: 740,
    input: '{ "code": "L-44" }',
    output: 'L-44: field length violation · segment R2 · max 9 digits for contract value',
    meta: [{ k: 'mcp', v: 'scpc-gateway-mcp' }],
  },
  {
    id: 's5', depth: 2, type: 'tool', name: 'bureau.batch_sample', durMs: 520,
    output: '12 rejected records · all consignado · contract values 10-11 digits',
  },
  {
    id: 's6', depth: 1, type: 'llm', name: 'compose-answer', durMs: 2600, tokensIn: 5104, tokensOut: 342, cost: 0.031,
    model: 'Sonnet 4.6', params: 'temp 0.3 · max 4096',
    output: 'Final answer grounded in the layout spec and the batch sample, with the v4 mapper fix.',
  },
  {
    id: 's7', depth: 1, type: 'score', name: 'answer-fit', durMs: 850, tokensIn: 1322, tokensOut: 88, cost: 0.003,
    model: 'Haiku 4.5',
    score: {
      name: 'answer-fit', value: 0.74, judge: 'Haiku 4.5',
      reasoning: 'Answer is correct and grounded, but latency context was lost: the user asked about ONE batch and the reply generalizes to the cohort. Penalized for scope drift; content accuracy is high.',
    },
  },
  {
    id: 's8', depth: 1, type: 'review', name: 'human-review', durMs: 0,
    score: { name: 'human-review', value: 1, judge: 'Diego Vasquez' },
    output: 'Marked helpful · "exactly the L-44 fix we needed"',
  },
];

// ── Hero 3 · Eval case from the score-reviewer experiment (regression) ───────
const SPANS_EVAL: Span[] = [
  {
    id: 's0', depth: 0, type: 'task', name: 'eval-case golden-credit-50 #12', durMs: 6900,
    input: 'Thin-file applicant · 2 tradelines · Cadastro Positivo opt-in · expected: APPROVE with reason codes R2+R7',
    output: 'REVIEW with reason codes R2+R9 · confidence 0.71',
    meta: [{ k: 'experiment', v: 'score-reviewer v2.4' }, { k: 'dataset', v: 'golden-credit-50' }, { k: 'case', v: '#12' }],
  },
  {
    id: 's1', depth: 1, type: 'tool', name: 'feature-store.lookup', durMs: 1100,
    output: '34 features · ignite freshness: 26h (stale: thin-file vectors refresh is 24h)',
    meta: [{ k: 'mcp', v: 'ignite-mcp' }],
  },
  {
    id: 's2', depth: 1, type: 'llm', name: 'review-shadow-score', durMs: 4100, tokensIn: 7821, tokensOut: 296, cost: 0.084,
    model: 'Opus 4.7', params: 'temp 0.0 · max 2048',
    output: 'Recommends REVIEW: stale thin-file vector lowers confidence below the APPROVE threshold.',
  },
  {
    id: 's3', depth: 1, type: 'score', name: 'answer-fit', durMs: 700, tokensIn: 1104, tokensOut: 72, cost: 0.003,
    model: 'Haiku 4.5',
    score: {
      name: 'answer-fit', value: 0.4, judge: 'Haiku 4.5',
      reasoning: 'Expected APPROVE with R2+R7; got REVIEW with R2+R9. The verdict diverges because the feature store returned a 26h-old thin-file vector. The reasoning is sound given stale inputs, but the outcome misses the golden answer.',
    },
  },
  {
    id: 's4', depth: 1, type: 'score', name: 'pii-leak', durMs: 60,
    score: { name: 'pii-leak', value: 1, judge: 'heuristic' },
    output: 'No CPF, name or address fragments in the output.',
  },
];

// Small generated trees for the rest of the log (deterministic, 4-6 spans).
const mkSpans = (
  root: string, model: string, totalMs: number, tIn: number, tOut: number, cost: number,
  tool: string, scoreVal: number, err = false,
): Span[] => [
  { id: 's0', depth: 0, type: 'task', name: root, durMs: totalMs, input: `${root} · scheduled by the agent loop`, output: err ? 'Failed: tool error after retries.' : 'Completed.' },
  { id: 's1', depth: 1, type: 'llm', name: 'plan', durMs: Math.round(totalMs * 0.3), tokensIn: Math.round(tIn * 0.4), tokensOut: Math.round(tOut * 0.4), cost: cost * 0.4, model, params: 'temp 0.2' },
  { id: 's2', depth: 2, type: 'tool', name: tool, durMs: Math.round(totalMs * 0.25), error: err, output: err ? 'ERROR · upstream 503' : 'ok' },
  { id: 's3', depth: 1, type: 'llm', name: 'compose', durMs: Math.round(totalMs * 0.35), tokensIn: Math.round(tIn * 0.6), tokensOut: Math.round(tOut * 0.6), cost: cost * 0.6, model, params: 'temp 0.2' },
  { id: 's4', depth: 1, type: 'score', name: 'answer-fit', durMs: 400, score: { name: 'answer-fit', value: scoreVal, judge: 'Haiku 4.5' } },
];

export const TRACES: Trace[] = [
  T({ id: 'tr-81240', root: 'diagnose-incident', agentId: 'sre', agent: 'SRE Copilot', model: 'Opus 4.7', source: 'run', service: 'credit-score', runId: 'wf-4901', env: 'prod', status: 'ok', when: '12m ago' }, SPANS_DIAGNOSE),
  T({ id: 'tr-81239', root: 'handle-chat-message', agentId: 'bureau', agent: 'Bureau Assistant', model: 'Sonnet 4.6', source: 'chat', service: 'scpc-gateway', env: 'prod', status: 'error', when: '24m ago' }, SPANS_CHAT),
  T({ id: 'tr-81238', root: 'review-merge-request', agentId: 'score', agent: 'Score Reviewer', model: 'Opus 4.7', source: 'run', service: 'score-engine', runId: 'wf-4871', env: 'prod', status: 'ok', when: '41m ago' }, mkSpans('review-merge-request', 'Opus 4.7', 12400, 9200, 640, 0.11, 'gitlab.mr_diff', 0.88)),
  T({ id: 'tr-81237', root: 'tune-fraud-rule', agentId: 'fraud', agent: 'Fraud Analyst', model: 'Sonnet 4.6', source: 'chat', service: 'konduto-antifraud', env: 'prod', status: 'ok', when: '1h ago' }, mkSpans('tune-fraud-rule', 'Sonnet 4.6', 9800, 6100, 520, 0.058, 'konduto.rule_stats', 0.91)),
  T({ id: 'tr-81236', root: 'consent-scope-audit', agentId: 'lgpd', agent: 'LGPD Auditor', model: 'Haiku 4.5', source: 'automation', service: 'consent-service', env: 'prod', status: 'ok', when: '1h ago' }, mkSpans('consent-scope-audit', 'Haiku 4.5', 4200, 3800, 240, 0.009, 'consent.scopes_diff', 0.97)),
  T({ id: 'tr-81235', root: 'handle-chat-message', agentId: 'kyc', agent: 'KYC Navigator', model: 'Sonnet 4.6', source: 'chat', service: 'identity-proofing', env: 'prod', status: 'ok', when: '2h ago' }, mkSpans('handle-chat-message', 'Sonnet 4.6', 7600, 4900, 410, 0.041, 'identity.case_lookup', 0.85)),
  T({ id: 'tr-81234', root: 'eval-case golden-credit-50 #12', agentId: 'score', agent: 'Score Reviewer', model: 'Opus 4.7', source: 'eval', service: 'score-engine', env: 'staging', status: 'ok', when: '3h ago' }, SPANS_EVAL),
  T({ id: 'tr-81233', root: 'draft-postmortem', agentId: 'sre', agent: 'SRE Copilot', model: 'Opus 4.7', source: 'run', service: 'scpc-gateway', runId: 'wf-4880', env: 'prod', status: 'ok', when: '3h ago' }, mkSpans('draft-postmortem', 'Opus 4.7', 15200, 11800, 1240, 0.146, 'incidents.timeline', 0.9)),
  T({ id: 'tr-81232', root: 'reconcile-batch', agentId: 'bureau', agent: 'Bureau Assistant', model: 'Sonnet 4.6', source: 'automation', service: 'bureau-ingestion', env: 'prod', status: 'error', when: '4h ago' }, mkSpans('reconcile-batch', 'Sonnet 4.6', 64000, 2100, 90, 0.014, 'scr-layout.lookup', 0.31, true)),
  T({ id: 'tr-81231', root: 'eval-case golden-credit-50 #07', agentId: 'score', agent: 'Score Reviewer', model: 'Opus 4.7', source: 'eval', service: 'score-engine', env: 'staging', status: 'ok', when: '5h ago' }, mkSpans('eval-case golden-credit-50 #07', 'Opus 4.7', 6100, 7400, 280, 0.078, 'feature-store.lookup', 0.55)),
  T({ id: 'tr-81230', root: 'cost-anomaly-scan', agentId: 'costwatch', agent: 'Cost Watch', model: 'Haiku 4.5', source: 'automation', service: 'analytics-dw', env: 'prod', status: 'ok', when: '6h ago' }, mkSpans('cost-anomaly-scan', 'Haiku 4.5', 3100, 2600, 180, 0.006, 'billing.export_query', 0.94)),
  T({ id: 'tr-81229', root: 'handle-chat-message', agentId: 'sre', agent: 'SRE Copilot', model: 'Opus 4.7', source: 'chat', service: 'acerta-api', env: 'prod', status: 'ok', when: '7h ago' }, mkSpans('handle-chat-message', 'Opus 4.7', 11300, 8200, 760, 0.124, 'prometheus.query_range', 0.89)),
];

export const getTrace = (id: string): Trace | undefined => TRACES.find((t) => t.id === id);

// ── List KPIs + the Forge AI read ─────────────────────────────────────────────
const totalCost = TRACES.reduce((m, t) => m + t.cost, 0);
const totalTok = TRACES.reduce((m, t) => m + t.tokensIn + t.tokensOut, 0);

export const KPIS = [
  { id: 'traces', label: 'Traces (24h)', value: '1,284', note: `${TRACES.length} in the last 8h shown.` },
  { id: 'p50', label: 'p50 latency', value: '8.4s', note: 'p95 21.4s · skewed by tool retries.' },
  { id: 'tokens', label: 'Tokens (24h)', value: fmtTok(totalTok * 14), note: 'Across 6 agents, 3 models.' },
  { id: 'cost', label: 'Cost (24h)', value: fmtUsd(totalCost * 14), note: 'Opus 4.7 is 71% of spend.' },
];

export const AI_READ = {
  title: 'A degraded MCP server is taxing every Bureau trace',
  body: 'scr-layout.lookup timed out in 6 Bureau Assistant traces over the last 4h (scpc-gateway-mcp degraded): each retry adds 60s of latency and online answer-fit on affected traces dipped from 0.81 to 0.74. Restarting the MCP server clears it; the runbook is rb-mcp-restart.',
};


// ── T2 Pulse additions (viz family) ──────────────────────────────────────────
export const VOLUME_7D = [980, 1040, 1110, 1185, 1150, 1240, 1284];
export const VOLUME_7D_PREV = [890, 920, 960, 1010, 990, 1060, 1080];
export const P50_7D = [7.9, 8.1, 7.8, 8.6, 9.4, 8.8, 8.4]; // seconds
export const P50_7D_PREV = [7.6, 7.7, 7.9, 7.8, 8.0, 7.9, 8.1];
export const COST_7D = [38.2, 40.1, 41.6, 44.8, 43.9, 47.2, 48.9]; // USD/day
export const COST_7D_PREV = [34.0, 35.2, 36.1, 37.4, 36.8, 38.9, 39.6];
export const ERRORS_7D = [12, 9, 14, 11, 31, 18, 16];
export const ERRORS_7D_PREV = [10, 11, 9, 12, 13, 11, 12];
