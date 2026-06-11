'use client';
// Forge — Architecture. The Architecture Decision Records the company follows
// (and that ground the agents) plus the catalog of architecture diagrams and
// the live service dependency topology (blast-radius graph).
//
// Brief — Persona: architects, every engineer, and the platform agents.
// Question: what decisions must we follow, what changed, and where is the
// diagram for this system? Data: ADRS + DIAGRAMS (src/portal/data/
// architecture-records.ts). Primary action: open an ADR / view a diagram /
// propose a decision. Distinctive move: ADRs are the standards agents enforce,
// shown with their lifecycle, alongside typed architecture diagrams.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  Button,
  Icons,
  Pill,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ds/core';
import { FPageHeader } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  ADRS,
  ADR_STATUS_META,
  AI_READ,
  DIAGRAMS,
  DIAGRAM_ICON,
  KPIS,
  type Diagram,
} from '@/portal/data/architecture-records';
import TopologyGraph from '@/portal/architecture/topology-graph';

// Internal diagrams open the in-portal detail route; external (LucidChart)
// diagrams carry a badge and warn before they leave Forge in a new tab.
function DiagramCard({ d }: { d: Diagram }) {
  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[DIAGRAM_ICON[d.type]] ?? Icons.layers;
  const [leaving, setLeaving] = React.useState(false);

  const body = (
    <>
      <div className="fp-skill-top">
        <span className="fp-skill-ic" aria-hidden="true"><Icon size={18} /></span>
        {d.external
          ? <Pill tone="ice"><Icons.externalLink size={11} /> {d.external.provider}</Pill>
          : <Pill tone="neutral">{d.type}</Pill>}
      </div>
      <span className="fp-skill-name">{d.title}</span>
      <p className="fp-skill-desc">{d.scope} · {d.format}</p>
      <div className="fp-skill-actions">
        {d.external
          ? <span className="fp-skill-link"><Icons.externalLink size={12} /> Open in {d.external.provider}</span>
          : <span className="fp-skill-link"><Icons.arrowRight size={12} /> View diagram</span>}
        <span className="fp-skill-ver">{d.updated}</span>
      </div>
    </>
  );

  if (d.external) {
    return (
      <>
        <button type="button" className="fp-skill fp-skill-card" onClick={() => setLeaving(true)}>
          {body}
        </button>
        <AlertDialog
          open={leaving}
          onOpenChange={(o) => !o && setLeaving(false)}
          variant="info"
          title={`Open this diagram in ${d.external.provider}?`}
          description={`"${d.title}" is hosted in ${d.external.provider}, outside Forge. The link opens in a new tab and is not governed by Forge access controls.`}
          cancelLabel="Stay in Forge"
          confirmLabel={`Open in ${d.external.provider}`}
          onConfirm={() => {
            window.open(d.external!.url, '_blank', 'noopener,noreferrer');
            setLeaving(false);
          }}
        />
      </>
    );
  }

  return (
    <Link href={`/portal/architecture/${d.id}`} className="fp-skill fp-skill-card">
      {body}
    </Link>
  );
}

export default function ArchitecturePage() {
  return (
    <>
      <FPageHeader
        eyebrow="Governance"
        title="Architecture"
        subtitle="The decisions every team and agent must follow, plus the diagrams that explain the estate."
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.plus size={13} /> New ADR</Button>
          </>
        }
      />

      <AiBanner title={AI_READ.title} action="Review ADR-0043">
        Every accepted ADR is loaded as agent context, so agents refuse changes that violate one. <span className="fp-aip-hl mono">ADR-0043</span> (agents call systems via <span className="fp-aip-hl">MCP</span>) is still proposed but already shapes the server catalog.
      </AiBanner>

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <Tabs defaultValue="adrs" className="fp-flat-tabs">
          <TabsList>
            <TabsTrigger value="adrs">Decision records</TabsTrigger>
            <TabsTrigger value="diagrams">Diagrams</TabsTrigger>
            <TabsTrigger value="topology">Topology</TabsTrigger>
          </TabsList>

          <TabsContent value="adrs">
            <div className="fp-card" style={{ padding: 0 }}>
              <div className="tbl-wrap">
                <table className="tbl" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Decision</th>
                      <th>Status</th>
                      <th>Tags</th>
                      <th>Owner</th>
                      <th style={{ textAlign: 'end' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADRS.map((a) => {
                      const sm = ADR_STATUS_META[a.status];
                      return (
                        <tr key={a.id}>
                          <td>
                            <span style={{ fontWeight: 600 }}>
                              <span className="mono" style={{ color: 'var(--fg-muted)', marginInlineEnd: 8 }}>{a.id}</span>
                              {a.title}
                            </span>
                            <span className="fp-cell-sub">{a.context}{a.supersedes ? ` · supersedes ${a.supersedes}` : ''}</span>
                          </td>
                          <td><Pill tone={sm.tone}>{sm.label}</Pill></td>
                          <td>
                            <span className="fp-tags">
                              {a.tags.map((t) => <span key={t} className="fp-tag">{t}</span>)}
                            </span>
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>{a.owner}</td>
                          <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{a.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="diagrams">
            <div className="fp-grid fp-grid-auto">
              {DIAGRAMS.map((d) => (
                <DiagramCard key={d.id} d={d} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topology">
            <TopologyGraph />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
