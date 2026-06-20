'use strict';

// eslint-plugin-eidos — the enforcement half of the Eidos LLM-safe design system.
// Pairs with the typed <Box> vocabulary in @eidos/ui: the primitives make off-system
// values un-typeable; these rules make off-system *markup* fail the lint/pre-commit gate.
// "If a PR is green, it is safe to merge."
const noRawLayoutElements = require('./rules/no-raw-layout-elements');
const noInlineStyle = require('./rules/no-inline-style');
const noHardcodedColor = require('./rules/no-hardcoded-color');

const plugin = {
  meta: { name: 'eslint-plugin-eidos', version: '0.1.0' },
  rules: {
    'no-raw-layout-elements': noRawLayoutElements,
    'no-inline-style': noInlineStyle,
    'no-hardcoded-color': noHardcodedColor,
  },
};

// Flat-config preset (ESLint 9+). Usage:
//   import eidos from 'eslint-plugin-eidos';
//   export default [ eidos.configs['flat/llm-safe'] ];
plugin.configs = {
  'flat/llm-safe': {
    plugins: { eidos: plugin },
    rules: {
      'eidos/no-raw-layout-elements': 'error',
      'eidos/no-inline-style': 'error',
      'eidos/no-hardcoded-color': 'error',
    },
  },
  // Legacy (.eslintrc) preset.
  'llm-safe': {
    plugins: ['eidos'],
    rules: {
      'eidos/no-raw-layout-elements': 'error',
      'eidos/no-inline-style': 'error',
      'eidos/no-hardcoded-color': 'error',
    },
  },
};

module.exports = plugin;
