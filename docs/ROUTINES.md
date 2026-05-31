# Forge harness — scheduled routines & loops

Routines run on Anthropic's cloud (survive session close); set them up at
<https://claude.ai/code/routines> or with `/schedule`. `/loop` runs in-session on your
machine. Claude Code can't create cloud routines for you — paste these prompts when
setting them up. Each prompt is self-contained (routines start with no conversation
context).

## Recommended routines

### 1. Nightly DS drift check (schedule: daily, off-hours)
> Clone the forge-ds repo. Read `.claude/skills/component-page/references/checklist.md`
> and `.claude/craft/anti-ai-slop.md`. For each component page under `src/ds/pages/components/`,
> verify it includes a live Frame, Anatomy, Decision matrix, Do/Don't with live UI, and an
> RTL example, and has no per-page `<style>`. Open one GitHub issue listing every page
> missing a section, ranked by how user-facing the component is. Don't fix anything.

### 2. Weekly AI-SDK / dependency deprecation scan (schedule: weekly)
> Clone forge-ds. Check `package.json` against the latest `ai`, `@ai-sdk/react`, `next`,
> and `recharts`. Invoke the `vercel:ai-sdk` skill and scan `src/lib/ai/**` + `app/ai-chat/**`
> for deprecated AI SDK v6 APIs (`maxSteps`, `parameters`, `generateObject`,
> `tool-invocation`, `toDataStreamResponse` with useChat). Open a PR with safe upgrades and
> an issue for anything needing manual migration.

### 3. PR design review (trigger: GitHub PR opened)
> A PR was opened on forge-ds. Use the `code-reviewer` subagent and the `forge-reviewer`
> output style. Review the diff against the Forge invariants, the DS discipline rules, the
> anti-AI-slop P0 list, and AI SDK v6 correctness. Post a single PR review comment with
> findings ranked P0/P1/P2 and the smallest concrete fix for each. Approve only if no P0.

### 4. Route-health smoke (schedule: daily, or trigger: PR)
> Clone forge-ds, `npm ci`, `npm run build`. If the build fails, open an issue with the
> error. (The build compiles all ~151 DS routes via next/babel, so it catches registry/nav
> drift and parse errors.)

## In-session loops (`/loop`)

- After a change to `src/ds/core/*` (shell/primitives/etc.), sweep for regressions:
  `/loop run npm run build and report any route that fails to compile`
- While iterating on a component, keep verifying it renders:
  `/loop 2m npm run verify -- /<slug>`

## Notes

- Routines clone the repo fresh and have no local filesystem state — prompts must be
  self-contained and rely on `npm ci`.
- The headless `npm run verify` needs a browser; in cloud routines prefer `npm run build`
  as the gate (browserless), or wire `CHROME_PATH` if the routine environment has Chrome.
