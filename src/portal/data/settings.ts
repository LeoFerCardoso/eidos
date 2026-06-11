// Forge (IDP Portal) · settings data. Backs the /portal/settings screen · the
// place a user sees everything the platform offers: their profile, the org's
// members and roles, connected third-party integrations (for humans AND agents),
// notification preferences, API keys, security posture, billing and an audit log.
//
// Members reuse the org roster from teams.ts so Settings and Teams agree on who
// exists; this file only layers the *platform-access* facts on top.

import { PEOPLE, type Person } from './teams';

// ── The signed-in user ────────────────────────────────────────────────────────

export const PROFILE = {
  name: 'Leonardo Cardoso',
  initials: 'LC',
  email: 'leofercardoso@gmail.com',
  jobTitle: 'Principal Engineer · Platform',
  timezone: 'America/Sao_Paulo (BRT, UTC−3)',
  language: 'English (US)',
  workspace: 'Equifax BVS',
};

export const TIMEZONES = [
  'America/Sao_Paulo (BRT, UTC−3)',
  'America/New_York (EST, UTC−5)',
  'America/Mexico_City (CST, UTC−6)',
  'Europe/London (GMT, UTC+0)',
  'Australia/Sydney (AEDT, UTC+11)',
];

export const LANGUAGES = ['English (US)', 'Português (Brasil)', 'Español (Latam)'];

// ── Roles (RBAC definitions) ───────────────────────────────────────────────────

export type MemberRole = 'Owner' | 'Admin' | 'Maintainer' | 'Developer' | 'Viewer' | 'Auditor';

export interface RoleDef {
  role: MemberRole;
  desc: string;
  /** scopes this role grants, human-readable. */
  scopes: string[];
  /** can approve guardrail-escalated actions. */
  canApprove: boolean;
}

export const ROLE_DEFS: RoleDef[] = [
  { role: 'Owner',      desc: 'Full control of the workspace, billing and member management.', scopes: ['All resources', 'Billing', 'Members', 'Roles'], canApprove: true },
  { role: 'Admin',      desc: 'Manage members, integrations and platform settings (no billing).', scopes: ['All resources', 'Members', 'Integrations'], canApprove: true },
  { role: 'Maintainer', desc: 'Own services and approve deploys + guardrail escalations.', scopes: ['Owned services', 'Deploy', 'Approve'], canApprove: true },
  { role: 'Developer',  desc: 'Build, open PRs and run self-service actions behind gates.', scopes: ['Owned services', 'Actions', 'Read all'], canApprove: false },
  { role: 'Viewer',     desc: 'Read-only access to the catalog, dashboards and runs.', scopes: ['Read all'], canApprove: false },
  { role: 'Auditor',    desc: 'Read-only plus full audit-log and compliance access.', scopes: ['Read all', 'Audit log', 'Compliance'], canApprove: false },
];

export const ROLE_TONE: Record<MemberRole, 'ember' | 'ice' | 'health-up' | 'neutral'> = {
  Owner: 'ember',
  Admin: 'ember',
  Maintainer: 'ice',
  Developer: 'health-up',
  Viewer: 'neutral',
  Auditor: 'neutral',
};

// ── Members (humans + agent principals) ────────────────────────────────────────

export type PrincipalType = 'human' | 'agent';
export type MemberStatus = 'active' | 'invited' | 'suspended';

export interface Member {
  id: string;
  name: string;
  initials: string;
  email: string;
  type: PrincipalType;
  role: MemberRole;
  jobTitle: string;
  mfa: boolean;
  status: MemberStatus;
  lastActive: string;
}

// Map a person's job role → a sensible default platform role.
function defaultRole(p: Person): MemberRole {
  if (p.role === 'Security Engineer') return 'Admin';
  if (p.role === 'Engineering Manager' || p.role === 'Tech Lead' || p.role === 'Staff Engineer' || p.role === 'SRE') return 'Maintainer';
  return 'Developer';
}

const LAST_ACTIVE = ['2m ago', '14m ago', '1h ago', '3h ago', 'Yesterday', '2d ago', '5d ago'];

const HUMAN_MEMBERS: Member[] = PEOPLE.map((p, i) => ({
  id: p.id,
  name: p.name,
  initials: p.initials,
  email: p.email,
  type: 'human',
  role: defaultRole(p),
  jobTitle: p.role,
  mfa: i % 7 !== 3, // most have MFA; a few don't (surfaced in Security)
  status: i === PEOPLE.length - 1 ? 'invited' : 'active',
  lastActive: LAST_ACTIVE[i % LAST_ACTIVE.length],
}));

