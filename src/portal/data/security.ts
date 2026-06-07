// Forge (IDP Portal) — Security data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/security — the security posture and triage board: open
// vulnerabilities (CVEs), policy deviations, and active threats across the
// bureau estate, unified into one findings list. Mock but consistent.

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FindingType = 'Vulnerability' | 'Deviation' | 'Threat';
export type FindingStatus = 'open' | 'triaging' | 'waived' | 'resolved';

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

export const TYPE_ICON: Record<FindingType, string> = {
  Vulnerability: 'shield',
  Deviation: 'compliance',
  Threat: 'flame',
};

export const FINDINGS: Finding[] = [
  { id: 'SEC-2041', title: 'RCE in transitive dep protobuf-java', type: 'Vulnerability', severity: 'critical', service: 'score-engine',      source: 'Dependabot', age: '2h',  status: 'open',     owner: 'Thiago Albuquerque', cve: 'CVE-2024-7254' },
  { id: 'SEC-2040', title: 'Credential-stuffing wave on login',    type: 'Threat',        severity: 'critical', service: 'identity-proofing', source: 'WAF',        age: '40m', status: 'triaging', owner: 'Camila Tanaka' },
  { id: 'SEC-2038', title: 'CPF logged unmasked in debug path',    type: 'Deviation',     severity: 'high',     service: 'bureau-ingestion',  source: 'Policy',     age: '6h',  status: 'open',     owner: 'Diego Vasquez' },
  { id: 'SEC-2037', title: 'SQL injection in report filter',       type: 'Vulnerability', severity: 'high',     service: 'scpc-gateway',      source: 'SAST',       age: '1d',  status: 'triaging', owner: 'Diego Vasquez', cve: 'CWE-89' },
  { id: 'SEC-2035', title: 'Public S3 bucket on analytics export', type: 'Deviation',     severity: 'high',     service: 'ignite-feature-store', source: 'CSPM',    age: '3h',  status: 'open',     owner: 'Larissa Fontana' },
  { id: 'SEC-2033', title: 'Outdated TLS 1.1 on legacy endpoint',  type: 'Vulnerability', severity: 'medium',   service: 'onescore-gateway',  source: 'DAST',       age: '2d',  status: 'open',     owner: 'Rafael Mendonça' },
  { id: 'SEC-2031', title: 'Over-privileged IAM role on worker',   type: 'Deviation',     severity: 'medium',   service: 'document-ocr',      source: 'Policy',     age: '4d',  status: 'triaging', owner: 'Camila Tanaka' },
  { id: 'SEC-2029', title: 'Bot scraping consultation endpoint',   type: 'Threat',        severity: 'medium',   service: 'acerta-api',        source: 'WAF',        age: '1d',  status: 'open',     owner: 'Beatriz Okamoto' },
  { id: 'SEC-2027', title: 'Prototype pollution in lodash',        type: 'Vulnerability', severity: 'medium',   service: 'recovery-comms',    source: 'Dependabot', age: '5d',  status: 'waived',   owner: 'Mariana Castelli', cve: 'CVE-2020-8203' },
  { id: 'SEC-2024', title: 'Secret committed then rotated',        type: 'Deviation',     severity: 'low',      service: 'webhook-dispatcher', source: 'Secret scan', age: '6d', status: 'resolved', owner: 'Larissa Fontana' },
  { id: 'SEC-2022', title: 'Missing rate limit on health probe',   type: 'Vulnerability', severity: 'low',      service: 'audit-trail',       source: 'DAST',       age: '8d',  status: 'open',     owner: 'Larissa Fontana' },
  { id: 'SEC-2019', title: 'Verbose error leaks stack trace',      type: 'Vulnerability', severity: 'low',      service: 'policy-studio',     source: 'SAST',       age: '9d',  status: 'resolved', owner: 'Thiago Albuquerque' },
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

/** Forge AI read — the exposure to fix first. */
export const AI_READ = {
  title: 'Fix this first',
  body: 'SEC-2041 is a critical RCE (CVE-2024-7254) in a transitive protobuf-java dependency of score-engine, the core scoring path that every consultation hits. A patched version is already published and the upgrade is a one-line bump with no API change. Shipping it clears the highest-blast-radius exposure in the estate; Forge can open the PR and route it through Quality Gates.',
};
