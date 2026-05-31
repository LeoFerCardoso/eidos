'use client';
// Eidos Charts — Foundations / Colors. The data-visualization palette, relocated here from
// the core Color page: categorical, sequential, diverging, plus the chart chrome tokens.
import { Section, SubHead, Frame, Icons, EidosChart, EidosTooltipContent, useChartColors, eidosGridProps, eidosXAxisProps, eidosYAxisProps, Recharts, Mono, Lede } from '@/ds/core';

const { BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

// Categorical multi-series — requests per service over a week.
const CAT = Array.from({ length: 7 }, (_, d) => ({ d: 'd' + (d + 1), api: 140 + d * 8, auth: 80 + d * 4, kyc: 40 + d * 2 }));
// Diverging — cost variance per service (signed, centred on zero).
const DIV = [{ n: 'api', v: 8 }, { n: 'auth', v: -4 }, { n: 'kyc', v: 12 }, { n: 'pix', v: -9 }, { n: 'fraud', v: 5 }];

export default function ChartsColors() {
  const c = useChartColors();
  return (
    <Section id="colors" num="01" title="Colors"
      desc="The data-visualization palette — categorical, sequential, and diverging ramps plus grid, axis, and tooltip chrome tokens. Series read --viz-* tokens directly; they never hand-pick a hex value.">

      <SubHead meta="12 hues · single + multi-series">Categorical</SubHead>
      <Lede up>
        Order is meaningful: <Mono>--viz-cat-1..4</Mono> carry the most weight (single- and dual-series defaults) and lead with ember. Picked to be perceptually distinct at small dot sizes on dark surfaces. Cap a chart at the first few — past ~6 categories, adjacent hues stop being distinguishable; switch to grouping or a sequential encoding instead.
      </Lede>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
          <div key={n} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 10, textAlign: 'center' }}>
            <div style={{ height: 36, borderRadius: 'var(--radius-sm)', background: `var(--viz-cat-${n})`, marginBottom: 8 }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ember)' }}>--viz-cat-{n}</div>
          </div>
        ))}
      </div>

      <SubHead meta="one hue, low → high">Sequential</SubHead>
      <Lede up>
        For ordered magnitude — heatmaps, density, a single metric ramping up. Interpolate between <Mono>--viz-seq-low</Mono> and <Mono>--viz-seq-high</Mono>; the value carries the meaning, so don't reuse it for unordered categories.
      </Lede>
      <Frame label="--viz-seq-low → --viz-seq-mid → --viz-seq-high">
        <div style={{ height: 48, width: '100%', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(90deg, var(--viz-seq-low), var(--viz-seq-mid), var(--viz-seq-high))', border: '1px solid var(--border)' }} />
      </Frame>

      <SubHead meta="centred on zero">Diverging</SubHead>
      <Lede up>
        For metrics centred on a meaningful midpoint — perf delta, cost variance, budget burn. Negative reads danger, positive reads success, with a neutral zero so the sign is unmistakable.
      </Lede>
      <Frame label="--viz-div-neg ← --viz-div-zero → --viz-div-pos">
        <div style={{ height: 48, width: '100%', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(90deg, var(--viz-div-neg), var(--viz-div-zero), var(--viz-div-pos))', border: '1px solid var(--border)' }} />
      </Frame>

      <SubHead meta="grid · axis · tooltip">Chart chrome</SubHead>
      <table className="spec">
        <thead><tr><th>Token</th><th>Role</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">--viz-grid</td><td>Cartesian gridlines — a barely-there hairline so the data, not the grid, leads.</td></tr>
          <tr><td className="tok-name">--viz-axis</td><td>Axis lines + ticks — one step stronger than the grid.</td></tr>
          <tr><td className="tok-name">--viz-tooltip-bg</td><td>The floating tooltip surface (near-opaque so it reads over any series).</td></tr>
        </tbody>
      </table>

      <SubHead meta="the palette applied">In context</SubHead>
      <Lede up>
        The same tokens in real charts. Series read the categorical ramp via <Mono>useChartColors()</Mono> (so colours stay consistent and theme-flip for free); a diverging metric maps sign to <Mono>--viz-div-pos</Mono> / <Mono>--viz-div-neg</Mono>.
      </Lede>
      <Frame label="categorical — multi-series via --viz-cat-1..3">
        <EidosChart title="Requests by service" subtitle="api · auth · kyc" meta="this week" height={240}>
          <LineChart data={CAT} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid {...eidosGridProps} />
            <XAxis dataKey="d" {...eidosXAxisProps} />
            <YAxis {...eidosYAxisProps} />
            <Tooltip content={<EidosTooltipContent />} />
            <Line type="monotone" dataKey="api" name="api" stroke={c[0]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="auth" name="auth" stroke={c[1]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="kyc" name="kyc" stroke={c[2]} strokeWidth={2} dot={false} />
          </LineChart>
        </EidosChart>
      </Frame>
      <Frame label="diverging — sign maps to --viz-div-pos / --viz-div-neg">
        <EidosChart title="Cost variance" subtitle="vs. forecast · centred on zero" meta="$/day" height={220}>
          <BarChart data={DIV} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid {...eidosGridProps} />
            <XAxis dataKey="n" {...eidosXAxisProps} />
            <YAxis {...eidosYAxisProps} />
            <Tooltip content={<EidosTooltipContent />} />
            <Bar dataKey="v" name="variance" radius={[3, 3, 0, 0]}>
              {DIV.map((e, i) => <Cell key={i} fill={e.v >= 0 ? 'var(--viz-div-pos)' : 'var(--viz-div-neg)'} />)}
            </Bar>
          </BarChart>
        </EidosChart>
      </Frame>
      <p className="ds-caption">Cap the categorical series at the first few hues; past ~6 they stop being distinguishable. For ordered magnitude reach for the sequential ramp instead of more categories.</p>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Colour is never the only signal</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Every series carries a direct label or legend entry, and trend uses shape (arrow / dashed line) on top of hue — so a colour-blind reader never depends on telling two ramp steps apart.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Distinct luminance</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The categorical ramp is tuned for distinct lightness, not just hue, so adjacent series stay separable under the common forms of colour-blindness; cap series count rather than reach for ramp step 7+.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Exact values</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>When precise numbers matter, pair the chart with an accessible data table; the tooltip is reachable and dismissable, not the only way to read a value.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The enter/draw animation respects <Mono>prefers-reduced-motion</Mono> and renders the final state instantly.</div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — read from the tokens</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>{`const c = useChartColors();
<Area stroke={c[0]} fill={c[0]} />`}</pre>
          </div>
          <div className="note">Series colours come from the --viz-* ramp via useChartColors, so a palette change propagates everywhere and themes flip for free.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — hand-pick hues per chart</div>
          <div className="body" style={{ padding: 16 }}>
            <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', margin: 0, lineHeight: 1.6 }}>{`<Area stroke="#10b981"
      fill="#10b981" />`}</pre>
          </div>
          <div className="note">Raw hex drifts between charts, breaks the light theme, and excludes colour-blind readers. Use the categorical ramp + a label.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — match the ramp to the data shape</div>
          <div className="body" style={{ flexDirection: 'column', gap: 8, padding: 14, alignItems: 'stretch' }}>
            <div style={{ height: 16, borderRadius: 999, background: 'linear-gradient(90deg, var(--viz-seq-low), var(--viz-seq-high))' }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ordered → sequential</span>
          </div>
          <div className="note">Categorical for unordered groups, sequential for magnitude, diverging for signed deltas. The ramp encodes the meaning.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — rainbow an ordered metric</div>
          <div className="body" style={{ flexDirection: 'column', gap: 8, padding: 14, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1, 6, 3, 9, 2].map((n) => <div key={n} style={{ flex: 1, height: 16, borderRadius: 4, background: `var(--viz-cat-${n})` }} />)}
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>ordered ✗ categorical</span>
          </div>
          <div className="note">A categorical palette on ordered data hides the progression. Reach for a sequential ramp.</div>
        </div>
      </div>
    </Section>
  );
}
