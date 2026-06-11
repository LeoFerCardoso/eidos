# Forge — Agentic Engineering Platform (vision)

> **What this document is.** The product vision **and execution spec** for **Forge**, the Equifax
> Internal Developer Platform mocked up in this repo (`app/portal/**`, built on the Eidos Design
> System). Forge is a **visual reference / mockup** — not a running engine. Its job is to make the
> *target state* of an agentic engineering platform concrete enough that each dedicated team at
> Equifax can implement their slice against a shared, opinionated picture. Every screen here is a
> contract for "this is what good looks like," not a deployment.
>
> **Source of the thesis.** Port's [Agentic Engineering Platform](https://www.port.io/blog/port-agentic-engineering-platform).
> This doc maps Port's framework onto what Forge already shows, fixes the domain model, names what
> we're leaving out, and turns every gap into a **mockup to design** (never a backend to build).
>
> **Status:** §1–§6 = the vision. §7 = the per-surface mockup specs for Go/No-Go. §8 = sequence.

---

## 1. The thesis

The IDP unified tools and gave **human** teams one source of truth. The next step: the platform
becomes a **first-class user for AI agents** too. Agents don't want a chatbot — they want what a
senior engineer wants on day one: rich real-time context, golden paths, codified actions they're
allowed to run, and a human who can see, audit, and override what they do.

Port frames this as **three pillars** and **seven building blocks**:

| Pillar | What it means | The fear it answers |
|---|---|---|
| **Context Lake** | Everything an agent needs — architecture, dependencies, ownership, docs, live state — queryable in one place. | Agents acting on stale / missing context (the "95% of AI pilots failed" stat). |
| **Guardrails** | Codified policy that stops destructive action before it happens. | The Replit incident — an agent that deleted a production database. |
| **Human↔Agent Collaboration** | Visibility, auditability, reversibility, joint decisions. | A fleet of agents you can't see, trust, or undo. |

**Seven blocks:** Software Catalog · Actions · Scorecards · Workflow Orchestrator · AI Agents ·
Interface Designer · Access Controls.

**Forge's interpretation** (already encoded in Home and Insights): agents work 24×7 by default; the
**human is the director, not the executor**. Home is *mission control over a workforce of agents* —
`Decide → Steer → Observe` — not a human inbox of "PRs waiting for you."

---

## 2. The domain model — the nouns

The single most important thing to get right before building screens. Port lists **Actions** and
**Workflow Orchestrator** as *separate* blocks; collapsing them is a modeling error. The clean model
is a **three-level hierarchy** — definition vs. composite vs. instance — plus orthogonal concepts
(triggers, transport, CI).

```
SKILL          an agent CAPABILITY            "knows how to do dependency-upgrade"
  │ uses
ACTION         an ATOMIC executable unit      open-PR · scale-replicas · rotate-secret
  │            (definition: input schema + guardrail policy)
  │ sequenced by
WORKFLOW       a COMPOSITE orchestration      graph of Actions + branches + guardrails + triggers
  │            (definition)                   ← the 3 Port use-cases ARE workflow templates
  │ instantiated as
RUN            one EXECUTION instance         step timeline + guardrail verdicts + rollback
```

| Noun | Level | Is | Is **not** |
|---|---|---|---|
| **Skill** | capability | What an agent is good at (a persona/competence). | An executable. |
| **Action** | **definition (atomic)** | A codified executable unit: input schema + guardrail. Called by humans (self-service), agents, or workflows. | A cron job. A workflow. |
| **Workflow** | **definition (composite)** | A graph that sequences Actions with branches + guardrails. The orchestration. The use-case *templates* live here. | A single action. A CI pipeline. |
| **Run** | **instance** | One execution of a Workflow (or a lone Action): the step graph with live progress + rollback. Viewed globally **and** nested under its workflow. | A definition. |
| **Trigger / Automation** | orthogonal | *What kicks a workflow/action off:* manual · agent-initiated · event · **schedule (cron)**. A property of the action/workflow, not a level. | The action itself. |
| **MCP server** | orthogonal | *Transport:* how Actions and Contexts are exposed to agents/models. | A capability. |
| **Pipeline** | orthogonal (CI) | CI/CD specifically (build/test/deploy). A Workflow *step* can call one. | A workflow. |

