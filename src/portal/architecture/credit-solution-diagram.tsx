'use client';
// Forge · Architecture / Solution diagram — "Credit consultation, end to end".
//
// A C4-style container diagram for the flagship credit consultation request: a
// lender app asks for a score+decision and gets one back, traversing the edge
// gateway, the OneScore orchestrator, the consent gate, the score + antifraud
// services, the feature store fed by the bureau pipelines, and the audit trail.
//
// Positions are hand-laid (deterministic — no Math.random, no auto-layout,
// SSR-safe), mounted client-side behind a `mounted` gate, following the
// topology-graph.tsx / workflow-graph.tsx pattern. The single ember accent is
// reserved for the orchestrator (the one container this estate owns end to end).

import * as React from 'react';
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

// ── Container kinds ───────────────────────────────────────────────────────────
// Each kind maps to a rail colour + eyebrow label + icon. Colour is carried via
// a --node CSS custom property the stylesheet reads; ember is used once (the
// orchestrator) to honour the "at most 2× per screen" invariant.

type Kind = 'actor' | 'gateway' | 'orchestrator' | 'service' | 'datastore' | 'source' | 'governance';

const KIND_META: Record<Kind, { label: string; color: string; icon: string }> = {
  actor:        { label: 'External actor', color: 'var(--accent-2)',      icon: 'user' },
  gateway:      { label: 'Edge gateway',   color: 'var(--fg-muted)',      icon: 'globe' },
  orchestrator: { label: 'Orchestrator',   color: 'var(--ember)',         icon: 'workflow' },
  service:      { label: 'Service',        color: 'var(--border-strong)', icon: 'cpu' },
  datastore:    { label: 'Feature store',  color: 'var(--fg-muted)',      icon: 'database' },
  source:       { label: 'Data source',    color: 'var(--fg-faint)',      icon: 'server' },
  governance:   { label: 'Governance',     color: 'var(--warning)',       icon: 'shield' },
};

interface DiagramNode {
  id: string;
  kind: Kind;
  name: string;
  tech: string;
  icon?: string;
  pii?: boolean;
  x: number;
  y: number;
}

// ── Hand-laid containers ──────────────────────────────────────────────────────
// Columns left→right: actor (40) · edge (300) · orchestrator (560) ·
// services (820) · decision/feature store (1080) · bureau sources (1340).
// Governance (consent / audit) sit above + below the orchestrator spine.

const NODES: DiagramNode[] = [
  { id: 'lender',   kind: 'actor',        name: 'Lender portal',      tech: 'Partner web app',          x: 40,   y: 250 },
  { id: 'api',      kind: 'gateway',      name: 'API Gateway',        tech: 'REST · mTLS · rate-limit',  x: 300,  y: 250 },
  { id: 'onescore', kind: 'orchestrator', name: 'OneScore Gateway',   tech: 'Request orchestration',     x: 560,  y: 250 },
  { id: 'consent',  kind: 'governance',   name: 'Consent Service',    tech: 'LGPD consent scopes',       x: 560,  y: 60,  pii: true },
  { id: 'audit',    kind: 'governance',   name: 'Audit Trail',        tech: 'Append-only event log',     x: 560,  y: 450, pii: true, icon: 'activity' },
  { id: 'score',    kind: 'service',      name: 'Score Engine',       tech: 'OneScore PF model',         x: 820,  y: 150, icon: 'gauge' },
  { id: 'konduto',  kind: 'service',      name: 'Konduto Antifraud',  tech: 'Fraud risk signal',         x: 820,  y: 350, icon: 'target' },
  { id: 'ignite',   kind: 'datastore',    name: 'Ignite Feature Store', tech: 'Online + offline features', x: 1080, y: 60 },
  { id: 'decision', kind: 'service',      name: 'Decision Engine',    tech: 'Policy + cutoff rules',     x: 1080, y: 300, icon: 'cpu' },
  { id: 'bureau',   kind: 'source',       name: 'Bureau Ingestion',   tech: 'Nightly SCR / Cadastro',    x: 1340, y: 20,  pii: true },
  { id: 'scpc',     kind: 'source',       name: 'SCPC Gateway',       tech: 'Positive-data feed',        x: 1340, y: 150, pii: true },
];

