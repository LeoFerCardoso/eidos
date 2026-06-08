'use client';
// Forge - MCP server detail page (/portal/mcp-servers/[id]).
// Two-column .fp-agentd layout (reused from agent-detail): left main + rule +
// right aside. Left: server header, overview prose + install snippet, tools
// table. Right: Properties, Connected agents, Versions.
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Icons, Pill, Prose, ProseCode, Button, CopyChip,
} from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import {
  SERVERS, STATUS_META, getServer, toolsFor, connectedAgentsFor, versionsFor, snippetFor,
  type McpServer,
} from '@/portal/data/mcp';

// ── Local helpers (not exported) ─────────────────────────────────────────────

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};

function AsideSection({
  title,
  count,
  action,
  children,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="fp-agentd-sec">
      <div className="fp-agentd-sec-head">
        <span className="t">{title}</span>
        {count !== undefined && <span className="fp-agentd-sec-count">{count}</span>}
        {action && <span className="fp-agentd-sec-action">{action}</span>}
      </div>
      {children}
    </section>
  );
}

function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="fp-agentd-empty">
      <span className="ic">{ICON(icon, 16)}</span>
      <span>{label}</span>
    </div>
  );
}

// ── Transport badge ───────────────────────────────────────────────────────────

const TRANSPORT_TONE: Record<McpServer['transport'], React.ComponentProps<typeof Pill>['tone']> = {
  HTTP:  'ice',
  SSE:   'ember',
  stdio: 'neutral',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function McpDetail({ id }: { id: string }) {
  const server = getServer(id);
  const router = useRouter();
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (server) setCrumb({ label: server.name, replace: true });
    return () => setCrumb(null);
  }, [server, setCrumb]);

  if (!server) {
    return (
      <div className="fp-agents-empty" style={{ padding: '64px 0' }}>
        <Icons.mcpServer size={28} />
        <p>No MCP server with id &ldquo;{id}&rdquo;.</p>
        <Button variant="ghost" asChild>
          <Link href="/portal/mcp-servers">
            <Icons.chevronLeft size={13} /> Back to MCP servers
          </Link>
        </Button>
      </div>
    );
  }

  const st = STATUS_META[server.status];
  const tools = toolsFor(id);
  const connectedAgents = connectedAgentsFor(id);
  const versions = versionsFor(id);
  const snippet = snippetFor(id);

  const ServerIcon = (Icons as Record<string, React.FC<{ size?: number }>>)[server.icon] ?? Icons.server;

  // Build a plausible overview paragraph and connection description.
  const overviewText = `${server.name} is an Equifax-internal MCP adapter that exposes ${server.team} systems as a stable tool surface for Forge AI agents. It centralises authentication (${server.auth}), audit-logs every tool call, and enforces per-agent rate limits so consuming agents can operate without carrying credentials. The server runs ${tools.length} tools across the ${server.team} domain and is currently used by ${server.agents} agent connections.`;

  return (
    <div className="fp-agentd">
      {/* ── Left: header + content ── */}
      <div className="fp-agentd-main">
        <div className="fp-agentd-main-in">
          <div className="fp-agentd-head">
            <div className="fp-agentd-topbar">
              <Button variant="ghost" asChild>
                <Link href="/portal/mcp-servers">
                  <Icons.chevronLeft size={14} /> Back to MCP servers
                </Link>
              </Button>
              <div className="fp-agentd-topbar-actions">
                <Button variant="ghost" asChild>
                  <Link href={`https://docs.forge.equifax.com/mcp/${id}`} target="_blank" rel="noopener">
                    <Icons.book size={14} /> Docs
                  </Link>
                </Button>
                <Button variant="ember">
                  <Icons.plus size={14} /> Connect to agent
                </Button>
              </div>
            </div>

            <div className="fp-agentd-title">
              <span
                className="fp-agentd-server-ic"
                aria-hidden="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg-muted)',
                  flexShrink: 0,
                }}
              >
                <ServerIcon size={22} />
              </span>
              <h1>{server.name}</h1>
            </div>

            <p className="fp-agentd-summary">{server.desc}</p>
          </div>

          {/* Overview prose */}
          <Prose className="fp-agentd-instructions">
            <h2>Overview</h2>
            <p>{overviewText}</p>

            <h2>Connect</h2>
            <p>
              Add the server to your agent&apos;s MCP client config. The server uses{' '}
              <code>{server.transport}</code> transport and <code>{server.auth}</code>{' '}
              authentication. Copy the snippet below and replace the placeholder values
              with your credentials.
            </p>
            <ProseCode lang={snippet.lang}>{snippet.code}</ProseCode>

            <p>
              After adding the config, restart your agent runtime. The server will
              appear in the <em>Apps</em> section of the agent detail page once the
              connection is confirmed.
            </p>
          </Prose>

          {/* Tools table */}
          <section style={{ marginBlockStart: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBlockEnd: 10,
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--fg)',
                  letterSpacing: '-0.01em',
                }}
              >
                Tools
              </span>
              <span className="fp-agentd-sec-count">{tools.length}</span>
            </div>

            {tools.length === 0 ? (
              <EmptyState icon="toolCall" label="No tools defined for this server." />
            ) : (
              <div className="tbl-wrap">
                <table className="tbl" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Tool</th>
                      <th>Input params</th>
                      <th>Output type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tools.map((t) => (
                      <tr key={t.name}>
                        <td style={{ verticalAlign: 'top', paddingBlockStart: 10 }}>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 3,
                              maxWidth: 280,
                            }}
                          >
                            <span
                              className="mono"
                              style={{
                                color: 'var(--ember)',
                                fontWeight: 600,
                                fontSize: 'var(--text-sm)',
                              }}
                            >
                              {t.name}
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--fg-muted)',
                                lineHeight: 1.45,
                              }}
                            >
                              {t.desc}
                            </span>
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'top', paddingBlockStart: 10 }}>
                          {t.input ? (
                            <span
                              className="mono"
                              style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}
                            >
                              {t.input}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)' }}>
                              none
                            </span>
                          )}
                        </td>
                        <td style={{ verticalAlign: 'top', paddingBlockStart: 10 }}>
                          <span
                            className="mono"
                            style={{ color: 'var(--accent-2)', fontSize: 'var(--text-sm)' }}
                          >
                            {t.output}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="fp-agentd-rule" aria-hidden="true" />

      {/* ── Right: metadata sidebar ── */}
      <aside className="fp-agentd-aside">
        {/* Properties */}
        <AsideSection title="Properties">
          <dl className="fp-agentd-props">
            <dt>Team</dt>
            <dd>{server.team}</dd>
            <dt>Transport</dt>
            <dd>
              <Pill tone={TRANSPORT_TONE[server.transport]}>{server.transport}</Pill>
            </dd>
            <dt>Auth</dt>
            <dd>{server.auth}</dd>
            <dt>Version</dt>
            <dd className="mono">{server.version}</dd>
            <dt>Status</dt>
            <dd>
              <Pill tone={st.tone} dot={server.status === 'live'}>
                {st.label}
              </Pill>
            </dd>
            <dt>Tools</dt>
            <dd className="mono">{server.tools}</dd>
            <dt>Agent connections</dt>
            <dd className="mono">{server.agents}</dd>
          </dl>
        </AsideSection>

        {/* Connected agents */}
        <AsideSection title="Connected agents" count={connectedAgents.length}>
          {connectedAgents.length === 0 ? (
            <EmptyState icon="sparkle" label="No agent connections yet." />
          ) : (
            <div className="fp-agentd-list">
              {connectedAgents.map((name) => (
                <div key={name} className="item">
                  <span className="ic">{ICON('sparkle', 14)}</span>
                  <span className="tx">
                    <span className="nm">{name}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </AsideSection>

        {/* Versions */}
        <AsideSection title="Versions" count={versions.length}>
          {versions.length === 0 ? (
            <EmptyState icon="clock" label="No version history." />
          ) : (
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
          )}
        </AsideSection>
      </aside>
    </div>
  );
}
