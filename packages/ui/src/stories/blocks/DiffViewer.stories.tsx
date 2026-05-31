import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiffViewer, Badge } from '@eidos/ui';

// Realistic diff fixture — pix-router idempotency key PR
const HUNKS_PIX = [
  {
    header: '@@ -18,6 +18,14 @@ export class PaymentService {',
    lines: [
      { type: 'ctx', old: 18, new: 18, code: '  async processPayment(dto: PaymentDto): Promise<Payment> {' },
      { type: 'ctx', old: 19, new: 19, code: '    const validated = await this.validator.validate(dto);' },
      { type: 'ctx', old: 20, new: 20, code: '    if (!validated) throw new BadRequestException();' },
      { type: 'add', old: null, new: 21, code: '' },
      { type: 'add', old: null, new: 22, code: '    const idempotencyKey = dto.idempotencyKey;' },
      { type: 'add', old: null, new: 23, code: '    const cached = await this.cache.get(idempotencyKey);' },
      { type: 'add', old: null, new: 24, code: '    if (cached) {' },
      { type: 'add', old: null, new: 25, code: '      this.logger.debug(`Idempotency hit: ${idempotencyKey}`);' },
      { type: 'add', old: null, new: 26, code: '      return cached;' },
      { type: 'add', old: null, new: 27, code: '    }' },
      { type: 'add', old: null, new: 28, code: '' },
      { type: 'ctx', old: 21, new: 29, code: '    const payment = await this.ledger.create(validated);' },
      { type: 'ctx', old: 22, new: 30, code: '    await this.events.emit("payment.created", payment);' },
      { type: 'ctx', old: 23, new: 31, code: '    return payment;' },
    ],
  },
  {
    header: '@@ -42,7 +50,9 @@ export class PaymentService {',
    lines: [
      { type: 'ctx', old: 42, new: 50, code: '  }' },
      { type: 'ctx', old: 43, new: 51, code: '' },
      { type: 'ctx', old: 44, new: 52, code: '  async retryPayment(id: string): Promise<Payment> {' },
      { type: 'del', old: 45, new: null, code: '    return this.ledger.retry(id);' },
      { type: 'add', old: null, new: 53, code: '    const key = `retry:${id}`;' },
      { type: 'add', old: null, new: 54, code: '    await this.cache.set(key, id, { ttl: 300 });' },
      { type: 'add', old: null, new: 55, code: '    return this.ledger.retry(id);' },
      { type: 'ctx', old: 46, new: 56, code: '  }' },
    ],
  },
];

const DIFF_FILES = [
  {
    path: 'src/payment/payment.service.ts',
    additions: 10,
    deletions: 1,
    hunks: HUNKS_PIX,
  },
  {
    path: 'src/payment/payment.dto.ts',
    additions: 3,
    deletions: 0,
    hunks: [
      {
        header: '@@ -8,4 +8,7 @@ export class PaymentDto {',
        lines: [
          { type: 'ctx', old: 8, new: 8, code: '  @IsString()' },
          { type: 'ctx', old: 9, new: 9, code: '  description: string;' },
          { type: 'ctx', old: 10, new: 10, code: '' },
          { type: 'add', old: null, new: 11, code: '  @IsUUID()' },
          { type: 'add', old: null, new: 12, code: '  @IsOptional()' },
          { type: 'add', old: null, new: 13, code: '  idempotencyKey?: string;' },
        ],
      },
    ],
  },
];

const meta = {
  title: 'Elements/DiffViewer',
  component: DiffViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A code diff renderer in the style of Linear / Stripe: per-file headers with +/− counts, ' +
          'hunk anchors, and color-coded add/del/context lines built from pre-computed hunk arrays. ' +
          'Two variants — `unified` (single-column) and `split` (side-by-side, derived by pairing ' +
          'del/add runs). Pass `files` for multi-file views or `hunks` as a single-file shorthand, ' +
          'and `wrap` to soft-wrap long lines instead of scrolling horizontally.',
      },
    },
  },
  args: {
    files: DIFF_FILES,
    variant: 'unified',
    wrap: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['unified', 'split'] },
    wrap: { control: 'boolean' },
  },
} satisfies Meta<typeof DiffViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Unified diff — single-column with +/− markers. */
export const Default: Story = {};

/** Side-by-side split diff. */
export const Split: Story = {
  args: { variant: 'split' },
};

/** Single-file shorthand via the `hunks` prop. */
export const SingleFile: Story = {
  args: {
    files: undefined,
    hunks: HUNKS_PIX,
    variant: 'unified',
  },
};

/** Wrapped lines — no horizontal scroll. */
export const Wrapped: Story = {
  args: { wrap: true },
};

/** Multi-file PR diff as it appears in the risk-review panel — composed with sibling Badge for the change counts. */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 820 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>
          PR #7421 · pix-router
        </span>
        <Badge tone="success" size="sm">+10</Badge>
        <Badge tone="danger" size="sm">−1</Badge>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)' }}>2 files</span>
      </div>
      <DiffViewer files={DIFF_FILES} variant="unified" />
    </div>
  ),
};
