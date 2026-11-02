import { SECTION_IDS } from '../../layout/navLinks';

/*
 * Scroll ↔ world.
 * Turns the page's scroll position into a fractional section index: 0 is the hero,
 * 7 is Contact. A section's waypoint is reached when its centre meets the viewport
 * centre, or where an in-page link lands it. A section taller than the viewport (the
 * pinned Skills prism, long timelines on phones) holds its waypoint for as long as
 * it fills the screen, so the camera only travels between sections and stands still
 * while you read.
 *
 * Lives outside React: the camera rig reads it every frame without a single re-render.
 */

export const rig = {
  progress: 0, // damped section index the camera is at
  explode: 0, // 0 → 1 with scroll speed: the stack pulls apart
  intro: 0, // 0 → 1 opening move
  time: 0, // ambient clock (stands still under reduced motion)
  flow: 0, // data clock: runs faster while scrolling
};

let ranges = [];
let frame = 0;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function measure() {
  frame = 0;
  const vh = window.innerHeight;
  const scrollY = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);

  const measured = SECTION_IDS.map((id, i) => {
    if (i === 0) return { start: 0, end: 0 };
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const top = rect.top + scrollY;
    const centred = top + rect.height / 2 - vh / 2;
    const slack = Math.max(0, rect.height - vh) / 2;
    // Where an in-page link (navbar, depth rail) lands, below the dock
    const landing = top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
    return {
      start: clamp(Math.min(landing, centred - slack), 0, max),
      end: clamp(Math.max(landing, centred + slack), 0, max),
    };
  });

  // Lazy sections that have not mounted yet take a place right after their neighbour.
  let previous = 0;
  ranges = measured.map((range, i) => {
    const start = Math.max(range?.start ?? previous, i === 0 ? 0 : previous + 1);
    const end = Math.max(range?.end ?? start, start);
    previous = end;
    return { start, end };
  });
}

function schedule() {
  if (!frame) frame = window.requestAnimationFrame(measure);
}

/** Fractional section index for a scroll position. */
export function progressAt(y) {
  const n = ranges.length;
  if (!n) return 0;
  for (let i = 0; i < n; i++) {
    const range = ranges[i];
    if (y <= range.end) {
      if (i === 0 || y >= range.start) return i;
      const from = ranges[i - 1].end;
      return i - 1 + (y - from) / Math.max(1, range.start - from);
    }
  }
  return n - 1;
}

/** Starts measuring section anchors. Returns a cleanup function. */
export function startRig() {
  measure();
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule);
  // Lazy sections mounting, images decoding and fonts swapping all change the layout.
  const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
  observer?.observe(document.body);

  return () => {
    window.removeEventListener('resize', schedule);
    window.removeEventListener('load', schedule);
    observer?.disconnect();
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };
}
