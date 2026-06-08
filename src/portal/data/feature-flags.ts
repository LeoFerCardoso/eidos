// Forge (IDP Portal) — Feature flags (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/feature-flags — the flag console. Flags activate through the
// ring deployment (Ring 1 Team -> Ring 5 GA), so a flag tagged `ring` inherits
// its traffic targeting from the active ring rollout and links into it. Mock but
// consistent; every value is static (no Date.now / Math.random) so SSR matches.

export type FlagType = 'boolean' | 'percent' | 'multivariate';
export type FlagState = 'on' | 'off' | 'rolling' | 'multivariate';
export type FlagEnv = 'production' | 'staging';

export interface Flag {
  id: string;
  key: string;
  desc: string;
  type: FlagType;
  state: FlagState;
  /** 8-point rollout sparkline; last value is the current % exposure. */
  rollout: number[];
  env: FlagEnv;
  modified: string;
  author: string;
  /** true when the flag is driven by the active ring deployment. */
  ring?: boolean;
  variants?: string[];
}

export const FLAGS: Flag[] = [
  { id: 'f-step-up',    key: 'identity.biometric_step_up',   desc: 'Biometric step-up for high-risk auth (>520 risk score).',     type: 'boolean',      state: 'on',           rollout: [0, 12, 18, 35, 42, 56, 80, 100], env: 'production', modified: '8m ago',  author: 'Camila Tanaka' },
  { id: 'f-pix-idem',   key: 'pix.idempotency_keys',         desc: 'Idempotent retries for the PIX router.',                       type: 'percent',      state: 'rolling',      rollout: [0, 0, 5, 12, 22, 35, 55, 72],   env: 'production', modified: '14m ago', author: 'Rafael Mendonça', ring: true },
  { id: 'f-fraud-v9',   key: 'fraud.experimental_model_v9',  desc: 'Trial of the v9 fraud model in shadow mode.',                  type: 'multivariate', state: 'multivariate', rollout: [0, 0, 0, 4, 10, 18, 22, 28],    env: 'production', modified: '46m ago', author: 'Beatriz Okamoto', variants: ['v8', 'v9-shadow', 'v9-active'] },
  { id: 'f-breaker',    key: 'bureau.circuit_breaker',       desc: 'Fail-open circuit breaker on the bureau provider.',            type: 'boolean',      state: 'on',           rollout: [60, 80, 90, 100, 100, 100, 100, 100], env: 'production', modified: '2h ago', author: 'Thiago Albuquerque' },
  { id: 'f-consent-v2', key: 'open_finance.consent_v2',      desc: 'New consent-revocation webhook receiver.',                     type: 'percent',      state: 'rolling',      rollout: [0, 0, 0, 0, 8, 15, 24, 35],     env: 'staging',    modified: '3h ago',  author: 'Diego Vasquez', ring: true },
  { id: 'f-kyc-par',    key: 'onboarding.kyc_parallel',      desc: 'Parallel document-validation pipeline.',                       type: 'percent',      state: 'rolling',      rollout: [0, 0, 0, 6, 12, 18, 24, 30],    env: 'production', modified: '4h ago',  author: 'Mariana Castelli' },
  { id: 'f-dark',       key: 'identity.dark_mode_default',   desc: 'Dark theme by default for new accounts.',                      type: 'boolean',      state: 'off',          rollout: [0, 0, 0, 0, 0, 0, 0, 0],        env: 'production', modified: '10h ago', author: 'Leonardo Mariga' },
  { id: 'f-ledger',     key: 'ledger.btree_batching',        desc: 'BTREE-batched inserts for settlement.',                        type: 'boolean',      state: 'on',           rollout: [10, 30, 50, 70, 85, 95, 100, 100], env: 'production', modified: '1d ago',  author: 'Rafael Mendonça' },
  { id: 'f-replay',     key: 'fraud.scoring_replay',         desc: 'Replay scoring decisions from the event bus.',                 type: 'percent',      state: 'rolling',      rollout: [0, 4, 8, 12, 18, 24, 30, 38],   env: 'production', modified: '2d ago',  author: 'Beatriz Okamoto' },
  { id: 'f-cost',       key: 'telemetry.cost_alerts_v2',     desc: 'Cost alerting on egress + storage spikes.',                    type: 'multivariate', state: 'multivariate', rollout: [0, 0, 12, 28, 42, 58, 72, 88],  env: 'production', modified: '3d ago',  author: 'Larissa Fontana', variants: ['off', 'soft', 'hard'] },
];

export const STATE_META: Record<FlagState, { tone: 'health-up' | 'neutral' | 'status-running' | 'ember'; label: string; live?: boolean }> = {
  on:           { tone: 'health-up',     label: 'On' },
  off:          { tone: 'neutral',       label: 'Off' },
  rolling:      { tone: 'status-running', label: 'Rolling out', live: true },
  multivariate: { tone: 'ember',         label: 'Multivariate' },
};

export const TYPE_LABEL: Record<FlagType, string> = {
  boolean: 'Boolean',
  percent: 'Percent rollout',
  multivariate: 'Multivariate',
};

const pct = (f: Flag) => f.rollout[f.rollout.length - 1] ?? 0;
const rolling = FLAGS.filter((f) => f.state === 'rolling').length;

export const KPIS = [
  { id: 'active',  label: 'Active flags',  value: '142',          note: `${FLAGS.filter((f) => f.state !== 'off').length} shown here, 38 archived` },
  { id: 'rollout', label: 'In rollout',    value: String(rolling), note: 'Rolling out right now', accent: true },
  { id: 'ring',    label: 'Ring-driven',   value: String(FLAGS.filter((f) => f.ring).length), note: 'Targeting inherited from the ring deployment' },
  { id: 'owners',  label: 'Owners',        value: '18',           note: 'Teams owning at least one flag' },
];

export const flagPct = pct;
