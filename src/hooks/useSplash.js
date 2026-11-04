import { useSyncExternalStore } from 'react';

/**
 * Shared splash-screen phase: 'intro' (counter + welcome) → 'opening' (the split)
 * → 'done'. The splash plays once per browser session; later loads start at 'done'.
 * The hero waits for 'opening' so its entrance plays as the doors part.
 */
const SEEN_KEY = 'splash-seen';

function readSeen() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

let phase = typeof window !== 'undefined' && !readSeen() ? 'intro' : 'done';
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSplashPhase(next) {
  if (phase === next) return;
  phase = next;
  if (next === 'done') {
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Storage blocked: the splash simply plays again next load.
    }
  }
  listeners.forEach((listener) => listener());
}

export function useSplashPhase() {
  return useSyncExternalStore(subscribe, () => phase, () => 'done');
}

export default useSplashPhase;
