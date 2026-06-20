'use strict';

// Inline `style={{…}}` is the second open surface: arbitrary CSS values with no token
// discipline and no static checking. Banning it forces spacing/color/layout through the
// typed Box props (which only accept design tokens).
module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow the inline `style` prop; use typed Box token props instead.' },
    schema: [],
    messages: {
      inlineStyle: 'Inline `style` is off-system. Express layout/spacing/color through typed <Box> token props.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name && node.name.type === 'JSXIdentifier' && node.name.name === 'style') {
          context.report({ node, messageId: 'inlineStyle' });
        }
      },
    };
  },
};
