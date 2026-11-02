import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import OrbitFallback from './OrbitFallback';
import { CanvasBoundary } from './CanvasBoundary';
import { supportsWebGL } from './webgl';
import portfolioData from '../data/portfolio';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

// Three.js lives in its own lazy chunk so the hero text paints first.
const OrbitCanvasInner = lazy(() => import('./OrbitCanvasInner'));

const orbiting = [...(portfolioData.orbit?.inner ?? []), ...(portfolioData.orbit?.outer ?? [])];
const DESCRIPTION = `3D illustration: ${portfolioData.profile.name}'s avatar standing on a pedestal, with skills orbiting around it${
  orbiting.length ? ` (${orbiting.join(', ')})` : ''
}.`;

export function OrbitCanvas({ className = '', eventSource, progress }) {
  const reduced = usePrefersReducedMotion();
  const [canRender, setCanRender] = useState(false);
  const [painted, setPainted] = useState(false);
  const handleFirstFrame = useCallback(() => setPainted(true), []);

  useEffect(() => {
    if (!supportsWebGL()) return undefined;
    let idleId = null;
    let timerId = null;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => setCanRender(true), { timeout: 1500 });
    } else {
      timerId = window.setTimeout(() => setCanRender(true), 300);
    }
    return () => {
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timerId !== null) window.clearTimeout(timerId);
    };
  }, []);

  return (
    <div className={`relative ${className}`} role="img" aria-label={DESCRIPTION}>
      <OrbitFallback
        className={`absolute inset-0 transition-opacity duration-700 ${painted ? 'opacity-0' : 'opacity-100'}`}
      />
      {canRender && (
        <CanvasBoundary>
          <Suspense fallback={null}>
            <OrbitCanvasInner
              className={`absolute inset-0 transition-opacity duration-1000 ${painted ? 'opacity-100' : 'opacity-0'}`}
              eventSource={eventSource}
              progress={progress}
              reduced={reduced}
              onFirstFrame={handleFirstFrame}
            />
          </Suspense>
        </CanvasBoundary>
      )}
    </div>
  );
}

export default OrbitCanvas;
