import type { Preview, Decorator } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// The Forge base layer, in the same order the app loads it. Components are styled
// by these semantic stylesheets — without them every story renders unstyled.
// ai.css carries the 176 `.ai-*` selectors that style the AI sub-DS, so it must
// load too (the docs app imports all three; Storybook mirrors that order).
import '@eidos/ui/styles/tokens.css';
import '@eidos/ui/styles/ds.css';
import '@eidos/ui/styles/ai.css';
import './preview.css';

// RTL is a first-class Forge invariant — toggle `dir` on <html> from the toolbar
// rather than duplicating every story.
const withDirection: Decorator = (Story, ctx) => {
  const dir = (ctx.globals.direction as string) ?? 'ltr';
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('dir', dir);
  }
  return Story();
};

const preview: Preview = {
  parameters: {
    // Background is owned by the Forge tokens (--bg) + the data-theme attribute.
    backgrounds: { disable: true },
    layout: 'centered',
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        // group order is fixed; stories sort ALPHABETICALLY within each group.
        method: 'alphabetical',
        order: ['Introduction', 'Primitives', 'Forms', 'Elements', 'Blocks', 'Charts', 'Overlays', 'Device', 'AI', 'Icons', 'Docs'],
      },
    },
  },
  globalTypes: {
    direction: {
      description: 'Writing direction',
      defaultValue: 'ltr',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withDirection,
    withThemeByDataAttribute({
      attributeName: 'data-theme',
      themes: { dark: 'dark', light: 'light' },
      defaultTheme: 'dark',
    }),
  ],
  tags: ['autodocs'],
};

export default preview;
