import tsparser from '@typescript-eslint/parser';
import eidos from 'eslint-plugin-eidos';

// LLM-safe ratchet.
//
// The three eidos rules are turned to ERROR only on paths already migrated to the typed
// <Box>/<Stack>/<Inline>/<Grid> vocabulary (the MIGRATED list). Everywhere else under the
// portal they stay off, so the gate is green while migration proceeds. The rule: the
// moment a file/dir is converted, add it here — and never remove it. Coverage only grows,
// so off-system markup can never silently come back to a migrated path.
//
// Lint config is a CRITICAL file in Forge (escalates, never auto-merge) and `eslint-disable`
// is hard-blocked, so these errors cannot be locally suppressed.
const MIGRATED = [
  'src/portal/_system-demo/**/*.{ts,tsx}',
];

const ENFORCED = {
  'eidos/no-raw-layout-elements': 'error',
  'eidos/no-inline-style': 'error',
  'eidos/no-hardcoded-color': 'error',
};

// The portal carries pre-existing `eslint-disable react-hooks/exhaustive-deps` directives
// from before this repo had ESLint. We don't run react-hooks here, so register a no-op
// shim for that rule name and stop reporting unused directives — otherwise those dangling
// comments would error as "rule not found" and mask the real LLM-safe findings.
const reactHooksShim = { rules: { 'exhaustive-deps': { create: () => ({}) } } };

const tsx = {
  languageOptions: { parser: tsparser, parserOptions: { ecmaFeatures: { jsx: true } } },
  plugins: { eidos, 'react-hooks': reactHooksShim },
  linterOptions: { reportUnusedDisableDirectives: 'off' },
};

export default [
  // Portal scope — plugin loaded, rules off (observation only) until a path is migrated.
  { files: ['app/portal/**/*.{ts,tsx}', 'src/portal/**/*.{ts,tsx}'], ...tsx },
  // Migrated paths — fully enforced.
  { files: MIGRATED, ...tsx, rules: ENFORCED },
];
