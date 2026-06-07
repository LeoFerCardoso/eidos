'use client';
// Forge — Object storage catalog. Every bucket of files, images, videos,
// documents, backups and logs, including the cold, frozen and dead data that
// quietly costs money.
//
// Brief — Persona: platform + data + FinOps. Question: what do we store, how
// much does it cost, and what is dead weight we can reclaim? Data: BUCKETS
// (src/portal/data/buckets.ts). Primary action: stage a lifecycle/deletion
// policy on stale storage. Distinctive move: dead and frozen storage surfaced
// with the monthly cost to reclaim, plus a Forge AI read on what to delete.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  AI_READ,
  BUCKETS,
  CLASS_META,
  CLASS_MIX,
  KPIS,
  STALE,
  STATUS_META,
  fmtBrl,
  fmtObjects,
  fmtSize,
  type BucketStatus,
  type StorageClass,
} from '@/portal/data/buckets';

const STATUS_OPTS = [
  { value: 'all', label: 'All buckets' },
  { value: 'active', label: 'Active' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'dead', label: 'Dead' },
];

export default function BucketsPage() {
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = BUCKETS;
    if (status !== 'all') list = list.filter((b) => b.status === (status as BucketStatus));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((b) => b.name.toLowerCase().includes(q) || b.owner.toLowerCase().includes(q) || b.content.includes(q));
    }
    return list;
  }, [query, status]);

  return (
    <>
      <FPageHeader
        eyebrow="Catalog"
        title="Buckets"
        subtitle={`${BUCKETS.length} buckets · ${fmtSize(BUCKETS.reduce((m, b) => m + b.sizeGb, 0))} · ${BUCKETS.filter((b) => b.status === 'dead').length} dead`}
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.plus size={13} /> New bucket</Button>
          </>
        }
      />

      <AiBanner title={AI_READ.title} action="Stage cleanup">
        Three dead buckets hold <span className="fp-aip-hl">6.6 TB</span> and cost <span className="fp-aip-hl">R$ 4.1k/mo</span>, unread for over a year. <span className="fp-aip-hl mono">legacy-konduto-dump</span> and <span className="fp-aip-hl mono">tmp-ocr-scratch</span> carry PII, so delete them under retention.
      </AiBanner>

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value" style={k.id === 'dead' ? { color: 'var(--danger)' } : undefined}>{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="fp-grid fp-grid-2" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <div className="fp-card-head"><div className="fp-card-title">Storage by class</div></div>
          <ul className="fp-engine-list">
            {CLASS_MIX.map((c) => (
              <li key={c.klass} className="fp-engine">
                <span className="fp-engine-name"><span className="fp-mix-dot" style={{ background: c.color }} /> {c.label}</span>
                <span className="fp-engine-bar"><span className="fp-engine-fill" style={{ inlineSize: `${c.pct}%`, background: c.color }} /></span>
                <span className="fp-engine-val mono">{fmtSize(c.sizeGb)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Frozen & dead</div>
            <span className="fp-card-meta">top by cost</span>
          </div>
          <ul className="fp-signals">
            {STALE.map((b) => {
              const sm = STATUS_META[b.status];
              return (
                <li key={b.id} className="fp-signal">
                  <div className="fp-signal-id">
                    <span className="fp-signal-label">{b.name}{b.pii && <span className="fp-pii">PII</span>}</span>
                    <span className="fp-signal-detail">{fmtSize(b.sizeGb)} · last read {b.lastAccess}</span>
                  </div>
                  <span className="fp-stale-cost mono">{fmtBrl(b.costMo)}/mo</span>
                  <Pill tone={sm.tone}>{sm.label}</Pill>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search buckets, owners, content…" aria-label="Search buckets" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={status} onValueChange={setStatus} options={STATUS_OPTS} width="150px" />
        </span>
      </div>

      <FSection title="Buckets" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Bucket</th>
                  <th>Class</th>
                  <th style={{ textAlign: 'end' }}>Objects</th>
                  <th style={{ textAlign: 'end' }}>Size</th>
                  <th style={{ textAlign: 'end' }}>Last read</th>
                  <th>Owner</th>
                  <th style={{ textAlign: 'end' }}>Cost / mo</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const sm = STATUS_META[b.status];
                  const cm = CLASS_META[b.klass as StorageClass];
                  return (
                    <tr key={b.id} className={b.status === 'dead' ? 'fp-row-flag' : undefined}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{b.name}{b.pii && <span className="fp-pii">PII</span>}</span>
                        <span className="fp-cell-sub">{b.provider} · {b.content} · {b.region}</span>
                      </td>
                      <td><span className="fp-class"><span className="fp-mix-dot" style={{ background: cm.color }} /> {cm.label}</span></td>
                      <td className="mono" style={{ textAlign: 'end' }}>{fmtObjects(b.objects)}</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{fmtSize(b.sizeGb)}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)' }}>{b.lastAccess}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{b.owner}</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{fmtBrl(b.costMo)}</td>
                      <td style={{ textAlign: 'end' }}><Pill tone={sm.tone}>{sm.label}</Pill></td>
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
          <span>No buckets match this filter.</span>
        </div>
      )}
    </>
  );
}
