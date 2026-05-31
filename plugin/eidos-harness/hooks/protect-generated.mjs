#!/usr/bin/env node
// PreToolUse(Edit|Write) guardrail.
// - HARD BLOCK edits to the generated route manifest (it's rebuilt from nav-config).
// - SOFT WARN on edits to the design tokens / component CSS (the design system itself).
// Reads the hook payload as JSON on stdin; exit 2 = block (stderr shown to the agent).
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let fp = '';
  try {
    const data = JSON.parse(raw || '{}');
    fp = data.tool_input?.file_path || data.tool_input?.path || '';
  } catch {
    /* no payload — allow */
  }
  const f = String(fp);

  if (f.endsWith('src/ds/runtime/manifest.generated.ts')) {
    process.stderr.write(
      'Blocked: manifest.generated.ts is auto-generated. Edit src/ds/core/nav-config.js and run `node scripts/gen-manifest.mjs` (npm run gen:manifest) instead.\n',
    );
    process.exit(2);
  }

  if (/src\/styles\/(tokens|ds)\.css$/.test(f)) {
    // Allow, but surface a reminder into the agent's context.
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          additionalContext:
            'Note: you are editing the design system source of truth (' +
            f.split('/').pop() +
            '). Prefer composing existing classes; only extend tokens/ds.css for a genuinely new building block, and keep dark/light + RTL parity.',
        },
      }),
    );
  }
  process.exit(0);
});
