# Craft references

**Brand-agnostic** craft knowledge. Each file is a short, dense rulebook
about one dimension of professional UI craft (typography, color, motion, …). Skills
opt into the references they need; only the requested ones enter the system prompt above
the body of the active skill.

## The third axis, alongside `skills/` and `design-systems/`

| Axis | Scope | Example |
|---|---|---|
| `skills/` | Artifact shape | `component-page`, `idp-screen` |
| `design-systems/` | Brand visual language (`DESIGN.md`) | `forge` |
| `craft/` | **Universal** — truth independent of brand | tracking rules, accent usage ceiling, anti-AI-slop |

`DESIGN.md` says which colors and fonts the brand uses. `craft/` says the universal rules
that a competent designer applies on top — e.g.: ALL CAPS always needs ≥0.06em of
tracking, whatever the brand. The files already point to `var(--accent)` instead of
generic hex, so they map directly onto Forge's ember token.

## How a skill opts in

Add `od.craft.requires` to the skill frontmatter. Only the listed sections are
injected:

```yaml
od:
  craft:
    requires: [typography, color, anti-ai-slop]
```

Valid values = file names without `.md`. Unknown values are silently ignored
(forward-compatible): a skill can list a planned slug and starts to
benefit when `craft/<slug>.md` is added, without editing the skill.

## Enforcement in this project

> **Difference vs. Open Design:** there a daemon runs `lint-artifact.ts` and reports
> P0 violations automatically. **Here there is no daemon.** The "auto-checked" rules in
> `anti-ai-slop.md` become a **mandatory manual checklist**: the agent verifies them
> before emitting the artifact and the reviewer double-checks them. Treating a P0 rule as
> a style preference is a regression, not an opinion.

## Files

| File | Section | When to require |
|---|---|---|
| `typography.md` | `typography` | Any skill that emits text (~all) |
| `color.md` | `color` | Any skill with styled output (~all) |
| `anti-ai-slop.md` | `anti-ai-slop` | Marketing pages, landing, decks, any hero |
| `state-coverage.md` | `state-coverage` | Stateful UI: dashboards, forms, tables, lists |
| `animation-discipline.md` | `animation-discipline` | Any skill that delivers motion |
| `accessibility-baseline.md` | `accessibility-baseline` | Any interactive UI (focus, labels, keyboard) |
| `rtl-and-bidi.md` | `rtl-and-bidi` | Any localizable text/layout (RTL is first-class in Forge) |
| `form-validation.md` | `form-validation` | Skill whose primary artifact has an interactive form |

## Attribution

Craft content adapted from the MIT project
[refero_skill](https://github.com/referodesign/refero_skill) (© Refero Design) via the
Open Design distribution, with edits to point at Forge's tokens
(`var(--accent)` = ember) instead of generic Tailwind hex.
