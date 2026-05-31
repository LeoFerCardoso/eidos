import { defineConfig } from 'tsup';

// Builds the publishable artifact (ESM + d.ts). In-repo consumers (apps/docs,
// apps/storybook) read ./src directly via the package "exports" + transpilePackages
// / Vite, so this build is only needed for `npm publish` and the registry/CLI.
export default defineConfig({
  entry: ['src/index.ts', 'src/lib/utils.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  // IMPORTANT: do NOT tree-shake the library entry. index.ts is a pure `export *`
  // barrel; with tree-shaking on, esbuild DCE's every re-export (the package is
  // marked sideEffects:["*.css"], so the .tsx modules look side-effect-free and
  // nothing "uses" the bindings at build time) → an empty `export {}`. Shipping
  // all exports is correct; the CONSUMER's bundler tree-shakes via our exports map.
  treeshake: false,
  splitting: true,
  // Peers + optional peers stay external; never bundle React or recharts.
  external: ['react', 'react-dom', 'recharts', 'lucide-react'],
  // Stories are co-located but never shipped.
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
