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

export const getServer = (id: string): McpServer | undefined => SERVERS.find((s) => s.id === id);

// ── Per-server tool definitions ──────────────────────────────────────────────

export type ToolDef = {
  name: string;
  desc: string;
  input: string;
  output: string;
};

const TOOLS_BY_SERVER: Record<string, ToolDef[]> = {
  github: [
    { name: 'list_pull_requests', desc: 'List open pull requests for a repo, filtered by author or label.', input: 'repo · state? · author? · limit', output: 'PullRequest[]' },
    { name: 'create_issue',       desc: 'Open an issue with title, body, labels and assignees.', input: 'repo · title · body · labels?', output: 'Issue' },
    { name: 'get_file',           desc: 'Fetch raw file content at a given ref, supports binary blobs.', input: 'repo · path · ref?', output: 'FileBlob' },
    { name: 'search_code',        desc: 'Search code across all repos, ranked by recency and relevance.', input: 'q · repo? · path? · limit', output: 'CodeMatch[]' },
    { name: 'open_pr',            desc: 'Open a PR from a branch to default, auto-requests reviewers.', input: 'repo · head · base? · title · body', output: 'PullRequest' },
    { name: 'review_pr',          desc: 'Post review comments grouped by file and line range.', input: 'pr · comments[]', output: 'Review' },
    { name: 'comment_issue',      desc: 'Post a comment to an issue or PR thread.', input: 'issue_or_pr · body', output: 'Comment' },
    { name: 'list_workflows',     desc: 'List GitHub Actions workflows for a repo with last 30 runs.', input: 'repo', output: 'Workflow[]' },
    { name: 'trigger_workflow',   desc: 'Dispatch a workflow_run event with inputs, returns run id.', input: 'repo · workflow_id · ref · inputs?', output: 'RunRef' },
    { name: 'list_commits',       desc: 'List commits on a branch, filtered by author and date range.', input: 'repo · branch? · since? · author?', output: 'Commit[]' },
    { name: 'check_runs',         desc: 'List check runs for a commit, with status, conclusion and annotations.', input: 'repo · sha', output: 'CheckRun[]' },
    { name: 'merge_pr',           desc: 'Squash, rebase or merge a PR; respects branch protection rules.', input: 'pr · method · commit_title?', output: 'MergeResult' },
    { name: 'branch_protection',  desc: 'Read or update branch protection rules, audit-logged.', input: 'repo · branch · rule?', output: 'ProtectionRule' },
    { name: 'get_run_logs',       desc: 'Fetch stdout/stderr from a workflow run step.', input: 'repo · run_id · step?', output: 'RunLog' },
  ],
  datadog: [
    { name: 'query_metrics',     desc: 'Run a Datadog metrics query for a time range.', input: 'query · from · to', output: 'Series[]' },
    { name: 'list_monitors',     desc: 'List monitors filtered by tag, state or team.', input: 'tags? · state?', output: 'Monitor[]' },
    { name: 'mute_monitor',      desc: 'Mute a monitor for a given duration.', input: 'monitor_id · duration', output: 'MuteResult' },
    { name: 'search_logs',       desc: 'Search logs with a Datadog query string.', input: 'query · from · to · limit', output: 'LogEvent[]' },
    { name: 'get_trace',         desc: 'Fetch a distributed trace by trace id.', input: 'trace_id', output: 'Trace' },
    { name: 'list_dashboards',   desc: 'List all Datadog dashboards with title and URL.', input: 'q?', output: 'Dashboard[]' },
    { name: 'get_service_map',   desc: 'Fetch the APM service dependency map.', input: 'env?', output: 'ServiceMap' },
    { name: 'create_downtime',   desc: 'Schedule a maintenance downtime window.', input: 'scope · start · end · message', output: 'Downtime' },
    { name: 'list_incidents',    desc: 'List active incidents across the estate.', input: 'state? · severity?', output: 'Incident[]' },
  ],
  k8s: [
    { name: 'list_pods',          desc: 'List pods in a namespace, filtered by label selector.', input: 'namespace · selector?', output: 'Pod[]' },
    { name: 'describe_deployment', desc: 'Describe a deployment including rollout status and strategy.', input: 'namespace · name', output: 'Deployment' },
    { name: 'rollout_restart',    desc: 'Trigger a rolling restart for a deployment.', input: 'namespace · name', output: 'RolloutStatus' },
    { name: 'scale_deployment',   desc: 'Scale a deployment to the given replica count.', input: 'namespace · name · replicas', output: 'ScaleResult' },
    { name: 'get_events',         desc: 'Get recent Kubernetes events for a namespace or resource.', input: 'namespace · kind? · name?', output: 'Event[]' },
    { name: 'get_logs',           desc: 'Stream recent container logs (last N lines).', input: 'namespace · pod · container? · tail', output: 'LogLine[]' },
    { name: 'apply_manifest',     desc: 'Apply a YAML manifest to the cluster, dry-run by default.', input: 'manifest · dry_run?', output: 'ApplyResult' },
    { name: 'list_nodes',         desc: 'List cluster nodes with capacity and conditions.', input: 'selector?', output: 'Node[]' },
    { name: 'get_configmap',      desc: 'Read a ConfigMap value by key.', input: 'namespace · name · key?', output: 'ConfigMap' },
    { name: 'delete_pod',         desc: 'Force-delete a stuck or crash-looping pod.', input: 'namespace · pod · grace_period?', output: 'DeleteResult' },
    { name: 'top_pods',           desc: 'Get CPU and memory usage per pod in a namespace.', input: 'namespace · selector?', output: 'Metric[]' },
  ],
  pagerduty: [
    { name: 'list_incidents',      desc: 'List active incidents, filtered by service or urgency.', input: 'status? · service? · urgency?', output: 'Incident[]' },
    { name: 'get_incident',        desc: 'Fetch a single incident with timeline and notes.', input: 'id', output: 'Incident' },
    { name: 'acknowledge',         desc: 'Acknowledge an incident, silencing further notifications.', input: 'id', output: 'AckResult' },
    { name: 'resolve_incident',    desc: 'Mark an incident as resolved.', input: 'id · resolution', output: 'ResolveResult' },
    { name: 'escalate',            desc: 'Escalate an incident to the next on-call tier.', input: 'id · escalation_policy', output: 'EscalateResult' },
    { name: 'list_on_call',        desc: 'List who is currently on call for each schedule.', input: 'schedule?', output: 'OnCall[]' },
    { name: 'create_override',     desc: 'Create a temporary on-call override.', input: 'schedule · user · start · end', output: 'Override' },
  ],
  bureau: [
    { name: 'fetch_scpc_entry',    desc: 'Retrieve a SCPC negative-base entry by CPF.', input: 'cpf', output: 'ScpcEntry' },
    { name: 'fetch_scr_layout',    desc: 'Pull the latest SCR layout version and field schema.', input: 'version?', output: 'ScrLayout' },
    { name: 'reconcile_feed',      desc: 'Cross-check a bureau feed batch against the SCPC base.', input: 'feed_id · date', output: 'ReconcileReport' },
    { name: 'check_cadastro_positivo', desc: 'Check Cadastro Positivo coverage and consent status for a CPF.', input: 'cpf', output: 'CadposStatus' },
    { name: 'query_boa_vista',     desc: 'Query the Boa Vista credit feed for a given CPF.', input: 'cpf · product?', output: 'BoaVistaResponse' },
    { name: 'list_bureau_feeds',   desc: 'List active bureau feed contracts and their ingestion status.', input: 'team?', output: 'FeedContract[]' },
    { name: 'explain_divergence',  desc: 'Explain a SCPC/SCR divergence in plain language.', input: 'divergence_id', output: 'Explanation' },
    { name: 'get_consent_ledger',  desc: 'Read the consent ledger entries for a CPF.', input: 'cpf · scope?', output: 'ConsentEntry[]' },
    { name: 'validate_cpf',        desc: 'Validate CPF format and check against the negative-base.', input: 'cpf', output: 'CpfValidation' },
    { name: 'list_layouts',        desc: 'List all bureau layout versions registered in the system.', input: 'feed?', output: 'LayoutVersion[]' },
    { name: 'diff_layouts',        desc: 'Diff two bureau layout versions and list breaking field changes.', input: 'v1 · v2', output: 'LayoutDiff' },
    { name: 'refresh_feed_cache',  desc: 'Invalidate and re-fetch the cached bureau feed for a contract.', input: 'feed_id', output: 'CacheResult' },
  ],
  snowflake: [
    { name: 'run_query',           desc: 'Execute a SQL query and return rows as JSON.', input: 'sql · limit?', output: 'Row[]' },
    { name: 'describe_table',      desc: 'Describe a table schema including column types and nullability.', input: 'database · schema · table', output: 'TableSchema' },
    { name: 'list_tables',         desc: 'List tables in a schema matching an optional pattern.', input: 'database · schema · pattern?', output: 'TableRef[]' },
    { name: 'get_query_history',   desc: 'Fetch recent query history for a warehouse.', input: 'warehouse · limit?', output: 'QueryRecord[]' },
    { name: 'explain_query',       desc: 'Return the query profile and cost estimate for a SQL statement.', input: 'sql', output: 'QueryProfile' },
    { name: 'clone_table',         desc: 'Zero-copy clone a table for sandbox analysis.', input: 'source · target', output: 'CloneResult' },
    { name: 'get_lineage',         desc: 'Fetch column-level data lineage for a table.', input: 'database · schema · table', output: 'LineageGraph' },
    { name: 'list_views',          desc: 'List views in a schema with their SQL definition.', input: 'database · schema', output: 'ViewDef[]' },
  ],
  konduto: [
    { name: 'analyze_transaction', desc: 'Run Konduto antifraud analysis on a transaction payload.', input: 'transaction', output: 'KondutoDecision' },
    { name: 'get_rule_set',        desc: 'Fetch the active Konduto rule set for an account.', input: 'account_id', output: 'RuleSet' },
    { name: 'update_rule',         desc: 'Update a single rule threshold or action.', input: 'rule_id · threshold? · action?', output: 'RuleUpdateResult' },
    { name: 'simulate_rule_change',desc: 'Simulate a rule-threshold change against recent traffic.', input: 'rule_id · new_threshold · lookback_days', output: 'SimulationReport' },
    { name: 'get_chargeback',      desc: 'Fetch chargeback details for a transaction.', input: 'transaction_id', output: 'Chargeback' },
    { name: 'list_false_positives',desc: 'List recently reported false-positive declines.', input: 'since? · limit', output: 'FalsePositive[]' },
    { name: 'explain_decision',    desc: 'Explain the score and rules that triggered a decision.', input: 'transaction_id', output: 'DecisionExplanation' },
    { name: 'flag_for_review',     desc: 'Flag a transaction for manual review queue.', input: 'transaction_id · reason', output: 'ReviewTicket' },
    { name: 'get_daily_stats',     desc: 'Fetch daily approve/decline/fraud stats for a date range.', input: 'from · to', output: 'DailyStats[]' },
    { name: 'list_blocked_bins',   desc: 'List BINs currently blocked by the rule engine.', input: 'updated_since?', output: 'BinBlock[]' },
  ],
  identity: [
    { name: 'verify_document',     desc: 'Verify a document image using OCR and anti-fraud heuristics.', input: 'document_type · image_base64', output: 'DocVerification' },
    { name: 'check_biometric',     desc: 'Compare a selfie against a document face photo.', input: 'selfie_base64 · doc_face_base64', output: 'BiometricMatch' },
    { name: 'validate_cpf',        desc: 'Validate CPF and cross-check against identity records.', input: 'cpf · name?', output: 'CpfValidation' },
    { name: 'get_kyc_status',      desc: 'Return the current KYC status and pending steps for a user.', input: 'user_id', output: 'KycStatus' },
    { name: 'run_pep_check',       desc: 'Run a Politically Exposed Person check for a name/CPF.', input: 'cpf · name?', output: 'PepResult' },
    { name: 'run_sanctions_check', desc: 'Check a name against OFAC and BACEN sanctions lists.', input: 'name · country?', output: 'SanctionsResult' },
    { name: 'liveness_check',      desc: 'Assess liveness from a short video clip.', input: 'video_base64', output: 'LivenessResult' },
  ],
  consent: [
    { name: 'check_scope',         desc: 'Verify whether a user has a valid consent for a given data scope.', input: 'cpf · scope', output: 'ConsentCheck' },
    { name: 'list_scopes',         desc: 'List all registered consent scopes and their purposes.', input: undefined as unknown as string, output: 'Scope[]' },
    { name: 'revoke_consent',      desc: 'Revoke a user consent for a given scope.', input: 'cpf · scope · reason', output: 'RevokeResult' },
    { name: 'audit_trail',         desc: 'Return the consent audit trail for a CPF.', input: 'cpf · since?', output: 'AuditEntry[]' },
  ],
  decision: [
    { name: 'run_policy',          desc: 'Execute a decisioning policy against an input record.', input: 'policy_id · input', output: 'Decision' },
    { name: 'explain_decision',    desc: 'Return a human-readable explanation of the last policy decision.', input: 'decision_id', output: 'Explanation' },
    { name: 'list_policies',       desc: 'List all registered decisioning policies with their version.', input: 'team?', output: 'Policy[]' },
    { name: 'dry_run_policy',      desc: 'Run a policy in dry-run mode without recording the decision.', input: 'policy_id · input', output: 'Decision' },
    { name: 'get_scorecard',       desc: 'Fetch the scorecard breakdown for a decision.', input: 'decision_id', output: 'Scorecard' },
    { name: 'diff_policies',       desc: 'Diff two policy versions and list changed rules.', input: 'policy_id · v1 · v2', output: 'PolicyDiff' },
  ],
  terraform: [
    { name: 'plan',                desc: 'Generate a Terraform execution plan for a workspace.', input: 'workspace · vars?', output: 'Plan' },
    { name: 'apply',               desc: 'Apply an approved Terraform plan.', input: 'plan_id', output: 'ApplyResult' },
    { name: 'show_state',          desc: 'Inspect the current Terraform state for a workspace.', input: 'workspace', output: 'State' },
    { name: 'list_workspaces',     desc: 'List all Terraform workspaces with their last-run status.', input: undefined as unknown as string, output: 'Workspace[]' },
    { name: 'destroy',             desc: 'Destroy all resources in a workspace (guarded, requires approval).', input: 'workspace · confirm', output: 'DestroyResult' },
    { name: 'get_output',          desc: 'Read a Terraform output variable from a workspace.', input: 'workspace · name', output: 'OutputValue' },
  ],
  ignite: [
    { name: 'read_features',       desc: 'Read feature values for one or more entity ids.', input: 'feature_view · entity_ids · features?', output: 'FeatureVector[]' },
    { name: 'list_feature_views',  desc: 'List all registered feature views with schema.', input: 'team?', output: 'FeatureView[]' },
    { name: 'get_lineage',         desc: 'Fetch data lineage for a feature view.', input: 'feature_view', output: 'LineageGraph' },
    { name: 'get_freshness',       desc: 'Return the ingestion lag for a feature view.', input: 'feature_view', output: 'FreshnessReport' },
    { name: 'materialize',         desc: 'Trigger materialization for a feature view over a date range.', input: 'feature_view · start · end', output: 'MaterializeJob' },
  ],
  'legacy-soap': [
    { name: 'call_soap_method',    desc: 'Invoke a SOAP method on the legacy decisioning bus.', input: 'method · payload_xml', output: 'SoapResponse' },
    { name: 'list_methods',        desc: 'List available SOAP methods exposed by the legacy bus.', input: undefined as unknown as string, output: 'SoapMethod[]' },
    { name: 'health_check',        desc: 'Ping the legacy SOAP endpoint and return status.', input: undefined as unknown as string, output: 'HealthStatus' },
  ],
};

