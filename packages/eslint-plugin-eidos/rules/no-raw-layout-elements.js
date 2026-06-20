'use strict';

// Raw HTML containers an LLM reaches for by default (its training data is full of them).
// Removing this path is the single instruction that survives a fresh context window:
// layout must go through the typed <Box>/<Stack>/<Inline>/<Grid> primitives, and
// semantics are expressed via the polymorphic `as` prop (`<Box as="nav">`).
const DEFAULT_BANNED = [
  'div', 'span', 'section', 'nav', 'header', 'footer', 'aside', 'main', 'article',
  'ul', 'ol', 'li',
];

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow raw layout HTML elements; use Box/Stack/Inline/Grid with `as` for semantics.' },
    schema: [{
      type: 'object',
      properties: {
        elements: { type: 'array', items: { type: 'string' } },
        allow: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    }],
    messages: {
      banned: "Raw <{{name}}> is off-system. Use <Box as=\"{{name}}\"> (or Stack/Inline/Grid) so styling stays in typed tokens.",
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const banned = new Set(opts.elements || DEFAULT_BANNED);
    const allow = new Set(opts.allow || []);
    return {
      JSXOpeningElement(node) {
        const id = node.name;
        if (!id || id.type !== 'JSXIdentifier') return; // skip member/namespaced (Foo.Bar)
        const name = id.name;
        if (allow.has(name)) return;
        if (banned.has(name)) {
          context.report({ node: id, messageId: 'banned', data: { name } });
        }
      },
    };
  },
};
