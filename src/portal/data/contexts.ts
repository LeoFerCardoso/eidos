// Forge (IDP Portal) — Contexts catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/contexts — the knowledge base agents read to ground their
// answers. Sources: bureau registries, Google Drive, Confluence, uploaded
// files, and Markdown documents authored in Forge. This is the SINGLE SOURCE:
// the agent wizard's CONTEXT_POOL (agent-detail.ts) is derived from CONTEXTS,
// so anything here is attachable to an agent. Mock but consistent.

export type ContextSource = 'Registry' | 'Google Drive' | 'Confluence' | 'Upload' | 'Markdown';
export type ContextStatus = 'connected' | 'syncing' | 'draft';

export interface Context {
  id: string;
  name: string;
  icon: string;
  desc: string;
  source: ContextSource;
  /** items indexed (docs, rows, pages). */
  items: number;
  updated: string;
  owner: string;
  status: ContextStatus;
}

export const CONTEXTS: Context[] = [
  // ── Bureau registries (live data) ───────────────────────────────────────────
  { id: 'catalog',     name: 'Service catalog',        icon: 'package',    desc: 'Every service, owner and dependency.',        source: 'Registry', items: 30,    updated: '2m ago',   owner: 'Platform',         status: 'connected' },
  { id: 'slo',         name: 'SLO registry',           icon: 'target',     desc: 'Targets and burn rates per service.',         source: 'Registry', items: 30,    updated: '6m ago',   owner: 'Platform',         status: 'connected' },
  { id: 'consent',     name: 'Consent ledger',         icon: 'compliance', desc: 'LGPD consent scopes per CPF.',                source: 'Registry', items: 4200000,updated: '1m ago',  owner: 'Compliance',       status: 'connected' },
  { id: 'features',    name: 'Ignite feature store',   icon: 'database',   desc: 'Feature freshness and lineage.',              source: 'Registry', items: 1840,  updated: '9m ago',   owner: 'Data & Bureau',    status: 'connected' },
  { id: 'runbooks',    name: 'Runbook library',        icon: 'book',       desc: 'Approved operational runbooks.',              source: 'Registry', items: 142,   updated: '1h ago',   owner: 'Platform',         status: 'connected' },
  { id: 'incidents',   name: 'Incident history',       icon: 'incident',   desc: 'Past incidents and resolutions.',             source: 'Registry', items: 1247,  updated: '14m ago',  owner: 'Platform',         status: 'connected' },
  { id: 'scr',         name: 'SCR layout spec',        icon: 'layers',     desc: 'SCR record layout and field contracts.',      source: 'Registry', items: 1,     updated: '3d ago',   owner: 'Data & Bureau',    status: 'connected' },
  { id: 'bureau',      name: 'Boa Vista feeds',        icon: 'doc',        desc: 'Bureau feed schemas and SLAs.',               source: 'Registry', items: 18,    updated: '22m ago',  owner: 'Data & Bureau',    status: 'connected' },
  { id: 'pipelines',   name: 'Pipeline registry',      icon: 'pipeline',   desc: 'CI/CD pipelines and quality gates.',          source: 'Registry', items: 30,    updated: '4m ago',   owner: 'Platform',         status: 'connected' },
  { id: 'dashboards',  name: 'Dashboards & metrics',   icon: 'activity',   desc: 'Grafana dashboards and key metrics.',         source: 'Registry', items: 86,    updated: '7m ago',   owner: 'Platform',         status: 'connected' },
  { id: 'oncall',      name: 'On-call schedule',       icon: 'clock',      desc: 'Rotations and escalation paths.',             source: 'Registry', items: 12,    updated: '31m ago',  owner: 'Platform',         status: 'connected' },
  { id: 'secrets',     name: 'Access & secrets',       icon: 'lock',       desc: 'Access scopes and rotation policy.',          source: 'Registry', items: 540,   updated: '18m ago',  owner: 'Security',         status: 'connected' },
  { id: 'finops',      name: 'FinOps ledger',          icon: 'gauge',      desc: 'Cloud spend by service and team.',            source: 'Registry', items: 30,    updated: '1h ago',   owner: 'Platform',         status: 'connected' },
  { id: 'fraudrules',  name: 'konduto rule set',       icon: 'shield',     desc: 'Active antifraud rules and thresholds.',      source: 'Registry', items: 88,    updated: '12m ago',  owner: 'Anti-Fraud',       status: 'connected' },
  { id: 'scoremodels', name: 'Score model registry',   icon: 'score',      desc: 'Model versions and reason codes.',            source: 'Registry', items: 24,    updated: '40m ago',  owner: 'Score & Risk',     status: 'connected' },
  { id: 'apidocs',     name: 'API contracts',          icon: 'braces',     desc: 'OpenAPI specs and consumers.',                source: 'Registry', items: 64,    updated: '11m ago',  owner: 'Platform',         status: 'connected' },
  // ── Connected sources ───────────────────────────────────────────────────────
  { id: 'drive-arch',  name: 'Architecture decks',     icon: 'layers',     desc: 'Quarterly architecture review decks.',        source: 'Google Drive', items: 47, updated: '2d ago',   owner: 'Thiago Albuquerque', status: 'connected' },
  { id: 'drive-onboard', name: 'Engineering handbook', icon: 'book',       desc: 'Onboarding handbook and ways of working.',    source: 'Google Drive', items: 132, updated: '5h ago',  owner: 'Mariana Castelli',   status: 'syncing' },
  { id: 'conf-bureau', name: 'Bureau integration wiki',icon: 'doc',        desc: 'Confluence space for SCPC and feeds.',        source: 'Confluence', items: 286, updated: '1d ago',   owner: 'Diego Vasquez',      status: 'connected' },
  { id: 'conf-lgpd',   name: 'LGPD playbook',          icon: 'compliance', desc: 'Data-protection procedures and DPIAs.',       source: 'Confluence', items: 64,  updated: '3d ago',   owner: 'Compliance',         status: 'connected' },
  // ── Uploaded + authored ─────────────────────────────────────────────────────
  { id: 'upload-scr',  name: 'SCR spec v9 (PDF)',      icon: 'file',       desc: 'Uploaded SCR layout specification.',          source: 'Upload',   items: 1,     updated: '6d ago',   owner: 'Diego Vasquez',      status: 'connected' },
  { id: 'md-style',    name: 'Agent response style',   icon: 'doc',        desc: 'Authored guide for agent tone and format.',   source: 'Markdown', items: 1,     updated: '2h ago',   owner: 'Leonardo Cardoso',   status: 'draft' },
];