**Boundaries that keep surfaces from duplicating:**
- **Actions ≠ cron.** Cron is one *trigger*; Actions is the registry of *what can run*, trigger-agnostic.
- **Workflow ≠ Pipeline.** Pipeline = CI/CD (already in the portal). A Workflow can *invoke* a pipeline as one step. Different altitude, no overlap.
- **Skill ≠ Action.** A Skill (agent competence) *uses* Actions (executable units).
- **Run is part of a Workflow.** `/portal/runs` is the global view; `workflows/[id]` shows that
  workflow's runs. The "step graph" is *the workflow definition visualized + a run's progress on it.*

---

## 2.1 How an Action works (the engineering model)

This is the part teams implement. It is written for confidence, not for the mockup — the mockup
*shows* this model, the teams *build* it.

### Anatomy — an Action is a governed wrapper, not a script

An Action bundles two things people conflate: a **definition** (data: schema, guardrail, RBAC,
binding) and, optionally, a **handler** (the code that does the work). Five parts, using
`deploy-service`:

| Part | On `deploy-service` | Role |
|---|---|---|
| **Input schema** | `service`, `version`, `env` | The typed contract. Bad input is rejected before anything runs. |
| **Binding** | `mcp: github` | The Action does NOT reimplement deploy. It is a thin wrapper over an MCP tool. |
| **Guardrail** | `gate: 1-approver` | A policy evaluated *before* execution: auto / N approvers / blocked. |
| **RBAC** | `runnableBy: both` | Who (human or **agent identity**) may invoke it, in what scope. |
| **Audit** | a **Run** | Every call records who, inputs, the gate verdict, outcome, and a rollback handle. |

> **MCP = the muscle** (executes). **Action = the governed nervous system** that decides whether/when
> the muscle moves and records it. The Action is the single chokepoint where permission + validation +
> guardrail + audit happen, so a human and an agent invoking it get the *same* governance. That is
> "agent as a first-class user, same rigor" made literal.

### Is it a Lambda? Do I code every action?

No to both, mostly. You write the **governance pipeline once** (generic), and **declare** each action.
The `execute` is a one-line MCP forward for most actions; only actions that compose/transform need a
real handler (which *can* be a Lambda).

```ts
// ── The framework: written ONCE ──────────────────────────────────────────────
type Gate = 'auto' | { approvers: number } | 'blocked';

interface ActionCtx {
  caller: Principal;                 // human OR agent identity
  scope: { service?: string; env?: string };
  mcp: McpRegistry;                  // the transports
  graph: ContextGraph;               // the Context Lake (for blast radius)
  audit: AuditSink;
}

interface ActionDef<I> {
  id: string;
  input: z.ZodType<I>;                                       // schema
  rbac: RbacRule;                                            // who may run
  triggers: TriggerKind[];
  guardrail: (i: I, ctx: ActionCtx) => Gate | Promise<Gate>; // policy
  execute: (i: I, ctx: ActionCtx) => Promise<ActionResult>;  // binding OR handler
  reversible?: { via: string };                              // rollback action id
}

const registry = new Map<string, ActionDef<any>>();
function defineAction<I>(d: ActionDef<I>) { registry.set(d.id, d); return d; }

// ── The executor: ONE function runs ANY action ───────────────────────────────
async function runAction(id: string, rawInput: unknown, ctx: ActionCtx): Promise<Run> {
  const action = registry.get(id)!;
  if (!can(ctx.caller, action.rbac, ctx.scope)) throw new Denied();   // 1. permission (server-side)
  const input = action.input.parse(rawInput);                         // 2. validate (Zod)
  const gate = await action.guardrail(input, ctx);                    // 3. guardrail
  if (gate === 'blocked') return record(ctx, { status: 'blocked' });
  if (gate !== 'auto') {
    const ok = await requestApproval(gate.approvers, { action, input, ctx }); // → Decide queue
    if (!ok) return record(ctx, { status: 'denied' });
  }
  const result = await action.execute(input, ctx);                    // 4. execute (only per-action bit)
  return record(ctx, { status: 'ok', result, rollback: action.reversible }); // 5. record + audit
}
```

