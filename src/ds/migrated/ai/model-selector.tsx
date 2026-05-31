'use client';
// Eidos AI — Model Selector (§2.2 component-page standard, num "18").
// Choose the model the next reply will use. A drop-up trigger inside the
// prompt-input composer footer — or anywhere a model pick is needed.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, PropsTable, installTabs, ModelSelector, ModelBadge, PromptInput, Lede, Mono } from '@/ds/core';

// AI-page inline style convention (agents.tsx / prompt-input.tsx idiom)
const captn = { fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' };

// ── model data ────────────────────────────────────────────────────────────────

// DEFAULT_MODELS — mirroring core/ai/prompt.tsx
const DEFAULT_MODELS = [
  { id: 'eidos-sonnet-4-6', short: 'S', name: 'Sonnet 4.6', cost: '$3 / 1M' },
  { id: 'eidos-opus-4-7',   short: 'O', name: 'Opus 4.7',   cost: '$15 / 1M' },
  { id: 'eidos-haiku-4-5',  short: 'H', name: 'Haiku 4.5',  cost: '$1 / 1M' },
];

// Custom model set with descriptive subtitles
const CUSTOM_MODELS = [
  { id: 'anthropic/claude-sonnet-4-5', short: 'S', name: 'Claude Sonnet 4.5', cost: 'Fast · $3 / 1M' },
  { id: 'openai/gpt-5',                short: 'G', name: 'GPT-5',             cost: 'OpenAI · $15 / 1M' },
  { id: 'eidos-ai/sonnet-4-6',         short: 'F', name: 'Eidos Sonnet 4.6',  cost: 'Hosted · $3 / 1M' },
  { id: 'anthropic/claude-haiku-4-5',  short: 'H', name: 'Claude Haiku 4.5', cost: 'Light · $1 / 1M' },
  { id: 'openai/gpt-4o-mini',          short: 'M', name: 'GPT-4o mini',      cost: 'Budget · $0.15 / 1M' },
];

// ── live demos ────────────────────────────────────────────────────────────────

// Usage demo — controlled selector, DEFAULT_MODELS
const UsageDemo = () => {
  const [value, setValue] = React.useState('eidos-sonnet-4-6');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ModelSelector value={value} onChange={setValue} models={DEFAULT_MODELS}/>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>
        Active: <span style={{ color: 'var(--ember)' }}>{value}</span>
      </span>
    </div>
  );
};

// Custom models demo
const CustomModelsDemo = () => {
  const [value, setValue] = React.useState('anthropic/claude-sonnet-4-5');
  return (
    <ModelSelector value={value} onChange={setValue} models={CUSTOM_MODELS}/>
  );
};

// Single-model fallback — the degenerate case (one model, nothing to pick)
const SingleModelDemo = () => {
  const [value, setValue] = React.useState('eidos-sonnet-4-6');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <ModelSelector
        value={value}
        onChange={setValue}
        models={[{ id: 'eidos-sonnet-4-6', short: 'S', name: 'Sonnet 4.6', cost: 'Only model · $3 / 1M' }]}
      />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>
        Opens a one-row list — the active row is the only option.
      </span>
    </div>
  );
};

// Inside PromptInput — the canonical placement
const InsidePromptDemo = () => {
  const [model, setModel] = React.useState('eidos-sonnet-4-6');
  const [text, setText] = React.useState('');
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <PromptInput
        status="ready"
        placeholder="Ask anything…"
        value={text}
        onChange={setText}
        onSubmit={() => setText('')}
        modelValue={model}
        onModelChange={setModel}
      />
    </div>
  );
};

// Header context — model indicator in a conversation header bar
const HeaderContextDemo = () => {
  const [model, setModel] = React.useState('eidos-opus-4-7');
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <div className="surface" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 'var(--radius-lg)' }}>
        <Icons.flame size={14} color="var(--ember)"/>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, flex: 1 }}>Incident replay · <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>0421</span></span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', marginInlineEnd: 8 }}>Model</span>
        <ModelSelector value={model} onChange={setModel} models={DEFAULT_MODELS}/>
      </div>
      <p style={{ ...captn, marginTop: 10 }}>
        In a conversation header the selector acts as the "current model" indicator — clicking opens the picker to change for the next reply.
      </p>
    </div>
  );
};

