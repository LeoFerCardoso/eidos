// Forge (IDP Portal) — DORA data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; this product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/dora — the Engineering pulse. The four DORA metrics, their
// 7-day trend, the deploy cadence, the lead-time distribution, and the
// per-product breakdown that ranks who is Elite and who drags the band down.
// Domain services come from the bureau catalog (services.ts); people from the
// shared PEOPLE pool. Mock but plausible and internally consistent.

export type DoraBand = 'Elite' | 'High' | 'Medium' | 'Low';

/** Maps a band to the HealthBadge state it paints with. */
export const BAND_STATE: Record<DoraBand, 'up' | 'degraded' | 'down' | 'unknown'> = {
  Elite: 'up',
  High: 'up',
  Medium: 'degraded',
  Low: 'down',
};

export interface DoraKpi {
  id: string;
  label: string;
  value: string;
  /** 7 daily samples for the sparkline. */
  series: number[];
  /** percent / point delta vs the prior window. */
  delta: number;
  unit: '%' | 'pp';
  /** when true, a negative delta is the good direction (lead time, CFR, MTTR). */
  inverted?: boolean;
  band: DoraBand;
  /** sparkline accent. */
  color?: string;
  /** one-line read on the number. */
  note: string;
}

export const KPIS: DoraKpi[] = [
  {
    id: 'deploys',
    label: 'Deploys / week',
    value: '142',
    series: [98, 104, 112, 121, 118, 133, 142],
    delta: 24,
    unit: '%',
    band: 'Elite',
    note: 'On-demand cadence across 30 services.',
  },
  {
    id: 'lead',
    label: 'Lead time for changes',
    value: '1.9h',
    series: [4.1, 3.6, 3.2, 2.9, 2.5, 2.2, 1.9],
    delta: -31,
    unit: '%',
    inverted: true,
    band: 'Elite',
    color: 'var(--success)',
    note: 'PR open to production, median.',
  },
  {
    id: 'cfr',
    label: 'Change-fail rate',
    value: '6%',
    series: [11, 9, 10, 8, 7, 6, 6],
    delta: -5,
    unit: 'pp',
    inverted: true,
    band: 'High',
    color: 'var(--warning)',
    note: 'Share of deploys that needed a rollback or hotfix.',
  },
  {
    id: 'mttr',
    label: 'Time to restore',
    value: '24m',
    series: [52, 47, 41, 36, 33, 28, 24],
    delta: -54,
    unit: '%',
    inverted: true,
    band: 'Elite',
    color: 'var(--accent-2)',
    note: 'Median time from alert to recovery.',
  },
];

/** Deploys per day — trailing 12 days. Weekends paint muted. */
export interface DeployDay {
  day: string;
  n: number;
  weekend?: boolean;
}

export const DEPLOYS_PER_DAY: DeployDay[] = [
  { day: 'Mon', n: 18 },
  { day: 'Tue', n: 22 },
  { day: 'Wed', n: 19 },
  { day: 'Thu', n: 24 },
  { day: 'Fri', n: 27 },
  { day: 'Sat', n: 5, weekend: true },
  { day: 'Sun', n: 3, weekend: true },
  { day: 'Mon', n: 21 },
  { day: 'Tue', n: 28 },
  { day: 'Wed', n: 23 },
  { day: 'Thu', n: 26 },
  { day: 'Fri', n: 31 },
];

/** Lead-time distribution (PR open to production). */
export const LEAD_PCT: { p: string; value: string }[] = [
  { p: 'P50', value: '1.9h' },
  { p: 'P95', value: '3.2h' },
  { p: 'P99', value: '7.4h' },
];

/** Per-product DORA breakdown — the matrix that ranks the estate. */
export interface ProductDora {
  product: string;
  services: number;
  deploys: number;
  lead: string;
  cfr: string;
  mttr: string;
  band: DoraBand;
  trend: number;
}

export const DORA_BY_PRODUCT: ProductDora[] = [
  { product: 'Score & Risk',  services: 5, deploys: 38, lead: '1.4h', cfr: '4%',  mttr: '18m', band: 'Elite',  trend: 12 },
  { product: 'Anti-Fraud',    services: 6, deploys: 41, lead: '2.1h', cfr: '7%',  mttr: '22m', band: 'High',   trend: 6  },
  { product: 'Identity',      services: 5, deploys: 24, lead: '2.8h', cfr: '6%',  mttr: '26m', band: 'High',   trend: 9  },
  { product: 'Data & Bureau', services: 5, deploys: 17, lead: '5.6h', cfr: '13%', mttr: '1.2h',band: 'Medium', trend: -4 },
  { product: 'Decisioning',   services: 4, deploys: 12, lead: '4.2h', cfr: '9%',  mttr: '41m', band: 'Medium', trend: 3  },
  { product: 'Platform',      services: 3, deploys: 22, lead: '1.1h', cfr: '3%',  mttr: '14m', band: 'Elite',  trend: 15 },
  { product: 'Recovery',      services: 3, deploys: 9,  lead: '7.8h', cfr: '16%', mttr: '2.4h',band: 'Low',    trend: -8 },
];

/** Recent deploys feed. */
export type DeployStatus = 'success' | 'in-flight' | 'rolled-back';

export interface RecentDeploy {
  id: string;
  service: string;
  version: string;
  stage: string;
  author: string;
  status: DeployStatus;
  started: string;
}

export const RECENT_DEPLOYS: RecentDeploy[] = [
  { id: 'D-9182', service: 'acerta-api',        version: 'v4.12.1', stage: 'Ring 4', author: 'Rafael Mendonça',     status: 'success',     started: '8m ago'  },
  { id: 'D-9181', service: 'konduto-antifraud', version: 'v3.1.8',  stage: 'Ring 2', author: 'Beatriz Okamoto',     status: 'in-flight',   started: '23m ago' },
  { id: 'D-9180', service: 'score-engine',      version: 'v7.4.0',  stage: 'Ring 4', author: 'Thiago Albuquerque',  status: 'success',     started: '51m ago' },
  { id: 'D-9179', service: 'bureau-ingestion',  version: 'v2.9.3',  stage: 'Ring 0', author: 'Diego Vasquez',       status: 'rolled-back', started: '1h ago'  },
  { id: 'D-9178', service: 'scpc-gateway',      version: 'v5.2.0',  stage: 'Ring 4', author: 'Camila Tanaka',       status: 'success',     started: '2h ago'  },
  { id: 'D-9177', service: 'identity-proofing', version: 'v3.7.2',  stage: 'Ring 3', author: 'Mariana Castelli',    status: 'in-flight',   started: '2h ago'  },
  { id: 'D-9176', service: 'decision-engine',   version: 'v6.0.4',  stage: 'Ring 4', author: 'Larissa Fontana',     status: 'success',     started: '3h ago'  },
];

export const STATUS_META: Record<DeployStatus, { label: string; dot: 'done' | 'running' | 'error' }> = {
  success: { label: 'Success', dot: 'done' },
  'in-flight': { label: 'In-flight', dot: 'running' },
  'rolled-back': { label: 'Rolled back', dot: 'error' },
};

/** Forge AI read — the one lever, woven in (not a chat box). */
export const AI_READ = {
  title: 'The lever this week',
  body: 'Recovery is the only product below the High band: change-fail rate 16% and time-to-restore 2.4h drag the org average. The root cause is debt-restructure shipping without canary gates. Adding ring-based rollout there would lift the org to Elite on all four metrics.',
};
