'use client';
// Eidos DS — Components / JSONInspector
// Collapsible JSON tree with colour-coded primitives.
import { AutoPropsTable, Frame, Section, SubHead, TabbedCode, installTabs, JSONInspector, Icons, Lede, Mono } from '@/ds/core';


const PAYLOAD = {
  service: 'pix-router',
  version: '2.7.0',
  deploy: {
    id: 'D-9182',
    stage: 'Ring 2',
    progress: 62,
    gates: { sast: 'ok', risk: 18, canary: 'running' },
    rings: [
      { name: 'Ring 0', traffic: 1.0, healthy: true },
      { name: 'Ring 1', traffic: 1.0, healthy: true },
      { name: 'Ring 2', traffic: 0.62, healthy: true },
    ],
  },
  owner: { tribe: 'Pix', lead: 'Rafael Mendonça' },
  dependencies: ['ledger-svc', 'bureau-gateway', 'event-bus'],
  flags: { idempotency: true, batch_writes: false, audit_log: true },
  tags: null,
};

const AGENT_TRACE = {
  agent: 'pr-reviewer',
  model: 'gpt-4o',
  input: 'review PR #7421',
  tools: [
    { name: 'github_pull', args: { number: 7421 }, latency_ms: 142 },
    { name: 'semantic_search', args: { query: 'idempotency keys' }, hits: 4 },
    { name: 'risk_score', args: { pr: 7421 }, output: { score: 34, verdict: 'low' } },
  ],
  tokens: { input: 1842, output: 412 },
  cost_usd: 0.018,
};

const USAGE = `import { JSONInspector } from "@/components/forge/json-inspector"

<JSONInspector data={{ service: 'pix-router', version: '2.7.0' }} />`;

