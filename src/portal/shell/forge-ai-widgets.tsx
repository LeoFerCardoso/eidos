'use client';
// Forge AI — conversation widgets. Richer-than-prose artifacts the copilot drops
// into an assistant turn. Composed from DS atoms (HealthBadge, Trend, Icons) and
// the contrast/flat rules. Grow this file as new widget types land.
import * as React from 'react';
import { HealthBadge, Trend, Icons } from '@/ds/core';

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
 * Root-cause / dependency-correlation widget. Renders an impacted service and the
 * dependency it correlates with as a linked chain, so the "why" is visual: each
 * node carries its health, headline metric, version and age, and the suspected
 * cause is highlighted. Flat, square atoms inside one bordered widget surface.
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
    </div>
  );
}
