// Site-level constants.
//
// Versioning is PER DESIGN SYSTEM: each DS in the family has its own version,
// matching the latest entry in its own Changelog. The topbar VersionBadge is
// DS-aware (src/components/layout/version-badge.tsx) — it shows the version of
// the DS you're currently viewing. The /release command bumps the right DS here
// and adds the matching changelog entry.
export const DS_VERSIONS: Record<string, string> = {
  core: '1.15.0',
  charts: '1.11.0',
  ai: '1.29.0',
  idp: '1.12.0',
  patterns: '1.11.0',
  mobile: '1.14.0',
  blocks: '1.11.0',
};

/** Back-compat fallback (core's version) for non-DS contexts. */
export const DS_VERSION = DS_VERSIONS.core;
export const DS_CHANNEL = 'Stable';
export const SITE_NAME = 'Forge';
export const SITE_TAGLINE = 'Design System';
