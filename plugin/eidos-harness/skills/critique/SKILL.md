---
name: critique
description: |
  Run an expert design review of a Eidos artifact (a DS page, an example screen,
  or a component) against the active DESIGN.md, the craft rulebooks, and the
  anti-ai-slop P0 list. Scores 5 dimensions — Philosophy / Visual hierarchy /
  Detail / Functionality / Innovation — with cited evidence, then returns Keep /
  Fix / Quick-wins. Use when the request is "design review", "critique this
  screen", "design audit", or "what's wrong with this page". Output is a written
  review in chat, not a new file.
allowed-tools: Read, Bash, Grep, Glob
---

# Critique Skill · 5-Dimension Eidos Review

Review a Eidos artifact and score it across 5 dimensions, citing concrete
evidence (file, component, class, line) and proposing actionable fixes. The
critique is grounded in the repo's own standards — not generic taste.

## Grounding (read before scoring)

- `../../design-systems/forge/DESIGN.md` — the brand contract: single ember
  accent, Geist Sans/Mono roles, density mood, anti-patterns.
- `../../craft/anti-ai-slop.md` — the P0 list. Every P0 violation is an
  automatic Detail/Philosophy hit; quote the offending P0 row.
- `../../craft/{typography,color,state-coverage,accessibility-baseline,rtl-and-bidi,form-validation,animation-discipline}.md`
  — the specific rulebooks to check against.
- `../../FORGE-DS-REFERENCE.md` — to verify the artifact composed existing
  components instead of reinventing them.

## When to use

- After a Eidos page/screen/component is built and someone asks "review this".
- As a self-check loop before declaring a build done.
- To compare two variants of the same screen.

Pick one artifact. If several exist, ask which (don't review all).

## The 5 dimensions

> Each dimension is independent. Don't average away interesting failures —
> a screen can be 9/10 on Innovation and 4/10 on Hierarchy; say so.

### 1. Philosophy consistency
Does it commit to the Eidos direction through every micro-decision? One ember
accent used by one rule throughout; Geist Sans/Mono roles consistent; density
matching the DESIGN.md mood. **0–4** three styles fighting. **5–6** drifts on
half the elements. **7–8** coherent, edge-case drift. **9–10** every element
argues the same thesis.

### 2. Visual hierarchy
Can a stranger tell what to read first without being told? Largest type =
most important; mono/sans roles match information role (numeric/eyebrow vs
body). **0–4** everything shouts. **9–10** eye moves with zero friction.

### 3. Detail execution
The 90/10: alignment, leading, tabular-nums on metrics, logical-property RTL
correctness, state coverage, focus rings, spacing rhythm. **Each anti-ai-slop
P0 violation lands here.** **0–4** visible tape and string. **9–10**
ships-grade.

### 4. Functionality
Does it work for its job? All states covered (loading/empty/error/populated/
invalid per `craft/state-coverage.md`)? Keyboard + focus-visible? a11y baseline
met? RTL actually flips? **0–4** looks fine but doesn't do its job. **9–10**
defensively built.

### 5. Innovation
Does it push past the median in a way that *serves* the Eidos thesis (not
grafted-on flourish)? **0–4** generic AI-slop median. **9–10** moves you'd
steal, each one earned. (Low Innovation is acceptable for production work —
don't punish appropriate restraint.)

## Scoring discipline

- **Always cite evidence** — "scored 4 because the metric row uses `var(--accent)`
  three times (logo, active nav, chart) plus a fourth on the CTA, breaking the
  ≤2× rule in DESIGN.md" beats "feels inconsistent". No citation → no score.
- **Don't average up** — the score is the worst sustained band, not the mean.
- **Don't grade-inflate** — a 7 means *strong*, not *acceptable*; an overall
  mean above 8 is suspicious.

## Workflow

1. **Acquire** — open the artifact's `.jsx` (and the classes it uses in
   `ds.css`/`tokens.css`). Read enough to score executed design, not declared
   intent: skim the styles, then 6–8 representative blocks / states.
2. **Score with evidence** — for each dimension, a score plus a 30–80 word
   evidence paragraph naming specific files/components/classes/lines.
3. **Build the action lists**:
   - **Keep** (3–5) — what works and must not regress, cited by component/class.
   - **Fix** (3–6) — must-do, ordered by visual cost saved per minute; each ≤ 1
     sentence; lead with anti-ai-slop P0 violations.
   - **Quick wins** (3–5) — 5–15 min each, high signal (e.g. "swap physical
     `padding-left` for `padding-inline-start` so the card flips in RTL").
4. **Report in chat** — header (artifact + date + 1-line verdict), the 5 scored
   dimensions with evidence, then Keep / Fix / Quick-wins.

## Hard rules

- **5 scores, every time** — partial reviews aren't allowed.
- **Evidence per score** — no "feels off"; cite a file/component/class.
- **Score against the repo's standards** — DESIGN.md + craft rulebooks +
  anti-ai-slop P0, not generic preference.
- **No new files.** The critique is your written reply; do not generate a report
  artifact.
