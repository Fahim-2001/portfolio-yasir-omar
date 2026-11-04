import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform } from 'motion/react';
import { setSplashPhase, useSplashPhase } from '../hooks/useSplash';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

const EASE = [0.16, 1, 0.3, 1];
const EASE_IN_OUT = [0.65, 0, 0.35, 1];
const DOOR_EASE = [0.76, 0, 0.24, 1];

const COUNT_MS = 3000; // 000 → 100
const WELCOME_AT = 3150; // counter hands over to the welcome line
const OPEN_AT = 5600; // the screen splits
const DONE_AFTER_OPEN = 1350; // doors are fully apart
const REDUCED_HOLD = 1800; // reduced motion: welcome only, then fade

const WELCOME = 'Welcome to the world of';

/**
 * Opening sequence: a boot counter, then the welcome line assembles out of
 * exploded layers, then a seam is drawn across the middle and the screen parts
 * like two plates sliding off the page, up and down. The composition is rendered
 * once per half so the line itself is cut along the seam. `Esc` skips ahead.
 */
export function SplashScreen() {
  const phase = useSplashPhase();
  const reduced = usePrefersReducedMotion();
  const [stage, setStage] = useState(reduced ? 'welcome' : 'count');
  const opening = phase === 'opening';

  const progress = useMotionValue(0);
  const count = useTransform(progress, (v) => String(Math.round(v)).padStart(3, '0'));
  const fill = useTransform(progress, [0, 100], [0, 1]);

  const skip = useCallback(() => setSplashPhase('opening'), []);

  // Hold the page still underneath, from the top.
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  // Timeline
  useEffect(() => {
    if (opening) return undefined;
    if (reduced) {
      const hold = setTimeout(skip, REDUCED_HOLD);
      return () => clearTimeout(hold);
    }
    const controls = animate(progress, 100, { duration: COUNT_MS / 1000, ease: EASE_IN_OUT });
    const toWelcome = setTimeout(() => setStage('welcome'), WELCOME_AT);
    const toOpen = setTimeout(skip, OPEN_AT);
    return () => {
      controls.stop();
      clearTimeout(toWelcome);
      clearTimeout(toOpen);
    };
  }, [opening, reduced, progress, skip]);

  // Once the doors are apart, hand the page over.
  useEffect(() => {
    if (!opening) return undefined;
    const done = setTimeout(() => setSplashPhase('done'), reduced ? 520 : DONE_AFTER_OPEN);
    return () => clearTimeout(done);
  }, [opening, reduced]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skip]);

  const door = (side) => ({
    initial: false,
    animate: opening && !reduced ? { y: side === 'top' ? '-52%' : '52%' } : { y: '0%' },
    transition: { duration: 1, delay: 0.3, ease: DOOR_EASE },
  });

  return (
    <motion.div
      aria-hidden="true"
      className={`fixed inset-0 z-[58] ${opening ? 'pointer-events-none' : ''}`}
      initial={false}
      animate={{ opacity: opening && reduced ? 0 : 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {['top', 'bottom'].map((side) => (
        <motion.div
          key={side}
          className="absolute inset-0 overflow-hidden bg-bg will-change-transform"
          style={{ clipPath: side === 'top' ? 'inset(0 0 50% 0)' : 'inset(50% 0 0 0)' }}
          {...door(side)}
        >
          <Composition stage={stage} count={count} fill={fill} />

          {/* The cut edge of each half */}
          <motion.span
            className={`absolute inset-x-0 top-1/2 h-px bg-text ${side === 'top' ? '-translate-y-full' : ''}`}
            initial={false}
            animate={{ opacity: opening ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          />
        </motion.div>
      ))}

      {/* The seam is drawn across the middle before the halves part */}
      <motion.span
        className="pointer-events-none absolute left-0 top-1/2 h-px w-full origin-left -translate-y-1/2 bg-text"
        initial={false}
        animate={opening && !reduced ? { scaleX: [0, 1, 1], opacity: [1, 1, 0] } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.55, times: [0, 0.6, 1], ease: EASE_IN_OUT }}
      />
    </motion.div>
  );
}

/** One full-screen copy of the splash; the two halves each show one side of it. */
function Composition({ stage, count, fill }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-5">
      {/* Drafting paper */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_10%,transparent_100%)]" />

      <AnimatePresence mode="wait" initial={false}>
        {stage === 'count' ? (
          <motion.div
            key="count"
            className="flex flex-col items-center"
            exit={{ opacity: 0, y: -18, filter: 'blur(6px)', transition: { duration: 0.4, ease: EASE } }}
          >
            <div className="flex items-start font-mono font-semibold tabular-nums tracking-[-0.04em] text-text">
              <motion.span className="extrude text-[clamp(4.5rem,17vw,10rem)] leading-none">{count}</motion.span>
              <span className="mt-[0.6em] pl-1 text-lg text-text-muted sm:text-2xl">%</span>
            </div>
            <div className="mt-8 w-[min(320px,70vw)]">
              <div className="relative h-px w-full bg-border">
                <motion.div className="absolute inset-0 origin-left bg-text" style={{ scaleX: fill }} />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                <span>loading</span>
                <span>assembling stack</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="welcome" className="flex flex-col items-center text-center">
            {/* The line assembles: outlined layers collapse toward the solid face */}
            <motion.div
              className="relative isolate max-w-[92vw] text-balance text-[clamp(2.5rem,6.6vw,6.75rem)] font-black leading-[0.95] tracking-[-0.045em] text-text"
              initial={{ scale: 1.16 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.8, delay: 0.1, ease: EASE }}
            >
              <motion.span
                className="absolute inset-0 -z-10 text-transparent [-webkit-text-stroke:1px_var(--text)]"
                initial={{ x: '0.7em', y: '0.7em', opacity: 0 }}
                animate={{ x: '0.09em', y: '0.09em', opacity: 0.25 }}
                transition={{ duration: 1.3, delay: 0.2, ease: EASE }}
              >
                {WELCOME}
              </motion.span>
              <motion.span
                className="absolute inset-0 -z-10 text-transparent [-webkit-text-stroke:1px_var(--text)]"
                initial={{ x: '0.36em', y: '0.36em', opacity: 0 }}
                animate={{ x: '0.045em', y: '0.045em', opacity: 0.5 }}
                transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              >
                {WELCOME}
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, filter: 'blur(14px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.45, ease: EASE }}
              >
                {WELCOME}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SplashScreen;
