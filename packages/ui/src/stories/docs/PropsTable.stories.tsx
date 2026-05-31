import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropsTable } from '@eidos/ui';

// Realistic prop rows for a Button component.
const BUTTON_ROWS = [
  { prop: 'variant',   type: "'primary' | 'ghost' | 'danger'", default: "'primary'", required: false, description: 'Visual style of the button.' },
  { prop: 'size',      type: "'sm' | 'md' | 'lg'",             default: "'md'",       required: false, description: 'Controls padding and font size.' },
  { prop: 'disabled',  type: 'boolean',                         default: 'false',      required: false, description: 'Disables pointer events and lowers opacity.' },
  { prop: 'loading',   type: 'boolean',                         default: 'false',      required: false, description: 'Shows a spinner and disables the button.' },
  { prop: 'onClick',   type: '(e: MouseEvent) => void',         default: undefined,    required: false, description: 'Click handler forwarded to the `<button>` element.' },
  { prop: 'children',  type: 'React.ReactNode',                 default: undefined,    required: true,  description: 'Button label or icon+label pair.' },
  { prop: 'className', type: 'string',                          default: undefined,    required: false, description: 'Additional class names merged onto the root element.' },
];

// A minimal 3-row table.
const SHORT_ROWS = [
  { prop: 'tone',  type: "'up' | 'degraded' | 'down'", default: "'up'", required: false, description: 'Status tone driving the dot color.' },
  { prop: 'size',  type: "'sm' | 'md' | 'lg'",         default: "'md'", required: false, description: 'Diameter preset.' },
  { prop: 'pulse', type: 'boolean',                     default: 'false', required: false, description: 'Animate a soft pulse for live/at-risk states.' },
];

const meta = {
  title: 'Docs/PropsTable',
  component: PropsTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The API reference table used at the bottom of every component docs page. ' +
          'Rows declare prop name, type, default, and description; required props get an asterisk. ' +
          'Prop / type / default cells render as inline code with Forge\'s semantic color system.',
      },
    },
  },
  args: {
    label: 'props',
    rows: BUTTON_ROWS,
  },
  argTypes: {
    label: { control: 'text', description: 'Heading shown in the frame bar — defaults to "props".' },
  },
} satisfies Meta<typeof PropsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full Button API table — seven props including a required one. */
export const Default: Story = {};

/** Short 3-row table — for a simple component like StatusDot. */
export const Compact: Story = {
  args: { label: 'StatusDot props', rows: SHORT_ROWS },
};

/** Single required prop — verifies the asterisk renders correctly. */
export const RequiredOnly: Story = {
  args: {
    label: 'required prop',
    rows: [
      {
        prop: 'children',
        type: 'React.ReactNode',
        default: undefined,
        required: true,
        description: 'Content to render inside the component.',
      },
    ],
  },
};
