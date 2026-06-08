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

/** Look up a context by id. */
export const getContext = (id: string): Context | undefined =>
  CONTEXTS.find((c) => c.id === id);

/** Static sync schedule per context (deterministic, keyed on id). */
export interface SyncInfo {
  connector: string;
  transport: string;
  schedule: string;
  lastSync: string;
  freshnessNote: string;
}

const SYNC_INFO: Record<string, SyncInfo> = {
  catalog:     { connector: 'Backstage Catalog API', transport: 'REST / polling', schedule: 'Every 5 min',  lastSync: '2m ago',   freshnessNote: 'Entities are refreshed on every entity update event.' },
  slo:         { connector: 'Backstage SLO plugin',  transport: 'REST / polling', schedule: 'Every 5 min',  lastSync: '6m ago',   freshnessNote: 'Burn rates are recomputed after each ingest cycle.' },
  consent:     { connector: 'Consent Service gRPC',  transport: 'gRPC streaming', schedule: 'On change',    lastSync: '1m ago',   freshnessNote: 'Opt-ins and opt-outs are streamed in under 60 s.' },
  features:    { connector: 'Ignite Feature Store',  transport: 'REST / batch',   schedule: 'Every 15 min', lastSync: '9m ago',   freshnessNote: 'Lineage graph is rebuilt after every pipeline run.' },
  runbooks:    { connector: 'Runbook Service API',   transport: 'REST / polling', schedule: 'Every 30 min', lastSync: '1h ago',   freshnessNote: 'Approved runbooks are published automatically on merge.' },
  incidents:   { connector: 'Incident platform API', transport: 'REST / polling', schedule: 'Every 5 min',  lastSync: '14m ago',  freshnessNote: 'Post-mortems are indexed after resolution is confirmed.' },
  scr:         { connector: 'SCR Vault',             transport: 'REST / on-push', schedule: 'On change',    lastSync: '3d ago',   freshnessNote: 'Spec is versioned; re-indexed only on layout changes.' },
  bureau:      { connector: 'Boa Vista SFTP bridge', transport: 'SFTP / batch',   schedule: 'Every 30 min', lastSync: '22m ago',  freshnessNote: 'Feed schemas update when a new file is delivered.' },
  pipelines:   { connector: 'CI/CD registry API',   transport: 'REST / polling', schedule: 'Every 5 min',  lastSync: '4m ago',   freshnessNote: 'Pipeline configs are indexed on every push to main.' },
  dashboards:  { connector: 'Grafana HTTP API',      transport: 'REST / polling', schedule: 'Every 15 min', lastSync: '7m ago',   freshnessNote: 'Dashboard JSON is captured after each save event.' },
  oncall:      { connector: 'PagerDuty API',         transport: 'REST / polling', schedule: 'Every 15 min', lastSync: '31m ago',  freshnessNote: 'Rotations are re-indexed after a schedule override.' },
  secrets:     { connector: 'Vault KV API',          transport: 'REST / polling', schedule: 'Every 30 min', lastSync: '18m ago',  freshnessNote: 'Rotation policy metadata only; secret values never indexed.' },
  finops:      { connector: 'GCP Billing export',   transport: 'BigQuery job',   schedule: 'Every 1 h',    lastSync: '1h ago',   freshnessNote: 'Spend data is available with up to 1 h of latency.' },
  fraudrules:  { connector: 'konduto Management API',transport: 'REST / polling', schedule: 'Every 15 min', lastSync: '12m ago',  freshnessNote: 'Rule changes are indexed within one polling cycle.' },
  scoremodels: { connector: 'Score Model Registry', transport: 'REST / polling', schedule: 'Every 30 min', lastSync: '40m ago',  freshnessNote: 'A new model version triggers an immediate re-index.' },
  apidocs:     { connector: 'OpenAPI registry',      transport: 'REST / on-push', schedule: 'On change',    lastSync: '11m ago',  freshnessNote: 'Specs are indexed on every merge to the contracts repo.' },
  'drive-arch':    { connector: 'Google Drive API',  transport: 'OAuth2 / push',  schedule: 'On change',    lastSync: '2d ago',   freshnessNote: 'Slides are re-indexed when a file is modified in Drive.' },
  'drive-onboard': { connector: 'Google Drive API',  transport: 'OAuth2 / push',  schedule: 'On change',    lastSync: '5h ago',   freshnessNote: 'Currently syncing 3 documents added in the last 24 h.' },
  'conf-bureau':   { connector: 'Confluence REST API', transport: 'REST / polling', schedule: 'Every 1 h', lastSync: '1d ago',   freshnessNote: 'Space pages are re-indexed after every content update.' },
  'conf-lgpd':     { connector: 'Confluence REST API', transport: 'REST / polling', schedule: 'Every 4 h', lastSync: '3d ago',   freshnessNote: 'DPIAs are indexed after each review cycle completes.' },
  'upload-scr':    { connector: 'File upload',        transport: 'Multipart HTTP', schedule: 'Manual',      lastSync: '6d ago',   freshnessNote: 'Re-upload a new PDF to refresh this context.' },
  'md-style':      { connector: 'Forge document editor', transport: 'Internal API', schedule: 'On save',   lastSync: '2h ago',   freshnessNote: 'Changes are indexed within seconds of saving the document.' },
};

