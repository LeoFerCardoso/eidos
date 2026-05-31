'use client';
// Eidos DS — Components / Status & semantics
// The mapping between tone and meaning. Owns the *semantics* of the six tones
// (ember · success · warning · danger · ice · neutral) — Pills & Chips, Alerts,
// Notifications, Buttons, and Badges all spend the same vocabulary.
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, Lede, Mono } from '@/ds/core';


  const USAGE_CODE = `import { Pill } from "@/components/forge/pill"

export function Demo() {
  return (
    <div className="flex gap-2">
      <Pill tone="success">healthy</Pill>
      <Pill tone="warning">degraded</Pill>
      <Pill tone="danger">down</Pill>
    </div>
  )
}`;

  const muted = { color: 'var(--fg)' };

  // Status semantics classes (.st-*) live in ds.css — Eidos invariant: never
  // page-local CSS; compose ds.css. (Promoted verbatim from a former block.)

  const tones = [
    { id: 'ember',   name: 'Ember',   tok: '--ember',   soft: '--ember-soft',   noun: "Eidos is doing work",                 mean: 'Action in flight, primary CTA, the live thing.', ex: ['deploying', 'live', 'active', 'boosted'] },
    { id: 'success', name: 'Success', tok: '--success', soft: '--success-soft', noun: 'Pass — steady state',                 mean: 'Healthy / approved / merged. Calm, not celebratory.', ex: ['healthy', 'merged', 'gate passed', 'verified'] },
    { id: 'warning', name: 'Warning', tok: '--warning', soft: '--warning-soft', noun: 'Degraded — action recommended',       mean: 'Soft alarm. The thing still works, but attention pays off.', ex: ['degraded', 'stale', 'on-call', 'expiring'] },
    { id: 'danger',  name: 'Danger',  tok: '--danger',  soft: '--danger-soft',  noun: 'Failed — action required',            mean: 'Down / blocked / breaking. Reserved for outright failure.', ex: ['down', 'failed', 'rollback', 'blocked'] },
    { id: 'ice',     name: 'Ice',     tok: '--ice',     soft: '--ice-soft',     noun: 'Informational — planned',             mean: 'Queued, scheduled, canary. Inert but on the horizon.', ex: ['queued', 'scheduled', 'canary', 'hint'] },
    { id: '',        name: 'Neutral', tok: '--fg-subtle', soft: '--surface',     noun: 'Inert — no signal',                   mean: 'Idle, archived, draft. The default fallback when no tone applies.', ex: ['idle', 'archived', 'draft', 'paused'] },
  ];