// ── code snippets ─────────────────────────────────────────────────────────────
const INSTALL_CODE = installTabs('ai-model-selector');

const USAGE_CODE = `import { ModelSelector } from "@/ds/core";

function Demo() {
  const [value, setValue] = React.useState("eidos-sonnet-4-6");
  return (
    <ModelSelector
      value={value}
      onChange={setValue}
    />
  );
}`;

const CUSTOM_CODE = `const MODELS = [
  { id: "anthropic/claude-sonnet-4-5", short: "S", name: "Claude Sonnet 4.5", cost: "Fast · $3 / 1M" },
  { id: "openai/gpt-5",                short: "G", name: "GPT-5",             cost: "OpenAI · $15 / 1M" },
  { id: "eidos-ai/sonnet-4-6",         short: "F", name: "Eidos Sonnet 4.6",  cost: "Hosted · $3 / 1M" },
  { id: "anthropic/claude-haiku-4-5",  short: "H", name: "Claude Haiku 4.5", cost: "Light · $1 / 1M" },
  { id: "openai/gpt-4o-mini",          short: "M", name: "GPT-4o mini",      cost: "Budget · $0.15 / 1M" },
];

<ModelSelector value={value} onChange={setValue} models={MODELS}/>`;

const SINGLE_CODE = `// One model? The trigger still renders and stays interactive —
// it opens a single-row list so the affordance is consistent.
<ModelSelector
  value="eidos-sonnet-4-6"
  onChange={setValue}
  models={[
    { id: "eidos-sonnet-4-6", short: "S", name: "Sonnet 4.6", cost: "Only model · $3 / 1M" },
  ]}
/>`;

const PROMPT_CODE = `// Canonical placement — inside PromptInput
<PromptInput
  status="ready"
  value={text}
  onChange={setText}
  onSubmit={handleSubmit}
  modelValue={model}
  onModelChange={setModel}
/>`;

const HEADER_CODE = `// In a conversation header
<div className="surface" style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <Icons.flame size={14} color="var(--ember)"/>
  <span>Incident replay · 0421</span>
  <ModelSelector value={model} onChange={setModel}/>
</div>`;

