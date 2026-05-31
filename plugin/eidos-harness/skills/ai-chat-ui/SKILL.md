---
name: ai-chat-ui
description: Use when building the client chat interface for an AI feature in the eidos app — generates a 'use client' useChat component with DefaultChatTransport, manual useState input, message.parts rendering, and state-gated typed tool parts, styled with Eidos ds.css / ai-shell.css classes.
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# AI chat UI (useChat, AI SDK v6)

Generate the client half. Reference implementation: `app/ai-chat/page.tsx`. For canonical
`useChat` / parts semantics **invoke the `vercel:ai-sdk` skill**.

## Eidos styling — use existing classes, never inline `<style>`
Compose design-system classes from `src/styles/ai-shell.css` + `src/styles/ds.css`:
- Thread container: `ai-thread`; each turn row: `ai-bubble-row` (+ `ai-user` for user).
- Message body: `ai-bubble`; assistant prose: `ai-prose` inside `ai-resp`.
- Composer: `ai-prompt-card` > `ai-prompt-textarea` + `ai-prompt-send`.
Single accent is ember `var(--accent)` — at most 2× per screen. Geist Sans for body,
Geist Mono for captions/eyebrows.

## Canonical snippet — `app/ai-chat/page.tsx`
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import type { WeatherUIMessage } from '@/lib/ai/agents/weather-agent'; // exported InferAgentUIMessage

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, stop } = useChat<WeatherUIMessage>({
    transport: new DefaultChatTransport({ api: '/ai-chat/api/chat' }),
  });

  return (
    <div className="ai-thread">
      {messages.map((m) => (
        <div key={m.id} className={`ai-bubble-row ${m.role === 'user' ? 'ai-user' : ''}`}>
          <div className="ai-bubble ai-prose">
            {m.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <span key={i}>{part.text}</span>;
                case 'tool-getWeather': // typed tool part (keyed off agent tool name)
                  if (part.state === 'input-streaming') return <em key={i}>looking up…</em>;
                  if (part.state === 'input-available') return <em key={i}>fetching {part.input.city}…</em>;
                  if (part.state === 'output-available')
                    return <code key={i}>{part.output.tempC}°C</code>;
                  return null;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      ))}

      <form
        className="ai-prompt-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <textarea
          className="ai-prompt-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Eidos…"
        />
        {status === 'streaming' ? (
          <button type="button" className="ai-prompt-send" onClick={stop}>Stop</button>
        ) : (
          <button type="submit" className="ai-prompt-send" disabled={status !== 'ready'}>Send</button>
        )}
      </form>
    </div>
  );
}
```

## Rules
- `'use client'` at top; input is manual `useState` (v6 `useChat` does not own input).
- Send with `sendMessage({ text })`; render by mapping `message.parts` and switching on
  `part.type` — never assume a single `content` string.
- Typed tool parts are `tool-<toolName>`; gate rendering on `part.state`
  (`input-streaming` → `input-available` → `output-available`). For richer tool/artifact
  rendering use the `ai-generative-ui` skill.
- For polished message/prompt primitives, install **AI Elements** via the shadcn registry
  (invoke the `vercel:shadcn` skill) but keep Eidos classes for layout.
- Import the message type from the agent module (`InferAgentUIMessage`) — do not redeclare.
- Defer `useChat` API details to **`vercel:ai-sdk`**; mirror `app/ai-chat/page.tsx`.
