import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock, CollapsibleCode, Prose, ProseCode, Icons } from '@eidos/ui';

const meta = {
  title: 'Primitives/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A labeled code-only display panel — a headed frame with a copy button and a tokenized body, ' +
          'but no preview area. Use it for terminal output, config recipes, or any snippet that stands alone ' +
          'without a live preview (reach for `Frame` when you need a preview + code pair). The built-in tokenizer ' +
          'covers bash / ts / tsx / js / jsx / css / html; pass `lang=""` to render plain mono with no language token.',
      },
    },
  },
  args: {
    label: 'deploy command',
    lang: 'bash',
    code: `eidos deploy --service identity-svc --ring canary`,
  },
  argTypes: {
    label: { control: 'text', description: 'Eyebrow label shown in the block header — name the snippet.' },
    lang: {
      control: 'select',
      options: ['bash', 'ts', 'tsx', 'js', 'jsx', 'css', 'html', ''],
      description: 'Language hint for the built-in tokenizer. Empty string renders plain mono.',
    },
    code: { control: 'text', description: 'Raw source string to tokenize and offer for copy.' },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — the canonical standalone snippet: label, language tag, and copy button, driven by args. */
export const Default: Story = {};

/** Shell — the common bash / install-step pattern documented in Usage and Variants. */
export const BashShell: Story = {
  args: {
    label: 'shell',
    lang: 'bash',
    code: `eidos deploy --service identity-svc --ring canary`,
  },
};

/** TypeScript — the `ts` tokenizer path from the Variants section. */
export const TypeScript: Story = {
  args: {
    label: 'typescript',
    lang: 'ts',
    code: `const agent = new Agent({ model: 'anthropic/claude-sonnet-4-6' });`,
  },
};

/** CSS — a tokens-file excerpt; the `css` tokenizer path from Variants. */
export const CssTokens: Story = {
  args: {
    label: 'css',
    lang: 'css',
    code: `--ember: #FF6B35;\n.ai-code { border-radius: var(--radius-lg); }`,
  },
};

/** HTML — the `html` tokenizer path listed in the Variants lede. */
export const Html: Story = {
  args: {
    label: 'markup',
    lang: 'html',
    code: `<button class="btn-primary" data-action="deploy">Ship it</button>`,
  },
};

/** Without header — pass `lang=""` to suppress the language token (Anatomy pin 2 / API `lang` doc). Copy stays. */
export const NoLanguageLabel: Story = {
  args: {
    label: 'config fragment',
    lang: '',
    code: `{ "service": "identity-svc", "p95": 482, "budget": 0.38 }`,
  },
};

/**
 * Long snippets — the documented "auto-collapse at 8 lines" state. The fold is owned by the
 * `CollapsibleCode` primitive (clips at 8 lines, reveals via a real "Show code" toggle button);
 * the standalone `CodeBlock` itself does not fold, so the documented behaviour is rendered here
 * through `CollapsibleCode` directly.
 */
export const LongSnippet: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <CollapsibleCode
        lang="ts"
        code={`import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/ai/client';
import type { StreamingOptions } from '@/types/ai';

// This hook manages a streaming AI response with abort support.
export function useAIStream(prompt: string, opts?: StreamingOptions) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = createClient();

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    setText('');
    try {
      const stream = client.stream(prompt, opts);
      for await (const chunk of stream) {
        setText(prev => prev + chunk);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [prompt]);

  useEffect(() => { run(); }, [run]);
  return { text, loading, error, retry: run };
}`}
      />
    </div>
  ),
};

/**
 * In context — code inside an agent message turn. The reply composes `Prose` with an inline
 * `ProseCode` fence (the prose-scoped sibling of `CodeBlock`), mirroring the doc page's
 * "In context" frame: copy + language label live in the block header, body scrolls without
 * clipping the thread.
 */
export const InContext: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* User prompt */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--ember-soft)',
            border: '1px solid rgba(255,107,53,0.22)',
            borderRadius: 12,
            borderEndEndRadius: 4,
            color: 'var(--fg)',
            fontSize: 'var(--text-base)',
            lineHeight: 1.55,
            maxWidth: '70%',
          }}
        >
          How do I inspect live traffic on identity-svc?
        </div>
      </div>
      {/* Agent reply */}
      <div style={{ display: 'flex', gap: 12 }}>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--ember-soft)',
            border: '1px solid rgba(255,107,53,0.22)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
          }}
        >
          <Icons.sparkle size={16} style={{ color: 'var(--ember)' }} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="t-mono-label" style={{ display: 'block', marginBottom: 8 }}>
            EIDOS PLATFORM AGENT
          </span>
          <Prose>
            <p>
              Based on the trace, p95 on <code>identity-svc</code> is 482 ms — above the 400 ms target.
              Run this to tail live traffic:
            </p>
            <ProseCode lang="bash">{`eidos trace --service identity-svc --tail`}</ProseCode>
            <p>
              You can narrow the window with <code>--last 5m</code> if you want only recent spans.
            </p>
          </Prose>
        </div>
      </div>
    </div>
  ),
};
