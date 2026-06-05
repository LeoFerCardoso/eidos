// Forge — agent detail helpers. The detail page (/portal/agents/[id]) shows an
// agent's stored instructions (Markdown), its access list, and usage charts.
// To avoid hand-authoring 18 long blobs, the instructions + usage + access are
// generated DETERMINISTICALLY from the agent (a seeded PRNG keyed on the id) so
// SSR and client render identically and the data is stable across reloads.
import type { Agent, AgentOutput } from './agents';

// ── Response kind ─────────────────────────────────────────────────────────────

export const OUTPUT_META: Record<
  AgentOutput,
  { label: string; icon: string; note: string; conversational: boolean }
> = {
  conversation: { label: 'Conversation', icon: 'chat',      note: 'Replies in chat — back-and-forth, grounded in your estate.', conversational: true },
  json:         { label: 'JSON',         icon: 'database',  note: 'Returns a structured JSON payload, not a chat reply.',        conversational: false },
  code:         { label: 'Code',         icon: 'terminal',  note: 'Returns a code block ready to copy or open as an artifact.',  conversational: false },
  document:     { label: 'Document',     icon: 'doc',       note: 'Returns a formatted document (Markdown / PDF).',              conversational: false },
  image:        { label: 'Image',        icon: 'image',     note: 'Generates an image — its only output is the rendered asset.', conversational: false },
  file:         { label: 'File',         icon: 'file',      note: 'Returns a downloadable file artifact.',                       conversational: false },
};

// ── Seeded PRNG ───────────────────────────────────────────────────────────────

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ── Usage (FinOps bars + token heatmap) ───────────────────────────────────────

/** One day of usage. `v` is the USD spend (drives the bar height); the token
 *  breakdown + the extraction date show in the hover tooltip. */
export type UsageDay = {
  d: string;
  /** Display date, e.g. "Wed, 17 · May 2026". */
  date: string;
  v: number;
  input: number;
  output: number;
  cache: number;
};

export type AgentUsage = {
  cost: UsageDay[];
  costTotal: number;
  /** Tokens consumed in the last 30 days (millions). */
  tokensTotal: number;
  /** % change vs the previous 30 days (signed). */
  tokensTrend: number;
  spendTrend: number;
};