export const toolsFor = (id: string): ToolDef[] => TOOLS_BY_SERVER[id] ?? [];

// ── Per-server connected agents (plausible subset from the agents catalog) ───

const CONNECTED_BY_SERVER: Record<string, string[]> = {
  github:      ['SRE Copilot', 'Release Notes', 'Flaky Finder', 'API Contract', 'p99 Hunter'],
  datadog:     ['SRE Copilot', 'p99 Hunter', 'DORA Analyst', 'Cost Watch'],
  k8s:         ['SRE Copilot', 'p99 Hunter', 'DORA Analyst'],
  pagerduty:   ['SRE Copilot', 'Onboarding Buddy'],
  terraform:   ['SRE Copilot', 'Cost Watch'],
  bureau:      ['Bureau Assistant', 'SCR Reconciler', 'Cadastro Positivo', 'LGPD Auditor'],
  snowflake:   ['DORA Analyst', 'Score Reviewer', 'Cost Watch', 'Fraud Analyst'],
  ignite:      ['Score Reviewer', 'Fraud Analyst'],
  konduto:     ['Fraud Analyst', 'Chargeback Helper', 'konduto Tuner'],
  identity:    ['KYC Navigator', 'LGPD Auditor'],
  consent:     ['LGPD Auditor', 'Consent Mapper', 'KYC Navigator', 'Cadastro Positivo'],
  decision:    ['Score Reviewer', 'Fraud Analyst', 'Bureau Assistant'],
  'legacy-soap': ['Bureau Assistant'],
};

