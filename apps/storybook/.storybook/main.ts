import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  // Stories are co-located inside the @eidos/ui package source.
  stories: ['../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  // Serve the docs app's public/ so photo avatars (/avatars/person-*.jpg) resolve in stories.
  staticDirs: ['../../../public'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // argTypes are inferred from the components' TypeScript prop types.
  typescript: {
    reactDocgen: 'react-docgen',
  },
  core: { disableTelemetry: true },
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve ?? {};
    // Vite 8 resolves tsconfig `paths` natively — no plugin needed.
    cfg.resolve.tsconfigPaths = true;
    cfg.resolve.alias = {
      ...(cfg.resolve.alias ?? {}),
      // Library primitives reach for next/navigation's usePathname; stub it.
      'next/navigation': fileURLToPath(new URL('./stubs/next-navigation.ts', import.meta.url)),
    };
    return cfg;
  },
};

export default config;
