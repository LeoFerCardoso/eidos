// Forge — data for the AI-Insights command-center panels beyond the architecture
// hero: PR analysis, ADR adherence, and the user's AI-leverage vs cohorts.
// Equifax/Boa Vista bureau domain. Numbers are illustrative (vision-stage mockup),
// shaped to read as a real platform-intelligence surface.

// ── PR analysis (last 24h) — the agent's verdict on every PR ────────────────────
export type PRVerdict = 'ship' | 'block' | 'revision';

export interface PRReview {
  id: string;
  title: string;
  verdict: PRVerdict;
  when: string;
  detail: string;
  /** affected service id. */
  service: string;
}

export const PR_ANALYSIS: PRReview[] = [
  {
    id: 'PR #7421',
    title: 'idempotency keys for retries',
    verdict: 'ship',
    when: '12m ago',
    detail: 'Risk score 34. Coverage delta +1.2%. Blast radius bounded to Ring 0 → 2.',
    service: 'acerta-api',
  },
  {
    id: 'PR #7419',
    title: 'refactor scoring into a strategy pattern',
    verdict: 'block',
    when: '1h ago',
    detail: 'Cyclomatic complexity 14 in RiskCalculator.evaluate() exceeds policy. Coverage drops 2.8%.',
    service: 'score-engine',
  },
  {
    id: 'PR #7418',
    title: 'biometric step-up for high-risk auth',
    verdict: 'revision',
    when: '2h ago',
    detail: 'No ADR linked for the step-up policy. Add a brief decision record before merge.',
    service: 'identity-proofing',
  },
  {
    id: 'PR #7415',
    title: 'read-through cache for bureau lookups',
    verdict: 'ship',
    when: '5h ago',
    detail: 'Risk score 21. p95 down 60ms in the canary. No schema changes.',
    service: 'bureau-ingestion',
  },
];

// ── Signals — every agent verdict, not just PRs (drift, deploys, security, cost) ─
export type SignalTone = 'success' | 'danger' | 'warning' | 'ember' | 'neutral';

export interface Signal {
  id: string;
  /** badge label + tone + leading icon (Icons key). */
  badge: string;
  tone: SignalTone;
  icon: string;
  title: string;
  detail: string;
  /** the thing it acted on. */
  target: string;
  when: string;
}

export const SIGNALS: Signal[] = [
  { id: 's1', badge: 'Ship it', tone: 'success', icon: 'check', title: 'PR #7421 · idempotency keys for retries', detail: 'Risk score 34. Coverage +1.2%. Blast radius bounded to Ring 0 → 2.', target: 'acerta-api', when: '12m ago' },
  { id: 's2', badge: 'ADR-006', tone: 'ember', icon: 'gitFork', title: 'Sync call to konduto-antifraud introduced', detail: 'Violates async-first inter-tribe. Fan-out adds ~80ms to p95 under load.', target: 'acerta-api', when: '34m ago' },
  { id: 's3', badge: 'Block', tone: 'danger', icon: 'x', title: 'PR #7419 · refactor scoring into a strategy', detail: 'Cyclomatic complexity 14 in RiskCalculator.evaluate() exceeds policy.', target: 'score-engine', when: '1h ago' },
  { id: 's4', badge: 'Rolled back', tone: 'warning', icon: 'rollback', title: 'acerta-api reverted to v4.11.3', detail: 'p99 regression after v4.12.0. Back to 240ms, verified.', target: 'acerta-api', when: '2h ago' },
  { id: 's5', badge: 'CVE closed', tone: 'success', icon: 'shield', title: 'CVE-2026-1847 patched in onescore-gateway', detail: 'jwt library 8.5.1 → 9.0.2. Build, tests and scan green.', target: 'onescore-gateway', when: '5h ago' },
  { id: 's6', badge: 'Needs revision', tone: 'warning', icon: 'alert', title: 'PR #7418 · biometric step-up for high-risk auth', detail: 'No ADR linked for the step-up policy. Add a decision record before merge.', target: 'identity-proofing', when: '2h ago' },
  { id: 's7', badge: 'Cost spike', tone: 'danger', icon: 'trending', title: 'data-export egress +340% week-over-week', detail: 'Likely the new merchant nightly job. Owner notified.', target: 'data-export', when: '1d ago' },
  { id: 's8', badge: 'Coverage +7%', tone: 'success', icon: 'badgeCheck', title: 'score-engine coverage raised to 91%', detail: 'Testsmith generated 37 tests. No source changes.', target: 'score-engine', when: '8h ago' },
  { id: 's9', badge: 'Shipped', tone: 'neutral', icon: 'rocket', title: 'Bumped 12 dependencies across 4 services', detail: 'All gates green. Lockfiles only, 0 regressions.', target: '4 services', when: '11h ago' },
];

// ── Comparative cards — you vs your cohorts (squad · alliance · company eng) ──────
export interface ComparativeCohort {
  label: string;
  value: number;
  display: string;
  highlight?: boolean;
}

