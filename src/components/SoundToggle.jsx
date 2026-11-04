import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

const TRACK = '/music/mask-off-orchestra.mp3';
const VOLUME = 0.6; // starting level; the hover slider adjusts it
const FADE_IN = 1.5; // seconds
const FADE_OUT = 0.4;

/**
 * Background music, off by default. Nothing is downloaded until the first click.
 * Playback fades in and out instead of cutting, and pauses while the tab is hidden.
 * Volume runs through a Web Audio gain node where available, because iOS ignores
 * `audio.volume`; elsewhere it falls back to the element's own volume.
 */
export function SoundToggle({ className = '' }) {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);
  const [volume, setVolume] = useState(VOLUME);
  const volumeRef = useRef(VOLUME);
  const [panel, setPanel] = useState(false);
  const closeTimer = useRef(0);
  const audioRef = useRef(null);
  const graphRef = useRef(null); // { ctx, gain } when Web Audio is available
  const fadeRef = useRef({ frame: 0, timer: 0 });

  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(TRACK);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      try {
        const ctx = new Ctx();
        const gain = ctx.createGain();
        gain.gain.value = 0;
        ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
        graphRef.current = { ctx, gain };
      } catch {
        graphRef.current = null;
      }
    }
    if (!graphRef.current) audio.volume = 0;
    return audio;
  };

  const cancelFade = () => {
    cancelAnimationFrame(fadeRef.current.frame);
    clearTimeout(fadeRef.current.timer);
  };

  // Ramp to `target` over `seconds`, then call `onDone`.
  const fadeTo = (target, seconds, onDone) => {
    cancelFade();
    const graph = graphRef.current;
    if (graph) {
      const { ctx, gain } = graph;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(target, now + seconds);
      if (onDone) fadeRef.current.timer = setTimeout(onDone, seconds * 1000);
      return;
    }
    const audio = audioRef.current;
    const from = audio.volume;
    const start = performance.now();
    const step = (time) => {
      const t = Math.min(1, (time - start) / (seconds * 1000));
      audio.volume = from + (target - from) * t;
      if (t < 1) fadeRef.current.frame = requestAnimationFrame(step);
      else onDone?.();
    };
    fadeRef.current.frame = requestAnimationFrame(step);
  };

  const start = () => {
    const audio = ensureAudio();
    graphRef.current?.ctx.resume();
    const playing = audio.play();
    fadeTo(volumeRef.current, FADE_IN);
    playing?.catch(() => {
      // Playback refused (e.g. no audio device): reflect it in the button.
      onRef.current = false;
      setOn(false);
    });
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, FADE_OUT, () => audio.pause());
  };

  const toggle = () => {
    const next = !onRef.current;
    onRef.current = next;
    setOn(next);
    if (next) start();
    else stop();
  };

  // Pause while the tab is hidden; pick up again on return if it was on.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || !onRef.current) return;
      if (document.hidden) {
        cancelFade();
        audio.pause();
        if (graphRef.current) graphRef.current.gain.gain.value = 0;
        else audio.volume = 0;
      } else {
        start();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
    // start() only touches refs, so the listener never needs to change.
  }, []);

  useEffect(
    () => () => {
      cancelFade();
      clearTimeout(closeTimer.current);
      audioRef.current?.pause();
      graphRef.current?.ctx.close();
    },
    []
  );

  // Drag the slider: follow it closely without zipper noise.
  const changeVolume = (event) => {
    const next = Number(event.target.value) / 100;
    volumeRef.current = next;
    setVolume(next);
    const audio = audioRef.current;
    if (!audio || !onRef.current) return;
    cancelFade();
    const graph = graphRef.current;
    if (graph) {
      const now = graph.ctx.currentTime;
      graph.gain.gain.cancelScheduledValues(now);
      graph.gain.gain.setTargetAtTime(next, now, 0.04);
    } else {
      audio.volume = next;
    }
  };

  // The slider opens on hover or keyboard focus, and only while the music plays.
  const showPanel = () => {
    clearTimeout(closeTimer.current);
    setPanel(true);
  };
  const hidePanel = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel(false), 180);
  };
  const open = on && panel;

  const label = on ? 'Turn music off' : 'Turn music on';
  const percent = Math.round(volume * 100);

  return (
    <div
      className={`flex flex-row-reverse items-center ${className}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && showPanel()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && hidePanel()}
      onFocus={showPanel}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) hidePanel();
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={label}
        title={label}
        className="key key--outline key--icon overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={on ? 'on' : 'off'}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: on ? -2 : 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            {on ? <Volume2 className="h-4 w-4" aria-hidden="true" /> : <VolumeX className="h-4 w-4" aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
  
        {/* Level meter: three monochrome bars while the music plays */}
        {on && (
          <span aria-hidden="true" className="sound-meter">
            <span />
            <span />
            <span />
          </span>
        )}
      </button>

      {/* Volume: padding (not margin) bridges the gap so the pointer can travel to it */}
      <motion.div
        className={`pr-2.5 ${open ? '' : 'pointer-events-none'}`}
        initial={{ opacity: 0, x: 10, visibility: 'hidden' }}
        animate={
          open
            ? { opacity: 1, x: 0, visibility: 'visible' }
            : { opacity: 0, x: 10, transitionEnd: { visibility: 'hidden' } }
        }
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex h-10 items-center gap-3 rounded-xl border border-border-strong bg-bg pl-3.5 pr-3 shadow-[0_3px_0_0_var(--key-side-soft)]">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={percent}
            onChange={changeVolume}
            aria-label="Music volume"
            aria-valuetext={`${percent}%`}
            tabIndex={open ? 0 : -1}
            className="volume-range w-24 sm:w-28"
            style={{ '--val': `${percent}%` }}
          />
          <span aria-hidden="true" className="w-7 text-right font-mono text-[11px] tabular-nums text-text-muted">
            {percent}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default SoundToggle;
