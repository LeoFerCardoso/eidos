---
name: ai-gateway-setup
description: Use when configuring or standardizing model selection for AI features in the forge-ds app — switches the repo to AI Gateway 'provider/model' strings (no provider SDK imports), with ordered fallbacks, cost caps, and per-feature usage tags, authed via VERCEL_AI_GATEWAY_API_KEY. Use whenever a model is being chosen or hardcoded.
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# AI Gateway setup (AI SDK v6)

Standardize THIS repo on Vercel AI Gateway. For canonical Gateway routing/fallback/tagging
details **invoke the `vercel:ai-gateway` skill**.

## The one rule
Pass models as plain `'provider/model'` **strings** everywhere — never import a
provider package (`@ai-sdk/anthropic`, `@ai-sdk/openai`, …). The string IS the model.

```ts
model: 'anthropic/claude-sonnet-4.6'   // ✅ Gateway string
// import { anthropic } from '@ai-sdk/anthropic'  // ❌ do not do this
```

## Auth / env
- Local: set `VERCEL_AI_GATEWAY_API_KEY` in `.env.local` (gitignored). For managing it use
  the `vercel:env-vars` skill.
- On Vercel: auth flows automatically via OIDC — no key needed in env.

## Centralize config — `lib/ai/gateway.ts`
Keep model choice, fallbacks, caps, and tags in one module so routes/agents stay thin.

```ts
// lib/ai/gateway.ts
import type { ModelMessage } from 'ai';

// Ordered fallbacks: first that succeeds wins.
export const MODELS = {
  chat:    ['anthropic/claude-sonnet-4.6', 'openai/gpt-5'],
  fast:    ['anthropic/claude-haiku-4.6', 'openai/gpt-5-mini'],
} as const;

// Per-feature gateway config: ordered fallback + cost cap + usage tag.
export function gatewayConfig(feature: keyof typeof MODELS) {
  const [model, ...fallbacks] = MODELS[feature];
  return {
    model,
    providerOptions: {
      gateway: {
        order: [model, ...fallbacks],          // ordered fallbacks
        maxCost: 0.05,                          // per-request cost cap (USD)
        metadata: { tags: [`feature:${feature}`] }, // per-feature usage tag
      },
    },
  };
}

// Usage in a route/agent:
// const result = streamText({ ...gatewayConfig('chat'), messages });
```

## Decision rules
- One `provider/model` string per call site, but always sourced from
  `lib/ai/gateway.ts` — do not scatter literal model strings across routes.
- Define ordered fallbacks per feature (primary → cheaper/alternate) so an outage or
  rate-limit degrades gracefully.
- Set a `maxCost` cap per feature; tag every call (`feature:<name>`) so spend is
  attributable in the Gateway dashboard.
- When adding a new AI feature, add its entry to `MODELS` rather than hardcoding.
- Defer routing/fallback/observability specifics to **`vercel:ai-gateway`**; defer
  env-key handling to **`vercel:env-vars`**.
