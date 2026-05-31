'use client';
// Forge DS — Components / Buttons
// Page layout:
//   1. Installation     (TabbedCode: pnpm · npm · yarn · bun · Manual)
//   2. Usage            (Frame: import + minimal render)
//   3. Examples         (Variants · Sizes · With icon · Icon · Loading · States · As Child · RTL)
//   4. Anatomy
//   5. Do / Don't
//   6. API reference    (PropsTable)
//
// Each Frame stacks preview on top + (highlighted) code below. Long snippets
// auto-collapse to ~6 lines with a "Show code" toggle (see CollapsibleCode
// in primitives.jsx).
import { Icons, Frame, TabbedCode, PropsTable, Section, SubHead, Lede, Mono } from '@/components/docs';

// ---- Style helpers (inline tokens used for muted body copy) --------------
const lede   = { fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: '68ch' };

// ==========================================================================
// 1.  INSTALLATION — Tabbed CLI command per package manager.
//     "Manual" is the last tab; it stays hidden until the user picks it.
// ==========================================================================
const INSTALL_PNPM = `pnpm dlx forge-ui@latest add button`;
const INSTALL_NPM  = `npx forge-ui@latest add button`;
const INSTALL_YARN = `yarn dlx forge-ui@latest add button`;
const INSTALL_BUN  = `bunx forge-ui@latest add button`;
// The Forge registry is shadcn registry-item.json compatible — the stock CLI works too.
const INSTALL_SHADCN = `npx shadcn@latest add https://forge.equifax.dev/r/button.json`;

// Manual install — Forge components are semantic-class React (no Radix, no CVA);
// the only baseline dep is the cn() helper. Shown when the user picks "Manual".
const INSTALL_MANUAL = `# 1. Install the Forge base layer once (design tokens + ds.css + cn).
npx forge-ui@latest init

# 2. Copy components/forge/button.tsx from the Forge source
#    into your repo (https://github.com/forge/design-system) — or just run
#    \`forge-ui add button\` to do steps 1–2 for you.

# 3. Import the Forge stylesheet layer at your app root so the .btn classes
#    resolve:  styles/forge/tokens.css → styles/forge/ds.css
#    (npm install clsx tailwind-merge if you copied by hand).`;

const INSTALL_TABS = [
  { label: 'pnpm',   code: INSTALL_PNPM,   lang: 'bash' },
  { label: 'npm',    code: INSTALL_NPM,    lang: 'bash' },
  { label: 'yarn',   code: INSTALL_YARN,   lang: 'bash' },
  { label: 'bun',    code: INSTALL_BUN,    lang: 'bash' },
  { label: 'shadcn', code: INSTALL_SHADCN, lang: 'bash' },
  { label: 'Manual', code: INSTALL_MANUAL, lang: 'bash' },
];

// ==========================================================================
// 2.  USAGE — the minimal "hello world" of <Button>
// ==========================================================================
const USAGE_CODE = `import { Button } from "@/components/forge/button"

export function Demo() {
  return <Button variant="ember">Deploy</Button>
}`;

