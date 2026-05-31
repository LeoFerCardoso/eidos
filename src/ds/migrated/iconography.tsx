'use client';
// Forge DS — Foundations / Iconography (Lucide-style, 1.5 stroke)
import { CodeBlock, Frame, Icons, Lede, Mono, PropsTable, Section, SubHead } from '@/ds/core';

// Domain groupings — keeps the IDP / agent vocabulary visible in one place.
// Icons not in any group below fall through to "General" at the bottom of
// the categorised view.
const GROUPS = [
  { id: 'devops',     label: 'DevOps',          desc: 'Build, deploy, version, gate.',
    names: ['deploy','rollback','pipeline','merge','commit','tag','gate','ring','branch','gitFork','gitPullRequest','rocket','play','refresh'] },
  { id: 'cloud',      label: 'Cloud & infra',   desc: 'Compute, storage, queue, region, secret.',
    names: ['server','container','database','cloud','fn','queue','region','key','lockKey','network','globe','cpu'] },
  { id: 'agent',      label: 'Agent · AI · MCP',desc: 'Bots, tools, prompts, vector stores.',
    names: ['bot','agent','mcpServer','toolCall','prompt','vector','sparkle','zap'] },
  { id: 'governance', label: 'Governance',      desc: 'Incident, score, compliance, audit, runbook, SLO.',
    names: ['incident','score','compliance','auditLog','runbook','slo','flag','shield','target','alert'] },
  { id: 'data',       label: 'Data viz',        desc: 'Charts, trends, activity.',
    names: ['barChart','lineChart','pieChart','activity','trending','gauge','pulse'] },
];

