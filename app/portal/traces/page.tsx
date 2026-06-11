'use client';
// Forge — AI Traces. Every end-to-end agent execution (a chat turn, a workflow
// run step, an eval case) as an auditable, costed span tree.
//
// Brief — Persona: AI platform engineer + agent owner. Question: what did the
// fleet actually execute, what did it cost, and where is latency or failure
// concentrated? Data: TRACES (src/portal/data/traces.ts). Primary action: open
// a trace's span tree. Distinctive move: the Forge AI read correlates a
// degraded MCP server with the latency + score dip it causes.
//
// Table follows the portal grid-table rules: fixed tracks (no `auto` mid-grid),
// a mono header inside the same scroller, single-line cells, and horizontal
// scroll on narrow viewports.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import { MetricChartCard, TimeRange } from '@/portal/shell/viz';
import {
  AI_READ,
  COST_7D,
  COST_7D_PREV,
  ERRORS_7D,
  ERRORS_7D_PREV,
  P50_7D,
  P50_7D_PREV,
  SOURCE_META,
  TRACES,
  VOLUME_7D,
  VOLUME_7D_PREV,
  fmtMs,
  fmtTok,
  fmtUsd,
  type TraceSource,
  type TraceStatus,
} from '@/portal/data/traces';

const AGENT_OPTS = [
  { value: 'all', label: 'All agents' },
  ...[...new Set(TRACES.map((t) => t.agent))].map((a) => ({ value: a, label: a })),
];
const SOURCE_OPTS = [
  { value: 'all', label: 'All sources' },
  { value: 'chat', label: 'Chat' },
  { value: 'run', label: 'Runs' },
  { value: 'eval', label: 'Evals' },
  { value: 'automation', label: 'Automations' },
];
const STATUS_OPTS = [
  { value: 'all', label: 'All statuses' },
  { value: 'ok', label: 'OK' },
  { value: 'error', label: 'Error' },
];

