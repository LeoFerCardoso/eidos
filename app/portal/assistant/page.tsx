'use client';
// Forge AI — the copilot surface (full page). A scripted, high-fidelity mockup
// of the agentic assistant; the conversation itself lives in <ForgeAIChat/> so
// the exact same thread renders in the topbar slide-over drawer. The real AI
// SDK wiring lives in app/ai-chat and turns on once VERCEL_AI_GATEWAY_API_KEY
// is set.
import * as React from 'react';
import { Icons } from '@/ds/core';
import { FPageHeader } from '@/portal/shell/portal-shell';
import { ForgeAIChat } from '@/portal/shell/forge-ai-chat';

export default function ForgeAIPage() {
  return (
    <>
      <FPageHeader
        eyebrow="Copilot"
        leading={<Icons.sparkle size={22} style={{ color: 'var(--ember)' } as React.CSSProperties} />}
        title="Forge AI"
        subtitle="Reads your estate · services, deploys, incidents and SLOs · and acts on it."
      />

      <div style={{ maxWidth: 800, marginInline: 'auto', width: '100%' }}>
        <ForgeAIChat />
      </div>
    </>
  );
}
