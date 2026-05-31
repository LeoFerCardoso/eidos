export const meta = {
  name: 'doc-section-audit',
  description: 'Bring flagged component docs pages into DS-PAGE-STANDARD section order: add a real RTL section where missing, put Accessibility→RTL→Anatomy in order, move any post-API content before the API reference (which must be last), and fix Do/Don\'t ordering. Disjoint files (one page each) → safe parallel.',
  whenToUse: 'R5-4 doc-page section-order audit.',
  phases: [{ title: 'Fix pages' }, { title: 'Verify' }],
}

const REPO = '/Users/leocardoso/Projects/forge-ds'
const STD = `
DS-PAGE-STANDARD component-page section ORDER (read docs/DS-PAGE-STANDARD.md + src/ds/migrated/buttons.tsx as the gold reference):
  Header(Section) → Installation → Usage → Variants/Sizes/States → In context → Accessibility → RTL → Anatomy → Do/Don't → API reference (LAST).
GUARD: if a page is a FOUNDATION/SEMANTICS or multi-topic CATALOG page (documents tokens/semantics or many components, not ONE component — e.g. status.tsx "Status & semantics"), it uses a different template — only reorder if it genuinely has the single-component sections; otherwise leave it and say so. For true single-component pages, enforce the order below.
Rules: compose ONLY existing classes/components (no per-page <style>); keep JSX SWC-valid (escape literal '>' as {'>'}); do NOT change component behavior — only reorder doc sections + add the required RTL section. The RTL section is a <SubHead meta="RTL · العربية">RTL</SubHead> + a <Frame ... dir="rtl"> showing the real component under dir="rtl" (mirror a realistic example; for charts, render the chart inside a dir="rtl" container and note that axis/legend/labels flow RTL while the plotted series do not mirror). Keep it genuine, not boilerplate. Preserve all existing examples/content.`

const GROUPS = {
  primitives: ['badges', 'banner', 'copy-chip', 'count-up', 'pills', 'relative-time', 'status', 'trend'],
  forms: ['color-input', 'file-input', 'input', 'number-input', 'otp-input', 'textarea', 'input-group'],
}

phase('Fix pages')
const results = await parallel(Object.entries(GROUPS).map(([grp, slugs]) => () => agent(
  `Repo: ${REPO}. Fix the docs SECTION ORDER + add missing RTL on these pages (one file each: src/ds/migrated/<slug>.tsx): ${JSON.stringify(slugs)}.
${STD}

For EACH page:
- If it has Anatomy BEFORE Accessibility (e.g. "…Variants › Anatomy › Accessibility…"), REORDER so it is Accessibility → RTL → Anatomy.
- If it has NO RTL section (no <SubHead> with RTL / "Right-to-left"), ADD a real RTL section in the correct slot (after Accessibility, before Anatomy). For charts: a <Frame dir="rtl"> with the chart + a one-line note that axis/legend/labels flow RTL but series don't mirror. For idp/avatars: the component under dir="rtl" showing mirrored layout.
- Ensure the API reference (<AutoPropsTable>/<PropsTable> under the "API reference" SubHead) is the LAST section. If any section follows it (e.g. "Wiring it up" on ai/ask, "Spacing" on mobile/top-navigation), MOVE that section to BEFORE the API reference.
- SPECIAL — data.tsx: it has "Do / Don't" BEFORE "Accessibility/RTL". Reorder to: …Anatomy/Decision/Color → Accessibility → RTL → [Tables,progress,pagination] → Do/Don't → API reference (API last, Do/Don't after Accessibility/RTL).
- Do NOT touch pages not in your list. Keep every existing example. Verify each page still compiles (no stray tags).
Report, per page, what you reordered + whether you added RTL.`,
  { label: `docs:${grp}`, phase: 'Fix pages', agentType: 'design-system-engineer' },
)))

phase('Verify')
const verify = await agent(
  `Repo: ${REPO}. Verify the doc-section audit. Run + report:
1. npm run build  (Compiled successfully, 247 routes, .next/BUILD_ID present — if any page has a JSX/SWC error, FIX it)
2. npm run verify  (the touched routes render clean)
3. Re-run this section-order check and report the remaining flagged count (should be ~0 for the pages we fixed — charts/*, idp/*, avatars, data, ai/ask, mobile/top-navigation):
   node -e 'const fs=require("fs"),path=require("path");function walk(d,o){for(const n of fs.readdirSync(d)){const p=path.join(d,n);const s=fs.statSync(p);if(s.isDirectory())walk(p,o);else if(/\\.tsx$/.test(p))o.push(p);}return o;}const F=walk("src/ds/migrated",[]);for(const f of F){const src=fs.readFileSync(f,"utf8");const isC=(/<ComponentInstall|>Installation<\\/SubHead>|installTabs\\(/.test(src))&&(/AutoPropsTable|>API reference<\\/SubHead|<PropsTable/.test(src));if(!isC)continue;const h=[...src.matchAll(/<SubHead[^>]*>([^<][^]*?)<\\/SubHead>/g)].map(m=>m[1].replace(/\\s+/g," ").trim());const ix=re=>h.findIndex(x=>re.test(x));const dd=ix(/do *\\/ *don|don.?t/i),a=ix(/accessib|a11y/i),rtl=ix(/right-to-left|\\brtl\\b|العربية/i),an=ix(/anatomy/i),api=ix(/api|props/i);const iss=[];if(dd>=0&&a>=0&&dd<a)iss.push("DD<A11y");if(an>=0&&a>=0&&an<a)iss.push("Anatomy<A11y");if(api>=0&&api<h.length-1)iss.push("API-not-last");if(rtl<0)iss.push("no-RTL");if(iss.length)console.log(f.replace("src/ds/migrated/",""),iss.join(","));}'
Return a short verdict: build pass/fail, render pass/fail, and the remaining-flagged list (ideally empty for our pages).`,
  { label: 'verify', phase: 'Verify', agentType: 'design-system-engineer' },
)

return { results, verify }
