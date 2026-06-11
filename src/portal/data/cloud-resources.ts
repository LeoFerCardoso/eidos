// Forge (IDP Portal) — Cloud resources + FinOps (Equifax Boa Vista, bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/cloud-resources — every cloud resource (services, databases,
// pub/sub, buckets, WAF, secrets, networks, caches, functions, load balancers)
// with a FinOps view. Each resource links to the page that owns it: a service
// to its catalog page, a database to the database catalog, a bucket to buckets.
// Cost in BRL (R$). Mock but consistent.
//
// Deterministic pseudo-variation: fixed sin-hash used where varied values add
// realism. NO Date.now(), NO Math.random().

export type ResType =
  | 'Service' | 'Database' | 'Bucket' | 'Pub/Sub' | 'WAF'
  | 'Secret' | 'Network' | 'Cache' | 'Function' | 'Load Balancer';

export type Provider = 'GCP' | 'AWS';
export type ResStatus = 'running' | 'idle' | 'error';

/** Utilization signal — CPU/mem percentage 0-100. */
export interface UtilBand {
  /** 0-100 integer. */
  pct: number;
  /** Display label. */
  label: 'Low' | 'Medium' | 'High' | 'Critical';
  /** CSS custom-property for the bar fill. */
  color: string;
}

export interface CloudResource {
  id: string;
  name: string;
  type: ResType;
  provider: Provider;
  region: string;
  /** GCP project or AWS account short label. */
  account: string;
  product: string;
  /** Team / squad that owns this resource. */
  team: string;
  /** Machine size / spec label (e.g. "n2-standard-8", "db.r6g.2xlarge"). */
  spec: string;
  /** Descriptive tags for filtering / governance. */
  tags: string[];
  costMo: number; // R$ / month
  trend: number; // % MoM
  status: ResStatus;
  /** CPU/memory utilization, 0-100. */
  util: number;
  /** service id for Service rows -> links to its catalog page. */
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

/** Map a utilization percentage to a UtilBand. */
export function utilBand(pct: number): UtilBand {
  if (pct >= 90) return { pct, label: 'Critical', color: 'var(--danger)' };
  if (pct >= 65) return { pct, label: 'High',     color: 'var(--warning)' };
  if (pct >= 30) return { pct, label: 'Medium',   color: 'var(--success)' };
  return           { pct, label: 'Low',     color: 'var(--fg-faint)' };
}

export const RESOURCES: CloudResource[] = [
  {
    id: 'r1',  name: 'score-engine',
    type: 'Service',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-core',
    product: 'Score & Risk',  team: 'Risk Platform',
    spec: 'n2-standard-16',   tags: ['prod', 'tier-1', 'pci'],
    costMo: 42800, trend: 6,  status: 'running', util: 78, ref: 'score-engine',
  },
  {
    id: 'r2',  name: 'acerta-api',
    type: 'Service',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-core',
    product: 'Score & Risk',  team: 'Risk Platform',
    spec: 'n2-standard-8',    tags: ['prod', 'tier-1'],
    costMo: 28400, trend: 4,  status: 'running', util: 63, ref: 'acerta-api',
  },
  {
    id: 'r3',  name: 'konduto-antifraud',
    type: 'Service',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-fraud',
    product: 'Anti-Fraud',    team: 'Fraud & Risk',
    spec: 'n2-highcpu-16',    tags: ['prod', 'tier-1', 'realtime'],
    costMo: 19600, trend: 9,  status: 'running', util: 82, ref: 'konduto-antifraud',
  },
  {
    id: 'r4',  name: 'identity-proofing',
    type: 'Service',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-identity',
    product: 'Identity',      team: 'Identity',
    spec: 'n2-standard-8',    tags: ['prod', 'tier-1', 'kyc'],
    costMo: 14200, trend: 3,  status: 'running', util: 55, ref: 'identity-proofing',
  },
  {
    id: 'r5',  name: 'analytics_dw',
    type: 'Database',      provider: 'AWS', region: 'us-east-1', account: 'aws-analytics-prod',
    product: 'Data & Bureau', team: 'Data Platform',
    spec: 'db.r6g.4xlarge',   tags: ['prod', 'analytics', 'pii'],
    costMo: 38200, trend: 14, status: 'running', util: 71,
  },
  {
    id: 'r6',  name: 'score_features',
    type: 'Database',      provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-core',
    product: 'Data & Bureau', team: 'Risk Platform',
    spec: 'db-n1-standard-8', tags: ['prod', 'tier-1', 'feature-store'],
    costMo: 31500, trend: 11, status: 'running', util: 68,
  },
  {
    id: 'r7',  name: 'bureau_core',
    type: 'Database',      provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-core',
    product: 'Data & Bureau', team: 'Bureau Ops',
    spec: 'db-n1-highmem-16', tags: ['prod', 'tier-1', 'pci', 'encrypted'],
    costMo: 22800, trend: 6,  status: 'running', util: 59,
  },
  {
    id: 'r8',  name: 'biometric-frames',
    type: 'Bucket',        provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-identity',
    product: 'Identity',      team: 'Identity',
    spec: 'STANDARD / multi-regional', tags: ['prod', 'pii', 'biometric'],
    costMo: 5060,  trend: 7,  status: 'running', util: 44,
  },
  {
    id: 'r9',  name: 'db-backups',
    type: 'Bucket',        provider: 'AWS', region: 'us-east-1', account: 'aws-analytics-prod',
    product: 'Data & Bureau', team: 'Data Platform',
    spec: 'STANDARD',          tags: ['backup', 'retention-90d'],
    costMo: 1520,  trend: -3, status: 'idle', util: 4,
  },
  {
    id: 'r10', name: 'legacy-konduto-dump',
    type: 'Bucket',        provider: 'AWS', region: 'us-east-1', account: 'aws-legacy',
    product: 'Anti-Fraud',    team: 'Fraud & Risk',
    spec: 'STANDARD',          tags: ['legacy', 'untagged', 'stale'],
    costMo: 1780,  trend: 0,  status: 'idle', util: 1,
  },
  {
    id: 'r11', name: 'decisions-topic',
    type: 'Pub/Sub',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-core',
    product: 'Decisioning',   team: 'Risk Platform',
    spec: 'Standard throughput', tags: ['prod', 'streaming', 'tier-1'],
    costMo: 3400,  trend: 8,  status: 'running', util: 52,
  },
  {
    id: 'r12', name: 'fraud-events-topic',
    type: 'Pub/Sub',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-fraud',
    product: 'Anti-Fraud',    team: 'Fraud & Risk',
    spec: 'Standard throughput', tags: ['prod', 'realtime', 'tier-1'],
    costMo: 2900,  trend: 12, status: 'running', util: 61,
  },
  {
    id: 'r13', name: 'edge-waf',
    type: 'WAF',           provider: 'GCP', region: 'global',    account: 'bvs-prod-platform',
    product: 'Platform',      team: 'Platform Security',
    spec: 'Cloud Armor Plus',  tags: ['prod', 'security', 'tier-1'],
    costMo: 6800,  trend: 2,  status: 'running', util: 38,
  },
  {
    id: 'r14', name: 'secret-manager',
    type: 'Secret',        provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-platform',
    product: 'Platform',      team: 'Platform Security',
    spec: 'Secret Manager',    tags: ['prod', 'security', 'pci'],
    costMo: 420,   trend: 1,  status: 'running', util: 12,
  },
  {
    id: 'r15', name: 'bureau-vpc',
    type: 'Network',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-core',
    product: 'Platform',      team: 'Platform Infra',
    spec: 'Shared VPC',        tags: ['prod', 'networking', 'tier-1'],
    costMo: 5200,  trend: 0,  status: 'running', util: 35,
  },
  {
    id: 'r16', name: 'interconnect-vpn',
    type: 'Network',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-platform',
    product: 'Decisioning',   team: 'Platform Infra',
    spec: 'Dedicated 10Gbps',  tags: ['prod', 'networking'],
    costMo: 2100,  trend: 0,  status: 'running', util: 27,
  },
  {
    id: 'r17', name: 'device-cache',
    type: 'Cache',         provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-fraud',
    product: 'Anti-Fraud',    team: 'Fraud & Risk',
    spec: 'Memorystore M2',    tags: ['prod', 'realtime'],
    costMo: 1840,  trend: 1,  status: 'running', util: 47,
  },
  {
    id: 'r18', name: 'webhook-dispatch-fn',
    type: 'Function',      provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-platform',
    product: 'Platform',      team: 'Platform Infra',
    spec: '1 vCPU / 512 MB',   tags: ['prod', 'event-driven'],
    costMo: 980,   trend: 5,  status: 'running', util: 29,
  },
  {
    id: 'r19', name: 'ocr-batch-fn',
    type: 'Function',      provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-identity',
    product: 'Identity',      team: 'Identity',
    spec: '4 vCPU / 4 GB',     tags: ['prod', 'batch', 'erroring'],
    costMo: 3600,  trend: 22, status: 'error', util: 91,
  },
  {
    id: 'r20', name: 'public-lb',
    type: 'Load Balancer', provider: 'GCP', region: 'br-se-1',   account: 'bvs-prod-platform',
    product: 'Platform',      team: 'Platform Infra',
    spec: 'Global HTTPS LB',   tags: ['prod', 'networking', 'tier-1'],
    costMo: 2400,  trend: 2,  status: 'running', util: 42,
  },
  {
    id: 'r21', name: 'staging-cluster',
    type: 'Service',       provider: 'GCP', region: 'br-se-1',   account: 'bvs-staging',
    product: 'Platform',      team: 'Platform Infra',
    spec: 'n1-standard-4',     tags: ['staging', 'non-prod', 'idle'],
    costMo: 4200,  trend: -1, status: 'idle', util: 3,
  },
];

export const STATUS_META: Record<ResStatus, { label: string; tone: 'health-up' | 'warning' | 'danger' }> = {
  running: { label: 'Running', tone: 'health-up' },
  idle:    { label: 'Idle',    tone: 'warning' },
  error:   { label: 'Error',   tone: 'danger' },
};

export const fmtBrl = (n: number): string => 'R$ ' + (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));

