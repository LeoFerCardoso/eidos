'use client';
import * as React from 'react';
import { Frame, Section, SubHead, Icons, Lede, Mono } from '@/ds/core';

// ---- Inline style helpers (match buttons.jsx) ----------------------------
const lede   = { fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: '68ch' };

// Reusable cells — keep tables compact and scannable.
const tdCrit = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' };
const tdName = { color: 'var(--fg)' };
const tdNote = { color: 'var(--fg-muted)' };

// ==========================================================================
// 1. WCAG 2.2 AA — the criteria that bite a UI component library.
//    Status pill values: 'success' = met by the system, 'warning' = met
//    only when the consumer follows the prescribed pattern.
// ==========================================================================
const WCAG_ROWS = [
  { id: '1.1.1',  name: 'Non-text Content',           status: 'success', note: 'Every Eidos icon ships with an aria-label or aria-hidden flag. Icon-only Buttons require aria-label.', ref: 'Button · IconButton' },
  { id: '1.3.1',  name: 'Info and Relationships',     status: 'success', note: 'Form fields wired through .in-field → label/control/helper. Tables use semantic <th scope>.', ref: 'Input · DataTable' },
  { id: '1.3.2',  name: 'Meaningful Sequence',        status: 'success', note: 'DOM order matches visual order on every page. No tabindex > 0 anywhere in the system.', ref: 'global' },
  { id: '1.3.5',  name: 'Identify Input Purpose',     status: 'warning', note: 'autoComplete tokens (name, email, tel, postal-code) are documented per Input variant. Consumers must opt in.', ref: 'Input' },
  { id: '1.4.3',  name: 'Contrast (Minimum)',         status: 'success', note: 'All text tokens compute ≥ 4.5:1 on their default surface. See contrast pairs below.', ref: 'tokens.css' },
  { id: '1.4.4',  name: 'Resize Text',                status: 'success', note: 'Type scale is rem-based. Layouts hold up to 200% browser zoom — no fixed pixel widths on text containers.', ref: 'global' },
  { id: '1.4.10', name: 'Reflow',                     status: 'success', note: 'No horizontal scroll at 320 CSS px except for tables, which scroll inside .ds-table-wrap.', ref: 'DataTable' },
  { id: '1.4.11', name: 'Non-text Contrast',          status: 'success', note: 'Borders, focus rings, and icon strokes meet ≥ 3:1 against adjacent surfaces in both themes.', ref: 'tokens.css' },
  { id: '1.4.13', name: 'Content on Hover or Focus',  status: 'warning', note: 'Tooltip is dismissable (Esc), hoverable, and persistent — but only opens on hover. Focus-open is on the roadmap (see Audit log).', ref: 'Tooltip' },
  { id: '2.1.1',  name: 'Keyboard',                   status: 'success', note: 'Every interactive surface is operable with Tab + Enter/Space. Combobox, Menu, and Calendar add arrow-key roving.', ref: 'global' },
  { id: '2.1.2',  name: 'No Keyboard Trap',           status: 'success', note: 'Dialog and Drawer use focus-trap that releases on Esc or backdrop click. Sidebar never traps.', ref: 'Dialog · Drawer' },
  { id: '2.4.3',  name: 'Focus Order',                status: 'success', note: 'Roving tabindex inside Tabs / Menu / Calendar; otherwise DOM-natural order.', ref: 'Tabs · Menu' },
  { id: '2.4.7',  name: 'Focus Visible',              status: 'success', note: '2px ember outline + 2px offset on every focusable element. Never removed without replacement.', ref: 'global' },
  { id: '2.4.11', name: 'Focus Not Obscured (Min)',   status: 'success', note: 'Sticky topbar + sidebar leave ≥ 32px clearance. Focus ring is never clipped by .ds-frame overflow.', ref: 'shell.jsx' },
  { id: '2.5.5',  name: 'Target Size (Enhanced)',     status: 'warning', note: '32px buttons (size="md") are below the 44px enhanced target. Use size="lg" on touch surfaces.', ref: 'Button' },
  { id: '2.5.7',  name: 'Dragging Movements',         status: 'success', note: 'Slider and Switch ship keyboard equivalents (arrows, Space). Carousel offers next/prev controls.', ref: 'Slider · Carousel' },
  { id: '2.5.8',  name: 'Target Size (Minimum)',      status: 'success', note: 'All interactive controls are ≥ 24×24 CSS px with adequate spacing. size="xs" is icon-only and 28×28.', ref: 'Button · Checkbox' },
  { id: '3.2.1',  name: 'On Focus',                   status: 'success', note: 'Focusing a control never triggers navigation, submission, or a context shift.', ref: 'global' },
  { id: '3.3.1',  name: 'Error Identification',       status: 'success', note: '.in-field uses aria-invalid + aria-describedby pointing at the helper. Errors are text, not just color.', ref: 'Input · Form' },
  { id: '3.3.2',  name: 'Labels or Instructions',     status: 'success', note: 'Every Input requires a label (visible or .sr-only). Placeholder is never the label.', ref: 'Input' },
  { id: '3.3.7',  name: 'Redundant Entry',            status: 'warning', note: 'Multi-step Form remembers prior steps via local state. Consumers wire their own persistence for cross-session redundancy.', ref: 'Form' },
  { id: '4.1.2',  name: 'Name, Role, Value',          status: 'success', note: 'Composites use canonical WAI-ARIA roles (combobox, listbox, tablist, dialog, menu). State exposed via aria-expanded / aria-selected / aria-checked.', ref: 'Combobox · Tabs · Dialog' },
  { id: '4.1.3',  name: 'Status Messages',            status: 'success', note: 'Toast wraps in role="status" + aria-live="polite". Destructive Toast escalates to aria-live="assertive".', ref: 'Toast' },
];

