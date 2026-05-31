'use client';
import * as React from 'react';
import { Icons } from '@/ds/core';
import { AIPromptInput, AIShell } from './ai-shell';
// Eidos IDP — AI Module · Chat thread (animated).
//
// Simulated chat: turns arrive on a timer with a streaming-caret on
// assistant messages while their text fills in. Each user/assistant
// turn is composed from the shared .ai-bubble-* primitives. Auto-scroll
// snaps to the latest turn while the user is at-bottom.

  

  // Script of turns. `stream: true` makes the assistant turn type its body
  // character-by-character; otherwise the bubble fades in whole.
  const SCRIPT = [
    { id: 1, from: 'user',      body: 'Hey Spectrum, I have a question for you.' },
    { id: 2, from: 'assistant', body: "Of course, I'm listening, how can I help you?", stream: true, actions: true },
    { id: 3, from: 'user',      attach: 'image', body: "What's the difference between serif and sans-serif fonts?" },
    { id: 4, from: 'assistant', body: 'Serif fonts have small strokes at the end of their letters (think Times New Roman); sans-serif fonts are clean and modern (think Arial). Serif feels traditional and is great for long-form print, while sans-serif feels modern and is easier to read on screens.', stream: true, actions: true },
    { id: 5, from: 'user',      attach: 'file', file: { name: 'license-agreement.pdf', kind: 'PDF' } },
    { id: 6, from: 'user',      body: 'Could you walk me through this contract and flag anything unusual?' },
  ];

  // Reveal a single turn at a time. Assistant streaming text typewriter-style.
  const App = () => {
    const [visible, setVisible] = React.useState(1);
    const [typed,   setTyped]   = React.useState({});
    const threadRef = React.useRef(null);

    // Reveal next turn every ~1.8s (longer if previous was a long stream).
    React.useEffect(() => {
      if (visible >= SCRIPT.length) return;
      const current = SCRIPT[visible - 1];
      const delay = current && current.stream
        ? Math.min(2600, 800 + (current.body || '').length * 18)
        : 1200;
      const t = setTimeout(() => setVisible(v => Math.min(v + 1, SCRIPT.length)), delay);
      return () => clearTimeout(t);
    }, [visible]);

    // Stream-type the latest assistant turn that wants `stream: true`.
    React.useEffect(() => {
      const turn = SCRIPT[visible - 1];
      if (!turn || turn.from !== 'assistant' || !turn.stream) return;
      if (typed[turn.id] && typed[turn.id].length >= (turn.body || '').length) return;

      let i = (typed[turn.id] || '').length;
      const id = setInterval(() => {
        i = Math.min(i + 2, (turn.body || '').length);
        setTyped(prev => ({ ...prev, [turn.id]: (turn.body || '').slice(0, i) }));
        if (i >= (turn.body || '').length) clearInterval(id);
      }, 22);
      return () => clearInterval(id);
    }, [visible]);

    // Auto-scroll-on-new-turn. Page-level scroll, not a sized container.
    React.useEffect(() => {
      const el = threadRef.current;
      if (!el) return;
      const last = el.querySelector('.ai-bubble-row:last-of-type');
      if (last) last.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [visible, typed]);

    const renderBody = (turn) => {
      if (turn.from !== 'assistant' || !turn.stream) return turn.body;
      const t = typed[turn.id] || '';
      const isDone = t.length >= (turn.body || '').length;
      return (
        <>
          {t}
          {!isDone && <span className="caret" aria-hidden="true"/>}
        </>
      );
    };

    const Turn = ({ turn }) => {
      if (turn.attach === 'image') {
        return (
          <>
            <div className="ai-bubble-row from-user">
              <div className="ai-attach-image" role="img" aria-label="Attached image"/>
            </div>
            {turn.body && (
              <div className="ai-bubble-row from-user">
                <div className="ai-bubble">{turn.body}</div>
              </div>
            )}
          </>
        );
      }
      if (turn.attach === 'file') {
        return (
          <div className="ai-bubble-row from-user">
            <div className="ai-attach-file">
              <span className="ic"><Icons.paperclip size={13}/></span>
              <div className="meta">
                <span className="name">{turn.file.name}</span>
                <span className="kind">{turn.file.kind}</span>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className={'ai-bubble-row from-' + turn.from}>
          <div className="ai-bubble">{renderBody(turn)}</div>
          {turn.from === 'assistant' && turn.actions && (
            <div className="ai-bubble-actions">
              <button aria-label="Helpful"><Icons.check size={12}/></button>
              <button aria-label="Like"><Icons.arrowUp size={12}/></button>
              <button aria-label="Dislike" style={{ transform: 'rotate(180deg)' }}><Icons.arrowUp size={12}/></button>
            </div>
          )}
        </div>
      );
    };

    return (
      <AIShell
        activeNav="user-research"
        crumbs={['Design help', 'Typography discussion']}
      >
        <div className="ai-thread" ref={threadRef}>
          {SCRIPT.slice(0, visible).map(t => (
            <React.Fragment key={t.id}>
              <Turn turn={t}/>
            </React.Fragment>
          ))}
        </div>

        <div className="ai-thread-prompt">
          <AIPromptInput placeholder="How can I help you today?"/>
        </div>
      </AIShell>
    );
  };

  
  export default App;
