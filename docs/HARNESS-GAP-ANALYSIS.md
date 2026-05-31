# Forge-DS Harness — Gap Analysis

> **Historical note (superseded):** this analysis was written when the content lived in a
> separate `harness/` folder. It has since been **consolidated entirely into `.claude/`**
> (skills, design-systems, craft, frames, prompt-templates), with the Open Design long-tail
> moved to `.claude/skills/_library/` (`disable-model-invocation`). `harness/` paths below
> are historical; read them as `.claude/`. See `.claude/README.md` for the current map.


> Assessment of `harness/` and the repo against best practices for a high-standard
> Claude Code engineering harness, oriented to building a Web/AI **IDP / Developer
> Experience Platform**. Date: 2026-05-20.

## TL;DR

The `harness/` folder is excellent **content** (76 skills, 140 brand `DESIGN.md`s, 8 craft
rulebooks, prompt-templates) — but it is **inert**: none of it is wired into Claude
Code's native execution model. There is **no `.claude/` directory at all**, so Claude
Code currently discovers *zero* of it. We have a knowledge library; we do not yet have a
harness.

The single biggest gap: **the `harness/` content uses the Open Design schema** (`od:`
frontmatter, `harness/agents/*.yaml`) and lives in the wrong place. Claude Code looks in
`.claude/{agents,skills,commands}` with its own schemas. Bridging that — plus adding the
agents, workflow commands, AI/Next.js/DS skills, hooks, and a distributable plugin you
asked for — is the work.

Severity legend: **P0** = blocks "use Claude Code as the primary tool"; **P1** = needed
for a high-standard harness; **P2** = polish / scale.

---

## 1. Current state

| Area | Present | Notes |
|---|---|---|
| Root `CLAUDE.md` | ✅ | Good: covers app + harness + invariants. |
| `FORGE-DS-REFERENCE.md`, `llms.txt` | ✅ | DS catalog for authoring. |
| `harness/skills/` (76) | ⚠️ content-only | Open Design `od:` schema; not Claude Code skills; wrong location. |
| `harness/design-systems/` (140) | ⚠️ | Brand library; only `forge/` is canonical for us. |
| `harness/craft/` (8) | ✅ content | Brand-agnostic rulebooks; valuable, not wired. |
| `harness/agents/*.yaml` (2) | ⚠️ wrong format | OD "interface" YAML, not Claude Code subagents. |
| `harness/{frames,prompt-templates}` | ✅ content | Asset libraries. |
| `.claude/` | ❌ **missing** | No agents, skills, commands, hooks, settings, output-styles. |
| `.claude/settings.json` | ❌ | No permissions/hooks/env policy. |
| `.mcp.json` | ❌ | Vercel MCP available but not committed; no project MCP. |
| Plugin (`.claude-plugin/`) | ❌ | Nothing distributable to teammates. |
| Lint/format/test/typecheck | ❌ | No ESLint config, no Prettier, no tests, no CI. `next.config` ignores TS+ESLint errors. |
| Component/page generators | ❌ | DS page creation is a manual 3-file ritual (nav-config + jsx + manifest). |
| AI stack (Vercel AI SDK) | ❌ | No `ai`/`@ai-sdk/*` deps; no chat/agent/streaming/artifact scaffolding. |

---

## 2. Gap analysis by category

### A. Claude Code native wiring — **P0**

Nothing in `harness/` is discoverable by Claude Code. Required moves:

1. **Create `.claude/`** as the home of executable primitives (agents, skills, commands,
   hooks, settings, output-styles).
2. **Skill schema bridge.** Claude Code skills are `.claude/skills/<name>/SKILL.md` with
   `name` + `description` frontmatter (auto-discovered; optional `allowed-tools`,
   `disable-model-invocation`, `paths`, `argument-hint`). Our OD skills use `od:`
   frontmatter and live in `harness/skills/`. They will **never trigger** as-is. Fix:
   author thin Claude Code skills under `.claude/skills/` that *reference* the rich
   `harness/skills/<x>/SKILL.md` bodies (keep `harness/` as the content library, make
   `.claude/skills/` the discoverable entry points).
3. **Subagents.** Replace `harness/agents/*.yaml` with `.claude/agents/<name>.md`
   (frontmatter: `name`, `description`, `tools`, `model`; optional `skills:` preload).
4. **`settings.json`.** Define `permissions` (allow safe `npm run *`, `node scripts/*`,
   reads; ask/deny risky `git push`, `rm`, `curl`, `.env` writes), `env`, and `hooks`.
5. **MCP.** Commit `.mcp.json` (at minimum the Vercel MCP; later GitHub/Linear).

### B. Subagents you asked for — **P0/P1**

None exist in CC format. Proposed roster (`.claude/agents/`):