export const PRODUCTS = ['Score & Risk', 'Anti-Fraud', 'Identity', 'Data & Bureau', 'Decisioning', 'Platform'];

export const ACCOUNTS = [...new Set(RESOURCES.map((r) => r.account))].sort();

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
  { id: 'spend',     label: 'Monthly spend',       value: fmtBrl(totalCost), note: 'All resources, all providers.' },
  { id: 'mom',       label: 'Change vs last month', value: '+7%',             note: 'Driven by analytics_dw growth.' },
  { id: 'resources', label: 'Resources',            value: String(RESOURCES.length), note: `Across ${TYPES.length} types.` },
  { id: 'idle',      label: 'Idle spend',           value: fmtBrl(idleCost), note: 'Candidates to stop or downsize.' },
];

export const AI_READ = {
  title: 'Where the money leaks',
  body: 'Three idle resources, db-backups, legacy-konduto-dump and staging-cluster, cost R$ 7.5k a month for work nothing is doing right now. Separately, ocr-batch-fn jumped 22% and is erroring, so it is both wasteful and broken. Fixing the function and stopping the idle three would trim roughly R$ 11k a month without touching production scoring.',
};


// ── T2 Pulse additions (viz family) ──────────────────────────────────────────
/** 30-day total spend trend (R$ k/day) + the prior month ghost. */
export const SPEND_TREND = [7.4, 7.5, 7.4, 7.6, 7.8, 7.7, 7.9, 8.0, 7.9, 8.1, 8.0, 8.2, 8.4, 8.3, 8.2, 8.4, 8.6, 8.5, 8.7, 8.6, 8.8, 9.0, 8.9, 9.1, 9.0, 9.2, 9.4, 9.3, 9.5, 9.6];
export const SPEND_TREND_PREV = [7.1, 7.2, 7.1, 7.3, 7.2, 7.4, 7.3, 7.5, 7.4, 7.5, 7.6, 7.5, 7.7, 7.6, 7.7, 7.8, 7.7, 7.9, 7.8, 7.9, 8.0, 7.9, 8.1, 8.0, 8.1, 8.2, 8.1, 8.2, 8.3, 8.2];
