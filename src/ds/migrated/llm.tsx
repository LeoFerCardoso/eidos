'use client';
import { Icons, Section, SubHead, CodeBlock, Lede } from '@/ds/core';

// ─── llms.txt content ────────────────────────────────────────────────────
// This is the canonical short-form index. Mirrors shadcn/ui's pattern:
// a markdown-shaped, link-first catalog with one-line descriptions. Keep
// it terse — descriptions must fit on one wrapped line in a 1024-token
// context window. Long-form lives in FORGE-DS-REFERENCE.md.
const LLMS_TXT = `# Forge Design System

> Forge is the design system that powers Equifax/Boa Vista's internal developer platform. It's CSS-first (Tailwind v4 + token CSS variables), framework-agnostic at the class layer, and ships React reference components meant to be copy-pasted into product code. There is no npm package to install — own your copy of every component.

## Principles

- One accent: ember (#FF6B35). Use at most twice per screen.
- Compose existing classes and components. Never reinvent something that already lives in tokens.css / ds.css.
- Logical CSS properties everywhere (inset-inline-*, padding-inline-*, margin-inline-*). RTL is a first-class requirement, not an after-thought.
- Tokens live in packages/ui/styles/tokens.css; component classes live in packages/ui/styles/ds.css (AI surfaces in ai.css). No per-page style blocks — compose existing classes or extend those stylesheets.
- The React core is the @forge/ui package (icons → atoms → primitives → blocks → charts → device → drawer → ai). It is a plain ES-module barrel with no load-order side effects and no window globals; pages import their primitives from '@/ds/core', which re-exports @forge/ui plus the docs-shell wrappers.

## Files an LLM should read first

- /CLAUDE.md — TL;DR authoring rules (read on every session start).
- /FORGE-DS-REFERENCE.md — long-form catalog (tokens, every CSS class, every React component, every icon, every page). ~920 lines.
- /src/ds/core/nav-config.js — single source of truth for navigation, slugs, and labels (read by scripts/gen-nav.mjs → src/lib/nav.ts).
- /packages/ui/styles/tokens.css — every design token (colors, type, spacing, radius, shadow, motion).
- /packages/ui/styles/ds.css — every component class (.btn, .pill, .surface, .in-*, .fc-*, .cb-*, .menu, .tt, .ds-frame, .ds-grid, …); AI-surface classes live in ai.css.

## Docs

- [Introduction](design-system.html): What Forge is, who maintains it, how it ships.
- [Installation](/installation): Tailwind v4 preset + React copy-paste workflow. No npm install.
- [Components catalog](/components-catalog): Searchable grid of every component with previews.
- [Theming](/theming): Light/dark via data-theme, custom accents via CSS variables.
- [Tailwind](/tailwind): Full @theme block (v4) plus tailwind.config.js (v3) presets.
- [RTL](/rtl): Logical-property cookbook and direction-aware overrides.

## Foundations

- [Brand](/brand): Flame mark, lockups, brand color rules, do/don't on logo usage.
- [Color](/color): Surface, foreground, ember, ice, violet, status palettes with usage matrix.
- [Severity & state](/severity): Mapping of info/success/warning/danger/critical onto tokens and pills.
- [Typography](/typography): Geist sans + Geist Mono, display-xl through mono-label scale.
- [Spacing & Radius](/spacing): 4px base scale; radius xs (3px) through 2xl (12px).
- [Shadows & Borders](/shadows): Elevation 1/2/3 + alpha border tokens.
- [Iconography](/iconography): 95+ icons exported as Icons from @forge/ui, 12–20px sizes, 1.5px stroke, currentColor.
- [Motion](/motion): cubic-bezier(0.16, 1, 0.3, 1) — durations fast (120ms), normal (220ms), slow (360ms).

## Components — Form & Input

- [AI Label](/ai/label): Pill marking AI-generated content with shimmer accent.
- [Button](/buttons): .btn — primary, ghost, ember variants; sizes sm / md / lg.
- [Button Group](/button-group): Segmented control of attached buttons.
- [Calendar](/calendar): Single-month grid; basis of Date Picker.
- [Checkbox](/checkbox): .fc-check chrome over an opacity-0 real input. Wrap label, don't htmlFor.
- [Color Input](/color-input): Hex/RGB picker with swatch preview.
- [Combobox](/combobox): .cb-* — fixed-positioned panel with search filter.
- [Date Picker](/date-picker): Input + calendar popover; supports single + range.
- [File Input](/file-input): Drop zone + chooser with file list and per-row remove.
- [Form composition](/forms): Full label + control + helper + error patterns.
- [Input](/input): .in-control sits inside .in-group; focus ring lives on the group.
- [Input Group](/input-group): Left/right addons — icon, text, button, select, spinner, stepper.
- [Label](/label): Semantic label tied to a control via id/htmlFor.
- [Number Input](/number-input): Input with stepper addon.
- [OTP Input](/otp-input): 4–8 digit one-time-passcode boxes.
- [Pills & Chips](/pills): .pill (status) and .chip (selectable).
- [Radio Group](/radio): .fc-radio chrome; exclusive selection.
- [Select](/select): Native + custom Select with .sel-search panel.
- [Slider](/slider): Single value + range with two thumbs.
- [Switch](/switch): .fc-toggle; thumb uses spring cubic-bezier(0.34, 1.56, 0.64, 1).
- [Tag Input](/tag-input): Comma / Enter–separated tags with backspace removal.
- [Textarea](/textarea): Multi-line input with optional auto-grow.
- [Toolbar](/toolbar): Horizontal action bar with dividers + icon buttons.

## Components — Layout & Navigation

- [Accordion](/accordion): Collapsible vertical sections.
- [Breadcrumb](/breadcrumb): Path with separators; collapses on overflow.
- [Navigation Menu](/navigation): Top-level horizontal nav with mega-menu panels.
- [Resizable](/resizable): Split panes with draggable handle.
- [Scroll Area](/scroll-area): Styled custom scrollbar wrapper.
- [Separator](/separator): Horizontal / vertical divider.
- [Sidebar](/sidebar): Left rail with groups + subgroups + collapsible sections.
- [Tabs](/tabs): Horizontal segmented tab bar.

## Components — Overlays & Dialogs

- [Alert Dialog](/alert-dialog): Confirmation modal for destructive actions.
- [Command](/command): ⌘K palette / fuzzy command runner.
- [Drawer](/drawer): Bottom sheet (mobile-first pattern).
- [Dropdown Menu](/menu): .menu primitive; also used by Menubar and Context menu.
- [Hover Card](/hover-card): On-hover persona / preview card.
- [Menubar](/menubar): Horizontal app menu bar (File / Edit / View).
- [Modal](/modal): Center dialog with backdrop + focus trap.
- [Popover](/popover): Anchored popover panel for non-trivial content.
- [Sidesheet](/sidesheet): Right-edge slide-in panel for detail views.
- [Tooltip](/tooltips): [data-tt="…"] attribute works on any element; no JS hookup needed.

## Components — Feedback & Status

- [Alert](/alerts): Inline contextual banner with icon + tone.
- [Badge](/badges): Small label (.badge); use for count / tag, not status.
- [Banner](/banner): Page-level dismissable announcement.
- [Empty state](/empty): Empty pattern with illustration + CTA.
- [Notification](/notification): Toast / snackbar (transient).
- [Progress](/progress): Linear + circular progress; determinate and indeterminate.
- [Skeleton](/skeleton): Loading placeholder shimmer.
- [Spinner](/spinner): Circular loading indicator.
- [Status dot](/status-dot): Small colored dot atom for state.
- [Status & semantics](/status): Token mapping for state colors.
- [Trend](/trend): Up/down delta number + sparkline mini-chart.

## Components — IDP Blocks

- [Data table](/idp/data-table): Sortable / filterable Equifax-style data grid.
- [Diff viewer](/idp/diff-viewer): Side-by-side or unified code diff.
- [Filter panel](/idp/filter-panel): Facet + range filter sidebar.
- [JSON inspector](/idp/json-inspector): Collapsible JSON tree.
- [Log viewer](/idp/log-viewer): Line-numbered terminal log with level coloring.
- [Pipeline](/idp/pipeline): Multi-stage CI/CD pipeline visualization.
- [Ring bar](/idp/ring-bar): Concentric rings for deploy waves / cohorts.
- [Timeline](/idp/timeline): Chronological event list with branched lanes.
- [Tree view](/idp/tree-view): Collapsible nested tree (file explorer style).

## Components — Display & Media

- [Aspect Ratio](/aspect-ratio): Fixed-ratio wrapper for images / videos.
- [Avatar](/avatars): Image, initials, with optional status dot.
- [Card](/card): Surface wrapper for content cells.
- [Carousel](/carousel): Horizontal scroller with scroll-snap; RTL-aware.
- [Copy chip](/copy-chip): Text + inline copy-to-clipboard button atom.
- [Count up](/count-up): Animated number increment on mount.
- [Data Display](/data): Definition list / key–value pairs.
- [Kbd](/kbd): Keyboard key / chord display (⌘K).
- [Relative time](/relative-time): "2 minutes ago" auto-updating atom.
- [Surfaces](/surfaces): bg / surface / border layering rules.
- [Table](/table): Base .tbl class — rows, headers, alignment, density.

## Components — Misc

- [Collapsible](/collapsible): Generic open / close section.
- [Pagination](/pagination): Page-by-page nav; also .sm compact variant.
- [Toggle](/toggle): Single on / off button (icon-only or labeled).
- [Toggle Group](/toggle-group): Exclusive or inclusive radio group of toggles.

## Charts

Recharts wrappers themed with Forge tokens — viz palette lives in tokens.css. Use only for data visualization; not for layout decoration.

- [Overview](/charts/overview): Palette, color order, and shared options for every chart.
- [Area chart](/charts/area): Filled time-series; supports stacked.
- [Bar chart](/charts/bar): Vertical / horizontal categorical bars.
- [Composed chart](/charts/composed): Bar + line + area combined on one axis.
- [Gauge chart](/charts/gauge): Half-ring percentage gauge.
- [Heatmap](/charts/heatmap): 2D matrix with intensity coloring.
- [Histogram](/charts/histogram): Distribution buckets.
- [Line chart](/charts/line): Time-series single / multi-series.
- [Pie chart](/charts/pie): Categorical share-of-total.
- [Radar chart](/charts/radar): Multi-axis polar plot.
- [Radial chart](/charts/radial): Concentric percent rings.
- [Sankey diagram](/charts/sankey): Flow between categories.

## Elements

"Recipe" compositions built entirely from existing primitives — Pill, Card, Avatar, Trend, Sparkline, StatusDot, ScoreGauge. NOT new components; copy as a starting point.

- [Overview](/idp/overview): Recipe catalog with previews.
- [Agent card](/idp/agent-card): AI agent profile tile (avatar + role + actions).
- [Hero](/idp/hero): Page hero — eyebrow + title + lede + CTA.
- [Metric card](/idp/metric-card): KPI + delta + sparkline.
- [Page headers](/idp/page-headers): Title + meta + actions row pattern.
- [Score gauge](/idp/score-gauge): Circular percentage score with grade letter.
- [Service card](/idp/service-card): IDP service tile with score / status / owner.

## AI

Surfaces a Forge product needs once it's wired to a model. Every page composes existing components (pill, btn, in-group, collapsible, surface) — no new primitives.

- [Citations](/ai/citations): Source citation pattern with hover preview.
- [Conversation](/ai/conversation): Full thread layout — header, scroll area, composer.
- [Errors](/ai/errors): Model error states (rate limit, timeout, refusal).
- [History](/ai/history): Past conversations sidebar.
- [Message](/ai/message): Single message bubble (user / assistant / system).
- [Prompt Input](/ai/prompt-input): Multi-line composer with attachments + actions.
- [Reasoning](/ai/reasoning): Collapsible thinking-trace block.
- [Response](/ai/response): Assistant response with copy / regenerate / feedback actions.
- [Suggestion](/ai/suggestion): Clickable prompt-suggestion chip.
- [Tool](/ai/tool): Tool-call display — input, output, status, duration.

## Patterns

Decorative surfaces and visual effects. Use to enhance other components, never as the primary content.

- [Dot grid](/patterns/dot-grid): Background dot lattice.
- [Linear grid](/patterns/linear-grid): Background line lattice.
- [Mesh gradient](/patterns/mesh-gradient): Soft multi-stop gradient blob.
- [Conic orb](/patterns/conic-orb): Conic gradient sphere.
- [Radial spotlight](/patterns/radial-spotlight): Radial highlight from a focal point.
- [Noise grain](/patterns/noise-grain): SVG-based grain overlay.
- [Ember glow](/patterns/ember-glow): Ember accent halo (for hero CTAs).
- [Gradient border](/patterns/gradient-border): Conic-mask animated border.

## Examples

Full-product screens assembled exclusively from existing components. Reference these before building anything new — odds are the layout already exists.

- [AI Chat](/example/ai-chat-empty): Empty-state AI chat thread.
- [AI · Chat thread](/example/ai-chat-thread): Populated AI conversation.
- [AI · Projects](/example/ai-projects): AI projects gallery.
- [AI · Project detail](/example/ai-project-detail): Single AI project page.
- [AI Insights](/example/ai-insights): AI-generated insights dashboard.
- [Agent Chat](/example/agent-chat): Agent conversation with tool calls.
- [Agent Catalog](/example/agent-catalog): Browse of available agents.
- [Cloud Inventory](/example/cloud-inventory): Asset inventory table.
- [DORA Dashboard](/example/dora-dashboard): DORA metrics overview.
- [Feature Flags](/example/feature-flags): Flag rollout management.
- [Incident Room](/example/incident-room): Active-incident war room.
- [MCP Server Detail](/example/mcp-detail): Single MCP server page.
- [Pipeline Console](/example/pipeline-console): Pipeline run dashboard.
- [Pipeline View](/example/pipeline-view): Single pipeline detail.
- [Quality Gates](/example/quality-gates): Gate configuration page.
- [Ring Deployment](/example/ring-deployment): Wave-based deploy progression.
- [Score Cards](/example/score-cards): Service score breakdown.
- [Service Catalog](/example/service-catalog): IDP service catalog grid.
- [Service Detail](/example/service-detail): Single service page.
- [Service Scaffold](/example/service-scaffold): New-service wizard.
- [Templates Gallery](/example/templates): Starter templates gallery.

## Resources

- [Accessibility](/a11y): Keyboard nav, focus rings, contrast targets.
- [Changelog](/changelog): Version history.

## Rules for code generation

1. Read this file + FORGE-DS-REFERENCE.md before writing any new page. Skipping that step produces drift from the system.
2. Compose. If something can be built from Pill + Card + Avatar + Trend, build it that way — don't invent a new class.
3. Never write a per-page <style> block. Use existing classes (.btn, .surface, .ds-frame, .ds-grid, .in-*, .fc-*, .cb-*, .menu, .tt, .pill, .chip, .badge, .avatar, .tbl) or extend tokens.css / ds.css.
4. Every component page must include: live demo Frame, Anatomy, Decision matrix, Do/Don't with live UI demos (not just text), and an RTL example. See src/ds/migrated/buttons.tsx as the canonical template.
5. Spacing rhythm: caption after Frame uses marginTop: 14 (positive). Lede after SubHead uses marginTop: -6 (negative — attaches lede to its heading; intentional). Consecutive Frames separate with .ds-frame + .ds-frame { margin-top: 18px }.
6. RTL: logical properties everywhere (inset-inline-*, padding-inline-*, margin-inline-*, border-inline-*, text-align: start). The only physical-property exception is transform: translateX(…) — that needs a [dir="rtl"] override.
7. Adding a new page is two coordinated changes: (1) append { id, label, href } to the right DS section in src/ds/core/nav-config.js; (2) create src/ds/migrated/<slug>.tsx (core) or src/ds/migrated/<ds>/<slug>.tsx (sub-DS) — a 'use client' module with a default export that imports its primitives from '@/ds/core'. The gen scripts (gen-nav / gen-migrated / gen-examples) auto-run on dev/build and regenerate src/lib/nav.ts + the MIGRATED registry. Restart next dev after nav/DS changes.
8. Version bumps live in one source of truth: DS_VERSION in src/lib/site.ts (the topbar VersionBadge reads it). Bump it there; the /release command also sweeps stale nav badges.
9. Pages are idiomatic TSX compiled by SWC — there is no .babelrc, no <script> tags, and no window bridge. Components are plain ES modules from @forge/ui (re-exported by '@/ds/core'); share nothing through globals.
10. Common gotchas: JSX text must stay SWC-valid — escape a literal > as {'>'}. Doubled focus ring → suppress on inner inputs with box-shadow: none !important. Dropdown clipped → .ds-frame has overflow: hidden; use position: fixed + getBoundingClientRect() to escape.
`;

