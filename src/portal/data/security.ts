// Forge (IDP Portal) - Security data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/security - the security posture and triage board: open
// vulnerabilities (CVEs), policy deviations, and active threats across the
// bureau estate, unified into one findings list. Mock but consistent.
//
// UC-3 additions (§7.7 of AGENTIC-PLATFORM-VISION.md):
//   - blastRadius    - exposure lens (level, dependents, PII, internet-facing, tier)
//   - remediation    - agent-opened MR pill (mr id, status, optional quality-gate link)
//   - judge          - policy-judge verdict (auto-fixed / needs-sign-off / accepted-risk /
//                      blocked), rule that fired, who decided, optional expiry

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FindingType = 'Vulnerability' | 'Deviation' | 'Threat';
export type FindingStatus = 'open' | 'triaging' | 'waived' | 'resolved';

export type BlastLevel = 'low' | 'medium' | 'high' | 'critical';
export type MrStatus = 'open' | 'merged' | 'blocked' | 'draft';
export type JudgeVerdict = 'auto-fixed' | 'needs-sign-off' | 'accepted-risk' | 'blocked';

export interface BlastRadius {
  level: BlastLevel;
  dependents: number;
  pii: boolean;
  internetFacing: boolean;
  tier?: string;
}

export interface Remediation {
  mr: string;
  status: MrStatus;
  /** quality-gates PR id - links to /portal/quality-gates/[pr] */
  gate?: string;
  /** quality-gate id for /portal/quality-gates/[pr] routing */
  qualityGate?: string;
}

export interface Judge {
  verdict: JudgeVerdict;
  rule: string;
  decidedBy?: string;
  /** ISO-date string for accepted-risk expiry (never Date.now(), always fixed) */
  expiry?: string;
}

export interface Finding {
  id: string;
  title: string;
  type: FindingType;
  severity: Severity;
  service: string;
  source: string;
  age: string;
  status: FindingStatus;
  owner: string;
  cve?: string;
  blastRadius?: BlastRadius;
  remediation?: Remediation;
  judge?: Judge;
}

export const SEV_META: Record<Severity, { label: string; tone: 'severity-p0' | 'severity-p1' | 'severity-p2' | 'severity-p3'; color: string }> = {
  critical: { label: 'Critical', tone: 'severity-p0', color: 'var(--severity-p0, var(--danger))' },
  high: { label: 'High', tone: 'severity-p1', color: 'var(--severity-p1, #FB923C)' },
  medium: { label: 'Medium', tone: 'severity-p2', color: 'var(--severity-p2, var(--warning))' },
  low: { label: 'Low', tone: 'severity-p3', color: 'var(--severity-p3, var(--accent-2))' },
};

export const STATUS_META: Record<FindingStatus, { label: string; tone: 'warning' | 'status-running' | 'neutral' | 'health-up' }> = {
  open: { label: 'Open', tone: 'warning' },
  triaging: { label: 'Triaging', tone: 'status-running' },
  waived: { label: 'Waived', tone: 'neutral' },
  resolved: { label: 'Resolved', tone: 'health-up' },
};

export const MR_STATUS_META: Record<MrStatus, { label: string; tone: 'ice' | 'health-up' | 'danger' | 'neutral' }> = {
  open:    { label: 'open',    tone: 'ice' },
  merged:  { label: 'merged',  tone: 'health-up' },
  blocked: { label: 'blocked', tone: 'danger' },
  draft:   { label: 'draft',   tone: 'neutral' },
};

export const JUDGE_META: Record<JudgeVerdict, { label: string; tone: 'health-up' | 'warning' | 'neutral' | 'danger' }> = {
  'auto-fixed':     { label: 'Auto-fixed',     tone: 'health-up' },
  'needs-sign-off': { label: 'Needs sign-off', tone: 'warning' },
  'accepted-risk':  { label: 'Accepted risk',  tone: 'neutral' },
  'blocked':        { label: 'Blocked',        tone: 'danger' },
};

export const TYPE_ICON: Record<FindingType, string> = {
  Vulnerability: 'shield',
  Deviation: 'compliance',
  Threat: 'flame',
};

export const BLAST_LABEL: Record<BlastLevel, string> = {
  low:      'LOW',
  medium:   'MED',
  high:     'HIGH',
  critical: 'CRIT',
};

export const BLAST_TONE: Record<BlastLevel, 'neutral' | 'warning' | 'danger' | 'severity-p0'> = {
  low:      'neutral',
  medium:   'warning',
  high:     'danger',
  critical: 'severity-p0',
};