const wcagPill = (status) => {
  if (status === 'success') return <span className="pill success"><Icons.check size={10}/> Met</span>;
  if (status === 'warning') return <span className="pill warning"><Icons.alert size={10}/> Conditional</span>;
  return <span className="pill danger"><Icons.x size={10}/> Gap</span>;
};

// ==========================================================================
// 2. Component × ARIA — the contract every Eidos primitive must satisfy.
//    Sourced from WAI-ARIA Authoring Practices 1.2 patterns.
// ==========================================================================
const ARIA_ROWS = [
  { c: 'Button',     role: 'button',         attrs: 'aria-pressed (toggle), aria-disabled, aria-busy (loading)',                          keys: 'Space, Enter' },
  { c: 'Checkbox',   role: 'checkbox',       attrs: 'aria-checked (true | false | mixed), aria-required, aria-invalid',                    keys: 'Space' },
  { c: 'RadioGroup', role: 'radiogroup → radio', attrs: 'aria-checked, aria-labelledby on the group, aria-required',                       keys: 'Tab in, ↑ ↓ ← → roving, Space' },
  { c: 'Switch',     role: 'switch',         attrs: 'aria-checked, aria-readonly, aria-labelledby',                                        keys: 'Space, Enter' },
  { c: 'Slider',     role: 'slider',         attrs: 'aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext, aria-orientation',       keys: '← ↓ decrement, → ↑ increment, PgUp/PgDn step×10, Home/End' },
  { c: 'Combobox',   role: 'combobox + listbox', attrs: 'aria-expanded, aria-controls, aria-autocomplete, aria-activedescendant',          keys: '↑ ↓ navigate, Enter select, Esc close, Home/End, type-ahead' },
  { c: 'Menu',       role: 'menu → menuitem', attrs: 'aria-haspopup="menu" on trigger, aria-expanded, aria-orientation',                   keys: '↑ ↓ navigate, → submenu, ← back, Enter, Esc, type-ahead' },
  { c: 'Tabs',       role: 'tablist → tab + tabpanel', attrs: 'aria-selected, aria-controls (tab→panel), aria-labelledby (panel→tab)',     keys: '← → switch, Home/End, Enter/Space activate (manual)' },
  { c: 'Dialog',     role: 'dialog',         attrs: 'aria-modal="true", aria-labelledby (title), aria-describedby (body)',                 keys: 'Tab focus-trap, Esc close, focus restored on close' },
  { c: 'Drawer',     role: 'dialog',         attrs: 'aria-modal="true", aria-labelledby; backdrop click dismiss',                          keys: 'Tab trap, Esc close' },
  { c: 'Modal',      role: 'dialog',         attrs: 'aria-modal="true", aria-labelledby, aria-describedby',                                keys: 'Tab trap, Esc close' },
  { c: 'Popover',    role: 'dialog',         attrs: 'aria-labelledby, aria-describedby; trigger gets aria-haspopup="dialog"',              keys: 'Esc close; non-modal (focus may leave)' },
  { c: 'Tooltip',    role: 'tooltip',        attrs: 'aria-describedby on the trigger; tooltip itself owns id',                             keys: 'Esc dismiss; opens on hover + focus' },
  { c: 'Toast',      role: 'status / alert', attrs: 'aria-live="polite" (default) or "assertive" (destructive); aria-atomic="true"',       keys: 'Esc dismiss focused toast' },
  { c: 'Calendar',   role: 'application + grid', attrs: 'aria-labelledby (month), grid cells use aria-selected, aria-current="date"',      keys: '← → days, ↑ ↓ weeks, PgUp/PgDn months, Shift+PgUp/PgDn years, Home/End week, Enter select' },
  { c: 'Carousel',   role: 'region',         attrs: 'aria-roledescription="carousel", aria-label, slides aria-roledescription="slide"',    keys: '← → previous/next, Home/End first/last, Tab into controls' },
  { c: 'Sidebar',    role: 'navigation',     attrs: 'aria-label="Primary"; current item aria-current="page"',                              keys: 'Tab through items; collapse trigger Space/Enter' },
];

