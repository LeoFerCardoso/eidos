'use client';
// Eidos DS — Components / DiffViewer
// The real diffs.com engine (@pierre/diffs): Shiki syntax highlighting,
// word-level intra-line diffs, split/unified, hunk separators — re-skinned to
// Eidos tokens (colours + typography only) via the `--diffs-*` custom props.
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, Lede, Mono } from '@/ds/core';
import { PierreDiff } from '@/components/pierre-diff';

const intro = { fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 0, marginBottom: 30, lineHeight: 1.65, maxWidth: 'none' };

// deploy.ts — a real edit: config gains a `target` arg and a quality-gate guard.
const OLD = {
  name: 'deploy.ts',
  contents: `export async function deploy(service, target) {
  const cfg = await loadConfig(service);
  if (!cfg) throw new Error("missing config");
  return rollout({ service, target, cfg });
}
`,
};
const NEW = {
  name: 'deploy.ts',
  contents: `export async function deploy(service, target) {
  const cfg = await loadConfig(service, target);
  if (!cfg) throw new Error("missing config");
  const gate = await runQualityGates(service);
  if (!gate.ok) throw new GateError(gate);
  return rollout({ service, target, cfg });
}
`,
};

// A SQL migration — single-language file, all additions.
const SQL_OLD = { name: '0042_add_quality_gate.sql', contents: `` };
const SQL_NEW = {
  name: '0042_add_quality_gate.sql',
  contents: `ALTER TABLE deploys
  ADD COLUMN quality_gate_score INTEGER NOT NULL DEFAULT 0;
CREATE INDEX idx_deploys_gate_score ON deploys(quality_gate_score);
`,
};

const USAGE = `import { PierreDiff } from "@/components/pierre-diff"

<PierreDiff
  toolbar                       // live diffs.com-style control bar
  oldFile={{ name: "deploy.ts", contents: oldSource }}
  newFile={{ name: "deploy.ts", contents: newSource }}
/>`;

// A long file with scattered edits — the unchanged runs between changes collapse
// into expandable "N unmodified lines" separators (hunkSeparators="line-info").
const FLAG_LINES = [
  "  'deploy.canary': true,",
  "  'deploy.blue-green': false,",
  "  'deploy.auto-rollback': true,",
  "  'deploy.freeze-window': false,",
  "  'deploy.progressive': true,",
  "  'pipeline.parallel': true,",
  "  'pipeline.cache': true,",
  "  'pipeline.matrix': false,",
  "  'pipeline.required-checks': true,",
  "  'pipeline.artifact-signing': true,",
  "  'catalog.search-v2': true,",
  "  'catalog.ownership': true,",
  "  'catalog.scorecards': false,",
  "  'catalog.dependencies': true,",
  "  'catalog.api-docs': true,",
  "  'incident.autopage': true,",
  "  'incident.timeline': true,",
  "  'incident.postmortem': false,",
  "  'incident.statuspage': true,",
  "  'incident.runbooks': true,",
  "  'idp.golden-paths': true,",
  "  'idp.cost-insights': false,",
  "  'idp.slo-budgets': true,",
  "  'idp.self-service': true,",
  "  'idp.templates': true,",
  "  'security.secret-scan': true,",
  "  'security.sast': true,",
  "  'security.dependency-audit': true,",
  "  'security.sbom': false,",
  "  'ai.assistant': false,",
  "  'ai.autoreview': false,",
  "  'ai.summaries': true,",
];
const flagsFile = (lines: string[]) => ({
  name: 'feature-flags.ts',
  contents: `// Eidos platform feature flags — evaluated at boot.\nexport const FLAGS = {\n${lines.join('\n')}\n} as const;\n`,
});
const FLAGS_OLD = flagsFile(FLAG_LINES);
// Three edits, far apart, so the long unchanged runs between them collapse.
const FLAGS_NEW = flagsFile(
  FLAG_LINES
    .map((l) => l.replace("'deploy.freeze-window': false,", "'deploy.freeze-window': true,"))
    .map((l) => l.replace("'incident.postmortem': false,", "'incident.postmortem': true,"))
    .map((l) => l.replace("'ai.assistant': false,", "'ai.assistant': true,"))
    .map((l) => l.replace("'ai.autoreview': false,", "'ai.autoreview': true,"))
    .concat(["  'ai.changelog': true,"]),
);

