'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Drawer, Lede, Mono } from '@/ds/core';


const USAGE_CODE = `import { useState } from "react"
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
  DrawerDescription, DrawerFooter, DrawerTrigger, DrawerClose,
} from "@/components/forge/drawer"
import { Button } from "@/components/forge/button"

export function Demo() {
  const [open, setOpen] = useState(false)
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="ember">Edit workspace</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workspace settings</DrawerTitle>
          <DrawerDescription>Changes save immediately.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild><Button variant="ghost">Cancel</Button></DrawerClose>
          <Button variant="ember" onClick={() => setOpen(false)}>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}`;


// ─── Form / nav / filter bodies for the demos ────────────────────────────
const SettingsBody = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
    <div className="in-field">
      <label className="in-label">Workspace name</label>
      <div className="in-group"><input className="in-control" defaultValue="Acme Forge"/></div>
    </div>
    <div className="in-field">
      <label className="in-label">Description</label>
      <div className="in-group"><textarea className="in-control" rows={3} defaultValue="Production environment — handle with care." style={{padding: 10, lineHeight: 1.5}}/></div>
    </div>
    <div className="in-field">
      <label className="in-label">Plan</label>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <span className="pill ember">Pro</span>
        <span className="pill">Team</span>
        <span className="pill">Enterprise</span>
      </div>
    </div>
    <label className="fc">
      <input className="fc-input" type="checkbox" defaultChecked/>
      <span className="fc-check-box"><span className="fc-check-icon"><Icons.check size={10}/></span></span>
      <span className="fc-text">
        <span className="fc-label">Send weekly digest</span>
        <span className="fc-desc">Sundays at 19:00 UTC</span>
      </span>
    </label>
  </div>
);

const FilterBody = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
    <div>
      <div style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500, lineHeight: 1, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12}}>Status</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {['Active', 'Pending', 'Paused', 'Cancelled'].map(s => (
          <label key={s} className="fc">
            <input className="fc-input" type="checkbox"/>
            <span className="fc-check-box"><span className="fc-check-icon"><Icons.check size={10}/></span></span>
            <span className="fc-text"><span className="fc-label">{s}</span></span>
          </label>
        ))}
      </div>
    </div>
    <div>
      <div style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500, lineHeight: 1, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12}}>Owner</div>
      <div className="in-field">
        <div className="in-group sm">
          <span className="in-addon icon"><Icons.search size={12}/></span>
          <input className="in-control" placeholder="Filter people…"/>
        </div>
      </div>
    </div>
    <div>
      <div style={{fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500, lineHeight: 1, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12}}>Created</div>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <span className="pill">Today</span>
        <span className="pill ember">Last 7 days</span>
        <span className="pill">Last 30 days</span>
      </div>
    </div>
  </div>
);