// ==========================================================================
// 3. Contrast pairs — ratios computed from the literal hex values in
//    tokens.css using the WCAG 2.x relative-luminance formula. Numbers
//    are not invented; they're embedded so the page is auditable.
// ==========================================================================
const CONTRAST_PAIRS = [
  { fg: '#EDEDED', bg: '#08090A', fgVar: '--fg',        bgVar: '--bg',           ratio: 17.02, theme: 'dark',  use: 'Body copy, headings' },
  { fg: '#EDEDED', bg: '#141517', fgVar: '--fg',        bgVar: '--surface',      ratio: 15.61, theme: 'dark',  use: 'Body on cards, dialogs' },
  { fg: '#A1A1A6', bg: '#08090A', fgVar: '--fg-muted',  bgVar: '--bg',           ratio: 7.75,  theme: 'dark',  use: 'Secondary text, ledes' },
  { fg: '#A1A1A6', bg: '#141517', fgVar: '--fg-muted',  bgVar: '--surface',      ratio: 7.10,  theme: 'dark',  use: 'Muted body on surface' },
  { fg: '#6B6B70', bg: '#08090A', fgVar: '--fg-subtle', bgVar: '--bg',           ratio: 3.76,  theme: 'dark',  use: 'Captions, table headers (large only)' },
  { fg: '#08090A', bg: '#FF6B35', fgVar: '--bg',        bgVar: '--ember',        ratio: 7.03,  theme: 'dark',  use: 'Ember CTA label' },
  { fg: '#FF6B35', bg: '#08090A', fgVar: '--ember',     bgVar: '--bg',           ratio: 7.03,  theme: 'dark',  use: 'Inline accent / link' },
  { fg: '#0A0A0B', bg: '#FAFAFA', fgVar: '--fg',        bgVar: '--bg',           ratio: 18.96, theme: 'light', use: 'Body copy, headings' },
  { fg: '#52525B', bg: '#FAFAFA', fgVar: '--fg-muted',  bgVar: '--bg',           ratio: 7.41,  theme: 'light', use: 'Secondary text' },
  { fg: '#71717A', bg: '#FFFFFF', fgVar: '--fg-subtle', bgVar: '--bg-elevated',  ratio: 4.83,  theme: 'light', use: 'Captions on cards' },
];

const contrastPill = (r) => {
  if (r >= 7)   return <span className="pill success">AAA</span>;
  if (r >= 4.5) return <span className="pill success">AA</span>;
  if (r >= 3)   return <span className="pill warning">AA Large</span>;
  return <span className="pill danger">Fail</span>;
};

