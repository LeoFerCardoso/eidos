// Forge — auto-generated architecture graph + architectural-drift feed for the
// AI-Insights command center. The forge agent watches inter-service calls and
// re-derives this map from the last 30 days of traffic; drift edges/nodes are
// where the live topology diverged from the declared ADRs. Equifax/Boa Vista
// bureau services. Positions are HAND-LAID (deterministic → SSR-stable; no force
// sim) in a 1000×600 viewBox so the diagram reads cleanly.

export interface ArchNode {
  id: string;
  label: string;
  x: number;
  y: number;
  /** node sits on a drifted path → ember outline. */
  drift?: boolean;
}

export type EdgeKind = 'sync' | 'async' | 'drift';

export interface ArchEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  /** small tag rendered at the edge midpoint (e.g. "DRIFT"). */
  tag?: string;
}

export const ARCH_NODES: ArchNode[] = [
  { id: 'scpc-gateway', label: 'scpc-gateway', x: 180, y: 165 },
  { id: 'identity-proofing', label: 'identity-proofing', x: 185, y: 430 },
  { id: 'acerta-api', label: 'acerta-api', x: 470, y: 300, drift: true },
  { id: 'konduto-antifraud', label: 'konduto-antifraud', x: 760, y: 165, drift: true },
  { id: 'score-engine', label: 'score-engine', x: 745, y: 375 },
  { id: 'consent-service', label: 'consent-service', x: 905, y: 300 },
  { id: 'ignite-feature-store', label: 'ignite-feature-store', x: 520, y: 505 },
  { id: 'bureau-ingestion', label: 'bureau-ingestion', x: 290, y: 540 },
];

export const ARCH_EDGES: ArchEdge[] = [
  { from: 'scpc-gateway', to: 'acerta-api', kind: 'sync' },
  { from: 'identity-proofing', to: 'acerta-api', kind: 'async' },
  { from: 'acerta-api', to: 'konduto-antifraud', kind: 'drift', tag: 'DRIFT' },
  { from: 'acerta-api', to: 'score-engine', kind: 'sync' },
  { from: 'score-engine', to: 'consent-service', kind: 'sync' },
  { from: 'score-engine', to: 'ignite-feature-store', kind: 'async' },
  { from: 'bureau-ingestion', to: 'ignite-feature-store', kind: 'async' },
  { from: 'bureau-ingestion', to: 'scpc-gateway', kind: 'async' },
];

export interface DriftEvent {
  id: string;
  when: string;
  /** the ADR this drift violates, if any. */
  adr?: string;
  title: string;
  detail: string;
}

// Compact Mermaid flowchart of the same topology — rendered transparent in the
// Big-Insights "architecture" slide. Drift path (acerta → konduto) is ember.
export const ARCH_MERMAID = `flowchart TD
  bureau["bureau-ingestion"] --> scpc["scpc-gateway"]
  ident["identity-proofing"] --> acerta["acerta-api"]
  scpc --> acerta
  acerta -.->|drift| konduto["konduto-antifraud"]
  acerta --> score["score-engine"]
  score --> ignite["ignite-feature-store"]
  class acerta,konduto drift
  classDef drift stroke:#FF6B35,color:#FF6B35,stroke-width:1.6px;`;

export const ARCH_DRIFT: DriftEvent[] = [
  {
    id: 'dr1',
    when: '34m ago',
    adr: 'ADR-006',
    title: 'acerta-api introduced a sync call to konduto-antifraud',
    detail:
      'Violates ADR-006 (async-first inter-tribe communication). Fan-out latency adds ~80ms to p95 under load.',
  },
  {
    id: 'dr2',
    when: '2h ago',
    title: 'score-engine reads from ignite-feature-store without a circuit breaker',
    detail: 'No fallback path declared. Single point of failure for the scoring chain.',
  },
  {
    id: 'dr3',
    when: '1d ago',
    title: 'Cost spike · data-export egress +340% week-over-week',
    detail: 'Likely the new merchant nightly job. Owner notified.',
  },
];