A **config-only** action (no custom logic):

```ts
export const deployService = defineAction({
  id: 'deploy-service',
  input: z.object({ service: serviceRef, version: semver, env: z.enum(['dev','stg','prod']) }),
  rbac: allow({ roles: ['service-owner','platform-eng'], agents: ['deploy-bot'] }),
  triggers: ['manual','agent','event'],
  guardrail: (i, ctx) => {
    if (i.env === 'prod') return { approvers: 1 };
    if (blastRadius(i.service, ctx) > 5) return { approvers: 2 };
    return 'auto';
  },
  execute: (i, ctx) => ctx.mcp.call('github', 'deploy', i),   // the binding, one line
  reversible: { via: 'rollback-deploy' },
});
```

A **handler** action (composes several tools):

```ts
export const scaffoldService = defineAction({
  id: 'scaffold-service',
  input: z.object({ name: z.string(), template: templateRef, tribe: tribeRef }),
  rbac: allow({ roles: ['platform-eng'] }),
  triggers: ['manual'],
  guardrail: () => 'auto',
  execute: async (i, ctx) => {
    const repo = await ctx.mcp.call('github', 'createRepo', { name: i.name, template: i.template });
    await ctx.mcp.call('github', 'addPipeline', { repo: repo.id });
    await ctx.mcp.call('catalog', 'register', { name: i.name, tribe: i.tribe });
    return { repo: repo.url };
  },
});
```

| You write... | Where |
|---|---|
| validate / permission / guardrail / audit / rollback | **once** (the engine) |
| schema + rbac + guardrail rule + triggers | **declared** per action |
| `execute` | one-line MCP forward (most) · a short handler (compose/transform) |

**Ties to the repo:** an Action is essentially **an AI SDK tool + governance metadata**. An agent's
runnable Actions *are* its tools (filtered by RBAC); "the agent called `deploy-service`" is a tool call
that goes through `runAction`. This is the same shape as Temporal activities / Inngest functions.

### How the guardrail computes blast radius

