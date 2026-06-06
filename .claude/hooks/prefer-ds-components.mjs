#!/usr/bin/env node
// PreToolUse(Edit|Write|MultiEdit) guard — keep PRODUCT SCREENS on the DS, never
// hand-rolled. Scope: src/portal/** and app/** TSX (the screens). The DS source
// (packages/ui/**) and DS docs (src/ds/**) legitimately author the raw classes,
// so they're out of scope.
//
// HARD BLOCK (exit 2) when a screen edit:
//   • hand-rolls a button via className="btn …"  → use <Button> from @eidos/ui
//   • hand-rolls a menu item via role="menuitem"  → use DropdownMenu* from @eidos/ui
//   • redefines a component the DS already ships   → import it, don't recreate
// Discover what already exists in DS-COMPONENTS.md (generated from @eidos/ui).
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let fp = '', content = '';
  try {
    const data = JSON.parse(raw || '{}');
    fp = data.tool_input?.file_path || data.tool_input?.path || '';
    content =
      data.tool_input?.content ??
      data.tool_input?.new_string ??
      (Array.isArray(data.tool_input?.edits) ? data.tool_input.edits.map((e) => e.new_string || '').join('\n') : '') ??
      '';
  } catch {
    process.exit(0);
  }
  const f = String(fp);
  // Only product screens. DS package + DS docs author the primitives themselves.
  const inScope = /(^|\/)(src\/portal|app)\/.*\.tsx$/.test(f) && !/packages\/ui\//.test(f) && !/src\/ds\//.test(f);
  if (!inScope) process.exit(0);

  // Drop comments + template/strings so demo text isn't flagged.
  const body = String(content)
    .replace(/`(?:\\.|[^`\\])*`/g, '``')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');

  // 1) hand-rolled button via the .btn class (btn-group etc. are fine)
  if (/className\s*=\s*[{]?\s*["'`][^"'`}]*\bbtn\b(?!-)/.test(body)) {
    process.stderr.write('Blocked [ds-first]: don\'t hand-roll className="btn …" in a screen. Use <Button variant size> from @eidos/ui (asChild to wrap a <Link>). See DS-COMPONENTS.md.\n');
    process.exit(2);
  }
  // 2) hand-rolled menu item
  if (/role\s*=\s*["'`]menuitem["'`]/.test(body)) {
    process.stderr.write('Blocked [ds-first]: don\'t hand-roll role="menuitem". Use DropdownMenu / DropdownMenuItem (icon prop) from @eidos/ui. See DS-COMPONENTS.md.\n');
    process.exit(2);
  }
  // 3) redefining a component the DS already ships
  const redef = body.match(/\b(?:function|const)\s+(Button|Field|FormSection|Form|Menu|Modal|Popover|Select|Checkbox|Switch|Tabs|Tooltip|Dropdown\w*|Command)\s*[=(]/);
  if (redef) {
    process.stderr.write(`Blocked [ds-first]: "${redef[1]}" already exists in @eidos/ui — import it, don't redefine it in a screen. See DS-COMPONENTS.md.\n`);
    process.exit(2);
  }
  process.exit(0);
});
