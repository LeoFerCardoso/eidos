'use client';
// Forge — New agent wizard (/portal/agents/new). Opened from "+ New agent" on
// the Agents catalog. Guides creation through 5 steps that mirror the agent
// detail page so the created object feels coherent with what you'll later see:
//   1 Define     — name + Markdown instructions + AI-generated summary
//   2 Model      — LLM (Auto default) · output kind · capabilities (all on)
//   3 Knowledge  — skills + contexts (attach + upload docs/slides/images)
//   4 Apps       — connect apps; every tool enabled by default, uncheck to deny
//   5 Review     — read-only recap, then Create
// Built only from Eidos DS primitives. This is a mockup: "Create" lands on a
// success panel (no persistence layer yet).
import * as React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {
  Icons, Avatar, Pill, Prose, Input, Textarea, Select, Checkbox,
  RadioCardGroup, FileInput, BrandIcon, AILabel, Popover, Command,
  type SelectGroup, type CommandGroup,
} from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import {
  CAPABILITIES, OUTPUT_META, SKILL_POOL, APP_POOL, CONTEXT_POOL,
  type SkillDef, type ContextDef, type AppDef,
} from '@/portal/data/agent-detail';
import type { AgentOutput } from '@/portal/data/agents';

// ── Static option data ────────────────────────────────────────────────────────

const bi = (slug: string) => {
  const C = (p: { size?: number; className?: string }) => <BrandIcon slug={slug} {...p} />;
  C.displayName = `Brand(${slug})`;
  return C;
};

const MODELS: SelectGroup[] = [
  { label: 'Recommended', options: [
    { value: 'auto', label: 'Auto', description: 'Routes each request to the best model', icon: Icons.sparkle },
  ] },
  { label: 'Anthropic', options: [
    { value: 'opus-4.7',   label: 'Claude Opus 4.7',   description: 'Most capable · deep reasoning', icon: bi('claude') },
    { value: 'sonnet-4.6', label: 'Claude Sonnet 4.6', description: 'Balanced speed and depth',      icon: bi('claude') },
    { value: 'haiku-4.5',  label: 'Claude Haiku 4.5',  description: 'Fastest · lowest cost',          icon: bi('claude') },
  ] },
  { label: 'OpenAI', options: [
    { value: 'gpt-5',   label: 'GPT-5',   description: 'Frontier reasoning',    icon: bi('gpt') },
    { value: 'gpt-4.1', label: 'GPT-4.1', description: 'Fast general-purpose',  icon: bi('gpt') },
  ] },
  { label: 'Google', options: [
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Long-context multimodal', icon: bi('gemini') },
  ] },
  { label: 'Others', options: [
    { value: 'grok-4',        label: 'Grok 4',        description: 'Realtime-aware',   icon: bi('grok') },
    { value: 'llama-4',       label: 'Llama 4',       description: 'Open weights',     icon: bi('llama') },
    { value: 'mistral-large', label: 'Mistral Large', description: 'Efficient model',  icon: bi('mistral') },
  ] },
];

// Output kinds. Chat (conversation) is the default.
const OUTPUTS: AgentOutput[] = ['conversation', 'json', 'code', 'document', 'image', 'file'];
const OUT_LABEL: Record<AgentOutput, string> = {
  conversation: 'Chat', json: 'JSON', code: 'Code', document: 'Document', image: 'Image', file: 'File',
};
const OUT_DESC: Record<AgentOutput, string> = {
  conversation: 'Back and forth replies in a chat thread.',
  json: 'A structured JSON payload with a schema.',
  code: 'A ready to run code block you can copy or open.',
  document: 'A formatted report in Markdown or PDF.',
  image: 'A single generated image asset.',
  file: 'A downloadable file artifact.',
};

