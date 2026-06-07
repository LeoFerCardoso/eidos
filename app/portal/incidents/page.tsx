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
import { Button, Icons, Pill, Select, SeverityPill, StatusDot } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { INCIDENTS, KPIS, STATUS_META, activeCount, type IncStatus } from '@/portal/data/incidents';

const FILTERS = [
  { value: 'all', label: 'All incidents' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
];

export default function IncidentsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [scope, setScope] = React.useState('all');

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
        subtitle={`${activeCount} active · ${INCIDENTS.length} in the trailing week`}
        actions={
          <>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
            <Button variant="ember">
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
                        <span className="fp-cell-sub mono" style={{ color: 'var(--ember)' }}>{i.service}</span>
                      </td>
                      <td>
                        <Pill tone={st.tone} dot live={st.live}>{st.label}</Pill>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{i.commander}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{i.started}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)' }}>{i.duration}</td>
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
    </>
  );
}
