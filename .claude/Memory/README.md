# .claude/Memory

Project-local memory for LLM sessions (Claude Code) working on **forge-ds**. Committed with
the repo so any teammate's agent gets the same context. Read this folder at the start of a
session to understand what the project is, what's been done, the conventions, and what's next.

- **[`PROJECT-LOG.md`](./PROJECT-LOG.md)** — the compiled history + current state + next steps.
  This is the single source of truth for "what happened and why." Keep it updated when a
  significant chunk of work lands.

Conventions for this folder:
- One concern per file if it grows; for now `PROJECT-LOG.md` holds the consolidated log.
- Record decisions + the *why* + lessons (not just what), and absolute dates.
- This complements (does not replace) the repo docs: `docs/HARNESS-GAP-ANALYSIS.md`,
  `docs/REACT-NEXTJS-GAP-ANALYSIS.md`, `docs/ROUTINES.md`, `CLAUDE.md`, `.claude/README.md`.
