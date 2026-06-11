'use client';
// Forge - MCP server detail page (/portal/mcp-servers/[id]). Inspired by the
// example mcp-detail screen: a server overview, the full Tools list with call
// volume + latency, and the connection / activity / consumer info, plus the
// connect snippet. Single-column page (not the agent-detail two-column shell).
import * as React from 'react';
import {
  Icons, Pill, ProseCode, Button, CopyChip, HealthBadge, Sparkline, Avatar,
} from '@/ds/core';
import { FPageHeader, FSection, usePageCrumb } from '@/portal/shell/portal-shell';
import {
  STATUS_META, getServer, toolsFor, toolStat, connectedAgentsFor, connectionFor,
  activityFor, versionsFor, snippetFor,
  type McpServer, type McpStatus,
} from '@/portal/data/mcp';

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};

const HEALTH: Record<McpStatus, 'up' | 'degraded' | 'down'> = { live: 'up', beta: 'degraded', deprecated: 'down' };

const TRANSPORT_TONE: Record<McpServer['transport'], React.ComponentProps<typeof Pill>['tone']> = {
  HTTP: 'ice', SSE: 'ember', stdio: 'neutral',
};

export default function McpDetail({ id }: { id: string }) {
  const server = getServer(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (server) setCrumb({ label: server.name, replace: true });
    return () => setCrumb(null);
  }, [server, setCrumb]);

  if (!server) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <Icons.mcpServer size={28} />
        <span>
          No MCP server <span className="mono">{id}</span>.{' '}
          <a href="/portal/mcp-servers" className="u-link">Back to MCP servers</a>
        </span>
      </div>
    );
  }

  const st = STATUS_META[server.status];
  const tools = toolsFor(id);
  const agents = connectedAgentsFor(id);
  const versions = versionsFor(id);
  const snippet = snippetFor(id);
  const conn = connectionFor(id);
  const activity = activityFor(id);
  const ServerIcon = (Icons as Record<string, React.FC<{ size?: number }>>)[server.icon] ?? Icons.server;

  return (
    <>
      <FPageHeader
        back={{ href: '/portal/mcp-servers', label: 'MCP servers' }}
        title={server.name}
        status={<HealthBadge state={HEALTH[server.status]} />}
        subtitle={`${server.desc} Exposes ${server.team} systems as a stable tool surface for Forge AI agents.`}
        meta={
          <div className="fp-meta">
            <span className="fp-meta-chip mono">{server.version}</span>
            <span className="fp-meta-chip">{server.team}</span>
            <span className="fp-meta-chip"><Pill tone={TRANSPORT_TONE[server.transport]}>{server.transport}</Pill></span>
            <span className="fp-meta-chip"><Icons.key size={11} /> {server.auth}</span>
            <span className="fp-meta-chip"><Pill tone={st.tone} dot={server.status === 'live'}>{st.label}</Pill></span>
          </div>
        }
        actions={
          <>
            <Button variant="ghost"><Icons.refresh size={13} /> Refresh tools</Button>
            <Button variant="ghost"><Icons.book size={13} /> Docs</Button>
            <Button variant="ember"><Icons.plus size={13} /> Connect to agent</Button>
          </>
        }
      />

      {/* Overview */}
      <p className="fp-mcp-overview">
        <span className="fp-mcp-overview-ic" aria-hidden="true"><ServerIcon size={16} /></span>
        {server.name} centralises authentication ({server.auth}), audit-logs every tool call, and
        rate-limits per agent, so {agents.slice(0, 3).join(', ') || 'consuming agents'} can use {server.team} systems
        without each carrying credentials. It runs {tools.length} tools over {server.transport} and serves {server.agents} agent connections.
      </p>

      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start', marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {/* Main — Tools */}
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="fp-card-head" style={{ paddingBlock: 12, paddingInline: 16, borderBlockEnd: '1px solid var(--border)' }}>
            <div className="fp-card-title">Tools <span className="fp-agentd-sec-count">{tools.length}</span></div>
            <span className="fp-card-meta">callable by agents</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Input</th>
                  <th>Output</th>
                  <th style={{ textAlign: 'end' }}>Calls · 24h</th>
                  <th style={{ textAlign: 'end' }}>Avg latency</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((t) => {
                  const stat = toolStat(t.name);
                  return (
                    <tr key={t.name}>
                      <td style={{ verticalAlign: 'top', paddingBlockStart: 11 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 300 }}>
                          <span className="mono" style={{ color: 'var(--ember)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</span>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.45 }}>{t.desc}</span>
                        </div>
                      </td>
                      <td className="mono" style={{ verticalAlign: 'top', paddingBlockStart: 11, fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                        {t.input || <span style={{ color: 'var(--fg-faint)' }}>none</span>}
                      </td>
                      <td className="mono" style={{ verticalAlign: 'top', paddingBlockStart: 11, color: 'var(--accent-2)', fontSize: 'var(--text-sm)' }}>{t.output}</td>
                      <td style={{ verticalAlign: 'top', paddingBlockStart: 8 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', inlineSize: '100%' }}>
                          <span className="fp-mcp-spark"><Sparkline data={stat.spark} w={80} h={22} /></span>
                          <span className="mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>{stat.calls.toLocaleString('en-US')}</span>
                        </span>
                      </td>
                      <td className="mono" style={{ verticalAlign: 'top', paddingBlockStart: 11, textAlign: 'end', fontSize: 'var(--text-sm)' }}>{stat.latency}ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aside — Connection / Activity / Consumers / Versions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Connection</div>
              <HealthBadge state={HEALTH[server.status]} />
            </div>
            <dl className="fp-kv">
              <div className="fp-kv-row"><dt>Endpoint</dt><dd><CopyChip value={conn.endpoint} label={conn.endpoint} /></dd></div>
              <div className="fp-kv-row"><dt>Auth</dt><dd><Pill tone="ice"><Icons.key size={10} /> {server.auth}</Pill></dd></div>
              <div className="fp-kv-row"><dt>Rate limit</dt><dd className="mono">{conn.rateLimit}</dd></div>
              <div className="fp-kv-row"><dt>Last heartbeat</dt><dd className="mono">{conn.heartbeat}</dd></div>
              <div className="fp-kv-row"><dt>Uptime · 30d</dt><dd className="mono" style={{ color: server.status === 'deprecated' ? 'var(--warning)' : 'var(--success)' }}>{conn.uptime}</dd></div>
            </dl>
          </div>

          {activity.length > 0 && (
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Recent activity</div>
                <Pill tone="neutral" dot live>Live</Pill>
              </div>
              <div className="fp-rb">
                {activity.map((ev) => (
                  <div key={ev.id} className="fp-rb-row">
                    <span className="fp-rb-ic" style={{ color: ev.tone === 'done' ? 'var(--success)' : 'var(--fg-muted)' }}>{ICON(ev.icon, 14)}</span>
                    <span className="fp-rb-id">
                      <span className="fp-rb-name">{ev.title}</span>
                      <span className="fp-rb-meta">{ev.meta}</span>
                    </span>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', whiteSpace: 'nowrap' }}>{ev.at}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Consumers</div>
              <span className="fp-card-meta">{agents.length} agents</span>
            </div>
            <div className="fp-mcp-consumers">
              {agents.map((name) => (
                <span key={name} className="fp-mcp-consumer">
                  <Avatar name={name} size={24} />
                  <span className="nm">{name}</span>
                  <Pill tone="neutral">agent</Pill>
                </span>
              ))}
            </div>
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Versions</div>
              <span className="fp-card-meta">{versions.length}</span>
            </div>
            <div className="fp-agentd-versions">
              {versions.map((v) => (
                <div key={v.version + v.date} className="ver">
                  <span className="dot" aria-hidden="true" />
                  <div className="b">
                    <div className="top">
                      <code className="mono">{v.version}</code>
                      {v.current && <span className="cur">current</span>}
                      <span className="date">{v.date}</span>
                    </div>
                    <span className="note">{v.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Connect */}
      <FSection title="Connect" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <p className="fp-kpi-note" style={{ marginBlockEnd: 12 }}>
            Add the server to your agent&apos;s MCP client config over <code>{server.transport}</code> with{' '}
            <code>{server.auth}</code> auth, then restart the agent runtime. It appears in the agent&apos;s Apps once the connection is confirmed.
          </p>
          <ProseCode lang={snippet.lang}>{snippet.code}</ProseCode>
        </div>
      </FSection>
    </>
  );
}
