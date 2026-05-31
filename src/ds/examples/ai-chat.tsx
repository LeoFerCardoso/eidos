'use client';
// Eidos IDP — AI Chat (empty / new-chat surface).
//
// The page the "Chat" rail item lands on. Centred ForgeMark hero +
// suggestion chips + the canonical <PromptInput/> with a <PromptBanner/>
// promo ribbon and a footer hint. Chat-history sidebar with "New chat"
// pinned active. Real navigation: clicking a chat in the sidebar routes
// to /example/ai-chat-active?chat=<id>, clicking Projects → ai-projects,
// Search chats → ai-chat-search.
import * as React from 'react';
import {
  Icons, ForgeMark,
  PromptInput, PromptBanner, Suggestion,
} from '@/ds/core';
import { ChatShell } from './chat-shell';

const STARTERS: { icon: string; label: string }[] = [
  { icon: 'gauge',    label: 'Audit p99 on the payments rail' },
  { icon: 'server',   label: 'Find services without scorecards' },
  { icon: 'pipeline', label: 'Why did the deploy-prod pipeline fail?' },
  { icon: 'incident', label: 'Draft an incident postmortem' },
];

const App = () => {
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('eidos-sonnet-4-6');
  const [bannerShown, setBannerShown] = React.useState(true);
  // Which starter is currently selected. A chip is "selected" when its label
  // is the prefix of the current composer text — so editing the prompt past
  // the starter (or clearing it) deselects the chip naturally.
  const selectedStarter = React.useMemo(
    () => STARTERS.find(s => text.startsWith(s.label))?.label || null,
    [text],
  );

  const pickStarter = (label: string) => {
    // If the same chip is clicked again, clear (toggle off). Otherwise pop
    // the label into the composer with a trailing space so the user can keep
    // typing their nuance right after it.
    if (selectedStarter === label) {
      setText('');
    } else {
      setText(label + ' ');
    }
  };

  return (
    <ChatShell side="new" crumbs={['Eidos', 'AI', 'New chat']}>
      <div className="aic-empty">
        <div className="aic-empty-hero">
          <div className="aic-empty-mark" aria-hidden="true">
            <ForgeMark size={56} color="currentColor" />
          </div>
          <h1 className="aic-empty-title">Hello, Leonardo</h1>
          <p className="aic-empty-sub">
            What can Eidos AI help you with today? Ask about a service, draft a
            runbook, or kick off an incident review.
          </p>
        </div>

        <div className="aic-empty-suggests">
          {STARTERS.map(s => {
            const I = (Icons as any)[s.icon] || Icons.sparkle;
            const isOn = selectedStarter === s.label;
            return (
              <Suggestion
                key={s.label}
                icon={<I size={12}/>}
                size="md"
                pressed={isOn}
                onClick={() => pickStarter(s.label)}
              >
                {s.label}
              </Suggestion>
            );
          })}
        </div>

        <div className="aic-empty-composer">
          <PromptInput
            status="ready"
            value={text}
            onChange={setText}
            onSubmit={() => setText('')}
            modelValue={model}
            onModelChange={setModel}
            elevated
            topBanner={bannerShown ? (
              <PromptBanner
                tone="promo"
                cta="Upgrade →"
                onDismiss={() => setBannerShown(false)}
              >
                Access premium models &amp; agents on Eidos Pro
              </PromptBanner>
            ) : undefined}
            actions={[
              { id: 'upload', icon: 'upload',   label: 'Upload images or files', description: 'PNG, JPG, PDF, logs · up to 20 MB' },
              { id: 'image',  icon: 'sparkle',  label: 'Generate image',         description: 'Describe a picture and the agent will draw it' },
              { id: 'search', icon: 'search',   label: 'Deep search',            description: 'Browse trusted sources for a longer answer' },
              { id: 'tools',  icon: 'terminal', label: 'Run a tool',             description: 'Pick a tool the agent should call (file, shell, web…)' },
            ]}
            footerHint={
              <>Eidos AI is grounded in your service catalog — double-check before acting on production.</>
            }
          />
        </div>
      </div>

      <style>{`
        /* Empty state — ONE centred group (mark · greeting · sub · chips ·
           composer · hint). Flex column with justify-content: center so the
           whole group sits at the vertical middle of the main area, no
           bottom-pinned composer / mid-page hero split. */
        .aic-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 32px 24px;
          min-block-size: 100%;
        }
        .aic-empty-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
        }
        .aic-empty-mark { color: var(--fg-faint); opacity: 0.95; }
        .aic-empty-title {
          font-size: 22px; font-weight: 600;
          color: var(--fg); margin: 4px 0 0;
          letter-spacing: -0.01em;
        }
        .aic-empty-sub {
          font-size: 14px; color: var(--fg-muted);
          margin: 0; max-inline-size: 52ch; line-height: 1.55;
        }
        .aic-empty-suggests {
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: center;
          max-inline-size: 720px;
        }
        .aic-empty-composer {
          inline-size: 100%;
          display: flex; justify-content: center;
        }
        .aic-empty-composer > .pi-shell { max-inline-size: 720px; }
      `}</style>
    </ChatShell>
  );
};

export default App;
