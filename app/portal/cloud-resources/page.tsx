'use client';
// Forge — Cloud resources + FinOps. Every cloud resource the bureau runs, with
// a FinOps view, each resource linking to the page that owns it.
//
// Brief — Persona: platform / FinOps / SRE. Question: what do we run in the
// cloud, what does it cost, where is the waste, and where do I go to manage a
// resource? Data: RESOURCES (src/portal/data/cloud-resources.ts). Primary
// action: open a resource in its owning surface / cut idle spend. Distinctive
// move: one inventory across every resource type with spend breakdowns,
// utilization/idle signals, cross-links (service -> catalog, database ->
// databases, bucket -> buckets), plus a Forge AI read on the cost leaks.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Chip, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import { MetricChartCard } from '@/portal/shell/viz';
import {
  AI_READ,
  ACCOUNTS,
  KPIS,
  RESOURCES,
  SPEND_BY_PRODUCT,
  SPEND_BY_TYPE,
  STATUS_META,
  TYPES,
  TYPE_ICON,
  fmtBrl,
  resourceLink,
  utilBand,
  type ResStatus,
  type ResType,
  SPEND_TREND,
  SPEND_TREND_PREV,
} from '@/portal/data/cloud-resources';

const TYPE_OPTS = [{ value: 'all', label: 'All types' }, ...TYPES.map((t) => ({ value: t, label: t }))];
const STATUS_OPTS = [
  { value: 'all', label: 'All status' },
  { value: 'running', label: 'Running' },
  { value: 'idle', label: 'Idle' },
  { value: 'error', label: 'Error' },
];
const ACCOUNT_OPTS = [{ value: 'all', label: 'All accounts' }, ...ACCOUNTS.map((a) => ({ value: a, label: a }))];
const GROUP_OPTS = [
  { value: 'none', label: 'No grouping' },
  { value: 'type', label: 'Group by type' },
  { value: 'product', label: 'Group by product' },
  { value: 'account', label: 'Group by account' },
];

