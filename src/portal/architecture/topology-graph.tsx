'use client';
// Forge · Architecture / Topology — live service dependency graph.
//
// Shows the 16-node connected subset of the services catalog arranged by tribe.
// Nodes navigate to /portal/catalog/[service] on click; selected node
// highlights its direct neighbours and shows a blast-radius side strip.
//
// Positions are hand-laid per tribe column (deterministic — no Math.random,
// no auto-layout, SSR-safe). Rendered client-side behind a `mounted` gate,
// following the workflow-graph.tsx pattern.

import * as React from 'react';
import Link from 'next/link';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
  useReactFlow,
  useStore,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Icons } from '@/ds/core';
import type { Tribe } from '@/portal/data/services';

// ── Subset of services rendered in the topology ───────────────────────────────
// Keeping 16 nodes that together form the meaningful connected graph. Services
// with zero deps AND zero dependents within the subset are excluded to avoid
// isolated hairball nodes. A caption in the parent explains the filter.

export interface TopoNode {
  id: string;
  label: string;
  tribe: Tribe;
  /** alert = degraded */
  alert?: boolean;
  pii?: boolean;
  /** x,y position in the React Flow canvas */
  x: number;
  y: number;
}

export interface TopoEdge {
  id: string;
  /** service id of the caller */
  from: string;
  /** service id of the callee */
  to: string;
}

// ── Hand-laid positions ───────────────────────────────────────────────────────
// Canvas is ~1200 wide × 680 tall. Tribe columns (left→right):
//   Platform (x≈60)  |  Data & Bureau (x≈280)  |  Score & Risk (x≈500)
//   Anti-Fraud (x≈720)  |  Identity (x≈940)
//   Decisioning (x≈620, lower band y≈400)  |  Recovery (x≈820, lower band)
//
// Each tribe group shares a column x; nodes are stacked vertically with 140px
// gaps to keep labels readable.

export const TOPO_NODES: TopoNode[] = [
  // ── Platform ────────────────────────────────────────────────────────
  { id: 'consent-service',      label: 'consent-service',      tribe: 'Platform',       pii: true,  x: 40,  y: 60  },
  { id: 'audit-trail',          label: 'audit-trail',          tribe: 'Platform',       pii: true,  x: 40,  y: 220 },

  // ── Data & Bureau ────────────────────────────────────────────────────
  { id: 'bureau-ingestion',     label: 'bureau-ingestion',     tribe: 'Data & Bureau',  pii: true,  x: 260, y: 60  },
  { id: 'scpc-gateway',         label: 'scpc-gateway',         tribe: 'Data & Bureau',  pii: true,  x: 260, y: 220 },

  // ── Score & Risk ─────────────────────────────────────────────────────
  { id: 'ignite-feature-store', label: 'ignite-feature-store', tribe: 'Score & Risk',               x: 480, y: 60  },
  { id: 'score-engine',         label: 'score-engine',         tribe: 'Score & Risk',   pii: true,  x: 480, y: 220 },
  { id: 'onescore-gateway',     label: 'onescore-gateway',     tribe: 'Score & Risk',   pii: true,  x: 480, y: 380 },
  { id: 'acerta-api',           label: 'acerta-api',           tribe: 'Score & Risk',   pii: true,  alert: true, x: 480, y: 540 },

  // ── Anti-Fraud ───────────────────────────────────────────────────────
  { id: 'konduto-antifraud',    label: 'konduto-antifraud',    tribe: 'Anti-Fraud',     pii: true,  alert: true, x: 700, y: 220 },
  { id: 'identity-proofing',    label: 'identity-proofing',    tribe: 'Identity',       pii: true,  x: 920, y: 220 },

  // ── Identity ─────────────────────────────────────────────────────────
  { id: 'watchlist-screener',   label: 'watchlist-screener',   tribe: 'Identity',       pii: true,  x: 920, y: 60  },
  { id: 'document-ocr',         label: 'document-ocr',         tribe: 'Identity',       pii: true,  x: 920, y: 380 },

  // ── Decisioning (lower band) ─────────────────────────────────────────
  { id: 'decision-engine',      label: 'decision-engine',      tribe: 'Decisioning',               x: 640, y: 460 },
  { id: 'offer-orchestrator',   label: 'offer-orchestrator',   tribe: 'Decisioning',   pii: true,  x: 640, y: 600 },

  // ── Recovery (lower band) ────────────────────────────────────────────
  { id: 'recovery-comms',       label: 'recovery-comms',       tribe: 'Recovery',       pii: true,  x: 860, y: 460 },
  { id: 'debt-restructure',     label: 'debt-restructure',     tribe: 'Recovery',       pii: true,  x: 860, y: 600 },
];

