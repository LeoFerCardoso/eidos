/** @type {import('next').NextConfig} */
const nextConfig = {
  // DS pages are dynamically imported through the generated MIGRATED registry.
  // StrictMode's double-invocation isn't needed here and keeping it off avoids
  // re-running the import/registration effects twice in dev.
  reactStrictMode: false,
  // The component layer lives in the workspace package @forge/ui and is consumed
  // straight from its TypeScript source (no prebuilt dist) — Next must transpile it.
  transpilePackages: ['@forge/ui'],
  // `next build` no longer runs ESLint as of Next 16, and the `eslint` config
  // option was removed. TypeScript errors are now BLOCKING: the core component
  // props + all pages/examples are fully typed (tsc clean), so `next build`
  // type-checks and fails on regressions (DS-GAP-ANALYSIS R1).
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
