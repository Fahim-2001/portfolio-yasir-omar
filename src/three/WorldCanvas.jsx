import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { CanvasBoundary } from './CanvasBoundary';
import { supportsWebGL } from './webgl';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

// The world is decoration: its own lazy chunk, loaded once the page is idle.
const WorldCanvasInner = lazy(() => import('./WorldCanvasInner'));

const WAKE_EVENTS = ['pointermove', 'pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'];
const FALLBACK_MS = 5000;

/**
 * Fixed background layer for "The Stack". It is decoration, so it waits: it mounts
 * on the visitor's first interaction (or a few seconds after load for someone who
 * only looks), in idle time, and never competes with first paint or the hero.
 * Renders nothing without WebGL. Once its first frame is drawn it sets
 * `html.world-on`, which retires the CSS textures that stand in for it (hero dot
 * grid, Contact floor) and shows the viewport HUD.
 */
export function WorldCanvas() {
  const reduced = usePrefersReducedMotion();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!supportsWebGL()) return undefined;
    let idleId = null;
    let fallbackId = null;
    let started = false;

    const detach = () => WAKE_EVENTS.forEach((type) => window.removeEventListener(type, wake));
    function wake() {
      if (started) return;
      started = true;
      detach();
      if (fallbackId !== null) window.clearTimeout(fallbackId);
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(() => setCanRender(true), { timeout: 1200 });
      } else {
        setCanRender(true);
      }
    }
    const armFallback = () => {
      fallbackId = window.setTimeout(wake, FALLBACK_MS);
    };

    WAKE_EVENTS.forEach((type) => window.addEventListener(type, wake, { passive: true }));
    if (document.readyState === 'complete') armFallback();
    else window.addEventListener('load', armFallback, { once: true });

    return () => {
      detach();
      window.removeEventListener('load', armFallback);
      if (fallbackId !== null) window.clearTimeout(fallbackId);
      if (idleId !== null) window.cancelIdleCallback(idleId);
    };
  }, []);

  const handleFirstFrame = useCallback(() => document.documentElement.classList.add('world-on'), []);
  useEffect(() => () => document.documentElement.classList.remove('world-on'), []);

  return (
    <div aria-hidden="true" className="world-layer">
      {canRender && (
        <CanvasBoundary>
          <Suspense fallback={null}>
            <WorldCanvasInner reduced={reduced} onFirstFrame={handleFirstFrame} />
          </Suspense>
        </CanvasBoundary>
      )}
    </div>
  );
}

export default WorldCanvas;
