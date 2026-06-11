// Forge (IDP Portal) · Access control (Equifax Boa Vista, credit bureau).
// Naming: design system = "Eidos"; product/portal = "Forge"; copilot = "Forge AI".
//
// Backs /portal/access. The deepest claim of the agentic platform made literal:
// agents are FIRST-CLASS PRINCIPALS with the same RBAC rigor as humans. One
// plane lists humans AND agent (machine) identities together; an agent carries
// an owner, a role, granted Actions, scopes, an AUTONOMY level, and secret refs.
// See docs/AGENTIC-PLATFORM-VISION.md §2.1 (IAM for agents) + §7.5.
//
// Grants reference real Action ids (actions.ts) so the matrix is consistent with
// what can actually be run. Mock, but internally coherent.

export type PrincipalKind = 'human' | 'agent';

// The autonomy ramp: how much an agent may do without a human in the loop.
// An agent earns the next level as its verified-success rate climbs; it is
// demoted on a bad run. Humans have no autonomy level (they ARE the loop).
export type AutonomyLevel = 'observe' | 'suggest' | 'approve' | 'autonomous';

export const AUTONOMY_ORDER: AutonomyLevel[] = ['observe', 'suggest', 'approve', 'autonomous'];
export const AUTONOMY_META: Record<AutonomyLevel, { label: string; blurb: string }> = {
  observe:    { label: 'Observe only',     blurb: 'Reads context, proposes nothing that acts.' },
  suggest:    { label: 'Suggest',          blurb: 'Drafts actions for a human to run.' },
  approve:    { label: 'Act with approval', blurb: 'Runs actions, each behind a human gate.' },
  autonomous: { label: 'Autonomous',       blurb: 'Runs auto-gated actions without a human.' },
};

export interface Grant {
  /** Action id (actions.ts) or a role grant. */
  action: string;
  /** Resource scope the grant applies to. */
  scope: string;
}

export interface Principal {
  id: string;
  name: string;
  kind: PrincipalKind;
  /** Agents: their archetype label. Humans: job title. */
  role: string;
  /** Agents: owning team/human. */
  owner?: string;
  /** Humans: email. */
  email?: string;
  /** Agents only. */
  autonomy?: AutonomyLevel;
  /** Service / domain scopes. */
  scopes: string[];
  /** Environment scopes. */
  envs: string[];
  grants: Grant[];
  /** Agents: number of secret/credential refs held by the identity. */
  secrets?: number;
  lastUsed: string;
  /** Holds grants beyond its autonomy level or unused for 90d. */
  overPrivileged?: boolean;
  /** Agents: verified-success rate (drives the autonomy ramp). */
  successRate?: number;
}

