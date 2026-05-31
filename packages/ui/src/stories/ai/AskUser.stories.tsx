import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AskUser } from '@eidos/ui';
import type { AskQuestion, AskAnswer } from '@eidos/ui';

const ONBOARDING_QUESTIONS: AskQuestion[] = [
  {
    id: 'role',
    title: 'What is your primary engineering role?',
    header: 'Role',
    options: [
      { id: 'backend', title: 'Backend engineer', description: 'Services, APIs, data stores' },
      { id: 'frontend', title: 'Frontend engineer', description: 'Web, design systems, UX' },
      { id: 'platform', title: 'Platform / SRE', description: 'Infrastructure, reliability, CI/CD' },
      { id: 'data', title: 'Data / ML engineer', description: 'Pipelines, models, analytics' },
      { id: 'lead', title: 'Tech lead / EM', description: 'Team leadership, architecture' },
    ],
  },
  {
    id: 'tribe',
    title: 'Which tribe do you work in?',
    header: 'Team',
    options: [
      { id: 'identity', title: 'Identity' },
      { id: 'pix', title: 'Pix' },
      { id: 'risk', title: 'Risk' },
      { id: 'fraud', title: 'Fraud' },
      { id: 'open-finance', title: 'Open Finance' },
      { id: 'onboarding', title: 'Onboarding' },
      { id: 'datalab', title: 'DataLab' },
    ],
    skippable: true,
    allowOther: true,
    otherPlaceholder: 'Another tribe…',
  },
  {
    id: 'goals',
    title: 'What do you want Eidos to help with most?',
    header: 'Goals',
    multiSelect: true,
    options: [
      { id: 'quality', title: 'Improve code quality' },
      { id: 'speed', title: 'Ship faster' },
      { id: 'incidents', title: 'Reduce incidents' },
      { id: 'ai', title: 'Adopt AI tooling' },
      { id: 'docs', title: 'Better documentation' },
    ],
  },
];

const SINGLE_QUESTION: AskQuestion[] = [ONBOARDING_QUESTIONS[0]];

const meta = {
  title: 'AI/AskUser',
  component: AskUser,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A stepped single-select / multi-select questionnaire the agent uses to gather context ' +
          'before proceeding. Single-select auto-advances with a brief beat; multi-select and ' +
          'allowOther show an explicit Continue button. Full keyboard nav included.',
      },
    },
  },
  args: {
    questions: SINGLE_QUESTION,
    advanceDelayMs: 180,
  },
  argTypes: {
    advanceDelayMs: { control: 'number' },
    skipLabel: { control: 'text' },
    continueLabel: { control: 'text' },
    finishLabel: { control: 'text' },
    backLabel: { control: 'text' },
  },
} satisfies Meta<typeof AskUser>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single question, single-select, auto-advances on click. */
export const Default: Story = {};

/** Multi-step flow — 3 questions with back nav and a progress bar. */
export const MultiStep: Story = {
  args: { questions: ONBOARDING_QUESTIONS },
};

/** Multi-select question — requires explicit Continue. */
export const MultiSelect: Story = {
  args: { questions: [ONBOARDING_QUESTIONS[2]] },
};

/** Skippable with an "Other" free-text option. */
export const SkippableWithOther: Story = {
  args: { questions: [ONBOARDING_QUESTIONS[1]] },
};

/** Completion summary — pass an `onComplete` that captures answers and logs them. */
export const WithCompletion: Story = {
  render: () => {
    const [answers, setAnswers] = React.useState<AskAnswer[] | null>(null);
    return (
      <div style={{ maxWidth: 560 }}>
        <AskUser
          questions={ONBOARDING_QUESTIONS}
          onComplete={(a) => setAnswers(a)}
        />
        {answers && (
          <pre style={{ marginTop: 16, fontSize: 12, color: 'var(--fg-muted)' }}>
            {JSON.stringify(answers, null, 2)}
          </pre>
        )}
      </div>
    );
  },
};

/** Inline layout variant for compact option rows. */
export const InlineLayout: Story = {
  args: {
    questions: [{
      id: 'env',
      title: 'Which environment do you want to inspect?',
      header: 'Environment',
      layout: 'inline',
      options: [
        { id: 'prod', title: 'Production', description: 'Live traffic' },
        { id: 'staging', title: 'Staging', description: 'Pre-release' },
        { id: 'dev', title: 'Development', description: 'Local + CI' },
      ],
    }],
  },
};