export const connectedAgentsFor = (id: string): string[] => CONNECTED_BY_SERVER[id] ?? [];

// ── Per-server version changelog ─────────────────────────────────────────────

export type ServerVersion = {
  version: string;
  date: string;
  note: string;
  current: boolean;
};

const VERSIONS_BY_SERVER: Record<string, ServerVersion[]> = {
  github:     [
    { version: 'v2.4.0', date: 'Jun 2026', note: 'Added get_run_logs and branch_protection tools.', current: true },
    { version: 'v2.3.0', date: 'May 2026', note: 'OAuth per-tenant scopes; rate-limit headers.', current: false },
    { version: 'v2.2.0', date: 'Apr 2026', note: 'merge_pr squash mode + branch protection audit log.', current: false },
    { version: 'v2.1.0', date: 'Mar 2026', note: 'check_runs + trigger_workflow added.', current: false },
  ],
  datadog:    [
    { version: 'v3.1.1', date: 'Jun 2026', note: 'Patch: log cursor pagination fix.', current: true },
    { version: 'v3.1.0', date: 'May 2026', note: 'Added create_downtime and list_incidents.', current: false },
    { version: 'v3.0.0', date: 'Mar 2026', note: 'SSE transport; streaming log tail.', current: false },
  ],
  k8s:        [
    { version: 'v1.8.0', date: 'Jun 2026', note: 'top_pods and delete_pod tools added.', current: true },
    { version: 'v1.7.0', date: 'Apr 2026', note: 'apply_manifest dry-run mode.', current: false },
    { version: 'v1.6.0', date: 'Feb 2026', note: 'mTLS auth; GKE Workload Identity support.', current: false },
  ],
  pagerduty:  [
    { version: 'v1.2.3', date: 'May 2026', note: 'Patch: escalation policy lookup fix.', current: true },
    { version: 'v1.2.0', date: 'Mar 2026', note: 'create_override and list_on_call added.', current: false },
  ],
  bureau:     [
    { version: 'v2.0.0', date: 'Jun 2026', note: 'Boa Vista feed + diff_layouts tool.', current: true },
    { version: 'v1.9.0', date: 'Apr 2026', note: 'explain_divergence natural-language output.', current: false },
    { version: 'v1.8.0', date: 'Feb 2026', note: 'mTLS enforced; consent ledger tool added.', current: false },
  ],
  snowflake:  [
    { version: 'v1.5.0', date: 'May 2026', note: 'get_lineage and list_views added.', current: true },
    { version: 'v1.4.0', date: 'Mar 2026', note: 'explain_query cost estimate.', current: false },
    { version: 'v1.3.0', date: 'Jan 2026', note: 'clone_table zero-copy support.', current: false },
  ],
  ignite:     [
    { version: 'v0.7.1', date: 'May 2026', note: 'Patch: freshness lag metric precision.', current: true },
    { version: 'v0.7.0', date: 'Apr 2026', note: 'materialize job trigger tool added.', current: false },
  ],
  konduto:    [
    { version: 'v1.3.0', date: 'Jun 2026', note: 'list_blocked_bins and get_daily_stats added.', current: true },
    { version: 'v1.2.0', date: 'Apr 2026', note: 'simulate_rule_change with traffic replay.', current: false },
    { version: 'v1.1.0', date: 'Feb 2026', note: 'mTLS transport; flag_for_review added.', current: false },
  ],
  identity:   [
    { version: 'v1.1.0', date: 'May 2026', note: 'liveness_check video tool added.', current: true },
    { version: 'v1.0.0', date: 'Mar 2026', note: 'Initial release: doc verify + biometric.', current: false },
  ],
  consent:    [
    { version: 'v2.1.0', date: 'Jun 2026', note: 'audit_trail full pagination.', current: true },
    { version: 'v2.0.0', date: 'Apr 2026', note: 'LGPD v2 scopes; revoke_consent added.', current: false },
    { version: 'v1.5.0', date: 'Jan 2026', note: 'Initial multi-scope release.', current: false },
  ],
  decision:   [
    { version: 'v0.4.0', date: 'May 2026', note: 'diff_policies and dry_run_policy added.', current: true },
    { version: 'v0.3.0', date: 'Mar 2026', note: 'get_scorecard output detail.', current: false },
  ],
  terraform:  [
    { version: 'v0.9.2', date: 'Jun 2026', note: 'Patch: variable injection ordering fix.', current: true },
    { version: 'v0.9.0', date: 'Apr 2026', note: 'destroy guard + confirmation token.', current: false },
  ],
  'legacy-soap': [
    { version: 'v0.2.0', date: 'Apr 2026', note: 'health_check added; marked deprecated.', current: true },
    { version: 'v0.1.0', date: 'Jan 2026', note: 'Initial SOAP bridge adapter.', current: false },
  ],
};