Blast radius is "how much breaks if this goes wrong" — **computed from the Context Lake graph**, not
guessed. The guardrail is only as smart as the catalog it reads (stale catalog = blind guardrail —
literally Port's thesis):

```ts
function blastRadius(service: string, ctx: ActionCtx): number {
  const node = ctx.graph.get(service);
  const dependents = node.inbound.length;             // who breaks if this breaks
  const exposure   = node.internetFacing ? 2 : 0;
  const pii        = node.dataClass === 'PII' ? 2 : 0;
  const critical   = node.tier === 'tier-0' ? 3 : 0;  // scoring / decisioning path
  return dependents + exposure + pii + critical;      // a score the policy thresholds
}
```

The mockup surfaces this as a chip ("blast radius: HIGH · 8 dependents · PII · tier-0"); the real impl
computes it live from `architecture.ts`'s topology.

### How an agent identity carries grants — IAM for agents

An agent is a **first-class principal**: a machine identity, like a GCP service account / AWS IAM role
/ SPIFFE identity. Critically:

- Grants are **not carried in the agent**. They are attached to the identity in the **Access control
  plane** (`/portal/access`). The agent presents its identity; the platform resolves what it may do
  **server-side**. RBAC is never trusted from the caller.
- A grant is `(principal, action/role, resource-scope, constraints)`. E.g. `deploy-bot` may run
  `deploy-service` on `tribe-X` services in `{dev,stg}` but **not prod** — prod hits the approval gate
  regardless.
- **Autonomy level** is a property of the grant set (observe-only → suggest → act-with-approval →
  act-autonomously); it caps which gates the agent can clear without a human.
- The agent authenticates with a **short-lived token** (OIDC / workload identity), not a long-lived
  secret. The token proves identity; the platform maps it to grants.
- **The agent never holds the raw power.** It holds an identity that *requests* an Action. The
  governed executor holds the MCP credential and uses it only after the gate passes. An agent can
  *request* a prod deploy; it cannot *do* one without the gate. This is what makes the fleet safe, and
  it is exactly what `/portal/access` visualizes (the grant matrix, the identity drawer with scopes +
  autonomy, the over-privileged flag).

---

## 3. Where Forge stands today

31 portal routes across four nav groups + a top cluster. Coverage against Port's blocks:

| Port block / pillar | Forge surfaces today | Verdict |
|---|---|---|
| **Software Catalog** | `catalog` + `[service]`, `apis`, `databases`, `buckets`, `cloud-resources`, `mcp-servers`, `architecture` (ADRs + graph) | **Strong.** The Context-Lake *substrate* is almost fully drawn. |
| **Context Lake** | `contexts`, `mcp-servers`, the dependency graph in `insights`/`architecture` | **Surface present, concept implicit.** No "what the agent sees" inspector yet. |
| **Guardrails** | Home **Decide** (HITL queue named by guardrail), `quality-gates` (Change Risk Score → gate ladder) | **Ahead of Port's marketing.** The guardrail is a concrete decision, not a slogan. |
| **AI Agents** | `agents` + `[id]` (+ `new`, `[id]/edit`), `skills`, `chat` | **Good fleet model.** Missing: agent *identity & role*. |
| **Scorecards** | `scorecards` + initiatives, `dora` | **Covers.** |
| **Actions** | `create` (templates) as a faint analog | **Missing as a first-class concept.** |
| **Workflow Orchestrator** | `pipelines` + `[run]` (CI only), `runbooks` | **CI runs, not agent workflows.** The orchestration + run-graph levels are missing. |
| **Human↔Agent interface** | Home (`Decide/Steer/Observe`), `insights`, Observe with `verified` + `roll back` | **Most mature asset.** Auditability + reversibility first-class. |
| **Access Controls** | — | **Absent.** The deepest conceptual gap. |

**One-line read:** Forge is the most articulated *picture* of an agentic IDP that exists — the
**interaction thesis is sharper than Port's prose**. What's thin is the machinery that makes "agent
as a user" literally true: **identity/permissions, the atomic Actions registry, the Workflow
orchestration level, and the Run graph.** §7 turns each into a mockup.

---

## 4. The five agent roles

Port casts agents in five archetypes "working across the SDLC in harmony." Making these explicit is
cheap and high-signal — every agent gets a *job title* the UI can group and filter by.

| Role | What the agent does | Forge surface that hosts it | Gap |
|---|---|---|---|
| **Developer** | Writes code, opens PRs, ships behind gates | `agents`, `quality-gates`, `pipelines` | The end-to-end *run* view. |
| **Incident manager** | Detects, diagnoses, remediates, runs the war room | `incidents` + `[id]`, `runbooks` | Agent diagnosis/timeline *inside* the war room. |
| **Policy judge** | Enforces scorecards/policy; approves or blocks | `quality-gates`, `security`, `compliance` | A dedicated "judgment" surface + auto-remediation tie-in. |
| **Product manager** | Triages intake, shapes initiatives, reports status | `scorecards`/initiatives (partial) | **Under-served.** No agent-PM view. |
| **Team lead** | Watches ownership health, nudges, digests | `scorecards`, `catalog` ownership (partial) | **Under-served.** No agent-lead digest. |

---

## 5. The three flagship use-cases — as workflow templates

Port's three "initial autonomous workflows" are, in our model, **named Workflow templates** (§2).
Each instantiates as **Runs**, and is *viewed in context* on its domain page (incidents, security).
The blog is light on steps, so the journeys below are synthesized faithfully to expose the surfaces
each implies. ✅ have it · ⚠️ partial · ❌ missing.

### UC-1 — Ticket → Production · workflow `ticket-to-prod` (Developer agent)

| Step | What happens | Context consumed | Surface |
|---|---|---|---|
| 1. Intake | Issue lands (Jira/Linear), triaged, context assembled | service, owners, ADRs, deps | ❌ **Agent intake queue** |
| 2. Plan | Agent drafts approach, picks a Skill, estimates blast radius | catalog graph, runbooks | ⚠️ agent detail (no plan artifact) |
| 3. Build | Branch, code, tests — by calling **Actions** | templates, repo | ⚠️ `agents`, `create` |
| 4. Gate | Change Risk Score → guardrail picks auto / 1 / 2 / blocked | scorecards, diff | ✅ `quality-gates` + `[pr]` |
| 5. Ship | Deploy via pipeline; every step auditable | envs, pipeline | ✅ `pipelines` + `[run]` |
| 6. Verify + undo | Post-deploy checks; one-click rollback | DORA, monitors | ⚠️ Home Observe (not per-run) |

**Leaving out:** the **intake queue** (where work originates) and the **Run graph** that stitches
plan→build→gate→ship→verify into one auditable, reversible artifact.

### UC-2 — Self-healing incidents · workflow `self-heal-incident` (Incident-manager agent)

| Step | What happens | Context consumed | Surface |
|---|---|---|---|
| 1. Detect | Alert / SLO breach opens an incident | monitors, SLOs | ✅ `incidents` |
| 2. Diagnose | Agent correlates deploys, dep graph, PRs, runbooks → root-cause hypothesis | architecture graph, pipelines, contexts | ⚠️ war room (no agent diagnosis panel) |
| 3. Remediate | Proposes/executes a runbook action (rollback, scale, flag flip) **behind a guardrail** | runbooks, actions | ❌ **guardrailed remediation** |
| 4. Coordinate | War room, comms, on-call paging | on-call, people | ✅ `incidents/[id]` |
| 5. Postmortem | Auto-drafts timeline, action items, ADR | full incident context | ❌ **auto-postmortem** |

### UC-3 — Autonomous AppSec posture · workflow `appsec-remediation` (Policy-judge agent)

| Step | What happens | Context consumed | Surface |
|---|---|---|---|
| 1. Scan | Continuous posture scan → vulns / deviations / threats | scanners, SBOM | ✅ `security` |
| 2. Prioritize | Rank by exploitability × blast radius × exposure (PII? internet-facing?) | catalog, data-classification | ⚠️ `security` (no blast-radius lens) |
| 3. Remediate | Auto-open a PR (dep bump / config) **behind a guardrail** | repo, actions | ❌ **auto-remediation PR** |
| 4. Judge | Policy-judge enforces gates; deviations need human sign-off | scorecards, policies | ❌ **policy-judge surface** |
| 5. Evidence | Immutable audit trail (LGPD) | audit log | ✅ `compliance` |

---

## 6. The conceptual gaps — closed as mockups

The screens that make "agent as a first-class user" literally true. None require a backend.

- **A. Agent identity & Access Controls** → §7.5 (`/portal/access`). The deepest gap: agents as
  first-class users with the same RBAC rigor as humans.
- **B. Atomic Actions registry** → §7.2 (`/portal/actions`). The missing spine between Skills and MCP.
- **C. Workflow orchestration level** → §7.3 (`/portal/workflows`). The use-case templates as graphs.
- **C′. Run graph** → §7.4 (`/portal/runs`). Executions: auditable, reversible step timelines.
- **D. Context Lake legibility** → §7.8 (context inspector). "What the agent sees."
- **E. Reversibility/trust backbone** → §7.9 (audit log + approvals queue).
- **F. Under-served roles** → §7.7 (role facet) + §7.13 (PM / lead views).

---

## 7. Mockup specs (for Go/No-Go)

Each surface is self-contained and built on existing `.fp-*` classes + `@/ds/core`. Format per item:
route · purpose · layout · features · states · reuse/new.

### 7.1 — `/portal/agents`: agent **role facet** · *cheapest, highest clarity*
- **Purpose:** classify the fleet by the 5 archetypes (§4).
- **Layout:** role badge on each agent card; group/filter-by-role; a legend with counts.
- **States:** "no agents in this role" empty.
- **Reuse:** existing `agents` page. **New:** `role` field in `agents.ts`. One component.

### 7.2 — `/portal/actions` + `[slug]`: the **atomic Actions registry**
- **Purpose:** the catalog of executable units humans (self-service) **and** agents/workflows call.
- **Layout:** KPIs (actions · agent-enabled · runs/week · % guarded) · filter **human-run / agent-run
  / both** + category (deploy, scaffold, db, security, infra) · grid of action cards.
- **Card:** name, description, category, **inputs (schema chips)**, **guardrail policy badge**,
  run-count, who-can-run.
- **Detail `[slug]` (drawer or page):** input schema, attached guardrail, permitted principals,
  **linked Skill**, **linked MCP server**, **Triggers** (manual / agent / event / cron), run history.
- **States:** deprecated action; **ungoverned action** warning.
- **Reuse:** `FCardHead`/`FRow`, `Pill`, `Button`, `Drawer`. **New:** `data/actions.ts` (cross-refs
  `skills.ts`/`mcp.ts`).

### 7.3 — `/portal/workflows` + `[id]`: the **Workflow Orchestrator**
- **Purpose:** the library of composite orchestrations — including the three use-case templates.
- **List:** KPIs (workflows · autonomous-eligible · runs/week · success rate) · cards per workflow
  (name, trigger type, # steps, owning agent role, last run, success rate).
- **Detail `[id]`:** the **graph definition** (steps = Actions, with guardrail gates + branches) +
  **Triggers** + a **"Runs of this workflow"** list (links into §7.4). The three flagship workflows
  (`ticket-to-prod`, `self-heal-incident`, `appsec-remediation`) ship as seeded templates.
- **States:** draft vs. published workflow; disabled trigger.
- **Reuse:** the `.fp-steps` step language (already exists for pipelines), `Pill`, `Tabs`. **New:**
  `data/workflows.ts`.

```
[workflow detail]  self-heal-incident · trigger: EVENT (SLO breach) · 84% success · owned by Incident-mgr
┌ definition (graph) ───────────────────────┐ ┌ runs of this workflow ─────────┐
│ ① detect      → action: open-incident      │ │ #4901 ● running   credit-score │
│ ② diagnose    → action: correlate-context  │ │ #4880 ✓ verified  kyc-api      │
│ ③ guardrail   ⚠ blast-radius > N → human   │ │ #4862 ↩ rolled back  ledger    │
│ ④ remediate   → action: rollback | scale   │ │ …                              │
│ ⑤ verify      → action: run-smoke           │ │                    [View all]  │
└────────────────────────────────────────────┘ └────────────────────────────────┘
```

### 7.4 — `/portal/runs` + `[run]`: the **Run graph** (execution instances)
- **Purpose:** every autonomous run as an auditable, reversible step graph. Global view **and**
  nested under `workflows/[id]`.
- **List:** KPIs (runs today · % autonomous · awaiting approval · rolled back) · filters (agent,
  workflow, status, service, outcome) · table (run, agent+role, workflow, trigger, service, step
  progress, status, outcome).
- **Detail `[run]`:** the **step timeline** with live progress; each step shows the **Action called**,
  inputs, **guardrail verdict inline**, duration, **per-step rollback**. Right rail: context consumed,
  guardrails fired, approvals, artifacts (PR, deploy), **Roll back all**.
- **States:** in-progress · **escalated** (links to Home *Decide*) · rolled-back · failed.
- **Reuse:** `pipelines/[run]` visual language + `.fp-steps`, `Pill`, `Button`. **New:** `data/runs.ts`.

```
[run #4901]  self-heal-incident · Sentinel (incident-mgr) · trigger: SLO breach · ● running
┌ steps ──────────────────────────────────┐ ┌ context / artifacts ───────┐
│ ① detect      ✓  opened INC-318          │ │ consumed:                  │
│ ② diagnose    ✓  root-cause: deploy v2.3 │ │  · svc credit-score        │
│ │                hypothesis · 0.86        │ │  · deploy v2.3, ADR-014    │
│ ③ guardrail   ⚠  blast-radius HIGH → human│ │ guardrails: blast ⚠       │
│ │              [Approve & run] [Deny]      │ │ approvals: ana.silva ⏳    │
│ ④ remediate   ◌  rollback v2.3 (blocked) │ │ artifacts: INC-318         │
│ ⑤ verify      ◌                           │ │ [Roll back all]            │
└──────────────────────────────────────────┘ └────────────────────────────┘
```

### 7.5 — `/portal/access`: **unified access control (human + agent)** · *deepest gap*
- **Purpose:** every principal — human or agent — in one place; the agent gets real identity.
- **Layout:** KPIs (principals · agents · humans · over-privileged) · tabs **Principals | Roles |
  Requests | Audit** · the matrix (rows = principals with type badge; cols = scopes/resources; cells =
  permission level) · filters (type, role, scope).
- **Row → identity drawer:** owner, role archetype, granted Actions, scopes (services/envs),
  **autonomy level**, secret/credential refs, last-used, recent actions.
- **Also:** `agents/[id]` gains a **"Permissions & scope"** tab (same identity model).
- **Features:** human/agent filter; **over-privileged** flag (guardrail); access-request/elevation flow.
- **States:** no pending requests; over-privileged row in alert.
- **Reuse:** `Table`, `Pill`, `Tabs`, `Drawer`, `MetricCard`. **New:** `data/access.ts`, `.fp-access*`.

```
┌ Access ──────────────────────────────────────────────────────────┐
│ KPIs: 142 principals · 23 agents · 4 over-priv · 3 requests       │
│ Principals │ Roles │ Requests (3) │ Audit                          │
│ [All ▾][Humans][Agents]  role ▾  scope ▾                ⌕         │
│ ◐ Deploy-bot   AGENT  developer     12 svc   act+approve          │
│ ◐ Sentinel     AGENT  policy-judge  all/read autonomous           │
│ 👤 ana.silva    HUMAN  team-lead     4 svc    —          ⚠ over    │
└───────────────────────────────────────────────────────────────────┘
```

### 7.6 — `incidents/[id]`: **war-room agent diagnosis + guardrailed remediation** (UC-2 in context)
- **Purpose:** show the `self-heal-incident` **run** inside the war room.
- **Adds:** an **agent diagnosis panel** (root-cause hypothesis + confidence + evidence chips:
  deploy/PR/dep-edge/runbook) · a **remediation action** (rollback/scale/flag) with blast-radius +
  guardrail verdict → "Approve & run" or "auto-applied" badge · the **agent timeline** woven into the
  incident timeline (distinct agent vs. human markers) · a link to the full run (§7.4).
- **States:** diagnosing · awaiting approval · remediation applied + verify · rolled back.
- **Reuse:** existing `incidents/[id]` + `.fp-*`. **New:** `.fp-diag*`, fields in `incidents.ts`.

### 7.7 — `/portal/security`: **auto-remediation + policy-judge + blast-radius** (UC-3 in context)
- **Purpose:** show the `appsec-remediation` **run** inside Security.
- **Adds:** a **blast-radius lens** on findings (exposure, data class — `.fp-pii` exists — affected
  services, exploitability → priority) · **auto-remediation PR** (finding → agent PR → links into
  Quality Gates; status open/merged/blocked) · a **policy-judge surface** (decisions: finding, the
  rule/scorecard that fired, verdict auto-fixed / needs sign-off / accepted-risk, human override).
- **States:** auto-fixed · awaiting sign-off · accepted risk (with expiry) · blocked.
- **Reuse:** existing `security` page + `.fp-pii`. **New:** `.fp-judge*`, fields in `security.ts`.

### 7.8 — `catalog/[service]`: **Context inspector** ("what the agent sees")
- **Purpose:** make the Context Lake legible.
- **Adds:** a **"Context"** tab on service detail showing the exact bundle an agent receives —
  ownership, deps in/out, ADRs, runbooks, recent changes, data classification, attached `contexts`,
  scorecards · a **"view as agent"** affordance.
- **States:** **thin-context** warning (entity missing owner/docs).
- **Reuse:** `catalog/[service]` tabs + `architecture.ts`/`contexts.ts`. **New:** `.fp-ctx*`.

### 7.9 — `/portal/audit` + `/portal/approvals`: **trust backbone**
- **Audit:** an immutable feed of every action (agent/human) — principal, action, target, guardrail,
  outcome, timestamp, rollback link · filters.
- **Approvals:** the full backlog of guardrail-escalated decisions (Home *Decide* is the glance
  version) — what, the guardrail that fired, requester (agent), blast radius, SLA, approve/deny.
- **Reuse:** `.fp-decide*` (exists on Home), `Table`. **New:** `data/audit.ts` (approvals extend
  `agent-activity.DECISIONS`).

### 7.10 — Agent **intake queue** (UC-1 origin)
- **Purpose:** where agent work originates — tickets/issues triaged into workflow runs.
- **Layout:** a queue (source Jira/Linear → triaged → assigned agent → run link). Lives standalone or
  as a tab on `/portal/runs`.
- **Reuse:** `Table`/`FRow`. **New:** `data/intake.ts`; links to §7.4.

### 7.11 — **Auto-postmortem** (`incidents/[id]/postmortem`)
- **Purpose:** agent-drafted postmortem.
- **Layout:** auto-drafted timeline, root cause, impact, action items (→ initiatives), ADR suggestion;
  human-edit affordance; draft vs. published.
- **Reuse:** incidents data + prose. **New:** postmortem fields.

### 7.12 — **Autonomy ramp** (in `/portal/access` + `agents/[id]`)
- **Purpose:** how an agent earns autonomy.
- **Layout:** a ladder — observe-only → suggest → act-with-approval → act-autonomously; current level,
  verified-success rate, what unlocks next, demotion triggers.
- **Reuse:** `ScoreGauge`/progress + `Pill`. Part of `access.ts`.

### 7.13 — **Agent-PM + agent-lead views** (under-served roles)
- **PM:** intake triage + initiative shaping + status report — an agent-PM lens on
  `scorecards`/initiatives.
- **Lead:** ownership-health nudges + squad digest — extends `catalog` ownership.
- **Reuse:** `scorecards.ts`/`services.ts`. **New:** lens components.

---

## 8. Sequence

Dependency order — atomic → composite → instance → identity → use-case views → supporting. Each row
is a Go/No-Go unit.

| # | Mockup (§) | Tier | Depends on | Cost |
|---|---|---|---|---|
| 1 | Agent **role facet** (7.1) | foundation | — | XS |
| 2 | **Actions** registry (7.2) | foundation | — | M |
| 3 | **Workflows** (7.3) | foundation | Actions | M |
| 4 | **Runs** graph (7.4) | foundation | Workflows | M |
| 5 | **Access** + identity + autonomy (7.5, 7.12) | foundation | Actions, agents | L |
| 6 | War-room **diagnosis + remediation** (7.6) | use-case | Workflows/Runs | M |
| 7 | Security **auto-remediation + judge** (7.7) | use-case | Workflows/Runs, Quality Gates | M |
| 8 | **Context inspector** (7.8) | supporting | catalog | S |
| 9 | **Audit + approvals** (7.9) | supporting | — | M |
| 10 | **Intake queue** (7.10) | supporting | Runs | S |
| 11 | **Auto-postmortem** (7.11) | supporting | incidents | S |
| 12 | Agent-**PM / lead** views (7.13) | supporting | scorecards | M |

---

## 9. Design constraints (every surface)

Enforced by hooks/verifiers — non-negotiable:

- **Eidos DS only.** Compose existing `@/ds/core` primitives + the portal's `.fp-*` classes; never
  per-page `<style>`. New shared styles extend `src/styles/example-shell.css`.
- **Contrast is non-negotiable** (explicit contrasting fg on any colored/elevated surface; dark ink on
  ember; `.on-accent-soft` on soft bands).
- **Single accent ember `#FF6B35`**, ≤2×/screen. **Geist Sans/Mono.** Logical CSS (RTL first-class).
- **English copy, zero em-dash** (the `prefer-ds-components` hook blocks it); use DS `Button`/`Pill`.
- **The agentic thesis holds:** human is the director. Every surface answers *Decide* (what needs
  me?), *Steer* (where is this heading?), or *Observe* (what did the fleet do, can I undo it?) — with
  auditability and reversibility first-class.
- **Each surface = a `src/portal/data/<name>.ts` data file + page + reuse of `.fp-*` primitives.**
- Verify pixels: `node scripts/shot.mjs <route> dark` + `node scripts/console-check.mjs <route>`.

**Reference memory:** `eidos-agentic-platform-buildout`, `forge-home-agentic`,
`forge-portal-architecture`, `ui-no-default-ai-interface`, `forge-agentic-vision-doc`.
