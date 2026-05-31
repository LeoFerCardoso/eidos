'use client';
// Forge Mobile — Video Player. An inline video surface with a poster frame, a centre
// play/pause control, and a bottom control bar: play/pause, a scrubber with buffered
// and elapsed tracks, time labels, and a fullscreen button. Single ember accent on the
// elapsed fill — the play button itself is white/translucent so the accent stays singular.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, PropsTable, Alert, AlertTitle, AlertDescription } from '@/ds/core';

// ─── Utility ──────────────────────────────────────────────────────────────────
function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ─── Scrubber bar (elapsed in ember, buffered in dim, track in surface) ───────
function Scrubber({
  elapsed,
  buffered,
  duration,
  onSeek,
  rtl,
}: {
  elapsed: number;
  buffered: number;
  duration: number;
  onSeek?: (v: number) => void;
  rtl?: boolean;
}) {
  const elapsedPct = (elapsed / duration) * 100;
  const bufferedPct = (buffered / duration) * 100;
  const trackRef = React.useRef<HTMLDivElement>(null);

  const seek = React.useCallback(
    (v: number) => { if (onSeek) onSeek(Math.max(0, Math.min(duration, v))); },
    [onSeek, duration],
  );

  function handleClick(e: React.MouseEvent) {
    if (!onSeek || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (e.clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    // In RTL the inline-start is the right edge, so invert
    seek((rtl ? 1 - clamped : clamped) * duration);
  }

  // The slider's ARIA contract has to be keyboard-operable. In RTL the
  // inline-start (visual right) is the high end, so Arrow keys invert.
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!onSeek) return;
    const step = duration * 0.05; // 5% nudge
    const dir = rtl ? -1 : 1;
    switch (e.key) {
      case 'ArrowRight': seek(elapsed + 1 * dir); break;
      case 'ArrowLeft':  seek(elapsed - 1 * dir); break;
      case 'ArrowUp':    seek(elapsed + step); break;
      case 'ArrowDown':  seek(elapsed - step); break;
      case 'PageUp':     seek(elapsed + step); break;
      case 'PageDown':   seek(elapsed - step); break;
      case 'Home':       seek(0); break;
      case 'End':        seek(duration); break;
      default: return; // let other keys through
    }
    e.preventDefault();
  }

  return (
    <div
      ref={trackRef}
      className="focus-ring"
      role="slider"
      aria-label="Playback position"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={Math.round(elapsed)}
      aria-valuetext={`${fmt(elapsed)} of ${fmt(duration)}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        flex: 1,
        height: 3,
        borderRadius: 999,
        background: 'rgba(255,255,255,0.18)',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Buffered track */}
      <div
        style={{
          position: 'absolute',
          insetBlock: 0,
          insetInlineStart: 0,
          width: `${bufferedPct}%`,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.32)',
        }}
        aria-hidden="true"
      />
      {/* Elapsed fill — the single ember accent moment */}
      <div
        style={{
          position: 'absolute',
          insetBlock: 0,
          insetInlineStart: 0,
          width: `${elapsedPct}%`,
          borderRadius: 999,
          background: 'var(--accent)',
        }}
        aria-hidden="true"
      />
      {/* Thumb */}
      <div
        style={{
          position: 'absolute',
          insetBlock: '50%',
          insetInlineStart: `${elapsedPct}%`,
          transform: 'translate(-50%, -50%)',
          width: 12,
          height: 12,
          borderRadius: 999,
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Control bar ──────────────────────────────────────────────────────────────
function ControlBar({
  playing,
  elapsed,
  buffered,
  duration,
  onToggle,
  onSeek,
  onFullscreen,
  rtl,
}: {
  playing: boolean;
  elapsed: number;
  buffered: number;
  duration: number;
  onToggle: () => void;
  onSeek: (v: number) => void;
  onFullscreen: () => void;
  rtl?: boolean;
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
        padding: '24px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Scrubber row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.85)', lineHeight: 1, minWidth: 32, textAlign: 'center' }}>
          {fmt(elapsed)}
        </span>
        <Scrubber elapsed={elapsed} buffered={buffered} duration={duration} onSeek={onSeek} rtl={rtl} />
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)', lineHeight: 1, minWidth: 32, textAlign: 'center' }}>
          {fmt(duration)}
        </span>
      </div>
      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="focus-ring"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={onToggle}
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {playing ? <Icons.pause size={20} color="#fff" /> : <Icons.play size={20} color="#fff" />}
        </button>
        <button
          className="focus-ring"
          aria-label="Fullscreen"
          onClick={onFullscreen}
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <Icons.maximize size={18} color="rgba(255,255,255,0.8)" />
        </button>
      </div>
    </div>
  );
}

// ─── The player component ─────────────────────────────────────────────────────
function VideoPlayer({
  title,
  duration = 142,
  initialElapsed = 0,
  loading = false,
  error = false,
  onRetry,
  rtl = false,
}: {
  title?: string;
  duration?: number;
  initialElapsed?: number;
  loading?: boolean;
  /** Playback failed — replaces the surface with an inline danger Alert (role="alert"). */
  error?: boolean;
  onRetry?: () => void;
  rtl?: boolean;
}) {
  const [playing, setPlaying] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(initialElapsed);
  // The documented interaction: controls auto-hide 3s into playback and reappear
  // on any tap. We make the demo actually PERFORM it rather than just describe it.
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tick every second while playing
  React.useEffect(() => {
    if (playing && !loading && !error) {
      timerRef.current = setInterval(() => {
        setElapsed(e => {
          if (e >= duration) { setPlaying(false); return duration; }
          return e + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, loading, error, duration]);

  // Auto-hide controls 3s after playback starts; always visible when paused.
  React.useEffect(() => {
    if (hideRef.current) clearTimeout(hideRef.current);
    if (playing && controlsVisible) {
      hideRef.current = setTimeout(() => setControlsVisible(false), 3000);
    }
    return () => { if (hideRef.current) clearTimeout(hideRef.current); };
  }, [playing, controlsVisible]);

  // Any tap on the surface reveals controls (and resets the 3s timer above).
  const revealControls = React.useCallback(() => setControlsVisible(true), []);
  // When paused, controls are always shown.
  const showChrome = controlsVisible || !playing;

  const buffered = Math.min(duration, elapsed + duration * 0.28);

  return (
    <div
      dir={rtl ? 'rtl' : undefined}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        background: 'oklch(0.12 0.004 60)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
      role="region"
      aria-label={title ?? 'Video player'}
    >
      {/* Poster / backdrop gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, oklch(0.18 0.02 220) 0%, oklch(0.12 0.005 60) 60%)',
        }}
        aria-hidden="true"
      />
      {/* A subtle "scene" suggestion — horizontal lines */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', top: `${12 + i * 10}%`, insetInline: 0, height: 1, background: 'white' }} />
        ))}
      </div>

      {/* Error state — playback failed. An inline danger Alert announces via role="alert". */}
      {error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Alert tone="danger" style={{ maxWidth: 320 }}>
            <AlertTitle>Playback failed</AlertTitle>
            <AlertDescription>This clip couldn{"'"}t be decoded on this device. Retry, or open it in the source app.</AlertDescription>
            {onRetry && (
              <button type="button" className="btn sm focus-ring" onClick={onRetry} style={{ marginBlockStart: 10 }}>
                <Icons.refresh size={13} /> Retry
              </button>
            )}
          </Alert>
        </div>
      )}

      {/* Video icon in the centre of the poster */}
      {!loading && !error && !playing && (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.18 }}>
          <Icons.video size={40} color="white" />
        </div>
      )}

      {/* Loading spinner (reuse ds-spin; no per-page @keyframes) */}
      {loading && !error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Loading video">
          <div
            className="ds-spin"
            style={{ width: 28, height: 28, borderRadius: 999, border: '2.5px solid rgba(255,255,255,0.18)', borderTopColor: 'white' }}
            role="progressbar"
            aria-label="Buffering"
          />
        </div>
      )}

      {/* Centre play/pause hit area (large, always accessible). A tap also reveals
          the auto-hidden control bar (resetting the 3s fade timer). */}
      {!loading && !error && (
        <button
          className="focus-ring"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={() => { setPlaying(p => !p); revealControls(); }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 52,
              height: 52,
              borderRadius: 999,
              background: showChrome ? 'rgba(0,0,0,0.55)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `opacity 220ms var(--ease), transform 220ms var(--ease)`,
              opacity: !playing || showChrome ? 1 : 0,
              transform: showChrome ? 'scale(1)' : 'scale(0.85)',
            }}
          >
            {playing ? <Icons.pause size={22} color="#fff" /> : <Icons.play size={22} color="#fff" />}
          </div>
        </button>
      )}

      {/* Control bar — fades with the chrome 3s into playback, reappears on tap */}
      {!loading && !error && (
        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            bottom: 0,
            transition: `opacity 220ms var(--ease), transform 220ms var(--ease)`,
            opacity: showChrome ? 1 : 0,
            transform: showChrome ? 'translateY(0)' : 'translateY(6px)',
            pointerEvents: showChrome ? 'auto' : 'none',
          }}
        >
          <ControlBar
            playing={playing}
            elapsed={elapsed}
            buffered={buffered}
            duration={duration}
            onToggle={() => { setPlaying(p => !p); revealControls(); }}
            onSeek={v => { setElapsed(Math.round(v)); revealControls(); }}
            onFullscreen={() => {}}
            rtl={rtl}
          />
        </div>
      )}
    </div>
  );
}

// ─── DeviceFrame screen ────────────────────────────────────────────────────────
function VideoScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ height: 50, flex: '0 0 auto', display: 'flex', alignItems: 'center', paddingInline: 14, gap: 10, borderBlockEnd: '1px solid var(--border)' }}>
        <Icons.chevronLeft size={18} color="var(--fg-muted)" />
        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', flex: 1 }}>Incident Review · Jan 15</span>
        <Icons.share size={16} color="var(--fg-muted)" />
      </div>
      <div style={{ padding: '14px 14px 10px' }}>
        <VideoPlayer title="Incident replay · on-call-jan15.mp4" duration={142} initialElapsed={28} />
      </div>
      <div style={{ paddingInline: 14 }}>
        <div style={{ fontWeight: 650, fontSize: 'var(--text-sm)', marginBottom: 4 }}>on-call-jan15.mp4</div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Recorded during the Jan 15 incident bridge. Auto-archived to the runbook.</div>
        <div style={{ marginBlockStart: 10, fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-subtle)', letterSpacing: '0.04em' }}>2 MIN 22 SEC · 18.4 MB</div>
      </div>
    </div>
  );
}

export default function MobileVideoPlayer() {
  return (
    <Section
      id="video-player"
      num="01"
      title="Video Player"
      desc="An inline video surface with a poster frame, a centred play/pause control, and a bottom bar with a progress scrubber (elapsed in ember), time labels, and fullscreen. Covers the paused, playing (controls auto-fade), loading, and playback-failed states."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>The elapsed fill is the single ember accent moment — everything else in the control bar is white-on-dark. Keep the centre play target at ≥52px so it reliably activates with a thumb. Press play and the chrome fades after 3s; tap anywhere to bring it back.</Lede>
      <Frame label="tap play — controls fade after 3s · tap again to reveal · scrubber shows elapsed in ember / buffered in dim" center>
        <DeviceFrame initial="iphone-se"><VideoScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Frame label="Paused (poster) · Mid-playback · Loading/buffering · Playback failed">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '28px 24px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>Paused — poster frame visible</span>
            <VideoPlayer title="Paused state" duration={142} initialElapsed={0} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>Mid-playback — scrubber at 38%</span>
            <VideoPlayer title="Playing state" duration={142} initialElapsed={54} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>Loading / buffering</span>
            <VideoPlayer title="Loading state" duration={142} initialElapsed={0} loading />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>Error — playback failed (role=&quot;alert&quot;)</span>
            <VideoPlayer title="Error state" duration={142} initialElapsed={0} error onRetry={() => {}} />
          </div>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              {/* Poster area */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg, oklch(0.18 0.02 220) 0%, oklch(0.12 0.005 60) 60%)', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.video size={36} color="rgba(255,255,255,0.15)" />
                {/* Centre play */}
                <div style={{ position: 'absolute', width: 48, height: 48, borderRadius: 999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.play size={20} color="#fff" />
                </div>
                {/* Control bar */}
                <div style={{ position: 'absolute', insetInline: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)', padding: '20px 10px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* Scrubber */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.85)', minWidth: 30, textAlign: 'center' }}>0:28</span>
                    <div style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.18)', position: 'relative' }}>
                      <div style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '48%', borderRadius: 999, background: 'rgba(255,255,255,0.32)' }} />
                      <div style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '20%', borderRadius: 999, background: 'var(--accent)' }} />
                      <div style={{ position: 'absolute', top: '50%', insetInlineStart: '20%', transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: 999, background: '#fff' }} />
                    </div>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)', minWidth: 30, textAlign: 'center' }}>2:22</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icons.play size={18} color="#fff" />
                    </div>
                    <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icons.maximize size={15} color="rgba(255,255,255,0.7)" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Anatomy pins */}
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: '30%', left: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: '40%', left: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '20%', height: 18 }} />
              <span className="lead v" style={{ bottom: -22, left: '52%', height: 18 }} />
              <span className="lead h" style={{ bottom: '18%', right: -28, width: 24 }} />
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: '22%', left: -52 }}>2</div>
              <div className="pin" style={{ bottom: '33%', left: -52 }}>3</div>
              <div className="pin" style={{ bottom: -42, left: '20%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '52%', transform: 'translateX(-50%)' }}>5</div>
              <div className="pin" style={{ bottom: '10%', right: -52 }}>6</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Poster.</b> A static frame (or gradient placeholder) shown while paused. The video label and metadata sit below the player.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Centre play/pause.</b> ≥52px translucent pill — the primary affordance. Fades out after 3s of playback; a tap brings it back.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Gradient scrim.</b> A dark-to-transparent gradient over the bottom third so control bar text is legible against any poster.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Time labels.</b> Elapsed (bright) and duration (dim) in tabular mono — 11px in the control bar, large enough to read under thumb.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Scrubber.</b> Track (dim), buffered (medium), elapsed (ember) — fills from <Mono>insetInlineStart</Mono> so it inverts naturally in RTL.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Fullscreen.</b> ≥44px tap target anchored to the trailing edge of the bar.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard — scrubber</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 12, rowGap: 6, margin: 0 }}>
            <dt><Mono>Tab</Mono></dt><dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Move focus onto the scrubber (visible ring)</dd>
            <dt><Mono>{'←'} / {'→'}</Mono></dt><dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Seek &minus;1s / +1s (inverts under RTL)</dd>
            <dt><Mono>{'↓'} / {'↑'}</Mono></dt><dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Seek by &minus;5% / +5% of duration</dd>
            <dt><Mono>PgDn / PgUp</Mono></dt><dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Coarse seek &minus;5% / +5%</dd>
            <dt><Mono>Home / End</Mono></dt><dd style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Jump to 0:00 / the end</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Video controls — labelled</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Play/Pause and Fullscreen carry <Mono>aria-label</Mono>; the scrubber is <Mono>role="slider"</Mono> with <Mono>aria-valuemin/max/now/text</Mono> so VoiceOver announces "0:28 of 2:22".</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Captions &amp; transcript</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Closed-caption tracks should be served as WebVTT or SRT. A CC button in the control bar enables them; auto-captions should be offered for recorded meetings as a WCAG 2.1 AA baseline.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch target ≥ 44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Centre play: 52px; bar play/pause and fullscreen: 44px each. Scrubber thumb extends to a 44px vertical hit band on mobile — the 3px visual rail is not the touch target.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The buffering spinner uses the system <Mono>.ds-spin</Mono> utility — under <Mono>@media (prefers-reduced-motion: reduce)</Mono> the rotation becomes a gentle opacity pulse, so the loading state stays visible without spinning. The control-chrome auto-fade is opacity-only (no parallax or large translate), which is reduced-motion-safe.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — scrubber fills from the inline-start (right); play button and fullscreen swap sides'} center>
        <div style={{ padding: '24px', maxWidth: 360, margin: '0 auto', width: '100%' }}>
          <VideoPlayer title="RTL demo" duration={142} initialElapsed={54} rtl />
        </div>
      </Frame>
      <Lede>The scrubber uses <Mono>insetInlineStart: 0</Mono> as its fill origin, so in RTL the elapsed fill grows from the right — the natural reading direction for an Arabic audience. The play/pause button and fullscreen button reorder automatically via <Mono>flex</Mono> and <Mono>justify-content: space-between</Mono>. No <Mono>scaleX(-1)</Mono> is applied; logical CSS handles the mirroring.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — single ember moment on the scrubber</div>
          <div className="body" style={{ justifyContent: 'center', padding: '16px 12px' }}>
            <div style={{ width: '100%', maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.85)', minWidth: 30 }}>0:38</span>
                <div style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.18)', position: 'relative' }}>
                  <div style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '55%', borderRadius: 999, background: 'rgba(255,255,255,0.3)' }} />
                  <div style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '27%', borderRadius: 999, background: 'var(--accent)' }} />
                </div>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'rgba(255,255,255,0.55)', minWidth: 30 }}>2:22</span>
              </div>
            </div>
          </div>
          <div className="note">One ember line — the elapsed fill — anchors the eye. Everything else in the control bar is white-on-dark.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — ember play button and scrubber simultaneously</div>
          <div className="body" style={{ justifyContent: 'center', padding: '16px 12px' }}>
            <div style={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.play size={18} color="var(--ember-fg)" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.18)', position: 'relative' }}>
                  <div style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: '27%', borderRadius: 999, background: 'var(--accent)' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="note">Two ember elements at once exceeds the 2×/screen budget and dilutes the accent. Pick one ember moment per screen.</div>
        </div>
      </div>

      <SubHead meta="markup">Markup</SubHead>
      <CodeBlock
        label="video-player"
        lang="tsx"
        code={`<div role="region" aria-label="Incident replay · on-call-jan15.mp4">
  {/* Poster gradient — no real image needed for placeholder state */}
  <div className="m-video-poster" />

  {/* Centre play/pause — ≥52px, translucent on poster.
     Chrome auto-hides 3s after play starts; any tap reveals it again. */}
  <button aria-label={playing ? 'Pause' : 'Play'} className="m-video-playbtn"
    onClick={togglePlay}>
    {playing ? <Icons.pause /> : <Icons.play />}
  </button>

  {/* Bottom control bar — gradient scrim + scrubber + buttons */}
  <div className="m-video-bar">
    <span className="m-video-time">{fmt(elapsed)}</span>

    {/* role="slider" — keyboard-operable per its ARIA contract:
       ←/→ ±1s, ↑/↓ & PageUp/Down ±5%, Home/End to bounds */}
    <div role="slider"
      aria-label="Playback position"
      aria-valuemin={0} aria-valuemax={duration}
      aria-valuenow={Math.round(elapsed)}
      aria-valuetext={\`\${fmt(elapsed)} of \${fmt(duration)}\`}
      tabIndex={0}
      className="m-video-track focus-ring"
      onClick={handleSeek}
      onKeyDown={handleSliderKeys}>
      {/* buffered fill — rgba white */}
      <div className="m-video-buffered" style={{ width: \`\${bufferedPct}%\` }} />
      {/* elapsed fill — var(--accent); fills from insetInlineStart:0 (RTL-safe) */}
      <div className="m-video-elapsed" style={{ width: \`\${elapsedPct}%\` }} />
    </div>

    <span className="m-video-time dim">{fmt(duration)}</span>
    <button aria-label="Fullscreen" className="m-video-fullscreen">
      <Icons.maximize />
    </button>
  </div>
</div>

/* tokens: poster bg oklch(0.12); scrim linear-gradient dark→transparent;
   elapsed fill var(--accent); buffered rgba(255,255,255,0.32);
   play button min 52×52px; bar buttons min 44×44px;
   scrubber insetInlineStart:0 for RTL safety */`}
      />

      <SubHead meta="VideoPlayerProps">API reference</SubHead>
      <PropsTable
        label="<VideoPlayer />"
        rows={[
          { prop: 'title', type: 'string', default: '"Video player"', description: 'Accessible label for the region (aria-label) — use the clip name.' },
          { prop: 'duration', type: 'number', default: '142', description: 'Total length in seconds. Backs aria-valuemax and the duration label.' },
          { prop: 'initialElapsed', type: 'number', default: '0', description: 'Starting playhead position in seconds.' },
          { prop: 'loading', type: 'boolean', default: 'false', description: 'Show the buffering spinner (role="progressbar") and suppress controls until ready.' },
          { prop: 'error', type: 'boolean', default: 'false', description: 'Playback failed — replaces the surface with an inline danger Alert (role="alert").' },
          { prop: 'onRetry', type: '() => void', default: undefined, description: 'Retry handler — when set, the error Alert renders a Retry button.' },
          { prop: 'rtl', type: 'boolean', default: 'false', description: 'Right-to-left layout. The scrubber fill, seek math, and Arrow keys invert; no scaleX is used.' },
        ]}
      />
    </Section>
  );
}
