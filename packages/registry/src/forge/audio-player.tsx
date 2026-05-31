import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const fmtTime = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return m + ':' + (r < 10 ? '0' + r : r);
};

const SPEEDS = [1, 1.25, 1.5, 2, 0.75] as const;

interface AudioPlayerProps {
  /** Audio source URL. Passed directly to the underlying audio element. Use a data: URI for offline demos. */
  src: string;
  /** Optional label rendered above the time/scrubber row. Required when multiple players appear in the same surface. */
  title?: string;
  /** Secondary line shown below the title — typically author or episode info. */
  subtitle?: string;
  /** Artwork ReactNode (image, icon, gradient) shown on the leading edge when provided. */
  cover?: React.ReactNode;
  /** Known duration in seconds. Renders the total-time slot immediately, before audio metadata loads. Overwritten by the real duration on loadedmetadata. */
  duration?: number;
  /** 0..1 amplitude buckets — typically 60–120 values for a clean waveform. Replaces the plain scrubber track when provided. */
  peaks?: number[];
  /** Seconds to seek on the skip-back / skip-forward buttons. */
  skipSeconds?: number;
  /** Extra class names on the root wrapper div. */
  className?: string;
}

const AudioPlayer = ({
  src, title, subtitle, cover, duration: durProp, peaks,
  skipSeconds = 10, className,
}: AudioPlayerProps) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [t, setT] = React.useState(0);
  const [dur, setDur] = React.useState(durProp ?? 0);
  const [speedIdx, setSpeedIdx] = React.useState(0); // index into SPEEDS

  const toggle = () => {
    const el = audioRef.current; if (!el) return;
    if (el.paused) { el.play().catch(() => {}); setPlaying(true); }
    else { el.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const el = audioRef.current; if (!el) return;
    el.muted = !el.muted; setMuted(el.muted);
  };
  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    const el = audioRef.current; if (el) el.playbackRate = SPEEDS[next];
  };
  const skip = (delta: number) => {
    const el = audioRef.current; if (!el) return;
    const next = Math.max(0, Math.min(dur || 0, (el.currentTime || 0) + delta));
    el.currentTime = next; setT(next);
  };
  const onMeta = () => { const el = audioRef.current; if (el && isFinite(el.duration)) setDur(el.duration); };
  const onTime = () => { const el = audioRef.current; if (el) setT(el.currentTime); };
  const seekToFraction = (frac: number) => {
    const el = audioRef.current; if (!el) return;
    const next = Math.max(0, Math.min(dur || 0, frac * (dur || 0)));
    el.currentTime = next; setT(next);
  };
  const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = trackRef.current; if (!el || !dur) return;
    const r = el.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    seekToFraction(frac);
  };
  const onTrackKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); skip(-skipSeconds); }
    if (e.key === 'ArrowRight') { e.preventDefault(); skip( skipSeconds); }
    if (e.key === 'Home')       { e.preventDefault(); seekToFraction(0); }
    if (e.key === 'End')        { e.preventDefault(); seekToFraction(1); }
  };

  const pct = dur > 0 ? (t / dur) * 100 : 0;
  const speed = SPEEDS[speedIdx];

  return (
    <div className={'ai-audio' + (peaks ? ' has-peaks' : '') + (cover ? ' has-cover' : '') + (className ? ' ' + className : '')}>
      <audio
        ref={audioRef} src={src}
        onLoadedMetadata={onMeta} onTimeUpdate={onTime}
        onEnded={() => setPlaying(false)}
        preload="metadata"
      />

      {cover && <div className="ai-audio-cover" aria-hidden="true">{cover}</div>}

      <div className="ai-audio-controls">
        <button type="button" className="ai-audio-btn skip" onClick={() => skip(-skipSeconds)} aria-label={`Back ${skipSeconds} seconds`}>
          <Icons.skipBack size={14}/>
        </button>
        <button type="button" className="ai-audio-btn play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Icons.pause size={16}/> : <Icons.play size={16}/>}
        </button>
        <button type="button" className="ai-audio-btn skip" onClick={() => skip(skipSeconds)} aria-label={`Forward ${skipSeconds} seconds`}>
          <Icons.skipForward size={14}/>
        </button>
      </div>

      <div className="ai-audio-body">
        {(title || subtitle) && (
          <div className="ai-audio-meta">
            {title && <span className="ai-audio-title">{title}</span>}
            {subtitle && <span className="ai-audio-subtitle">{subtitle}</span>}
          </div>
        )}
        <div className="ai-audio-row">
          <span className="ai-audio-time">{fmtTime(t)}</span>
          <div
            ref={trackRef}
            className="ai-audio-track"
            style={{ ['--pct' as any]: pct + '%' }}
            onClick={onTrackClick}
            onKeyDown={onTrackKey}
            role="slider"
            aria-valuemin={0} aria-valuemax={dur || 100} aria-valuenow={Math.round(t)}
            aria-label="Audio scrubber"
            tabIndex={0}
          >
            {peaks && peaks.length > 0 ? (
              <div className="ai-audio-wave" aria-hidden="true">
                {peaks.map((v, i) => {
                  const onLeft = (i / peaks.length) * 100 < pct;
                  return (
                    <span
                      key={i}
                      className={'ai-audio-wave-bar' + (onLeft ? ' is-played' : '')}
                      style={{ height: `${Math.max(8, v * 100)}%` }}
                    />
                  );
                })}
              </div>
            ) : (
              <span className="ai-audio-track-bar" aria-hidden="true"/>
            )}
          </div>
          <span className="ai-audio-time">{fmtTime(dur)}</span>
        </div>
      </div>

      <button
        type="button"
        className="ai-audio-speed"
        onClick={cycleSpeed}
        aria-label={`Playback speed ${speed}x`}
        title="Playback speed"
      >
        {speed === 1 ? '1×' : `${speed}×`}
      </button>
      <button
        type="button"
        className="ai-audio-btn mute"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <Icons.volumeOff size={14}/> : <Icons.volume size={14}/>}
      </button>
    </div>
  );
};

export { AudioPlayer };