// Model capability matrix. The multimodal capabilities are model-gated: a model
// that can't do something (e.g. Claude doesn't generate images) shows that
// capability unchecked + disabled. Everything else is supported by every model.
// "Auto" supports all (it routes to whichever model can do the job).
const GATED_CAPS = ['vision', 'image-gen', 'video', 'audio'];
const MODEL_GATED: Record<string, string[]> = {
  'opus-4.7':       ['vision'],
  'sonnet-4.6':     ['vision'],
  'haiku-4.5':      ['vision'],
  'gpt-5':          ['vision', 'image-gen', 'audio'],
  'gpt-4.1':        ['vision', 'image-gen', 'audio'],
  'gemini-2.5-pro': ['vision', 'image-gen', 'video', 'audio'],
  'grok-4':         ['vision', 'image-gen'],
  'llama-4':        ['vision'],
  'mistral-large':  [],
};
function supportedCaps(model: string): Set<string> {
  if (model === 'auto') return new Set(CAPABILITIES.map((c) => c.id));
  const gated = MODEL_GATED[model] ?? [];
  return new Set(CAPABILITIES.filter((c) => !GATED_CAPS.includes(c.id) || gated.includes(c.id)).map((c) => c.id));
}

const STEPS = [
  { id: 'define',    title: 'Define',     sub: 'Name & instructions' },
  { id: 'model',     title: 'Model',      sub: 'LLM, output & capabilities' },
  { id: 'knowledge', title: 'Knowledge',  sub: 'Skills & contexts' },
  { id: 'apps',      title: 'Apps',       sub: 'Connections & tools' },
  { id: 'review',    title: 'Review',     sub: 'Confirm & create' },
] as const;

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;
  return <C size={size} />;
};
// Icon component (not element) for CommandItem.icon.
const iconOf = (k: string): CommandGroup['items'][number]['icon'] =>
  (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.circle;

// File-type icon from an upload's extension.
const fileIcon = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (/png|jpe?g|gif|webp|svg/.test(ext)) return 'image';
  if (/pdf|docx?|pptx?|key|md|txt|rtf/.test(ext)) return 'doc';
  if (/csv|xlsx?|json/.test(ext)) return 'database';
  return 'file';
};

