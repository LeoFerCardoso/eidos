'use client';

// Renders an icon from the DS core icon set (ES module — no window bridge).
import { Icons } from '@/ds/core';

export function DSIcon({ name, size }: { name: string; size?: number }) {
  const I = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[name];
  return I ? <I size={size} /> : null;
}