// ==========================================================================
// 4. Keyboard map — the global Eidos surface area.
// ==========================================================================
const KEYS_ROWS = [
  { keys: ['Tab'],                  action: 'Move to next focusable element',          scope: 'global' },
  { keys: ['Shift', 'Tab'],         action: 'Move to previous focusable element',      scope: 'global' },
  { keys: ['⌘', 'K'],               action: 'Open command palette',                    scope: 'global' },
  { keys: ['Esc'],                  action: 'Dismiss the topmost overlay',             scope: 'Dialog · Drawer · Menu · Tooltip' },
  { keys: ['Enter'],                action: 'Activate focused control · select option',scope: 'Button · Combobox · Menu' },
  { keys: ['Space'],                action: 'Toggle · activate · scroll',              scope: 'Checkbox · Switch · Button' },
  { keys: ['←', '→'],               action: 'Move between siblings',                   scope: 'Tabs · Carousel · Slider · RadioGroup' },
  { keys: ['↑', '↓'],               action: 'Move within a list',                      scope: 'Combobox · Menu · Calendar' },
  { keys: ['Home'],                 action: 'Jump to first item',                      scope: 'Combobox · Menu · Tabs' },
  { keys: ['End'],                  action: 'Jump to last item',                       scope: 'Combobox · Menu · Tabs' },
  { keys: ['PgUp'],                 action: 'Step coarse / previous month',            scope: 'Slider · Calendar' },
  { keys: ['PgDn'],                 action: 'Step coarse / next month',                scope: 'Slider · Calendar' },
  { keys: ['j'],                    action: 'Next item in list',                       scope: 'Inbox · DataTable' },
  { keys: ['k'],                    action: 'Previous item in list',                   scope: 'Inbox · DataTable' },
  { keys: ['/'],                    action: 'Focus search input',                      scope: 'global' },
  { keys: ['?'],                    action: 'Open keyboard help',                      scope: 'global' },
];

const renderKeys = (keys) => keys.length === 1
  ? <span className="kbd">{keys[0]}</span>
  : (
    <span className="kbd-chord">
      {keys.map((k, i) => <React.Fragment key={i}>
        {i > 0 && <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)', margin: '0 2px' }}>+</span>}
        <span className="kbd">{k}</span>
      </React.Fragment>)}
    </span>
  );

// ==========================================================================
// 5. Focus-visible CSS contract — what every new component must inherit.
// ==========================================================================
const FOCUS_CSS = `/* Outline-style — for buttons, inputs, links */
:focus-visible {
  outline: 2px solid rgba(255, 107, 53, 0.5);
  outline-offset: 2px;
  border-radius: 6px;
}

/* Inset-style — for compound controls that own their border
   (combobox group, switch track, segmented control) */
.in-group:focus-within,
.fc-toggle:focus-within .fc-toggle-track {
  box-shadow: 0 0 0 3px var(--ember-soft);
  border-color: var(--ember);
}

/* Never strip without replacement */
button:focus { outline: none; }       /* default browser ring off */
button:focus-visible { /* …ring on */ }`;

const REDUCED_MOTION_CSS = `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Eidos-specific — kill decorative loops outright */
  .ember-pulse,
  .page-enter,
  .ai-caret,
  .skeleton { animation: none !important; }

  /* Switch thumb still needs to move; just skip the spring */
  .fc-toggle-thumb { transition: transform 0.01ms linear !important; }
}`;

const SR_ONLY_SNIPPET = `/* In ds.css — the canonical visually-hidden helper */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}`;

// ==========================================================================
// 6. Screen-reader rules
// ==========================================================================
const SR_RULES = [
  { kind: 'do',   text: 'Use role="status" + aria-live="polite" for non-urgent updates (saved, copied, refreshed).' },
  { kind: 'do',   text: 'Escalate to aria-live="assertive" only for destructive or blocking errors.' },
  { kind: 'do',   text: 'Wrap visually-hidden labels in .sr-only — never use display:none, which strips them from the AT tree.' },
  { kind: 'do',   text: 'Mark decorative SVGs with aria-hidden="true". Informative SVGs need a <title> child with a stable id.' },
  { kind: 'do',   text: 'Pair every Input with a label — visible or .sr-only. Placeholder is hint text, not a label.' },
  { kind: 'do',   text: 'Restore focus to the trigger element when a Dialog, Drawer, or Menu closes.' },
  { kind: 'dont', text: 'Don\'t put aria-hidden="true" on a focusable element — keyboard users land on a "ghost" they can\'t hear.' },
  { kind: 'dont', text: 'Don\'t announce decorative motion (skeletons, shimmer, pulse). Wrap them in aria-hidden parents.' },
  { kind: 'dont', text: 'Don\'t reuse the same aria-describedby id across siblings — JAWS/NVDA will read stale text.' },
  { kind: 'dont', text: 'Don\'t rely on color alone for state. Pair it with text, icon, or pattern.' },
];

