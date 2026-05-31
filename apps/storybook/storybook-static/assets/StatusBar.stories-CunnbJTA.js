import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{_i as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d;e((()=>{t(),i(),a=n(),o={title:`Device/StatusBar`,component:r,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`The OS status strip shown above an app's top navigation inside a device frame. Adapts to platform: iOS renders a heavier centred clock with filled signal/wifi glyphs and a rounded battery; Android uses a lighter clock and outline battery.`}}},args:{platform:`ios`,time:`9:41`},argTypes:{platform:{control:`inline-radio`,options:[`ios`,`android`]},time:{control:`text`}}},s={},c={args:{platform:`android`}},l={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,width:360},children:[`ios`,`android`].map(e=>(0,a.jsx)(`div`,{style:{background:`var(--surface)`,borderRadius:8,border:`1px solid var(--border)`,overflow:`hidden`},children:(0,a.jsx)(r,{platform:e,time:`9:41`})},e))})},u={args:{time:`12:00`}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Default — iOS StatusBar at 9:41.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    platform: 'android'
  }
}`,...c.parameters?.docs?.source},description:{story:`Android platform variant.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: 360
  }}>
      {(['ios', 'android'] as const).map(platform => <div key={platform} style={{
      background: 'var(--surface)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      overflow: 'hidden'
    }}>
          <StatusBar platform={platform} time="9:41" />
        </div>)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Both platforms side by side for comparison.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    time: '12:00'
  }
}`,...u.parameters?.docs?.source},description:{story:`Custom time string — useful for documentation screenshots.`,...u.parameters?.docs?.description}}},d=[`Default`,`Android`,`BothPlatforms`,`CustomTime`]}))();export{c as Android,l as BothPlatforms,u as CustomTime,s as Default,d as __namedExportsOrder,o as default};