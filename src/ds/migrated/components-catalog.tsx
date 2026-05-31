'use client';
// Forge DS — Get Started / Components catalog.
//
// The full list of every component, foundation, pattern, and resource that
// ships with Forge. Auto-generated from the typed NAV (single source of truth
// in nav-config.js → src/lib/nav.ts), so adding a new page in nav-config lights
// up here automatically. The only per-page authoring is the one-line DESC
// dictionary below, which gives each tile a real blurb instead of just a slug.
import { Icons, Section, SubHead, Empty, Kbd } from '@/ds/core';
import { NAV, NAV_FLAT } from '@/lib/nav';

// One-line descriptions per page. Authoring lives here so nav-config stays
// a thin link map. Anything missing falls back to the page's slug.
const DESC: Record<string, string> = {
  // ── Components / Form & Input ────────────────────────────────────────
  'buttons':       'Six variants, four sizes. One primary action per surface.',
  'button-group':  'Visually joined buttons — segmented toolbar feel.',
  'toolbar':       'Horizontal cluster of actions, separators, and toggles.',
  'input':         'Composable text-entry — affixes, autocomplete, copy, password.',
  'input-group':   'Inputs + buttons + selects in one shared bordered shell.',
  'otp-input':     'One-time codes — auto-advance, paste-friendly, autofill.',
  'number-input':  'Numeric entry — currency, percent, units, stepper.',
  'color-input':   'H/S/V picker with hex, RGB, alpha, and curated swatches.',
  'file-input':    'Drag-and-drop upload with previews, progress, and validation.',
  'textarea':      'Multi-line text input with autosize and character counter.',
  'checkbox':      'Multi-select boolean with indeterminate state.',
  'radio':         'Single-select group — vertical, horizontal, and cards.',
  'select':        'Custom-rendered single-value picker with icons + groups.',
  'switch':        'On/off control with spring motion and an invalid state.',
  'slider':        'Pick a value or range along a continuous track.',
  'calendar':      'Single-date and date-range pickers.',
  'date-picker':   'Trigger + calendar popover — single date or range with presets.',
  'combobox':      'Trigger + popover with search and a filtered list — single or multi.',
  'label':         'Form labels with required / optional markers and helper hookup.',
  'ai-label':      'Mark a value as AI-generated, with provenance on demand.',
  'tag-input':     'Free-entry list with chips, autocomplete, and validation.',
  'pills':         'Filter tokens, status tags, removable selections.',
  'forms':         'Compositions — labels, inputs, helpers, errors, in real layouts.',
  // ── Components / Layout & Navigation ─────────────────────────────────
  'accordion':     'Expandable disclosure for FAQs and grouped settings.',
  'breadcrumb':    'Navigational trail to the current page.',
  'navigation':    'Sidenav, topbar, and breadcrumb composition.',
  'sidebar':       'Collapsible vertical nav rail for app shells.',
  'tabs':          'Underline and pill variants for switching panels.',
  'separator':     'Hairline divider between content blocks — horizontal or vertical.',
  'scroll-area':   'Styled, auto-hide scrollbars matched to the surface.',
  'resizable':     'Drag-to-resize panel split — vertical or horizontal.',
  // ── Components / Overlays & Dialogs ──────────────────────────────────
  'modal':         'Centered surface for self-contained flows — share, edit, attach.',
  'alert-dialog':  'Modal for confirmations and irreversible actions.',
  'drawer':        'Edge-anchored panel for forms, filters, and navigation.',
  'popover':       'Click-anchored layer for forms, previews, mini-settings.',
  'tooltips':      'Contextual hints anchored to a trigger.',
  'hover-card':    'Rich preview surfaced on hover — profiles, links, definitions.',
  'menu':          'Dropdown menu — button-anchored list with groups, icons, hotkeys. Includes right-click context variant.',
  'menubar':       'Top-level horizontal menubar — File, Edit, View patterns.',
  'command':       'Command palette — search, jump, run with keyboard.',
  // ── Components / Feedback & Status ───────────────────────────────────
  'alerts':        'Inline status callouts: neutral, info, success, warning, danger.',
  'notification':  'Sonner-style toasts with positioning and async patterns.',
  'progress':      'Determinate and indeterminate progress for tasks and uploads.',
  'spinner':       'Tiny loading indicator — ring, dots, bars.',
  'skeleton':      'Placeholder shapes shown while content loads.',
  'badges':        'Small counts, labels, and inline status indicators.',
  'empty':         'Empty-state surface — title, description, action.',
  'status':        'Success, warning, danger color usage and pairings.',
  // ── Components / Display & Media ─────────────────────────────────────
  'avatars':       'Identity badges — initials, photos, presence, and groups.',
  'card':          'Content surface with head, body, and footer slots.',
  'table':         'Sort, filter, search, paginate, and select rows.',
  'chart':         'Bar, line, area, sparkline, donut — built on a single token set.',
  'data':          'Metric tiles — counter and sparkline for at-a-glance numbers.',
  'carousel':      'Horizontal scroll-snap with arrows, dots, and pages.',
  'aspect-ratio':  'Lock a child to a fixed width/height ratio — zero CLS.',
  'kbd':           'Keyboard shortcut hint — single keys or chord strings.',
  'surfaces':      'Background layers, elevation, and depth.',
  // ── Components / Misc ────────────────────────────────────────────────
  'collapsible':   'Single show/hide region — the building block under Accordion.',
  'pagination':    'Page navigation for tables and long lists.',
  'toggle':        'Single binary press — bold/italic/pin style button.',
  'toggle-group':  'Segmented control — single (radio-like) or multiple selection.',
  // ── Foundations ──────────────────────────────────────────────────────
  'brand':         'Logo, voice, and brand-level rules.',
  'color':         'Tokens, semantic roles, and contrast guidance.',
  'typography':    'Type scale, families, and editorial rhythm.',
  'spacing':       '4-pt scale, container widths, and radius tokens.',
  'shadows':       'Elevation steps and border weights.',
  'iconography':   '24×24 stroke set with sizing and rotation rules.',
  'motion':        'Durations, easings, and motion principles.',
  // ── AI ───────────────────────────────────────────────────────────────
  'ai-message':       'One conversation turn — user, assistant, system.',
  'ai-conversation':  'Bordered thread surface with auto-scroll and jump-pill.',
  'ai-prompt-input':  'Composer — textarea, attachments, model picker, submit.',
  'ai-suggestion':    'Starter prompt chips — row, wrap, or empty-state cards.',
  'ai-reasoning':     'Collapsible "thinking out loud" trace with shimmer.',
  'ai-tool':          'Tool call — input JSON, live status, rendered output.',
  // ── Patterns ─────────────────────────────────────────────────────────
  'page-headers':  'Section eyebrow, title, lede, and accent stripe.',
  'hero':          'Full-bleed marketing hero with the dot-grid backdrop.',
  'sidesheet':     'Right-side overlay panel for service detail and contextual forms.',
  // ── Resources ────────────────────────────────────────────────────────
  'a11y':       'Accessibility checklist and audit notes.',
  'changelog':  'Release history with breaking-change callouts.',
};