// Annotations — a JWT helper gaining a role claim, with a review thread attached.
const AUTH_OLD = {
  name: 'auth.py',
  contents: `from typing import Optional
import jwt, time

SECRET_KEY = "your-secret-key"

def create_token(user_id: str, expires_in: int = 3600) -> str:
    payload = {
        "sub": user_id,
        "exp": time.time() + expires_in,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
`,
};
const AUTH_NEW = {
  name: 'auth.py',
  contents: `from typing import Optional
import jwt, time

SECRET_KEY = "your-secret-key"

def create_token(user_id: str, role: str = "user", expires_in: int = 3600) -> str:
    payload = {
        "sub": user_id,
        "role": role,
        "exp": time.time() + expires_in,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
`,
};
const REVIEW = {
  comments: [
    { who: 'You', when: '3h', text: 'Should we validate the role parameter? We could restrict it to a set of allowed values.' },
    { who: 'Amadeus', when: '2h', text: 'Good idea — maybe a Literal type or an enum.' },
    { who: 'Mark', when: '2h', text: 'Agreed, and update verify_token to return the role too.' },
  ],
};
const AUTH_ANNOTATIONS = [{ side: 'additions', lineNumber: 9, metadata: REVIEW }];

// A Eidos-styled review thread, rendered under the annotated line. Inline styles
// (token vars) so it renders identically whether slotted in light or shadow DOM.
function CommentThread({ comments }: { comments: { who: string; when: string; text: string }[] }) {
  const ink = (s: string) => {
    let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return `var(--viz-cat-${(h % 12) + 1})`;
  };
  return (
    <div style={{ margin: '6px 0 10px', padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font-sans, system-ui)' }}>
      <div style={{ display: 'grid', gap: 12 }}>
        {comments.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginInlineStart: i === 0 ? 0 : 18 }}>
            <span aria-hidden style={{ flex: 'none', inlineSize: 22, blockSize: 22, borderRadius: 999, display: 'grid', placeItems: 'center', background: ink(c.who), color: 'var(--bg)', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{c.who[0]}</span>
            <div>
              <div style={{ fontSize: 'var(--text-xs)' }}>
                <b style={{ color: 'var(--fg)' }}>{c.who}</b>
                <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6, fontFamily: 'var(--font-mono)' }}>{c.when}</span>
              </div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5, marginTop: 2 }}>{c.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, marginInlineStart: 18, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
        <span style={{ color: 'var(--ice)' }}>↳ Add reply…</span>
        <span style={{ color: 'var(--fg-muted)' }}>Resolve</span>
      </div>
    </div>
  );
}