export const versionsFor = (id: string): ServerVersion[] => VERSIONS_BY_SERVER[id] ?? [];

// ── Per-server install snippet ────────────────────────────────────────────────

const SNIPPETS_BY_SERVER: Record<string, { lang: string; code: string }> = {
  github: {
    lang: 'json',
    code: `{
  "mcpServers": {
    "github": {
      "transport": "http",
      "url": "https://mcp.forge.equifax.com/github",
      "auth": {
        "type": "oauth2",
        "scopes": ["repo", "workflow"]
      }
    }
  }
}`,
  },
  datadog: {
    lang: 'json',
    code: `{
  "mcpServers": {
    "datadog": {
      "transport": "sse",
      "url": "https://mcp.forge.equifax.com/datadog/events",
      "auth": {
        "type": "apikey",
        "header": "DD-API-KEY"
      }
    }
  }
}`,
  },
  k8s: {
    lang: 'json',
    code: `{
  "mcpServers": {
    "k8s": {
      "transport": "http",
      "url": "https://mcp.forge.equifax.com/k8s",
      "auth": {
        "type": "mtls",
        "cert": "/run/secrets/mtls/tls.crt",
        "key": "/run/secrets/mtls/tls.key"
      }
    }
  }
}`,
  },
  bureau: {
    lang: 'json',
    code: `{
  "mcpServers": {
    "bureau": {
      "transport": "http",
      "url": "https://mcp.forge.equifax.com/bureau",
      "auth": {
        "type": "mtls",
        "cert": "/run/secrets/mtls/tls.crt",
        "key": "/run/secrets/mtls/tls.key"
      }
    }
  }
}`,
  },
};

