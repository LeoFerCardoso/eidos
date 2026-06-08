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

export const getSkill = (id: string): Skill | undefined => SKILLS.find((s) => s.id === id);

// ── Per-skill capability chips ─────────────────────────────────────────────────
// 3-6 chips relevant to the skill category, used in the detail sidebar.

export interface SkillCapability { id: string; label: string; icon: string }

const CAP_MAP: Record<SkillCategory, SkillCapability[]> = {
  Incident: [
    { id: 'timeline-parse',  label: 'Timeline parsing',    icon: 'activity'  },
    { id: 'alert-correlate', label: 'Alert correlation',   icon: 'zap'       },
    { id: 'postmortem',      label: 'Postmortem drafting',  icon: 'edit'      },
    { id: 'escalation',      label: 'Escalation routing',  icon: 'chat'      },
    { id: 'runbook',         label: 'Runbook lookup',       icon: 'book'      },
  ],
  Delivery: [
    { id: 'gate-check',      label: 'Quality gate checks', icon: 'pipeline'  },
    { id: 'diff-parse',      label: 'Diff parsing',        icon: 'braces'    },
    { id: 'gmud-parse',      label: 'GMUD extraction',     icon: 'doc'       },
    { id: 'risk-score',      label: 'Change risk scoring', icon: 'gauge'     },
    { id: 'release-notes',   label: 'Release notes gen.',  icon: 'book'      },
  ],
  Security: [
    { id: 'threat-model',    label: 'Threat modeling',     icon: 'shield'    },
    { id: 'pii-scan',        label: 'PII scanning',        icon: 'eye'       },
    { id: 'rule-sim',        label: 'Rule simulation',     icon: 'zap'       },
    { id: 'evidence-pack',   label: 'Evidence assembly',   icon: 'doc'       },
    { id: 'attack-surface',  label: 'Attack surface map',  icon: 'globe'     },
    { id: 'lgpd-check',      label: 'LGPD scope check',   icon: 'lock'      },
  ],
  Observability: [
    { id: 'metric-query',    label: 'Metric querying',     icon: 'activity'  },
    { id: 'trace-walk',      label: 'Trace traversal',     icon: 'layers'    },
    { id: 'slo-target',      label: 'SLO target setting',  icon: 'target'    },
    { id: 'anomaly-flag',    label: 'Anomaly flagging',    icon: 'flag'      },
    { id: 'capacity-proj',   label: 'Capacity projection', icon: 'gauge'     },
  ],
  Data: [
    { id: 'sql-rewrite',     label: 'SQL rewriting',       icon: 'database'  },
    { id: 'schema-parse',    label: 'Schema parsing',      icon: 'braces'    },
    { id: 'lineage-check',   label: 'Lineage checking',    icon: 'layers'    },
    { id: 'reason-code',     label: 'Reason-code mapping', icon: 'score'     },
    { id: 'freshness-check', label: 'Freshness checks',    icon: 'refresh'   },
  ],
  Quality: [
    { id: 'test-triage',     label: 'Test triage',         icon: 'flag'      },
    { id: 'flake-detect',    label: 'Flake detection',     icon: 'activity'  },
    { id: 'contract-diff',   label: 'Contract diffing',    icon: 'braces'    },
    { id: 'coverage-parse',  label: 'Coverage parsing',    icon: 'target'    },
  ],
  FinOps: [
    { id: 'spend-parse',     label: 'Spend parsing',       icon: 'gauge'     },
    { id: 'cost-trend',      label: 'Cost trend analysis', icon: 'activity'  },
    { id: 'rightsizing',     label: 'Rightsizing advice',  icon: 'layers'    },
    { id: 'budget-alert',    label: 'Budget alerting',     icon: 'flag'      },
  ],
  Compliance: [
    { id: 'consent-scope',   label: 'Consent scope check', icon: 'compliance'},
    { id: 'lgpd-remediate',  label: 'LGPD remediation',   icon: 'shield'    },
    { id: 'pii-register',    label: 'PII registration',    icon: 'lock'      },
    { id: 'audit-trail',     label: 'Audit trail read',    icon: 'activity'  },
  ],
};