/** Small inline utilization bar with label. */
function UtilBar({ pct }: { pct: number }) {
  const band = utilBand(pct);
  const isLow = pct < 30;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minInlineSize: 72 }}>
      <div
        style={{
          blockSize: 5,
          borderRadius: 'var(--radius-full)',
          background: 'var(--surface-active)',
          overflow: 'hidden',
          inlineSize: 72,
        }}
      >
        <div
          style={{
            blockSize: '100%',
            inlineSize: `${pct}%`,
            background: band.color,
            borderRadius: 'var(--radius-full)',
          }}
        />
      </div>
      <span
        className="mono"
        style={{
          fontSize: 'var(--text-xs)',
          color: isLow ? 'var(--fg-faint)' : band.color,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

/** Tag list — up to 2 visible, rest collapsed. */
function TagList({ tags }: { tags: string[] }) {
  const visible = tags.slice(0, 2);
  const overflow = tags.length - visible.length;
  return (
    <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      {visible.map((t) => (
        <Chip key={t} tone="neutral" style={{ fontSize: 'var(--text-xs)' }}>
          {t}
        </Chip>
      ))}
      {overflow > 0 && (
        <Chip tone="neutral" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
          +{overflow}
        </Chip>
      )}
    </div>
  );
}

/** Idle badge — shown for resources with status=idle or util<10. */
function IdleBadge() {
  return (
    <Pill tone="warning" style={{ fontSize: 'var(--text-xs)', paddingInline: 6 }}>
      Idle
    </Pill>
  );
}

export default function CloudResourcesPage() {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [account, setAccount] = React.useState('all');
  const [groupBy, setGroupBy] = React.useState('none');

  const filtered = React.useMemo(() => {
    let list = RESOURCES;
    if (type !== 'all') list = list.filter((r) => r.type === (type as ResType));
    if (status !== 'all') list = list.filter((r) => r.status === (status as ResStatus));
    if (account !== 'all') list = list.filter((r) => r.account === account);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.product.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.team.toLowerCase().includes(q) ||
          r.account.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return [...list].sort((a, b) => b.costMo - a.costMo);
  }, [query, type, status, account]);

  // Group the filtered list by the chosen key.
  const grouped = React.useMemo(() => {
    if (groupBy === 'none') return [{ key: '', rows: filtered }];
    const map = new Map<string, typeof filtered>();
    for (const r of filtered) {
      const k =
        groupBy === 'type'
          ? r.type
          : groupBy === 'product'
          ? r.product
          : r.account;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(r);
    }
    return [...map.entries()]
      .map(([key, rows]) => ({ key, rows }))
      .sort((a, b) => b.rows.reduce((s, r) => s + r.costMo, 0) - a.rows.reduce((s, r) => s + r.costMo, 0));
  }, [filtered, groupBy]);

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
        Three idle resources cost <span className="fp-aip-hl">R$ 7.5k/mo</span> for nothing, and{' '}
        <span className="fp-aip-hl mono">ocr-batch-fn</span> is up{' '}
        <span className="fp-aip-hl">22%</span> and erroring. Fixing it and stopping the idle three trims ~
        <span className="fp-aip-hl">R$ 11k/mo</span> without touching production.
      </AiBanner>

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value" style={k.id === 'idle' ? { color: 'var(--warning)' } : undefined}>
              {k.value}
            </div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Spend breakdown + the 30-day trend against last month's ghost. */}
      <div className="fp-grid fp-grid-2" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)', alignItems: 'stretch' }}>
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Spend by type</div>
            <span className="fp-card-meta">monthly</span>
          </div>
          <ul className="fp-engine-list">
            {SPEND_BY_TYPE.map((s) => (
              <li key={s.key} className="fp-engine">
                <span className="fp-engine-name">{s.key}</span>
                <span className="fp-engine-bar">
                  <span className="fp-engine-fill" style={{ inlineSize: `${s.pct}%`, background: 'var(--accent-2)' }} />
                </span>
                <span className="fp-engine-val mono">{fmtBrl(s.cost)}</span>
              </li>
            ))}
          </ul>
        </div>
        <MetricChartCard
          label="Total spend · 30d"
          value="R$ 9.6k/day"
          delta={{ label: '+9.5% MoM', good: false }}
          note="Prior month as the dashed ghost. The step on day 13 is the analytics_dw scan growth."
          series={SPEND_TREND}
          prev={SPEND_TREND_PREV}
        />
      </div>

      {/* Toolbar */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minInlineSize: 240, maxInlineSize: 380, display: 'flex' }}>
          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Search name, product, team, tag..."
            aria-label="Search resources"
            className="fluid"
          />
        </div>
        <span className="fp-filter-select">
          <Select value={type} onValueChange={setType} options={TYPE_OPTS} width="150px" />
        </span>
        <span className="fp-filter-select">
          <Select value={status} onValueChange={setStatus} options={STATUS_OPTS} width="140px" />
        </span>
        <span className="fp-filter-select">
          <Select value={account} onValueChange={setAccount} options={ACCOUNT_OPTS} width="180px" />
        </span>
        <span className="fp-filter-select">
          <Select value={groupBy} onValueChange={setGroupBy} options={GROUP_OPTS} width="160px" />
        </span>
      </div>

      {/* Resource table — optionally grouped */}
      <FSection title="Resources" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        {grouped.map(({ key: groupKey, rows }) => (
          <div key={groupKey || '__all'} style={{ marginBlockEnd: groupBy !== 'none' ? 20 : 0 }}>
            {/* Group header row */}
            {groupBy !== 'none' && groupKey && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingBlock: '8px 6px',
                  paddingInline: 2,
                  borderBlockEnd: '1px solid var(--border)',
                  marginBlockEnd: 0,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{groupKey}</span>
                <Chip tone="neutral" style={{ fontSize: 'var(--text-xs)' }}>{rows.length}</Chip>
                <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', marginInlineStart: 'auto' }}>
                  {fmtBrl(rows.reduce((s, r) => s + r.costMo, 0))} / mo
                </span>
              </div>
            )}

            <div className="fp-card" style={{ padding: 0 }}>
              <div className="tbl-wrap">
                <table className="tbl" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Type</th>
                      <th>Spec</th>
                      <th>Account · Region</th>
                      <th>Team</th>
                      <th>Tags</th>
                      <th>Util</th>
                      <th style={{ textAlign: 'end' }}>Cost / mo</th>
                      <th style={{ textAlign: 'end' }}>30d</th>
                      <th style={{ textAlign: 'end' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[TYPE_ICON[r.type]] ?? Icons.server;
                      const sm = STATUS_META[r.status];
                      const href = resourceLink(r);
                      const isIdle = r.status === 'idle' || r.util < 10;
                      const isError = r.status === 'error';
                      return (
                        <tr
                          key={r.id}
                          className={isError ? 'fp-row-flag' : undefined}
                          style={isIdle && !isError ? { background: 'color-mix(in oklch, var(--warning) 5%, transparent)' } : undefined}
                        >
                          {/* Resource name + link */}
                          <td>
                            <span className="fp-actor">
                              <span className="fp-actor-ic"><Icon size={13} /></span>
                              {href ? (
                                <Link href={href} className="fp-entity-link" style={{ fontWeight: 600 }}>
                                  {r.name}{' '}
                                  <Icons.chevronRight
                                    size={11}
                                    style={{ verticalAlign: 'middle', opacity: 0.6 } as React.CSSProperties}
                                  />
                                </Link>
                              ) : (
                                <span style={{ fontWeight: 600 }}>{r.name}</span>
                              )}
                              {isIdle && <IdleBadge />}
                            </span>
                          </td>

                          {/* Type */}
                          <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>
                            {r.type}
                          </td>

                          {/* Spec */}
                          <td
                            className="mono"
                            style={{
                              color: 'var(--fg-faint)',
                              fontSize: 'var(--text-xs)',
                              maxInlineSize: 140,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={r.spec}
                          >
                            {r.spec}
                          </td>

                          {/* Account + Region */}
                          <td>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                                {r.account}
                              </span>
                              <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
                                {r.region}
                              </span>
                            </span>
                          </td>

                          {/* Team */}
                          <td style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                            {r.team}
                          </td>

                          {/* Tags */}
                          <td>
                            <TagList tags={r.tags} />
                          </td>

                          {/* Utilization bar */}
                          <td>
                            <UtilBar pct={r.util} />
                          </td>

                          {/* Cost */}
                          <td className="mono" style={{ textAlign: 'end' }}>
                            {fmtBrl(r.costMo)}
                          </td>

                          {/* Trend */}
                          <td
                            className="mono"
                            style={{
                              textAlign: 'end',
                              color:
                                r.trend < 0
                                  ? 'var(--success)'
                                  : r.trend > 10
                                  ? 'var(--danger)'
                                  : 'var(--fg-muted)',
                            }}
                          >
                            {r.trend > 0 ? '+' : ''}
                            {r.trend}%
                          </td>

                          {/* Status */}
                          <td style={{ textAlign: 'end' }}>
                            <Pill tone={sm.tone} dot live={r.status === 'error'}>
                              {sm.label}
                            </Pill>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div
                style={{
                  padding: '10px 16px',
                  borderBlockStart: '1px solid var(--border)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg-faint)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  {rows.length} resource{rows.length !== 1 ? 's' : ''}
                  {rows.length < RESOURCES.length ? ` of ${RESOURCES.length} total` : ''}
                </span>
                <span className="mono">
                  {fmtBrl(rows.reduce((s, r) => s + r.costMo, 0))} / mo
                </span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="fp-empty" style={{ marginBlockStart: 16 }}>
            <Icons.search size={18} />
            <span>No resources match this filter.</span>
          </div>
        )}
      </FSection>
    </>
  );
}
