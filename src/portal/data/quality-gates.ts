// Forge (IDP Portal) — Quality Gates data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/quality-gates (the board) and /portal/quality-gates/[pr] (PR
// detail). Every PR gets a Change Risk Score (CRS) from 0 to 1000 computed by
// the PR-analysis agent; the score drives the human-approval gate:
//   CRS < 300        -> auto-merge, no human
//   300 <= CRS < 600 -> 1 approval
//   600 <= CRS < 900 -> 2 approvals
//   CRS >= 900       -> blocked, cannot merge
// Mock but internally consistent; the breakdown sums toward the score.

export interface Person { name: string; initials: string; role: string }

const P: Record<string, Person> = {
  rafael: { name: 'Rafael Mendonça', initials: 'RM', role: 'Staff Engineer · Score & Risk' },
  beatriz: { name: 'Beatriz Okamoto', initials: 'BO', role: 'Senior Engineer · Anti-Fraud' },
  thiago: { name: 'Thiago Albuquerque', initials: 'TA', role: 'Principal Engineer · Risk' },
  camila: { name: 'Camila Tanaka', initials: 'CT', role: 'Staff Engineer · Identity' },
  diego: { name: 'Diego Vasquez', initials: 'DV', role: 'Staff Engineer · Data & Bureau' },
  larissa: { name: 'Larissa Fontana', initials: 'LF', role: 'Senior SRE · Platform' },
  mariana: { name: 'Mariana Castelli', initials: 'MC', role: 'Engineering Manager' },
};

export type GateKey = 'auto' | 'one' | 'two' | 'blocked';

export interface Gate {
  key: GateKey;
  label: string;
  range: string;
  approvals: number;
  tone: 'risk-low' | 'risk-med' | 'risk-high' | 'risk-crit';
  blurb: string;
}

export const GATES: Gate[] = [
  { key: 'auto',    label: 'Auto-merge',   range: '0 to 299',   approvals: 0, tone: 'risk-low',  blurb: 'Low risk. Merges automatically once checks pass.' },
  { key: 'one',     label: '1 approval',   range: '300 to 599', approvals: 1, tone: 'risk-med',  blurb: 'Needs one human approval from an eligible reviewer.' },
  { key: 'two',     label: '2 approvals',  range: '600 to 899', approvals: 2, tone: 'risk-high', blurb: 'Needs two approvals, one from a senior or principal.' },
  { key: 'blocked', label: 'Blocked',      range: '900 to 1000', approvals: 2, tone: 'risk-crit', blurb: 'Too risky to merge. Split the change or reduce blast radius.' },
];

export const gateFor = (crs: number): Gate =>
  crs < 300 ? GATES[0] : crs < 600 ? GATES[1] : crs < 900 ? GATES[2] : GATES[3];

export const crsTone = (crs: number): Gate['tone'] => gateFor(crs).tone;

export type PrStatus = 'merged' | 'awaiting' | 'in-review' | 'blocked';

export interface ApproverState { person: Person; status: 'approved' | 'pending' }

export interface CrsFactor { label: string; detail: string; points: number }

export interface PullRequest {
  id: number;
  title: string;
  service: string;
  author: Person;
  branch: string;
  crs: number;
  status: PrStatus;
  when: string;
  files: number;
  additions: number;
  deletions: number;
  coverageDelta: string;
  blast: string;
  sast: number;
  factors: CrsFactor[];
  approvers: ApproverState[];
  eligible: Person[];
  diagnosis: string;
}

