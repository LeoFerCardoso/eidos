// Stub for `next/navigation` so the docs-shell primitives (Section / ComponentInstall)
// render in a standalone, framework-agnostic Storybook. There is no Next router here,
// so the current path is always the root and the router is a no-op.
export const usePathname = () => '/';
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
});
export const useSearchParams = () => new URLSearchParams();
export const useParams = () => ({});
export const redirect = () => {};
export const notFound = () => {};