export const PRINCIPALS: Principal[] = [
  // ── Agents (machine identities) ───────────────────────────────────────────
  {
    id: 'deploy-bot', name: 'Deploy-bot', kind: 'agent', role: 'Developer', owner: 'SRE Platform',
    autonomy: 'approve', scopes: ['tribe-decisioning', 'tribe-onboarding'], envs: ['dev', 'stg', 'prod'],
    grants: [
      { action: 'deploy-service', scope: 'tribe-* · dev,stg (prod gated)' },
      { action: 'run-pipeline', scope: 'tribe-* · all envs' },
      { action: 'rollback-deploy', scope: 'tribe-* · all envs' },
      { action: 'toggle-feature-flag', scope: 'tribe-decisioning' },
    ],
    secrets: 3, lastUsed: '12m ago', successRate: 96,
  },
  {
    id: 'sentinel', name: 'Sentinel', kind: 'agent', role: 'Incident manager', owner: 'SRE Platform',
    autonomy: 'autonomous', scopes: ['all services · read', 'tier-1 · act'], envs: ['stg', 'prod'],
    grants: [
      { action: 'open-incident', scope: 'all services' },
      { action: 'rollback-deploy', scope: 'tier-1 · last-known-good' },
      { action: 'scale-replicas', scope: 'tier-1 · within envelope' },
      { action: 'restart-service', scope: 'tier-1' },
      { action: 'flush-cache', scope: 'all services' },
      { action: 'post-status-update', scope: 'internal' },
    ],
    secrets: 4, lastUsed: '3m ago', successRate: 91,
  },
  {
    id: 'appsec-bot', name: 'AppSec-bot', kind: 'agent', role: 'Policy judge', owner: 'Security',
    autonomy: 'approve', scopes: ['all repos · scan', 'all services · PR'], envs: ['dev', 'stg'],
    grants: [
      { action: 'open-remediation-pr', scope: 'all services' },
      { action: 'bump-dependency', scope: 'all repos' },
      { action: 'run-pipeline', scope: 'all services' },
    ],
    secrets: 2, lastUsed: '40m ago', successRate: 88,
  },
  {
    id: 'onboard-bot', name: 'Onboard-bot', kind: 'agent', role: 'Team lead', owner: 'Developer Experience',
    autonomy: 'suggest', scopes: ['golden-path templates'], envs: ['dev'],
    grants: [
      { action: 'scaffold-service', scope: 'paved-road only' },
      { action: 'grant-access', scope: 'read-only roles' },
    ],
    secrets: 1, lastUsed: '2d ago', successRate: 99,
  },
  {
    id: 'cost-bot', name: 'Cost-bot', kind: 'agent', role: 'Product manager', owner: 'FinOps',
    autonomy: 'observe', scopes: ['all accounts · read'], envs: ['prod'],
    grants: [{ action: 'snapshot-database', scope: 'reporting only' }],
    secrets: 0, lastUsed: '1d ago', successRate: 94,
    overPrivileged: true, // holds snapshot grant it has not used in 90d
  },
  {
    id: 'lgpd-bot', name: 'LGPD-bot', kind: 'agent', role: 'Policy judge', owner: 'Compliance',
    autonomy: 'suggest', scopes: ['consent ledger · read', 'PII map'], envs: ['prod'],
    grants: [{ action: 'purge-pii', scope: 'blocked · proposes only' }],
    secrets: 1, lastUsed: '5d ago', successRate: 100,
  },

  // ── Humans ────────────────────────────────────────────────────────────────
  {
    id: 'ana-silva', name: 'Ana Silva', kind: 'human', role: 'Team lead · Decisioning',
    email: 'ana.silva@equifax.com', scopes: ['tribe-decisioning'], envs: ['dev', 'stg', 'prod'],
    grants: [
      { action: 'deploy-service', scope: 'tribe-decisioning · all envs' },
      { action: 'apply-terraform', scope: 'tribe-decisioning' },
      { action: 'grant-access', scope: 'tribe-decisioning' },
    ],
    lastUsed: '1h ago',
  },
  {
    id: 'pedro-alves', name: 'Pedro Alves', kind: 'human', role: 'Senior engineer · Onboarding',
    email: 'pedro.alves@equifax.com', scopes: ['tribe-onboarding'], envs: ['dev', 'stg'],
    grants: [
      { action: 'deploy-service', scope: 'tribe-onboarding · dev,stg' },
      { action: 'run-pipeline', scope: 'tribe-onboarding' },
      { action: 'scaffold-service', scope: 'all' },
    ],
    lastUsed: '4h ago',
  },
  {
    id: 'lucas-dpo', name: 'Lucas Moreira', kind: 'human', role: 'Data Protection Officer',
    email: 'lucas.moreira@equifax.com', scopes: ['compliance', 'PII'], envs: ['prod'],
    grants: [
      { action: 'purge-pii', scope: 'with DPO ticket · 2 approvers' },
      { action: 'grant-access', scope: 'compliance scopes' },
    ],
    lastUsed: '2d ago',
  },
  {
    id: 'maria-lopes', name: 'Maria Lopes', kind: 'human', role: 'Platform engineer · SRE',
    email: 'maria.lopes@equifax.com', scopes: ['all services'], envs: ['dev', 'stg', 'prod'],
    grants: [
      { action: 'apply-terraform', scope: 'all workspaces' },
      { action: 'rotate-secret', scope: 'all services' },
      { action: 'provision-database', scope: 'all' },
      { action: 'grant-access', scope: 'platform roles' },
    ],
    lastUsed: '30m ago',
    overPrivileged: true, // broad standing prod access
  },
];

export const getPrincipal = (id: string): Principal | undefined => PRINCIPALS.find((p) => p.id === id);

export interface AccessRequest {
  id: string;
  principalId: string;
  principalName: string;
  principalKind: PrincipalKind;
  want: string;   // action or role requested
  scope: string;
  reason: string;
  when: string;
}

export const REQUESTS: AccessRequest[] = [
  { id: 'req-301', principalId: 'deploy-bot', principalName: 'Deploy-bot', principalKind: 'agent', want: 'deploy-service · prod (un-gated)', scope: 'tribe-decisioning', reason: 'Promote to autonomous for stg-verified releases.', when: '20m ago' },
  { id: 'req-302', principalId: 'appsec-bot', principalName: 'AppSec-bot', principalKind: 'agent', want: 'bump-dependency', scope: 'tier-0 services', reason: 'Extend auto-remediation to tier-0 after 88% success.', when: '2h ago' },
  { id: 'req-303', principalId: 'pedro-alves', principalName: 'Pedro Alves', principalKind: 'human', want: 'deploy-service · prod', scope: 'tribe-onboarding', reason: 'On-call rotation starting next sprint.', when: 'Yesterday' },
];

const agents = PRINCIPALS.filter((p) => p.kind === 'agent');
const humans = PRINCIPALS.filter((p) => p.kind === 'human');
const overPriv = PRINCIPALS.filter((p) => p.overPrivileged).length;

export const KPIS = [
  { id: 'principals', label: 'Principals', value: String(PRINCIPALS.length), note: 'Humans and agents, one plane.' },
  { id: 'agents', label: 'Agent identities', value: String(agents.length), note: 'First-class machine principals.' },
  { id: 'requests', label: 'Pending requests', value: String(REQUESTS.length), note: 'Access / elevation to review.' },
  { id: 'overpriv', label: 'Over-privileged', value: String(overPriv), note: 'Grants beyond use or autonomy.' },
];