const DEFAULT_SNIPPET = (id: string, s: McpServer) => ({
  lang: 'json',
  code: `{
  "mcpServers": {
    "${id}": {
      "transport": "${s.transport.toLowerCase()}",
      "url": "https://mcp.forge.equifax.com/${id}",
      "auth": {
        "type": "${s.auth.toLowerCase().replace(/\s/g, '-')}"
      }
    }
  }
}`,
});

export const snippetFor = (id: string): { lang: string; code: string } => {
  const s = getServer(id);
  return SNIPPETS_BY_SERVER[id] ?? (s ? DEFAULT_SNIPPET(id, s) : { lang: 'json', code: '{}' });
};

// ── Per-tool telemetry (deterministic, SSR-stable: integer hash only) ────────
const hashOf = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export interface ToolStat { calls: number; latency: number; spark: number[] }
export const toolStat = (name: string): ToolStat => {
  const h = hashOf(name);
  const base = 8 + (h % 92);
  const calls = base * 19 + (h % 240);
  const latency = 80 + (h % 540);
  const amp = Math.max(2, Math.round(base * 0.5));
  const spark = Array.from({ length: 12 }, (_, i) => Math.max(2, base - Math.round(amp / 2) + (hashOf(`${name}#${i}`) % amp)));
  return { calls, latency, spark };
};

