// Streaming chat endpoint for the reference assistant.
//
// Pattern (see the `ai-streaming-route` skill): take UI messages, convert to model
// messages, run the agent's tool loop, and stream back with toUIMessageStreamResponse()
// (NOT toDataStreamResponse — the client is useChat). The agent reads its model + API
// key at request time, so this module imports fine at build even with no key set.
import { convertToModelMessages, type UIMessage } from 'ai';
import { assistantAgent } from '@/lib/ai/agents/assistant';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  if (!process.env.VERCEL_AI_GATEWAY_API_KEY && !process.env.AI_GATEWAY_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Set VERCEL_AI_GATEWAY_API_KEY to use the assistant (see .env.example).' }),
      { status: 503, headers: { 'content-type': 'application/json' } },
    );
  }

  const result = await assistantAgent.stream({
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
