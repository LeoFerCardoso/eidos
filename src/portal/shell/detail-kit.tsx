'use client';
// Forge — shared T4 detail-page scaffolding. One definition for the aside
// section header and the inline empty state that four detail surfaces
// (agents, skills, contexts, actions) used to copy locally.
import * as React from 'react';
import { Icons } from '@/ds/core';

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};

export function AsideSection({
  title, action, count, children,
}: {
  title: string;
  action?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="fp-agentd-sec">
      <div className="fp-agentd-sec-head">
        <span className="t">{title}</span>
        {count !== undefined && <span className="fp-agentd-sec-count">{count}</span>}
        {action && <span className="fp-agentd-sec-action">{action}</span>}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="fp-agentd-empty">
      <span className="ic">{ICON(icon, 16)}</span>
      <span>{label}</span>
    </div>
  );
}