// ==========================================================================
// 7. Shipping checklist
// ==========================================================================
const CHECKLIST = [
  'Every interactive element is reachable with Tab in DOM order.',
  'Focus ring is visible against every theme + every parent surface (no clipping by overflow:hidden).',
  'Text contrast ≥ 4.5:1; non-text contrast ≥ 3:1; verified in dark and light.',
  'Color is never the only signal — paired with text, icon, or shape.',
  'Every Input has an associated <label> (visible or .sr-only).',
  'aria-* attributes match the WAI-ARIA pattern for the role (no custom inventions).',
  'Live regions exist for asynchronous state changes (toast, error, save).',
  'Esc dismisses the topmost overlay; focus returns to the trigger.',
  'No keyboard trap outside of intentional focus-trap (Dialog, Drawer, Modal).',
  'No tabindex > 0 anywhere. Use roving tabindex for composite widgets.',
  'Tested with VoiceOver (Safari) and NVDA (Firefox); roles + names + values announce as expected.',
  'Tested at 200% browser zoom and 320 CSS px width — no horizontal scroll, no clipped controls.',
  'prefers-reduced-motion honored: no decorative loops, transitions cap at 0.01ms.',
  'Touch targets ≥ 24×24 CSS px (≥ 44×44 on mobile-first surfaces).',
  'RTL example shipped; logical properties used throughout.',
];

// ==========================================================================
// 8. Audit log — known a11y debt, with severity + status. Honest, not
//    aspirational. P1 = blocker, P2 = needs-fix, P3 = polish.
// ==========================================================================
const AUDIT = [
  { item: 'Tooltip opens on hover only — no focus-open delay yet.',                         sev: 'P2', status: 'In progress', target: 'v1.4' },
  { item: 'Sidebar tier border has no semantic role — purely visual.',                      sev: 'P3', status: 'Tracked',     target: 'v1.5' },
  { item: 'Carousel autoplay does not pause on focus (it does pause on hover).',            sev: 'P2', status: 'Tracked',     target: 'v1.4' },
  { item: 'DataTable column-resize handles are mouse-only — no keyboard equivalent.',       sev: 'P2', status: 'Backlog',    target: 'v1.5' },
  { item: 'Combobox virtual list announces "1 of N" but not the current group label.',     sev: 'P3', status: 'Backlog',    target: 'v1.5' },
  { item: 'Toast does not respect reduced-motion for slide-in (only fade is suppressed).', sev: 'P3', status: 'Tracked',     target: 'v1.4' },
];

const sevPill = (s) => {
  if (s === 'P1') return <span className="pill danger">{s}</span>;
  if (s === 'P2') return <span className="pill warning">{s}</span>;
  return <span className="pill">{s}</span>;
};