export const FINDINGS: Finding[] = [
  {
    id: 'SEC-2041',
    title: 'RCE in transitive dep protobuf-java',
    type: 'Vulnerability', severity: 'critical', service: 'score-engine',
    source: 'Dependabot', age: '2h', status: 'open', owner: 'Thiago Albuquerque', cve: 'CVE-2024-7254',
    blastRadius: { level: 'critical', dependents: 8, pii: true, internetFacing: true, tier: 'tier-0' },
    remediation: { mr: '!2841', status: 'open', gate: '7418', qualityGate: '7418' },
    judge: { verdict: 'needs-sign-off', rule: 'critical-vuln-blast-critical', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2040',
    title: 'Credential-stuffing wave on login',
    type: 'Threat', severity: 'critical', service: 'identity-proofing',
    source: 'WAF', age: '40m', status: 'triaging', owner: 'Camila Tanaka',
    blastRadius: { level: 'high', dependents: 5, pii: true, internetFacing: true, tier: 'tier-0' },
    judge: { verdict: 'blocked', rule: 'live-attack-no-auto', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2038',
    title: 'CPF logged unmasked in debug path',
    type: 'Deviation', severity: 'high', service: 'bureau-ingestion',
    source: 'Policy', age: '6h', status: 'open', owner: 'Diego Vasquez',
    blastRadius: { level: 'high', dependents: 4, pii: true, internetFacing: false },
    remediation: { mr: '!2839', status: 'open', gate: '7419', qualityGate: '7419' },
    judge: { verdict: 'needs-sign-off', rule: 'pii-exposure-policy-s3.4', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2037',
    title: 'SQL injection in report filter',
    type: 'Vulnerability', severity: 'high', service: 'scpc-gateway',
    source: 'SAST', age: '1d', status: 'triaging', owner: 'Diego Vasquez', cve: 'CWE-89',
    blastRadius: { level: 'high', dependents: 3, pii: false, internetFacing: true },
    remediation: { mr: '!2836', status: 'draft' },
    judge: { verdict: 'needs-sign-off', rule: 'sqli-internet-facing', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2035',
    title: 'Public S3 bucket on analytics export',
    type: 'Deviation', severity: 'high', service: 'ignite-feature-store',
    source: 'CSPM', age: '3h', status: 'open', owner: 'Larissa Fontana',
    blastRadius: { level: 'medium', dependents: 2, pii: true, internetFacing: true },
    remediation: { mr: '!2833', status: 'open' },
    judge: { verdict: 'needs-sign-off', rule: 'public-storage-pii', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2033',
    title: 'Outdated TLS 1.1 on legacy endpoint',
    type: 'Vulnerability', severity: 'medium', service: 'onescore-gateway',
    source: 'DAST', age: '2d', status: 'open', owner: 'Rafael Mendonça',
    blastRadius: { level: 'medium', dependents: 2, pii: false, internetFacing: true },
    remediation: { mr: '!2828', status: 'merged' },
    judge: { verdict: 'auto-fixed', rule: 'tls-version-policy', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2031',
    title: 'Over-privileged IAM role on worker',
    type: 'Deviation', severity: 'medium', service: 'document-ocr',
    source: 'Policy', age: '4d', status: 'triaging', owner: 'Camila Tanaka',
    blastRadius: { level: 'medium', dependents: 1, pii: false, internetFacing: false },
    remediation: { mr: '!2825', status: 'open' },
    judge: { verdict: 'accepted-risk', rule: 'iam-least-privilege', decidedBy: 'Camila Tanaka', expiry: '2026-09-30' },
  },
  {
    id: 'SEC-2029',
    title: 'Bot scraping consultation endpoint',
    type: 'Threat', severity: 'medium', service: 'acerta-api',
    source: 'WAF', age: '1d', status: 'open', owner: 'Beatriz Okamoto',
    blastRadius: { level: 'medium', dependents: 2, pii: false, internetFacing: true },
    judge: { verdict: 'needs-sign-off', rule: 'scraping-rate-limit-missing', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2027',
    title: 'Prototype pollution in lodash',
    type: 'Vulnerability', severity: 'medium', service: 'recovery-comms',
    source: 'Dependabot', age: '5d', status: 'waived', owner: 'Mariana Castelli', cve: 'CVE-2020-8203',
    blastRadius: { level: 'low', dependents: 0, pii: false, internetFacing: false },
    remediation: { mr: '!2810', status: 'merged' },
    judge: { verdict: 'auto-fixed', rule: 'dep-vuln-low-blast', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2024',
    title: 'Secret committed then rotated',
    type: 'Deviation', severity: 'low', service: 'webhook-dispatcher',
    source: 'Secret scan', age: '6d', status: 'resolved', owner: 'Larissa Fontana',
    blastRadius: { level: 'low', dependents: 1, pii: false, internetFacing: false },
    remediation: { mr: '!2805', status: 'merged' },
    judge: { verdict: 'auto-fixed', rule: 'secret-rotation-on-commit', decidedBy: 'Sentinel' },
  },
  {
    id: 'SEC-2022',
    title: 'Missing rate limit on health probe',
    type: 'Vulnerability', severity: 'low', service: 'audit-trail',
    source: 'DAST', age: '8d', status: 'open', owner: 'Larissa Fontana',
    blastRadius: { level: 'low', dependents: 0, pii: false, internetFacing: true },
    remediation: { mr: '!2801', status: 'draft' },
    judge: { verdict: 'accepted-risk', rule: 'rate-limit-health-probe', decidedBy: 'Larissa Fontana', expiry: '2026-08-15' },
  },
  {
    id: 'SEC-2019',
    title: 'Verbose error leaks stack trace',
    type: 'Vulnerability', severity: 'low', service: 'policy-studio',
    source: 'SAST', age: '9d', status: 'resolved', owner: 'Thiago Albuquerque',
    blastRadius: { level: 'low', dependents: 0, pii: false, internetFacing: false },
    remediation: { mr: '!2798', status: 'merged' },
    judge: { verdict: 'auto-fixed', rule: 'stack-trace-disclosure', decidedBy: 'Sentinel' },
  },
];

export const openFindings = FINDINGS.filter((f) => f.status === 'open' || f.status === 'triaging');

export const sevCount = (s: Severity) => openFindings.filter((f) => f.severity === s).length;

/** Severity breakdown for the segmented bar (open + triaging only). */
export const SEVERITY_MIX = (['critical', 'high', 'medium', 'low'] as Severity[]).map((s) => ({
  severity: s,
  label: SEV_META[s].label,
  count: sevCount(s),
  color: SEV_META[s].color,
}));

/** Active threats, surfaced separately (live attacker activity). */
export const THREATS = FINDINGS.filter((f) => f.type === 'Threat' && f.status !== 'resolved');

/** Posture score, 0-100. */
export const POSTURE = { score: 82, delta: 4, label: 'Good', note: 'Up 4 points this month after closing 9 highs.' };

/** Board KPIs. */
export const KPIS = [
  { id: 'open', label: 'Open findings', value: String(openFindings.length), note: 'Across vulns, deviations and threats.' },
  { id: 'critical', label: 'Critical / High', value: String(openFindings.filter((f) => f.severity === 'critical' || f.severity === 'high').length), note: 'Need action this week.' },
  { id: 'threats', label: 'Active threats', value: String(THREATS.length), note: 'Live attacker activity.' },
  { id: 'mttr', label: 'Mean time to remediate', value: '3.2d', note: 'Criticals, trailing 90 days.' },
];

/** Forge AI read - the exposure to fix first. */
export const AI_READ = {
  title: 'MR !2841 awaiting sign-off',
  body: 'SEC-2041 is a critical RCE (CVE-2024-7254) in a transitive protobuf-java dep of score-engine (tier-0, 8 dependents, PII, internet-facing). Sentinel opened MR !2841 with a one-line version bump. The blast-radius guardrail escalated it: needs one human sign-off before merge. Approve to clear the top exposure in the estate.',
};

/** Policy judge summary KPIs - fixed counts derived from FINDINGS. */
export const JUDGE_KPIS = [
  { id: 'auto-fixed',     label: 'Auto-fixed this week', value: String(FINDINGS.filter((f) => f.judge?.verdict === 'auto-fixed').length),        note: 'Agent remediated, no human required.' },
  { id: 'needs-sign-off', label: 'Awaiting sign-off',    value: String(FINDINGS.filter((f) => f.judge?.verdict === 'needs-sign-off').length),      note: 'Blocked on human approval.' },
  { id: 'accepted-risk',  label: 'Accepted risks expiring soon', value: String(FINDINGS.filter((f) => f.judge?.verdict === 'accepted-risk' && !!f.judge.expiry).length), note: 'Review before expiry.' },
];
