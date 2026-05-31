---
name: open-pr
description: Open a GitHub PR for the current work. Creates a branch if on the default branch, pushes, and opens the PR with a structured Summary / Changes / Verification body via the gh CLI.
allowed-tools: [Bash, Read]
---

# /open-pr — branch, push, open PR

## 1. Pre-flight

- `git status` — ensure work is committed (if uncommitted changes exist, suggest
  `/commit` first or commit them).
- Confirm `gh` is authenticated: `gh auth status`. If not, tell the user to run
  `gh auth login`.
- Identify the default branch: `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`.

## 2. Branch

If currently on the default branch, create a feature branch named for the work, e.g.
`feat/<short-slug>` or `fix/<short-slug>`, and switch to it. Never push directly to the
default branch.

## 3. Push

`git push -u origin <branch>`.

## 4. Open the PR

Use `gh pr create` with a structured body via HEREDOC:

```
## Summary
<1-3 sentence what & why>

## Changes
- <bullet per notable change; reference files/skills/components touched>

## Verification
- [ ] `node scripts/gen-manifest.mjs` ran (if routes changed)
- [ ] `npm run verify` (DS route render) pass — paste result
- [ ] anti-ai-slop / a11y / RTL checks pass for any new/edited DS artifact
- [ ] Forge invariants held: single ember ≤2×/screen, Geist Sans + Mono, logical CSS
```

Title in Conventional-Commit style. After creating, print the PR URL.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