// The signed-in user + the two agent principals that hold platform access.
export const MEMBERS: Member[] = [
  { id: 'leonardo', name: PROFILE.name, initials: PROFILE.initials, email: PROFILE.email, type: 'human', role: 'Owner', jobTitle: 'Principal Engineer', mfa: true, status: 'active', lastActive: 'now' },
  { id: 'deploy-bot', name: 'Deploy-bot', initials: 'DB', email: 'deploy-bot@agents.forge', type: 'agent', role: 'Maintainer', jobTitle: 'Developer agent', mfa: true, status: 'active', lastActive: '4m ago' },
  { id: 'sentinel', name: 'Sentinel', initials: 'SN', email: 'sentinel@agents.forge', type: 'agent', role: 'Admin', jobTitle: 'Policy-judge agent', mfa: true, status: 'active', lastActive: '1m ago' },
  ...HUMAN_MEMBERS,
];

export const MEMBER_STATS = {
  total: MEMBERS.length,
  humans: MEMBERS.filter((m) => m.type === 'human').length,
  agents: MEMBERS.filter((m) => m.type === 'agent').length,
  invited: MEMBERS.filter((m) => m.status === 'invited').length,
};

// ── Integrations (third-party apps for humans + agents) ────────────────────────

export type IntegrationStatus = 'connected' | 'available' | 'error';
export type IntegrationUse = 'humans' | 'agents' | 'both';

export interface Integration {
  id: string;
  name: string;
  category: 'Source' | 'CI/CD' | 'ITSM' | 'Observability' | 'Comms' | 'Security' | 'Cloud' | 'Docs' | 'Design';
  desc: string;
  /** brand tile color + a legible foreground for it (contrast non-negotiable). */
  brand: string;
  fg: string;
  monogram: string;
  status: IntegrationStatus;
  use: IntegrationUse;
  connectedBy?: string;
}

export const INTEGRATIONS: Integration[] = [
  { id: 'gitlab',    name: 'GitLab',       category: 'Source',        desc: 'Repos, MRs and CI pipelines. Agents open MRs through it.', brand: '#fc6d26', fg: '#08090A', monogram: 'GL', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'jira',      name: 'Jira',         category: 'Source',        desc: 'Issue tracking and intake for the agent work queue.',      brand: '#0c66e4', fg: '#ffffff', monogram: 'JI', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'servicenow',name: 'ServiceNow',   category: 'ITSM',          desc: 'Incident records and change requests, synced both ways.',  brand: '#62d84e', fg: '#08090A', monogram: 'SN', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'argocd',    name: 'Argo CD',      category: 'CI/CD',         desc: 'GitOps continuous delivery for GKE.',                      brand: '#ef7b4d', fg: '#08090A', monogram: 'AR', status: 'connected', use: 'agents', connectedBy: 'Platform' },
  { id: 'dynatrace', name: 'Dynatrace',    category: 'Observability', desc: 'Davis root-cause and topology feeding incident diagnosis.',brand: '#1496ff', fg: '#08090A', monogram: 'DT', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'prometheus',name: 'Prometheus',   category: 'Observability', desc: 'Alert rules and SLO burn triggers for self-heal workflows.',brand: '#e6522c', fg: '#ffffff', monogram: 'PM', status: 'connected', use: 'agents', connectedBy: 'Platform' },
  { id: 'grafana',   name: 'Grafana',      category: 'Observability', desc: 'Dashboards embedded on service detail and DORA.',          brand: '#f46800', fg: '#08090A', monogram: 'GF', status: 'connected', use: 'humans', connectedBy: 'Platform' },
  { id: 'pagerduty', name: 'PagerDuty',    category: 'Observability', desc: 'On-call paging and incident escalation.',                  brand: '#06ac38', fg: '#ffffff', monogram: 'PD', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'slack',     name: 'Slack',        category: 'Comms',         desc: 'War rooms, approvals and agent notifications.',             brand: '#4a154b', fg: '#ffffff', monogram: 'SL', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'snyk',      name: 'Snyk',         category: 'Security',      desc: 'Dependency + container vuln scanning for AppSec.',          brand: '#4c4a73', fg: '#ffffff', monogram: 'SK', status: 'connected', use: 'agents', connectedBy: 'Security' },
  { id: 'gcp',       name: 'Google Cloud', category: 'Cloud',         desc: 'The primary cloud · GKE, Pub/Sub, BigQuery.',              brand: '#1a73e8', fg: '#ffffff', monogram: 'GC', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'aws',       name: 'AWS',          category: 'Cloud',         desc: 'Secondary cloud for storage and DR.',                      brand: '#ff9900', fg: '#08090A', monogram: 'AW', status: 'connected', use: 'both',   connectedBy: 'Platform' },
  { id: 'confluence',name: 'Confluence',   category: 'Docs',          desc: 'Knowledge base synced into agent Contexts.',               brand: '#0c66e4', fg: '#ffffff', monogram: 'CF', status: 'connected', use: 'agents', connectedBy: 'Diego Vasquez' },
  { id: 'gdrive',    name: 'Google Drive', category: 'Docs',          desc: 'Decks and handbooks indexed as Contexts.',                 brand: '#1fa463', fg: '#ffffff', monogram: 'GD', status: 'connected', use: 'agents', connectedBy: 'Mariana Castelli' },
  { id: 'figma',     name: 'Figma',        category: 'Design',        desc: 'Design specs linked from service docs.',                   brand: '#a259ff', fg: '#08090A', monogram: 'FG', status: 'available', use: 'humans' },
  { id: 'linear',    name: 'Linear',       category: 'Source',        desc: 'Alternative issue tracker for intake.',                    brand: '#5e6ad2', fg: '#ffffff', monogram: 'LN', status: 'available', use: 'both' },
  { id: 'sonarqube', name: 'SonarQube',    category: 'Security',      desc: 'Static analysis and code-quality gates.',                  brand: '#4e9bcd', fg: '#08090A', monogram: 'SQ', status: 'error',     use: 'agents', connectedBy: 'Platform' },
];