// Edges: A → B means "A calls B" (drawn as directed arrow from source to target)
export const TOPO_EDGES: TopoEdge[] = [
  // bureau-ingestion is the raw data root
  { id: 'e-bi-ig',  from: 'bureau-ingestion',    to: 'ignite-feature-store' },
  { id: 'e-bi-sc',  from: 'bureau-ingestion',    to: 'scpc-gateway'         },

  // score stack
  { id: 'e-ig-se',  from: 'ignite-feature-store', to: 'score-engine'        },
  { id: 'e-sg-se',  from: 'scpc-gateway',          to: 'score-engine'        },
  { id: 'e-se-og',  from: 'score-engine',          to: 'onescore-gateway'    },

  // acerta-api (the flagship query)
  { id: 'e-og-ac',  from: 'onescore-gateway',     to: 'acerta-api'          },
  { id: 'e-sg-ac',  from: 'scpc-gateway',          to: 'acerta-api'          },
  { id: 'e-cs-ac',  from: 'consent-service',       to: 'acerta-api'          },
  { id: 'e-kf-ac',  from: 'konduto-antifraud',     to: 'acerta-api'          },

  // konduto anti-fraud
  { id: 'e-ig-kf',  from: 'ignite-feature-store', to: 'konduto-antifraud'   },
  { id: 'e-ip-kf',  from: 'identity-proofing',    to: 'konduto-antifraud'   },

  // identity proofing
  { id: 'e-cs-ip',  from: 'consent-service',       to: 'identity-proofing'  },
  { id: 'e-sg-ip',  from: 'scpc-gateway',           to: 'identity-proofing'  },

  // watchlist screener
  { id: 'e-cs-ws',  from: 'consent-service',       to: 'watchlist-screener' },

  // document OCR
  { id: 'e-ip-doc', from: 'identity-proofing',     to: 'document-ocr'       },

  // audit trail
  { id: 'e-cs-at',  from: 'consent-service',       to: 'audit-trail'        },

  // decisioning
  { id: 'e-se-de',  from: 'score-engine',          to: 'decision-engine'    },
  { id: 'e-kf-de',  from: 'konduto-antifraud',     to: 'decision-engine'    },
  { id: 'e-de-oo',  from: 'decision-engine',       to: 'offer-orchestrator' },

  // recovery
  { id: 'e-sg-rc',  from: 'scpc-gateway',           to: 'recovery-comms'    },
  { id: 'e-rc-dt',  from: 'recovery-comms',         to: 'debt-restructure'  },
  { id: 'e-de-dt',  from: 'decision-engine',        to: 'debt-restructure'  },
];

// ── Tribe colour tokens (CSS custom properties) ──────────────────────────────
// These are the --topo-tribe var values for each tribe. We map to design token
// pairs (border accent, soft background) using the Eidos semantic palette.
const TRIBE_TOKEN: Record<Tribe, string> = {
  'Platform':       'var(--accent-2)',
  'Data & Bureau':  'var(--fg-muted)',
  'Score & Risk':   'var(--ember)',
  'Anti-Fraud':     'var(--warning)',
  'Identity':       'var(--accent-3, var(--accent-2))',
  'Decisioning':    'var(--accent-4, var(--fg))',
  'Recovery':       'var(--fg-faint)',
};

// ── Blast-radius helpers ──────────────────────────────────────────────────────
function computeBlastLevel(dependentCount: number, pii: boolean): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const score = dependentCount + (pii ? 2 : 0);
  if (score >= 7) return 'CRITICAL';
  if (score >= 4) return 'HIGH';
  if (score >= 2) return 'MEDIUM';
  return 'LOW';
}

const BLAST_TOKEN: Record<string, string> = {
  LOW:      'var(--fg-muted)',
  MEDIUM:   'var(--warning)',
  HIGH:     'var(--warning)',
  CRITICAL: 'var(--error, var(--warning))',
};

// Pre-compute inbound (dependents) map
function buildInboundMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const e of TOPO_EDGES) {
    if (!map[e.to]) map[e.to] = [];
    map[e.to].push(e.from);
  }
  return map;
}

const INBOUND_MAP = buildInboundMap();

// ── Custom node ───────────────────────────────────────────────────────────────
interface TopoNodeData {
  label: string;
  tribe: Tribe;
  alert?: boolean;
  pii?: boolean;
  selected?: boolean;
  dimmed?: boolean;
}

