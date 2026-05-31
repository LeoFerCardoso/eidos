// Reference Forge IDP assistant — a type-safe AI SDK v6 ToolLoopAgent.
//
// Pattern (see the `ai-agent-scaffold` skill):
//   - tools via `tool({ inputSchema: z…, execute })`
//   - bound with `stopWhen: stepCountIs(n)` so the loop can't run away
//   - export `InferAgentUIMessage<typeof agent>` so the UI is end-to-end typed
//
// The model is an AI Gateway "provider/model" string (see ../gateway.ts). The agent is
// only instantiated/called at request time, so a missing API key fails on request,
// never at build.
import { ToolLoopAgent, tool, stepCountIs, type InferAgentUIMessage } from 'ai';
import { z } from 'zod';
import { SMART_MODEL } from '../gateway';

// Demo tool: stand-in for a real IDP service-health lookup. Swap `execute` for a real
// data source (DB / internal API / MCP tool).
const getServiceHealth = tool({
  description: 'Look up the current health, deploy status, and owner of an IDP service by name.',
  inputSchema: z.object({
    service: z.string().describe('The service name, e.g. "payments-api".'),
  }),
  execute: async ({ service }) => {
    // Deterministic mock so the reference runs without backend wiring.
    const seed = [...service].reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = 60 + (seed % 40);
    return {
      service,
      healthScore: score,
      status: score > 85 ? 'healthy' : score > 70 ? 'degraded' : 'at-risk',
      lastDeploy: `${1 + (seed % 9)}h ago`,
      owner: ['platform', 'payments', 'identity', 'data'][seed % 4] + '-tribe',
    };
  },
});

export const assistantAgent = new ToolLoopAgent({
  model: SMART_MODEL,
  instructions:
    'You are the Forge IDP assistant. Help platform engineers inspect services, deploys, ' +
    'and scorecards. Be concise and precise. Use tools to fetch real data instead of guessing. ' +
    'When you report a service, lead with its status and health score.',
  tools: { getServiceHealth },
  stopWhen: stepCountIs(5),
});

// End-to-end UI message type — import this in the client so message.parts are typed,
// including the typed `tool-getServiceHealth` parts.
export type AssistantUIMessage = InferAgentUIMessage<typeof assistantAgent>;
