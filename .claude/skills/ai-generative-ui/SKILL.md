---
name: ai-generative-ui
description: Use when an AI feature in the forge-ds app should render rich artifacts/components (cards, charts, structured panels) instead of plain text — defines the artifact as an Output.object Zod schema and renders it from typed tool parts with a per-state React component, the v0/Claude-artifacts pattern. Stream DATA, render components client-side.
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# Generative UI / artifacts (AI SDK v6)

Generate model-driven UI: the model emits structured **data**, the client renders **Forge
components**. Reference implementation: `app/ai-chat/` (artifact tool + renderer). For
canonical `Output.object` semantics **invoke the `vercel:ai-sdk` skill**.

## Core principle
**Stream DATA, render components client-side.** The model returns a typed object; React
maps it to design-system components. Do NOT have the model emit HTML/JSX.

## Pattern A — structured output via `Output.object` (preferred)
`generateObject` / `streamObject` are **deprecated** → use `Output.object({ schema })`
with `streamText`/the agent. Define the schema once and share it.

```ts
// lib/ai/artifacts/report.ts
import { Output } from 'ai';
import { z } from 'zod';

export const reportSchema = z.object({
  title: z.string(),
  metrics: z.array(z.object({ label: z.string(), value: z.string(), delta: z.number().optional() })),
});

// In the route/agent:
// const result = streamText({ model, messages, experimental_output: Output.object({ schema: reportSchema }) });
```

## Pattern B — artifact as a typed tool part (the v0 pattern)
Expose a tool whose `inputSchema` IS the artifact schema; the model "calls" it to render.
The client keys a component off the `tool-<name>` part and its `part.state`:

```tsx
// in the message.parts switch (see ai-chat-ui)
case 'tool-renderReport': {
  if (part.state === 'input-streaming') return <div className="ai-card skeleton" key={i} />; // partial
  if (part.state === 'input-available' || part.state === 'output-available')
    return <ReportCard key={i} {...part.input} />; // input already matches reportSchema
  return null;
}

function ReportCard({ title, metrics }: z.infer<typeof reportSchema>) {
  return (
    <div className="ai-card ana">
      <h3>{title}</h3>
      <ul className="ana-list">
        {metrics.map((m) => (
          <li key={m.label} className="ai-meta-row">
            <span>{m.label}</span>
            <span className="delta">{m.value}{m.delta != null ? ` (${m.delta})` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Forge styling
Use design-system classes (`src/styles/ds.css`): `ai-card`, `ana` / `ana-list` for
metric lists, `delta` for change values, `agent-card`, `chart` for recharts. Ember accent
only, max 2× per screen. Never write per-component `<style>`.

## Decision rules
- One artifact type ⇒ one Zod schema in `lib/ai/artifacts/` + one component, keyed by
  `tool-<name>` and gated on `part.state`. Render partial state on `input-streaming`.
- Reach for server-streamed **RSC** only when the *model decides the UI structure itself*
  (rare); otherwise the typed-tool-part + client component approach above is the default.
- Share the schema between server (Output.object / tool inputSchema) and client
  (`z.infer<>`) — one source of truth.
- Defer `Output.*` / streaming-object API to **`vercel:ai-sdk`**; mirror `app/ai-chat/`.
