'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, Tool, ToolInput, ToolOutput, Lede, Mono } from '@/ds/core';

  const mono  = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' };

  // ─── demo content ───────────────────────────────────────────────────────
  const DEPLOY_ROWS = [
    { sha: '7c4f102', svc: 'identity-svc',  diff: '+12 / −3', when: '14:02' },
    { sha: '9a18bb0', svc: 'billing-svc',   diff: '+4 / −0',  when: '13:58' },
    { sha: 'a3e1d4c', svc: 'gateway',       diff: '+1 / −1',  when: '13:41' },
    { sha: 'fe92b0a', svc: 'marketing-cms', diff: '+38 / −4', when: '13:30' },
  ];
  const DeployTable = () => (
    <table className="tool-output-table">
      <thead>
        <tr><th>SHA</th><th>Service</th><th>Diff</th><th style={{ textAlign: 'end' }}>When</th></tr>
      </thead>
      <tbody>
        {DEPLOY_ROWS.map(r => (
          <tr key={r.sha}>
            <td className="t-mono" style={{ color: 'var(--ember)' }}>{r.sha}</td>
            <td>{r.svc}</td>
            <td className="t-mono" style={{ color: 'var(--fg-muted)' }}>{r.diff}</td>
            <td className="num">{r.when}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // ─── live demos ─────────────────────────────────────────────────────────
  // Cycle through the four states automatically so the page self-narrates.
  const LiveTool = () => {
    const states = ['input-streaming', 'input-available', 'output-available', 'output-error'];
    const dwell  = [1400, 1600, 4200, 3000];
    const [idx, setIdx] = React.useState(2);
    React.useEffect(() => {
      const id = setTimeout(() => setIdx(i => (i + 1) % states.length), dwell[idx]);
      return () => clearTimeout(id);
    }, [idx]);
    const state = states[idx];

    const params = { since: '24h', tier: 'T1', limit: 10 };
    return (
      <Tool name="listDeploys" ns="eidos.ai" state={state} ms={state.startsWith('output') ? 412 : undefined}>
        <ToolInput
          params={params}
          streaming={state === 'input-streaming'}
          paramsHint={state === 'input-streaming' ? 'streaming…' : '3 args'}
        />
        {state === 'output-available' && (
          <ToolOutput label="Output" meta={`${DEPLOY_ROWS.length} rows`}>
            <DeployTable/>
          </ToolOutput>
        )}
        {state === 'output-error' && (
          <ToolOutput label="Error" meta="HTTP 503">
            <div className="tool-err">
              <Icons.alert size={14}/>
              <div className="body">
                Upstream timeout calling <code>github.api/orgs/eidos/repos</code>. Retry after
                10s or fall back to the cached snapshot.
              </div>
            </div>
          </ToolOutput>
        )}
      </Tool>
    );
  };

  const InMessageDemo = () => (
    <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="t-mono-label">
        Eidos AI <span style={{ marginInline: 6, color: 'var(--fg-faint)' }}>·</span> just now
      </div>
      <Tool name="listDeploys" ns="eidos.ai" state="output-available" ms={412} defaultOpen>
        <ToolInput params={{ since: '24h', tier: 'T1', limit: 10 }}/>
        <ToolOutput label="Output" meta="4 rows"><DeployTable/></ToolOutput>
      </Tool>
      <div style={{
        padding: '10px 12px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10, borderEndStartRadius: 4,
        fontSize: 'var(--text-base)', color: 'var(--fg)', maxWidth: '92%',
      }}>
        Four deploys in the last 24h touched Tier-1 services — the most likely candidate for the spike is the <code style={mono}>identity-svc</code> diff at 14:02. Want me to pull its diff?
      </div>
    </div>
  );

  const SimpleVariant = ({ state }) => (
    <Tool name="listDeploys" ns="eidos.ai" state={state} ms={state.startsWith('output') ? 412 : undefined} defaultOpen={state.startsWith('output')}>
      <ToolInput
        params={{ since: '24h', tier: 'T1' }}
        streaming={state === 'input-streaming'}
      />
      {state === 'output-available' && (
        <ToolOutput label="Output" meta="4 rows"><DeployTable/></ToolOutput>
      )}
      {state === 'output-error' && (
        <ToolOutput label="Error" meta="HTTP 503">
          <div className="tool-err">
            <Icons.alert size={14}/>
            <div className="body">Upstream timeout calling <code>github.api</code>.</div>
          </div>
        </ToolOutput>
      )}
    </Tool>
  );

  // ─── code snippets ──────────────────────────────────────────────────────
  const USAGE_CODE = `<Tool>
  <ToolHeader name="listDeploys" type="eidos.ai.listDeploys" state="output-available"/>
  <ToolContent>
    <ToolInput input={{ since: "24h", tier: "T1", limit: 10 }}/>
    <ToolOutput output={<DeployTable rows={rows}/>} errorText={undefined}/>
  </ToolContent>
</Tool>`;

  const STATES_CODE = `<Tool state="input-streaming">…</Tool>
<Tool state="input-available">…</Tool>
<Tool state="output-available">…</Tool>
<Tool state="output-error">…</Tool>`;

  // ─── page ────────────────────────────────────────────────────────────────
export default function ToolPage() {
  return (
    <Section
      id="ai-tool"
      num="06"
      title="Tool"
      desc="One model tool call, made legible — inputs, live run-state, and result inside the thread. A collapsible block on a four-state machine (pending → running → done → error) that auto-opens when a result or error lands."
    >
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-tool')} ariaLabel="package manager"/>
      <Lede>Render the output in the right Eidos primitive — a Table, the Code highlighter, an Alert — never a bespoke tool style.</Lede>
      <Lede>
        Composes the <a href="/collapsible" style={{ color: 'var(--ember)' }}>Collapsible</a> primitive for the disclosure shell, the Eidos <Mono>Code</Mono> highlighter for JSON params, and the canonical <a href="/pills" style={{ color: 'var(--ember)' }}>pill</a> shape for the status badge (warning · ice · success · danger).
      </Lede>

      <SubHead meta="hello world · live">Usage</SubHead>
      <Frame label="auto-cycles through the four states — input-streaming → input-available → output-available → output-error" code={USAGE_CODE} height={320}>
        <LiveTool/>
      </Frame>

      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      <SubHead meta="4 states">State machine</SubHead>
      <Frame label="from top — pending · running · done · error" code={STATES_CODE} height={760}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
          <SimpleVariant state="input-streaming"/>
          <SimpleVariant state="input-available"/>
          <SimpleVariant state="output-available"/>
          <SimpleVariant state="output-error"/>
        </div>
      </Frame>
      <Lede>
        Status pills reuse the four semantic colour pairs from <Mono>tokens.css</Mono> — never a custom hex per tool. <i>Done</i> and <i>error</i> auto-open the body so the user can scan results without an extra click; the other two stay collapsed.
      </Lede>

      <SubHead meta="composition · inside a Message">Inside an assistant turn</SubHead>
      <Frame label="tool call above · assistant reply below — the model uses the result to write the answer" height={400}>
        <InMessageDemo/>
      </Frame>
      <Lede>
        Tool calls live <i>inside</i> the assistant <a href="/ai/message" style={{ color: 'var(--ember)' }}>Message</a> — they're not a separate row in the thread. Stack the tool above the answer text so the call is visible before the conclusion that depends on it.
      </Lede>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The header is a single <code className="t-mono">&lt;button&gt;</code>: Tab reaches it, Enter/Space toggles the body, and a user toggle overrides the auto open/collapse from then on. Once expanded, the input/output sections are reading content — Tab continues to any links or retry control inside the output, never trapping focus in the disclosure.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The header carries <code className="t-mono">aria-expanded</code> and the collapsed body is <code className="t-mono">aria-hidden</code>. The status pill is real text ("Pending", "Running", "Done", "Error"), not colour alone; the running and done/error transitions sit in an <code className="t-mono">aria-live="polite"</code> region so "Done · 412 ms" or "Error · HTTP 503" is announced as the call resolves. The streaming input shimmer is decorative (<code className="t-mono">aria-hidden</code>), and the output table ships real <code className="t-mono">&lt;th&gt;</code> headers.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The header shows a 2px inset ember focus ring. Each status pill pairs an icon (or pulsing dot) with its text label and uses the dedicated <code className="t-mono">--status-*</code> token on its soft fill at AA — run-state never rests on hue alone. Mono params on <code className="t-mono">--fg-muted</code> and the danger error card clear AA against the panel.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Under <code className="t-mono">prefers-reduced-motion</code> the running status dot stops pulsing (steady fill), the input shimmer skeleton holds static, and the body opens/closes instantly rather than animating its max-height.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — icon flips to start, chevron + status mirror" height={300}>
        <div dir="rtl" style={{ width: '100%' }}>
          <Tool name="listDeploys" ns="eidos.ai" state="output-available" ms={412} defaultOpen>
            <ToolInput params={{ since: '24h', tier: 'T1' }}/>
            <ToolOutput label="النتائج" meta="4 سطور">
              <DeployTable/>
            </ToolOutput>
          </Tool>
        </div>
      </Frame>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 520 }} aria-hidden="true">
              <Tool name="listDeploys" ns="eidos.ai" state="output-available" ms={412} defaultOpen>
                <ToolInput params={{ since: '24h' }}/>
                <ToolOutput label="Output" meta="4 rows"><DeployTable/></ToolOutput>
              </Tool>
              <span className="lead h" style={{ top: 18, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 18, right: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 70, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 160, left: -32, width: 28 }}/>
              <div className="pin" style={{ top: 10, left: -54 }}>1</div>
              <div className="pin" style={{ top: 10, right: -54 }}>2</div>
              <div className="pin" style={{ top: 62, left: -54 }}>3</div>
              <div className="pin" style={{ top: 152, left: -54 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Header.</b> Icon tile + namespaced name in mono. The full tool path (<Mono>eidos.ai.listDeploys</Mono>) reads like an import, never a label.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Status + duration.</b> Pill colour maps to the four-state machine; <Mono>--success</Mono>, <Mono>--accent-2</Mono>, <Mono>--warning</Mono>, <Mono>--danger</Mono>. Duration in mono <Mono>ms</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Input section.</b> Formatted JSON of the params the model called the tool with. While streaming, shimmer placeholders fill the slot.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Output section.</b> Rendered any way the tool wants — table, code, paragraph, error card. Reuses existing Eidos primitives, never bespoke.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — auto-open when the result lands</div>
          <div className="body" style={{ padding: 14 }}>
            <SimpleVariant state="output-available"/>
          </div>
          <div className="note">The user shouldn't have to click to see what their question produced. Open on done, keep folded only while pending.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — hide errors behind a closed header</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="tool">
              <div className="tool-head">
                <span className="ico"><Icons.zap size={13}/></span>
                <span className="name"><span className="ns">eidos.ai.</span>listDeploys</span>
                <span className="tool-status error"><Icons.alert size={10}/>Error</span>
                <Icons.chevronDown size={13} className="chev"/>
              </div>
            </div>
          </div>
          <div className="note">A collapsed error is no error. Auto-open the body when state = output-error.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — render the result in the right Eidos primitive</div>
          <div className="body" style={{ padding: 14 }}>
            <SimpleVariant state="output-available"/>
          </div>
          <div className="note">A table goes in <Mono>&lt;table className="tool-output-table"/&gt;</Mono>. JSON in the Code highlighter. A paragraph in plain text. Reuse the system.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — invent a special "tool table" style</div>
          <div className="body" style={{ padding: 14, gap: 0 }}>
            <div style={{ width: '100%', background: 'color-mix(in srgb, var(--accent-3) 22%, var(--bg))', border: '1px solid var(--accent-3)', padding: 10, borderRadius: 'var(--radius-xl)', color: 'color-mix(in srgb, var(--accent-3) 55%, white)', fontSize: 12, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
              <div style={{ fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-sans)' }}>Result</div>
              <div>7c4f102 · identity-svc · +12/−3</div>
              <div>9a18bb0 · billing-svc · +4/−0</div>
            </div>
          </div>
          <div className="note">Off-token surfaces fragment the system. Pull the existing Table / Code / Alert primitives instead.</div>
        </div>
      </div>

      <SubHead meta="ToolProps">API reference</SubHead>
      <AutoPropsTable component="Tool" label="<Tool />"/>
      <PropsTable
        label="<ToolInput />"
        rows={[
          { prop: 'params', type: 'object', required: true, description: 'Tool input args. Rendered as syntax-highlighted JSON.' },
          { prop: 'streaming', type: 'boolean', default: 'false', description: 'When true, swap the JSON for shimmer placeholders.' },
          { prop: 'paramsHint', type: 'string', default: undefined, description: 'Right-aligned meta text — e.g. "3 args" or "streaming…".' },
        ]}
      />
      <PropsTable
        label="<ToolOutput />"
        rows={[
          { prop: 'label', type: 'string', default: '"Output"', description: 'Section label. Switch to "Error" when state = output-error.' },
          { prop: 'meta', type: 'string', default: undefined, description: 'Right-aligned meta — row count, HTTP status, etc.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Rendered result. Use Eidos primitives — Table, Code, plain prose, error card.' },
        ]}
      />
    </Section>
  );
}
