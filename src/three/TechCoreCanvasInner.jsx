import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import TechCore from './TechCore';

export default function TechCoreCanvasInner({
  isMobile,
  prefersReducedMotion,
  className = '',
}) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);

  // Pause rendering when canvas is scrolled offscreen
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const frameloopMode = !isInView
    ? 'never'
    : prefersReducedMotion
    ? 'demand'
    : 'always';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        frameloop={frameloopMode}
        className="w-full h-full"
        style={{ pointerEvents: isMobile ? 'none' : 'auto' }}
      >
        <TechCore
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
}
