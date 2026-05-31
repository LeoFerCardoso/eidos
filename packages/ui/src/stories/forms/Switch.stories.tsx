import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@eidos/ui';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A binary setting that takes effect immediately — a native checkbox with `role="switch"` and the Eidos toggle visual. Use for instant on/off, not for form submission choices (use Checkbox there).' } },
  },
  args: { label: 'Auto-deploy on merge', size: 'md' },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — driven by args; an on/off setting that writes through immediately. */
export const Default: Story = { args: { defaultChecked: true } };

/** With a description (stacked block layout) — the consequence of the setting in present tense. */
export const WithDescription: Story = {
  args: { label: 'Require signed commits', description: 'Reject pushes whose commits are not GPG-signed.', defaultChecked: true },
};

/** Sizes — 32×18 / 40×22 / 48×26 (sm · md · lg). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => <Switch key={s} size={s} label={`Size ${s}`} defaultChecked />)}
    </div>
  ),
};

/** States — off · on · disabled (off & on). */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
      <Switch label="Disabled, off" disabled />
      <Switch label="Disabled, on" defaultChecked disabled />
    </div>
  ),
};

/** Disabled (on + off) — non-interactive, dimmed track. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Switch label="Disabled, on" defaultChecked disabled />
      <Switch label="Disabled, off" disabled />
    </div>
  ),
};

/**
 * Invalid — danger-tinted track ring + danger label, with a `.fc-error` helper line
 * below wired through `aria-describedby` so screen readers announce the missing precondition.
 */
export const Invalid: Story = {
  render: () => {
    const errorId = 'switch-sms-error';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 480 }}>
        <Switch
          label="Send SMS for critical alerts"
          description="Critical incident pages will be sent here."
          defaultChecked
          invalid
          aria-describedby={errorId}
        />
        <span id={errorId} className="fc-error" style={{ marginInlineStart: 50 }}>
          Phone number is missing — add one in profile to enable SMS.
        </span>
      </div>
    );
  },
};

/** Controlled — flips live; uses the documented `onCheckedChange(checked)` convenience handler. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [on, setOn] = React.useState(true);
      return (
        <Switch
          label={`Auto-deploy is ${on ? 'on' : 'off'}`}
          checked={on}
          onCheckedChange={setOn}
        />
      );
    }
    return <Demo />;
  },
};

/**
 * In context — a settings list: label/desc on the leading edge, the Switch on the
 * trailing edge of each `.fc-row`, every flip writing through immediately.
 */
export const InContext: Story = {
  render: () => {
    function SettingsList() {
      const [auto, setAuto] = React.useState(true);
      const [slack, setSlack] = React.useState(false);
      const [smoke, setSmoke] = React.useState(true);
      const [canary, setCanary] = React.useState(true);
      const rows: Array<{ title: string; desc: string; checked: boolean; set: (c: boolean) => void }> = [
        { title: 'Auto-deploy on merge', desc: 'Push to main triggers a deploy as soon as CI is green.', checked: auto, set: setAuto },
        { title: 'Notify Slack on failure', desc: 'Posts to #deploys when a stage fails or rolls back.', checked: slack, set: setSlack },
        { title: 'Run smoke tests', desc: '≈ 30 seconds. Blocks promotion to staging on failure.', checked: smoke, set: setSmoke },
        { title: 'Canary first', desc: 'Roll out to 10% of pods, soak 5 minutes, then promote.', checked: canary, set: setCanary },
      ];
      return (
        <div style={{ width: '100%', maxWidth: 560 }}>
          {rows.map((r) => {
            const id = `settings-${r.title.replace(/\s+/g, '-').toLowerCase()}`;
            return (
              <div key={r.title} className="fc-row">
                <label htmlFor={id} className="fc-text" style={{ cursor: 'pointer', flex: 1 }}>
                  <span className="fc-label">{r.title}</span>
                  <span className="fc-desc" style={{ marginTop: 4 }}>{r.desc}</span>
                </label>
                <Switch id={id} checked={r.checked} onCheckedChange={r.set} />
              </div>
            );
          })}
        </div>
      );
    }
    return <SettingsList />;
  },
};