export default function Page() {
  return (
    <Section id="json-inspector" title="JSON inspector" desc="Collapsible, colour-coded JSON tree for API payloads, LLM agent traces, webhook bodies, and deploy manifests. Keys ember, strings green, numbers cyan, booleans warm, null muted. Click any branch to fold.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('json-inspector')} ariaLabel="package manager"/>
      <Lede>Recursive — handles arbitrarily nested structures. Default state expands everything; pass <Mono>defaultCollapsedPaths</Mono> to start branches folded.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Expands everything by default — verbose branches should ship folded via <Mono>defaultCollapsedPaths</Mono> so the reader opens only what they came for. Colour is a scanning aid; the literal text carries the meaning so the tree reads without syntax highlighting.</Lede>
      <Frame label="deploy payload" code={USAGE}>
        <JSONInspector data={PAYLOAD}/>
      </Frame>

      <SubHead meta="agent trace">Agent trace</SubHead>
      <Frame label="LLM tool-use trace — ideal companion of the Agent / Tool pages">
        <JSONInspector data={AGENT_TRACE}/>
      </Frame>

      <SubHead meta="collapsed">Start collapsed</SubHead>
      <Frame label="defaultCollapsedPaths hides verbose branches on initial render">
        <JSONInspector data={PAYLOAD} defaultCollapsedPaths={['$.deploy.rings','$.deploy.gates','$.dependencies','$.flags']}/>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Lede>A branch is expanded, collapsed, or empty; a bare value is the fourth render mode. All four are shown below. A collapsed branch keeps its opening bracket and item count so the shape stays legible folded; an empty object or array renders as a bare <Mono>{'{ }'}</Mono> / <Mono>{'[ ]'}</Mono> with no toggle, because there is nothing to disclose.</Lede>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <Frame label="expanded — full tree open (default)">
          <JSONInspector data={{ gates: PAYLOAD.deploy.gates, dependencies: PAYLOAD.dependencies }}/>
        </Frame>
        <Frame label="collapsed — bracket + item count, no children">
          <JSONInspector data={{ gates: PAYLOAD.deploy.gates, dependencies: PAYLOAD.dependencies }} defaultCollapsedPaths={['$.gates','$.dependencies']}/>
        </Frame>
        <Frame label="empty — no toggle, nothing to disclose">
          <JSONInspector data={{ rings: [], gates: {}, tags: null }}/>
        </Frame>
        <Frame label="primitive — a bare value renders inline, untoggleable">
          <JSONInspector data={'2.7.0'}/>
        </Frame>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Keyboard</div>
          <dl className="kv-map" style={{margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            <div style={{display: 'flex', gap: 10, marginBottom: 4}}><dt style={{flex: '0 0 96px'}}><Mono>Tab</Mono> / <Mono>Shift+Tab</Mono></dt><dd style={{margin: 0}}>Move to the next / previous fold control. Each <Mono>{'{ }'}</Mono> or <Mono>{'[ ]'}</Mono> bracket is a tab stop; leaf rows are not.</dd></div>
            <div style={{display: 'flex', gap: 10}}><dt style={{flex: '0 0 96px'}}><Mono>Enter</Mono> / <Mono>Space</Mono></dt><dd style={{margin: 0}}>Toggle the focused branch open or closed.</dd></div>
          </dl>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBlockStart: 8}}>Only the bracket glyph is the <Mono>{'<button>'}</Mono>; the key and value beside it are selectable text, so any key or value copies without a mouse. There is no arrow-key tree traversal — the tree is a flat sequence of disclosure controls.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each branch toggle exposes <Mono>aria-expanded</Mono>, and its accessible name is the bracket glyph it wraps — collapsed branches read as <Mono>{'{ … 3 }, collapsed, button'}</Mono>, so the item count is announced while the key (<Mono>"deploy"</Mono>) is read just before it as the adjacent text. Type is conveyed in the literal text (the key/value pair reads as written), never by colour alone, so the structure is navigable without seeing the syntax highlighting.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The ember / green / cyan / amber value colours are a scanning aid, not the signal — the literal text (<Mono>"running"</Mono>, <Mono>true</Mono>, <Mono>null</Mono>) carries the meaning. The structural colours (keys, strings, numbers, booleans) meet AA against the inspector's surface; <Mono>null</Mono> is rendered muted (<Mono>--fg-muted</Mono>) and stays legible, but type is never conveyed by colour alone.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Density &amp; focus</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Dense indented rows keep the canonical focus ring (<Mono>--ring</Mono>) on the focused bracket toggle — it inherits the global <Mono>button:focus-visible</Mono> outline, never <Mono>outline:none</Mono>. Ship large arrays and verbose branches folded via <Mono>defaultCollapsedPaths</Mono> so the keyboard path to a deep value stays short. Fold / unfold is an instant state change with no motion to suppress.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — keys and fold carets anchor to the right; indentation and values flow rightward'>
        <div dir="rtl" style={{ maxWidth: 360 }}>
          <JSONInspector
            data={{ الخدمة: 'pix-router', الإصدار: '2.7.0', النشر: { المرحلة: 'Ring 2', التقدم: 62 }, الأعلام: { idempotency: true, batch_writes: false }, العلامات: null }}
            defaultCollapsedPaths={['$.النشر']}
          />
        </div>
      </Frame>
      <Lede>
        The tree uses logical CSS for indentation and border placement, so under <Mono>dir="rtl"</Mono> the fold carets appear on the right, keys align from the right, and child branches indent from the right — the reading direction reflects the locale. Colour encoding (ember keys, green strings, cyan numerals) is unchanged.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 360 }} aria-hidden="true">
              <JSONInspector
                data={{ service: 'pix-router', version: '2.7.0', deploy: { stage: 'Ring 2', progress: 62 }, flags: { idempotency: true, batch_writes: false }, tags: null }}
                defaultCollapsedPaths={['$.deploy']}
              />
              {/* Pin 1 — key (ember) */}
              <span className="lead h" style={{ top: 10, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: -2, left: -54 }}>1</div>
              {/* Pin 2 — string value */}
              <span className="lead h" style={{ top: 35, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 23, right: -54 }}>2</div>
              {/* Pin 3 — numeric value */}
              <span className="lead h" style={{ top: 57, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 45, right: -54 }}>3</div>
              {/* Pin 4 — fold caret on collapsed branch */}
              <span className="lead h" style={{ top: 80, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 68, left: -54 }}>4</div>
              {/* Pin 5 — null value */}
              <span className="lead v" style={{ bottom: -24, left: '50%', height: 20, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: -46, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Key.</b> Always <Mono>var(--ember)</Mono> — the one consistent structural colour across all tree depths. Identifies the property name; reads in both light and dark surfaces.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>String value.</b> Eidos success green — picks a hue far from ember so keys and values are immediately distinguishable. Quoted in the display; selectable as plain text for easy copy.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Number / boolean value.</b> Cyan (<Mono>--ice</Mono>) for numerics, warm amber (<Mono>--warning</Mono>) for booleans. Each primitive type gets its own hue — not arbitrary, but mapped once in the inspector's token sheet so overrides are a one-line change.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Fold toggle.</b> The bracket glyph on any <Mono>{'{ }'}</Mono> or <Mono>{'[ ]'}</Mono> branch is the <Mono>{'<button>'}</Mono> — collapsed, it shows the opening bracket + item count (<Mono>{'{ … 3 }'}</Mono>) so the shape is visible without expanding. The key and values beside it are sibling selectable text, not part of the hit target.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Null.</b> <Mono>--fg-muted</Mono> — the quietest colour in the set, intentionally de-emphasised. The absence of a value carries no status tint; the literal text <Mono>null</Mono> is sufficient. It is the muted (not faint) tier, so the word stays legible against the inspector surface.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — collapse big arrays by default</div>
          <div className="body" style={{padding:0}}><JSONInspector data={{ rows: PAYLOAD.deploy.rings }} defaultCollapsedPaths={['$.rows']}/></div>
          <div className="note">A 200-item array dumped open is noise. Let the user open what they need.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use for non-JSON</div>
          <div className="body" style={{padding:0, color:'var(--fg-faint)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>
            <pre style={{margin:0}}>HTTP/1.1 200 OK{'\n'}content-type: application/json{'\n'}server: eidos-edge</pre>
          </div>
          <div className="note">Use a plain code block for headers, logs, or unstructured strings.</div>
        </div>
      </div>

      <SubHead meta="JSONInspectorProps">API reference</SubHead>
      <AutoPropsTable component="JSONInspector" label="<JSONInspector />"/>
    </Section>
  );
}