// Per-top-level-group blurb. "Components" gets its own header but is rendered
// first below; the rest follow in their original flat shape.
const GROUP_BLURB: Record<string, string> = {
  'Foundations': 'Tokens, scales, and primitives the rest of the system is built from.',
  'Components':  'Buttons, inputs, surfaces, overlays — the everyday building blocks.',
  'AI':          'Chat surfaces, prompt composers, reasoning traces, tool calls — every AI component composes existing primitives.',
  'Patterns':    'Compositions of components — page headers, sidesheets, heroes.',
  'Resources':   'Accessibility checklist, changelog, contact.',
};

// One-line description per Components sub-section. Authored here so the
// catalog can describe its sub-sections without re-introducing structure
// in nav-config.
const SUBGROUP_BLURB: Record<string, string> = {
  'Form & Input':       'Anything the user types, picks, drags, or toggles.',
  'Layout & Navigation':'Structure — where things sit and how the user moves between them.',
  'Overlays & Dialogs': 'Floating surfaces — menus, dialogs, popovers, command palettes.',
  'Feedback & Status':  'Tells the user what just happened or what is happening now.',
  'Display & Media':    'Read-only surfaces — data, identity, charts, frames.',
  'Misc':               'Atomic primitives and odd-shape utilities.',
};

// Lightweight visual flag per group so the catalog reads at a glance.
const GROUP_ICON: Record<string, string> = {
  'Components':  'layers',
  'Foundations': 'cpu',
  'AI':          'sparkle',
  'Patterns':    'flame',
  'Resources':   'book',
};

