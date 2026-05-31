'use client';
// Eidos DS — Components / Empty state
// The surface a user sees when there is nothing to show: a fresh inbox, a
// filtered table with no matches, a brand-new project. Title + description
// + primary action — and one quiet illustrative cue (an icon, never an
// emoji).
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Empty as EmptyAtom, Lede, Mono } from '@/ds/core';
  // Phase 1 DEF-04 — the canonical Empty primitive lives in atoms.jsx and
  // ds.css `.empty-*`. The page-local EmptyShell below now wraps it inside
  // a dotted Frame body so the page's preview chrome stays familiar while
  // the empty-state markup itself is the shared one.


  const USAGE_CODE = `import { Empty } from "@/components/forge/empty"
import { Inbox, Plus } from "lucide-react"

export function Demo() {
  return (
    <Empty
      icon={<Inbox size={20} />}
      title="No projects yet"
      desc="Create your first project to deploy services."
      action={<Button variant="ember"><Plus size={12}/> New project</Button>}
    />
  )
}`;

  // Docs-page wrapper: provides the dotted Frame body, then defers to the
  // canonical <Empty/> primitive for everything inside it. Keeps the page
  // visually identical while guaranteeing zero drift from the shared chrome.
  const EmptyShell = ({ icon: Icon, title, desc, primary, secondary, dotted = true }: { icon: React.ComponentType<{size?: number}>; title: string; desc?: string; primary?: React.ReactNode; secondary?: React.ReactNode; dotted?: boolean }) => (
    <div className={'ds-frame-body center' + (dotted ? ' dotted' : '')} style={{padding: 12, minHeight: 220}}>
      <EmptyAtom
        size="md"
        icon={<Icon size={18}/>}
        title={title}
        desc={desc}
        action={primary ? <button className="btn ember">{primary}</button> : undefined}
        secondary={secondary ? <button className="btn ghost">{secondary}</button> : undefined}
      />
    </div>
  );

