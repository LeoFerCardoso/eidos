#!/usr/bin/env node
// PreToolUse(Edit|Write|MultiEdit) guard — the in-edit twin of scripts/check-no-page-style.mjs.
// HARD BLOCK (exit 2) when an edit introduces a per-page <style> block or a hardcoded
// color in an inline style in a docs page (src/ds/migrated/**) or a @eidos/ui component
// (packages/ui/src/**/*.tsx). The ONLY place raw color/oklch/hex lives is the token CSS
// (tokens.css / ds.css / ai.css) — those are whitelisted. Backs clause C-no-page-style.
// Not a blanket hex/px ban (that would flag the token source).
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let fp = '', content = '';
  try {
    const data = JSON.parse(raw || '{}');
    fp = data.tool_input?.file_path || data.tool_input?.path || '';
    // Write → content; Edit → new_string; MultiEdit → join edits[].new_string
    content =
      data.tool_input?.content ??
      data.tool_input?.new_string ??
      (Array.isArray(data.tool_input?.edits) ? data.tool_input.edits.map((e) => e.new_string || '').join('\n') : '') ??
      '';
  } catch {
    process.exit(0); // no payload — allow
  }
  const f = String(fp);

  // scope: docs pages + ui components only; never the CSS token layer
  const inScope = /src\/ds\/(migrated|examples)\/.*\.tsx$/.test(f) || /packages\/ui\/src\/.*\.tsx$/.test(f);
  const isTokenCss = /(tokens|ds|ai)\.css$/.test(f);
  if (!inScope || isTokenCss) process.exit(0);

  // strip Frame `code` demo snippets + comments (a <style> in a // comment or a demo
  // string is not a violation).
  const body = String(content)
    .replace(/`(?:\\.|[^`\\])*`/g, '``')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

  if (/<style[\s>]/.test(body)) {
    process.stderr.write('Blocked [C-no-page-style]: no per-page <style> block. Compose a `.ds-*` class or extend packages/ui/styles/{tokens,ds,ai}.css.\n');
    process.exit(2);
  }
  // hex in an inline style is almost always page chrome that should be a token; rgba/oklch
  // are common in legit rendered demos, so they're not hard-blocked here.
  const m = body.match(/style=\{\{[^}]*(#[0-9a-fA-F]{3,8})/);
  if (m) {
    process.stderr.write(`Blocked [C-no-page-style]: hardcoded color (${m[1]}) in an inline style. Use var(--token) from the Forge token layer.\n`);
    process.exit(2);
  }
  process.exit(0);
});
