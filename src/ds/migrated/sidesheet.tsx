'use client';
import * as React from 'react';
import { Icons, TierBadge, Frame, Section, SubHead, PropsTable, Lede, Mono } from '@/ds/core';


// ---- Inline mock shell ---------------------------------------------------
// A 360-wide frame styled to read as a sidesheet, so the example sits inside
// the docs frame instead of taking over the viewport. The header / body /
// footer slots match the real .sidesheet structure 1:1.
const SheetMock = ({ title, badge, children, footer, height = 380 }: { title: string; badge?: React.ReactNode; children?: React.ReactNode; footer?: React.ReactNode; height?: number }) => (
  <div style={{
    width: 360, height, display:'flex', flexDirection:'column',
    background:'var(--bg-elevated)', border:'1px solid var(--border-strong)',
    borderRadius: 10, overflow:'hidden',
  }}>
    <div style={{
      padding:'14px 18px', borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10, flexShrink: 0,
    }}>
      <div style={{display:'flex', alignItems:'center', gap: 10, minWidth: 0}}>
        <span style={{fontSize: 'var(--text-md)', fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{title}</span>
        {badge}
      </div>
      <button className="btn ghost icon sm" aria-label="Close drawer" tabIndex={-1} style={{cursor:'default'}}><Icons.x size={13}/></button>
    </div>
    <div style={{padding: 18, overflowY:'auto', flex: 1, fontSize: 'var(--text-base)'}}>
      {children}
    </div>
    {footer && (
      <div style={{
        padding:'12px 18px', borderTop:'1px solid var(--border)',
        display:'flex', justifyContent:'flex-end', gap: 8, background:'var(--surface)', flexShrink: 0,
      }}>
        {footer}
      </div>
    )}
  </div>
);

// ==========================================================================
// 1. DETAIL — read-only entity profile.
// ==========================================================================
const DETAIL_CODE = `<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title={<><span>identity-svc</span><TierBadge tier="T1"/></>}
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>
      Close
    </Button>
    <Button asChild>
      <a href="/services/identity-svc">Open service</a>
    </Button>
  </>}
>
  <DefList>
    <DefList.Term>Last deploy</DefList.Term>
    <DefList.Desc>2 minutes ago by Camila Tanaka</DefList.Desc>
    <DefList.Term>Owner</DefList.Term>
    <DefList.Desc>Identity tribe</DefList.Desc>
  </DefList>
  <Divider/>
  <Heading>Dependencies</Heading>
  <DepList items={deps}/>
</Drawer>`;

const DetailMock = () => (
  <SheetMock
    title="identity-svc"
    badge={<TierBadge tier="T1"/>}
    footer={<>
      <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Close</button>
      <button className="btn sm" tabIndex={-1} style={{cursor:'default'}}>Open service <Icons.arrowRight size={12}/></button>
    </>}
  >
    <div className="t-mono-label">Last deploy</div>
    <div style={{marginTop: 4}}>2 minutes ago by Camila Tanaka</div>
    <div style={{display:'flex', gap: 6, marginTop: 12, flexWrap:'wrap'}}>
      <span className="chip" style={{fontVariantNumeric:'tabular-nums'}}>v4.18.2</span>
      <span className="chip ok" style={{fontVariantNumeric:'tabular-nums'}}>p95 142ms</span>
      <span className="chip ok" style={{fontVariantNumeric:'tabular-nums'}}>SLO 99.94%</span>
    </div>
    <div className="divider" style={{margin:'18px 0'}}/>
    <div className="t-mono-label">Dependencies</div>
    <div style={{display:'flex', flexDirection:'column', marginTop: 8}}>
      {[
        ['bureau-gateway',  'success'],
        ['consent-vault',   'success'],
        ['session-store',   'warning'],
      ].map(([d, tone]) => (
        <div key={d} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
          <span>{d}</span>
          <span className={'pill ' + tone}><span className="dot"/>{tone === 'success' ? 'healthy' : 'degraded'}</span>
        </div>
      ))}
    </div>
  </SheetMock>
);

// ==========================================================================
// 2. FORM — editable. Create or edit a record.
// ==========================================================================
const FORM_CODE = `<Drawer
  open={open}
  onClose={onClose}
  title="New service"
  footer={<>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="ember" disabled={!valid}>Create service</Button>
  </>}
>
  <Field label="Name" required>
    <Input placeholder="payments-gateway"/>
  </Field>
  <Field label="Tier">
    <Select defaultValue="T2">
      <option>T0</option><option>T1</option>
      <option>T2</option><option>T3</option>
    </Select>
  </Field>
  <Field label="Owner team" required error="Pick the team that owns this service.">
    <Combobox options={teams} aria-invalid/>
  </Field>
  <Field label="Description">
    <Textarea rows={3}/>
  </Field>
</Drawer>`;

const FormMock = () => (
  <SheetMock
    title="New service"
    footer={<>
      <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Cancel</button>
      <button className="btn ember sm" disabled>Create service</button>
    </>}
  >
    <div className="in-field">
      <label className="in-label">Name <span style={{color:'var(--danger)'}}>*</span></label>
      <div className="in-group sm">
        <input className="in-control" placeholder="payments-gateway"/>
      </div>
    </div>
    <div className="in-field" style={{marginTop: 12}}>
      <label className="in-label">Tier</label>
      <div className="in-group sm">
        <select className="in-control" defaultValue="T2">
          <option>T0</option><option>T1</option><option>T2</option><option>T3</option>
        </select>
      </div>
    </div>
    <div className="in-field" style={{marginTop: 12}}>
      <label className="in-label" htmlFor="sidesheet-owner">Owner team <span style={{color:'var(--danger)'}}>*</span></label>
      <div className="in-group sm is-invalid">
        <input id="sidesheet-owner" className="in-control" placeholder="Search teams…" aria-invalid="true" aria-describedby="sidesheet-owner-err"/>
        <span className="in-addon icon"><Icons.chevronDown size={13}/></span>
      </div>
      <span id="sidesheet-owner-err" className="in-error" style={{marginTop: 6}}><Icons.alert size={12}/> Pick the team that owns this service.</span>
    </div>
    <div className="in-field" style={{marginTop: 12}}>
      <label className="in-label">Description</label>
      <textarea className="in-control" rows={3} style={{padding: 8, fontSize: 'var(--text-base)', fontFamily:'var(--font-sans)', resize:'vertical'}} placeholder="What does this service do?"/>
    </div>
  </SheetMock>
);

// ==========================================================================
// 3. FILTERS — multi-checkbox + apply.
// ==========================================================================
const FILTERS_CODE = `<Drawer
  open={open}
  onClose={onClose}
  title="Filters"
  footer={<>
    <Button variant="ghost" onClick={reset}>Clear all</Button>
    <Button variant="ember" onClick={apply}>
      Apply (3)
    </Button>
  </>}
>
  <FilterGroup label="Tier">
    {tiers.map(t => <Checkbox key={t}>{t}</Checkbox>)}
  </FilterGroup>
  <FilterGroup label="Health">
    <Checkbox defaultChecked>healthy</Checkbox>
    <Checkbox defaultChecked>degraded</Checkbox>
    <Checkbox>down</Checkbox>
  </FilterGroup>
  <FilterGroup label="Owner">
    <Combobox multi options={teams}/>
  </FilterGroup>
</Drawer>`;

const FiltersMock = () => (
  <SheetMock
    title="Filters"
    footer={<>
      <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Clear all</button>
      <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}>Apply (3)</button>
    </>}
  >
    <div className="t-mono-label">Tier</div>
    <div style={{display:'flex', flexDirection:'column', gap: 8, marginTop: 8}}>
      {([['T0', false], ['T1', true], ['T2', true], ['T3', false]] as [string, boolean][]).map(([t, on]) => (
        <label key={t} style={{display:'flex', alignItems:'center', gap: 8, cursor:'default'}}>
          <span className="fc-check-box" style={on ? {background:'var(--ember)', borderColor:'var(--ember)'} : undefined}>
            {on && <Icons.check size={10} color="#08090A" strokeWidth={3}/>}
          </span>
          <span style={{fontSize: 'var(--text-base)'}}>{t}</span>
        </label>
      ))}
    </div>
    <div className="divider" style={{margin:'14px 0'}}/>
    <div className="t-mono-label">Health</div>
    <div style={{display:'flex', flexDirection:'column', gap: 8, marginTop: 8}}>
      {([['healthy', true], ['degraded', true], ['down', false]] as [string, boolean][]).map(([t, on]) => (
        <label key={t} style={{display:'flex', alignItems:'center', gap: 8, cursor:'default'}}>
          <span className="fc-check-box" style={on ? {background:'var(--ember)', borderColor:'var(--ember)'} : undefined}>
            {on && <Icons.check size={10} color="#08090A" strokeWidth={3}/>}
          </span>
          <span style={{fontSize: 'var(--text-base)'}}>{t}</span>
        </label>
      ))}
    </div>
    <div className="divider" style={{margin:'14px 0'}}/>
    <div className="t-mono-label">Owner</div>
    <div className="in-field" style={{marginTop: 8}}>
      <div className="in-group sm">
        <input className="in-control" placeholder="Search teams…"/>
        <span className="in-addon icon"><Icons.search size={13}/></span>
      </div>
    </div>
  </SheetMock>
);

// ==========================================================================
// 4. WIZARD — multi-step inside a sidesheet.
// ==========================================================================
const WIZARD_CODE = `<Drawer
  open={open}
  onClose={onClose}
  persistent
  title={<><span>Onboard a service</span>
    <Stepper current={2} total={4} compact/></>}
  footer={<>
    <Button variant="ghost" onClick={back}
            disabled={step === 1}>
      Back
    </Button>
    <Button variant="ember" onClick={next}>
      {step === 4 ? 'Onboard' : 'Continue'}
    </Button>
  </>}
>
  {step === 1 && <BasicsStep />}
  {step === 2 && <RuntimeStep />}
  {step === 3 && <SecretsStep />}
  {step === 4 && <ReviewStep />}
</Drawer>`;

const WizardMock = () => (
  <SheetMock
    title="Onboard a service"
    badge={<span className="chip">2 / 4</span>}
    footer={<>
      <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Back</button>
      <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}>Continue <Icons.arrowRight size={12}/></button>
    </>}
  >
    {/* Stepper */}
    <div style={{display:'flex', alignItems:'center', gap: 6, marginBottom: 16}}>
      {[1,2,3,4].map(n => (
        <React.Fragment key={n}>
          <div style={{
            width: 22, height: 22, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 'var(--text-xs)', fontWeight: 600,
            background: n < 2 ? 'var(--ember)' : n === 2 ? 'var(--ember-soft)' : 'var(--surface)',
            color: n < 2 ? '#08090A' : n === 2 ? 'var(--ember)' : 'var(--fg-subtle)',
            border: n === 2 ? '1px solid var(--ember)' : '1px solid var(--border)',
          }}>{n < 2 ? <Icons.check size={11} strokeWidth={3}/> : n}</div>
          {n < 4 && <div style={{flex: 1, height: 1, background: n < 2 ? 'var(--ember)' : 'var(--border)'}}/>}
        </React.Fragment>
      ))}
    </div>
    <h3 style={{margin: 0, fontSize: 'var(--text-md)', fontWeight: 600}}>Runtime</h3>
    <p style={{color:'var(--fg-muted)', margin:'4px 0 14px', fontSize: 'var(--text-sm)', lineHeight: 1.5}}>
      Where the service runs and how it scales.
    </p>
    <div className="in-field">
      <label className="in-label">Region</label>
      <div className="in-group sm">
        <select className="in-control" defaultValue="us-east-1">
          <option>us-east-1</option><option>eu-west-1</option><option>sa-east-1</option>
        </select>
      </div>
    </div>
    <div className="in-field" style={{marginTop: 12}}>
      <label className="in-label">Min instances</label>
      <div className="in-group sm">
        <input className="in-control" type="number" defaultValue="2"/>
      </div>
    </div>
  </SheetMock>
);

