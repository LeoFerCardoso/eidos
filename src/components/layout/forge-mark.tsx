'use client';

// The Forge brand glyph, imported straight from the DS core (ES module — no
// window bridge). `color` paints the solid mark (pass a dark ink when the tile
// background is ember so the flame stays legible).
import { ForgeMark as CoreForgeMark } from '@/ds/core';

export function ForgeMark(props: { size?: number; glow?: boolean; variant?: string; color?: string }) {
  return <CoreForgeMark {...props} />;
}
