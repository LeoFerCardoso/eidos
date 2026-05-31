import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icons } from '@eidos/ui';

// Icons is a plain record — each value is a standalone SVG component that
// accepts { size?, color?, strokeWidth? }. There is no single root component
// to bind, so we declare meta without a component binding and type via the
// record shape.
const meta = {
  title: 'Icons/Icons',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Eidos icon primitives — Lucide-style 24×24 stroke glyphs shared across ' +
          'every Eidos DS surface (core, charts, AI, IDP, DevOps). Each key in the ' +
          '`Icons` map is a React component accepting `size` (default 16), `color` ' +
          '(default `currentColor`), and `strokeWidth` (default 1.5). Use the ' +
          'semantic groupings — Navigation, Editing, DevOps, Agent / AI — to pick ' +
          'the right glyph for a given affordance rather than reaching for a generic shape.',
      },
    },
  },
} satisfies Meta<typeof Icons>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Icon groups ─────────────────────────────────────────────────────────────
// Curated subsets matching real IDP/DevEx domain surfaces.

const NAV_ICONS: (keyof typeof Icons)[] = [
  'home', 'catalog', 'rocket', 'gauge', 'trending', 'book', 'clipboard',
  'layers', 'plug', 'chevronRight', 'chevronLeft', 'chevronDown', 'chevronUp',
  'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown',
];

const EDITING_ICONS: (keyof typeof Icons)[] = [
  'edit', 'trash', 'copy', 'link', 'externalLink', 'share', 'download',
  'upload', 'paperclip', 'file', 'doc', 'folder',
];

const DEVOPS_ICONS: (keyof typeof Icons)[] = [
  'deploy', 'rollback', 'pipeline', 'merge', 'commit', 'tag', 'gate',
  'branch', 'gitFork', 'gitPullRequest', 'ring', 'container', 'server',
  'database', 'terminal', 'cloud', 'package', 'workflow',
];

const AGENT_ICONS: (keyof typeof Icons)[] = [
  'agent', 'mcpServer', 'toolCall', 'prompt', 'vector', 'bot', 'cpu',
  'zap', 'sparkle', 'fn', 'queue', 'region', 'key', 'network',
];