function TopoNodeView({ data, id }: NodeProps) {
  const d = data as unknown as TopoNodeData;
  const tribeColor = TRIBE_TOKEN[d.tribe];
  const isSelected = d.selected;
  const isDimmed = d.dimmed;

  return (
    <div
      className={[
        'fp-topo-node',
        d.alert ? 'is-alert' : '',
        isSelected ? 'is-selected' : '',
        isDimmed ? 'is-dimmed' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--topo': tribeColor } as React.CSSProperties}
      aria-label={`${d.label}${d.pii ? ', PII' : ''}${d.alert ? ', degraded' : ''}`}
    >
      <Handle type="target" position={Position.Left}  className="fp-topo-handle" />
      <Handle type="source" position={Position.Right} className="fp-topo-handle" />
      <Handle type="target" position={Position.Top}   className="fp-topo-handle" />
      <Handle type="source" position={Position.Bottom} className="fp-topo-handle" />

      <span className="fp-topo-rail" aria-hidden="true" />

      <span className="fp-topo-body">
        <span className="fp-topo-name">{d.label}</span>
        <span className="fp-topo-tribe">{d.tribe}</span>
      </span>

      <span className="fp-topo-badges" aria-hidden="true">
        {d.pii && <span className="fp-pii">PII</span>}
        {d.alert && (
          <span className="fp-topo-pulse" title="Degraded">
            <Icons.alert size={10} />
          </span>
        )}
      </span>
    </div>
  );
}

const nodeTypes = { topo: TopoNodeView };

// ── Edge style ────────────────────────────────────────────────────────────────
function makeEdge(e: TopoEdge, highlighted: boolean, dimmed: boolean): Edge {
  const color = dimmed
    ? 'var(--border)'
    : highlighted
      ? 'var(--ember)'
      : 'var(--border-strong)';
  const width = highlighted ? 2 : 1.5;
  return {
    id: e.id,
    source: e.from,
    target: e.to,
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color,
      width: highlighted ? 18 : 14,
      height: highlighted ? 18 : 14,
    },
    style: {
      stroke: color,
      strokeWidth: width,
      opacity: dimmed ? 0.25 : 1,
      transition: 'stroke 0.15s, opacity 0.15s',
    },
  };
}

// ── Info strip ────────────────────────────────────────────────────────────────
interface InfoStripProps {
  nodeId: string;
  onClose: () => void;
}

function InfoStrip({ nodeId, onClose }: InfoStripProps) {
  const node = TOPO_NODES.find((n) => n.id === nodeId);
  if (!node) return null;

  const dependents = INBOUND_MAP[nodeId] ?? [];
  const blastLevel = computeBlastLevel(dependents.length, node.pii ?? false);

  const outbound = TOPO_EDGES.filter((e) => e.from === nodeId).map((e) => e.to);

  return (
    <div className="fp-topo-strip" role="region" aria-label={`${node.label} details`}>
      <div className="fp-topo-strip-head">
        <span className="fp-topo-strip-name">{node.label}</span>
        <button
          className="fp-topo-strip-close"
          onClick={onClose}
          aria-label="Dismiss info strip"
          type="button"
        >
          <Icons.x size={14} />
        </button>
      </div>

      <div className="fp-topo-strip-row">
        <span className="fp-topo-strip-label">Tribe</span>
        <span className="fp-topo-strip-val">{node.tribe}</span>
      </div>

      <div className="fp-topo-strip-row">
        <span className="fp-topo-strip-label">Dependents</span>
        <span className="fp-topo-strip-val mono">{dependents.length}</span>
      </div>

      <div className="fp-topo-strip-row">
        <span className="fp-topo-strip-label">Calls</span>
        <span className="fp-topo-strip-val mono">{outbound.length}</span>
      </div>

      <div className="fp-topo-strip-row">
        <span className="fp-topo-strip-label">Blast radius</span>
        <span
          className="fp-topo-strip-blast mono"
          style={{ color: BLAST_TOKEN[blastLevel] }}
        >
          {blastLevel}
        </span>
      </div>

      {node.pii && (
        <div className="fp-topo-strip-row">
          <span className="fp-topo-strip-label">Data class</span>
          <span className="fp-pii" style={{ marginInlineStart: 0 }}>PII</span>
        </div>
      )}

      {node.alert && (
        <div className="fp-topo-strip-alert">
          <Icons.alert size={12} />
          Service degraded
        </div>
      )}

      <Link
        href={`/portal/catalog/${nodeId}`}
        className="fp-topo-strip-link"
        aria-label={`Open ${node.label} in catalog`}
      >
        View in catalog
        <Icons.arrowRight size={11} />
      </Link>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
/* The tab panel measures 0x0 on the frame the graph mounts (hidden-tab →
   visible transition), so the initial fitView collapses the viewport into a
   corner. Re-fit whenever the canvas gains real dimensions: the store width/
   height are the measured values, so this fires exactly once per resize. */
function AutoFit() {
  const { fitView } = useReactFlow();
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);
  React.useEffect(() => {
    if (width > 0 && height > 0) fitView({ padding: 0.12 });
  }, [width, height, fitView]);
  return null;
}

export default function TopologyGraph() {
  const [mounted, setMounted] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => { setMounted(true); }, []);

  // Compute neighbour sets for the selected node
  const { neighbourSet, dimSet } = React.useMemo(() => {
    if (!selectedId) return { neighbourSet: new Set<string>(), dimSet: new Set<string>() };

    const direct = new Set<string>([selectedId]);
    // outbound (calls)
    for (const e of TOPO_EDGES) {
      if (e.from === selectedId) direct.add(e.to);
    }
    // inbound (dependents)
    for (const e of TOPO_EDGES) {
      if (e.to === selectedId) direct.add(e.from);
    }

    const dim = new Set(TOPO_NODES.map((n) => n.id).filter((id) => !direct.has(id)));
    return { neighbourSet: direct, dimSet: dim };
  }, [selectedId]);

  const nodes: Node[] = React.useMemo(
    () =>
      TOPO_NODES.map((n) => ({
        id: n.id,
        type: 'topo',
        position: { x: n.x, y: n.y },
        draggable: false,
        connectable: false,
        data: {
          label:    n.label,
          tribe:    n.tribe,
          alert:    n.alert,
          pii:      n.pii,
          selected: n.id === selectedId,
          dimmed:   dimSet.has(n.id),
        } as unknown as Record<string, unknown>,
      })),
    [selectedId, dimSet],
  );

  const edges: Edge[] = React.useMemo(
    () =>
      TOPO_EDGES.map((e) => {
        const isHighlighted =
          selectedId != null &&
          (e.from === selectedId || e.to === selectedId);
        const isDimmed =
          selectedId != null && !isHighlighted &&
          (dimSet.has(e.from) || dimSet.has(e.to));
        return makeEdge(e, isHighlighted, isDimmed);
      }),
    [selectedId, dimSet],
  );

  if (!mounted) {
    return (
      <div className="fp-topo-canvas fp-topo-placeholder" aria-busy="true">
        <span className="fp-topo-loading">Loading topology...</span>
      </div>
    );
  }

  return (
    <div className="fp-topo-wrap">
      <div className="fp-topo-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          minZoom={0.55}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_e, node) => {
            setSelectedId((prev) => (prev === node.id ? null : node.id));
          }}
          onPaneClick={() => setSelectedId(null)}
        >
          <Background gap={20} size={1} color="var(--border)" />
          <Controls showInteractive={false} />
          <AutoFit />
        </ReactFlow>

        {selectedId && (
          <InfoStrip
            nodeId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      {/* Legend */}
      <div className="fp-topo-legend" role="list" aria-label="Graph legend">
        <span className="fp-topo-leg" role="listitem">
          <span className="fp-topo-leg-swatch" style={{ background: 'var(--fg-faint)' }} />
          Healthy
        </span>
        <span className="fp-topo-leg" role="listitem">
          <span className="fp-topo-leg-swatch fp-topo-leg-alert" />
          Degraded
        </span>
        <span className="fp-topo-leg" role="listitem">
          <span className="fp-pii" style={{ marginInlineStart: 0, fontSize: 9 }}>PII</span>
          LGPD in scope
        </span>
        <span className="fp-topo-leg" role="listitem">
          <span className="fp-topo-leg-arrow" aria-hidden="true">A &rarr; B</span>
          A calls B
        </span>
        <span className="fp-topo-leg fp-topo-leg-ember" role="listitem">
          <span className="fp-topo-leg-swatch" style={{ background: 'var(--ember)' }} />
          Selected + neighbours
        </span>
      </div>

      <p className="fp-topo-caption">
        Showing {TOPO_NODES.length} services with at least one dependency edge.
        Click a node to see its blast-radius profile and highlight direct connections; click again or press the canvas to deselect.
        Nodes navigate to the service catalog on click-through (use the info strip link).
      </p>
    </div>
  );
}