const COST_DAYS = 30;
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function usageFor(agent: Agent): AgentUsage {
  const rng = makeRng(hashSeed(agent.id));
  // Fixed 30-day window (anchored, so SSR + client agree): May 6 → Jun 4, 2026.
  const cost: UsageDay[] = Array.from({ length: COST_DAYS }, (_, i) => {
    const dt = new Date(2026, 4, 6 + i); // explicit args — deterministic
    const date = `${WD[dt.getDay()]}, ${dt.getDate()} · ${MO[dt.getMonth()]} ${dt.getFullYear()}`;
    const input = Math.round((90 + rng() * 820) * 1000); // 90k..910k
    const output = Math.round(input * (0.25 + rng() * 0.35));
    const cache = Math.round(input * (0.3 + rng() * 1.1));
    const v = Math.max(
      2,
      Math.round((input / 1e6) * 3 + (output / 1e6) * 15 + (cache / 1e6) * 0.3),
    );
    return { d: `${i + 1}`, date, v, input, output, cache };
  });
  const costTotal = cost.reduce((s, c) => s + c.v, 0);
  const tokensTotal = Math.round((cost.reduce((s, c) => s + c.input + c.output + c.cache, 0) / 1e6) * 10) / 10;
  const tokensTrend = Math.round((rng() * 46 - 14) * 10) / 10; // -14%..+32%
  const spendTrend = Math.round((rng() * 40 - 16) * 10) / 10;
  return { cost, costTotal, tokensTotal, tokensTrend, spendTrend };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Apps (MCP servers / direct APIs the agent can call) ───────────────────────
// MCP servers and direct APIs are both "apps" — each carries its brand logo, a
// kind chip, and the set of tools enabled for this agent.

export type AppKind = 'MCP' | 'API' | 'Webhook';
export interface AppDef {
  /** Brand registry slug (drives <BrandIcon/>). */
  slug: string;
  name: string;
  kind: AppKind;
  desc: string;
  /** Tools enabled for the agent. */
  tools: string[];
}

export const APP_POOL: AppDef[] = [
  { slug: 'github', name: 'GitHub', kind: 'MCP', desc: 'Source control, pull requests and Actions.', tools: ['create_pull_request', 'get_repo', 'list_commits', 'comment_issue', 'dispatch_workflow'] },
  { slug: 'gitlab', name: 'GitLab', kind: 'API', desc: 'Pipelines, merge requests and registry.', tools: ['get_pipeline', 'create_mr', 'list_jobs', 'retry_job'] },
  { slug: 'datadog', name: 'Datadog', kind: 'MCP', desc: 'Metrics, monitors, traces and logs.', tools: ['query_metrics', 'list_monitors', 'get_logs', 'mute_monitor'] },
  { slug: 'pagerduty', name: 'PagerDuty', kind: 'MCP', desc: 'On-call schedules and incidents.', tools: ['create_incident', 'list_oncall', 'acknowledge', 'resolve'] },
  { slug: 'grafana', name: 'Grafana', kind: 'API', desc: 'Dashboards and alert rules.', tools: ['query_dashboard', 'list_alerts'] },
  { slug: 'prometheus', name: 'Prometheus', kind: 'API', desc: 'PromQL range and instant queries.', tools: ['query_range', 'instant_query'] },
  { slug: 'sentry', name: 'Sentry', kind: 'API', desc: 'Error tracking and issue triage.', tools: ['list_issues', 'resolve_issue', 'assign_issue'] },
  { slug: 'jira', name: 'Jira', kind: 'MCP', desc: 'Tickets, sprints and transitions.', tools: ['create_issue', 'search_jql', 'transition_issue', 'add_comment'] },
  { slug: 'slack', name: 'Slack', kind: 'API', desc: 'Post messages and page channels.', tools: ['post_message', 'list_channels', 'open_dm'] },
  { slug: 'servicenow', name: 'ServiceNow', kind: 'API', desc: 'Change management and CMDB.', tools: ['create_change', 'query_cmdb', 'update_incident'] },
  { slug: 'kubernetes', name: 'Kubernetes', kind: 'MCP', desc: 'Workloads, rollouts and scaling.', tools: ['get_pods', 'rollout_status', 'scale_deployment'] },
  { slug: 'snowflake', name: 'Snowflake', kind: 'API', desc: 'Warehouse queries and schemas.', tools: ['run_query', 'describe_table'] },
  { slug: 'confluence', name: 'Confluence', kind: 'API', desc: 'Knowledge base search.', tools: ['search_pages', 'get_page'] },
  { slug: 'github-actions', name: 'GitHub Actions', kind: 'API', desc: 'CI workflows and runners.', tools: ['list_runs', 'rerun_workflow', 'cancel_run', 'get_artifact'] },
  { slug: 'argocd', name: 'Argo CD', kind: 'MCP', desc: 'GitOps deployments and sync.', tools: ['sync_app', 'get_app', 'rollback', 'list_apps'] },
  { slug: 'jenkins', name: 'Jenkins', kind: 'API', desc: 'Build jobs and pipelines.', tools: ['trigger_build', 'get_build', 'list_jobs'] },
  { slug: 'circleci', name: 'CircleCI', kind: 'API', desc: 'Pipelines and workflows.', tools: ['trigger_pipeline', 'get_workflow', 'rerun'] },
  { slug: 'terraform', name: 'Terraform', kind: 'MCP', desc: 'Plans, state and applies.', tools: ['plan', 'apply', 'show_state', 'list_workspaces'] },
  { slug: 'dynatrace', name: 'Dynatrace', kind: 'MCP', desc: 'Observability and problems.', tools: ['list_problems', 'query_metrics', 'get_trace'] },
  { slug: 'new-relic', name: 'New Relic', kind: 'API', desc: 'APM, NRQL and alerts.', tools: ['run_nrql', 'list_alerts', 'get_apm'] },
  { slug: 'splunk', name: 'Splunk', kind: 'API', desc: 'Log search and dashboards.', tools: ['search', 'get_dashboard'] },
  { slug: 'elastic', name: 'Elastic', kind: 'API', desc: 'Search and observability.', tools: ['search', 'get_index', 'list_alerts'] },
  { slug: 'opsgenie', name: 'Opsgenie', kind: 'MCP', desc: 'Alerting and on-call.', tools: ['create_alert', 'list_oncall', 'ack_alert', 'close_alert'] },
  { slug: 'redis', name: 'Redis', kind: 'API', desc: 'Cache keys and metrics.', tools: ['get_key', 'del_key', 'info'] },
  { slug: 'postgresql', name: 'PostgreSQL', kind: 'API', desc: 'SQL queries and schemas.', tools: ['run_query', 'describe_table', 'list_schemas'] },
  { slug: 'mongodb', name: 'MongoDB', kind: 'API', desc: 'Collections and queries.', tools: ['find', 'aggregate', 'list_collections'] },
  { slug: 'linear', name: 'Linear', kind: 'MCP', desc: 'Issues and projects.', tools: ['create_issue', 'search', 'update_issue'] },
  { slug: 'notion', name: 'Notion', kind: 'API', desc: 'Docs and databases.', tools: ['search', 'get_page', 'query_database'] },
  { slug: 'bitbucket', name: 'Bitbucket', kind: 'API', desc: 'Repos and pull requests.', tools: ['create_pr', 'get_repo', 'list_commits'] },
  { slug: 'vercel', name: 'Vercel', kind: 'API', desc: 'Deployments and projects.', tools: ['list_deployments', 'get_deployment', 'promote'] },
  { slug: 'cloudflare', name: 'Cloudflare', kind: 'API', desc: 'DNS, WAF and cache.', tools: ['purge_cache', 'list_dns', 'get_waf'] },
  { slug: 'zendesk', name: 'Zendesk', kind: 'API', desc: 'Support tickets.', tools: ['list_tickets', 'update_ticket'] },
];

export function appsFor(agent: Agent): AppDef[] {
  const rng = makeRng(hashSeed(agent.id + ':apps'));
  const n = Math.max(2, Math.min(6, agent.tools));
  return shuffle(APP_POOL, rng)
    .slice(0, n)
    .map((app) => {
      // Enable a deterministic subset of the app's tools for this agent.
      const enabled = app.tools.filter((_, i) => i === 0 || rng() > 0.4);
      return { ...app, tools: enabled };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Apps not yet connected — the "Add app" menu. */
export const addableApps = (current: AppDef[]): AppDef[] => {
  const have = new Set(current.map((a) => a.slug));
  return APP_POOL.filter((a) => !have.has(a.slug));
};

// ── Capabilities ──────────────────────────────────────────────────────────────
// The market-standard capability matrix (à la OpenAI / Anthropic / Google).

export interface Capability { id: string; label: string; icon: string; desc: string }

export const CAPABILITIES: Capability[] = [
  { id: 'conversation',  label: 'Conversation',      icon: 'chat',     desc: 'Multi-turn back and forth chat.' },
  { id: 'web-search',    label: 'Web search',        icon: 'globe',    desc: 'Look up live information on the web.' },
  { id: 'vision',        label: 'Image recognition', icon: 'eye',      desc: 'Read and interpret images and screenshots.' },
  { id: 'image-gen',     label: 'Image generation',  icon: 'image',    desc: 'Create images from a prompt.' },
  { id: 'video',         label: 'Video generation',  icon: 'video',    desc: 'Generate short video clips.' },
  { id: 'audio',         label: 'Audio & speech',    icon: 'volume',   desc: 'Transcribe speech and synthesize voice.' },
  { id: 'code',          label: 'Code execution',    icon: 'terminal', desc: 'Run code in a sandbox and use the result.' },
  { id: 'tools',         label: 'Function calling',  icon: 'toolCall', desc: 'Call connected app tools and APIs.' },
  { id: 'structured',    label: 'Structured output', icon: 'braces',   desc: 'Return typed JSON that matches a schema.' },
  { id: 'files',         label: 'File analysis',     icon: 'doc',      desc: 'Parse uploaded documents and data files.' },
  { id: 'retrieval',     label: 'Retrieval (RAG)',   icon: 'database', desc: 'Ground answers in your attached contexts.' },
  { id: 'long-context',  label: 'Long context',      icon: 'layers',   desc: 'Hold very large inputs in one request.' },
  { id: 'reasoning',     label: 'Reasoning',         icon: 'brain',    desc: 'Think step by step before answering.' },
];

export function capabilitiesFor(agent: Agent): Capability[] {
  const ids = new Set<string>(['tools', 'retrieval', 'reasoning']);
  if (OUTPUT_META[agent.output].conversational) ids.add('conversation');
  if (agent.output === 'json') ids.add('structured');
  if (agent.output === 'code') ids.add('code');
  if (agent.output === 'document') ids.add('files');
  if (agent.output === 'image') { ids.add('image-gen'); ids.add('vision'); }
  const rng = makeRng(hashSeed(agent.id + ':caps'));
  for (const e of ['web-search', 'vision', 'files', 'long-context', 'code', 'audio']) {
    if (rng() > 0.55) ids.add(e);
  }
  return CAPABILITIES.filter((c) => ids.has(c.id));
}

// ── Skills ────────────────────────────────────────────────────────────────────

export interface SkillDef { name: string; icon: string; desc: string }

export const SKILL_POOL: SkillDef[] = [
  { name: 'Postmortem writer', icon: 'edit', desc: 'Drafts a blameless postmortem from the incident timeline.' },
  { name: 'Root-cause analysis', icon: 'target', desc: 'Correlates symptoms to a likely cause across the estate.' },
  { name: 'Runbook authoring', icon: 'book', desc: 'Turns a fix into a repeatable runbook.' },
  { name: 'Rule tuning', icon: 'zap', desc: 'Simulates rule-threshold changes against traffic.' },
  { name: 'SCR layout', icon: 'layers', desc: 'Knows the SCR record layout and field contracts.' },
  { name: 'LGPD remediation', icon: 'shield', desc: 'Drafts consent-scope remediation steps.' },
  { name: 'Cost optimization', icon: 'gauge', desc: 'Finds the safest places to trim spend.' },
  { name: 'Reason-code analysis', icon: 'score', desc: 'Explains score reason-code drift.' },
  { name: 'SLO design', icon: 'target', desc: 'Sets SLO targets and burn-rate alerts per service.' },
  { name: 'Trace analysis', icon: 'activity', desc: 'Walks a distributed trace and ranks the slowest spans.' },
  { name: 'Query optimization', icon: 'database', desc: 'Rewrites slow SQL and proposes indexes.' },
  { name: 'Chargeback evidence', icon: 'doc', desc: 'Assembles a dispute evidence packet from the trail.' },
  { name: 'Feature freshness', icon: 'refresh', desc: 'Checks Ignite feature lineage and staleness.' },
  { name: 'PII discovery', icon: 'eye', desc: 'Scans logs and payloads for unregistered PII.' },
  { name: 'Release notes', icon: 'book', desc: 'Turns a diff and its GMUD into clean release notes.' },
  { name: 'Flaky test triage', icon: 'flag', desc: 'Quarantines the flakiest tests and finds the cause.' },
  { name: 'Capacity planning', icon: 'gauge', desc: 'Projects load and right-sizes the fleet.' },
  { name: 'Threat modeling', icon: 'shield', desc: 'Maps the attack surface and proposes mitigations.' },
  { name: 'Schema diffing', icon: 'braces', desc: 'Diffs an API change against its consumers.' },
  { name: 'Incident comms', icon: 'chat', desc: 'Drafts status-page and stakeholder updates.' },
  { name: 'Deploy gating', icon: 'pipeline', desc: 'Checks quality gates before a release ships.' },
  { name: 'Anomaly detection', icon: 'activity', desc: 'Flags metric anomalies against the baseline.' },
];

export function skillsFor(agent: Agent): SkillDef[] {
  const rng = makeRng(hashSeed(agent.id + ':skills'));
  const n = Math.max(2, Math.min(4, agent.tools - 1));
  return shuffle(SKILL_POOL, rng).slice(0, n).sort((a, b) => a.name.localeCompare(b.name));
}

// ── Contexts (placeholder — the context layer is not built yet) ───────────────

export interface ContextDef { id: string; name: string; icon: string; desc: string }

export const CONTEXT_POOL: ContextDef[] = [
  { id: 'catalog',    name: 'Service catalog',     icon: 'package',    desc: 'Every service, owner and dependency.' },
  { id: 'slo',        name: 'SLO registry',        icon: 'target',     desc: 'Targets and burn rates per service.' },
  { id: 'consent',    name: 'Consent ledger',      icon: 'compliance', desc: 'LGPD consent scopes per CPF.' },
  { id: 'features',   name: 'Ignite feature store',icon: 'database',   desc: 'Feature freshness and lineage.' },
  { id: 'runbooks',   name: 'Runbook library',     icon: 'book',       desc: 'Approved operational runbooks.' },
  { id: 'incidents',  name: 'Incident history',    icon: 'incident',   desc: 'Past incidents and resolutions.' },
  { id: 'scr',        name: 'SCR layout spec',     icon: 'layers',     desc: 'SCR record layout and field contracts.' },
  { id: 'bureau',     name: 'Boa Vista feeds',     icon: 'doc',        desc: 'Bureau feed schemas and SLAs.' },
  { id: 'pipelines',  name: 'Pipeline registry',   icon: 'pipeline',   desc: 'CI/CD pipelines and quality gates.' },
  { id: 'dashboards', name: 'Dashboards & metrics',icon: 'activity',   desc: 'Grafana dashboards and key metrics.' },
  { id: 'oncall',     name: 'On-call schedule',    icon: 'clock',      desc: 'Rotations and escalation paths.' },
  { id: 'adr',        name: 'Architecture decisions',icon: 'book',     desc: 'ADRs and design records.' },
  { id: 'secrets',    name: 'Access & secrets',    icon: 'lock',       desc: 'Access scopes and rotation policy.' },
  { id: 'finops',     name: 'FinOps ledger',       icon: 'gauge',      desc: 'Cloud spend by service and team.' },
  { id: 'fraudrules', name: 'konduto rule set',    icon: 'shield',     desc: 'Active antifraud rules and thresholds.' },
  { id: 'scoremodels',name: 'Score model registry',icon: 'score',      desc: 'Model versions and reason codes.' },
  { id: 'apidocs',    name: 'API contracts',       icon: 'braces',     desc: 'OpenAPI specs and consumers.' },
  { id: 'tickets',    name: 'Ticket history',      icon: 'mail',       desc: 'Past tickets and resolutions.' },
  { id: 'glossary',   name: 'Domain glossary',     icon: 'book',       desc: 'Bureau and credit terms.' },
];

/** Contexts the agent already has — none yet; the layer ships later. */
export function contextsFor(_agent: Agent): ContextDef[] {
  return [];
}
export const addableContexts = (current: ContextDef[]): ContextDef[] => {
  const have = new Set(current.map((c) => c.id));
  return CONTEXT_POOL.filter((c) => !have.has(c.id));
};

// ── Versions ──────────────────────────────────────────────────────────────────

export interface AgentVersion { version: string; date: string; note: string; current?: boolean }

const VERSION_NOTES = [
  'Tightened the system prompt and guardrails.',
  'Added the Datadog MCP and two tools.',
  'Improved citation accuracy on long threads.',
  'Faster first token; trimmed context window.',
  'Fixed a rollback edge case.',
  'Expanded the runbook skill coverage.',
];
const VMONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function versionsFor(agent: Agent): AgentVersion[] {
  const rng = makeRng(hashSeed(agent.id + ':versions'));
  const m = agent.version.replace(/^v/, '').split('.').map((n) => parseInt(n, 10));
  let [maj, min, pat] = [m[0] || 1, m[1] || 0, m[2] || 0];
  const out: AgentVersion[] = [];
  for (let i = 0; i < 5; i++) {
    out.push({
      version: `v${maj}.${min}.${pat}`,
      date: `${VMONTHS[(5 - i + Math.floor(rng() * 2)) % 6]} 2025`,
      note: VERSION_NOTES[Math.floor(rng() * VERSION_NOTES.length)],
      current: i === 0,
    });
    // walk backwards
    if (pat > 0) pat -= 1;
    else if (min > 0) { min -= 1; pat = Math.floor(rng() * 4); }
    else { maj = Math.max(0, maj - 1); min = Math.floor(rng() * 6); pat = 0; }
  }
  return out;
}

// ── Instructions (stored Markdown, simulated) ─────────────────────────────────

const OUTPUT_BLOCK: Record<AgentOutput, string> = {
  conversation: '',
  json: [
    '## Output contract',
    '',
    'This agent always answers with a single JSON object — never prose:',
    '',
    '```json',
    '{',
    '  "summary": "string",',
    '  "findings": [{ "id": "string", "severity": "low|med|high", "detail": "string" }],',
    '  "generatedAt": "ISO-8601"',
    '}',
    '```',
  ].join('\n'),
  code: [
    '## Output contract',
    '',
    'This agent returns a ready-to-apply code block (no surrounding prose):',
    '',
    '```ts',
    'export const rule = {',
    '  id: "fraud-score-v2",',
    '  threshold: 0.82,        // tuned from last week’s traffic',
    '  action: "review",',
    '};',
    '```',
  ].join('\n'),
  document: [
    '## Output contract',
    '',
    'This agent returns a formatted **document** (Markdown, exportable to PDF) —',
    'a titled report with sections, not a chat reply.',
  ].join('\n'),
  image: [
    '## Output contract',
    '',
    'This agent returns a single generated **image** asset and nothing else.',
  ].join('\n'),
  file: [
    '## Output contract',
    '',
    'This agent returns a downloadable **file** artifact.',
  ].join('\n'),
};

export function buildInstructions(agent: Agent): string {
  const out = OUTPUT_META[agent.output];
  // No leading H1 / summary repeat — the page header already shows the name and
  // summary; the instructions body starts at the first section.
  return [
    '## Role',
    '',
    `You are **${agent.name}**, scoped to **${agent.role}** for the Equifax Boa Vista platform. ` +
      `Stay strictly within this domain; if a request falls outside it, say so and hand off.`,
    '',
    '## How it works',
    '',
    '1. Read the request and pull only the context you need from the catalog and connected sources.',
    '2. Reason step by step; prefer the smallest, reversible action.',
    `3. ${out.conversational ? 'Answer in chat with citations to the evidence you used.' : `Return a single **${out.label}** artifact — ${out.note.toLowerCase()}`}`,
    '',
    '## Guardrails',
    '',
    '> Never expose PII outside a registered consent scope. Verify against production data before',
    '> proposing any change, and surface the blast radius before acting.',
    '',
    '- Cite the service, deploy or feed you relied on.',
    '- Prefer feature flags over deploys for mitigations.',
    '- Escalate to the on-call when confidence is low.',
    OUTPUT_BLOCK[agent.output] ? '\n' + OUTPUT_BLOCK[agent.output] : '',
  ].join('\n');
}
