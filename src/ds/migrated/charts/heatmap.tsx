'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, EidosChart, Lede, Mono } from '@/ds/core';


  // 5 discrete intensity steps — matches the GitHub contribution model.
  // Pure SVG so we sidestep Recharts (no first-class heatmap primitive).
  const STEPS = 5;
  const fillFor = (v) => {
    if (v <= 0) return 'var(--viz-grid)';
    const k = Math.min(STEPS, Math.max(1, Math.ceil(v / (1 / STEPS))));
    return `color-mix(in oklch, var(--ember) ${k * 18}%, var(--bg))`;
  };
  const intensityLabel = (v) => {
    if (v <= 0) return 'No activity';
    if (v < 0.2) return 'Low';
    if (v < 0.4) return 'Light';
    if (v < 0.6) return 'Moderate';
    if (v < 0.8) return 'High';
    return 'Very high';
  };

  // Calendar — 53 weeks × 7 days. Values normalized 0..1.
  const CAL = Array.from({ length: 53 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const n = (Math.sin(w / 4 + d) + 1) / 2;
      const weekend = (d === 0 || d === 6) ? 0.4 : 1;
      return Math.max(0, n * weekend - (Math.random() > 0.85 ? 0.4 : 0));
    })
  );

  // Service × month matrix — 5 services × 12 months of errors.
  const SERVICES = ['eidos-api', 'fraud-engine', 'kyc', 'auth', 'ledger'];
  const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MATRIX   = SERVICES.map((_, r) => MONTHS.map((_, c) => Math.abs(Math.sin(r * 1.3 + c * 0.7))));
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // ── Popover (AI Label-styled) ─────────────────────────────────────────────
  const HeatPopover = ({ rows, id }: { rows: any; id?: string }) => (
    <div className="heat-pop" role="dialog" aria-label={rows.title} id={id}>
      <div className="heat-pop-head">
        <span className="heat-pop-swatch" style={{ background: rows.swatch }}/>
        <span className="heat-pop-title">{rows.title}</span>
      </div>
      {rows.subtitle && <div className="heat-pop-sub">{rows.subtitle}</div>}
      <dl className="heat-pop-meta">
        {rows.metrics.map((m, i) => (
          <React.Fragment key={i}>
            <dt>{m.label}</dt>
            <dd>{m.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );

  // Calendar cell — pure SVG <rect> + an anchored HTML popover via wrapping
  // <g>. Recharts isn't in the loop here, so we own the positioning.
  const CalendarHeatmap = ({ data, cellSize = 12, gap = 3, asOf = undefined }: { data: any; cellSize?: number; gap?: number; asOf?: any }) => {
    const [active, setActive] = React.useState(null); // { col, row, x, y }
    const popId = React.useId();
    const cols = data.length;
    const rows = data[0]?.length || 7;
    const w = cols * (cellSize + gap);
    const h = rows * (cellSize + gap);

    const select = (c, r) => setActive({ col: c, row: r, x: c * (cellSize + gap) + cellSize / 2, y: r * (cellSize + gap) });

    const activeInfo = active ? {
      title: `${DAYS[active.row]} · Week ${active.col + 1}`,
      subtitle: intensityLabel(data[active.col][active.row]),
      swatch: fillFor(data[active.col][active.row]),
      metrics: [
        { label: 'Score', value: data[active.col][active.row].toFixed(2) },
        { label: 'Bucket', value: data[active.col][active.row] <= 0 ? '—' : `${Math.min(5, Math.ceil(data[active.col][active.row] / 0.2))}/5` },
      ],
    } : null;

    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={w} height={h} role="img" aria-label="Contribution calendar — 53 weeks by 7 days. Activity values are summarised in the data table below." style={{ display: 'block' }}>
          {data.map((week, c) =>
            week.map((v, r) => {
              const isActive = active && active.col === c && active.row === r;
              return (
                <rect key={c + ':' + r}
                      className={'heat-cell' + (isActive ? ' is-active' : '')}
                      tabIndex={0} role="button" focusable="true"
                      aria-label={`${DAYS[r]}, week ${c + 1}: ${intensityLabel(v)}, score ${v.toFixed(2)}`}
                      aria-describedby={isActive ? popId : undefined}
                      x={c * (cellSize + gap)} y={r * (cellSize + gap)}
                      width={cellSize} height={cellSize} rx={2}
                      fill={fillFor(v)}
                      stroke={isActive ? 'var(--ember)' : 'transparent'}
                      strokeWidth={isActive ? 1.5 : 0}
                      onMouseEnter={() => select(c, r)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => select(c, r)}
                      onBlur={() => setActive(null)}
                      onKeyDown={(e) => { if (e.key === 'Escape') { setActive(null); (e.target as SVGElement).blur(); } }}/>
              );
            })
          )}
        </svg>
        {activeInfo && (
          <div style={{
            position: 'absolute',
            insetInlineStart: Math.min(active.x + 8, w - 240),
            top: active.y + 14,
            zIndex: 30,
            pointerEvents: 'none',
          }}>
            <HeatPopover rows={activeInfo} id={popId}/>
          </div>
        )}
      </div>
    );
  };

  const MatrixHeatmap = ({ rows, cols, data, cellH = 26, gap = 4, caption = 'Heatmap values', interactive = true }: { rows: any; cols: any; data: any; cellH?: number; gap?: number; caption?: string; interactive?: boolean }) => {
    const [active, setActive] = React.useState(null); // { r, c }
    const popId = React.useId();
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`, columnGap: gap, rowGap: gap, alignItems: 'center', width: '100%' }}>
          <div aria-hidden="true"/>
          {cols.map(c => (
            <div key={c} aria-hidden="true" className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{c}</div>
          ))}
          {rows.map((r, i) => (
            <React.Fragment key={r}>
              <div aria-hidden="true" className="t-mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg)', textAlign: 'end', paddingInlineEnd: 8, fontWeight: 500 }}>{r}</div>
              {data[i].map((v, j) => {
                const isActive = active && active.r === i && active.c === j;
                return (
                  <div key={j}
                       className={'heat-cell heat-cell-matrix' + (isActive ? ' is-active' : '')}
                       tabIndex={interactive ? 0 : undefined}
                       role={interactive ? 'button' : undefined}
                       aria-hidden={interactive ? undefined : true}
                       aria-label={interactive ? `${r}, ${cols[j]}: ${intensityLabel(v)}, error rate ${(v * 100).toFixed(1)} percent` : undefined}
                       aria-describedby={isActive ? popId : undefined}
                       style={{ position: 'relative', height: cellH, borderRadius: 'var(--radius-xs)', background: fillFor(v), border: '1.5px solid', borderColor: isActive ? 'var(--ember)' : 'transparent', cursor: 'pointer' }}
                       onMouseEnter={() => setActive({ r: i, c: j })}
                       onMouseLeave={() => setActive(null)}
                       onFocus={() => setActive({ r: i, c: j })}
                       onBlur={() => setActive(null)}
                       onKeyDown={(e) => { if (e.key === 'Escape') { setActive(null); (e.target as HTMLElement).blur(); } }}>
                    {isActive && (
                      <div style={{ position: 'absolute', top: '100%', insetInlineStart: 0, marginTop: 6, zIndex: 30, pointerEvents: 'none' }}>
                        <HeatPopover id={popId} rows={{
                          title: `${r} · ${cols[j]}`,
                          subtitle: `Error rate · ${intensityLabel(v)}`,
                          swatch: fillFor(v),
                          metrics: [
                            { label: 'Rate', value: (v * 100).toFixed(1) + '%' },
                            { label: 'Bucket', value: v <= 0 ? '—' : `${Math.min(5, Math.ceil(v / 0.2))}/5` },
                            { label: 'Service', value: r },
                            { label: 'Month', value: cols[j] },
                          ],
                        }}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        {/* Accessible fallback: the exact values as a real table, off-screen for
            sighted users but the canonical read for screen readers / no-colour. */}
        {interactive && (
          <table className="sr-only">
            <caption>{caption}</caption>
            <thead>
              <tr><th scope="col"> </th>{cols.map(c => <th key={c} scope="col">{c}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r}>
                  <th scope="row">{r}</th>
                  {data[i].map((v, j) => <td key={j}>{(v * 100).toFixed(1)}% — {intensityLabel(v)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const Legend = () => (
    <div className="t-mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
      <span>less</span>
      {Array.from({ length: STEPS + 1 }, (_, i) => (
        <span key={i} aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 2, background: fillFor(i / STEPS) }}/>
      ))}
      <span>more</span>
    </div>
  );

  const USAGE = `// Each cell opens the same Eidos-styled popover on hover OR keyboard focus,
// so the chart is fully reachable by Tab (like AILabelWithPopover).
function CalendarHeatmap({ data, cellSize = 12, gap = 3 }) {
  const [active, setActive] = useState(null)
  const popId = useId()
  const select = (c, r) => setActive({ col: c, row: r, x, y })
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg ...>
        {data.map((week, c) => week.map((v, r) => (
          <rect className="heat-cell"            // transition lives here, killed by reduced-motion
                tabIndex={0} role="button"
                aria-label={\`\${DAYS[r]}, week \${c + 1}: \${intensityLabel(v)}\`}
                aria-describedby={isActive ? popId : undefined}
                onMouseEnter={() => select(c, r)} onMouseLeave={() => setActive(null)}
                onFocus={() => select(c, r)}       onBlur={() => setActive(null)}
                onKeyDown={(e) => e.key === "Escape" && e.target.blur()}/>
        )))}
      </svg>
      {active && <div className="heat-pop" id={popId} role="dialog" style={{ position: "absolute", insetInlineStart, top }}>...</div>}
      <table className="sr-only">...exact values, the accessible fallback...</table>
    </div>
  )
}`;

export default function Page() {
  return (
    <Section id="chart-heatmap" title="Heatmap" desc="Encodes a value as colour intensity on a two-dimensional grid — day × hour, service × month. Use it when the cross-axis pattern matters more than exact numbers.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('chart-heatmap')} ariaLabel="package manager"/>
      <Lede>Heatmap is the only chart in this family that doesn't use Recharts — there's no first-class primitive, and a hand-rolled SVG (or CSS grid) is simpler than fighting <Mono>{'<ScatterChart>'}</Mono> into a tiled layout. Five discrete intensity steps, ember as the accent, <Mono>--viz-grid</Mono> for empty cells.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="GitHub-style activity calendar · 53 weeks × 7 days · hover any cell" code={USAGE}>
        <EidosChart title="Contribution calendar" subtitle="eidos org" meta="1y" height={210} padding={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start', width: '100%' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <CalendarHeatmap data={CAL}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span className="t-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>1,284 contributions · last 12 months</span>
              <Legend/>
            </div>
          </div>
        </EidosChart>
      </Frame>
      <Lede>Hover <em>or</em> <Mono>Tab</Mono> to a cell to surface the day of week, week index, intensity bucket, and exact value — like the AI Label popover, but for data instead of provenance. <Mono>Esc</Mono> dismisses it.</Lede>

      <SubHead meta="2 variants">Variants</SubHead>
      <Frame label="matrix · service × month error rate · hover for full context">
        <EidosChart title="Errors by service · monthly" subtitle="fleet" meta="last year" height={280} padding={14}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <MatrixHeatmap rows={SERVICES} cols={MONTHS} data={MATRIX} caption="Monthly error rate by service"/>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Legend/></div>
          </div>
        </EidosChart>
      </Frame>
      <Lede>For matrices, prefer CSS Grid over SVG — labels align to the row/column without manual placement, and the cells flex to fill the container.</Lede>

      <Frame label="compact · sparkline-sized for inline use (hover or tab to a cell)">
        <div className="t-mono" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'var(--text-base)' }}>
          <span style={{ color: 'var(--fg)', fontWeight: 500 }}>eidos-api</span>
          <CalendarHeatmap data={CAL.slice(0, 12)} cellSize={10} gap={2}/>
          <span style={{ color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>1,284</span>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Intensity is the entire encoding here, which is the hardest case for colour-blind readers — so the hover popover always names the intensity bucket in words ("High", "Moderate") and the exact value, and the less→more legend stays visible so the ramp is decodable without fine hue discrimination.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>This is a sequential ramp, not the categorical <Mono>--viz-cat-*</Mono> set: five discrete <Mono>--ember</Mono> steps mixed toward <Mono>--bg</Mono>, spaced for distinct luminance. Capping at five steps (never a continuous gradient) keeps adjacent intensities tellable apart.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard &amp; tooltip</div>
          <dl style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px', margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>
            <dt><Mono>Tab</Mono></dt><dd style={{margin: 0}}>Each cell is a <Mono>role="button"</Mono> with <Mono>tabindex=0</Mono>; Tab walks the grid cell by cell.</dd>
            <dt><Mono>Focus</Mono></dt><dd style={{margin: 0}}>Opens the same popover as hover and links it via <Mono>aria-describedby</Mono>; the cell shows the canonical focus ring.</dd>
            <dt><Mono>Esc</Mono></dt><dd style={{margin: 0}}>Dismisses the popover and drops focus from the cell.</dd>
            <dt><Mono>SR</Mono></dt><dd style={{margin: 0}}>Each cell's <Mono>aria-label</Mono> names row, column, bucket and value; a visually-hidden <Mono>&lt;table&gt;</Mono> with <Mono>scope</Mono>'d headers carries the exact figures for the no-colour read.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The hover/focus outline transition is owned by the <Mono>.heat-cell</Mono> class, not an inline style — so a <Mono>prefers-reduced-motion: reduce</Mono> block zeroes the transition and the grid switches state instantly with no animation.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — row and column labels flow right-to-left; cell intensity and the less→more legend do not mirror'>
        <div dir="rtl" style={{width: '100%'}}>
          <EidosChart title="أخطاء حسب الخدمة" subtitle="الأسطول" meta="السنة الماضية" height={240} padding={14}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
              <MatrixHeatmap rows={SERVICES.slice(0, 3)} cols={MONTHS.slice(0, 6)} data={MATRIX.slice(0, 3).map(r => r.slice(0, 6))} cellH={24} caption="معدل الأخطاء حسب الخدمة"/>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}><Legend/></div>
            </div>
          </EidosChart>
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the row labels and column headings align to the right and read right-to-left. The intensity scale (less → more) and each cell's fill value are not affected — the sequential ramp has no inherent reading direction.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 72px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <div style={{width:340, pointerEvents:'none'}}>
                <MatrixHeatmap rows={SERVICES.slice(0, 3)} cols={['Q1','Q2','Q3','Q4']} data={MATRIX.slice(0, 3).map(r => r.slice(0, 4))} interactive={false}/>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}><Legend/></div>
              </div>
              <span className="lead h" style={{top: 26, left: -28, width: 24}}/>
              <span className="lead v" style={{top: -22, right: 60, height: 18}}/>
              <span className="lead h" style={{top: 50, right: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, right: 30, height: 18}}/>
              <div className="pin" style={{top: 18, left: -52}}>1</div>
              <div className="pin" style={{top: -42, right: 60, transform:'translateX(50%)'}}>2</div>
              <div className="pin" style={{top: 42, right: -52}}>4</div>
              <div className="pin" style={{bottom: -42, right: 30, transform:'translateX(50%)'}}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Two categorical axes.</b> Rows and columns name the two dimensions (service × month, day × week); mono labels align to each row/column without manual placement in the CSS-grid variant.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Cells.</b> The grid of rounded rects; each is filled by intensity via <Mono>fillFor(v)</Mono>, which maps a 0..1 value to one of five discrete <Mono>--ember</Mono> steps (empty cells use <Mono>--viz-grid</Mono>).</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Legend (less → more).</b> A swatch ramp showing the five intensity steps, so the colour-to-value mapping is always on screen.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Hover / focus popover.</b> Borrows the AI Label chrome — an ember-outlined cell plus a panel with the exact value, intensity bucket, and the row/column it sits at. Opens on pointer hover and on keyboard focus alike; <Mono>Esc</Mono> closes it.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — discrete steps + hover popover</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <MatrixHeatmap rows={SERVICES.slice(0, 3)} cols={MONTHS.slice(0, 6)} data={MATRIX.slice(0, 3).map(r => r.slice(0, 6))} cellH={20}/>
            <Legend/>
          </div>
          <div className="note">Five steps the eye can decode at a glance + a popover for the precise read.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — continuous gradient with no hover</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, width: '100%' }}>
              {Array.from({ length: 36 }, (_, i) => (
                <div key={i} style={{ height: 18, background: `color-mix(in srgb, var(--ember) ${(0.05 + (i % 12) * 0.075) * 100}%, transparent)`, borderRadius: 2 }}/>
              ))}
            </div>
          </div>
          <div className="note">100 shades of orange + no tooltip = 0 bits of information. Use 5 discrete steps and let hover carry the precision.</div>
        </div>
      </div>

      <SubHead meta="props">API reference</SubHead>
      <PropsTable
        label="Heatmap · convention (no shared component yet)"
        rows={[
          { prop: 'data',     type: 'number[][]', description: 'Rows of values normalised to 0..1.' },
          { prop: 'cellSize', type: 'number',     default: '12', description: 'Side length in px (SVG variant).' },
          { prop: 'gap',      type: 'number',     default: '3',  description: 'Distance between cells.' },
          { prop: 'rows / cols', type: 'string[]', description: 'Labels — matrix variant only.' },
          { prop: 'fillFor(v)',  type: '(0..1) => CSS color', description: 'Maps value to a discrete bin. 5 steps; v ≤ 0 returns the grid token.' },
          { prop: 'onHover',     type: '(cell, position) => void', description: 'Drive your own popover or detail pane. The built-in popover lifts AI Label’s chrome.' },
        ]}
      />
    </Section>
  );
}