// ==========================================================================
// PAGE
// ==========================================================================
export default function A11y() {
  return (
    <Section
      id="a11y"
      num="22"
      title="Accessibility"
      desc="WCAG 2.2 AA is the floor. Every Eidos component ships keyboard-first, screen-reader-honest, and renders identically in dark and light. This page is the contract — and the audit log."
    >

      {/* ====================================================================
          0. PRINCIPLES — short, scannable summary
          ==================================================================== */}
      <SubHead meta="four guarantees">Principles</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 14}}>
        <div className="surface" style={{padding: 18}}>
          <div className="t-mono-label" style={{display:'flex', alignItems:'center', gap: 8}}>
            <Icons.keyboard size={12}/> Keyboard-first
          </div>
          <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 8, lineHeight: 1.55}}>
            Every interactive surface is reachable with <span className="kbd">Tab</span> and operable without a pointer. Composite widgets (Combobox, Menu, Calendar) implement roving tabindex per WAI-ARIA APG.
          </p>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-mono-label" style={{display:'flex', alignItems:'center', gap: 8}}>
            <Icons.eye size={12}/> Visible focus
          </div>
          <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 8, lineHeight: 1.55}}>
            A 2px ember outline with 2px offset on every focusable element. Never <Mono>outline: none</Mono> without a replacement ring of equal weight.
          </p>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-mono-label" style={{display:'flex', alignItems:'center', gap: 8}}>
            <Icons.info size={12}/> SR-honest
          </div>
          <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 8, lineHeight: 1.55}}>
            Roles, names, and values come from native HTML where possible. ARIA only patches the gaps — and only when it matches the WAI-ARIA Authoring Practices.
          </p>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-mono-label" style={{display:'flex', alignItems:'center', gap: 8}}>
            <Icons.shield size={12}/> Theme parity
          </div>
          <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 8, lineHeight: 1.55}}>
            Dark and light themes hit the same contrast floor (4.5:1 for body text, 3:1 for non-text). No theme is a second-class citizen.
          </p>
        </div>
      </div>

      {/* ====================================================================
          1. WCAG 2.2 MATRIX
          ==================================================================== */}
      <SubHead meta="WCAG 2.2 AA">Success criteria</SubHead>
      <Lede up>
        The 23 AA criteria most relevant to a UI component library. Of WCAG 2.2's 50 total Level A + AA criteria, the rest are content-author responsibilities (alt text quality, language of page, etc.) the system can't satisfy on the consumer's behalf.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">2.2 success criteria — applied to Eidos</span></div>
        <div style={{overflowX: 'auto'}}>
          <table className="tbl" style={{margin: 0}}>
            <thead>
              <tr>
                <th style={{width: 72}}>SC</th>
                <th style={{width: 200}}>Criterion</th>
                <th style={{width: 130}}>Status</th>
                <th>Eidos approach</th>
                <th style={{width: 180}}>Reference</th>
              </tr>
            </thead>
            <tbody>
              {WCAG_ROWS.map((r) => (
                <tr key={r.id}>
                  <td style={tdCrit}>{r.id}</td>
                  <td style={tdName}>{r.name}</td>
                  <td>{wcagPill(r.status)}</td>
                  <td style={tdNote}>{r.note}</td>
                  <td style={{...tdNote, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)'}}>{r.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="ds-caption">"Conditional" means the criterion is met when the consumer follows the documented prop or pattern; "Met" means the system enforces it without consumer effort.</p>

      {/* ====================================================================
          2. COMPONENT × ARIA
          ==================================================================== */}
      <SubHead meta="WAI-ARIA APG 1.2">ARIA contract per component</SubHead>
      <Lede up>
        For each composite widget: the role to apply, the ARIA state attributes that must update with internal state, and the keyboard interactions the component must implement. Sourced from the WAI-ARIA Authoring Practices.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">component → role + aria + keys</span></div>
        <div style={{overflowX: 'auto'}}>
          <table className="tbl" style={{margin: 0}}>
            <thead>
              <tr>
                <th style={{width: 130}}>Component</th>
                <th style={{width: 220}}>Role</th>
                <th>Required ARIA</th>
                <th style={{width: 280}}>Keyboard</th>
              </tr>
            </thead>
            <tbody>
              {ARIA_ROWS.map((r) => (
                <tr key={r.c}>
                  <td style={tdName}><b>{r.c}</b></td>
                  <td style={{...tdNote, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg)'}}>{r.role}</td>
                  <td style={{...tdNote, fontSize: 'var(--text-sm)'}}>{r.attrs}</td>
                  <td style={{...tdNote, fontSize: 'var(--text-sm)'}}>{r.keys}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="ds-caption">When a component appears here, its primitive in <Mono>primitives.jsx</Mono> wires the listed roles and attributes. Consumers using <Mono>asChild</Mono> are responsible for forwarding them.</p>

      {/* ====================================================================
          3. CONTRAST PAIRS — actual computed ratios
          ==================================================================== */}
      <SubHead meta="WCAG 2.x relative luminance">Contrast pairs</SubHead>
      <Lede up>
        Ratios computed directly from the hex values in <Mono>tokens.css</Mono> using the WCAG 2.x formula: <Mono>(L1 + 0.05) / (L2 + 0.05)</Mono>, where L is the relative luminance of each color. Pass thresholds: <b style={{color:'var(--fg)'}}>4.5:1 AA</b> body text, <b style={{color:'var(--fg)'}}>3:1 AA Large</b> (≥ 18pt or 14pt bold), <b style={{color:'var(--fg)'}}>7:1 AAA</b>.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">computed ratios — dark + light</span></div>
        <div style={{overflowX: 'auto'}}>
          <table className="tbl" style={{margin: 0}}>
            <thead>
              <tr>
                <th style={{width: 72}}>Theme</th>
                <th style={{width: 80}}>Sample</th>
                <th>Foreground</th>
                <th>Background</th>
                <th style={{width: 90, textAlign: 'end'}}>Ratio</th>
                <th style={{width: 110}}>Body 4.5:1</th>
                <th style={{width: 110}}>Large 3:1</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST_PAIRS.map((p, i) => (
                <tr key={i}>
                  <td style={{...tdNote, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)'}}>{p.theme}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 56, height: 28, borderRadius: 'var(--radius-sm)',
                      background: p.bg, color: p.fg,
                      border: '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
                    }}>Aa</span>
                  </td>
                  <td style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg)'}}>
                    {p.fgVar} <span style={{color:'var(--fg-faint)'}}>{p.fg}</span>
                  </td>
                  <td style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg)'}}>
                    {p.bgVar} <span style={{color:'var(--fg-faint)'}}>{p.bg}</span>
                  </td>
                  <td style={{textAlign: 'end', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg)', fontVariantNumeric: 'tabular-nums'}}>
                    {p.ratio.toFixed(2)}:1
                  </td>
                  <td>{p.ratio >= 4.5 ? <span className="pill success"><Icons.check size={10}/> Pass</span> : <span className="pill danger"><Icons.x size={10}/> Fail</span>}</td>
                  <td>{p.ratio >= 3 ? <span className="pill success"><Icons.check size={10}/> Pass</span> : <span className="pill danger"><Icons.x size={10}/> Fail</span>}</td>
                  <td style={tdNote}>{p.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="ds-caption">
        <Mono>--fg-subtle</Mono> on <Mono>--bg</Mono> (3.76:1) is the only token pair below the AA body threshold — it's reserved for captions, helper text, and meta labels at <Mono>14pt</Mono>+ where AA Large applies.
      </p>

      {/* ====================================================================
          4. KEYBOARD MAP
          ==================================================================== */}
      <SubHead meta="global shortcuts">Keyboard map</SubHead>
      <Lede up>
        The shortcuts every Eidos surface listens for. Component-local keys (Combobox arrows, Calendar PgUp/PgDn) live in the ARIA contract table above.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">keyboard surface area</span></div>
        <div style={{overflowX: 'auto'}}>
          <table className="tbl" style={{margin: 0}}>
            <thead>
              <tr>
                <th style={{width: 160}}>Keys</th>
                <th>Action</th>
                <th style={{width: 280}}>Scope</th>
              </tr>
            </thead>
            <tbody>
              {KEYS_ROWS.map((r, i) => (
                <tr key={i}>
                  <td>{renderKeys(r.keys)}</td>
                  <td style={tdName}>{r.action}</td>
                  <td style={{...tdNote, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)'}}>{r.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================================
          5. FOCUS-VISIBLE
          ==================================================================== */}
      <SubHead meta=":focus-visible">Focus contract</SubHead>
      <Lede up>
        Two patterns: <b style={{color:'var(--fg)'}}>outline-style</b> for atomic controls (Button, Input, link), and <b style={{color:'var(--fg)'}}>inset-style</b> for compound controls that own their border (Combobox group, Switch track). Both carry the ember at the same intensity.
      </Lede>
      <Frame label="focus styles — Tab through these" row>
        <button className="btn ember focus-ring">Outline · Button</button>
        <button className="btn outline focus-ring">Outline · Secondary</button>
        <div className="in-field" style={{maxWidth: 220, marginBottom: 0}}>
          <div className="in-group md">
            <input className="in-control" placeholder="Inset · Input" defaultValue="" />
          </div>
        </div>
        <a className="btn link focus-ring" href="#" onClick={(e)=>e.preventDefault()}>Link</a>
      </Frame>
      <p className="ds-caption">Tab through the row. Outline-style paints around the element; inset-style paints inside the group. Same ember, same perceived weight.</p>

      <Frame label="focus.css — the contract" lang="css" code={FOCUS_CSS}>
        <div style={{fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.6}}>
          Apply globally. Eidos ships these rules in <Mono>tokens.css</Mono>. Per-component overrides only widen the ring (Slider thumb, Switch track) — never narrow it.
        </div>
      </Frame>

      {/* ====================================================================
          6. SCREEN READER NOTES
          ==================================================================== */}
      <SubHead meta="VoiceOver · NVDA · JAWS">Screen reader rules</SubHead>
      <Lede up>
        The non-negotiables every component honors. Test with VoiceOver in Safari and NVDA in Firefox before shipping — they catch different things.
      </Lede>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do</div>
          <div className="body" style={{flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: '14px 16px'}}>
            {SR_RULES.filter(r => r.kind === 'do').map((r, i) => (
              <div key={i} style={{fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55, display: 'flex', gap: 8, alignItems: 'flex-start'}}>
                <span style={{color: 'var(--success)', marginTop: 2, flexShrink: 0}}><Icons.check size={11}/></span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't</div>
          <div className="body" style={{flexDirection: 'column', alignItems: 'flex-start', gap: 10, padding: '14px 16px'}}>
            {SR_RULES.filter(r => r.kind === 'dont').map((r, i) => (
              <div key={i} style={{fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.55, display: 'flex', gap: 8, alignItems: 'flex-start'}}>
                <span style={{color: 'var(--danger)', marginTop: 2, flexShrink: 0}}><Icons.x size={11}/></span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SubHead meta=".sr-only utility">Visually hidden helper</SubHead>
      <Frame label="sr-only — the only correct way to hide-from-sight, keep-in-AT" lang="css" code={SR_ONLY_SNIPPET}>
        <div style={{fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.6}}>
          Use for SR-only labels on icon-only buttons, off-screen page-region landmarks, and "skip to content" links. Never use <Mono>display: none</Mono> or <Mono>visibility: hidden</Mono> — both strip the node from the AT tree.
        </div>
      </Frame>

      {/* ====================================================================
          7. REDUCED MOTION
          ==================================================================== */}
      <SubHead meta="prefers-reduced-motion">Reduced motion</SubHead>
      <Lede up>
        The contract: when the user's OS setting is "reduce motion", components must <b style={{color:'var(--fg)'}}>not</b> animate. Decorative loops (skeleton shimmer, ember pulse, AI caret) stop. Functional transitions (focus ring, switch thumb) collapse to ≤ 0.01ms — instant, but still committed to the DOM so React doesn't trip on missing transitionend events.
      </Lede>
      <Frame label="reduced-motion.css — the global guard" lang="css" code={REDUCED_MOTION_CSS}>
        <div style={{fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.6}}>
          Apply once at the top of <Mono>tokens.css</Mono>. Per-component animations layer on top — and inherit the kill-switch automatically because the rule targets <Mono>*, *::before, *::after</Mono>.
        </div>
      </Frame>
      <p className="ds-caption">The single non-decorative carve-out is the Switch thumb: it still translates between states (so the visual matches <Mono>aria-checked</Mono>), but the spring curve is replaced by linear 0.01ms.</p>

      {/* ====================================================================
          8. SHIPPING CHECKLIST
          ==================================================================== */}
      <SubHead meta="run before merging">Shipping checklist</SubHead>
      <Lede up>
        15 checks every new component must pass. Designers run the visual ones; engineers run the SR + keyboard ones. Both sign off before merge.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">pre-merge a11y checklist</span></div>
        <div className="ds-frame-body" style={{padding: '20px 24px', display: 'block'}}>
          <ol style={{margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10}}>
            {CHECKLIST.map((item, i) => (
              <li key={i} style={{display: 'flex', gap: 12, alignItems: 'flex-start'}}>
                <span style={{
                  flexShrink: 0,
                  width: 18, height: 18, borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)',
                  fontVariantNumeric: 'tabular-nums', marginTop: 1,
                }}>{(i + 1).toString().padStart(2, '0')}</span>
                <span style={{fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55}}>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ====================================================================
          9. AUDIT LOG — known debt
          ==================================================================== */}
      <SubHead meta="known debt">Audit log</SubHead>
      <Lede up>
        What the system doesn't fully cover yet. Listed honestly so consumers can plan around it. P1 = blocker, P2 = needs-fix, P3 = polish.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">open a11y issues</span></div>
        <div style={{overflowX: 'auto'}}>
          <table className="tbl" style={{margin: 0}}>
            <thead>
              <tr>
                <th style={{width: 72}}>Severity</th>
                <th>Issue</th>
                <th style={{width: 130}}>Status</th>
                <th style={{width: 90}}>Target</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT.map((a, i) => (
                <tr key={i}>
                  <td>{sevPill(a.sev)}</td>
                  <td style={tdName}>{a.item}</td>
                  <td style={{...tdNote, fontSize: 'var(--text-sm)'}}>{a.status}</td>
                  <td style={{...tdNote, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums'}}>{a.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="ds-caption">
        Found something that should be on this list? Open an issue at <Mono>github.com/forge/design-system/issues</Mono> with the <Mono>a11y</Mono> label. We triage weekly.
      </p>
    </Section>
  );
}
