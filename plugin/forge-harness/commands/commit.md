---
name: commit
description: Stage changes and create a Conventional Commit. Runs a light typecheck first if available, and signs the commit body with the repo Co-Authored-By line.
argument-hint: "[message]"
allowed-tools: [Bash, Read, Grep]
---

# /commit — staged Conventional Commit

## 1. Pre-flight typecheck (light, best-effort)

If a typecheck script exists, run it and stop on failure:
- `npm run -s typecheck` or `npm run -s type-check` if defined in `package.json`, else
- `npx --no-install tsc --noEmit` if `typescript` is available.
If none exist or it can't run quickly, skip — do not block the commit on missing tooling.
Never run `npm install`.

## 2. Review what's changing

- `git status` and `git diff` (staged + unstaged). Summarize the change set.
- If nothing is staged, `git add -A` the relevant files (do NOT stage unrelated junk like
  `.next/`, `node_modules/`). Respect `.gitignore`.

## 3. Compose the message

Use Conventional Commits: `type(scope): subject` — `feat`, `fix`, `docs`, `refactor`,
`style`, `chore`, `test`. Scope examples: `ds`, `nav`, `examples`, `shell`, `harness`,
`skills`. If `$ARGUMENTS` is provided, use it as the subject (reword to conventional form
if needed); otherwise infer from the diff. Keep the subject imperative and ≤72 chars; add
a short body if the change warrants it.

## 4. Commit

If on the default branch (`main`/`master`), prefer creating a feature branch first unless
the user said to commit directly. Then commit with the body ending in the trailer:

```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Use a HEREDOC for the message so the trailer formats correctly. Do not push (that's
`/open-pr`). Report the resulting commit hash and subject.
