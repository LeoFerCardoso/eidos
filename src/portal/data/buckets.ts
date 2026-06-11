// Forge (IDP Portal) — Object storage catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/buckets — every object-storage repo: files, images, videos,
// documents, backups and logs, INCLUDING the cold, frozen and dead data that
// quietly costs money. Surfacing stale storage is the point. Mock but
// consistent; cost in BRL (R$).

export type Provider = 'GCS' | 'S3';
export type StorageClass = 'standard' | 'nearline' | 'coldline' | 'archive';
export type Content = 'images' | 'videos' | 'documents' | 'files' | 'backups' | 'logs';
export type BucketStatus = 'active' | 'frozen' | 'dead';

export type LifecyclePolicy = 'active' | 'missing' | 'drift';

export interface Bucket {
  id: string;
  name: string;
  provider: Provider;
  klass: StorageClass;
  content: Content;
  objects: number;
  sizeGb: number;
  lastAccess: string;
  pii: boolean;
  owner: string;
  region: string;
  costMo: number; // R$ / month, storage
  egressMo: number; // R$ / month, data transfer out (from the billing export)
  trend: number; // cost MoM %
  autoclass: boolean; // GCS Autoclass (S3: intelligent tiering)
  lifecycle: LifecyclePolicy;
  status: BucketStatus;
}

export const LIFECYCLE_META: Record<LifecyclePolicy, { label: string; tone: 'health-up' | 'danger' | 'warning' }> = {
  active: { label: 'Policy', tone: 'health-up' },
  missing: { label: 'No policy', tone: 'danger' },
  drift: { label: 'Drift', tone: 'warning' },
};

export const CLASSES: StorageClass[] = ['standard', 'nearline', 'coldline', 'archive'];

export const CLASS_META: Record<StorageClass, { label: string; color: string }> = {
  standard: { label: 'Standard', color: 'var(--success)' },
  nearline: { label: 'Nearline', color: 'var(--warning)' },
  coldline: { label: 'Coldline', color: 'var(--accent-2)' },
  archive: { label: 'Archive', color: 'var(--fg-faint)' },
};

export const STATUS_META: Record<BucketStatus, { label: string; tone: 'health-up' | 'ice' | 'danger' }> = {
  active: { label: 'Active', tone: 'health-up' },
  frozen: { label: 'Frozen', tone: 'ice' },
  dead: { label: 'Dead', tone: 'danger' },
};

export const BUCKETS: Bucket[] = [
  { id: 'kyc-documents',    name: 'kyc-documents',        provider: 'GCS', klass: 'standard', content: 'documents', objects: 18400000, sizeGb: 3200, lastAccess: '2m ago',   pii: true,  owner: 'Identity',      region: 'br-se-1', costMo: 1840, egressMo: 410,  trend: 4,   autoclass: true,  lifecycle: 'active',  status: 'active' },
  { id: 'doc-uploads',      name: 'doc-uploads-raw',      provider: 'GCS', klass: 'standard', content: 'images',    objects: 42000000, sizeGb: 6100, lastAccess: '1m ago',   pii: true,  owner: 'Identity',      region: 'br-se-1', costMo: 3510, egressMo: 1890, trend: 12,  autoclass: false, lifecycle: 'drift',   status: 'active' },
  { id: 'biometric-frames', name: 'biometric-frames',     provider: 'GCS', klass: 'standard', content: 'videos',    objects: 2400000,  sizeGb: 8800, lastAccess: '6m ago',   pii: true,  owner: 'Identity',      region: 'br-se-1', costMo: 5060, egressMo: 240,  trend: 6,   autoclass: true,  lifecycle: 'active',  status: 'active' },
  { id: 'bureau-exports',   name: 'bureau-exports',       provider: 'S3',  klass: 'nearline', content: 'files',     objects: 184000,   sizeGb: 2400, lastAccess: '3d ago',   pii: true,  owner: 'Data Platform', region: 'us-east-1',costMo: 920,  egressMo: 2340, trend: 31,  autoclass: false, lifecycle: 'active',  status: 'active' },
  { id: 'model-artifacts',  name: 'model-artifacts',      provider: 'GCS', klass: 'standard', content: 'files',     objects: 12400,    sizeGb: 1400, lastAccess: '1d ago',   pii: false, owner: 'Data Platform', region: 'br-se-1', costMo: 805,  egressMo: 120,  trend: 2,   autoclass: true,  lifecycle: 'active',  status: 'active' },
  { id: 'app-logs-cold',    name: 'app-logs-archive',     provider: 'GCS', klass: 'coldline', content: 'logs',      objects: 96000000, sizeGb: 14200,lastAccess: '94d ago',  pii: false, owner: 'Platform',      region: 'br-se-1', costMo: 980,  egressMo: 0,    trend: 1,   autoclass: true,  lifecycle: 'active',  status: 'frozen' },
  { id: 'audit-archive',    name: 'audit-archive',        provider: 'GCS', klass: 'archive',  content: 'documents', objects: 320000,   sizeGb: 5400, lastAccess: '210d ago', pii: true,  owner: 'Compliance',    region: 'br-se-1', costMo: 260,  egressMo: 0,    trend: 0,   autoclass: false, lifecycle: 'active',  status: 'frozen' },
  { id: 'db-backups',       name: 'db-backups',           provider: 'S3',  klass: 'coldline', content: 'backups',   objects: 8400,     sizeGb: 22800,lastAccess: '30d ago',  pii: true,  owner: 'Data Platform', region: 'us-east-1',costMo: 1520, egressMo: 85,   trend: 3,   autoclass: false, lifecycle: 'active',  status: 'frozen' },
  { id: 'legacy-konduto',   name: 'legacy-konduto-dump',  provider: 'S3',  klass: 'standard', content: 'files',     objects: 1200000,  sizeGb: 3100, lastAccess: '512d ago', pii: true,  owner: 'Anti-Fraud',    region: 'us-east-1',costMo: 1780, egressMo: 0,    trend: 0,   autoclass: false, lifecycle: 'missing', status: 'dead' },
  { id: 'old-marketing',    name: 'marketing-assets-2019',provider: 'GCS', klass: 'standard', content: 'videos',    objects: 64000,    sizeGb: 2600, lastAccess: '880d ago', pii: false, owner: 'Recovery',      region: 'br-se-1', costMo: 1495, egressMo: 0,    trend: 0,   autoclass: false, lifecycle: 'missing', status: 'dead' },
  { id: 'temp-ocr',         name: 'tmp-ocr-scratch',      provider: 'GCS', klass: 'standard', content: 'images',    objects: 9800000,  sizeGb: 900,  lastAccess: '430d ago', pii: true,  owner: 'Identity',      region: 'br-se-1', costMo: 518,  egressMo: 0,    trend: 0,   autoclass: false, lifecycle: 'missing', status: 'dead' },
];

