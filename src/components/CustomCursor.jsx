import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useCursor } from '../context/CursorContext';
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useMediaQuery';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary';
const SPRING = { damping: 30, stiffness: 380, mass: 0.45 };
const pad = (n) => String(Math.max(0, Math.round(n))).padStart(4, '0');

/**
 * CAD-style reticle that trails the native cursor with a live x/y readout.
 * The native cursor stays visible; this is an accent, never a replacement.
 * Mouse and trackpad only, and off for reduced-motion users.
 */
export function CustomCursor() {
  const { cursorType, cursorText } = useCursor();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const readout = useRef(null);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  useEffect(() => {
    if (!enabled) return undefined;
    let frame = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (event) => {
      if (event.pointerType === 'touch') return;
      lastX = event.clientX;
      lastY = event.clientY;
      x.set(lastX);
      y.set(lastY);
      setVisible(true);
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
      setInteractive(Boolean(target));
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (readout.current) readout.current.textContent = `x ${pad(lastX)}  y ${pad(lastY)}`;
        });
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const isView = cursorType === 'view';
  const ring = interactive ? 46 : 26;

  return (
    <>
      {/* Reticle: inverts whatever is beneath it, so it reads on both themes */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[60] mix-blend-difference"
        style={{ x: sx, y: sy, opacity: visible && !isView ? 1 : 0, transition: 'opacity 0.25s ease' }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
          initial={false}
          animate={{ width: ring, height: ring }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        >
          <span className="absolute -top-1.5 left-1/2 h-1.5 w-px -translate-x-1/2 bg-white" />
          <span className="absolute -bottom-1.5 left-1/2 h-1.5 w-px -translate-x-1/2 bg-white" />
          <span className="absolute -left-1.5 top-1/2 h-px w-1.5 -translate-y-1/2 bg-white" />
          <span className="absolute -right-1.5 top-1/2 h-px w-1.5 -translate-y-1/2 bg-white" />
        </motion.div>
        <span
          ref={readout}
          className="absolute left-5 top-4 whitespace-pre font-mono text-[10px] tracking-tight text-white"
          style={{ opacity: interactive ? 0 : 0.85, transition: 'opacity 0.2s ease' }}
        />
      </motion.div>

      {/* "View" bubble over project previews */}
      {isView && visible && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[60]"
          style={{ x: sx, y: sy }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-text font-mono text-[11px] font-semibold text-bg"
          >
            {cursorText || 'View ↗'}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default CustomCursor;