export default function Status() {
  return (
    <Section
      id="status"
      num="15"
      title="Status & semantics"
      desc="Six tones, six meanings, one shared vocabulary: live, healthy, degraded, down, queued, idle. Every component that takes a tone reads the same list."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('status')} ariaLabel="package manager"/>
      <Lede>
        Ships the shared <Mono>tone</Mono> prop API consumed by Pill, Badge, Alert, Notification, and Button — plus the six paired CSS variables in <Mono>tokens.css</Mono>.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Pills, Alerts, Buttons, Notifications, Badges, and Chips all accept the same tone prop. Pick the tone that names the noun — never use colour to invent a meaning not on this list.</Lede>
      <Frame label="basic" row code={USAGE_CODE}>
        <span className="pill success"><span className="dot"/>healthy</span>
        <span className="pill warning"><span className="dot"/>degraded</span>
        <span className="pill danger"><span className="dot"/>down</span>
      </Frame>

      {/* 3. EXAMPLES */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* Lede */}
      <Lede>
        Tone in Eidos is a <b style={muted}>noun</b>, not an adjective. <Mono>--success</Mono> doesn't mean &quot;good&quot;, it means &quot;this thing is in a passing state&quot;. <Mono>--warning</Mono> doesn't mean &quot;yellow&quot;, it means &quot;degraded — a human should look soon, but nothing is on fire&quot;. Picking the right tone is mostly a vocabulary problem: name the state in plain English, then look up the column.
      </Lede>

      {/* Master semantic table */}
      <SubHead meta="6 tones · the canon">Tone vocabulary</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">tone → meaning</span></div>
        <div style={{padding: '4px 0'}}>
          <div className="st-row" style={{paddingTop: 10, paddingBottom: 10}}>
            <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'.06em', textTransform:'uppercase', color:'var(--fg-subtle)'}}>Token</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'.06em', textTransform:'uppercase', color:'var(--fg-subtle)'}}>What it names</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'.06em', textTransform:'uppercase', color:'var(--fg-subtle)'}}>Meaning</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'.06em', textTransform:'uppercase', color:'var(--fg-subtle)'}}>Example labels</span>
          </div>
          {tones.map(t => (
            <div key={t.name} className="st-row">
              <span className={'pill ' + t.id}><span className="dot"/>{t.name.toLowerCase()}</span>
              <span className="st-tok"><b>{t.tok}</b><br/>{t.noun}</span>
              <span className="meaning">{t.mean}</span>
              <span className="ex">
                {t.ex.map(e => <span key={e} className={'pill ' + t.id}><span className="dot"/>{e}</span>)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Lede>
        The six tones are deliberate — adding a seventh dilutes the table. If a feature wants a new state, find its closest match in this list before reaching for a new colour. Resist &quot;info-blue&quot;, &quot;neutral-grey&quot;, &quot;tertiary-purple&quot; — they all already exist as <Mono>ice</Mono>, <Mono>neutral</Mono>, and <Mono>ember</Mono>.
      </Lede>

      {/* Same control, all tones — shows the vocabulary applied across primitives */}
      <SubHead meta="one component, six tones">Same control, every tone</SubHead>
      <Frame label="alert · pill · chip — read top-to-bottom">
        <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%'}}>
          {[
            { tone:'ember',   icon: <Icons.zap size={16}/>,    title:'Deploy in flight', desc:'auth-edge is rolling out v2.91.0 to 12 of 24 pods.' },
            { tone:'success', icon: <Icons.check size={16}/>,  title:'All gates passed', desc:'Health, build, and SAST all green for the last 6h.' },
            { tone:'warning', icon: <Icons.alert size={16}/>,  title:'Degraded',         desc:'p95 above SLO for 8 minutes — page on-call if it persists.' },
            { tone:'danger',  icon: <Icons.x size={16}/>,      title:'Down',             desc:'checkout-api returned 5xx on every probe in the last minute.' },
            { tone:'ice',     icon: <Icons.calendar size={16}/>, title:'Scheduled',     desc:'Backfill job will start at 02:00 UTC. No action needed yet.' },
          ].map(r => (
            <div key={r.tone} className={'st-al ' + r.tone}>
              <span className="ic">{r.icon}</span>
              <div className="bd">
                <div className="ti">{r.title}</div>
                <div className="ds">{r.desc}</div>
              </div>
              <span className={'pill ' + r.tone} style={{flex:'0 0 auto', alignSelf:'center'}}>
                <span className="dot"/>{r.tone === 'ice' ? 'queued' : r.tone}
              </span>
            </div>
          ))}
        </div>
      </Frame>
      <Lede>
        The alert, the pill, and (where present) the chip all derive from the same tone. That repetition is the point — once a user has learned that ember = something is moving, the lesson carries across the product without a new vocabulary per component.
      </Lede>

      {/* Escalation ladder */}
      <SubHead meta="escalation">When to step a tone up</SubHead>
      <div className="st-ladder">
        {[
          { num: '00', tone:'',        ttl:'idle',     desc:'Nothing is happening. The default. Don\'t draw attention.' },
          { num: '01', tone:'ice',     ttl:'queued',   desc:'Planned work, waiting. Inform, don\'t alarm.' },
          { num: '02', tone:'ember',   ttl:'active',   desc:'Work in flight. The user can watch progress, but doesn\'t need to act.' },
          { num: '03', tone:'success', ttl:'healthy',  desc:'Steady state. A quiet "all good" — never flashy.' },
          { num: '04', tone:'warning', ttl:'degraded', desc:'Soft alarm. Action is recommended within hours, not seconds.' },
          { num: '05', tone:'danger',  ttl:'down',     desc:'Hard alarm. Action is required now — page someone.' },
        ].map(r => (
          <div key={r.num} className="st-rung">
            <span className="num">{r.num}</span>
            <span className={'pill ' + r.tone}><span className="dot"/>{r.ttl}</span>
            <span className="ttl">{r.ttl[0].toUpperCase() + r.ttl.slice(1)}</span>
            <span className="desc">{r.desc}</span>
          </div>
        ))}
      </div>
      <Lede>
        Escalation is one-way and gradual. A service shouldn't jump from <Mono>healthy</Mono> straight to <Mono>down</Mono> without passing through <Mono>degraded</Mono> — if the data is too noisy for that intermediate, smooth it out with a 60s rolling window before recolouring the row.
      </Lede>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Status is a read-out, not a control — a tone applied to a Pill or Badge adds no key bindings of its own. When the tone lives on an interactive element (a filter chip, a dismissible alert), that host element keeps its normal <Mono>Tab</Mono> and <Mono>Enter</Mono> / <Mono>Space</Mono> behaviour.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The tone word is real text, so readers announce &quot;Degraded&quot; without extra markup. When a status appears or changes asynchronously, host it in a live region — <Mono>role=&quot;status&quot;</Mono> (polite) for routine updates, <Mono>role=&quot;alert&quot;</Mono> (assertive) for danger — so the change is spoken.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Never encode a state in colour alone — always pair the tone with the word and, where it helps, the matching icon. Each tone&apos;s text-on-fill pairing meets AA (4.5:1) in both themes; on a solid danger or warning fill the foreground is dark or light ink, never the tone&apos;s own hue.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Tones are static fills. If a &quot;live&quot; status pulses, that animation stops under <Mono>prefers-reduced-motion</Mono>, leaving a solid swatch that still reads correctly.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — semantic colours don't flip; layout does"
        code={`<div dir="rtl">
  <div className="st-al success">
    <span className="ic"><Icons.check size={16}/></span>
    <div className="bd">
      <div className="ti">سليم — checkout-api</div>
      <div className="ds">جميع البوابات الصحية مرت في الست ساعات الماضية.</div>
    </div>
    <span className="pill success"><span className="dot"/>سليم</span>
  </div>
</div>`}
      >
        <div dir="rtl" style={{display:'flex', flexDirection:'column', gap: 12, width:'100%'}}>
          <div className="st-al success">
            <span className="ic"><Icons.check size={16}/></span>
            <div className="bd">
              <div className="ti">سليم — checkout-api</div>
              <div className="ds">جميع البوابات الصحية مرت في الست ساعات الماضية.</div>
            </div>
            <span className="pill success" style={{alignSelf:'center'}}><span className="dot"/>سليم</span>
          </div>
          <div className="st-al warning">
            <span className="ic"><Icons.alert size={16}/></span>
            <div className="bd">
              <div className="ti">متدهور — auth-edge</div>
              <div className="ds">زمن الاستجابة p95 أعلى من الحد لمدة 8 دقائق.</div>
            </div>
            <span className="pill warning" style={{alignSelf:'center'}}><span className="dot"/>تحذير</span>
          </div>
          <div className="st-al danger">
            <span className="ic"><Icons.x size={16}/></span>
            <div className="bd">
              <div className="ti">متعطل — checkout-api</div>
              <div className="ds">إعادة تشغيل تلقائي تجري الآن. يُنصح بإخطار المسؤول.</div>
            </div>
            <span className="pill danger" style={{alignSelf:'center'}}><span className="dot"/>خطر</span>
          </div>
        </div>
      </Frame>
      <Lede>
        Tones don't depend on reading direction — green still means pass, red still means down — but the layout flips: icon leads on the right, pill trails on the left. We use logical properties (<Mono>margin-inline-*</Mono>, <Mono>border-inline-*</Mono>) so this works without per-side overrides. Numeric data inside the alert (timestamps, percentages) stays LTR via <Mono>direction: ltr</Mono> if the surrounding text is in Arabic.
      </Lede>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy of a state communication</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Alert · the canonical layout</span></div>
        <div className="ds-frame-body" style={{padding: '72px 36px 88px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width:'100%', maxWidth: 520}} aria-hidden="true">
              <div className={'st-al warning'} style={{width:'100%'}}>
                <span className="ic"><Icons.alert size={16}/></span>
                <div className="bd">
                  <div className="ti">Degraded — checkout-api</div>
                  <div className="ds">p95 above SLO for 8 minutes. Page on-call if it persists past 15.</div>
                </div>
                <span className="pill warning" style={{flex:'0 0 auto', alignSelf:'center'}}>
                  <span className="dot"/>warning
                </span>
              </div>
              {/* Leader lines — anchored to the rendered parts (logical, RTL-safe) */}
              <span className="lead v" style={{top: -26, insetInlineStart: 24, height: 22}}/>
              <span className="lead v" style={{top: -26, insetInlineStart: 120, height: 22}}/>
              <span className="lead v" style={{top: -26, insetInlineEnd: 62, height: 22}}/>
              <span className="lead h" style={{bottom: 18, insetInlineEnd: -30, width: 26}}/>
              {/* Pins */}
              <div className="pin" style={{top: -46, insetInlineStart: 24, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -46, insetInlineStart: 120, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: -46, insetInlineEnd: 62, transform:'translateX(50%)'}}>3</div>
              <div className="pin" style={{bottom: 9, insetInlineEnd: -58}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 620, margin:'64px auto 0'}}>
            <span className="num">1</span><span><b style={muted}>Tone icon.</b> 16px, paired one-to-one with the tone. <Mono>alert</Mono> for warning &amp; danger, <Mono>check</Mono> for success, <Mono>info</Mono> for ice, <Mono>zap</Mono> or <Mono>flame</Mono> for ember. The icon survives if colour is stripped — that's the point.</span>
            <span className="num">2</span><span><b style={muted}>Title (noun + subject).</b> Lead with the state, then what's affected. &quot;Degraded — checkout-api&quot; beats &quot;checkout-api is currently in a degraded state&quot; by half the words.</span>
            <span className="num">3</span><span><b style={muted}>Pill echo (optional).</b> The same tone, restated as a glanceable chip on the trailing edge. Helpful when the alert sits in a wall of others — the eye locks onto the pill first.</span>
            <span className="num">4</span><span><b style={muted}>Surface tint.</b> <Mono>--*-soft</Mono> at 12% alpha + 30% border. Never a solid <Mono>--warning</Mono> background — that yells, doesn't inform.</span>
          </div>
        </div>
      </div>

      {/* Pairing matrix — which icon with which tone */}
      <SubHead meta="pairing">Tone → icon</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Canonical pairings</span></div>
        <table className="st-matrix" style={{margin: 0}}>
          <thead><tr><th>Tone</th><th>Icon</th><th>Why</th></tr></thead>
          <tbody>
            <tr>
              <td><span className="pill ember"><span className="dot"/>ember</span></td>
              <td className="icol"><Icons.zap size={14} style={{color:'var(--ember)'}}/> <Mono>zap</Mono> · <Icons.flame size={14} style={{color:'var(--ember)'}}/> <Mono>flame</Mono> · <Icons.rocket size={14} style={{color:'var(--ember)'}}/> <Mono>rocket</Mono></td>
              <td>Motion / heat / launch — anything in flight.</td>
            </tr>
            <tr>
              <td><span className="pill success"><span className="dot"/>success</span></td>
              <td className="icol"><Icons.check size={14} style={{color:'var(--success)'}}/> <Mono>check</Mono> · <Icons.shield size={14} style={{color:'var(--success)'}}/> <Mono>shield</Mono></td>
              <td>Pass / verified. Avoid trophies and party emojis.</td>
            </tr>
            <tr>
              <td><span className="pill warning"><span className="dot"/>warning</span></td>
              <td className="icol"><Icons.alert size={14} style={{color:'var(--warning)'}}/> <Mono>alert</Mono></td>
              <td>The triangle is the universal &quot;look here&quot;. Reserve it for warning, not danger.</td>
            </tr>
            <tr>
              <td><span className="pill danger"><span className="dot"/>danger</span></td>
              <td className="icol"><Icons.x size={14} style={{color:'var(--danger)'}}/> <Mono>x</Mono> · <Icons.alert size={14} style={{color:'var(--danger)'}}/> <Mono>alert</Mono></td>
              <td>Block / failure. <Mono>x</Mono> reads as &quot;stopped&quot;, <Mono>alert</Mono> as &quot;needs you&quot;. Both work; pick one per surface.</td>
            </tr>
            <tr>
              <td><span className="pill ice"><span className="dot"/>ice</span></td>
              <td className="icol"><Icons.info size={14} style={{color:'var(--ice)'}}/> <Mono>info</Mono> · <Icons.calendar size={14} style={{color:'var(--ice)'}}/> <Mono>calendar</Mono></td>
              <td>Informational / scheduled. The &quot;i&quot; never escalates on its own.</td>
            </tr>
            <tr>
              <td><span className="pill"><span className="dot"/>neutral</span></td>
              <td className="icol"><Icons.minus size={14} style={{color:'var(--fg-subtle)'}}/> <Mono>minus</Mono> · <Icons.more size={14} style={{color:'var(--fg-subtle)'}}/> <Mono>more</Mono></td>
              <td>Inert. If you're tempted to add an icon to neutral, you probably want ice.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Lede>
        The same icon can carry two tones (<Mono>alert</Mono> on warning vs danger) — only the colour and weight change. Keep that pairing predictable: don't suddenly use <Mono>shield</Mono> for danger, or <Mono>flame</Mono> for warning.
      </Lede>

      {/* Do / Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pick the tone that names the noun</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, width:'100%'}}>
            <span className="pill success" style={{alignSelf:'flex-start'}}><span className="dot"/>healthy</span>
            <span className="pill warning" style={{alignSelf:'flex-start'}}><span className="dot"/>degraded</span>
            <span className="pill danger" style={{alignSelf:'flex-start'}}><span className="dot"/>down</span>
          </div>
          <div className="note">Three nouns, three tones. Each one earns its colour by saying what state it describes.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — use tone as decoration</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, width:'100%'}}>
            <span className="pill warning" style={{alignSelf:'flex-start'}}><span className="dot"/>v4.18.2</span>
            <span className="pill danger" style={{alignSelf:'flex-start'}}><span className="dot"/>3 services</span>
            <span className="pill success" style={{alignSelf:'flex-start'}}><span className="dot"/>us-east</span>
          </div>
          <div className="note">A version isn't a warning. A region isn't a success. Tone is reserved for state — anything else is a chip in neutral.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — calm success, sharp danger</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, width:'100%'}}>
            <div className="st-al success" style={{padding: '8px 10px'}}>
              <span className="ic"><Icons.check size={14}/></span>
              <div className="bd"><div className="ti" style={{fontSize: 'var(--text-sm)'}}>All gates passed</div></div>
            </div>
            <div className="st-al danger" style={{padding: '8px 10px'}}>
              <span className="ic"><Icons.x size={14}/></span>
              <div className="bd"><div className="ti" style={{fontSize: 'var(--text-sm)'}}>checkout-api down</div></div>
            </div>
          </div>
          <div className="note">Success is a quiet fact, not a celebration. Danger is loud only because it has to be.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — solid backgrounds for warning</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, width:'100%'}}>
            <div style={{padding:'10px 12px', background:'var(--warning)', color:'#08090A', borderRadius: 'var(--radius-xl)', fontSize: 'var(--text-sm)', fontWeight: 600}}>p95 above SLO — page on-call</div>
            <div style={{padding:'10px 12px', background:'var(--danger)', color:'#08090A', borderRadius: 'var(--radius-xl)', fontSize: 'var(--text-sm)', fontWeight: 600}}>checkout-api is down</div>
          </div>
          <div className="note">A wall of saturated tone exhausts the eye. Use <Mono>--*-soft</Mono> for the surface; reserve solid hue for the icon and the dot.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair tone with an icon</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, width:'100%'}}>
            <span className="pill warning" style={{alignSelf:'flex-start'}}><Icons.alert size={11}/>degraded</span>
            <span className="pill danger" style={{alignSelf:'flex-start'}}><Icons.x size={11}/>down</span>
            <span className="pill success" style={{alignSelf:'flex-start'}}><Icons.check size={11}/>merged</span>
          </div>
          <div className="note">Colour can't carry meaning alone — about 8% of male readers can't tell green from red. The icon survives that.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — invent a seventh tone</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, width:'100%'}}>
            <span style={{display:'inline-flex', alignItems:'center', gap: 6, height: 22, padding:'0 8px', borderRadius: 'var(--radius-full)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'#a78bfa', background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.3)', alignSelf:'flex-start'}}>
              <span style={{width: 6, height: 6, borderRadius:'50%', background:'currentColor'}}/>experimental
            </span>
            <span style={{display:'inline-flex', alignItems:'center', gap: 6, height: 22, padding:'0 8px', borderRadius: 'var(--radius-full)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'#fb7185', background:'rgba(251,113,133,0.12)', border:'1px solid rgba(251,113,133,0.3)', alignSelf:'flex-start'}}>
              <span style={{width: 6, height: 6, borderRadius:'50%', background:'currentColor'}}/>magenta
            </span>
          </div>
          <div className="note">Every new hue dilutes the table. Find your noun in the existing six before you reach for a colour picker.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — escalate one rung at a time</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 6, width:'100%'}}>
            <span className="pill"><span className="dot"/>idle</span>
            <span className="pill ice"><span className="dot"/>queued</span>
            <span className="pill ember"><span className="ldot"/>active</span>
            <span className="pill warning"><span className="dot"/>degraded</span>
            <span className="pill danger"><span className="dot"/>down</span>
          </div>
          <div className="note">A row that climbs one tone at a time builds a story. People read down a column and predict the next state.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — ping-pong tones on noisy data</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 6, width:'100%'}}>
            <span className="pill success"><span className="dot"/>healthy</span>
            <span className="pill danger"><span className="dot"/>down</span>
            <span className="pill success"><span className="dot"/>healthy</span>
            <span className="pill danger"><span className="dot"/>down</span>
          </div>
          <div className="note">Flapping turns the tone system into noise. Smooth with a 60s rolling window, or step through warning before danger.</div>
        </div>
      </div>

      {/* 4. API REFERENCE — the shared `tone` prop */}
      <SubHead meta="tone — shared API">API reference</SubHead>
      <Lede>
        Every primitive that ships with a coloured surface (Pill, Badge, Alert, Button, Notification, Chip) accepts the same <Mono>tone</Mono> prop. The values below are the entire vocabulary — no others are valid.
      </Lede>
      <PropsTable
        label="tone"
        rows={[
          { prop: 'tone="ember"',   type: 'string', description: 'Action in flight — primary CTA, the live thing. Maps to --ember / --ember-soft.' },
          { prop: 'tone="success"', type: 'string', description: 'Pass / healthy / merged. Calm, not celebratory. Maps to --success / --success-soft.' },
          { prop: 'tone="warning"', type: 'string', description: 'Degraded — action recommended. Maps to --warning / --warning-soft.' },
          { prop: 'tone="danger"',  type: 'string', description: 'Failed / down / blocked. Maps to --danger / --danger-soft.' },
          { prop: 'tone="ice"',     type: 'string', description: 'Informational / scheduled / queued. Maps to --ice / --ice-soft.' },
          { prop: 'tone="neutral"', type: 'string', description: 'Inert / idle / archived. The default fallback. Maps to --fg-subtle / --surface.' },
        ]}
      />
    </Section>
  );
}
