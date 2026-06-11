'use client';
// Forge · Intake queue. Where agent work originates: tickets from Jira and
// ServiceNow are triaged, a service is identified, an agent is assigned, and
// the ticket-to-prod workflow is spun up. This is step 1 of UC-1 in
// docs/AGENTIC-PLATFORM-VISION.md §5 and §7.10.
//
// Brief · Persona: product manager / platform owner. Question: what work is
// waiting to be picked up, what is already running, and is anything stuck?
// Data: INTAKE_TICKETS (src/portal/data/intake.ts). Primary action: triage a
// new ticket or jump into the run for an in-flight one.
//
// Composes only Eidos DS + .fp-* classes. No per-page <style>.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select, Avatar } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  INTAKE_TICKETS,
  KPIS,
  AI_INTAKE_READ,
  PRIORITY_META,
  TRIAGE_STATUS_META,
  type IntakeTicket,
  type TriageStatus,
  type IntakeSource,
} from '@/portal/data/intake';

// ── Source icon ────────────────────────────────────────────────────────────
function SourceBadge({ ticket }: { ticket: IntakeTicket }) {
  // Jira uses a square "J" mark; ServiceNow a diamond "SN" mark. Rendered as
  // small monospaced text badges so they are accessible and print-safe without
  // SVG sprites.
  if (ticket.source === 'jira') {
    return (
      <span className="iq-src iq-src-jira" aria-label="Jira">
        J
      </span>
    );
  }
  return (
    <span className="iq-src iq-src-sn" aria-label="ServiceNow">
      SN
    </span>
  );
}

// ── Triage pipeline visual ─────────────────────────────────────────────────
// Renders as a Pill for the current stage so it reads quickly in the table.
function TriagePill({ status }: { status: TriageStatus }) {
  const m = TRIAGE_STATUS_META[status];
  return (
    <Pill tone={m.tone} dot={status === 'running'}>
      {m.label}
    </Pill>
  );
}

// ── Queue row ──────────────────────────────────────────────────────────────
function QueueRow({ t }: { t: IntakeTicket }) {
  const priority = PRIORITY_META[t.priority];

  // Everything in this cell renders on ONE line: stacked micro-lines gave the
  // rows ragged heights. The table scrolls horizontally instead (.iq-table).
  const active = t.triageStatus === 'assigned' || t.triageStatus === 'running' || t.triageStatus === 'done';
  const agentLine = active && t.assignedAgentName && (
    <span className="iq-agent">
      <Avatar name={t.assignedAgentName} size={20} />
      <span className="iq-agent-name">{t.assignedAgentName}</span>
    </span>
  );
  const runLink = (t.triageStatus === 'running' || t.triageStatus === 'done') && t.runId && (
    <Link href={`/portal/runs/${t.runId}`} className="iq-run-link mono" onClick={(e) => e.stopPropagation()}>
      <Icons.gitPullRequest size={11} />
      {t.runId}
    </Link>
  );
  const wfLink = active && t.workflowId && (
    <Link
      href={`/portal/workflows/${t.workflowId}`}
      className="iq-wf-link"
      onClick={(e) => e.stopPropagation()}
      aria-label={`Workflow: ${t.workflowId}`}
    >
      <Icons.share size={11} />
      <span className="mono">{t.workflowId}</span>
    </Link>
  );

  const rowClass = [
    'iq-row',
    t.needsHuman ? 'fp-row-flag' : '',
    t.triageStatus === 'done' ? 'iq-row-done' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rowClass} role="row">
      {/* Source badge + ticket ref */}
      <span className="iq-ref" role="cell">
        <SourceBadge ticket={t} />
        <span className="mono iq-ticket-id">{t.ref}</span>
      </span>

      {/* Title — single line; the full text rides the title attr */}
      <span className="iq-title" role="cell">
        <span className="iq-title-tx" title={t.title}>{t.title}</span>
        {t.needsHuman && (
          <span className="iq-flag-note" aria-label="Needs human review">
            <Icons.alert size={12} />
          </span>
        )}
      </span>

      {/* Service */}
      <span className="iq-svc" role="cell">
        <Link
          href={`/portal/catalog/${t.serviceId}`}
          className="iq-svc-link"
          onClick={(e) => e.stopPropagation()}
        >
          {t.serviceName}
        </Link>
      </span>

      {/* Priority */}
      <span className="iq-pri" role="cell">
        <Pill tone={priority.tone}>{priority.label}</Pill>
      </span>

      {/* Triage status */}
      <span className="iq-status" role="cell">
        <TriagePill status={t.triageStatus} />
        {t.triageStatus === 'done' && t.outcome && (
          <span className="iq-outcome mono">{t.outcome}</span>
        )}
      </span>

      {/* Agent / run / workflow — single line */}
      <span className="iq-agent-cell" role="cell">
        {agentLine}
        {runLink}
        {(agentLine || runLink) && wfLink && <span className="iq-sep" aria-hidden="true">·</span>}
        {wfLink}
      </span>

      {/* Arrived */}
      <span className="iq-when mono" role="cell">
        {t.arrivedAt}
      </span>
    </div>
  );
}

