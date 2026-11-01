import { useSyncExternalStore } from 'react';
import { SECTION_IDS } from '../layout/navLinks';

/*
 * One shared, rAF-throttled scroll listener decides which section is "active".
 * Measuring on scroll (instead of observing at mount) also picks up the
 * lazy-loaded sections that mount after the navbar.
 */

let active = SECTION_IDS[0];
let frame = 0;
const listeners = new Set();

function measure() {
  frame = 0;
  const line = window.innerHeight * 0.4;
  let current = SECTION_IDS[0];

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }

  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1];

  if (current !== active) {
    active = current;
    listeners.forEach((notify) => notify());
  }
}

function schedule() {
  if (!frame) frame = window.requestAnimationFrame(measure);
}

function subscribe(notify) {
  listeners.add(notify);
  if (listeners.size === 1) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
  schedule();

  return () => {
    listeners.delete(notify);
    if (listeners.size === 0) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

export function useActiveSection() {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => SECTION_IDS[0]
  );
}

export default useActiveSection;
