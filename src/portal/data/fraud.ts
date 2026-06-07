// Forge (IDP Portal) — Fraud & Risk data (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/fraud — the anti-fraud and risk control room. Konduto rule
// performance (catch rate vs false-positive cost), the decision mix, blocked
// attempts over the day, and the live risk signals. Mock but consistent;
// currency is BRL (R$).

export interface FraudKpi {
  id: string;
  label: string;
  value: string;
  series: number[];
  delta: number;
  unit: '%' | 'pp';
  inverted?: boolean;
  color?: string;
  note: string;
}

export const KPIS: FraudKpi[] = [
  { id: 'blocked', label: 'Fraud blocked · 24h', value: 'R$ 4.8M', series: [3.1, 3.6, 3.9, 4.2, 4.1, 4.5, 4.8], delta: 12, unit: '%', note: 'Value of attempts stopped today.' },
  { id: 'catch', label: 'Catch rate', value: '96.4%', series: [94.1, 94.6, 95.0, 95.4, 95.9, 96.1, 96.4], delta: 2, unit: 'pp', color: 'var(--success)', note: 'Confirmed fraud caught before settlement.' },
  { id: 'fpr', label: 'False-positive rate', value: '2.1%', series: [3.4, 3.1, 2.9, 2.7, 2.4, 2.2, 2.1], delta: -1, unit: 'pp', inverted: true, color: 'var(--warning)', note: 'Good customers wrongly stepped up or denied.' },
  { id: 'chargeback', label: 'Chargeback rate', value: '0.18%', series: [0.31, 0.28, 0.26, 0.23, 0.21, 0.19, 0.18], delta: -8, unit: '%', inverted: true, color: 'var(--accent-2)', note: 'Of settled volume, trailing 30 days.' },
];

/** Blocked fraud attempts per hour (trailing 12h). */
export interface HourPoint { h: string; n: number; peak?: boolean }
export const BLOCKED_PER_HOUR: HourPoint[] = [
  { h: '08', n: 42 },
  { h: '09', n: 58 },
  { h: '10', n: 71 },
  { h: '11', n: 64 },
  { h: '12', n: 49 },
  { h: '13', n: 53 },
  { h: '14', n: 88, peak: true },
  { h: '15', n: 76 },
  { h: '16', n: 69 },
  { h: '17', n: 81 },
  { h: '18', n: 95, peak: true },
  { h: '19', n: 72 },
];

/** Decision mix over the window. */
export interface DecisionSeg { label: string; pct: number; color: string }
export const DECISION_MIX: DecisionSeg[] = [
  { label: 'Approved', pct: 91.2, color: 'var(--success)' },
  { label: 'Step-up', pct: 6.7, color: 'var(--warning)' },
  { label: 'Denied', pct: 2.1, color: 'var(--danger)' },
];

export type RuleStatus = 'active' | 'shadow' | 'tuning';

export interface FraudRule {
  id: string;
  name: string;
  category: string;
  firesPerDay: number;
  catchRate: number;
  fpr: number;
  brlSaved: string;
  status: RuleStatus;
  trend: number;
}

export const RULES: FraudRule[] = [
  { id: 'velocity',  name: 'Velocity burst',        category: 'Velocity',  firesPerDay: 1842, catchRate: 97, fpr: 1.4, brlSaved: 'R$ 1.9M', status: 'active', trend: 4 },
  { id: 'device',    name: 'Device reputation',     category: 'Device',    firesPerDay: 1204, catchRate: 95, fpr: 2.0, brlSaved: 'R$ 1.1M', status: 'active', trend: 2 },
  { id: 'ato',       name: 'Account takeover',      category: 'ATO',       firesPerDay: 612,  catchRate: 98, fpr: 1.1, brlSaved: 'R$ 880k', status: 'active', trend: 9 },
  { id: 'geo',       name: 'Geo mismatch',          category: 'Geo',       firesPerDay: 938,  catchRate: 88, fpr: 5.8, brlSaved: 'R$ 420k', status: 'tuning', trend: -6 },
  { id: 'bin',       name: 'Card BIN attack',       category: 'Card',      firesPerDay: 274,  catchRate: 99, fpr: 0.6, brlSaved: 'R$ 510k', status: 'active', trend: 3 },
  { id: 'synthetic', name: 'Synthetic identity',    category: 'Identity',  firesPerDay: 156,  catchRate: 93, fpr: 3.2, brlSaved: 'R$ 360k', status: 'shadow', trend: 0 },
  { id: 'cpf-share', name: 'CPF sharing ring',      category: 'Identity',  firesPerDay: 88,   catchRate: 91, fpr: 2.7, brlSaved: 'R$ 240k', status: 'shadow', trend: 5 },
];

export const RULE_STATUS_META: Record<RuleStatus, { label: string; tone: 'health-up' | 'warning' | 'ice' }> = {
  active: { label: 'Active', tone: 'health-up' },
  tuning: { label: 'Tuning', tone: 'warning' },
  shadow: { label: 'Shadow', tone: 'ice' },
};

/** Live risk signals — short watch list. */
export interface RiskSignal { label: string; detail: string; tone: 'danger' | 'warning' | 'neutral'; value: string }
export const RISK_SIGNALS: RiskSignal[] = [
  { label: 'Score drift · OneScore PJ', detail: 'Reason-code mix shifted 6% vs baseline', tone: 'warning', value: '6%' },
  { label: 'Velocity spike · br-se-1', detail: 'Burst attempts up 3x in the 18:00 window', tone: 'danger', value: '3x' },
  { label: 'New device cluster', detail: '212 signups from one device fingerprint', tone: 'warning', value: '212' },
  { label: 'Watchlist hit rate', detail: 'Stable against the sanction feed', tone: 'neutral', value: '0.04%' },
];

/** Forge AI read — the rule to tune (cost of false positives). */
export const AI_READ = {
  title: 'The rule costing the most good customers',
  body: 'Geo mismatch fires 938x a day at a 5.8% false-positive rate, three times the portfolio average, and it only saves R$ 420k. Most false positives are travelers on roaming IPs. Narrowing it to high-value sessions and pairing it with Device reputation would cut false positives by an estimated 40% with no measurable drop in catch rate.',
};
