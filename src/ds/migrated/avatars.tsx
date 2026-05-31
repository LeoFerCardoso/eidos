'use client';
// Eidos DS — Components / Avatars.
// Initials-first by default — Eidos surfaces are dense, and a circle of
// initials reads faster than a low-res face. Image variant for product
// surfaces where photo identity matters; status dot for presence.
import { Avatar, Frame, Icons, Pill, OwnerPill, PropsTable, Section, SubHead, TabbedCode, installTabs, Lede, Mono, AutoPropsTable, Skeleton, Alert, AlertTitle, AlertDescription, Kbd } from '@/ds/core';


  const USAGE_CODE = `import { Avatar } from "@/components/forge/avatar"

export function Demo() {
  return (
    <Avatar size="lg" name="Ana Silva">AS</Avatar>
  )
}`;

  const PEOPLE = [
    { initials: 'AS', name: 'Ana Silva',    ember: false },
    { initials: 'BC', name: 'Bruno Costa',  ember: true  },
    { initials: 'CO', name: 'Camila O.',    ember: false },
    { initials: 'DM', name: 'Diego Matos',  ember: false },
    { initials: 'EL', name: 'Eliane L.',    ember: false },
  ];

  // Real headshots (200px) in public/avatars/. The file name IS the person's
  // name (Ashley-Williams.jpg → "Ashley Williams"), so name + src stay in sync.
  const PHOTO_PEOPLE = [
    { name: 'Ashley Williams', initials: 'AW', role: 'Staff SRE',     src: '/avatars/Ashley-Williams.jpg' },
    { name: 'Mariana Rossi',   initials: 'MR', role: 'Platform Eng',  src: '/avatars/Mariana-Rossi.jpg' },
    { name: 'Diego Ferreira',  initials: 'DF', role: 'Tribe Owner',   src: '/avatars/Diego-Ferreira.jpg' },
    { name: 'Yuki Tanaka',     initials: 'YT', role: 'Backend Eng',   src: '/avatars/Yuki-Tanaka.jpg' },
    { name: 'Marcus Johnson',  initials: 'MJ', role: 'Security Eng',  src: '/avatars/Marcus-Johnson.jpg' },
    { name: 'Emma Larsson',    initials: 'EL', role: 'Eng Manager',   src: '/avatars/Emma-Larsson.jpg' },
    { name: 'Raj Patel',       initials: 'RP', role: 'Data Eng',      src: '/avatars/Raj-Patel.jpg' },
  ];

