import * as React from 'react';
import { Icons } from '@/components/forge/icons';
import { Pill } from '@/components/forge/pill';

const SEVERITY_LABELS = { p0: 'P0 · Critical', p1: 'P1 · Major', p2: 'P2 · Minor', p3: 'P3 · Notice' };

const SeverityPill = ({
  level = 'p2',
  label,
  icon = true,
}: {
  level?: 'p0' | 'p1' | 'p2' | 'p3';
  label?: string;
  icon?: boolean;
}) => (
  <Pill
    tone={`severity-${level}` as any}
    icon={icon ? <Icons.alert size={10} /> : undefined}
    role="status"
    aria-label={`Severity: ${label || SEVERITY_LABELS[level]}`}
  >
    {label || SEVERITY_LABELS[level]}
  </Pill>
);

export { SeverityPill };
