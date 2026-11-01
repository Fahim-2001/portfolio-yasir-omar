import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query and re-renders only when its match state flips.
 */
export function useMediaQuery(query, fallback = false) {
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = () =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia(query).matches
      : fallback;

  return useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** True for a mouse or trackpad: the only inputs that get hover tilt and the custom cursor. */
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

export default useMediaQuery;
