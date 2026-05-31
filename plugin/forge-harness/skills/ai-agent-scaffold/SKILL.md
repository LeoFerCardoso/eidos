---
name: ai-agent-scaffold
description: Use when adding a tool-using AI agent to the forge-ds app — generates a type-safe ToolLoopAgent (Zod tools, stopWhen, exported InferAgentUIMessage type) under lib/ai/agents/ plus the matching streaming route and useChat client wiring. Produces the agent module, not just docs.
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# AI Agent scaffold (ToolLoopAgent, AI SDK v6)

Generate a reusable, type-safe agent in THIS repo. Reference implementation to copy
from: `app/ai-chat/` (route + client + agent). For canonical API semantics
(ToolLoopAgent, tool, stopWhen, InferAgentUIMessage) **invoke the `vercel:ai-sdk`
skill** rather than guessing.

## Decision rule — pick the runtime FIRST
- **No tools, just text** → plain `streamText(...)` in a route handler. Use the
  `ai-streaming-route` skill. Do NOT reach for an agent.
- **Needs tools / multi-step reasoning, finishes in <60s** → `ToolLoopAgent` (this skill).
- **Long-running (>60s, minutes→hours)** → Workflow DevKit `DurableAgent`; return a
  `runId` and poll. Invoke the `vercel:workflow` skill. Do NOT run a multi-minute
  agent inside a request handler.

## Workflow
1. Create `lib/ai/agents/<name>.ts` (this repo uses path alias `@/*` → `src/*`, but
   agents live in `lib/ai/agents/` at repo root; import from `@/...` only for src).
2. Define each tool with `tool({ description, inputSchema: z.object(...), execute })`.
3. Construct the agent with a `'provider/model'` Gateway string (see `ai-gateway-setup`).
4. Bind the loop with `stopWhen: stepCountIs(n)`.
5. Export `InferAgentUIMessage<typeof agent>` as the shared UI message type — both the
   route and the `useChat` client import it.
6. Wire the route (`ai-streaming-route`) and client (`ai-chat-ui`).

## Canonical snippet — `lib/ai/agents/weather-agent.ts`
```ts
import { ToolLoopAgent, tool, stepCountIs, type InferAgentUIMessage } from 'ai';
import { z } from 'zod';

export const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.6', // AI Gateway string — no provider import
  instructions: 'You are a concise weather assistant. Use tools before answering.',
  stopWhen: stepCountIs(8),
  tools: {
    getWeather: tool({
      description: 'Get current weather for a city.',
      inputSchema: z.object({ city: z.string().describe('City name') }),
      execute: async ({ city }) => {
        const res = await fetch(`https://api.example.com/weather?city=${city}`);
        return res.json(); // { tempC, condition }
      },
    }),
  },
});

// End-to-end types: route + client both import this.
export type WeatherUIMessage = InferAgentUIMessage<typeof weatherAgent>;
```

The route calls `weatherAgent.respond({ messages })` (or streams via the agent) and
returns `result.toUIMessageStreamResponse()`. Typed tool parts surface on the client as
`tool-getWeather` parts — render them with the `ai-chat-ui` / `ai-generative-ui` skills.

## Rules
- One agent module per feature; keep tools small and pure where possible.
- `instructions` (NOT `system`) on the agent; `stopWhen` is mandatory to bound the loop.
- Never hardcode a provider SDK import — always the Gateway `'provider/model'` string.
- Export the `InferAgentUIMessage` type; the client must not redeclare message shapes.
- Defer deep API questions to **`vercel:ai-sdk`**; mirror structure from `app/ai-chat/`.
