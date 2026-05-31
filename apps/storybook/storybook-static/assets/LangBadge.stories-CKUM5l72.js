import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Aa as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d;e((()=>{t(),i(),a=n(),o={title:`Primitives/LangBadge`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Inline language tag used in service catalogs, repository listings, and dependency tables. Renders a colour-coded dot (keyed to the language in MOCKS.LANGS) inside a Chip. Unknown languages fall back to a muted dot. Pass `lang` as the language name string; the dot colour is resolved automatically — no per-use colour wiring needed."}}},argTypes:{lang:{control:`select`,options:[`TypeScript`,`Go`,`Java`,`Python`,`Rust`,`Shell`,`Kotlin`]},className:{control:!1}},args:{lang:`TypeScript`}},s={render:e=>(0,a.jsx)(r,{...e})},c={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,a.jsx)(r,{lang:`TypeScript`}),(0,a.jsx)(r,{lang:`Go`}),(0,a.jsx)(r,{lang:`Java`}),(0,a.jsx)(r,{lang:`Python`}),(0,a.jsx)(r,{lang:`Rust`})]})},l={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,a.jsx)(r,{lang:`Shell`}),(0,a.jsx)(r,{lang:`Kotlin`}),(0,a.jsx)(r,{lang:`Elixir`}),(0,a.jsx)(r,{lang:`Terraform`})]})},u={render:()=>(0,a.jsx)(`div`,{className:`surface`,style:{borderRadius:10,overflow:`hidden`},children:[{name:`forge-api`,lang:`Go`,repo:`platform/forge-api`,deploys:142},{name:`auth-service`,lang:`TypeScript`,repo:`platform/auth-service`,deploys:89},{name:`billing-worker`,lang:`Java`,repo:`platform/billing-worker`,deploys:31},{name:`ml-inference-router`,lang:`Python`,repo:`ml/inference-router`,deploys:17},{name:`cache-proxy`,lang:`Rust`,repo:`infra/cache-proxy`,deploys:204}].map((e,t)=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12,padding:`10px 16px`,borderTop:t===0?`none`:`1px solid var(--border)`},children:[(0,a.jsx)(`span`,{style:{flex:1,fontFamily:`var(--font-mono)`,fontSize:13,color:`var(--fg)`},children:e.name}),(0,a.jsx)(`span`,{style:{color:`var(--fg-muted)`,fontSize:12},children:e.repo}),(0,a.jsx)(r,{lang:e.lang}),(0,a.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-subtle)`,minWidth:48,textAlign:`right`},children:[e.deploys,` deploys`]})]},e.name))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <LangBadge {...args} />
}`,...s.parameters?.docs?.source},description:{story:`Single badge — the smallest real example. Colour dot resolves from the language registry.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  }}>
      <LangBadge lang="TypeScript" />
      <LangBadge lang="Go" />
      <LangBadge lang="Java" />
      <LangBadge lang="Python" />
      <LangBadge lang="Rust" />
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Known languages side by side — covers the full dot-colour matrix.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  }}>
      <LangBadge lang="Shell" />
      <LangBadge lang="Kotlin" />
      <LangBadge lang="Elixir" />
      <LangBadge lang="Terraform" />
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Unknown / unlisted language — dot falls back to muted foreground.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="surface" style={{
    borderRadius: 10,
    overflow: 'hidden'
  }}>
      {[{
      name: 'forge-api',
      lang: 'Go',
      repo: 'platform/forge-api',
      deploys: 142
    }, {
      name: 'auth-service',
      lang: 'TypeScript',
      repo: 'platform/auth-service',
      deploys: 89
    }, {
      name: 'billing-worker',
      lang: 'Java',
      repo: 'platform/billing-worker',
      deploys: 31
    }, {
      name: 'ml-inference-router',
      lang: 'Python',
      repo: 'ml/inference-router',
      deploys: 17
    }, {
      name: 'cache-proxy',
      lang: 'Rust',
      repo: 'infra/cache-proxy',
      deploys: 204
    }].map((row, i) => <div key={row.name} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderTop: i === 0 ? 'none' : '1px solid var(--border)'
    }}>
          <span style={{
        flex: 1,
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--fg)'
      }}>
            {row.name}
          </span>
          <span style={{
        color: 'var(--fg-muted)',
        fontSize: 12
      }}>{row.repo}</span>
          <LangBadge lang={row.lang} />
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-subtle)',
        minWidth: 48,
        textAlign: 'right'
      }}>
            {row.deploys} deploys
          </span>
        </div>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`In context — service catalog row with language, owner, and tier information.`,...u.parameters?.docs?.description}}},d=[`Default`,`KnownLanguages`,`UnknownLanguage`,`InContext`]}))();export{s as Default,u as InContext,c as KnownLanguages,l as UnknownLanguage,d as __namedExportsOrder,o as default};