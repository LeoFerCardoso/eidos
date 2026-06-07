// Forge (IDP Portal) — Database catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/databases — every database and table in use, for the data team.
// The view leads with what data engineers care about: engine, size + growth,
// table/row counts, PII/LGPD exposure and ownership. Mock but consistent.

export type Engine = 'PostgreSQL' | 'MongoDB' | 'Redis' | 'Snowflake' | 'BigQuery' | 'MySQL';
export type DbEnv = 'prod' | 'staging';
export type DbStatus = 'healthy' | 'degraded';

export interface Database {
  id: string;
  name: string;
  engine: Engine;
  env: DbEnv;
  region: string;
  sizeGb: number;
  tables: number;
  rowsM: number; // millions of rows
  pii: boolean;
  owner: string;
  growth: number; // % month over month
  status: DbStatus;
  service?: string;
}

export const ENGINES: Engine[] = ['PostgreSQL', 'MongoDB', 'Redis', 'Snowflake', 'BigQuery', 'MySQL'];

export const ENGINE_COLOR: Record<Engine, string> = {
  PostgreSQL: 'var(--accent-2, #7DD3FC)',
  MongoDB: 'var(--success)',
  Redis: 'var(--danger)',
  Snowflake: 'var(--accent-2)',
  BigQuery: 'var(--ember)',
  MySQL: 'var(--warning)',
};

export const DATABASES: Database[] = [
  { id: 'bureau-core',     name: 'bureau_core',       engine: 'PostgreSQL', env: 'prod', region: 'br-se-1', sizeGb: 4280, tables: 312, rowsM: 8400, pii: true,  owner: 'Bureau Data',     growth: 6,  status: 'healthy',  service: 'bureau-ingestion' },
  { id: 'scpc-records',    name: 'scpc_records',      engine: 'PostgreSQL', env: 'prod', region: 'br-se-1', sizeGb: 2110, tables: 148, rowsM: 5200, pii: true,  owner: 'Bureau Data',     growth: 4,  status: 'healthy',  service: 'scpc-gateway' },
  { id: 'score-features',  name: 'score_features',    engine: 'Snowflake',  env: 'prod', region: 'br-se-1', sizeGb: 9870, tables: 86,  rowsM: 14200,pii: true,  owner: 'Data Platform',   growth: 11, status: 'healthy',  service: 'ignite-feature-store' },
  { id: 'analytics-dw',    name: 'analytics_dw',      engine: 'BigQuery',   env: 'prod', region: 'us-east-1',sizeGb: 18400,tables: 204, rowsM: 31000,pii: false, owner: 'Data Platform',   growth: 14, status: 'healthy' },
  { id: 'identity-store',  name: 'identity_store',    engine: 'PostgreSQL', env: 'prod', region: 'br-se-1', sizeGb: 760,  tables: 64,  rowsM: 420,  pii: true,  owner: 'Identity',        growth: 3,  status: 'degraded', service: 'identity-proofing' },
  { id: 'fraud-events',    name: 'fraud_events',      engine: 'MongoDB',    env: 'prod', region: 'br-se-1', sizeGb: 1340, tables: 22,  rowsM: 2600, pii: true,  owner: 'Anti-Fraud',      growth: 9,  status: 'healthy',  service: 'konduto-antifraud' },
  { id: 'device-cache',    name: 'device_cache',      engine: 'Redis',      env: 'prod', region: 'br-se-1', sizeGb: 48,   tables: 0,   rowsM: 0,    pii: false, owner: 'Anti-Fraud',      growth: 1,  status: 'healthy',  service: 'device-fingerprint' },
  { id: 'consent-ledger',  name: 'consent_ledger',    engine: 'PostgreSQL', env: 'prod', region: 'br-se-1', sizeGb: 520,  tables: 28,  rowsM: 4200, pii: true,  owner: 'Compliance',      growth: 5,  status: 'healthy',  service: 'consent-service' },
  { id: 'decision-logs',   name: 'decision_logs',     engine: 'BigQuery',   env: 'prod', region: 'us-east-1',sizeGb: 6200, tables: 12,  rowsM: 9800, pii: false, owner: 'Decisioning',     growth: 8,  status: 'healthy',  service: 'decision-engine' },
  { id: 'ocr-blobs-meta',  name: 'ocr_blobs_meta',    engine: 'MongoDB',    env: 'prod', region: 'br-se-1', sizeGb: 410,  tables: 8,   rowsM: 180,  pii: true,  owner: 'Identity',        growth: 2,  status: 'healthy',  service: 'document-ocr' },
  { id: 'recovery-cases',  name: 'recovery_cases',    engine: 'MySQL',      env: 'prod', region: 'br-se-1', sizeGb: 280,  tables: 41,  rowsM: 120,  pii: true,  owner: 'Recovery',        growth: -2, status: 'degraded', service: 'recovery-comms' },
  { id: 'rate-limit',      name: 'rate_limit',        engine: 'Redis',      env: 'prod', region: 'br-se-1', sizeGb: 12,   tables: 0,   rowsM: 0,    pii: false, owner: 'Platform',        growth: 0,  status: 'healthy' },
  { id: 'sandbox-bureau',  name: 'bureau_core',       engine: 'PostgreSQL', env: 'staging', region: 'br-se-1', sizeGb: 84, tables: 312, rowsM: 12,   pii: false, owner: 'Bureau Data',     growth: 0,  status: 'healthy' },
];