/** Compact storage label. */
export const fmtSize = (gb: number): string => (gb >= 1000 ? (gb / 1000).toFixed(1).replace(/\.0$/, '') + ' TB' : gb + ' GB');
export const fmtObjects = (n: number): string => (n >= 1_000_000 ? (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));
export const fmtBrl = (n: number): string => 'R$ ' + (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n));

const totalGb = BUCKETS.reduce((m, b) => m + b.sizeGb, 0);
const deadBuckets = BUCKETS.filter((b) => b.status === 'dead');
const deadGb = deadBuckets.reduce((m, b) => m + b.sizeGb, 0);
const deadCost = deadBuckets.reduce((m, b) => m + b.costMo, 0);

/** Storage by class, for the breakdown bars. */
const maxClassGb = Math.max(...CLASSES.map((c) => BUCKETS.filter((b) => b.klass === c).reduce((m, b) => m + b.sizeGb, 0)));
export const CLASS_MIX = CLASSES.map((c) => ({
  klass: c,
  label: CLASS_META[c].label,
  color: CLASS_META[c].color,
  sizeGb: BUCKETS.filter((b) => b.klass === c).reduce((m, b) => m + b.sizeGb, 0),
  pct: (BUCKETS.filter((b) => b.klass === c).reduce((m, b) => m + b.sizeGb, 0) / maxClassGb) * 100,
}));

/** Stale + dead buckets, the savings list. */
export const STALE = [...BUCKETS]
  .filter((b) => b.status !== 'active')
  .sort((a, b) => b.costMo - a.costMo)
  .slice(0, 5);

export const KPIS = [
  { id: 'buckets', label: 'Storages', value: String(BUCKETS.length), note: '2 providers, 2 regions.' },
  { id: 'size', label: 'Total storage', value: fmtSize(totalGb), note: 'Objects across all classes.' },
  { id: 'egress', label: 'Egress / mo', value: fmtBrl(BUCKETS.reduce((m, b) => m + b.egressMo, 0)), note: 'bureau-exports is 46% of it.' },
  { id: 'dead', label: 'Dead storage', value: fmtSize(deadGb), note: `${fmtBrl(deadCost)}/mo to delete.` },
];

const totalEgress = BUCKETS.reduce((m, b) => m + b.egressMo, 0);

export const AI_READ = {
  title: 'Reclaimable storage and an egress outlier',
  body: `Three buckets are dead: legacy-konduto-dump, marketing-assets-2019 and tmp-ocr-scratch have not been read in over a year yet hold ${fmtSize(deadGb)} and cost ${fmtBrl(deadCost)} a month, all three without a lifecycle policy. Separately, bureau-exports egress hit ${fmtBrl(2340)}/mo (up 31% MoM), 2.5x its storage cost: a partner is pulling full files instead of the delta feed. Forge can stage lifecycle policies, a deletion review for the two PII buckets, and the bucket-lifecycle action for the egress fix.`,
};

/** FinOps slice for the KPI strip. */
export const EGRESS_TOTAL = totalEgress;
