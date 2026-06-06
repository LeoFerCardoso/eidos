'use client';
// Forge AI — conversation widgets. Richer-than-prose artifacts the copilot drops
// into an assistant turn. Composed from DS atoms (HealthBadge, Trend, Icons) and
// the contrast/flat rules. Grow this file as new widget types land.
import * as React from 'react';
import { HealthBadge, Trend, Icons, Pill } from '@/ds/core';
import { Mention } from '@eidos/ui';

// Re-export DS types + component under the legacy portal name so
// forge-ai-chat.tsx keeps working without any import changes.
export type { MentionPerson } from '@eidos/ui';
export { Mention as UserMention };

type Health = 'up' | 'degraded' | 'down';

export interface RootCauseNode {
  /** Service name (rendered mono). */
  name: string;
  /** Icons key for the leading glyph. */
  icon?: string;
  health: Health;
  /** The headline metric, e.g. "p99 240ms" + a +41% trend. */
  metric: { label: string; delta: number; unit?: string; inverted?: boolean };
  version: string;
  age: string;
  /** Marks the node as the suspected cause — gets a soft emphasis. */
  root?: boolean;
}

/**
 * The dependency chain itself — the impacted service linked to the dependency it
 * correlates with, each node carrying health, headline metric, version and age,
 * with the suspected cause highlighted. Shared by RootCauseWidget and
 * IncidentWidget so the two never nest a card inside a card.
 */
