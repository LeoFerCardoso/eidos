'use strict';

// Literal colors (#hex, rgb()/rgba(), hsl(), oklch()/oklab()) bypass the token system —
// the exact drift ("which grey?", "forgot dark mode") an LLM-safe DS exists to prevent.
// Color must come from a token (a Box `background`/`color`/`borderColor` prop, or a CSS
// `var(--token)`). The canonical token source (tokens.css) is exempt by config override.
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/;

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow hardcoded color literals; use design tokens.' },
    schema: [],
    messages: {
      hardcoded: 'Hardcoded color "{{value}}" is off-system. Use a design token (Box color/background prop or var(--token)).',
    },
  },
  create(context) {
    function checkString(node, raw) {
      if (typeof raw === 'string' && COLOR_RE.test(raw)) {
        context.report({ node, messageId: 'hardcoded', data: { value: raw.trim().slice(0, 32) } });
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === 'string') checkString(node, node.value);
      },
      TemplateElement(node) {
        checkString(node, node.value && node.value.raw);
      },
    };
  },
};