export const INTEGRATION_STATUS_TONE: Record<IntegrationStatus, 'health-up' | 'neutral' | 'danger'> = {
  connected: 'health-up',
  available: 'neutral',
  error: 'danger',
};

// ── Notification preferences ───────────────────────────────────────────────────

export interface NotifPref {
  id: string;
  label: string;
  desc: string;
  channels: { inApp: boolean; email: boolean; slack: boolean };
}

export const NOTIF_PREFS: NotifPref[] = [
  { id: 'approvals',  label: 'Approvals needed',     desc: 'A guardrail escalated an agent action to you.',        channels: { inApp: true,  email: true,  slack: true  } },
  { id: 'incidents',  label: 'Incidents',            desc: 'A service you own opened or escalated an incident.',    channels: { inApp: true,  email: true,  slack: true  } },
  { id: 'deploys',    label: 'Deploys',              desc: 'A deploy to a service you own completed or failed.',    channels: { inApp: true,  email: false, slack: true  } },
  { id: 'gates',      label: 'Quality gates',        desc: 'A PR you authored passed or was blocked by a gate.',    channels: { inApp: true,  email: false, slack: false } },
  { id: 'mentions',   label: 'Mentions',             desc: 'Someone @mentioned you in a review or war room.',       channels: { inApp: true,  email: true,  slack: true  } },
  { id: 'digest',     label: 'Weekly digest',        desc: 'A Monday summary of your fleet and ownership health.',  channels: { inApp: false, email: true,  slack: false } },
];

// ── API keys ───────────────────────────────────────────────────────────────────

export type KeyStatus = 'active' | 'revoked';

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  created: string;
  lastUsed: string;
  status: KeyStatus;
}

export const API_KEYS: ApiKey[] = [
  { id: 'k1', name: 'CI pipeline token',   prefix: 'forge_ci_8f2a…',  scopes: ['deploy', 'read:catalog'], created: 'Mar 2026', lastUsed: '8m ago',   status: 'active' },
  { id: 'k2', name: 'Local CLI',           prefix: 'forge_cli_3b1d…', scopes: ['read:all', 'actions'],    created: 'Jan 2026', lastUsed: '2h ago',   status: 'active' },
  { id: 'k3', name: 'Grafana exporter',    prefix: 'forge_ro_a90c…',  scopes: ['read:metrics'],           created: 'Nov 2025', lastUsed: '1d ago',   status: 'active' },
  { id: 'k4', name: 'Old migration script',prefix: 'forge_mg_551e…',  scopes: ['write:catalog'],          created: 'Aug 2025', lastUsed: '4mo ago',  status: 'revoked' },
];