type CatItem = { slug: string; label: string; href: string };

const Tile = ({ item }: { item: CatItem }) => (
  <a
    key={item.slug}
    href={item.href}
    className="comp-tile"
    style={{textDecoration:'none', color:'inherit'}}
  >
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--space-3)'}}>
      <span className="name">{item.label}</span>
      <Icons.arrowRight size={14} color="var(--fg-faint)" aria-hidden="true"/>
    </div>
    <p className="desc">{DESC[item.slug] || `/${item.slug}`}</p>
  </a>
);

// Sub-section header inside the Components group. Quieter than a top-level
// group header (no ember eyebrow) — matches the sidebar's two-tier hierarchy.
const SubgroupHeader = ({ name, count }: { name: string; count: number }) => (
  <div className="ds-subgroup-header">
    <div className="ds-subgroup-title">
      <span className="ds-subgroup-tick" aria-hidden="true"/>
      {name}
    </div>
    <span className="ds-subgroup-blurb">{SUBGROUP_BLURB[name] || ''}</span>
    <span className="ds-subgroup-count t-mono">{count} pages</span>
  </div>
);

export default function Components() {
  // Core catalog only — each sub-DS (Charts, AI, IDP, Patterns, Mobile) has its own
  // Overview. Skip Get Started — this page already lives there, no self-link.
  const coreGroups = NAV.filter((g) => g.ds === 'core');
  const groups = coreGroups.filter((g) => g.group !== 'Get Started');
  const componentsGroup = groups.find((g) => g.group === 'Components');
  const otherGroups = groups.filter((g) => g.group !== 'Components');
  const coreItems = NAV_FLAT.filter((i) => i.ds === 'core');
  const getStartedCount = coreItems.filter((i) => i.group === 'Get Started').length;
  const totalItems = coreItems.length - getStartedCount;

  // Census — the catalog's thesis is "here is everything that ships", so we lead
  // with a live count per top-level group. Numbers are mono + tabular so the
  // ledger stays column-aligned as the system grows.
  const componentsCount = componentsGroup?.subgroups?.reduce((n, sg) => n + sg.items.length, 0) ?? 0;
  const census: { label: string; n: number }[] = [
    { label: 'Total', n: totalItems },
    { label: 'Components', n: componentsCount },
    ...otherGroups.map((g) => ({ label: g.group, n: (g.items ?? []).length })),
  ];

  return (
    <Section
      id="components-catalog"
      num={String(totalItems).padStart(2, '0')}
      title="Components"
      desc="Every page in the system, grouped by intent. Components are split into Form & Input, Layout & Navigation, Overlays, Feedback, Display, and Misc — then Foundations, Patterns, and Resources follow."
    >
      {/* ─── Census ledger — the catalog's one earned signature. A live,
          tabular-aligned headcount of everything that ships, derived from the
          same NAV every tile reads. Grows with the system; never hand-edited. ─ */}
      <div className="stat-row" style={{marginBlockStart:'var(--space-2)', marginBlockEnd:'var(--space-10)'}}>
        {census.map((c) => (
          <div className="stat" key={c.label}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value t-mono">{String(c.n).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* ─── Components group — nested by sub-section ──────────────── */}
      {componentsGroup && componentsGroup.subgroups && (
        <div style={{marginBlockStart:'var(--space-2)'}}>
          <div className="ds-sub">
            <span>Components</span>
            <span className="meta t-mono">{componentsGroup.subgroups.reduce((n, sg) => n + sg.items.length, 0)} pages · {componentsGroup.subgroups.length} sub-sections</span>
          </div>
          <p className="t-body" style={{color:'var(--fg-muted)', maxWidth:'64ch', marginBlock:'var(--space-0) var(--space-6)'}}>
            {GROUP_BLURB['Components']}
          </p>

          <div style={{display:'flex', flexDirection:'column', gap:'var(--space-8)'}}>
            {componentsGroup.subgroups.map((sg) => (
              <div key={sg.subgroup}>
                <SubgroupHeader name={sg.subgroup} count={sg.items.length}/>
                <nav className="comp-grid" aria-label={`${sg.subgroup} pages`}>
                  {sg.items.map((item) => <Tile key={item.slug} item={item}/>)}
                </nav>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Other top-level groups (Foundations · Patterns · Resources) ─ */}
      <div style={{display:'flex', flexDirection:'column', gap:'var(--space-8)', marginBlockStart:'var(--space-16)'}}>
        {otherGroups.map((group) => {
          const iconName = GROUP_ICON[group.group];
          const Icon = iconName && (Icons as Record<string, any>)[iconName] ? (Icons as Record<string, any>)[iconName] : null;
          const items = group.items ?? [];
          return (
            <div key={group.group}>
              <div style={{display:'flex', alignItems:'baseline', gap:'var(--space-3)', marginBlockEnd:'var(--space-3)'}}>
                {/* Neutral mono eyebrow — ember is reserved for the page-header marker
                    and the structural sub-section ticks, never sprayed per group. */}
                <span className="t-mono-label" style={{display:'inline-flex', alignItems:'center', gap:'var(--space-2)'}}>
                  {Icon && <Icon size={12} color="var(--fg-muted)" aria-hidden="true"/>}{group.group}
                </span>
                <span className="t-small" style={{color:'var(--fg-muted)'}}>{GROUP_BLURB[group.group] || ''}</span>
                <span className="t-mono-label" style={{marginInlineStart:'auto', color:'var(--fg-faint)'}}>{items.length} pages</span>
              </div>
              {items.length > 0 ? (
                <nav className="comp-grid" aria-label={`${group.group} pages`}>
                  {items.map((item) => <Tile key={item.slug} item={item}/>)}
                </nav>
              ) : (
                /* Real empty state — a group with no published pages renders a
                   labelled placeholder instead of a silent blank grid. */
                <Empty
                  size="sm"
                  dotted
                  iconName="inbox"
                  title={`No ${group.group.toLowerCase()} pages yet`}
                  desc="This section is reserved — pages light up here automatically once they ship in the nav."
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Accessibility — true to how this catalog actually behaves ─── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <p className="t-body" style={{color:'var(--fg-muted)', maxWidth:'64ch', marginBlock:'var(--space-0) var(--space-5)'}}>
        Each grid is a labelled <span className="t-code">{'<nav>'}</span> landmark
        (<span className="t-code">aria-label</span> = the section name), and every tile is a
        real link — no JS-only click handlers. Decorative marks (the ember sub-section ticks,
        the group marker, each tile&apos;s trailing arrow) carry <span className="t-code">aria-hidden=&quot;true&quot;</span>,
        so a screen reader hears only the page name and its one-line description. An empty section
        renders a <span className="t-code">role=&quot;status&quot;</span> placeholder rather than a silent blank grid.
      </p>
      <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'var(--space-2)', maxWidth:'52ch', marginBlockEnd:'var(--space-5)'}}>
        <Kbd label="Move between tiles" keys={['Tab']}/>
        <Kbd label="Move backward" keys={['Shift', 'Tab']}/>
        <Kbd label="Open the focused page" keys={['Enter']}/>
        <Kbd label="Jump to any page by name" keys={['⌘', 'K']} meta="opens the global command palette"/>
      </div>
      <p className="t-small" style={{color:'var(--fg-muted)', maxWidth:'64ch', marginBlock:'var(--space-0)'}}>
        Focus shows the canonical 2px ember ring (<span className="t-code">--ring</span>) on every
        tile. Tile text on <span className="t-code">--surface</span> clears 4.5:1; the muted description
        clears 4.5:1 as body copy. The hover lift respects <span className="t-code">prefers-reduced-motion</span> —
        with motion reduced, tiles change only colour, never position.
      </p>

      {/* Footer hint */}
      <div style={{marginBlockStart:'var(--space-16)', padding:'var(--space-5)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', background:'var(--bg-elevated)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'var(--space-4)', flexWrap:'wrap'}}>
        <div>
          <div className="t-body" style={{fontWeight: 600}}>Missing something?</div>
          <div className="t-small" style={{color:'var(--fg-muted)', marginBlockStart:'var(--space-1)'}}>The catalog grows as the product grows. Open a request in the Forge platform repo.</div>
        </div>
        <a className="btn" href="/changelog">See changelog <Icons.arrowRight size={14}/></a>
      </div>
    </Section>
  );
}