| Agent | Role | Tools (typ.) |
|---|---|---|
| `web-project-lead` | Plans web work, decomposes, routes to specialists, owns acceptance criteria | Read, Grep, Agent, TaskCreate |
| `frontend-engineer` | Implements React/Next.js App Router features, RSC/client boundaries | all code tools |
| `design-system-engineer` | Authors/edits Forge DS components & pages (the 3-file ritual), tokens/ds.css discipline | Read, Edit, Write, Bash |
| `ux-designer` | Applies `harness/craft/` + active `DESIGN.md`; anti-AI-slop; states/RTL/a11y review | Read, Edit |
| `ai-feature-architect` | Picks `streamText` vs `ToolLoopAgent` vs Workflow `DurableAgent`; model via Gateway | Read, Grep, WebFetch |
| `ai-sdk-engineer` | Builds AI SDK v6 chat/agents/streaming/artifacts | all code tools |
| `code-reviewer` | PR/diff review against Forge invariants + craft + React best practices | Read, Grep, Bash |
| `performance-optimizer` | Core Web Vitals, bundle, rendering strategy (pairs with Vercel skills) | Read, Bash |

(Plus the existing global Vercel plugin agents — keep, don't duplicate.)

### C. Workflow processes (commands/skills) — **P0/P1**

The processes you named don't exist as repeatable, guard-railed flows:

| Process | Form | What it encodes |
|---|---|---|
| **New DS component** | `/new-component` skill | nav-config entry → `pages/<group>/<slug>.jsx` (buttons.jsx template) → `gen:manifest` → Anatomy/Decision/Do-Don't/RTL + checklist |
| **New DS page / screen** | `/new-page` skill | route registration + `idp-screen`/`component-page` harness skill + state coverage |
| **Fine-tune / polish** | `/refine` skill | the OD `tweaks`/`critique` flow: targeted visual/interaction polish, before/after, anti-slop re-check |
| **New web portal** | `/scaffold-portal` skill | App Router structure, DS wiring, layout/nav, auth stub |
| **New AI feature** | `/ai-feature` skill | architect → scaffold agent + streaming route + chat UI |
| **Commit / PR** | `/commit`, `/open-pr` skills | conventional commits, run typecheck/lint, PR body template |
| **Release / version bump** | `/release` skill | the two-place version bump + `bump-version.sh` + changelog |

> "Fine-tuning" here is read as **artifact refinement** (component/page polish), not model
> fine-tuning. If you meant prompt/skill tuning, add a `/tune-skill` meta-process too.

### D. Skills missing (the domains you listed) — **P1**

None of these exist yet (the 76 OD skills are decks/posters/landing/social, not these):

- **Web portals / IDP**: `idp-screen` exists in harness content but isn't CC-wired; need
  `portal-scaffold`, `service-catalog-page`, `dashboard-page` as discoverable skills.
- **AI (Vercel)** — author these 5 (from the AI architecture review):
  1. `ai-agent-scaffold` — type-safe `ToolLoopAgent` (Zod tools, `stopWhen`,
     `InferAgentUIMessage`) + matching `useChat` UI.
  2. `ai-streaming-route` — `streamText` → `toUIMessageStreamResponse`, status/stop,
     optional Redis resumable streams.
  3. `ai-chat-ui` — `useChat` + `DefaultChatTransport` + AI Elements message/tool-part
     rendering (state-gated `part.state`).
  4. `ai-generative-ui` — artifacts as `Output.object` Zod schema rendered from typed
     tool parts ("stream data, render components client-side").
  5. `ai-gateway-setup` — standardize on `provider/model` strings, fallbacks, cost caps,
     usage tags. (Plus `ai-sdk-v6-migrate` if legacy AI code appears.)
- **Next.js / React best practices**: `nextjs-app-router-review`, `react-component-review`
  (the global Vercel plugin already offers `react-best-practices`/`nextjs` — wrap/point to
  them rather than re-implement).
- **Design System for engineering platforms**: `ds-component-authoring`,
  `ds-token-discipline`, `ds-a11y-rtl-review` — encode the Forge invariants + craft as
  enforceable skills.

### E. Modern Claude platform features unused — **P1/P2**

- **Plugin + private marketplace** (`.claude-plugin/`): bundle Forge agents/skills/commands/
  hooks so any teammate gets the harness with one install. **This is the unlock for "a
  whole team uses it,"** not per-repo copy-paste.
- **Hooks** (deterministic guardrails): PostToolUse format/lint on `Edit|Write`;
  PreToolUse gate on `git push` (run typecheck); PreToolUse block on edits to
  `manifest.generated.ts`, `tokens.css`/`ds.css` without acknowledgement;
  SessionStart loads DS version + reminds of invariants.
- **Routines (`/schedule`)**: nightly DS drift check (pages without RTL/Do-Don't),
  weekly dependency/AI-SDK-deprecation scan, PR-trigger DS review.
- **`/loop`**: in-session polling of `next build`/dev compile across all 151 routes for
  regressions after a core change.
- **Output style**: a "Forge reviewer" voice for design-critique sessions.

### F. Engineering hygiene — **P1**

- `next.config.mjs` sets `eslint.ignoreDuringBuilds` + `typescript.ignoreBuildErrors`
  (pragmatic for the port, but a quality hole). Add a real lint/typecheck path for
  *new* `app/` + `src/ds/runtime` code, scoped to exclude the ported `src/ds/pages`.
- No tests. Add at least a smoke test that all 151 routes mount (the headless
  `scripts/verify-render.mjs` is the seed for this — promote it to `npm run verify`).
- No CI. A GitHub Action running `gen:manifest` + `build` + `verify` would catch
  registry/nav drift.
- `manifest.generated.ts` is gitignored **and** required by `dev`/`build` (the `predev`/
  `prebuild` hooks regenerate it) — fine, but document it (done in README) and ensure CI
  regenerates.

---

## 3. Signal-vs-noise in current content

- **140 design systems**: only `forge/` is canonical for an IDP. Keep the library
  (useful for the `design-system` axis when prototyping), but mark `forge` as default and
  don't let the picker imply 140 equal choices.
- **76 skills**: ~50 are decks/posters/social/video/avatars/PPT — irrelevant to a
  Web/AI/DevEx team. Curate a **relevant set** (web-prototype, dashboard, saas-landing,
  pricing-page, docs-page, mobile-app, live-dashboard, eng-runbook, pm-spec, critique,
  tweaks, idp-screen, component-page) and surface only those as CC skills; archive the
  rest under `harness/skills/` as a reference library.

---

## 4. Proposed target architecture

```
.claude/
├── settings.json              # permissions, env, hooks (committed)
├── settings.local.json        # personal overrides (gitignored)
├── agents/                    # subagents (section B)
│   ├── web-project-lead.md
│   ├── frontend-engineer.md
│   ├── design-system-engineer.md
│   ├── ux-designer.md
│   ├── ai-feature-architect.md
│   ├── ai-sdk-engineer.md
│   ├── code-reviewer.md
│   └── performance-optimizer.md
├── skills/                    # discoverable CC skills (thin → reference harness/)
│   ├── new-component/SKILL.md
│   ├── new-page/SKILL.md
│   ├── refine/SKILL.md
│   ├── ai-agent-scaffold/SKILL.md
│   ├── ai-streaming-route/SKILL.md
│   ├── ai-chat-ui/SKILL.md
│   ├── ai-generative-ui/SKILL.md
│   ├── ai-gateway-setup/SKILL.md
│   ├── ds-component-authoring/SKILL.md
│   └── … (curated subset bridging harness/skills/*)
├── commands/                  # quick flows: /commit, /open-pr, /release, /verify-routes
├── hooks/                     # scripts invoked by settings.json hooks
└── output-styles/forge-reviewer.md

.claude-plugin/                # later: bundle the above for team distribution
└── plugin.json
.mcp.json                      # Vercel (+ GitHub/Linear later)

harness/                       # UNCHANGED: the content library the skills reference
```

**Bridging principle:** `.claude/skills/<x>/SKILL.md` stays small and says *"read
`harness/skills/<x>/SKILL.md` and the active `harness/design-systems/forge/DESIGN.md` +
required `harness/craft/*`, then …"*. Content lives once (in `harness/`), discovery lives
in `.claude/`.

---

## 5. Prioritized roadmap

**Phase 1 — Foundation (P0).** `.claude/settings.json` (permissions + 3 guardrail hooks),
`.mcp.json` (Vercel), 3 core subagents (`design-system-engineer`, `frontend-engineer`,
`code-reviewer`), and the skill-bridge pattern proven with `new-component` + `refine`.
Outcome: Claude Code actually drives the harness.

**Phase 2 — Web/DS workflows (P1).** `new-page`, `portal-scaffold`, `ds-component-authoring`,
`ds-a11y-rtl-review`; `ux-designer` + `web-project-lead` agents; `/commit` `/open-pr`
`/release` `/verify-routes` commands; promote `verify-render.mjs` to `npm run verify`.

**Phase 3 — AI platform (P1).** Add `ai` + `@ai-sdk/react` deps; the 5 AI skills;
`ai-feature-architect` + `ai-sdk-engineer` agents; AI Gateway model strings; a reference
chat-with-agents route + UI in the app.

**Phase 4 — Distribution & automation (P1/P2).** Package `.claude-plugin/` + private
marketplace; add hooks-as-guardrails everywhere; set up routines (nightly DS drift,
weekly AI-SDK deprecation scan, PR-trigger review); CI workflow.

**Phase 5 — Hardening (P2).** Real lint/typecheck/test gates for new code; curate the
skill/design-system libraries; output style; onboarding guide.

---

## 6. Open decisions

1. **Plugin now or later?** Building straight into a plugin makes team distribution
   trivial but adds indirection while iterating. Recommended: build in `.claude/` first
   (Phase 1–3), package as plugin in Phase 4.
2. **"Fine-tuning" scope** — confirm it means artifact polish (assumed) vs model FT.
3. **Lint/test strictness** — fully enforce on new code while exempting the ported
   `src/ds/pages/**` (Babel-loose JSX)? Recommended yes.
4. **Curate vs keep-all** for the 76 skills / 140 brands — recommend curate-and-surface,
   archive the rest.