export default function AiModelSelectorPage() {
  return (
    <Section
      id="model-selector"
      num="18"
      title="Model Selector"
      desc="Choose the model the next reply will use. A compact drop-up trigger that lives in the prompt-input footer — or any surface where the active model should be visible and switchable."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={INSTALL_CODE} ariaLabel="package manager"/>
      <Lede>
        Ships <Mono>ModelSelector</Mono>, <Mono>ModelBadge</Mono>, and the <Mono>ModelOption</Mono> interface from <Mono>@/ds/core</Mono>. Three default models are provided via <Mono>DEFAULT_MODELS</Mono> — pass a custom <Mono>models</Mono> array to override.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="controlled selector — switch between the default models" code={USAGE_CODE} height={200}>
        <UsageDemo/>
      </Frame>
      <Lede>
        Pass a <Mono>value</Mono> (the active model id) and an <Mono>onChange</Mono> handler. The selector is fully controlled — the parent owns the state.
      </Lede>

      {/* 3. VARIANTS / CONFIGURATIONS */}
      <SubHead meta="custom models">Custom models</SubHead>
      <Frame label="pass a custom models array with descriptive cost subtitles" code={CUSTOM_CODE} height={260}>
        <CustomModelsDemo/>
      </Frame>
      <Lede>
        The <Mono>cost</Mono> field is optional but strongly recommended — it lets users distinguish models by speed and price at a glance. Use a short descriptor ("Fast · $3/1M", "Budget") rather than a raw token price alone.
      </Lede>

      {/* VARIANTS — single-model fallback (degenerate state coverage) */}
      <SubHead meta="fallback">Single model</SubHead>
      <Frame label="one model — the trigger stays interactive and opens a one-row list" code={SINGLE_CODE} height={170}>
        <SingleModelDemo/>
      </Frame>
      <Lede>
        When the <Mono>models</Mono> array holds a single entry the selector still renders as a normal trigger and opens a one-row listbox, so the affordance is consistent across surfaces. If your product can ever fall to one model, keep the selector visible rather than swapping it for static text — that way enabling a second model never moves the control. The active row is announced with <Mono>aria-current="true"</Mono> even when it is the only choice.
      </Lede>

      {/* IN CONTEXT — inside PromptInput */}
      <SubHead meta="real surface">Inside Prompt Input</SubHead>
      <Frame label="ModelSelector inside PromptInput — the canonical placement" code={PROMPT_CODE} height={130}>
        <InsidePromptDemo/>
      </Frame>
      <Lede>
        This is the primary usage pattern: the model selector sits in the composer footer to the right of the attach button. Passing <Mono>modelValue</Mono> and <Mono>onModelChange</Mono> to <Mono>PromptInput</Mono> renders it automatically — you do not need to wire <Mono>ModelSelector</Mono> separately.
      </Lede>

      {/* IN CONTEXT — conversation header */}
      <SubHead meta="real surface">Header context</SubHead>
      <Frame label="ModelSelector in a conversation header — current model indicator" code={HEADER_CODE} height={130}>
        <HeaderContextDemo/>
      </Frame>
      <Lede>
        In a header bar the selector doubles as a status indicator — users see which model is active without opening the picker. The compact trigger (badge + name + chevron) fits comfortably beside the conversation title.
      </Lede>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The trigger is a real <code style={{ fontFamily: 'var(--font-mono)' }}>{'<button>'}</code>: Tab reaches it, Enter/Space toggles the popup. Focus stays on the trigger — the listbox is a roving <code style={{ fontFamily: 'var(--font-mono)' }}>aria-activedescendant</code> model rather than a focus trap: ArrowDown/ArrowUp move the active descendant, Home/End jump to the first/last option, and Enter confirms the highlighted model. Esc or an outside click closes the popup and leaves focus on the trigger.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>ARIA</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The trigger carries <code style={{ fontFamily: 'var(--font-mono)' }}>aria-haspopup="listbox"</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>aria-expanded</code> (toggled by the component). The popup is <code style={{ fontFamily: 'var(--font-mono)' }}>role="listbox"</code> with an <code style={{ fontFamily: 'var(--font-mono)' }}>aria-activedescendant</code> pointing at the highlighted option; each option is <code style={{ fontFamily: 'var(--font-mono)' }}>role="option"</code> with a stable <code style={{ fontFamily: 'var(--font-mono)' }}>id</code>. The active model carries both <code style={{ fontFamily: 'var(--font-mono)' }}>aria-selected="true"</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>aria-current="true"</code> (plus the <code style={{ fontFamily: 'var(--font-mono)' }}>is-active</code> class for the fill), so the current choice is exposed to assistive tech, not only conveyed visually.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The trigger and each menu item show the 2px ember focus ring on <code style={{ fontFamily: 'var(--font-mono)' }}>:focus-visible</code>. The active item uses the <code style={{ fontFamily: 'var(--font-mono)' }}>is-active</code> class which applies <code style={{ fontFamily: 'var(--font-mono)' }}>--surface-active</code> fill — verify this provides ≥ 3:1 contrast against the adjacent non-active row. The <code style={{ fontFamily: 'var(--font-mono)' }}>ModelBadge</code> abbreviation (S, O, H) is complementary to the model name — never the only identifier.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The popup is positioned, not animated in transform space, so there is little motion to suppress: under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> the trigger's hover transition is the only thing that softens, and the menu simply appears and disappears at its measured anchor. The chevron is static — open state is conveyed by <code style={{ fontFamily: 'var(--font-mono)' }}>aria-expanded</code>, not a spin.
          </div>
        </div>
      </div>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — trigger reads from the start (right) edge; popup anchors inline-start" row>
        <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start', width: '100%', maxWidth: 520 }}>
          <ModelSelector value="eidos-sonnet-4-6" onChange={() => {}} models={DEFAULT_MODELS}/>
          <div style={{ width: '100%' }}>
            <PromptInput
              status="ready"
              placeholder="اسأل أي شيء…"
              modelValue="eidos-sonnet-4-6"
              onModelChange={() => {}}
            />
          </div>
        </div>
      </Frame>
      <Lede>
        The trigger's badge, label, and chevron stack uses logical <Mono>gap</Mono> and <Mono>flex-direction</Mono> so the reading order flips automatically in RTL. The popup anchors to <Mono>inset-inline-start: 0</Mono> so it opens from the start (right) edge. The chevron is not a directional glyph — it does not mirror.
      </Lede>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              {/* Trigger */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'default' }}>
                <ModelBadge short="S"/>
                <span style={{ fontSize: 'var(--text-sm)' }}>Sonnet 4.6</span>
                <Icons.chevronDown size={11} style={{ color: 'var(--fg-muted)' }}/>
              </div>
              {/* Popup below */}
              <div style={{ marginTop: 8, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--surface)', minWidth: 180, overflow: 'hidden' }}>
                {[
                  { short: 'S', name: 'Sonnet 4.6', cost: '$3 / 1M', active: true },
                  { short: 'O', name: 'Opus 4.7',   cost: '$15 / 1M', active: false },
                  { short: 'H', name: 'Haiku 4.5',  cost: '$1 / 1M', active: false },
                ].map((m) => (
                  <div key={m.short} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: m.active ? 'var(--surface-active)' : undefined }}>
                    <ModelBadge short={m.short}/>
                    <span style={{ fontSize: 'var(--text-sm)', flex: 1 }}>{m.name}</span>
                    {m.cost && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>{m.cost}</span>}
                  </div>
                ))}
              </div>
              {/* pins — trigger */}
              <span className="lead v" style={{ top: -24, left: 12, height: 20 }}/>
              <div className="pin" style={{ top: -44, left: 12, transform: 'translateX(-50%)' }}>1</div>
              <span className="lead h" style={{ top: 14, left: -30, width: 26 }}/>
              <div className="pin" style={{ top: 4, left: -54 }}>2</div>
              <span className="lead v" style={{ top: -24, right: 10, height: 20 }}/>
              <div className="pin" style={{ top: -44, right: 10, transform: 'translateX(50%)' }}>3</div>
              {/* pins — popup */}
              <span className="lead h" style={{ top: 75, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 65, right: -54 }}>4</div>
              <span className="lead v" style={{ bottom: -24, left: '50%', height: 20, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: -44, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Trigger.</b> A <Mono>{'<button>'}</Mono> with <Mono>aria-haspopup="listbox"</Mono> and <Mono>aria-expanded</Mono>. Renders the badge, the model name, and the chevron. Keeps keyboard focus while the listbox is open and acts as the current-model indicator when the popup is closed.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>ModelBadge.</b> A 1–2 character mono abbreviation (S, O, H, G) inside a <Mono>.badge</Mono> chip. Provides quick visual identification when scanning several models — never the sole identifier.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Chevron.</b> A down-pointing icon that shows the trigger is interactive; it stays static — open state is exposed through <Mono>aria-expanded</Mono>, not a rotation. Not a directional glyph, so it does not mirror in RTL.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Option row.</b> Badge + model name + optional cost subtitle. Uses <Mono>role="option"</Mono>; the active item gets <Mono>is-active</Mono> (filled background) plus <Mono>aria-selected="true"</Mono> and <Mono>aria-current="true"</Mono> so the current model is announced, not just shown.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Cost subtitle.</b> Short metadata in Geist Mono on <Mono>--fg-faint</Mono>. Communicates latency tier and price class so users can make an informed choice. Always include when models differ meaningfully.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — label what differs between models</div>
          <div className="body" style={{ padding: 14 }}>
            <ModelSelector
              value="eidos-sonnet-4-6"
              onChange={() => {}}
              models={[
                { id: 'eidos-sonnet-4-6', short: 'S', name: 'Sonnet 4.6', cost: 'Fast · $3 / 1M' },
                { id: 'eidos-opus-4-7',   short: 'O', name: 'Opus 4.7',   cost: 'Deep · $15 / 1M' },
                { id: 'eidos-haiku-4-5',  short: 'H', name: 'Haiku 4.5',  cost: 'Light · $1 / 1M' },
              ]}
            />
          </div>
          <div className="note">The cost subtitle distinguishes models by speed and price. Users should know whether they're choosing "fast and cheap" or "slow but thorough".</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — list models with vendor IDs and no context</div>
          <div className="body" style={{ padding: 14 }}>
            <ModelSelector
              value="anthropic/claude-sonnet-4-5"
              onChange={() => {}}
              models={[
                { id: 'anthropic/claude-sonnet-4-5', short: 'A', name: 'anthropic/claude-sonnet-4-5' },
                { id: 'openai/gpt-5',                short: 'O', name: 'openai/gpt-5' },
                { id: 'openai/gpt-4o-mini',          short: 'M', name: 'openai/gpt-4o-mini' },
              ]}
            />
          </div>
          <div className="note">Raw model IDs expose infrastructure detail and give users nothing to decide with. Provide a short, human-readable name and a cost/speed hint in the cost field.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — place the selector in the composer footer</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: '100%', maxWidth: 360 }}>
              <PromptInput
                status="ready"
                placeholder="Ask anything…"
                modelValue="eidos-sonnet-4-6"
                onModelChange={() => {}}
              />
            </div>
          </div>
          <div className="note">The composer footer is the canonical home. Users are already looking there to submit — the model is visible and reachable without disrupting the flow.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — put model selection in settings only</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 300 }}>
              <div className="surface" style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Model: Sonnet 4.6</span>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                Change in Settings → AI → Model preferences
              </span>
            </div>
          </div>
          <div className="note">Hiding model selection in a settings panel forces users to leave the chat context. The model picker belongs inline — in the composer or the conversation header.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="ModelSelectorProps">API reference</SubHead>
      <AutoPropsTable component="ModelSelector" label="<ModelSelector />"/>
      <PropsTable
        label="ModelOption"
        rows={[
          { prop: 'id',    type: 'string',            required: true,  description: 'Unique identifier for the model. Used as the value and key.' },
          { prop: 'short', type: 'string',            required: true,  description: '1–2 character abbreviation rendered as a ModelBadge in both the trigger and each option row.' },
          { prop: 'name',  type: 'string',            required: true,  description: 'Human-readable model name shown in the trigger and in the popup list.' },
          { prop: 'cost',  type: 'string',            default: undefined, description: 'Short metadata string (speed tier, price class) rendered in Geist Mono on the right of each option row. Strongly recommended when models differ in cost or latency.' },
        ]}
      />
      <Lede>
        The <Mono>ModelSelector</Mono> manages its own open/close state internally; outside-click and Escape close it via document event listeners. The popup is rendered with <Mono>createPortal</Mono> into <Mono>document.body</Mono> (so it is never clipped by an <Mono>overflow</Mono> ancestor), then positioned by JS: it measures the trigger with <Mono>getBoundingClientRect()</Mono> and places the menu <b style={{ color: 'var(--fg)' }}>above</b> by default — composers usually sit near the bottom of a thread — with a <Mono>6px</Mono> gap, flipping <b style={{ color: 'var(--fg)' }}>below</b> when there is no room above. The anchor is re-measured on scroll and resize, so the drop-up tracks the trigger rather than relying on a static CSS offset.
      </Lede>
    </Section>
  );
}
