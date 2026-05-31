---
name: release
description: Cut a Forge DS version bump. Updates BOTH version strings in src/ds/core/shell.jsx (sidebar sub-text and topbar badge — they must stay in sync), adds a changelog entry, sweeps stale nav badges, and commits.
argument-hint: "[major|minor|patch]"
allowed-tools: [Bash, Read, Edit, Grep]
---

# /release — version bump (two-place, in sync)

The DS version is shown in **two** places in `src/ds/core/shell.jsx` and they MUST match.
Currently `v1.7.13`.

## 1. Determine the new version

Read the current version from `src/ds/core/shell.jsx`. Apply the bump from `$ARGUMENTS`
(`major`/`minor`/`patch`, default `patch`) to get `vX.Y.Z`.

## 2. Update BOTH strings in shell.jsx (must stay in sync)

1. Sidebar sub-text:
   `<span className="sub">Design System vX.Y.Z</span>`
2. Topbar badge pill:
   `<span className="pill ember"><span className="dot"/>vX.Y.Z · Stable</span>`

Grep `shell.jsx` for the old version after editing to confirm zero stale occurrences.

## 3. Sweep stale nav badges

In `src/ds/core/nav-config.js`, per the badge policy, drop `new`/`updated` badges on items
that did NOT actually move this cycle. "Everything is new" == "nothing is new". Leave
badges only on genuinely changed entries.

## 4. Changelog

Add a dated entry for `vX.Y.Z` summarizing notable changes. If a `CHANGELOG.md` exists,
prepend the new section (keep reverse-chronological order); if not, create one with a
`# Changelog` header and the first entry. Keep it under `${CLAUDE_PLUGIN_ROOT}/`-untouched paths — only
write the changelog and the two source files this flow owns.

## 5. Commit

Stage `src/ds/core/shell.jsx`, `src/ds/core/nav-config.js` (if swept), and the changelog.
Commit as `chore(release): vX.Y.Z`, body ending with:

```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Do not push. Report the new version and the commit hash. Note: do not edit
`package.json` — its version is owned by another process.
