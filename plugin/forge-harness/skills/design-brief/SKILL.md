---
name: design-brief
description: |
  Turn a vague UI request ("make it feel premium", "build the incident screen")
  into a concrete Forge design brief expressed in Forge terms — tokens,
  components, states, and constraints — grounded in the active DESIGN.md. Use
  when the request is "design brief", "spec this out", "what should this screen
  be", or before starting a build that has fuzzy requirements. Eliminates
  ambiguity so the downstream build skill (idp-screen / dashboard /
  component-page) has explicit decisions to execute.
allowed-tools: Read, Write, Bash, Grep, Glob
argument-hint: "[what you're designing + any constraints]"
---

# Design Brief Skill

Resolve a request into an explicit brief the build skills can execute without
guessing. Forge already has a fixed design language — your job is **not** to
invent a palette or typography, but to decide how this specific UI uses the
existing Forge tokens, components, and states.

## Grounding (read first — do not invent tokens)

- `../../design-systems/forge/DESIGN.md` — the brand contract. The palette,
  the single ember accent (`#FF6B35` / `var(--accent)`, ≤ 2× per screen), Geist
  Sans/Mono roles, and density mood are already decided here. Reference these;
  never propose new ones.
- `../../FORGE-DS-REFERENCE.md` + `../../llms.txt` — the component/element/
  example catalog the brief must compose from.
- `../../craft/{state-coverage,accessibility-baseline,rtl-and-bidi,anti-ai-slop}.md`
  — the non-negotiables the brief must call out.

## What the brief resolves

Capture the design decisions a builder makes *before* placing anything. For
each, cite the Forge token/component rather than an abstract value.

1. **Intent & screen type** — what this is and which build skill owns it
   (full screen → `idp-screen`; metrics view → `dashboard`; single component
   doc → `component-page`; prose → `docs-page`; new page scaffold → `new-page`;
   new primitive → `new-component`).
2. **Layout model** — regions and the inline-axis structure (nav / rail /
   content grid / table / footer), expressed so it flips under `dir="rtl"`.
3. **Component map** — name each region as an existing Forge component/element
   from the catalog (e.g. metric card, `.tbl` table, `window.ForgeChart`, status
   dot, `.badge`). If a region has no existing component, flag it as new work
   for `new-component` — don't hand-wave it.
4. **Type roles** — which content is Geist Sans (UI/body) vs Geist Mono
   (numerics / captions / eyebrows); where tabular-nums applies.
5. **Accent plan** — the ≤ 2 places ember appears, and why those two.
6. **Density** — one tight region + one breathing region (intentional tension),
   matched to the DESIGN.md mood — not flat symmetry.
7. **States** — the required loading / empty / error / populated / invalid
   coverage for this screen (per `craft/state-coverage.md`).
8. **Constraints** — explicit dos/don'ts: no per-page `<style>`, logical CSS
   properties, a11y baseline, motion discipline, and any anti-ai-slop P0 risks
   specific to this screen.

## Workflow

1. **Accept input** — a natural-language request and any constraints. Identify
   every dimension above the request states explicitly.
2. **Resolve gaps with Forge defaults** — for anything unspecified, choose the
   conservative Forge default and *say so* (e.g. "density: balanced, default —
   no preference given"; "accent: active nav + primary CTA only"). Never invent
   values outside DESIGN.md; if the request implies a color/typeface outside the
   Forge language, push back rather than comply.
3. **Map to the catalog** — for each region, name the existing component. List
   any genuine gaps as new-component work.
4. **Write the brief** — a concise spec covering the 8 items above, plus a
   one-line "Build skill: <name>" hand-off and a short "Resolved from defaults"
   list noting which decisions were defaults vs. requested.

## Output

Deliver the brief in the reply (preferred). Write it to a file only if the user
asks to persist it — and as Markdown, not as a DESIGN.md (the active
`design-systems/forge/DESIGN.md` is the single source of truth; this skill
references it, it does not regenerate it).

## Hard rules

- **Don't invent the design language** — Forge palette, ember accent, and Geist
  Sans/Mono roles come from DESIGN.md. The brief allocates them; it doesn't
  redefine them.
- **Every region maps to a real component** or is flagged as new-component work.
- **Name the constraints explicitly** — no per-page `<style>`, ember ≤ 2×,
  logical CSS + RTL, full state coverage, a11y baseline — so the builder can't
  silently skip them.
- **End with the build-skill hand-off** so the brief leads directly into
  execution.
