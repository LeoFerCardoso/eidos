# IDP product craft — the Forge model (AI-native)

Read before building OR auditing any Forge (portal, `app/portal/**`) page. Forge is an
**Agentic Engineering Platform**, not a 2015 service catalog. Every page is judged against
this file; the `forge-ai-audit` workflow enforces it. This is a contract, not prose.

## Thesis (why Forge exists)
1. **Reduce developer cognitive load.** 69% of devs lose 8h+/week to inefficiency. Every
   screen must remove friction, not add surface.
2. **Be the trusted context graph that grounds AI agents.** AI dropped into engineering
   without context (ownership, dependencies, architecture, health) produces *agentic
   chaos* — chaos made exponentially worse. The catalog/entity graph is the substrate that
   humans AND agents read; services are exposed as tools (MCP). **Forge AI is the agentic
   layer that reads the estate and acts** — explain → correlate → propose → act (rollback,
   scaffold, remediate) — not a chat box bolted on.

## Personas & the question each page must answer
- **Software Engineer (primary):** Is my service healthy? what do I own? how do I create/ship
  the paved way? what changed?
- **SRE / on-call:** What's on fire now? who's on call? what's the blast radius? which runbook?
  roll back what?
- **Tech Manager / EM:** Is my team's estate healthy & compliant? DORA? scorecard gaps? where's
  the risk, and which initiative closes it?

A page with no explicit persona + question is noise. Name them before composing.

## Pillars (compose every screen from these, ordered by trust)
1. **Catalog / entity graph** — services · libraries · APIs · resources · systems. Ownership-first;
   data must read as fresh/trusted. The spine of everything.
2. **Self-service / Golden Paths** — the paved road (see Scaffolder rule).
3. **Scorecards & DORA** — production-readiness · security · docs · DORA, continuously measured,
   paired with **Initiatives** (time-bound campaigns). Serves devs AND leadership.
4. **Reliability** — incidents · on-call · deploys/rings · SLOs.
5. **Agentic layer (Forge AI)** — woven into every surface; agent activity is itself a surface.

## Entity model (the service is the spine)
The service/entity page is canonical. Tabs answer questions, they don't decorate:
`Overview (README + live status)` · `Ownership` · `Dependencies/relations` · `API` ·
`CI-CD/Deploys` · `Scorecards` · `Incidents`. Metrics get their OWN surface — never dumped on
Overview.

## Golden Path / Scaffolder rule (the thing we got wrong)
A golden path **abstracts** platform decisions. Flow: pick template → fill a FEW fields (name,
owner, description, ≤1–2 template-defined params) → repo created, CI/CD already running, registered
in the catalog. Time-to-repo < 60s. **NEVER ask the developer to choose pipeline shape / SLO target /
observability toggles** — the platform team baked those into the template. Variation, if any, is one
template-defined "parameters" step — not a fixed multi-step wizard. (A 5-step wizard that pushes
SLO/pipeline/observability onto the dev is the exact anti-pattern.)

## Visual & motion — impact ≠ decoration
- **Reuse the example screens' visual language** (`src/ds/examples/**`) — ~80% proven patterns; adapt
  ~20% to the bureau/AI scenario. They were designed top-down; don't erode them with bottom-up patches.
- **MANDATORY: compose ONLY Eidos DS** components/elements/patterns + existing `.fp-*` / `.ai-*` / ds.css
  classes. No native form controls, no raw `className="pill"` spans, no per-page `<style>`, no invented
  components. A real gap → flag to `design-system-engineer`, don't hand-roll.
- **Motion earns its place** (`animation-discipline.md`): animate spatial/temporal/state moves only —
  page entrance (`.page-enter`), staggered list reveal (`--dur-stagger`), container/sheet morphs
  (`sheet-in`), progress/streaming feedback, health/on-call pulse. NEVER motion to decorate, signal
  "premium", or fill silence. Always honor `prefers-reduced-motion`. Use motion tokens (`--dur-*`,
  `--ease`, `--ease-spring`) — no magic numbers.
- **Impact comes from**: ruthless hierarchy, the single ember accent (≤2×/screen), disciplined entrance
  motion, and ONE distinctive move per screen (name it) — not from piling on effects.

