# Forge (IDP Portal) — rules for agents

You are building **Forge**, the navigable mockup of **Equifax Boa Vista's** Internal
Developer Platform (a credit bureau). It lives in `app/portal/**` and is the team's
**vision** of what we'll really build.

> **READ FIRST — `.claude/craft/idp-product.md`** is the product model (AI-native /
> agentic IDP). Forge is NOT a 2015 catalog. Build **brief-first** (persona · the question
> the page answers · entity/data · primary action · the one distinctive move), then compose.
> Reuse ~80% of the example screens' visual language (`src/ds/examples/**`). Every page —
> new and existing — passes the **`forge-ai-audit`** workflow (product-sense · DS-compliance ·
> UX+motion · hierarchy · runtime gates) before "done". Component-first building is a defect.

## Naming (do NOT mix up)
- **Eidos** = the Design System (components, tokens, docs). DS links go to `/`.
- **Forge** = THIS product / portal. The AI copilot is **"Forge AI"** ("Ask Forge AI").
- Never write "Ask Eidos". The assistant is always **Forge AI**.

## Hard rules (enforced by the `forge-portal-ds-realign` workflow)
1. **English only** in the rendered UI — every label, placeholder, summary. Keep Brazilian
   proper nouns (CPF, CNPJ, SCPC, Cadastro Positivo, Konduto, Acerta, Equifax Brasil); do NOT
   leave descriptive Portuguese (e.g. "Essencial/Mais/Completo" → "Essential/Plus/Complete").
2. **Eidos DS components only.** No native `<select>` (use DS `Select`/`Combobox`), no raw
   `className="pill"` spans (use DS `Pill`/`Chip`), no hand-rolled tabs/rails/badges. Compose
   from `@/ds/core` (= `@eidos/ui`).
3. **Uniform spacing.** The breadcrumb→header and header→body gaps are identical on every
   page, driven by the `--fp-*` spacing contract in `src/styles/example-shell.css`. Use
   `FPageHeader` from `@/portal/shell/portal-shell`; do not hand-roll page headers.
4. **No "Tier".** The company has no T1/T2/T3 concept — never add a tier field/column/badge.
5. **Shell:** the left **DS `Sidebar`** (`collapsible="icon"`, open by default) is owned by
   `PortalShell`; the collapse toggle lives at the START of the breadcrumb; there is NO
   "Design System" back button in the breadcrumb. Theme uses **next-themes** with a
   mounted-guard (no hydration mismatch). Sidebar header = workspace "Equifax Brasil"
   (collapsed → "EB" avatar only).

## How to build a page
- Route = `app/portal/<area>/page.tsx` (`'use client'` if interactive). Wrap nothing — the
  `app/portal/layout.tsx` already renders `PortalShell`.
- **Data** comes from `src/portal/data/**` (English, no tier). Extend there, never inline.
- Compose only Eidos DS + existing `.fp-*`/`ds.css` classes. Never write per-page `<style>`;
  extend `src/styles/*.css` if a class is truly missing.

## Eidos invariants
Contrast non-negotiable (dark ink on ember *fills*; ember-on-ember-soft is the canonical
soft-bubble tint and is fine); single ember accent ≤ ~2× per screen; Geist Sans + Geist Mono;
logical CSS (RTL-first); anti-AI-slop checklist (`.claude/craft/anti-ai-slop.md`).

## Verify alignment (the process)
Run the **`forge-portal-ds-realign`** workflow (`.claude/workflows/`) to critique the portal
against the DS and realign to 100% — it ends with a PASS/FAIL audit of the rules above.
Product source of truth: **`docs/FORGE-PORTAL-BRIEF.md`** (read before building any page).
