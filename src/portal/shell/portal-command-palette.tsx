'use client';
// Forge — the ⌘K command palette. Same UX + .cp-* markup as the Eidos DS docs
// palette (src/components/layout/command-palette.tsx), but scoped to the PRODUCT
// instead of the DS nav: it searches portal destinations, services and actions.
//
// This is a SEED we grow as new screens land — add entries to buildEntries()
// (a navigate route, a service, a quick action) and they become searchable +
// keyboard-runnable for free. Keep it the single source of "where can I go /
// what can I do" in Forge.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/ds/core';
import { SERVICES } from '@/portal/data/services';
import { PRODUCTS } from '@/portal/data/products';
import { AGENTS } from '@/portal/data/agents';
import { SKILLS } from '@/portal/data/skills';
import { CONTEXTS } from '@/portal/data/contexts';
import { SERVERS } from '@/portal/data/mcp';

type Group = 'Navigate' | 'Action' | 'Service' | 'Product' | 'Agent' | 'Skill' | 'Context' | 'MCP server';

interface CmdEntry {
  id: string;
  label: string;
  group: Group;
  icon: keyof typeof Icons;
  href?: string;          // route to push
  onRun?: () => void;     // or an action to run (takes priority over href)
  hint?: string;          // trailing context (tribe, shortcut…)
  keywords?: string;      // extra fuzzy-match haystack
}