type NavEntry = [string, React.ComponentType<{size?: number}>, number | null];
const NavBody = ({ onClose }: { onClose?: () => void }) => (
  <nav style={{display: 'flex', flexDirection: 'column', gap: 4}}>
    {([
      ['Inbox', Icons.bell, 12],
      ['Projects', Icons.folder, null],
      ['Files', Icons.file, null],
      ['Activity', Icons.eye, null],
      ['Team', Icons.user, 4],
      ['Settings', Icons.settings, null],
    ] as NavEntry[]).map(([label, Ico, count]) => (
      <button key={label} type="button" onClick={onClose} style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '11px 14px', borderRadius: 'var(--radius-xl)', background: 'transparent', border: 'none',
        color: 'var(--fg-muted)', cursor: 'pointer', fontSize: 'var(--text-md)', textAlign: 'start',
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        <Ico size={16}/>
        <span style={{flex: 1}}>{label}</span>
        {count && <span className="pill" style={{padding: '1px 6px', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums'}}>{count}</span>}
      </button>
    ))}
  </nav>
);


// ─── Page ───────────────────────────────────────────────────────────────
export default function Page() {
  const [right, setRight]   = React.useState(false);
  const [left, setLeft]     = React.useState(false);
  const [bottom, setBottom] = React.useState(false);
  const [top, setTop]       = React.useState(false);
  const [filter, setFilter] = React.useState(false);
  const [persist, setPersist] = React.useState(false);
  const [rtl, setRtl]       = React.useState(false);

  return (
    <Section
      id="drawer"
      title="Drawer"
      desc="A panel that slides in from any edge to hold rich content — forms, filters, navigation — without forcing a route change. Click a trigger to open; Escape, the overlay, or the X all close it (unless persistent)."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('drawer', 'vaul clsx tailwind-merge')} ariaLabel="package manager"/>
      <Lede>
        Forge's Drawer is built on <Mono>vaul</Mono> — drag-to-dismiss, momentum, and snap points work out of the box. The CLI drops <Mono>drawer.tsx</Mono> and <Mono>utils.ts</Mono> into your project. Pick the <em>Manual</em> tab to copy the source by hand.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn ember" onClick={() => setRight(true)}>Edit workspace</button>
        </div>
      </Frame>

      {/* 3. EXAMPLES divider */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* From the right — settings / edit */}
      <SubHead meta="default">From the right · edit panel</SubHead>
      <Frame
        label='direction="right" — best for forms, settings, edit panels'
        code={`<Drawer open={open} onOpenChange={setOpen} direction="right">
  <DrawerTrigger asChild>
    <Button variant="ember">Edit workspace</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Workspace settings</DrawerTitle>
      <DrawerDescription>Changes save immediately.</DrawerDescription>
    </DrawerHeader>
    <SettingsForm/>
    <DrawerFooter>
      <DrawerClose asChild><Button variant="ghost">Cancel</Button></DrawerClose>
      <Button variant="ember">Save changes</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
      >
        <div style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn ember" onClick={() => setRight(true)}>Edit workspace</button>
        </div>
        <Drawer
          open={right} side="right"
          title="Workspace settings"
          desc="Changes save immediately."
          onClose={() => setRight(false)}
          footer={<>
            <button className="btn ghost" onClick={() => setRight(false)}>Cancel</button>
            <button className="btn ember" onClick={() => setRight(false)}>Save changes</button>
          </>}
        >
          <SettingsBody/>
        </Drawer>
      </Frame>
      <Lede>The right edge is the default for edit panels — keeps the user's mental "back" gesture (left) free for closing. Footer actions read in natural order: cancel first, primary second.</Lede>

      {/* From the left — navigation */}
      <SubHead meta="navigation">From the left · navigation</SubHead>
      <Frame
        label='side="left" — best for navigation surfaces, off-canvas menus'
        code={`<Drawer open={open} side="left" title="Forge" onClose={…}>
  <NavList items={…}/>
</Drawer>`}
      >
        <div style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn" onClick={() => setLeft(true)}>
            <Icons.menu size={14}/> Open menu
          </button>
        </div>
        <Drawer
          open={left} side="left"
          title="Forge"
          desc="Project navigation"
          onClose={() => setLeft(false)}
        >
          <NavBody onClose={() => setLeft(false)}/>
        </Drawer>
      </Frame>

      {/* From the bottom — sheet */}
      <SubHead meta="sheet">From the bottom · sheet</SubHead>
      <Frame
        label='side="bottom" — filters or quick choosers, mobile-thumb reach'
        code={`<Drawer open={open} side="bottom" title="Filter" onClose={…}>
  <FilterControls/>
</Drawer>`}
      >
        <div style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn" onClick={() => setBottom(true)}>
            <Icons.filter size={14}/> Open filters
          </button>
        </div>
        <Drawer
          open={bottom} side="bottom"
          title="Filter results"
          desc="Refine the current view"
          onClose={() => setBottom(false)}
          footer={<>
            <button className="btn ghost" onClick={() => setBottom(false)}>Reset</button>
            <button className="btn ember" onClick={() => setBottom(false)}>Apply filters</button>
          </>}
          style={{'--dr-h': '460px'} as React.CSSProperties}
        >
          <FilterBody/>
        </Drawer>
      </Frame>
      <Lede>Bottom drawers (a.k.a. bottom sheets) inherit a small drag-grip pill at the top — a familiar mobile affordance. Use the bottom edge for filters, choosers, and any "browse-then-pick" flow.</Lede>

      {/* From the top — global search */}
      <SubHead meta="top">From the top · global search</SubHead>
      <Frame
        label='side="top" — global search, notification panels'
        code={`<Drawer open={open} side="top" title="Search workspace" onClose={…}>
  <input placeholder="Search files, people, settings…"/>
</Drawer>`}
      >
        <div style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn" onClick={() => setTop(true)}>
            <Icons.search size={14}/> Search · ⌘K
          </button>
        </div>
        <Drawer
          open={top} side="top"
          title="Quick search"
          desc="Find anything across the workspace"
          onClose={() => setTop(false)}
        >
          <div className="in-field">
            <div className="in-group lg">
              <span className="in-addon icon"><Icons.search size={16}/></span>
              <input className="in-control" placeholder="Search files, people, settings…" autoFocus/>
              <span className="in-addon text"><kbd className="kbd">⌘K</kbd></span>
            </div>
          </div>
          <p style={{fontSize: 'var(--text-base)', color: 'var(--fg-faint)', marginTop: 14}}>Type to search · ↵ to open · Esc to close</p>
        </Drawer>
      </Frame>

      {/* Drawer with form */}
      <SubHead meta="rich content">With a form and a sticky footer</SubHead>
      <Frame
        label="any component composes inside · footer actions stick to the bottom"
      >
        <div style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn ember" onClick={() => setFilter(true)}>Filter results</button>
        </div>
        <Drawer
          open={filter} side="right"
          title="Filter"
          desc="Refine the data view"
          onClose={() => setFilter(false)}
          footer={<>
            <span style={{fontSize: 'var(--text-base)', color: 'var(--fg-faint)', marginInlineEnd: 'auto', alignSelf: 'center'}}>3 filters applied</span>
            <button className="btn ghost" onClick={() => setFilter(false)}>Reset</button>
            <button className="btn ember" onClick={() => setFilter(false)}>Apply</button>
          </>}
        >
          <FilterBody/>
        </Drawer>
      </Frame>

      {/* Persistent */}
      <SubHead meta="persistent">Persistent — no overlay close</SubHead>
      <Frame
        label="persistent · only the close button or Esc dismisses"
        code={`<Drawer open={open} persistent title="Onboarding" onClose={…}>
  <Steps/>
</Drawer>`}
      >
        <div style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn" onClick={() => setPersist(true)}>Open onboarding</button>
        </div>
        <Drawer
          open={persist} side="right" persistent
          title="Onboarding · 1 of 4"
          desc="A guided walkthrough — won't close on overlay click."
          onClose={() => setPersist(false)}
        >
          <p style={{fontSize: 'var(--text-md)', color: 'var(--fg-muted)', lineHeight: 1.65}}>
            Use <code style={{fontFamily: 'var(--font-mono)', color: 'var(--ember)'}}>persistent</code> when accidental dismissal would be costly — multi-step wizards, important forms with unsaved changes, onboarding flows. Close only via the X or Escape.
          </p>
        </Drawer>
      </Frame>
      <Lede>Default drawers close on Escape, click outside, or the X. Pass <code style={{fontFamily: 'var(--font-mono)', color: 'var(--ember)'}}>persistent</code> to disable click-away — a wizard or unsaved form is the typical case.</Lede>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>On open, focus moves into the panel and is trapped: Tab and Shift+Tab cycle only the drawer's controls. Esc closes it (unless persistent), and on close focus returns to the trigger. The close X is Tab-reachable and fires on Enter/Space.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The panel is role="dialog" with aria-modal="true" and is labelled by its title; the close button carries aria-label="Close drawer" and the bottom-sheet drag region is labelled "Drag down to close". A non-modal drawer drops aria-modal so the rest of the page stays reachable.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Controls inside show the ember focus ring (--ring) against the elevated panel; the title (--fg) and description (--fg-muted) clear AA, and the ember footer primary uses dark ink on its fill. The scrim darkens the page behind without trapping the focus ring.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The panel slides in over ~280ms and the scrim fades; the bottom sheet also supports drag-to-dismiss. Under prefers-reduced-motion the global guard reduces these transitions to instant, so the drawer appears in place with no slide.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">Right-to-left</SubHead>
      <Frame
        label='dir="rtl" — slide direction mirrors with the document'
        code={`<div dir="rtl">
  <Drawer open={open} side="right" title="إعدادات" onClose={…}>…</Drawer>
</div>`}
      >
        <div dir="rtl" style={{padding: 24, display: 'flex', justifyContent: 'center'}}>
          <button className="btn ember" onClick={() => setRtl(true)}>تحرير مساحة العمل</button>
        </div>
        <Drawer
          open={rtl} side="right"
          title="إعدادات مساحة العمل"
          desc="تُحفظ التغييرات فورًا."
          onClose={() => setRtl(false)}
          footer={<>
            <button className="btn ghost" onClick={() => setRtl(false)}>إلغاء</button>
            <button className="btn ember" onClick={() => setRtl(false)}>حفظ</button>
          </>}
        >
          <div dir="rtl" style={{color: 'var(--fg-muted)', fontSize: 'var(--text-md)', lineHeight: 1.7}}>
            النموذج بالكامل يعمل تحت <code style={{fontFamily: 'var(--font-mono)', color: 'var(--ember)'}}>dir="rtl"</code> — الحقول، الأيقونات، الحدود، والمحاذاة كلها تنعكس تلقائيًا.
          </div>
        </Drawer>
      </Frame>

      {/* Decision matrix */}
      <SubHead meta="when to use">Drawer vs Modal vs Popover</SubHead>
      <div className="dd-grid">
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Drawer</div>
          <div style={{fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>Rich content (forms, filters, navigation), background still visible, the user is mid-flow.</div>
          <div style={{fontSize: 'var(--text-base)', color: 'var(--fg-subtle)'}}>Edit workspace · filter list · nav drawer.</div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Modal · Alert Dialog</div>
          <div style={{fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>A binary decision the user can't ignore. Centered, full backdrop, no other action available until dismissed.</div>
          <div style={{fontSize: 'var(--text-base)', color: 'var(--fg-subtle)'}}>Confirm delete · payment failed.</div>
        </div>
        <div className="surface" style={{padding: 16}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Popover</div>
          <div style={{fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>Anchored to a trigger, contextual, small (≤ 320 px). The user came for a quick interaction.</div>
          <div style={{fontSize: 'var(--text-base)', color: 'var(--fg-subtle)'}}>Date picker · color picker · profile peek.</div>
        </div>
      </div>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 80px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            {/* Mini Drawer mock — a 420x260 viewport with a right-side panel inside */}
            <div className="stage" style={{position:'relative', width: 420}} aria-hidden="true">
              <div style={{
                position:'relative', width: '100%', height: 260, borderRadius: 'var(--radius-xl)',
                overflow:'hidden', border:'1px solid var(--border)',
                background:'var(--bg)',
              }}>
                {/* Scrim */}
                <div style={{position:'absolute', inset: 0, background:'rgba(0,0,0,0.45)'}}/>
                {/* Drawer panel */}
                <div style={{
                  position:'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: 260,
                  background:'var(--bg-elevated)',
                  borderInlineStart:'1px solid var(--border)',
                  boxShadow:'var(--elev-4)',
                  display:'flex', flexDirection:'column',
                }}>
                  <div style={{
                    display:'flex', alignItems:'flex-start', gap: 10,
                    padding:'14px 16px 12px', borderBottom:'1px solid var(--border)',
                  }}>
                    <div style={{flex: 1, fontFamily:'var(--font-sans)', fontSize:'var(--text-sm)', fontWeight:600, lineHeight:1.3, color:'var(--fg)'}}>Workspace settings</div>
                    <div style={{
                      width: 22, height: 22, borderRadius: 'var(--radius-sm)',
                      display:'inline-flex', alignItems:'center', justifyContent:'center',
                      color:'var(--fg-faint)',
                    }}>
                      <Icons.x size={12}/>
                    </div>
                  </div>
                  <div style={{flex: 1, padding:'14px 16px', fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>
                    Changes save immediately. The background stays visible so the user keeps their context.
                  </div>
                  <div style={{
                    padding:'10px 16px', borderTop:'1px solid var(--border)',
                    display:'flex', gap: 8, justifyContent:'flex-end',
                  }}>
                    <span className="btn ghost" style={{height: 24, fontSize: 'var(--text-xs)', padding:'0 10px'}}>Cancel</span>
                    <span className="btn ember" style={{height: 24, fontSize: 'var(--text-xs)', padding:'0 10px'}}>Save</span>
                  </div>
                </div>
              </div>

              {/* Lead lines + pins */}
              <span className="lead h" style={{top: 40, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 24, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 110, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 180, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 230, right: -28, width: 24}}/>

              <div className="pin" style={{top: 32, left: -52}}>1</div>
              <div className="pin" style={{top: 16, right: -52}}>2</div>
              <div className="pin" style={{top: 102, right: -52}}>3</div>
              <div className="pin" style={{top: 172, right: -52}}>4</div>
              <div className="pin" style={{top: 222, right: -52}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Overlay / scrim.</b> <Mono>.dr-overlay</Mono>. Fades to <Mono>rgba(0,0,0,0.45)</Mono> (dark) / <Mono>0.30</Mono> (light). Click dismisses unless <Mono>persistent</Mono>.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Header + close.</b> <Mono>.dr-header</Mono>. Title (Geist 600/16), optional description, trailing close button (<Mono>.dr-close</Mono>, 32×32, 6px radius).</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Body.</b> <Mono>.dr-body</Mono>. Scrolls independently — the header and footer stay pinned regardless of content length.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Panel.</b> <Mono>.dr.right</Mono>. <Mono>position: fixed</Mono>, slides in via <Mono>transform</Mono> over 280ms. Width defaults to 460px (<Mono>--dr-w</Mono>).</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Footer.</b> <Mono>.dr-footer</Mono>. Right-aligned action stack. Cancel (ghost) leads, primary (ember) trails — same rhythm as Buttons.</span>
          </div>
        </div>
      </div>

      {/* Do/Don't — every pair anchored on Drawer behavior */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — let the drawer slide with motion</div>
          <div className="body" style={{flexDirection: 'column', alignItems: 'stretch', gap: 8}}>
            <div style={{position: 'relative', height: 90, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', insetBlock: 0, insetInlineStart: 0, insetInlineEnd: '38%', background: 'var(--bg-elevated)', borderInlineEnd: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 14px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <span style={{fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--ember)'}}>→</span>
                  <span style={{fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)'}}>280ms cubic</span>
                </div>
              </div>
            </div>
          </div>
          <div className="note">A 280ms slide tells the user where the panel came from and where it'll return to. Snapping in instantly feels like a layout bug.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — pop it in instantly</div>
          <div className="body" style={{flexDirection: 'column', alignItems: 'stretch', gap: 8}}>
            <div style={{position: 'relative', height: 90, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', insetBlock: 0, insetInlineStart: 0, insetInlineEnd: '38%', background: 'var(--bg-elevated)', borderInlineEnd: '1px solid var(--danger)'}}/>
              <div style={{position: 'absolute', insetBlockStart: 6, insetInlineEnd: 8, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--danger)'}}>0ms</div>
            </div>
          </div>
          <div className="note">A drawer that appears with no transition reads as "the page broke" — the eye loses the spatial anchor of where it came from.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — match the edge to the content</div>
          <div className="body" style={{flexDirection: 'column', alignItems: 'stretch', gap: 6}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              <span className="pill ember">Right · forms</span>
              <span className="pill">Left · navigation</span>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              <span className="pill">Bottom · filters</span>
              <span className="pill">Top · search</span>
            </div>
          </div>
          <div className="note">Right for forms (action-oriented), left for nav (back/home), bottom for choosers (mobile-thumb), top for global utilities (search, notifications).</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — open a drawer over an open drawer</div>
          <div className="body" style={{flexDirection: 'column', alignItems: 'stretch', gap: 8}}>
            <div className="surface" style={{padding: 10, borderColor: 'var(--danger)', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)'}}>
              stack[3]: settings → profile → notifications…
            </div>
          </div>
          <div className="note">Drawer-on-drawer confuses dismissal — Esc closes which one? Replace, don't stack.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep header padding generous</div>
          <div className="body">
            <div style={{width: '100%', maxWidth: 280, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden'}}>
              <div style={{padding: '20px 24px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 12}}>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--fg)'}}>Workspace settings</div>
                  <div style={{fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 4}}>Changes save immediately</div>
                </div>
                <button className="dr-close" type="button" style={{position: 'static'}}><Icons.x size={14}/></button>
              </div>
              <div style={{padding: '14px 24px', fontSize: 'var(--text-base)', color: 'var(--fg-muted)'}}>Body content with breathing room.</div>
            </div>
          </div>
          <div className="note">22px / 28px padding (or 20px on small screens). Text touching the edges feels claustrophobic and breaks reading rhythm.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use a drawer for "Are you sure?"</div>
          <div className="body" style={{flexDirection: 'column', alignItems: 'stretch', gap: 8}}>
            <div className="surface" style={{padding: 12, borderColor: 'var(--border-strong)'}}>
              <div style={{fontSize: 'var(--text-base)', color: 'var(--fg)', marginBottom: 8}}>Confirm delete?</div>
              <div style={{display: 'flex', gap: 8}}>
                <button className="btn ghost xs">Cancel</button>
                <button className="btn destructive xs">Delete</button>
              </div>
            </div>
          </div>
          <div className="note">Use an <a href="/alert-dialog" style={{color: 'var(--ember)'}}>Alert Dialog</a> for short binary decisions. The drawer is overkill — a centered modal is what the user expects for "are you sure?".</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="DrawerProps">API reference</SubHead>
      <AutoPropsTable component="Drawer" label="<Drawer />"/>
    </Section>
  );
}
