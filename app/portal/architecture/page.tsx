'use client';
// Forge — Architecture. The Architecture Decision Records the company follows
// (and that ground the agents) plus the catalog of architecture diagrams.
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
import {
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

function DiagramCard({ d }: { d: Diagram }) {
  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[DIAGRAM_ICON[d.type]] ?? Icons.layers;
  return (
    <div className="fp-skill">
      <div className="fp-skill-top">
        <span className="fp-skill-ic" aria-hidden="true"><Icon size={18} /></span>
        <Pill tone="neutral">{d.type}</Pill>
      </div>
      <span className="fp-skill-name">{d.title}</span>
      <p className="fp-skill-desc">{d.scope} · {d.format}</p>
      <div className="fp-skill-actions">
        <Button variant="outline" size="sm"><Icons.maximize size={12} /> Open</Button>
        <span className="fp-skill-ver">{d.updated}</span>
      </div>
    </div>
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
        </Tabs>
      </div>
    </>
  );
}