export const capabilitiesFor = (skill: Skill): SkillCapability[] => CAP_MAP[skill.category] ?? [];

// ── Static "used by" agents per skill ─────────────────────────────────────────
// Maps a skill id to the agent ids that use it. Kept static and consistent.

const USED_BY: Record<string, string[]> = {
  'postmortem-writer':  ['sre', 'p99hunter'],
  'root-cause':         ['sre', 'fraud', 'p99hunter'],
  'runbook-authoring':  ['sre', 'onboard'],
  'incident-comms':     ['sre'],
  'deploy-gating':      ['dora', 'relnotes'],
  'release-notes':      ['relnotes', 'dora'],
  'threat-modeling':    ['lgpd', 'fraud'],
  'pii-discovery':      ['lgpd', 'consentmap'],
  'lgpd-remediation':   ['lgpd', 'consentmap'],
  'slo-design':         ['sre', 'dora'],
  'trace-analysis':     ['sre', 'p99hunter'],
  'anomaly-detection':  ['sre', 'fraud'],
  'query-optimization': ['bureau', 'score'],
  'cost-optimization':  ['costwatch'],
  'flaky-test-triage':  ['flaky', 'dora'],
  'schema-diffing':     ['apicontract', 'bureau'],
  'capacity-planning':  ['sre', 'dora'],
  'rule-tuning':        ['fraud', 'kondtuner'],
  'reason-code':        ['score', 'bureau'],
  'scr-layout':         ['bureau', 'scr'],
  'feature-freshness':  ['score'],
  'chargeback-evidence':['chargeback', 'fraud'],
};

export const usedByFor = (skill: Skill): string[] => USED_BY[skill.id] ?? [];

// ── Versions per skill ─────────────────────────────────────────────────────────

export interface SkillVersion { version: string; date: string; note: string; current?: boolean }

const VERSIONS_MAP: Record<string, SkillVersion[]> = {
  'postmortem-writer': [
    { version: 'v2.4.0', date: 'May 2026', note: 'Added GMUD correlation and timeline diff view.', current: true },
    { version: 'v2.3.0', date: 'Apr 2026', note: 'Severity auto-tagging from alert payload.' },
    { version: 'v2.0.0', date: 'Jan 2026', note: 'Rewrite with structured output schema.' },
  ],
  'root-cause': [
    { version: 'v3.1.2', date: 'Jun 2026', note: 'Improved cross-service trace correlation.', current: true },
    { version: 'v3.0.0', date: 'Mar 2026', note: 'Multi-signal fusion (logs, traces, metrics).' },
    { version: 'v2.8.0', date: 'Jan 2026', note: 'Added PagerDuty alert ingestion.' },
  ],
  'deploy-gating': [
    { version: 'v2.0.4', date: 'May 2026', note: 'GMUD gate and DORA check integration.', current: true },
    { version: 'v2.0.0', date: 'Feb 2026', note: 'New gate DSL replacing legacy YAML.' },
    { version: 'v1.5.0', date: 'Oct 2025', note: 'SLO burn-rate gate added.' },
  ],
  'pii-discovery': [
    { version: 'v2.1.1', date: 'May 2026', note: 'CPF and CNPJ pattern improvements.', current: true },
    { version: 'v2.0.0', date: 'Feb 2026', note: 'Streaming log scanning support.' },
    { version: 'v1.4.0', date: 'Sep 2025', note: 'Initial LGPD field catalogue.' },
  ],
};

const DEFAULT_VERSIONS = (skill: Skill): SkillVersion[] => [
  { version: skill.version, date: 'Jun 2026', note: 'Current release.', current: true },
  { version: 'v' + (parseFloat(skill.version.slice(1)) - 0.1).toFixed(1) + '.0', date: 'Mar 2026', note: 'Stability and performance improvements.' },
];

export const versionsFor = (skill: Skill): SkillVersion[] =>
  VERSIONS_MAP[skill.id] ?? DEFAULT_VERSIONS(skill);
