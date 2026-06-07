// Forge (IDP Portal) — Skills catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/skills — the marketplace of packaged abilities an agent can
// invoke (inspired by skills.sh). This is the SINGLE SOURCE for skills: the
// agent wizard's SKILL_POOL (agent-detail.ts) is derived from SKILLS here, so
// anything published in the catalog is selectable when creating/editing an
// agent. Official skills are maintained by the Platform team; community skills
// are contributed by bureau engineers. Mock but consistent.

export type SkillCategory =
  | 'Incident'
  | 'Delivery'
  | 'Security'
  | 'Observability'
  | 'Data'
  | 'Quality'
  | 'FinOps'
  | 'Compliance';

export interface Skill {
  id: string;
  name: string;
  icon: string;
  desc: string;
  category: SkillCategory;
  author: string;
  official: boolean;
  /** agents that have installed this skill. */
  installs: number;
  /** average rating, 0-5. */
  rating: number;
  version: string;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Incident', 'Delivery', 'Security', 'Observability', 'Data', 'Quality', 'FinOps', 'Compliance',
];

export const SKILLS: Skill[] = [
  // ── Official (Platform team) ────────────────────────────────────────────────
  { id: 'postmortem-writer',  name: 'Postmortem writer',    icon: 'edit',       desc: 'Drafts a blameless postmortem from the incident timeline.',     category: 'Incident',      author: 'Platform', official: true,  installs: 312, rating: 4.8, version: 'v2.4.0' },
  { id: 'root-cause',         name: 'Root-cause analysis',  icon: 'target',     desc: 'Correlates symptoms to a likely cause across the estate.',      category: 'Incident',      author: 'Platform', official: true,  installs: 488, rating: 4.9, version: 'v3.1.2' },
  { id: 'runbook-authoring',  name: 'Runbook authoring',    icon: 'book',       desc: 'Turns a fix into a repeatable, approved runbook.',              category: 'Incident',      author: 'Platform', official: true,  installs: 204, rating: 4.6, version: 'v1.8.0' },
  { id: 'incident-comms',     name: 'Incident comms',       icon: 'chat',       desc: 'Drafts status-page and stakeholder updates.',                   category: 'Incident',      author: 'Platform', official: true,  installs: 176, rating: 4.5, version: 'v1.3.1' },
  { id: 'deploy-gating',      name: 'Deploy gating',        icon: 'pipeline',   desc: 'Checks quality gates before a release ships.',                  category: 'Delivery',      author: 'Platform', official: true,  installs: 421, rating: 4.7, version: 'v2.0.4' },
  { id: 'release-notes',      name: 'Release notes',        icon: 'book',       desc: 'Turns a diff and its GMUD into clean release notes.',           category: 'Delivery',      author: 'Platform', official: true,  installs: 358, rating: 4.6, version: 'v1.6.3' },
  { id: 'threat-modeling',    name: 'Threat modeling',      icon: 'shield',     desc: 'Maps the attack surface and proposes mitigations.',             category: 'Security',      author: 'Platform', official: true,  installs: 142, rating: 4.7, version: 'v1.2.0' },
  { id: 'pii-discovery',      name: 'PII discovery',        icon: 'eye',        desc: 'Scans logs and payloads for unregistered PII.',                 category: 'Security',      author: 'Platform', official: true,  installs: 233, rating: 4.8, version: 'v2.1.1' },
  { id: 'lgpd-remediation',   name: 'LGPD remediation',     icon: 'shield',     desc: 'Drafts consent-scope remediation steps.',                       category: 'Compliance',    author: 'Platform', official: true,  installs: 119, rating: 4.5, version: 'v1.4.0' },
  { id: 'slo-design',         name: 'SLO design',           icon: 'target',     desc: 'Sets SLO targets and burn-rate alerts per service.',            category: 'Observability', author: 'Platform', official: true,  installs: 267, rating: 4.6, version: 'v1.9.2' },
  { id: 'trace-analysis',     name: 'Trace analysis',       icon: 'activity',   desc: 'Walks a distributed trace and ranks the slowest spans.',        category: 'Observability', author: 'Platform', official: true,  installs: 198, rating: 4.5, version: 'v1.5.0' },
  { id: 'anomaly-detection',  name: 'Anomaly detection',    icon: 'activity',   desc: 'Flags metric anomalies against the baseline.',                  category: 'Observability', author: 'Platform', official: true,  installs: 184, rating: 4.4, version: 'v2.2.0' },
  { id: 'query-optimization', name: 'Query optimization',   icon: 'database',   desc: 'Rewrites slow SQL and proposes indexes.',                       category: 'Data',          author: 'Platform', official: true,  installs: 226, rating: 4.6, version: 'v1.7.1' },
  { id: 'cost-optimization',  name: 'Cost optimization',    icon: 'gauge',      desc: 'Finds the safest places to trim cloud spend.',                  category: 'FinOps',        author: 'Platform', official: true,  installs: 301, rating: 4.7, version: 'v2.3.0' },
  { id: 'flaky-test-triage',  name: 'Flaky test triage',    icon: 'flag',       desc: 'Quarantines the flakiest tests and finds the cause.',           category: 'Quality',       author: 'Platform', official: true,  installs: 173, rating: 4.5, version: 'v1.1.4' },
  { id: 'schema-diffing',     name: 'Schema diffing',       icon: 'braces',     desc: 'Diffs an API change against its consumers.',                    category: 'Quality',       author: 'Platform', official: true,  installs: 156, rating: 4.4, version: 'v1.3.0' },
  { id: 'capacity-planning',  name: 'Capacity planning',    icon: 'gauge',      desc: 'Projects load and right-sizes the fleet.',                      category: 'Observability', author: 'Platform', official: true,  installs: 98,  rating: 4.3, version: 'v1.0.6' },
  // ── Community (bureau engineers) ────────────────────────────────────────────
  { id: 'rule-tuning',        name: 'Rule tuning',          icon: 'zap',        desc: 'Simulates antifraud rule-threshold changes against traffic.',   category: 'Security',      author: 'Beatriz Okamoto',   official: false, installs: 142, rating: 4.7, version: 'v0.9.1' },
  { id: 'reason-code',        name: 'Reason-code analysis', icon: 'score',      desc: 'Explains credit-score reason-code drift.',                      category: 'Data',          author: 'Thiago Albuquerque',official: false, installs: 88,  rating: 4.6, version: 'v0.7.0' },
  { id: 'scr-layout',         name: 'SCR layout',           icon: 'layers',     desc: 'Knows the SCR record layout and field contracts.',              category: 'Data',          author: 'Diego Vasquez',     official: false, installs: 64,  rating: 4.4, version: 'v0.5.2' },
  { id: 'feature-freshness',  name: 'Feature freshness',    icon: 'refresh',    desc: 'Checks Ignite feature lineage and staleness.',                  category: 'Data',          author: 'Diego Vasquez',     official: false, installs: 51,  rating: 4.2, version: 'v0.4.0' },
  { id: 'chargeback-evidence',name: 'Chargeback evidence',  icon: 'doc',        desc: 'Assembles a dispute evidence packet from the trail.',           category: 'Security',      author: 'Beatriz Okamoto',   official: false, installs: 73,  rating: 4.5, version: 'v0.6.1' },
];

export const officialCount = SKILLS.filter((s) => s.official).length;
export const communityCount = SKILLS.filter((s) => !s.official).length;
