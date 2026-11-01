import { useCallback, useMemo, useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';
import { useFinePointer, usePrefersReducedMotion } from './useMediaQuery';

const SPRING = { stiffness: 210, damping: 22, mass: 0.6 };

/**
 * Pointer-driven 3D tilt. Exposes spring-smoothed rotateX / rotateY motion values
 * and writes --mx / --my (pointer position in %) onto the element for edge lights.
 * Disabled for touch input and when the user prefers reduced motion.
 */
export function usePointerTilt({ max = 6 } = {}) {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const rotateX = useTransform(sy, (v) => -v * max);
  const rotateY = useTransform(sx, (v) => v * max);

  const onPointerMove = useCallback(
    (event) => {
      const el = ref.current;
      if (!el || event.pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      px.set(x * 2 - 1);
      py.set(y * 2 - 1);
      el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    },
    [px, py]
  );

  const onPointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  const handlers = useMemo(
    () => (enabled ? { onPointerMove, onPointerLeave } : {}),
    [enabled, onPointerMove, onPointerLeave]
  );

  return { ref, enabled, rotateX, rotateY, px: sx, py: sy, handlers };
}

export default usePointerTilt;