export interface TableRow { name: string; db: string; rowsM: number; sizeGb: number; pii: boolean }

export const TOP_TABLES: TableRow[] = [
  { name: 'feature_vectors',  db: 'score_features', rowsM: 8200, sizeGb: 4100, pii: true },
  { name: 'consultations',    db: 'bureau_core',    rowsM: 3400, sizeGb: 1620, pii: true },
  { name: 'scr_records',      db: 'scpc_records',   rowsM: 2900, sizeGb: 980,  pii: true },
  { name: 'decision_events',  db: 'decision_logs',  rowsM: 9800, sizeGb: 920,  pii: false },
  { name: 'fraud_signals',    db: 'fraud_events',   rowsM: 2600, sizeGb: 740,  pii: true },
  { name: 'consent_changes',  db: 'consent_ledger', rowsM: 4200, sizeGb: 380,  pii: true },
];

export const STATUS_TONE: Record<DbStatus, { label: string; tone: 'health-up' | 'warning' }> = {
  healthy: { label: 'Healthy', tone: 'health-up' },
  degraded: { label: 'Degraded', tone: 'warning' },
};

/** Compact storage label (deterministic). */
export const fmtSize = (gb: number): string => (gb >= 1000 ? (gb / 1000).toFixed(1).replace(/\.0$/, '') + ' TB' : gb + ' GB');
export const fmtRows = (m: number): string => (m === 0 ? 'n/a' : m >= 1000 ? (m / 1000).toFixed(1).replace(/\.0$/, '') + 'B' : m + 'M');

const totalGb = DATABASES.reduce((m, d) => m + d.sizeGb, 0);

/** Storage by engine, for the breakdown bar. */
export const ENGINE_MIX = ENGINES.map((e) => ({
  engine: e,
  color: ENGINE_COLOR[e],
  sizeGb: DATABASES.filter((d) => d.engine === e).reduce((m, d) => m + d.sizeGb, 0),
})).filter((x) => x.sizeGb > 0).sort((a, b) => b.sizeGb - a.sizeGb);

export const KPIS = [
  { id: 'dbs', label: 'Databases', value: String(DATABASES.length), note: `${DATABASES.filter((d) => d.env === 'prod').length} in production.` },
  { id: 'tables', label: 'Tables', value: DATABASES.reduce((m, d) => m + d.tables, 0).toLocaleString('en-US'), note: 'Across all engines.' },
  { id: 'size', label: 'Total storage', value: fmtSize(totalGb), note: 'Provisioned across regions.' },
  { id: 'pii', label: 'PII databases', value: String(DATABASES.filter((d) => d.pii).length), note: 'Under LGPD controls.' },
];

export const AI_READ = {
  title: 'Largest cost and risk',
  body: 'analytics_dw on BigQuery is the biggest store at 18.4 TB and growing 14% month over month, but holds no PII. score_features on Snowflake (9.9 TB) does hold PII and feeds every score, so it carries both cost and LGPD weight. Forge suggests a retention policy on analytics_dw partitions older than 18 months to bend the cost curve without touching the regulated stores.',
};
