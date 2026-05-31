import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Reasoning, Message } from '@eidos/ui';

const TRACE_CONTENT = (
  <>
    <p>
      The user asks about fraud-engine incidents in the past 24 hours. I should first check the
      service health status, then query the incident log with an appropriate time window.
    </p>
    <p>
      Given the risk score of 74 and the KYC status of <em>approved</em>, the account is not
      under automatic hold. The two open incidents appear unrelated to this user.
    </p>
    <p>
      Conclusion: safe to proceed with the Pix transfer. I will surface the incident context
      as a note without blocking the flow.
    </p>
  </>
);

// Shimmer skeleton body — the canonical streaming placeholder the page renders
// while real tokens are still arriving (.rsn-skel > .ln, from ai.css / Skeleton).
const SkeletonBody = ({ widths }: { widths: string[] }) => (
  <div className="rsn-skel">
    {widths.map((w, i) => (
      <div className="ln" style={{ width: w }} key={i} />
    ))}
  </div>
);

const meta = {
  title: 'AI/Reasoning',
  component: Reasoning,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A collapsible thinking-trace block shown above the model answer. Auto-opens while ' +
          'streaming and auto-collapses when settled; the user toggle always wins.',
      },
    },
  },
  args: {
    streaming: false,
    duration: 3.2,
    defaultOpen: true,
  },
  argTypes: {
    streaming: { control: 'boolean' },
    duration: { control: 'number' },
    title: { control: 'text' },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Reasoning>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Settled trace, driven by args — click the header to expand/collapse (toggle is live). */
export const Default: Story = {
  render: (args) => <Reasoning {...args}>{TRACE_CONTENT}</Reasoning>,
};

/** Streaming — verb reads "Thinking", the block auto-opens, and the body shows the shimmer skeleton instead of half-tokens. */
export const Streaming: Story = {
  args: { streaming: true, duration: 1.4, defaultOpen: undefined },
  render: (args) => (
    <Reasoning {...args}>
      <SkeletonBody widths={['94%', '76%', '88%', '64%']} />
    </Reasoning>
  ),
};

/** Static settled state — duration frozen, panel manually held open for review (the page's "Static settled state"). */
export const StaticSettled: Story = {
  args: { streaming: false, duration: 2.4, defaultOpen: true },
  render: (args) => (
    <Reasoning {...args}>
      <p>
        Three candidates in the 0421 diff. Only one (<code>pool-size: 8 → 32</code>) sits on the
        code path of the p99 spike.
      </p>
      <p>
        <em>Conclusion:</em> revert the pool-size change first, keep the retry-budget bump.
      </p>
    </Reasoning>
  ),
};

/** Custom verb override — useful for specialised traces ("Risk analysis" instead of "Thought"). */
export const CustomTitle: Story = {
  args: { title: 'Risk analysis', duration: 2.8 },
  render: (args) => <Reasoning {...args}>{TRACE_CONTENT}</Reasoning>,
};

/** Collapsed by default — model settled without a long think; trace stays one click away. */
export const CollapsedByDefault: Story = {
  args: { defaultOpen: false, duration: 0.6 },
  render: (args) => <Reasoning {...args}>{TRACE_CONTENT}</Reasoning>,
};

/** Interactive lifecycle — auto-opens while streaming, then auto-collapses once settled (the page's StreamingDemo). */
export const StreamingToSettled: Story = {
  args: { defaultOpen: undefined },
  render: () => {
    const [streaming, setStreaming] = React.useState(true);
    const [duration, setDuration] = React.useState(0);

    // Tick the duration while streaming.
    React.useEffect(() => {
      if (!streaming) return;
      const start = performance.now() - duration * 1000;
      let raf: number;
      const tick = (now: number) => {
        setDuration((now - start) / 1000);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [streaming]); // eslint-disable-line react-hooks/exhaustive-deps

    // Cycle: stream ~5s, settle ~3s, repeat — so both states are observable.
    React.useEffect(() => {
      let on = streaming;
      const id = setInterval(
        () => {
          on = !on;
          setStreaming(on);
        },
        streaming ? 5500 : 3500,
      );
      return () => clearInterval(id);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <Reasoning streaming={streaming} duration={duration}>
        {streaming ? (
          <SkeletonBody widths={['94%', '76%', '88%', '64%']} />
        ) : (
          <>
            <p>
              The p99 spike on <code>identity-svc</code> overlaps with the 0421 release window.
              <em> Look at the deploy diff first.</em>
            </p>
            <p>
              Only the connection-pool change (8 → 32) touches the code path the spike sits on.{' '}
              <em>Conclusion:</em> recommend reverting the pool-size change first.
            </p>
          </>
        )}
      </Reasoning>
    );
  },
};

/** In context — reasoning placed before the answer inside an assistant Message, streaming then settling. */
export const InContext: Story = {
  args: { defaultOpen: undefined },
  render: () => {
    const [streaming, setStreaming] = React.useState(true);
    const [duration, setDuration] = React.useState(0);

    React.useEffect(() => {
      if (!streaming) return;
      const start = performance.now();
      let raf: number;
      const tick = (now: number) => {
        setDuration((now - start) / 1000);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [streaming]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
      const id = setTimeout(() => setStreaming(false), 4200);
      return () => clearTimeout(id);
    }, []);

    return (
      <div style={{ maxWidth: 640 }}>
        <Message from="assistant" meta={<>Forge AI · just now</>} streaming={streaming}>
          <Reasoning streaming={streaming} duration={duration}>
            {streaming ? (
              <SkeletonBody widths={['90%', '72%', '84%']} />
            ) : (
              <p>
                The p99 spike sits on <code>identity-svc</code> — only the pool-size change in 0421
                touches that path. <em>Recommend reverting it first.</em>
              </p>
            )}
          </Reasoning>
          {!streaming && (
            <p>
              Revert the <code>pool-size</code> change in 0421 first — that's the only candidate on
              the spike's code path. Keep the retry-budget bump until the spike clears.
            </p>
          )}
        </Message>
      </div>
    );
  },
};

/** RTL — dir="rtl" mirrors the icon to the start edge; chevron and duration follow logical flow. */
export const RTL: Story = {
  args: { streaming: false, duration: 3.7, defaultOpen: true, title: 'فكر' },
  render: (args) => (
    <div dir="rtl" style={{ maxWidth: 460 }}>
      <Reasoning {...args}>
        <p>
          ارتفاع p99 يقع على <code>identity-svc</code> — التغيير الوحيد في 0421 الذي يمسه هو زيادة
          حجم تجمع الاتصالات.
        </p>
      </Reasoning>
    </div>
  ),
};