export const PRS: PullRequest[] = [
  {
    id: 7421, title: 'cache CPF lookups for 60s in acerta-api', service: 'acerta-api', author: P.rafael, branch: 'perf/cpf-cache',
    crs: 184, status: 'merged', when: '12m ago', files: 8, additions: 142, deletions: 38, coverageDelta: '+1.2pp', blast: 'Ring 0 to 2', sast: 0,
    factors: [
      { label: 'Code complexity', detail: 'Cyclomatic +8, cognitive +11', points: 64 },
      { label: 'Blast radius', detail: 'Touches one read path', points: 52 },
      { label: 'Coverage delta', detail: '+1.2pp, well tested', points: 18 },
      { label: 'Security (SAST)', detail: '0 findings', points: 0 },
      { label: 'Change size', detail: '8 files, 180 lines', points: 50 },
    ],
    approvers: [],
    eligible: [P.thiago, P.larissa],
    diagnosis: 'A focused performance change on a single read path with rising coverage and no security findings. The PR-analysis agent scored it 184, under the 300 auto-merge line, so it merged without a human gate once checks went green.',
  },
  {
    id: 7418, title: 'biometric step-up for high-risk auth', service: 'identity-proofing', author: P.camila, branch: 'feat/biometric-stepup',
    crs: 452, status: 'awaiting', when: '2h ago', files: 14, additions: 286, deletions: 51, coverageDelta: '+0.9pp', blast: 'Ring 0 to 2', sast: 0,
    factors: [
      { label: 'Code complexity', detail: 'Cyclomatic +11, cognitive +14', points: 118 },
      { label: 'Blast radius', detail: 'Auth path, 2 rings', points: 165 },
      { label: 'Coverage delta', detail: '+0.9pp', points: 24 },
      { label: 'Security (SAST)', detail: '0 findings, touches auth', points: 95 },
      { label: 'Change size', detail: '14 files, 337 lines', points: 50 },
    ],
    approvers: [{ person: P.camila, status: 'approved' }, { person: P.thiago, status: 'pending' }],
    eligible: [P.thiago, P.mariana],
    diagnosis: 'Adds a biometric step-up to the authentication path. Risk comes from the auth blast radius, not the code itself. CRS 452 puts it in the single-approval gate. Thiago Albuquerque is the suggested reviewer given his ownership of the risk path.',
  },
  {
    id: 7419, title: 'extract decision tree into strategy', service: 'bureau-ingestion', author: P.diego, branch: 'refactor/decision-strategy',
    crs: 712, status: 'in-review', when: '1h ago', files: 23, additions: 412, deletions: 290, coverageDelta: '-2.8pp', blast: 'Ring 0 to 4', sast: 1,
    factors: [
      { label: 'Code complexity', detail: 'Cyclomatic +14, cognitive +19', points: 196 },
      { label: 'Blast radius', detail: 'All rings, ingestion core', points: 240 },
      { label: 'Coverage delta', detail: '-2.8pp, below gate', points: 140 },
      { label: 'Security (SAST)', detail: '1 medium finding', points: 86 },
      { label: 'Change size', detail: '23 files, 702 lines', points: 50 },
    ],
    approvers: [{ person: P.diego, status: 'approved' }, { person: P.thiago, status: 'pending' }],
    eligible: [P.thiago, P.larissa, P.mariana],
    diagnosis: 'A wide refactor of ingestion that drops coverage below the gate and reaches every ring. CRS 712 requires two approvals, one from a senior or principal. The PR-analysis agent recommends restoring coverage before merge and pairing a reviewer from Platform given the blast radius.',
  },
  {
    id: 7416, title: 'parallelize document validation', service: 'document-ocr', author: P.mariana, branch: 'perf/parallel-validate',
    crs: 388, status: 'merged', when: '4h ago', files: 11, additions: 198, deletions: 87, coverageDelta: '+2.1pp', blast: 'Ring 0 to 2', sast: 0,
    factors: [
      { label: 'Code complexity', detail: 'Cyclomatic +9, cognitive +12', points: 96 },
      { label: 'Blast radius', detail: 'Validation path', points: 132 },
      { label: 'Coverage delta', detail: '+2.1pp', points: 20 },
      { label: 'Security (SAST)', detail: '0 findings', points: 40 },
      { label: 'Change size', detail: '11 files, 285 lines', points: 100 },
    ],
    approvers: [{ person: P.camila, status: 'approved' }],
    eligible: [P.camila, P.thiago],
    diagnosis: 'A concurrency change to document validation with strong coverage gains. CRS 388 needed one approval, which Camila Tanaka gave after confirming the worker pool bounds. Merged.',
  },
  {
    id: 7414, title: 'rewrite scoring kernel in unsafe Rust', service: 'score-engine', author: P.thiago, branch: 'perf/unsafe-kernel',
    crs: 938, status: 'blocked', when: '40m ago', files: 41, additions: 1284, deletions: 642, coverageDelta: '-7.4pp', blast: 'Ring 0 to 4', sast: 3,
    factors: [
      { label: 'Code complexity', detail: 'Cyclomatic +38, cognitive +52', points: 268 },
      { label: 'Blast radius', detail: 'Core scoring, all rings', points: 270 },
      { label: 'Coverage delta', detail: '-7.4pp, far below gate', points: 200 },
      { label: 'Security (SAST)', detail: '3 findings incl. unsafe blocks', points: 150 },
      { label: 'Change size', detail: '41 files, 1,926 lines', points: 50 },
    ],
    approvers: [],
    eligible: [P.rafael, P.larissa],
    diagnosis: 'A large unsafe rewrite of the core scoring kernel: coverage falls 7.4pp, three SAST findings include unsafe blocks, and it reaches every ring. CRS 938 is above the 900 ceiling, so it cannot merge. The PR-analysis agent recommends splitting it into a safe-refactor PR and an isolated kernel PR behind a flag.',
  },
  {
    id: 7412, title: 'bump tonic to 0.11 in consent-service', service: 'consent-service', author: P.diego, branch: 'chore/bump-tonic',
    crs: 96, status: 'merged', when: '5h ago', files: 3, additions: 14, deletions: 11, coverageDelta: '0.0pp', blast: 'Ring 0', sast: 0,
    factors: [
      { label: 'Code complexity', detail: 'No logic change', points: 8 },
      { label: 'Blast radius', detail: 'Single service, ring 0', points: 28 },
      { label: 'Coverage delta', detail: 'No change', points: 0 },
      { label: 'Security (SAST)', detail: '0 findings, patches a CVE', points: 0 },
      { label: 'Change size', detail: '3 files, 25 lines', points: 60 },
    ],
    approvers: [],
    eligible: [P.larissa],
    diagnosis: 'A dependency bump that patches a known CVE with no logic change. CRS 96 auto-merged once checks passed.',
  },
  {
    id: 7409, title: 'tighten velocity threshold in konduto', service: 'konduto-antifraud', author: P.beatriz, branch: 'feat/velocity-v3',
    crs: 564, status: 'awaiting', when: '6h ago', files: 9, additions: 174, deletions: 22, coverageDelta: '+0.4pp', blast: 'Ring 0 to 3', sast: 0,
    factors: [
      { label: 'Code complexity', detail: 'Cyclomatic +6, cognitive +8', points: 78 },
      { label: 'Blast radius', detail: 'Decision path, 3 rings', points: 198 },
      { label: 'Coverage delta', detail: '+0.4pp', points: 38 },
      { label: 'Security (SAST)', detail: '0 findings', points: 50 },
      { label: 'Change size', detail: '9 files, 196 lines', points: 100 },
      { label: 'Decision impact', detail: 'Changes approve/deny mix', points: 100 },
    ],
    approvers: [{ person: P.beatriz, status: 'approved' }],
    eligible: [P.thiago, P.mariana],
    diagnosis: 'A rule change that alters the approve/deny mix for live traffic. The PR-analysis agent weighted decision impact heavily, landing CRS 564 in the single-approval gate, and flags running it in shadow mode for a day before merge.',
  },
];

export const getPr = (id: number): PullRequest | undefined => PRS.find((p) => p.id === id);

export const PR_STATUS_META: Record<PrStatus, { label: string; tone: 'status-done' | 'status-pending' | 'status-running' | 'status-error' }> = {
  merged: { label: 'Merged', tone: 'status-done' },
  awaiting: { label: 'Awaiting approval', tone: 'status-pending' },
  'in-review': { label: 'In review', tone: 'status-running' },
  blocked: { label: 'Blocked', tone: 'status-error' },
};

/** Board KPIs. */
export const KPIS = [
  { id: 'today', label: 'PRs analyzed today', value: '214', note: 'By the PR-analysis agent.' },
  { id: 'auto', label: 'Auto-merged', value: '61%', note: 'CRS under 300, no human gate.' },
  { id: 'median', label: 'Median CRS', value: '248', note: 'Down 34 vs last week.' },
  { id: 'blocked', label: 'Blocked now', value: '1', note: 'CRS at or above 900.' },
];
