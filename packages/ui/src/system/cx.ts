// Deterministic class-name join for the system layer. Unlike `cn` (clsx + twMerge),
// these are atomic, non-conflicting utility classes generated from the token source,
// so no conflict-resolution merge is needed — a plain space join is correct and fast.
export function cx(...parts: Array<string | false | null | undefined>): string {
  let out = '';
  for (const p of parts) if (p) out += (out ? ' ' : '') + p;
  return out;
}