// ==========================================================================
// PAGE
// ==========================================================================
export default function Buttons() {
  return (
    <Section
      id="buttons"
      num="08"
      title="Buttons"
      desc="Six variants, four sizes. One ember per surface — primary action only. Pair with secondary, outline, or ghost for the rest of the row."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_TABS} ariaLabel="package manager"/>
      <Lede>
        The CLI copies <Mono>button.tsx</Mono> and its CSS into your repo so you can edit them — Forge is source-shipped, not a black-box dependency. Pick the <em>Manual</em> tab if you'd rather paste the files by hand.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <button className="btn ember">Deploy</button>
      </Frame>

      {/* ====================================================================
          3. EXAMPLES — divider eyebrow
          ==================================================================== */}
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

      {/* ---- Variants ---- */}
      <SubHead meta="6 variants">Variants</SubHead>
      <Frame
        label="primary · ember · outline · ghost · link · destructive"
        row
        code={`<Button variant="ember">Deploy</Button>
<Button>Open service</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="link">Learn more</Button>
<Button variant="destructive">Delete</Button>`}>
        <button className="btn ember">Deploy</button>
        <button className="btn">Open service</button>
        <button className="btn outline">Cancel</button>
        <button className="btn ghost">Skip</button>
        <button className="btn link">Learn more</button>
        <button className="btn destructive">Delete</button>
      </Frame>

      <SubHead meta="when to use">Pick a variant</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">variant guide</span></div>
        <table className="spec" style={{margin: 0}}>
          <thead><tr><th style={{padding:'10px 12px'}}>Variant prop</th><th>Use for</th><th>Per surface</th></tr></thead>
          <tbody>
            <tr><td className="tok-name">variant="ember"</td><td>The single most important action</td><td className="mono">max 1</td></tr>
            <tr><td className="tok-name">variant="primary"</td><td>The default — non-destructive, non-primary</td><td className="mono">multiple</td></tr>
            <tr><td className="tok-name">variant="outline"</td><td>Same hierarchy as default, but on busier surfaces (forms, dialogs)</td><td className="mono">multiple</td></tr>
            <tr><td className="tok-name">variant="ghost"</td><td>Tertiary — close, dismiss, optional toggles</td><td className="mono">multiple</td></tr>
            <tr><td className="tok-name">variant="link"</td><td>Inline navigation that reads as text</td><td className="mono">unlimited</td></tr>
            <tr><td className="tok-name">variant="destructive"</td><td>Irreversible action — delete, revoke, force-rollback</td><td className="mono">max 1</td></tr>
          </tbody>
        </table>
      </div>

      {/* ---- Sizes ---- */}
      <SubHead meta="4 sizes">Sizes</SubHead>
      <Frame
        label="xs · sm · md (default) · lg"
        row
        code={`<Button variant="ember" size="xs">Extra small</Button>
<Button variant="ember" size="sm">Small</Button>
<Button variant="ember">Medium (default)</Button>
<Button variant="ember" size="lg">Large</Button>`}>
        <button className="btn ember xs">Extra small</button>
        <button className="btn ember sm">Small</button>
        <button className="btn ember">Medium</button>
        <button className="btn ember lg">Large</button>
      </Frame>

      {/* ---- With icons ---- */}
      <SubHead meta="leading + trailing">With icon</SubHead>
      <Frame
        label="leading · trailing · both"
        row
        code={`import { Rocket, ArrowRight, Filter, ChevronRight } from "lucide-react"

<Button variant="ember">
  <Rocket size={14} /> Deploy
</Button>

<Button>
  Open service <ArrowRight size={14} />
</Button>

<Button variant="outline">
  <Filter size={14} /> Filter <ChevronRight size={14} />
</Button>`}>
        <button className="btn ember"><Icons.rocket size={14}/> Deploy</button>
        <button className="btn">Open service <Icons.arrowRight size={14}/></button>
        <button className="btn outline"><Icons.filter size={14}/> Filter <Icons.chevronRight size={14}/></button>
      </Frame>

      {/* ---- Icon-only ---- */}
      <SubHead meta="square footprint">Icon</SubHead>
      <Frame
        label="aria-label required · icon prop"
        row
        code={`<Button icon aria-label="Settings">
  <Settings size={14} />
</Button>

<Button icon variant="ember" aria-label="Add">
  <Plus size={14} />
</Button>

<Button icon variant="ghost" aria-label="More">
  <MoreHorizontal size={14} />
</Button>

<Button icon variant="outline" aria-label="Search">
  <Search size={14} />
</Button>`}>
        <button className="btn icon" aria-label="Settings"><Icons.settings size={14}/></button>
        <button className="btn icon ember" aria-label="Add"><Icons.plus size={14}/></button>
        <button className="btn icon ghost" aria-label="More"><Icons.more size={14}/></button>
        <button className="btn icon outline" aria-label="Search"><Icons.search size={14}/></button>
      </Frame>

      {/* ---- Loading ---- */}
      <SubHead meta="loading prop">Loading</SubHead>
      <Frame
        label='aria-busy auto-set · disables clicks'
        row
        code={`<Button variant="ember" loading>
  Deploying
</Button>

<Button loading>Saving</Button>

<Button variant="outline" loading>
  Refreshing
</Button>`}>
        <button className="btn ember" aria-busy="true" disabled style={{position:'relative'}}>
          <span className="ds-spin" aria-hidden="true" style={{display:'inline-block', width: 12, height: 12, border:'1.5px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', marginInlineEnd: 4}}/>
          Deploying
        </button>
        <button className="btn" aria-busy="true" disabled style={{position:'relative'}}>
          <span className="ds-spin" aria-hidden="true" style={{display:'inline-block', width: 12, height: 12, border:'1.5px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', marginInlineEnd: 4}}/>
          Saving
        </button>
        <button className="btn outline" aria-busy="true" disabled style={{position:'relative'}}>
          <span className="ds-spin" aria-hidden="true" style={{display:'inline-block', width: 12, height: 12, border:'1.5px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', marginInlineEnd: 4}}/>
          Refreshing
        </button>
      </Frame>

      {/* ---- States ---- */}
      <SubHead meta="default · hover · active · focus · disabled">States</SubHead>
      <Frame
        label="state matrix"
        row
        code={`<Button variant="ember">Default</Button>
<Button variant="ember" data-state="hover">Hover</Button>
<Button variant="ember" disabled>Disabled</Button>`}>
        <button className="btn ember">Default</button>
        <button className="btn ember" style={{background:'var(--ember-glow)', borderColor:'var(--ember-glow)', transform:'translateY(-1px)'}}>Hover</button>
        <button className="btn ember" style={{transform:'scale(0.98)'}}>Active</button>
        <button className="btn ember" style={{outline:'var(--ring-width) solid var(--ring)', outlineOffset:'var(--ring-offset)'}}>Focus</button>
        <button className="btn ember" disabled>Disabled</button>
      </Frame>

      {/* ---- As Child ---- */}
      <SubHead meta="asChild prop">As a link</SubHead>
      <Lede up>
        Pass <Mono>asChild</Mono> and wrap an <Mono>&lt;a&gt;</Mono> or a Next.js <Mono>&lt;Link&gt;</Mono>. Use anchors when the action navigates; use a button when it triggers behaviour. Don't fake one with the other — assistive tech listens.
      </Lede>
      <Frame
        label="proxies styling onto <a>"
        row
        code={`<Button variant="ember" asChild>
  <a href="/services">Open services</a>
</Button>

<Button variant="link" asChild>
  <a href="/docs">
    Docs <ArrowRight size={12} />
  </a>
</Button>`}>
        <a className="btn ember" href="#" onClick={e => e.preventDefault()}>Open services</a>
        <a className="btn link" href="#" onClick={e => e.preventDefault()}>Docs <Icons.arrowRight size={12}/></a>
      </Frame>

      {/* ---- Accessibility ---- */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A <Mono>&lt;button&gt;</Mono> is in the tab order and activates on both <Mono>Enter</Mono> and <Mono>Space</Mono>. An <Mono>asChild</Mono> anchor activates on <Mono>Enter</Mono> only — match the element to the behaviour. A disabled button leaves the tab order entirely.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Text buttons announce their label automatically. An <strong>icon-only</strong> button announces nothing, so it must carry an <Mono>aria-label</Mono>. The loading state sets <Mono>aria-busy</Mono> and keeps its name; <Mono>asChild</Mono> anchors announce as links, so use them only when the action navigates.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every variant shows the ember focus ring (<Mono>--ring</Mono>) at ≥3:1 against the surface. The ember fill carries dark ink (<Mono>--bg</Mono>) for AA text contrast; ghost and outline keep a visible border so the control is never colour-only. Hit targets meet the 44px touch minimum.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Hover and active transitions ease with <Mono>--ease</Mono>. The loading spinner uses the system <Mono>.ds-spin</Mono> utility: under <Mono>prefers-reduced-motion: reduce</Mono> its rotation is swapped for a calm opacity pulse, so the busy state stays legible without spinning — and the label plus <Mono>aria-busy</Mono> still carry it to assistive tech.</div>
        </div>
      </div>

      {/* ---- RTL ---- */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — leading/trailing flip with reading direction'
        row
        code={`<div dir="rtl">
  {/* Leading icon stays at the start (now on the right) */}
  <Button variant="ember">
    <Rocket size={14} /> نشر
  </Button>

  {/* Trailing arrow follows the reading direction.
     We flip directional arrows so they still mean "forward". */}
  <Button>
    فتح الخدمة <ArrowRight size={14} className="rtl:scale-x-[-1]" />
  </Button>

  {/* Cancel still leads, primary still on the trailing edge */}
  <div className="flex gap-2">
    <Button variant="ghost">إلغاء</Button>
    <Button variant="ember">حفظ</Button>
  </div>
</div>`}>
        <div dir="rtl" style={{display:'flex', flexWrap:'wrap', gap: 12, alignItems:'center'}}>
          <button className="btn ember"><Icons.rocket size={14}/> نشر</button>
          <button className="btn">فتح الخدمة <Icons.arrowRight size={14} style={{transform:'scaleX(-1)'}}/></button>
          <button className="btn outline"><Icons.filter size={14}/> فلتر <Icons.chevronRight size={14} style={{transform:'scaleX(-1)'}}/></button>
          <div style={{display:'flex', gap: 8}}>
            <button className="btn ghost">إلغاء</button>
            <button className="btn ember">حفظ</button>
          </div>
        </div>
      </Frame>
      <Lede>
        Buttons use <Mono>display: inline-flex</Mono>, so leading icons land on the right and trailing icons on the left automatically. Directional arrows (<Mono>ArrowRight</Mono>, <Mono>ChevronRight</Mono>) get a <Mono>scaleX(-1)</Mono> mirror so "forward" still tracks the reading direction. Static icons (rocket, filter, settings) stay as-is.
      </Lede>

      {/* ====================================================================
          4. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <button className="btn ember" tabIndex={-1} style={{cursor:'default'}}>Deploy <Icons.rocket size={14}/></button>
              <span className="lead v" style={{top: -22, left: 22, height: 18}}/>
              <span className="lead v" style={{top: -22, right: 26, height: 18}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <span className="lead h" style={{top: 16, right: -28, width: 24}}/>
              <div className="pin" style={{top: -42, left: 22, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, right: 26, transform:'translateX(50%)'}}>2</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{top: 8, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Label.</b> Geist 500/13. Sentence case. Verb + noun.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Trailing icon.</b> 14px. Optional. Use for outbound, deploy, run actions.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Height 32px / radius 6px.</b> 12px horizontal padding. <Mono>size="sm"</Mono> = 26px, <Mono>size="lg"</Mono> = 40px.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Hover lifts 1px.</b> Active scales to 0.98. Both via <Mono>--ease</Mono>.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          5. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one ember per surface</div>
          <div className="body" style={{gap: 8}}>
            <button className="btn ghost">Cancel</button>
            <button className="btn outline">Save draft</button>
            <button className="btn ember">Deploy</button>
          </div>
          <div className="note">Ember reserves attention. Pair with secondary, outline, or ghost for the rest of the row.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — multiple primaries</div>
          <div className="body" style={{gap: 8}}>
            <button className="btn ember">Deploy</button>
            <button className="btn ember">Rollback</button>
            <button className="btn ember">Approve</button>
          </div>
          <div className="note">Three embers cancel each other out. Pick the one verb that matters most.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — destructive at the end</div>
          <div className="body" style={{gap: 8}}>
            <button className="btn ghost">Cancel</button>
            <button className="btn outline">Save</button>
            <button className="btn destructive">Delete</button>
          </div>
          <div className="note">Destructive sits at the trailing edge, far from Cancel. Reduces fat-finger risk.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — destructive next to Cancel</div>
          <div className="body" style={{gap: 8}}>
            <button className="btn destructive">Delete</button>
            <button className="btn">Cancel</button>
          </div>
          <div className="note">Inverting the order trains users to misclick. Cancel always leads.</div>
        </div>
      </div>

      {/* ====================================================================
          6. API REFERENCE
          ==================================================================== */}
      <SubHead meta="ButtonProps">API reference</SubHead>
      <PropsTable
        label="<Button />"
        rows={[
          { prop: 'variant', type: '"primary" | "ember" | "outline" | "ghost" | "link" | "destructive"', default: '"primary"', description: 'Visual style. Use ember for the single most important action per surface.' },
          { prop: 'size',    type: '"xs" | "sm" | "md" | "lg"', default: '"md"', description: 'Footprint. md is 32px tall; lg is 40px.' },
          { prop: 'icon',    type: 'boolean', default: 'false', description: 'Square icon-only footprint. Requires aria-label.' },
          { prop: 'asChild', type: 'boolean', default: 'false', description: 'Render as the wrapped child (e.g. <a>, Next.js <Link>) while keeping Button styling.' },
          { prop: 'loading', type: 'boolean', default: 'false', description: 'Show spinner, lock interaction, set aria-busy.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Standard HTMLButton disabled. Implied by loading.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra utility classes. Merged via cn() — Tailwind conflicts resolved by tailwind-merge.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Label, optional leading/trailing icon. For icon-only, a single icon plus aria-label.' },
        ]}
      />
    </Section>
  );
}