// ── Edges ─────────────────────────────────────────────────────────────────────
// `step` numbers the request path; `flow:false` edges are background feeds /
// governance writes (dashed). `gov` edges use the warning tone.

interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  sh: string; // source handle id
  th: string; // target handle id
  label: string;
  tone?: 'spine' | 'gov' | 'feed' | 'return';
}

const EDGES: DiagramEdge[] = [
  { id: 'e1', from: 'lender',   to: 'api',      sh: 'r', th: 'l',  label: '1 · POST /v1/consultations', tone: 'spine' },
  { id: 'e2', from: 'api',      to: 'onescore', sh: 'r', th: 'l',  label: '2 · orchestrate (gRPC)',     tone: 'spine' },
  { id: 'e3', from: 'onescore', to: 'consent',  sh: 't', th: 'bi', label: '3 · check consent',          tone: 'gov' },
  { id: 'e4', from: 'onescore', to: 'score',    sh: 'r', th: 'l',  label: '4 · request score',          tone: 'spine' },
  { id: 'e5', from: 'onescore', to: 'konduto',  sh: 'r', th: 'l',  label: '5 · fraud check',            tone: 'spine' },
  { id: 'e6', from: 'score',    to: 'ignite',   sh: 'r', th: 'l',  label: 'read features',              tone: 'feed' },
  { id: 'e7', from: 'bureau',   to: 'ignite',   sh: 'ls', th: 'rt', label: 'nightly load',               tone: 'feed' },
  { id: 'e8', from: 'scpc',     to: 'ignite',   sh: 'ls', th: 'rt', label: 'positive data',              tone: 'feed' },
  { id: 'e9', from: 'score',    to: 'decision', sh: 'r', th: 'l',  label: '6 · score',                  tone: 'spine' },
  { id: 'e10', from: 'konduto', to: 'decision', sh: 'r', th: 'l',  label: 'risk signal',                tone: 'spine' },
  { id: 'e11', from: 'onescore', to: 'audit',   sh: 'b', th: 'ti', label: 'append event',               tone: 'gov' },
  { id: 'e12', from: 'decision', to: 'lender',  sh: 'b', th: 'bi', label: '7 · decision + score',       tone: 'return' },
];

// ── Custom node ─────────────────────────────────────────────────────────────
function ContainerNode({ data }: NodeProps) {
  const d = data as unknown as DiagramNode & { kind: Kind };
  const meta = KIND_META[d.kind];
  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[d.icon ?? meta.icon] ?? Icons.layers;
  return (
    <div
      className={`fp-cflow-node kind-${d.kind}`}
      style={{ '--node': meta.color } as React.CSSProperties}
      aria-label={`${meta.label}: ${d.name}${d.pii ? ', handles PII' : ''}`}
    >
      {/* Connection points — invisible, one source + one target per side used. */}
      <Handle id="l" type="target" position={Position.Left} className="fp-cflow-handle" />
      <Handle id="ls" type="source" position={Position.Left} className="fp-cflow-handle" />
      <Handle id="r" type="source" position={Position.Right} className="fp-cflow-handle" />
      <Handle id="rt" type="target" position={Position.Right} className="fp-cflow-handle" />
      <Handle id="t" type="source" position={Position.Top} className="fp-cflow-handle" />
      <Handle id="ti" type="target" position={Position.Top} className="fp-cflow-handle" />
      <Handle id="b" type="source" position={Position.Bottom} className="fp-cflow-handle" />
      <Handle id="bi" type="target" position={Position.Bottom} className="fp-cflow-handle" />

      <span className="fp-cflow-rail" aria-hidden="true" />
      <span className="fp-cflow-body">
        <span className="fp-cflow-eyebrow">
          <span className="ic" aria-hidden="true"><Icon size={12} /></span>
          {meta.label}
        </span>
        <span className="fp-cflow-name">{d.name}</span>
        <span className="fp-cflow-tech">{d.tech}</span>
      </span>
      {d.pii && <span className="fp-pii" aria-hidden="true">PII</span>}
    </div>
  );
}

