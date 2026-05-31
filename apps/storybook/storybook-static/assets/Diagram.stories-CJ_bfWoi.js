import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{kr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f;e((()=>{o=t(n(),1),a(),s=r(),c={title:`AI/Diagram`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A styled figure surface for rendered diagrams (e.g. Mermaid, Graphviz, custom SVG) inside a model reply. The DS does not bundle a renderer — pass the rendered <svg> or markup as children and supply an optional figcaption via `caption`. Use when the model produces a flow, sequence, or architecture diagram that should be visually separated from prose."}}},argTypes:{caption:{control:`text`}}},l={render:e=>(0,s.jsx)(i,{...e,children:(0,s.jsxs)(`svg`,{viewBox:`0 0 480 100`,width:`480`,height:`100`,style:{display:`block`},"aria-label":`pix-router to bureau-gateway data flow`,children:[(0,s.jsx)(`defs`,{children:(0,s.jsx)(`marker`,{id:`arr-default`,markerWidth:`7`,markerHeight:`7`,refX:`7`,refY:`3.5`,orient:`auto`,children:(0,s.jsx)(`path`,{d:`M0,0 L7,3.5 L0,7 Z`,fill:`var(--fg-muted)`})})}),(0,s.jsx)(`rect`,{x:`4`,y:`30`,width:`110`,height:`40`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`59`,y:`55`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`pix-router`}),(0,s.jsx)(`rect`,{x:`185`,y:`30`,width:`110`,height:`40`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`240`,y:`55`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`fraud-engine`}),(0,s.jsx)(`rect`,{x:`366`,y:`30`,width:`110`,height:`40`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`421`,y:`55`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`bureau-gateway`}),(0,s.jsx)(`line`,{x1:`114`,y1:`50`,x2:`183`,y2:`50`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-default)`}),(0,s.jsx)(`line`,{x1:`295`,y1:`50`,x2:`364`,y2:`50`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-default)`})]})}),args:{caption:`pix-router → fraud-engine → bureau-gateway (Ring 2, simplified)`}},u={render:()=>(0,s.jsx)(i,{children:(0,s.jsxs)(`svg`,{viewBox:`0 0 320 80`,width:`320`,height:`80`,style:{display:`block`},"aria-label":`Deploy pipeline: build to staging to production`,children:[(0,s.jsx)(`defs`,{children:(0,s.jsx)(`marker`,{id:`arr-nc`,markerWidth:`7`,markerHeight:`7`,refX:`7`,refY:`3.5`,orient:`auto`,children:(0,s.jsx)(`path`,{d:`M0,0 L7,3.5 L0,7 Z`,fill:`var(--fg-muted)`})})}),(0,s.jsx)(`rect`,{x:`4`,y:`22`,width:`80`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`44`,y:`44`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`build`}),(0,s.jsx)(`line`,{x1:`84`,y1:`40`,x2:`120`,y2:`40`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-nc)`}),(0,s.jsx)(`rect`,{x:`122`,y:`22`,width:`80`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`162`,y:`44`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`staging`}),(0,s.jsx)(`line`,{x1:`202`,y1:`40`,x2:`238`,y2:`40`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-nc)`}),(0,s.jsx)(`rect`,{x:`240`,y:`22`,width:`76`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`278`,y:`44`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`production`})]})})},d={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32},children:[(0,s.jsx)(i,{caption:`Canary rollout pipeline — Ring 0 → Ring 1 → Ring 2 → GA`,children:(0,s.jsxs)(`svg`,{viewBox:`0 0 480 80`,width:`480`,height:`80`,style:{display:`block`},"aria-label":`Canary rollout stages`,children:[(0,s.jsx)(`defs`,{children:(0,s.jsx)(`marker`,{id:`arr-v1`,markerWidth:`7`,markerHeight:`7`,refX:`7`,refY:`3.5`,orient:`auto`,children:(0,s.jsx)(`path`,{d:`M0,0 L7,3.5 L0,7 Z`,fill:`var(--fg-muted)`})})}),[`Ring 0`,`Ring 1`,`Ring 2`,`GA`].map((e,t)=>(0,s.jsxs)(o.Fragment,{children:[(0,s.jsx)(`rect`,{x:4+t*118,y:`22`,width:`100`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:t===3?`var(--accent)`:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:54+t*118,y:`44`,textAnchor:`middle`,fontSize:`11`,fill:t===3?`var(--accent)`:`var(--fg)`,fontFamily:`var(--font-mono)`,children:e}),t<3&&(0,s.jsx)(`line`,{x1:104+t*118,y1:`40`,x2:118+t*118,y2:`40`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-v1)`})]},e))]})}),(0,s.jsx)(i,{caption:`Incident triage decision — alert classification branch`,children:(0,s.jsxs)(`svg`,{viewBox:`0 0 360 130`,width:`360`,height:`130`,style:{display:`block`},"aria-label":`Incident triage branch`,children:[(0,s.jsx)(`defs`,{children:(0,s.jsx)(`marker`,{id:`arr-v2`,markerWidth:`7`,markerHeight:`7`,refX:`7`,refY:`3.5`,orient:`auto`,children:(0,s.jsx)(`path`,{d:`M0,0 L7,3.5 L0,7 Z`,fill:`var(--fg-muted)`})})}),(0,s.jsx)(`rect`,{x:`130`,y:`4`,width:`100`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`180`,y:`26`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`alert fired`}),(0,s.jsx)(`line`,{x1:`180`,y1:`40`,x2:`180`,y2:`56`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-v2)`}),(0,s.jsx)(`rect`,{x:`130`,y:`58`,width:`100`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`180`,y:`80`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`classify`}),(0,s.jsx)(`line`,{x1:`130`,y1:`76`,x2:`100`,y2:`76`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`}),(0,s.jsx)(`line`,{x1:`100`,y1:`76`,x2:`100`,y2:`94`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-v2)`}),(0,s.jsx)(`rect`,{x:`50`,y:`96`,width:`100`,height:`30`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`100`,y:`115`,textAnchor:`middle`,fontSize:`10`,fill:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,children:`page on-call (P0)`}),(0,s.jsx)(`line`,{x1:`230`,y1:`76`,x2:`260`,y2:`76`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`}),(0,s.jsx)(`line`,{x1:`260`,y1:`76`,x2:`260`,y2:`94`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-v2)`}),(0,s.jsx)(`rect`,{x:`210`,y:`96`,width:`100`,height:`30`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`260`,y:`115`,textAnchor:`middle`,fontSize:`10`,fill:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,children:`ticket (P2)`})]})}),(0,s.jsx)(i,{caption:`pix-router dependency graph — direct runtime dependencies`,children:(0,s.jsxs)(`svg`,{viewBox:`0 0 400 110`,width:`400`,height:`110`,style:{display:`block`},"aria-label":`pix-router service dependency graph`,children:[(0,s.jsx)(`defs`,{children:(0,s.jsx)(`marker`,{id:`arr-v3`,markerWidth:`7`,markerHeight:`7`,refX:`7`,refY:`3.5`,orient:`auto`,children:(0,s.jsx)(`path`,{d:`M0,0 L7,3.5 L0,7 Z`,fill:`var(--fg-muted)`})})}),(0,s.jsx)(`rect`,{x:`150`,y:`37`,width:`100`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--accent)`,strokeWidth:`1.5`}),(0,s.jsx)(`text`,{x:`200`,y:`59`,textAnchor:`middle`,fontSize:`11`,fill:`var(--fg)`,fontFamily:`var(--font-mono)`,children:`pix-router`}),(0,s.jsx)(`rect`,{x:`4`,y:`4`,width:`110`,height:`32`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`59`,y:`24`,textAnchor:`middle`,fontSize:`10`,fill:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,children:`feature-store`}),(0,s.jsx)(`line`,{x1:`114`,y1:`20`,x2:`148`,y2:`44`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-v3)`}),(0,s.jsx)(`rect`,{x:`4`,y:`74`,width:`110`,height:`32`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`59`,y:`94`,textAnchor:`middle`,fontSize:`10`,fill:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,children:`rate-limiter`}),(0,s.jsx)(`line`,{x1:`114`,y1:`90`,x2:`148`,y2:`66`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-v3)`}),(0,s.jsx)(`rect`,{x:`286`,y:`37`,width:`110`,height:`36`,rx:`6`,fill:`var(--surface-2)`,stroke:`var(--border)`,strokeWidth:`1`}),(0,s.jsx)(`text`,{x:`341`,y:`59`,textAnchor:`middle`,fontSize:`10`,fill:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,children:`bureau-gateway`}),(0,s.jsx)(`line`,{x1:`250`,y1:`55`,x2:`284`,y2:`55`,stroke:`var(--fg-muted)`,strokeWidth:`1.5`,markerEnd:`url(#arr-v3)`})]})})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Diagram {...args}>
      <svg viewBox="0 0 480 100" width="480" height="100" style={{
      display: 'block'
    }} aria-label="pix-router to bureau-gateway data flow">
        <defs>
          <marker id="arr-default" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--fg-muted)" />
          </marker>
        </defs>
        {/* pix-router */}
        <rect x="4" y="30" width="110" height="40" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
        <text x="59" y="55" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">pix-router</text>
        {/* fraud-engine */}
        <rect x="185" y="30" width="110" height="40" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
        <text x="240" y="55" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">fraud-engine</text>
        {/* bureau-gateway */}
        <rect x="366" y="30" width="110" height="40" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
        <text x="421" y="55" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">bureau-gateway</text>
        {/* arrows */}
        <line x1="114" y1="50" x2="183" y2="50" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-default)" />
        <line x1="295" y1="50" x2="364" y2="50" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-default)" />
      </svg>
    </Diagram>,
  args: {
    caption: 'pix-router → fraud-engine → bureau-gateway (Ring 2, simplified)'
  }
}`,...l.parameters?.docs?.source},description:{story:`Default — a service data-flow diagram with a caption.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Diagram>
      <svg viewBox="0 0 320 80" width="320" height="80" style={{
      display: 'block'
    }} aria-label="Deploy pipeline: build to staging to production">
        <defs>
          <marker id="arr-nc" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--fg-muted)" />
          </marker>
        </defs>
        <rect x="4" y="22" width="80" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
        <text x="44" y="44" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">build</text>
        <line x1="84" y1="40" x2="120" y2="40" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-nc)" />
        <rect x="122" y="22" width="80" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
        <text x="162" y="44" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">staging</text>
        <line x1="202" y1="40" x2="238" y2="40" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-nc)" />
        <rect x="240" y="22" width="76" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
        <text x="278" y="44" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">production</text>
      </svg>
    </Diagram>
}`,...u.parameters?.docs?.source},description:{story:`No caption — bare diagram without an annotation.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  }}>
      {/* 1 – Sequential pipeline */}
      <Diagram caption="Canary rollout pipeline — Ring 0 → Ring 1 → Ring 2 → GA">
        <svg viewBox="0 0 480 80" width="480" height="80" style={{
        display: 'block'
      }} aria-label="Canary rollout stages">
          <defs>
            <marker id="arr-v1" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--fg-muted)" />
            </marker>
          </defs>
          {['Ring 0', 'Ring 1', 'Ring 2', 'GA'].map((label, i) => <React.Fragment key={label}>
              <rect x={4 + i * 118} y="22" width="100" height="36" rx="6" fill="var(--surface-2)" stroke={i === 3 ? 'var(--accent)' : 'var(--border)'} strokeWidth="1" />
              <text x={54 + i * 118} y="44" textAnchor="middle" fontSize="11" fill={i === 3 ? 'var(--accent)' : 'var(--fg)'} fontFamily="var(--font-mono)">{label}</text>
              {i < 3 && <line x1={104 + i * 118} y1="40" x2={118 + i * 118} y2="40" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-v1)" />}
            </React.Fragment>)}
        </svg>
      </Diagram>

      {/* 2 – Branching incident triage */}
      <Diagram caption="Incident triage decision — alert classification branch">
        <svg viewBox="0 0 360 130" width="360" height="130" style={{
        display: 'block'
      }} aria-label="Incident triage branch">
          <defs>
            <marker id="arr-v2" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--fg-muted)" />
            </marker>
          </defs>
          {/* trigger */}
          <rect x="130" y="4" width="100" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
          <text x="180" y="26" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">alert fired</text>
          {/* classify */}
          <line x1="180" y1="40" x2="180" y2="56" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-v2)" />
          <rect x="130" y="58" width="100" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
          <text x="180" y="80" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">classify</text>
          {/* branch yes — P0 */}
          <line x1="130" y1="76" x2="100" y2="76" stroke="var(--fg-muted)" strokeWidth="1.5" />
          <line x1="100" y1="76" x2="100" y2="94" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-v2)" />
          <rect x="50" y="96" width="100" height="30" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
          <text x="100" y="115" textAnchor="middle" fontSize="10" fill="var(--fg-muted)" fontFamily="var(--font-mono)">page on-call (P0)</text>
          {/* branch no — P2 */}
          <line x1="230" y1="76" x2="260" y2="76" stroke="var(--fg-muted)" strokeWidth="1.5" />
          <line x1="260" y1="76" x2="260" y2="94" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-v2)" />
          <rect x="210" y="96" width="100" height="30" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
          <text x="260" y="115" textAnchor="middle" fontSize="10" fill="var(--fg-muted)" fontFamily="var(--font-mono)">ticket (P2)</text>
        </svg>
      </Diagram>

      {/* 3 – Service dependency */}
      <Diagram caption="pix-router dependency graph — direct runtime dependencies">
        <svg viewBox="0 0 400 110" width="400" height="110" style={{
        display: 'block'
      }} aria-label="pix-router service dependency graph">
          <defs>
            <marker id="arr-v3" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--fg-muted)" />
            </marker>
          </defs>
          {/* center node */}
          <rect x="150" y="37" width="100" height="36" rx="6" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="1.5" />
          <text x="200" y="59" textAnchor="middle" fontSize="11" fill="var(--fg)" fontFamily="var(--font-mono)">pix-router</text>
          {/* feature-store */}
          <rect x="4" y="4" width="110" height="32" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
          <text x="59" y="24" textAnchor="middle" fontSize="10" fill="var(--fg-muted)" fontFamily="var(--font-mono)">feature-store</text>
          <line x1="114" y1="20" x2="148" y2="44" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-v3)" />
          {/* rate-limiter */}
          <rect x="4" y="74" width="110" height="32" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
          <text x="59" y="94" textAnchor="middle" fontSize="10" fill="var(--fg-muted)" fontFamily="var(--font-mono)">rate-limiter</text>
          <line x1="114" y1="90" x2="148" y2="66" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-v3)" />
          {/* bureau-gateway */}
          <rect x="286" y="37" width="110" height="36" rx="6" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1" />
          <text x="341" y="59" textAnchor="middle" fontSize="10" fill="var(--fg-muted)" fontFamily="var(--font-mono)">bureau-gateway</text>
          <line x1="250" y1="55" x2="284" y2="55" stroke="var(--fg-muted)" strokeWidth="1.5" markerEnd="url(#arr-v3)" />
        </svg>
      </Diagram>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Variants — flow diagram types side by side: sequential pipeline, branching
incident triage, and a two-tier service dependency.`,...d.parameters?.docs?.description}}},f=[`Default`,`NoCaption`,`Variants`]}))();export{l as Default,u as NoCaption,d as Variants,f as __namedExportsOrder,c as default};