// ── Connection + recent activity (static per server) ─────────────────────────
export interface Connection { endpoint: string; rateLimit: string; heartbeat: string; uptime: string }
export const connectionFor = (id: string): Connection => {
  const s = getServer(id);
  return {
    endpoint: `mcp://forge.equifax/${id}`,
    rateLimit: '5,000 / hour',
    heartbeat: s?.status === 'deprecated' ? 'paused' : '16m ago',
    uptime: s?.status === 'live' ? '99.97%' : s?.status === 'beta' ? '99.2%' : '97.4%',
  };
};

export interface ActivityItem { id: string; title: string; meta: string; icon: string; at: string; tone: 'done' | 'default' }
export const activityFor = (id: string): ActivityItem[] => {
  const s = getServer(id);
  const tools = toolsFor(id);
  const agents = connectedAgentsFor(id);
  if (!s || tools.length === 0) return [];
  const a = (i: number) => agents[i % Math.max(1, agents.length)] ?? 'an agent';
  return [
    { id: 'a1', title: `Tool call · ${tools[0].name}`,                meta: `${a(0)} · ok`,   icon: 'toolCall', at: '3m ago',  tone: 'done' },
    { id: 'a2', title: `Tool call · ${tools[1 % tools.length].name}`, meta: `${a(1)} · ok`,   icon: 'toolCall', at: '11m ago', tone: 'done' },
    { id: 'a3', title: 'Heartbeat · ok',                              meta: 'latency 38ms',   icon: 'pulse',    at: '16m ago', tone: 'done' },
    { id: 'a4', title: `${s.auth} token refreshed`,                   meta: 'valid 30d',      icon: 'key',      at: '28m ago', tone: 'default' },
    { id: 'a5', title: `Tool call · ${tools[2 % tools.length].name}`, meta: `${a(2)} · ok`,   icon: 'toolCall', at: '42m ago', tone: 'done' },
  ];
};
