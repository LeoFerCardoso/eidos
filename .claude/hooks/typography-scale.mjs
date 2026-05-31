#!/usr/bin/env node
// PreToolUse(Edit|Write|MultiEdit) — typography scale guardrail for DS pages.
//
// Forge type is a 9-step scale (Foundations/Typography): 72·56·36·28·20·17·15·13·11.
// Doc prose must use the .t-* classes or --text-* tokens — never a hand-rolled
// font-size. This hook inspects edits to src/ds/migrated/**.tsx (+ examples):
//   • HARD BLOCK the half-pixel doc-prose smells that are never a real component
//     size and were the exact drift we removed: 13.5 / 12.5 / 14.5 / 16 px.
//   • SOFT WARN on any other numeric `fontSize: N` that is off-scale, pointing at
//     the canonical class. (Legit component-internal sizes — a 22px specimen,
//     an 11px badge — stay allowed; the warning is a nudge, not a block.)
// Reads the hook payload as JSON on stdin; exit 2 = block (stderr → agent).
let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let data = {};
  try {
    data = JSON.parse(raw || '{}');
  } catch {
    process.exit(0);
  }
  const ti = data.tool_input || {};
  const fp = String(ti.file_path || ti.path || '');
  // Only police authored DS pages / examples.
  if (!/src\/ds\/(migrated|examples)\/.*\.tsx$/.test(fp)) process.exit(0);

  // Gather the text being introduced across Write / Edit / MultiEdit shapes.
  const added = [
    ti.content,
    ti.new_string,
    ...(Array.isArray(ti.edits) ? ti.edits.map((e) => e && e.new_string) : []),
  ]
    .filter(Boolean)
    .join('\n');
  if (!added) process.exit(0);

  const SCALE = new Set([11, 13, 15, 17, 20, 28, 36, 56, 72]);
  const BANNED = new Set([13.5, 12.5, 14.5, 16]); // never a legit size; doc-prose drift
  const banned = new Set();
  const offScale = new Set();
  const re = /fontSize:\s*([0-9]+(?:\.[0-9]+)?)\b/g;
  let m;
  while ((m = re.exec(added))) {
    const n = parseFloat(m[1]);
    if (BANNED.has(n)) banned.add(n);
    else if (!SCALE.has(n)) offScale.add(n);
  }

  if (banned.size) {
    process.stderr.write(
      `Blocked: off-scale font-size ${[...banned].join(', ')}px in ${fp.split('/').slice(-1)[0]}.\n` +
        `Forge type is a 9-step scale — there is no 12.5/13.5/14.5/16. Use the canonical role instead:\n` +
        `  • section intro / lede / body paragraph → <Lede> or className="t-body" (15)\n` +
        `  • card / a11y / helper / caption body     → className="t-small" or var(--text-base) (13)\n` +
        `  • eyebrow / column header                 → className="t-mono-label" (11)\n` +
        `  • inline code in prose                    → <Mono> (13, ember)\n` +
        `See .claude/craft/typography.md and Foundations/Typography ("Where each step lives").\n`,
    );
    process.exit(2);
  }

  if (offScale.size) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          additionalContext:
            `Typography note: hand-rolled fontSize ${[...offScale].sort((a, b) => a - b).join(', ')}px ` +
            `in ${fp.split('/').slice(-1)[0]} is off the 9-step scale (11·13·15·17·20·28·36·56·72). ` +
            `For doc prose use the .t-* classes / --text-* tokens (t-body 15, t-small 13, t-mono-label 11). ` +
            `Raw px is only acceptable inside a component/demo being rendered, not in the page chrome.`,
        },
      }),
    );
  }

  // Header-lede budget (DS-PAGE-STANDARD §2.1): the page-header `desc` is ≤ 2 lines
  // (≤ 220 chars) of PLAIN TEXT. Flag a long lede or any markup in it (no <code>,
  // no inline <span style>). Best-effort across Edit/Write payloads.
  const descNotes = [];
  const descRe = /desc=(?:"([^"]*)"|\{`([^`]*)`\})/g;
  let d;
  while ((d = descRe.exec(added))) {
    const text = (d[1] ?? d[2] ?? '').trim();
    if (text.includes('<'))
      descNotes.push(`contains markup ("${text.slice(0, 40)}…") — a header must be plain text`);
    else if (text.length > 220)
      descNotes.push(`is ${text.length} chars (budget ≤ 220 / ~2 lines)`);
  }
  if (descNotes.length) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          additionalContext:
            `Header-lede note (${fp.split('/').slice(-1)[0]}): the page-header desc ${descNotes.join('; ')}. ` +
            `Per DS-PAGE-STANDARD §2.1, keep the lede to what-it-is + when-to-use (≤ 2 lines, no markup) ` +
            `and move the rest below the separator into a <Lede> under the first SubHead.`,
        },
      }),
    );
  }
  process.exit(0);
});