## Card / container discipline (the owner flagged card overuse)
- **Do not wrap everything in a card.** Hierarchy comes from typography, spacing and dividers, not from
  nesting containers. A form's sections are headings + fields + a divider, NOT one `.fp-card` per section.
  Reserve a card/panel for a genuinely distinct surface (a sticky summary aside, a discrete entity tile).
  No card-in-card, no card around a single field, no card around a flat strip.

## DS-strict fields (the owner flagged free-style fields)
- **Use the component's own field props.** `Input` / `Select` render their label/help/error and the
  correct `.in-field` / `.sel-field` structure via `label`, `help`, `error`. NEVER pair a raw
  `<label className="in-label">` (it is `inline-flex`, so it sits beside the control) next to a bare
  `Select`/control. For controls without a label prop (ToggleGroup, a people list), wrap in
  `<div className="in-field"><label className="in-label">…</label>{control}</div>` so the label stacks
  above. Free-styling fields breaks structure, anchoring and a11y.

## Anti-patterns (auto-fail in the audit)
- Card around everything / card-in-card / a card around one field or a flat strip.
- Raw `<label className="in-label">` beside a control instead of the component's `label` prop or `.in-field`.
- Pushing platform decisions onto the developer (the scaffolder mistake).
- Any component on a page with no job ("richness"/decoration).
- Wrong hierarchy (metrics on Overview, primary action buried, equal weight for unequal things).
- AI as a bolted-on chatbox instead of an in-context agentic action.
- Component-first instead of brief-first building.
- Inventing UI instead of composing the DS.
- Untrusted/lorem data; invented metrics.

## Project constraints (override generic best-practice here)
- **Ember follows the EXAMPLE screens, NOT the ≤2× rule.** The owner finds the reduced-ember version
  dull and lifeless. For Forge product surfaces, use ember as liberally as `src/ds/examples/**` does
  (ember hero tiles, ember maturity pills, ember CTAs). The contrast invariant still holds (dark ink on
  ember fills). Do NOT flag ember count as a defect on Forge pages.
- **No "Tier"** and **no "Tribe" as an org axis.** The company has no T1/T2/T3, and services are NOT tied
  to a tribe (tribes change constantly at Equifax). A service belongs to a **PRODUCT**. Use product, not
  tribe, in scaffolding and ownership. Never add a tier field/column/TierBadge.
- **Scaffolder flow = Service (name + product) -> Access (who can work on it) -> Review -> Provisioning.**
  The template is already chosen in the gallery; do NOT re-pick it as a wizard step. After Review, the
  user lands on a provisioning screen with live logs and an elapsed timer.
- **Forge AI on the templates page** is a header button that opens a Drawer chat ("build a project with
  AI"), not an inline field on the page.
- **No em-dash (—) in any UI copy.** Use "·", commas, colons, or periods.
- **This is a mockup.** Plausible, domain-correct **mock data is expected and fine** (local literals or
  `MOCKS.*`). The data anti-pattern is *implausible / lorem / self-contradictory / invented-metric-shown-
  as-real* data — NOT "uses literals". Don't flag hardcoded plausible mock data as a defect; do flag dead
  unused consts and numbers that contradict each other.
- **Verify DS APIs before citing them.** Components/classes/tokens must be confirmed in `packages/ui/src/**`
  or the stylesheets before a fix references them.

## The page brief (required before any build)
One paragraph, in the page's header comment and the commit:
**Persona** · **The question this page answers** · **Entity/data it reads** · **Primary action** ·
**The one distinctive move**. No brief → no build.

## Full AI Audit (the gate — `.claude/workflows/forge-ai-audit.js`)
Every page (new AND existing) passes the audit before "done". Lenses: product-sense (this file),
DS-compliance (mandatory), info-hierarchy, UX + motion (`ux-designer` / `animation-discipline`), plus
the runtime gates (`npm run build` + `scripts/console-check.mjs` + `scripts/shot.mjs`/`shot-click.mjs`).
Output: ranked P0/P1/P2 punch-list. P0s block ship.
