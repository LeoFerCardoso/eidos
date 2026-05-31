import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { TagInput } from '@forge/ui';

const meta = {
  title: 'Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Free-entry list field. Type a value and press Enter or comma to commit it as a ' +
          'chip; Backspace on an empty caret removes the last chip. Paste splits on comma and ' +
          'newline. Supports optional maxTags, duplicate prevention, and a validate predicate. ' +
          'Controlled (value + onValueChange) and uncontrolled (defaultValue) modes.',
      },
    },
  },
  args: {
    placeholder: 'Add tag…',
    size: 'md',
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    maxTags: { control: 'number' },
    placeholder: { control: 'text' },
    help: { control: 'text' },
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default (controlled wrapper) ─────────────────────────────────────────────

/** Basic free-entry. Enter or comma commits; Backspace removes the last tag.
 *  Starts with two tags so clicking × immediately demonstrates live removal. */
export const Default: Story = {
  render: (args) => {
    const INITIAL = ['identity', 'auth'];
    const [tags, setTags] = React.useState<string[]>(INITIAL);
    return (
      <div style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label
          className="in-label"
          htmlFor="story-default-input"
          style={{ display: 'block' }}
        >
          Topics
        </label>
        <TagInput
          {...args}
          id="story-default-input"
          value={tags}
          onValueChange={setTags}
          help="Press Enter or comma to add. Backspace removes the last tag."
        />
      </div>
    );
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

/** Three sizes — sm / md (default) / lg — to match the surrounding form chrome. */
export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = React.useState<string[]>(['react', 'vue']);
    const [md, setMd] = React.useState<string[]>(['react', 'vue']);
    const [lg, setLg] = React.useState<string[]>(['react', 'vue']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
        <div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBottom: 6 }}>
            Small (28 px)
          </div>
          <TagInput size="sm" value={sm} onValueChange={setSm} placeholder="Add tag…" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBottom: 6 }}>
            Default (36 px)
          </div>
          <TagInput size="md" value={md} onValueChange={setMd} placeholder="Add tag…" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBottom: 6 }}>
            Large (44 px)
          </div>
          <TagInput size="lg" value={lg} onValueChange={setLg} placeholder="Add tag…" />
        </div>
      </div>
    );
  },
};

// ── With validation ───────────────────────────────────────────────────────────

/** Commit-time validator — rejects malformed entries and caps the total. */
export const WithValidation: Story = {
  render: () => {
    const [emails, setEmails] = React.useState<string[]>(['lead@forge.io']);
    return (
      <div style={{ maxWidth: 480 }}>
        <label
          className="in-label"
          htmlFor="story-val-input"
          style={{ display: 'block', marginBottom: 6 }}
        >
          Recipients{' '}
          <span className="opt">(max 5 emails)</span>
        </label>
        <TagInput
          id="story-val-input"
          value={emails}
          onValueChange={setEmails}
          placeholder="Add an email…"
          maxTags={5}
          validate={(t) =>
            /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(t)
              ? null
              : 'Not a valid email address'
          }
        />
      </div>
    );
  },
};

// ── Invalid entry (inline error at rest) ────────────────────────────────────────

/** The inline error / aria-invalid path. On mount an invalid value is committed
 *  through the field so the `is-invalid` ring + `<span class="in-error">` render
 *  at rest (mirrors the doc page's commit-time validation rejection). */
export const InvalidEntry: Story = {
  render: () => {
    const [emails, setEmails] = React.useState<string[]>(['lead@forge.io']);
    const wrapRef = React.useRef<HTMLDivElement>(null);
    // Drive a real commit of an invalid value so the component's internal error
    // state turns on — no props can seed `error` directly.
    React.useEffect(() => {
      const input = wrapRef.current?.querySelector<HTMLInputElement>('input.in-control');
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      setter?.call(input, 'not-an-email');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
    }, []);
    return (
      <div ref={wrapRef} style={{ maxWidth: 480 }}>
        <label
          className="in-label"
          htmlFor="story-invalid-input"
          style={{ display: 'block', marginBottom: 6 }}
        >
          Recipients{' '}
          <span className="opt">(max 5 emails)</span>
        </label>
        <TagInput
          id="story-invalid-input"
          value={emails}
          onValueChange={setEmails}
          placeholder="Add an email…"
          maxTags={5}
          validate={(t) =>
            /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(t)
              ? null
              : 'Not a valid email address'
          }
        />
      </div>
    );
  },
};

// ── At max (cap reached) ────────────────────────────────────────────────────────

/** maxTags cap reached (3 / 3) — the counter reads its ceiling and the input is
 *  disabled until a chip is removed. Mirrors the doc page's "At max" state. */
export const AtMax: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>(['a', 'b', 'c']);
    return (
      <div style={{ maxWidth: 480 }}>
        <label
          className="in-label"
          htmlFor="story-atmax-input"
          style={{ display: 'block', marginBottom: 6 }}
        >
          Labels{' '}
          <span className="opt">(max 3)</span>
        </label>
        <TagInput
          id="story-atmax-input"
          value={tags}
          onValueChange={setTags}
          maxTags={3}
          placeholder="No more tags"
        />
      </div>
    );
  },
};

// ── States ────────────────────────────────────────────────────────────────────

/** Default / disabled / readonly states. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
      <div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBottom: 6 }}>
          Default
        </div>
        <TagInput defaultValue={['react']} placeholder="Add tag…" />
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBottom: 6 }}>
          Disabled
        </div>
        <TagInput defaultValue={['locked', 'readonly']} disabled />
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginBottom: 6 }}>
          Read-only
        </div>
        <TagInput defaultValue={['prod-east-1', 'prod-west-2', 'prod-eu-1']} readOnly />
      </div>
    </div>
  ),
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/** Chips and the caret flow right-to-left; remove buttons stay on the trailing edge. */
export const RTL: Story = {
  render: () => {
    const [tags, setTags] = React.useState<string[]>(['الهوية', 'المصادقة', 'الجلسات']);
    return (
      <div dir="rtl" style={{ maxWidth: 480 }}>
        <label
          className="in-label"
          htmlFor="story-rtl-input"
          style={{ display: 'block', marginBottom: 6 }}
        >
          المواضيع (Topics)
        </label>
        <TagInput
          id="story-rtl-input"
          value={tags}
          onValueChange={setTags}
          placeholder="أضف موضوعًا…"
        />
      </div>
    );
  },
};

// ── In context ────────────────────────────────────────────────────────────────

/** Tag Input inside a realistic pipeline-filter form. */
export const InContext: Story = {
  render: () => {
    const [teams, setTeams] = React.useState<string[]>(['platform', 'identity']);
    const [envs, setEnvs] = React.useState<string[]>(['prod-east-1']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
        <div style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface)' }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 'var(--text-body)' }}>
            Pipeline filter
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="in-label" htmlFor="ctx-teams" style={{ display: 'block', marginBottom: 6 }}>
                Teams
              </label>
              <TagInput
                id="ctx-teams"
                value={teams}
                onValueChange={setTeams}
                placeholder="Add team…"
                help="Filter runs by owning team."
              />
            </div>
            <div>
              <label className="in-label" htmlFor="ctx-envs" style={{ display: 'block', marginBottom: 6 }}>
                Environments
              </label>
              <TagInput
                id="ctx-envs"
                value={envs}
                onValueChange={setEnvs}
                placeholder="Add environment…"
                maxTags={4}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
