'use client';
// Forge — Cloud resources + FinOps. Every cloud resource the bureau runs, with
// a FinOps view, each resource linking to the page that owns it.
//
// Brief — Persona: platform / FinOps / SRE. Question: what do we run in the
// cloud, what does it cost, where is the waste, and where do I go to manage a
// resource? Data: RESOURCES (src/portal/data/cloud-resources.ts). Primary
// action: open a resource in its owning surface / cut idle spend. Distinctive
// move: one inventory across every resource type with spend breakdowns and
// cross-links (a service to its catalog page, a database to the database
// catalog, a bucket to buckets), plus a Forge AI read on the cost leaks.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  AI_READ,
  KPIS,
  RESOURCES,
  SPEND_BY_PRODUCT,
  SPEND_BY_TYPE,
  STATUS_META,
  TYPES,
  TYPE_ICON,
  fmtBrl,
  resourceLink,
  type ResStatus,
  type ResType,
} from '@/portal/data/cloud-resources';

const TYPE_OPTS = [{ value: 'all', label: 'All types' }, ...TYPES.map((t) => ({ value: t, label: t }))];
const STATUS_OPTS = [
  { value: 'all', label: 'All status' },
  { value: 'running', label: 'Running' },
  { value: 'idle', label: 'Idle' },
  { value: 'error', label: 'Error' },
];

export default function CloudResourcesPage() {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = RESOURCES;
    if (type !== 'all') list = list.filter((r) => r.type === (type as ResType));
    if (status !== 'all') list = list.filter((r) => r.status === (status as ResStatus));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.type.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => b.costMo - a.costMo);
  }, [query, type, status]);

  return (
    <>
      <FPageHeader
        eyebrow="Catalog"
        title="Cloud Resources"
        subtitle="Every cloud resource in one place with its cost, and a clear path to trim the waste."
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.gauge size={13} /> FinOps report</Button>
          </>
        }
      />

      <AiBanner title={AI_READ.title} action="Cut idle spend">
        Three idle resources cost <span className="fp-aip-hl">R$ 7.5k/mo</span> for nothing, and <span className="fp-aip-hl mono">ocr-batch-fn</span> is up <span className="fp-aip-hl">22%</span> and erroring. Fixing it and stopping the idle three trims ~<span className="fp-aip-hl">R$ 11k/mo</span> without touching production.
      </AiBanner>

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value" style={k.id === 'idle' ? { color: 'var(--warning)' } : undefined}>{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="fp-grid fp-grid-2" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <div className="fp-card-head"><div className="fp-card-title">Spend by type</div><span className="fp-card-meta">monthly</span></div>
          <ul className="fp-engine-list">
            {SPEND_BY_TYPE.map((s) => (
              <li key={s.key} className="fp-engine">
                <span className="fp-engine-name">{s.key}</span>
                <span className="fp-engine-bar"><span className="fp-engine-fill" style={{ inlineSize: `${s.pct}%`, background: 'var(--ember)' }} /></span>
                <span className="fp-engine-val mono">{fmtBrl(s.cost)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fp-card">
          <div className="fp-card-head"><div className="fp-card-title">Spend by product</div><span className="fp-card-meta">monthly</span></div>
          <ul className="fp-engine-list">
            {SPEND_BY_PRODUCT.map((s) => (
              <li key={s.key} className="fp-engine">
                <span className="fp-engine-name">{s.key}</span>
                <span className="fp-engine-bar"><span className="fp-engine-fill" style={{ inlineSize: `${s.pct}%`, background: 'var(--accent-2)' }} /></span>
                <span className="fp-engine-val mono">{fmtBrl(s.cost)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search resources, products, types…" aria-label="Search resources" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={type} onValueChange={setType} options={TYPE_OPTS} width="160px" />
        </span>
        <span className="fp-filter-select">
          <Select value={status} onValueChange={setStatus} options={STATUS_OPTS} width="140px" />
        </span>
      </div>

      <FSection title="Resources" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Type</th>
                  <th>Provider</th>
                  <th>Region</th>
                  <th>Product</th>
                  <th style={{ textAlign: 'end' }}>Cost / mo</th>
                  <th style={{ textAlign: 'end' }}>30d</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[TYPE_ICON[r.type]] ?? Icons.server;
                  const sm = STATUS_META[r.status];
                  const href = resourceLink(r);
                  return (
                    <tr key={r.id} className={r.status === 'error' ? 'fp-row-flag' : undefined}>
                      <td>
                        <span className="fp-actor">
                          <span className="fp-actor-ic"><Icon size={13} /></span>
                          {href ? (
                            <Link href={href} className="u-link" style={{ fontWeight: 600 }}>
                              {r.name} <Icons.chevronRight size={11} style={{ verticalAlign: 'middle', opacity: 0.6 } as React.CSSProperties} />
                            </Link>
                          ) : (
                            <span style={{ fontWeight: 600 }}>{r.name}</span>
                          )}
                        </span>
                      </td>
                      <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{r.type}</td>
                      <td className="mono" style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{r.provider}</td>
                      <td className="mono" style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{r.region}</td>
                      <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{r.product}</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{fmtBrl(r.costMo)}</td>
                      <td className="mono" style={{ textAlign: 'end', color: r.trend < 0 ? 'var(--success)' : r.trend > 10 ? 'var(--danger)' : 'var(--fg-muted)' }}>{r.trend > 0 ? '+' : ''}{r.trend}%</td>
                      <td style={{ textAlign: 'end' }}><Pill tone={sm.tone} dot live={r.status === 'error'}>{sm.label}</Pill></td>
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
          <Icons.search size={18} />
          <span>No resources match this filter.</span>
        </div>
      )}
    </>
  );
}