const nodeTypes = { container: ContainerNode };

// ── Edge styling ────────────────────────────────────────────────────────────
function makeEdge(e: DiagramEdge): Edge {
  const dashed = e.tone === 'feed' || e.tone === 'gov' || e.tone === 'return';
  const color =
    e.tone === 'gov' ? 'var(--warning)' :
    e.tone === 'return' ? 'var(--accent-2)' :
    e.tone === 'feed' ? 'var(--border-strong)' :
    'var(--fg-muted)';
  return {
    id: e.id,
    source: e.from,
    target: e.to,
    sourceHandle: e.sh,
    targetHandle: e.th,
    type: 'smoothstep',
    label: e.label,
    labelShowBg: true,
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 5,
    labelBgStyle: { fill: 'var(--surface)', stroke: 'var(--border)', strokeWidth: 1 },
    labelStyle: {
      fill: 'var(--fg-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      fontWeight: 500,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
    style: {
      stroke: color,
      strokeWidth: e.tone === 'spine' ? 1.75 : 1.5,
      strokeDasharray: dashed ? '5 4' : undefined,
    },
  };
}

// ── Auto-fit on first real size (tab panel measures 0×0 on mount) ─────────────
function AutoFit() {
  const { fitView } = useReactFlow();
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);
  React.useEffect(() => {
    if (width > 0 && height > 0) fitView({ padding: 0.1 });
  }, [width, height, fitView]);
  return null;
}

const LEGEND: { kind: Kind }[] = [
  { kind: 'orchestrator' }, { kind: 'gateway' }, { kind: 'service' },
  { kind: 'datastore' }, { kind: 'source' }, { kind: 'governance' }, { kind: 'actor' },
];

export default function CreditSolutionDiagram() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const nodes: Node[] = React.useMemo(
    () =>
      NODES.map((n) => ({
        id: n.id,
        type: 'container',
        position: { x: n.x, y: n.y },
        draggable: false,
        connectable: false,
        data: n as unknown as Record<string, unknown>,
      })),
    [],
  );

  const edges: Edge[] = React.useMemo(() => EDGES.map(makeEdge), []);

  if (!mounted) {
    return (
      <div className="fp-cflow-canvas fp-cflow-placeholder" aria-busy="true">
        <span className="fp-cflow-loading">Rendering diagram…</span>
      </div>
    );
  }

  return (
    <div className="fp-cflow-wrap">
      <div className="fp-cflow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} color="var(--border)" />
          <Controls showInteractive={false} />
          <AutoFit />
        </ReactFlow>
      </div>

      <div className="fp-cflow-legend" role="list" aria-label="Diagram legend">
        {LEGEND.map(({ kind }) => (
          <span key={kind} className="fp-cflow-leg" role="listitem">
            <span className="fp-cflow-leg-swatch" style={{ background: KIND_META[kind].color }} />
            {KIND_META[kind].label}
          </span>
        ))}
        <span className="fp-cflow-leg" role="listitem">
          <span className="fp-cflow-leg-dash" aria-hidden="true" />
          Background feed / governance write
        </span>
      </div>

      <p className="fp-cflow-caption">
        C4 container view of a single credit consultation. The numbered path (1–7) is the
        synchronous request: the lender calls the edge gateway, OneScore validates LGPD consent,
        fans out to the score and antifraud services, the Decision Engine applies policy, and the
        result returns to the lender. Dashed edges are background feeds (the bureau pipelines load
        the feature store) and the append-only write to the audit trail. The full estate topology
        lives under the Topology tab.
      </p>
    </div>
  );
}