// Deterministic "AI" summary — distils the instructions into one line. (No LLM
// in the mock; we clean the Markdown and take the opening sentences.)
function genSummary(name: string, instr: string): string {
  const plain = instr
    .replace(/```[\s\S]*?```/g, ' ')             // drop code fences
    .split('\n')
    .filter((l) => !/^\s*(#|>)/.test(l))          // drop headings + blockquotes
    .join(' ')
    .replace(/[#>*_`~|]/g, ' ')
    .replace(/^\s*\d+\.\s*/g, ' ')                // strip a leading list number
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return `${name || 'This agent'} is an assistant scoped to your platform.`;
  const sentences = plain.split(/(?<=[.!?])\s+/);
  let s = sentences.slice(0, 2).join(' ');
  if (s.length > 190) s = s.slice(0, 187).replace(/\s+\S*$/, '') + '…';
  return s;
}

const STARTER_INSTRUCTIONS = `## Role

You are a specialist assistant for the Equifax Boa Vista platform. Stay strictly
within your domain; if a request falls outside it, say so and hand off.

## How it works

1. Read the request and pull only the context you need.
2. Reason step by step; prefer the smallest, reversible action.
3. Cite the evidence you relied on.

## Guardrails

> Never expose PII outside a registered consent scope.
`;

// ── Connected-app shape (app + the tools left enabled) ────────────────────────

type ConnectedApp = AppDef & { enabled: string[] };

// ── Wizard ─────────────────────────────────────────────────────────────────────

export default function NewAgent() {
  const { setCrumb } = usePageCrumb();
  React.useEffect(() => { setCrumb({ label: 'New agent', replace: true }); return () => setCrumb(null); }, [setCrumb]);
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // Step 1
  const [name, setName] = React.useState('');
  const [instructions, setInstructions] = React.useState('');
  const [summary, setSummary] = React.useState('');
  const [summaryState, setSummaryState] = React.useState<'idle' | 'generating' | 'ready'>('idle');
  const [summaryAI, setSummaryAI] = React.useState(false);

  // Step 2
  const [model, setModel] = React.useState('auto');
  const [output, setOutput] = React.useState<AgentOutput>('conversation');
  const supported = React.useMemo(() => supportedCaps(model), [model]);
  const [caps, setCaps] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(CAPABILITIES.map((c) => [c.id, true])),
  );
  // Re-evaluate capabilities when the model changes: what the model can do is on,
  // what it can't is forced off (and disabled in the UI).
  React.useEffect(() => {
    setCaps(Object.fromEntries(CAPABILITIES.map((c) => [c.id, supported.has(c.id)])));
  }, [supported]);

  // Step 3
  const [skills, setSkills] = React.useState<SkillDef[]>([]);
  const [contexts, setContexts] = React.useState<ContextDef[]>([]);
  const [files, setFiles] = React.useState<{ name: string; icon: string }[]>([]);

  // Step 4
  const [apps, setApps] = React.useState<ConnectedApp[]>([]);

  const genTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => { if (genTimer.current) clearTimeout(genTimer.current); }, []);

  const generateSummary = () => {
    if (!instructions.trim()) return;
    setSummaryState('generating');
    if (genTimer.current) clearTimeout(genTimer.current);
    genTimer.current = setTimeout(() => {
      setSummary(genSummary(name, instructions));
      setSummaryAI(true);
      setSummaryState('ready');
    }, 650);
  };

  // Validity per step (only step 1 has hard requirements).
  const nameOk = name.trim().length > 0;
  const instrOk = instructions.trim().length > 0;
  const step0Ok = nameOk && instrOk;
  const canContinue = step === 0 ? step0Ok : true;

  const capsOn = CAPABILITIES.filter((c) => supported.has(c.id) && caps[c.id]);
  const skillPool = SKILL_POOL.filter((s) => !skills.some((x) => x.name === s.name));
  const ctxPool = CONTEXT_POOL.filter((c) => !contexts.some((x) => x.id === c.id));
  const appPool = APP_POOL.filter((a) => !apps.some((x) => x.slug === a.slug));
  const toolCount = apps.reduce((n, a) => n + a.enabled.length, 0);
  const selectedModel = MODELS.flatMap((g) => g.options).find((o) => o.value === model);

  const goto = (i: number) => { if (i <= step || (i === step + 1 && canContinue)) setStep(i); };
  const next = () => { if (!canContinue) return; step < STEPS.length - 1 ? setStep(step + 1) : setDone(true); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const connectApp = (a: AppDef) => setApps((p) => [...p, { ...a, enabled: [...a.tools] }].sort((x, y) => x.name.localeCompare(y.name)));
  const toggleTool = (slug: string, tool: string) =>
    setApps((p) => p.map((a) => a.slug !== slug ? a : { ...a, enabled: a.enabled.includes(tool) ? a.enabled.filter((t) => t !== tool) : [...a.enabled, tool] }));

  // ── Success panel ────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="fp-wizard-done">
        <Confetti />
        <span className="ic"><Icons.check size={30} /></span>
        <h1>Your agent is ready</h1>
        <p>Your agent is live in your catalog. Start a chat now, or fine-tune its settings any time.</p>

        <div className="fp-wizard-donecard">
          <div className="dc-id">
            <Avatar name={name || 'New agent'} size={36} />
            <div className="dc-idtx">
              <span className="dc-nm">{name}</span>
              {summary && <span className="dc-sm">{summary}</span>}
            </div>
          </div>
          <dl className="dc-props">
            <div className="dcp"><dt>Model</dt><dd>{selectedModel?.icon ? <span className="rv-model">{React.createElement(selectedModel.icon, { size: 12 })} {selectedModel.label}</span> : model}</dd></div>
            <div className="dcp"><dt>Output</dt><dd><Pill tone="ember">{OUT_LABEL[output]}</Pill></dd></div>
            <div className="dcp"><dt>Capabilities</dt><dd>{capsOn.length}</dd></div>
            <div className="dcp"><dt>Skills</dt><dd>{skills.length || 'None'}</dd></div>
            <div className="dcp"><dt>Contexts</dt><dd>{contexts.length + files.length || 'None'}</dd></div>
            <div className="dcp">
              <dt>Apps</dt>
              <dd>
                {apps.length === 0 ? 'None' : (
                  <span className="fp-wizard-appgroup is-mini">
                    <span className="avs">{apps.slice(0, 5).map((a) => <span key={a.slug} className="av" title={a.name}><BrandIcon slug={a.slug} size={12} /></span>)}</span>
                    {apps.length > 5 && <span className="lbl">+{apps.length - 5}</span>}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="row">
          <Link className="btn" href="/portal/agents"><Icons.agent size={14} /> Go to agents</Link>
          <Link className="btn ember" href="/portal/chat"><Icons.chat size={14} /> Start a chat</Link>
        </div>
      </div>
    );
  }

  // ── Step bodies ──────────────────────────────────────────────────────────────
  const StepDefine = (
    <>
      <StepHead title="Define the agent" desc="Give it a name and the instructions it runs on. The instructions are the agent's brain, written in Markdown just like the detail page renders them." />
      <Field label="Agent name" required>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Latency Hunter" maxLength={48} autoFocus />
      </Field>

      <Field
        label="Instructions"
        required
        hint="Markdown: role, how it works, guardrails, output contract."
        action={
          <button type="button" className="fp-wizard-tpl" onClick={() => setInstructions(STARTER_INSTRUCTIONS)}>
            <Icons.sparkle size={12} /> Start from a template
          </button>
        }
      >
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={STARTER_INSTRUCTIONS}
          className="fp-wizard-instr"
          rows={14}
          showCount
          maxLength={6000}
        />
      </Field>

      <Field
        label="Summary"
        hint="A one-line description, generated by AI from your instructions. Editable."
        badge={summaryAI && summary ? <AILabel variant="mark" size="sm">AI</AILabel> : undefined}
        action={
          <button type="button" className="fp-wizard-tpl" onClick={generateSummary} disabled={!instrOk || summaryState === 'generating'}>
            {summaryState === 'generating'
              ? <><Icons.refresh size={12} className="fp-spin" /> Generating…</>
              : summary ? <><Icons.refresh size={12} /> Regenerate</> : <><Icons.sparkle size={12} /> Generate with AI</>}
          </button>
        }
      >
        <Textarea
          value={summary}
          onChange={(e) => { setSummary(e.target.value); setSummaryAI(false); }}
          placeholder={summaryState === 'generating' ? 'Generating…' : 'Generate from your instructions, or write your own.'}
          rows={2}
          maxLength={200}
          disabled={summaryState === 'generating'}
        />
      </Field>
    </>
  );

  const StepModel = (
    <>
      <StepHead title="Model & behavior" desc="Pick the model that powers the agent, what it returns, and which capabilities it may use." />
      <Field label="LLM model" required hint="Auto routes each request to the best model. Pick a specific one to pin behaviour and cost.">
        <Select groups={MODELS} value={model} onValueChange={setModel} size="lg" full searchable searchPlaceholder="Search models…" />
      </Field>

      <Field label="Output" hint="What a run returns. Chat is a back and forth; the rest return a single artifact.">
        <RadioCardGroup
          ariaLabel="Output kind"
          value={output}
          onValueChange={(v) => setOutput(v as AgentOutput)}
          className="fp-wizard-outputs"
          options={OUTPUTS.map((o) => ({
            value: o,
            title: <span className="fp-wizard-out-t">{ICON(OUTPUT_META[o].icon, 15)}{OUT_LABEL[o]}</span>,
            description: OUT_DESC[o],
          }))}
        />
      </Field>

      <Field
        label="Capabilities"
        hint={model === 'auto'
          ? 'On by default. Turn off anything this agent must not use.'
          : 'On for the model you picked. Greyed out means it can’t do that.'}
        action={<span className="fp-wizard-count">{capsOn.length} / {supported.size} on</span>}
      >
        <div className="fp-wizard-caps">
          {CAPABILITIES.map((c) => {
            const ok = supported.has(c.id);
            return (
              <Checkbox
                key={c.id}
                label={c.label}
                description={ok ? c.desc : `${c.desc} Not supported by this model.`}
                checked={ok && !!caps[c.id]}
                disabled={!ok}
                onChange={(e) => setCaps((p) => ({ ...p, [c.id]: e.target.checked }))}
              />
            );
          })}
        </div>
      </Field>
    </>
  );

  const StepKnowledge = (
    <>
      <StepHead title="Knowledge" desc="Optional. Add reusable skills and ground the agent on contexts: registries, or files you upload such as docs, slides and images." />
      <Field
        label="Skills"
        hint="Packaged abilities the agent can invoke."
        action={
          <AddCombo
            heading="Add a skill"
            placeholder="Search skills…"
            disabled={skillPool.length === 0}
            items={skillPool.map((s) => ({ id: s.name, label: s.name, keywords: [s.desc], icon: iconOf(s.icon) }))}
            onPick={(id) => { const s = SKILL_POOL.find((x) => x.name === id); if (s) setSkills((p) => [...p, s].sort((a, b) => a.name.localeCompare(b.name))); }}
          />
        }
      >
        {skills.length === 0 ? (
          <Empty icon="zap" label="No skills added yet." />
        ) : (
          <div className="fp-agentd-list">
            {skills.map((s) => (
              <div key={s.name} className="item">
                <span className="ic">{ICON(s.icon, 14)}</span>
                <span className="tx"><span className="nm">{s.name}</span><span className="ds">{s.desc}</span></span>
                <RmBtn label={`Remove ${s.name}`} onClick={() => setSkills((p) => p.filter((x) => x.name !== s.name))} />
              </div>
            ))}
          </div>
        )}
      </Field>

      <Field
        label="Contexts"
        hint="Registries and knowledge sources the agent can read."
        action={
          <AddCombo
            heading="Attach a context"
            placeholder="Search contexts…"
            disabled={ctxPool.length === 0}
            items={ctxPool.map((c) => ({ id: c.id, label: c.name, keywords: [c.desc], icon: iconOf(c.icon) }))}
            onPick={(id) => { const c = CONTEXT_POOL.find((x) => x.id === id); if (c) setContexts((p) => [...p, c]); }}
          />
        }
      >
        {contexts.length === 0 && files.length === 0 ? (
          <Empty icon="layers" label="No contexts attached yet." />
        ) : (
          <div className="fp-agentd-list">
            {contexts.map((c) => (
              <div key={c.id} className="item">
                <span className="ic">{ICON(c.icon, 14)}</span>
                <span className="tx"><span className="nm">{c.name}</span><span className="ds">{c.desc}</span></span>
                <RmBtn label={`Remove ${c.name}`} onClick={() => setContexts((p) => p.filter((x) => x.id !== c.id))} />
              </div>
            ))}
            {files.map((f) => (
              <div key={f.name} className="item">
                <span className="ic">{ICON(f.icon, 14)}</span>
                <span className="tx"><span className="nm">{f.name}</span><span className="ds">Uploaded file</span></span>
                <RmBtn label={`Remove ${f.name}`} onClick={() => setFiles((p) => p.filter((x) => x.name !== f.name))} />
              </div>
            ))}
          </div>
        )}
        <FileInput
          compact
          className="fp-wizard-file"
          title="Upload files"
          helpText="Docs, slides, images. PDF, DOCX, PPTX, PNG. Max 25 MB."
          onFilesChange={(fl) => setFiles((p) => {
            const have = new Set(p.map((x) => x.name));
            const add = fl.filter((f) => !have.has(f.name)).map((f) => ({ name: f.name, icon: fileIcon(f.name) }));
            return [...p, ...add];
          })}
        />
      </Field>
    </>
  );

  const StepApps = (
    <>
      <StepHead title="Apps & tools" desc="Connect the apps this agent can call. Every tool is enabled by default; uncheck anything it must not use." />
      <Field
        label="Connected apps"
        action={
          <AddCombo
            heading="Connect an app"
            placeholder="Search apps…"
            disabled={appPool.length === 0}
            items={appPool.map((a) => ({ id: a.slug, label: a.name, kbd: [a.kind], icon: (p) => <BrandIcon slug={a.slug} {...p} /> }))}
            onPick={(id) => { const a = APP_POOL.find((x) => x.slug === id); if (a) connectApp(a); }}
          />
        }
      >
        {apps.length === 0 ? (
          <Empty icon="mcpServer" label="No apps connected yet." />
        ) : (
          <div className="fp-wizard-apps">
            {apps.map((a) => (
              <div key={a.slug} className="fp-wizard-app">
                <div className="head">
                  <span className="logo"><BrandIcon slug={a.slug} size={18} /></span>
                  <span className="nm">{a.name}</span>
                  <KindChip kind={a.kind} />
                  <span className="ct">{a.enabled.length}/{a.tools.length} tools</span>
                  <RmBtn label={`Disconnect ${a.name}`} onClick={() => setApps((p) => p.filter((x) => x.slug !== a.slug))} />
                </div>
                <div className="tools">
                  {a.tools.map((t) => {
                    const on = a.enabled.includes(t);
                    return (
                      <label key={t} className={'tool' + (on ? '' : ' off')}>
                        <input type="checkbox" checked={on} onChange={() => toggleTool(a.slug, t)} />
                        <Icons.toolCall size={12} />
                        <code className="mono">{t}</code>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Field>
    </>
  );

  const StepReview = (
    <>
      <StepHead title="Review & create" desc="A quick recap of how the agent is configured. Step back to change anything." />
      <div className="fp-wizard-review">
        <div className="rv-id">
          <Avatar name={name || 'New agent'} size={40} />
          <div>
            <div className="nm">{name || <span className="ph">Unnamed agent</span>}</div>
            <div className="sm">{summary || <span className="ph">No summary</span>}</div>
          </div>
        </div>

        <dl className="rv-props">
          <RvRow k="Model">
            {selectedModel?.icon ? <span className="rv-model">{React.createElement(selectedModel.icon, { size: 13 })} {selectedModel.label}</span> : model}
          </RvRow>
          <RvRow k="Output"><Pill tone="ember">{OUT_LABEL[output]}</Pill></RvRow>
          <RvRow k="Skills">{skills.length || 'None'}</RvRow>
          <RvRow k="Contexts">{contexts.length + files.length || 'None'}</RvRow>
        </dl>

        {capsOn.length > 0 && (
          <div className="rv-block">
            <span className="rv-h">Capabilities <span className="rv-count">{capsOn.length}</span></span>
            <div className="fp-agentd-caps">
              {capsOn.map((c) => <span key={c.id} className="cap">{ICON(c.icon, 13)} {c.label}</span>)}
            </div>
          </div>
        )}

        <div className="rv-block">
          <span className="rv-h">Apps {apps.length > 0 && <span className="rv-count">{apps.length}</span>}</span>
          {apps.length === 0 ? (
            <span className="rv-none">No apps connected.</span>
          ) : (
            <div className="fp-wizard-appgroup">
              <span className="avs">
                {apps.map((a) => (
                  <span key={a.slug} className="av" title={`${a.name} · ${a.kind}`}><BrandIcon slug={a.slug} size={15} /></span>
                ))}
              </span>
              <span className="lbl">{plural(toolCount, 'tool')} enabled</span>
            </div>
          )}
        </div>

        <div className="rv-block">
          <span className="rv-h">Instructions</span>
          <Prose className="fp-wizard-preview fp-wizard-review-instr">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{instructions || '_No instructions._'}</ReactMarkdown>
          </Prose>
        </div>
      </div>
    </>
  );

  const BODY = [StepDefine, StepModel, StepKnowledge, StepApps, StepReview][step];

  return (
    <div className="fp-wizard">
      <header className="fp-wizard-head">
        <div className="fp-chat-pane-head">
          <span className="eyebrow">Forge · Agents</span>
          <h1>New agent</h1>
          <p className="lede">Define an assistant scoped to a domain: its instructions, the model it runs on, the capabilities and knowledge it uses, and the apps it can call.</p>
        </div>
        <Link className="btn ghost sm" href="/portal/agents"><Icons.x size={14} /> Cancel</Link>
      </header>

      <div className="fp-wizard-body">
        <nav className="fp-wizard-rail" aria-label="Steps">
          {STEPS.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'todo';
            const reachable = i <= step || (i === step + 1 && canContinue);
            return (
              <button
                key={s.id}
                type="button"
                className={`fp-wizard-step is-${state}`}
                disabled={!reachable}
                onClick={() => goto(i)}
                aria-current={state === 'active' ? 'step' : undefined}
              >
                <span className="mk">{state === 'done' ? <Icons.check size={13} /> : i + 1}</span>
                <span className="tx"><span className="t">{s.title}</span><span className="s">{s.sub}</span></span>
              </button>
            );
          })}
        </nav>

        <div className="fp-wizard-panel">
          <div className="fp-wizard-content">{BODY}</div>

          <footer className="fp-wizard-foot">
            <button type="button" className="btn ghost" onClick={back} disabled={step === 0}>
              <Icons.chevronLeft size={14} /> Back
            </button>
            <span className="fp-wizard-progress t-mono">Step {step + 1} of {STEPS.length}</span>
            <button type="button" className="btn ember" onClick={next} disabled={!canContinue}>
              {step === STEPS.length - 1 ? <><Icons.check size={14} /> Create agent</> : <>Continue <Icons.arrowRight size={14} /></>}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

// ── Small building blocks ──────────────────────────────────────────────────────

function StepHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="fp-wizard-stephead">
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

function Field({ label, required, hint, action, badge, children }: { label: string; required?: boolean; hint?: React.ReactNode; action?: React.ReactNode; badge?: React.ReactNode; children: React.ReactNode }) {
  const lbl = (
    <span className="fp-wizard-field-lbl">{label}{required && <span className="req" title="Required"> *</span>}{badge && <span className="bdg">{badge}</span>}</span>
  );
  return (
    <div className="fp-wizard-field">
      {hint ? (
        // Label + support text are one group; the action sits on the support line.
        <div className="fp-wizard-field-grp">
          {lbl}
          <div className="fp-wizard-field-sub">
            <p className="fp-wizard-field-hint">{hint}</p>
            {action && <span className="act">{action}</span>}
          </div>
        </div>
      ) : (
        // No support text — the action rides on the label row.
        <div className="fp-wizard-field-row">
          {lbl}
          {action && <span className="act">{action}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function Empty({ icon, label }: { icon: string; label: string }) {
  return <div className="fp-agentd-empty"><span className="ic">{ICON(icon, 16)}</span><span>{label}</span></div>;
}

function RmBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" className="fp-agentd-rm" aria-label={label} onClick={onClick}><Icons.x size={12} /></button>;
}

// Searchable add-picker. Opens a Popover off the "+ Add" link with a Command
// (search input + left-aligned, scrollable, filterable list) — built for pools
// that can grow large. When the pool is exhausted, the trigger is disabled.
function AddCombo({ heading, placeholder, items, disabled, onPick }: {
  heading: string;
  placeholder: string;
  items: { id: string; label: string; icon?: CommandGroup['items'][number]['icon']; keywords?: string[]; kbd?: string[] }[];
  disabled?: boolean;
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  if (disabled) {
    return <button type="button" className="fp-agentd-add" disabled>{<Icons.plus size={12} />} Add</button>;
  }
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      side="bottom"
      align="end"
      aria-label={heading}
      className="fp-wizard-addpop"
      trigger={<button type="button" className="fp-agentd-add"><Icons.plus size={12} /> Add</button>}
    >
      <Command
        groups={[{ heading, items }]}
        placeholder={placeholder}
        footer={false}
        onSelect={(id) => { onPick(id); setOpen(false); }}
      />
    </Popover>
  );
}

const KindChip = ({ kind }: { kind: AppDef['kind'] }) => (
  <span className={`fp-agentd-kind k-${kind.toLowerCase()}`}>{kind}</span>
);

function RvRow({ k, children }: { k: string; children: React.ReactNode }) {
  return <div className="rvp"><dt>{k}</dt><dd>{children}</dd></div>;
}

// One-shot confetti rain that celebrates a created agent. Deterministic (seeded
// per piece) so it never mismatches; renders only on the client (the success
// panel), and is suppressed under prefers-reduced-motion via CSS.
const CONFETTI_COLORS = ['var(--ember)', 'var(--accent-2)', 'var(--success)', 'var(--ember-glow)', '#F4C95D'];
function Confetti({ count = 90 }: { count?: number }) {
  const pieces = React.useMemo(() => {
    const rand = (i: number, n: number) => { const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
    return Array.from({ length: count }, (_, i) => {
      const size = 6 + Math.floor(rand(i, 6) * 6);
      const round = rand(i, 8) > 0.72;
      return {
        i,
        left: rand(i, 1) * 100,
        delay: rand(i, 2) * 0.9,
        dur: 2.6 + rand(i, 3) * 2.2,
        drift: (rand(i, 4) - 0.5) * 260,
        rot: 240 + rand(i, 5) * 540,
        size,
        round,
        color: CONFETTI_COLORS[Math.floor(rand(i, 7) * CONFETTI_COLORS.length)],
      };
    });
  }, [count]);
  return (
    <div className="fp-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.i}
          className={'fp-confetti-bit' + (p.round ? ' round' : '')}
          style={{
            left: `${p.left}%`,
            inlineSize: p.size,
            blockSize: p.round ? p.size : Math.round(p.size * 0.45),
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--drift' as string]: `${p.drift}px`,
            ['--rot' as string]: `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}
