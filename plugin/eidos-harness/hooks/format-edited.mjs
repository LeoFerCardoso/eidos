#!/usr/bin/env node
// PostToolUse(Edit|Write) — auto-format the edited file IF a local formatter exists.
// No-ops safely when prettier isn't installed (never triggers a network install).
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let fp = '';
  try {
    fp = JSON.parse(raw || '{}').tool_input?.file_path || '';
  } catch {
    /* allow */
  }
  const prettier = new URL('../../node_modules/.bin/prettier', import.meta.url).pathname;
  if (fp && existsSync(prettier) && /\.(ts|tsx|js|jsx|json|css|md)$/.test(fp)) {
    try {
      execFileSync(prettier, ['--write', fp], { stdio: 'ignore' });
    } catch {
      /* formatting is best-effort */
    }
  }
  process.exit(0);
});
