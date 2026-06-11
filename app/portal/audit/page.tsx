'use client';
// Forge · Audit. Immutable, append-only feed of every governed action on the
// platform. Every principal (human or agent), every outcome (ok / denied /
// rolled-back), every guardrail verdict. The trust record that backs LGPD
// evidence. Retained 7 years. See docs/AGENTIC-PLATFORM-VISION.md §7.9.
//
// Persona: platform owner, security / compliance team. Primary question:
// "Who did what, when, and did the guardrails hold?"
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import {
  AUDIT_EVENTS,
  AUDIT_KPIS,
  type AuditEvent,
  type PrincipalType,
  type AuditVerdict,
  type AuditOutcome,
} from '@/portal/data/audit';

// ── Meta maps ─────────────────────────────────────────────────────────────────

const OUTCOME_META: Record<AuditOutcome, { label: string; tone: 'health-up' | 'danger' | 'ice' }> = {
  'ok':          { label: 'ok',          tone: 'health-up' },
  'denied':      { label: 'denied',      tone: 'danger' },
  'rolled-back': { label: 'rolled back', tone: 'ice' },
};

const VERDICT_META: Record<AuditVerdict, { label: string; className: string }> = {
  'auto':     { label: 'Auto-cleared',   className: 'au-verdict au-verdict--auto' },
  'approved': { label: 'Approved',       className: 'au-verdict au-verdict--approved' },
  'blocked':  { label: 'Blocked',        className: 'au-verdict au-verdict--blocked' },
  'system':   { label: 'System',         className: 'au-verdict au-verdict--system' },
};

const PRINCIPAL_TYPE_OPTIONS: { value: PrincipalType | 'all'; label: string }[] = [
  { value: 'all',   label: 'All principals' },
  { value: 'agent', label: 'Agent only' },
  { value: 'human', label: 'Human only' },
];

const OUTCOME_OPTIONS: { value: AuditOutcome | 'all'; label: string }[] = [
  { value: 'all',          label: 'All outcomes' },
  { value: 'ok',           label: 'OK' },
  { value: 'denied',       label: 'Denied' },
  { value: 'rolled-back',  label: 'Rolled back' },
];

// Derive service list from data for the service filter.
const ALL_SERVICES = Array.from(new Set(AUDIT_EVENTS.map((e) => e.service))).sort();
const SERVICE_OPTIONS = [
  { value: 'all', label: 'All services' },
  ...ALL_SERVICES.map((s) => ({ value: s, label: s })),
];

// ── Row component ─────────────────────────────────────────────────────────────

function AuditRow({ e }: { e: AuditEvent }) {
  const vm = VERDICT_META[e.verdict];
  const om = OUTCOME_META[e.outcome];
  const isAgent = e.principalType === 'agent';

  return (
    <div className="fp-audit-row">
      {/* Timestamp */}
      <span className="au-ts mono">{e.timestamp}</span>

      {/* Principal: name + type badge */}
      <span className="au-principal">
        <span className="au-principal-name">{e.principalName}</span>
        <span className={`au-type-badge au-type-badge--${e.principalType}`}>
          {isAgent ? 'AGENT' : 'HUMAN'}
        </span>
      </span>

      {/* Action — links to /portal/actions/[id] */}
      <Link href={`/portal/actions/${e.actionId}`} className="au-action">
        {e.actionLabel}
      </Link>

      {/* Target service */}
      <Link href={`/portal/catalog/${e.service}`} className="au-service mono">
        {e.service}
      </Link>

      {/* Guardrail verdict */}
      <span className={vm.className}>
        {e.verdict === 'approved' && e.approvedBy
          ? `Approved by ${e.approvedBy}`
          : vm.label}
      </span>

      {/* Outcome pill */}
      <span className="au-outcome">
        <Pill tone={om.tone}>{om.label}</Pill>
      </span>

      {/* View run link — only when tied to a run */}
      <span className="au-run">
        {e.runId ? (
          <Link href={`/portal/runs/${e.runId}`} className="au-run-link">
            <Icons.activity size={11} /> Run
          </Link>
        ) : null}
      </span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [principalType, setPrincipalType] = React.useState<PrincipalType | 'all'>('all');
  const [outcome, setOutcome] = React.useState<AuditOutcome | 'all'>('all');
  const [service, setService] = React.useState('all');
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    let list = AUDIT_EVENTS;
    if (principalType !== 'all') list = list.filter((e) => e.principalType === principalType);
    if (outcome !== 'all') list = list.filter((e) => e.outcome === outcome);
    if (service !== 'all') list = list.filter((e) => e.service === service);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.principalName.toLowerCase().includes(q) ||
          e.actionLabel.toLowerCase().includes(q) ||
          e.service.toLowerCase().includes(q),
      );
    }
    return list;
  }, [principalType, outcome, service, query]);

  return (
    <>
      <FPageHeader
        eyebrow="Governance"
        title="Audit log"
        subtitle="Every governed action on the platform, immutably recorded."
        actions={
          <>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
            <Button variant="outline" asChild>
              <Link href="/portal/approvals">
                <Icons.gate size={13} /> Approvals
              </Link>
            </Button>
          </>
        }
      />

      {/* Immutable-log note */}
      <p className="fp-audit-note">
        Append-only · retained 7 years · LGPD evidence
      </p>

      {/* KPI strip */}
      <div className="fp-grid fp-grid-4" style={{ marginBlockEnd: 20 }}>
        {AUDIT_KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="fp-toolbar">
        <span className="fp-filter-select">
          <Select
            value={principalType}
            onValueChange={(v) => setPrincipalType(v as PrincipalType | 'all')}
            options={PRINCIPAL_TYPE_OPTIONS}
            width="160px"
          />
        </span>
        <span className="fp-filter-select">
          <Select
            value={outcome}
            onValueChange={(v) => setOutcome(v as AuditOutcome | 'all')}
            options={OUTCOME_OPTIONS}
            width="148px"
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
            placeholder="Search events…"
            aria-label="Search audit events"
            className="fluid"
          />
        </div>
        <span className="fp-agents-count">{filtered.length} events</span>
      </div>

      {/* Table header */}
      {/* Header + rows share one scroll container: on narrow viewports the
          table scrolls horizontally as a unit instead of hiding columns. */}
      <div className="fp-audit-scroll">
        {/* Header cells carry no row-cell classes (those set row font/color and
            would override the head's mono-uppercase style). */}
        <div className="fp-audit-head">
          <span>Time</span>
          <span>Principal</span>
          <span>Action</span>
          <span>Service</span>
          <span>Guardrail</span>
          <span>Outcome</span>
          <span />
        </div>

        {/* Rows */}
        <div className="fp-audit-list">
          {filtered.map((e) => <AuditRow key={e.id} e={e} />)}
          {filtered.length === 0 && (
            <div className="fp-empty">
              <Icons.search size={18} />
              <span>No events match this filter.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