// ── Security ────────────────────────────────────────────────────────────────────

export const SECURITY = {
  sso: { provider: 'Okta (SAML 2.0)', enabled: true, enforced: true },
  mfa: { policy: 'Required for all members', coverage: 0.94 },
  sessionTimeout: '12 hours',
};

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export const SESSIONS: Session[] = [
  { id: 's1', device: 'Chrome · macOS',   location: 'São Paulo, BR', lastActive: 'now',     current: true  },
  { id: 's2', device: 'Forge CLI',        location: 'São Paulo, BR', lastActive: '2h ago',  current: false },
  { id: 's3', device: 'Safari · iPhone',  location: 'São Paulo, BR', lastActive: 'Yesterday', current: false },
];

// ── Billing ─────────────────────────────────────────────────────────────────────

export const BILLING = {
  plan: 'Platform · Enterprise',
  renews: 'Renews Apr 1, 2026',
  seats: { used: 33, total: 50 },
  aiCredits: { used: 3200, total: 5000, unit: 'this month' },
};

export interface Invoice {
  id: string;
  period: string;
  amount: string;
  status: 'paid' | 'due';
}

export const INVOICES: Invoice[] = [
  { id: 'i1', period: 'Mar 2026', amount: 'R$ 48.000', status: 'paid' },
  { id: 'i2', period: 'Feb 2026', amount: 'R$ 48.000', status: 'paid' },
  { id: 'i3', period: 'Jan 2026', amount: 'R$ 44.500', status: 'paid' },
];

// ── Audit log (config changes) ───────────────────────────────────────────────────

export type AuditKind = 'member' | 'role' | 'integration' | 'security' | 'key';

export interface AuditEvent {
  id: string;
  kind: AuditKind;
  actor: string;
  action: string;
  when: string;
}

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'a1', kind: 'role',        actor: 'Leonardo Cardoso', action: 'Granted Maintainer to Deploy-bot (agent)',          when: '4m ago' },
  { id: 'a2', kind: 'integration', actor: 'Security',         action: 'SonarQube integration entered error state',          when: '38m ago' },
  { id: 'a3', kind: 'key',         actor: 'Bruno Tanaka',     action: 'Created API key “CI pipeline token”',                when: '2h ago' },
  { id: 'a4', kind: 'security',    actor: 'Leonardo Cardoso', action: 'Enforced MFA for all members',                       when: 'Yesterday' },
  { id: 'a5', kind: 'member',      actor: 'Patrícia Lemos',   action: 'Invited Larissa Nunes to the workspace',             when: '2d ago' },
  { id: 'a6', kind: 'integration', actor: 'Diego Vasquez',    action: 'Connected Confluence for agent Contexts',            when: '3d ago' },
  { id: 'a7', kind: 'role',        actor: 'Leonardo Cardoso', action: 'Set Sentinel (agent) to Admin · policy-judge',       when: '4d ago' },
];

// ── Section registry (drives the settings sub-nav) ────────────────────────────────

export type SettingsSectionId =
  | 'general' | 'appearance' | 'members' | 'roles' | 'integrations'
  | 'notifications' | 'keys' | 'security' | 'billing' | 'audit';

export const SETTINGS_SECTIONS: { id: SettingsSectionId; label: string; icon: string; group: string }[] = [
  { id: 'general',       label: 'General',            icon: 'user',      group: 'Account' },
  { id: 'appearance',    label: 'Appearance',         icon: 'palette',   group: 'Account' },
  { id: 'notifications', label: 'Notifications',      icon: 'bell',      group: 'Account' },
  { id: 'keys',          label: 'API keys',           icon: 'key',       group: 'Account' },
  { id: 'members',       label: 'Members',            icon: 'network',   group: 'Workspace' },
  { id: 'roles',         label: 'Roles & permissions',icon: 'badgeCheck',group: 'Workspace' },
  { id: 'integrations',  label: 'Integrations',       icon: 'plug',      group: 'Workspace' },
  { id: 'security',      label: 'Security',           icon: 'lock',      group: 'Workspace' },
  { id: 'billing',       label: 'Billing',            icon: 'gauge',     group: 'Workspace' },
  { id: 'audit',         label: 'Audit log',          icon: 'auditLog',  group: 'Workspace' },
];