export default function Empty() {
  return (
    <Section
      id="empty"
      title="Empty state"
      desc="The surface a user sees when there is nothing to show — a fresh project, an empty inbox, a filter that matched nothing. Title + description + one primary action. Never apologise; tell the user what to do next."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('empty')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>Empty</Mono> — a flexible empty-state shell with slots for icon, title, description, and primary/secondary actions.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div className="ds-frame" style={{width:'100%'}}>
          <EmptyShell
            icon={Icons.inbox}
            title="No projects yet"
            desc="Create your first project to deploy services."
            primary={<><Icons.plus size={12}/> New project</>}
          />
        </div>
      </Frame>

      {/* SIZES */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Lede>
        Three sizes drive the same chrome: <Mono>sm</Mono> for inline / table / drawer slots, <Mono>md</Mono> for a page section (the default), and <Mono>lg</Mono> for a hero or full-page empty surface. The icon tile, title and description scale together.
      </Lede>
      <Frame
        label="size prop scales the whole stack"
        code={`<Empty size="sm" icon={<Inbox size={16} />} title="No items" desc="Nothing here yet." />
<Empty size="md" icon={<Inbox size={18} />} title="No items" desc="Nothing here yet." />
<Empty size="lg" icon={<Inbox size={22} />} title="No items" desc="Nothing here yet." />`}
      >
        <div className="ds-frame-body" style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 16, padding: 16, alignItems:'start', width:'100%'}}>
          <div style={{border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', overflow:'hidden'}}>
            <EmptyAtom size="sm" icon={<Icons.inbox size={16}/>} title="No items" desc="Nothing here yet."/>
          </div>
          <div style={{border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', overflow:'hidden'}}>
            <EmptyAtom size="md" icon={<Icons.inbox size={18}/>} title="No items" desc="Nothing here yet."/>
          </div>
          <div style={{border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', overflow:'hidden'}}>
            <EmptyAtom size="lg" icon={<Icons.inbox size={22}/>} title="No items" desc="Nothing here yet."/>
          </div>
        </div>
      </Frame>

      {/* ACCENT VARIANT */}
      <SubHead meta="accent">Accent</SubHead>
      <Lede>
        Set <Mono>accent</Mono> to tint the icon tile with the ember accent — a quiet signal for the one empty state that should pull the eye (an onboarding hero, a primary call to action). Use it at most once per screen; the rest stay neutral.
      </Lede>
      <Frame
        label="accent tints only the icon tile — copy and button are unchanged"
        code={`<Empty
  accent
  icon={<Inbox size={18} />}
  title="No projects yet"
  desc="Create your first project to deploy services."
  action={<Button variant="ember">New project</Button>}
/>`}
      >
        <div className="ds-frame-body center dotted" style={{padding: 12, minHeight: 220, width:'100%'}}>
          <EmptyAtom
            accent
            icon={<Icons.inbox size={18}/>}
            title="No projects yet"
            desc="Create your first project to deploy services."
            action={<button className="btn ember"><Icons.plus size={12}/> New project</button>}
          />
        </div>
      </Frame>

      {/* 3. EXAMPLES */}
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

      {/* ── Default — first-run ─────────────────────────────────── */}
      <SubHead meta="first-run">First-run</SubHead>
      <Frame label="primary action drives the user forward">
        <div className="ds-frame" style={{width:'100%'}}>
          <EmptyShell
            icon={Icons.inbox}
            title="No projects yet"
            desc="Create your first project to deploy services, attach storage, and invite teammates."
            primary={<><Icons.plus size={12}/> New project</>}
            secondary="Import existing"
          />
        </div>
      </Frame>

      {/* ── Filtered ────────────────────────────────────────────── */}
      <SubHead meta="filter result">Empty after a filter</SubHead>
      <Frame label="explain what was searched · offer a clear escape">
        <div className="ds-frame" style={{width:'100%'}}>
          <EmptyShell
            icon={Icons.search}
            title='No services match "edge-prod"'
            desc="Try a different name, or clear the filter to see every service in this workspace."
            primary="Clear filters"
          />
        </div>
      </Frame>

      {/* ── Permission ─────────────────────────────────────────── */}
      <SubHead meta="no access">Permission-locked</SubHead>
      <Frame label="show a different posture · ask, don't punish">
        <div className="ds-frame" style={{width:'100%'}}>
          <EmptyShell
            icon={Icons.shield}
            title="You don't have access to this workspace"
            desc="An admin needs to add you before you can browse services or read logs."
            primary="Request access"
            dotted={false}
          />
        </div>
      </Frame>

      {/* ── Inline / table ──────────────────────────────────────── */}
      <SubHead meta="inside a table">Inline empty</SubHead>
      <Frame label="rendered in the table body — no extra surface">
        <div style={{border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden', width:'100%'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 120px 120px', padding:'10px 14px', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)', letterSpacing:'0.06em', textTransform:'uppercase', borderBottom:'1px solid var(--border)', background:'var(--surface)'}}>
            <span>Service</span><span>Region</span><span>Status</span>
          </div>
          <div style={{padding: 44, textAlign:'center'}}>
            <div style={{display:'inline-flex', flexDirection:'column', alignItems:'center', gap: 8}}>
              <Icons.filter size={18} color="var(--fg-faint)"/>
              <div style={{fontSize: 'var(--text-base)', fontWeight: 600}}>No rows match</div>
              <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>Adjust the filter or clear it to see all services.</div>
            </div>
          </div>
        </div>
      </Frame>

      {/* ── Accessibility ───────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The empty state is read content, not a focus stop. Its primary (and optional secondary) action are real buttons reached with Tab in DOM order and fired with Enter/Space, so a keyboard user can recover the state without a pointer.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The illustrative icon is decorative and aria-hidden, so SRs go straight to the title and description text and then the action button. When the state replaces a region that updated (a cleared filter), host it in a live region so the change is announced.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The primary button shows the ember focus ring (--ring) and uses dark ink on its ember fill (never ember-on-ember). Title (--fg) and description (--fg-muted) clear AA on the surface; the icon tile is decorative chrome, not load-bearing colour.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The empty state renders statically with no entrance animation, so there is nothing to suppress under prefers-reduced-motion; only the button's own hover/active feedback applies and inherits the global guard.</div>
        </div>
      </div>

      {/* ── RTL ─────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — centered + symmetric; only body text aligns to the start'}
        code={`<div dir="rtl">
  <Empty
    icon={<Inbox size={18} />}
    title="لا توجد مشاريع بعد"
    desc="أنشئ مشروعك الأول لنشر الخدمات."
    action={<Button variant="ember">مشروع جديد</Button>}
  />
</div>`}
        lang="tsx"
      >
        <div dir="rtl" className="ds-frame" style={{width:'100%'}}>
          <EmptyShell
            icon={Icons.inbox}
            title="لا توجد مشاريع بعد"
            desc="أنشئ مشروعك الأول لنشر الخدمات."
            primary={<><Icons.plus size={12}/> مشروع جديد</>}
          />
        </div>
      </Frame>
      <Lede>
        The empty state is centered and symmetric, so it is almost direction-agnostic — the icon tile, title, description and button keep their centered stack. Under <Mono>dir="rtl"</Mono> only the text reading direction flips: the body copy aligns to the start and bidi punctuation reorders. The plus glyph on the CTA is non-directional and stays as-is; were the CTA to carry a forward/back arrow it would mirror with <Mono>scaleX(-1)</Mono> to keep tracking the reading direction.
      </Lede>

      {/* ── Anatomy ──────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap: 12, padding: 36, border:'1px dashed var(--border)', borderRadius: 10, background:'var(--surface)', width: 340}}>
                <div style={{width: 44, height: 44, borderRadius: 'var(--radius-2xl)', background:'var(--bg-elevated)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg-muted)'}}>
                  <Icons.inbox size={20}/>
                </div>
                <div>
                  <div style={{fontSize: 'var(--text-md)', fontWeight: 600, letterSpacing:'-0.01em', lineHeight: 1.3}}>No projects yet</div>
                  <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 4, lineHeight: 1.5}}>Create your first project to deploy services.</div>
                </div>
                <button className="btn ember" tabIndex={-1} style={{cursor:'default', marginTop: 4}}><Icons.plus size={12}/> New project</button>
              </div>
              {/* Leader lines */}
              <span className="lead h" style={{top: 58, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 122, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 158, right: -28, width: 24}}/>
              <span className="lead h" style={{bottom: 56, left: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              {/* Pins */}
              <div className="pin" style={{top: 48, left: -52}}>1</div>
              <div className="pin" style={{top: 112, right: -52}}>2</div>
              <div className="pin" style={{top: 148, right: -52}}>3</div>
              <div className="pin" style={{bottom: 46, left: -52}}>4</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Icon tile.</b> One symbolic cue — outline glyph, <Mono>20px</Mono>, inside a <Mono>44px</Mono> tile. Never an emoji or stock illustration.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Title.</b> Names what is missing in 4–6 words. State it plainly: "No projects yet".</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Description.</b> One sentence on why it's empty and how to recover.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Primary action.</b> The single button that resolves the state and drives the user forward.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Spacing rhythm.</b> <Mono>12px</Mono> gap between rows. Center-aligned. Card max-width <Mono>~42ch</Mono>.</span>
          </div>
        </div>
      </div>

      {/* ── Do / Don't ──────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — tell the user what to do next</div>
          <div className="body">
            <EmptyShell
              icon={Icons.inbox}
              title="No deployments yet"
              desc="Deploy this service to staging to see metrics here."
              primary="Deploy now"
            />
          </div>
          <div className="note">The button does the work. Description is one sentence, action is one click.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — apologise or use stock illustrations</div>
          <div className="body">
            <EmptyShell
              icon={Icons.alert}
              title="Oops! Nothing here :("
              desc="Sorry, we couldn't find any deployments at this time. Please try again later or contact support if the issue persists."
            />
          </div>
          <div className="note">Apologetic copy, no path forward. The user doesn't know what to click — the empty state becomes the wall.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="EmptyProps">API reference</SubHead>
      <AutoPropsTable component="Empty" label="<Empty />" />
    </Section>
  );
}
