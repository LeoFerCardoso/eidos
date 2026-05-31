# @forge/ui

The **Forge Design System** component library — framework-agnostic React components
over a shared **semantic CSS** layer. One ember accent, Geist type, OKLCH tokens,
RTL-first, contrast-safe.

Forge is **owned, not imported**: you can consume it two ways.

## 1. Copy components into your repo (recommended) — `forge-ui`

Like shadcn/ui, the `forge-ui` CLI copies a component's source into your project so you
own and can edit it. The base layer (design tokens + `ds.css` + the `cn` helper) installs
once; each component then copies its `.tsx` and resolves its dependencies.

```bash
# 1. Install the Forge base layer once (tokens + ds.css + cn)
npx forge-ui@latest init

# 2. Add components — copied into components/forge/, deps resolved automatically
npx forge-ui@latest add metric-card
npx forge-ui@latest add health-badge   # also pulls status-dot (its dependency)

# Browse + drift-check
npx forge-ui@latest list
npx forge-ui@latest diff metric-card
```

The registry is **shadcn-schema-compatible**, so the stock CLI works too:

```bash
npx shadcn@latest add https://forge.equifax.dev/r/metric-card.json
```

After `init`, import the layer in your global stylesheet (order matters):

```css
@import "./styles/forge/tokens.css";
@import "./styles/forge/ds.css";
```

## 2. Install as a package

```bash
npm i @forge/ui
```

```tsx
import { MetricCard, StatusDot, DataTable } from '@forge/ui';
import '@forge/ui/styles/tokens.css';
import '@forge/ui/styles/ds.css';
import '@forge/ui/styles/ai.css'; // only if you use the AI sub-DS

export default function Dashboard() {
  return <MetricCard label="Deploy frequency" value={142} delta={12} />;
}
```

`react` / `react-dom` are peer dependencies. `recharts` (charts) and
`ai` / `react-markdown` (AI components) are **optional** peers — install them only if you
use those components.

## What's inside

| Family | Components |
| --- | --- |
| **primitives** | Frame, Code, CodeBlock, CodeTree, Tabs, TabbedCode, CollapsibleCode, PropsTable, SubHead, Lede, Mono, TokenSwatch, SpecRow, Pagination, CopyButton |
| **atoms** | StatusDot, HealthBadge, SeverityPill, Trend, Avatar, TierBadge, LangBadge, Counter, Sparkline, Empty, KbdRow, CopyChip, RelativeTime, OwnerPill |
| **blocks** | MetricCard, Stat, Banner, Pipeline, Timeline, RingBar, ScoreGauge, LogViewer, DiffViewer, TreeView, JSONInspector, ServiceCard, AgentCard, FilterPanel, DataTable |
| **charts** | ForgeChart, ChartLegend (recharts) |
| **device** | DeviceFrame, PhoneTop, StatusBar |
| **drawer** | Drawer |
| **ai** | Tool, Reasoning, ChainOfThought, Plan, Task, Message, Conversation, Response, PromptInput, ModelSelector, Citation, Sources, Terminal, AskUser, and more |

Explore them live in **Storybook** (`npm run sb` at the repo root).

## License

MIT.
