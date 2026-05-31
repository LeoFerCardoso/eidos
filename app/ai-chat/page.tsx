'use client';

// Reference chat-with-agents UI (see the `ai-chat-ui` skill).
//   - useChat + DefaultChatTransport; input state is manual (useState).
//   - render message.parts, switching on part.type; the typed tool part
//     `tool-getServiceHealth` is gated on part.state so we never read input/output
//     before they exist.
//   - styled with the Forge ai-shell.css / ds.css classes — no per-page <style>.
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AssistantUIMessage } from '@/lib/ai/agents/assistant';

const transport = new DefaultChatTransport({ api: '/ai-chat/api/chat' });

export default function AIChatPage() {
  const { messages, sendMessage, status, stop, error } = useChat<AssistantUIMessage>({ transport });
  const [input, setInput] = useState('');
  const busy = status === 'submitted' || status === 'streaming';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput('');
  };

  return (
    <div className="ai-thread" style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px', minHeight: '100dvh' }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Forge IDP Assistant</h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: 13, marginTop: 4 }}>
          Reference chat-with-agents (AI SDK v6 · tool calling · streaming). Try: “How healthy is payments-api?”
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        {messages.map((m) => (
          <div key={m.id} className={`ai-bubble-row ${m.role === 'user' ? 'ai-user' : ''}`}>
            <div className="ai-bubble surface" style={{ padding: '10px 14px', borderRadius: 10 }}>
              <div className="t-mono-label" style={{ marginBottom: 4, opacity: 0.6 }}>{m.role}</div>
              {m.parts.map((part, i) => {
                if (part.type === 'text') {
                  return <div key={i} className="ai-prose" style={{ whiteSpace: 'pre-wrap' }}>{part.text}</div>;
                }
                if (part.type === 'tool-getServiceHealth') {
                  // Gate property access on part.state — input/output are undefined mid-stream.
                  if (part.state === 'input-streaming' || part.state === 'input-available') {
                    return (
                      <div key={i} className="pill" style={{ marginTop: 6 }}>
                        <span className="dot" /> calling getServiceHealth…
                      </div>
                    );
                  }
                  if (part.state === 'output-available') {
                    const o = part.output as { service: string; status: string; healthScore: number; owner: string; lastDeploy: string };
                    return (
                      <div key={i} className="surface" style={{ marginTop: 8, padding: 12, borderRadius: 8 }}>
                        <div style={{ fontWeight: 600 }}>{o.service}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
                          <span className={`pill ${o.status === 'healthy' ? 'ok' : o.status === 'degraded' ? 'warn' : 'danger'}`}>{o.status}</span>
                          {' '}health {o.healthScore} · deploy {o.lastDeploy} · {o.owner}
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="surface" style={{ padding: 12, borderRadius: 8, color: 'var(--danger, #e5484d)', marginBottom: 12 }}>
          {error.message}
        </div>
      )}

      <form onSubmit={submit} className="ai-prompt-card surface" style={{ display: 'flex', gap: 8, padding: 8, borderRadius: 12 }}>
        <input
          className="ai-prompt-textarea in-control"
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '8px 10px' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a service, deploy, or scorecard…"
          disabled={busy}
        />
        {busy ? (
          <button type="button" className="btn" onClick={() => stop()}>Stop</button>
        ) : (
          <button type="submit" className="btn ember ai-prompt-send" disabled={!input.trim()}>Send</button>
        )}
      </form>
    </div>
  );
}
