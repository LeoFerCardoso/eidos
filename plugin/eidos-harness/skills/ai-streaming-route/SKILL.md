---
name: ai-streaming-route
description: Use when creating the server endpoint for an AI chat/agent feature in the eidos app — generates a Next.js App Router Route Handler that calls streamText/agent and returns toUIMessageStreamResponse for a useChat client, with stop support and an optional Redis-backed resumable-streams variant.
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# AI streaming Route Handler (AI SDK v6)

Generate the server half of an AI feature. Reference implementation:
`app/ai-chat/api/chat/route.ts`. For canonical `streamText` / stream-response details,
**invoke the `vercel:ai-sdk` skill**.

## Where it lives
Next.js App Router route handlers live in `app/<feature>/api/.../route.ts` and export
`POST`. The client (`useChat`) points its `DefaultChatTransport({ api })` at this path.

## CRITICAL rule
When the client uses `useChat`, the route MUST return
`result.toUIMessageStreamResponse()` — **never** `toDataStreamResponse()`. The UI message
stream is what carries typed `tool-<name>` parts and `part.state` to the client.

## Canonical snippet — `app/ai-chat/api/chat/route.ts`
```ts
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
// For a tool agent, import the agent instead and call agent.stream(...) — see ai-agent-scaffold.

export const maxDuration = 30; // seconds; raise toward 60 for tool loops

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.6', // AI Gateway string (see ai-gateway-setup)
    system: 'You are the Eidos assistant. Be precise and concise.',
    messages: convertToModelMessages(messages),
    abortSignal: req.signal, // honors useChat stop()
  });

  return result.toUIMessageStreamResponse();
}
```

## Stop / status
`req.signal` (passed as `abortSignal`) ties server work to the client's `stop()`. The
client reads `status` from `useChat` (`'submitted' | 'streaming' | 'ready' | 'error'`) —
see the `ai-chat-ui` skill for the matching UI.

## Resumable streams (optional, only when needed)
For long generations where a refresh must not lose the stream, back the stream with Redis
and a stream context (`resumable-stream` + Upstash/`@vercel/kv`). Add a `consumeStream`
on the server and a `resume` path on the client. This is opt-in — do not add it by
default. **Invoke `vercel:ai-sdk`** (resumable streams section) and, for the KV/Redis
resource, the `vercel:vercel-storage` skill.

## Rules
- `export const maxDuration` to cover the loop; >60s ⇒ use Workflow `DurableAgent`
  instead (see `ai-agent-scaffold` decision rule), not a longer route timeout.
- Always `convertToModelMessages(messages)` before passing UI messages to the model.
- One route per feature under `app/<feature>/api/`; keep model/tool config in
  `lib/ai/` so route stays thin.
- Defer streaming-API specifics to **`vercel:ai-sdk`**; mirror `app/ai-chat/`.