export default function Avatars() {
  return (
    <Section
      id="avatars"
      num="12"
      title="Avatars"
      desc="Identity at a glance. Initials by default — they read faster than a low-resolution photo. Reach for an image only when the product is identity-focused (a profile page, a comment thread)."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('avatar')} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>Avatar</Mono>, <Mono>Avatar.Group</Mono>, and <Mono>Avatar.StatusDot</Mono> — plain React over the Eidos CSS layer, with deterministic image fallback to initials.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" row code={USAGE_CODE}>
        <Avatar size="lg" name="Ana Silva">AS</Avatar>
      </Frame>

      {/* 3. EXAMPLES */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* Sizes */}
      <SubHead meta="5 sizes">Sizes</SubHead>
      <Frame
        label="xs · sm · md (default) · lg · xl"
        row
        code={`<Avatar size="xs" name="Ana Silva">AS</Avatar>
<Avatar size="sm" name="Ana Silva">AS</Avatar>
<Avatar         name="Ana Silva">AS</Avatar>
<Avatar size="lg" name="Ana Silva">AS</Avatar>
<Avatar size="xl" name="Ana Silva">AS</Avatar>`}
      >
        <Avatar size="xs" name="Ana Silva">AS</Avatar>
        <Avatar size="sm" name="Ana Silva">AS</Avatar>
        <Avatar         name="Ana Silva">AS</Avatar>
        <Avatar size="lg" name="Ana Silva">AS</Avatar>
        <Avatar size="xl" name="Ana Silva">AS</Avatar>
      </Frame>

      {/* Variants */}
      <SubHead meta="initials · image · ember · icon">Variants</SubHead>
      <Frame
        label="four ways to fill the circle"
        row
        code={`{/* Initials (default) */}
<Avatar size="lg" name="Ana Silva">AS</Avatar>

{/* Ember — for the current user / "you" */}
<Avatar size="lg" name="You" ember>YO</Avatar>

{/* Image — falls back to initials on error */}
<Avatar size="lg" name="Mariana Rossi" src="/avatars/Mariana-Rossi.jpg" />

{/* Icon — for system / bot users */}
<Avatar size="lg" name="Bot"><Icons.cpu size={16}/></Avatar>`}
      >
        <Avatar size="lg" name="Ana Silva">AS</Avatar>
        <Avatar size="lg" name="You" ember>YO</Avatar>
        <Avatar size="lg" name="Mariana Rossi" src="/avatars/Mariana-Rossi.jpg" />
        <Avatar size="lg" name="Bot"><Icons.cpu size={16} color="var(--fg-muted)"/></Avatar>
      </Frame>

      {/* With photo — real headshots, initials fallback on error */}
      <SubHead meta="src · initials fallback">With photo</SubHead>
      <Frame
        label="seven real headshots — drop a src and the circle becomes a photo; a broken URL degrades to initials"
        row
        code={`{/* The file name IS the person's name — Ashley-Williams.jpg → "Ashley Williams" */}
<Avatar size="lg" name="Ashley Williams" src="/avatars/Ashley-Williams.jpg" status="online" />
<Avatar size="lg" name="Mariana Rossi"   src="/avatars/Mariana-Rossi.jpg" />
<Avatar size="lg" name="Diego Ferreira"  src="/avatars/Diego-Ferreira.jpg" status="away" />
{/* …a broken URL falls back to the computed initials */}
<Avatar size="lg" name="Broken URL"      src="/nope.jpg">BU</Avatar>`}
      >
        {PHOTO_PEOPLE.slice(0, 5).map((p, i) => (
          <Avatar key={p.src} size="lg" name={p.name} src={p.src} status={i === 0 ? 'online' : i === 2 ? 'away' : undefined}>
            {p.initials}
          </Avatar>
        ))}
        <Avatar size="lg" name="Broken URL" src="/nope.jpg">BU</Avatar>
      </Frame>
      <Lede>
        Pass <Mono>src</Mono> for product surfaces where the face matters — a profile header, a comment
        thread, a reviewer row. The initials render first and stay as the fallback if the image 404s, so
        identity never collapses to an empty circle. Keep images square and ≥2× the rendered size; the
        component crops to a circle with <Mono>object-fit: cover</Mono>.
      </Lede>

      {/* States — what the avatar resolves to before / on failure / unknown */}
      <SubHead meta="loading · error · unknown">States</SubHead>
      <Frame
        label="loading (skeleton) · image error → initials · unknown identity → neutral icon"
        row
        code={`{/* Loading — circle skeleton while the user record resolves */}
{loading ? <Skeleton variant="circle" size={36} /> : <Avatar src={user.src}>{user.initials}</Avatar>}

{/* Image error — a 404 src degrades to the computed initials, never an empty ring */}
<Avatar size="lg" name="Diego Ferreira" src="/nope.jpg">DF</Avatar>

{/* Unknown — no name, no src: a neutral person icon, not a blank circle */}
<Avatar size="lg" name=""><Icons.user size={16} color="var(--fg-muted)"/></Avatar>`}
      >
        <div style={{display:'flex', alignItems:'center', gap: 20, flexWrap:'wrap'}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 8}}>
            <Skeleton variant="circle" size={36} label="Loading avatar"/>
            <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)'}}>loading</span>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 8}}>
            <Avatar size="lg" name="Diego Ferreira" src="/nope.jpg">DF</Avatar>
            <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)'}}>image error</span>
          </div>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 8}}>
            <Avatar size="lg" name=""><Icons.user size={16} color="var(--fg-muted)"/></Avatar>
            <span style={{fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)'}}>unknown</span>
          </div>
        </div>
      </Frame>
      <Alert tone="danger" style={{ marginBlockStart: 14 }}>
        <AlertTitle>Image failed to load</AlertTitle>
        <AlertDescription>
          On an <Mono>onError</Mono> the component swaps to the computed initials in place — the circle is
          never empty and the announced <Mono>name</Mono> is unchanged, so a broken CDN never costs you
          identity. This <Mono>role=&quot;alert&quot;</Mono> banner is the page-level pattern for the same
          failure when you want it surfaced rather than silently degraded.
        </AlertDescription>
      </Alert>

      {/* Photo group */}
      <SubHead meta="photo stack">Photo group</SubHead>
      <Frame
        label="overlapping photo avatars — the on-call rotation, the reviewers, the squad"
        row
        code={`<Avatar.Group max={5}>
  {team.map(p => <Avatar key={p.src} name={p.name} src={p.src} />)}
</Avatar.Group>`}
      >
        <Avatar.Group max={5}>
          {PHOTO_PEOPLE.map((p) => (
            <Avatar key={p.src} name={p.name} src={p.src} />
          ))}
        </Avatar.Group>
      </Frame>

      {/* Status */}
      <SubHead meta="presence">With status</SubHead>
      <Frame
        label="online · away · busy · offline"
        row
        code={`<Avatar size="lg" name="Ana — online" status="online">AS</Avatar>
<Avatar size="lg" name="Bruno — away" status="away">BC</Avatar>
<Avatar size="lg" name="Camila — busy" status="busy">CO</Avatar>
<Avatar size="lg" name="Diego — offline" status="offline">DM</Avatar>`}
      >
        <Avatar size="lg" name="Ana — online" status="online">AS</Avatar>
        <Avatar size="lg" name="Bruno — away" status="away">BC</Avatar>
        <Avatar size="lg" name="Camila — busy" status="busy">CO</Avatar>
        <Avatar size="lg" name="Diego — offline" status="offline">DM</Avatar>
      </Frame>

      {/* Group */}
      <SubHead meta="overlapping">Avatar group</SubHead>
      <Frame
        label="LTR · later avatars stack on top · +N overflow on the right"
        row
        code={`<Avatar.Group max={4}>
  <Avatar name="Ana">AS</Avatar>
  <Avatar name="Bruno" ember>BC</Avatar>
  <Avatar name="Camila">CO</Avatar>
  <Avatar name="Diego">DM</Avatar>
  <Avatar name="Eliane">EL</Avatar>
  {/* Hidden ones collapse to +N */}
</Avatar.Group>`}
      >
        <Avatar.Group max={4}>
          {PEOPLE.map(p => (
            <Avatar key={p.initials} name={p.name} ember={p.ember}>{p.initials}</Avatar>
          ))}
        </Avatar.Group>
      </Frame>

      {/* In-row context */}
      <SubHead meta="in context">In a row</SubHead>
      <Frame
        label="approver row · author + timestamp"
        code={`<div className="flex gap-3 items-center">
  <Avatar size="lg" name="Ana Silva" ember>AS</Avatar>
  <div>
    <div className="text-sm font-semibold">Ana Silva</div>
    <div className="text-xs text-muted font-mono">Approved · 2m ago</div>
  </div>
</div>`}
      >
        <div className="surface" style={{padding: 12, width:'100%'}}>
          <div style={{display:'flex', gap: 12, alignItems:'center'}}>
            <Avatar size="lg" name="Ana Silva" ember>AS</Avatar>
            <div style={{flex: 1}}>
              <div style={{fontSize: 'var(--text-base)', fontWeight: 600, letterSpacing:'-0.005em'}}>Ana Silva</div>
              <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>Approved · 2m ago · GMUD #4821</div>
            </div>
            <Pill tone="success" dot>Approved</Pill>
          </div>
        </div>
      </Frame>

      {/* Owner pill composition */}
      <SubHead meta="row composition">Owner pill</SubHead>
      <Lede up>
        <Mono>{'<OwnerPill>'}</Mono> is <Mono>{'<Avatar>'}</Mono> + name in a single inline tag — it
        composes the avatar at size 20 with a name and an optional muted role suffix. Lives in service /
        agent catalogs (&ldquo;owned by …&rdquo;), PR review rows, and incident-commander rows. It hugs
        its content (it does <em>not</em> stretch to the column), so it sits cleanly inside a table cell.
      </Lede>
      <Frame label="name only · with role · ember-tinted · with photo">
        <div style={{display:'flex', flexDirection:'column', gap: 10, alignItems:'flex-start'}}>
          <OwnerPill person={PEOPLE[0]}/>
          <OwnerPill person={{ ...PEOPLE[2], initials: 'CT' }} role="SRE"/>
          <OwnerPill person={{ name: 'Rafael Mendonça', initials: 'RM' }} role="Tribe Owner" ember/>
          <OwnerPill person={PHOTO_PEOPLE[0]} role={PHOTO_PEOPLE[0].role}/>
          <OwnerPill person={PHOTO_PEOPLE[2]} role={PHOTO_PEOPLE[2].role}/>
        </div>
      </Frame>
      <Lede>
        Give <Mono>person.src</Mono> to render a photo avatar (initials fallback on error). Drop the pill
        into a table cell, an incident header, or a sidesheet &ldquo;owners&rdquo; stack:{' '}
        <Mono>{'<OwnerPill person={{ name, initials, src }} role="SRE" />'}</Mono>.
      </Lede>
      <AutoPropsTable component="OwnerPill" label="<OwnerPill />" />

      {/* Owner pill — photo rows in a realistic owners list */}
      <SubHead meta="owners list">Owners list (with photos)</SubHead>
      <Frame
        label="a service-detail 'owners' stack — photo OwnerPills hug their content, one per row"
        code={`{owners.map(p => (
  <OwnerPill key={p.src} person={p} role={p.role} />
))}`}
      >
        <div className="surface" style={{ padding: 14, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
            {PHOTO_PEOPLE.map((p) => (
              <OwnerPill key={p.src} person={p} role={p.role} />
            ))}
          </div>
        </div>
      </Frame>

      {/* Interactive — the avatar is decorative; the WRAPPING control owns the Tab stop */}
      <SubHead meta="one tab stop">Interactive (focus)</SubHead>
      <Lede up>
        An avatar never takes focus on its own. When it lives inside something clickable — a reviewer row,
        a profile link, a mention — the <em>wrapping</em> control is the single Tab stop, and the canonical
        ember focus ring lands on that control, not the circle. Tab to the row below to see it.
      </Lede>
      <Frame label="a focusable approver row — Tab to it; Enter / Space opens the profile" row>
        <button
          type="button"
          className="surface"
          style={{
            display:'flex', alignItems:'center', gap: 12, padding: 12, width:'100%',
            font:'inherit', textAlign:'start', cursor:'pointer',
            borderRadius:'var(--radius-md)',
          }}
        >
          <Avatar size="lg" name="Ana Silva" ember status="online">AS</Avatar>
          <span style={{display:'flex', flexDirection:'column', gap: 2, minWidth: 0}}>
            <span style={{fontSize:'var(--text-base)', fontWeight: 600, letterSpacing:'-0.005em'}}>Ana Silva</span>
            <span style={{fontSize:'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>Reviewer · approved 2m ago</span>
          </span>
          <Icons.externalLink size={14} color="var(--fg-faint)" style={{marginInlineStart:'auto'}} aria-hidden="true"/>
        </button>
      </Frame>
      <div className="surface" style={{ padding: 14, marginBlockStart: 12, display:'flex', flexDirection:'column', gap: 8 }}>
        <Kbd label="Move to the row" keys={['Tab']}/>
        <Kbd label="Open the profile" keys={['Enter']}/>
        <Kbd label="Open the profile" keys={['Space']}/>
      </div>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 8}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>An avatar is a static identity marker, not a focus stop — it renders no <Mono>tabindex</Mono> and no role. When it sits inside an interactive row (a link, a menu item, the focusable approver row above), the wrapping control owns the single <Mono>Tab</Mono> stop; <Mono>Enter</Mono> / <Mono>Space</Mono> activate it, and the avatar is decorative within.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 8}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The <Mono>name</Mono> prop drives the native <Mono>title</Mono> and the image <Mono>alt</Mono>, so the person is announced whether initials or a photo render. The status dot is <Mono>aria-hidden</Mono> — presence rides in the name itself (e.g. &ldquo;Ana — online&rdquo;) — and the <Mono>+N</Mono> chip carries an <Mono>aria-label</Mono> that reads out every hidden name.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 8}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Initials are mono 600: <span style={{fontVariantNumeric:'tabular-nums'}}>7.1:1</span> on the default muted circle, and the ember &ldquo;you&rdquo; variant paints dark ink (<Mono>--bg</Mono>) on its ember-soft fill at <span style={{fontVariantNumeric:'tabular-nums'}}>8.4:1</span> — never ember-on-ember. The status dot carries a <span style={{fontVariantNumeric:'tabular-nums'}}>2px</span> ring matching the parent surface and pairs colour with corner position, so presence is not colour-only.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 8}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Avatars are entirely static — no entrance, pulse, or presence animation — so there is nothing to suppress under <Mono>prefers-reduced-motion</Mono>. The only motion on this page is the loading <Mono>Skeleton</Mono>, whose shimmer the global media guard already stills.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — group overflow lands on the left; avatar stack order mirrors"
        row
        code={`<div dir="rtl">
  <Avatar.Group max={4}>
    <Avatar name="آنا">AS</Avatar>
    <Avatar name="برونو" ember>BC</Avatar>
    <Avatar name="كاميلا">CO</Avatar>
    <Avatar name="دييغو">DM</Avatar>
    <Avatar name="إلين">EL</Avatar>
  </Avatar.Group>
</div>`}
      >
        <div dir="rtl">
          <Avatar.Group max={4}>
            {PEOPLE.map(p => (
              <Avatar key={p.initials} name={p.name} ember={p.ember}>{p.initials}</Avatar>
            ))}
          </Avatar.Group>
        </div>
      </Frame>
      <Lede>
        Avatars use logical CSS properties throughout — the <Mono>+N</Mono> overflow chip moves to the
        leading edge (right in RTL), and the stack order reverses so the visually first avatar is still
        the most important one. No JS required; no extra CSS. Status dots stay in the trailing-bottom
        corner relative to the reading direction, and the <Mono>ember</Mono> "you" tint is never
        position-dependent.
      </Lede>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px', justifyContent:'center'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <Avatar size="xl" name="Ana Silva" ember status="online">AS</Avatar>
              <span className="lead v" style={{top: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <span className="lead h" style={{top: 24, right: -28, width: 24}}/>
              <span className="lead h" style={{bottom: -4, right: -28, width: 32}}/>
              <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 16, right: -52}}>2</div>
              <div className="pin" style={{bottom: -12, right: -52}}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Initials.</b> 2 letters max. Geist Mono 600 for legibility at small sizes. Source from <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>first[0] + last[0]</code>, fall back to first two of <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>first</code>.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Variant.</b> Default = muted surface. Ember = "you". Always include a <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>title</code> attribute for hover identity.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Status dot.</b> 8px (10px at lg/xl). 2px ring matches the parent surface so it reads on cards too.</span>
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — initials over low-res photos</div>
          <div className="body" style={{gap: 10}}>
            <Avatar size="lg" name="Ana Silva">AS</Avatar>
            <Avatar size="lg" name="Bruno Costa">BC</Avatar>
            <Avatar size="lg" name="Camila Oliveira">CO</Avatar>
          </div>
          <div className="note">In dense lists, photos pixelate and become noise. Initials in mono read at 16px circles.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — emoji or 3+ characters</div>
          <div className="body" style={{gap: 10}}>
            <span className="avatar lg" style={{fontSize: 'var(--text-md)'}}>👤</span>
            <span className="avatar lg" style={{fontSize: 'var(--text-xs)'}}>ANA</span>
            <span className="avatar lg" style={{fontSize: 'var(--text-xs)'}}>USR</span>
          </div>
          <div className="note">Emoji clash with the system. 3+ characters at small sizes are unreadable.</div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="AvatarProps">API reference</SubHead>
      <AutoPropsTable component="Avatar" label="<Avatar />" />
      <PropsTable
        label="<Avatar.Group />"
        rows={[
          { prop: 'children', type: 'ReactNode', required: true, description: 'Avatar children. Direction-aware: in RTL the +N overflow lands on the left.' },
          { prop: 'max', type: 'number', default: '5', description: 'Maximum visible avatars before the +N overflow chip.' },
          { prop: 'tight', type: 'boolean', default: 'false', description: 'Tighter overlap (−10px instead of −8px).' },
          { prop: 'size', type: '"xs" | "sm" | "md" | "lg" | "xl" | number', default: '"md"', description: 'Size override for the overflow chip, matching the child avatars.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra utility classes merged via cn().' },
        ]}
      />
    </Section>
  );
}
