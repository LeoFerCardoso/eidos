'use client';
// Forge — Incidents board. Every incident across the bureau estate, ranked by
// severity, each row a door into the war room.
//
// Brief — Persona: SRE / on-call + EM. Question: what is on fire now, how bad,
// who has it, and how long has it run? Data: incidents (src/portal/data/
// incidents.ts). Primary action: open the active incident's war room (or
// declare a new one). Distinctive move: live status with a pulsing dot on
// active incidents, so the board reads triage-first.
//
// Composes only Eidos DS + .fp-* classes. No tier; bureau services.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Drawer, Field, Icons, Input, Pill, Select, SeverityPill, StatusDot } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { ActivityHeatmap } from '@/portal/shell/viz';
import {
  INCIDENTS, KPIS, SOURCE_META, STATUS_META,
  UNAVAIL_AI, UNAVAIL_COLS, UNAVAIL_HEAT, UNAVAIL_ROWS,
  type IncStatus,
} from '@/portal/data/incidents';

const FILTERS = [
  { value: 'all', label: 'All incidents' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
];

const SEVERITIES = [
  { value: 'p0', label: 'P0 · bureau-wide' },
  { value: 'p1', label: 'P1 · customer-facing' },
  { value: 'p2', label: 'P2 · degraded' },
  { value: 'p3', label: 'P3 · minor' },
];

const SERVICES = [...new Set(INCIDENTS.map((i) => i.service))].map((s) => ({ value: s, label: s }));

/** Manual declaration drawer. Most incidents arrive via integrations (the
 *  Source column); this is the exception path for what monitors cannot see. */
function DeclareDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = React.useState('');
  const [service, setService] = React.useState(SERVICES[0].value);
  const [severity, setSeverity] = React.useState('p2');
  const [commander, setCommander] = React.useState('');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Declare an incident"
      desc="Manual declaration. Alerts from Prometheus, Dynatrace, Grafana and Forge AI watches open incidents automatically with the source attached."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="ember" onClick={onClose}><Icons.alert size={13} /> Declare incident</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. acerta-api p95 latency spike" autoFocus />
        </Field>
        <Field label="Service">
          <Select value={service} onValueChange={setService} options={SERVICES} />
        </Field>
        <Field label="Severity">
          <Select value={severity} onValueChange={setSeverity} options={SEVERITIES} />
        </Field>
        <Field label="Incident commander" hint="Defaults to the on-call for the service's rotation.">
          <Input value={commander} onChange={(e) => setCommander(e.target.value)} placeholder="On-call · score-risk-oncall" />
        </Field>
        <div className="fp-empty" style={{ marginBlockStart: 2 }}>
          <Icons.info size={13} />
          <span>
            Declaring opens the war room, pages the rotation via PagerDuty, creates the Slack channel,
            and files the ServiceNow record. Source is set to <span className="mono">Manual</span>.
          </span>
        </div>
      </div>
    </Drawer>
  );
}

export default function IncidentsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [scope, setScope] = React.useState('all');
  const [declaring, setDeclaring] = React.useState(false);

  const filtered = React.useMemo(() => {
    let list = INCIDENTS;
    if (scope === 'active') list = list.filter((i) => i.status !== 'resolved');
    else if (scope === 'resolved') list = list.filter((i) => i.status === 'resolved');
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q) || i.service.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.commander.toLowerCase().includes(q));
    }
    return list;
  }, [query, scope]);

  const open = (id: string) => router.push(`/portal/incidents/${id}`);

  return (
    <>
      <FPageHeader
        eyebrow="Reliability"
        title="Incidents"
        subtitle="Triage what's on fire, run the war room, and learn from what already closed."
        actions={
          <>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
            <Button variant="ember" onClick={() => setDeclaring(true)}>
              <Icons.alert size={13} /> Declare incident
            </Button>
          </>
        }
      />

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* When do we burn: degraded minutes by hour-bucket × weekday (30d). */}
      <div style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <ActivityHeatmap
          title="Unavailability heatmap"
          meta="degraded minutes · hour × weekday · 30d"
          rows={UNAVAIL_ROWS}
          cols={UNAVAIL_COLS}
          data={UNAVAIL_HEAT}
          tone="bad"
          ai={UNAVAIL_AI}
        />
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Filter by id, service, commander…"
            aria-label="Filter incidents"
            className="fluid"
          />
        </div>
        <span className="fp-filter-select">
          <Select value={scope} onValueChange={setScope} options={FILTERS} width="160px" />
        </span>
      </div>

      <FSection title="Incidents" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Incident</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Commander</th>
                  <th style={{ textAlign: 'end' }}>Started</th>
                  <th style={{ textAlign: 'end' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => {
                  const st = STATUS_META[i.status as IncStatus];
                  return (
                    <tr key={i.id} style={{ cursor: 'pointer' }} onClick={() => open(i.id)}>
                      <td><SeverityPill level={i.severity} /></td>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          <span className="mono" style={{ color: 'var(--fg-muted)', marginInlineEnd: 8 }}>{i.id}</span>
                          {i.title}
                        </span>
                        <span className="fp-cell-sub mono" style={{ color: 'var(--fg-muted)' }}>{i.service}</span>
                      </td>
                      <td>
                        {(() => {
                          const src = SOURCE_META[i.source.kind];
                          const SrcIcon = Icons[src.icon as keyof typeof Icons];
                          return (
                            <span className="fp-meta-chip" title={i.source.detail} style={{ whiteSpace: 'nowrap' }}>
                              <SrcIcon size={12} /> {src.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td>
                        <Pill tone={st.tone} dot live={st.live}>{st.label}</Pill>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{i.commander}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{i.started}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)' }}>
                        {i.duration}
                        {i.slaLeft && (
                          <span className="fp-cell-sub mono" style={{ color: 'var(--warning)', textAlign: 'end' }}>
                            {i.slaLeft} to SLA
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FSection>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <StatusDot tone="done" />
          <span>No incidents match this filter.</span>
        </div>
      )}

      <DeclareDrawer open={declaring} onClose={() => setDeclaring(false)} />
    </>
  );
}