export default function Iconography() {
  const all = Object.entries(Icons);
  const grouped = new Set(GROUPS.flatMap(g => g.names));
  const general = all.filter(([n]) => !grouped.has(n));

  return (
    <Section id="iconography" num="06" title="Iconography" desc={`One coherent set of ${all.length} Lucide-style glyphs — a single 1.5px stroke, a square optical box, and five fixed sizes. Icons clarify a label, never replace it; directional ones mirror under RTL while static ones hold still.`}>
      <Lede wide>
        One library, one stroke, one set of rules. Every icon in Forge is on a <b style={{color:'var(--fg)'}}>24×24 viewBox</b> with a <b style={{color:'var(--fg)'}}>1.5px stroke</b>, <b style={{color:'var(--fg)'}}>round caps and joins</b>, and <b style={{color:'var(--fg)'}}>no fills</b>. Icons inherit <Mono>currentColor</Mono>, so the same SVG renders in every foreground token without per-icon work. Hand-drawn brand SVGs (the Forge mark, illustrations) sit outside this rule.
      </Lede>

      {/* Philosophy */}
      <div className="ds-grid cols-3" style={{marginBottom: 24}}>
        {[
          ['One stroke', '1.5px on a 24px viewBox. Lucide-style. No mixing weights, no swapping in fill-style icons.'],
          ['Inherit color', 'Every icon uses currentColor. They tint with the surrounding text — no per-icon color override.'],
          ['Mirror with intent', 'Directional icons (chevron, arrow) flip under RTL. Static icons (rocket, clock) stay put.'],
        ].map(([t,d]) => (
          <div key={t} className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>{t}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{d}</div>
          </div>
        ))}
      </div>

      {/* Library */}
      <SubHead meta={all.length+' glyphs'}>Library</SubHead>
      <Lede up wide>
        The full set ships with the design system at <Mono>icons.jsx</Mono>. Use <Mono>{'<Icons.search/>'}</Mono>, <Mono>{'<Icons.rocket/>'}</Mono>, etc. Hover any tile below to see its name.
      </Lede>
      <div className="surface" style={{padding: 16, display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap: 8}}>
        {all.map(([name, Icon]) => (
          <div key={name} title={name} style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 6, padding: 10, borderRadius: 'var(--radius-lg)', background:'var(--bg-elevated)', border:'1px solid var(--border)'}}>
            <Icon size={20}/>
            <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{name}</span>
          </div>
        ))}
      </div>

      {/* By category — IDP / agent vocabulary made visible. */}
      <SubHead meta={GROUPS.length + ' domains'}>By category</SubHead>
      <Lede up wide>
        The library now ships a tailored set of glyphs for Internal Developer Platforms — pipeline, ring deployment, MCP server, runbook, SLO, score. Each domain owns a small, opinionated set; the silhouettes are distinct so they read in a row at 16px.
      </Lede>
      <div style={{display:'grid', gridTemplateColumns: '1fr', gap: 14}}>
        {GROUPS.map(g => (
          <div key={g.id} className="surface" style={{padding: 16}}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 12, gap: 12}}>
              <div>
                <div style={{fontSize: 'var(--text-base)', fontWeight: 600, color:'var(--fg)', letterSpacing:'-0.005em'}}>{g.label}</div>
                <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 2}}>{g.desc}</div>
              </div>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{g.names.filter(n => Icons[n]).length} glyphs</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap: 8}}>
              {g.names.filter(n => Icons[n]).map(name => {
                const Icon = Icons[name];
                return (
                  <div key={name} title={name} style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 6, padding: 10, borderRadius: 'var(--radius-lg)', background:'var(--bg-elevated)', border:'1px solid var(--border)'}}>
                    <Icon size={20}/>
                    <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {general.length > 0 && (
          <div className="surface" style={{padding: 16}}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 12, gap: 12}}>
              <div>
                <div style={{fontSize: 'var(--text-base)', fontWeight: 600, color:'var(--fg)', letterSpacing:'-0.005em'}}>General</div>
                <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 2}}>Everything that doesn't belong to a specific domain.</div>
              </div>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{general.length} glyphs</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(8, 1fr)', gap: 8}}>
              {general.map(([name, Icon]) => (
                <div key={name} title={name} style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 6, padding: 10, borderRadius: 'var(--radius-lg)', background:'var(--bg-elevated)', border:'1px solid var(--border)'}}>
                  <Icon size={20}/>
                  <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sizing */}
      <SubHead meta="5 sizes">Sizing</SubHead>
      <Lede up wide>
        Five canonical sizes. <b style={{color:'var(--fg)'}}>16px</b> is the default in chrome (button leading icon, menu item, input addon). <b style={{color:'var(--fg)'}}>20px</b> for primary affordances; <b style={{color:'var(--fg)'}}>14px</b> for inline-with-text; <b style={{color:'var(--fg)'}}>24px</b> standalone; <b style={{color:'var(--fg)'}}>32px</b> for hero / empty-state visuals only.
      </Lede>
      <Frame label="14 · 16 · 20 · 24 · 32" code={`<Icons.search size={14}/>  // inline-with-text
<Icons.search size={16}/>  // chrome default
<Icons.search size={20}/>  // primary affordance
<Icons.search size={24}/>  // standalone
<Icons.search size={32}/>  // hero / empty-state`}>
        <div style={{display:'flex', alignItems:'center', gap: 28}}>
          {[14, 16, 20, 24, 32].map(s => (
            <div key={s} style={{display:'flex', flexDirection:'column', gap: 6, alignItems:'center'}}>
              <Icons.search size={s}/>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{s}px</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* Where each size lives */}
      <SubHead meta="usage">Where each size lives</SubHead>
      <table className="spec">
        <thead><tr><th>Size</th><th>Uses</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">14px</td><td>Inline-with-text icons inside body copy.</td><td><span style={{display:'inline-flex', alignItems:'center', gap: 6, fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Open in <Icons.arrowRight size={14}/></span></td></tr>
          <tr><td className="tok-name">16px</td><td>Chrome default — button leading/trailing icons, menu items, input addons.</td><td><button className="btn sm ember" style={{pointerEvents:'none'}}><Icons.rocket size={16}/> Deploy</button></td></tr>
          <tr><td className="tok-name">20px</td><td>Primary affordances — sidebar nav, header actions, alert icon.</td><td><Icons.search size={20}/></td></tr>
          <tr><td className="tok-name">24px</td><td>Standalone — empty-state hint, settings page item.</td><td><Icons.settings size={24}/></td></tr>
          <tr><td className="tok-name">32px</td><td>Hero icon — empty states, splash modals only.</td><td><Icons.rocket size={32}/></td></tr>
        </tbody>
      </table>

      {/* Color rules */}
      <SubHead meta="color">Colour</SubHead>
      <Lede up wide>
        Icons inherit <Mono>currentColor</Mono>, so they tint with their parent text colour. <b style={{color:'var(--fg)'}}>Don't add hard-coded fills.</b> The only exception is semantic icons inside Alerts and Status — those tint to <Mono>--success</Mono>, <Mono>--warning</Mono>, or <Mono>--danger</Mono> via the parent class.
      </Lede>
      <Frame label="same icon · five tones via currentColor">
        <div style={{display:'flex', gap: 24, alignItems:'center'}}>
          {[
            ['var(--fg)', 'fg'],
            ['var(--fg-muted)', 'muted'],
            ['var(--ember)', 'ember'],
            ['var(--success)', 'success'],
            ['var(--danger)', 'danger'],
          ].map(([c, name]) => (
            <div key={name} style={{display:'flex', flexDirection:'column', gap: 6, alignItems:'center', color: c}}>
              <Icons.alert size={24}/>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{name}</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* Anatomy of an icon */}
      <SubHead meta="composition">Anatomy of an icon</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Construction grid · 24×24 viewBox</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 240}} aria-hidden="true">
              {/* Render an oversized search icon over a faint grid */}
              <div style={{position:'relative', width: 200, height: 200, margin:'0 auto'}}>
                {/* grid */}
                <svg width={200} height={200} viewBox="0 0 24 24" style={{position:'absolute', inset: 0, opacity: 0.18}}>
                  {[...Array(25)].map((_, i) => (
                    <line key={'h'+i} x1={0} y1={i} x2={24} y2={i} stroke="var(--border-stronger)" strokeWidth="0.05"/>
                  ))}
                  {[...Array(25)].map((_, i) => (
                    <line key={'v'+i} x1={i} y1={0} x2={i} y2={24} stroke="var(--border-stronger)" strokeWidth="0.05"/>
                  ))}
                  <rect x={2} y={2} width={20} height={20} fill="none" stroke="var(--ember)" strokeWidth="0.1" strokeDasharray="0.5 0.5"/>
                </svg>
                {/* big icon */}
                <Icons.search size={200} color="var(--fg)"/>
              </div>
              <span className="lead h" style={{top: 30, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 100, left: -28, width: 24}}/>
              <span className="lead h" style={{bottom: 30, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 30, right: -28, width: 24}}/>
              <div className="pin" style={{top: 22, left: -52}}>1</div>
              <div className="pin" style={{top: 92, left: -52}}>2</div>
              <div className="pin" style={{top: 22, right: -52}}>3</div>
              <div className="pin" style={{bottom: 22, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>24×24 viewBox.</b> Every icon is constructed on the same canvas, leaving 2px of safe-area padding inside.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>1.5px stroke.</b> One weight for the whole library. Round caps and joins keep corners legible at small sizes.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>No fills.</b> The library is pure stroke — even shapes that look filled (chevrons) are closed strokes.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>currentColor.</b> The SVG inherits the parent's text colour. Pass a colour prop only for special cases (e.g. forced state icon).</span>
          </div>
        </div>
      </div>

      {/* Icon + label spacing */}
      <SubHead meta="composition">Icon + label spacing</SubHead>
      <Lede up wide>
        Icon-to-label gap is calibrated per size. For 14–16px icons, 6–8px gap. For 20px+ icons, 10–12px. The icon's optical centre, not its visual edge, sits aligned with the label's cap-height.
      </Lede>
      <Frame label="three sizes · gap, alignment, optical balance">
        <div style={{display:'flex', flexDirection:'column', gap: 18, inlineSize:'100%', maxInlineSize: 480, marginInline:'auto'}}>
          <div style={{display:'flex', alignItems:'center', gap: 6, fontSize: 'var(--text-base)', color:'var(--fg)'}}>
            <Icons.search size={14}/> <span>14px icon <span className="t-mono" style={{color:'var(--fg-subtle)'}}>· 6px gap · 13px label</span></span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 8, fontSize: 'var(--text-md)', color:'var(--fg)'}}>
            <Icons.search size={16}/> <span>16px icon <span className="t-mono" style={{color:'var(--fg-subtle)'}}>· 8px gap · 15px label</span></span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 12, fontSize: 'var(--text-lg)', color:'var(--fg)'}}>
            <Icons.search size={20}/> <span>20px icon <span className="t-mono" style={{color:'var(--fg-subtle)'}}>· 12px gap · 17px label</span></span>
          </div>
        </div>
      </Frame>

      {/* RTL mirroring */}
      <SubHead meta="bidi">RTL mirroring</SubHead>
      <Lede up wide>
        Directional icons mirror under RTL via <Mono>{`[dir="rtl"] .icon-x { transform: scaleX(-1) }`}</Mono>. Static icons (rocket, clock, settings) stay put — they don't carry directional meaning.
      </Lede>
      <Frame label="LTR · RTL — same icons">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24}}>
          <div>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 10}}>LTR</div>
            <div style={{display:'flex', gap: 18, color:'var(--fg)'}}>
              <Icons.chevronRight/>
              <Icons.arrowRight/>
              <Icons.rocket/>
              <Icons.clock/>
              <Icons.settings/>
            </div>
          </div>
          <div dir="rtl">
            <div className="t-mono-label" style={{padding: 0, marginBottom: 10}}>RTL</div>
            <div style={{display:'flex', gap: 18, color:'var(--fg)'}}>
              <Icons.chevronRight style={{transform:'scaleX(-1)'}}/>
              <Icons.arrowRight style={{transform:'scaleX(-1)'}}/>
              <Icons.rocket/>
              <Icons.clock/>
              <Icons.settings/>
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        The first two flip — "next" still points in the reading direction. The last three don't — a rocket flying right in Arabic is still flying forward.
      </Lede>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Frame label="decorative · semantic · functional">
        <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 560}}>
          <div style={{padding: 14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)'}}>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 6}}>Decorative — aria-hidden</div>
            <div style={{display:'flex', alignItems:'center', gap: 8, fontSize: 'var(--text-base)', color:'var(--fg)'}}>
              <Icons.rocket size={16} aria-hidden="true"/> Deploy
            </div>
            <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', marginTop: 6}}>{'<Icons.rocket aria-hidden="true"/> Deploy'}</div>
          </div>
          <div style={{padding: 14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)'}}>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 6}}>Semantic — gives meaning, needs role</div>
            <div className="alert success" style={{margin: 0}}>
              <Icons.check size={16} className="alert-icon" role="img" aria-label="success"/>
              <div className="alert-body">
                <div className="alert-title">Build green</div>
              </div>
            </div>
            <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', marginTop: 6}}>{'<Icons.check role="img" aria-label="success"/>'}</div>
          </div>
          <div style={{padding: 14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)'}}>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 6}}>Functional — interactive, label parent</div>
            <button className="focus-ring" style={{blockSize: 32, inlineSize: 32, padding: 0, background:'transparent', border:'1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)', color:'var(--fg)', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center'}} aria-label="Search">
              <Icons.search size={16}/>
            </button>
            <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', marginTop: 6}}>{'<button aria-label="Search"><Icons.search/></button>'}</div>
          </div>
        </div>
      </Frame>
      <table className="spec" style={{marginBlockStart: 18}}>
        <thead><tr><th>Key</th><th>Action — on a functional icon button</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">Tab</td><td>Move focus to the icon button; the <span className="t-mono" style={{color:'var(--ember)'}}>.focus-ring</span> 2px ember outline appears (a bare glyph is never a tab stop).</td></tr>
          <tr><td className="tok-name">Enter</td><td>Activate the control — identical to a mouse click.</td></tr>
          <tr><td className="tok-name">Space</td><td>Activate the control — native <span className="t-mono" style={{color:'var(--ember)'}}>{'<button>'}</span> behaviour, no extra handler.</td></tr>
          <tr><td className="tok-name">Esc</td><td>If the icon toggles an overlay (menu, popover), closes it and returns focus to the button.</td></tr>
        </tbody>
      </table>
      <Lede wide>
        <b style={{color:'var(--fg)'}}>Contrast.</b> A glyph is a foreground — at <Mono>--fg-muted</Mono> on <Mono>--surface</Mono> it clears 4.5:1, and any icon on an ember fill flips to dark ink (<Mono>var(--bg)</Mono>), never ember-on-ember. <b style={{color:'var(--fg)'}}>Reduced motion.</b> Animated glyphs are gated behind <Mono>{'@media (prefers-reduced-motion: reduce)'}</Mono>: the <Mono>.ds-spin</Mono> spinner trades rotation for a calm opacity pulse, and the <Mono>.s-dot.pulse</Mono> status dot stops outright. <b style={{color:'var(--fg)'}}>Roles.</b> Decorative → <Mono>aria-hidden</Mono>; meaning-bearing → <Mono>role="img"</Mono> + <Mono>aria-label</Mono>; interactive → label the parent control, never the SVG.
      </Lede>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one stroke weight</div>
          <div className="body" style={{gap: 16}}>
            <Icons.search size={20}/>
            <Icons.alert size={20}/>
            <Icons.user size={20}/>
            <Icons.settings size={20}/>
          </div>
          <div className="note">All 1.5px stroke. The library reads as one family.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — mixed stroke or filled icons</div>
          <div className="body" style={{gap: 16}}>
            <Icons.search size={20}/>
            <span style={{display:'inline-block', width: 20, height: 20, background:'var(--ember)', borderRadius: 'var(--radius-sm)'}}/>
            <span style={{display:'inline-block', width: 0, height: 0, borderLeft:'10px solid transparent', borderRight:'10px solid transparent', borderBottom:'18px solid var(--fg)'}}/>
          </div>
          <div className="note">Mixing stroke widths and fill styles breaks the visual family.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — inherit currentColor</div>
          <div className="body" style={{gap: 16}}>
            <span style={{color:'var(--fg)'}}><Icons.alert/></span>
            <span style={{color:'var(--ember)'}}><Icons.alert/></span>
            <span style={{color:'var(--success)'}}><Icons.alert/></span>
            <span style={{color:'var(--danger)'}}><Icons.alert/></span>
          </div>
          <div className="note">Same SVG, four tones via currentColor.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — hardcoded fills</div>
          <div className="body" style={{gap: 16}}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="#FF6B35" stroke="none"><circle cx={12} cy={12} r={10}/></svg>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="#7DD3FC" stroke="none"><circle cx={12} cy={12} r={10}/></svg>
          </div>
          <div className="note">Hardcoded fills break theming. Light-mode flips will leave them looking wrong.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — meaningful icons get a role</div>
          <div className="body">
            <div className="alert danger" style={{margin: 0, maxWidth: 320}}>
              <Icons.x size={16} className="alert-icon" role="img" aria-label="danger"/>
              <div className="alert-body"><div className="alert-title">Outage</div></div>
            </div>
          </div>
          <div className="note">Status icons carry information — give them a role and label.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — silent meaningful icons</div>
          <div className="body">
            <div className="alert danger" style={{margin: 0, maxWidth: 320}}>
              <Icons.x size={16} className="alert-icon"/>
              <div className="alert-body"><div className="alert-title">Outage</div></div>
            </div>
          </div>
          <div className="note">Without role/label, screen readers skip the X — the colour-blind user gets only the title.</div>
        </div>
      </div>

      {/* Contract — props every Icons.* component accepts */}
      <SubHead meta="api">Contract</SubHead>
      <p className="ds-caption" style={{marginTop: -6}}>
        Every <Mono>Icons.*</Mono> component is a thin wrapper around an SVG. They accept the same four props — anything else passes through to the underlying <Mono>{'<svg>'}</Mono>.
      </p>
      <PropsTable
        label="<Icons.search/> · all variants"
        rows={[
          { prop: 'size', type: 'number',  default: '20',           description: 'Width and height in px. Use the canonical 14 / 16 / 20 / 24 / 32 sizes — see the size scale above.' },
          { prop: 'color', type: 'string', default: 'currentColor', description: 'Stroke color. Defaults to the inherited text color so an icon inside a .btn.ember reads in ember automatically. Override with a CSS var (var(--success)) or hex.' },
          { prop: 'strokeWidth', type: 'number', default: '1.5',    description: 'Stroke weight in px. Don’t change this unless you have a reason — the visual rhythm of the system depends on it.' },
          { prop: 'className', type: 'string', default: '—',        description: 'Forwarded to the underlying <svg>. Use it for transforms (.rotate-90), animation (.spin), or theme-conditional classes.' },
        ]}
      />

      <SubHead meta="add a glyph">Adding a new icon</SubHead>
      <p className="ds-caption" style={{marginTop: -6}}>
        Three steps. Keep them in this order — the rest of the system depends on every icon obeying the same contract.
      </p>
      <CodeBlock label="icons.jsx — append to the export map" lang="jsx" code={`// 1. Pull the SVG path data from Lucide (or draw on a 24×24 grid):
//    https://lucide.dev/icons/<name>
//
// 2. Inline only the <path>/<circle>/<line> children — no <svg> wrapper.
//    The shared I() helper provides viewBox, stroke, and stroke-linecap.
//
//    The "I" helper looks like this (already in icons.jsx):
//      const I = (children) => ({size=20, color='currentColor', strokeWidth=1.5, className=''}) => (
//        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//             stroke={color} strokeWidth={strokeWidth}
//             strokeLinecap="round" strokeLinejoin="round" className={className}>
//          {children}
//        </svg>
//      );
//
// 3. Add an entry to the Icons map (alphabetical):
const Icons = {
  // ...existing icons...
  sparkles: I(<><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z"/></>),
  // ...
};`}/>
      <p className="ds-caption">
        After adding, the <a href="../..//iconography" style={{color:'var(--ember)'}}>icon library</a> on this page picks the new glyph up automatically — no nav-config edit needed.
      </p>
    </Section>
  );
}
