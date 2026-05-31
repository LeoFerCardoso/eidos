'use client';
import * as React from 'react';
// Docs-shell primitives — the three page wrappers that depend on docs-app concerns
// (the nav registry + the current route + the generated props map) and therefore
// cannot live in the framework-agnostic @forge/ui package:
//
//   Section          — reads the current route (usePathname) + NAV_FLAT/DESIGN_SYSTEMS
//                      to render the page eyebrow (group · subgroup · num).
//   ComponentInstall — reads NAV_FLAT for the component label + the per-slug npm-dep
//                      overrides; composes the pure SubHead/TabbedCode/installTabs.
//   AutoPropsTable   — reads GENERATED_PROPS (built by scripts/gen-props.mjs).
//
// Everything they compose (SubHead, TabbedCode, installTabs, PropsTable) is a pure
// primitive imported from @forge/ui.
import { SubHead, TabbedCode, installTabs, PropsTable } from '@forge/ui';
import { usePathname } from 'next/navigation';
import { NAV_FLAT, DESIGN_SYSTEMS } from '@/lib/nav';
import { GENERATED_PROPS } from './props.generated';

// ---- Section — top-level page wrapper ------------------------------------
// The eyebrow shows GROUP — and, if the page lives inside a nested Components
// sub-section, ALSO the sub-section so the reader knows exactly where they are.
//
// autoInstall — when true, prepends a ComponentInstall block under the header.
const Section = ({ id, num, title, desc, autoInstall = false, installPeers, children }: {
  id?: string;
  num?: string;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  autoInstall?: boolean;
  installPeers?: string;
  children?: React.ReactNode;
}) => {
  // Resolve the nav item by the CURRENT ROUTE first (slugs repeat across DSs — e.g.
  // every DS has an `overview`), then fall back to slug/id.
  const pathname = usePathname();
  const item = NAV_FLAT.find((i) => i.href === pathname) || NAV_FLAT.find((i) => i.slug === id) || null;
  const ds = (item && DESIGN_SYSTEMS.find((d) => d.id === item.ds)) || null;
  const group = (item && item.group) || (ds && ds.id !== 'core' ? ds.label : 'Forge');
  const subgroup = item && item.subgroup;
  const installable = autoInstall && item && (group === 'Components' || group === 'AI');
  return (
    <section id={id} className="ds-section">
      <header className="ds-page-header">
        <div className="ds-ph-eyebrow">
          <span className="ds-ph-marker" aria-hidden="true"/>
          <span className="ds-ph-group">{group}</span>
          {subgroup && <>
            <span className="ds-ph-divider" aria-hidden="true"/>
            <span className="ds-ph-sub">{subgroup}</span>
          </>}
          {num && <>
            <span className="ds-ph-divider" aria-hidden="true"/>
            <span className="ds-ph-num">{num}</span>
          </>}
        </div>
        <h1 className="ds-ph-title">
          {title}
          <a className="anchor" href={'#'+id}>#</a>
        </h1>
        {desc && <p className="ds-ph-lede">{desc}</p>}
      </header>
      {installable && <ComponentInstall slug={id} peers={installPeers}/>}
      {children}
    </section>
  );
};

// ---- ComponentInstall — opinionated drop-in Installation block ------------
// `peers` overrides the per-slug npm dependency list shown in the Manual tab.
// Forge components are SEMANTIC-CLASS React (no Radix, no CVA) — the baseline is
// the cn() helper (clsx + tailwind-merge, the installTabs default). Only list a
// real extra library when the component genuinely needs one.
const PEER_OVERRIDES: Record<string, string> = {
  'chart':            'recharts',
  'charts':           'recharts',
  'ai-response':      'ai react-markdown remark-gfm',
  'ai-markdown':      'react-markdown remark-gfm',
  'ai-math':          'katex',
  'ai-mermaid':       'mermaid',
  'ai-prompt-input':  'ai',
  'ai-tool':          'ai',
  'ai-reasoning':     'ai',
  'ai-conversation':  'ai',
};
// Some slugs are noun-prefixed in the nav (`ai-message`) but the CLI command
// should use the bare component name (`message`). Strip the prefix.
const slugToCli = (slug: string) => slug.replace(/^ai-/, '');

const ComponentInstall = ({ slug, peers, label }: {
  slug?: string;
  peers?: string;
  label?: string;
}) => {
  const item = NAV_FLAT.find((i) => i.slug === slug) || null;
  const cliName = slugToCli(slug || '');
  const componentLabel = label || (item && item.label) || slug;
  const peerList = peers || (slug ? PEER_OVERRIDES[slug] : undefined);
  return (
    <>
      <SubHead meta="cli">Installation</SubHead>
      <TabbedCode tabs={installTabs(cliName, peerList)} ariaLabel="package manager"/>
      <p className="ds-caption">
        Drop <code style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-sm)', color:'var(--ember)'}}>{componentLabel}</code> into any Forge product. The CLI copies the component file into your repo — Forge is owned, not imported. The Manual tab shows the dependencies and source files for hand-installation.
      </p>
    </>
  );
};

// ---- AutoPropsTable — API table generated from the component's typed props ----
// Reads props.generated.ts (built by scripts/gen-props.mjs from the real TS prop
// types) so the API reference can't drift from the component.
const AutoPropsTable = ({ component, label }: { component: string; label?: string }) => {
  const rows = GENERATED_PROPS[component] || [];
  return <PropsTable rows={rows} label={label ?? component + 'Props'} />;
};

export { Section, ComponentInstall, AutoPropsTable };
