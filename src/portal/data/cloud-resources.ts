// Forge (IDP Portal) — Cloud resources + FinOps (Equifax Boa Vista, bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/cloud-resources — every cloud resource (services, databases,
// pub/sub, buckets, WAF, secrets, networks, caches, functions, load balancers)
// with a FinOps view. Each resource links to the page that owns it: a service
// to its catalog page, a database to the database catalog, a bucket to buckets.
// Cost in BRL (R$). Mock but consistent.

export type ResType =
  | 'Service' | 'Database' | 'Bucket' | 'Pub/Sub' | 'WAF'
  | 'Secret' | 'Network' | 'Cache' | 'Function' | 'Load Balancer';

export type Provider = 'GCP' | 'AWS';
export type ResStatus = 'running' | 'idle' | 'error';

export interface CloudResource {
  id: string;
  name: string;
  type: ResType;
  provider: Provider;
  region: string;
  product: string;
  costMo: number; // R$ / month
  trend: number; // % MoM
  status: ResStatus;
  /** service id for Service rows → links to its catalog page. */
  ref?: string;
}

export const TYPES: ResType[] = ['Service', 'Database', 'Bucket', 'Pub/Sub', 'WAF', 'Secret', 'Network', 'Cache', 'Function', 'Load Balancer'];

export const TYPE_ICON: Record<ResType, string> = {
  Service: 'server',
  Database: 'database',
  Bucket: 'folder',
  'Pub/Sub': 'activity',
  WAF: 'shield',
  Secret: 'lock',
  Network: 'globe',
  Cache: 'zap',
  Function: 'gitPullRequest',
  'Load Balancer': 'layers',
};

/** Cross-link target for a resource (or undefined if it stays on this page). */
export function resourceLink(r: CloudResource): string | undefined {
  if (r.type === 'Service' && r.ref) return `/portal/catalog/${r.ref}`;
  if (r.type === 'Database') return '/portal/databases';
  if (r.type === 'Bucket') return '/portal/buckets';
  return undefined;
}

export const RESOURCES: CloudResource[] = [
  { id: 'r1',  name: 'score-engine',        type: 'Service',       provider: 'GCP', region: 'br-se-1',  product: 'Score & Risk',  costMo: 42800, trend: 6,   status: 'running', ref: 'score-engine' },
  { id: 'r2',  name: 'acerta-api',          type: 'Service',       provider: 'GCP', region: 'br-se-1',  product: 'Score & Risk',  costMo: 28400, trend: 4,   status: 'running', ref: 'acerta-api' },
  { id: 'r3',  name: 'konduto-antifraud',   type: 'Service',       provider: 'GCP', region: 'br-se-1',  product: 'Anti-Fraud',    costMo: 19600, trend: 9,   status: 'running', ref: 'konduto-antifraud' },
  { id: 'r4',  name: 'identity-proofing',   type: 'Service',       provider: 'GCP', region: 'br-se-1',  product: 'Identity',      costMo: 14200, trend: 3,   status: 'running', ref: 'identity-proofing' },
  { id: 'r5',  name: 'analytics_dw',        type: 'Database',      provider: 'AWS', region: 'us-east-1',product: 'Data & Bureau', costMo: 38200, trend: 14,  status: 'running' },
  { id: 'r6',  name: 'score_features',      type: 'Database',      provider: 'GCP', region: 'br-se-1',  product: 'Data & Bureau', costMo: 31500, trend: 11,  status: 'running' },
  { id: 'r7',  name: 'bureau_core',         type: 'Database',      provider: 'GCP', region: 'br-se-1',  product: 'Data & Bureau', costMo: 22800, trend: 6,   status: 'running' },
  { id: 'r8',  name: 'biometric-frames',    type: 'Bucket',        provider: 'GCP', region: 'br-se-1',  product: 'Identity',      costMo: 5060,  trend: 7,   status: 'running' },
  { id: 'r9',  name: 'db-backups',          type: 'Bucket',        provider: 'AWS', region: 'us-east-1',product: 'Data & Bureau', costMo: 1520,  trend: -3,  status: 'idle' },
  { id: 'r10', name: 'legacy-konduto-dump', type: 'Bucket',        provider: 'AWS', region: 'us-east-1',product: 'Anti-Fraud',    costMo: 1780,  trend: 0,   status: 'idle' },
  { id: 'r11', name: 'decisions-topic',     type: 'Pub/Sub',       provider: 'GCP', region: 'br-se-1',  product: 'Decisioning',   costMo: 3400,  trend: 8,   status: 'running' },
  { id: 'r12', name: 'fraud-events-topic',  type: 'Pub/Sub',       provider: 'GCP', region: 'br-se-1',  product: 'Anti-Fraud',    costMo: 2900,  trend: 12,  status: 'running' },
  { id: 'r13', name: 'edge-waf',            type: 'WAF',           provider: 'GCP', region: 'global',   product: 'Platform',      costMo: 6800,  trend: 2,   status: 'running' },
  { id: 'r14', name: 'secret-manager',      type: 'Secret',        provider: 'GCP', region: 'br-se-1',  product: 'Platform',      costMo: 420,   trend: 1,   status: 'running' },
  { id: 'r15', name: 'bureau-vpc',          type: 'Network',       provider: 'GCP', region: 'br-se-1',  product: 'Platform',      costMo: 5200,  trend: 0,   status: 'running' },
  { id: 'r16', name: 'interconnect-vpn',    type: 'Network',       provider: 'GCP', region: 'br-se-1',  product: 'Decisioning',   costMo: 2100,  trend: 0,   status: 'running' },
  { id: 'r17', name: 'device-cache',        type: 'Cache',         provider: 'GCP', region: 'br-se-1',  product: 'Anti-Fraud',    costMo: 1840,  trend: 1,   status: 'running' },
  { id: 'r18', name: 'webhook-dispatch-fn', type: 'Function',      provider: 'GCP', region: 'br-se-1',  product: 'Platform',      costMo: 980,   trend: 5,   status: 'running' },
  { id: 'r19', name: 'ocr-batch-fn',        type: 'Function',      provider: 'GCP', region: 'br-se-1',  product: 'Identity',      costMo: 3600,  trend: 22,  status: 'error' },
  { id: 'r20', name: 'public-lb',           type: 'Load Balancer', provider: 'GCP', region: 'br-se-1',  product: 'Platform',      costMo: 2400,  trend: 2,   status: 'running' },
  { id: 'r21', name: 'staging-cluster',     type: 'Service',       provider: 'GCP', region: 'br-se-1',  product: 'Platform',      costMo: 4200,  trend: -1,  status: 'idle' },
];

