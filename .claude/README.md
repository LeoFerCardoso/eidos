# .claude — the Eidos harness

Everything the Claude Code harness needs lives here. Claude Code scans
`agents/`, `skills/`, `commands/`, `hooks/` (via settings.json), and `output-styles/`;
the other folders are reference content that skills/agents read by path.

Scope rule: this harness contains **only** what serves building the Eidos **Design
System**, the **Harness Engineering Platform**, the **Developer Experience Platform**, and
the **Internal Developer Portal**. Skills that create anything off-mission (decks,
posters, social, video, marketing landings, blogs, consumer mobile, generic business docs)
were removed, not archived.

```
.claude/
├── settings.json        # permissions, env, hooks, skillListingBudgetFraction
├── agents/              # 8 subagents (web-project-lead, frontend-engineer,
│                        #   design-system-engineer, ux-designer, ai-feature-architect,
│                        #   ai-sdk-engineer, code-reviewer, performance-optimizer)
├── skills/              # discoverable, Eidos-native skills (auto-trigger)
│   ├── new-component, new-page, refine, portal-scaffold,            # DS workflow
│   │   ds-component-authoring, ds-a11y-rtl-review
│   ├── component-page, idp-screen, dashboard, live-dashboard,       # DS/IDP artifacts
│   │   docs-page
│   ├── critique, tweaks, wireframe-sketch, design-brief             # design process
│   ├── ai-agent-scaffold, ai-streaming-route, ai-chat-ui,           # AI platform
│   │   ai-generative-ui, ai-gateway-setup
│   └── _template            # skill-authoring template (quiet)
├── commands/            # /commit, /open-pr, /release, /verify-routes
├── hooks/               # session-context, protect-generated, format-edited (.mjs)
├── output-styles/       # eidos-reviewer
├── design-systems/      # eidos/ — the single canonical brand
└── craft/               # 8 brand-agnostic craft rulebooks
```

## The three axes (the engineering model)

- **skills/** — *what* to build (artifact shape + workflow).
- **design-systems/** — the *brand*: `eidos/DESIGN.md` is the one canonical brand.
- **craft/** — *universal* rules a competent designer applies regardless of brand.

A skill reads `design-systems/forge/DESIGN.md` + the craft sections it needs + the catalog
(`EIDOS-DS-REFERENCE.md`, `llms.txt`), then composes with the Eidos classes/components in
`src/styles/ds.css` and `src/ds/`. There is no daemon — the agent reads these files; the
anti-AI-slop P0 list is a mandatory manual checklist. Eidos artifacts are built **in the
repo** (the 3-file DS-page ritual), not emitted as standalone artifacts.

## Distribution

`npm run build:plugin` packages this directory into `plugin/eidos-harness/` (with portable
`${CLAUDE_PLUGIN_ROOT}` paths) so teammates install the whole harness via the marketplace
in `.claude-plugin/marketplace.json`.