// Subsequence fuzzy match — identical to the DS palette so the feel is the same.
const fuzzy = (q: string, target: string) => {
  if (!q) return true;
  q = q.toLowerCase();
  target = target.toLowerCase();
  let i = 0;
  for (const ch of target) {
    if (ch === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
};

// Navigate — the live product IA. Mirrors the sidebar rail; keep in sync as
// routes ship. Every screen in the portal is reachable from here.
const NAV_ENTRIES: CmdEntry[] = [
  { id: 'nav-home',       label: 'Home',           group: 'Navigate', icon: 'home',          href: '/portal' },
  { id: 'nav-teams',      label: 'Teams',          group: 'Navigate', icon: 'network',       href: '/portal/teams', keywords: 'org people squads alliances tribes region headcount' },
  { id: 'nav-notifs',     label: 'Notifications',  group: 'Navigate', icon: 'bell',          href: '/portal/notifications', keywords: 'inbox alerts' },
  { id: 'nav-services',   label: 'Services',       group: 'Navigate', icon: 'server',        href: '/portal/catalog', keywords: 'software catalog microservices' },
  { id: 'nav-products',   label: 'Products',       group: 'Navigate', icon: 'package',       href: '/portal/products', keywords: 'offerings onescore konduto bureau' },
  { id: 'nav-apis',       label: 'APIs',           group: 'Navigate', icon: 'braces',        href: '/portal/apis', keywords: 'rest grpc graphql contracts' },
  { id: 'nav-databases',  label: 'Databases',      group: 'Navigate', icon: 'database',      href: '/portal/databases' },
  { id: 'nav-buckets',    label: 'Storages',       group: 'Navigate', icon: 'folder',        href: '/portal/buckets', keywords: 'buckets object storage gcs s3' },
  { id: 'nav-mcp',        label: 'MCP servers',    group: 'Navigate', icon: 'plug',          href: '/portal/mcp-servers', keywords: 'tools transport model context protocol' },
  { id: 'nav-cloud',      label: 'Cloud Resources',group: 'Navigate', icon: 'cloud',         href: '/portal/cloud-resources', keywords: 'gcp aws finops spend infrastructure' },
  { id: 'nav-templates',  label: 'Templates',      group: 'Navigate', icon: 'squareDashed',  href: '/portal/create', keywords: 'golden path scaffold new service' },
  { id: 'nav-chat',       label: 'Chats',          group: 'Navigate', icon: 'chat',          href: '/portal/chat', keywords: 'forge ai assistant projects conversations threads' },
  { id: 'nav-agents',     label: 'Agents',         group: 'Navigate', icon: 'agent',         href: '/portal/agents', keywords: 'fleet autonomous' },
  { id: 'nav-skills',     label: 'Skills',         group: 'Navigate', icon: 'zap',           href: '/portal/skills', keywords: 'capabilities marketplace' },
  { id: 'nav-actions',    label: 'Actions',        group: 'Navigate', icon: 'command',       href: '/portal/actions', keywords: 'executable units registry guardrail' },
  { id: 'nav-contexts',   label: 'Contexts',       group: 'Navigate', icon: 'layers',        href: '/portal/contexts', keywords: 'context lake knowledge sources' },
  { id: 'nav-traces',     label: 'Traces',         group: 'Navigate', icon: 'branch',        href: '/portal/traces', keywords: 'spans llm observability latency tokens cost spans tree' },
  { id: 'nav-evals',      label: 'Evaluations',    group: 'Navigate', icon: 'checkCheck',    href: '/portal/evaluations', keywords: 'experiments scorers golden dataset llm judge regression gate' },
  { id: 'nav-insights',   label: 'AI-Insights',    group: 'Navigate', icon: 'sparkle',       href: '/portal/insights' },
  { id: 'nav-intake',     label: 'Intake',         group: 'Navigate', icon: 'circleDot',     href: '/portal/intake', keywords: 'tickets jira servicenow triage queue agent work origin tasks issues' },
  { id: 'nav-workflows',  label: 'Workflows',      group: 'Navigate', icon: 'share',         href: '/portal/workflows', keywords: 'orchestration templates graph' },
  { id: 'nav-runs',       label: 'Runs',           group: 'Navigate', icon: 'activity',      href: '/portal/runs', keywords: 'executions timeline rollback' },
  { id: 'nav-pipelines',  label: 'Pipelines',      group: 'Navigate', icon: 'pipeline',      href: '/portal/pipelines', keywords: 'ci cd builds deploys' },
  { id: 'nav-gates',      label: 'Quality Gates',  group: 'Navigate', icon: 'gitPullRequest',href: '/portal/quality-gates', keywords: 'pr change risk score' },
  { id: 'nav-flags',      label: 'Feature Flags',  group: 'Navigate', icon: 'flag',          href: '/portal/feature-flags', keywords: 'toggles rollout' },
  { id: 'nav-dora',       label: 'DORA',           group: 'Navigate', icon: 'gauge',         href: '/portal/dora', keywords: 'metrics deployment frequency lead time' },
  { id: 'nav-incidents',  label: 'Incidents',      group: 'Navigate', icon: 'incident',      href: '/portal/incidents', keywords: 'war room on-call slo' },
  { id: 'nav-runbooks',   label: 'Runbooks',       group: 'Navigate', icon: 'runbook',       href: '/portal/runbooks' },
  { id: 'nav-access',     label: 'Access',         group: 'Navigate', icon: 'user',          href: '/portal/access', keywords: 'rbac principals agents identity autonomy grants over-privileged' },
  { id: 'nav-approvals',  label: 'Approvals',      group: 'Navigate', icon: 'gate',          href: '/portal/approvals', keywords: 'guardrail escalations decide queue sla approve deny' },
  { id: 'nav-audit',      label: 'Audit log',      group: 'Navigate', icon: 'auditLog',      href: '/portal/audit', keywords: 'immutable trail events principal outcome rollback' },
  { id: 'nav-scorecards', label: 'Scorecards',     group: 'Navigate', icon: 'score',         href: '/portal/scorecards', keywords: 'standards initiatives' },
  { id: 'nav-security',   label: 'Security',       group: 'Navigate', icon: 'lock',          href: '/portal/security', keywords: 'vulnerabilities appsec posture' },
  { id: 'nav-fraud',      label: 'Fraud & Risk',   group: 'Navigate', icon: 'shield',        href: '/portal/fraud' },
  { id: 'nav-compliance', label: 'LGPD',           group: 'Navigate', icon: 'compliance',    href: '/portal/compliance', keywords: 'consent data protection dsr audit' },
  { id: 'nav-arch',       label: 'Architecture',   group: 'Navigate', icon: 'book',          href: '/portal/architecture', keywords: 'adr decision records diagrams' },
  { id: 'nav-settings',   label: 'Settings',       group: 'Navigate', icon: 'settings',      href: '/portal/settings', keywords: 'preferences profile members roles integrations billing api keys timezone language' },
];

// The entry table. GROW THIS as screens ship — one object per destination/action.
// Navigate routes + quick actions + every jump-to-able entity (each lands on its
// exact detail screen).
function buildEntries(actions: { openAI: () => void }): CmdEntry[] {
  return [
    ...NAV_ENTRIES,

    // Actions — quick verbs; this list is where future commands accrue.
    { id: 'act-ai',         label: 'Ask Forge AI',  group: 'Action', icon: 'sparkle',  onRun: actions.openAI, keywords: 'copilot assistant chat estate' },
    { id: 'act-new-service',label: 'New service',   group: 'Action', icon: 'plus',     href: '/portal/create', keywords: 'scaffold golden path create' },
    { id: 'act-new-agent',  label: 'New agent',     group: 'Action', icon: 'agent',    href: '/portal/agents/new', keywords: 'create build agent' },
    { id: 'act-invite',     label: 'Invite member', group: 'Action', icon: 'user',     href: '/portal/settings', keywords: 'add people team workspace' },
    { id: 'act-settings',   label: 'Open settings', group: 'Action', icon: 'settings', href: '/portal/settings', keywords: 'preferences' },

    // Services — every catalog service is jump-to-able by name / tribe / lang.
    ...SERVICES.map((s): CmdEntry => ({
      id: `svc-${s.id}`,
      label: s.name,
      group: 'Service',
      icon: 'server',
      href: `/portal/catalog/${s.id}`,
      hint: s.tribe,
      keywords: `${s.tribe} ${s.lang} ${s.summary}`,
    })),

    // Products — jump to the product detail.
    ...PRODUCTS.map((p): CmdEntry => ({
      id: `prod-${p.id}`,
      label: p.name,
      group: 'Product',
      icon: 'package',
      href: `/portal/products/${p.id}`,
      hint: p.tribe,
      keywords: `${p.tribe} ${p.summary}`,
    })),

    // Agents — jump to the agent detail.
    ...AGENTS.map((a): CmdEntry => ({
      id: `agent-${a.id}`,
      label: a.name,
      group: 'Agent',
      icon: 'agent',
      href: `/portal/agents/${a.id}`,
      hint: a.role,
      keywords: `${a.role} ${a.desc} ${a.tags.join(' ')}`,
    })),

    // Skills — jump to the skill detail.
    ...SKILLS.map((s): CmdEntry => ({
      id: `skill-${s.id}`,
      label: s.name,
      group: 'Skill',
      icon: 'zap',
      href: `/portal/skills/${s.id}`,
      hint: s.category,
      keywords: `${s.category} ${s.desc}`,
    })),

    // Contexts — jump to the context detail.
    ...CONTEXTS.map((c): CmdEntry => ({
      id: `ctx-${c.id}`,
      label: c.name,
      group: 'Context',
      icon: 'layers',
      href: `/portal/contexts/${c.id}`,
      hint: c.source,
      keywords: `${c.source} ${c.desc}`,
    })),

    // MCP servers — jump to the server detail.
    ...SERVERS.map((m): CmdEntry => ({
      id: `mcp-${m.id}`,
      label: m.name,
      group: 'MCP server',
      icon: 'plug',
      href: `/portal/mcp-servers/${m.id}`,
      hint: m.team,
      keywords: `${m.team} ${m.desc} ${m.transport}`,
    })),
  ];
}

export function PortalCommandPalette({
  open,
  onClose,
  onOpenAI,
}: {
  open: boolean;
  onClose: () => void;
  onOpenAI: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const items = React.useMemo(() => buildEntries({ openAI: onOpenAI }), [onOpenAI]);
  const matches = React.useMemo(
    () => (q ? items.filter((i) => fuzzy(q, [i.label, i.group, i.hint, i.keywords].filter(Boolean).join(' '))) : items),
    [q, items],
  );

  React.useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);
  React.useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const run = (it: CmdEntry) => {
    onClose();
    if (it.onRun) it.onRun();
    else if (it.href) router.push(it.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (matches[active]) run(matches[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  return (
    <div className="cp-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cp" onClick={(e) => e.stopPropagation()}>
        <div className="cp-search">
          <Icons.search size={14} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search services, screens and actions…"
            spellCheck={false}
            autoComplete="off"
            aria-label="Search Forge"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="cp-results" role="listbox">
          {matches.length === 0 && <div className="cp-empty">No matches for &ldquo;{q}&rdquo;</div>}
          {matches.slice(0, 80).map((m, i) => {
            const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[m.icon] ?? Icons.circle;
            return (
              <a
                key={m.id}
                href={m.href ?? '#'}
                className={'cp-row' + (i === active ? ' is-active' : '')}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => { e.preventDefault(); run(m); }}
              >
                <span className="cp-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                  <Icon size={14} aria-hidden="true" />
                  {m.label}
                </span>
                <span className="cp-trail">{m.hint ? `${m.group} · ${m.hint}` : m.group}</span>
              </a>
            );
          })}
        </div>
        <div className="cp-foot">
          <span><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">esc</span> close</span>
          <span style={{ marginInlineStart: 'auto', color: 'var(--fg-faint)' }}>
            {matches.length} of {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
