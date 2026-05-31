'use client';
import { ChangelogView, type ChangelogEntry } from '@/components/docs';

const CHANGELOG: ChangelogEntry[] = [
  // ─── v1.14.0 — Mobile on the contract harness + atomic Chip (2026-05-30) ──────
  { version: 'v1.14.0', date: '2026-05-30', type: 'feat', scope: 'mobile', title: 'Mobile components on the contract + a dedicated Chip page',
    summary: 'Every mobile page is verified against the four-surface contract (Accessibility incl. 44px targets, RTL, anatomy) via forge:verify. Chip moved to its own core page; the mobile chips page stays for the mobile-specific filter variant.' },

  // ─── v1.13.0 — RTL on every component + page-typography standard (2026-05-22) ──────
  { version: 'v1.13.0', date: '2026-05-22', type: 'feat', scope: 'mobile', title: 'RTL section added to all 24 mobile components',
    summary: 'Every substantive Eidos Mobile component page now ships the mandatory RTL section — a live dir="rtl" preview of the component plus a Lede naming exactly what mirrors (icon areas swap via logical inset-inline; directional glyphs flip with scaleX(-1)) and what stays. Examples: the Slider Drawer slides from the right, list/card chevrons mirror, badges and the FAB flip to the leading-left corner, the progress bar fills right-to-left, and tab/segment order reverses.' },
  { version: 'v1.13.0', date: '2026-05-22', type: 'docs', scope: 'foundations', title: 'Shared page typography (Lede / Mono) + RTL made required',
    summary: 'Section intros now use a shared <Lede> primitive and inline code refs a <Mono> primitive (both from @/ds/core), unified onto the existing .ds-caption scale — no more hand-rolled font sizes per page. docs/DS-PAGE-STANDARD.md §3.5 codifies the type scale against the --text-* tokens and §3.6 makes the RTL section required; the component-page / new-component / new-page skills were rewritten to the current migrated-TSX architecture.' },
  { version: 'v1.13.0', date: '2026-05-22', type: 'feat', scope: 'navigations', title: 'Top Navigation — Installation section + canonical order',
    summary: 'Top Navigation gained an Installation (import) section and now follows the canonical template order Installation → Usage → Examples → Accessibility → RTL → Spacing → Anatomy → Do/Don\'t → API, with every example in a Frame (preview + React Native code) and a measured Spacing table.' },

  // ─── v1.12.0 — Catalogue restructure + Top Navigation rebuilt (2026-05-22) ──────
  { version: 'v1.12.0', date: '2026-05-22', type: 'feat', scope: 'navigations', title: 'Top Navigation rebuilt from the LINE LDSG model',
    summary: 'A proper Top Navigation: Container · Left icon area · flexible Title area · Right icon area, over a per-platform status bar. Covers Full-flex (Main Window) and Sub Window families; iOS centres the title and pairs back + home, Android left-aligns it with inline overflow actions. Title area is text / logo / none and truncates; left/right close (icon or text button, min-width 75); the close action is "required". 12px edge / 16px glyph / 20px before a left title; 24px icons. Examples render in a new top-slice phone preview (status bar + bar), not the whole device. Replaces the old App bar.' },
  { version: 'v1.12.0', date: '2026-05-22', type: 'feat', scope: 'device-frame', title: 'StatusBar + PhoneTop primitives',
    summary: 'A reusable StatusBar that adapts per platform — iOS shows a heavier clock with filled signal/wifi and a rounded battery; Android a lighter clock and outline battery — with the time, signal, wifi and battery glyphs drawn and aligned by hand. PhoneTop renders just the upper slice of a handset (rounded top, camera cutout, status bar) so top-anchored components show larger.' },
  { version: 'v1.12.0', date: '2026-05-22', type: 'docs', scope: 'mobile', title: 'Catalogue regrouped into six sections; 15 components scaffolded',
    summary: 'The sidebar is now six Line-style sections — Buttons, Contents, Indicators, Inputs, Navigations, Overlays. Newly named components (Action Button, Icon Button, Tag, Image Grid, Video Player, Page Controller, Page Indicator, Checkbox, Radio Button, Text Area, Pulldown, Expanded Tab List, Footer, Snackbar, Tooltip) are scaffolded as title-only placeholders to build next. Selection split into Checkbox + Radio; existing pages re-labelled to their canonical names (Tab bar → Bottom Navigation, Filter chips → Chip, Text field → Text Input, Dialog → Popup, …).' },

  // ─── v1.11.0 — 15 new components + Line-style nav (2026-05-22) ──────
  { version: 'v1.11.0', date: '2026-05-22', type: 'feat', scope: 'mobile', title: '15 new components — forms, overlays, navigation, status',
    summary: 'Eidos Mobile roughly doubles to 26 components, inspired by the LINE Design System catalogue but resolved in Eidos tokens and the page standard. Inputs: Switch, Selection (checkbox + radio), Text field, Stepper, Slider. Overlays & feedback: Dialog (blocking confirm), Action sheet (bottom verb list), Menu (anchored popover), Progress (linear + circular), Skeleton (shimmer placeholders). Navigation: Tabs (scrollable, sliding underline), Navigation drawer (edge panel + scrim). Content: Avatar (initials/icon/presence/stack), Badge (dot + count). Gestures & actions: Floating action button. Every page ships the full template — Usage in a DeviceFrame, visual Anatomy, Accessibility (44px, roles, contrast, reduced motion), Do/Don\'t, Spec — and honours the contrast invariant (dark ink on every ember fill).' },
  { version: 'v1.11.0', date: '2026-05-22', type: 'docs', scope: 'mobile', title: 'Components nav regrouped Line-style',
    summary: 'The single Mobile “Components” group split into five domain groups — Inputs, Navigation, Content, Overlays & feedback, Gestures & actions — so the growing catalogue reads as organised rather than one long list. Existing components moved into their domains; sidebar order and breadcrumbs updated.' },

  // ─── v1.10.0 — Page standard (2026-05-22) ──────
  { version: 'v1.10.0', date: '2026-05-22', type: 'docs', scope: 'mobile', title: 'Every component page brought to the full template',
    summary: 'The 11 Mobile component pages (app-bar, tab-bar, search, chips, list, cards, segmented, sheet, swipe, pull-refresh, toast) went from a single demo to the full standard: Usage → Anatomy → Accessibility → Do/Don\'t → Spec. Anatomy is now visual (a compact instance of the component with numbered pins + legend), and Accessibility covers 44px targets, VoiceOver/TalkBack roles, a non-gesture fallback for swipe/pull-to-refresh, and reduced motion.' },

  // ─── v1.9.2 — Mobile Foundations (2026-05-21) ──────
  { version: 'v1.9.2', date: '2026-05-21', type: 'feat', scope: 'foundations', title: 'Mobile Foundations — Typography, Layout, Grid',
    summary: 'The Mobile DS got its own Foundations group (mirroring core: Get Started → Foundations → Components). Typography documents an 8-role mobile scale (Large title 30 → Caption 12; body never below 16px). Layout covers safe-area insets (50 top / 34 bottom), 16px side margins, 12px card gap, 44px touch targets, with an annotated DeviceFrame. Grid defines a 4-column grid (16px margins + gutters) with full / half / third spans.' },

  // ─── v1.9.1 — Feed + gesture components (2026-05-21) ──────
  { version: 'v1.9.1', date: '2026-05-21', type: 'feat', scope: 'screens', title: 'Example screens redesigned — Board + Activity',
    summary: 'Reference-grade full screens: a task Board (starred New / Completed columns, an urgent card with metric tiles + assignee avatars) and an Activity feed (grouped Today/Yesterday, avatar + status pill + body + timestamp). Real mobile type (30px titles, 19px section heads, 15–16px body); cards lift on --surface with --elev-1 over the --bg canvas.' },
  { version: 'v1.9.1', date: '2026-05-21', type: 'fix', scope: 'device-frame', title: 'Mobile cards lift off the canvas',
    summary: 'Cards inside a DeviceFrame screen now carry --elev-1 so they read as floating panels over the --bg canvas (like a native app), instead of flat fills.' },

  { version: 'v1.9.1', date: '2026-05-21', type: 'feat', scope: 'cards', title: 'Cards — the mobile feed unit',
    summary: 'Full-width content cards stacked in one scroll: a KPI card (value + Trend + sparkline), a service card (icon + name + StatusDot health), and an incident card (severity pill + danger edge). One strong signal per card; the whole card is the tap target.' },
  { version: 'v1.9.1', date: '2026-05-21', type: 'feat', scope: 'swipe', title: 'Swipe actions — drag to reveal archive / delete',
    summary: 'A list row drags toward the inline-end to reveal trailing actions (archive quiet, delete danger), snapping open past the halfway point. Pointer-driven with a clamp; the destructive action stays last and tinted danger.' },
  { version: 'v1.9.1', date: '2026-05-21', type: 'feat', scope: 'pull-refresh', title: 'Pull to refresh',
    summary: 'Drag the list down from scrollTop 0 to reload — the indicator rotates with the pull, flips to ember at the threshold (Release to refresh), then spins (new reusable .ds-spin utility) while loading.' },

  // ─── v1.9.0 — Mobile launches as a sub-DS (2026-05-21) ──────
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'mobile', title: 'Eidos Mobile launched at /mobile',
    summary: 'A new touch-first sub-DS: the same token graph and ember, re-sized for the thumb — 44px targets, bottom-anchored navigation and actions, edge-to-edge sheets, safe-area aware. Previewed at true device dimensions.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'device-frame', title: 'DeviceFrame — true device dimensions + device picker',
    summary: 'Every mobile surface renders inside a DeviceFrame: real logical px (iPhone 15 Pro / 16 Pro Max / SE, Pixel 8, Galaxy S24) scaled to fit, with a header combobox to switch presets. A theme-adaptive bezel (light frame in light mode, dark in dark) with realistic black hardware — Dynamic Island + camera, punch-hole, home indicator. A `bare` mode hides the picker for static hero use.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'mobile', title: 'App bar, Tab bar, Search, Filter chips, List, Segmented, Bottom sheet, Toast',
    summary: 'Eight mobile components: a collapsing large-title App bar, a bottom Tab bar (3–5 destinations), a Search field (recents + live results), horizontal-scroll Filter chips, a grouped inset List, an iOS Segmented control, an edge-anchored Bottom sheet, and a Toast snackbar with Undo + auto-dismiss.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'screens', title: 'Example screens — full handsets',
    summary: 'A page composing complete screens inside the DeviceFrame: a Service detail (status bar + app bar + cards + tab bar) and an agent Chat, each on a different device.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'overview', title: 'Overview — a DeviceFrame in the hero',
    summary: 'Introduction-style Overview whose hero is a bare DeviceFrame, anchored to the top and bled to the hero’s bottom edge so the phone peeks in close — showing a real Services screen.' },
];

export default function MobileChangelog() {
  return (
    <ChangelogView
      entries={CHANGELOG}
      title="Changelog"
      desc="Every change to Eidos Mobile — searchable, filterable, scoped per component."
      dsName="Eidos Mobile"
    />
  );
}