export default function DiffViewerPage() {
  return (
    <Section id="diff-viewer" title="Diff viewer" desc="The diffs.com engine (@pierre/diffs), re-skinned to Eidos — Shiki syntax highlighting, word-level intra-line diffs, split or unified layout, and collapsible hunks.">
      <p style={intro}>It computes the diff straight from the before/after file contents — built for PR detail pages, deploy previews, and agent-proposed-change cards. Eidos themes <b style={{color:'var(--fg)'}}>only colours and typography</b> through the library's <Mono>--diffs-*</Mono> custom properties: additions take Eidos success, deletions take danger, code is Geist Mono. The diff logic and layout are the library's, untouched.</p>

      <SubHead meta="package">Installation</SubHead>
      <TabbedCode tabs={installTabs('diff-viewer', '@pierre/diffs')} ariaLabel="package manager"/>
      <Lede>Pass <Mono>oldFile</Mono> and <Mono>newFile</Mono> — each <Mono>{`{ name, contents }`}</Mono>. The engine infers the language from the filename for syntax highlighting and computes the diff, so changed lines get <b style={{color:'var(--fg)'}}>word-level highlighting</b> automatically — only the tokens that actually changed light up.</Lede>

      <SubHead meta="hello world · live controls">Usage</SubHead>
      <Frame label="toolbar · syntax highlight · per-word highlight on the changed line" code={USAGE}>
        <PierreDiff toolbar oldFile={OLD} newFile={NEW}/>
      </Frame>
      <Lede>Toggle <b style={{color:'var(--fg)'}}>Unified / Split</b> and <b style={{color:'var(--fg)'}}>Wrap</b> in place. Drop <Mono>toolbar</Mono> to render a fixed variant (below).</Lede>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>Variants</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="single column · default">Unified</SubHead>
      <Frame label="diffStyle='unified' · old + new line numbers · per-row tint">
        <PierreDiff diffStyle="unified" oldFile={OLD} newFile={NEW}/>
      </Frame>

      <SubHead meta="side-by-side · for wide surfaces">Split</SubHead>
      <Frame label="diffStyle='split' · deletions left · additions right">
        <PierreDiff diffStyle="split" oldFile={OLD} newFile={NEW}/>
      </Frame>
      <Lede>Split needs the width to stay legible — default to unified inside sidesheets and drawers (&lt;720px).</Lede>

      <SubHead meta="schema migration · all additions">Single language</SubHead>
      <Frame label="a SQL migration — syntax highlighting follows the .sql filename">
        <PierreDiff diffStyle="unified" oldFile={SQL_OLD} newFile={SQL_NEW}/>
      </Frame>

      <SubHead meta="collapsed context · expandable">Hunk separators</SubHead>
      <Frame label="unchanged runs collapse to `N unmodified lines` — click a separator to expand">
        <PierreDiff diffStyle="split" hunkSeparators="line-info" oldFile={FLAGS_OLD} newFile={FLAGS_NEW}/>
      </Frame>
      <Lede>Long files collapse the unchanged regions by default, so a review stays focused on the edits. Each separator counts the hidden lines and expands on click (up/down to grow from either edge).</Lede>

      <SubHead meta="line comments · CI annotations">Comments &amp; annotations</SubHead>
      <Frame label="lineAnnotations + renderAnnotation — inject a review thread under any line">
        <PierreDiff diffStyle="unified" oldFile={AUTH_OLD} newFile={AUTH_NEW}
          lineAnnotations={AUTH_ANNOTATIONS}
          renderAnnotation={(a: any) => <CommentThread comments={a.metadata.comments}/>}/>
      </Frame>
      <Lede>Pass <Mono>lineAnnotations</Mono> (each <Mono>{`{ side, lineNumber, metadata }`}</Mono>) and a <Mono>renderAnnotation</Mono> that returns your own React — line comments, CI findings, AI review notes. The thread here is composed from Eidos tokens.</Lede>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The diff is a scroll region reachable with <code>Tab</code> and pannable with the arrow keys / <code>PageUp</code> / <code>PageDown</code>. The toolbar buttons are real <code>&lt;button&gt;</code>s with <code>aria-pressed</code>, reachable and toggled from the keyboard.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Add / delete is encoded several ways at once — a coloured change bar (<code>bars</code> indicators), the asymmetric old/new line numbers, and the row tint — so the diff is readable in greyscale or with colour-blindness. The Eidos success/danger tints meet AA against the mono code on top of them.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Density &amp; focus</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Dense mono rows; default to <code>unified</code> below ~720px. Turn on <code>wrap</code> for long YAML / commit bodies rather than forcing horizontal scroll on a narrow surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Layout swaps (unified ⇄ split) are instant — no animated reflow that could disorient. Syntax highlighting loads once on mount; there is no flashing re-tokenise on scroll.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — the toolbar and file header follow the reading direction; the code body stays LTR'>
        <div dir="rtl">
          <PierreDiff diffStyle="unified" oldFile={OLD} newFile={NEW}/>
        </div>
      </Frame>
      <Lede>
        Wrapping the viewer in <Mono>dir="rtl"</Mono> flips the toolbar controls and the file-header text to align from the right — the Eidos chrome respects the container direction. The code body (line numbers, gutter, syntax tokens) retains its left-to-right orientation because source code is a language-agnostic technical artefact, not natural prose.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 460, pointerEvents: 'none' }} aria-hidden="true">
              <PierreDiff diffStyle="unified" oldFile={OLD} newFile={NEW}/>
              {/* Pin 1 — file/hunk header */}
              <span className="lead v" style={{ top: -24, left: 80, height: 20 }}/>
              <div className="pin" style={{ top: -46, left: 80, transform: 'translateX(-50%)' }}>1</div>
              {/* Pin 2 — addition line */}
              <span className="lead h" style={{ top: 82, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 70, right: -54 }}>2</div>
              {/* Pin 3 — deletion line */}
              <span className="lead h" style={{ top: 57, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 45, right: -54 }}>3</div>
              {/* Pin 4 — line number gutter */}
              <span className="lead v" style={{ top: -24, left: 20, height: 20 }}/>
              <div className="pin" style={{ top: -46, left: 20, transform: 'translateX(-50%)' }}>4</div>
              {/* Pin 5 — word-level highlight */}
              <span className="lead v" style={{ bottom: -24, left: '50%', height: 20, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: -46, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>File header.</b> Filename + hunk range (<Mono>@@ -N,N +N,N @@</Mono>). Mono, <Mono>--fg-faint</Mono>. Theming via <Mono>--diffs-hunk-header-color</Mono> — Eidos sets this once in <Mono>ds.css</Mono>.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Addition line.</b> Full-row Eidos success tint (<Mono>--diffs-bg-addition</Mono>) with a <Mono>+</Mono> change bar. Changed tokens inside the line get a stronger highlight — only the words that differ light up.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Deletion line.</b> Full-row Eidos danger tint (<Mono>--diffs-bg-deletion</Mono>) with a <Mono>−</Mono> change bar. Encoding is redundant: tint + bar + asymmetric line numbers, so it reads in greyscale.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Line number gutter.</b> Old and new numbers side by side, <Mono>--fg-faint</Mono> mono tabular. Blank on the side where the line doesn't exist (deletion has no new number; addition has no old number).</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Word-level highlight.</b> The engine isolates the exact tokens that changed within a modified line. Only those tokens get the stronger word-diff tint (<Mono>--diffs-word-addition</Mono> / <Mono>--diffs-word-deletion</Mono>).</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — feed real before/after file contents</div>
          <div className="body" style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)' }}>{`oldFile={{ name, contents }}`}</div>
          <div className="note">The engine computes the diff and infers the language from the filename. Name files with the right extension so syntax highlighting kicks in.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — override the diff colours per-instance</div>
          <div className="body" style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)' }}>style={`{{ '--diffs-bg-addition-override': 'lime' }}`} ❌</div>
          <div className="note">Addition/deletion colours are set once, from Eidos success/danger, in ds.css. Re-tinting per instance breaks the system's status semantics.</div>
        </div>
      </div>

      <SubHead meta="PierreDiffProps">API reference</SubHead>
      <PropsTable
        label="<PierreDiff />"
        rows={[
          { prop: 'oldFile', type: '{ name, contents, lang? }', description: 'Before state. `name` infers the syntax-highlight language.' },
          { prop: 'newFile', type: '{ name, contents, lang? }', description: 'After state. The engine diffs old → new.' },
          { prop: 'diffStyle', type: '"unified" | "split"', default: '"unified"', description: 'Single column vs. side-by-side. Initial value when toolbar is on.' },
          { prop: 'wrap', type: 'boolean', default: 'false', description: 'Wrap long lines (maps to overflow: "wrap").' },
          { prop: 'indicators', type: '"bars" | "classic" | "none"', default: '"bars"', description: 'Change marker style: gutter bar, +/− signs, or none.' },
          { prop: 'lineNumbers', type: 'boolean', default: 'true', description: 'Show the old/new line-number gutters.' },
          { prop: 'backgrounds', type: 'boolean', default: 'true', description: 'Full-row add/delete tint (off = bar/sign only).' },
          { prop: 'hunkSeparators', type: '"line-info" | "simple" | "metadata" | "line-info-basic"', description: 'Style of the collapsed-context separators. Long files collapse by default.' },
          { prop: 'lineAnnotations', type: 'Annotation[]', description: 'Each: { side, lineNumber, metadata } — pairs with renderAnnotation.' },
          { prop: 'renderAnnotation', type: '(a) => ReactNode', description: 'Render your own content (comments, CI findings) under a line.' },
          { prop: 'toolbar', type: 'boolean', default: 'false', description: 'Render the live control bar; the viewer owns layout/indicator/toggle state.' },
          { prop: 'theme', type: 'string', default: '"forge"', description: 'Shiki theme for syntax tokens (Eidos data-viz palette). Diff chrome is themed via Eidos tokens regardless.' },
        ]}
      />
      <Lede>Built on <Mono>@pierre/diffs</Mono> (the engine behind <a href="https://diffs.com" target="_blank" rel="noreferrer" style={{color:'var(--ice)'}}>diffs.com</a>). Eidos sets only the <Mono>--diffs-*</Mono> colour + font custom properties in <Mono>ds.css</Mono>; the diff logic and layout are the library's.</Lede>
    </Section>
  );
}
