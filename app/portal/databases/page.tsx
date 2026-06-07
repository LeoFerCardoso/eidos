'use client';
// Forge — Database catalog, built for the data team. Every database and table in
// use, led by what data engineers manage: engine, size + growth, table/row
// counts, PII/LGPD exposure and ownership.
//
// Brief — Persona: data engineers / data platform. Question: what data do we
// hold, how big and how fast is it growing, which stores carry PII, and who
// owns them? Data: DATABASES + TOP_TABLES (src/portal/data/databases.ts).
// Primary action: open a database / filter by engine. Distinctive move: storage
// by engine + the largest tables surfaced, with PII flags throughout, plus a
// Forge AI read on the biggest cost-and-risk store.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { AiPattern } from '@/portal/shell/ai-pattern';
import {
  AI_READ,
  DATABASES,
  ENGINE_MIX,
  ENGINES,
  KPIS,
  STATUS_TONE,
  TOP_TABLES,
  fmtRows,
  fmtSize,
  type DbEnv,
  type Engine,
} from '@/portal/data/databases';

const ENGINE_OPTS = [{ value: 'all', label: 'All engines' }, ...ENGINES.map((e) => ({ value: e, label: e }))];
const ENV_OPTS = [
  { value: 'all', label: 'All environments' },
  { value: 'prod', label: 'Production' },
  { value: 'staging', label: 'Staging' },
];
const maxEngine = Math.max(...ENGINE_MIX.map((e) => e.sizeGb));

// Forge AI pattern banner (cloned from the AI-Insights hero) — session-only
// dismiss so it returns on refresh.
function DataBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;
  return (
    <div className="fp-aip-banner" role="note">
      <AiPattern />
      <div className="fp-aip-banner-text">
        <span className="fp-aip-banner-eyebrow">Forge AI</span>
        <strong className="fp-aip-banner-title">{AI_READ.title}</strong>
        <p className="fp-aip-banner-desc">
          <span className="fp-aip-hl mono">analytics_dw</span> on <span className="fp-aip-hl">BigQuery</span> is our biggest store at{' '}
          <span className="fp-aip-hl">18.4 TB</span> and up <span className="fp-aip-hl">14% MoM</span>, yet holds no PII.{' '}
          <span className="fp-aip-hl mono">score_features</span> on <span className="fp-aip-hl">Snowflake</span> (<span className="fp-aip-hl">9.9 TB</span>) does, and feeds every score.{' '}
          A retention policy on <span className="fp-aip-hl mono">analytics_dw</span> partitions over 18 months cuts cost without touching regulated data.
        </p>
        <Button variant="outline" size="sm" className="fp-aip-banner-cta">Review retention</Button>
      </div>
      <button type="button" className="fp-aip-banner-close" onClick={() => setDismissed(true)} aria-label="Dismiss banner">
        <Icons.x size={16} />
      </button>
    </div>
  );
}

export default function DatabasesPage() {
  const [query, setQuery] = React.useState('');
  const [engine, setEngine] = React.useState('all');
  const [env, setEnv] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = DATABASES;
    if (engine !== 'all') list = list.filter((d) => d.engine === (engine as Engine));
    if (env !== 'all') list = list.filter((d) => d.env === (env as DbEnv));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q) || d.engine.toLowerCase().includes(q));
    }
    return list;
  }, [query, engine, env]);

  return (
    <>
      <FPageHeader
        eyebrow="Catalog"
        title="Databases"
        subtitle={`${DATABASES.length} databases · ${DATABASES.reduce((m, d) => m + d.tables, 0).toLocaleString('en-US')} tables · ${DATABASES.filter((d) => d.pii).length} hold PII`}
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.plus size={13} /> Register database</Button>
          </>
        }
      />

      <DataBanner />

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="fp-grid fp-grid-2" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Storage by engine</div>
          </div>
          <ul className="fp-engine-list">
            {ENGINE_MIX.map((e) => (
              <li key={e.engine} className="fp-engine">
                <span className="fp-engine-name"><span className="fp-mix-dot" style={{ background: e.color }} /> {e.engine}</span>
                <span className="fp-engine-bar"><span className="fp-engine-fill" style={{ inlineSize: `${(e.sizeGb / maxEngine) * 100}%`, background: e.color }} /></span>
                <span className="fp-engine-val mono">{fmtSize(e.sizeGb)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Largest tables</div>
            <span className="fp-card-meta">by size</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr><th>Table</th><th>Database</th><th style={{ textAlign: 'end' }}>Rows</th><th style={{ textAlign: 'end' }}>Size</th></tr>
              </thead>
              <tbody>
                {TOP_TABLES.map((t) => (
                  <tr key={t.name}>
                    <td className="mono" style={{ fontWeight: 600 }}>{t.name}{t.pii && <span className="fp-pii">PII</span>}</td>
                    <td className="mono" style={{ color: 'var(--fg-muted)' }}>{t.db}</td>
                    <td className="mono" style={{ textAlign: 'end' }}>{fmtRows(t.rowsM)}</td>
                    <td className="mono" style={{ textAlign: 'end' }}>{fmtSize(t.sizeGb)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search databases, owners…" aria-label="Search databases" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={engine} onValueChange={setEngine} options={ENGINE_OPTS} width="160px" />
        </span>
        <span className="fp-filter-select">
          <Select value={env} onValueChange={setEnv} options={ENV_OPTS} width="160px" />
        </span>
      </div>

      <FSection title="Databases" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Database</th>
                  <th>Env</th>
                  <th>Region</th>
                  <th style={{ textAlign: 'end' }}>Size</th>
                  <th style={{ textAlign: 'end' }}>Tables</th>
                  <th style={{ textAlign: 'end' }}>Rows</th>
                  <th style={{ textAlign: 'end' }}>30d</th>
                  <th>Owner</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const st = STATUS_TONE[d.status];
                  return (
                    <tr key={d.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {d.service ? <Link href={`/portal/catalog/${d.service}`} className="u-link">{d.name}</Link> : d.name}
                          {d.pii && <span className="fp-pii">PII</span>}
                        </span>
                        <span className="fp-cell-sub" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span className="fp-mix-dot" style={{ background: 'var(--fg-faint)', inlineSize: 7, blockSize: 7 }} />{d.engine}
                        </span>
                      </td>
                      <td><Pill tone={d.env === 'prod' ? 'ember' : 'neutral'}>{d.env}</Pill></td>
                      <td className="mono" style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{d.region}</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{fmtSize(d.sizeGb)}</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{d.tables || 'n/a'}</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{fmtRows(d.rowsM)}</td>
                      <td className="mono" style={{ textAlign: 'end', color: d.growth < 0 ? 'var(--danger)' : d.growth > 8 ? 'var(--warning)' : 'var(--fg-muted)' }}>{d.growth > 0 ? '+' : ''}{d.growth}%</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{d.owner}</td>
                      <td style={{ textAlign: 'end' }}><Pill tone={st.tone} dot live={d.status === 'degraded'}>{st.label}</Pill></td>
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
          <span>No databases match this filter.</span>
        </div>
      )}
    </>
  );
}
