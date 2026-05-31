import * as React from 'react';
import { Pill } from '@/components/forge/pill';

const HEALTH_LABELS = { up: 'Up', degraded: 'Degraded', down: 'Down', unknown: 'Unknown' };

const HealthBadge = ({
  state = 'unknown',
  label,
  pulse = false,
}: {
  state?: 'up' | 'degraded' | 'down' | 'unknown';
  label?: string;
  pulse?: boolean;
}) => (
  <Pill
    tone={`health-${state}` as any}
    dot
    live={pulse && state === 'degraded'}
    role="status"
    aria-label={`Health: ${label || HEALTH_LABELS[state]}`}
  >
    {label || HEALTH_LABELS[state]}
  </Pill>
);

export { HealthBadge };
