// AI Gateway model routing — use plain "provider/model" strings everywhere so model
// choice is configuration, not code. Auth is the VERCEL_AI_GATEWAY_API_KEY env var
// (OIDC on Vercel). No provider-specific package import.
//
// See the `ai-gateway-setup` skill and the global `vercel:ai-gateway` skill for
// fallbacks, cost caps, and per-feature usage tags.

/** Capable model for generation / agent reasoning. */
export const SMART_MODEL = 'anthropic/claude-sonnet-4.6';

/** Cheap, fast model for routing / classification. */
export const FAST_MODEL = 'anthropic/claude-haiku-4.5';

/** Ordered fallbacks for availability (configure caps/tags in the Gateway dashboard). */
export const SMART_FALLBACKS = [SMART_MODEL, 'openai/gpt-5', 'google/gemini-2.5-pro'];