export interface ComparativeNote {
  label: string;
  value: string;
}

export interface ComparativeCard {
  key: string;
  title: string;
  big: string;
  sub: string;
  cohorts: ComparativeCohort[];
  /** supporting breakdown shown below the cohort bars. */
  notes: ComparativeNote[];
}

export const COMPARATIVE_CARDS: ComparativeCard[] = [
  {
    key: 'tokens',
    title: 'AI tokens',
    big: '2.4M',
    sub: 'Top 12% in your tribe · 1.8× the alliance median',
    cohorts: [
      { label: 'You', value: 2.4, display: '2.4M', highlight: true },
      { label: 'Your squad', value: 1.6, display: '1.6M' },
      { label: 'Alliance', value: 1.3, display: '1.3M' },
      { label: 'Company eng', value: 1.1, display: '1.1M' },
    ],
    notes: [
      { label: 'Top agent', value: 'Depbot · 0.9M' },
      { label: 'Peak day', value: 'Tue · 0.4M' },
      { label: 'Trend', value: '+18% MoM' },
    ],
  },
  {
    key: 'throughput',
    title: 'PRs shipped / week',
    big: '31',
    sub: '1.6× the squad average',
    cohorts: [
      { label: 'You', value: 31, display: '31', highlight: true },
      { label: 'Your squad', value: 19, display: '19' },
      { label: 'Alliance', value: 16, display: '16' },
      { label: 'Company eng', value: 14, display: '14' },
    ],
    notes: [
      { label: 'Merge rate', value: '94%' },
      { label: 'Avg cycle time', value: '3.2h' },
      { label: 'Reverts', value: '1' },
    ],
  },
  {
    key: 'autoresolve',
    title: 'Agent-resolved work',
    big: '78%',
    sub: '24 pts above the alliance median',
    cohorts: [
      { label: 'You', value: 78, display: '78%', highlight: true },
      { label: 'Your squad', value: 61, display: '61%' },
      { label: 'Alliance', value: 54, display: '54%' },
      { label: 'Company eng', value: 49, display: '49%' },
    ],
    notes: [
      { label: 'Dep-bumps', value: '41%' },
      { label: 'Test-gen', value: '22%' },
      { label: 'CVE patches', value: '9%' },
    ],
  },
];

// ── ADR adherence — how the estate tracks the declared decisions ────────────────
export interface ADR {
  id: string;
  title: string;
  /** adoption %, 0-100. */
  adoption: number;
  compliant: number;
  total: number;
  /** the agent's one-line path to full adoption. */
  hint: string;
}

export const ADRS: ADR[] = [
  { id: 'ADR-002', title: 'PII encrypted at rest', adoption: 96, compliant: 27, total: 28, hint: 'consent-service column pending the retention fix.' },
  { id: 'ADR-011', title: 'Structured audit events on every write', adoption: 88, compliant: 25, total: 28, hint: 'Agent can patch 3 services automatically.' },
  { id: 'ADR-006', title: 'Async-first inter-tribe communication', adoption: 82, compliant: 23, total: 28, hint: 'acerta-api → konduto sync call is the active breach.' },
  { id: 'ADR-004', title: 'Circuit breakers on external calls', adoption: 71, compliant: 20, total: 28, hint: 'score-engine → ignite has no breaker (see drift).' },
  { id: 'ADR-009', title: 'ADR linked on every risk-policy change', adoption: 64, compliant: 18, total: 28, hint: '5 recent policy PRs merged without a record.' },
];

// ── AI leverage — the user's use of the agent fleet vs their cohorts ─────────────
export interface Cohort {
  key: string;
  label: string;
  /** monthly AI tokens, in millions. */
  tokens: number;
  highlight?: boolean;
}

export const AI_TOKENS: Cohort[] = [
  { key: 'you', label: 'You', tokens: 2.4, highlight: true },
  { key: 'squad', label: 'Your squad (avg)', tokens: 1.6 },
  { key: 'alliance', label: 'Alliance (median)', tokens: 1.3 },
  { key: 'company', label: 'Company eng (median)', tokens: 1.1 },
];

export const AI_HEADLINE = {
  tokens: '2.4M',
  percentile: 'Top 12% in your tribe',
  multiple: '1.8× the alliance median',
};

export interface Comparative {
  label: string;
  you: string;
  cohort: string;
  note: string;
  /** true = you are ahead (good). */
  ahead: boolean;
}

export const AI_COMPARATIVES: Comparative[] = [
  { label: 'Agent-resolved work', you: '78%', cohort: '54%', note: 'vs alliance median', ahead: true },
  { label: 'PRs shipped / week', you: '31', cohort: '19', note: 'vs squad avg', ahead: true },
  { label: 'Time saved / week', you: '14h', cohort: '8h', note: 'vs company eng', ahead: true },
  { label: 'Human interventions', you: '2', cohort: '5', note: 'vs squad avg (lower better)', ahead: true },
];

