import React, { useState, useEffect, lazy, Suspense } from 'react';
import TechCoreFallback from './TechCoreFallback';

// Lazy-load the Three.js Canvas to isolate 3D bundle in its own chunk
const TechCoreCanvasInner = lazy(() => import('./TechCoreCanvasInner'));

function checkWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export function TechCoreCanvas({ className = '' }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [readyFor3D, setReadyFor3D] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setHasWebGL(checkWebGL());

    // Defer 3D canvas loading to idle callback so Hero text and critical UI paint first
    let idleId = null;
    let timerId = null;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(() => setReadyFor3D(true), { timeout: 1200 });
    } else {
      timerId = setTimeout(() => setReadyFor3D(true), 250);
    }

    // Screen width query (< 768px)
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mobileQuery.matches);
    const handleMobileChange = (e) => setIsMobile(e.matches);
    mobileQuery.addEventListener('change', handleMobileChange);

    // Reduced motion query
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
      mobileQuery.removeEventListener('change', handleMobileChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // SSR, before mount, WebGL unavailable, or before idle callback: render lightweight SVG fallback
  if (!isMounted || !hasWebGL || !readyFor3D) {
    return <TechCoreFallback className={className} />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Suspense fallback={<TechCoreFallback className="w-full h-full" />}>
        <TechCoreCanvasInner
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}

export default TechCoreCanvas;
