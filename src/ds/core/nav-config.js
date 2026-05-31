// Forge DS — navigation config (single source of truth).
//
// Every entry MUST have an `href` resolvable from the project root.
// At runtime, each HTML page sets <base href="..."> so these relative
// paths resolve correctly from any depth.
//
// Data shape
// ───────────────────────────────────────────────────────────────────────────
//   A group is either FLAT or NESTED.
//
//   FLAT   →  { group, items: [ { id, label, href }, ... ] }
//   NESTED →  { group, subgroups: [ { subgroup, items: [...] }, ... ] }
//
//   The shell renders sub-group titles smaller and dimmer than top-level
//   group titles, and the catalog page (pages/get-started/components.html)
//   groups tiles under each sub-section heading.
//
// To add a new page:
//   1. Pick the right (sub)group below — or add a new sub-group entry
//   2. Append { id, label, href } — `id` MUST match window.PAGE_SLUG in the page's HTML
//   3. Create the matching `assets/js/pages/<group>/<id>.jsx` and `pages/<group>/<id>.html`
//
(() => {
  // Single source of truth for the asset cache version. Bumped by
  // scripts/bump-version.sh in lockstep with all `?v=...` query strings
  // on page shells. Pages can read this at runtime if they need it
  // (e.g. for a "Build {VERSION}" footer).
  window.FORGE_VERSION = '20260517n';

  window.SECTIONS = {
    // No standalone "Home" — the Introduction (slug `overview`) is the project
    // entry surface (see design-system.html). Keep the array so .map() in the
    // shell still works without a guard.
    topItems: [],
    groups: [
      // Get Started — modeled on shadcn/ui's /docs landing. The Introduction
      // is the entry; Components is the full catalog (was the "Browse the
      // system" grid that used to live on Overview).
      { group: 'Get Started', items: [
        { id: 'overview',           label: 'Introduction',  href: 'design-system.html' },
        { id: 'installation',       label: 'Installation',  href: 'pages/get-started/installation.html' },
        { id: 'components-catalog', label: 'Components',    href: 'pages/get-started/components.html' },
        { id: 'theming',            label: 'Theming',       href: 'pages/get-started/theming.html' },
        { id: 'tailwind',           label: 'Tailwind',      href: 'pages/get-started/tailwind.html' },
        { id: 'rtl',                label: 'RTL',           href: 'pages/get-started/rtl.html',           badge: 'updated' },
        { id: 'llm',                label: 'LLM',           href: 'pages/get-started/llm.html' },
      ]},
      { group: 'Foundations', items: [
        { id: 'brand',       label: 'Brand',             href: 'pages/foundations/brand.html' },
        { id: 'color',       label: 'Color',             href: 'pages/foundations/color.html',          badge: 'updated' },
        { id: 'severity',    label: 'Severity & state',  href: 'pages/foundations/severity.html',       badge: 'new' },
        { id: 'typography',  label: 'Typography',        href: 'pages/foundations/typography.html' },
        { id: 'spacing',     label: 'Spacing & Radius',  href: 'pages/foundations/spacing.html',        badge: 'updated' },
        { id: 'shadows',     label: 'Elevation',         href: 'pages/foundations/shadows.html', badge: 'updated' },
        { id: 'iconography', label: 'Iconography',       href: 'pages/foundations/iconography.html', badge: 'updated' },
        { id: 'motion',      label: 'Motion',            href: 'pages/foundations/motion.html' },
        { id: 'focus-ring',  label: 'Focus Ring',        href: 'pages/foundations/focus-ring.html',     badge: 'new' },
      ]},
      // Components — nested. Sub-sections inspired by shadcn/ui's docs sidebar.
      // Items inside each sub-section are sorted alphabetically by label so
      // new entries can be dropped in without re-sequencing.
      { group: 'Components', subgroups: [
        { subgroup: 'Form & Input', items: [
          { id: 'buttons',       label: 'Button',             href: 'pages/components/buttons.html' },
          { id: 'button-group',  label: 'Button Group',       href: 'pages/components/button-group.html' },
          { id: 'calendar',      label: 'Calendar',           href: 'pages/components/calendar.html' },
          { id: 'checkbox',      label: 'Checkbox',           href: 'pages/components/checkbox.html' },
          { id: 'color-input',   label: 'Color Input',        href: 'pages/components/color-input.html' },
          { id: 'combobox',      label: 'Combobox',           href: 'pages/components/combobox.html' },
          { id: 'date-picker',   label: 'Date Picker',        href: 'pages/components/date-picker.html' },
          { id: 'file-input',    label: 'File Input',         href: 'pages/components/file-input.html' },
          { id: 'forms',         label: 'Form composition',   href: 'pages/components/forms.html' },
          { id: 'input',         label: 'Input',              href: 'pages/components/input.html' },
          { id: 'input-group',   label: 'Input Group',        href: 'pages/components/input-group.html' },
          { id: 'label',         label: 'Label',              href: 'pages/components/label.html' },
          { id: 'number-input',  label: 'Number Input',       href: 'pages/components/number-input.html' },
          { id: 'otp-input',     label: 'OTP Input',          href: 'pages/components/otp-input.html' },
          { id: 'pills',         label: 'Pill',               href: 'pages/components/pills.html',          badge: 'updated' },
          { id: 'chip',          label: 'Chip',               href: 'pages/components/chip.html',           badge: 'new' },
          { id: 'radio',         label: 'Radio Group',        href: 'pages/components/radio.html' },
          { id: 'select',        label: 'Select',             href: 'pages/components/select.html' },
          { id: 'slider',        label: 'Slider',             href: 'pages/components/slider.html' },
          { id: 'switch',        label: 'Switch',             href: 'pages/components/switch.html' },
          { id: 'tag-input',     label: 'Tag Input',          href: 'pages/components/tag-input.html' },
          { id: 'textarea',      label: 'Textarea',           href: 'pages/components/textarea.html' },
          { id: 'toolbar',       label: 'Toolbar',            href: 'pages/components/toolbar.html' },
        ]},
        { subgroup: 'Layout & Navigation', items: [
          { id: 'accordion',     label: 'Accordion',          href: 'pages/components/accordion.html' },
          { id: 'breadcrumb',    label: 'Breadcrumb',         href: 'pages/components/breadcrumb.html' },
          { id: 'navigation',    label: 'Navigation Menu',    href: 'pages/components/navigation.html' },
          { id: 'resizable',     label: 'Resizable',          href: 'pages/components/resizable.html' },
          { id: 'scroll-area',   label: 'Scroll Area',        href: 'pages/components/scroll-area.html' },
          { id: 'separator',     label: 'Separator',          href: 'pages/components/separator.html' },
          { id: 'sidebar',       label: 'Sidebar',            href: 'pages/components/sidebar.html' },
          { id: 'tabs',          label: 'Tabs',               href: 'pages/components/tabs.html' },
        ]},
        { subgroup: 'Overlays & Dialogs', items: [
          { id: 'alert-dialog',  label: 'Alert Dialog',       href: 'pages/components/alert-dialog.html' },
          { id: 'command',       label: 'Command',            href: 'pages/components/command.html' },
          { id: 'drawer',        label: 'Drawer',             href: 'pages/components/drawer.html' },
          { id: 'menu',          label: 'Dropdown Menu',      href: 'pages/components/menu.html' },
          { id: 'hover-card',    label: 'Hover Card',         href: 'pages/components/hover-card.html' },
          { id: 'menubar',       label: 'Menubar',            href: 'pages/components/menubar.html' },
          { id: 'modal',         label: 'Modal',              href: 'pages/components/modal.html' },
          { id: 'popover',       label: 'Popover',            href: 'pages/components/popover.html' },
          { id: 'sidesheet',     label: 'Sidesheet',          href: 'pages/components/sidesheet.html',     badge: 'new' },
          { id: 'tooltips',      label: 'Tooltip',            href: 'pages/components/tooltips.html' },
        ]},
        { subgroup: 'Feedback & Status', items: [
          { id: 'alerts',        label: 'Alert',              href: 'pages/components/alerts.html' },
          { id: 'badges',        label: 'Badge',              href: 'pages/components/badges.html',         badge: 'updated' },
          { id: 'banner',        label: 'Banner',             href: 'pages/components/banner.html',         badge: 'new' },
          { id: 'empty',         label: 'Empty state',        href: 'pages/components/empty.html',          badge: 'updated' },
          { id: 'notification',  label: 'Notification',       href: 'pages/components/notification.html',   badge: 'updated' },
          { id: 'progress',      label: 'Progress',           href: 'pages/components/progress.html' },
          { id: 'skeleton',      label: 'Skeleton',           href: 'pages/components/skeleton.html' },
          { id: 'spinner',       label: 'Spinner',            href: 'pages/components/spinner.html' },
          { id: 'status-dot',    label: 'Status dot',         href: 'pages/components/status-dot.html',     badge: 'new' },
          { id: 'status',        label: 'Status & semantics', href: 'pages/components/status.html' },
          { id: 'trend',         label: 'Trend',              href: 'pages/components/trend.html',          badge: 'updated' },
        ]},
        // IDP blocks — mid-level compositions kept in Components.
        // Atoms-as-pill compositions (severity / health) moved to Elements.
        // Heatmap moved to Charts. Score/metric/service/agent/stat cards
        // moved to Elements.
        // (IDP Blocks moved to the Forge IDP design system.)
        { subgroup: 'Display & Media', items: [
          { id: 'aspect-ratio',  label: 'Aspect Ratio',       href: 'pages/components/aspect-ratio.html' },
          { id: 'avatars',       label: 'Avatar',             href: 'pages/components/avatars.html',        badge: 'updated' },
          { id: 'card',          label: 'Card',               href: 'pages/components/card.html' },
          { id: 'carousel',      label: 'Carousel',           href: 'pages/components/carousel.html' },
          { id: 'copy-chip',     label: 'Copy chip',          href: 'pages/components/copy-chip.html',      badge: 'new' },
          { id: 'count-up',      label: 'Count up',           href: 'pages/components/count-up.html',       badge: 'new' },
          { id: 'data',          label: 'Data Display',       href: 'pages/components/data.html' },
          { id: 'kbd',           label: 'Kbd',                href: 'pages/components/kbd.html',            badge: 'updated' },
          { id: 'relative-time', label: 'Relative time',      href: 'pages/components/relative-time.html',  badge: 'updated' },
          { id: 'surfaces',      label: 'Surfaces',           href: 'pages/components/surfaces.html' },
          { id: 'table',         label: 'Table',              href: 'pages/components/table.html',          badge: 'updated' },
        ]},
        { subgroup: 'Misc', items: [
          { id: 'collapsible',   label: 'Collapsible',        href: 'pages/components/collapsible.html' },
          { id: 'pagination',    label: 'Pagination',         href: 'pages/components/pagination.html' },
          { id: 'toggle',        label: 'Toggle',             href: 'pages/components/toggle.html' },
          { id: 'toggle-group',  label: 'Toggle Group',       href: 'pages/components/toggle-group.html' },
        ]},
      ]},
      // Charts — Recharts-powered visualisations, themed with Forge tokens.
      // Each page is a thin wrapper over a Recharts primitive plus 2-4
      // variants. Heatmap was moved here from IDP Blocks (it's a chart, not
      // a workflow primitive).
      // Charts DS — migrated to /charts/<slug> (local ids; files in migrated/charts/).
      { group: 'Charts', items: [
        { id: 'overview',  label: 'Overview',       href: 'pages/charts/overview.html',  badge: 'new' },
        { id: 'colors',    label: 'Colors',         href: 'pages/charts/colors.html',    badge: 'new' },
        { id: 'area',      label: 'Area chart',     href: 'pages/charts/area.html',      badge: 'new' },
        { id: 'bar',       label: 'Bar chart',      href: 'pages/charts/bar.html',       badge: 'new' },
        { id: 'composed',  label: 'Composed chart', href: 'pages/charts/composed.html',  badge: 'new' },
        { id: 'gauge',     label: 'Gauge chart',    href: 'pages/charts/gauge.html',     badge: 'new' },
        { id: 'heatmap',   label: 'Heatmap',        href: 'pages/charts/heatmap.html',   badge: 'new' },
        { id: 'histogram', label: 'Histogram',      href: 'pages/charts/histogram.html', badge: 'new' },
        { id: 'line',      label: 'Line chart',     href: 'pages/charts/line.html',      badge: 'new' },
        { id: 'pie',       label: 'Pie chart',      href: 'pages/charts/pie.html',       badge: 'new' },
        { id: 'radar',     label: 'Radar chart',    href: 'pages/charts/radar.html',     badge: 'new' },
        { id: 'radial',    label: 'Radial chart',   href: 'pages/charts/radial.html',    badge: 'new' },
        { id: 'sankey',    label: 'Sankey diagram', href: 'pages/charts/sankey.html',    badge: 'new' },
      ]},
      // Elements — composições IDP construídas inteiramente a partir de
      // primitives existentes (Pill, Card, Avatar, Trend, Sparkline, StatusDot,
      // ScoreGauge…). NÃO são componentes novos; são "recipes" prontos.
      // IDP DS — Elements (platform recipes) + Blocks, at /idp/<slug>.
      { group: 'Elements', items: [
        { id: 'overview',     label: 'Overview',     href: 'pages/elements/overview.html',     badge: 'updated' },
        { id: 'agent-card',   label: 'Agent card',   href: 'pages/elements/agent-card.html',   badge: 'new' },
        { id: 'metric-card',  label: 'Metric card',  href: 'pages/elements/metric-card.html',  badge: 'new' },
        { id: 'score-gauge',  label: 'Score gauge',  href: 'pages/elements/score-gauge.html',  badge: 'new' },
        { id: 'service-card', label: 'Service card', href: 'pages/elements/service-card.html', badge: 'new' },
      ]},
      // Forge Blocks DS — generic page-level sections (hero/page-headers moved from IDP).
      { group: 'Blocks', ds: 'blocks', items: [
        { id: 'overview',      label: 'Overview',      href: 'pages/blocks/overview.html',      badge: 'new' },
        { id: 'hero',          label: 'Hero',          href: 'pages/blocks/hero.html',          badge: 'new' },
        { id: 'feature-grid',  label: 'Feature grid',  href: 'pages/blocks/feature-grid.html',  badge: 'new' },
        { id: 'split-feature', label: 'Split feature', href: 'pages/blocks/split-feature.html', badge: 'new' },
        { id: 'cta-banner',    label: 'CTA banner',    href: 'pages/blocks/cta-banner.html',    badge: 'new' },
        { id: 'stat-band',     label: 'Stat band',     href: 'pages/blocks/stat-band.html',     badge: 'new' },
      ]},
      { group: 'Elements', ds: 'blocks', items: [
        { id: 'page-headers',  label: 'Page headers',  href: 'pages/blocks/page-headers.html',  badge: 'new' },
      ]},
      // IDP Blocks (platform-specific compositions).
      { group: 'Blocks', ds: 'idp', items: [
        { id: 'data-table',     label: 'Data table',     href: 'pages/idp/data-table.html',     badge: 'updated' },
        { id: 'diff-viewer',    label: 'Diff viewer',    href: 'pages/idp/diff-viewer.html',    badge: 'updated' },
        { id: 'filter-panel',   label: 'Filter panel',   href: 'pages/idp/filter-panel.html',   badge: 'new' },
        { id: 'json-inspector', label: 'JSON inspector', href: 'pages/idp/json-inspector.html', badge: 'new' },
        { id: 'log-viewer',     label: 'Log viewer',     href: 'pages/idp/log-viewer.html',     badge: 'updated' },
        { id: 'pipeline',       label: 'Pipeline',       href: 'pages/idp/pipeline.html',       badge: 'updated' },
        { id: 'ring-bar',       label: 'Ring bar',       href: 'pages/idp/ring-bar.html',       badge: 'updated' },
        { id: 'timeline',       label: 'Timeline',       href: 'pages/idp/timeline.html',       badge: 'updated' },
        { id: 'tree-view',      label: 'Tree view',      href: 'pages/idp/tree-view.html',      badge: 'updated' },
      ]},
      // AI — the surface a Forge product needs when it's wired to a model:
      // message threads, prompt entry, model reasoning traces, tool calls.
      // Built on top of the regular Components — every AI page composes
      // existing primitives (pill, btn, in-group, collapsible, surface).
      // AI DS — migrated to /ai/<slug> (local ids; files in migrated/ai/).
      { group: 'AI', items: [
        { id: 'overview',     label: 'Overview',     href: 'pages/ai/overview.html',     badge: 'new' },
        { id: 'message',      label: 'Message',      href: 'pages/ai/message.html',      badge: 'updated' },
        { id: 'conversation', label: 'Conversation', href: 'pages/ai/conversation.html', badge: 'updated' },
        { id: 'prompt-input', label: 'Prompt Input', href: 'pages/ai/prompt-input.html', badge: 'updated' },
        { id: 'streaming',    label: 'Streaming',    href: 'pages/ai/streaming.html',    badge: 'new' },
        { id: 'shimmer',      label: 'Shimmer',      href: 'pages/ai/shimmer.html',      badge: 'new' },
        { id: 'markdown',     label: 'Markdown',     href: 'pages/ai/markdown.html',     badge: 'updated' },
        { id: 'response',     label: 'Response',     href: 'pages/ai/response.html' },
        { id: 'code-block',   label: 'Code block',   href: 'pages/ai/code-block.html',   badge: 'new' },
        { id: 'mermaid',      label: 'Mermaid',      href: 'pages/ai/mermaid.html',      badge: 'new' },
        { id: 'math',         label: 'Math',         href: 'pages/ai/math.html',         badge: 'new' },
        { id: 'image',        label: 'Image',        href: 'pages/ai/image.html',        badge: 'new' },
        { id: 'cjk',          label: 'CJK',          href: 'pages/ai/cjk.html',          badge: 'new' },
        { id: 'reasoning',    label: 'Reasoning',     href: 'pages/ai/reasoning.html',       badge: 'updated' },
        { id: 'chain-of-thought', label: 'Chain of Thought', href: 'pages/ai/chain-of-thought.html', badge: 'new' },
        { id: 'tool',         label: 'Tool',          href: 'pages/ai/tool.html',            badge: 'updated' },
        { id: 'agents',       label: 'Agent',         href: 'pages/ai/agents.html',          badge: 'updated' },
        { id: 'plan',         label: 'Plan',          href: 'pages/ai/plan.html',            badge: 'new' },
        { id: 'task',         label: 'Task',          href: 'pages/ai/task.html',            badge: 'new' },
        { id: 'checkpoint',   label: 'Checkpoint',    href: 'pages/ai/checkpoint.html',      badge: 'new' },
        { id: 'confirmation', label: 'Confirmation',  href: 'pages/ai/confirmation.html',    badge: 'new' },
        { id: 'ask',          label: 'Ask',           href: 'pages/ai/ask.html',             badge: 'new' },
        { id: 'queue',        label: 'Queue',         href: 'pages/ai/queue.html',           badge: 'new' },
        { id: 'model-selector', label: 'Model Selector', href: 'pages/ai/model-selector.html', badge: 'new' },
        { id: 'contexts',     label: 'Contexts',      href: 'pages/ai/contexts.html',        badge: 'new' },
        { id: 'citations',    label: 'Citations',     href: 'pages/ai/citations.html',       badge: 'updated' },
        { id: 'sources',      label: 'Sources',       href: 'pages/ai/sources.html',         badge: 'new' },
        { id: 'errors',       label: 'Errors',        href: 'pages/ai/errors.html' },
        { id: 'history',      label: 'History',       href: 'pages/ai/history.html' },
        { id: 'suggestion',   label: 'Suggestion',    href: 'pages/ai/suggestion.html' },
        { id: 'label',        label: 'AI Label',      href: 'pages/ai/label.html',           badge: 'updated' },
        { id: 'artifact',     label: 'Artifact',      href: 'pages/ai/artifact.html',        badge: 'new' },
        { id: 'jsx-preview',  label: 'JSX Preview',   href: 'pages/ai/jsx-preview.html',     badge: 'new' },
        { id: 'terminal',     label: 'Terminal',      href: 'pages/ai/terminal.html',        badge: 'new' },
        { id: 'persona',      label: 'Persona',       href: 'pages/ai/persona.html',         badge: 'new' },
        { id: 'speech-input', label: 'Speech Input',  href: 'pages/ai/speech-input.html',    badge: 'new' },
        { id: 'transcription',label: 'Transcription', href: 'pages/ai/transcription.html',   badge: 'new' },
        { id: 'audio-player', label: 'Audio Player',  href: 'pages/ai/audio-player.html',    badge: 'new' },
      ]},
      // Patterns — visual effects and decorative surfaces. NÃO são shells
      // page-level — page-level shells viraram Examples; compositions de seção
      // viraram Elements; overlays viraram Components. Aqui ficam apenas as
      // texturas e adornos que melhoram o visual de outros componentes.
      // Patterns DS — migrated to /patterns/<slug> (local ids; files in migrated/patterns/).
      { group: 'Patterns', items: [
        { id: 'overview',        label: 'Overview',         href: 'pages/patterns/overview.html',        badge: 'new' },
        { id: 'dot-grid',        label: 'Dot grid',         href: 'pages/patterns/dot-grid.html',        badge: 'new' },
        { id: 'linear-grid',     label: 'Linear grid',      href: 'pages/patterns/linear-grid.html',     badge: 'new' },
        { id: 'mesh-gradient',   label: 'Mesh gradient',    href: 'pages/patterns/mesh-gradient.html',   badge: 'new' },
        { id: 'conic-orb',       label: 'Conic orb',        href: 'pages/patterns/conic-orb.html',       badge: 'new' },
        { id: 'radial-spotlight',label: 'Radial spotlight', href: 'pages/patterns/radial-spotlight.html', badge: 'new' },
        { id: 'noise-grain',     label: 'Noise grain',      href: 'pages/patterns/noise-grain.html',     badge: 'new' },
        { id: 'ember-glow',      label: 'Ember glow',       href: 'pages/patterns/ember-glow.html',      badge: 'new' },
        { id: 'gradient-border', label: 'Gradient border',  href: 'pages/patterns/gradient-border.html', badge: 'new' },
      ]},
      // Mobile DS — touch-first surfaces. Scaffold: composes the same tokens/primitives
      // sized and spaced for handsets. Migrated to /mobile/<slug> (files in migrated/mobile/).
      { group: 'Get Started', ds: 'mobile', items: [
        { id: 'overview',  label: 'Overview',          href: 'pages/mobile/overview.html',  badge: 'new' },
      ]},
      { group: 'Foundations', ds: 'mobile', items: [
        { id: 'typography', label: 'Typography',       href: 'pages/mobile/typography.html', badge: 'new' },
        { id: 'layout',     label: 'Layout',           href: 'pages/mobile/layout.html',     badge: 'new' },
        { id: 'grid',       label: 'Grid',             href: 'pages/mobile/grid.html',       badge: 'new' },
      ]},
      // Mobile components — six Line-style sections (Buttons / Contents / Indicators /
      // Inputs / Navigations / Overlays). Existing pages keep their slug for now and are
      // re-labelled to the canonical name; each slug is finalised when its component is
      // rebuilt. Tokens + ember accent + contrast rules always come from core.
      { group: 'Buttons', ds: 'mobile', items: [
        { id: 'action-button',           label: 'Action Button',           href: 'pages/mobile/action-button.html',           badge: 'soon' },
        { id: 'fab',                      label: 'Floating Action Button',  href: 'pages/mobile/fab.html',                     badge: 'new' },
        { id: 'icon-button',              label: 'Icon Button',             href: 'pages/mobile/icon-button.html',             badge: 'soon' },
      ]},
      { group: 'Contents', ds: 'mobile', items: [
        { id: 'avatar',                   label: 'Avatar',                  href: 'pages/mobile/avatar.html',                  badge: 'new' },
        { id: 'tag',                      label: 'Tag',                     href: 'pages/mobile/tag.html',                     badge: 'soon' },
        { id: 'image-grid',               label: 'Image Grid',              href: 'pages/mobile/image-grid.html',              badge: 'soon' },
        { id: 'skeleton',                 label: 'Skeleton',                href: 'pages/mobile/skeleton.html',                badge: 'new' },
        { id: 'video-player',             label: 'Video Player',            href: 'pages/mobile/video-player.html',            badge: 'soon' },
        { id: 'cards',                    label: 'Cards',                   href: 'pages/mobile/cards.html',                   badge: 'new' },
        { id: 'list',                     label: 'List',                    href: 'pages/mobile/list.html',                    badge: 'new' },
        { id: 'swipe',                    label: 'Swipe Actions',           href: 'pages/mobile/swipe.html',                   badge: 'new' },
        { id: 'pull-refresh',             label: 'Pull to Refresh',         href: 'pages/mobile/pull-refresh.html',            badge: 'new' },
      ]},
      { group: 'Indicators', ds: 'mobile', items: [
        { id: 'badge',                    label: 'Badge',                   href: 'pages/mobile/badge.html',                   badge: 'new' },
        { id: 'page-controller',          label: 'Page Controller',         href: 'pages/mobile/page-controller.html',         badge: 'soon' },
        { id: 'page-indicator',           label: 'Page Indicator',          href: 'pages/mobile/page-indicator.html',          badge: 'soon' },
        { id: 'progress',                 label: 'Progress Indicator',      href: 'pages/mobile/progress.html',                badge: 'new' },
      ]},
      { group: 'Inputs', ds: 'mobile', items: [
        { id: 'checkbox',                 label: 'Checkbox',                href: 'pages/mobile/checkbox.html',                badge: 'soon' },
        { id: 'chips',                    label: 'Chip',                    href: 'pages/mobile/chips.html',                   badge: 'new' },
        { id: 'radio',                    label: 'Radio Button',            href: 'pages/mobile/radio.html',                   badge: 'soon' },
        { id: 'slider',                   label: 'Slider',                  href: 'pages/mobile/slider.html',                  badge: 'new' },
        { id: 'stepper',                  label: 'Stepper',                 href: 'pages/mobile/stepper.html',                 badge: 'new' },
        { id: 'switch',                   label: 'Switch',                  href: 'pages/mobile/switch.html',                  badge: 'new' },
        { id: 'text-area',                label: 'Text Area',               href: 'pages/mobile/text-area.html',               badge: 'soon' },
        { id: 'text-field',               label: 'Text Input',              href: 'pages/mobile/text-field.html',              badge: 'new' },
        { id: 'pulldown',                 label: 'Pulldown',                href: 'pages/mobile/pulldown.html',                badge: 'soon' },
        { id: 'search',                   label: 'Search',                  href: 'pages/mobile/search.html',                  badge: 'new' },
      ]},
      { group: 'Navigations', ds: 'mobile', items: [
        { id: 'top-navigation',           label: 'Top Navigation',          href: 'pages/mobile/top-navigation.html',          badge: 'updated' },
        { id: 'tab-bar',                  label: 'Bottom Navigation',       href: 'pages/mobile/tab-bar.html',                 badge: 'new' },
        { id: 'tabs',                     label: 'Tab',                     href: 'pages/mobile/tabs.html',                    badge: 'new' },
        { id: 'expanded-tab-list',        label: 'Expanded Tab List',       href: 'pages/mobile/expanded-tab-list.html',       badge: 'soon' },
        { id: 'segmented',                label: 'Segmented Control',       href: 'pages/mobile/segmented.html',               badge: 'new' },
        { id: 'drawer',                   label: 'Slider Drawer',           href: 'pages/mobile/drawer.html',                  badge: 'new' },
        { id: 'footer',                   label: 'Footer',                  href: 'pages/mobile/footer.html',                  badge: 'soon' },
      ]},
      { group: 'Overlays', ds: 'mobile', items: [
        { id: 'dialog',                   label: 'Popup',                   href: 'pages/mobile/dialog.html',                  badge: 'new' },
        { id: 'snackbar',                 label: 'Snackbar',                href: 'pages/mobile/snackbar.html',                badge: 'soon' },
        { id: 'toast',                    label: 'Toast Overlay',           href: 'pages/mobile/toast.html',                   badge: 'new' },
        { id: 'tooltip',                  label: 'Tooltip',                 href: 'pages/mobile/tooltip.html',                 badge: 'soon' },
        { id: 'sheet',                    label: 'Bottom Sheet',            href: 'pages/mobile/sheet.html',                   badge: 'new' },
        { id: 'menu',                     label: 'Pulldown Menu',           href: 'pages/mobile/menu.html',                    badge: 'new' },
        { id: 'action-sheet',             label: 'Action Sheet',            href: 'pages/mobile/action-sheet.html',            badge: 'new' },
      ]},
      { group: 'Example screens', ds: 'mobile', items: [
        { id: 'screens',   label: 'Example screens',   href: 'pages/mobile/screens.html',   badge: 'new' },
      ]},
      // Examples — full-product screens assembled exclusively from existing
      // Forge components. Each entry is a STANDALONE page (no DS shell) that
      // simulates the Forge IDP. Marked `external: true` so the shell opens
      // them in a new tab — the engineer returns to the DS manually.
      // AI examples (standalone screens) — belong to the AI DS.
      { group: 'Examples', ds: 'ai', items: [
        { id: 'ex-ai-chat',           label: 'AI Chat',                href: 'pages/examples/ai-chat.html',           external: true, badge: 'updated' },
        { id: 'ex-ai-chat-active',    label: 'AI Chat · Active thread', href: 'pages/examples/ai-chat-active.html',   external: true, badge: 'new' },
        { id: 'ex-ai-chat-search',    label: 'AI Chat · Search',       href: 'pages/examples/ai-chat-search.html',    external: true, badge: 'new' },
        { id: 'ex-ai-chat-artifacts', label: 'AI Chat · Artifacts',    href: 'pages/examples/ai-chat-artifacts.html', external: true, badge: 'new' },
        { id: 'ex-ai-projects',       label: 'AI · Projects',          href: 'pages/examples/ai-projects.html',       external: true, badge: 'updated' },
        { id: 'ex-ai-project-detail', label: 'AI · Project detail',    href: 'pages/examples/ai-project-detail.html', external: true, badge: 'updated' },
        { id: 'ex-ai-chat-empty',     label: 'AI · New chat (v1)',     href: 'pages/examples/ai-chat-empty.html',     external: true },
        { id: 'ex-ai-chat-thread',    label: 'AI · Chat thread (v1)',  href: 'pages/examples/ai-chat-thread.html',    external: true },
        { id: 'ex-ai-insights',     label: 'AI Insights',         href: 'pages/examples/ai-insights.html',     external: true, badge: 'new' },
        { id: 'ex-agent-chat',      label: 'Agent Chat',          href: 'pages/examples/agent-chat.html',      external: true, badge: 'new' },
        { id: 'ex-agent-catalog',   label: 'Agent Catalog',       href: 'pages/examples/agent-catalog.html',   external: true, badge: 'new' },
        { id: 'ex-mcp-detail',      label: 'MCP Server Detail',   href: 'pages/examples/mcp-detail.html',      external: true, badge: 'new' },
      ]},
      // IDP examples (standalone screens) — belong to the IDP DS.
      { group: 'Examples', ds: 'idp', items: [
        { id: 'ex-cloud-inventory', label: 'Cloud Inventory',     href: 'pages/examples/cloud-inventory.html', external: true, badge: 'new' },
        { id: 'ex-dora-dashboard',  label: 'DORA Dashboard',      href: 'pages/examples/dora-dashboard.html',  external: true, badge: 'new' },
        { id: 'ex-feature-flags',   label: 'Feature Flags',       href: 'pages/examples/feature-flags.html',   external: true, badge: 'new' },
        { id: 'ex-incident-room',   label: 'Incident Room',       href: 'pages/examples/incident-room.html',   external: true, badge: 'new' },
        { id: 'ex-pipeline-console', label: 'Pipeline Console',   href: 'pages/examples/pipeline-console.html', external: true, badge: 'new' },
        { id: 'ex-pipeline-view',   label: 'Pipeline View',       href: 'pages/examples/pipeline-view.html',   external: true, badge: 'new' },
        { id: 'ex-quality-gates',   label: 'Quality Gates',       href: 'pages/examples/quality-gates.html',   external: true, badge: 'new' },
        { id: 'ex-ring-deployment', label: 'Ring Deployment',     href: 'pages/examples/ring-deployment.html', external: true, badge: 'new' },
        { id: 'ex-score-cards',     label: 'Score Cards',         href: 'pages/examples/score-cards.html',     external: true, badge: 'new' },
        { id: 'ex-service-catalog', label: 'Service Catalog',     href: 'pages/examples/service-catalog.html', external: true, badge: 'new' },
        { id: 'ex-service-detail',  label: 'Service Detail',      href: 'pages/examples/service-detail.html',  external: true, badge: 'new' },
        { id: 'ex-service-scaffold', label: 'Service Scaffold',   href: 'pages/examples/service-scaffold.html', external: true, badge: 'new' },
        { id: 'ex-templates',       label: 'Templates Gallery',   href: 'pages/examples/templates.html',       external: true, badge: 'new' },
      ]},
      { group: 'Resources', items: [
        { id: 'a11y',      label: 'Accessibility', href: 'pages/resources/a11y.html',      badge: 'updated' },
        { id: 'changelog', label: 'Changelog',     href: 'pages/resources/changelog.html', badge: 'updated' },
      ]},
      // Per-sub-DS changelogs — same ChangelogView, scoped to each DS's history.
      { group: 'Resources', ds: 'charts',   items: [ { id: 'changelog', label: 'Changelog', href: 'pages/charts/changelog.html',   badge: 'new' } ]},
      { group: 'Resources', ds: 'ai',       items: [ { id: 'changelog', label: 'Changelog', href: 'pages/ai/changelog.html',       badge: 'new' } ]},
      { group: 'Resources', ds: 'idp',      items: [ { id: 'changelog', label: 'Changelog', href: 'pages/idp/changelog.html',      badge: 'new' } ]},
      { group: 'Resources', ds: 'blocks',   items: [ { id: 'changelog', label: 'Changelog', href: 'pages/blocks/changelog.html',   badge: 'new' } ]},
      { group: 'Resources', ds: 'patterns', items: [ { id: 'changelog', label: 'Changelog', href: 'pages/patterns/changelog.html', badge: 'new' } ]},
      { group: 'Resources', ds: 'mobile',   items: [ { id: 'changelog', label: 'Changelog', href: 'pages/mobile/changelog.html',   badge: 'new' } ]},
    ],
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────
  // walk(): iterate every leaf item, yielding { ...item, group, subgroup? }.
  // Sub-groups in nested groups inherit the parent group name and add a
  // `subgroup` field; flat groups have subgroup === null.
  window.SECTIONS.walk = function* walk() {
    for (const it of window.SECTIONS.topItems) {
      yield { ...it, group: null, subgroup: null };
    }
    for (const g of window.SECTIONS.groups) {
      if (g.subgroups) {
        for (const sg of g.subgroups) {
          for (const it of sg.items) {
            yield { ...it, group: g.group, subgroup: sg.subgroup };
          }
        }
      } else if (g.items) {
        for (const it of g.items) {
          yield { ...it, group: g.group, subgroup: null };
        }
      }
    }
  };

  // Flat lookup helper: id → { id, label, href, group, subgroup }.
  // Used by the shell to resolve PAGE_SLUG → breadcrumb + active state.
  window.SECTIONS.flat = (() => {
    const out = {};
    for (const it of window.SECTIONS.walk()) out[it.id] = it;
    return out;
  })();

  // Convenience accessor: total number of pages across every group.
  // Used by the catalog page to render a single "NN pages" stat.
  window.SECTIONS.totalCount = () => {
    let n = 0;
    for (const _ of window.SECTIONS.walk()) n++;
    return n;
  };
})();