// ── Statuses + sources for filter dropdowns ────────────────────────────────
const STATUS_OPTS: { value: TriageStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'triaged', label: 'Triaged' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'running', label: 'Running' },
  { value: 'done', label: 'Done' },
];

const SOURCE_OPTS: { value: IntakeSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All sources' },
  { value: 'jira', label: 'Jira' },
  { value: 'servicenow', label: 'ServiceNow' },
];

// Collect unique service names for the service filter.
const SERVICE_OPTS = [
  { value: 'all', label: 'All services' },
  ...[...new Set(INTAKE_TICKETS.map((t) => t.serviceId))].map((id) => ({
    value: id,
    label: INTAKE_TICKETS.find((t) => t.serviceId === id)!.serviceName,
  })),
];

// ── Page ────────────────────────────────────────────────────────────────────
export default function IntakePage() {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState<TriageStatus | 'all'>('all');
  const [source, setSource] = React.useState<IntakeSource | 'all'>('all');
  const [service, setService] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = INTAKE_TICKETS;
    if (status !== 'all') list = list.filter((t) => t.triageStatus === status);
    if (source !== 'all') list = list.filter((t) => t.source === source);
    if (service !== 'all') list = list.filter((t) => t.serviceId === service);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.ref.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.serviceName.toLowerCase().includes(q) ||
          (t.assignedAgentName ?? '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, status, source, service]);

  return (
    <>
      <FPageHeader
        eyebrow="Delivery"
        title="Intake"
        subtitle="Tickets from Jira and ServiceNow triaged into agent workflow runs. Each ticket moves through five stages: new, triaged, assigned, running, and done."
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="outline" asChild>
              <Link href="/portal/workflows/ticket-to-prod">
                <Icons.share size={13} /> ticket-to-prod
              </Link>
            </Button>
            <Button variant="ember" asChild>
              <Link href="/portal/runs">
                <Icons.gitPullRequest size={13} /> Runs
              </Link>
            </Button>
          </>
        }
      />

      {/* Forge AI banner — portal standard places it right under the header,
          before the KPI strip (see buckets / databases / security). */}
      <AiBanner title={AI_INTAKE_READ.title} action="Triage now">
        Ticket <span className="fp-aip-hl mono">INC0019749</span> on{' '}
        <span className="fp-aip-hl mono">onescore-gateway</span> (tier-0, high priority) has been
        waiting <span className="fp-aip-hl">18h</span> with no triage.{' '}
        SLA is <span className="fp-aip-hl">4h</span>. Assign an agent or route to the owning squad.
      </AiBanner>

      {/* KPIs */}
      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Toolbar: search + source + status + service */}
      <div
        className="fp-toolbar"
        style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}
      >
        <div style={{ flex: 1, minInlineSize: 200, maxInlineSize: 360, display: 'flex' }}>
          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Search tickets, services, agents..."
            aria-label="Search intake queue"
            className="fluid"
          />
        </div>
        <span className="fp-filter-select">
          <Select
            value={source}
            onValueChange={(v) => setSource(v as IntakeSource | 'all')}
            options={SOURCE_OPTS}
            width="160px"
          />
        </span>
        <span className="fp-filter-select">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as TriageStatus | 'all')}
            options={STATUS_OPTS}
            width="160px"
          />
        </span>
        <span className="fp-filter-select">
          <Select
            value={service}
            onValueChange={setService}
            options={SERVICE_OPTS}
            width="180px"
          />
        </span>
        <span className="fp-agents-count">{filtered.length} tickets</span>
      </div>

      {/* Queue table */}
      <div
        className="iq-table"
        role="table"
        aria-label="Intake queue"
        style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}
      >
        {/* Column headers */}
        <div className="iq-head" role="row">
          <span role="columnheader">Source</span>
          <span role="columnheader">Title</span>
          <span role="columnheader">Service</span>
          <span role="columnheader">Priority</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Agent / workflow</span>
          <span role="columnheader">Arrived</span>
        </div>

        {filtered.map((t) => <QueueRow key={t.id} t={t} />)}

        {filtered.length === 0 && (
          <div className="fp-empty" style={{ marginBlockStart: 16 }}>
            <Icons.search size={18} />
            <span>No tickets match this filter.</span>
          </div>
        )}
      </div>
    </>
  );
}