export const STATUS_META: Record<ContextStatus, { label: string; tone: 'health-up' | 'status-running' | 'warning' }> = {
  connected: { label: 'Connected', tone: 'health-up' },
  syncing: { label: 'Syncing', tone: 'status-running' },
  draft: { label: 'Draft', tone: 'warning' },
};

/** Source presentation — BrandIcon slug for branded sources, else a generic icon. */
export const SOURCE_META: Record<ContextSource, { brand?: string; icon?: string }> = {
  Registry: { icon: 'database' },
  'Google Drive': { brand: 'google-drive' },
  Confluence: { brand: 'confluence' },
  Upload: { icon: 'upload' },
  Markdown: { icon: 'doc' },
};

/** Connect tiles shown at the top of the page. */
export const CONNECTORS = [
  { id: 'drive', label: 'Google Drive', desc: 'Sync docs, sheets and slides.', brand: 'google-drive' },
  { id: 'confluence', label: 'Confluence', desc: 'Index spaces and pages.', brand: 'confluence' },
  { id: 'upload', label: 'Upload files', desc: 'PDF, docx, images, CSV.', icon: 'upload' },
  { id: 'markdown', label: 'New document', desc: 'Author a Markdown context.', icon: 'edit' },
];

export const sourceCount = (s: ContextSource) => CONTEXTS.filter((c) => c.source === s).length;
export const totalItems = CONTEXTS.reduce((m, c) => m + c.items, 0);

/** Format a large item count compactly (deterministic, locale-independent). */
export const fmtItems = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
};