// ─── Page component ──────────────────────────────────────────────────────
export default function LLM() {
  return (
    <Section
      id="llm"
      num="07"
      title="LLM"
      desc="A plain-text catalog of Forge for AI coding assistants. Drop it into Claude, Cursor, or ChatGPT to give the model an accurate picture of the system before it writes any code."
    >
      {/* What this is */}
      <SubHead meta="what">Why this file exists</SubHead>
      <Lede up>
        Large language models guess what&apos;s in your design system. They invent classes that don&apos;t exist, mix Material with Tailwind, and reach for purple gradients when your brand is ember. Forge solves this by publishing a short, link-first catalog that fits in the model&apos;s context window — every component, every token, every page, with a one-line description. Paste it once at the start of a session and the model has the same map you do.
      </Lede>

      {/* Files */}
      <SubHead meta="canonical">Two files to know</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 4}}>
        <div className="surface" style={{padding: 16, borderColor:'var(--ember-soft)'}}>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 6}}>
            <span className="pill ember"><span className="dot"/>short index</span>
            <span style={{fontSize: 'var(--text-md)', fontWeight: 600, fontFamily:'var(--font-mono)'}}>llms.txt</span>
          </div>
          <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>
            One-line description per page, grouped by section. <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>~250</span> lines. Fits in any context window. The whole file is shown below — copy it.
          </div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 6}}>
            <span className="pill"><span className="dot"/>full reference</span>
            <span style={{fontSize: 'var(--text-md)', fontWeight: 600, fontFamily:'var(--font-mono)'}}>FORGE-DS-REFERENCE.md</span>
          </div>
          <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>
            Long-form catalog — every token, every CSS class, every React export, every icon. <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>~920</span> lines. Use when the model needs to write component-level code, not just navigate.
          </div>
        </div>
      </div>

      {/* How to use it */}
      <SubHead meta="how">How to use it</SubHead>
      <Lede up>
        The file works in any tool that accepts text as system prompt or attachment. Three common patterns:
      </Lede>

      <div className="ds-grid cols-3" style={{marginTop: 4}}>
        <div className="surface" style={{padding: 16}}>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
            <Icons.terminal size={14} color="var(--fg-muted)"/>
            <span style={{fontSize: 'var(--text-base)', fontWeight: 600}}>Claude Code / Cursor</span>
          </div>
          <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>
            Both tools auto-read <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>CLAUDE.md</code> at session start. That file already points to <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>FORGE-DS-REFERENCE.md</code> — no extra step needed.
          </div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
            <Icons.copy size={14} color="var(--fg-muted)"/>
            <span style={{fontSize: 'var(--text-base)', fontWeight: 600}}>ChatGPT / Web Claude</span>
          </div>
          <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>
            Copy the block below and paste it as the first message of a new conversation, prefixed with &ldquo;Use this as the Forge DS context.&rdquo;
          </div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
            <Icons.link size={14} color="var(--fg-muted)"/>
            <span style={{fontSize: 'var(--text-base)', fontWeight: 600}}>API integrations</span>
          </div>
          <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>
            Fetch <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>forge-design-system/llms.txt</code> from the docs build and prepend it to the system prompt of every Forge-adjacent agent.
          </div>
        </div>
      </div>

      {/* Sample prompt */}
      <SubHead meta="recipe">Sample priming prompt</SubHead>
      <Lede up>
        Wrap the file in a short instruction so the model knows what to do with it. Anything that pins down &ldquo;compose, don&apos;t invent&rdquo; and &ldquo;match the conventions&rdquo; works.
      </Lede>
      <CodeBlock label="paste as first user message" lang="markdown" code={`You are helping me design and build UI for a Forge product. The text block below
is the full catalog of the Forge Design System — every component, every token,
every page, with a one-line description. Treat it as the source of truth.

Rules:
1. Compose what exists. If a UI can be built from Card + Pill + Avatar + Trend,
   build it that way. Never invent classes.
2. Use Forge tokens for color and type — ember (#FF6B35) is the only accent,
   used at most twice per screen.
3. Logical CSS properties only (inset-inline-*, padding-inline-*, etc).
4. Cite specific pages when relevant ("see /buttons").
5. If something is missing from the catalog, say so — don't fabricate it.

<<<FORGE-DS>>>
(paste the contents of llms.txt here)
<<<END FORGE-DS>>>`}/>

      {/* The actual file */}
      <SubHead meta="the file">llms.txt — full contents</SubHead>
      <Lede up>
        Click <code style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)', fontSize: 'var(--text-sm)'}}>Copy</code> on the frame below to grab the whole file. It&apos;s also served at <code style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)', fontSize: 'var(--text-sm)'}}>/forge-design-system/llms.txt</code> so you can curl it from a build script.
      </Lede>
      <CodeBlock label="forge-design-system/llms.txt" lang="markdown" code={LLMS_TXT}/>

      {/* Rules block */}
      <SubHead meta="ground rules">Conventions the model must follow</SubHead>
      <Lede up>
        These are the same ten rules embedded in <code style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)', fontSize: 'var(--text-sm)'}}>llms.txt</code> — pulled out here so a reviewer can scan them without expanding the full file.
      </Lede>
      <div className="ds-grid cols-2">
        {[
          ['Read the catalog first',              'Before writing any new page, read llms.txt + FORGE-DS-REFERENCE.md. Skipping this step produces drift.'],
          ['Compose, never reinvent',             'If something can be built from Pill + Card + Avatar + Trend, build it that way. Don’t invent a new class.'],
          ['No per-page style blocks',            'Use existing classes (.btn, .surface, .ds-frame, .ds-grid, .in-*, .fc-*, .cb-*, .menu, .tt) or extend packages/ui/styles/tokens.css / ds.css.'],
          ['Every page = full template',          'Live demo + Anatomy + Decision matrix + Do/Don’t (with live UI, not text) + RTL example. See src/ds/migrated/buttons.tsx as the template.'],
          ['Spacing rhythm is intentional',       'Caption after Frame: marginTop: 14. Lede after SubHead: marginTop: -6 (negative — attaches lede to its heading).'],
          ['Logical CSS for RTL',                 'inset-inline-*, padding-inline-*, margin-inline-*, text-align: start. Only physical exception: transform: translateX(…).'],
          ['New page = two coordinated changes',  'Append to the right DS section in src/ds/core/nav-config.js + create src/ds/migrated/<slug>.tsx (default export, imports from @/ds/core). gen-nav / gen-migrated auto-run; restart next dev.'],
          ['Version bumps in one place',          'Bump DS_VERSION in src/lib/site.ts (the topbar VersionBadge reads it). The /release command also sweeps stale nav badges.'],
          ['Idiomatic TSX, compiled by SWC',      'No .babelrc, no <script> tags, no window bridge. Components are plain ES modules from @forge/ui (re-exported by @/ds/core). Escape a literal > as {\'>\'} in JSX text.'],
          ['Common gotchas',                      'Doubled focus ring → box-shadow: none !important on inner inputs. Clipped dropdown → .ds-frame has overflow: hidden; use position: fixed + getBoundingClientRect.'],
        ].map(([title, body], i) => (
          <div key={i} className="surface" style={{padding: 14}}>
            <div style={{display:'flex', alignItems:'baseline', gap: 8, marginBottom: 4}}>
              <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', fontVariantNumeric:'tabular-nums'}}>{String(i+1).padStart(2,'0')}</span>
              <span style={{fontSize: 'var(--text-base)', fontWeight: 600, letterSpacing:'-0.005em'}}>{title}</span>
            </div>
            <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5, paddingInlineStart: 24}}>{body}</div>
          </div>
        ))}
      </div>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>This page is plain prose and code blocks — its only interactive controls are the inline links and each code frame&apos;s <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>Copy</span> button. <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>Tab</span> moves between them in source order; <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>Enter</span> / <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>Space</span> activates a button, and every focusable element shows the shared focus-visible ring. The deeper value is in what the file teaches the model: primed with llms.txt, the code it writes uses native, keyboard-operable elements instead of click-handling divs.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>The content is a flat heading hierarchy of <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>h2</span> section / <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>h3</span> subhead, so an assistant can outline the page by headings alone. Code frames expose their label as an accessible name. Pair llms.txt with the per-component pages, each of which documents the exact roles and ARIA attributes its component needs.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>The file points models at Forge&apos;s tokens, so generated UI inherits the shared focus ring and the AA-tuned light / dark colour pairings instead of inventing ad-hoc values. Body and metadata text on this page all clear AA on their surface; the single ember accent is the &ldquo;short index&rdquo; pill, which uses the contrast-safe <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>--ember-text</span> ink on a soft tint.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>By steering models to the motion tokens (which already honour <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-subtle)'}}>prefers-reduced-motion</span>) rather than hard-coded durations, code primed with this file gets reduced-motion support for free. This page itself has no animation to suppress.</div>
        </div>
      </div>

      {/* Where to next */}
      <SubHead meta="next">Where to go</SubHead>
      <div className="ds-grid cols-3">
        <a href="/installation" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Installation</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Tailwind preset + React copy-paste</span>
        </a>
        <a href="/components-catalog" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Components catalog</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Visual grid of every component</span>
        </a>
        <a href="/color" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span className="name">Foundations</span>
            <Icons.arrowRight size={14} color="var(--fg-faint)"/>
          </div>
          <span className="meta">Tokens that drive every page</span>
        </a>
      </div>
    </Section>
  );
}