export default function TracesPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [agent, setAgent] = React.useState('all');
  const [source, setSource] = React.useState('all');
  const [status, setStatus] = React.useState('all');

  // Progressive-loading demo (state-coverage): a short skeleton pass on the
  // first visit of the session, so the loading pattern is part of the mockup.
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (sessionStorage.getItem('fp-traces-seen')) { setLoading(false); return; }
    const t = setTimeout(() => {
      sessionStorage.setItem('fp-traces-seen', '1');
      setLoading(false);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = React.useMemo(() => {
    let list = TRACES;
    if (agent !== 'all') list = list.filter((t) => t.agent === agent);
    if (source !== 'all') list = list.filter((t) => t.source === (source as TraceSource));
    if (status !== 'all') list = list.filter((t) => t.status === (status as TraceStatus));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.includes(q) || t.root.toLowerCase().includes(q) ||
          t.agent.toLowerCase().includes(q) || (t.service ?? '').includes(q),
      );
    }
    return list;
  }, [query, agent, source, status]);

  return (
    <>
      <FPageHeader
        eyebrow="AI"
        title="Traces"
        subtitle="Every agent execution as a span tree: model calls, tool calls, scores, latency and cost."
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="outline"><Icons.checkCheck size={13} /> Evaluations</Button>
          </>
        }
      />

      <AiBanner title={AI_READ.title} action="Open runbook">
        <span className="fp-aip-hl mono">scr-layout.lookup</span> timed out in{' '}
        <span className="fp-aip-hl">6 traces</span> over the last 4h (scpc-gateway-mcp degraded):
        each retry adds <span className="fp-aip-hl">60s</span> of latency and online answer-fit on
        affected traces dipped <span className="fp-aip-hl">0.81 to 0.74</span>. Restarting the MCP
        server clears it.
      </AiBanner>

      {/* T2 Pulse strip: every number carries its 7-day shape and the prior
          week as the dashed ghost. */}
      <div className="fp-grid fp-grid-4">
        <MetricChartCard
          label="Traces / day"
          value="1,284"
          delta={{ label: '+19% wk', good: true }}
          note="Across 6 agents, 3 models."
          series={VOLUME_7D}
          prev={VOLUME_7D_PREV}
        />
        <MetricChartCard
          label="p50 latency"
          value="8.4s"
          delta={{ label: '+0.3s wk', good: false }}
          note="p95 21.4s, skewed by tool retries."
          series={P50_7D}
          prev={P50_7D_PREV}
        />
        <MetricChartCard
          label="Errored traces"
          value="16"
          delta={{ label: '+33% wk', good: false }}
          note="The Thu spike is scr-layout.lookup."
          series={ERRORS_7D}
          prev={ERRORS_7D_PREV}
        />
        <MetricChartCard
          label="Cost / day"
          value="$48.90"
          delta={{ label: '+23% wk', good: false }}
          note="Opus 4.7 is 71% of spend."
          series={COST_7D}
          prev={COST_7D_PREV}
        />
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minInlineSize: 200, maxInlineSize: 360, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search traces, agents, services..." aria-label="Search traces" className="fluid" />
        </div>
        <span className="fp-filter-select"><Select value={agent} onValueChange={setAgent} options={AGENT_OPTS} width="170px" /></span>
        <span className="fp-filter-select"><Select value={source} onValueChange={setSource} options={SOURCE_OPTS} width="150px" /></span>
        <span className="fp-filter-select"><Select value={status} onValueChange={setStatus} options={STATUS_OPTS} width="130px" /></span>
        <TimeRange value="7d" />
        <span className="fp-agents-count">{filtered.length} traces</span>
      </div>

      <div className="fp-tr-scroll">
        <div className="fp-tr-head">
          <span>Trace</span>
          <span>Root span</span>
          <span>Agent</span>
          <span>Source</span>
          <span className="num">Spans</span>
          <span className="num">Tokens</span>
          <span className="num">Cost</span>
          <span className="num">Latency</span>
          <span>Status</span>
          <span className="num">When</span>
          <span />
        </div>
        <div className="fp-tr-list">
          {loading &&
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="fp-tr-row is-skeleton" aria-hidden="true">
                {Array.from({ length: 10 }, (_, c) => <span key={c} className="fp-skel" />)}
                <span />
              </div>
            ))}
          {!loading && filtered.map((t) => {
            const src = SOURCE_META[t.source];
            const SrcIcon = Icons[src.icon as keyof typeof Icons];
            return (
              <button key={t.id} type="button" className="fp-tr-row" onClick={() => router.push(`/portal/traces/${t.id}`)}>
                <span className="tr-id mono">{t.id}</span>
                <span className="tr-root" title={t.root}>
                  {t.root}
                  {t.service && <span className="tr-svc mono">{t.service}</span>}
                </span>
                <span className="tr-agent" title={`${t.agent} · ${t.model}`}>
                  {t.agent}
                  <span className="tr-model mono">{t.model}</span>
                </span>
                <span className="tr-src"><SrcIcon size={12} /> {src.label}</span>
                <span className="tr-num mono">{t.spansCount}</span>
                <span className="tr-num mono">{fmtTok(t.tokensIn)} <span className="dim">to</span> {fmtTok(t.tokensOut)}</span>
                <span className="tr-num mono">{fmtUsd(t.cost)}</span>
                <span className="tr-num mono">{fmtMs(t.latencyMs)}</span>
                <span className="tr-status">
                  <Pill tone={t.status === 'error' ? 'danger' : 'success'}>{t.status}</Pill>
                </span>
                <span className="tr-num mono dim">{t.when}</span>
                <Icons.chevronRight size={13} className="tr-go" />
              </button>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div className="fp-empty" style={{ marginBlockStart: 16 }}>
              <Icons.search size={18} />
              <span>No traces match this filter.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
