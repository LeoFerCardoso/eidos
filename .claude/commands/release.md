---
name: release
description: Cut a Forge DS version bump. Updates DS_VERSION in src/lib/site.ts (single source of truth for the topbar VersionBadge), adds a changelog entry, sweeps stale nav badges, and commits.
argument-hint: "[major|minor|patch]"
allowed-tools: [Bash, Read, Edit, Grep]
---

# /release — per-DS version bump

Versioning is **per Design System**. Each DS's version lives in the `DS_VERSIONS` map in
`src/lib/site.ts` and must match the latest entry in that DS's own Changelog. The topbar
`VersionBadge` is DS-aware (`src/components/layout/version-badge.tsx`).

`$ARGUMENTS` = `<ds> [major|minor|patch]` (e.g. `core minor`, `ai patch`). `<ds>` is one of
`core · charts · ai · idp · patterns · mobile · blocks` (default `core`; default bump `patch`).
If `<ds>` is omitted, infer it from the changed files' DS.

## 1. Determine the new version

Read `DS_VERSIONS['<ds>']` from `src/lib/site.ts`. Apply the bump to get the new `X.Y.Z`. It MUST
be contiguous within that DS (no gaps vs the DS's latest changelog entry — versions are independent
across DSs, so the same number may exist in another DS).

## 2. Update DS_VERSIONS

Edit `src/lib/site.ts`: set `'<ds>': 'X.Y.Z'` in the `DS_VERSIONS` map. (Do not touch
`package.json` — its version is owned by another process. `DS_VERSION` stays = `DS_VERSIONS.core`.)

## 3. Sweep stale nav badges

In `src/ds/core/nav-config.js`, per the badge policy, drop `new`/`updated` badges on items
that did NOT actually move this cycle. "Everything is new" == "nothing is new". Leave badges
only on genuinely changed entries (scaffold placeholders keep `soon`).

## 4. Changelog

Add a dated entry for `X.Y.Z`. For a sub-DS change, prepend the entry to that DS's changelog
(`src/ds/migrated/<ds>/changelog.tsx`, the `ChangelogEntry[]`); for a core/global change use
the core changelog. Keep reverse-chronological order.

## 5. Commit

Stage `src/lib/site.ts`, `src/ds/core/nav-config.js` (if swept), and the changelog file(s).
Commit as `chore(release): vX.Y.Z`, body ending with:

```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Do not push. Report the new version and the commit hash.