// ==========================================================================
// 5. CONFIRMATION — destructive action with consequences listed.
// ==========================================================================
const CONFIRM_CODE = `<Drawer
  open={open}
  onClose={onClose}
  persistent
  title="Decommission identity-svc?"
  footer={<>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="destructive" disabled>Decommission</Button>
  </>}
>
  <Callout tone="danger" icon={<AlertTriangle/>}>
    This action is irreversible. A scheduled rollback won't bring it back.
  </Callout>
  <Heading>What will happen</Heading>
  <ConsequenceList items={[
    'Traffic drains over 30 minutes.',
    '2 dependent services lose the upstream.',
    'Audit log entry created — visible to compliance.',
    'On-call rotation deletes after 7 days.',
  ]}/>
  <Field label="Type the service name to confirm">
    <Input placeholder="identity-svc"/>
  </Field>
</Drawer>`;

const ConfirmMock = () => (
  <SheetMock
    title="Decommission identity-svc?"
    footer={<>
      <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Cancel</button>
      <button className="btn destructive sm" disabled>Decommission</button>
    </>}
  >
    <div style={{
      display:'flex', gap: 10, padding: 12,
      background:'var(--danger-soft)', borderRadius: 'var(--radius-lg)',
      border:'1px solid rgba(248,113,113,0.25)',
      color:'var(--danger)', fontSize: 'var(--text-sm)', lineHeight: 1.5,
    }}>
      <Icons.alert size={14} style={{flexShrink: 0, marginTop: 1}}/>
      <span>This action is irreversible. A scheduled rollback won't bring it back.</span>
    </div>
    <div className="t-mono-label" style={{marginTop: 16}}>What will happen</div>
    <ul style={{margin:'8px 0 0', padding: 0, listStyle:'none', display:'flex', flexDirection:'column', gap: 8}}>
      {[
        'Traffic drains over 30 minutes.',
        '2 dependent services lose the upstream.',
        'Audit-log entry created — visible to compliance.',
        'On-call rotation deletes after 7 days.',
      ].map(line => (
        <li key={line} style={{display:'flex', gap: 8, fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>
          <Icons.x size={12} color="var(--danger)" style={{flexShrink: 0, marginTop: 3}}/>
          <span>{line}</span>
        </li>
      ))}
    </ul>
    <div className="in-field" style={{marginTop: 16}}>
      <label className="in-label">Type the service name to confirm</label>
      <div className="in-group sm">
        <input className="in-control" placeholder="identity-svc"/>
      </div>
    </div>
  </SheetMock>
);

// ==========================================================================
// PAGE
// ==========================================================================
export default function Sidesheet() {
  const [openLive, setOpenLive] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const openerRef = React.useRef<HTMLButtonElement>(null);

  // Make the live overlay honour the a11y copy: Esc closes from anywhere (a
  // window keydown listener, not a handler on a div that never holds focus),
  // focus enters the panel on open, and returns to the opener on close.
  React.useEffect(() => {
    if (!openLive) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenLive(false); };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      openerRef.current?.focus();
    };
  }, [openLive]);

  return (
    <Section
      id="sidesheet"
      num="18"
      title="Sidesheet"
      desc="Right-edge overlay for working on a record without losing the list behind it — detail, form, filters, wizard, and confirmation patterns share one frame."
    >
      {/* ====================================================================
          1. DETAIL
          ==================================================================== */}
      <SubHead meta="01 · read-only">Detail</SubHead>
      <Lede>This sidesheet pattern ships as <Mono>{'<Drawer side="right" />'}</Mono>. Reach for it over a modal when the user needs surrounding context to stay visible, and over a route change when the work is a quick detour back to the list.</Lede>
      <Frame label="sidesheet — detail (read-only)" code={DETAIL_CODE}>
        <DetailMock/>
      </Frame>
      <p className="ds-caption">
        A read-only profile. Source of truth lives elsewhere — the sidesheet is a peek. Always surface a "Open full page" exit so the user can graduate when the peek isn't enough.
      </p>

      {/* ====================================================================
          2. FORM
          ==================================================================== */}
      <SubHead meta="02 · editable">Form</SubHead>
      <Frame label="sidesheet — form (create / edit)" code={FORM_CODE}>
        <FormMock/>
      </Frame>
      <p className="ds-caption">
        Create or edit a record without leaving the list. Footer pins Cancel + a single ember submit. Validation reports inline — the invalid field turns red, its <Mono>.in-error</Mono> message is wired via <Mono>aria-describedby</Mono>, and the ember submit stays <Mono>disabled</Mono> until the form is valid.
      </p>

      {/* ====================================================================
          3. FILTERS
          ==================================================================== */}
      <SubHead meta="03 · multi-select">Filters</SubHead>
      <Frame label="sidesheet — filters (multi-checkbox + apply)" code={FILTERS_CODE}>
        <FiltersMock/>
      </Frame>
      <p className="ds-caption">
        Use when the filter set is rich (more than 4 facets) or you want a "Clear all + Apply" commit step. For 1–3 quick filters, prefer inline pills above the table.
      </p>

      {/* ====================================================================
          4. WIZARD
          ==================================================================== */}
      <SubHead meta="04 · multi-step">Wizard</SubHead>
      <Frame label="sidesheet — wizard (multi-step)" code={WIZARD_CODE}>
        <WizardMock/>
      </Frame>
      <p className="ds-caption">
        For onboarding flows that need a stepper but don't deserve a full-page takeover. Cap at 4 steps — anything longer wants its own page. Stepper sits in the header so the reader always knows the distance left.
      </p>

      {/* ====================================================================
          5. CONFIRMATION
          ==================================================================== */}
      <SubHead meta="05 · destructive">Confirmation</SubHead>
      <Frame label="sidesheet — destructive confirmation" code={CONFIRM_CODE}>
        <ConfirmMock/>
      </Frame>
      <p className="ds-caption">
        Destructive actions list <em>what will happen</em> in real terms — services, audit entries, dependent owners. The submit stays disabled until the user types the name, so muscle-memory clicks can't trigger it.
      </p>

      {/* ====================================================================
          DECISION MATRIX
          ==================================================================== */}
      <SubHead meta="when to use which">Decision matrix</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">variant guide</span></div>
        <table className="tbl" style={{margin: 0}}>
          <thead>
            <tr><th style={{padding:'10px 12px'}}>Variant</th><th>Use when</th><th>Reach for instead</th></tr>
          </thead>
          <tbody>
            <tr><td className="tok-name">detail</td><td>Reader needs context on a row without losing the list</td><td>Full page, if they need to act for &gt; 30s</td></tr>
            <tr><td className="tok-name">form</td><td>Create / edit one record, &lt; 8 fields</td><td>Modal, if the form has no list context behind it</td></tr>
            <tr><td className="tok-name">filters</td><td>4+ facets, or commit-style "Apply" needed</td><td>Inline pills above the table for 1–3 filters</td></tr>
            <tr><td className="tok-name">wizard</td><td>2–4 step setup that wants a stepper</td><td>Full-page wizard for &gt; 4 steps</td></tr>
            <tr><td className="tok-name">confirmation</td><td>Destructive action with real consequences</td><td>Inline confirm for low-stakes actions (archive, mute)</td></tr>
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '56px 36px', justifyContent:'center'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <SheetMock
                title="identity-svc"
                badge={<TierBadge tier="T1"/>}
                height={300}
                footer={<>
                  <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Close</button>
                  <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}>Open service</button>
                </>}
              >
                <div className="t-mono-label">Last deploy</div>
                <div style={{marginTop: 4, fontSize: 'var(--text-base)'}}>2 minutes ago by Camila Tanaka</div>
                <div style={{display:'flex', gap: 6, marginTop: 12}}>
                  <span className="chip" style={{fontVariantNumeric:'tabular-nums'}}>v4.18.2</span>
                  <span className="chip ok" style={{fontVariantNumeric:'tabular-nums'}}>p95 142ms</span>
                </div>
              </SheetMock>
              {/* leader pins */}
              <div className="pin" style={{top: 18, left: -28}}>1</div>
              <div className="pin" style={{top: 18, right: -28}}>2</div>
              <div className="pin" style={{top: 100, left: -28}}>3</div>
              <div className="pin" style={{bottom: 26, right: -28}}>4</div>
              <div className="pin" style={{top: '50%', right: -52, transform:'translateY(-50%)'}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 580, margin:'48px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Header.</b> Title + optional badge. <Mono>--text-body / 600</Mono>. One row, never wraps.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Close.</b> The <Mono>.dr-close</Mono> icon button, <Mono>aria-label="Close drawer"</Mono>, rendered whenever <Mono>onClose</Mono> is set. Esc also closes (unless <Mono>persistent</Mono>). Always reachable — never scroll past it.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Body.</b> Scrollable. <Mono>padding: 18px</Mono> on the inline edges. Vertical rhythm uses divider rules at 18–22px.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Footer.</b> Sticky on the inline-end. Cancel (ghost) → Submit (ember). Anchored so the primary action stays visible while the body scrolls.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Width.</b> <Mono>--dr-w</Mono> (default <Mono>460px</Mono>), capped at <Mono>100%</Mono>. Slides in from the inline-end over a <Mono>320ms</Mono> transition; under <Mono>prefers-reduced-motion</Mono> it cross-fades in place.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — anchor the primary action in a sticky footer</div>
          <div className="body" style={{padding: 14}}>
            <SheetMock
              title="Edit service"
              height={220}
              footer={<>
                <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Cancel</button>
                <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}>Save changes</button>
              </>}
            >
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Long body content scrolls beneath…</div>
              <div style={{height: 80, marginTop: 8, background:'var(--surface)', borderRadius: 'var(--radius-sm)'}}/>
              <div style={{height: 80, marginTop: 8, background:'var(--surface)', borderRadius: 'var(--radius-sm)'}}/>
            </SheetMock>
          </div>
          <div className="note">Save stays visible no matter how far the body scrolls. The user never has to scroll-hunt for the action they came for.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — let the primary scroll out of view</div>
          <div className="body" style={{padding: 14}}>
            <div style={{
              width: 280, height: 220, display:'flex', flexDirection:'column',
              background:'var(--bg-elevated)', border:'1px solid var(--border-strong)',
              borderRadius: 10, overflow:'hidden',
            }}>
              <div style={{padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize: 'var(--text-base)', fontWeight: 600}}>Edit service</div>
              <div style={{padding: 14, overflowY:'auto', fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>
                Body content scrolls and the Save button is somewhere down here, lost…
                <div style={{height: 60, marginTop: 8, background:'var(--surface)', borderRadius: 'var(--radius-sm)'}}/>
                <div style={{height: 60, marginTop: 8, background:'var(--surface)', borderRadius: 'var(--radius-sm)'}}/>
                <div style={{display:'flex', gap: 6, marginTop: 12}}>
                  <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Cancel</button>
                  <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="note">Inline buttons at the body's tail get lost the moment the form grows. Reader has to scroll to commit — friction = bounce.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — close on Esc + scrim click + close button</div>
          <div className="body" style={{padding: 14, flexDirection:'column', gap: 8, alignItems:'stretch'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'var(--surface)', borderRadius: 'var(--radius-lg)'}}>
              <span style={{fontSize: 'var(--text-base)', fontWeight: 600}}>Three escape hatches</span>
              <button className="btn ghost icon sm" aria-label="Close" tabIndex={-1} style={{cursor:'default'}}><Icons.x size={13}/></button>
            </div>
            <div style={{display:'flex', gap: 6, fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>
              <span className="chip">Esc</span>
              <span className="chip">scrim click</span>
              <span className="chip">close button</span>
            </div>
          </div>
          <div className="note">Three ways out is the floor. The user is borrowing your space; never trap them in it.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — open a modal on top of a sidesheet</div>
          <div className="body" style={{padding: 14, position:'relative'}}>
            <div style={{
              width: 280, height: 200, display:'flex', flexDirection:'column',
              background:'var(--bg-elevated)', border:'1px solid var(--border-strong)',
              borderRadius: 10, overflow:'hidden', position:'relative',
            }}>
              <div style={{padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize: 'var(--text-base)', fontWeight: 600}}>Edit service</div>
              <div style={{padding: 14, fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>
                Sidesheet body…
              </div>
              {/* nested modal */}
              <div style={{
                position:'absolute', inset: 18, borderRadius: 'var(--radius-xl)',
                background:'var(--surface)', border:'1px solid var(--border-strong)',
                boxShadow: 'var(--elev-3)',
                padding: 12, display:'flex', flexDirection:'column', gap: 8,
              }}>
                <div style={{fontSize: 'var(--text-sm)', fontWeight: 600}}>Confirm change?</div>
                <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Modal stacked on top of the sidesheet.</div>
                <div style={{display:'flex', justifyContent:'flex-end', gap: 6, marginTop: 4}}>
                  <button className="btn ghost xs" tabIndex={-1} style={{cursor:'default'}}>No</button>
                  <button className="btn ember xs" tabIndex={-1} style={{cursor:'default'}}>Yes</button>
                </div>
              </div>
            </div>
          </div>
          <div className="note">Stacking surfaces breaks Esc semantics and confuses focus. If you need a confirm step, use the destructive variant or an inline callout — never another overlay.</div>
        </div>
      </div>

      {/* ====================================================================
          Accessibility
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>On open, focus moves into the panel and is trapped while it is open; Tab and Shift+Tab cycle within it. Escape closes the sheet (skip this on a destructive-confirmation variant). On close, focus returns to the control that opened it.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The panel is <code>role=&quot;dialog&quot;</code> with <code>aria-modal=&quot;true&quot;</code>, labelled by its heading via <code>aria-labelledby</code> (add <code>aria-describedby</code> for confirmations). Content behind the scrim is set <code>inert</code> / <code>aria-hidden</code> so it is skipped. The close button has an explicit &quot;Close&quot; label.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every control in the sheet shows the ember focus ring (<code>--ring</code>). Header, body and footer text meet AA (4.5:1) on the elevated panel surface; the scrim darkens the page enough to separate the layers in both themes.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The panel slides in from the inline-end and the scrim fades, both eased with <code>--ease</code>. Under <code>prefers-reduced-motion</code> the slide is dropped — the sheet and scrim cross-fade in place.</div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — the drawer anchors to the inline-end (visually left in RTL)' code={`<div dir="rtl">
  <Drawer
    open
    onClose={onClose}
    title={<><span>identity-svc</span><TierBadge tier="T1"/></>}
    footer={<>
      <Button variant="ghost">إغلاق</Button>
      <Button>فتح الخدمة</Button>
    </>}
  >
    <DefList>
      <DefList.Term>آخر نشر</DefList.Term>
      <DefList.Desc>منذ دقيقتين بواسطة كاميلا تاناكا</DefList.Desc>
    </DefList>
  </Drawer>
</div>`}>
        <div dir="rtl" style={{display:'flex', justifyContent:'center'}}>
          <SheetMock
            title="identity-svc"
            badge={<TierBadge tier="T1"/>}
            footer={<>
              <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>إغلاق</button>
              <button className="btn sm" tabIndex={-1} style={{cursor:'default'}}>فتح الخدمة <Icons.arrowRight size={12} style={{transform:'scaleX(-1)'}}/></button>
            </>}
          >
            <div className="t-mono-label">آخر نشر</div>
            <div style={{marginTop: 4}}>منذ دقيقتين بواسطة كاميلا تاناكا</div>
            <div style={{display:'flex', gap: 6, marginTop: 12, flexWrap:'wrap'}}>
              <span className="chip" style={{direction:'ltr'}}>v4.18.2</span>
              <span className="chip ok">p95 142 مللي</span>
            </div>
            <div className="divider" style={{margin:'18px 0'}}/>
            <div className="t-mono-label">التبعيات</div>
            <div style={{display:'flex', flexDirection:'column', marginTop: 8}}>
              {[['bureau-gateway', 'success'], ['consent-vault', 'success']].map(([d, tone]) => (
                <div key={d} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
                  <span style={{direction:'ltr'}}>{d}</span>
                  <span className={'pill ' + tone}><span className="dot"/>سليم</span>
                </div>
              ))}
            </div>
          </SheetMock>
        </div>
      </Frame>
      <p className="ds-caption">
        <Mono>{'<Drawer side="right" />'}</Mono> anchors to the inline-end via the logical <Mono>.dr-*</Mono> positioning, so it lands on the visual left in RTL automatically — the same prop, mirrored by the stylesheet rather than by changing <Mono>side</Mono>. Service identifiers (<Mono>bureau-gateway</Mono>) stay LTR — code-shaped tokens never read right-to-left.
      </p>

      {/* ====================================================================
          LIVE — open a real position:fixed sidesheet
          ==================================================================== */}
      <SubHead meta="real overlay">Try the live version</SubHead>
      <Frame label="opens a real position:fixed sidesheet (Esc to close)" row>
        <button ref={openerRef} className="btn" onClick={() => setOpenLive(true)}>Open live sidesheet <Icons.arrowRight size={14}/></button>
        <span style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>The mocks above are inline so they fit the docs frame. This one is the real thing — Tab into it, then press Esc.</span>
      </Frame>

      {openLive && (
        <div
          onClick={() => setOpenLive(false)}
          style={{position:'fixed', inset: 0, background:'rgba(8,9,10,0.6)', backdropFilter:'blur(8px)', zIndex: 100}}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidesheet-live-title"
            tabIndex={-1}
            onClick={e => e.stopPropagation()}
            className="sidesheet"
            style={{display:'flex', flexDirection:'column'}}
          >
            <div style={{padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink: 0}}>
              <div style={{display:'flex', alignItems:'center', gap: 10}}>
                <span id="sidesheet-live-title" className="t-body" style={{fontWeight: 600}}>identity-svc</span>
                <TierBadge tier="T1"/>
              </div>
              <button className="btn ghost icon sm" aria-label="Close drawer" onClick={() => setOpenLive(false)}><Icons.x size={14}/></button>
            </div>
            <div style={{padding: 22, overflowY:'auto', flex: 1}}>
              <div className="t-mono-label">Last deploy</div>
              <div className="t-body" style={{marginTop: 4}}>2 minutes ago by Camila Tanaka</div>
              <div style={{display:'flex', gap: 6, marginTop: 16}}>
                <span className="chip" style={{fontVariantNumeric:'tabular-nums'}}>v4.18.2</span>
                <span className="chip ok" style={{fontVariantNumeric:'tabular-nums'}}>p95 142ms</span>
                <span className="chip ok" style={{fontVariantNumeric:'tabular-nums'}}>SLO 99.94%</span>
              </div>
              <div className="divider" style={{margin:'22px 0'}}/>
              <div className="t-mono-label">Dependencies</div>
              <div style={{display:'flex', flexDirection:'column', gap: 8, marginTop: 8}}>
                {['bureau-gateway','consent-vault','session-store'].map(d => (
                  <div key={d} style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-base)', padding:'6px 0'}}>
                    <span>{d}</span><span className="pill success"><span className="dot"/>healthy</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{position:'sticky', insetBlockEnd: 0, padding:'12px 22px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', gap: 8, background:'var(--surface)', flexShrink: 0}}>
              <button className="btn ghost" onClick={() => setOpenLive(false)}>Close</button>
              <button className="btn">Open service <Icons.arrowRight size={14}/></button>
            </div>
          </div>
        </div>
      )}

      <p className="ds-caption">
        Looking for a centered, dismissible surface for self-contained flows (share, edit, attach, preview)? See the dedicated <a href="/modal" style={{color:'var(--ember)'}}>Modal</a> page.
      </p>

      {/* ====================================================================
          API REFERENCE
          ==================================================================== */}
      <SubHead meta="DrawerProps">API reference</SubHead>
      <Lede>This pattern ships as <Mono>{'<Drawer />'}</Mono> from <Mono>@forge/ui</Mono>. A right-edge sidesheet is <Mono>{'<Drawer side="right" />'}</Mono> (the default). Chrome is supplied through the <Mono>title</Mono>, <Mono>desc</Mono> and <Mono>footer</Mono> props — the scrolling body is <Mono>children</Mono>; there are no sub-slot components.</Lede>
      <PropsTable
        label="<Drawer />"
        rows={[
          { prop: 'open',       type: 'boolean', required: true, description: 'Controlled visibility. When false the panel slides out and unmounts after the 320ms exit. Pair with onClose.' },
          { prop: 'onClose',    type: '() => void', description: 'Fires on Esc, scrim click, the X button, and (bottom variant) drag-to-dismiss. Wire it to toggle your open state.' },
          { prop: 'side',       type: '"right" | "left" | "top" | "bottom"', default: '"right"', description: 'Physical edge the panel slides from. right suits forms/edit/detail, left suits navigation, bottom enables drag-to-dismiss, top suits global utilities. Positioning is mirrored under dir="rtl" by the .dr-* logical CSS.' },
          { prop: 'variant',    type: '"overlay" | "inline"', default: '"overlay"', description: 'overlay portals to <body> with a backdrop scrim (the layout behind is unaffected). inline docks into the parent flex/grid so siblings animate alongside the panel.' },
          { prop: 'persistent', type: 'boolean', default: 'false', description: 'Disables scrim-click and drag-to-dismiss; the drawer can still close via the X button or Escape. Use for wizards or forms with unsaved state.' },
          { prop: 'title',      type: 'ReactNode', description: 'Heading rendered inside .dr-header.' },
          { prop: 'desc',       type: 'ReactNode', description: 'Subtitle / description shown below the title in .dr-header.' },
          { prop: 'footer',     type: 'ReactNode', description: 'Content pinned to the panel bottom in .dr-footer. Order: Cancel (ghost) → primary (ember). One ember max.' },
          { prop: 'children',   type: 'ReactNode', description: 'Body content in .dr-body, which scrolls independently of the sticky header and footer.' },
          { prop: 'style',      type: 'CSSProperties', description: 'Forwarded to the .dr panel. Set the --dr-w custom property for width (and --dr-h for the bottom sheet) instead of overriding the class.' },
          { prop: 'className',  type: 'string', description: 'Extra class name(s) appended to the .dr panel element.' },
        ]}
      />
    </Section>
  );
}