export const STATUS_META: Record<ResStatus, { label: string; tone: 'health-up' | 'warning' | 'danger' }> = {
  running: { label: 'Running', tone: 'health-up' },
  idle: { label: 'Idle', tone: 'warning' },
  error: { label: 'Error', tone: 'danger' },
};

export const fmtBrl = (n: number): string => 'R$ ' + (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));

export const PRODUCTS = ['Score & Risk', 'Anti-Fraud', 'Identity', 'Data & Bureau', 'Decisioning', 'Platform'];

const totalCost = RESOURCES.reduce((m, r) => m + r.costMo, 0);

/** Spend by resource type, for the FinOps bars. */
const byTypeRaw = TYPES.map((t) => ({ key: t, cost: RESOURCES.filter((r) => r.type === t).reduce((m, r) => m + r.costMo, 0) })).filter((x) => x.cost > 0).sort((a, b) => b.cost - a.cost);
const maxType = Math.max(...byTypeRaw.map((x) => x.cost));
export const SPEND_BY_TYPE = byTypeRaw.map((x) => ({ ...x, pct: (x.cost / maxType) * 100 }));

/** Spend by product, for the FinOps bars. */
const byProductRaw = PRODUCTS.map((p) => ({ key: p, cost: RESOURCES.filter((r) => r.product === p).reduce((m, r) => m + r.costMo, 0) })).sort((a, b) => b.cost - a.cost);
const maxProduct = Math.max(...byProductRaw.map((x) => x.cost));
export const SPEND_BY_PRODUCT = byProductRaw.map((x) => ({ ...x, pct: (x.cost / maxProduct) * 100 }));

const idleCost = RESOURCES.filter((r) => r.status === 'idle').reduce((m, r) => m + r.costMo, 0);

export const KPIS = [
  { id: 'spend', label: 'Monthly spend', value: fmtBrl(totalCost), note: 'All resources, all providers.' },
  { id: 'mom', label: 'Change vs last month', value: '+7%', note: 'Driven by analytics_dw growth.' },
  { id: 'resources', label: 'Resources', value: String(RESOURCES.length), note: `Across ${TYPES.length} types.` },
  { id: 'idle', label: 'Idle spend', value: fmtBrl(idleCost), note: 'Candidates to stop or downsize.' },
];

export const AI_READ = {
  title: 'Where the money leaks',
  body: 'Three idle resources, db-backups, legacy-konduto-dump and staging-cluster, cost R$ 7.5k a month for work nothing is doing right now. Separately, ocr-batch-fn jumped 22% and is erroring, so it is both wasteful and broken. Fixing the function and stopping the idle three would trim roughly R$ 11k a month without touching production scoring.',
};
