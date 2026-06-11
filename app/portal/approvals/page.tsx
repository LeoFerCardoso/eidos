'use client';
// Forge · Approvals. The full backlog of guardrail-escalated decisions.
// Home Decide is the glance version (the small set that needs immediate
// attention). This page is the complete queue: every pending approval with
// blast-radius context, SLA countdown, and approve/deny actions.
// See docs/AGENTIC-PLATFORM-VISION.md §7.9.
//
// Persona: platform owner, team leads. Primary question:
// "What is waiting on me, how urgent is it, and what does the guardrail say?"
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, IconBubble } from '@/portal/shell/portal-shell';
import {
  APPROVALS,
  APPROVAL_KPIS,
  type Approval,
  type PrincipalType,
} from '@/portal/data/audit';
import type { RiskLevel } from '@/portal/data/agent-activity';

// ── Meta maps ─────────────────────────────────────────────────────────────────

const RISK_PILL: Record<RiskLevel, 'risk-crit' | 'risk-high' | 'risk-med'> = {
  crit: 'risk-crit',
  high: 'risk-high',
  med: 'risk-med',
};

const PRINCIPAL_TYPE_OPTIONS: { value: PrincipalType | 'all'; label: string }[] = [
  { value: 'all',   label: 'All requesters' },
  { value: 'agent', label: 'Agent only' },
  { value: 'human', label: 'Human only' },
];

// Derive service list from approvals for the service filter.
const ALL_SERVICES = Array.from(new Set(APPROVALS.map((a) => a.service))).sort();
const SERVICE_OPTIONS = [
  { value: 'all', label: 'All services' },
  ...ALL_SERVICES.map((s) => ({ value: s, label: s })),
];

// ── Approval row ──────────────────────────────────────────────────────────────

function ApprovalRow({ a }: { a: Approval }) {
  const isAgent = a.principalType === 'agent';

  return (
    <div className="fp-appr-row">
      {/* Left: neutral icon tile — risk is encoded once, in the blast pill.
          A colored tile per row would spend the accent budget on texture. */}
      <IconBubble icon="gate" size={38} tone="neutral" />

      {/* Body */}
      <div className="fp-appr-body">
        <div className="fp-appr-top">
          <span className="fp-appr-title">{a.title}</span>
          {/* Level only; the full blast string rides the title attr and the
              guardrail line below already spells out the consequence. */}
          <Pill tone={RISK_PILL[a.risk]} icon={<Icons.lock size={11} />} title={a.blastRadius}>
            {a.blastRadius.split(' · ')[0]}
          </Pill>
        </div>

        <div className="fp-appr-meta">
          <Link href={`/portal/actions/${a.actionId}`} className="au-action fp-appr-action">
            {a.actionLabel}
          </Link>
          <span className="fp-appr-sep" aria-hidden="true">·</span>
          <Link href={`/portal/catalog/${a.service}`} className="au-service mono">
            {a.service}
          </Link>
          <span className="fp-appr-sep" aria-hidden="true">·</span>
          <span className="fp-appr-requester">
            <span className={`au-type-badge au-type-badge--${a.principalType}`}>
              {isAgent ? 'AGENT' : 'HUMAN'}
            </span>
            {a.principalName}
          </span>
          <span className="fp-appr-sep" aria-hidden="true">·</span>
          <span className="fp-appr-when mono">{a.when}</span>
        </div>

        <p className="fp-appr-guardrail">
          <Icons.gate size={12} style={{ color: 'var(--fg-faint)', flexShrink: 0 } as React.CSSProperties} />
          {a.guardrailLabel}
        </p>

        <div className="fp-appr-foot">
          <span className={`fp-appr-sla${a.slaAtRisk ? ' is-risk' : ''}`}>
            <Icons.clock size={11} />
            {a.slaCountdown}
          </span>

          <div className="fp-appr-actions">
            {a.runId && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/portal/runs/${a.runId}`}>
                  <Icons.activity size={12} /> Run
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm">
              Deny
            </Button>
            <Button variant="outline" size="sm">
              <Icons.check size={12} /> Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ApprovalsPage() {
  const [principalType, setPrincipalType] = React.useState<PrincipalType | 'all'>('all');
  const [service, setService] = React.useState('all');
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    let list = APPROVALS.filter((a) => a.status === 'pending');
    if (principalType !== 'all') list = list.filter((a) => a.principalType === principalType);
    if (service !== 'all') list = list.filter((a) => a.service === service);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.principalName.toLowerCase().includes(q) ||
          a.service.toLowerCase().includes(q) ||
          a.actionLabel.toLowerCase().includes(q),
      );
    }
    return list;
  }, [principalType, service, query]);

  const hasAtRisk = filtered.some((a) => a.slaAtRisk);

  return (
    <>
      <FPageHeader
        eyebrow="Governance"
        title="Approvals"
        subtitle="Guardrail-escalated decisions waiting for a human. Home shows the urgent glance; this is the full backlog."
        actions={
          <>
            <Button variant="ghost" asChild>
              <Link href="/portal/audit">
                <Icons.auditLog size={13} /> Audit log
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/portal/access">
                <Icons.user size={13} /> Access
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI strip */}
      <div className="fp-grid fp-grid-4" style={{ marginBlockEnd: 20 }}>
        {APPROVAL_KPIS.map((k) => (
          <div
            key={k.id}
            className="fp-kpi"
            style={k.id === 'sla' && Number(k.value) > 0 ? { color: 'var(--warning)' } : undefined}
          >
            <span className="label">{k.label}</span>
            <div
              className="value"
              style={k.id === 'sla' && Number(k.value) > 0 ? { color: 'var(--warning)' } : undefined}
            >
              {k.value}
            </div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* SLA-at-risk banner — shown when the filtered set has at-risk items */}
      {hasAtRisk && (
        <div className="fp-appr-banner" role="alert">
          <Icons.clock size={14} />
          <span>
            {filtered.filter((a) => a.slaAtRisk).length} approval{filtered.filter((a) => a.slaAtRisk).length > 1 ? 's' : ''} will
            breach SLA in under 2 hours.
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="fp-toolbar">
        <span className="fp-filter-select">
          <Select
            value={principalType}
            onValueChange={(v) => setPrincipalType(v as PrincipalType | 'all')}
            options={PRINCIPAL_TYPE_OPTIONS}
            width="158px"
          />
        </span>
        <span className="fp-filter-select">
          <Select
            value={service}
            onValueChange={setService}
            options={SERVICE_OPTIONS}
            width="190px"
          />
        </span>
        <div style={{ flex: 1, minInlineSize: 180, maxInlineSize: 300, display: 'flex' }}>
          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Search approvals…"
            aria-label="Search approvals"
            className="fluid"
          />
        </div>
        <span className="fp-agents-count">{filtered.length} pending</span>
      </div>

      {/* Queue */}
      <div className="fp-appr-list">
        {filtered.length === 0 ? (
          <div className="fp-appr-empty">
            <IconBubble icon="check" size={36} tone="success" />
            <div className="fp-appr-empty-copy">
              <strong>No pending approvals.</strong>
              <span>Everything within this filter has been resolved. Agents are operating within their autonomous boundaries.</span>
            </div>
          </div>
        ) : (
          filtered.map((a) => <ApprovalRow key={a.id} a={a} />)
        )}
      </div>
    </>
  );
}