function DependencyChain({ nodes }: { nodes: RootCauseNode[] }) {
  return (
    <div className="fp-aiw-chain">
      {nodes.map((n, i) => {
        const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[n.icon || 'server'] ?? Icons.server;
        return (
          <React.Fragment key={n.name}>
            {i > 0 && (
              <div className="fp-aiw-link" aria-hidden="true">
                <Icons.arrowDown size={12} />
                <span>depends on</span>
              </div>
            )}
            <div className={`fp-aiw-node${n.root ? ' is-root on-accent-soft' : ''}`}>
              <div className="fp-aiw-node-head">
                <span className="fp-aiw-node-ic"><Icon size={14} /></span>
                <code className="mono fp-aiw-name">{n.name}</code>
                <HealthBadge state={n.health} pulse={n.health !== 'up'} />
              </div>
              <div className="fp-aiw-node-meta">
                <span className="fp-aiw-metric">{n.metric.label}</span>
                <Trend delta={n.metric.delta} unit={n.metric.unit ?? '%'} inverted={n.metric.inverted} />
                <span className="fp-aiw-sep">·</span>
                <code className="mono">{n.version}</code>
                <span className="fp-aiw-sep">·</span>
                <span>{n.age}</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Root-cause / dependency-correlation widget. Renders an impacted service and the
 * dependency it correlates with as a linked chain, so the "why" is visual. Flat,
 * square atoms inside one bordered widget surface.
 */
export function RootCauseWidget({
  title = 'Likely root cause',
  nodes,
}: {
  title?: string;
  nodes: RootCauseNode[];
}) {
  return (
    <div className="fp-aiw">
      <div className="fp-aiw-head">
        <span className="fp-aiw-ic" aria-hidden="true"><Icons.target size={13} /></span>
        <span className="fp-aiw-title">{title}</span>
      </div>
      <DependencyChain nodes={nodes} />
    </div>
  );
}

export interface FlagWidgetProps {
  /** Flag key, e.g. "konduto.fraud-score-v2" (rendered mono). */
  name: string;
  /** Current state — 'on' is the culprit (amber); 'off' is neutral. */
  state: 'on' | 'off';
  /** What the flag gates. */
  wraps: string;
  /** Where it's live, e.g. "production · 100% of traffic". */
  scope: string;
}

/**
 * Feature-flag widget. Shows the flag that encapsulates the offending feature —
 * its key, current state and what it gates — so the copilot can propose the
 * fastest, fully-reversible mitigation: flip it off (no deploy) before any rollback.
 */
export function FlagWidget({ name, state, wraps, scope }: FlagWidgetProps) {
  const on = state === 'on';
  return (
    <div className="fp-aiw">
      <div className="fp-aiw-head">
        <span className="fp-aiw-ic" aria-hidden="true"><Icons.flag size={13} /></span>
        <code className="mono fp-aiw-flag-name">{name}</code>
        <span className={`fp-aiw-flag-state${on ? ' is-on' : ''}`}>
          <span className="fp-aiw-flag-dot" aria-hidden="true" />
          {on ? 'ON' : 'OFF'}
        </span>
      </div>
      <div className="fp-aiw-flag-body">
        <div className="fp-aiw-flag-row">
          <span className="fp-aiw-flag-k">Wraps</span>
          <span className="fp-aiw-flag-v">{wraps}</span>
        </div>
        <div className="fp-aiw-flag-row">
          <span className="fp-aiw-flag-k">Scope</span>
          <span className="fp-aiw-flag-v">{scope}</span>
        </div>
      </div>
    </div>
  );
}

export interface RecoveryNode {
  name: string;
  icon?: string;
  /** Recovered metric, e.g. "p95 118ms". */
  metric: string;
  /** Short status note, e.g. "back within SLO". */
  note: string;
}

/**
 * Recovery widget. After a mitigation lands, shows the affected services now
 * green with their recovered metric — the visual "the estate is healthy again".
 */
export function RecoveryWidget({
  title = 'Estate recovered · mitigation holding',
  nodes,
}: {
  title?: string;
  nodes: RecoveryNode[];
}) {
  return (
    <div className="fp-aiw">
      <div className="fp-aiw-head">
        <span className="fp-aiw-ic is-ok" aria-hidden="true"><Icons.check size={13} /></span>
        <span className="fp-aiw-title">{title}</span>
      </div>
      <div className="fp-aiw-chain">
        {nodes.map((n) => {
          const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[n.icon || 'server'] ?? Icons.server;
          return (
            <div className="fp-aiw-node" key={n.name}>
              <div className="fp-aiw-node-head">
                <span className="fp-aiw-node-ic"><Icon size={14} /></span>
                <code className="mono fp-aiw-name">{n.name}</code>
                <HealthBadge state="up" />
              </div>
              <div className="fp-aiw-node-meta">
                <span className="fp-aiw-metric">{n.metric}</span>
                <span className="fp-aiw-sep">·</span>
                <span>{n.note}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface IncidentWidgetProps {
  /** Incident id, e.g. "INC-2041" (rendered mono). */
  id: string;
  /** Severity level — drives the SeverityPill ('p0'|'p1'|'p2'|'p3'). */
  severity: 'p0' | 'p1' | 'p2' | 'p3';
  /** One-line incident title. */
  title: string;
  /** Open / mitigated / resolved status text shown at the inline-end. */
  status: string;
  /** "opened 6h ago" etc. */
  opened: string;
  /** Number of services in the blast radius. */
  impacted: number;
  /** The dependency chain that explains the incident (impacted → root cause). */
  nodes: RootCauseNode[];
}

/**
 * Incident-summary widget. A single bordered surface whose header carries the
 * incident identity (severity, id, status, blast radius) and whose body is the
 * dependency chain — so "what's firing and why" reads at a glance: the degraded
 * service and the degraded dependency that is the suspected root cause.
 */
export function IncidentWidget({
  id,
  severity,
  title,
  status,
  opened,
  impacted,
  nodes,
}: IncidentWidgetProps) {
  return (
    <div className="fp-aiw fp-aiw-inc">
      <div className="fp-aiw-inc-head">
        <div className="fp-aiw-inc-top">
          <Pill tone={`severity-${severity}` as 'severity-p2'}>{severity.toUpperCase()}</Pill>
          <code className="mono fp-aiw-inc-id">{id}</code>
          <span className="fp-aiw-inc-status">
            <span className="fp-aiw-inc-dot" aria-hidden="true" />
            {status}
          </span>
        </div>
        <div className="fp-aiw-inc-title">{title}</div>
        <div className="fp-aiw-inc-meta">
          <Icons.clock size={11} />
          <span>{opened}</span>
          <span className="fp-aiw-sep">·</span>
          <Icons.server size={11} />
          <span>{impacted} {impacted === 1 ? 'service' : 'services'} impacted</span>
        </div>
      </div>
      <DependencyChain nodes={nodes} />
    </div>
  );
}
