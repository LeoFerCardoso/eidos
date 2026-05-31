---
name: wireframe-sketch
description: |
  Low-fidelity wireframing for a Eidos screen BEFORE building it with the design
  system — a fast lo-fi sketch that fixes layout, regions, hierarchy, and states
  on paper so the real build (idp-screen / dashboard / component-page) is
  decided, not improvised. Use when the request is "wireframe", "lo-fi mockup",
  "sketch the layout", "rough this out first", or "block out the screen". This
  is a planning artifact; it is not the final DS build.
allowed-tools: Read, Write, Bash, Grep, Glob
---

# Wireframe Sketch Skill

Produce a low-fidelity wireframe that decides a Eidos screen's structure before
any DS code is written. The point is to be deliberately rough: boxes, labels,
hierarchy, and state notes — not pixels. Looseness is the feature; if it looks
finished, you over-rendered and should stop.

A wireframe is a hand-off to a build skill. When approved, the real screen is
built per `idp-screen` (full screens), `dashboard`, or `component-page`,
composing existing Eidos classes — never per-page `<style>`.

## Required pre-reading

1. `../../EIDOS-DS-REFERENCE.md` + `../../llms.txt` — so each block you sketch
   maps to a real Eidos component/element/example. Sketch what the DS can
   actually build; check the **Examples** group for an existing layout first.
2. `../../design-systems/forge/DESIGN.md` — honor type roles and the single
   ember accent *loosely* even at lo-fi (one accent stamp, mono for labels).

## Workflow

1. **Name the screen as a composition** in one sentence, mapping each region to
   a Eidos block, e.g. *"Service catalog = page header + filter rail +
   service-card grid + pagination"*. This is the whole value of the wireframe.
2. **Sketch the variants** — 2–4 labeled layout options ("A · organized",
   "B · dashboard-led", "C · table-led"); mark one active.
3. **Block out each region** as a labeled rectangle: page header, nav/rail,
   primary content (grid / chart placeholder / table), secondary content,
   footer. Use scribbled placeholders for charts and chunky boxes for metrics —
   not real data.
4. **Annotate hierarchy and states** with sticky-note callouts: what's primary,
   where the ember accent goes (once), and which states the real build must
   cover — loading / empty / error / populated (see
   `../../craft/state-coverage.md`). Note the RTL/inline-axis intent so the
   build uses logical properties.
5. **Hand off** — end with the one-sentence composition map and which build
   skill takes it from here.

## Output

A single lo-fi sketch file is fine here (this is a throwaway planning artifact,
not a DS page) — or describe the wireframe inline in the reply if a file isn't
warranted. Either way it does **not** register in `window.PAGES` /
`window.EXAMPLES` and does **not** ship; it informs the real build.

## Self-check

- It reads as a *sketch* — rough boxes and labels, not finished UI.
- Every block maps to a real Eidos component/element (no inventing).
- One accent stamp, mono for labels; states and hierarchy are annotated.
- The composition map and the hand-off build skill are stated explicitly.
