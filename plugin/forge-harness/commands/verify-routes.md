---
name: verify-routes
description: Run the headless DS route render check (npm run verify) and report pass/fail per route, surfacing any page errors.
allowed-tools: [Bash, Read]
---

# /verify-routes — render-check all DS routes

This runs the project's headless render verification over the DS routes
(`scripts/verify-render.mjs` drives Chrome via the DevTools protocol and checks each
route's shell + content signals, reporting any page errors).

## Steps

1. Ensure the dev server is up. The verifier hits `http://localhost:3000`; if nothing is
   listening there, tell the user to start `npm run dev` first (do NOT start it yourself
   unless asked, and never run `npm install`).
2. Regenerate the manifest if routes may have changed: `node scripts/gen-manifest.mjs`.
3. Run the verification:
   ```
   npm run verify
   ```
   If `verify` is not yet wired as an npm script, fall back to invoking the script
   directly: `node scripts/verify-render.mjs <routes...>` (no args defaults to `/`). Do
   NOT add the `verify` script to `package.json` — another process owns that file.
4. Parse the output: each line is `ROUTE <path> -> {...}` with shell/content signals, and
   `PAGE ERRORS:` / `VERIFY_FAILED:` lines flag problems.

## Report

Summarize pass/fail per route. Call out any route with page errors, a missing shell, or
empty content, and point at the likely cause (e.g. the black-screen gotcha: a missing
`Icons.x` reference or a JSX syntax error; or a route missing from
`manifest.generated.ts` because `gen-manifest` wasn't re-run).
