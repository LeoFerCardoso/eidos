// Eidos — the family of Design Systems (build-time data, read by scripts/gen-nav.mjs,
// like nav-config.js). `core` is the base every sub-DS follows: shared tokens, shared
// primitives, one canonical brand. Sub-DSs only ADD domain components/patterns.
//
// `basePath` is the routed home for the target architecture (sub-DSs under
// /<basePath>/...). Phase 1 keeps content at flat routes and navigates by `home`
// (an existing slug); the switcher + DS-scoped nav already work on those routes.
//
// `home` = the slug a switch lands on ('' = the root Introduction).
// `icon` = a key in the core Icons set (core renders the ForgeMark instead).
(() => {
  // `migrated` flips per phase as a DS's pages move under /<basePath>/. Until then the
  // DS stays at flat routes (its `home` is a flat slug, hrefs are unprefixed) so the
  // running app never breaks mid-migration.
  window.DESIGN_SYSTEMS = [
    { id: 'core',     label: 'Eidos',          tagline: 'Design System',     basePath: '',         icon: 'flame',    home: '',               migrated: true },
    { id: 'charts',   label: 'Eidos Charts',   tagline: 'Data viz',          basePath: 'charts',   icon: 'barChart', home: 'overview',       migrated: true },
    { id: 'ai',       label: 'Eidos AI',       tagline: 'AI surfaces',       basePath: 'ai',       icon: 'sparkle',  home: 'overview',       migrated: true },
    { id: 'idp',      label: 'Eidos IDP',      tagline: 'Internal platform', basePath: 'idp',      icon: 'server',   home: 'overview',       migrated: true },
    { id: 'blocks',   label: 'Eidos Blocks',   tagline: 'Sections & elements', basePath: 'blocks', icon: 'layers',     home: 'overview', migrated: true },
    { id: 'patterns', label: 'Eidos Patterns', tagline: 'Effects & texture', basePath: 'patterns', icon: 'grid',       home: 'overview', migrated: true },
    { id: 'mobile',   label: 'Eidos Mobile',   tagline: 'Mobile UI',         basePath: 'mobile',   icon: 'smartphone', home: 'overview', migrated: true },
  ];

  // Phase 1 logical partition: which DS each top-level nav group belongs to.
  // Content stays at flat routes; only the sidebar nav is scoped by DS. The
  // routed migration (moving pages under /<basePath>/) happens in later phases.
  window.GROUP_DS = {
    'Get Started': 'core',
    'Foundations': 'core',
    'Components':  'core',
    'Resources':   'core',
    'Examples':    'core',
    'Charts':      'charts',
    'AI':          'ai',
    'Elements':    'idp',
    'Patterns':    'patterns',
  };
})();