export const syncFor = (id: string): SyncInfo =>
  SYNC_INFO[id] ?? {
    connector: 'Internal connector',
    transport: 'REST / polling',
    schedule: 'Every 15 min',
    lastSync: 'Unknown',
    freshnessNote: 'Sync schedule not configured for this context.',
  };

/** Static list of agent ids that use a given context (deterministic subset). */
const CTX_AGENTS: Record<string, string[]> = {
  catalog:     ['sre', 'onboard', 'dora'],
  slo:         ['sre', 'dora', 'p99hunter'],
  consent:     ['lgpd', 'cadpos', 'consentmap'],
  features:    ['score', 'bureau', 'fraud'],
  runbooks:    ['sre', 'onboard'],
  incidents:   ['sre', 'fraud'],
  scr:         ['bureau', 'scr', 'cadpos'],
  bureau:      ['bureau', 'scr'],
  pipelines:   ['dora', 'flaky', 'apicontract'],
  dashboards:  ['sre', 'dora'],
  oncall:      ['sre', 'onboard'],
  secrets:     ['sre', 'lgpd'],
  finops:      ['costwatch', 'dora'],
  fraudrules:  ['fraud', 'kondtuner', 'chargeback'],
  scoremodels: ['score', 'bureau'],
  apidocs:     ['apicontract', 'bureau'],
  'drive-arch':    ['onboard', 'dora'],
  'drive-onboard': ['onboard'],
  'conf-bureau':   ['bureau', 'scr'],
  'conf-lgpd':     ['lgpd', 'consentmap'],
  'upload-scr':    ['bureau', 'scr'],
  'md-style':      ['sre', 'fraud', 'bureau'],
};

export const usedByFor = (id: string): string[] => CTX_AGENTS[id] ?? [];

/** Data classification per context. */
const CTX_DATA_CLASS: Record<string, { dataClass: string; readers: string[]; restricted: boolean }> = {
  consent:    { dataClass: 'Restricted (PII)', readers: ['Compliance', 'LGPD Auditor', 'Consent Mapper'], restricted: true },
  secrets:    { dataClass: 'Restricted (secrets metadata)', readers: ['Security', 'SRE Copilot'], restricted: true },
  fraudrules: { dataClass: 'Confidential', readers: ['Anti-Fraud', 'Fraud Analyst', 'konduto Tuner'], restricted: true },
  scoremodels:{ dataClass: 'Confidential', readers: ['Score and Risk', 'Score Reviewer'], restricted: true },
  'conf-lgpd':{ dataClass: 'Internal (LGPD-sensitive)', readers: ['Compliance', 'LGPD Auditor'], restricted: true },
};

export interface AccessInfo {
  dataClass: string;
  readers: string[];
  restricted: boolean;
}

export const accessFor = (id: string): AccessInfo =>
  CTX_DATA_CLASS[id] ?? {
    dataClass: 'Internal',
    readers: ['Platform', 'Agent operators'],
    restricted: false,
  };