const GOVERNANCE_ICONS: (keyof typeof Icons)[] = [
  'incident', 'score', 'compliance', 'auditLog', 'runbook', 'slo', 'flag',
  'shield', 'lock', 'lockKey', 'target', 'pulse', 'activity',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function IconGrid({
  keys,
  size = 20,
  color,
  strokeWidth,
}: {
  keys: (keyof typeof Icons)[];
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
        gap: 8,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {keys.map((name) => {
        const IconComponent = Icons[name];
        return (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '10px 6px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--fg)',
            }}
          >
            <IconComponent size={size} color={color} strokeWidth={strokeWidth} />
            <span
              style={{
                fontSize: 9,
                color: 'var(--fg-muted)',
                textAlign: 'center',
                wordBreak: 'break-all',
                lineHeight: 1.3,
              }}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Stories ─────────────────────────────────────────────────────────────────

/**
 * Default — the core navigation and UI glyphs at 20px with default stroke.
 * These appear in sidebars, breadcrumbs, and tab bars across all Eidos surfaces.
 */
export const Default: Story = {
  render: () => <IconGrid keys={NAV_ICONS} />,
};

/**
 * Sizes — every icon accepts a numeric `size` prop. At 16px glyphs render
 * inline with body text; at 24px they anchor action buttons; at 32px they
 * work as section headers and empty-state illustrations.
 */
export const Sizes: Story = {
  render: () => {
    const SAMPLE: (keyof typeof Icons)[] = [
      'deploy', 'agent', 'incident', 'pipeline', 'toolCall',
    ];
    const sizes = [12, 16, 20, 24, 32] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {sizes.map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--fg-muted)',
                width: 28,
                flexShrink: 0,
              }}
            >
              {s}px
            </span>
            {SAMPLE.map((name) => {
              const IconComponent = Icons[name];
              return (
                <div key={name} style={{ color: 'var(--fg)', display: 'flex', alignItems: 'center' }}>
                  <IconComponent size={s} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Variants — stroke weight and color modes that cover the three Eidos
 * contexts: default UI (1.5), editorial/thin (1.0), and accent-highlighted
 * (ember). All icons share the same prop surface.
 */
export const Variants: Story = {
  render: () => {
    const SAMPLE: (keyof typeof Icons)[] = [
      'deploy', 'agent', 'incident', 'pipeline', 'server',
      'toolCall', 'commit', 'compliance', 'vector', 'workflow',
    ];

    const variants: { label: string; color?: string; strokeWidth?: number; bg?: string; fg?: string }[] = [
      { label: 'Default (1.5sw)', strokeWidth: 1.5 },
      { label: 'Thin (1.0sw)', strokeWidth: 1.0 },
      { label: 'Bold (2.0sw)', strokeWidth: 2.0 },
      { label: 'Accent (ember)', color: 'var(--accent)', strokeWidth: 1.5 },
      { label: 'Muted', color: 'var(--fg-muted)', strokeWidth: 1.5 },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {variants.map(({ label, color, strokeWidth, bg, fg }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--fg-muted)',
              }}
            >
              {label}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: bg ?? 'var(--surface)',
                color: fg ?? color ?? 'var(--fg)',
              }}
            >
              {SAMPLE.map((name) => {
                const IconComponent = Icons[name];
                return (
                  <IconComponent
                    key={name}
                    size={20}
                    color={color}
                    strokeWidth={strokeWidth}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * DevOps — glyphs used on deploy dashboards, pipeline status feeds, and
 * release management surfaces. Covers the full artifact lifecycle.
 */
export const DevOps: Story = {
  render: () => <IconGrid keys={DEVOPS_ICONS} />,
};

/**
 * Agent and AI — glyphs for agent orchestration, MCP server tiles, tool-call
 * traces, and embedding/vector surfaces in the AI platform.
 */
export const AgentAI: Story = {
  render: () => <IconGrid keys={AGENT_ICONS} />,
};

/**
 * Governance — incident response, SLO tracking, compliance audits, and
 * runbook authoring. All share the same 24×24 stroke vocabulary.
 */
export const Governance: Story = {
  render: () => <IconGrid keys={GOVERNANCE_ICONS} />,
};

/**
 * Editing — file management, clipboard, and content-manipulation glyphs
 * used in editors, command palettes, and context menus.
 */
export const Editing: Story = {
  render: () => <IconGrid keys={EDITING_ICONS} />,
};

/**
 * On colored surfaces — contrast rule: any icon on a non-default background
 * must carry an explicitly contrasting color. On ember/accent fills use dark
 * ink (`var(--bg)`). On dark tiles use `var(--fg)` or light tokens. Never
 * rely on inheritance when the surface color changes.
 */
export const OnColoredSurfaces: Story = {
  render: () => {
    const Icon = Icons.deploy;
    const surfaces: { label: string; bg: string; iconColor: string }[] = [
      { label: 'default surface',   bg: 'var(--surface)',  iconColor: 'var(--fg)' },
      { label: 'ember / accent',    bg: 'var(--accent)',   iconColor: 'var(--bg)' },
      { label: 'dark ink',          bg: '#08090A',         iconColor: 'var(--fg)' },
      { label: 'success fill',      bg: 'var(--green)',    iconColor: 'var(--bg)' },
      { label: 'warning fill',      bg: 'var(--yellow)',   iconColor: 'var(--bg)' },
      { label: 'critical fill',     bg: 'var(--red)',      iconColor: 'var(--bg)' },
    ];
    return (
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {surfaces.map(({ label, bg, iconColor }) => (
          <div
            key={label}
            style={{
              background: bg,
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              minWidth: 96,
            }}
          >
            <Icon size={24} color={iconColor} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: iconColor,
                textAlign: 'center',
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  },
};
