# Design Systems

Each subfolder is a portable brand in a 9-section `DESIGN.md` format. The active brand
is injected into the system prompt of every skill that declares `design_system.requires: true`.

## Layout

- **`eidos/`** — **the single canonical brand.** Eidos Design System: IDP Equifax/Boa
  Vista, ember accent `#FF6B35`, Geist Sans/Mono, cool neutrals, platform density. Every
  skill and agent reads `eidos/DESIGN.md`. It is the source of truth for the *visual
  language* — the complete technical catalog (tokens, classes, components) lives in
  `../../CLAUDE.md` and `../../llms.txt`.

The 139 inspiration brands imported from Open Design were removed — this project builds one
design system (Eidos), so other brands' aesthetics are off-mission. If you ever need to
prototype against a different aesthetic, author a new `<brand>/DESIGN.md` here for that
task.

## File format

The first H1 is the title shown in the selector. The line right after the H1 is read as
metadata:

```markdown
# Eidos Design System

> Category: Developer Platform
> One-line summary.

## 1. Visual Theme & Atmosphere
...
```

The 9 sections: 1) Visual Theme & Atmosphere · 2) Color Palette & Roles · 3) Typography ·
4) Spacing & Layout · 5) Radius & Elevation · 6) Iconography · 7) Motion ·
8) Components & Building Blocks · 9) Voice & Anti-slop.

## Adding another brand

Create a folder with a `DESIGN.md` in the 9 sections. Useful for alternative themes (e.g.:
a sub-brand, a white-label client) without touching the skills — the skill reads "the
active brand", whatever it is.
