// Forge (IDP Portal) — MCP server catalog (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/mcp-servers — every Model Context Protocol server built by the
// internal teams, exposing bureau systems as tools agents can call. Each links
// adoption (how many agents use it) to its team. Mock but consistent.

export type Transport = 'stdio' | 'SSE' | 'HTTP';
export type McpStatus = 'live' | 'beta' | 'deprecated';

export interface McpServer {
  id: string;
  name: string;
  desc: string;
  team: string;
  icon: string;
  tools: number;
  agents: number;
  transport: Transport;
  auth: string;
  version: string;
  status: McpStatus;
}

export const TEAMS = ['SRE Platform', 'Data Platform', 'Anti-Fraud', 'Identity', 'Bureau Data', 'Decisioning'];

export const SERVERS: McpServer[] = [
  { id: 'github',     name: 'github-mcp',     desc: 'Repos, pull requests and Actions for every service.',     team: 'SRE Platform', icon: 'gitPullRequest', tools: 14, agents: 22, transport: 'HTTP', auth: 'OAuth',  version: 'v2.4.0', status: 'live' },
  { id: 'datadog',    name: 'datadog-mcp',    desc: 'Metrics, monitors, traces and logs across the estate.',   team: 'SRE Platform', icon: 'activity',       tools: 9,  agents: 18, transport: 'SSE',  auth: 'API key', version: 'v3.1.1', status: 'live' },
  { id: 'k8s',        name: 'k8s-mcp',        desc: 'Workloads, rollouts and scaling on GKE.',                 team: 'SRE Platform', icon: 'server',         tools: 11, agents: 12, transport: 'HTTP', auth: 'mTLS',   version: 'v1.8.0', status: 'live' },
  { id: 'pagerduty',  name: 'pagerduty-mcp',  desc: 'On-call schedules, incidents and escalation.',            team: 'SRE Platform', icon: 'bell',           tools: 7,  agents: 9,  transport: 'HTTP', auth: 'OAuth',  version: 'v1.2.3', status: 'live' },
  { id: 'terraform',  name: 'terraform-mcp',  desc: 'Plans, state and applies for cloud infra.',               team: 'SRE Platform', icon: 'layers',         tools: 6,  agents: 5,  transport: 'stdio',auth: 'mTLS',   version: 'v0.9.2', status: 'beta' },
  { id: 'bureau',     name: 'bureau-mcp',     desc: 'SCPC, Cadastro Positivo and bureau feeds as tools.',      team: 'Bureau Data',  icon: 'doc',            tools: 12, agents: 14, transport: 'HTTP', auth: 'mTLS',   version: 'v2.0.0', status: 'live' },
  { id: 'snowflake',  name: 'snowflake-mcp',  desc: 'Warehouse queries and schema introspection.',             team: 'Data Platform',icon: 'database',       tools: 8,  agents: 11, transport: 'HTTP', auth: 'OAuth',  version: 'v1.5.0', status: 'live' },
  { id: 'ignite',     name: 'ignite-mcp',     desc: 'Feature store reads and lineage for scoring.',            team: 'Data Platform',icon: 'database',       tools: 5,  agents: 6,  transport: 'SSE',  auth: 'API key', version: 'v0.7.1', status: 'beta' },
  { id: 'konduto',    name: 'konduto-mcp',    desc: 'Antifraud rules, simulation and decisions.',              team: 'Anti-Fraud',   icon: 'shield',         tools: 10, agents: 8,  transport: 'HTTP', auth: 'mTLS',   version: 'v1.3.0', status: 'live' },
  { id: 'identity',   name: 'identity-mcp',   desc: 'KYC, document and biometric verification tools.',         team: 'Identity',     icon: 'eye',            tools: 7,  agents: 5,  transport: 'HTTP', auth: 'mTLS',   version: 'v1.1.0', status: 'live' },
  { id: 'consent',    name: 'consent-mcp',    desc: 'LGPD consent-scope checks for agent actions.',            team: 'Identity',     icon: 'compliance',     tools: 4,  agents: 16, transport: 'HTTP', auth: 'mTLS',   version: 'v2.1.0', status: 'live' },
  { id: 'decision',   name: 'decision-mcp',   desc: 'Run and explain decisioning policies.',                   team: 'Decisioning',  icon: 'score',          tools: 6,  agents: 4,  transport: 'stdio',auth: 'API key', version: 'v0.4.0', status: 'beta' },
  { id: 'legacy-soap',name: 'legacy-soap-mcp',desc: 'Bridge to the legacy SOAP decisioning bus.',              team: 'Decisioning',  icon: 'braces',         tools: 3,  agents: 2,  transport: 'stdio',auth: 'API key', version: 'v0.2.0', status: 'deprecated' },
];

export const STATUS_META: Record<McpStatus, { label: string; tone: 'health-up' | 'ice' | 'warning' }> = {
  live: { label: 'Live', tone: 'health-up' },
  beta: { label: 'Beta', tone: 'ice' },
  deprecated: { label: 'Deprecated', tone: 'warning' },
};

export const KPIS = [
  { id: 'servers', label: 'MCP servers', value: String(SERVERS.length), note: `Built by ${TEAMS.length} teams.` },
  { id: 'tools', label: 'Tools exposed', value: String(SERVERS.reduce((m, s) => m + s.tools, 0)), note: 'Callable by agents.' },
  { id: 'agents', label: 'Agent connections', value: String(SERVERS.reduce((m, s) => m + s.agents, 0)), note: 'Across all agents.' },
  { id: 'live', label: 'Live', value: String(SERVERS.filter((s) => s.status === 'live').length), note: 'Production-ready.' },
];
